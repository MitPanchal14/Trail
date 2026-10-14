"use client";
import { useRef, useState } from "react";
import MountainWorld from "./MountainWorld";
import SampleToday from "./SampleToday";
import { useWorkTrail } from "@/lib/use-work-trail";
import { activeCompletion, currentSession } from "@/lib/domain";
import { downloadPrivate } from "@/lib/storage";

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
    [minutes, setMinutes] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    form = useRef<HTMLFormElement>(null);
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
  const openCreate = () => dialog.current?.showModal();
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
          <span className="future-nav">
            ♧ Mountains <small>Later</small>
          </span>
          <span className="future-nav">
            ▦ Progress <small>Later</small>
          </span>
        </nav>
        <div className="side-bottom">
          <p>
            Private to this browser.
            <br />
            No account or sync.
          </p>
        </div>
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
                : "Browser-local records"}
          </span>
        </header>
        <div className="heading">
          <div>
            <h1>
              {focused
                ? "One action at a time."
                : completion
                  ? "A checkpoint earned."
                  : session
                    ? "Your place is waiting."
                    : task
                      ? "Your next stretch."
                      : "Every path starts here."}
            </h1>
            <p>
              {focused
                ? "Time records your commitment, not proof of attention."
                : completion
                  ? "Your action is complete. The larger goal is not automatically finished."
                  : task
                    ? "Pick up your next action."
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
        <div className="bento">
          <section className="world" aria-labelledby="world-title">
            <div className="world-heading">
              <div>
                <p className="eyebrow">
                  {mountain?.title ?? "An open landscape"}
                </p>
                <h2 id="world-title">
                  {earned.length
                    ? "A little more light."
                    : "A world of possibility."}
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
            />
            <div className="world-footer">
              <span className="pill">
                {earned.length
                  ? `✦ ${earned.length} earned checkpoint${earned.length === 1 ? "" : "s"}`
                  : "○ No checkpoints yet"}
              </span>
              <span>
                {session && !completion
                  ? "Blue frame: current / saved place"
                  : "No summit confirmation"}
              </span>
              <span className="trail-key">
                Gold: completed · Grey path: ahead
              </span>
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
                {task?.nextAction ?? "What would you like to move forward?"}
              </h2>
              {mountain && <p>Finish condition: {mountain.finishCondition}</p>}
            </div>
            {session && !completion && !focused && (
              <div className="context">
                <span aria-hidden="true">⚑</span>
                <div>
                  <strong>Where you left off</strong>
                  <p>
                    {session.note ||
                      "No note saved. Your action and remaining commitment are retained."}
                  </p>
                  <p>
                    Last recorded:{" "}
                    {new Date(session.lastHeartbeatAt).toLocaleString()}
                  </p>
                </div>
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
                <label className="note-label" htmlFor="context-note">
                  Where did you stop? <span>(optional)</span>
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
                  onClick={() => {
                    if (dispatch({ type: "complete" })) setFocus(false);
                  }}
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
                  onClick={() => dispatch({ type: "undo", id: completion.id })}
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
                      <p className="session-time">
                        Recorded session time:{" "}
                        {Math.floor(session.creditedMs / 1000)} seconds
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
                        onClick={() => dispatch({ type: "complete" })}
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
          </section>
        </div>
        {!focused && (
          <>
            <section className="plan card" aria-labelledby="plan-title">
              <div className="plan-heading">
                <h2 id="plan-title">
                  Your work{" "}
                  <span>
                    {s.subtasks.length} action
                    {s.subtasks.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <span className="plan-label">
                  Manual tasks · day planning comes later
                </span>
              </div>
              {!s.subtasks.length ? (
                <div className="empty-plan">
                  <p>No tasks yet. Add your first action to begin.</p>
                </div>
              ) : (
                <ul className="plan-list">
                  {s.subtasks.map((t) => (
                    <li key={t.id}>
                      <button
                        disabled={readOnly}
                        aria-pressed={t.id === task?.id}
                        onClick={() => {
                          dispatch({ type: "select", id: t.id });
                          setMinutes(String(t.suggestedMinutes));
                        }}
                      >
                        <span
                          className={
                            activeCompletion(s, t.id) ? "done" : "step"
                          }
                        >
                          {activeCompletion(s, t.id) ? "✓" : "○"}
                        </span>
                        <span>
                          <strong>{t.title}</strong>
                          <small>
                            {
                              s.mountains.find((m) => m.id === t.mountainId)
                                ?.title
                            }{" "}
                            ·{" "}
                            {activeCompletion(s, t.id)
                              ? "Completed"
                              : "Unfinished"}
                          </small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
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
                <strong>Your records stay on this device</strong>
                <p>
                  No sync. Download a private recovery copy before clearing
                  browser data.
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
            <p className="recovery-copy">
              Closed-tab recovery uses the last durable heartbeat. Throttling or
              a crash may leave an older snapshot; time away is never credited.
            </p>
          </>
        )}
        <dialog ref={dialog} aria-labelledby="create-title">
          <h2 id="create-title">Give your work a starting place.</h2>
          <form
            className="task-form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const applied = dispatch({
                type: "create",
                title: String(data.get("title")),
                finishCondition: String(data.get("finish")),
                action: String(data.get("action")),
                minutes: Number(data.get("minutes")),
              });
              if (!applied) return;
              setMinutes(String(data.get("minutes")));
              dialog.current?.close();
              e.currentTarget.reset();
            }}
          >
            <label>
              Mountain name
              <input name="title" required maxLength={500} autoComplete="off" />
            </label>
            <label>
              Finish condition
              <input name="finish" required maxLength={500} />
            </label>
            <label>
              First action
              <input name="action" required maxLength={500} />
            </label>
            <label>
              Suggested session (minutes)
              <input
                name="minutes"
                required
                type="number"
                min={1}
                max={120}
                step={1}
                defaultValue={20}
              />
            </label>
            <button className="primary" disabled={readOnly}>
              Create task
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => dialog.current?.close()}
            >
              Cancel
            </button>
          </form>
        </dialog>
      </main>
    </div>
  );
}
