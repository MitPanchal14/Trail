# Independent compact-card/progress-dot review — 25 October

Review-only boundary. Planned documentation follow-through: record this fresh review and update HANDOFF/checklist to distinguish independent technical acceptance from the user's visual decision. No runtime/test edits, new features or Git/publication changes.

## Fresh results

- `npm run check`, `npm test` (**25 passed**), `npm run build` and `git diff --check`: passed.
- `TRAIL_GATE=compact TRAIL_EVIDENCE=/tmp/trail-independent-compact node tests/browser.mjs`: passed.
- `TRAIL_GATE=travelling TRAIL_EVIDENCE=/tmp/trail-independent-compact-travel node tests/browser.mjs`: passed.
- Both Chromium checks ran outside the sandbox with synthetic isolated data. No assertion was changed or suppressed. OpenCode's complete 13-gate suite is recorded in COMPACT_FINISH_VISUALS_EVIDENCE.md; this review independently reran the two directly relevant gates, not the entire suite.

Inspected shared outline helper, real/fictional history renderers, circle/campsite CSS and the new/updated browser assertions. Changes are presentation-only; canonical data, timing/storage and schema remain intact. No new blocking defect found.

## Actual behaviour and captures

The human markup is removed. The small dot follows the unchanged sampled route; the stopped useful-context campsite remains a tent. Cards omit the full route/mountain and use noninteractive, hidden-from-accessibility decorative outlines. Expanded notes, safe work links, visible focus, reload/no replay and guarded reopening pass. Multiple goals retain identity/context/effort, and another open goal blocks reopening correctly.

Measured ordinary collapsed phone cards: **283px and 312px**. A deliberately maximum-length title grows to **629px**; this is natural height, not clipped content. Focused checks also cover desktop sizing, full saved text and bottom-cropped art without clipping foreground controls.

Viewed fresh captures:

- `/tmp/trail-independent-compact/compact-after-collapsed-dark-1440.png`
- `/tmp/trail-independent-compact/compact-after-ordinary-expanded-light-390.png`
- `/tmp/trail-independent-compact-travel/marker-live-travel.png`

## Visual reservation, not a blocking defect

Mobile `.finished-card` reserves ~36% plus padding for the decorative right-hand strip even when expanded. The white outline itself sits at the bottom; long titles/notes above it remain unnecessarily narrow. The maximum-title fixture and expanded action details therefore produce tall cards. No overlap, hidden data or broken control was observed, but the result is less compact for long content. If the user wants one last polish adjustment, give mobile expanded details more width and keep decoration out of that reading area; keep a concise title preview with a reachable full title only if explicitly chosen, rather than silently truncating stored titles. No correction implemented here.

The ordinary desktop outline/card and active dot match the requested direction. User visual acceptance remains pending. Existing explicit obsolete-note-removal limitation persists; this visual pass does not fix or worsen it.

Calendar/streak/badges remain unimplemented and separately scoped in FINAL_REVISION_DECISIONS.md. Physical browser/device/sleep, owned recording reference, final public origin, video and submission remain open. No claim of user validation follows from these checks. No runtime changes, commit, push or publication by this review.
