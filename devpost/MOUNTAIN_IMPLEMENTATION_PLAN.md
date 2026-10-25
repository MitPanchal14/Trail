# Mountain implementation contract — 25 October 2026

Baseline verified: codex/trail-redesign at 4d2b9fb. Preserve newer HANDOFF/checklist planning and the dispatch. One writer, no publication. Scope: OPENCODE_MOUNTAIN_GRAPHIC.md only; three RETURN_EDGE_REVIEW findings remain open.

## Files, before edits
- `demo/proof.js`: replace shared routeSVG internals with bounded custom SVG terrain/ascent; adapt fictional state into explicit status/ID/context presentation; preserve example consumers/selection and use shared scene in example finished cards. One finite post-completion response, never render-time arrival animation.
- `demo/work.js`: pass real action IDs/status, saved-context presence, selection and explicit goal-finished status to shared renderer; include same scene in real finished cards; invoke presentation-only completion response after applied commit. No state/storage/timing changes.
- `demo/styles.css`: replace stone styles with scoped mountain surfaces/contours/path/markers, deliberate light/dark tokens and finite earned response disabled by reduced motion/Background motion Off. Surrounding type/layout/colours and Focus remain unchanged.
- `tests/browser.mjs`: focused mountain gate, canonical-snapshot assertions, 1/2/5/30 action layouts/states/selection, unique SVG IDs, screenshots and actual motion/off/reduced checks. Keep all existing regression gates/domain assertions.
- `HANDOFF.md`, `devpost/checklist.md`, `devpost/design-brief.md`, new `devpost/MOUNTAIN_EVIDENCE.md`: actual receipt, screenshot paths, limitations and visual-review stop.

## Design and state mapping
One 640×440 landscape, not an ever-wider row: a main asymmetric summit, two distant ridges, a few curved contour lines and a switchback trail grounded into the front slope. No low-poly mesh or new assets/modules. Existing system font, existing blue #4167ec / violet #7849df / cyan #75d7dc accents; terrain light #e6eaf4/#d4dced with #f5f7fc ridge light, dark #293248/#1c2436 with #3b4661 ridge light. Main next-action instruction stays outside scene; scene labels are compact generic checkpoint cues, never full action text.

Each action retains a marker keyed by actual ID/status. Up to five actions use numbered checkpoints; dense goals use small dots with current/selected checkpoints emphasized and exact checked/total count. First actual open action is current independently of selection. Only its saved context permits Saved place. Fresh illustration has no earned/current state. All checked with open goal = Ready for review; only committed completed goal = Goal finished summit. Earned segments describe checked action checkpoints, not continuous historical travel, attention, distance or time. Reopening earlier actions cannot erase later checked markers. Geometry can adapt without persistence.

Validate syntax/unit/build/diff, focused mountain checks and full existing Chromium regression suite. Inspect desktop/390px light/dark no-goal/active home, Today/Journey/finished and 1/30/long/all-checked/reduced states; inspect an actual finite transition. No commit/push/deploy/submit. Stop for visual review.
