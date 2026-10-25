# End focus block — pre-edit contract

25 October 2026. Preserve local HEAD 041fe89 and all imported/user changes. Only this approved correction; no publication or note clearing.

## Exact files
- `demo/state.js`: extend schema-v1 session status enum with `ended`; validate ended sessions are never active and have null owner. Add `end-block`, requiring current session ID, workspace owner token and expected revision, and paused/interrupted/expired status. Keep session fields/intervals/context/actions/goals/events unchanged except session status/owner and activeSessionId. Normal operation receipt, revision/updatedAt and Undo invalidation apply. Existing v1 records need no migration. Restrict Extend to supported stopped statuses.
- `demo/work.js`: reuse one secondary End focus block control/explanation in stopped real Focus and locked editor. Running editor route asks Pause first; no timing command used by End. Capture editor draft; after committed end render same view, retaining edits and exposing unlocked editor or no-active Focus with explicit Start/Edit. Existing write/commit/exact Retry path owns publication/failure handling; no presentation reward callback.
- `tests/state.test.mjs`: failing regression first; stopped variants, immutable records, stale/running/missing/foreign rejection, terminal validation, fresh blocks/aggregate effort, reorder/guards, completion/Undo/history.
- `tests/browser.mjs`: focused end-block gate plus existing complete suite integration. Actual checkpoint and aborted end/edit writes, exact Retry/replay, owner/revision checks, reload/fresh Start, context/effort identity, multiple blocks/completion/Undo/history, campsite/no rewards, keyboard/themes/390px/read-only controls.
- `README.md`, `devpost/spec.md`, `HANDOFF.md`, `devpost/checklist.md`, new `devpost/END_FOCUS_BLOCK_EVIDENCE.md`: current contract/results/limits. This plan is the only additional file. No artwork/styles/storage/timing/dependency edits planned.

## Failure and invariants
An end command includes sessionId/ownerToken/expectedRevision, so an older control cannot terminate a replacement block or cross-owner/revision state. Exact accepted command replay returns its prior receipt before those checks. LocalStore independently checks live owner/revision and publishes only on transaction complete. Abort leaves canonical activeSessionId/status/effort and structural lock unchanged; controller retains exact pending command/callback, blocks mutations and shows Retry. Timing is already stopped and stays stopped. End creates no completion event, context timestamp, movement or celebration. Existing removal protections retain ended-session action references; reordering can change next unfinished action without moving notes/effort. No second Undo or automatic Start/Resume.

## Verification
Focused domain/browser checks during development. After final runtime edits: syntax, full Node tests, build parity, diff check and existing complete Chromium suite once. Inspect captures. Stop for independent review; physical-device/user acceptance remains separate.
