"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { savedContext, type Snapshot } from "@/lib/domain";
import type { Action } from "@/lib/actions";
import { downloadPrivate } from "@/lib/storage";
import { parsePlanResponse, RequestGate, type PlanRequest } from "@/lib/planning";
import AiAvailability, { useAiAvailability } from "./AiAvailability";
import VoiceInput from "./VoiceInput";

export default function UpdateProgress({ snapshot, owned, warning, dispatch, onClose }: {
  snapshot: Snapshot; owned: boolean; warning: string; dispatch: (a: Action) => boolean; onClose: () => void;
}) {
  const [base] = useState(snapshot);
  const task = base.subtasks.find(t => t.id === base.selection.selectedSubtaskId)!;
  const [draft, setDraft] = useState(() => savedContext(base, task.id));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false), [suggestion, setSuggestion] = useState(false);
  const [original, setOriginal] = useState<typeof draft | null>(null);
  const ai = useAiAvailability();
  const gate = useRef(new RequestGate());
  const review = useRef<HTMLTextAreaElement>(null);
  const dialog = useRef<HTMLDialogElement>(null), note = useRef<HTMLTextAreaElement>(null);
  const stale = snapshot !== base;
  const blocked = stale || !owned || !!warning;
  const blockedRef = useRef(blocked);
  const draftRef = useRef(draft);
  useLayoutEffect(() => { draftRef.current = draft; }, [draft]);
  useLayoutEffect(() => {
    blockedRef.current = blocked;
    if (blocked) gate.current.cancel();
  }, [blocked]);
  useEffect(() => { const g = gate.current; return () => g.cancel(); }, []);
  useEffect(() => { dialog.current?.showModal(); note.current?.focus(); }, []);
  const close = () => { gate.current.cancel(); dialog.current?.close(); onClose(); };
  const change = (next: typeof draft) => {
    gate.current.cancel(); setPending(false); setSuggestion(false); setError("");
    draftRef.current = next; setDraft(next);
  };
  const prepare = async () => {
    if (blockedRef.current || pending || !ai.available || !draft.note.trim()) return;
    const request: PlanRequest = {
      kind: "progress-update", update: draft.note, action: task.title,
      instruction: task.nextAction, previousReturnStep: draft.returnStep,
    };
    const attempt = gate.current.begin(); setPending(true); setError(""); setSuggestion(false);
    try {
      const reply = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request), signal: attempt.signal });
      const body = await reply.json().catch(() => { throw Error("AI returned an unusable update. Your text is retained."); });
      if (!gate.current.current(attempt.id) || blockedRef.current) return;
      if (!reply.ok) throw Error(body.error?.message ?? "AI is unavailable. Your text is retained; edit manually.");
      const result = (() => {
        try { return parsePlanResponse(body, request); }
        catch { throw Error("AI returned an unusable update. Your text is retained; edit manually or retry."); }
      })();
      if (result.kind === "clarification") { setError(`${result.question} Edit your update, then ask again.`); return; }
      if (result.kind !== "progress-update") throw Error("AI returned an unexpected update. Your text is retained.");
      setOriginal({ ...draftRef.current });
      setDraft({ note: result.note, returnStep: result.returnStep }); setSuggestion(true);
      requestAnimationFrame(() => review.current?.focus());
    } catch (e) {
      if (gate.current.current(attempt.id) && !blockedRef.current)
        setError(e instanceof Error ? e.message : "AI could not prepare an update. Your text is retained; edit manually.");
    } finally { if (gate.current.current(attempt.id)) setPending(false); }
  };
  return <dialog className="progress-update-dialog" ref={dialog} aria-labelledby="update-progress-title" onCancel={e => { e.preventDefault(); close(); }} onKeyDown={e => {
    if (e.key !== "Tab") return;
    const controls = e.currentTarget.querySelectorAll<HTMLElement>("textarea:not(:disabled), button:not(:disabled)");
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }}>
    <form onSubmit={e => {
      e.preventDefault();
      if (pending || stale || !owned || warning || !dispatch({ type: "update-progress", id: task.id, expectedRevision: base.revision, ...draft })) {
        setError("Update not saved. Your draft is still here; saved context is unchanged. Download the draft before closing if needed.");
        return;
      }
      close();
    }}>
      <h2 id="update-progress-title">Update progress</h2>
      <p className="update-action-name">{task.title.length > 100 ? `${task.title.slice(0, 100)}…` : task.title}</p>
      {task.title.length > 100 && <details><summary>Read full action title</summary><p>{task.title}</p></details>}
      <p>Save a stopping point without starting a session.</p>
      <label>Where I stopped / what changed <span>(optional)</span>
        <textarea ref={note} rows={3} maxLength={2000} value={draft.note} placeholder="Read the example. The practice question is still left." onChange={e => change({ ...draft, note: e.target.value })} />
      </label>
      <div className="update-assistance">
      <VoiceInput key={blocked || pending ? "disabled" : "editable"} disabled={blocked || pending} onTranscript={text => {
        const current = draftRef.current;
        const combined = `${current.note}${current.note.trim() ? "\n" : ""}${text}`;
        change({ ...current, note: combined.slice(0, 2000) });
        if (combined.length > 2000) setError("The update reached its 2000-character limit; the rest of the transcript was not added. Review the text before saving.");
      }} />
      <div className="update-preparation">
        <button type="button" className="secondary" disabled={blocked || pending || !ai.available || !draft.note.trim()} onClick={prepare}>{pending ? "Preparing next step…" : "Prepare next step with AI"}</button>
        {pending && <button type="button" className="quiet" onClick={() => { gate.current.cancel(); setPending(false); }}>Cancel request</button>}
        <p className="session-time">Sends this update and action context to Gemini. Review before saving.</p>
        {!ai.available && <p className="session-time">AI is unavailable here. You can edit and save manually.</p>}
        <details><summary>AI availability</summary><AiAvailability message={ai.message} recheck={ai.recheck} /></details>
      </div>
      </div>
      {suggestion && <p role="status" className="notice">Suggested update ready. Check the stopping note and return step; nothing is saved yet.</p>}
      {original && <button type="button" className="quiet" onClick={() => { change(original); setOriginal(null); }}>Use my original update</button>}
      <label>Next time, start here <span>(optional)</span>
        <textarea ref={review} rows={2} maxLength={500} value={draft.returnStep} onChange={e => change({ ...draft, returnStep: e.target.value })} />
      </label>
      {(error || blocked) && <div role="alert">
        <p>{error || "Update not saved. Your trail or editing access changed; cancel and reopen after resolving it."}</p>
        {warning && <p>{warning}</p>}
        <button type="button" className="secondary" onClick={() => downloadPrivate(JSON.stringify({ kind: "trail-progress-update-draft", subtaskId: task.id, title: task.title, ...draft }, null, 2), "trail-private-update-draft.json")}>Download update draft</button>
        <p>This is an unsaved text draft, not a full Trail backup.</p>
      </div>}
      <div className="button-row">
        <button type="button" className="secondary" onClick={close}>Cancel</button>
        <button className="primary" disabled={blocked || pending}>Save update</button>
      </div>
    </form>
  </dialog>;
}
