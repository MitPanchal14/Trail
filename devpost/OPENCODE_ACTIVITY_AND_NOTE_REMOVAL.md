# Final feature increment: explicit note removal and real activity history

Use configured GPT-6.1 Sol at Medium reasoning. User explicitly requested these four additions before finalizing: note-removal controls, activity calendar, basic streaks and badges. This supersedes their earlier deferral only for this bounded scope. At dispatch preparation it is approximately 18:58 IST; the earlier 19:00 target cannot accommodate this increment plus independent review/recording. Do not fabricate a deadline success or skip checks to meet it.

Read AGENTS.md and required current product documents, newest HANDOFF/checklist, INDEPENDENT_COMPACT_REVIEW.md and FINAL_REVISION_DECISIONS.md. Work on current codex/trail-redesign over checkpoint 10d7edbb5a45f32c70097321024d03b2b7e5e2f8. Preserve the compact white-outline cards, active mountain/progress dot/campsite and all existing final-demo/end-block changes. Preserve both untracked ZIPs without staging them. No reset, branch switch, historical restoration or dependency installation.

Record an exact cross-file plan before editing. Complete Phase A and focused verification before beginning Phase B. Run the full suite once against the final combined runtime, then stop for independent review. If A fails, fix it before B; do not layer the activity feature over a broken persistence change.

## Phase A — explicitly remove obsolete saved text

Retain blank/whitespace/Skip preservation by default. Add separate accessible **Remove saved next move when I save** and **Remove saved context when I save** controls where a nonempty saved field exists. Follow the existing Remove saved link convention. Toggle read-only/disabled text editing appropriately without losing the user's draft if they untick the removal choice. The optional context removal belongs near that field inside extras. Save is explicit; Skip discards removal intent without deleting saved content.

Use the smallest backward-compatible notes-command extension: independent explicit boolean removal flags, absent means false. Validate provided flags as booleans and define/reject contradictory replacement/removal payloads. The UI must construct a valid unambiguous command. Existing saved-record schema remains unchanged; old commands and v1 contexts still work. Clear only the intended field to an empty string, retain the context identity and unrelated fields/reference, use normal committed save timestamp/receipt/revision semantics and preserve context-based action-removal protection. No reset/delete-record workaround.

Capture removal flags in the existing pause draft through navigation/mode changes, alongside the user's replacement text. A failed transaction retains exact command, removal intent, visible error and Retry; before commit the old saved place/copy/campsite remain canonical. Success appears only after commit. Exact Retry applies once. A notes save follows existing durable Undo invalidation rules; completion followed by Undo must still restore the exact saved fields as before. No new undo mechanism.

When all useful fields are explicitly removed and no link remains, Today falls back to the actual action label, Copy saved place disappears and the useful-context campsite predicate becomes false. Removing one field must not delete another or create completion/reward/timing changes. Empty context records still protect removal under the existing policy.

Focused checks: next-move-only/context-only/both removal; saved link preserved or separately removed; blank/Skip unchanged; invalid flag/conflicting command rejection without mutation; navigation/mode draft preservation; actual IDB abort/exact Retry and reload; copy payload/empty predicate; completion/Undo restoration; keyboard/390px and read-only/busy controls.

## Phase B — derived activity, streaks and minimal badges

Add one restrained **Your activity** panel above real Finished work cards. Show it even when no goal is finished yet: completed actions on an open goal qualify. Do not alter Home/Focus or widen/rebuild the accepted cards. Use theme tokens and a GitHub-like contribution grid with a modest violet/cyan scale, clear legend and ordinary typography, not a second mountain or gamified dashboard.

### Canonical rules

- Derive from actions currently status=completed and their actual completedAt timestamps, joined to their actual goal IDs/titles. Count each action once on its current valid completion date. Do not count raw event records, goals, timer minutes, Pause, Save, Copy or navigation.
- Undo/reopen removes a contribution and can reduce a streak/badge; recompletion counts once on its new valid date. Reopening/refinishing a goal alone must not duplicate its still-checked actions. Briefly explain that activity reflects currently checked actions, including corrections.
- No persistent activity/streak/badge records, migration, generated real history, backend or external calendar-provider integration. Existing user data supplies the truth. Invalid/absent/future dates must not create earned days.
- Dates use browser-local calendar days and a visible current timezone label. No toISOString().slice(0,10) for local bucketing. Traverse calendar days safely across DST; do not add a fixed 24 hours to local midnight. Use deterministic injected now/date/timezone test inputs where appropriate.
- Twelve Monday-start calendar-week columns ending in the current week; future cells are clearly unavailable and excluded from totals/streaks. Five intensity levels: 0, 1, 2–3, 4–6, 7+. Provide month/weekday orientation, Less/More legend and today marker. Show the displayed period's completed-action count distinctly from all-time totals.
- Select a day to display its full date, count and exact escaped goal/action titles in a simple in-flow detail area. Empty days say no completed actions. Empty history has no artificial contributions.
- Current completion streak counts consecutive qualifying dates ending today if today is active, otherwise yesterday. If neither qualifies it is zero. Best streak uses all retained valid activity, not just the visible 12 weeks. No freeze/grace/penalty state or streak-loss modal; a simple best/current label is sufficient.
- Badges: thresholds 1, 5, 10, 25 currently checked actions, e.g. First step / Five steps / Ten steps / Twenty-five steps. Show one highest earned badge and the next threshold; at 25 show the attained tier without inventing more. Empty state shows none earned. These are correction-aware derived milestones, not irrevocable awards or proof of productivity. No confetti, popup, duplicate completion events or sound.

### Interaction and implementation

Use native buttons with accessible full date/count names and selected state; include keyboard focus and day details available by touch/click/keyboard, never hover alone. Keep cells usable on a narrow screen. A labelled horizontally scrollable panel with visible scroll affordance is acceptable; page-wide horizontal overflow or 84 tiny inaccessible targets is not. A roving-tabstop grid with documented arrow/Home/End behaviour can avoid 84 tab stops; implement the actual keyboard behaviour if using grid semantics.

The panel is read-only in writer and non-writer tabs. Viewing/selecting dates/badges must not call domain writes, invalidate Undo, start/stop timing or replay mountain effects. Recompute after real canonical changes and reload/navigation. Refresh local date/timezone after returning to the page, and if the panel stays open across midnight, without clearing drafts, stealing focus, or rerendering other screens. Do not claim a fictional timeline is real; preferably leave fictional mode unchanged in this pass.

A small pure helper module such as demo/activity.js plus targeted tests is reasonable for deterministic date/count logic. If added, explicitly update all serving/build allowlists, static parity checks and current asset documentation; do not keep falsely claiming seven assets. No application dependencies. Do not rewrite timing.js/storage.js or create a second source of truth. Controllers render the derived result, not computed values saved to IDB.

### Verification

- Pure cases: no actions; multiple same-day completions; multiple goals; boundaries 0/1/5/10/25; highest badge/next threshold; today/yesterday/gapped/long streaks; best streak older than the displayed period; Monday/Sunday/year/leap-date boundaries; local midnight and a DST transition in a real DST timezone; future-date exclusion; changed browser timezone regrouping.
- Exercise actual canonical complete → Undo → re-complete; reopen action; reopen/refinish goal; reload; exact-receipt retry. Counts must not inflate. No mocked arbitrary coloured cells in real mode.
- Browser integration: empty and populated panel, day selection/details, literal HTML-looking/Unicode/long titles safely escaped, calendar keyboard navigation, visible focus, both themes and 390px, read-only tab, no writes/Undo invalidation on interaction, and date rollover/return-to-page refresh using labelled synthetic clock fixtures.
- Synthetic history for screenshots/tests must be isolated and explicitly described; never prefill the user's real profile. Real newly created users will naturally have mostly empty calendars.
- Preserve all existing compact history, circle/path/campsite, explicit Start/Resume, conservative timing, end-block, context-removal protection, storage failure/exact Retry, completion/Undo/review/history and example isolation assertions.

## Delivery and stop

Run syntax, all Node tests, exact public-asset/build parity, git diff --check, focused Phase A/B checks, then the complete current Chromium suite once after the final runtime change. Do not weaken existing tests to get a green result. Save ACTIVITY_AND_NOTE_REMOVAL_EVIDENCE.md with exact changed paths/results, screenshots and limits; update README, HANDOFF, checklist and spec/requirements/delivery claims only as needed. Mark this as local implementation awaiting independent and user visual review, not proof of engagement or efficacy.

No new durations, sound, AI, sync, notifications, extension, imported account data or further artwork redesign. No commit, push, visibility/license change, deployment, video upload or submission. Stop for independent review with the working preview URL and concise actual results.
