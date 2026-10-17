import type { Snapshot } from "./domain";
/** Most recent active achievement, not the selected action or largest slot. */
export function earnedPosition(s: Snapshot, mountainId?: string): number | null {
  const completions = s.completions.filter(c => !c.undoneAt && s.subtasks.some(t => t.id === c.subtaskId && t.mountainId === mountainId));
  const latest = completions.sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt) || s.completions.indexOf(b) - s.completions.indexOf(a))[0];
  return latest ? s.subtasks.find(t => t.id === latest.subtaskId)!.checkpointSlot : null;
}
