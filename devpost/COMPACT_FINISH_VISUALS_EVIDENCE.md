# Progress circle and compact Finished work — evidence

25 October 2026. Implements OPENCODE_COMPACT_FINISH_VISUALS.md only. Existing dirty checkout/imported work, End block and final-demo functionality preserved. Pre-edit paths/contract: COMPACT_FINISH_VISUALS_PLAN.md. No reset/reimport/branch switch, commit/push, visibility/license change, deployment/upload/submission. **Stop for independent review and user visual decision.** Preview: http://127.0.0.1:3000/.

## Result

- Removed all person/limb/head/backpack markup and styles. One small solid current-violet circle with contrasting border (warm summit) occupies the unchanged expedition-marker group/identity/anchor. Existing path sampling, 780ms post-commit travel, cancellation and captions remain; useful stopped context still shows the tent. Selection remains separate. No animation-engine rewrite.
- Real and fictional Finished work cards intentionally contain **no routeSVG, filled terrain, marker, route counts or captions**. They share one original inline minimal white mountain outline. Its aria-hidden/focusable-false, pointer-events-none wrapper sits at the lower right and clips the base below the edge. No external/historical asset or chart semantics.
- Gradient remains muted blue/violet with restrained warm accent. Foreground content has reserved left space and readable card-local supporting text in both themes. Ordinary collapsed cards are about **250px desktop / 283–312px at 390px**, down from **616px** in the ordinary baseline phone fixtures. The 160-character fixture is **629px** collapsed instead of **952px**: natural growth is intentional, not a fixed-height crop. Expanded notes/details can grow further.
- Only decoration clips. Card overflow/focus rings stay visible; full title, checked-action count, effort, browser-local completion date, expandable definition/context/safe links and guarded Reopen remain. Unblocked correction explanation moved into details; blocked reopening stays visibly explained. No state/session/schema/timing/storage/dependency/allowlist changes.

## Exact paths changed in this pass

Runtime: `demo/proof.js`, `demo/work.js`, `demo/styles.css`.
Tests: `tests/browser.mjs`.
Docs: `README.md`, `HANDOFF.md`, `devpost/checklist.md`, `devpost/design-brief.md`, `devpost/spec.md`, `devpost/DEMO_WALKTHROUGH.md`, `devpost/VIDEO_SCRIPT.md`, `devpost/SUBMISSION_DRAFT.md` (history/dot description only), new `devpost/COMPACT_FINISH_VISUALS_PLAN.md` and this file.

The shared helper is passed from proof.js to the real controller; the fictional fixture/story remains isolated. Existing dirty state.js/storage/timing/test-domain changes are not part of this visual pass and were not edited/replaced.

## Checks

| Check | Result |
| --- | --- |
| `npm run check` | Passed on final runtime. |
| `npm test` | **25 passed, 0 failed**, including domain/timing and exact seven-asset build parity. |
| `npm run build` | Passed on final runtime, same allowlist. |
| `git diff --check` | Passed; final docs rechecked. |
| `TRAIL_GATE=compact-before ... node tests/browser.mjs` | Captured actual old runtime before any runtime edit. |
| `TRAIL_GATE=compact ... node tests/browser.mjs` | Passed final focused history/visual gate. |
| `TRAIL_GATE=travelling ... node tests/browser.mjs` | Passed: circle follows sampled existing winding path, campsite/selection/reload/identity/no render writes. |
| `TRAIL_GATE=mountain ... node tests/browser.mjs` | Passed: active terrain, outcome/selection/review, history/reopen, 1/2/5/30 cases, Off/reduced/no replay. |
| `TRAIL_GATE=rewards ... node tests/browser.mjs` | Passed: failed writes/exact Retry, Undo/navigation, Off/reduced mid-travel, visible circle summit, isolation and 1/5/30 matrices. |
| Complete current browser suite on final runtime | **All 13 gates passed, exit 0**: A/B/C/edge/correction/return/travelling/mountain/rewards/return-fixes/end-block/final-demo/compact. |

Final full command:

```sh
TRAIL_EVIDENCE=/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-compact/final-full node tests/browser.mjs
```

Focused history fixtures are labelled synthetic, isolated and generated through actual canonical LocalStore commits: three finished goals, one maximum title with long literal/Unicode saved text, each with exactly 15 seconds recorded effort and a work link. Tests verify exact displayed titles/count/effort/browser-local dates, 230–280px desktop and 260–330px phone ordinary-card bounds, text/art separation, cropped decoration rather than card content, keyboard focus visibility, natural expansion, exact saved text and safe opener-isolated link. Rendering/theme/expansion/link operations preserve the durable snapshot with no completion feedback. Reload retains history without celebration. Reopen preserves context/interval identities; another open goal disables other Reopen controls with explanation. Fictional finished cards also contain only outline decoration; active/review example mountains retain circle/captions.

## Intentional assertion updates / development corrections

- Former history-route assertions now require zero mountain/marker/checkpoints in cards, one decorative outline per card and canonical completed goal/action identities. Active mountain and compact reward route assertions remain.
- Rewards isolation still tests an unrelated completed mountain alongside the active scene. Because history no longer supplies one, the DOM-only fixture now includes a static, settled clone of the prior reward's mountain alongside the prior history card. Motion classes are removed from that test clone and its summit transform settled; it must never receive another goal's effects. The original identity/no-extra-events/failed-save/Undo assertions remain.
- The new keyboard-focus probe explicitly establishes keyboard modality before testing focus-visible. The new date assertion formats the expected timestamp in the browser's locale, not Node's different locale. Neither correction changes the product or relaxes its contract.
- Visual inspection caught weak pre-existing light-theme saved-time text on the gradient. The final runtime uses card-local light muted text; focused captures/checks were refreshed and a fresh full suite was launched **after** this last CSS change. An earlier full run launched before that contrast correction is not the final-runtime receipt.

## Before/after captures

Root: `/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-compact/`.

- Before: `compact-before-{collapsed,long-expanded,ordinary-expanded}-{light,dark}-{1440,390}.png`, taken before runtime edits.
- Preferred final history: `final/compact-after-{collapsed,long-expanded,ordinary-expanded,blocked}-{light,dark}-{1440,390}.png`.
- `final/compact-long-expanded-detail-dark-390.png` is a derived detail crop of the full max-title/long-context capture, used to inspect literal Unicode wrapping without shrinking the entire long document.
- Focused active/motion/reward: `mountain-earned-transition.png`, `marker-live-travel.png`, `marker-campsite-*.png`, `rewards-live-summit.png`, `mountain-*.png`, `rewards-history-pair-*.png` and existing normal/reduced matrices under the root.
- Final complete suite: `final-full/` contains current compact/active/campsite/review/summit/reward/end-block/final-demo captures. Older evidence folders remain historical, not substituted for new screenshots.

Inspected before desktop filled-history cards; after desktop/phone collapsed ordinary/max titles; ordinary expanded light/dark phone; a max-title/long-context dark-phone detail crop; blocked desktop; active moving circle on phone and the compact summit reward. Art stays separate/right, lower bases are cropped, supporting saved time is readable after the local contrast correction, controls remain foreground/reachable and no horizontal page overflow is measured. Long expanded content uses natural document scrolling. These are technical/visual inspections, **not user visual acceptance or a full assistive-technology/physical-device audit**.

## Limits and next gate

Independent review and the user's quick decision remain pending. No activity calendar, streak/badge engine, note-removal correction, sound, AI, new duration/modal or broad redesign was implemented. Explicit obsolete instruction/context removal remains the known separate limitation. Friend/public trials were intentionally skipped; physical sleep/background/phone, owned recording reference, final-origin/public access, recording and submission remain open. No productivity/retention/validation claim follows from the checks.
