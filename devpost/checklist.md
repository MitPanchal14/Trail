# Delivery checklist

## Latest review and visual priority — 25 October
- [x] Independently verify syntax, 20 tests, build, diff check and focused Chromium return gate; record three extra reproduced findings in RETURN_EDGE_REVIEW_2026-10-25.md.
- [x] Collect user feedback: written layout acceptable; stronger mountain-based progress visualization is now the priority. Current motion control has no audio.
- [ ] Publish the user-authorized saved-place checkpoint to `codex/trail-redesign`; preserve main.
- [ ] Implement/review the newly authorized mountain graphic against actual action states, current themes and retained surrounding layout; do not restore old UI.
- [ ] Correct the three recorded edge cases in a bounded subsequent pass.
- [ ] Agree productive-day/streak semantics before implementation; no streak is currently implemented.

## Bounded return-experience pass — implemented locally, 25 October
- [x] Research closer alternatives and write explicit problem/solution/validation decisions in RETURN_EXPERIENCE_PLAN_2026-10-25.md; no uniqueness or winning guarantee.
- [x] Prepare one sequential editor-neutral dispatch in OPENCODE_RETURN_EXPERIENCE.md, with compatibility, exact saved-place/URL semantics, tests and a two-hour scope boundary.
- [x] Implement low-friction saved-place capture, optional safe work URL and clear return presentation; preserve retained UI and timing/storage/Undo contracts. Syntax, 20 Node tests, build, diff check, focused return gate and final full Chromium suite passed; see RETURN_EXPERIENCE_EVIDENCE.md. No publication by this pass.
- [ ] Independently review implementation/evidence, then observe real interruption/return usage and physical primary-browser behaviour.
- [ ] Fix observed blockers, freeze features by the user's evening target, and prepare judge-access/video/submission materials. New publication requires authorization.

**Checkpoint request, 25 October:** user authorized committing and pushing the reviewed prototype and supporting documents to `codex/trail-redesign`. Earlier no-publication receipts below are historical. Deployment, submission and physical-device acceptance remain separate.

**Current local result, 25 October:** the three increments in [the day-build dispatch](OPENCODE_DAY_BUILD.md) are implemented for combined review, ahead of the 17:00–18:00 target. Home/Focus layouts retained; graphic redesign deferred. See [execution plan](DAY_BUILD_PLAN.md) and [fresh evidence/limitations](DAY_BUILD_EVIDENCE.md). No commit, push, deployment or submission by this task. Physical-device acceptance remains open.

## Approved day-build work

### Bounded follow-up correction pass — 25 October
- [x] Preserve unsaved create/edit text, action IDs/order and add/remove/reorder state across real → example → real; no canonical save until Save; Cancel discards the draft.
- [x] Real home uses actual saved instruction/action, accurate create/continue/review CTAs and a coherent finished-only state; illustrative artwork is labelled and never seeds earned progress.
- [x] Simplify wording only in touched home/goal-form flows; retain local-storage, error, Resume and limited Undo explanations.
- [x] Focused regressions and final full Chromium integration suite passed; syntax, 16 Node tests, build and diff check passed. Both themes/390px screenshots inspected. See the current correction section in DAY_BUILD_EVIDENCE.md; older results below remain historical.
- [ ] User accepts the corrected local prototype. Physical-device checks and publication are still separate gates.

- [x] Review local code, run syntax/four static tests/build and inspect representative Chromium views; see LOCAL_REVIEW_2026-10-25.md for limitations.
- [x] Record user-approved UI scope, sequential functional increments and acceptance gates in OPENCODE_DAY_BUILD.md.
- [x] Remove decorative Focus bar without changing the approved Focus composition.
- [x] Make Background motion On/Off visibly functional and respect reduced motion.
- [x] Immediate compact completion dialog, stable quote, finite confetti, dismiss/focus/no-replay behaviour (Gate A: node tests/browser.mjs, both themes/390px/reduced motion).
- [x] First functional slice passes its creation/focus/context/storage/recovery acceptance gate (10 Node tests + actual Chromium; physical sleep remains unverified).
- [x] Completion/Undo/review/history/reopen pass the bounded day-build contract (15 Node tests and actual Chromium C loop, including aborted finish and durable Undo after reload).
- [x] Integrated desktop/390px/theme/keyboard/storage/timing checks and truthful receipt: 16 Node tests, full source browser suite and built-artifact checks; DAY_BUILD_EVIDENCE.md lists physical-device gaps separately.
- [ ] User reviews local prototype before publication; no GitHub push, hosting or submission is implied.

The earlier Cloud/overnight/first-slice-only planning is historical and superseded. Next action is user review of the combined local prototype, not another implementation worker or automatic publication.

## Demo-only repository baseline

- [x] Preserve a readable recovery archive outside the repository.
- [x] Retain only the selected 01b demo as runnable website source.
- [x] Remove old application UI, engine, framework setup and obsolete proof copies.
- [x] Replace competing plans with current scope, PRD, specification and design brief.
- [x] Provide one dependency-free run/build workflow.
- [x] Verify syntax, serving and build checks after cleanup (4 tests passed).
- [x] Inspect the retained landing → Today → Focus flow in a browser; navigation preserves the running simulated timer.
- [x] Commit and push the cleaned baseline; main and codex/trail-redesign verified at 1414887 (followed by this documentation receipt).

## Functional core — implemented locally; user acceptance pending

- [x] Prepare local one-day restart checklist and record the pause (25 October 2026; documentation only).
- [x] Prepare proposed [first functional slice brief](FIRST_FUNCTIONAL_SLICE.md), state/storage/timing contract, acceptance matrix and OpenCode dispatch text (planning only, 25 October 2026).
- [x] Agree bounded increments and state/storage/completion contract via the user's day-build dispatch.
- [x] Manual goal creation and editable ordered subtasks.
- [x] Real focus start/pause/extend with conservative recorded effort and explicit Resume (physical sleep/background limits remain).
- [x] Optional pause context and saved next action.
- [x] Durable local storage with failure handling, reload recovery and tab ownership.
- [x] Durable limited Undo and consistent action/goal completion review.
- [x] Real finished-work history and guarded reopening/correction.
- [ ] Real progress mapping for daily route and goal journey.
- [ ] Explainable importance/neglect recommendations.
- [ ] Productive-day calendar and three-consecutive-missed-day streak rule.
- [ ] Reminder feasibility decision, opt-in and verified closed-site delivery.
- [ ] Optional slim focus window with supported-browser fallback.
- [ ] Optional editable AI planning with manual fallback.

## Visual and submission work

- [x] Resolve the dispatched specific visual corrections against the retained baseline.
- [x] Compact immediate reward/ribbons, Focus rail removal and labelled motion. Landing art and both-theme compositions retained, not redesigned.
- [x] Fix known proof wording edge cases: completed example fallback says checked, all-checked artwork has no unfinished marker, and blank context copy matches preserved-field behaviour.
- [x] Verify long/HTML-looking text, 30 actions, 390px layout, keyboard reorder/dialog controls and reduced motion in local headless Chromium (not a complete screen-reader/hardware audit).
- [ ] Test Chrome/Mac background, sleep, Comet and physical-device behaviour as applicable.
- [ ] Host the final demo and verify judge access.
- [ ] Record a concise product-first video and align submission claims with evidence.

Check items only with actual evidence. Update this file after every bounded task. Source pushed to GitHub is not deployment or product acceptance.
