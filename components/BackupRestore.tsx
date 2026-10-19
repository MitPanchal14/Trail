"use client";
import { useEffect, useRef, useState } from "react";
import type { Snapshot } from "@/lib/domain";
import type { RestorePoint } from "@/lib/use-work-trail";
import { readBackup } from "@/lib/backup";
import { downloadPrivate } from "@/lib/storage";

export default function BackupRestore({ snapshot, owned, warning, raw, capture, restore, onClose, onRestored }: {
  snapshot: Snapshot; owned: boolean; warning: string; raw: string | null;
  capture: () => RestorePoint;
  restore: (s: Snapshot, point: RestorePoint) => string;
  onClose: () => void; onRestored: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null), cancel = useRef<HTMLButtonElement>(null), readId = useRef(0);
  const [preview, setPreview] = useState<{ snapshot: Snapshot; point: RestorePoint } | null>(null);
  const [error, setError] = useState(""), [reading, setReading] = useState(false);
  const current = useRef({ snapshot, owned, warning });
  useEffect(() => { current.current = { snapshot, owned, warning }; }, [snapshot, owned, warning]);
  const cancelRead = () => { readId.current++; };
  const focusActive = snapshot.sessions.some(s => ["running", "paused"].includes(s.status));
  useEffect(() => {
    dialog.current?.showModal();
    cancel.current?.focus();
    return () => cancelRead();
  }, []);
  const close = () => { readId.current++; dialog.current?.close(); onClose(); };
  const valid = preview && preview.point.snapshot === snapshot && owned;
  const select = async (file?: File) => {
    const id = ++readId.current;
    setPreview(null); setError(""); setReading(false);
    if (!file) return;
    const point = capture(), before = current.current;
    setReading(true);
    try {
      const imported = await readBackup(file);
      if (id !== readId.current) return;
      if (before.snapshot !== current.current.snapshot || before.owned !== current.current.owned || before.warning !== current.current.warning || point.ownershipEpoch !== capture().ownershipEpoch)
        throw Error("Your trail or editing ownership changed. Select the backup again for a fresh preview.");
      setPreview({ snapshot: imported, point });
    } catch (e) {
      if (id === readId.current) setError(e instanceof Error ? e.message : "Choose an intact Trail backup.");
    } finally { if (id === readId.current) setReading(false); }
  };
  return <dialog className="backup-dialog" ref={dialog} aria-labelledby="restore-title" onCancel={e => { e.preventDefault(); close(); }} onKeyDown={e => {
    if (e.key !== "Tab") return;
    const controls = e.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)");
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }}>
    <h2 id="restore-title">Restore a private backup</h2>
    <p>Private and local: backups contain personal task descriptions and notes. This file stays in your browser; nothing is uploaded.</p>
    <p><strong>Restoring replaces this browser’s entire Trail history. It does not merge.</strong> Download your current data first if you want to keep it.</p>
    <div className="button-row">
      <button className="secondary" onClick={() => downloadPrivate(JSON.stringify(snapshot, null, 2), "work-trail-private-recovery.json")}>Download current private data</button>
      {raw !== null && <button className="secondary" onClick={() => downloadPrivate(raw, "work-trail-original-recovery.json")}>Download original stored data</button>}
    </div>
    {focusActive && <p role="alert">Save my place first. Restore is blocked during a running or paused focus session.</p>}
    {!owned && <p role="alert">Editing ownership is required to restore. Close the other tab before trying again.</p>}
    <label className="backup-file">Trail JSON backup · maximum 2 MiB<input type="file" accept=".json,application/json" onChange={e => { void select(e.target.files?.[0]); e.target.value = ""; }} /></label>
    {reading && <p role="status">Reading and validating locally…</p>}
    {error && <p role="alert">{error}</p>}
    {preview && <section aria-label="Backup preview">
      <h3>Backup preview</h3>
      <dl className="backup-counts">
        <div><dt>Goals</dt><dd>{preview.snapshot.mountains.length}</dd></div>
        <div><dt>Actions</dt><dd>{preview.snapshot.subtasks.length}</dd></div>
        <div><dt>Sessions</dt><dd>{preview.snapshot.sessions.length}</dd></div>
        <div><dt>Active completions</dt><dd>{preview.snapshot.completions.filter(c => !c.undoneAt).length}</dd></div>
        <div><dt>Creation draft</dt><dd>{preview.snapshot.creationDraft ? "Present" : "None"}</dd></div>
        <div><dt>Calendar timezone</dt><dd>{preview.snapshot.calendarTimeZone}</dd></div>
      </dl>
      <p>First use: {preview.snapshot.firstUseAt}. Running sessions stop at their recorded position; Resume stays explicit.</p>
      {!valid && <p role="alert">Your trail or ownership changed. Select the backup again to review a fresh preview.</p>}
    </section>}
    <div className="button-row">
      <button ref={cancel} className="secondary" onClick={close}>Cancel</button>
      <button className="primary" disabled={!valid || !owned || focusActive || reading} onClick={() => {
        if (!preview) return;
        const message = restore(preview.snapshot, preview.point);
        if (message) { setError(message); setPreview(null); }
        else { dialog.current?.close(); onRestored(); }
      }}>Replace and restore</button>
    </div>
  </dialog>;
}
