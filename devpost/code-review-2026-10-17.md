# Code review and acceptance plan — 17 October 2026

## Scope and verdict

Reviewed latest checkpoint `1d87331`, current uncommitted CSS, Today/creation/planner integration, terrain animation lifecycle, timing/actions/storage hook, API boundary and browser-test configuration. This is a focused review, not a full security audit. No application code changed.

The core is ready for structured user acceptance, not public deployment. No failing automated checks were found in this pass. Passing checks do not establish that AI wording or reward feedback is useful.

## Findings to resolve

1. **P2 — Completion sends users toward creation instead of continuation.** `components/TodayView.tsx` completion branch (around lines 395–400) always offers Add another task, even when accepted unfinished steps remain. Existing steps can be found in the planner/Choose other work, but the primary action interrupts project momentum. Offer a deliberate Next action choice using today's next unfinished commitment, then the same project's ordered unfinished actions. Do not auto-start a timer, create another mountain, or hide Undo. Regression: accept at least three actions, complete the first, select the next through the main card, and retain the first checkpoint and Undo behavior.

2. **P2 — Edit breakdown can silently open an unrelated draft.** In `TodayView.tsx` around lines 98–101, any existing creationDraft causes Edit breakdown to call openCreate and return, regardless of editingMountainId. A user can click edit on mountain A and land in a new-task draft or mountain B's draft. Preserve the draft and clearly offer Continue existing draft or return to editing A; do not discard it or silently substitute context. Regression: retain a meaningful B/new-task draft, select A, click Edit breakdown, verify explicit context and retention.

## Fresh verification

- Lint passed.
- TypeScript passed.
- Unit/API/domain suite: 32 passed.
- Production build passed.
- Self-starting browser suite: 69 passed in 50.3 seconds across desktop/tablet/mobile Chromium emulation, using isolated test records and mocked/disabled AI.
- Browser suite initially could not bind its local port under the sandbox; rerun with the required execution permission passed.
- Sampled contrast tests passed with the current uncommitted CSS (return-context text approximately 8.12:1). This is not full accessibility certification.
- No live Gemini generation, real microphone transcription, physical Safari/mobile review, or fresh production browser journey in this pass.

## Repository state

Uncommitted CSS changes replace the blue return-context panel with green/lime styling. That is a design choice, but differs from the saved-state surface separation described in HANDOFF.md; decide which version is intended before checkpointing. Existing modified evidence images/generated next-env.d.ts and untracked audit files were present before verification. Do not blanket-stage them. Routine screenshot tests now correctly use ignored test output.

Public AI remains unconditionally disabled in production in lib/gemini.server.ts, and the API restricts requests to local origins. This protects the current local prototype but is a deployment blocker for an AI-enabled public demo; resolve it in the shipping slice with proper request limits and cost controls, rather than merely removing the checks.

## Hands-on acceptance — one real project, 20–30 minutes plus a later return

1. Use a real project with three concrete actions. If using AI, deliberately submit it yourself. Assess factual accuracy, order, realistic durations and whether the first step is genuinely executable. Edit before accepting. No additional agent API calls are authorized by this plan.
2. Commit only a realistic subset for today. Reorder once and defer/remove one commitment; verify history remains visible and deferred work does not become completed.
3. Start for 2–3 minutes. Record both Where I stopped and First thing when I return. Save. The task should remain unfinished and earn no checkpoint/light.
4. Close and reopen the same origin/browser. Confirm both fields, remaining commitment and explicit Resume. Absence must add no work time.
5. Resume and genuinely finish the first action. Confirm named feedback, a visible earned checkpoint/light change and a clear way to continue the next action. Record whether the reward is noticeable without searching for it.
6. Undo once; confirm only that achievement is reversed and return context remains. Complete again after checking the restored state. Reload; earned light persists without replaying celebration.
7. Return later that day without rereading project history. Can you identify and begin the next concrete step within roughly 20 seconds? This is the key usefulness check.
8. Separately try a physical phone/Safari for layout/controls and optional voice start → stop → correct transcript → close. Microphone use requires your permission; typing must remain usable.

Record: confusing screen, needed edit, missing context, invisible feedback, or lost state. Progress only after the two continuation/context findings are resolved and the real return journey feels clear. Then build the next scoped feature slice; avoid another broad visual redesign.
