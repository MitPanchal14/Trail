"use client";
import { useEffect, useRef, useState } from "react";
import MountainWorld from "./MountainWorld";
import SampleToday from "./SampleToday";
import { useWorkTrail } from "@/lib/use-work-trail";
import { activeCompletion, currentSession } from "@/lib/domain";
import { downloadPrivate } from "@/lib/storage";
import TaskCreation from "./TaskCreation";
import DailyPlanner from "./DailyPlanner";
import { newDraft, meaningfulDraft, distinctInstruction } from "@/lib/planning";

const clock = (ms: number) =>
  `${Math.floor(Math.ceil(ms / 1000) / 60)
    .toString()
    .padStart(
      2,
      "0",
    )}:${(Math.ceil(ms / 1000) % 60).toString().padStart(2, "0")}`;
export default function TodayView() {
  const { snapshot: s, owned, warning, notice, dispatch, raw } = useWorkTrail();
  const [samples, setSamples] = useState(false),
    [focus, setFocus] = useState(false),
    [creationOpen, setCreationOpen] = useState(false),
    [minutes, setMinutes] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
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
  const returnStep = returning ? session.returnStep.trim() : "";
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
  const editBreakdown = () => {
    if (!mountain) return;
    if (s.creationDraft) {
      openCreate();
      return;
    }
    const draft = newDraft();
    dispatch({
      type: "draft",
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
    });
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
        Skip to Today
      </a>
      <aside className="sidebar">
        <a className="brand" href="#main">
          <span className="brand-mark" aria-hidden="true">
            ▟
          </span>
          work trail.
        </a>
        <nav aria-label="Main">
          <a className="nav-active" href="#main" aria-current="page">
            ◉ Today
          </a>
        </nav>
      </aside>
      <main id="main">
        {storageNotice}
        <header className="topline">
          <span>{focused ? "Focus" : "Today"}</span>
          <span>
            {warning
              ? "Changes not saved"
              : readOnly
                ? "Read-only"
                : ""}
          </span>
        </header>
        <div className="heading">
          <div>
            <h1 ref={heading} tabIndex={-1}>
              {focused
                ? "One action at a time."
                : completion
                  ? "A checkpoint earned."
                  : session
                     ? "Continue your work"
                    : task
                       ? "Next up"
                      : "Every path starts here."}
            </h1>
            <p role={completion ? "status" : undefined} className={completion ? "earned-confirmation" : undefined}>
              {focused
                ? "Time records your commitment, not proof of attention."
                : completion
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
        <div className={`bento work-bento ${returning ? "has-saved-work" : ""}`}>
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
            />
            <div className="world-footer">
              <span className="pill">
                {earned.length
                  ? `✦ ${earned.length} earned checkpoint${earned.length === 1 ? "" : "s"}`
                  : "○ No checkpoints yet"}
              </span>
              <span className={returning ? "saved-label" : ""}>
                {returning ? "⚑ Saved campsite" : focused ? "Walking in place · no progress earned" : completion ? "✦ Action complete" : "○ Next checkpoint ahead"}
              </span>
              <details className="trail-key"><summary>Trail key</summary><p>Amber lanterns: completed work. Blue frame and tent: saved place. Pale path: work ahead.</p></details>
            </div>
          </section>
          <section
            className="action card real-action"
            aria-labelledby="action-title"
          >
            <div>
              <span className="tag">
                {completion
                  ? "Completed action"
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
              <h2 id="action-title">
                {returnStep || task?.title || "What would you like to move forward?"}
              </h2>
              {returnStep && <p className="original-action">Action: {task?.title}</p>}
              {task && !completion && !returning && <p className="destination">Destination: checkpoint {task.checkpointSlot + 1}</p>}
              {task && !returnStep && distinctInstruction(task.title, task.nextAction) && <p className="next-instruction">{task.nextAction}</p>}
              {mountain && <p className="finish-condition">Finish condition: {mountain.finishCondition}</p>}
            </div>
            {returning && session.note.trim() && (
              <details className="context" open={session.note.length <= 200}>
                <summary>Where I stopped</summary>
                <p>{session.note}</p>
              </details>
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
                <details className="return-note">
                  <summary>Return note (optional)</summary>
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
                </details>
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
                <p className="session-time">
                  Completed {new Date(completion.completedAt).toLocaleString()}
                </p>
                <button
                  className="secondary"
                  disabled={readOnly}
                  onClick={() => { setCelebration(null); dispatch({ type: "undo", id: completion.id }); }}
                >
                  Undo completion
                </button>
                <button
                  className="primary"
                  disabled={readOnly}
                  onClick={openCreate}
                >
                  Add another task
                </button>
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
            {!focused && <div className="task-tools">
              {returning && <details className="session-details"><summary>Session details</summary><p>Last saved: {new Date(session.lastHeartbeatAt).toLocaleString()}</p><p>Recorded session time: {Math.floor(session.creditedMs / 1000)} seconds</p></details>}
              {mountain && <button className="quiet edit-breakdown" disabled={readOnly} onClick={editBreakdown}>Edit breakdown</button>}
            </div>}
          </section>
        </div>
        {!focused && (
          <>
            <DailyPlanner
              snapshot={s}
              dispatch={dispatch}
              disabled={readOnly}
              onSelect={(id) => {
                dispatch({ type: "select", id });
                setMinutes(null);
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
            {earned.length > 0 && (
              <section
                className="checkpoints"
                aria-label="Recorded checkpoint details"
              >
                <h2>On this trail</h2>
                {earned.map((c) => (
                  <details key={c.id}>
                    <summary>
                      ✓ {s.subtasks.find((t) => t.id === c.subtaskId)?.title}
                    </summary>
                    <p>
                      Completed {new Date(c.completedAt).toLocaleString()} ·{" "}
                      {c.localDate} ({c.calendarTimeZone})
                    </p>
                    <p>{c.note || "No context note recorded."}</p>
                    <p>
                      Recorded session time:{" "}
                      {Math.floor(
                        s.sessions
                          .filter((x) => c.sessionIds.includes(x.id))
                          .reduce((sum, x) => sum + x.creditedMs, 0) / 1000,
                      )}{" "}
                      seconds
                    </p>
                    <button
                      className="secondary"
                      disabled={readOnly}
                      onClick={() => dispatch({ type: "undo", id: c.id })}
                    >
                      Undo completion
                    </button>
                  </details>
                ))}
              </section>
            )}
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
