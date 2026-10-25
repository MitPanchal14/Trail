# Independent Pass 1 review — 25 October 2026

## Outcome

No blocking defect found in the inspected implementation or fresh targeted checks. Pass 1 is technically ready for user visual review. This does not establish acceptance of the density, native-browser interaction, final deployment or hackathon competitiveness. No runtime/test changes by this review; Pass 2 and Focus remain untouched.

## Fresh independent verification

- `npm run check`: passed.
- `npm test`: **35 passed**, no failures/skips. Log: /tmp/trail-pass1-test.log.
- `npm run build`: passed, existing static inventory/parity checks passing. Log: /tmp/trail-pass1-build.log.
- `git diff --check`: passed before review documentation and repeated afterward.
- `TRAIL_GATE=year-archive TRAIL_EVIDENCE=/tmp/trail-independent-year node tests/browser.mjs`: passed. Log: /tmp/trail-independent-year.log.
- `TRAIL_GATE=compact TRAIL_EVIDENCE=/tmp/trail-independent-year-compact node tests/browser.mjs`: passed. Log: /tmp/trail-independent-year-compact.log.
- `TRAIL_GATE=activity TRAIL_EVIDENCE=/tmp/trail-independent-year-activity node tests/browser.mjs`: passed. Log: /tmp/trail-independent-year-activity.log.

The three Chromium gates used isolated browser contexts and synthetic canonical fixtures. The normal user's browser records were not seeded, cleared or inspected. OpenCode's full 16-gate result remains its implementation receipt; this independent review reran the three relevant gates, not all sixteen.

## Source and behaviour reviewed

`activity.js` retains currently-completed action counting, joined goals, valid nonfuture timestamps, all-time streak/milestone derivation and browser-local day bucketing. Only visible month construction changes: current month minus eleven through current month, contiguous actual dates and null Monday-first alignment slots. Existing tests cover leap dates, month/year rollover, unique date keys, DST/timezone regrouping and canonical corrections. The visible year must not be confused with a permanent event ledger: reopening an action can reduce historical activity as documented.

`work.js` exposes exact date/task details, keyboard day/week movement, a >=44px equivalent date-input/View day control, future exclusion and panel-only refresh. The year/archive gate checks date drafts, focus, help/details and selection retention with controlled month rollover. Eight initial archive goals and eight-at-a-time Show more expose every retained ID in 0/1/8/9/30 fixtures. Expanded notes/full URLs, disabled pending/read-only Reopen, aborted write and exact Retry remain tested. Loading more/selecting a date does not mutate canonical records or invalidate Undo.

Shared styling retains the gradient/outline mountain and changes real/existing fictional card geometry without replacing accepted terrain, circle, rewards, Focus or engines. No new application assets/dependencies or real seed data were introduced by Pass 1.

## Visual inspection and remaining judgement

Inspected fresh dark desktop and light phone full-page captures in /tmp/trail-independent-year/; the targeted gates also generated the complementary themes and compact long-content captures.

- Desktop ordinary cards: **572 × 214px**, two per row. Phone: **346 × 207px**, one per row. Maximum-title phone fixture grows to **338px** rather than clipping.
- All twelve labelled months are present with visible separation and 14px unnumbered tiles. Desktop wraps into two rows in the 1440px fixture; phone wraps into six rows of two months. No tested document overflow.
- **Nonblocking density tradeoff:** the full year remains a tall phone section, and a busy selected day initially displays eight actions before expansion. Combined, these can push the archive well below the first screen. This follows the agreed wrap/full-year specification, not a proven functional regression, but user visual acceptance is still needed. Avoid claiming the mobile scrolling concern is completely solved solely from card heights.
- Sparse real history must remain sparse. Current test captures include deliberate escaping strings and synthetic histories; they are diagnostic captures, not judge-facing demo content. Pass 2 still needs realistic, clearly labelled sample activity and a visible homepage demo entry.

## Remaining boundaries

Native Safari/Comet date-picker interaction, perceived Focus motion, physical phone/sleep/background and native BFCache are not established by these Chromium runs. User visual review precedes the next implementation pass. No commit/push/main change/deployment/submission or publication; both untracked archives and previous dirty work preserved.
