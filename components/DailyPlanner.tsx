"use client";
import { useEffect, useRef, useState } from "react";
import { activeCompletion, dateKey, type Snapshot } from "@/lib/domain";
import {
  parsePlanResponse,
  RequestGate,
  type PlanRequest,
} from "@/lib/planning";
import type { Action } from "@/lib/actions";
export default function DailyPlanner({
  snapshot: s,
  dispatch,
  disabled,
  onSelect,
}: {
  snapshot: Snapshot;
  dispatch: (a: Action) => boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false),
    [pending, setPending] = useState(false),
    [message, setMessage] = useState("");
  const gate = useRef(new RequestGate());
  useEffect(() => {
    if (disabled) gate.current.cancel();
  }, [disabled]);
  useEffect(() => {
    const g = gate.current;
    return () => g.cancel();
  }, []);
  const [todayNow, setTodayNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setTodayNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const date = dateKey(todayNow, s.calendarTimeZone),
    plan = s.dayPlans.find((p) => p.dateKey === date),
    ids = plan?.draftSubtaskIds ?? [];
  const candidates = s.subtasks
    .filter((t) => !t.archivedAt && !activeCompletion(s, t.id))
    .slice(0, 50);
  const committedIds = (plan?.commitments ?? []).filter(c => c.disposition === "planned" && !activeCompletion(s, c.subtaskId) && s.subtasks.some(t => t.id === c.subtaskId && !t.archivedAt)).map(c => c.subtaskId);
  const dirty = !!plan?.committedAt && JSON.stringify(ids) !== JSON.stringify(committedIds);
  const stateLabel = (id: string) => activeCompletion(s, id) ? "Completed" : s.completions.some(c => c.subtaskId === id && c.undoneAt) ? "Reopened" : s.sessions.some(x => x.subtaskId === id && ["saved", "interrupted", "expired"].includes(x.status)) ? "Saved" : "Ready";
  const draft = (
    next = ids,
    availability = plan?.availabilityText ?? "",
    minutes = plan?.availableMinutes ?? null,
  ) => {
    gate.current.cancel();
    setPending(false);
    setMessage("");
    dispatch({ type: "day-draft", date, ids: next, availability, minutes });
  };
  const total = ids.reduce(
    (sum, id) =>
      sum + (s.subtasks.find((t) => t.id === id)?.suggestedMinutes ?? 0),
    0,
  );
  const suggest = async () => {
    if (pending) return;
    const request: PlanRequest = {
      kind: "day",
      availability: `${plan?.availableMinutes ? `Available minutes: ${plan.availableMinutes}\n` : ""}${plan?.availabilityText ?? ""}`,
      candidates: candidates.map(({ id, title, suggestedMinutes }) => ({
        id,
        title,
        suggestedMinutes,
      })),
    };
    if (request.availability.length > 1000) {
      setMessage(
        "Shorten the availability note to include the minutes within 1000 characters.",
      );
      return;
    }
    const attempt = gate.current.begin();
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: attempt.signal,
      });
      const body = await response.json();
      if (!gate.current.current(attempt.id)) return;
      if (!response.ok)
        throw Error(body.error?.message ?? "Suggestion failed; edit manually.");
      const result = parsePlanResponse(body, request);
      if (result.kind !== "day") throw Error("Unexpected plan");
      dispatch({
        type: "day-draft",
        date,
        ids: result.orderedSubtaskIds,
        availability: plan?.availabilityText ?? "",
        minutes: plan?.availableMinutes ?? null,
      });
      setMessage(`AI draft, not committed: ${result.reason}`);
    } catch (e) {
      if (gate.current.current(attempt.id))
        setMessage(
          e instanceof Error
            ? e.message
            : "Planning failed; manual selection remains available.",
        );
    } finally {
      if (gate.current.current(attempt.id)) setPending(false);
    }
  };
  return (
    <section className="plan card" aria-labelledby="plan-title">
      <div className="plan-heading">
        <h2 id="plan-title">Today’s plan</h2>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            if (editing) {
              gate.current.cancel();
              setPending(false);
            }
            setEditing(!editing);
            setMessage("");
          }}
        >
          {editing ? "Close planner" : "Plan today"}
        </button>
      </div>
      <p className="session-time">
        {date} · {dirty ? "Unsaved plan changes" : plan?.committedAt ? "Committed plan" : "Not committed"}
      </p>
      {editing && (
        <div className="daily-editor">
          <div className="day-capacity">
          <details>
            <summary>What’s your day like? <small>(optional)</small></summary>
            <label>
            <span className="session-time">Add a short note</span>
            <textarea
              aria-label="What’s your day like?"
              placeholder="Busy afternoon; about 30 minutes free."
              rows={2}
              maxLength={900}
              disabled={disabled}
              value={plan?.availabilityText ?? ""}
              onChange={(e) => draft(ids, e.target.value)}
            />
          </label>
          </details>
          <label className="day-minutes">
            Time available today (optional)
            <input
              aria-label="Time available today (optional)"
              placeholder="Minutes"
              type="number"
              min={1}
              max={1440}
              disabled={disabled}
              value={plan?.availableMinutes ?? ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : Number(e.target.value);
                if (
                  value === null ||
                  (Number.isInteger(value) && value >= 1 && value <= 1440)
                )
                  draft(ids, undefined, value);
              }}
            />
          </label>
          </div>
          <div className="planner-columns">
          <fieldset>
            <legend>1 · Choose work for today</legend>
            {candidates.map((t) => (
              <label className={`check-label candidate-card ${ids.includes(t.id) ? "is-selected" : ""}`} key={t.id}>
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={ids.includes(t.id)}
                  onChange={(e) =>
                    draft(
                      e.target.checked
                        ? [...ids, t.id]
                        : ids.filter((id) => id !== t.id),
                    )
                  }
                />
                <span><strong>{t.title}</strong> — <span className="duration-badge">{t.suggestedMinutes} min</span>{" "}
                <small>
                  ({s.mountains.find((m) => m.id === t.mountainId)?.title})
                </small><small>{stateLabel(t.id)}</small></span>
              </label>
            ))}
            {!candidates.length && (
              <p>
                No unfinished actions. Create work or undo a mistaken
                completion.
              </p>
            )}
          </fieldset>
          <div className="selected-plan">
           <h3>2 · Review order</h3>
           <p className="plan-total">{ids.length} {ids.length === 1 ? "action" : "actions"} · {total >= 60 ? `${Math.floor(total / 60)}h ${total % 60}m` : `${total}m`} planned</p>
           <p className="session-time">{total} minutes suggested.</p>
           <p className="session-time">Session lengths, not completion estimates.</p>
          <p className="session-time" id="commit-help">{ids.length ? "Review the order, then commit. Suggestions stay editable." : plan?.commitments.length ? "Commit this empty selection to clear the remaining plan. History is kept." : "Choose work to continue, or let AI choose from your unfinished actions."}</p>
          {plan?.availableMinutes && total > plan.availableMinutes ? (
            <p className="notice">
              This is more than your {plan.availableMinutes} available minutes.
              Consider choosing fewer actions. You can still commit
              deliberately.
            </p>
          ) : null}
          <ol className="plan-list">
            {ids.map((id, i) => (
              <li key={id}>
                <span className="sequence-number">{i + 1}</span>{" "}{s.subtasks.find((t) => t.id === id)?.title}
                <span className="duration-badge"> · {s.subtasks.find(t => t.id === id)?.suggestedMinutes} min</span>
                <small className="project-context">{s.mountains.find(m => m.id === s.subtasks.find(t => t.id === id)?.mountainId)?.title}</small>
                <div className="button-row">
                  <button
                    className="secondary"
                    disabled={disabled || i === 0}
                    aria-label={`Move planned action ${i + 1} up`}
                    onClick={() => {
                      const next = [...ids];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      draft(next);
                    }}
                  >
                    Move up
                  </button>
                  <button
                    className="secondary"
                    disabled={disabled || i === ids.length - 1}
                    aria-label={`Move planned action ${i + 1} down`}
                    onClick={() => {
                      const next = [...ids];
                      [next[i + 1], next[i]] = [next[i], next[i + 1]];
                      draft(next);
                    }}
                  >
                    Move down
                  </button>
                </div>
              </li>
            ))}
           </ol>
           <h3>3 · Confirm today’s plan</h3>
           <p className="session-time">{dirty ? "Draft changes are not committed yet." : plan?.committedAt ? "This order matches your committed unfinished work." : "Nothing is committed until you confirm."}</p>
           <div className="button-row">
            <button
              className="secondary"
              aria-describedby="ai-plan-help"
              disabled={disabled || pending || !candidates.length}
              onClick={suggest}
            >
              {pending ? "Suggesting…" : "Suggest a plan with AI"}
            </button>
            <button
              className="primary"
              disabled={disabled || !plan || !ids.length && !plan.commitments.length}
              aria-describedby="commit-help"
              onClick={() => {
                gate.current.cancel();
                setPending(false);
                if (dispatch({ type: "day-commit", date })) {
                  setMessage(
                    "Today’s plan committed. Later changes retain commitment history.",
                  );
                  setEditing(false);
                }
              }}
            >
              {plan?.committedAt ? "Save plan changes" : "Commit today’s plan"}
            </button>
          </div>
          <p className="session-time" id="ai-plan-help">{candidates.length ? "AI can choose and order unfinished actions; selecting them first is optional." : "Add an unfinished action to use AI planning."}</p>
          {pending && (
            <button
              className="secondary"
              onClick={() => {
                gate.current.cancel();
                setPending(false);
              }}
            >
              Cancel suggestion
            </button>
          )}
          </div>
          </div>
        </div>
      )}
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {!editing && <><h3>Committed work</h3><ol className="plan-list committed-plan">
        {(plan?.commitments ?? []).map((c) => (
          <li key={c.id}>
            <div className="plan-row">
              <button
                className="secondary"
                aria-pressed={s.selection.selectedSubtaskId === c.subtaskId}
                disabled={disabled || c.disposition !== "planned"}
                onClick={() => onSelect(c.subtaskId)}
              >
                {activeCompletion(s, c.subtaskId) ? "✓ " : ""}
                {c.titleSnapshot}
                <small className="project-context">{s.mountains.find(m => m.id === s.subtasks.find(t => t.id === c.subtaskId)?.mountainId)?.title}</small>
              </button>
              <span>
                {c.disposition === "planned"
                  ? activeCompletion(s, c.subtaskId)
                    ? "Completed"
                    : "Planned"
                  : c.disposition}
              </span>
              {c.disposition === "planned" &&
                !activeCompletion(s, c.subtaskId) && (
                  <>
                    <button
                      className="secondary"
                      disabled={disabled}
                      aria-label={`Remove commitment ${c.titleSnapshot}`}
                      onClick={() =>
                        dispatch({
                          type: "disposition",
                          date,
                          id: c.id,
                          disposition: "removed",
                        })
                      }
                    >
                      Remove
                    </button>
                    <button
                      className="secondary"
                      disabled={disabled}
                      aria-label={`Defer commitment ${c.titleSnapshot}`}
                      onClick={() =>
                        dispatch({
                          type: "disposition",
                          date,
                          id: c.id,
                          disposition: "deferred",
                        })
                      }
                    >
                      Defer
                    </button>
                  </>
                )}
            </div>
          </li>
        ))}
      </ol></>}
      {!editing && !plan?.commitments.length && (
        <p className="empty-plan">
          No work committed today.
        </p>
      )}
      <details className="other-work">
        <summary>Switch work</summary>
        <p className="session-time">Choose an action to reveal it. Start or Resume separately.</p>
        {![...s.subtasks].some(t => !t.archivedAt && !activeCompletion(s, t.id)) && <p>No unfinished work. Completed work remains below.</p>}
        {[false, true].map(done => {
          const groups = s.mountains.map(m => ({ mountain: m, tasks: s.subtasks.filter(t => t.mountainId === m.id && !t.archivedAt && !!activeCompletion(s, t.id) === done) })).filter(g => g.tasks.length);
          const content = groups.map(({mountain, tasks}) => <section className="work-group" key={mountain.id} aria-label={mountain.title}>
            <h3>{mountain.title} <small>· {tasks.length} {done ? "completed" : "unfinished"}</small></h3>
            <ul className="plan-list">{tasks.map(t => <li key={t.id}>
              <button disabled={disabled} aria-pressed={s.selection.selectedSubtaskId === t.id} onClick={() => onSelect(t.id)}>
                <span>{t.title}</span><small>{mountain.title} · {t.suggestedMinutes} min · {stateLabel(t.id)}{s.selection.selectedSubtaskId === t.id ? " · Current selection" : ""}</small>
              </button>
            </li>)}</ul>
          </section>);
          return done ? <details className="completed-work" key="done"><summary>Completed work · {groups.reduce((n,g) => n + g.tasks.length, 0)}</summary>{content.length ? content : <p>No completed work yet.</p>}</details> : <div key="unfinished">{content}</div>;
        })}
      </details>
    </section>
  );
}
