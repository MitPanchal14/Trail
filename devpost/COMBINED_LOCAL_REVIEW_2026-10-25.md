# Combined local review — 2026-10-25

Scope: review the uncommitted A → B → C implementation at http://127.0.0.1:3000/. No runtime fixes, commit, push or deployment performed by this review.

## Findings requiring a bounded follow-up

1. **P2 — Mode switching loses an unsaved goal draft.** In a fresh real workspace: Start working → Create goal; type a title, definition and action; select Fictional example, then Real work; reopen Create goal. All three fields are blank. Independently reproduced in an isolated Chromium context. `demo/work.js:127–135` changes mode without invoking the existing `captureDraft()` helper. Capture the current form before leaving real mode, retain the draft on return, and add a browser regression for both create and edit forms.
2. **P2 — Real-mode home presents fictional saved context as the user's own.** After saving a real goal, click the Trail brand. Header says “Real work · local to this browser”, but home still says “Explore a fictional workday” and “Your next move, kept. Open the saved comparison table. Write the first three sentences about precision and recall.” `demo/work.js:80` uses the captured example landing HTML from `demo/proof.js:51`. Preserve the approved home composition; make sample content explicitly illustrative, and align the primary CTA/copy with real goal creation or continuation. Test with no goal and with an existing real goal.

## Independently verified

- `npm run check`, `npm test` (16 passing tests), `npm run build`, and `git diff --check` passed.
- `node tests/browser.mjs` passed all A, B, C and edge checks against the local server. Includes actual 61-second timing/navigation, IndexedDB transactions, writer ownership/takeover, failed saves/retry, reload recovery and explicit Resume, example isolation, completion/Undo, final review, history, reopening, input bounds, keyboard reorder, theme/390px and built-artifact evidence already included by the harness where applicable.
- Desktop/phone screenshots inspected: Today, completion dialog and finished history. The retained layout is recognizable; the compact completion treatment replaces the old full-screen delay. Browser suite checks the removed rail, effective motion toggle and finite confetti.
- Additional isolated browser reproduction established both findings above. The user's normal browser records were not used.

## Remaining acceptance decisions

- User review of real goal creation, Today/Focus, pause context and completion/history.
- Suggested copy polish: shorten implementation-oriented phrases such as IDs, field-preservation rules and geometry explanations in primary flows. Keep essential local-storage information accessible.
- Graphics redesign remains deferred, as requested.
- Physical Mac sleep/wake, prolonged background use, branded Chrome/Comet and real phone hardware remain unverified. Simulated lifecycle checks and 390px Chromium do not establish these.
- Passing technical checks do not establish submission readiness. No claims of AI, reminders, PiP, sync or production activity tracking.

Next step: collect the user's requested changes, then prepare one bounded OpenCode prompt combining these fixes with the agreed polish. Review that diff and evidence before any authorized publication.
