# Local review — 25 October 2026

Review only. Branch codex/trail-redesign at c47dc01; starting working tree clean. No runtime edits, implementation dispatch, commit or push. Current project documents override historical UI plans.

## Result

The retained 01b static demo is intact and runnable. It covers representative screens, not the functional product. Only demo/index.html, demo/styles.css and demo/proof.js are website source. No historical app/components/framework UI was restored.

## Fresh evidence

- npm run check passed; npm test passed all four static-serving/build tests; npm run build passed.
- Local server at http://127.0.0.1:52254/.
- Automated headless Chromium review rendered all ten scenario choices in both themes at 1440px, and at 390px in light theme. No page JavaScript errors or document-level horizontal overflow observed. This is not a full accessibility or physical-device audit.
- Inspected screenshots of desktop Today in both themes and phone Focus.
- Navigation to Journey preserved the running simulated timer; Pause stopped it.
- Saved instruction/context worked in memory. Blank instruction preserved its previous value; blank context replaced its previous useful value with whitespace. Reload reset both to fictional seeded values.
- Completing and undoing restored the action with timing paused. Final review could add literal HTML-looking text safely. Confirm produced the existing full-screen celebration; Escape dismissed it; visiting Today/Finished did not replay it.
- Expired +5 extension immediately started focus. Reduced-motion Focus displayed the still/disabled ambience control.
- Browser review used existing local Playwright; no packages installed, no permanent test files added. Temporary harness/screenshots live under /tmp/trail-review*.

## Highest-priority functional gaps

1. No real goal/action creation or editing: first use can only explore the fictional example (proof.js:77).
2. No storage or reload recovery: reset seeds the example and boot always returns to landing (proof.js:22–35,146–147). Core return-to-work promise is not implemented.
3. Timing uses Date.now deadlines and has no trustworthy sleep/clock recovery or tab ownership (proof.js:92–96). Separate tabs each have independent example state.
4. Blank pause context overwrites previous context (proof.js:126). It must preserve useful context under the agreed first-slice contract.
5. Expired extensions call startClock directly (proof.js:107); future real timing must retain totals and wait for explicit Resume when expired.
6. Completion, Undo and history are volatile examples. Finished dates, assignment, 45/70-minute totals and route labels are hardcoded; they cannot become real user evidence by removing demo labels.

## Visual decisions for the user

The current baseline still has the landing journey illustration, decorative Focus rail and timed full-screen reward with changing headline. Requested minimal landing, rail removal, deliberate dark refinements and compact immediate completion dialog with finite ribbons remain pending. Desktop dark Today is readable in this review; exact desired dark changes still need user direction. Keep Today/Journey composition unless a specific change is agreed.

Recommended discussion: confirm whether to include those four previously requested corrections in the OpenCode brief, and identify any further screen-specific changes. No automatic redesign.

## Handoff readiness

FIRST_FUNCTIONAL_SLICE.md already defines a detailed creation/focus/context/storage/recovery contract and tests. It deliberately excludes completion/history; a full core-loop day needs a separately agreed slice-2 contract. Current handoff/checklist contain stale Cloud-pending and overnight-schedule language; the user later reported the environment published, rejected overnight scheduling, and the local automation was paused in chat. Refresh those receipts when the consolidated dispatch is approved, rather than treating old authorization text as a new build instruction.

Before OpenCode dispatch: agree demo corrections, record exact changed files and acceptance criteria, consolidate current instructions and verify no conflicting Cloud/local worker is running. Keep work bounded and update evidence after implementation. Do not claim all long-term PRD features can be completed merely because the static tests passed.

Physical Mac sleep/wake, real background accuracy, durable storage failure/recovery, cross-tab ownership and real finished records are not accepted features. AI, closed-site reminders, PiP, priority scoring, streaks, real route mapping, hosting and submission remain absent or pending as described in the current documents.
