---
doc: checklist
status: approved
---

# Work Trail — Build Checklist

Build order approved October 15, 2026 in handoff-review.md. Slice 1 accepted by the user; slice 2 authorized.
Build mode: fast — selected October 15, 2026. Git initialization authorized.

Slice 1 implementation, checks and user visual review passed. Slice 2 implementation authorized; stop for hands-on review before slice 3.

## Slices

- [x] **1. Today has a compelling pixel world**
  Becomes usable: Responsive Today and labeled sample states can be explored.
  Why now: Establish the visual quality before broad implementation.
  PRD ref: `prd.md > Look and Feel`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Today and Daily Planner`, `spec.md > Mountain World and Details`
  Build: Scaffold inside this slice; implement bento hierarchy, original terrain and empty/one-checkpoint/saved/rich cases.
  Verify (mechanical): Run lint, typecheck and production build; inspect desktop and 390px mobile, keyboard focus, reduced motion and no overflow.
  Learner check: Open Today and compare the landscape/action hierarchy with your chosen demo.
  Commit: `Build Today with natural pixel world`

- [ ] **2. Your unfinished work survives and resumes**
  Becomes usable: Manual seed task, Start, Pause, Save, closure recovery, Resume, completion and Undo persist.
  Why now: Prove the distinctive return-to-work kernel early.
  PRD ref: `prd.md > Countdown Focus Sessions`, `prd.md > Save My Place and Interrupted Sessions`
  Spec ref: `spec.md > Focus and Recovery`, `spec.md > Storage and Backup`, `spec.md > Data Model`
  Build: Add minimal real manual task entry, validated storage, notes, heartbeat timer, single-tab ownership, idempotent completions and stable slots.
  Verify (mechanical): Domain tests: timer expiry/extension/no double credit, Undo/idempotency; browser: save note, reload, close/reopen without absence credit, background open tab and second-tab contention.
  Learner check: Work briefly, save a useful thought, close and return; confirm context and remaining time then complete.
  Commit: `Persist and verify work resumption`

- [ ] **3. Capture and review a manageable plan**
  Becomes usable: Editable task creation, optional voice, Gemini review and committed day plan work.
  Why now: Add planning around the working kernel.
  PRD ref: `prd.md > Large Tasks and Reviewed AI Breakdown`, `prd.md > Daily Planning and Next Action`
  Spec ref: `spec.md > Task Capture and Review`, `spec.md > Today and Daily Planner`, `spec.md > External Services and Dependencies`
  Build: Manual full breakdown editor, archived accepted edits, corrected voice, bounded AI endpoint and day commitments with retained removal/defer history.
  Verify (mechanical): Test schemas, unknown/duplicate day IDs, missing key, timeout/rate-limit/invalid AI preserving text; live authorized Gemini smoke check if configured; browser full review before accept and unsupported voice fallback.
  Learner check: Create a goal, revise its steps and commit today; remove one commitment and inspect retained history.
  Commit: `Add reviewed task and daily planning`

- [ ] **4. Explore earned mountains and activity**
  Becomes usable: Mountains, inspectable checkpoints, summit correction/reopen and real yearly grid work.
  Why now: Reflection now derives from trustworthy records.
  PRD ref: `prd.md > Mountain Trails, Checkpoints, and Colour`, `prd.md > Yearly Activity Grid and Day Details`, `prd.md > Factual Progress Reports`
  Spec ref: `spec.md > Mountain World and Details`, `spec.md > Progress and Reports`, `spec.md > Data Model`
  Build: Separate views; stable terrain contributions; genuine summit confirmation/reopen/correction; date grid and small factual reports.
  Verify (mechanical): Test edits preserve positions, Undo reverses only its colour/count, corrected summit versus reopen, removed commitments/no false marker, late completion/midnight/timezone/leap year; browser selectable checkpoints and date cells.
  Learner check: Switch mountains, inspect a checkpoint and a day, reopen a summit; confirm new work is visibly unfinished.
  Commit: `Add mountain history and activity reflection`

- [ ] **5. Back up, deploy and demonstrate the full journey**
  Becomes usable: Personal data backup and a tested public manual or protected-AI app are usable.
  Why now: Ship only after the full loop is evidenced.
  PRD ref: `prd.md > States and Boundaries`, `prd.md > The Core Journey`
  Spec ref: `spec.md > Storage and Backup`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Important Failure Modes`
  Build: Validated export/import with replace review; README/privacy/environment docs, deployed smoke check, accessible core flow and demo script.
  Verify (mechanical): Run full meaningful suite plus lint/typecheck/build; browser import invalid/corrupt/oversize backups, storage failure, fresh deployed creation/save/reload/complete; confirm no client secret and disabled/protected public AI.
  Learner check: Try the public app from a fresh browser and restore a backup; report problems before shipping.
  Commit: `Prepare verified deployed work trail`

## Hands-on Checkpoints

- [x] Early visual feedback after slice 1; Dusk refinements accepted.
- [ ] Core return-to-work journey explored after slice 2.
- [ ] Final kick-the-tires exploration after slice 5 and feedback resolved.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship.

## Code Tour and App Map

- [ ] Learning activity complete — brief guided route through capture, storage, timer and server AI.
- [ ] Optional edit and transfer reflection addressed.
- [ ] devpost/app-map.html generated from finished code, checked and shown.

Activity and evidence: pending implementation.
Route and stops: select actual files/symbols after build.
Edit outcome: pending learner review.
Reflection: offer during final wrap-up; personal answer stays in ignored profile.
Activity mode: running app/editor preferred, disclose static fallback if needed.

## Revisions

- User visual feedback: retain original terrain/bento identity, select Dusk instead of Woodland, strengthen localized completion light and climber, and shorten mobile hierarchy. Implemented within slice 1 only; revised visual approval remains pending. No later slice advanced.
