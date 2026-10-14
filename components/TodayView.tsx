"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import MountainWorld from "./MountainWorld";
type Case = "empty" | "one" | "saved" | "rich";
const steps = [
  "Choose a subject for the field guide",
  "Sketch the first woodland spread",
  "Add notes on leaves and bark",
  "Review the page for clarity",
  "Prepare a printable draft",
  "Check the final layout",
];
export default function TodayView() {
  const [sample, setSample] = useState<Case>("empty");
  const [selected, setSelected] = useState(1);
  const [minutes, setMinutes] = useState("20");
  const dialog = useRef<HTMLDialogElement>(null);
  const empty = sample === "empty",
    saved = sample === "saved",
    count = sample === "rich" ? 6 : empty ? 0 : 1;
  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to Today
      </a>
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            ▟
          </span>
          work trail.
        </Link>
        <nav aria-label="Main">
          <Link className="nav-active" href="/" aria-current="page">
            ◉ <span>Today</span>
          </Link>
          <span className="future-nav">
            ♧ Mountains <small>Later</small>
          </span>
          <span className="future-nav">
            ▦ Progress <small>Later</small>
          </span>
        </nav>
        <div className="side-bottom">
          <span className="little-tree" aria-hidden="true">
            ♧
          </span>
          <p>Work Trail</p>
        </div>
      </aside>
      <main id="main">
        <header className="topline">
          <span>Today</span>
          <span>◌ Private by default</span>
        </header>
        <div className="heading">
          <div>
            <h1>
              {empty
                ? "Every path starts here."
                : saved
                  ? "Your place is waiting."
                  : "The path you’re making."}
            </h1>
            <p>
              {empty
                ? "Make room for one thing you want to move forward."
                : saved
                  ? "Pick up where you left off."
                  : "Choose your next step."}
            </p>
          </div>
          <button
            className="secondary"
            onClick={() => dialog.current?.showModal()}
          >
            ＋ New task
          </button>
        </div>
        {!empty && (
          <div className="sample-notice" role="status">
            Sample preview — fictional records, not your activity. Nothing is
            saved.
          </div>
        )}
        <div className="bento">
          <section className="world" aria-labelledby="world-title">
            <div className="world-heading">
              <div>
                <p className="eyebrow">
                  {empty
                    ? "An open landscape"
                    : "Sample mountain · Woodland field guide"}
                </p>
                <h2 id="world-title">
                  {empty ? "A world of possibility." : "A little more light."}
                </h2>
              </div>
              <span aria-hidden="true">↗</span>
            </div>
            <MountainWorld count={count} saved={saved} />
            <div className="world-footer">
              <span className="pill">
                {empty
                  ? "○ No checkpoints yet"
                  : `✦ ${count} sample checkpoint${count === 1 ? "" : "s"}`}
              </span>
              <span>
                {empty
                  ? "Your first step belongs here."
                  : saved
                    ? "Blue frame: saved place, not completed"
                    : "Blue frame: current position"}
              </span>
              {!empty && (
                <span className="trail-key">
                  Gold: completed · Grey path: ahead
                </span>
              )}
            </div>
          </section>
          <section className="action card" aria-labelledby="action-title">
            <div>
              <span className="tag">
                {empty
                  ? "Your next action"
                  : saved
                    ? "Ⅱ Sample place saved"
                    : "↗ Sample next action"}
              </span>
              <h2 id="action-title">
                {empty
                  ? "What would you like to move forward?"
                  : steps[selected]}
              </h2>
              {!saved && (
                <p>
                  {empty
                    ? "Choose a goal, then begin with one small action."
                    : "Draw a rough page with room for one tree, its leaf, and a short description."}
                </p>
              )}
            </div>
            {saved && (
              <div className="context">
                <span aria-hidden="true">{saved ? "⚑" : "⌁"}</span>
                <div>
                  <strong>
                    {saved
                      ? "Where you left off"
                      : empty
                        ? "No need to have it all figured out."
                        : "A manageable next stretch"}
                  </strong>
                  <p>
                    {saved
                      ? "The oak sketch is ready. Next, leave space beside it for the leaf details."
                      : empty
                        ? "Your mountain grows from completed actions, not from time passing."
                        : "Adjust the session to fit the time you have."}
                  </p>
                </div>
              </div>
            )}
            {!empty && (
              <div className="duration">
                <label htmlFor="duration">
                  Session length<small>A commitment, not a deadline</small>
                </label>
                <div>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    max="120"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  />{" "}
                  min
                </div>
              </div>
            )}
            <button
              className="primary"
              onClick={() => dialog.current?.showModal()}
            >
              {empty
                ? "＋ Add your first task"
                : saved
                  ? "Preview Resume"
                  : "Preview Start"}
              <span aria-hidden="true">↗</span>
            </button>
            <p className="action-foot">
              {empty
                ? "Visual preview · task creation is not active."
                : "Visual preview only · focus sessions are not active."}
            </p>
          </section>
        </div>
        <section className="plan card" aria-labelledby="plan-title">
          <div className="plan-heading">
            <div>
              <h2 id="plan-title">
                Today’s plan{" "}
                <span>{empty ? "0 actions" : "3 sample actions"}</span>
              </h2>
            </div>
            <span className="plan-label">
              {empty ? "Nothing committed yet" : "Sample plan"}
            </span>
          </div>
          {empty ? (
            <div className="empty-plan">
              <span aria-hidden="true">⌁</span>
              <div>
                <strong>A clear day, an open trail.</strong>
                <p>Add a task to begin. Your day plan will live here.</p>
              </div>
            </div>
          ) : (
            <ol className="plan-list">
              {steps.slice(0, 3).map((title, i) => (
                <li key={title}>
                  {i === 0 ? (
                    <div className="plan-row">
                      <span className="done">✓</span>
                      <span>
                        <strong>{title}</strong>
                        <small>Sample completed</small>
                      </span>
                      <span className="plan-time">Recorded</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelected(i)}
                      aria-pressed={selected === i}
                    >
                      <span className="step">{i + 1}</span>
                      <span>
                        <strong>{title}</strong>
                        <small>
                          {i === 1 && saved
                            ? "Sample saved place"
                            : "Sample planned"}
                        </small>
                      </span>
                      <span className="plan-time">20 min</span>
                    </button>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
        {count > 0 && (
          <section
            className="checkpoints"
            aria-label="Sample checkpoint details"
          >
            <h2>On this sample trail</h2>
            {(sample === "rich"
              ? [
                  "Gather field guide references",
                  "Choose the page size",
                  "Collect woodland photographs",
                  "Study reference layouts",
                  "Set up the sketchbook",
                  steps[0],
                ]
              : steps.slice(0, count)
            ).map((title, i) => (
              <details key={title}>
                <summary>✓ {title}</summary>
                <p>
                  Fictional checkpoint {i + 1} · October {8 + i}, 2026. Sample
                  completed action; no personal work is recorded.
                </p>
              </details>
            ))}
          </section>
        )}
        <footer className="preview-controls">
          <div>
            <strong>Explore the visual states</strong>
            <p>Opt-in samples only. Refresh returns to an empty Today.</p>
          </div>
          <label htmlFor="sample">
            Preview state
            <select
              id="sample"
              value={sample}
              onChange={(e) => {
                setSample(e.target.value as Case);
                setSelected(1);
              }}
            >
              <option value="empty">Empty · real first use</option>
              <option value="one">Sample · one checkpoint</option>
              <option value="saved">Sample · saved context</option>
              <option value="rich">Sample · rich history</option>
            </select>
          </label>
        </footer>
        <dialog ref={dialog} aria-labelledby="preview-title">
          <h2 id="preview-title">The first stretch is visual.</h2>
          <p>
            This is a visual preview. Task creation, focus sessions and saving
            are not active. No activity has been created.
          </p>
          <form method="dialog">
            <button className="primary">Back to Today</button>
          </form>
        </dialog>
      </main>
    </div>
  );
}
