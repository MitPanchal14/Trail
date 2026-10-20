---
doc: spec
status: approved
---

# Work Trail — Technical Blueprint

Approved architecture and defaults: October 15, 2026, following handoff-review.md. Details below implement that agreement; no app code or verification results are implied.

## How This Works, In Plain Language

The website keeps your tasks, saved thoughts, timer position and earned trail in this browser. Returning on the same device restores your place. There is no account or device sync. Export a backup before clearing browser data; import restores it after review. The public link lets other people maintain their own separate records.

When you request a plan, a small server endpoint sends only your submitted description/context to Gemini and returns a draft. You inspect and edit it before accepting. The server keeps the API secret out of the browser. The pixel world draws your records; it never decides that work was completed.

## The Core Journey Through the System

Implements `prd.md > The Core Journey`.

Capture text or correct a voice transcript → server validates and requests an AI draft → review all steps → accept a mountain and stable subtask IDs → select and commit today's actions → Start/Resume → save timer heartbeats and optional context → complete or save → derive checkpoint colours and daily history from records. Reload recovers unfinished work and asks for Resume. Explicit goal confirmation creates summit light.

## Stack

- Next.js App Router, React, TypeScript: one app with server route handlers. [Next.js docs](https://nextjs.org/docs/app), [React](https://react.dev/learn), [TypeScript](https://www.typescriptlang.org/docs/).
- CSS modules/global design tokens and Canvas 2D: readable controls and an original pixel terrain renderer. No game/3D engine. [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
- Browser localStorage: small versioned JSON snapshot; no hosted database. [Storage docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- Gemini REST API with structured JSON and runtime validation, using Zod for request/response/backup schemas. [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output), [Zod](https://zod.dev/).
- Vitest for domain tests; Playwright for core browser paths. [Vitest](https://vitest.dev/guide/), [Playwright](https://playwright.dev/docs/intro).
- Vercel for deployment. [Hosting docs](https://vercel.com/docs), [plan limits](https://vercel.com/docs/plans/hobby).

During slice 1 verify supported Node/Next versions, choose stable compatible versions, pin them and commit package-lock.json. Do not invent versions or pricing. Provider quotas and available model IDs must be verified against the user's actual Gemini project in slice 3.

## Where It Runs and How Someone Tries It

Planned commands, to implement in package.json: `npm ci`, `npm run dev` → http://localhost:3000; `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`. Use a supported Node LTS matching Next.js requirements. These commands have not yet been executed for an app.

Create a secret-free .env.example with GEMINI_API_KEY, GEMINI_MODEL, ENABLE_AI_PLANNING, PUBLIC_AI_PROTECTION_ENABLED. Real keys belong in .env.local or Vercel environment settings. Missing keys disable AI gracefully; the manual loop works without them. Protection flag alone is never evidence of abuse protection.

Deploy the root Next.js project to Vercel after build checks. Configure server-only variables, verify the deployed loop and privacy copy, keep AI disabled unless real deployment abuse protection is verified. Document URL, environment configuration and actual limits. Recheck hackathon rules/deadline before shipping; prepare public source and a short demo video as separate deliverables. No submission is authorized by this handoff.

## Look and Feel

Implements `prd.md > Look and Feel`. Reference devpost/design-lab/index.html, not its research controls or fake data logic.

Bento + pixel world, user-selected Dusk default (supersedes Woodland): background #182b29, card #213b35, ink #edf0db, muted #b6c5b2, action #c6d28e with dark #182b29 text, border #3e5549, foliage #5a7959/#769068/#647e5d, stone #849789/#a7b39c/#6d877a, water #5b969b, earned light #dec47f. Control outlines may use #819880 for contrast; focus uses gold. Keep natural evening terrain distinguishable. Preserve the original terrain geometry and bento layout; no theme selector. Canvas local colour spreads over 420ms, then persists for the displayed completion state; reduced motion renders immediately. Completion lanterns and warm path differ from the coral climber/pale-blue current or saved position and neutral future path. Saving adds no illumination. Use system sans text, compact introduction, readable saved context and touch targets. No tiny pixel body text, neon-dominant shell, XP or health bars.

Desktop: landscape and next-action card share the primary row; compact day plan below. Mobile: action remains immediately identifiable, landscape stays generous, planning secondary. Focus recedes navigation/planning and emphasizes action, timer and mountain. Original layered/isometric pixel artwork should feel like a coherent terrain with a path, not disconnected geometric decorations. Empty terrain already has natural colour. Saved context must be as legible as the Start/Resume action.

Reduced motion suppresses climbing/spread animations while preserving final rewards. Provide HTML checkpoint buttons/details equivalent to canvas positions. Keyboard navigation, focus indicators, labels and textual statuses are required. Do not announce every timer second to screen readers.

## Components

### Today and Daily Planner

Implements `prd.md > Daily Planning and Next Action`, `Screens and Layout > Today`. Select the latest saved unfinished step, else first unfinished committed step. Draft daily selections are separate from commitments. Explicit Commit today's plan adds immutable commitment identities; remove/defer updates disposition without erasing history. Subsequent additions also become commitments. Availability context accompanies an optional AI day-plan request; manual ordering always works.

### Task Capture and Review

Implements `prd.md > Large Tasks and Reviewed AI Breakdown`, `New Task Flow`. Editable text, optional voice transcript, full goal/finish-condition/subtask review. Add/remove/reorder/rename before acceptance; accepted removals archive records. Persist creation draft locally without creating a mountain until acceptance. Stop microphone on exit; unsupported/denied recognition preserves typing. Disclose platform recognition may send audio to its service. [Web Speech docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

### Focus and Recovery

Implements `prd.md > Countdown Focus Sessions`, `Save My Place and Interrupted Sessions`.

**October 20 bounded addition:** `update-progress` targets the selected unfinished nonarchived subtask outside running/paused focus. Store both manual fields in optional `Subtask.returnContext`, mark existing mountain savedSubtaskId/savedAt and preserve every session/time/reward record. Dispatch is transactional (persist before publishing) under the existing ownership/expected-raw guards. Dialog drafts are transient; Cancel/Escape never dispatch. Bind editor to the captured snapshot/target and reject stale state, lost ownership or backup replacement. Failed saves keep draft/recovery available without a success message. Today uses one effective context helper: action returnContext, else latest session note/returnStep. On explicit Start/Resume/extend copy the action context into the genuine session and remove the action override so later focus edits stay authoritative. No phantom session or absence credit. Recovery includes context-only saved actions when prioritizing the latest mountain saved position.

One active session. Validate integer duration 1–120 minutes; extension can add 5 minutes or an edited valid duration. Running timer uses timestamp deltas, not tick-count arithmetic. While the tab is open, hidden/background work continues and catches up on the next tick. No completion at expiry.

Persist an atomic snapshot on every state transition, note edit (debounced), and roughly every second while running; persist on pagehide as best effort. Store remainingMs and credited elapsedMs at the last heartbeat, running deadline and heartbeat time. Credit at most the available remaining time for each running segment. On startup recover only the stored heartbeat values, never compute time from the old deadline to now; change running to interrupted and require Resume. Pause stops time; Save exits focus. Extension creates a new running segment without recounting earlier segments.

Closing/crash recovery is necessarily approximate: normally within a heartbeat, but background throttling or a crash can leave an older snapshot. Do not promise exact last-second recovery or back-credit an unobserved closure gap. Reopening after a day must preserve the last durable remaining time and notes, with no absence credit. Show recovered timestamp when useful. Handle clock jumps conservatively, clamp negative/oversized deltas and disclose questionable time rather than fabricate it.

One editing tab at a time: use the Web Locks API where available to own writes; other tabs read-only with an explanation. Fallback detects another tab via a storage/BroadcastChannel lease and blocks editing; unresolved concurrent ownership pauses safely. Never run two timers silently. Tests must cover tab contention and recovery.

### Mountain World and Details

Implements `prd.md > Mountain Trails, Checkpoints, and Colour`. Seed each terrain from its immutable mountain ID. Allocate a monotonically increasing checkpoint slot per accepted subtask; never recompute positions from current ordering. Unstarted steps can preview their next position without earning colour. Renderer derives illumination from active completion records, so Undo reverses only their contribution. Stable path extension accommodates new slots without moving older ones; no infinite fixed canvas assumption or arbitrary percentage.

Summit confirmation is separate from step completion. Record related completion IDs at confirmation. Reopen changes current status but keeps historical summit achievement. Correct mistaken goal completion revokes that confirmation. Undo linked steps asks if the summit is also mistaken; retain valid history if declined. Every checkpoint has real action/date/context/time details. Completion and correction are idempotent.

### Progress and Reports

Implements `prd.md > Yearly Activity Grid and Day Details`, `Factual Progress Reports`. Derive counts from active completions on their recorded local dates. Grid includes the selected calendar year (365/366 days), neutral future/pre-use days and fixed bands. All-done marker requires nonempty historical commitments and each completed on that commitment's date; removed/deferred unfinished items prevent the marker. Undo recomputes it. Display actual completion-day data for late work. Compare complete equivalent periods; show insufficient history when appropriate. No fabricated measures of attention or task value.

### Storage and Backup

Implements `prd.md > States and Boundaries`. Load/validate once on the client; avoid server hydration showing fake history. Save one schema-versioned JSON snapshot. If blocked/full/corrupt, show a persistent warning, preserve in-memory work and offer export; do not claim it is saved. Preserve corrupt raw data for recovery rather than overwrite automatically. Import max 2 MB, schema/relationships/date validation, review counts then explicit replace confirmation; no script/HTML execution. Export excludes secrets and contains personal notes: label as private. Demo data is isolated and opt-in, never merged into personal history.

## Data Model

All IDs are UUIDs. Timestamps ISO UTC; elapsed/remaining integer milliseconds. Root snapshot `{schemaVersion:1, revision, firstUseAt, calendarTimeZone, mountains, subtasks, sessions, completions, summitConfirmations, dayPlans, creationDraft, selection}`.

- Mountain: id, title, description, finishCondition, terrainSeed, nextCheckpointSlot, status (active/completed/reopened), createdAt, savedSubtaskId, savedAt.
- Subtask: id, mountainId, title, nextAction, suggestedMinutes, orderKey, checkpointSlot, archivedAt; optional returnContext `{note: string <=2000, returnStep: string <=500}` for manual updates outside focus. Absent in old records; session context remains the fallback. Finished state derives from its active completion, not a second contradictory boolean.
- Completion: id, subtaskId, completedAt, localDate, calendarTimeZone, note snapshot, associated session IDs, undoneAt. Only one active completion per subtask; keep corrected records without active credit.
- Session: id, subtaskId, status (running/paused/saved/interrupted/expired/completed), startedAt, lastHeartbeatAt, remainingMs, creditedMs, runningDeadlineAt, lastAccountedAt, note, dailyElapsed buckets. Accumulate each open-tab segment once, split at local midnight for daily time totals. Editing a saved note updates context, not historical completion snapshots.
- Summit confirmation: id, mountainId, confirmedAt, relatedCompletionIds, revokedAt. Reopen does not revoke; correction does. Active confirmation controls historical illumination; current mountain status controls completion wording.
- Day plan: dateKey, availabilityText, draftSubtaskIds, committedAt, commitments. Commitment: id, subtaskId, committedAt, disposition (planned/removed/deferred), dispositionAt. Unique subtask per date; reactivation uses same commitment ID. Keep title snapshots for readable archived history.
- Creation draft: editable description/transcript, reviewed goal/steps, request state; not accepted achievements.
- Selection: selectedMountainId/selectedSubtaskId; running session reference validated on load.

October 20 compatibility: retain schemaVersion/storage key 1 with optional validated returnContext. Old snapshots/backups load unchanged, new exports/imports retain context. Existing released strict-schema builds may reject a newer backup containing returnContext; use the updated local candidate to restore it. Do not deploy or silently strip fields to mask that boundary. Completion note snapshots remain historical; updating a reopened action does not rewrite them.

Choose calendarTimeZone from the browser's IANA zone on first use, show it in Progress and preserve it thereafter. Compute local date with Intl.DateTimeFormat, never ISO slicing UTC. Store each event's local date/zone at creation so travel does not rewrite history. No timezone-changing UI initially. Dates remain visible and midnight does not discard unfinished work.

## File Structure

```
app/
  layout.tsx              # shared navigation and metadata
  page.tsx                # Today and focus mode
  mountains/page.tsx      # mountain selection/details
  progress/page.tsx       # calendar and factual reports
  api/plan/route.ts       # bounded server-only AI adapter
  globals.css            # tokens, responsive base, accessibility
components/
  TodayView.tsx           # next action/context/day plan
  FocusView.tsx           # countdown and outcomes
  TaskCreation.tsx        # transcript, draft review, manual fallback
  MountainWorld.tsx       # canvas plus equivalent HTML controls
  ProgressView.tsx        # date grid/detail/report
  StorageNotice.tsx      # persistence and backup controls
lib/
  domain.ts              # types and validated schemas
  actions.ts             # pure transitions and idempotency
  storage.ts             # snapshots, migrations, import/export
  timer.ts               # heartbeat accounting and recovery
  calendar.ts            # local dates, buckets, derived statistics
  terrain.ts             # deterministic positions/pixel drawing
  planning.ts            # request/response contracts
  gemini.server.ts       # secret-only REST call
  tab-ownership.ts       # single-writer guard
 tests/                  # domain/timer/calendar/backup tests
 e2e/                    # real browser core journey
 devpost/                # canonical planning and build tracking
 BUILD_PROMPT.md         # OpenCode entry point
 HANDOFF.md              # actual progress/evidence
 README.md               # setup, limits, demo instructions
 .env.example            # secret-free variable names
 package.json            # reproducible commands
 package-lock.json       # pinned dependency graph
```

## External Services and Dependencies

Browser `POST /api/plan`: `{kind:'breakdown', description:string}` or `{kind:'day', availability:string, candidates:[{id,title,suggestedMinutes}]}`. Limit description 6000 characters, availability 1000, candidates 50, body 32 KB. Return `{kind:'clarification',question}` or `{kind:'breakdown',goal,finishCondition,steps:[{title,nextAction,suggestedMinutes}]}` or `{kind:'day',orderedSubtaskIds,reason}`. Validate 1–20 breakdown steps, durations 1–120, title lengths, nonempty finish condition, known unique day IDs. Client generates durable IDs only on acceptance. Clarification retains prior text. Never invent candidate IDs.

Server calls `POST https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent` with `x-goog-api-key` server header, contents describing the bounded task and generationConfig requesting application/json plus provider-supported schema. Verify current schema field spelling/availability from official docs before wiring; parse candidate text and validate again locally. Treat user text as data, not permission to change system instructions. No research-fact claims or autonomous actions. No automatic retry loop; timeout about 25 seconds and return actionable retry/manual fallback. Error envelope `{error:{code,message}}` with 400/429/502/503 as appropriate; never echo keys or upstream raw logs.

Slice 3 contract review: use `generationConfig.responseFormat.text` with API-reference MIME enum `APPLICATION_JSON`. Project generated Zod schemas onto Gemini's documented subset (literal `const` becomes `enum`; string lengths/UUID syntax remain enforced at runtime). Reject blocked or incomplete results, exclude thinking parts and parse final text only. Keep provider request/access/model/quota errors distinguishable without exposing upstream details. Public production AI remains disabled unconditionally; live provider acceptance and project quota require separate credentialed evidence, recorded in HANDOFF.md rather than inferred from mocks.

Gemini model and project cost/quota are not yet known. Select a currently supported low-cost structured-output model after checking access; do not call a guessed retired model. ChatGPT Plus does not fund this app's Gemini API usage. Vercel costs/plan eligibility must be checked for the actual account; no zero-cost guarantee.

Reject untrusted origins and invalid bodies. Production AI enabled only with verified deploy-appropriate persistent/edge rate limiting or equivalent abuse protection, bounded provider quota/budget and server timeouts. In-memory counters across serverless instances are insufficient. If protection isn't available under this architecture, disable public AI and explicitly disclose manual-only public mode. AI remains a real integration for authorized local/demo use, never fake live responses.

## Important Failure Modes

AI missing/slow/invalid/rate-limited → preserve input, clear error and manual editor. Voice unsupported/denied → typing retained. Storage failure → unsaved warning/export. Reload/closure → interrupted state with last durable timer and explicit Resume. Concurrent tab → read-only warning. Empty plan/history → genuine empty states. Missing context → say no note saved; never invent an account of external work.

## What Was Simplified and Why

Browser-local records avoid auth/cloud sync. Native recognition avoids another voice service. Canvas avoids a 3D engine. Manual planning works without API access. Reports are small factual derivations. No routines/widgets/sharing/social systems. These are accepted limits, not deferred hidden dependencies.

## Decisions and Open Issues

The learner approved the architecture, product defaults and build order in handoff-review.md; the later user-selected Dusk default supersedes its original Woodland choice. Details such as UUIDs, schemas and file boundaries follow that decision. Known learner uncertainty was backend/deployment: the browser stores personal history; the server protects the Gemini key and makes planning requests; hosting makes the app publicly reachable. The build must demonstrate those boundaries and the first deployment.

No consequential product question remains. Implementation checks remain: dependency versions, browser speech compatibility, background heartbeat precision, Gemini model/quota, production abuse protection and hosting eligibility. Verify and record findings in HANDOFF.md; don't silently add a database/service, invent success or claim perfect closure recovery.
