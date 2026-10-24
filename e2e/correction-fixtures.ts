import { emptySnapshot, type Snapshot } from "../lib/domain";
import { transition } from "../lib/actions";

export const correctionNow = Date.parse("2026-10-20T12:00:00Z");
export const correctionStep = "Open the PDF at the section where you stopped, read the remaining two pages, then attempt the first practice question and compare your answer with the worked example.";
export const correctionNote = "The first example is checked. Two pages and the first practice question remain.";
export const correctionKey = "work-trail:snapshot:v1";
export type CorrectionState = "ready" | "returning" | "update" | "focus" | "middle" | "final";
export function correctionFixture(state: CorrectionState): Snapshot {
  let s = transition(emptySnapshot(correctionNow), { type: "create", title: "Fictional mechanics review", finishCondition: "Three practice answers checked against the worked examples", action: "Read the remaining section", minutes: 15 }, correctionNow);
  s.calendarTimeZone = "UTC";
  s.subtasks[0].nextAction = "Read the next two pages and mark the example to practise.";
  for (const [title, nextAction] of [["Try the first practice question", correctionStep], ["Check the three answers", "Compare each answer with the worked examples and correct the missed steps."]])
    s.subtasks.push({ ...s.subtasks[0], id: crypto.randomUUID(), title, nextAction, checkpointSlot: s.mountains[0].nextCheckpointSlot++, orderKey: s.subtasks.length });
  if (["returning", "update"].includes(state)) s = transition(s, { type: "update-progress", id: s.subtasks[0].id, expectedRevision: s.revision, note: correctionNote, returnStep: correctionStep }, correctionNow + 1000);
  if (["middle", "final"].includes(state)) {
    s = transition(s, { type: "start", minutes: 15 }, correctionNow);
    s = transition(s, { type: "complete" }, correctionNow + 18000);
    if (state === "final") for (const task of s.subtasks.slice(1)) {
      s = transition(s, { type: "start-next", id: task.id, minutes: 15 }, correctionNow + 20000);
      s = transition(s, { type: "complete" }, correctionNow + 38000);
    }
  }
  const ids = [...s.mountains, ...s.subtasks, ...s.sessions, ...s.completions].map(x => x.id);
  let raw = JSON.stringify(s);
  ids.forEach((id, i) => { raw = raw.replaceAll(id, `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`); });
  return JSON.parse(raw);
}
