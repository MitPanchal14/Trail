# OpenCode task — twelve-month activity and compact archive

Use GPT-6.1 Sol Medium for this bounded pass. Keep reads/output focused; raise effort only for a concrete unresolved date/state defect. No parallel implementation agents.

Read AGENTS.md, README.md, HANDOFF.md, devpost/scope.md, prd.md, design-brief.md, spec.md, checklist.md, ACTIVITY_AND_NOTE_REMOVAL_EVIDENCE.md and DEMO_REFINEMENT_REPORT.md. The latter records the latest user request; implement **Pass 1 only** now. Preserve the dirty checkout and both untracked ZIPs. No reset/stash restoration, old app, dependencies, main changes, commit, push, deployment or submission.

Before editing, record exact planned cross-file changes in devpost/YEAR_ACTIVITY_AND_ARCHIVE_PLAN.md. One retained eight-asset static runtime. Current activity/note-removal implementation is working but uncommitted; preserve it.

## Implement

1. Replace the 84-day view with the latest twelve named calendar months including the current month. Today Oct 25 2026 means Nov 2025–Oct 2026. Distinct month blocks, visible gaps, one label each, seven Monday-first weekday rows. Every valid date exactly once; leap dates/year rollover correct; blank alignment slots decorative and future dates unavailable.
2. Compact GitHub-like Trail heatmap: 12–14px visual squares, restrained coherent intensity ramp, no printed number on each square. Preserve exact accessible date/count, keyboard navigation, visible focus, selected-day details and an adequately sized equivalent date-selection control. Keep today/selection distinct from intensity. Responsive internal scrolling/wrapping; no page overflow. Do not squeeze a full year into unreadable phone pixels.
3. Preserve the five existing count tiers and all existing canonical counting, Undo/recompletion, local-timezone/DST, current/best all-time streak and milestone rules. Counts are currently checked actions, not events, time or goal count. No persisted activity state or fake real history. Selection/refresh must preserve focus and unrelated drafts. Preserve midnight/timezone refresh; update it for month boundaries.
4. Reduce explanatory copy into compact stats/legend and expandable help. Correct singular/plural labels. Selected-day goal/action details remain complete; use accessible expansion/paging for unusually busy dates.
5. Finished archive: use available content width and two compact columns on ordinary desktop, one on phones; retain gradient/minimal white outline art. Reduce padding/decoration; target ordinary collapsed cards about 180–240px, but allow content to grow. Full titles/notes/URLs remain reachable, controls and focus rings unclipped; phone details use full available width. Preserve safe Reopen guards and stable identities.
6. Show latest eight finished goals initially, then explicit Show more and shown/total count; keep all retained history reachable. Preserve loaded/expanded presentation across harmless refreshes where feasible. Do not add search/filter/sort features, pruning or schema changes.
7. Preserve fictional isolation. Shared archive styling must remain sound for existing examples. Do not build the new scenario gallery or seed a fictional year in this pass; that is the next bounded task. Prefer reusable activity presentation boundaries for that later task, without a premature architecture rewrite.

Expected touched files: demo/activity.js, work.js, styles.css, targeted tests and product/evidence documents. If another path is required, explain it in the pre-edit plan. Keep activity derivation DOM-free/testable. Preserve proof.js's retained mountain/circle/reward, current real Focus/timing/storage/state contracts, explicit note removal and clipboard fallback.

## Verify

- Date tests: twelve month names/order across December/January, 365/366 as applicable to the chosen twelve months, leap February, leading/trailing padding not counted, exactly one occurrence per date, current-month future dates unavailable; timezone/DST/midnight/month rollover.
- Existing canonical completion/Undo/recompletion/reopen/refinish, future/invalid date exclusion, all-time versus period totals, streak/milestone boundaries, aborted exact Retry remain passing.
- Browser: empty and populated activity, every month selectable, exact day details/escaping, keyboard and accessible date alternative, today/selection/intensity, both themes, 390px and desktop, no document overflow. Simulated historical fixtures only in isolated browser tests.
- Archive 0/1/8/9/30 goals; two columns desktop, one phone; Show more reaches every goal; long title/notes/URLs, expansion and guarded reopen, read-only/pending error safety. Presentation changes must not write to storage or alter Undo/timing.
- npm run check, npm test, npm run build, git diff --check; update relevant existing browser assertions and run all existing Chromium gates after final runtime edit. Do not weaken old timing/error/isolation checks to accommodate new layout.
- Capture light/dark desktop/390px before/after evidence; report actual dimensions and unresolved browser/device limits. Tests passing are not user visual acceptance.

Update HANDOFF.md, checklist.md and relevant current docs; put exact results/capture paths in devpost/YEAR_ACTIVITY_AND_ARCHIVE_EVIDENCE.md. Stop for independent and user visual review. Report implemented/not implemented and failures honestly. Do not begin Pass 2/Focus or publish anything automatically.
