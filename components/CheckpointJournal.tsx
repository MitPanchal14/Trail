import type { Snapshot } from "@/lib/domain";

export function recordedDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  if (!seconds) return "";
  if (seconds < 60) return `${seconds}s recorded`;
  const minutes = Math.floor(seconds / 60);
  return minutes < 60 ? `${minutes}m ${seconds % 60}s recorded` : `${Math.floor(minutes / 60)}h ${minutes % 60}m recorded`;
}

export default function CheckpointJournal({ snapshot: s, mountainId, mountainOnly = false, disabled, onUndo, onReturn }: {
  snapshot: Snapshot; mountainId?: string; mountainOnly?: boolean; disabled: boolean; onUndo: (id: string) => void; onReturn: (id: string) => void;
}) {
  const entries = s.completions.filter(c => !c.undoneAt && s.subtasks.some(t => t.id === c.subtaskId && t.mountainId === mountainId))
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt) || s.completions.indexOf(b) - s.completions.indexOf(a));
  const corrections = s.completions.filter(c => c.undoneAt && (!mountainOnly || s.subtasks.some(t => t.id === c.subtaskId && t.mountainId === mountainId))).sort((a,b) => Date.parse(b.undoneAt!) - Date.parse(a.undoneAt!));
  if (!entries.length && !corrections.length) return null;
  return <section className="checkpoint-journal" aria-label="Recorded checkpoint details">
    <header><h2>Your checkpoints</h2><p>{entries.length} earned</p></header>
    <ol>{entries.map((c, i) => {
      const duration = recordedDuration(s.sessions.filter(x => c.sessionIds.includes(x.id)).reduce((sum, x) => sum + x.creditedMs, 0));
      return <li key={c.id} className={i === 0 ? "latest-checkpoint" : ""}>
        <article>
          <h3>{s.subtasks.find(t => t.id === c.subtaskId)?.title}</h3>
           <p className="checkpoint-meta">Completed · <time dateTime={c.completedAt}>{new Date(c.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</time>{duration ? ` · ${duration}` : mountainOnly ? " · No focus time recorded" : ""} {i === 0 && <span className="latest-label">Latest</span>}</p>
          <details><summary>Context and options</summary>
            <p>{new Date(c.completedAt).toLocaleString()} · {c.localDate} ({c.calendarTimeZone})</p>
            {c.note.trim() && <p className="journal-note">{c.note}</p>}
            {s.sessions.filter(x => c.sessionIds.includes(x.id) && x.returnStep.trim()).map(x => <p className="journal-note" key={x.id}>Return step: {x.returnStep}</p>)}
            <button className="quiet" disabled={disabled} onClick={() => onUndo(c.id)}>Undo completion</button>
          </details>
        </article>
      </li>;
    })}</ol>
    {!!corrections.length && <details className="correction-history"><summary>Correction history · {corrections.length}</summary>
      {corrections.map(c => {
        const task = s.subtasks.find(t => t.id === c.subtaskId);
        return <article key={c.id}>
          <h3>{task?.title}</h3>
          <p>Completion undone · action reopened</p>
          <p className="session-time">Completed {new Date(c.completedAt).toLocaleString()} · Corrected {new Date(c.undoneAt!).toLocaleString()}</p>
          {task && !task.archivedAt && !s.completions.some(x => x.subtaskId === task.id && !x.undoneAt) && <button className="secondary" disabled={disabled} onClick={() => onReturn(task.id)}>Return to {task.title}</button>}
        </article>;
      })}
    </details>}
  </section>;
}
