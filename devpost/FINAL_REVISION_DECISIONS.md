# User-directed final revision — 25 October, 18:12 IST

## Local increment completed — independent review next

OPENCODE_ACTIVITY_AND_NOTE_REMOVAL.md is implemented locally, in A-then-B order with focused verification between phases. Combined syntax, 33 Node tests, exact eight-asset build/parity, diff and all 15 Chromium gates passed; see ACTIVITY_AND_NOTE_REMOVAL_EVIDENCE.md and HANDOFF.md. Independent/user review pending. No commit/push/deployment/submission or earlier deadline success claimed. Preparation-only/unimplemented statements below are historical.

## Latest authorization — approximately 18:58 IST

The user explicitly requests all four remaining items before finalization: activity calendar, basic streaks/badges and explicit obsolete-note removal. Visual correction is implemented, independently checked and pushed at 10d7edb. Next exact brief is OPENCODE_ACTIVITY_AND_NOTE_REMOVAL.md. It orders note removal and focused tests first, then derived activity with its own focused checks, then final combined verification. This supersedes the earlier undecided/conditional dispatch wording below. Implementation is not yet done; this preparation changes docs only. Planned documentation follow-through updates HANDOFF/checklist with the authorized scope and exact next brief. The old 19:00 prototype target cannot include this new increment plus review/recording; no deadline success is claimed.

User feedback: remove the visually disliked human climber, allow a small moving circle; compact Finished work cards, replacing the large filled mountain with a minimal white outline at the lower right, cropped at the bottom. User also requests a GitHub/LeetCode-like activity calendar and basic streaks/badges if feasible.

Planned sequence before implementation:

1. Prepare OPENCODE_COMPACT_FINISH_VISUALS.md for the approved visual correction only. Preserve the accepted active mountain and canonical engines. Review its actual result before the activity increment.
2. Record bounded activity semantics below; this is a feasible next increment, not implemented or dispatched here. Do not combine calendar, badge, note-removal and visual engine changes into an unchecked batch.
3. Update HANDOFF/checklist to reflect this user-directed change in priority. No runtime/test edits, commit/push/deployment/submission by this planning pass.

## Activity proposal for the next increment

- Read-only derived activity on Finished work, visible even before a goal is finished if actions have been checked. Use the latest 12 calendar weeks, weekdays labelled, five restrained theme-aligned intensity levels (0, 1, 2–3, 4–6, 7+ checked actions). No server or Google Calendar integration; this is an in-app activity history.
- Source: canonical actions still completed, grouped by their actual completedAt timestamp. Each action counts once on its current valid completion date. Undo/reopening removes its contribution; recompletion contributes once on the new completion date. Goal refinish does not increment task totals. Never count raw completion events without their reversals. No schema/new reward records are needed. Explain that history reflects current checked actions, including corrections.
- Use browser-local calendar dates, visibly label timezone; no UTC ISO slicing. Construct and traverse calendar days rather than adding fixed 24-hour durations across DST. Do not count future dates. Test midnight, DST and changed timezones as formatting/rebucketing, not physical-time verification.
- Select a day by keyboard/touch/click to show its count and exact escaped goal/action names. Provide a reachable previous/next-day path or native button list; hover tooltip alone is insufficient. Label cells with date/count, indicate today's date and include an empty-day/empty-history state. On mobile preserve minimum usable targets through a horizontally scrollable grid or a responsive layout, without page-wide overflow. Do not shrink 84 interactive cells into unusable dots.
- Completion streak: consecutive dates with one or more currently checked actions; count back from today if active, otherwise yesterday. Older activity means current streak zero. Show best streak derived from full retained activity, not just the 12-week window. No grace/freeze/punishment language or streak-loss modal.
- Minimal badges: 1, 5, 10, 25 currently checked actions. Derive tiers from current canonical total, so Undo/reopening may remove a tier. Show one highest earned badge and next threshold; no wall of fake achievements, popups or seeded real history. Empty state has no earned badges. Historical recognition that never revokes would require different semantics and is not this proposal.
- Recompute on canonical changes, navigation/reload and date rollover. No domain write, Undo invalidation, timer or mountain reward on viewing/selecting a day or earning a derived badge. Writer/read-only tabs see the same canonical source. Fictional activity remains labelled/isolated if added at all; no fabricated months in real mode.

## Honest scope assessment

The visual correction is low risk. Calendar plus corrected counts, day details, streaks and badges is a meaningful feature increment with timezone/accessibility/regression work; it is not a ten-minute decoration. As of this plan roughly 48 minutes remain to the user's 19:00 prototype target, before review/recording. Ship the visual correction first; reassess actual time before dispatching the activity task. An activity calendar is useful for reviewing consistency, but does not establish improved focus, retention or novelty. Explicit note removal remains the known P2 reliability limitation and must stay visible rather than silently disappear from the checklist.
