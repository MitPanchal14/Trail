import { activeCompletion, type Snapshot } from "./domain";
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
  const saved = [...latestSessions.values()].filter(x => acceptedIds.has(x.subtaskId) && !completedIds.has(x.subtaskId) && x.status !== "completed").sort((a,b) => Date.parse(savedTime(b)) - Date.parse(savedTime(a)))[0];
  const next = actions.find(t => t.id === saved?.subtaskId) ?? actions.find(t => !activeCompletion(s, t.id));
  const history = s.summitConfirmations.some(c => c.mountainId === id && !c.revokedAt);
  const pending = actions.length > 0 && actions.every(t => activeCompletion(s, t.id)) && mountain.status !== "completed";
  const status = mountain.status === "completed" ? "Goal confirmed complete" : mountain.status === "reopened" ? "Reopened" : pending ? "All actions done · goal unconfirmed" : "In progress";
  return { mountain, actions, completions, saved, next, history, pending, status };
}
