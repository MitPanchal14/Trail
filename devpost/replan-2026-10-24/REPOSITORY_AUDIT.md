# Trail — repository audit and rebuild foundation

Audited October 24, 2026. **Follow-up cleanup completed at the learner's request: 76 superseded documentation/study files removed. Application source is unchanged.** See [CLEANUP_RECEIPT.md](CLEANUP_RECEIPT.md) for exact paths, checks and temporary recovery archive. The original audit classifications below explain why runtime files were retained. Paths below are relative to the repository root unless linked. Existing modified and untracked work was present before this audit and must be preserved.

## Decision in plain language

**Continue in this repository. Rebuild the presentation around the useful work engine.** A new repository would add setup and recovery work without solving the visual problem. The existing app already contains persisted tasks, saved return instructions, explicit completion/Undo, timer accounting, storage recovery, multi-tab protection and optional reviewed AI planning. These are valuable foundations, not a requirement to retain the old interface.

The new product is a calm work companion: **see your next action → start focus → work elsewhere → pause with optional context → return immediately → complete and see earned progress.** Daily routes and lasting goal landscapes support that loop. White/light surfaces and dark text carry the working interface; carefully composed contrasting gradients bring the journey, milestones and celebrations to life. Stripe and Linear inform craft and hierarchy. The old pixel mountain, climber, dark presentation and screen composition are superseded.

The main risk is scope and unresolved interaction rules. A visually ambitious rebuild, new route language, streaks, ranking and closed-page notifications are substantial work together. Prioritize a coherent demonstrated return-to-work loop and representative visual proof; do not confuse a long feature list or passing tests with a compelling product. No audit can guarantee a win or a perfect result.

## How to read these classifications

| Class | Meaning | Action now |
|---|---|---|
| **Keep** | Important foundation or current source of truth | Preserve; inspect only the relevant parts when building. |
| **Revise** | Useful file with presentation or contracts that must change | Keep until its replacement is implemented and verified. |
| **Retire after replacement** | Superseded visual implementation still used by the running app/tests | Do not delete now. Remove only after imports, tests and replacement are handled. |
| **Archive candidate** | Historical instructions/studies, not current build authority | Keep out of the builder's normal reading path; consider moving/deleting later after preserving evidence and fixing links. |
| **Regenerable** | Dependencies, caches or generated reports | Not product source; cleanup only when safe and when needed. |

“Old” does not mean “useless.” Historical defect reports, recovery rules and evidence can still explain why a safeguard exists.

## 1. Essential planning files for the new Trail

Use this short reading path rather than feeding every historical document to OpenCode.

| File | Purpose and status |
|---|---|
| [AGENTS.md](../../AGENTS.md) | Repository rules; read installed Next.js guidance before future code edits. |
| [BUILD_PROMPT.md](../../BUILD_PROMPT.md) | Current entry point and stage boundary; supersedes archived build prompts. |
| [HANDOFF.md](../../HANDOFF.md) | Newest entry first; durable continuity and actual evidence. Older sections are history. |
| [devpost/scope.md](../scope.md) | Approved purpose and boundary, with directly confirmed refinements. |
| [requirements-ledger.md](requirements-ledger.md) | Confirmed requirements versus proposals and open decisions. |
| [devpost/prd.md](../prd.md) | Canonical draft product behaviours, workflow and acceptance criteria. |
| [design-brief.md](design-brief.md) | Proposed composition, new graphics, gradients, states, motion and anti-goals. Exact visuals still need review. |
| [reference-audit.md](reference-audit.md) and `references/` | Stripe/Linear observations, adaptation rules and seven desktop reference images. Evidence, not proof of Trail implementation. |
| [OPENCODE_HANDOFF.md](OPENCODE_HANDOFF.md) | Portable brief for the other account, preservation rules and bounded first proof task. |
| [devpost/spec.md](../spec.md) | Draft technical contracts; needs revision after product/design choices settle. |
| [devpost/checklist.md](../checklist.md) | Draft implementation/review sequence. Checked planning items do not mean shipped features. |
| [README.md](README.md) | Index of this revision folder. |
| [documentation-plan.md](documentation-plan.md) | Intended documentation changes recorded before edits. |
| [verification.md](verification.md) | What the documentation/reference work actually verified and its limits. |
| This `REPOSITORY_AUDIT.md` | Source map, cleanup boundary and foundation questions. |
| [Root README.md](../../README.md) | Existing operational instructions are useful, but its historical build description is not the new design brief. |

`devpost/scope.html`, `devpost/prd.html` and `devpost/spec.html` are human review companions. Markdown is authoritative. The revision folder's `scope.md`, `scope.html` and `prd.md` are retained snapshots, not competing authorities; keep them aligned while retained. `evidence/prd-review-desktop.jpg` shows a planning document, not the rebuilt app.

## 2. Application foundation — preserve and adapt

These paths were inspected through source, imports and configuration; the app was not run during this audit.

| File | Classification | Why it matters |
|---|---|---|
| `lib/domain.ts` | Keep; extend deliberately | Validated goals/subtasks/sessions/completions/selection schema. Stored `mountains` naming does not force mountain artwork. |
| `lib/actions.ts` | Keep; revise agreed contracts | Work transitions, completion/Undo, interruption and duration constraints. |
| `lib/storage.ts` | Keep | `work-trail:snapshot:v1`, validation and recovery safeguards. Never clear records to simplify redesign. |
| `lib/use-work-trail.ts` | Keep; verify background behaviour | Persistence/controller, heartbeat, ownership, recovery and page lifecycle. Source uses `pagehide`, not a visibility-change pause; actual background throttling still needs testing. |
| `lib/timer.ts` | Keep; revise agreed expiry rules | Legitimate time accounting, date splits, remaining time and interrupted-session recovery. |
| `lib/tab-ownership.ts` | Keep | Prevents competing tabs writing conflicting records. |
| `lib/backup.ts` | Keep | Validated backup/import and recovery without crediting absent time. |
| `lib/progress.ts` | Keep; extend deliberately | Derives recorded effort and non-undone completions separately. Suitable input for new graphics. |
| `lib/progress-display.ts` | Keep/revise | Display helpers; wording and presentation must match the new design. |
| `lib/summit.ts` | Keep behaviour; revise labels/UX | Explicit whole-goal confirmation, reopening and correction. “Summit” is an internal name, not mandatory user-facing copy. |
| `lib/mountains.ts` | Keep behaviour; revise naming/consumers | Goal detail, saved context, next action and completion status projection. |
| `lib/trail-position.ts` | Revise after reward mapping | Selects latest earned checkpoint from records. Current checkpoint coordinates need not constrain new graphics. |
| `lib/planning.ts` | Keep/revise | Validated editable AI proposals, requests and response gates. |
| `lib/plan-actions.ts` | Keep/revise | Accepted plans and explicit commitment transitions. Existing planning UI should not force extra administration into the new loop. |
| `lib/gemini.server.ts` | Keep; review when AI touched | Server-only provider adapter and bounded prompts. Existing configuration does not prove current suggestion quality. |
| `app/api/plan/route.ts` | Keep | AI request/availability boundary. Preserve secrets and public lockout safeguards. |
| `components/BackupRestore.tsx` | Keep behaviour; restyle | Recovery UI must remain reachable. |
| `components/AiAvailability.tsx` | Keep behaviour; restyle | Makes optional AI availability understandable. |
| `components/VoiceInput.tsx` | Keep optional behaviour; restyle | Editable opt-in dictation and typed fallback. Not mandatory for the core loop. |
| `components/WorkText.tsx` | Keep/revise | Existing work-text rendering used by Today. Check long text in new layouts. |

Important contract: **work effort, subtask completion and whole-goal completion are three different events**. Keep their records distinct even when presenting a unified journey. Repeated sessions must not manufacture multiple task completions.

## 3. Presentation to redesign or retire

| File | Classification | Replacement responsibility |
|---|---|---|
| `app/layout.tsx` | Revise | Global document metadata and base presentation. |
| `app/globals.css` | Revise | Existing global styling; replace obsolete styles after migrated screens stop using them. |
| `app/(trail)/layout.tsx` | Revise | Currently owns the persistent Today controller/view; preserve state across agreed navigation. |
| `app/(trail)/page.tsx` | Keep/revise route | Intentionally returns null because layout renders the view. It is not a useless empty file. |
| `app/(trail)/mountains/page.tsx` | Revise route | Old destination; decide goal/history naming and URLs before removing. |
| `app/(trail)/progress/page.tsx` | Revise route | Existing progress destination; align with daily journey and finished-task navigation. |
| `components/TodayView.tsx` | Major revision | Main orchestration and UI are coupled. Preserve transitions while replacing hierarchy and layout. |
| `components/TodayExperience.module.css` | Retire after replacement | Current Today candidate styles, still imported by TodayView. |
| `components/TaskCreation.tsx` | Revise | Make manual entry/editable AI proposals low friction. Existing review protections are useful. |
| `components/UpdateProgress.tsx` | Revise | Preserve optional context updates, cancellation and explicit save. |
| `components/DailyPlanner.tsx` | Revise/reassess exposure | Existing planning behaviour is not automatic priority ranking. Decide whether it needs prominent UI. |
| `components/MountainsView.tsx` | Revise/replace | Goal browsing contains useful status/context actions but rejected graphical presentation. |
| `components/ProgressView.tsx` | Revise | Record-backed history; new route/streak/finished-task treatment still to build. |
| `components/CheckpointJournal.tsx` | Revise | Historical detail and duration access; preserve legible records. |
| `components/SummitPanel.tsx` | Revise/replace | Goal confirmation UI must fit the agreed compact review → celebration lifecycle. |
| `components/SampleToday.tsx` | Replace presentation | Useful demo/first-use mechanism; current scene and sample must match the new product. Keep fictional data clearly labelled. |
| `components/MountainWorld.tsx` | Retire after replacement | Old canvas mountain renderer, not a required part of the new visual identity. |
| `lib/terrain.ts` | Retire after replacement and test review | Pixel terrain/climber/summit drawing. Extract or replace any still-needed shared logic before removal. |

### Concrete dependency blockers to deletion

- `TodayView.tsx`, `MountainsView.tsx` and `SampleToday.tsx` import `MountainWorld.tsx`.
- `MountainWorld.tsx` imports `lib/terrain.ts`. `tests/domain.test.ts`, `tests/continuation.test.ts` and `tests/summit.test.ts` also import terrain directly.
- `TodayView.tsx` and `MountainsView.tsx` use `lib/trail-position.ts`; `tests/continuation.test.ts` imports it too.
- `lib/actions.ts` imports `lib/summit.ts`: deleting it because of its old name would remove goal-completion behaviour.
- `TodayView.tsx` imports DailyPlanner, SampleToday, the current CSS and other active components. None is currently an isolated unused file.

This import audit identifies direct connections; it is not a complete dead-code proof. No active runtime file is certified safe to delete now.

## 4. Tooling, delivery and private/local files

| Paths | Classification / rule |
|---|---|
| `package.json`, `package-lock.json` | Keep together. Existing Next/React/Zod and test tooling; no framework migration needed for redesign. |
| `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, `eslint.config.mjs`, `vitest.config.mts` | Keep; revise only for actual requirements. Some generated Next/TS changes already exist. |
| `playwright.config.ts`, `e2e/check-server.ts` | Keep managed browser checks and server isolation. |
| `playwright.candidate.config.ts` | Revise before reuse: points at a manually started candidate on port 3102, not automatically the new build. |
| `playwright.manual-demo.config.ts`, `e2e/check-manual-demo.ts`, `e2e/manual-demo.smoke.ts` | Keep/revise for final judge-access checks; historical configuration is not a new release. |
| `scripts/prepare-manual-demo.mjs`, `scripts/check-manual-bundles.mjs` | Keep. Reviewed-commit staging and client credential-marker checks. Do not run deployment preparations incidentally. |
| `deployment/manual-demo-runbook.md`, `deployment/manual-demo.vercel.json`, `deployment/manual-demo.vercelignore`, `deployment/demo-rehearsal.md` | Keep/revise when preparing final delivery. Must reflect actual new app, AI policy and notifications. |
| `deployment/release-2026-10-19.md`, `deployment/trail-demo-environment.json`, `deployment/trail-demo-project-settings.json` | Historical release/configuration evidence; retain until release setup is rechecked. No claim these describe current live state. |
| `.gitignore`, `.env.example` | Keep. Ignore rules and configuration documentation matter. |
| `.env*` except `.env.example`, `devpost/learner-profile.md`, `.git/` | Private/local or repository state, not obsolete design. Do not print, publish or delete during cleanup. |
| `.agents/skills/`, `skills-lock.json` | Keep active learning/build guidance and skill provenance. |
| `agent/skills/` | Possible legacy duplicate, **not deletion-ready**: its six SKILL.md files differ from `.agents/skills/`. Compare references and content before choosing a single location; don't merge blindly. |
| `node_modules/`, `.next/`, `.next-e2e/`, `*.tsbuildinfo`, `test-results/`, `playwright-report/`, `.DS_Store` | Regenerable dependencies/cache/reports or OS metadata. Preserve needed evidence first; do not delete live build output underneath a running process. Reinstalling dependencies costs time. |

No `public/` source assets were found in the inspected checkout. New notification/service-worker/manifest assets are not already supplied by the old mountain graphic.

## 5. Tests are a safety net, not obsolete design instructions

Keep domain, storage, recovery, ownership, time accounting, completion/Undo and manually reviewed AI protections. Browser tests often mix behaviour with old labels/layout; update those expectations with the approved new UI instead of deleting failing tests wholesale. Geometry-specific expectations can be replaced after the new reward contract is decided.

`tests/` and `e2e/` are enumerated below. `e2e/correction-fixtures.ts` contains reusable test setup; it is not real user history. `e2e/live-gemini.spec.ts` is opt-in provider work, not a normal verification command. Do not spend provider requests merely to audit files.

No tests/build/server were run in this documentation task. Older pass/fail counts in HANDOFF remain dated evidence.

## 6. Old material to remove from the normal build reading path

The historical top-level Markdown documents listed below were **removed**, except the explicitly retained October 23 strategic research. They are recoverable from the temporary archive in CLEANUP_RECEIPT.md and are not active instructions. They contain old approvals, rejected styles or earlier work plans, sometimes alongside still-useful bug explanations. Current canonical docs and this revision folder supersede their product/design directions. The October 23 problem research remains optional strategic context.

Historical study folders — the first four rows were removed; standalone evidence and archived planning baselines were retained:

| Path | Why it is historical / cleanup condition |
|---|---|
| `devpost/design-lab/` | Earlier pixel/palette study and research; rejected as the new visual target. Preserve relevant research/evidence before moving. |
| `devpost/product-reset/` and `devpost/ui-preview.html` | Earlier standalone presentation explorations; not the current app or new specification. |
| `devpost/voice-return/` | Fictional interactive return-flow study; reuses transpiled old terrain. Historical interaction evidence, not real voice/AI/timer/persistence. |
| `devpost/design-proof-2026-10-21/` | Earlier field-desk proof and related files; not an approved new visual direction. |
| `devpost/evidence/` | Earlier screenshots, audits and checks. Archive by phase if useful; do not present old screenshots as rebuilt-app evidence. |
| `devpost/replan-2026-10-24/previous-approved-*`, `devpost/replan-2026-10-24/previous-BUILD_PROMPT.md` | Explicitly archived planning baselines. Preserve for traceability; never read as current approval. |

Do not bulk-delete `devpost/`: it also contains all current canonical documents and new references. Do not delete all files containing “mountain,” “pixel,” “October 18,” or “old”: functional contracts and evidence are mixed with obsolete presentation.

## 7. Foundation decisions still needed

Settled already: next action first; optional AI/manual entry; immediate Pause and optional return note; work elsewhere while timer runs; mild subtask glow; stronger goal celebration; Unfinished tag for partial sessions; +5/+10/+20 extensions; completion qualifies a streak day; three consecutive missed days break it; composed gradients on designated colour surfaces. Do not reopen these questions.

| Remaining decision | Confirmed direction and precise gap |
|---|---|
| **Reminder delivery — newly clarified** | Automatic reminders for neglected important work; useful in morning/daytime; must work in another tab and after Trail closes. Exact neglect threshold, local time/window, repeat limit and suppression while working are still open. |
| **New graphical identity** | Old pixel scene rejected. Smooth illuminated contour/ribbon landscape is a proposal, not a chosen visual. Review actual desktop/phone proofs with realistic text. |
| **Effort-to-route mapping** | Both minutes and completion matter. Decide what changes with focus minutes versus a completed subtask, and what earns a major landmark. Avoid a made-up productivity score. |
| **Saved work versus recommendations** | Saved next action is primary; importance/time/remaining work influence suggestions. Resolve precedence when a different goal becomes more urgent, and the explainable ranking contract. |
| **Whole-goal finish** | Proposal: last-subtask review → confirm finished/add another step/keep open → finite celebration → neutral finished-task view with coloured block. Exact choices, dismissal and correction need agreement. |
| **Streak display** | Resolve count during 1–2 blank grace days, timezone/day changes, Undo of the only qualifying completion and capped visual intensity. Three-day break threshold is already settled. |
| **Final navigation and focus edge cases** | Decide daily/goal/finished-work access, block-expiry presentation, extension limits and unsupported floating-strip fallback. Current duration constraints include 1–120 minutes; reconcile extensions with remaining-time limits. |

### Reminder feasibility and data implications

An open-page timer cannot reliably schedule a notification after its page is closed. A conventional Web Push design has an opted-in browser subscription, a service worker and a sender/scheduler outside the page. This is a technical inference for Trail from [Google's Web Push architecture](https://web.dev/articles/push-notifications-how-push-works). Delivery depends on browser/OS settings, permission and connectivity; do not promise exact-time or universal delivery. Apple documents support requirements in [its Web Push guidance](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers).

Source search found no `serviceWorker`, `PushManager` or `Notification` integration in the inspected `app/`, `components/`, `lib/` or Next config. This is new infrastructure, not a hidden existing feature. A server-side reminder for neglected work also needs enough information to decide eligibility after the page closes. Choose minimal remote fields, cancellation/update rules, privacy explanation, failure state and target browser before implementation. Full task syncing/accounts are not automatically required. Do not claim the entire product is local-only if reminder data leaves the browser.

The confirmed notification requirement is separate from the optional small floating focus strip. It does not authorize telephone calls, email, paid services or enrolling this user's real device during the documentation task. Required proof later: opt in → schedule by agreed rule → close Trail → observe delivery on an agreed browser → click back to the saved work; complete/cancel/reschedule and confirm stale reminders do not continue.

## 8. Safe cleanup sequence for later

1. Preserve current modified/untracked work and private user records in a recoverable baseline. A Git commit alone does not contain ignored browser data or local-only files.
2. Approve the product contracts and review one coherent visual proof; finish the technical plan. Keep implementation slices small enough to verify.
3. Replace old presentation behind the retained work/state contracts. Confirm reload/explicit Resume, another-tab focus, immediate Pause, completion/Undo, goal confirmation and backup recovery.
4. Remove imports and replace geometry/old-layout tests before retiring MountainWorld, terrain, old CSS or route destinations. Check links from docs and release scripts too.
5. Move historical instructions into an explicitly historical location if useful; update all incoming references. Preserve submission/process evidence. Only then review an exact deletion list.
6. Run appropriate lint/type/build and meaningful tests for actual code changes, then inspect real desktop/phone/reduced-motion states. Record limitations, not only counts.

**Original audit deleted nothing; the later authorized cleanup removed 76 superseded documentation/study files, as recorded in CLEANUP_RECEIPT.md.** No runtime file is proven unused, so none was removed. The most immediate improvement is a short authoritative reading path and a reviewed design proof, not filesystem destruction.

## 9. File inventory appendices

The following inventories were generated from the local checkout during this audit. Directory entries classify all descendants, including binary evidence; dependency/cache/private contents are intentionally not dumped. Historical document titles identify their original subject, not current authority.

### Historical top-level documents — removed except strategic research

| File | Original subject | Cleanup state |
|---|---|---|
| `devpost/ai-demo-deployment-proposal-2026-10-18.md` | AI demo deployment proposal — not enabled or deployed  Removed; recovery archive |
| `devpost/ai-readiness-plan-2026-10-18.md` | Intended AI readiness pass  Removed; recovery archive |
| `devpost/backup-restore-opencode-2026-10-19.md` | Focused OpenCode task: private backup and restore  Removed; recovery archive |
| `devpost/backup-restore-plan-2026-10-19.md` | Focused backup/restore plan  Removed; recovery archive |
| `devpost/code-review-2026-10-17.md` | Code review and acceptance plan — 17 October 2026  Removed; recovery archive |
| `devpost/continuation-ux-2026-10-18.md` | Focused continuation UX pass  Removed; recovery archive |
| `devpost/deployment-readiness-opencode-2026-10-19.md` | Deployment readiness — focused next phase  Removed; recovery archive |
| `devpost/deployment-readiness-plan-2026-10-19.md` | Manual public demo readiness — intended changes  Removed; recovery archive |
| `devpost/design-proof-review-2026-10-21.md` | Independent review — Phase A field-desk proposal  Removed; recovery archive |
| `devpost/four-day-direction-2026-10-20.md` | Trail — voice updates and a clear return  Removed; recovery archive |
| `devpost/handoff-review.md` | Work Trail — Final Planning Review  Removed; recovery archive |
| `devpost/live-fixes-2026-10-18.md` | Bounded live UI fixes — October 18  Removed; recovery archive |
| `devpost/mountains-opencode-2026-10-18.md` | Mountains — next focused OpenCode slice  Removed; recovery archive |
| `devpost/mountains-plan-2026-10-18.md` | Intended Mountains edits  Removed; recovery archive |
| `devpost/next-chat-hackathon-review-2026-10-20.md` | New-chat brief — Trail hackathon assessment and four-day plan  Removed; recovery archive |
| `devpost/opencode-continuation-fix.md` | Focused OpenCode fix: continue work and feel earned progress  Removed; recovery archive |
| `devpost/opencode-design-contract-2026-10-21.md` | Trail — next-task design contract  Removed; recovery archive |
| `devpost/opencode-diagnosis-2026-10-21.md` | Trail — independent OpenCode delivery diagnosis  Removed; recovery archive |
| `devpost/problem-opportunity-research-2026-10-23.md` | Build With AI: painful problems, credible opportunities, and the pivot decision  Retained strategic context |
| `devpost/product-reset-2026-10-20.md` | Trail product reset — October 20  Removed; recovery archive |
| `devpost/progress-heatmap-plan-2026-10-19.md` | Progress visual revision  Removed; recovery archive |
| `devpost/progress-opencode-2026-10-18.md` | Progress — focused implementation brief  Removed; recovery archive |
| `devpost/progress-plan-2026-10-18.md` | Intended Progress changes  Removed; recovery archive |
| `devpost/progress-simplification-opencode-2026-10-18.md` | Progress: numbers first, details on demand  Removed; recovery archive |
| `devpost/progress-simplification-plan-2026-10-18.md` | Intended Progress presentation edits  Removed; recovery archive |
| `devpost/progress-update-plan-2026-10-20.md` | Bounded slice — update ongoing work outside focus  Removed; recovery archive |
| `devpost/restart-report-2026-10-18.md` | Restart report — October 18, 2026  Removed; recovery archive |
| `devpost/today-build-2026-10-21.md` | Trail — active build brief, October 21  Removed; recovery archive |
| `devpost/today-correction-plan-2026-10-20.md` | Corrective work-loop candidate — October 20  Removed; recovery archive |
| `devpost/today-experience-correction-brief-2026-10-20.md` | Trail — corrective experience brief for OpenCode  Removed; recovery archive |
| `devpost/today-redesign-plan-2026-10-20.md` | Today redesign — real application, bounded visual slice  Removed; recovery archive |
| `devpost/ui-review-2026-10-18.md` | October 18 live UI review and focused OpenCode brief  Removed; recovery archive |
| `devpost/ui-ux-audit-2026-10-16.md` | Work Trail UI/UX audit — 16 October 2026  Removed; recovery archive |
| `devpost/undo-planner-opencode-2026-10-18.md` | Undo recovery and daily planning — reviewed OpenCode brief  Removed; recovery archive |
| `devpost/undo-planner-plan-2026-10-18.md` | Intended edits  Removed; recovery archive |

### Unit/contract checks — retain, adapt where contracts change

- `tests/backup.test.ts`
- `tests/continuation.test.ts`
- `tests/domain.test.ts`
- `tests/mountains.test.ts`
- `tests/planning.test.ts`
- `tests/progress-display.test.ts`
- `tests/progress-planning.test.ts`
- `tests/progress-update.test.ts`
- `tests/progress.test.ts`
- `tests/return-context.test.ts`
- `tests/summit.test.ts`
- `tests/usability.test.ts`

### Browser checks and fixtures — retain behaviours, revise old presentation expectations

- `e2e/ai-readiness.spec.ts`
- `e2e/backup-restore.spec.ts`
- `e2e/check-manual-demo.ts`
- `e2e/check-server.ts`
- `e2e/continuation.spec.ts`
- `e2e/correction-fixtures.ts`
- `e2e/editor-journal.spec.ts`
- `e2e/focus-layout.spec.ts`
- `e2e/live-gemini.spec.ts`
- `e2e/manual-demo.smoke.ts`
- `e2e/mountains.spec.ts`
- `e2e/planning.spec.ts`
- `e2e/polish-oct18.spec.ts`
- `e2e/progress-suggestion.spec.ts`
- `e2e/progress-update.spec.ts`
- `e2e/progress.spec.ts`
- `e2e/return-states.spec.ts`
- `e2e/review-undo-audit.spec.ts`
- `e2e/summit.spec.ts`
- `e2e/task-reveal.spec.ts`
- `e2e/today-correction.spec.ts`
- `e2e/today-experience.spec.ts`
- `e2e/today.spec.ts`
- `e2e/ui-audit.spec.ts`
- `e2e/undo-planner.spec.ts`
- `e2e/usability.spec.ts`
- `e2e/visible-continuation.spec.ts`
- `e2e/work-loop.spec.ts`
