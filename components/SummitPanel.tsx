"use client";
import { useRef } from "react";
import type { Snapshot } from "@/lib/domain";
import { activeCompletion } from "@/lib/domain";
import type { Action } from "@/lib/actions";

export default function SummitPanel({ snapshot: s, mountainId, disabled, dispatch, onAdd, onReveal, compact = false }: {
  snapshot: Snapshot; mountainId?: string; disabled: boolean;
  dispatch: (a: Action) => boolean; onAdd: () => void;
  onReveal: () => void;
  compact?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const m = s.mountains.find(m => m.id === mountainId);
  if (!m) return null;
  const tasks = s.subtasks.filter(t => t.mountainId === m.id && !t.archivedAt);
  const count = tasks.filter(t => activeCompletion(s, t.id)).length;
  const ready = tasks.length > 0 && count === tasks.length;
  const history = s.summitConfirmations.filter(c => c.mountainId === m.id).toReversed();
  if (!ready && !history.length) return null;
  return <section className={`summit-panel ${m.status === "completed" ? "summit-reached" : "summit-pending"}`} aria-label="Goal completion">
    <h3>{m.status === "completed" ? "Goal confirmed complete" : ready ? "All planned steps complete" : "Goal reopened"}</h3>
    {!compact && <p>{count} of {tasks.length} actions completed.</p>}
    <p>Finish condition: <strong>{m.finishCondition}</strong></p>
    {m.status === "reopened" && <p>Reopened · current work is separate from historical achievement.</p>}
    {m.status === "completed" ? <>
      <p role="status">Summit reached. This records your explicit confirmation of the finish condition.</p>
      <button className="secondary" disabled={disabled} onClick={() => dispatch({ type: "reopen-goal", mountainId: m.id })}>Reopen goal</button>
    </> : <>
      {ready && <><p>{compact ? "Confirm when this goal’s finish condition is met." : "Confirmation needed. The outlined summit route is a destination, not an earned achievement."}</p>
        <button className="primary" disabled={disabled} onClick={() => dialog.current?.showModal()}>Confirm goal complete</button></>}
      {history.some(c => !c.revokedAt) && <p>Historical summit retained. New work is not marked complete.</p>}
      <button className="secondary" disabled={disabled} onClick={onAdd}>Add another step</button>
    </>}
    {!!history.length && <details><summary>Summit history and corrections</summary>
      {history.map(c => <div key={c.id}><p>Confirmed {new Date(c.confirmedAt).toLocaleString()} · {c.revokedAt ? "Corrected — summit revoked" : "Historical achievement retained"}</p>
        {!c.revokedAt && <button className="quiet" disabled={disabled} onClick={() => {
          if (window.confirm("Was this goal completion mistaken? Revoke this summit confirmation and its light; keep valid action checkpoints.")) dispatch({ type: "correct-summit", id: c.id });
        }}>Correct mistaken goal completion</button>}
      </div>)}
    </details>}
    <dialog className="decision-dialog" ref={dialog} aria-labelledby="summit-confirm-title">
      <div className="decision-content"><h2 id="summit-confirm-title">Have you met this finish condition?</h2>
      <p>{m.title}</p><p>{m.finishCondition}</p>
      <p>Completing planned steps alone does not confirm the goal.</p>
      </div><div className="decision-actions">
      <button autoFocus className="secondary" onClick={() => dialog.current?.close()}>Not yet</button>
      <button className="primary" disabled={disabled} onClick={() => {
        if (dispatch({ type: "confirm-summit", mountainId: m.id })) {
          dialog.current?.close();
          requestAnimationFrame(onReveal);
        }
      }}>Yes, finish condition met</button>
      </div>
    </dialog>
  </section>;
}
