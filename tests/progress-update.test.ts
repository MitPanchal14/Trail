import { expect, it } from "vitest";
import { currentSession, emptySnapshot, snapshotSchema } from "../lib/domain";
import { recoverSnapshot, transition } from "../lib/actions";
import { parseBackup, prepareBackup } from "../lib/backup";
import { mountainDetails } from "../lib/mountains";
const now = Date.parse("2026-10-20T12:00:00Z");
function fixture() {
  return transition(emptySnapshot(now), { type: "create", title: "Fictional garden", finishCondition: "Checked guide", action: "Draw a fern", minutes: 2 }, now);
}
const fields = { note: "Outline drawn; veins remain", returnStep: "Open the fern reference" };
it("saves selected action context without manufacturing a session or changing earned records", () => {
  const before = fixture(), task = before.subtasks[0];
  const after = transition(before, { type: "update-progress", id: task.id, expectedRevision: before.revision, ...fields }, now + 1000);
  expect(after.subtasks[0]).toEqual({ ...task, returnContext: fields });
  expect(after.sessions).toEqual(before.sessions);
  expect(after.completions).toEqual(before.completions);
  expect(after.summitConfirmations).toEqual(before.summitConfirmations);
  expect(after.dayPlans).toEqual(before.dayPlans);
  expect(after.selection).toEqual(before.selection);
  expect(after.mountains[0]).toEqual({ ...before.mountains[0], savedSubtaskId: task.id, savedAt: new Date(now + 1000).toISOString() });
  expect(before.subtasks[0]).not.toHaveProperty("returnContext");
});
it("prioritizes a context-only saved action on reload ahead of older sessions and today's plan", () => {
  let s = fixture();
  s = transition(s, { type: "start", minutes: 2 }, now);
  s = transition(s, { type: "save" }, now + 1000);
  s = transition(s, { type: "create", title: "Fictional second goal", finishCondition: "Checked", action: "Draw oak", minutes: 3 }, now + 2000);
  const id = s.subtasks[1].id;
  s = transition(s, { type: "update-progress", id, expectedRevision: s.revision, ...fields }, now + 3000);
  const reloaded = recoverSnapshot(snapshotSchema.parse(JSON.parse(JSON.stringify(s))), now + 86400000);
  expect(reloaded.selection).toEqual({ selectedMountainId: s.subtasks[1].mountainId, selectedSubtaskId: id, sessionId: null });
  expect(reloaded.sessions).toEqual(s.sessions);
});
it("keeps old saved/expired session accounting and history exactly unchanged while updating context", () => {
  for (const elapsed of [12000, 120000]) {
    let s = transition(fixture(), { type: "start", minutes: 2 }, now);
    s = transition(s, { type: "note", note: "Old note" }, now + elapsed);
    if (elapsed < 120000) s = transition(s, { type: "save" }, now + elapsed);
    const after = transition(s, { type: "update-progress", id: s.subtasks[0].id, expectedRevision: s.revision, ...fields }, now + 86400000);
    expect(after.subtasks[0].returnContext).toEqual(fields);
    expect(after.sessions).toEqual(s.sessions);
    expect(after.completions).toEqual(s.completions);
  }
});
it("carries the manual context into explicit Start/Resume/extend, then keeps later focus edits authoritative", () => {
  for (const existing of [false, true]) {
    let s = fixture();
    if (existing) { s = transition(s, { type: "start", minutes: 2 }, now); s = transition(s, { type: "save" }, now + 1000); }
    s = transition(s, { type: "update-progress", id: s.subtasks[0].id, expectedRevision: s.revision, ...fields }, now + 2000);
    s = transition(s, existing ? { type: "resume" } : { type: "start", minutes: 3 }, now + 86400000);
    expect(currentSession(s)).toMatchObject({ ...fields, status: "running", creditedMs: existing ? 1000 : 0 });
    expect(s.subtasks[0]).not.toHaveProperty("returnContext");
    s = transition(s, { type: "note", note: "New focus note" }, now + 86400000);
    s = transition(s, { type: "return-step", value: "New focus step" }, now + 86400000);
    s = transition(s, { type: "save" }, now + 86400000);
    expect(currentSession(recoverSnapshot(s))).toMatchObject({ note: "New focus note", returnStep: "New focus step" });
  }
  let expired = transition(fixture(), { type: "start", minutes: 2 }, now);
  expired = transition(expired, { type: "tick" }, now + 120000);
  expired = transition(expired, { type: "update-progress", id: expired.subtasks[0].id, expectedRevision: expired.revision, ...fields }, now + 130000);
  const extended = transition(expired, { type: "extend", minutes: 5 }, now + 86400000);
  expect(currentSession(extended)).toMatchObject({ ...fields, creditedMs: 120000, remainingMs: 300000, status: "running" });
});
it("rejects stale/wrong/archived/completed targets and running or paused focus without changes", () => {
  const s = fixture(), id = s.subtasks[0].id;
  const other = transition(s, { type: "create", title: "Other", finishCondition: "Checked", action: "Other action", minutes: 2 }, now);
  const archived = structuredClone(s); archived.subtasks[0].archivedAt = new Date(now).toISOString();
  const running = transition(s, { type: "start", minutes: 2 }, now);
  const variants = [other, archived, running, transition(running, { type: "pause" }, now), transition(s, { type: "complete" }, now)];
  for (const state of variants) expect(transition(state, { type: "update-progress", id, expectedRevision: state.revision, ...fields }, now)).toBe(state);
  expect(transition(s, { type: "update-progress", id: crypto.randomUUID(), expectedRevision: s.revision, ...fields }, now)).toBe(s);
  expect(transition(s, { type: "update-progress", id, expectedRevision: s.revision - 1, ...fields }, now)).toBe(s);
});
it("validates context lengths and preserves explicit empty fields", () => {
  const s = fixture(), id = s.subtasks[0].id;
  for (const value of [{ note: "x".repeat(2001), returnStep: "" }, { note: "", returnStep: "x".repeat(501) }])
    expect(() => transition(s, { type: "update-progress", id, expectedRevision: s.revision, ...value }, now)).toThrow();
  const cleared = transition(s, { type: "update-progress", id, expectedRevision: s.revision, note: "", returnStep: "" }, now);
  expect(cleared.subtasks[0].returnContext).toEqual({ note: "", returnStep: "" });
});
it("loads old backups unchanged and round trips context-only updates with no rewards or time", () => {
  const legacy = fixture();
  expect(parseBackup(JSON.stringify(legacy))).toEqual(legacy);
  const updated = transition(legacy, { type: "update-progress", id: legacy.subtasks[0].id, expectedRevision: legacy.revision, ...fields }, now);
  expect(prepareBackup(parseBackup(JSON.stringify(updated)), updated.revision + 1)).toEqual({ ...updated, revision: updated.revision + 1 });
});
it("starts the next accepted action with its saved context only after the explicit next-action command", () => {
  let s = fixture();
  const first = s.subtasks[0];
  s.subtasks.push({ ...first, id: crypto.randomUUID(), title: "Draw oak", checkpointSlot: s.mountains[0].nextCheckpointSlot++, orderKey: 1 });
  const second = s.subtasks[1];
  s = transition(s, { type: "select", id: second.id }, now);
  s = transition(s, { type: "update-progress", id: second.id, expectedRevision: s.revision, ...fields }, now + 1000);
  s = transition(s, { type: "select", id: first.id }, now + 2000);
  s = transition(s, { type: "complete" }, now + 2000);
  s = transition(s, { type: "start-next", id: second.id, minutes: 2 }, now + 3000);
  expect(currentSession(s)).toMatchObject({ subtaskId: second.id, ...fields, status: "running", creditedMs: 0 });
  expect(s.completions).toHaveLength(1);
});
it("Mountains uses the saved context-only action rather than an older saved session", () => {
  let s = transition(fixture(), { type: "start", minutes: 2 }, now);
  s = transition(s, { type: "save" }, now + 1000);
  s.subtasks.push({ ...s.subtasks[0], id: crypto.randomUUID(), title: "Draw oak", checkpointSlot: s.mountains[0].nextCheckpointSlot++, orderKey: 1 });
  const second = s.subtasks[1];
  s = transition(s, { type: "select", id: second.id }, now + 2000);
  s = transition(s, { type: "update-progress", id: second.id, expectedRevision: s.revision, ...fields }, now + 3000);
  const detail = mountainDetails(s, second.mountainId);
  expect(detail.next?.id).toBe(second.id);
  expect(detail.saved).toBeUndefined();
  expect(detail.context).toEqual(fields);
});
it("preserves historical completion context when a reopened action is updated and completed again", () => {
  let s = fixture();
  s = transition(s, { type: "start", minutes: 2 }, now);
  s = transition(s, { type: "note", note: "Historical note" }, now);
  s = transition(s, { type: "complete" }, now);
  s = transition(s, { type: "undo", id: s.completions[0].id }, now);
  const history = structuredClone(s.completions), sessions = structuredClone(s.sessions);
  s = transition(s, { type: "update-progress", id: s.subtasks[0].id, expectedRevision: s.revision, ...fields }, now + 1000);
  expect(s.sessions).toEqual(sessions); expect(s.completions).toEqual(history);
  s = transition(s, { type: "complete" }, now + 2000);
  expect(s.completions[0]).toEqual(history[0]);
  expect(s.completions[1].note).toBe(fields.note);
});
