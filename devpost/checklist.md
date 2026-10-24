---
doc: checklist
status: draft
---

# Trail — live delivery checklist

Updated October 24, 2026. **This is the single progress tracker.** Plans and requirements are recorded; the new visual product is not yet built. Runtime slices remain proposed until their contracts/design are reviewed. The 01b visual revision has been independently reviewed; no major regression found, two small state-wording corrections and learner visual acceptance remain open. Do not treat a checked planning item as an implemented feature.

## Current position

- **Repository:** https://github.com/MitPanchal14/Trail
- **Baseline:** `main`, commit `b436ce65ec0a2aed804123771a60ddc2760be4f0`.
- **Working branch:** `codex/trail-redesign`, published, currently starting from that baseline.
- **Implementation owner:** OpenCode CLI in the learner's other account.
- **Planning/review owner:** this Codex chat. One implementation task active at a time; no competing edits to the same files.
- **Primary demo target:** Chrome on the learner's MacBook Pro. Comet is a desired secondary browser; test its capabilities separately before claiming support. Keep narrow layouts and unsupported-feature fallbacks usable.
- **Next task:** [01c — final proof state wording](build-tasks/01c-proof-closeout.md). Review recommends retaining 01b composition; fix completed-history fallback and all-checked-open route description, obtain learner approval, then Step 02. Task 01a fixes remain intact in targeted review.
- **Accepted new-product slices:** **0 of 9** below. The existing engine is a verified starting point, not a finished redesign.

## Verified foundation — already complete

- [x] Gather the learner's product requirements, core workflow and visual references locally.
- [x] Reject old pixel/Dusk presentation; record light surfaces, dark text and composed contrasting gradients.
- [x] Audit and remove 76 superseded briefs/study files; retain needed app/data/test foundations.
- [x] Re-review deletion safety: no required current-demo file needs restoring.
- [x] Save and publish the complete documented baseline to GitHub.
- [x] Create and publish the separate redesign branch.
- [x] Verify baseline: 78 unit tests, lint, typecheck, isolated webpack production build and 35 focused production browser checks passed. These results are dated baseline evidence, not proof of later edits.

References: [scope](scope.md), [PRD](prd.md), [technical draft](spec.md), [requirements ledger](replan-2026-10-24/requirements-ledger.md), [design brief](replan-2026-10-24/design-brief.md), [baseline review](replan-2026-10-24/GITHUB_BASELINE_REVIEW.md).

## Delivery targets

**Tonight, October 24:** accept one coherent visual direction, settle the small consequential contracts, then make the new create → focus → pause → close/reopen → Resume → complete journey work with real persisted records, daily/goal graphics and finished-work feedback. Preserve optional editable AI/manual entry. Aim to finish ranking/streak and real background reminders as well; their requirements stay visible if unfinished. Test each slice tonight rather than postponing all testing.

**Tomorrow, October 25:** broader regression, Chrome on the actual Mac, narrow/reduced-motion/long-text/error checks, a real work trial, release/deployment checks, judge access, video and submission materials. This is the learner's work plan, not a claim about the official submission deadline or a guarantee that all features fit.

The floating strip, extra quotes and embellishments are lower priority than a usable core. Automatic closed-page reminders are an explicit requirement, not an optional quote/animation feature. Investigate their delivery architecture in Step 02; if blocked, surface the exact tradeoff to the learner rather than silently cutting them or simulating delivery.

## Model and working settings

| Task | Setting | Guidance |
|---|---|---|
| First visual proof | **GPT-6.1 Sol, medium reasoning** | One coherent composition; inspect the local reference screenshots. No model switch is a substitute for visual review. |
| Routine approved implementation | **GPT-6.1 Sol, medium reasoning** | One slice and its named files, reuse existing state/data contracts. |
| A demonstrated difficult timer/Undo/notification bug | Same model; **high reasoning if available** | Use a separate bounded diagnosis prompt after reproducing the problem. Do not escalate effort for every CSS change. |
| Review and next task | This Codex chat | Inspect actual diffs, checks and visible results; update this checklist and write the next task packet. |

Use OpenCode's existing model/effort controls; do not guess provider IDs, add API keys or replace its configuration. Keep one implementation session for the current slice. Start a fresh session at a natural slice boundary if context gets confused, using the current packet and HANDOFF rather than the entire conversation. No parallel coding agents or auto-approved external account/service actions are needed.

## How every task closes

1. OpenCode reads the task packet and relevant current docs; records intended files before cross-file edits.
2. It implements only that task and reports actual changed paths, checks, evidence, limitations and how to open/try the result.
3. Learner returns here with **“Review Step NN”**. This chat reads shared files/diffs and inspects the result where available. An agent saying “done” is not acceptance.
4. If a change is needed, issue one bounded correction prompt. Resolve failures before expanding scope.
5. Mark the applicable checkbox only after review, with evidence and any learner acceptance. Record the checkpoint and next task in the log below and newest HANDOFF entry.
6. Make a scoped Git checkpoint after accepted work. Push only when requested or when the learner has explicitly established that checkpoint policy; never blanket-stage unrelated work. The current task packet does not authorize OpenCode to commit/push.

After each review report: **accepted / still open; completed count; remaining core slices; next task; deadline risk if any.** Progress reporting happens when we resume/review the shared work; do not claim background monitoring of the other account.

## Core slices — execute in order

### 01 — Prove the visual experience

- [x] OpenCode produces the isolated proof under `devpost/proof-2026-10-24/` using [the first task packet](build-tasks/01-visual-proof.md).
- [x] Review Returning Today, Focus, saved/pause and completion/finished-work treatment as one coherent interface, with daily and goal route relationship visible.
- [ ] Check 1280×720 and 390×844, long task text, first use, keyboard focus and reduced motion. Sample data must be labelled fictional.
- [x] Task 01a continuity corrections independently verified (F01–F05).
- [x] Task 01b produced and independently reviewed: landing/work flow, revised milestone journey, composed reward, atmospheric focus/still. Click/keyboard-linked selection checked; pointer-hover/physical touch remain source/builder coverage. Two state-wording corrections remain below.
- [x] Light/dark visual proof produced across key states, with targeted independent checks and builder gallery; this does not complete production theme support.
- [ ] Task 01c: state-correct history fallback and route accessible description (B01/B02).
- [ ] Learner accepts the revised visual direction. Palette liked; current contour/layout not accepted.

Independent review: [findings and correction verification](replan-2026-10-24/review-step-01/REVIEW.md). F01–F05 are now addressed in the isolated proof. Corrected saved-action desktop/mobile and connected completion/Undo/navigation flows verified. Builder reports keyboard/reduced-motion coverage; complete independent coverage and learner acceptance remain open. 01b is now reviewed: [independent report](replan-2026-10-24/review-step-01b/REVIEW.md). Two small wording findings remain; no major regression found. Reviewer recommends preserving this composition, pending learner approval. Do not infer acceptance or integrate yet.

**Becomes usable:** a visible, navigable design to judge before replacing the app. **Done evidence:** proof files, served preview instructions, state screenshots/observations and learner feedback. **Next:** approved working rules and reminder risk.

### 02 — Freeze the small implementation contract and test reminder feasibility

- [ ] Following proof review, settle effort-to-route mapping, whole-goal confirmation → celebration → finished-record lifecycle, navigation and expiry controls. Do not invent that the learner accepted the proposed mapping.
- [ ] Define ranking semantics, streak count during grace, calendar timezone and Undo rules. Propose concrete simple defaults for review; do not restart discovery.
- [ ] For Chrome/Mac, define automatic neglected-important-work eligibility, morning/daytime window, frequency, focus suppression, cancellation/rescheduling and minimal remote data.
- [ ] Prove the chosen closed-page delivery approach can receive a real test notification on the agreed target; report service/permission/hosting needs and failure honestly. No real-device enrollment, paid service or cloud deployment without the learner's applicable authorization.
- [ ] Update canonical PRD/spec/checklist plus retained snapshots/HTML where affected; record approvals accurately. Approve the first runtime slice once its contracts are settled.

**Becomes usable:** a buildable contract and concrete evidence for the riskiest new feature. **Done evidence:** agreed rules, bounded technical plan, reminder feasibility result or explicit learner decision on the blocker. **Next:** working action-first core. This step does not require resolving decorative details before core implementation.

### 03 — Create work, focus, pause and return in the approved interface

- [ ] Implement approved first-visit landing → start → work flow and direct saved-work return; no compulsory daily landing detour.
- [ ] Adapt the shell and task creation: goal, finish condition, ordered editable subtasks/next instructions and chosen work block, with clear field validation.
- [ ] Put the saved next action first; Start/Resume explicit; focus task/timer/Pause/Complete clear. Working in another tab does not pause by itself.
- [ ] Pause immediately; optional note/return instruction; no forced AI or explanation.
- [ ] Close/reopen restores the saved place without counting absence. Explicit Resume and cross-tab/storage/backup protections remain functional.
- [ ] Implement agreed block-expiry and +5/+10/+20 extension behaviour; timer expiry never completes a task.
- [ ] Review real desktop/phone flow and appropriate checks before accepting.

**Becomes usable:** a real daily work companion even before richer route feedback. **Done evidence:** create/start/tab-switch/pause/reload/Resume journey with persisted records, meaningful timer/recovery tests and learner trial. **Next:** record-backed journey.

### 04 — Make real effort and accomplishments visible

- [ ] Replace the rejected pixel representation with the approved graphical language for daily and persistent goal views.
- [ ] Derive effort and completion from real records with stable identity; minutes and completed subtasks remain distinguishable.
- [ ] Completed subtasks glow mildly; partial sessions have an Unfinished tag and accessible recorded effort/return context. Multiple sessions do not duplicate task completion.
- [ ] Navigation, date selection/history, adding/reordering steps and Undo preserve truthful earned progress.
- [ ] Check empty/one-session/productive-day, long goal names, narrow viewport and reduced-motion states.

**Becomes usable:** an understandable visual record of actual work. **Done evidence:** before/after record-backed states and correction/reload checks. **Next:** reward and finished-work loop.

### 05 — Complete and revisit meaningful work

- [ ] Small local subtask reward; distinct major reward only on explicit whole-goal confirmation.
- [ ] Last-step review permits agreed add-step/keep-open/confirm options; dismissing does not manufacture completion.
- [ ] Finite gradient colour transition, legible achievement message, route update and clear exit/next action; static reduced-motion equivalent.
- [ ] Finished-task destination uses attractive coloured record blocks on a neutral surrounding page; history, reopening and corrections remain available.
- [ ] Review keyboard focus, dismissal, Undo and repeat/reload behaviour; no repeated surprise celebration.

**Becomes usable:** the full demo story from starting to a lasting earned result. **Done evidence:** complete small step → final review → confirmed goal → finished record → correction/reopen journey. **Next:** optional AI polish and engagement logic.

### 06 — Preserve useful optional AI, with manual fallback

- [ ] Restyle/adapt existing manual versus optional AI creation and progress update paths to the new interface.
- [ ] Proposals remain editable/cancellable; only explicit acceptance/save changes records. Handle clarification, delay and unavailable AI clearly.
- [ ] Never invent completed work or award minutes from a generated response; typing remains sufficient.
- [ ] Decide the public demo's actual AI availability policy and explain it truthfully. Keep credentials server-side; a mocked test is not live AI evidence.
- [ ] If real provider quality is to be checked, use a separately authorized bounded generation test and record observations.

**Becomes usable:** helpful assistance that does not make the user administer the assistant. **Done evidence:** review/edit/save/cancel/error/manual journeys. **Next:** recommendations and streak.

### 07 — Add explainable recommendations and a fair streak

- [ ] **07a:** importance/category inputs and the agreed importance + neglect + remaining-work ranking; reason visible, important unfinished work eligible next day, no autonomous switching of active work.
- [ ] **07b:** a completed subtask qualifies a day; extra completions enrich the small icon. Missed dates stay blank; three consecutive missed days break the streak, with the agreed grace count/timezone/Undo semantics.
- [ ] Hopeful return copy and retained historical work; no fake scientific attention score or punitive mechanics.
- [ ] Verify meaningful date/Undo/ranking cases and inspect the small UI treatments without cluttering the next action.

**Becomes usable:** clear suggestions and believable continuity. **Done evidence:** agreed rule examples, boundary checks and visible explanations. **Next:** complete the reminder feature.

### 08 — Deliver real background return reminders

- [ ] Implement the agreed opted-in subscription, worker, sender/scheduler and minimal remote eligibility data using Step 02 findings.
- [ ] Notification for neglected important work arrives during the chosen morning/daytime window while another tab is active and after Trail closes, subject to documented OS/browser/network limits.
- [ ] Notification returns to the relevant saved next action. Completion/progress/settings changes update or cancel stale reminders.
- [ ] Permission denied, unsupported browser, subscription loss and server/scheduling failure have honest states and easy controls; no covert permission prompt on first load.
- [ ] Observe actual closed-page delivery on the target; no page-timer or screenshot simulation offered as proof. Record exact tested browser and limits.

**Becomes usable:** the requested return nudge outside the page. **Done evidence:** opt in → eligible work → close → observe reminder → return → complete/cancel, with stale-reminder check. **If blocked:** tell the learner precisely what is missing and obtain an explicit scope decision.

### 09 — Deliver intentional dark mode

- [ ] Implement reviewed light/dark semantic tokens across landing, Today, journey, focus, pause, dialogs, reward and finished history.
- [ ] Provide an accessible theme control; define OS-default and preference persistence behaviour before production implementation.
- [ ] Verify text, gradients, borders, focus rings and state distinctions in both themes, including narrow layouts and reduced/still motion.
- [ ] No old dark-glass/pixel styling or production acceptance inferred from the proof toggle.

**Becomes usable:** a coherent dark alternative throughout Trail. **Done evidence:** real persisted theme behaviour per agreed contract and reviewed key-state coverage. Theme groundwork begins in 01b so this is not a costly final recolour.

## Lower-priority enhancements — do not obscure incomplete core work

- [ ] **E1:** optional slim floating task/timer/Pause strip on supported Chrome/Mac, capability checks, state sharing and clear fallback. Verify actual window-size limits; no promise of a native menu-bar widget.
- [ ] **E2:** occasional meaningful encouragement, quiet and optional; no new quote API is necessary unless specifically chosen.
- [ ] **E3:** additional cursor-responsive dimensional detail outside focus, once readability/performance/reduced motion pass. No stock 3D scene or gratuitous library migration.

These are still visible requests/options, not silently marked complete or used to delay the working core.

## Tomorrow — verification and submission

- [ ] Run appropriate final unit/lint/type/build checks and browser regression against the actual candidate; fix functional blockers first.
- [ ] Real Chrome/Mac personal-work trial; Comet compatibility check if used in the recording; narrow layout and keyboard/reduced-motion/long-text coverage.
- [ ] Check empty/error/corrupt-storage/multi-tab/AI-unavailable/notification-denied and interrupted-session states where relevant.
- [ ] Reconcile plans and implemented scope. Label any deferred, fictional, mocked or unverified behaviour accurately.
- [ ] Prepare judge access: understandable first screen, no avoidable auth wall, realistic clearly labelled demo data, complete controls/forms.
- [ ] Choose and verify the final hosting/release configuration; deploy only with the learner's authorization, then smoke-test the public URL. No silent public AI unlock.
- [ ] Record video: show working app immediately, explain audience/problem, demonstrate pause → return → achievement, then learning/iteration and actual AI/data handling.
- [ ] Check official submission requirements/deadline and fill submission assets/write-up. Do not infer a final deadline from this work schedule.
- [ ] Final learner acceptance, known-limits list, reviewed Git checkpoint and submission confirmation.

## Progress log — append after each review

| Checkpoint | Status | Evidence | Next |
|---|---|---|---|
| Baseline and cleanup | Complete | `b436ce6`; baseline review; 78 unit + 35 focused browser checks | Step 01 |
| Tracker/task preparation | Complete locally | 12 document links resolved; 80 app/test/script fingerprints unchanged; OpenCode executable present. No app tests rerun for documentation-only changes. | Dispatch Step 01 |
| Step 01 | 01b reviewed; two small wording corrections and learner approval open | `replan-2026-10-24/review-step-01b/REVIEW.md` | Task 01c, approval, then Step 02 |
| Task 01a | Correction pass verified: F01–F05 addressed in the isolated proof | Source + live saved-action/Undo/navigation/fifth-step/finished checks | No further correction dispatch needed for these findings |

| Task 01b | Produced and independently reviewed; no major regression found in targeted checks | `replan-2026-10-24/review-step-01b/REVIEW.md`; independent screenshots | Task 01c B01/B02 wording only |

## Last review / remaining work

**Current:** foundation complete; **0/9 core slices accepted**; E1–E3 optional enhancements not complete; final verification/submission not complete. **Next:** Task 01c small state-wording fixes, learner approval, then Step 02 contracts. Keep 01b composition; Task 01a fixes remain verified in targeted checks. Dark mode is now tracked as core slice 09. The proof remains isolated; production integration has not started. When the learner accepts a changed plan, update this tracker rather than creating competing checklists.
