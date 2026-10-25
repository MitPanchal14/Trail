# Independent saved-place review — 25 October 2026

Review only. No runtime changes, commit, push, deployment or new implementation dispatch.

## Independently checked

- Syntax checks, 20 unit tests, build and diff whitespace checks passed.
- Focused Chromium return gate passed: URL handling, isolated new-tab opening without timer mutation, shortcuts/IME, pause drafts, removal intent, blank/Skip behaviour, failed saves and exact Retry, Undo/history/action isolation, corrupt records, both themes and 390px layouts.
- Additional isolated browser reproduction: `/tmp/trail-critical-edge-review.mjs`. Screenshot: `/tmp/trail-review-long-note.png`. These temporary artifacts are local review evidence, not submission assets.
- Physical Mac sleep/wake, prolonged background use and phone hardware remain unverified. Passing checks do not establish product value or competition success.

## Findings, ordered by importance

### P2 — Context-only actions can lose their saved place when removed

Reproduce: create two actions; choose Edit saved place before starting any timer; save a next move, context and work URL; edit the goal. Remove remains enabled for that action. Remove it and save the goal: its saved context disappears.

`demo/work.js` protects removal using session/event references only, although its hint says actions with saved work cannot be removed. The `save-goal` transition in `demo/state.js` uses the same incomplete guard and explicitly deletes the context. This requires the user's Remove and Save actions; it is not spontaneous loss.

Recommendation: include saved contexts in the existing removal protection, in both the UI and transition. Add a regression covering notes/link without timer history. Do not introduce a new deletion/archive system in this pass.

### P2 — Allowed note lengths bury the return controls

Reproduce: save a 4,000-character next move and 4,000-character context. At a 390×844 viewport, Open work starts around y=8,091 and Start focus around y=8,159; document height is 9,186px. Both fields are within their advertised limits. Today renders the full next move as a large heading and the full context before the controls.

Recommendation: keep a bounded next-move preview and work/focus controls near the top; expose full text through accessible expansion. Preserve the complete stored strings, whitespace and editing behaviour. Check ordinary notes as well as maximum-length notes in both themes and at desktop/mobile widths.

### P3 — Skipping an invalid-link draft leaves stale validation feedback

Reproduce: enter `javascript:alert(1)` as a work link; Save; after validation fails, choose Skip for now. Today still shows “Not saved” and asks the user to correct fields that are no longer visible. The invalid URL is correctly rejected; this finding concerns feedback lifecycle.

Recommendation: clear form-specific validation when explicitly discarding that draft. Preserve actual storage failure feedback and pending Retry commands. Test both paths independently.

## Product input for discussion

Make the saved place a compact return preview: **Next move → Open work → Start/Resume focus**, with longer context below an expansion. This combines the second finding with a small product improvement while preserving the retained page composition and explicit timer control.

Research supports investigating contextual cues, not claims of a proven Trail benefit. Parnin and DeLine's CHI 2010 study surveyed programmers and tested automated resumption cues; its participants, cues and tasks differ from Trail's manually saved notes/link. Source: https://www.microsoft.com/en-us/research/publication/evaluating-cues-for-resuming-interrupted-programming-tasks/

Before adding features, run a short human check: save a place in a real task, work elsewhere briefly, return, and explain the next step without reconstructing the whole task. Observe confusion and clicks; do not invent performance improvements or generalize from one trial.

## Next boundary

Collect the user's current-demo feedback before writing the next OpenCode task. Proposed bounded scope: these three findings plus the compact return preview if approved. Keep graphics, account/sync, automatic activity capture and new integrations outside this correction pass. Only one implementation tool should edit this checkout at a time.
