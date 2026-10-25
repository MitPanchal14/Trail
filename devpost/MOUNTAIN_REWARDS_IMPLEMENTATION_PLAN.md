# Mountain reward implementation plan — 25 October 2026

Before edits: branch codex/trail-redesign, HEAD 4d2b9fb. Preserve all uncommitted mountain runtime/tests/docs and newer reward planning. Scope: OPENCODE_MOUNTAIN_REWARDS.md. One writer; no publication.

## Exact affected files
- `demo/proof.js`: retain mountain geometry/tokens; add real/example goal identity and action identity to presentation; replace index-global ring with identity-scoped 600ms earned segment/checkpoint/five local sparks. Shared bounded cleanup on rerender/navigation/selection/theme/motion changes. Render the same finished mountain inside the existing reward with one finite warm summit halo/flag response, never on history rendering. Wrap each scene with mobile-only HTML labels. Existing example remains isolated.
- `demo/work.js`: centralize presentation model (goal ID, action IDs/status/context/selection), adapt home replacement to scene wrapper; pass actual model/identity to applied completion/finish feedback with callback-local duplicate guards; clear presentation effects on render. No canonical engine/storage/timing/schema change and no new write.
- `demo/index.html`: one decorative summit scene slot inside the existing reward, not another dialog/message.
- `demo/styles.css`: coordinated 600ms checkpoint trace/resolve/sparks, finite summit halo/flag, scoped violet current/cyan-blue earned/peach confirmed summit; mobile-only 12px+ HTML current/summit/count labels without crowding the accepted SVG. Terrain/surrounding layout untouched. Off/reduced disables all reward motion including existing confetti.
- `tests/browser.mjs`: new focused rewards gate for actual commit/failure/Retry, goal/action isolation, immediate Undo/navigation/selection/theme, motion changes mid-effect, review vs finish, reload/no replay, quiet note save and real/example isolation. Adapt old mountain animation assertion to replacement, keep domain assertions. Capture live frames and final normal/reduced light/dark desktop/390px for 1/5/30 actions and multiple goals.
- `HANDOFF.md`, `devpost/checklist.md`, `devpost/design-brief.md`, new `devpost/MOUNTAIN_REWARDS_EVIDENCE.md`: actual receipt, captures, open issues and visual-review stop.

## Contract / verification
Semantic checked/finished state is immediate after commit; effects are DOM-only, finite and targeted by goal/action identity, not index. Cleanup touches only transient DOM/timers, never workspace or newer UI state. No effect on failed writes, note saves, selection/navigation/reload/reopen/Undo; no new points/totals or persistent reward receipt. All-checked opens review immediately without summit. One explicit committed finish opens one compact dismissible reward with the summit visibly inside it. Quiet saved timestamp/current cue remains sufficient saved-place confirmation, not an earned reward.

Run focused checks while building, inspect live transitions/screenshots, then syntax/20 existing unit tests/build/diff and the combined Chromium suite once after final changes. Keep the three RETURN_EDGE_REVIEW findings open for the separate correction pass. No audio/streaks/new assets/dependencies or terrain redesign. Stop for visual review.
