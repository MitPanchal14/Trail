---
doc: spec
status: draft
---

# Trail — technical revision pending product and visual decisions

October 24, 2026. The previous approved technical plan is archived at `replan-2026-10-24/previous-approved-spec.md`. Its old visual instructions do not apply to the new direction.

## Current verified source facts

Repository package.json declares Next.js 16.4.1, React 19.3.1, TypeScript and existing Vitest/Playwright tooling. This was a read-only source inspection, not a fresh build or compatibility test.

`lib/domain.ts` stores goals under the legacy name `mountains`, plus subtasks, sessions, completions, explicit summit confirmations, plans and selection. `lib/storage.ts` uses `work-trail:snapshot:v1` with validation and recovery safeguards. The name of a stored field is not a requirement to retain a mountain-shaped visual.

`lib/timer.ts` distinguishes running, paused/interrupted and expired state. Recovery of a running session marks it interrupted; current recorded time is retained. Daily recorded time and completion counts are projected separately in `lib/progress.ts`. Retain these protections unless an explicit revised contract replaces them.

## Architecture direction

Continue in this repository; no framework migration or new backend is justified by this visual revision alone. Never clear user records or change storage keys as a shortcut to redesign. No provider configuration changes or live requests are authorized by documentation work.

Before future Next.js code changes, read applicable installed guides under `node_modules/next/dist/docs/` as AGENTS.md requires. Read the specific sections relevant to the touched code rather than assuming familiar APIs.

## Contracts to complete after PRD/design review

- Importance/category persistence and an explainable weighted recommendation ranking: clarify neglect clock/reset, normalization, weights, threshold, remaining-subtask contribution and precedence before selecting an implementation. Important unfinished work must remain recommendation-eligible after recent effort. Do not silently alter the stored schema.
- Route projection distinguishes subtasks from their sessions: a completed subtask receives a mild glowing state; an unfinished session is tagged Unfinished. Preserve recorded time and avoid duplicate completion credit. Geometry, time-to-length and landmarks need a proposal with stable record identity.
- Timer display, explicit +5/+10/+20 minute extensions, unfinished action retention, unexpected closure and recovery.
- Completion-earned streak derived from dated, non-undone completion records: first completed subtask qualifies a day, extra same-day completions influence icon intensity only. Missed days stay blank; a short grace period is requested before reset. Confirmed break rule: three consecutive missed calendar days. One or two misses are tolerated, and qualifying completion interrupts the miss run. Define displayed count during grace, calendar timezone and correction rules before implementation.
- New visual component boundaries; replacement of old terrain rendering without destructive data migration.
- Focus strip capability detection, actual browser dimensions, state sharing and close behaviour.
- AI review/cancellation/failure contracts, grounded content and public access controls.
- Date boundaries, cross-tab ownership, storage failure, import/export and corrections.
- Shared composed-gradient system across designated graphics/rewards, stable record colour identity, readable neutral text surfaces and a static reduced-motion equivalent; exact hue/rendering choices follow visual proof.
- Automatic morning/daytime reminders for neglected important work, including another-tab and closed-page delivery. No service-worker/Push API integration was found in the inspected runtime. Specify push subscription, receiving worker, external sender/scheduler, minimal remote eligibility fields, cancellation/rescheduling on progress/completion, permission/support states, timezone, frequency caps and OS/browser delivery limits. This is a new requirement; do not substitute page timers or claim local-only data handling. Architecture rationale and first-party references are in `replan-2026-10-24/REPOSITORY_AUDIT.md`.
- Accessibility, responsive layout, reduced motion and visual-proof acceptance criteria.

Do not approve or implement this unfinished technical contract. See `replan-2026-10-24/OPENCODE_HANDOFF.md` for the proposed first design-proof task. Historical spec HTML has been archived and replaced with a status notice.

## Visual revision 01b — implementation constraints to retain

First-visit landing and returning-work entry must be distinct; do not award focus or start a clock from marketing navigation. Preserve 01a state transitions. Journey hover/focus/selection must share stable step identity with route highlights and details; touch does not depend on hover. Theme through semantic tokens in light/dark; proof toggle can reset on reload, while production default/persistence remains to be specified. Focus ambient motion is optional, low amplitude, compositor-friendly where practical, and stops under reduced motion or explicit still mode; controls remain stable/readable. Exact design and time-to-geometry mapping remain proposed. Task 01b is isolated proof work only.
