# Independent review — visual proof 01b

October 24, 2026. Reviewed current local source and live proof at http://127.0.0.1:52254/. This is an isolated, fictional, in-memory design proof. It is not the redesigned working app. Existing builder reports and independent evidence are separate.

## Verdict

**Recommend retaining this direction and closing the visual stage after two small state-wording corrections and learner approval.** No critical or high-severity workflow regression found in the targeted checks. Do not commission another broad redesign from this review. The two P2 issues below are limited to state descriptions; they do not invalidate the working continuity fixes.

The new landing, action stage, linked milestone path, atmospheric focus and two themes address the latest brief substantially better than the previous contour proof. This is reviewer judgement, not learner acceptance or measured audience preference. The exact minutes-to-route/reward lifecycle remains a Step 02 contract.

## Required corrections

### B01 · P2 — Completed history can call the completed work “planned”

Reproduce: finish all steps, confirm the goal, exit reward → Goal journey → select Proofread. This also affects an added step completed without a custom instruction/context.

Observed: the row says completed and the milestone has a check, while Behind this step says “A planned action in this fictional example.” This is a factual mismatch within the fictional scenario, even though the disclosure that no actual submission is observed remains correct.

Cause: proof.js **line 55**, stepContext(), returns the same planned-action fallback for every note-free step regardless of completion state. History renders it through recordDetail()/highlightRecord().

Fix: make the empty-context fallback reflect completed/current unfinished/future planned status. Preserve exact saved instructions/context where present. A completed fallback can say that the step was checked in this example and no additional note was saved; keep the no-observed-submission disclosure. Do not invent real work or add mandatory notes.

Evidence: [completed history](evidence/completed-history-planned-copy.png). Independent DOM observation: selected Proofread row marked completed, detail contains planned-action fallback.

### B02 · P2 — Route description announces an unfinished saved marker when none exists

Reproduce: complete the final step, dismiss final review with Keep goal open, then inspect the route accessible description. Also reproducible via the labelled Final-step review shortcut → Keep goal open.

Observed: 4/4 or 5/5 checked, goal open awaiting explicit confirmation, but the SVG description says “Ring marks the saved unfinished step; numbered surfaces are planned work.” There is no current step and no unfinished saved ring. The visual and accessible state disagree. The daily description also says Friday’s dataset step is in the whole-goal journey while the daily graphic now visibly includes that marker as earlier context.

Cause: proof.js **line 46**, routeSVG(), selects only finished versus not-finished text, rather than current unfinished versus all-checked-open versus explicitly finished; its daily prefix predates the new earlier-context marker.

Fix: state-aware accessible descriptions. Distinguish unfinished/current and future steps, all-checked but unconfirmed, and explicitly finished. Explain the Friday marker as earlier context when it appears in Today. Descriptions must agree with actual rendered markers and counts; do not suggest a goal is finished before explicit confirmation.

Evidence: [all checked but open](evidence/all-checked-open-route.png), plus the independent DOM snapshot saved in this review’s observations. Source confirms the unconditional not-finished suffix.

## Low-priority polish — not a blocker for the next stage

Initial programmatic focus can show a large blue outline around the entire main landing region in a fresh keyboard-focused browser state. Pointer navigation removes it. The generic [tabindex]:focus-visible selector outranks main:focus. If refined, scope it to the main container only and preserve visible focus on all actual controls, the skip link and nested reading regions. This is a cosmetic observation, not a reason for another design pass or removing keyboard outlines globally.

Pause currently has two level-one headings (“Paused” and “Your place is kept”). Consolidate semantics during integration if useful. Not a blocker or a request to rewrite the pause flow.

## Requirement-by-requirement design assessment

| Area | What is now present | Assessment / practical limit |
|---|---|---|
| Landing | Distinct hero, plain purpose, one dominant Start working, journey preview | Clear and suitable for showing product purpose quickly. Phone CTA observed around y=588–634 even with a paused-session strip. No clock starts from landing entry. |
| Returning Today | Framed next-action stage, dominant Resume, context secondary | Action catches the eye before the route. More deliberate than the previous text/button column. Long Today may scroll; do not truncate the saved instruction merely to fit. |
| Graphical journey | Rising route, earned checks, saved ring, planned milestones, goal token | Clearer connection to work than contour relief. Still a proposed milestone-path metaphor rather than a geographic Strava map; exact earned geometry is not yet implemented. |
| Subtask feedback | Coordinated gradient surface and corresponding marker/segment selection | Keyboard Enter and click selection independently matched record 2 to marker 2 and exact detail. Hover mechanics inspected in source and builder evidence, not independently pointer-hover exercised. Phone-width click is not proof of physical touch hardware. |
| Focus | Centered opaque reading window, atmospheric surroundings, still switch | Fits the requested peaceful direction. Still mode sets all three field animations to none without pausing the clock. No claim that it improves attention. |
| Long focus | Internally scrollable instruction/context, stable controls below | At actual 390×844 in dark mode: copy client height 225px, scroll height 607px; Pause/Complete at y=602–648. Both remained in viewport. |
| Small completion | Local finite acknowledgement with Undo | Distinct from whole-goal reward; saved instruction/context still restored by Undo with timer paused. No absent-time credit validated for production. |
| Final review | Visual summary/token, clear confirmation with add/keep-open | Better composed. Empty added step rejected; punctuation/angle brackets render literally. Dialog Escape closes without finishing. |
| Major reward | Full-screen gradient, readable result, route acknowledgement, finite exit | Matches the requested screen-colour moment better. Tab remains on exit, Escape works, background has inert attributes; returned Today stays finished without confirmation replay. Six-second auto-settle remains proposed. |
| Dark theme | Deep neutral surfaces, readable light text and retained accents | Coherent alternative, not an inversion. Real preference persistence/OS default still unbuilt. |

## Independently exercised / evidence

- Live layouts at actual DOM **1280×720** and **390×844**, plus initial 1536×864 observation. Checked light/dark states across targeted flows; no horizontal overflow observed in the tested phone landing and long Focus. This is not a claim that every screen was retested at every size/theme.
- Start working, Home, Today, journey selection, theme switch during focus, still mode, explicit Pause, save next instruction/context, Resume, completion and immediate Undo. Exact custom text/context restored; paused timer displayed its prior remainder.
- Added fifth step, empty-step validation, literal punctuation input, final review, Keep open/Escape, explicit confirmation, reward Tab/exit/Escape, finished Today and revisiting history. No duplicate confirmation/reward loop observed. Focus +10 extension → Home retained running strip → explicit Pause worked.
- Selected row/route/detail coherence inspected through rendered DOM only. No hidden in-memory model mutation or synthetic clock used by this reviewer. Source inspected for expiry guards, reward guard, reduced-motion CSS and all extension controls; not every boundary independently timed.
- Captured warning/error log query returned no entries. JavaScript syntax and documentation link checks run separately. App source not changed by review; no full production test suite needed/rerun.
- Builder-provided achievement motion contact sheet inspected; shows arrival, text transition and neutral finished destination. Actual WEBM files exist but were not independently replayed end-to-end here. Initial fade shows underlying page during transition, as expected from the designed opacity arrival.

## Honest limits

Builder reports 42 regression groups, 28 key-state screenshots and two real motion recordings. Read these as builder evidence, not independent counts. Reduced-motion emulation, full keyboard traversal, pointer hover, physical touch, 200% zoom, full screen-reader/contrast audit, hidden/background tab throttling, Comet, personal profiles and sleep/closure were not independently certified. One selected-context locator timed out; a fresh snapshot/DOM read confirmed the state, rather than treating the locator error as an app failure. An initial read of the inert JS property was inconclusive; actual inert attributes on all background elements were independently confirmed.

Persistence, real goal creation/time ledger, AI, recommendations/streak, notification delivery and floating companion are intentionally absent. Reload reset is disclosed. Do not present the preview as a complete product or mark dark-mode production slice complete merely because the proof has a toggle.

## Closeout

Use [Task 01c — final state wording](../../build-tasks/01c-proof-closeout.md) as a small correction, not a new visual build. After the two cases pass and the learner accepts this direction, freeze proof composition, mark Step 01 accepted and proceed to Step 02 contracts/reminder feasibility. Do not keep tuning decorative details before starting the real persisted core. No proof/runtime code, provider/service, permissions, Git commit/push or deployment changed in this review.
