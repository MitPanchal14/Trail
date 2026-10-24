---
doc: checklist
status: approved
---

# Work Trail — Build Checklist

Build order approved October 15, 2026 in handoff-review.md. Slice 1 accepted by the user; slice 2 authorized.
Build mode: fast — selected October 15, 2026. Git initialization authorized.

Slice 1 implementation, checks and user visual review passed. Slice 3 execution was explicitly approved and is now implemented for hands-on review. Prior slice 2 acceptance is not inferred; its review box stays unchecked. Stop before slice 4.

Slice 1 checkpoint: `92da564`. Slice 2 implementation checkpoint: `71e624b`; mechanical verification is ready for hands-on review. Its slice/review boxes remain unchecked pending the user's result. Evidence and limitations are in HANDOFF.md.

## Slices

- [ ] **October 21 — authorized work-return slice** (`today-build-2026-10-21.md`): dark shared world/work surface; optional editable progress dictation and separately requested AI return-step review; existing editable plan; save/reload/explicit Resume/completion/Undo. Mechanical verification and hands-on visual/provider/microphone acceptance tracked separately in HANDOFF. No public AI enablement or deployment implied.

- [ ] **October 20 corrective work-loop experience — user visual acceptance pending**
  Implemented one candidate from `today-experience-correction-brief-2026-10-20.md`: mobile long-next-step correction and coherent Today/Focus/Update progress/completion; separate summit confirmation and factual world connection. Fresh lint/typecheck/build, 74 unit tests, 363 final ordinary browser regressions and 45 final local-production checks passed; matched before/after screenshots and exact mobile rectangles reviewed, density findings repaired/rechecked. Evidence/limits: `today-correction-plan-2026-10-20.md`. No domain/timer/reward/storage/other-page redesign, commit/push/deploy or feature expansion. Stop for user visual review; this box remains unchecked.

- [ ] **October 20 Today experience redesign — visual review pending**
  Implemented real-app visual slice: dominant next action, charcoal/ivory interface, original forest world and amber return context; visibly distinct Ready/Returning/Completed, quiet settings/details, Update progress retained. Work/recovery/Undo/storage semantics and public release unchanged. Fresh lint/typecheck/build, 74 unit tests, 348 ordinary browser checks and 87 local-production checks passed; six final screenshots reviewed independently. Evidence/limitations: `today-redesign-plan-2026-10-20.md`. User visual acceptance remains unchecked; stop here, no push/deploy or expansion to other pages.

- [ ] **October 20 bounded slice — Update progress without focus (user/independent review pending)**
  Implemented: selected unfinished action; prefilled two-field manual editor, explicit save/cancel, existing Today return-card reuse, no timer/session/reward created. Original action, recovery/Undo/backup/routes retained. Mechanical checks: 74 unit tests, 303 ordinary desktop/tablet/mobile browser tests, 30 targeted local-production tests, lint/typecheck/build pass. Covers persistence/cancellation/target/time/checkpoints/explicit Resume/keyboard/320px/storage/ownership/old-new backup compatibility. See `progress-update-plan-2026-10-20.md` and HANDOFF for evidence/older-public-build backup limits. User/independent acceptance, physical-device/Safari and screen readers remain unchecked. No voice/AI/redesign/push/deploy. Historical unchecked items below are not evidence of missing implementation.

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

- [ ] User accepts October 19 compact Progress revision: GitHub-style year heatmap and unboxed metrics. Implementation and automated verification complete; visual acceptance pending.

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

- October 20 bounded manual progress update implemented for review only. Optional action context, no manufactured session/time/checkpoint, explicit guarded save, draft recovery, existing return-card/Mountains context reuse, explicit Start/Resume carry-forward and old-data/new-backup support. 74 unit tests, 303 ordinary browsers and 30 new local-production checks pass; lint/typecheck/build pass. Preview http://127.0.0.1:3101/. Acceptance stays unchecked; old public release untouched. See HANDOFF and progress-update-plan-2026-10-20.md.

- October 19 public manual release: after explicit hostname/publication approval, deployed reviewed `66940bf` source + config overlays to **https://trail-demo-seven.vercel.app** under Hobby scope `panchalmitkumarraju-2839`. Deployment `dpl_2EWrVHHF13dp3FmeyAj7EQ2PYLdn` READY at 13:19:20.210Z; alias/source/mode verified. Exactly 42 intended files, no env/Gemini credentials or unrelated edits. **8 actual public unmocked desktop/mobile smoke checks passed (10.4s)**; AI unavailable, same-origin/no-Origin POSTs 403 ORIGIN, public routes 200, screenshots inspected, bounded post-release logs returned no errors/5xx. Full 273/64 checks remain local evidence. Identity/hashes/times/rollback limits: deployment/release-2026-10-19.md. Final user rehearsal/acceptance, physical Safari/mobile and screen readers remain unchecked; no video/submission performed.

- October 19 approved project creation: created/configured `trail-demo` (`prj_2AFvYa6vfTmljs28ZZ5zOO1q5c9r`) in Hobby scope `panchalmitkumarraju-2839`; assigned hostname **trail-demo-seven.vercel.app** is verified by Vercel. Node 24.x/Next.js/install/build and only `ENABLE_AI_PLANNING=false` configured; no Gemini credentials or paid additions. Pristine candidate dry-run lists exactly 42 matching files, no env uploads. CLI-generated staging OIDC env file was deleted without display/upload. **Zero deployments** verified; publication/real-public smoke/user acceptance remain pending. Stop to show hostname and obtain publishing approval.

- October 19 deployment readiness: Vercel account/scope `panchalmitkumarraju-2839` identified read-only on Hobby; user requests new project `trail-demo` and an assigned vercel.app hostname. Project/configuration approval and hostname allocation remain pending; nothing linked/created/deployed. Clean committed-source staging, exact configuration proposal, release/rollback runbook and rehearsal checklist prepared. Fresh clean local production build, 273 production browser regressions, 8 unmocked desktop/mobile smoke checks, lint/typecheck and 64 unit tests pass; 10 client bundles have no provider credential markers. Zero runtime audit vulnerabilities; five dev-tool high findings disclosed, no forced fixes. Public URL verification and user acceptance remain unchecked. See HANDOFF.md and deployment/manual-demo-runbook.md.

- October 19: focused backup/import portion of slice 5 implemented, without advancing deployment/demo work or claiming slice acceptance. Local file size/schema validation, preview/explicit whole-history replacement, controller ownership/raw checks, persistence-before-publication, corrupt/inaccessible-storage protection, failure downloads, stale-read/request cancellation and explicit saved-session Resume are implemented. README includes private backup instructions. Lint/typecheck/build, 64 unit tests and the final full 273 AI-disabled browser tests pass (60 restore checks), including the sample-warning edge case. Desktop/mobile/320px captures inspected; actual evidence and hands-on review stop point are in HANDOFF.md. The full slice and user acceptance boxes remain unchecked.

- October 19: user requested simpler GitHub-style Progress. Replaced default month view with compact year heatmap, retained large month option and collapsed details, removed metric-card surfaces. 54 unit tests, 36 Progress browser checks, lint/typecheck/build pass; desktop/mobile screenshots inspected. No storage or focus changes. See HANDOFF.md.

- Focused slice 3 usability refinement: shared meaningful-draft close/load rule and state-aware Close labels; normalized duplicate instruction suppression in Today/focus; plain planner copy, optional context disclosure, compact time and connected responsive selection/plan/commit layout. No storage clear, terrain redesign or Gemini contract change. Fresh lint/typecheck/build pass; 31 unit tests and 57 self-started browser tests pass; 6 targeted browser checks cover retention, keyboard and enlarged text. Ignored screenshots inspected at desktop/tablet/390px mobile. No live requests. User review/acceptance pending; stop before slice 4.

- Authorized live follow-up: model metadata HTTP 200 and three real fictional requests with `gemini-3.5-flash-lite`; desktop integrated live browser test passed (11.6s), no retries. Real schema acceptance, breakdown/clarification/day validation and explicit return/completion/Undo journey verified. Actual generated wording was not retained by the default reporter; qualitative review remains pending and the harness now writes ignored JSON evidence for future authorized runs. No extra calls made. Real voice/user acceptance pending; slice 3 remains unchecked.

- Slice 3 integration follow-up: provider schema subset and blocked/incomplete/thinking-part parsing reviewed against current official Gemini docs; sanitized access/model/request/quota failures covered. Self-starting AI-disabled loopback Playwright server with 120s startup bound, separate compiler output, explicit external-server support and ignored screenshot output. Fresh verification: 29 unit/API tests, 51 desktop/tablet/mobile browser tests on managed development and fresh local production, lint/typecheck/build pass; actual production endpoint returned 503 PUBLIC_AI_DISABLED. Three-request opt-in fictional live journey prepared, but **not run**: required Gemini configuration is absent. Actual returned-draft usefulness, microphone transcription and user acceptance remain pending. See HANDOFF.md and README.md for configuration/authorization and hands-on steps. No slice boxes checked; no slice 4, redesign, push or deployment.

- Slice 3 implementation: persistent capture/full manual or AI draft review, native voice fallback, bounded server Gemini endpoint, stable accepted edits/archive/restore, daily drafts/explicit commitments with removal/defer records. Final checks: 26 unit/API tests, 45 desktop/tablet/mobile browser tests, lint/typecheck/build pass. Successful AI/voice behavior uses test doubles; live Gemini is pending absent credentials and real microphone/provider behavior is unverified. See HANDOFF.md for exact evidence and hands-on session. Slice 3 box remains unchecked; no slice 4, push or deployment.

- Slice 2 focus-layout regression reproduced with two distinct tasks and fixed via explicit `.shell.is-focusing` shell/main/responsive rules, collapsed optional note editor and focus-heading entry. Domain/timer/storage semantics unchanged. 13 domain tests and 33 desktop/tablet/mobile browser tests plus lint/typecheck/build pass. See HANDOFF.md and focus-repair screenshots; slice 2 user acceptance is still pending.

- User visual feedback: retain original terrain/bento identity, select Dusk instead of Woodland, strengthen localized completion light and climber, and shorten mobile hierarchy. Implemented within slice 1 only; revised visual approval remains pending. No later slice advanced.
- The user subsequently accepted slice 1 and authorized slice 2 plus local checkpoint commits on `MitPanchal14/feat/persistent-work-return-loop`. No push/deploy. Slice 2 adds real local records, guarded focus/recovery and completion/Undo; reviewed breakdowns, advanced planning, voice/AI, summit workflows and reports remain in their later slices. Stop for slice 2 review.
