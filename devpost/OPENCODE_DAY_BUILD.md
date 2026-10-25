# OpenCode day-build dispatch — 25 October 2026

## Recorded document changes before editing

Create this consolidated dispatch; add current pointers to BUILD_PROMPT.md, HANDOFF.md, devpost/checklist.md, devpost/ONE_DAY_BUILD.md and devpost/design-brief.md. Preserve earlier briefs as supporting contracts. No runtime edits, OpenCode execution, commit or push in this prompt-preparation task.

## Current authority and outcome

The user's latest feedback approves the home layout and Focus composition, defers graphic redesign, requests removal of the misleading Focus rail, a visibly useful ambience control, and an immediate compact completion window with celebratory pops instead of the slow full-screen reward. No landing illustration removal or broad dark redesign is authorized by this feedback.

This dispatch expands the earlier first-slice stop boundary to three sequential bounded increments: the requested demo corrections, the first functional slice, then the completion/history core loop below. Record changes and verify each before proceeding. No need to re-ask the settled visual questions. Target a reviewable local prototype by 17:00–18:00 IST today; 19:00 is the hard stop for coding so the user can prepare the submission. These are delivery targets, not permission to label incomplete work finished.

## Read first

AGENTS.md, README.md, HANDOFF.md, devpost/scope.md, devpost/prd.md, devpost/design-brief.md, devpost/spec.md, devpost/checklist.md, BUILD_PROMPT.md, this file, devpost/LOCAL_REVIEW_2026-10-25.md, devpost/FIRST_FUNCTIONAL_SLICE.md and devpost/ONE_DAY_BUILD.md. Read cleanup instructions referenced by the first-slice brief. The current user instructions and this dispatch supersede stale Cloud/paused/planning-only text and first-slice-only stop instructions for scope, but retain its storage/timing safeguards.

## Starting point and guardrails

- Work in /Users/mitku/Documents/Hackathons/Devpost/Build_With_AI on codex/trail-redesign. Inspect status and preserve existing user/doc changes. Stop on a different branch rather than switching/resetting silently.
- Current website is only demo/index.html, demo/styles.css and demo/proof.js. Stay dependency-free; do not restore Next.js, old app/components, pixel mountain UI or historical stash/proofs.
- Last review: syntax checks, four static tests and build passed; headless Chromium checked all scenario choices, both desktop themes, phone-width layout and selected interactions. This is demo evidence, not product acceptance. Read the review's gaps.
- No parallel Cloud/local writer. The earlier local overnight automation was paused; Cloud environment setup was reported published but no running implementation is established. Verify any active worker with the user if conflict is detected.
- Record actual file list, transitions and acceptance plan before cross-file implementation. Use GPT-6.1 Sol with medium reasoning as specified in BUILD_PROMPT.md if available in OpenCode; report any unavailable model rather than silently changing it.
- Do not commit, push, deploy, submit, install packages/providers or change main under this dispatch. User will review the combined result first. Earlier push permission covered the Cloud first-slice flow; this local OpenCode dispatch has its own review boundary.

## Schedule and progress gates — Asia/Kolkata

Suggested schedule from approximately 09:00. Check the actual time at start; adjust remaining time honestly, not by silently compressing tests.

| Target | Work and gate |
| --- | --- |
| 09:00–09:20 | Read/inspect, capture baseline, record exact change plan. |
| 09:20–10:00 | Requested visual corrections; verify example completion and motion controls. |
| 10:00–13:30 | First functional slice; demonstrate create → focus → pause → reload → explicit Resume with real data. |
| 13:30–15:30 | Completion, Undo, final review and durable finished history; test before moving on. |
| 15:30–17:00 | Integrated browser checks, storage/timing edge cases, phone/both-theme fixes and docs. Freeze features. |
| 17:00–18:00 | User review and necessary bug fixes; prepare a clean local build and evidence for submission. |
| 18:00–19:00 | Contingency for blocking bugs only. Hard stop at 19:00; preserve progress and report gaps. |

If a gate slips by about 45 minutes, report the cause, current working flow and revised finish estimate. Keep implementing authorized fixes that remain independent of a scope decision. Do not expand features, weaken recovery rules or skip final verification to claim the deadline was met. At 17:00 reserve remaining time for stabilization. If the core loop is incomplete, say so and ask the user to choose the reduced deliverable.

## Increment A — requested demo/UI corrections

1. Preserve home typography, copy, CTA, spacing and current graphic composition. Preserve Today/Journey structure. Graphic redesign and route mapping are deferred; real-mode labels must still reflect actual work, with the geometry explicitly illustrative. Existing light/dark themes stay coherent; no unrelated restyling.
2. Remove .focus-track markup/styles and its knob. It looks interactive but is decorative; do not replace it with another pretend slider. Keep timer/task/buttons prominent.
3. Fix the perceived no-op motion control. Existing code toggles ambient animation, but the visual change is too subtle. Use a compact labelled “Background motion” On/Off control with a clear current state. Off freezes the background immediately; On visibly but calmly resumes it. Respect prefers-reduced-motion: default still, clearly explain system preference, and do not enable animation against it. No sound or external assets. Verify actual computed animation state and visual comparison, keyboard operation and state persistence across in-app navigation. Do not imply this is audio ambience.
4. Replace the full-screen celebrate() experience, delayed headline replacement and six-second forced transition. After successful explicit goal confirmation, show a compact dialog immediately (approximately 420–480px maximum, responsive at 390px) over the intact Finished view, with a stable quote: “You followed through. One step at a time.” Show the actual goal title and a “View finished work” button plus Close/Escape. No large route drawing inside it, loading sequence or automatic dismissal. Backdrop can subtly dim; do not replace the entire screen with a gradient.
5. Add one brief finite burst of small colourful confetti/ribbons around the dialog across the viewport, about 1–1.5 seconds, using lightweight CSS/DOM with no package. pointer-events:none, aria-hidden, no loops, clean up particles/timers. Reduced motion shows the dialog immediately without flying particles. Repeated clicks, navigation, reload and revisit must not replay celebration. In real mode, open the dialog only after the completion transaction commits; failure preserves review/draft with a clear error.
6. Keep example completion labelled fictional. Use a shared reward presentation for fictional/real flows with truthful text; don't let demo reset change real records.

Gate A: verify immediate dialog, fixed text, dismiss/keyboard focus return, confetti cleanup, no replay, both themes, phone width, reduced motion, removed bar and observable motion toggle.

## Increment B — real create/focus/pause/return

Follow FIRST_FUNCTIONAL_SLICE.md's detailed UI, schema, IndexedDB transaction, idempotency, clocks, ownership and failure contracts. Apply necessary additive real-input adapters to the retained composition. Its earlier no-redesign and slice-1-only language is overridden only by the explicit increments in this dispatch.

Essential behaviour: manual goal title/definition/actions, explicit Save/Cancel, ordered editable actions, one open goal, stable IDs, real Today, focus start/pause/extend, preserved optional return instruction/context, durable local state and explicit Resume. Blank/whitespace or Skip preserves both previous useful fields independently. Expired extensions stay paused until Resume. Keep fictional scenarios isolated and clearly labelled; real mode never inherits sample dates, checked steps, minutes or assignments. Local-only browser records do not sync and can be lost by clearing site data.

Do not start at page load or credit unverified away-time. Implement the agreed conservative checkpoint/recovery policy and exclusive single-writer ownership. Never display successful save before committed writes. Preserve drafts on failure and provide recovery/retry. Unsupported storage/ownership capability must fail honestly, not silently fall back to unsafe timing.

Gate B: actual-browser create/edit/reorder → start → navigate → pause/save → reload → explicit Resume, plus two-tab exclusion/recovery, expiry/extend, blank/Skip context and storage failure. Use meaningful deterministic clock/domain tests and actual browser evidence; physical sleep remains unverified until observed on the user's Mac.

## Increment C — completion and real history

Before editing, write the exact slice-2 schema/transitions in the implementation plan. Extend the existing transactional model; do not create another state engine. Minimum contract:

- Complete an action explicitly, once. Atomically stop trustworthy timing, mark that action completed and append an event with stable identity. Expiry never completes an action. Duplicate clicks/retries cannot create extra events, effort or counts. Next action is the first unfinished ordered action; all views derive from canonical records.
- Provide Undo for the latest action completion before a subsequent domain mutation. Keep its pre-completion action/context/session snapshot and event reference durably; restore the exact context/remaining/credited effort in paused state and reverse completion credit atomically. Never resume automatically. A later domain mutation invalidates the Undo; navigation alone does not. Explain the limited Undo window in copy. Reject stale undo by revision/event checks. Reload must not leave a visible Undo that has no valid snapshot.
- When all actions are completed, offer final review: add an action, keep the goal open or explicitly confirm finished. All-checked is not automatically finished. Confirm is idempotent and stores a completion timestamp; only its first successful new completion shows the compact reward.
- Finished work is a durable collection with actual goal title, completion date, action count and recorded effort, with no seeded sample achievements. Navigation/reload do not create events or replay the dialog. After finishing, allow a new goal so history is a collection; only one goal may remain open at a time.
- Support a bounded “Reopen goal” correction from Finished only when there is no other open goal. Preserve goal/action IDs, context and effort; mark the goal open and invalidate its current goal-completion status without deleting prior audit events. If all actions remain checked, present review and let the user add/reopen an action explicitly. Do not silently reopen completed actions or replay celebration. Reopening a specific action reverses its current completion credit with a correction event; no auto timing. Block reopening when another goal is open with a clear explanation. Corrected/re-finished goals update one history identity rather than duplicating cards.
- Completion corrections must not subtract or invent recorded focus effort. Show effort and outcomes separately; recommendations/streak interpretations remain deferred. No whole-goal Undo beyond this explicit reopen/correction flow is required.

Gate C: complete → Undo; complete again → remaining actions → keep open/add action → final confirmation → history → reload → new goal. Also verify guarded reopen/correction, no duplicate history and no replay under repeated clicks/navigation. Persistence failures must leave no false completed/saved state.

## Final verification and stop

Run npm run check, npm test and npm run build; add relevant domain/storage/timing/completion tests and extend allowlisted serving/build parity for each new module. Use existing local browser tools without installing new packages. Exercise full real loop, HTML-looking text as literal, long/empty fields, validation errors, two tabs, denied/aborted storage, interrupted timing, expiry/extensions, completion/Undo/reopen, both themes, keyboard focus, reduced motion and 390px layout. Browser screenshots are evidence, not a replacement for interaction checks. Record physical/background checks separately; never claim fake-clock tests prove real Mac sleep behaviour.

Update README/spec/HANDOFF/checklist with actual implemented/verified status. Keep real/example distinctions honest. Deliver changed-file summary, test results, browser evidence, local URL, limitations and next action. No commit/push/deployment/submission without a new explicit instruction. Stop at the end of this dispatch.

## Deferred today

Graphic redesign, real effort-to-route mapping, broad dark redesign, AI planning, account/sync/backend, reminders/closed-site delivery, floating/PiP, priority scoring, streaks, multi-open-goal dashboard and external integrations. These remain product requirements, not implemented capabilities. Submission readiness is a separate step after the local prototype is accepted.
