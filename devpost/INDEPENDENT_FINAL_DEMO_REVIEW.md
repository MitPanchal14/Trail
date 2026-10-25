# Independent final-demo review — 25 October 2026

Review-only pass requested after OpenCode's final-demo implementation. Plan recorded in FINAL_DEMO_REVIEW_PLAN.md. Preserved the dirty checkout and imported work; no runtime/test modifications, commit, push or publication.

## Result

No new blocking defect found in the final-demo pass. Fresh syntax, **25/25 Node tests**, seven-asset build parity, diff check and the **complete 12-gate Chromium suite** passed, exit 0. This independently reruns the full suite rather than relying on OpenCode's receipt. One existing medium-priority product limitation was independently reproduced: saved next-instruction/context cannot be explicitly removed. User visual feedback is still pending; passing checks do not establish preference, physical-device behaviour or public readiness.

## Actual checks

- `npm run check && npm test && npm run build && git diff --check`: passed.
- `TRAIL_EVIDENCE=/tmp/trail-independent-final-demo node tests/browser.mjs`: passed all A/B/C/edge/correction/return/travelling/mountain/rewards/return-fixes/end-block/final-demo gates. Used isolated Chromium outside the sandbox; no assertion was suppressed or test changed.
- Extra independent fresh-profile probe: create a normal-length workshop goal/action; save next move/context/link; clear both note fields; Save; confirm both original values remain. Then force clipboard denial, focus the manual-copy textarea and use Cmd+A; selected length matches the entire brief. No page errors. Desktop/390px captures in `/tmp/trail-independent-final-extra/`.

Full suite covers isolated first-use fixture entry/exit and draft preservation, unavailable storage/read-only discovery, native clipboard write/read, denied/unavailable clipboard fallback, full Unicode/long text, committed-only/action-scoped payload, late async cleanup, running timing, Undo and pending-write Retry safety. Existing completion/review/history, end-block, ownership, reduced motion, cancellation and no-replay checks remain passing. Maximum-text Open work/focus controls remain within the existing reachability bound (~474/~594px from action-area top).

## Findings and severity

### P2 — no explicit way to remove obsolete instruction/context (pre-existing)

Reproduction: save an instruction and stopping context → Edit saved place → erase both → Save. The previous text is still displayed and copied. Source: demo/state.js:151 preserves each blank field; demo/work.js:132-134 explains preservation but offers removal only for a saved link. This is deliberate blank-preservation, not a new regression or loss of a successfully saved replacement.

Why it matters: an old blocker or now-invalid next move can keep directing a returning person and enter the new portable brief. Workaround: replace the old text with accurate text. Recommended bounded correction if the user agrees: explicit per-field removal intent, preserving blank/Skip defaults, with atomic save, exact Retry, draft, reload and Undo coverage. Do not casually make empty text destructive. Not implemented by this review.

### Delivery gap — real recording work reference still pending

Current walkthrough correctly labels example.com as a rehearsal placeholder. It is safe for tests but cannot prove a real document was reopened. Choose an existing user-owned resource for the final recording or keep the placeholder claim honest. This is a content/delivery decision, not a broken link implementation or permission to publish a document.

### Visual observations — suggestions, not functional defects

- Fresh home retains its accepted hierarchy. Secondary discovery is visible; mobile naturally places the mountain below the text/CTAs rather than in the first viewport.
- Normal-length saved content produces a much cleaner composition than the intentionally hostile long-text test fixture. Use realistic short notes in recording, while retaining the long-text protections.
- The campsite is readable and the mountain is consistent across screens. The light-theme terrain is intentionally pale and the character is still small in the compact summit. Whether that feels rewarding enough is the user's visual decision, not something this test suite proves. Avoid another renderer/art overhaul before this decision.
- Denied-copy fallback is selectable and keyboard-accessible. On mobile it expands the action card and pushes later controls downward; this is ordinary document scrolling, not a hidden or blocked control. Its extra height is a tradeoff of showing a full manual-copy brief.

## Visual evidence inspected

Reviewed OpenCode's stable dark-mobile entry, dark-desktop maximum-text campsite and light-mobile summit. Independently captured/reviewed realistic dark-desktop saved place and light-mobile denied-copy selection, then fresh full-suite light-desktop entry and dark-mobile summit. Full-page modal screenshots include page content below the viewport's backdrop; that screenshot artifact is not evidence of a missing backdrop in the active viewport.

Fresh capture roots:

- `/tmp/trail-independent-final-demo/` — full suite, all states/themes and mobile/desktop fixtures.
- `/tmp/trail-independent-final-extra/realistic-saved-place-dark.png`
- `/tmp/trail-independent-final-extra/manual-copy-390.png`

These are synthetic records in isolated profiles, not the user's actual data or public-trial evidence.

## Targeted browser research

[MDN's writeText documentation](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) specifies secure-context availability, asynchronous completion and NotAllowedError when writing is denied. [WebKit's implementation account](https://webkit.org/blog/10855/async-clipboard-api/) describes its user-gesture requirement. The implementation calls writeText directly from a user click, announces success only after resolution, and provides manual text on rejection/absence. That is consistent with the documented constraints. Native Chromium plus forced-denial tests do not constitute physical Safari/iPhone verification; no cross-browser guarantee is claimed.

## Next boundary

Wait for the user's inputs on home, saved-place/Focus composition and the mountain/campsite/summit. Combine any accepted visual adjustments with a separately scoped explicit-note-removal decision; do not begin another feature batch automatically. Final-origin/public source access, actual recording reference, physical checks, video and submission remain outstanding. Friend/public trials remain intentionally skipped by the user's decision.
