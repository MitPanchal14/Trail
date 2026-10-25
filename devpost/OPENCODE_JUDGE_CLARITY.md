# OpenCode — judge clarity, priority colours and populated examples

Use **GPT-6.1 Sol · Medium**. Work sequentially with focused output; no parallel coding agents. Read AGENTS.md, README.md, HANDOFF.md, devpost/{scope,prd,design-brief,spec,checklist}.md, INDEPENDENT_YEAR_ACTIVITY_REVIEW.md and **JUDGE_CLARITY_REVISION.md**. That last document is the exact latest user feedback/behaviour specification and supersedes older inline-history/always-visible-day-detail requirements.

Preserve the current dirty checkout and both untracked ZIPs. One dependency-free eight-asset runtime; no install, restored historical app, reset, main changes, commit, push, deployment or submission. User accepts the twelve-month heatmap itself. Preserve its structure/count semantics and accepted mountain/circle/card density. Focus visual redesign is outside this task.

Before editing, write devpost/JUDGE_CLARITY_IMPLEMENTATION_PLAN.md listing exact changed files and the state/compatibility/UI boundaries. Implement these three milestones in order; fix each failing focused test before continuing. Do not stop at a plan or partial milestone if implementation can continue safely within scope.

## A — Small, compatible goal priority

Add a create/edit **Priority** dropdown: Low / Normal / Important, stored values low / normal / important. Priority belongs to the goal/archive card, not each individual action. Default Normal. Include hint: “Changes the label and card colour; action order stays yours.” No automatic sorting, scoring, deadlines or reminder behaviour.

Extend optional schema-v1 goal priority validation without rewriting storage: existing missing fields render as Normal; invalid present values reject. New goals default Normal. Omitted priority in older save commands preserves an existing priority; explicit valid changes save normally. Include priority in drafts, form capture and exact pending commands; Save/Cancel, in-app navigation/mode changes, reload, finish/reopen/refinish, old snapshots and Undo must retain intended values. Preserve all existing protected removal/session locks and timing semantics. No reset, destructive migration or loss of old records.

Focused state/browser checks must cover old snapshots/commands, each enum/default/invalid value, draft retention/Cancel, saved reload, actual write abort and exact Retry, priority retained through finish/reopen/refinish and no action order/effort/count changes. Update current spec with this optional field; do not claim compatibility without testing.

## B — Clear home, lighter archive, brand and coherent colour

1. First-use home copy:
   - Eyebrow: “Your productivity and focus companion”
   - Headline: “Pick up where you left off.”
   - Body: “Plan a goal, focus on one action, and save exactly where to restart. Your next step stays ready when you come back.”
   - Keep Start working primary; retain actual returning Continue/Review/New goal logic and genuine saved cues. Preserve approved typography/layout; mountain supports goal progress rather than suggesting a hiking product.
   - Work-oriented saved-place preview labelled Goal / Next move; clearly fictional if illustrative. Use the workshop story in JUDGE_CLARITY_REVISION.md; no invented real progress.
2. Visible home panel: “Try a ready-made demo”, buttons Return to saved work / Explore sample activity / Browse demo states, explanation “Fictional examples. Your own work stays separate.” Keep it available on home with existing real records, without displacing the actual next move. The ordinary first desktop viewport must show category, benefit, main CTA and demo access.
3. Replace header glyph with original minimal two-peak blue/violet mountain mark, optional restrained teal accent. Keep Trail. wordmark. Update inline favicon. Accessible brand link and theme contrast remain; no new downloaded asset/library.
4. Under calendar, initially show only selected date/count and “View actions”. Default collapsed on initial entry and selecting a different date; explicit activation opens exact full task/goal details, with existing further disclosure for busy days. Retain empty-day response, date input/keyboard/focus/refresh behaviour. Never force open a long task list after ordinary selection. Add clear “Finished goals (N)” heading and working “Jump to finished goals” anchor near calendar top; preserve canonical data/Undo.
5. Remove the visible “Review actions & saved context” row/inline disclosure from cards. Make the goal title a keyboard-accessible, visibly discoverable View completed work control opening a read-only detail dialog: complete definition, actions, context/notes/times and safe work links. Keep full record access, not deletion. Natural long-content scroll, labelled heading, Close/Escape/focus return, no conflicting review/reward dialogs or replay. Preserve pending/read-only errors/guards; viewing alone never saves or unlocks/reopens.
6. Priority card palettes: Low = teal/blue; Normal = indigo/violet; Important = deep plum/warm amber. Tune readable foregrounds in both themes, with explicit priority text and stable semantic tokens. No random per-render colours; no priority derived from action count. Existing missing-priority goals honestly remain Normal. Keep compact responsive two/one-column grid, outline mountain, newest-eight/Show more/all IDs and safe Reopen control. Headings/long text must remain readable with decoration.

Focused browser checks: first viewport at 1440×900/390×844; create/return/home modes; day lists initially collapsed and explicit expansion; archive heading/jump focus; count/day/date/midnight/timezone compatibility; all three palette labels/themes; title detail dialog exact escaped/max text/safe links/Close/Escape/focus return; pending/read-only/Undo/no-write; long titles and Show more. Update obsolete selector/layout tests to assert the replacement behaviour, preserving previous record-content and state/timing/error checks rather than dropping them.

## C — Actual populated, shared fictional examples

Complete the Pass 2 scenario/discovery work, not just links pointing to the old screens. Direct homepage entries must open the promised stopped saved return or populated activity; Browse demo states makes choices clear. Include saved return, explicitly started Focus/paused/end-block, labelled interrupted recovery, all-checked review versus finished, multi-goal archive, year activity, long content and fresh/empty states. Entry itself never silently starts focus. No pretend real storage failure; label any canned condition simulated.

At least six realistic completed sample goals across broad work (workshop planning, writing, research, learning, personal projects), mixed priorities and deterministic completed actions across every displayed month. All five heatmap levels must be inspectable, including a 7+ day and inactive gaps. Dates not future; every coloured date maps to exact sample task/goal details. Generate relative to the current twelve-month range so previews stay useful after month/year rollover. Stay within real limits; no random every-render data, no fake effort/retention claims and no diagnostic “bruh”/test titles in judge examples.

Share existing activity derivation and presentation/control helpers within current assets rather than cloning divergent markup. Keep the fictional fixture/controller in memory and marked Fictional example on every relevant view, with clear Reset / Real work exit. No fictional data enters LocalStore; no second production engine/database/framework. Review parity of logo/home/card palettes/detail dialog/year selection/priority/marker/review controls. Clearly identify any intentionally limited fictional interaction; no attractive dead controls.

Verify that all example routes/controls work, sample colours/date details/counts agree, priority labels match palettes, realistic task content is readable, reset deterministic and real records/drafts/Undo preserved. Existing mode switch must pause a running real session through the existing committed path; never bypass pending errors or award away time. Take before/after canonical snapshots in isolated tests; no normal-profile data manipulation. Sharing pure presentation must not weaken real timing/storage/lock/error guards.

## Final checks and stop

npm run check; npm test; npm run build/exact eight-asset parity; git diff --check. Update targeted gates and run the complete Chromium suite after the final runtime edit, preserving all existing state/timing/correction/isolation assertions. Capture matched light/dark desktop/390px and fresh-home first-viewport images; verify no document overflow. Report the number of tests actually run, dimensions, screenshot paths and actual native Safari/phone/sleep gaps, never replace them with Chromium claims.

Update current README/HANDOFF/checklist/scope/PRD/design/spec and claim/evidence docs where behaviour changed. Add devpost/JUDGE_CLARITY_EVIDENCE.md with A/B/C actual results, differences and unresolved limits. Preserve historical dated receipts. Stop for independent/user visual review. Do not begin dark Focus, add unrelated features, commit/push/publish/deploy/submit or claim a winning/validated product.
