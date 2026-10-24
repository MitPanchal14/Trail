# Trail — portable OpenCode handoff

Updated October 24, 2026. Intended builder: OpenCode, GPT-6.1 Sol, medium effort, chosen by the learner. This document does not change the model or dispatch a job. It provides context to an agent under another account that cannot see the planning chat.

## Current stage

**Planning. Core scope approved; PRD/design/spec/checklist revision not approved.** No application implementation has been authorized by the latest documentation request. The learner wants a new visual direction with strong Stripe/Linear inspiration and a new graphical representation; they reject the old pixel landscape.

Do not interpret old approved documents as approval of the revision. Old records are archived as `previous-approved-*`. Do not restart onboarding or ask the learner to describe the whole vision again.

## Read once, in order

1. Root `AGENTS.md`, root `HANDOFF.md` newest entry, and root `BUILD_PROMPT.md`.
2. `devpost/scope.md` — approved purpose and boundary.
3. `devpost/replan-2026-10-24/requirements-ledger.md` — requirements, exclusions and open decisions.
4. `devpost/prd.md` — draft workflow and states.
5. `devpost/replan-2026-10-24/design-brief.md` — proposed design and review deliverables.
6. `devpost/replan-2026-10-24/reference-audit.md` and the seven screenshots in its `references/` sibling.
7. `devpost/replan-2026-10-24/REPOSITORY_AUDIT.md` — keep/revise/retire/archive inventory and dependency blockers.
8. `devpost/spec.md` and `devpost/checklist.md` — current planning status, not an implementation approval.

Use targeted source reads after this. Do not spend the whole task rereading historical docs. The Markdown files are canonical; HTML files help human review. The PRD is a draft. The exact graphic and route rules are unresolved.

## How to interpret the request

- “Keep the repo” means retain useful foundations, history and records. It does not mean keep the old screen layout, scene or dark styling.
- “Nothing from the current Trail part” refers to the graphical presentation in the immediately preceding discussion. It is not permission to discard user data, erase Git changes or replace the framework.
- “Stripe + Linear” means deliberate hierarchy, light surfaces, selective colour and finished controls. It does not mean copy a branded homepage or import commercial features.
- “Background helper” means a chosen focus session while the user works elsewhere, not external activity monitoring.
- “Attention score” is an aspiration that is not approved or measurable from a timer.
- “Call me back to work” now includes confirmed automatic morning/daytime background reminders for neglected important work, including after Trail closes. Exact schedule, support and data contracts remain open. It does not authorize telephone calls or enrolling a real device during documentation work.

## Proposed first task for the learner to dispatch

Produce **one coherent visual design proof** before production changes. Use the confirmed direction and the proposed contour journey in the brief as a hypothesis; label it as such. It should be possible to reject the visual without undoing runtime edits.

Allowed for that task: a dedicated static/isolated proof directory, local sample fixtures, a short proof README, screenshots and a handoff update. Any sample state must be labelled fictional. Do not mutate the production app, its CSS, dependencies, persistence, personal browser records, API configuration or running services.

Show realistic Returning Today, Focus running, middle completion and a daily/goal detail at 1280×720 and 390×844. Add first-use and long-content coverage. The task instruction and Resume must be immediately legible; colour and dimensional work belong to the route. Show a motion example if claiming motion, with a still/reduced-motion form. A wireframe with a gradient is not sufficient visual evidence.

Before authoring, record intended files and current dirty state. Do not blanket-stage, reset, clean, switch branches or overwrite unrelated changes. Do not make competing edits while another builder is active. No paid services, remote media generation or new dependencies required for a proof.

After showing the proof, record actual checks and unresolved questions in HANDOFF. Stop for visual feedback because the learner explicitly requested planning and getting the product right before implementation. This is a design-review boundary, not a requirement to repeatedly ask permission for routine work inside the authorized proof task.

## Source map for later implementation

Verified by targeted source inspection October 24; no runtime audit in this documentation turn.

| Area | Existing files | Constraint |
|---|---|---|
| App shell | `app/(trail)/layout.tsx`, `app/layout.tsx`, `app/globals.css` | New layout must follow approved proof; do not blindly preserve old navigation. |
| Today/focus | `components/TodayView.tsx`, `components/TodayExperience.module.css` | Preserve functional transitions and text; presentation may be replaced. |
| Creation/update | `components/TaskCreation.tsx`, `components/UpdateProgress.tsx`, `components/WorkText.tsx` | Manual path and explicit review/save remain essential. |
| Legacy scenes | `components/MountainWorld.tsx`, `lib/terrain.ts`, `components/MountainsView.tsx` | Retired as visual references. Do not delete before tracing dependencies and an approved replacement. |
| Progress/history | `components/ProgressView.tsx`, `components/CheckpointJournal.tsx`, `lib/progress.ts` | Retain intelligible record-backed history. |
| State/storage | `lib/domain.ts`, `lib/storage.ts`, `lib/actions.ts`, `lib/use-work-trail.ts`, `lib/backup.ts` | Preserve validated records, recovery and undo/correction protections. |
| Sessions | `lib/timer.ts`, `lib/tab-ownership.ts` | Working in another tab is intended; preserve interruption/accounting and ownership safeguards. |
| AI | `lib/planning.ts`, `lib/gemini.server.ts`, `app/api/plan/route.ts` | No secrets in client, hidden requests or public lockout bypass. |
| Existing checks | `tests/`, `e2e/`, package scripts | Historical pass counts are dated; rerun checks appropriate to actual changes. |

The persisted schema uses `mountains` and related legacy names. These do not force a mountain visual. Avoid renaming all data fields just to change labels. A new graphic may derive from existing records without a migration; assess after reward rules are agreed.

## Later build verification

Read installed Next.js guides relevant to any code change, per AGENTS.md. Record intended edits before multi-file changes. Run lint/typecheck/build and meaningful existing tests appropriate to the slice. Browser-check Start, another-tab work, immediate Pause, optional note, reload, explicit Resume, completion and Undo. Test narrow layout, reduced motion, unsupported floating strip, AI failure and storage recovery where touched.

Save exact evidence and state limitations. Passing tests do not establish desired visual quality or improved attention/productivity. Do not deploy, commit, push or publish as an incidental redesign action.

## Paste-ready first prompt — only when the learner starts the proof task

> Continue Trail in this repository. Read BUILD_PROMPT.md and the October 24 handoff and planning files it names. I want the bounded design-proof task in devpost/replan-2026-10-24/OPENCODE_HANDOFF.md, not runtime implementation yet. The old pixel mountain and composition are rejected. Use Stripe-inspired light surfaces and selective colour with Linear-inspired hierarchy and restrained controls. Follow the confirmed requirements; treat the new contour route and exact placements as proposals for my review. Build one polished, isolated desktop/phone proof of Returning Today, running Focus, middle completion and route/goal detail, with realistic labelled sample content and long-text coverage. Record files before changing them, preserve existing dirty work and personal records, inspect the proof in the browser, update HANDOFF with actual evidence, show the result and stop for my visual feedback. No app-code changes, provider calls, dependencies, commits, push or deploy.
