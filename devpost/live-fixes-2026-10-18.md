# Bounded live UI fixes — October 18

## Recorded before implementation

Current checkpoint `5b60e6f` already contains the prior polish, including the corrected mobile summit grid placement. Preserve it and unrelated branding/evidence/generated changes.

Live reproduction at 320×740 on the separate fictional-record origin `127.0.0.1:3000`:

1. Selecting a task in Choose other work updates the main card but leaves focus and scroll below the fold. Measured selected action heading top -882px after selection. Fix successful explicit selection to reveal/focus its new action heading without starting a timer or changing another session.
2. The Choose other work action/project pair shares a horizontal flex row. Long text gets two narrow adjacent columns. Stack these labels with a quiet project subtitle, preserving full content and native button behavior.
3. The mobile nonfocus New task button occupies an otherwise empty row above the title. Use a compact title/button row and give the subtitle/status its own full-width row. Keep focus mode unchanged.

Intended files: `components/TodayView.tsx`, scoped `app/globals.css`, focused browser regression(s), and HANDOFF.md after observed validation. Add no pages, services or live AI calls. Do not change timer/domain/storage/provider/terrain source.

Verification: live mobile before/after, narrow/desktop layout, successful selection/rejected ownership, retained saved context and no automatic timer, same-task reselection, completion/summit; run meaningful regression suite, lint/typecheck/unit/build. New screenshots in ignored test-results. User review remains required; deadline is October 19 night, Asia/Kolkata.

## Implemented and checked

All three fixes implemented. Fresh lint/typecheck, 39 unit tests, build and full 108-case browser suite pass (`test-results/live-core-complete`, 1.2m). Browser selection checks cover desktop/tablet/320px mobile and preserve saved notes, 180000ms remaining commitment, no auto-start and zero completion rewards. Existing ownership/rejected-write tests remain passing; no dedicated new rejection fixture was added.

Live manual fictional journey: Start → save both return fields → reload with 00:51 unchanged → explicit Resume → Complete → explicit goal confirmation. Inspected final narrow/standard mobile summit and picker screenshots; world precedes management after confirmation and document remains 320px wide at 320px. Evidence under ignored `test-results/live-manual-review/`. Prior approved focus composition retained. No user localhost records changed or transmitted, no live AI calls, no push/deploy. User acceptance and physical-device tests remain pending.

The first new browser fixture expected a fresh selection to survive reload despite saved work; existing recovery correctly chose the saved session. Corrected the test setup/expectation rather than changing the product. All three new cases then passed and the full suite passed. Previous polish regressions, including summit scene geometry, remain intact.
