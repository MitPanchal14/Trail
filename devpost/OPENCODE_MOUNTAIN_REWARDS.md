# Approved dispatch — mountain completion feedback

Use GPT-6.1 Sol Medium. Work in the existing checkout on `codex/trail-redesign`. HEAD checkpoint is `4d2b9fb`; the reviewed mountain implementation and planning files are newer uncommitted work and MUST be preserved. One implementation editor only. Read AGENTS.md and required documents once, then MOUNTAIN_EVIDENCE.md and MOUNTAIN_REWARD_RESEARCH.md. Record precise affected files before cross-file edits.

## User-approved outcome

The user likes the current mountain silhouette, depth and composition. Preserve them and the surrounding written layout. Add a satisfying small checkpoint response and a stronger confirmed-summit moment. This supersedes earlier reviewer suggestions to redesign the terrain. Do not create another graphic concept or runtime.

## Implement only

1. **Action completed:** after successful canonical completion, briefly reveal that action's newly earned trail segment, resolve its checkpoint into the checked state and emit a few small local sparks. Coordinate/replace the existing 650ms ring instead of stacking independent celebrations. Target roughly 450–650ms total; tune by observing it. The earned trail/check remain after motion ends. Controls remain usable immediately.
2. **Goal finished:** only after explicit committed goal finish, add a brief summit halo/flag reveal coordinated with the existing compact reward. Keep one dismissible reward, one message and no forced wait. Ensure the summit feedback is actually visible, not merely animating behind an opaque dialog. The finished mountain remains in history without replaying effects.
3. **Colour roles:** retain current terrain/theme tokens. Current/saved place uses violet; earned trail uses current cyan/blue; reserve a restrained warm peach accent (starting candidate #f7b49d) for confirmed summit feedback. Check both themes. Pair colour with tick/shape/label; no site-wide recolouring or flashing background.
4. **Mobile labels:** improve readable current/summit/count labels at 390px without crowding the mountain, overlapping markers or squeezing 30 action labels into it. A small HTML caption outside SVG is acceptable if useful. Preserve complete action access through existing keyboard-accessible list controls.
5. **Save my place:** retain a quiet, truthful saved confirmation/current-place cue. Saving a note does not earn ascent, finish an action or trigger checkpoint celebration. Never report success before commit.

## Invariants and tricky cases

- Use actual goal/action identity to target transient effects. Do not animate every `[data-marker=index]` across unrelated finished mountains. Do not confuse selection with current position.
- Final semantic state is immediate and canonical; transient effects never delay saving, timing, review, navigation or controls. Animation cleanup cannot overwrite newer Undo/reopen/navigation state. Remove temporary classes/listeners/timers on rerender/exit as needed.
- All-checked-but-open remains Ready for review; it must not earn summit feedback. Keep review immediately available even on the final action.
- Undo, reopening, theme changes, selection, view navigation, reload and history inspection show accurate states without replaying rewards. Earlier-step reopening preserves later checked IDs. No reward totals/points to farm through repeated Undo/recomplete.
- Failed completion/finish emits no success. Exact Retry remains idempotent; do not introduce a new domain write or persistent animation/reward receipt. No duplicate celebration from one operation's callbacks.
- Motion Off/reduced motion show the same final checked/finished state immediately with no sparks/travel/glow animation. Turning motion off mid-effect must stop it cleanly. Preserve dialog dismissal, focus return and no-replay behaviour.
- Keep fictional example effects separate from real data. No external assets, dependencies, network calls, schema changes or engine refactor.
- No streaks/calendar, audio, AI, reminders, sync, new task model, terrain redesign or unrelated copy work in this pass. The three RETURN_EDGE_REVIEW findings remain open and must be fixed in the following correction pass before delivery.

## Verify, record, stop

- Run syntax, existing tests, build and diff check. Add focused behavioural browser checks for post-commit-only feedback, failure/Retry, unrelated mountain isolation, immediate Undo/navigation during effects, reduced motion/Off (including switching mid-effect), final-action review versus confirmed finish and reload no-replay. Do not merely assert CSS strings or weaken existing tests.
- Observe the actual transitions, not only final screenshots. Capture normal and reduced-motion states in both themes at desktop/390px; include 1/5/30 actions and a finished-history card alongside another goal if applicable. Verify no overflow/label overlap and no page errors. Run the existing combined browser suite once after final changes.
- Update HANDOFF.md, checklist, design brief and one concise new evidence file with changed files, actual results, captures and remaining limits. Do not mark the three known edge cases fixed.
- Target a reviewable result in about 45–60 minutes including focused checks; report exact unfinished work rather than broadening scope. No commit, push, deployment or submission. Stop for visual review with preview URL and evidence paths.

These are design hypotheses for user review, not proven dopamine/productivity/retention effects. Keep such claims out of product copy.
