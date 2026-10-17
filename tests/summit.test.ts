import { it, expect } from "vitest";
import { transition } from "../lib/actions";
import { emptySnapshot, snapshotSchema, type Snapshot } from "../lib/domain";
import { loadSnapshot } from "../lib/storage";
import { checkpointPosition, climberPosition } from "../lib/terrain";
import { newDraft } from "../lib/planning";

function finished(count = 3) {
  let s = transition(emptySnapshot(), { type: "create", title: "Fictional guide", finishCondition: "Reviewed illustrations", action: "Draw 1", minutes: 1 });
  const first = s.subtasks[0];
  for (let i = 1; i < count; i++) s.subtasks.push({ ...first, id: crypto.randomUUID(), title: `Draw ${i + 1}`, orderKey: i, checkpointSlot: i });
  s.mountains[0].nextCheckpointSlot = count;
  for (const t of s.subtasks) {
    s = transition(s, { type: "start-next", id: t.id, minutes: 1 });
    s = transition(s, { type: "complete" });
  }
  return s;
}
function confirm(s: Snapshot) { return transition(s, { type: "confirm-summit", mountainId: s.mountains[0].id }); }

it("requires all accepted actions and explicit confirmation; existing v1 empty history loads without inventing credit", () => {
  let s = finished();
  expect(s.mountains[0].status).toBe("active");
  expect(s.summitConfirmations).toEqual([]);
  expect(loadSnapshot({ getItem: () => JSON.stringify(s) }).snapshot.summitConfirmations).toEqual([]);
  const incomplete = transition(s, { type: "undo", id: s.completions[0].id });
  expect(() => confirm(incomplete)).toThrow(/Complete the accepted/);
  s = confirm(s);
  expect(s.mountains[0].status).toBe("completed");
  expect(s.summitConfirmations[0].relatedCompletionIds).toEqual(s.completions.map(c => c.id));
  expect(confirm(s).summitConfirmations).toEqual(s.summitConfirmations);
  expect(snapshotSchema.parse(s)).toEqual(s);
  expect(loadSnapshot({ getItem: () => JSON.stringify(s) }).snapshot.mountains[0].status).toBe("completed");
});

it("reopen keeps historical achievement; correction revokes only the chosen confirmation and keeps checkpoints", () => {
  let s = confirm(finished(1));
  const achievement = structuredClone(s.summitConfirmations[0]);
  s = transition(s, { type: "reopen-goal", mountainId: s.mountains[0].id });
  expect(s.mountains[0].status).toBe("reopened");
  expect(s.summitConfirmations[0]).toEqual(achievement);
  s = confirm(s);
  expect(s.summitConfirmations).toHaveLength(2);
  s = transition(s, { type: "correct-summit", id: s.summitConfirmations[1].id });
  expect(s.summitConfirmations[0].revokedAt).toBeNull();
  expect(s.completions.every(c => !c.undoneAt)).toBe(true);
  s = transition(s, { type: "correct-summit", id: achievement.id });
  expect(s.summitConfirmations.every(c => c.revokedAt)).toBe(true);
  expect(snapshotSchema.safeParse(s).success).toBe(true);
});

it("linked Undo requires a choice, can retain genuine summit or correct mistaken summit, and is idempotent", () => {
  const s = confirm(finished());
  const id = s.completions[1].id;
  expect(() => transition(s, { type: "undo", id })).toThrow(/Choose whether/);
  const keep = transition(s, { type: "undo", id, correctSummit: false });
  expect(keep.summitConfirmations[0].revokedAt).toBeNull();
  expect(keep.mountains[0].status).toBe("completed");
  expect(snapshotSchema.safeParse(keep).success).toBe(true);
  const correct = transition(s, { type: "undo", id, correctSummit: true });
  expect(correct.summitConfirmations[0].revokedAt).not.toBeNull();
  expect(correct.mountains[0].status).toBe("reopened");
  expect(correct.completions.filter(c => !c.undoneAt)).toHaveLength(2);
  expect(transition(correct, { type: "undo", id, correctSummit: true }).completions).toEqual(correct.completions);
});

it("more than eleven slots keep their fixed geometry; accepting revised work reopens without revoking history", () => {
  let s = confirm(finished(14));
  const slots = s.subtasks.map(t => [t.id, t.checkpointSlot, checkpointPosition(t.checkpointSlot)]);
  s.creationDraft = { ...newDraft(), editingMountainId: s.mountains[0].id, goal: s.mountains[0].title, finishCondition: s.mountains[0].finishCondition,
    steps: s.subtasks.toReversed().map(t => ({ key: crypto.randomUUID(), existingId: t.id, title: t.title, nextAction: t.nextAction, suggestedMinutes: t.suggestedMinutes })) };
  s = transition(s, { type: "accept", draftId: s.creationDraft.id });
  expect(s.mountains[0].status).toBe("reopened");
  expect(s.summitConfirmations[0].revokedAt).toBeNull();
  expect(s.subtasks.map(t => [t.id, t.checkpointSlot, checkpointPosition(t.checkpointSlot)])).toEqual(slots);
  expect(climberPosition("summit")).not.toEqual(climberPosition(0));
  expect(climberPosition("summit")[1]).toBeLessThan(climberPosition(0)[1]);
});

it("rejects forged summit references, duplicate IDs and completed status without history", () => {
  const s = confirm(finished());
  const bad = structuredClone(s);
  bad.summitConfirmations[0].relatedCompletionIds = [crypto.randomUUID()];
  expect(snapshotSchema.safeParse(bad).success).toBe(false);
  const raw = JSON.stringify(bad);
  const quarantined = loadSnapshot({ getItem: () => raw });
  expect(quarantined.blocked).toBe(true);
  expect(quarantined.raw).toBe(raw);
  bad.summitConfirmations = [s.summitConfirmations[0], s.summitConfirmations[0]];
  expect(snapshotSchema.safeParse(bad).success).toBe(false);
  bad.summitConfirmations = [];
  expect(snapshotSchema.safeParse(bad).success).toBe(false);
  const legacy = finished();
  legacy.creationDraft = { ...newDraft(), goal: "Retained", steps: [{ key: crypto.randomUUID(), existingId: null, title: "Draft", nextAction: "Draw", suggestedMinutes: 20, minutesText: "" }] };
  expect(snapshotSchema.parse(legacy).creationDraft?.steps[0].minutesText).toBe("");
  expect(() => transition(legacy, { type: "accept", draftId: legacy.creationDraft!.id })).toThrow();
});
