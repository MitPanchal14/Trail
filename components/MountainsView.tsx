"use client";
import { useEffect, useRef, useState } from "react";
import type { Action } from "@/lib/actions";
import { activeCompletion, type Snapshot } from "@/lib/domain";
import { mountainDetails } from "@/lib/mountains";
import { earnedPosition } from "@/lib/trail-position";
import MountainWorld from "./MountainWorld";
import SummitPanel from "./SummitPanel";
import CheckpointJournal, { recordedDuration } from "./CheckpointJournal";

function Scene({ snapshot: s, id }: { snapshot: Snapshot; id: string }) {
  const d = mountainDetails(s, id);
  return <MountainWorld count={d.completions.length} slots={d.completions.map(c => s.subtasks.find(t => t.id === c.subtaskId)!.checkpointSlot)} saved={!!d.saved} seed={d.mountain.terrainSeed} positionSlot={earnedPosition(s, id)} summit={d.mountain.status === "completed"} historicalSummit={d.history} summitPending={d.pending} />;
}
export default function MountainsView({ snapshot: s, disabled, dispatch, onCreate, onEdit, onContinue, onUndo }: {
  snapshot: Snapshot; disabled: boolean; dispatch: (a: Action) => boolean; onCreate: () => void; onEdit: (id: string) => void; onContinue: (id: string) => void; onUndo: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const title = useRef<HTMLHeadingElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const restore = () => {
      const hash = window.location.hash.slice(1);
      if (hash) setSelected(hash);
    };
    restore();
    heading.current?.focus();
    window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, []);
  const id = selected && s.mountains.some(m => m.id === selected) ? selected : s.mountains[0]?.id;
  const detail = id ? mountainDetails(s, id) : null;
  const reveal = () => requestAnimationFrame(() => { title.current?.focus({ preventScroll: true }); title.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
  return <div className="mountains-view">
    <header className="heading"><div><h1 ref={heading} tabIndex={-1}>Mountains</h1><p>Your goals, earned trails and places to return.</p></div><button className="secondary" disabled={disabled} onClick={onCreate}>＋ New task</button></header>
    {!s.mountains.length ? <section className="card mountains-empty"><h2>A landscape waiting for your work</h2><p>No goals yet. Create a task and review its actions to begin a mountain.</p><button className="primary" disabled={disabled} onClick={onCreate}>Add your first goal</button></section> : <>
      <section className="mountain-range" aria-label="Your mountain range">
        {s.mountains.slice(page * 6, page * 6 + 6).map(m => { const d = mountainDetails(s, m.id); return <button key={m.id} className="mountain-preview" aria-label={`View ${m.title}`} aria-describedby={`mountain-summary-${m.id}`} aria-pressed={id === m.id} onClick={() => { setSelected(m.id); window.history.replaceState(window.history.state, "", `/mountains#${m.id}`); reveal(); }}>
          <Scene snapshot={s} id={m.id} /><span className="mountain-caption"><strong>{m.title}</strong><span id={`mountain-summary-${m.id}`}>{d.status}<br />{d.actions.filter(t => activeCompletion(s, t.id)).length} / {d.actions.length} accepted actions completed{d.saved ? " · Saved work" : ""}</span></span>
        </button>; })}
      </section>
      {s.mountains.length > 6 && <nav className="button-row" aria-label="Mountain range pages"><button className="secondary" disabled={page === 0} onClick={() => setPage(x => x - 1)}>Previous goals</button><span>Page {page + 1} of {Math.ceil(s.mountains.length / 6)}</span><button className="secondary" disabled={(page + 1) * 6 >= s.mountains.length} onClick={() => setPage(x => x + 1)}>More goals</button></nav>}
      {detail && <section className="mountain-detail card" aria-labelledby="mountain-detail-title">
        <header><p className="eyebrow">{detail.status}</p><h2 id="mountain-detail-title" ref={title} tabIndex={-1}>{detail.mountain.title}</h2><p>Finish condition: {detail.mountain.finishCondition}</p></header>
        <div className="mountain-detail-grid"><div className="mountain-scene"><Scene key={id} snapshot={s} id={id!} /></div><div className="mountain-return">
          <h3>Your place in this mountain</h3>
          {detail.saved ? <><p>Saved unfinished work: <strong>{detail.next?.title}</strong></p>{detail.saved.returnStep && <p>First thing when I return: {detail.saved.returnStep}</p>}{detail.saved.note && <p>Where I stopped: {detail.saved.note}</p>}<p>{detail.saved.status === "interrupted" ? "Interrupted at the last recorded place" : detail.saved.remainingMs === 0 ? "Time used · extend explicitly on Today" : "Saved session"}</p><p>{Math.ceil(detail.saved.remainingMs / 60000)} minutes remaining · {recordedDuration(detail.saved.creditedMs) || "No focus time recorded"}</p></> : <p>No saved unfinished session for this mountain.</p>}
          {detail.next && <><p>Next accepted action: <strong>{detail.next.title}</strong></p><button className="primary" disabled={disabled} onClick={() => onContinue(detail.next!.id)}>Continue on Today</button><p className="session-time">Choose only; Start, Resume or extend explicitly on Today.</p></>}
          <button className="secondary" disabled={disabled} onClick={() => onEdit(id!)}>Edit breakdown</button>
          <SummitPanel snapshot={s} mountainId={id} disabled={disabled} dispatch={dispatch} onAdd={() => onEdit(id!)} onReveal={reveal} />
        </div></div>
        <h3>Accepted actions</h3><ol className="mountain-actions">{detail.actions.map(t => <li key={t.id}><strong>{t.title}</strong><p>{activeCompletion(s,t.id) ? "Completed" : s.completions.some(c => c.subtaskId === t.id && c.undoneAt) ? "Reopened" : s.sessions.some(x => x.subtaskId === t.id && x.status !== "completed") ? "Saved" : "Ready"} · {t.suggestedMinutes} min session · Checkpoint {t.checkpointSlot + 1}</p><p>{t.nextAction}</p><button className="secondary" disabled={disabled} onClick={() => onContinue(t.id)}>Choose {t.title} on Today</button></li>)}</ol>
        {s.subtasks.some(t => t.mountainId === id && t.archivedAt) && <details><summary>Archived actions</summary><p>Restore through Edit breakdown; saved context and checkpoint slots are retained.</p>{s.subtasks.filter(t => t.mountainId === id && t.archivedAt).map(t => <p key={t.id}>{t.title} · Archived · Checkpoint {t.checkpointSlot + 1}</p>)}</details>}
        <CheckpointJournal snapshot={s} mountainId={id} mountainOnly disabled={disabled} onUndo={onUndo} onReturn={onContinue} />
      </section>}
    </>}
  </div>;
}
