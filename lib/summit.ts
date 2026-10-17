import { activeCompletion, type Snapshot } from "./domain";
export type SummitAction =
  | { type: "confirm-summit"; mountainId: string }
  | { type: "reopen-goal"; mountainId: string }
  | { type: "correct-summit"; id: string };

export function applySummit(s: Snapshot, action: SummitAction, now: number) {
  const stamp = new Date(now).toISOString();
  if (s.sessions.some(x => x.status === "running" || x.status === "paused")) throw Error("Save your place before changing goal completion.");
  if (action.type === "correct-summit") {
    const c = s.summitConfirmations.find(c => c.id === action.id);
    if (!c || c.revokedAt) return;
    const latest = s.summitConfirmations.findLast(x => x.mountainId === c.mountainId && !x.revokedAt);
    c.revokedAt = stamp;
    if (latest?.id === c.id) s.mountains.find(m => m.id === c.mountainId)!.status = "reopened";
    return;
  }
  const m = s.mountains.find(m => m.id === action.mountainId);
  if (!m) throw Error("Choose a known mountain.");
  if (action.type === "reopen-goal") {
    if (m.status === "completed") m.status = "reopened";
    return;
  }
  if (m.status === "completed") return;
  const tasks = s.subtasks.filter(t => t.mountainId === m.id && !t.archivedAt);
  if (!tasks.length || tasks.some(t => !activeCompletion(s, t.id))) throw Error("Complete the accepted steps before confirming the finish condition.");
  s.summitConfirmations.push({ id: crypto.randomUUID(), mountainId: m.id, confirmedAt: stamp,
    relatedCompletionIds: tasks.map(t => activeCompletion(s, t.id)!.id), revokedAt: null });
  m.status = "completed";
}
