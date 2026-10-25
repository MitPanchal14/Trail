# OpenCode brief — first functional slice

## Latest dispatch authorization — Cloud handoff, 25 October 2026

This brief also applies to the user's forthcoming Codex Cloud task. The user has authorized the first slice with the retained UI and tested commits/pushes only to `codex/trail-redesign`. Once the user launches that Cloud task, this later authorization supersedes earlier planning-only/no-commit/no-push defaults in this brief. It does not authorize main changes, force-push, deployment, redesign or slice 2. Verify the repository and branch first, preserve existing work, and stop with a clear report if they differ. Use the Cloud environment's available configured model; the original OpenCode model instruction is not a Cloud setup requirement. Do not require private local paths or handoff files in Cloud. Physical Mac sleep/browser checks unavailable in Cloud must remain explicitly unverified. The local overnight automation must be disabled before Cloud implementation begins.

Prepared 25 October 2026, Asia/Kolkata. Status: planning only; implementation has not started. This is the proposed bounded dispatch, not evidence that any functionality exists. Runtime authority remains AGENTS.md and current product documents. Use GPT-6.1 Sol with medium reasoning when the user dispatches this brief.

## Recorded changes for this planning task

Create this brief; link it from HANDOFF.md and devpost/checklist.md. Do not alter runtime source, architecture or product completion claims. No commit, push, deployment or OpenCode dispatch is part of this planning task.

## Verified starting point

- Branch: codex/trail-redesign. HEAD: 8dcc835cbecf80aecdbd46393b798629724b5d43. Tracked/untracked Git status was clean before this planning task.
- Origin: https://github.com/MitPanchal14/Trail.git. Live remote refresh failed because github.com could not resolve. Local tracking refs are not fresh remote verification.
- Only demo/index.html, demo/styles.css and demo/proof.js form the current website. Server and build explicitly allow/copy those three assets.
- Fresh checks: npm run check, npm test (4 passed), npm run build. These establish static baseline checks, not functional acceptance. No fresh browser inspection was performed in this planning task.
- proof.js uses a global in-memory scenario state, sequential completion count, Date.now deadline and simulated elapsed time. reset() seeds fictional completed actions. Boot always opens landing. Pause currently permits clearing context; this conflicts with the intended blank-preserves-context rule and must change in real mode.
- Goal name, dates, route labels, 45/70-minute totals and record descriptions are hardcoded. Real-mode rendering must remove these assumptions. Do not copy sample counts or dates into user records.
- LOCAL_CHAT_HANDOFF.md is ignored and local. Ignored credentials, caches and historical leftovers are not source. Do not read secrets or remove these files.

## Outcome and stop boundary

One person can create one real open goal with ordered editable actions, focus on its first action, pause with optional return context, reload and explicitly resume the saved block. The same UI composition becomes useful with actual local records.

Support one open goal in this slice; make that limit clear and retain all its actions. Do not implement a multi-goal dashboard or goal deletion. The next action is the first ordered action because completion is deferred. Do not silently mark steps completed to advance the workflow.

Defer action completion, CompletionEvent writes, Undo, final review, confirmed goal completion, finished history and reopening to slice 2. In real mode omit unavailable completion/review controls and show an honest empty Finished work state with a short capability explanation. Keep the existing fictional completion scenarios available only in explicitly labelled example mode. Do not claim the first slice completes the full product loop.

Also exclude AI, auth, backend, notifications, streaks, importance scoring, category selectors, floating windows, external services, route-distance/time mapping, visual redesign and migration to a framework. No stash restoration, package installation, commit, push or deployment.

## Read before implementation

Read AGENTS.md, README.md, HANDOFF.md, devpost/scope.md, devpost/prd.md, devpost/design-brief.md, devpost/spec.md, devpost/checklist.md, BUILD_PROMPT.md, this brief, CLEANUP_PLAN.md and devpost/CLEANUP_RECEIPT.md. Read LOCAL_CHAT_HANDOFF.md if present, but do not require this private file on another machine. Inspect all current demo, server, build and test files.

Current docs supersede historical memory and generic agent templates. Do not restore app/, components/, lib/, Next/React setup, pixel mountains, 01d or historical proof directories. Do not invoke broad workflow templates that expand the dispatch.

## UI contract

Preserve the retained header, typography, surfaces, gradients, spacing, theme controls, Today two-column hierarchy, route artwork treatment, Focus composition and pause form. Capture baseline landing/Today/Focus/pause at desktop in both themes before edits. Compare equivalent views afterward; necessary real-input and truthful-label changes are allowed. Landing simplification, rail removal, dark redesign and reward replacement are separate pending work.

- First visit keeps the landing composition. Start working opens a real empty state and then a compact goal form. Returning with saved work opens Today directly.
- Form: required goal title, required definition of finished, at least one required action. Allow add/remove drafts, edit action titles and keyboard-accessible Move up/Move down. Require explicit Save; Cancel leaves saved work untouched. Use existing field/button styling. Suggested bounds: title 160, definition 2,000, action title 500 characters; 1–30 actions. Explain limits at inputs. Keep drafts on validation/storage errors.
- After creation, provide an Edit goal/actions entry. Preserve IDs/context/session links during title edits and reorder. While a block exists, prevent deleting or reordering its target action; explain that restriction. Simplest supported rule: disable structural edits until no block exists; title/definition edits remain allowed when paused. Do not silently retarget a block.
- Today prominently shows saved nextInstruction, falling back to the current action title, with original action and optional context below. New block says Start focus; paused/interrupted says Resume focus. Merely visiting Focus does not start it.
- Keep 20/25/45-minute duration choices and +5/+10/+20 extensions. Extensions increase remaining and allocated duration without resetting accumulated effort; require explicit Resume when paused/expired. A running extension stays running.
- Pause immediately stops local accrual before opening notes. Blank/whitespace fields and Skip preserve previous useful fields independently. Nonblank fields replace their respective saved values. Explicit context clearing is out of scope. Save only claims success on committed storage.
- Maintain clearly separated Real work / Fictional example entry. Example scenario selector/reset affect only volatile example state, never the database or real timing. Entering example mode while running requires first pausing real work; never run two engines. Returning to real work reads saved real state and stays paused.
- Real mode must not show fictional assignments, sample dates, earned checkpoints, sample minutes or previous-day claims. Retain route artwork as explicitly illustrative geometry with actual action names and unfinished/planned states; no invented checked markers. Show real total recorded effort separately; daily mapping is deferred. Empty selection must not crash recordDetail/highlightRecord. Long labels need safe truncation plus accessible full text.
- Real mode footer says records are stored in this browser on this site address, can be lost if browser data is cleared, and do not sync. Do not promise permanent storage. Changing port/origin changes storage. No notification/AI/PiP claims.

## Architecture and file budget

Remain dependency-free ES modules. Prefer small plain JavaScript modules under demo/ for domain transitions, storage/ownership and timing, with proof.js coordinating rendering and events. Keep example data isolated. Do not build a generic state framework.

Before any implementation edit, record the actual file list and acceptance plan in this brief or a short linked task plan. Expected allowed changes: demo/index.html, demo/proof.js, minimal additive demo/styles.css; new demo/state.js, demo/storage.js, demo/timing.js or similarly scoped modules; scripts/serve.mjs and scripts/build.mjs to explicitly serve/copy new assets; package.json check script; tests/*.test.mjs; current README/HANDOFF/spec/checklist and this brief for truthful implementation receipts. Preserve server path rejection, localhost binding and GET/HEAD-only behaviour. Test every new runtime asset in serving/build parity. No unrelated cleanup.

## State contract — write down before coding

Use stable random IDs (crypto.randomUUID), integer milliseconds, UTC wall timestamps for display/audit, ordered action IDs and a schemaVersion. Do not derive identity from titles or indexes. A single IndexedDB database and transactional snapshot store is sufficient. Use one canonical snapshot with monotonically increasing revision; validate before publish. No localStorage read-modify-write ownership scheme.

Proposed schema v1:

- Workspace: schemaVersion, revision, goal|null, actions keyed by ID, sessions keyed by ID, activeSessionId|null, updatedAt. Never persist UI dialog state as domain truth.
- Goal: id, title, definitionOfFinished, actionOrder[], status='open', createdAt, updatedAt.
- Action: id, goalId, title, status='open', createdAt, updatedAt. All remain open in slice 1.
- PauseContext keyed by actionId: id, actionId, nextInstruction, context, updatedAt. Missing values fall back to action title, never fabricated text.
- FocusSession: id, goalId, actionId, status running|paused|interrupted|expired, allocatedMs, remainingMs, creditedMs, ownerToken|null, lastCheckpointAt, interruptionReason|null. A new block gets a new ID; Resume retains its ID. Offer a new duration only before the initial block, or an explicit new block after expiry; do not discard the expired record.
- Effort intervals/activity: stable ID, sessionId, sequence, deltaMs, recordedAt; persisted atomically with session totals. Unique sessionId/sequence prevents retries from double-crediting. Totals derive from these intervals, not UI timer ticks. No daily/streak interpretation yet.
- CompletionEvent and completion Undo: reserved concepts for slice 2, no dummy completed records or invented schema behaviour now.

Validate references, unique action IDs/order membership, numeric bounds, finite values, status enums, accumulated totals and exactly one active session. Set practical record/string limits. Unsupported newer schema is read-only with explanation; never overwrite it. No historical dataset migration is required. Malformed storage must remain preserved; show recovery/error and offer raw local export where possible, never auto-reset. A destructive reset/import flow is not authorized in this slice.

Use IndexedDB transactions for every mutation, ownership token/revision checks and append-with-totals updates. Await transaction completion, not request success, before publishing durable success. Serialize commands and disable pending controls; reject stale/repeated Start/Resume/Pause/extend commands rather than duplicating sessions or interval IDs. Retry with the same operation ID when outcome is uncertain. An aborted transaction changes none of its domain records.

## Timing and interruption policy

This measures conservatively recorded elapsed focus time, not attention. Implement a pure, injected-clock accounting layer and document constants and limitations.

1. Start/Resume requires an explicit click and successful write while holding ownership. Set fresh wall and monotonic anchors only after commit. A failed write must not start a timer.
2. While the owner document is continuously running, compute elapsed from performance.now, never by counting callbacks. Navigation inside the loaded app and visibilitychange/blur alone do not pause. Another tab can be used for work.
3. Checkpoint approximately every 5 seconds. Accept only nonnegative wall/monotonic deltas that agree within 2 seconds and have neither delta greater than 15 seconds. Clamp credit to remaining block time. A callback gap over 15 seconds, clock reversal or material clock disagreement is uncertain: discard that entire gap, keep the last committed totals and remaining time, persist interrupted and require Resume. Do not infer when sleep began or add the gap on wake. Background throttling may trigger conservative interruption; explain this in evidence rather than claiming unrestricted background accuracy.
4. On any new page load, a stored running session becomes interrupted at its last committed checkpoint once the new document obtains ownership. Never credit from saved wall timestamp to now. Lose at most the uncommitted normal checkpoint tail on crash; document that deliberate undercount. pagehide/beforeunload writes are best effort only, never required for correctness. BFCache restoration also revalidates ownership and interrupts before Resume.
5. Pause freezes local time immediately and attempts to commit the last trustworthy interval. On failed persistence keep a stopped, unsaved state with visible Retry; prohibit Resume or competing writes until reconciliation. Do not display 'Your place is kept' as durable success during failure. Keep notes/drafts in memory. On successful Retry commit once; on reload recover only the last committed state.
6. Expiry commits only up to allocated time, sets expired/remaining=0, and leaves the action open. No automatic next block or completion. Extending expired state creates positive remaining time but stays paused until explicit Resume. Accumulated credit never resets or exceeds allocated duration.
7. If a checkpoint fails, stop local accrual, surface the error, retain last confirmed data and the pending operation for idempotent Retry. Do not keep accumulating memory-only time under a saved indicator.

The 15-second rule is an explicit conservative policy, not proof that every shorter sleep can be detected. Test Chrome/Mac sleep and background use and report observed limits. If browser behaviour cannot satisfy this contract, report the conflict and stop; do not silently credit uncertain time or introduce automatic Resume.

## Tab ownership

Use an exclusive origin-scoped Web Lock held for the lifetime of the writer document, combined with the persisted owner token and IndexedDB revision validation. Other tabs read via IndexedDB and update from BroadcastChannel messages (messages are hints; storage is truth). They cannot mutate work or control the timer while another tab owns it. Show a plain 'Open in another tab' state and instructions to close that tab; automatic takeover of a live owner is out of scope. Read-only tabs cannot overwrite drafts or stop a running owner. Reject queued commands with stale owner tokens.

When the owner closes/crashes and the lock is released, a contender may acquire it, reread the latest snapshot and convert running to interrupted before enabling explicit Resume. No expiry lease that lets suspended writers overlap. On versionchange close database connections and show reload guidance. Capability-test IndexedDB and Web Locks; without either, show a clear unsupported/storage-unavailable state with the fictional example still available. Do not fall back to unsafe multi-tab localStorage timing.

## Required transitions

| Command/event | Before | Result |
| --- | --- | --- |
| Save goal/actions | empty or allowed paused edit | atomically saved open goal/actions; no timer |
| Start | open action, no active block | one running session after commit |
| Resume | paused/interrupted, remaining > 0 | same session running after commit |
| Start/Resume twice | pending/running | no second session or added credit |
| Internal navigation/tab blur | running | same running owner |
| Pause | running | immediate local stop, committed paused or explicit unsaved failure |
| Save notes / Skip | paused | nonblank merge / exact prior context; no timing |
| Extend | running/paused/expired | add allocated/remaining once; preserve credit; expired becomes paused |
| Timer reaches zero | running | expired; action unfinished |
| Reload/crash/sleep uncertainty | running checkpoint | interrupted at last trusted durable values |
| Lock lost/storage failure | any write/timing | stop locally; reconcile; no false save |
| Complete/review/Undo | real mode | unavailable in slice 1 |

## Acceptance evidence

Add focused domain/storage/timing tests for actual invariants, with injected clocks and write failures. Browser integration evidence must exercise real IndexedDB, Web Locks and two pages; unit fakes alone do not verify browser ownership. Use existing browser tooling if available, without adding a framework/runtime dependency just for screenshots. If automation is unavailable, run explicit manual checks and report their status honestly.

1. Fresh origin has no fictional user records. Create a goal with definition and three actions; edit/reorder before focus; save/reload and compare IDs, text, order and next instruction. Cancel and failed save preserve the previous committed snapshot and draft.
2. Start 20 minutes, repeated Start, navigate Today/Journey/Focus and use another tab for 60 seconds. Verify one session and no double-credit. Record whether the background policy interrupts on the target browser.
3. Pause; save separate instruction/context; reload. Resume needs a click. Later blank either field and Skip preserve each prior value. Test nonblank replacement independently.
4. Clock tests: ordinary delayed ticks within threshold, >15-second gap, wall jump/reversal, remaining clamp, expiry and extensions. Prove interval totals and remaining do not double-count after retries.
5. Close/reopen running page, refresh, BFCache return and physical Mac sleep/wake. Verify no automatic Resume and no credit for the uncertain gap. Distinguish deterministic clock tests from observed browser evidence.
6. Two real tabs: owner runs, second attempts Start/edit/extend, owner closes, second acquires and recovers interrupted. Stress repeated clicks and stale messages. Exactly one writer and no duplicated intervals. Example reset never touches real records.
7. Inject denied/open errors, transaction abort/quota error, malformed v1 data and unsupported schema. No false saved state, overwritten corrupt records, lost draft or ongoing uncommitted timer. Retry writes once. Confirm error copy with blocked storage.
8. Render HTML/script-looking user text as literal text. Check 160/500/2,000-character limits, empty fields, 30 actions, keyboard reorder, focus placement, live error announcements, long text, 390px phone controls, both themes and reduced motion.
9. Real Journey and Finished contain no fictional dates/minutes/completions. Retained example scenarios remain labelled and volatile. Compare desktop baseline composition; list only necessary adaptations.
10. Run npm run check, npm test, npm run build; verify new assets served/copied and unknown/private/traversal paths still rejected. Test the built artifact through a static host if available; do not deploy it.

Save compact evidence with environment, steps, expected/actual outcomes and failures. Mark unperformed physical/browser checks unverified. Do not reuse old regression counts as evidence.

## Delivery receipt and stop

Update HANDOFF.md, devpost/checklist.md, spec and README to describe only implemented and verified capabilities, remaining example behaviour, local-storage limitations and deferred completion slice. Check only items fully demonstrated; partial acceptance stays open with a note. Record actual changed files, commands/results, browser evidence, known limitations and next bounded task. Stop after the first slice. No automatic slice 2, redesign, push or deployment.

## Paste-ready dispatch

> Implement only the first functional slice defined in devpost/FIRST_FUNCTIONAL_SLICE.md, using GPT-6.1 Sol with medium reasoning. Read its prerequisite documents and inspect current source first. Preserve the retained static UI and keep the site dependency-free. Before changing code, record your exact file/change plan and the state/storage/timing contract. Implement real manual goal/action creation, Today, explicit focus start/pause/extend, optional preserved pause context, transactional local persistence, conservative reload/sleep recovery and single-writer tab ownership. Completion, Undo and finished history are deferred; keep fictional examples isolated and labelled. Follow the acceptance matrix and document actual evidence and gaps. Update current handoff/checklist/spec/README, then stop. Do not restore historical code, redesign, install a framework, add providers, commit, push or deploy. If an essential contract cannot be met, explain the specific conflict before expanding scope.
