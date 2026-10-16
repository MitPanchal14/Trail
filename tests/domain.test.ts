import { describe, it, expect } from "vitest";
import {
  emptySnapshot,
  currentSession,
  snapshotSchema,
  activeCompletion,
} from "../lib/domain";
import { transition, recoverSnapshot } from "../lib/actions";
import { loadSnapshot, saveSnapshot, STORAGE_KEY } from "../lib/storage";
import { checkpointPosition } from "../lib/terrain";
const now = Date.parse("2026-10-15T12:00:00Z");
function working(minutes = 1) {
  return transition(
    transition(
      emptySnapshot(now),
      {
        type: "create",
        title: "Test mountain",
        finishCondition: "A checked draft",
        action: "Write a paragraph",
        minutes,
      },
      now,
    ),
    { type: "start", minutes },
    now,
  );
}
describe("work timer and completion domain", () => {
  it("expires without earning a completion or summit", () => {
    const s = transition(working(), { type: "tick" }, now + 70000);
    expect(currentSession(s)).toMatchObject({
      remainingMs: 0,
      creditedMs: 60000,
      status: "expired",
    });
    expect(s.completions).toEqual([]);
    expect(s.summitConfirmations).toEqual([]);
    expect(s.mountains[0].status).toBe("active");
  });
  it("pauses, resumes and credits each segment once", () => {
    let s = transition(working(), { type: "pause" }, now + 10000);
    s = transition(s, { type: "tick" }, now + 30000);
    expect(currentSession(s)?.creditedMs).toBe(10000);
    s = transition(s, { type: "resume" }, now + 40000);
    s = transition(s, { type: "tick" }, now + 45000);
    expect(currentSession(s)).toMatchObject({
      creditedMs: 15000,
      remainingMs: 45000,
    });
  });
  it("extends without recounting time and repeated ticks do not double credit", () => {
    let s = transition(working(), { type: "extend", minutes: 5 }, now + 10000);
    s = transition(s, { type: "tick" }, now + 20000);
    s = transition(s, { type: "tick" }, now + 20000);
    expect(currentSession(s)).toMatchObject({
      creditedMs: 20000,
      remainingMs: 340000,
    });
  });
  it("recovers running snapshots without crediting the absence and requires Resume", () => {
    let s = transition(working(), { type: "tick" }, now + 12000);
    s = recoverSnapshot(snapshotSchema.parse(JSON.parse(JSON.stringify(s))));
    s = transition(s, { type: "tick" }, now + 86400000);
    expect(currentSession(s)).toMatchObject({
      status: "interrupted",
      remainingMs: 48000,
      creditedMs: 12000,
    });
    s = transition(s, { type: "resume" }, now + 86400000);
    s = transition(s, { type: "tick" }, now + 86401000);
    expect(currentSession(s)?.creditedMs).toBe(13000);
  });
  it("completion is idempotent; Undo preserves history and can earn once again", () => {
    let s = transition(working(), { type: "complete" }, now + 10000);
    s = transition(s, { type: "complete" }, now + 11000);
    expect(s.completions).toHaveLength(1);
    const id = s.completions[0].id;
    s = transition(s, { type: "undo", id }, now + 12000);
    expect(activeCompletion(s, s.subtasks[0].id)).toBeUndefined();
    expect(currentSession(s)?.creditedMs).toBe(10000);
    s = transition(s, { type: "start", minutes: 1 }, now + 13000);
    s = transition(s, { type: "complete" }, now + 14000);
    expect(s.completions.filter((x) => !x.undoneAt)).toHaveLength(1);
    // Undo restores the original unfinished commitment; Start resumes it.
    expect(s.sessions).toHaveLength(1);
    expect(() => snapshotSchema.parse(s)).not.toThrow();
  });
  it("Undo only removes the intended achievement", () => {
    let s = transition(working(), { type: "complete" }, now);
    const first = s.completions[0].id;
    s = transition(
      s,
      {
        type: "create",
        title: "Other",
        finishCondition: "Done",
        action: "Other step",
        minutes: 1,
      },
      now,
    );
    s = transition(s, { type: "complete" }, now);
    s = transition(s, { type: "undo", id: first }, now);
    expect(s.completions.filter((x) => !x.undoneAt)).toHaveLength(1);
    expect(s.completions[1].undoneAt).toBeNull();
  });
  it("stable slots and seeded terrain positions survive reorder and Undo", () => {
    let s = working();
    s.subtasks.push({
      ...s.subtasks[0],
      id: crypto.randomUUID(),
      title: "Second action",
      checkpointSlot: 1,
      orderKey: 1,
    });
    s.mountains[0].nextCheckpointSlot = 2;
    const otherPosition = checkpointPosition(s.subtasks[1].checkpointSlot);
    const pos = checkpointPosition(s.subtasks[0].checkpointSlot),
      seed = s.mountains[0].terrainSeed;
    s = transition(s, { type: "complete" }, now);
    s.subtasks[0].orderKey = 99;
    s = transition(s, { type: "undo", id: s.completions[0].id }, now);
    expect(checkpointPosition(s.subtasks[0].checkpointSlot)).toEqual(pos);
    expect(s.mountains[0].terrainSeed).toBe(seed);
    s.subtasks.reverse();
    expect(
      checkpointPosition(
        s.subtasks.find((t) => t.title === "Second action")!.checkpointSlot,
      ),
    ).toEqual(otherPosition);
    expect(() => snapshotSchema.parse(s)).not.toThrow();
    expect(checkpointPosition(0)).toEqual([18, 43]);
  });
  it("rejects backward/oversized clock gaps conservatively", () => {
    expect(
      currentSession(transition(working(), { type: "tick" }, now - 1)),
    ).toMatchObject({ status: "interrupted", creditedMs: 0 });
    expect(
      currentSession(transition(working(), { type: "tick" }, now + 86400001)),
    ).toMatchObject({ status: "interrupted", creditedMs: 0 });
  });
  it("splits real open-tab time at local midnight", () => {
    const start = Date.parse("2026-10-15T23:59:50Z");
    let s = working();
    s.calendarTimeZone = "UTC";
    const x = currentSession(s)!;
    x.lastAccountedAt = new Date(start).toISOString();
    s = transition(s, { type: "tick" }, start + 20000);
    expect(currentSession(s)?.dailyElapsed).toEqual({
      "2026-10-15": 10000,
      "2026-10-16": 10000,
    });
  });
  it("rejects invalid duration and malformed relationships", () => {
    expect(() => working(0)).toThrow();
    const s = working();
    s.subtasks[0].mountainId = crypto.randomUUID();
    expect(snapshotSchema.safeParse(s).success).toBe(false);
  });
});
describe("durable storage boundaries", () => {
  it("returns to the latest saved unfinished action, not an arbitrary last selection", () => {
    let s = transition(working(), { type: "save" }, now + 1000);
    const saved = s.selection.selectedSubtaskId;
    s = transition(
      s,
      {
        type: "create",
        title: "Another mountain",
        finishCondition: "Done",
        action: "Another action",
        minutes: 2,
      },
      now + 2000,
    );
    expect(recoverSnapshot(s).selection.selectedSubtaskId).toBe(saved);
  });
  it("round-trips a validated snapshot", () => {
    let data = "";
    expect(
      saveSnapshot(
        {
          setItem: (key, value) => {
            expect(key).toBe(STORAGE_KEY);
            data = value;
          },
        },
        working(),
      ),
    ).toBe("");
    expect(
      currentSession(loadSnapshot({ getItem: () => data }).snapshot)?.status,
    ).toBe("interrupted");
  });
  it("retains corrupt raw data and reports failures without writing", () => {
    const raw = "{bad";
    const result = loadSnapshot({ getItem: () => raw });
    expect(result).toMatchObject({ raw, blocked: true });
    expect(result.warning).toContain("not been overwritten");
    expect(
      saveSnapshot(
        {
          setItem: () => {
            throw Error("Quota");
          },
        },
        working(),
      ),
    ).toContain("Not saved");
    expect(
      loadSnapshot({
        getItem: () => {
          throw Error("Denied");
        },
      }).blocked,
    ).toBe(true);
  });
});
