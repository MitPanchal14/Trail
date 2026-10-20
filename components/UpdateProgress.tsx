"use client";
import { useEffect, useRef, useState } from "react";
import { savedContext, type Snapshot } from "@/lib/domain";
import type { Action } from "@/lib/actions";
import { downloadPrivate } from "@/lib/storage";

export default function UpdateProgress({ snapshot, owned, warning, dispatch, onClose }: {
  snapshot: Snapshot; owned: boolean; warning: string; dispatch: (a: Action) => boolean; onClose: () => void;
}) {
  const [base] = useState(snapshot);
  const task = base.subtasks.find(t => t.id === base.selection.selectedSubtaskId)!;
  const [draft, setDraft] = useState(() => savedContext(base, task.id));
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null), note = useRef<HTMLTextAreaElement>(null);
  const stale = snapshot !== base;
  useEffect(() => { dialog.current?.showModal(); note.current?.focus(); }, []);
  const close = () => { dialog.current?.close(); onClose(); };
  return <dialog className="progress-update-dialog" ref={dialog} aria-labelledby="update-progress-title" onCancel={e => { e.preventDefault(); close(); }} onKeyDown={e => {
    if (e.key !== "Tab") return;
    const controls = e.currentTarget.querySelectorAll<HTMLElement>("textarea:not(:disabled), button:not(:disabled)");
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }}>
    <form onSubmit={e => {
      e.preventDefault();
      if (stale || !owned || warning || !dispatch({ type: "update-progress", id: task.id, expectedRevision: base.revision, ...draft })) {
        setError("Update not saved. Your draft is still here; saved context is unchanged. Download the draft before closing if needed.");
        return;
      }
      close();
    }}>
      <h2 id="update-progress-title">Update progress</h2>
      <p><strong>{task.title}</strong><br />Save context only — no timer, completion or checkpoint.</p>
      <label>Where I stopped / what changed <span>(optional)</span>
        <textarea ref={note} rows={3} maxLength={2000} value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })} />
      </label>
      <label>Next time, start here <span>(optional)</span>
        <textarea rows={2} maxLength={500} value={draft.returnStep} onChange={e => setDraft({ ...draft, returnStep: e.target.value })} />
      </label>
      {(error || stale || !owned || warning) && <div role="alert">
        <p>{error || "Update not saved. Your trail or editing access changed; cancel and reopen after resolving it."}</p>
        {warning && <p>{warning}</p>}
        <button type="button" className="secondary" onClick={() => downloadPrivate(JSON.stringify({ kind: "trail-progress-update-draft", subtaskId: task.id, title: task.title, ...draft }, null, 2), "trail-private-update-draft.json")}>Download update draft</button>
        <p>This is an unsaved text draft, not a full Trail backup.</p>
      </div>}
      <div className="button-row">
        <button type="button" className="secondary" onClick={close}>Cancel</button>
        <button className="primary" disabled={stale || !owned || !!warning}>Save update</button>
      </div>
    </form>
  </dialog>;
}
