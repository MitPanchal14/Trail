import type { Snapshot } from "@/lib/domain";

export function recordedDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  if (!seconds) return "";
  if (seconds < 60) return `${seconds}s recorded`;
  const minutes = Math.floor(seconds / 60);
  return minutes < 60 ? `${minutes}m ${seconds % 60}s recorded` : `${Math.floor(minutes / 60)}h ${minutes % 60}m recorded`;
}

export default function CheckpointJournal({ snapshot: s, mountainId, disabled, onUndo }: {
  snapshot: Snapshot; mountainId?: string; disabled: boolean; onUndo: (id: string) => void;
}) {
  const entries = s.completions.filter(c => !c.undoneAt && s.subtasks.some(t => t.id === c.subtaskId && t.mountainId === mountainId))
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt) || s.completions.indexOf(b) - s.completions.indexOf(a));
  if (!entries.length) return null;
  return <section className="checkpoint-journal" aria-label="Recorded checkpoint details">
    <header><h2>Your checkpoints</h2><p>{entries.length} earned</p></header>
    <ol>{entries.map((c, i) => {
      const duration = recordedDuration(s.sessions.filter(x => c.sessionIds.includes(x.id)).reduce((sum, x) => sum + x.creditedMs, 0));
      return <li key={c.id} className={i === 0 ? "latest-checkpoint" : ""}>
        <article>
          <h3>{s.subtasks.find(t => t.id === c.subtaskId)?.title}</h3>
          <p className="checkpoint-meta">Completed · <time dateTime={c.completedAt}>{new Date(c.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</time>{duration && ` · ${duration}`} {i === 0 && <span className="latest-label">Latest</span>}</p>
          <details><summary>Context and options</summary>
            <p>{new Date(c.completedAt).toLocaleString()} · {c.localDate} ({c.calendarTimeZone})</p>
            {c.note.trim() && <p className="journal-note">{c.note}</p>}
            {s.sessions.filter(x => c.sessionIds.includes(x.id) && x.returnStep.trim()).map(x => <p className="journal-note" key={x.id}>Return step: {x.returnStep}</p>)}
            <button className="quiet" disabled={disabled} onClick={() => onUndo(c.id)}>Undo completion</button>
          </details>
        </article>
      </li>;
    })}</ol>
  </section>;
}
