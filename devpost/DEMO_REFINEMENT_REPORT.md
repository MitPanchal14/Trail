# Remaining work before the final demo — 25 October 2026

## Latest status — after 21:29 IST user feedback

Pass 1 is implemented and independently checked (35 Node tests plus year/archive, compact and activity Chromium gates). User accepts the year calendar graphic, but requests collapsed default selected-day details, removal of inline history disclosure, clearer productivity home/visible examples, a minimal mountain logo and optional priority-driven card palettes. Exact current decisions: JUDGE_CLARITY_REVISION.md; next brief: OPENCODE_JUDGE_CLARITY.md. Shared populated fictional year/scenarios and dark Focus remain unfinished. This latest preparation supersedes incompatible earlier presentation requirements below; no runtime changes by this planning update. The 12-week/740px critique below describes the earlier baseline, not current code.

## Decision and honest assessment

The core local product exists. This is not a ground-up rebuild. The most visible remaining weakness is inconsistent presentation: the real archive/activity and fictional preview no longer tell the same product story. A judge can enter the older example, miss the new features, or see an almost empty calendar. Passing automated tests does not fix that first impression.

The new calendar is functionally useful but visually wrong for the user's brief: 44px numbered cells, twelve weeks instead of twelve months, repeated weekly month labels and too much explanatory text. Finished cards remain a 740px single column. Dark Focus has large muted blurred fields; whether their movement is perceptible in Safari is unverified. More rewards, badges or AI will not solve these particular problems.

Keep the saved-place return as the main benefit. Activity is supporting evidence of checked actions, not measured productivity. No promise of winning follows from these changes.

## Current verified baseline

- Source inspection: demo/activity.js derives counts from currently checked actions joined to goals; no independent reward/event counter or fake real history. Undo/action reopening reduces totals; goal refinish does not double-count. Explicit next-move/context removal is implemented.
- Fresh independent checks in this planning pass: syntax, **33/33 Node tests**, eight-asset static build and diff check passed.
- Fresh isolated Chromium activity gate passed: canonical completion/Undo/recompletion, reopen/refinish, abort/exact Retry, escaped text, reload, keyboard, both themes/390px, read-only behaviour and controlled midnight/timezone refresh. Log: /tmp/trail-independent-activity.log; captures: /tmp/trail-independent-activity/.
- Fresh isolated Chromium note-removal gate passed: independent/both removals, blank/Skip, drafts/mode switching, actual aborted write/exact Retry/reload, copy/campsite/protection, completion/Undo and read-only/phone/keyboard controls. Log: /tmp/trail-independent-note-removal.log; captures: /tmp/trail-independent-note-removal/.
- Extra isolated fictional Focus probe measured changing background transforms over 1.2 seconds with animation state running in both light and dark Chromium. Movement is implemented there; perceptibility and native Safari behaviour are not established by this measurement. No real user records were used.
- OpenCode reports all 15 Chromium gates passed for its final increment. This planning pass does not claim to have independently rerun that entire suite.
- Native Safari/Comet animation, physical sleep/background, actual phone hardware, public hosting and user visual acceptance remain separate gates. Headless WebKit is not installed locally; do not claim Safari passed from Chromium evidence.
- Current activity/note-removal work is uncommitted. Earlier checkpoint publication does not include these latest files. No push/deployment/submission by this pass.

## Pass 1 — full-year activity and compact archive

### Activity specification

Use **the latest twelve named calendar months including the current month**, each as a distinct labelled block with a visible gap. For today's date this is November 2025 through October 2026. This resolves the ambiguity between a rolling 365-day strip and twelve clearly separated months. Include every actual date in those months exactly once; blank alignment cells are decorative and future dates are visibly unavailable. Do not duplicate month-boundary dates in neighbouring blocks.

- Seven weekday rows and week columns within each month, Monday first. Show each month label once, with a clear year/range label across the calendar.
- Small 12–14px visual squares, modest corner radius, consistent gaps; no day numbers printed inside every square. Exact date/count remain accessible and visible on selection. Aim for a compact landscape year view on wide desktop; use contained horizontal scrolling or month-block wrapping at narrower widths, never document overflow. Do not force twelve months into unreadable phone pixels.
- Use a coherent Trail intensity ramp, rather than a rainbow of unrelated categories. Preserve count tiers 0 / 1 / 2–3 / 4–6 / 7+. Distinguish selected date and today from intensity without relying only on colour; make both themes legible.
- Keep small visual tiles usable: keyboard navigation, clear focus, exact accessible names, and an adequately sized equivalent date-selection control for touch/accessibility. A tiny square alone is not an adequate touch control. Do not claim accessibility solely because Tab works.
- Keep a compact summary: checked actions in the displayed period, all-time total, current/best streak and milestone. Correct singular/plural wording, including “1 day” and “1 action.” Move detailed keyboard/counting explanations into a short expandable “How this works” section.
- Selecting a day shows goal and action names, including empty-day feedback. Bound a very busy day's list with accessible expansion or paging; do not silently drop records.
- Preserve browser-local dates, DST-safe calendar arithmetic, timezone/midnight refresh, selected-date/focus preservation, currently-checked counting, and all-time streak/milestone semantics. Changing the visible range must not change historical all-time totals.
- No seeded records in Real work. A legitimately empty real calendar stays empty.

### Archive specification

Replace the narrow single column with a responsive grid: two compact cards on ordinary desktop, one on phones; use the existing content width. Target roughly 180–240px for ordinary collapsed cards, not a fixed height that clips real content.

- Retain the gradient and minimal outline mountain, but reduce decoration and padding so text and controls have adequate width. Expanded details should use full available card width on phones.
- Show title, completion date, checked-action count and recorded effort concisely. Keep full titles available; long titles/URLs/notes must wrap or expand accessibly.
- Show the newest eight goals initially, with an explicit “Show more” control and visible shown/total count. Keep all retained history reachable and preserve displayed count/expanded state across harmless rerenders where possible. No deletion or pruning.
- Keep details and guarded Reopen goal reachable. One open goal still blocks reopening another; no hidden failure, identity changes, timing credit or Undo mutation from archive navigation.
- Scope excludes search/sorting controls for now: recent-first plus bounded disclosure solves the immediate scrolling problem without another interaction system.

Acceptance: twelve distinct months; valid leap/year/month boundaries; no duplicate dates; future exclusion; unchanged Undo/recompletion/streak/counting; compact responsive cards for 0/1/8/9/30 goals; maximum text/full notes/long URLs; safe reopen; 390px no page overflow; both themes/keyboard/reduced motion; existing integration gates stay green. Exact first prompt: OPENCODE_YEAR_ACTIVITY_AND_ARCHIVE.md.

## Pass 2 — obvious, credible prebuilt scenarios

“Previous states” should be labelled **Explore a ready-made demo**, not history belonging to the visitor. This is the highest-priority judge-access improvement after Pass 1, not an obscure settings dropdown.

### Homepage entry

A compact, visibly bordered panel immediately below the main home introduction/CTA, visible in the ordinary first desktop viewport and near the top on mobile:

> Explore a ready-made demo
> See a saved place, a year of sample activity, or a finished goal. Fictional examples — your own work stays separate.

Give three direct entries: **Return to saved work**, **Explore sample activity**, **Browse demo states**. Preserve Start working/Continue as the main real-work action. Keep the panel available to returning users too, without displacing their saved next move. Always provide a clear Real work exit and Reset examples. Use existing safe mode-switch/stop behaviour; entering an example must never silently continue or credit a real timer.

### Minimum useful scenario set

| Scenario | What the judge can inspect |
| --- | --- |
| Saved return | Plausible unfinished action, specific next move, stopped context and clearly labelled work reference; explicit Resume |
| Focus | Running only after explicit Start/Resume; Pause, extension and motion controls; stopped/end-block route |
| Interrupted block | Saved place remains; uncertain away time not credited; explicit Resume |
| All actions checked | Review remains distinct from confirmed finished; add/keep-open/confirm |
| Finished collection | At least six plausible goals, compact cards, expanded context and correction/reopen distinction |
| Year activity | Deterministic sample dates across all twelve months, gaps, several count tiers and selected-day task details |
| Long content | Long title, note and link with usable controls on phone; no overflowing/clipped information |
| Fresh/empty | Honest empty activity/history and clear create/demo choices |

Use broad realistic work: workshop planning, writing, learning, research and personal projects. Avoid test strings such as “bruh” in judge fixtures. Populate enough separate completed actions to exercise all five intensity levels; every coloured date must resolve to corresponding fictional action/goal details. Do not randomize activity every render or manufacture dates in real storage. Include believable non-active days; a perfect year-long streak is unnecessary and misleading even as an example.

### Parity boundary

Use the same activity derivation and shared presentation wherever practical. Extend shared renderers/helpers instead of copying a second calendar implementation into proof.js. Keep fixture data in memory and explicitly fictional; never pass it into LocalStore. No second production engine, database or restored historical app.

Review parity for compact cards/outline, circular marker/campsite, saved-place copy/removal, End focus block, review/finish distinction, correction-aware activity, dark/light themes and reduced motion. If a fictional control cannot model a real feature faithfully, label the limitation explicitly; do not leave attractive dead buttons. Storage failures, lock ownership and physical sleep must not be presented as genuinely reproduced by a canned screen. Keep their verification in actual isolated tests, or label any demonstration as simulated.

Acceptance: each homepage entry reaches the promised populated state within one or two clicks; year colours match day details; real record snapshot unchanged before/after visiting every scenario; real drafts retained; no accidental Resume; shared visuals match; all examples remain labelled on navigation/reset/reload; both themes/390px/keyboard; no fictional completions inflate real badges.

## Pass 3 — short dark Focus and motion correction

Preserve the light Focus layout, controls, countdown and canonical engines. Do not add a second timer, audio, flashing progress or a new visual progress rail.

1. Reproduce perceived stillness in the user's Safari setup with Background motion On and reduced motion off. Inspect animation play state, transforms, stacking and browser compositing before changing it. Existing CSS already declares ambient-drift; absence of an animation declaration is not the established defect.
2. Tune dark mode with a clearer elevated card/border and restrained blue/violet ambient light. Reduce muddy teal/peach patches. Keep text/control contrast and calm peripheral motion; no bouncing timer or distracting rapid feedback.
3. Make slow drift perceptible over about 3–5 seconds, then verify it visually. Background motion Off and OS reduced motion must fully stop ambient and route travel; changing themes/navigation must not restart completion rewards.
4. Verify both themes at desktop/390px, On/Off/reduced-motion combinations, running/paused/stopped states, stable countdown/recorded effort and no replay. Inspect native Safari personally if available; report that boundary if not.

Short later OpenCode task: “Improve only dark Focus and verify ambient motion in the existing runtime. First record the CSS/presentation files to change, reproduce the reported stillness, preserve accepted light layout and all timing/storage/domain behaviour. Adjust dark surfaces/ambient palette and gentle visible drift; retain working Off/reduced-motion cancellation. Check desktop/390px, both themes, running/paused states and existing full regression gates. Update evidence/HANDOFF/checklist and stop for visual review. No new features, commit, push or deployment.”

## Final delivery work after these passes

1. Independent combined review and user visual decision; reconcile current product docs so historical “pending/unimplemented” statements cannot be mistaken for current status. Record actual native-browser/device limits rather than checking them off from synthetic tests.
2. Run a realistic saved-place loop with an owned document/reference. Verify completion, Undo, reopening, explicit text removal, clipboard fallback and read-only/error feedback on the final build. Preserve local-only/no-sync disclosures; no productivity/attention-measurement claims.
3. Freeze the accepted source; commit/push the working branch only when explicitly authorized. Never sweep in the two review ZIPs, caches, private handoffs or secrets.
4. Resolve public source access/license and truthful Skill Pack provenance; choose hosting and obtain publication authorization. No public-source/deployment/submission outcome is currently established by these local tests.
5. Deploy the frozen build when authorized. Test signed-out/public access and the complete loop on the final HTTPS origin; browser-local records do not transfer from localhost automatically.
6. Rehearse/record the short product-first video: saved next move in the opening seconds, interruption/return proof, quick archive/activity support, honest limitations. Update screenshots/walkthrough/submission to the actual shipped UI. Verify current organizer requirements/form before submitting.
7. Final user review/submission. Friend trials remain intentionally skipped, not passed.

## Order and stopping rule

Complete and review Pass 1, then Pass 2, then the bounded Focus correction. Freeze features after that; retain only reproducible correctness/accessibility fixes before delivery. Do not start more gamification, AI, sync, reminders, external calendar integrations or new mountain art in this sequence. Calendar means the in-app completion heatmap, not Google Calendar.

This report and the first prompt are preparation only. No runtime implementation is performed by this planning pass.
