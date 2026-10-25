# Local prototype evidence — 25 October 2026

**Current return-experience pass:** see [RETURN_EXPERIENCE_EVIDENCE.md](RETURN_EXPERIENCE_EVIDENCE.md) for optional saved work references/time, compatibility and fresh 20-test/full Chromium results at HEAD 6d9a930. The correction/day-build receipts below are historical, not evidence of additional runs or current publication authorization.

## Current bounded correction pass — after combined local review

Scope was recorded in DAY_BUILD_PLAN.md before edits. Research was context only; no roadmap features were added. Only `demo/work.js`, `tests/browser.mjs`, DAY_BUILD_PLAN.md, this evidence file, HANDOFF.md and checklist.md were changed in this pass. All prior uncommitted work was preserved.

**Corrections:** capture the live goal form before leaving real mode. Create/edit drafts keep unsaved title, definition, action text, IDs, order and add/remove state across mode switching and reopening. Only Save changes canonical records; Cancel discards the draft. Real home keeps the approved typography/layout/route geometry but uses real saved instructions (or the next unfinished action), accurate Create/Continue/Review actions and a finished-only summary with Create a new goal. With no open goal, generic unchecked steps are explicitly labelled “Illustration · not your progress.” No ML assignment is shown as the user's saved next move. Home/goal-form copy was simplified without changing the state/storage/timing/completion/Undo contracts or schema.

**Fresh verification for this pass:**
- `npm run check`: passed.
- `npm test`: 16 passed, 0 failed.
- `npm run build`: passed; exact seven-asset parity remains covered by Node tests.
- `git diff --check`: passed.
- Focused browser command (`TRAIL_GATE=correction node tests/browser.mjs`): passed draft and home regressions.
- Final complete `node tests/browser.mjs` run: A/B/C/edge checks plus the new correction regressions passed. This includes the existing actual 61-second session, tab ownership, abort/retry, reload/Resume, example isolation, completion/Undo/history/reopening checks. No JavaScript errors in the correction context.
- New regressions compare full canonical snapshots before/after unsaved mode round trips and every home CTA, assert exact draft action IDs/order/text, verify Cancel and explicit Save, and cover fresh/open-without-context/open-with-saved-context/all-checked-open/finished-only homes. Long unbroken and HTML-looking goal titles/instructions remain literal and fit at 390px.
- New home-state screenshots cover light/dark at 1440px and 390px; create-form captures cover both themes at 390px. Inspected fresh home, saved-context home, all-checked home, finished-only home and retained draft forms. No horizontal overflow in checked states. Typography/layout/illustration composition retained; no stylesheet or graphics redesign.
- Local review URL verified HTTP 200: **http://127.0.0.1:3000/**.

Current screenshots: `/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-correction-evidence/full/`, named `correction-{fresh,open-no-context,open-saved-context,all-checked,finished-only}-{light,dark}-{1440,390}.png` and `correction-create-draft-{light,dark}-390.png`. The full-suite captures in that directory are fresh for this pass; the original day-build directory below is historical.

**Limits unchanged:** unsaved drafts are memory-only and need not survive reload; saved work remains browser/origin-local. Physical Mac sleep/wake, prolonged background use, branded Chrome/Comet, phone hardware and native BFCache eligibility remain unverified. No deployment or built-artifact browser rerun was performed in this correction pass; the build and byte-parity tests passed. No commits, pushes, deployments or submissions. Stop for combined user review.

---

**Historical day-build receipt follows.** Its timestamps, screenshots and built-artifact browser results describe the earlier A → B → C build, not additional checks performed in the correction pass.

## Outcome and review boundary

Increments A, B and C were implemented sequentially on `codex/trail-redesign`, with the exact file/transition/acceptance plan recorded in DAY_BUILD_PLAN.md before cross-file work. Each gate was verified and HANDOFF/checklist updated before proceeding. Started 09:07 IST; combined verification completed approximately 09:50 IST, ahead of the 17:00–18:00 target. No 45-minute schedule slip occurred. Features were frozen early after C; subsequent work was stabilization, tests and documentation. No deadline-driven weakening of storage/timing rules.

**Review URL: http://127.0.0.1:3000/** — the current allowlisted source server is running. The temporary built-artifact server at port 3001 was closed after tests. Use port 3000 rather than the older pre-existing port-52254 process, whose in-memory server allowlist predates the new modules.

No commit, push, deployment or submission. HEAD remains `c47dc01`. Existing user planning changes and ignored private files were preserved. No package/provider/framework installation or historical restoration. Runtime remains dependency-free; tests used already installed local Playwright. Combined user acceptance is pending.

## Environment and commands

- macOS, Node v24.16.0; headless Playwright Chromium 156.0.8078.4.
- `npm run check`: passed all runtime/server/build syntax checks.
- `npm test`: **16 passed, 0 failed** — domain transitions/validation, clocks, static security/HTTP boundaries and exact seven-asset build parity.
- `npm run build`: passed; only seven allowlisted runtime assets copied to ignored `dist/`.
- `node tests/browser.mjs`: passed A, B, C and edge checks on the source preview.
- Built artifact: served only the seven dist assets from a temporary localhost:3001 host; `TRAIL_URL=http://127.0.0.1:3001/ TRAIL_GATE=C node tests/browser.mjs` passed A, C and edge checks against that build. B's full 61-second/two-tab loop ran on source; build parity covers its identical bytes.
- `git diff --check`: passed. No page JavaScript errors in the main A/B/C loops.

Browser contexts were isolated test profiles. Test goals and deliberate clock/storage fixtures do not seed the user's normal browser records.

## Acceptance evidence

| Area | Observed result |
| --- | --- |
| Retained composition | Eight desktop baseline captures before editing; equivalent home/Today/Focus/pause captures afterward in both themes. Home typography/copy/art/composition retained. Necessary mode controls and real-input/label adapters added; no graphic redesign. |
| Focus corrections | Decorative rail absent. Keyboard Space toggles labelled Background motion; computed transforms freeze exactly when Off and move when On. State survives navigation. Reduced-motion preference disables movement/control and removes particles. |
| Reward | Immediate native dialog over intact Finished view, stable quote, actual goal title and truthful real/example label. Width ≤480px, responsive at 390px. 36 finite particles, one animation iteration, visible during burst and removed after 1.45 seconds. Close/Escape returns focus; no forced dismissal or navigation/reload replay. |
| Create/edit | Fresh real DB has no sample goals. Required title/definition/actions; Save/Cancel; stable IDs through edit/reorder. Keyboard reorder observed. Bounds exercised at 160/2,000/500 characters and 30 actions; 31st Add disabled. Whitespace validation and literal HTML/script-looking text tested. |
| Timing | Actual 61-second owner session remained running through internal navigation and a second open page, with one session and roughly the expected committed elapsed time. Unit-injected clocks cover delayed callbacks, >15-second gaps, wall reversal/disagreement, clamping and idempotent credit. |
| Pause/return | Pause stops before notes. Independent instruction/context, blank/whitespace and Skip preservation verified. Reload recovers saved context and stopped state. Reload of running work retains only committed effort, marks interrupted and requires Resume. |
| Expiry/extension | A deliberately near-expiry IndexedDB fixture reached zero through the actual browser controller. Action stayed open; +5 added remaining/allocation without resetting effort and stayed paused until Resume. Ordinary running/paused extension invariants are also covered in domain tests. |
| Tab ownership | Real Web Lock exclusion: second tab is read-only and cannot Resume. Owner close followed by explicit Retry ownership rereads durable state and interrupts the running session. No second session/duplicated intervals. Transaction-level stale owner and revision rejection tested separately. |
| Failure/retry | Actual IndexedDB transactions deliberately aborted for create, notes, checkpoint, action completion and goal finish. No false saved/completed/reward state; drafts/pending operation retained. Retry commits the same identity once. Checkpoint failure stops local accrual; reconciliation requires explicit Resume. |
| Unsupported/corrupt storage | Denied open, missing Web Locks, malformed v1 and newer schema errors displayed without resetting data. Fictional example remains available. Actual raw JSON downloads preserve the malformed/new-schema fixture exactly. |
| Transaction idempotency | Actual IndexedDB repeated receipt returns applied=false without revision increase. Reusing an operation ID with a different payload, stale revision and stale owner token are rejected. Node tests additionally reject malformed references/totals/limits/Undo guards. |
| Completion/Undo | Explicit action completion once; repeated clicks create no duplicate event. Undo after reload restores exact context, IDs, remaining time and credited effort in stopped state. Later domain mutation invalidates Undo; navigation alone preserves it. Outcome reversal does not subtract focus intervals. |
| Review/history | All checked remains open. Keep open, add action and explicit finish tested. Finished collection contains real title/date/count/effort/context. Reload and navigation do not replay reward. A second goal creates a second history identity. |
| Reopening | No implicit action reopening. Reopen requires no other open goal; otherwise control is disabled with an explanation and domain rejects it. Explicit action correction preserves effort/context/IDs, appends audit and starts no timer. Correct/refinish produces one card for the original goal, not a duplicate. |
| Example isolation | Reset/scenario changes never touch real records. Entering example from a running real block first commits Pause; simulated focus runs only in the example engine. Returning real stays paused with identical saved records. Completed example fallback copy says checked rather than planned. |
| Lifecycle | Actual navigate-away/back recovers interrupted state. A deterministic synthetic pagehide/BFCache-pageshow race with delayed transaction publication verifies that a late Start commit cannot silently revive timing. This is not proof of native BFCache eligibility or physical sleep. |
| Layout/access | Both themes, 390px Focus/history/reward/long-content views, keyboard motion/reorder and native dialog dismissal checked. No document horizontal overflow in checked phone views. This is not a complete screen-reader/WCAG audit. |

## Screenshot evidence

Local temporary directory (not public hosting or committed application assets):

`/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-evidence/`

- `baseline-{light,dark}-{landing,today,focus,pause}.png`
- `final-{light,dark}-{landing,today,focus,pause}.png`
- `A-{light,dark}-focus.png`, `A-{light,dark}-reward.png`, `A-phone-reward.png`
- `B-{light,dark}-today.png`, `B-phone-focus.png`
- `C-real-reward.png`, `C-{light,dark}-history.png`, `C-phone-history.png`
- `edge-phone-long-today.png`
- `built/`: equivalent final built-artifact captures.

Inspected desktop home, real Today, real reward, phone Focus and phone history plus the finite confetti capture. Screenshots supplement, not replace, the interaction assertions.

## Changed files and preserved user work

Runtime:
- `demo/index.html`, `demo/styles.css`, `demo/proof.js`
- New `demo/state.js`, `demo/storage.js`, `demo/timing.js`, `demo/work.js`

Serving/build/checks:
- `scripts/serve.mjs`, `scripts/build.mjs`, `package.json`
- `tests/demo.test.mjs`
- New `tests/state.test.mjs`, `tests/timing.test.mjs`, `tests/browser.mjs`

Documentation:
- `README.md`, `HANDOFF.md`, `BUILD_PROMPT.md`
- `devpost/scope.md`, `devpost/prd.md`, `devpost/spec.md`, `devpost/design-brief.md`, `devpost/checklist.md`
- New `devpost/DAY_BUILD_PLAN.md`, `devpost/DAY_BUILD_EVIDENCE.md`

Pre-existing user changes to BUILD_PROMPT/HANDOFF/checklist/design-brief were retained and supplemented. Pre-existing modified `devpost/ONE_DAY_BUILD.md` and untracked `devpost/OPENCODE_DAY_BUILD.md` / `devpost/LOCAL_REVIEW_2026-10-25.md` were read and left intact, not authored or published by this implementation.

## Remaining limitations and next review

- **Unverified physical checks:** MacBook sleep/wake, prolonged background throttling, branded Chrome/Comet and physical phone behaviour. Headless Chromium and controlled clocks do not establish these. Native BFCache eligibility/real restoration was not independently established; synthetic lifecycle logic and actual away/back recovery were tested separately.
- Conservative timing can undercount: normal crash loses the uncommitted tail, write latency is uncredited, uncertain gaps are discarded. Short sleeps under the threshold cannot universally be detected. No attention tracking claim.
- Local-only records belong to browser/origin, can be lost by clearing site data and do not sync. Requires IndexedDB/Web Locks and a supported secure browser context. Limits fail visibly; no authorized delete/import/pruning workflow. Undo is deliberately limited to the latest action before another domain mutation.
- Geometry is illustrative, not effort/distance mapping. AI, reminders/closed-site delivery, PiP, priority scoring, streaks, backend/accounts/sync, graphic redesign, hosting and submission remain deferred.
- No complete screen-reader audit or production-readiness certification. The next step is the user's combined local review, followed by physical Chrome/Mac checks and only explicitly authorized fixes/publication.
