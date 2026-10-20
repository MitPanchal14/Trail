import { activeCompletion, savedContext, type Snapshot } from "./domain";
export function mountainDetails(s: Snapshot, id: string) {
  const mountain = s.mountains.find(m => m.id === id)!;
  const tasks = s.subtasks.filter(t => t.mountainId === id);
  const ids = new Set(tasks.map(t => t.id));
  const actions = tasks.filter(t => !t.archivedAt).sort((a,b) => a.orderKey - b.orderKey);
  const acceptedIds = new Set(actions.map(t => t.id));
  const completions = s.completions.filter(c => !c.undoneAt && ids.has(c.subtaskId));
  const completedIds = new Set(completions.map(c => c.subtaskId));
  const latestSessions = new Map(s.sessions.map(x => [x.subtaskId, x]));
  const savedTime = (x: Snapshot["sessions"][number]) => mountain.savedSubtaskId === x.subtaskId ? mountain.savedAt ?? x.lastHeartbeatAt : x.lastHeartbeatAt;
  let saved: Snapshot["sessions"][number] | undefined = [...latestSessions.values()].filter(x => acceptedIds.has(x.subtaskId) && !completedIds.has(x.subtaskId) && x.status !== "completed").sort((a,b) => Date.parse(savedTime(b)) - Date.parse(savedTime(a)))[0];
  const updated = actions.find(t => t.id === mountain.savedSubtaskId && t.returnContext && !completedIds.has(t.id));
  const contextWins = updated && mountain.savedAt && (!saved || Date.parse(mountain.savedAt) >= Date.parse(savedTime(saved)));
  const next = contextWins ? updated : actions.find(t => t.id === saved?.subtaskId) ?? actions.find(t => !activeCompletion(s, t.id));
  if (contextWins) { saved = latestSessions.get(updated.id); if (saved?.status === "completed") saved = undefined; }
  const context = next && (next.returnContext || saved) ? savedContext(s, next.id) : undefined;
  const history = s.summitConfirmations.some(c => c.mountainId === id && !c.revokedAt);
  const pending = actions.length > 0 && actions.every(t => activeCompletion(s, t.id)) && mountain.status !== "completed";
  const status = mountain.status === "completed" ? "Goal confirmed complete" : mountain.status === "reopened" ? "Reopened" : pending ? "All actions done · goal unconfirmed" : "In progress";
  return { mountain, actions, completions, saved, context, next, history, pending, status };
}
