# Implementation specification

## Current local implementation — three increments
The static ES-module runtime uses state.js (validated canonical transitions), timing.js (injected-clock accounting), storage.js (IndexedDB strict-durability snapshot transaction + lifetime exclusive Web Lock, owner token/revision, exact operation receipts, BroadcastChannel read hints), and work.js (real controller/retained UI adapters). proof.js isolates fictional scenarios and shares presentation only. Each new asset is explicitly allowlisted/copied. See DAY_BUILD_PLAN.md and DAY_BUILD_EVIDENCE.md for the execution contract and evidence.

## Current runtime

A dependency-free local browser prototype lives in demo/index.html, styles.css, proof.js, work.js, state.js, storage.js and timing.js. Real records use browser-local IndexedDB. Fictional examples remain volatile and clearly separate. Node.js 20+ serves only those assets on localhost; unknown/private/traversal paths return 404, write methods return 405, and HEAD has no body. Build copies only those seven assets into dist/. There is no server database, API route, framework, remote AI or notification service.

Run and build commands are in README.md. All commands resolve to this same demo. Generic agent skill directories are development guidance only.

## Canonical state and committed transitions

Schema v1: revision, ownerToken, goals keyed by UUID, openGoalId|null, ordered actions keyed by UUID, contexts keyed by action ID, sessions, activeSessionId|null, immutable effort intervals keyed by session/sequence, operation receipts, events and undo|null. B-era v1 records without events/undo are accepted as empty optional completion fields, initialized on the next validated mutation; no historical dataset import occurs. Unsupported schemas and malformed references/bounds/totals are never reset or overwritten. Raw local export is offered where records can be read. Limits are listed in README.

Every mutation rereads the snapshot inside an IndexedDB readwrite transaction, validates owner token and revision, applies a pure transition, stores the operation identity/fingerprint and awaits transaction completion before publishing success. Exact retries do not duplicate time/events. Structural edits are locked during a block; recorded actions cannot be deleted. Paused title edits retain IDs and links. Corrupt/newer data stays preserved; no fallback localStorage engine exists.

Start/Resume succeeds only after a commit. Fresh wall/performance anchors start after that commit. Approximately 5-second checkpoints use elapsed monotonic time rather than callback counts. Deltas must be nonnegative, at most 15 seconds and agree within 2 seconds; uncertain gaps are discarded entirely, with interrupted state requiring explicit Resume. Reload/owner takeover also interrupts stored running work at the last committed checkpoint. BFCache lifecycle handlers cover pending writes finishing across restoration. Navigation/visibility alone does not pause. Write failures freeze locally, retain exact Retry, and reconcile into interrupted state before Resume. Crash can lose the final uncommitted tail; write latency is deliberately uncredited. This is not proof of attention or unrestricted background accuracy.

Pause freezes immediately, then commits trustworthy time before showing notes. Blank/whitespace/Skip preserves each previous useful field. Expiry records only remaining time and leaves the action open. +5/+10/+20 increases remaining/allocation without resetting effort; paused/expired extensions never auto-resume. The exclusive Web Lock has no lease or automatic live-owner takeover; read-only tabs reread on BroadcastChannel hints and explicitly retry ownership after the owner closes. versionchange closes the connection and asks for reload.

Complete-action atomically stops trustworthy timing, marks the exact current action and appends its audit event once. Durable Undo contains the pre-outcome action/context/stopped-session snapshot AFTER accounting the trustworthy tail, the completion event ID and expected revision. It restores that exact context/remaining/effort in stopped state, appending a reversal audit; recorded intervals are not subtracted. Any later domain mutation invalidates Undo; navigation and ownership-only reload claim preserve its revision guard. Stale revision/event Undo is rejected.

All-checked leaves the goal open. Review can add a bounded action, keep open or explicitly finish. Finish stores the UTC timestamp and event reference; only a newly applied finish opens the shared immediate reward. History derives from completed goals, not seeded cards. Reopen is allowed only without another open goal; it invalidates current completion status but retains IDs, context, effort and prior audit. Checked actions stay checked until explicitly corrected. Action correction reverses outcome status only; no time starts automatically. Refinish updates the same goal identity, not a duplicate card. Geometry remains illustrative; canonical outcomes and effort are shown separately.

## Optional work reference — bounded return pass

Schema remains v1. The only new canonical key is optional `context.resourceUrl`; old records without it validate unchanged, with no read-time migration. `normalizeResourceUrl` in state.js is shared by command validation and rendering. It trims surrounding spaces, requires explicit absolute HTTP(S), rejects credentials/control characters/backslashes/relative or other schemes, preserves query/fragment, and bounds input and normalized output at 2,048 characters. Stored values (including Undo context) must already be valid normalized strings; malformed records use the preserved-data error path, never silent repair/reset.

Notes with an absent/blank URL preserve the saved reference; a valid nonblank URL replaces it only after commit; explicit `resourceUrl:null` deletes the optional key. Skip changes no context. `context.updatedAt` is note-save time, not activity tracking. Existing receipt identity, transactional publication and full Undo restoration are unchanged. Pause drafts retain instruction/context/link/disclosure/removal state in memory across navigation/modes; Save/Skip discard that draft. Cmd/Ctrl+Enter uses normal form submission only in the pause form and ignores IME composition.

Today, Focus saved context and finished history use escaped native Open work anchors with `target="_blank" rel="noopener noreferrer"`. No prefetch, automatic reopening, external capture or timing command occurs. Goal counts describe completed actions out of the full goal separately from effort; geometry remains illustrative. See RETURN_EXPERIENCE_EVIDENCE.md for current verification and limitations.

## Deferred decisions

Reminder neglect thresholds, quiet hours, delivery provider and cancellation; priority weights and aging; streak timezone and grace display; effort-to-route mapping; floating-strip capability/fallback; AI provider and costs. No reminder provider or permission prompt is implemented. Closed-site delivery needs a separate verified design.

## Verification boundaries

Node tests verify domain/clock invariants plus static serving/security/build parity. Local Playwright exercises actual IndexedDB/Web Locks, write aborts, complete core loops, literal/long text, keyboard controls, themes, reduced motion and 390px rendering. Controlled clock/expiry/lifecycle fixtures are labelled as such, not physical-sleep evidence. Physical Mac sleep/wake, unrestricted background use, branded Chrome/Comet, phone hardware and native BFCache eligibility remain unverified. No hosting/submission claim. User review of the combined prototype is the next gate.
