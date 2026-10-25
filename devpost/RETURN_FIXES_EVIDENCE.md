# Three return-flow fixes — 25 October 2026

## Subsequent independent review

Independent diff/capture inspection and fresh syntax, 22 Node tests, build, diff check and focused isolated Chromium `TRAIL_GATE=return-fixes` all passed. Output confirmed protected Remove true, link/focus bottoms 474.21875px/542.21875px from action-area top and discarded validation cleared true. The gate covered protected context edit/abort/Retry/reload, full 4,000+4,000 text/keyboard expansion/edit/Undo/history and scoped validation while retaining failed-write draft/removal intent/pending Retry. Fresh screenshots are in `/tmp/trail-independent-return-fixes/`; phone collapsed and protected-editor captures from the implementation receipt were visually inspected. No new blocking finding. The independent review did not rerun the full combined suite or test physical hardware. No runtime changes or publication by review. Earlier pending-review wording below records the implementation handoff.

## Outcome and stop boundary

Implemented only OPENCODE_RETURN_FIXES.md on `codex/trail-redesign`, starting and remaining at HEAD `3081396258691175bd6a6d1da3030e16788c08c8`. Preserved newer HANDOFF/checklist planning and the dispatch. Exact affected files/root causes were recorded before edits in RETURN_FIXES_IMPLEMENTATION_PLAN.md. Stop for independent review; this is implementation verification, not independent acceptance or visual satisfaction. No commit, push, deployment, submission or extra features.

Preview: **http://127.0.0.1:3000/**. Current mountain geometry/rewards, written composition and explicit Resume are retained. No travelling marker, campsite, sound or streak work.

## Reproduced before fixing

- New domain regression failed with “Missing expected exception”: removing a context-only action was accepted instead of rejected.
- Isolated Chromium reproduced all three: protected Remove **false**; Open work bottom **7,953px** and focus control bottom **8,021px** from action-area top with 4,000+4,000 notes at 390×844; discarded validation cleared **false**.
- Code tracing confirmed: UI/domain removal predicates omitted contexts; Today rendered complete large notes before controls; Skip discarded the draft but not its validation flag, while unrelated form input could clear that flag.

## Corrections

1. **Saved-context protection:** any existing context record (including link-only or blank record) now protects removal in UI and save-goal transition, alongside unchanged session/event/completed guards. Protected Remove has an adjacent explanation associated by aria-describedby. Untouched actions remain removable when existing block/order constraints allow. Rejected commands leave input unchanged; no new delete/archive/schema path.
2. **Reachable long-text controls:** Today previews text over 240 characters or four lines, showing up to 160 code points from its first three lines. For long notes, saved reference and focus controls precede supporting context; native Read full saved place reveals exact full strings in document flow. No nested text-scrolling trap, storage-limit/normalization change or canonical write from expansion. Short-note composition and Focus/history remain unchanged.
3. **Scoped validation lifecycle:** validation identifies its originating form. Matching input or explicit matching discard (pause Skip / goal Cancel) clears only that form's feedback. Navigation/render and another form's input/discard do not clear it. Storage/read/write failures remain unscoped/protective; busy/pending guards prevent discard from hiding failed writes or exact Retry. Failed drafts/removal intent stay intact.

## Fresh verification

| Check | Result |
| --- | --- |
| `npm run check` | Passed. |
| `npm test` | **22 passed, 0 failed** (two new domain regressions). |
| `npm run build` | Passed, same seven-asset byte-parity coverage. |
| `git diff --check` | Passed, including final documentation. |
| Focused `TRAIL_GATE=return-fixes node tests/browser.mjs` | Passed. |
| Final complete Chromium suite | A/B/C/edge/correction/return/mountain/rewards/return-fixes all passed once after final runtime changes. |

Final browser command:

```sh
TRAIL_EVIDENCE=/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-return-fixes-evidence/full node tests/browser.mjs
```

Domain checks cover context-only, link-only and empty-context removal rejection with unchanged input, existing recorded/completed protection, permitted untouched removal, preserved context/IDs on valid edit and exact replay.

Browser checks cover actual disabled Remove and accessible explanation, no-timer/link-only context persistence after reload, an aborted goal edit with unchanged context/draft then one-revision Retry, 4,000+4,000 multiline/HTML-looking/unbroken canonical strings, literal rendering and complete keyboard Enter/Space expansion/collapse. Exact strings survive editing, reload, completion/Undo, finished history and reopening. Expansion snapshots remain identical and never start timing. In the same 390px fixture after fixing, Open work and focus control bottoms are **474px** and **542px** from the action-area top, both inside the 844px acceptance bound. Desktop/mobile light/dark positions also pass.

Invalid URL Save → preserved draft/navigation round trip → Skip clears only pause validation, leaves canonical context unchanged and restores committed form values. Unrelated goal editing cannot clear pause validation; pause input/Skip cannot clear goal validation. An actual aborted notes/removal write keeps raw draft/removal intent and meaningful stopped-timing/error/Retry state; navigation and synthetic attempted Skip/input cannot hide it. Exact Retry commits once and intentionally removes only the URL, preserving context. Existing full-suite timing/ownership/recovery, real/example isolation, safe links, motion cancellation and reward no-replay assertions remain intact; no domain assertion was weakened.

One focused harness failure was corrected: the notes-abort prototype hook had been reset by the required page reload, so it was reinstalled before the later abort fixture. No product contract was relaxed. Final combined run has no failing gate or page error in the new context.

## Screenshots and inspection

Directory: `/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-return-fixes-evidence/full/`

- `return-fixes-{collapsed,expanded,short}-{light,dark}-{1440,390}.png`
- `return-fixes-protected-editor-390.png`
- `return-fixes-expanded-detail-light-390.png`: derived top/detail crop of the full expanded browser capture, for inspecting keyboard focus/full-text wrapping without shrinking the entire long document.

Inspected light phone collapsed maximum notes, dark desktop collapsed notes, protected phone editor, ordinary short dark phone notes and the expanded full-text detail crop. Literal tags/line breaks wrap safely; expansion is keyboard-focused and readable in document flow. Short-note composition and the current mountain remain coherent; no document horizontal overflow in checked states. Deliberately expanding 8,000 characters produces a long document, by design, with work/focus controls above it. This is not a full WCAG/screen-reader or physical-device audit.

## Changed files / remaining limits

Runtime: `demo/state.js`, `demo/work.js`, `demo/styles.css`. Tests: `tests/state.test.mjs`, `tests/browser.mjs`. Documentation: `README.md`, `devpost/spec.md`, `HANDOFF.md`, `devpost/checklist.md`, new RETURN_FIXES_IMPLEMENTATION_PLAN.md and this file. `demo/proof.js`, mountain/reward artwork, `demo/index.html`, storage/timing engines, dependencies and allowlists are unchanged.

The three reproduced findings are corrected by implementation tests, **pending independent review**. No remaining failed check is known. Physical Mac sleep/background, branded Chrome/Comet, phone hardware, native BFCache and real-user value remain unverified. Visual delight remains unaccepted. Keep the travelling-marker proposal separate and do not begin it automatically; next action is independent review, not publication or further features.
