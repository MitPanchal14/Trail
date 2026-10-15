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
  const draft = (
    next = ids,
    availability = plan?.availabilityText ?? "",
    minutes = plan?.availableMinutes ?? null,
  ) => {
    gate.current.cancel();
    setPending(false);
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
          }}
        >
          {editing ? "Close planner" : "Plan today"}
        </button>
      </div>
      <p className="session-time">
        {date} · {s.calendarTimeZone}. Unfinished work stays available across
        days.
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
            <legend>Choose work for today</legend>
            {candidates.map((t) => (
              <label className="check-label" key={t.id}>
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
                {t.title} — {t.suggestedMinutes} min{" "}
                <small>
                  ({s.mountains.find((m) => m.id === t.mountainId)?.title})
                </small>
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
          <h3>Your plan</h3>
          <p className="plan-total">{total} minutes suggested.</p>
          <p className="session-time">Edit any suggestion, then commit when ready. AI never commits automatically.</p>
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
                {s.subtasks.find((t) => t.id === id)?.title}
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
          <div className="button-row">
            <button
              className="secondary"
              disabled={disabled || pending || !candidates.length}
              onClick={suggest}
            >
              {pending ? "Suggesting…" : "Suggest a plan with AI"}
            </button>
            <button
              className="primary"
              disabled={disabled || !plan}
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
              Commit today’s plan
            </button>
          </div>
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
      <ul className="plan-list">
        {(plan?.commitments ?? []).map((c) => (
          <li key={c.id}>
            <div className="plan-row">
              <button
                className="secondary"
                disabled={disabled || c.disposition !== "planned"}
                onClick={() => onSelect(c.subtaskId)}
              >
                {activeCompletion(s, c.subtaskId) ? "✓ " : ""}
                {c.titleSnapshot}
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
      </ul>
      {!plan?.commitments.length && (
        <p className="empty-plan">
          No actions committed today. Plan a manageable selection; drafting
          alone creates no commitments.
        </p>
      )}
      <details>
        <summary>Choose other work</summary>
        <ul className="plan-list">
          {s.subtasks
            .filter((t) => !t.archivedAt)
            .map((t) => (
              <li key={t.id}>
                <button disabled={disabled} onClick={() => onSelect(t.id)}>
                  <span>{t.title}</span>
                  <small>
                    {s.mountains.find((m) => m.id === t.mountainId)?.title} ·{" "}
                    {activeCompletion(s, t.id) ? "Completed" : "Unfinished"}
                  </small>
                </button>
              </li>
            ))}
        </ul>
      </details>
    </section>
  );
}
