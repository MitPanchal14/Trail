"use client";
import AiAvailability, { useAiAvailability } from "./AiAvailability";
import { useEffect, useRef, useState } from "react";
import {
  combinedDescription,
  meaningfulDraft,
  RequestGate,
  parsePlanResponse,
  type CreationDraft,
  type PlanRequest,
} from "@/lib/planning";
import type { Action } from "@/lib/actions";
import type { Snapshot } from "@/lib/domain";
type Recognition = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
};
export default function TaskCreation({
  snapshot,
  dispatch,
  disabled,
  onClose,
}: {
  snapshot: Snapshot;
  dispatch: (a: Action) => boolean;
  disabled: boolean;
  onClose: () => void;
}) {
  const d = snapshot.creationDraft;
  const ai = useAiAvailability();
  const [review, setReview] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [recording, setRecording] = useState(false);
  const gate = useRef(new RequestGate()),
    speech = useRef<Recognition | null>(null),
    draftRef = useRef(d);
  const addedTitle = useRef<string | null>(null);
  const manualHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!addedTitle.current) return;
    const input = document.getElementById(`title-${addedTitle.current}`);
    input?.focus();
    input?.scrollIntoView({ block: "nearest" });
    addedTitle.current = null;
  }, [d?.steps.length]);
  useEffect(() => {
    if (disabled) {
      gate.current.cancel();
      speech.current?.abort();
    }
  }, [disabled]);
  useEffect(() => {
    draftRef.current = d;
  }, [d]);
  useEffect(() => {
    const g = gate.current;
    return () => {
      g.cancel();
      speech.current?.abort();
    };
  }, []);
  if (!d) return null;
  const update = (next: CreationDraft) => {
    gate.current.cancel();
    setPending(false);
    draftRef.current = next;
    dispatch({ type: "draft", draft: next });
  };
  const change = (patch: Partial<CreationDraft>) => update({ ...d, ...patch });
  const close = () => {
    gate.current.cancel();
    speech.current?.abort();
    setRecording(false);
    onClose();
  };
  const request = async () => {
    if (!ai.available) return;
    if (pending) return;
    if (d.editingMountainId) {
      setError(
        "Edit accepted actions manually to preserve their identities and recorded history. AI revisions are available before first acceptance.",
      );
      return;
    }
    const input: PlanRequest = {
      kind: "breakdown",
      description: combinedDescription(d),
    };
    if (!input.description.trim() || input.description.length > 6000) {
      setError(
        "Describe the work; keep the combined description and context under 6000 characters.",
      );
      return;
    }
    const attempt = gate.current.begin();
    setPending(true);
    setError("");
    speech.current?.stop();
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: attempt.signal,
      });
      const body = await response.json().catch(() => { throw Error("AI returned an unusable response. Your input is retained; edit manually or retry explicitly."); });
      if (!gate.current.current(attempt.id)) return;
      if (!response.ok)
        throw Error(
          body.error?.message ?? "AI is unavailable. Edit manually or retry.",
        );
      const result = (() => {
        try { return parsePlanResponse(body, input); }
        catch { throw Error("AI returned an unusable draft. Your input is retained; edit manually or retry explicitly."); }
      })();
      if (result.kind !== "breakdown" && result.kind !== "clarification") throw Error("Unexpected draft");
      if (result.kind === "clarification") {
        dispatch({
          type: "draft",
          draft: { ...draftRef.current!, clarification: result.question },
        });
      } else {
        dispatch({
          type: "draft",
          draft: {
            ...draftRef.current!,
            goal: result.goal,
            finishCondition: result.finishCondition,
            clarification: "",
            steps: result.steps.map((step) => ({
              ...step,
              key: crypto.randomUUID(),
              existingId: null,
            })),
          },
        });
        setReview(true);
      }
    } catch (e) {
      if (gate.current.current(attempt.id))
        setError(
          e instanceof Error
            ? e.message
            : "Planning failed. Your input is retained.",
        );
    } finally {
      if (gate.current.current(attempt.id)) setPending(false);
    }
  };
  const startVoice = () => {
    if (recording) {
      speech.current?.stop();
      return;
    }
    const platform = window as unknown as {
      SpeechRecognition?: new () => Recognition;
      webkitSpeechRecognition?: new () => Recognition;
    };
    const Constructor =
      platform.SpeechRecognition ?? platform.webkitSpeechRecognition;
    if (!Constructor) {
      setError(
        "Voice is unavailable in this browser. Keep typing; your text is retained.",
      );
      return;
    }
    const recognition = new Constructor();
    speech.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const previous = draftRef.current;
      if (!previous) return;
      const transcript = Array.from(e.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ");
      update({
        ...previous,
        description: `${previous.description} ${transcript}`
          .trim()
          .slice(0, 6000),
      });
    };
    recognition.onerror = () => {
      setError(
        "Microphone permission was denied or recognition failed. Typing remains available; existing text is retained.",
      );
      setRecording(false);
    };
    recognition.onend = () => setRecording(false);
    try {
      recognition.start();
      setRecording(true);
    } catch {
      setError("Voice could not start. Keep typing.");
    }
  };
  const move = (index: number, delta: number) => {
    const steps = [...d.steps];
    [steps[index], steps[index + delta]] = [steps[index + delta], steps[index]];
    change({ steps });
  };
  const setStep = (
    index: number,
    patch: Partial<CreationDraft["steps"][number]>,
  ) =>
    change({
      steps: d.steps.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });
  return (
    <div className="creation-flow">
      <div className="creation-heading"><h2 id="create-title">
        {d.editingMountainId
          ? "Review your breakdown"
           : "New task"}
      </h2><button type="button" className="quiet" onClick={close}>{meaningfulDraft(d) ? "Close · keep draft" : "Close"}</button></div>
      {!d.editingMountainId && <><p>
        A rough description is enough. Nothing becomes work until you review and
        accept.
      </p>
      <label htmlFor="work-description">
        Describe the work
        <textarea
          id="work-description"
          aria-label="Describe the work"
          maxLength={6000}
          value={d.description}
          disabled={disabled}
          onChange={(e) => change({ description: e.target.value })}
        />
      </label>
      <div className="voice-capture">
        <button className="quiet" type="button" disabled={disabled} onClick={startVoice}>
          {recording ? "Stop recording" : "Use microphone"}
        </button>
        <p className="session-time">Optional voice may send audio to your platform’s recognition service. Check the transcript before using AI.</p>
      </div>
      <details>
        <summary>Optional context</summary>
        {(["alreadyDone", "stuck", "constraints"] as const).map((field, i) => (
          <label key={field} htmlFor={`capture-${field}`}>
            {
              [
                "What has already been done",
                "Where you are stuck",
                "Relevant constraints",
              ][i]
            }
            <textarea
              id={`capture-${field}`}
              aria-label={
                [
                  "What has already been done",
                  "Where you are stuck",
                  "Relevant constraints",
                ][i]
              }
              value={d[field]}
              maxLength={2000}
              disabled={disabled}
              onChange={(e) => change({ [field]: e.target.value })}
            />
          </label>
        ))}
      </details>
      <div className="button-row">
        <button
          type="button"
          className="primary"
           disabled={disabled || pending || !ai.available}
          onClick={request}
        >
          {pending ? "Preparing draft…" : "Build with AI"}
        </button>
      </div>
      <AiAvailability message={ai.message} recheck={ai.recheck} />
      <p className="session-time">
        Build with AI sends the description and context to Gemini. Review and accept the draft before it becomes work.
      </p>
      {pending && (
        <button
          type="button"
          className="secondary"
          onClick={() => {
            gate.current.cancel();
            setPending(false);
          }}
        >
          Cancel request
        </button>
      )}
      {d.clarification && (
        <p className="notice" role="status">
          {d.clarification} Add your answer to the description above, then
          request again.
        </p>
      )}
      {error && (
        <p className="notice" role="status">
          {error}
        </p>
      )}
      <button
        className="secondary"
        type="button"
        disabled={disabled}
        onClick={() => {
          gate.current.cancel();
          setPending(false);
          setReview(true);
          requestAnimationFrame(() => {
            manualHeading.current?.focus({ preventScroll: true });
            manualHeading.current?.scrollIntoView({ block: "start" });
          });
          if (!d.steps.length)
            change({
              steps: [
                {
                  key: crypto.randomUUID(),
                  existingId: null,
                  title: "",
                  nextAction: "",
                  suggestedMinutes: 20,
                },
              ],
            });
        }}
      >
        Write manually
      </button>
      </>}
      {(review || d.goal || d.steps.length > 0) && (
        <form
          className="task-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (dispatch({ type: "accept", draftId: d.id })) {
              setReview(false);
              close();
            }
          }}
        >
          <h3 ref={manualHeading} tabIndex={-1}>Review the entire breakdown</h3>
          <p>
            Suggested minutes are bounded sessions, not promises of finishing.
            Edit or remove anything that does not fit.
          </p>
          <label>
            Mountain name
            <input
              value={d.goal}
              required
              maxLength={500}
              disabled={disabled}
              onChange={(e) => change({ goal: e.target.value })}
            />
          </label>
          <label>
            Finish condition
            <input
              value={d.finishCondition}
              required
              maxLength={500}
              disabled={disabled}
              onChange={(e) => change({ finishCondition: e.target.value })}
            />
          </label>
          {d.steps.map((step, i) => (
            <fieldset className="step-editor" key={step.key}>
              <legend>Action {String(i + 1).padStart(2, "0")} · Editable</legend>
              <label>
                Title
                <input
                  id={`title-${step.key}`}
                  aria-label={`Action ${i + 1} title`}
                  placeholder="Draft the opening section"
                  required
                  maxLength={500}
                  value={step.title}
                  disabled={disabled}
                  onChange={(e) => setStep(i, { title: e.target.value })}
                />
              </label>
              <label htmlFor={`instruction-${step.key}`}>
                What will you do?
                <textarea
                  id={`instruction-${step.key}`}
                  aria-label={`Action ${i + 1} instruction`}
                  required
                  maxLength={500}
                  placeholder="Write a rough first paragraph and list the points to cover"
                  value={step.nextAction}
                  disabled={disabled}
                  onChange={(e) => setStep(i, { nextAction: e.target.value })}
                />
              </label>
              <label>
                Session length
                <input
                  aria-label={`Action ${i + 1} session minutes`}
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={step.minutesText ?? step.suggestedMinutes}
                  aria-describedby={`minutes-help-${step.key}`}
                  disabled={disabled}
                  onChange={(e) => {
                    setStep(i, { minutesText: e.target.value });
                  }}
                  onBlur={e => e.currentTarget.reportValidity()}
                />
                <span id={`minutes-help-${step.key}`} className="session-time">Enter 1–120 minutes.</span>
              </label>
              <div className="button-row">
                <button
                  type="button"
                  className="quiet"
                  aria-label={`Move action ${i + 1} up`}
                  disabled={disabled || i === 0}
                  onClick={() => move(i, -1)}
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="quiet"
                  aria-label={`Move action ${i + 1} down`}
                  disabled={disabled || i === d.steps.length - 1}
                  onClick={() => move(i, 1)}
                >
                  Move down
                </button>
                <button
                  className="quiet"
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove action ${i + 1}`}
                  onClick={() =>
                    change({ steps: d.steps.filter((_, index) => index !== i) })
                  }
                >
                  Remove
                </button>
              </div>
            </fieldset>
          ))}
          <button
            className="secondary"
            type="button"
            disabled={disabled || d.steps.length >= 20}
            onClick={() => {
              const key = crypto.randomUUID();
              addedTitle.current = key;
              change({
                steps: [
                  ...d.steps,
                  {
                    key,
                    existingId: null,
                    title: "",
                    nextAction: "",
                    suggestedMinutes: 20,
                  },
                ],
              });
            }}
          >
            + Add another action
          </button>
          <button className="primary" disabled={disabled || !d.steps.length}>
            {d.editingMountainId ? "Save changes" : "Accept breakdown"}
          </button>
        </form>
      )}
      {d.editingMountainId && (
        <details>
          <summary>Archived actions and saved context</summary>
          {snapshot.subtasks
            .filter((t) => t.mountainId === d.editingMountainId && t.archivedAt)
            .map((t) => (
              <div key={t.id}>
                <strong>{t.title}</strong>
                <p>{t.nextAction}</p>
                {snapshot.sessions
                  .filter((x) => x.subtaskId === t.id)
                  .map((x) => (
                    <p key={x.id}>
                      {x.note || "No saved note."} ·{" "}
                      {Math.floor(x.creditedMs / 1000)} recorded seconds
                    </p>
                  ))}
                <button
                  className="secondary"
                  disabled={
                    disabled ||
                    d.steps.length >= 20 ||
                    d.steps.some((x) => x.existingId === t.id)
                  }
                  onClick={() =>
                    change({
                      steps: [
                        ...d.steps,
                        {
                          key: crypto.randomUUID(),
                          existingId: t.id,
                          title: t.title,
                          nextAction: t.nextAction,
                          suggestedMinutes: t.suggestedMinutes,
                        },
                      ],
                    })
                  }
                >
                  Restore {t.title}
                </button>
              </div>
            ))}
        </details>
      )}
      {meaningfulDraft(d) && <button
        className="quiet"
        type="button"
        disabled={disabled}
        onClick={() => {
          if (
            window.confirm(
              "Discard this unaccepted draft? Accepted work and saved sessions are not affected.",
            )
          ) {
            dispatch({ type: "draft", draft: null });
            close();
          }
        }}
      >
        Discard draft
      </button>}
    </div>
  );
}
