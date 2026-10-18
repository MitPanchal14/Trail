"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MountainsView from "./MountainsView";
import ProgressView from "./ProgressView";
import { useEffect, useRef, useState } from "react";
import MountainWorld from "./MountainWorld";
import SampleToday from "./SampleToday";
import { useWorkTrail } from "@/lib/use-work-trail";
import { activeCompletion, currentSession, dateKey } from "@/lib/domain";
import { earnedPosition } from "@/lib/trail-position";
import { downloadPrivate } from "@/lib/storage";
import TaskCreation from "./TaskCreation";
import DailyPlanner from "./DailyPlanner";
import CheckpointJournal from "./CheckpointJournal";
import SummitPanel from "./SummitPanel";
import { newDraft, meaningfulDraft, distinctInstruction } from "@/lib/planning";

const clock = (ms: number) =>
  `${Math.floor(Math.ceil(ms / 1000) / 60)
    .toString()
    .padStart(
      2,
      "0",
    )}:${(Math.ceil(ms / 1000) % 60).toString().padStart(2, "0")}`;
export default function TodayView() {
  const pathname = usePathname();
  const router = useRouter();
  const revealToday = useRef(false);
  const editTarget = useRef<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const { snapshot: s, owned, warning, notice, dispatch, raw } = useWorkTrail();
  const [samples, setSamples] = useState(false),
    [focus, setFocus] = useState(false),
    [creationOpen, setCreationOpen] = useState(false),
    [minutes, setMinutes] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [reopened, setReopened] = useState<string | null>(null);
  const undoRecovery = useRef<HTMLElement>(null);
  const [nextDuration, setNextDuration] = useState({ id: "", value: "" });
  const [deliberate, setDeliberate] = useState(false);
  const [todayNow, setTodayNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setTodayNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  const conflict = useRef<HTMLDialogElement>(null);
  const cancelConflict = useRef<HTMLButtonElement>(null);
  const undoChoice = useRef<HTMLDialogElement>(null);
  const [undoId, setUndoId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const actionHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (pathname === "/") {
      const target = revealToday.current ? actionHeading : heading;
      revealToday.current = false;
      requestAnimationFrame(() => { target.current?.focus(); target.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
    }
  }, [pathname]);
  useEffect(() => {
    if (focus) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [focus]);
  if (!s)
    return (
      <main className="loading" role="status">
        Opening your local work trail…
      </main>
    );
  const task = s.subtasks.find((x) => x.id === s.selection.selectedSubtaskId),
    mountain = s.mountains.find((x) => x.id === task?.mountainId),
    session = currentSession(s),
    completion = task && activeCompletion(s, task.id);
  const focused = focus && !!session && !completion,
    readOnly = !owned,
    duration = minutes ?? String(task?.suggestedMinutes ?? 20),
    remaining = session?.remainingMs ?? Number(duration) * 60000;
  const returning = !!session && !completion && !focused;
  const isMountains = pathname === "/mountains" && !focused;
  const isProgress = pathname === "/progress" && !focused;
  const returnStep = session && !completion ? session.returnStep.trim() : "";
  const accepted = s.subtasks.filter(t => t.mountainId === mountain?.id && !t.archivedAt).sort((a,b) => a.orderKey - b.orderKey);
  const next = accepted.find(t => !activeCompletion(s, t.id));
  const summitReached = mountain?.status === "completed";
  const summitHistory = s.summitConfirmations.some(c => c.mountainId === mountain?.id && !c.revokedAt);
  const summitPending = accepted.length > 0 && !next && !summitReached;
  const returnTo = (id: string) => {
    // Recovery choices never interrupt a live session or implicitly start one.
    if (s.sessions.some(x => ["running", "paused"].includes(x.status))) return;
    if (dispatch({ type: "select", id })) {
      setMinutes(null);
      setReopened(null);
      if (pathname === "/mountains") { revealToday.current = true; router.push("/"); }
      requestAnimationFrame(() => {
        actionHeading.current?.focus({ preventScroll: true });
        actionHeading.current?.scrollIntoView({ block: "start", behavior: "instant" });
      });
    }
  };
  const finishUndo = (id: string, correctSummit?: boolean) => {
    const item = s.completions.find(c => c.id === id);
    if (item && !item.undoneAt && dispatch({ type: "undo", id, correctSummit })) {
      setCelebration(null);
      setReopened(item.subtaskId);
      requestAnimationFrame(() => {
        undoRecovery.current?.focus({ preventScroll: true });
        undoRecovery.current?.scrollIntoView({ block: "start", behavior: "instant" });
      });
      return true;
    }
    return false;
  };
  const undo = (id: string) => {
    if (s.summitConfirmations.some(c => !c.revokedAt && c.relatedCompletionIds.includes(id))) {
      setUndoId(id); undoChoice.current?.showModal();
    } else finishUndo(id);
  };
  const nextSession = s.sessions.findLast(x => x.subtaskId === next?.id && x.status !== "completed");
  const nextMinutes = nextDuration.id === next?.id ? nextDuration.value : String(next?.suggestedMinutes ?? 20);
  const disposition = s.dayPlans.find(p => p.dateKey === dateKey(todayNow, s.calendarTimeZone))?.commitments.find(c => c.subtaskId === next?.id)?.disposition;
  const needsChoice = disposition === "deferred" || disposition === "removed";
  const earned = s.completions.filter(
    (c) =>
      !c.undoneAt &&
      s.subtasks.find((t) => t.id === c.subtaskId)?.mountainId === mountain?.id,
  );
  const slots = earned.map(
    (c) => s.subtasks.find((t) => t.id === c.subtaskId)!.checkpointSlot,
  );
  const start = () => {
    if (!session || session.status === "completed") {
      if (
        !Number.isInteger(Number(duration)) ||
        Number(duration) < 1 ||
        Number(duration) > 120
      ) {
        form.current?.reportValidity();
        return;
      }
      if (dispatch({ type: "start", minutes: Number(duration) }))
        setFocus(true);
    } else if (dispatch({ type: "resume" })) setFocus(true);
  };
  const complete = () => {
    if (task && dispatch({ type: "complete" })) {
      setCelebration(task.id);
      setFocus(false);
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  };
  const openCreate = () => {
    if (!s.creationDraft && !dispatch({ type: "draft", draft: newDraft() }))
      return;
    setCreationOpen(true);
    dialog.current?.showModal();
  };
  const closeCreate = () => {
    if (s.creationDraft && !meaningfulDraft(s.creationDraft))
      dispatch({ type: "draft", draft: null });
    setCreationOpen(false);
    setMinutes(null);
    dialog.current?.close();
  };
  const editBreakdownFor = (id: string | undefined) => {
    const target = s.mountains.find(m => m.id === id);
    if (!target || readOnly || warning) return;
    editTarget.current = target.id;
    setEditId(target.id);
    if (s.creationDraft?.editingMountainId === target.id) {
      openCreate();
      return;
    }
    if (meaningfulDraft(s.creationDraft)) { conflict.current?.showModal(); cancelConflict.current?.focus(); return; }
    beginEdit();
  };
  const editBreakdown = () => editBreakdownFor(mountain?.id);
  const beginEdit = () => {
    const mountain = s.mountains.find(m => m.id === editTarget.current);
    if (!mountain || readOnly || warning) return;
    const draft = newDraft();
    if (!dispatch({
      type: "edit-draft",
      draft: {
        ...draft,
        editingMountainId: mountain.id,
        description: mountain.description,
        goal: mountain.title,
        finishCondition: mountain.finishCondition,
        steps: s.subtasks
          .filter((t) => t.mountainId === mountain.id && !t.archivedAt)
          .sort((a, b) => a.orderKey - b.orderKey)
          .map((t) => ({
            key: crypto.randomUUID(),
            existingId: t.id,
            title: t.title,
            nextAction: t.nextAction,
            suggestedMinutes: t.suggestedMinutes,
          })),
      },
    })) return;
    setCreationOpen(true);
    dialog.current?.showModal();
  };
  const storageNotice = (
    <>
      {warning && (
        <section className="storage-warning" role="alert">
          <strong>{warning}</strong>
          <div className="button-row">
            <button
              onClick={() =>
                downloadPrivate(
                  JSON.stringify(s, null, 2),
                  "work-trail-private-recovery.json",
                )
              }
            >
              Download private recovery
            </button>
            {raw && (
              <button
                onClick={() =>
                  downloadPrivate(raw, "work-trail-original-recovery.json")
                }
              >
                Download original stored data
              </button>
            )}
          </div>
        </section>
      )}
      {readOnly && (
        <p className="ownership" role="status">
          Read-only: another tab may own this trail, or ownership is being
          checked. Close the other tab to edit here. If storage cannot
          coordinate tabs, editing stays blocked.
        </p>
      )}
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
    </>
  );
  if (samples)
    return (
      <>
        {storageNotice}
        <SampleToday onReturn={() => setSamples(false)} />
      </>
    );
  return (
    <div className={`shell ${focused ? "is-focusing" : ""}`}>
      <a className="skip" href="#main">
        Skip to {isProgress ? "Progress" : isMountains ? "Mountains" : "Today"}
      </a>
      <aside className="sidebar">
        <a className="brand" href="#main">
          <span className="brand-mark" aria-hidden="true">
            ▟
          </span>
          Trail.
        </a>
        <nav className="trail-navigation" aria-label="Main">
          <Link className={!isMountains && !isProgress ? "nav-active" : ""} href="/" aria-current={!isMountains && !isProgress ? "page" : undefined}>
            ◉ Today
          </Link>
          <Link className={isMountains ? "nav-active" : ""} href="/mountains" aria-current={isMountains ? "page" : undefined}>△ Mountains</Link>
          <Link className={isProgress ? "nav-active" : ""} href="/progress" aria-current={isProgress ? "page" : undefined}>▦ Progress</Link>
        </nav>
      </aside>
      <main id="main">
        {storageNotice}
        <header className="topline">
          <span>{focused ? "Focus" : isProgress ? "Progress" : isMountains ? "Mountains" : "Today"}</span>
          <span>
            {warning
              ? "Changes not saved"
              : readOnly
                ? "Read-only"
                : ""}
          </span>
        </header>
        {pathname === "/mountains" && focused && <p className="notice">Your focus session is still accessible here. Save your place before browsing Mountains.</p>}
        {pathname === "/progress" && focused && <p className="notice">Your focus session is still accessible here. Save your place before browsing Progress.</p>}
        {isProgress ? <ProgressView snapshot={s} now={todayNow} /> : isMountains ? <>
          {reopened && <section ref={undoRecovery} tabIndex={-1} className="undo-recovery card" aria-label="Undo recovery"><p role="status">{s.subtasks.find(t => t.id === reopened)?.title} reopened. Current work is unchanged.</p><button className="primary" disabled={readOnly || !!warning} onClick={() => returnTo(reopened)}>Return to {s.subtasks.find(t => t.id === reopened)?.title}</button><button className="secondary" onClick={() => setReopened(null)}>Stay with current work</button></section>}
          <MountainsView snapshot={s} disabled={readOnly || !!warning} dispatch={dispatch} onCreate={openCreate} onEdit={editBreakdownFor} onContinue={returnTo} onUndo={undo} />
        </> : <>
        <div className="heading">
          <div>
            <h1 ref={heading} tabIndex={-1}>
              {focused
                ? "One action at a time."
                : summitReached ? "Summit reached" : summitPending ? "All planned steps complete" : completion
                  ? "A checkpoint earned."
                  : session
                     ? "Continue your work"
                    : task
                       ? "Next up"
                      : "Every path starts here."}
            </h1>
            <p role={completion && !summitReached ? "status" : undefined} className={completion && !summitReached ? "earned-confirmation" : undefined}>
              {focused
                ? "Time records your commitment, not proof of attention."
                : summitReached ? mountain?.title : completion
                   ? `✓ ${task?.title} earned checkpoint ${task ? task.checkpointSlot + 1 : ""}. Local trail light restored. The larger goal is not automatically finished.`
                  : task
                     ? mountain?.title
                    : "Make room for one thing you want to move forward."}
            </p>
          </div>
          {!focused && (
            <button
              className="secondary"
              disabled={readOnly}
              onClick={openCreate}
            >
              ＋ New task
            </button>
          )}
        </div>
        <div className={`bento work-bento ${returning ? "has-saved-work" : ""} ${summitReached && !focused ? "show-summit-reward" : ""}`}>
          <section className="world" aria-labelledby="world-title">
            <div className="world-heading">
              <div>
                <p className="eyebrow">
                  {mountain?.title ?? "An open landscape"}
                </p>
                <h2 id="world-title">
                  {earned.length ? `${earned.length} checkpoint${earned.length === 1 ? "" : "s"} earned` : "Your trail starts here"}
                </h2>
              </div>
            </div>
            <MountainWorld
              count={earned.length}
              slots={slots}
              seed={mountain?.terrainSeed}
              currentSlot={task?.checkpointSlot}
              saved={!!session && !completion}
              running={focused && session?.status === "running"}
              celebration={!!completion && celebration === task?.id}
              completed={!!completion}
              positionSlot={earnedPosition(s, mountain?.id)}
              summit={summitReached}
              historicalSummit={summitHistory}
              summitPending={summitPending}
            />
            <div className="world-footer">
              <span className="pill">
                {earned.length
                  ? `✦ ${earned.length} earned checkpoint${earned.length === 1 ? "" : "s"}`
                  : "○ No checkpoints yet"}
              </span>
              <span className={returning ? "saved-label" : ""}>
                {summitReached ? "⚑ Summit reached" : summitPending ? "○ Summit awaiting confirmation" : returning ? "⚑ Saved campsite" : focused ? "Walking in place · no progress earned" : completion ? "✦ Action complete" : "○ Next checkpoint ahead"}
              </span>
              <details className="trail-key"><summary>Trail key</summary><p>Amber lanterns: completed work. Blue frame and tent: saved place. Pale path: work ahead.</p></details>
            </div>
          </section>
          <section
            className="action card real-action"
            aria-labelledby="action-title"
          >
            <div className={completion ? "just-completed" : undefined}>
              <span className="tag">
                {completion
                  ? "Just completed"
                  : session
                    ? session.status === "interrupted"
                      ? "Interrupted · Resume when ready"
                      : session.status === "saved"
                        ? "Place saved"
                        : session.status === "expired"
                          ? "Session ended"
                          : session.status === "paused"
                            ? "Paused"
                            : "Focus commitment"
                    : "Your next action"}
              </span>
              {returnStep && <p className="eyebrow">First thing when I return</p>}
              <h2 id="action-title" ref={actionHeading} tabIndex={-1}>
                {completion ? task?.title : returnStep || task?.title || "What would you like to move forward?"}
              </h2>
              {returnStep && <p className="original-action">Action: {task?.title}</p>}
              {task && !completion && !returning && <p className="destination">Destination: checkpoint {task.checkpointSlot + 1}</p>}
              {task && !completion && !returnStep && distinctInstruction(task.title, task.nextAction) && <p className="next-instruction">{task.nextAction}</p>}
              {mountain && !completion && !summitPending && !summitReached && <p className="finish-condition">Finish condition: {mountain.finishCondition}</p>}
              {completion && <>
                <p className="session-time">Completed <time dateTime={completion.completedAt}>{new Date(completion.completedAt).toLocaleString()}</time></p>
                <button className="secondary" disabled={readOnly} onClick={() => { setCelebration(null); undo(completion.id); }}>Undo completion</button>
                <details><summary>Completed action details</summary><p>{task?.nextAction}</p><p>Finish condition: {mountain?.finishCondition}</p>{completion.note && <p>{completion.note}</p>}</details>
              </>}
              {mountain && !focused && !completion && <p className="session-time">{accepted.filter(t => activeCompletion(s, t.id)).length} / {accepted.length} accepted actions completed</p>}
            </div>
            {returning && session.note.trim() && (
              <div className="context">
                <strong>Where I stopped</strong>
                <p>{session.note}</p>
              </div>
            )}
            {focused && session ? (
              <>
                <div
                  className="countdown"
                  aria-label="Remaining commitment"
                  role="timer"
                  aria-live="off"
                >
                  {clock(remaining)}
                </div>
                <p className="session-time">
                  Recorded session time: {Math.floor(session.creditedMs / 1000)}{" "}
                  seconds
                </p>
                {session.status === "expired" && (
                  <p role="status">
                    Time is up. Complete the action, extend, or save your place.
                    No completion was recorded.
                  </p>
                )}
                <section className="return-note" aria-label="Optional return context">
                  <h3>When you return <span>(optional)</span></h3>
                  <label className="note-label" htmlFor="context-note">
                    Where I stopped <span>(optional)</span>
                    <textarea
                      id="context-note"
                      maxLength={2000}
                      value={session.note}
                      disabled={readOnly}
                      onChange={(e) =>
                        dispatch({ type: "note", note: e.target.value })
                      }
                      placeholder="A thought that will help you return…"
                    />
                  </label>
                  <label className="note-label" htmlFor="return-step">
                    First thing when I return <span>(optional)</span>
                    <textarea id="return-step" rows={2} maxLength={500} value={session.returnStep} disabled={readOnly}
                      onChange={(e) => dispatch({ type: "return-step", value: e.target.value })}
                      placeholder="Open the draft and write the next example." />
                  </label>
                </section>
                <div className="button-row">
                  <button
                    disabled={readOnly || session.status === "expired"}
                    className="secondary"
                    onClick={() =>
                      dispatch({
                        type: session.status === "running" ? "pause" : "resume",
                      })
                    }
                  >
                    {session.status === "running" ? "Pause" : "Continue"}
                  </button>
                  <button
                    className="secondary"
                    disabled={readOnly || session.remainingMs > 6900000}
                    onClick={() => dispatch({ type: "extend", minutes: 5 })}
                  >
                    Extend 5 min
                  </button>
                </div>
                <button
                  className="primary"
                  disabled={readOnly}
                  onClick={() => {
                    if (dispatch({ type: "save" })) setFocus(false);
                  }}
                >
                  Save my place
                </button>
                <button
                  className="secondary"
                  disabled={readOnly}
                  onClick={complete}
                >
                  Complete action
                </button>
              </>
            ) : completion ? (
              <>
                <p>{accepted.filter(t => activeCompletion(s, t.id)).length} / {accepted.length} accepted actions completed</p>
                {next ? <section className="task-form continuation" aria-label="Next accepted action">
                  <p className="eyebrow">Up next · Action {accepted.findIndex(t => t.id === next.id) + 1} of {accepted.length}</p>
                  <h3>{next.title}</h3>
                  {distinctInstruction(next.title, next.nextAction) && <p>{next.nextAction}</p>}
                  {nextSession ? <>
                    {nextSession.returnStep && <p>First thing when I return: {nextSession.returnStep}</p>}
                    {nextSession.note && <p>Where I stopped: {nextSession.note}</p>}
                    <p>Remaining commitment: {clock(nextSession.remainingMs)}</p>
                  </> : <label>Next session length<input aria-label="Next session length" type="number" min={1} max={120} value={nextMinutes} onChange={e => setNextDuration({ id: next.id, value: e.target.value })} /></label>}
                  {needsChoice && <label className="check-label"><input type="checkbox" checked={deliberate} onChange={e => setDeliberate(e.target.checked)} />Work on this {disposition} action now; keep today’s plan unchanged</label>}
                  <button className="primary" disabled={readOnly || !!warning || (needsChoice && !deliberate) || (nextSession ? !nextSession.remainingMs : !Number.isInteger(Number(nextMinutes)) || Number(nextMinutes) < 1 || Number(nextMinutes) > 120)} onClick={() => {
                    if (dispatch({ type: "start-next", id: next.id, minutes: nextSession ? next.suggestedMinutes : Number(nextMinutes) })) { setMinutes(null); setDeliberate(false); setFocus(true); }
                  }}>{nextSession ? "Resume next action" : "Start this action"}</button>
                  {nextSession?.remainingMs === 0 && <button className="secondary" disabled={readOnly} onClick={() => { if (dispatch({ type: "select", id: next.id })) setMinutes(null); }}>Open saved action</button>}
                </section> : null}
              </>
            ) : task ? (
              <>
                <form
                  ref={form}
                  onSubmit={(e) => {
                    e.preventDefault();
                    start();
                  }}
                >
                  {!session || session.status === "completed" ? (
                    <div className="duration">
                      <label htmlFor="minutes">
                        Session length<small>1–120 minutes</small>
                      </label>
                      <div>
                        <input
                          id="minutes"
                          aria-label="Session length"
                          type="number"
                          required
                          min={1}
                          max={120}
                          step={1}
                          value={duration}
                          onChange={(e) => setMinutes(e.target.value)}
                        />{" "}
                        min
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="remaining">
                        Remaining commitment:{" "}
                        <strong>{clock(remaining)}</strong>
                      </p>
                    </>
                  )}
                  <button
                    className="primary"
                    disabled={
                      readOnly ||
                      (!!session &&
                        session.status !== "completed" &&
                        session.remainingMs === 0)
                    }
                  >
                    {session && session.status !== "completed"
                      ? "Resume"
                      : "Start"}
                  </button>
                </form>
                {session &&
                  session.status !== "completed" &&
                  session.remainingMs === 0 && (
                    <>
                      <p>
                        The commitment ended; the action is still unfinished.
                      </p>
                      <button
                        className="secondary"
                        disabled={readOnly}
                        onClick={() => {
                          if (dispatch({ type: "extend", minutes: 5 }))
                            setFocus(true);
                        }}
                      >
                        Extend 5 min
                      </button>
                      <button
                        className="secondary"
                        disabled={readOnly}
                        onClick={complete}
                      >
                        Complete action
                      </button>
                    </>
                  )}
              </>
            ) : (
              <>
                <p>
                  Choose a goal, finish condition and first action. Records stay
                  in this browser.
                </p>
                <button
                  className="primary"
                  disabled={readOnly}
                  onClick={openCreate}
                >
                  ＋ Add your first task
                </button>
              </>
            )}
            {!focused && <SummitPanel snapshot={s} mountainId={mountain?.id} disabled={readOnly || !!warning} dispatch={dispatch} onAdd={editBreakdown} onReveal={() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "start", behavior: "instant" }); }} />}
            {!focused && <div className="task-tools">
              {returning && <details className="session-details"><summary>Session details</summary><p>Last saved: {new Date(session.lastHeartbeatAt).toLocaleString()}</p><p>Recorded session time: {Math.floor(session.creditedMs / 1000)} seconds</p></details>}
              {mountain && <button className="quiet edit-breakdown" disabled={readOnly} onClick={editBreakdown}>Edit breakdown</button>}
            </div>}
          </section>
        </div>
        {!focused && (
          <>
            {reopened && <section ref={undoRecovery} tabIndex={-1} className="undo-recovery card" aria-label="Undo recovery">
              <p role="status">{s.subtasks.find(t => t.id === reopened)?.title} reopened. Completion undone; current work is unchanged.</p>
              <div className="button-row">
                <button className="primary" disabled={readOnly || !!warning || s.sessions.some(x => ["running", "paused"].includes(x.status))} onClick={() => returnTo(reopened)}>Return to {s.subtasks.find(t => t.id === reopened)?.title}</button>
                <button className="secondary" onClick={() => setReopened(null)}>Stay with current work</button>
              </div>
            </section>}
            <DailyPlanner
              snapshot={s}
              dispatch={dispatch}
              disabled={readOnly}
              onSelect={(id) => {
                if (dispatch({ type: "select", id })) {
                  setMinutes(null);
                  requestAnimationFrame(() => {
                    actionHeading.current?.focus({ preventScroll: true });
                    actionHeading.current?.scrollIntoView({ block: "start", behavior: "instant" });
                  });
                }
              }}
            />
            {meaningfulDraft(s.creationDraft) && (
              <button
                className="secondary"
                disabled={readOnly}
                onClick={openCreate}
              >
                Continue creation draft
              </button>
            )}
            <CheckpointJournal snapshot={s} mountainId={mountain?.id} disabled={readOnly || !!warning || s.sessions.some(x => ["running", "paused"].includes(x.status))} onUndo={undo} onReturn={returnTo} />
            <footer className="preview-controls">
              <div>
                <strong>Private to this browser · no account or sync</strong>
                <p>
                  Download a recovery copy before clearing browser data.
                </p>
              </div>
              <button
                className="secondary"
                onClick={() =>
                  downloadPrivate(
                    JSON.stringify(s, null, 2),
                    "work-trail-private-recovery.json",
                  )
                }
              >
                Download private recovery
              </button>
              <button className="secondary" onClick={() => setSamples(true)}>
                Explore sample previews
              </button>
            </footer>
            <details className="recovery-copy"><summary>About saved work</summary><p>Work is saved regularly while this tab is open. After a crash or slow browser update, your saved place may be slightly older. Time away is never counted as work.</p></details>
          </>
        )}
        </>}
        <dialog className="decision-dialog" ref={undoChoice} aria-labelledby="undo-summit-title">
          <div className="decision-content">
          <h2 id="undo-summit-title">Was the summit confirmation also mistaken?</h2>
          <p>This action supports an existing summit confirmation. Undo removes only this checkpoint unless you also correct the summit.</p>
          </div><div className="decision-actions">
          <button autoFocus className="secondary" onClick={() => undoChoice.current?.close()}>Cancel Undo</button>
           <button className="secondary" disabled={readOnly || !!warning} onClick={() => { if (undoId && finishUndo(undoId, false)) undoChoice.current?.close(); }}>Undo action, keep summit</button>
           <button className="primary" disabled={readOnly || !!warning} onClick={() => { if (undoId && finishUndo(undoId, true)) undoChoice.current?.close(); }}>Undo action and correct summit</button>
          </div>
        </dialog>
        <dialog
          className="decision-dialog"
          ref={conflict}
          aria-labelledby="draft-conflict-title"
        >
          <div className="decision-content"><h2 id="draft-conflict-title">Keep your existing draft?</h2>
          <p>You have {s.creationDraft?.editingMountainId ? `an edit for ${s.mountains.find(m => m.id === s.creationDraft?.editingMountainId)?.title}` : `a new-project draft: ${s.creationDraft?.goal || s.creationDraft?.description || "Untitled"}`}. This is not the editor for {s.mountains.find(m => m.id === editId)?.title}.</p>
          </div><div className="decision-actions">
          <button className="secondary" disabled={readOnly} onClick={() => { conflict.current?.close(); openCreate(); }}>Resume existing draft</button>
          <button ref={cancelConflict} autoFocus className="secondary" onClick={() => conflict.current?.close()}>Keep draft and cancel edit</button>
          <button className="quiet" disabled={readOnly} onClick={() => { if (window.confirm(`Discard the existing draft and edit ${s.mountains.find(m => m.id === editId)?.title}?`)) { conflict.current?.close(); beginEdit(); } }}>Discard draft and edit this mountain</button>
          </div>
        </dialog>
        <dialog
          className="creation-dialog"
          ref={dialog}
          aria-labelledby="create-title"
          onCancel={closeCreate}
        >
          {creationOpen && (
            <TaskCreation
              snapshot={s}
              dispatch={dispatch}
              disabled={readOnly}
              onClose={closeCreate}
            />
          )}
        </dialog>
      </main>
    </div>
  );
}
