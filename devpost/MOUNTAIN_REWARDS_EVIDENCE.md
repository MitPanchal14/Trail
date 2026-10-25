# Mountain rewards — verification, 25 October 2026

## Outcome / stop boundary

Implemented only OPENCODE_MOUNTAIN_REWARDS.md over the preserved uncommitted mountain implementation, on `codex/trail-redesign`, HEAD still `4d2b9fb`. Exact file/behaviour plan was recorded before edits in MOUNTAIN_REWARDS_IMPLEMENTATION_PLAN.md. The accepted terrain paths, depth, surrounding written layout and canonical engines remain unchanged. Preview **http://127.0.0.1:3000/** returned HTTP 200 after verification. Stop for user visual review; no commit, push, deployment, submission, dependency, external asset or schema change.

## Implemented

- After an applied canonical action completion: one coordinated 600ms earned-segment reveal, checked-marker resolve and five small local cyan sparks, replacing the ring. Checked semantics/tick are immediate, controls stay enabled, earned segment/tick persist after transient cleanup. No points or extra outcome writes.
- Feedback is targeted by actual real/example goal ID and action ID, not a global marker index. Applied callbacks have local duplicate guards. Bounded DOM-only cleanup cancels transient classes/timers on rerender, selection, navigation, theme/motion change or reward dismissal; it never rewrites records or newer views. Existing example notification stays static rather than adding another glow.
- Explicit committed goal finish opens the same single dismissible compact reward, with the shared finished mountain **inside** it, a warm peach halo (900ms) and flag reveal (650ms), coordinated with existing finite confetti. The summit response is visible in the opaque dialog, not hidden behind it. One message, immediate Close/Escape/View finished work, no forced wait. History/reload do not replay it.
- Current/saved marker uses scoped violet, earned trail cyan→blue, confirmed summit peach. Terrain/theme tokens and path geometry are preserved. Shapes/ticks/text accompany colour.
- At mobile widths, readable 12px HTML captions show current/saved/review/finished state, exact checked count and summit status outside the SVG. Tiny duplicate SVG labels are hidden; marker positions/full action lists stay intact. Desktop SVG labels remain. Scene wrapping keeps real home, example and history consistent without duplicate captions.
- Saving notes remains quiet: committed saved time/current-place cue, never earned ascent or checkpoint/summit feedback. All-checked-but-open still opens review immediately and earns no summit. Off/reduced motion show the same final semantic states without sparks/travel/glow/confetti; changing preference mid-effect stops them without replay.

## Actual verification

| Check | Result |
| --- | --- |
| `npm run check` | Passed. |
| `npm test` | 20 passed, 0 failed; domain/clock/security/build checks retained. |
| `npm run build` | Passed; same seven allowlisted assets, exact byte parity verified. |
| `git diff --check` | Passed, including final documentation. |
| Focused rewards gate | Passed actual state/transaction/effect checks and visual matrix. |
| Final combined Chromium suite | A/B/C/edge/correction/return/mountain/rewards all passed. |

Final combined command:

```sh
TRAIL_EVIDENCE=/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-rewards-evidence/verified node tests/browser.mjs
```

New browser coverage exercises actual IDB-aborted completion/finish: no state mutation or success feedback, then exact Retry adds one revision and one targeted response. Mutation observation records exactly the marker+segment for one action and one summit for the confirmed goal. A controlled DOM-only unrelated finished-card fixture is synchronously present before completion feedback; it stays still. Actual two-goal finished history likewise stays still while only the correct dialog mountain celebrates. No test fixture changes product records.

Actual computed segment offset decreases during the response; local spark opacity becomes visible. Immediate Undo during feedback restores current/open state; delayed cleanup cannot recheck it. Navigation/keyboard selection retain canonical snapshots and current position; theme switching does not replay. A retained existing motion-control fixture exercises Off during a response, with unchanged records; browser reduced-motion changes stop checkpoint/summit feedback and confetti mid-effect. Dismissal keeps correct focus and removes the dialog scene. Notes cause no earned feedback, final-action review remains immediate, reload/history stay static, and fictional finish preserves the real snapshot.

Existing combined coverage still exercises the real 61-second running session/navigation, tab exclusion/takeover, conservative timing, abort/Retry/reload/Resume, URL safety, draft isolation, Undo/reopening and noncontiguous checked IDs. No canonical assertions were weakened. The prior index-only earned selector was narrowed to `.milestone` because segments now also carry their actual action ID; an explicit earned-segment assertion was added. An initial combined attempt stopped at that presentation-selector mismatch; the complete rerun above passed. Focused harness adjustments wait for committed Focus UI and the live spark interval, and scope Undo to visible main controls rather than stale hidden review contents. A trace specificity issue was corrected before final verification so the dashed reveal actually paints.

## Captures / observed transitions

Final directory:
`/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-rewards-evidence/verified/`

- `rewards-live-checkpoint.png`, `rewards-live-summit.png`: actual response captures alongside live computed-animation observations, not CSS-string-only evidence.
- `rewards-{1,5,30}-{normal,reduced}-{light,dark}-{1440,390}.png`: real UI outcomes in isolated profiles; 1-action captures show the confirmed reward, 5/30 show partial checkpoint/current state. Matching `…-scene-…` crops for 5/30 make the labels inspectable.
- `rewards-history-pair-{light,dark}-{1440,390}.png`: two actual finished goals with independent SVG IDs and no replay.
- The same directory includes the existing mountain/return/day-build regression captures, fresh for this run. Earlier focused and failed-run folders are development evidence, not the final receipt.

Inspected live summit/checkpoint images, normal/reduced light/dark phone captions, 1-action summit reward, 5/30 scene crops and the two-goal mobile history. The final run's dark reduced reward, normal 30-action phone scene, live summit and dark phone history were reread. No document horizontal overflow in the checked matrix. Mobile labels are at least 12px with wrapping/grid spacing; they do not overlap landscape checkpoints. The current mountain remains the accepted silhouette/composition, with earned blue and violet current position distinguishable in both themes. Automated checks/observations are not a full WCAG/screen-reader or physical-device audit, nor proof of human delight/productivity/retention.

## Files / open issues

This pass changes `demo/proof.js`, `demo/work.js`, `demo/styles.css`, `demo/index.html`, `tests/browser.mjs`, `HANDOFF.md`, `devpost/checklist.md`, `devpost/design-brief.md`; adds MOUNTAIN_REWARDS_IMPLEMENTATION_PLAN.md and this file. Earlier uncommitted mountain code/tests/evidence, dispatches and reward research/planning were retained. `demo/state.js`, `demo/storage.js`, `demo/timing.js`, dependencies and allowlists remain unchanged.

**All three RETURN_EDGE_REVIEW findings remain open and require the following bounded correction before delivery:** context-only action removal can discard notes/link; long allowed return text buries controls; Skip after invalid URL retains stale validation. No audio, streak/calendar, AI, reminders, capture or sync was added. Physical Mac sleep/background, branded Chrome/Comet, phone hardware, native BFCache and observed user value remain unverified. Next: user visual review, not automatic publication or feature expansion.
