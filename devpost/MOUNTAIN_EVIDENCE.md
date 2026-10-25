# Mountain graphic — local verification, 25 October 2026

## Outcome / stop

Implemented OPENCODE_MOUNTAIN_GRAPHIC.md from verified `4d2b9fb2006b31564a8e5c2ebe3e6c710df09336` on `codex/trail-redesign`, preserving newer planning edits. Design/state/file mapping was recorded before edits in MOUNTAIN_IMPLEMENTATION_PLAN.md. Preview **http://127.0.0.1:3000/** returned HTTP 200 after verification. Stop for the user's visual review; no commit, push, deployment, submission, dependency, external asset or historical UI restoration.

## Presentation contract

- One custom 640×440 shared SVG scene: main mountain, restrained layered ridges/contours, snowcap and five smooth switchbacks. Pale terrain in light mode; charcoal/indigo in dark; selective cyan/blue/violet earned trail. Surrounding layout/type/colours and Focus are retained.
- Action markers and their path sections derive from actual IDs/statuses, not completed-count prefixes. First unfinished action is current independently of selection. Saved place appears only when that action has a context record; otherwise Next action. Full action text stays in the accessible existing list/detail, with literal text in SVG titles.
- All checked while open = Ready for review. Only completed goal records earn the summit flag/state. Real and fictional home/Today/Journey/finished-card consumers use the same renderer; the existing compact reward remains unchanged and does not replay on reload.
- At 30 actions the scene stays bounded, with small checkpoints and enlarged current/selected markers, exact checked/total count and the complete list retained. Current labels avoid checkpoint circles, using a leader/fallback for dense scenes. Geometry may adapt; it is not historical travel, time/distance or a productivity percentage.
- Newly applied completion invokes one 650ms earned-ring response. Rendering, navigation, Undo and reopening never invoke it. Motion Off/reduced motion keep the final state immediate and remove transient classes. No new loop, persistent coordinates, schema or canonical engine changes.

## Final verification

| Check | Result |
| --- | --- |
| `npm run check` | Passed. |
| `npm test` | 20 passed, 0 failed; existing domain/clock/static/build assertions retained. |
| `npm run build` | Passed; exact seven-asset parity covered by tests. No new module/allowlist needed. |
| `git diff --check` | Passed, including final documentation. |
| Full Chromium suite | A/B/C/edge/correction/return/mountain gates all passed after final visual adjustment. |

Final browser command:

```sh
TRAIL_EVIDENCE=/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-mountain-evidence/review node tests/browser.mjs
```

New mountain gate verifies real create → timed completion → Undo → complete → review → finish → reload → reopen. Reopening the first of five leaves all four later IDs checked; selection via keyboard highlights another action without moving current or changing the full canonical snapshot. Undo/reopen preserve recorded effort; finishing/reloading does not replay reward. Actual paused saved context produces Saved place; absent context produces Next action. Cases include 1, 2, 5, 30 actions, long/unbroken/HTML-looking names, fresh illustration, partial, all-checked, finished and reopened states. No scene horizontal overflow or out-of-viewBox text in checked captures. Current labels do not cover checkpoint circles.

Repeated finished cards have unique SVG definition IDs. Snapshot comparisons prove render/theme/viewport/selection do not write records. No external requests or page errors in the mountain context. The live completion response was inspected via browser animation state (checkpoint-earned, 650ms, one iteration), captured and observed cleaned up; navigation does not replay it. Motion Off and reduced motion disable it while keeping checked states correct. Fictional mode/finish leaves real snapshots unchanged.

The existing suite still checks the real 61-second running-navigation/two-tab loop, IDB abort/exact Retry, ownership/reload/Resume, completion/history/corrections, safe work references and corrected goal drafts. No domain assertions were weakened. Development harness fixes awaited committed UI, measured transformed SVG text rather than local coordinates, and settled viewport/scroll before clicking theme controls after cropped screenshots. An earlier full run passed existing gates but failed that new screenshot-scroll harness; the final complete rerun passed. A later bounded label-position correction was followed by the final full run above.

## Screenshots inspected

Directory: `/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-mountain-evidence/review/`

- `mountain-{no-goal-home,active-home,saved-today,journey,ready-review,finished,reopened-earlier}-{light,dark}-{1440,390}.png`
- `mountain-{one-action-long,one-ready-review,two-finished-goals,thirty-today,thirty-selected,reduced-motion-thirty,example-finished}-{light,dark}-{1440,390}.png`
- Matching `…-scene-{light,dark}-{1440,390}.png` crops; `mountain-two-actions-scene-…` and `mountain-earned-transition.png`.

Inspected representative no-goal/active home desktop, phone Today/Journey/finished and review states, 1/2/30-action crops, reopened noncontiguous state, light/dark surfaces and reduced-motion dense overview. Final active home, reopened phone, dense reduced-motion scene and transition capture were reread after the final run. Larger label type and below-marker positioning replaced an earlier partially covered neighbouring checkpoint. Full-page 30-action long-name captures are deliberately tall; scene crops make the graphic inspectable separately. Markers are illustrative, not interactive drag controls; keyboard/list access remains authoritative. This is not a full WCAG/screen-reader or physical-device audit.

## Files / remaining issues

Changed runtime: `demo/proof.js`, `demo/work.js`, `demo/styles.css`. Tests: `tests/browser.mjs`. Docs: `HANDOFF.md`, `devpost/checklist.md`, `devpost/design-brief.md`, new `devpost/MOUNTAIN_IMPLEMENTATION_PLAN.md` and this evidence file. Preserved existing untracked OPENCODE_MOUNTAIN_GRAPHIC.md and HANDOFF/checklist planning. `demo/state.js`, `demo/storage.js`, `demo/timing.js`, serving/build allowlists and dependencies are unchanged.

**Still open, intentionally not fixed:** context-only action removal can discard saved notes/link; maximum-length return text buries controls; Skip after invalid URL leaves stale validation (RETURN_EDGE_REVIEW_2026-10-25.md). Physical Mac sleep/background, branded Chrome/Comet, phone hardware, native BFCache and real-user/product-value acceptance remain unverified. No audio, productive-day/streak indicator, reminders, AI, sync or capture. The next step is visual feedback, then separately authorized bounded corrections—not automatic feature expansion/publication.
