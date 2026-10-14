---
doc: prd
status: approved
---

# Work Trail — Product Requirements

Working title. A personal work app for someone who struggles to start difficult work and return after interruptions: choose a small action, focus, preserve your place, and bring a mountain landscape to life through recorded completion.

## Decision Status and Scope Refinements

The user approved the consolidated product defaults and technical approach on October 15, 2026. This is the approved product definition. It develops `scope.md > The Core Loop`, `The Trail's Purpose and Meaning`, and `Experience Intent and Functional Responsibilities`.

During the product interview, the user agreed to three main pages, a focus view, a reviewed speech/text task-creation flow, project mountains, and a yearly activity grid. These refine and modestly expand the approved scope: a mountain represents a large task, not a separate project-management entity. No teams, boards, collaboration, or project administration are implied. The user explicitly authorized adding checkpoint colour spread and whole-mountain completion glow to this PRD.

Final defaults below incorporate the approved handoff review. The technical spec supplies implementation details without expanding the product boundary.

## The Core Journey

1. Open Today. On first use, see a clear invitation to add work and a welcoming unstarted landscape, rather than fabricated history.
2. Choose New task. Speak or type a large task's description; inspect and correct the resulting text.
3. Request a breakdown. AI proposes a clear goal, finish condition, subtasks, and suggested session durations. If essential information is missing, ask a short clarification rather than inventing it.
4. Review the entire breakdown before accepting. Edit the plan where needed; acceptance creates the large task and its mountain. Large tasks can continue across several days.
5. Plan today using selected subtasks and available-time/busyness context. Review suggestions before committing to the day's plan.
6. On Today, see one next action first, the relevant mountain preview, and saved context if returning. The day's broader plan is secondary. Choose another planned action if desired.
7. Inspect and edit the suggested session duration, then Start or Resume. Enter a dedicated focus view with the countdown, action, and close-up mountain.
8. Complete the action, extend the session, or Save my place. Completion adds a checkpoint and spreads colour locally. Saving keeps the action unfinished with optional context.
9. If the tab closes unexpectedly, preserve the latest recorded state as unfinished. Returning shows where to resume, not an invented completion.
10. Explore accumulated work in Mountains or Progress. Confirm the large goal is finished to illuminate its entire mountain. Return another day with history and saved places intact.

## Screens and Layout

Source: `scope.md > Make the next action the easiest thing to find`, `Inspiration & Identity`.

### Today

- Primary content: next action, its large-task name, saved context when available, suggested/editable duration, and Start/Resume.
- Prominent visual: preview of the selected mountain and its recorded trail. The preview supports the action rather than obscuring it.
- Secondary content: a compact list or timeline of today's committed subtasks, completed states, and access to editing today's plan and constraints.
- New task is accessible here. Do not put the full mountain range, yearly grid, and detailed reports into a single endlessly scrolling dashboard.

### Mountains

- Overview of the user's large tasks as a mountain range, including each name and unfinished/completed state.
- Selecting a mountain opens or focuses its subtask breakdown, checkpoints, and saved place within this page. New task is also accessible here.
- Selecting a task from Today focuses its corresponding mountain when entering focus mode.
- Each mountain has its own saved position. Switching work restores the relevant mountain's recorded state.
- No arbitrary whole-project completion percentage for goals with an uncertain scope.

### Progress

- Yearly activity grid, selected-day details, completed-versus-planned subtasks, recorded focus time, and concise factual comparisons.
- Separate from the working dashboard so reflection does not crowd the next action.
- Exact wording describes recorded activity, not measured productivity or proven behavioral improvement.

### Focus View

- An immersive mode within Today, entered automatically by Start/Resume. It is not a separate page or permanent navigation destination. Leaving focus restores Today's regular layout.
- Current subtask, readable countdown, and close-up of the climber on its mountain; wider planning and other mountains recede.
- Controls to complete, extend time, or Save my place remain easy to find. Pause/Continue temporarily stops/resumes the timer without a note; Save my place exits focus.
- “Full focus” means a focused page/view; native browser fullscreen permission is not required by this product definition.

### New Task Flow

- A short creation/review flow available from Today and Mountains; not another permanent navigation page.
- Capture description → correct text → request breakdown → review all steps → accept or edit.
- Retain entered text while moving through the flow and when requests fail.

## Look and Feel

Source: `scope.md > Inspiration & Identity`, `The Trail's Purpose and Meaning`.

The user's chosen visual metaphor is a small avatar climbing a mountain in a beautiful, dimensional topographic landscape: hills, peaks, contour lines, and elevation reminiscent of radar/terrain maps. The user wants depth and an impressive scene; actual interactive 3D is not a requirement. A tilted terrain view can express this direction.

The landscape has natural colours from the start: green trees, inviting terrain, and a living-world feel. This supersedes the earlier black-and-white starting idea. As each subtask is completed, richer colour and light spread locally around its checkpoint. The entire mountain glows when its large goal is confirmed complete. The intended feeling is “bringing light and colours to the world of your productivity.” Neon is not the dominant style; progress enriches an already welcoming natural scene.

**Chosen UI direction: bento + pixel world.** Use a clean, readable bento composition for task controls, saved context, the next action, and supporting information. Give the pixel landscape a generous, prominent region rather than reducing it to a decorative thumbnail. Build depth through layered or isometric pixel terrain, natural trees, paths, checkpoints, and a small climber. Ordinary interface text and controls remain readable rather than adopting tiny pixel lettering throughout. The scene carries the gamification; the surrounding layout helps the user begin and resume work quickly. Focus mode simplifies this composition to the current action, countdown, and its mountain view.

The selected composition is demonstrated in `design-lab/index.html`; that prototype remains a historical comparison reference, not production behavior. The user selected Dusk as the default, superseding Woodland: dark green surfaces, pale readable text, light sage controls with dark text, blue water and warm earned golden light. Preserve the original bento and pixel mountain artwork. No theme selector is required. Each completion spreads localized light briefly then retains it; reduced motion shows the final state immediately. A contrasting climber/current or saved-position marker is distinct from completed checkpoints and the future path. Saved places earn no light.

**Approved visual behavior:** a brief, nonblocking summit celebration settles into persistent illumination, with readable natural contrast rather than uniform glare. Exact colour values, typography, and avatar design remain styling decisions; they must follow the established natural-colour direction and selected pixel-world treatment.

Keep the tone encouraging and avoid shame-based warnings. Small celebrations should not interrupt the next action. Provide a non-animated presentation for people who prefer reduced motion, and do not use colour alone to distinguish completion from pauses. The terrain should remain legible alongside clear textual task states.

## Features and Behavior

### Large Tasks and Reviewed AI Breakdown

Source: `scope.md > Plan the day without making planning another project`, `AI and Data Boundaries`.

A large task is the user's goal spread across multiple subtasks and days. “Project” is conversational shorthand, not a distinct administrative entity. One mountain represents one large task. A finish condition describes what the user intends to achieve; AI proposes it, but the user must review it.

Speech input reduces setup friction; typing remains available. Show a correctable transcript before requesting a breakdown. Do not require embeddings as a product feature. Gemini is the selected planning provider, called through a server endpoint; manual creation remains available.

The full breakdown is visible for review before the user starts following it. The review should support editing, removing, reordering, and adding steps; these controls are approved. After acceptance, archive removed steps rather than erase their history. Session durations are suggestions and can be changed. Uncertain research assumptions should be framed as things to investigate, not established facts.

**Acceptance criteria**

- A typed or transcribed description can be corrected without restarting creation.
- The user sees the full proposed breakdown and finish condition before accepting it.
- Unaccepted suggestions do not create completed work or begin a session.
- Accepted work produces a named mountain and subtasks that persist across visits.
- Failed AI requests preserve input and offer retry/manual editing; no synthetic answer is labeled as a live AI result.

### Daily Planning and Next Action

Source: `scope.md > The Core Loop`, `Make the next action the easiest thing to find`.

Use today's selected subtasks and the user's short availability/context description to suggest a manageable plan. The user reviews it. Existing large tasks stay available across days; an unfinished action is not lost at midnight. Today's selection is distinct from the complete multi-day breakdown.

On return, give the most recently saved unfinished action priority; otherwise show the first unfinished action in today’s committed order. Let the user select a different one. If neither exists, offer to choose or create work. Edit a draft plan, then explicitly press Commit today’s plan; subsequent additions also enter commitment history.

**Acceptance criteria**

- Today makes one actionable step and its Start/Resume control immediately identifiable.
- The rest of today's plan is accessible without displaying the full history and reports on Today.
- Selecting a different subtask selects the correct mountain and saved context.
- When no actions remain, show a truthful all-done/choose-more state; do not manufacture more work.

### Countdown Focus Sessions

Source: `scope.md > Support work happening outside the app`.

The app suggests a duration for the selected action; the user may change it before starting. Count down after Start/Resume. Duration means a bounded focus commitment, not an accurate task estimate or mandatory completion deadline.

The avatar may make subtle climbing motions near its recorded position while the session runs. Permanent progress advances on reported completion, not elapsed time. Avoid animating it almost to the summit just because the countdown is ending.

At zero, stop the countdown and ask whether the action is complete, the user wants more time, or they want to save their place. Completion can also occur before zero. Do not auto-complete or auto-extend.

**Acceptance criteria**

- An edited duration is the duration shown at session start; invalid/zero duration cannot start a session.
- Time reaching zero does not complete the action, colour a checkpoint, or finish the mountain.
- Completing the same action twice does not duplicate its checkpoint or completion count.
- Extending continues the action without duplicating previously recorded time.
- Recorded session time is displayed separately from completed work and never called verified focused attention.

### Save My Place and Interrupted Sessions

Source: `scope.md > Record completion or save a place with minimal effort`, `Return with enough context to act`.

Manual Save my place ends the active work session and retains the action, its recorded position, remaining-time state, and optional note about where work stopped. A note should not be mandatory. The next visit restores supplied context and identifies a next step to resume.

The user explicitly requires unfinished work to be saved when the tab closes. Preserve session state as work proceeds rather than relying on a last-second closing prompt. On return, mark an interrupted session as unfinished and offer Resume. Absence from the app must not be presented as verified work or a completed subtask.

**Agreed closed-tab time policy:** pause the countdown at its last saved position when the tab closes. On return, show the unfinished action and remaining time; Resume continues that remaining commitment. Do not include the closed-tab absence in recorded session time. Preserve state during the session so recovery does not depend on receiving a final tab-close event. Time tracking while the tab remains open but backgrounded is a separate technical/user-experience consideration; ordinary work in another app must not be mistaken for abandonment.

**Acceptance criteria**

- Save my place works without a note and does not mark completion.
- A supplied note and current action survive a reload and a later-day revisit.
- Closing/reopening during focus recovers the unfinished action without inventing new context or a result.
- Closing and returning after a long gap does not consume the saved remaining countdown or credit the gap as session time; Resume requires user action.
- Manual completion/pause recording is testable within the user's 20–30-second target.
- Missing context is visibly missing, not filled with a fabricated account of external work.

### Mountain Trails, Checkpoints, and Colour

Source: `scope.md > The Trail's Purpose and Meaning`.

- Each completed subtask adds a named checkpoint tied to its record. Open it to inspect the action, completion date, optional context, and associated recorded session time.
- Colour spreads locally around each completed checkpoint, accumulating into a visible route through the terrain.
- Today's completions are distinguishable from older ones without erasing history.
- Save my place preserves a resting position on the selected mountain. It does not earn a completed checkpoint.
- The large task's summit/full-mountain glow is triggered by the user's explicit confirmation that its finish condition has been met. Checking all currently generated steps alone must not silently certify the larger goal.
- Quiet days and pauses never strip earned colour away. History stays readable after many sessions.

**Acceptance criteria**

- With no completions, a mountain has an inviting starting state, not fabricated checkpoints.
- One completion creates one inspectable checkpoint and local colour; another creates additional persistent colour.
- Switching mountains and revisiting preserves their distinct histories and saved positions.
- Completing a subtask does not glow the entire mountain unless the large goal is separately confirmed finished.
- An explicitly completed mountain has a persistent completed appearance after reload.
- Adding or reordering subtasks leaves existing checkpoint positions and earned colour stable.
- Undoing a mistaken completion removes its completed checkpoint status, reverses the colour contribution attributable to that completion, and updates its completion-date grid count and any affected daily completion marker. Other earned colour and records remain intact; completing it again must not duplicate active completion credit.
- Reopening an explicitly completed mountain preserves its earned colours and summit glow. Its text status becomes Reopened, with the next unfinished action visible; newly added work is not marked complete. The glow then represents a previously achieved summit, not a claim that all current work is done.
- Motion preference changes presentation, not the underlying work records.

**Agreed trail correction rules:** completed checkpoints retain stable positions when future subtasks are added or reordered. Undo reverses the mistaken completion's visual and count contributions. Reopening a goal preserves earned colour and summit glow, while clearly labeling unfinished new work. Do not build arbitrary percentages or let edits silently rewrite recorded accomplishments. The technical spec must explain stable checkpoint mapping and reversible colour contributions.

**Approved summit correction:** Correct mistaken goal completion revokes the erroneous summit confirmation and glow while preserving valid checkpoints. Reopen retains historical achievement. Undoing a subtask linked to an active summit confirmation asks whether that confirmation is also mistaken; do not silently invalidate a genuinely achieved goal.

### Yearly Activity Grid and Day Details

Source: `scope.md > The Trail's Purpose and Meaning`, `Demonstrable Success Versus Behavioral Success`; added explicitly during the PRD interview.

Grid intensity represents the count of completed subtasks for each day. A separate small marker indicates finishing that day's committed plan. Selecting a day reveals completed actions, completed-versus-planned count, recorded focus time, and saved places recorded that day.

The grid is an activity history, not a comparative productivity rating: five small tasks are not necessarily more valuable than one difficult task. Pauses and time alone do not darken a completion-based square. Days before first use and future dates must be distinguished from past days with no recorded completions. Empty days remain neutral.

Use a visible legend with fixed bands: 0, 1, 2–3, 4–5, and 6+ completions. These are display bins, not points or performance grades; these bands are approved. Provide daily details to reveal task size/context rather than assigning invented weights.

**Agreed daily-plan editing rule:** the user can change today's plan. Once an action is committed for that day, removing it from the active plan or deferring it preserves a visible entry in that day's history labeled removed or deferred. Neither state counts as completion or silently earns the all-planned-work marker. Actions added as commitments also enter that day's commitment history. The marker requires a nonempty committed set with every committed action completed on that date; legitimate plan adjustments remain allowed without being portrayed as failures. A day with no committed tasks does not earn the marker.

**Acceptance criteria**

- A completion appears once on its completion date, with the corresponding grid intensity and details.
- A pause or timer expiry alone does not increase completion intensity.
- The marker is distinct from intensity and does not label partial completion as an all-done day.
- Removing or deferring an unfinished committed action leaves a visible history entry, does not increase completed count, and does not unlock the all-planned-work marker. Editing an uncommitted draft plan does not create commitment history.
- Selecting a cell provides its date, counts, task details, and time without relying on hover alone.
- No invented activity is backfilled into the user's year.
- Reports use comparable periods and disclose insufficient history; no productivity-growth claim is inferred from counts alone.

### Factual Progress Reports

Keep reports short: days with recorded completions, completed subtask counts, and recorded focus time. Comparisons may say “You recorded completions on four days this week versus two last week,” provided the actual records support it and period boundaries are clear. Task counts and time stay separately labeled. No productivity multiplier, AI confidence score, or guarantee of behavior change.

## States and Boundaries

- **First use:** explain the next step and invite task creation; no sample record masquerades as personal progress.
- **Empty Today:** invite planning or selecting existing work; a plan with nothing committed is not a perfect-completion day.
- **No history:** show an honest empty grid and short explanation of how records appear.
- **Speech unavailable/permission denied:** keep typing usable and preserve any existing input.
- **AI loading/error:** show status, retain input, allow retry or manual editing, and do not start following an unseen/unreviewed plan.
- **Timer ended:** request an outcome without penalizing unfinished work.
- **Tab closed/interrupted:** recover the last recorded place; do not credit unknown work automatically.
- **Storage unavailable/save failed:** visibly report failure rather than promise that a place was saved.
- **Quiet day:** preserve earned scenery and avoid shame-based messages.
- **Private records:** no public sharing by default. Data sent for AI processing must be explained; private appearance does not imply on-device processing.

## Product Decisions

- Bento + pixel world is the selected UI direction: readable task controls around a prominent, richly detailed natural pixel landscape.
- A mountain represents one large task spanning days; “project” is shorthand rather than a separate management entity.
- Selecting a subtask focuses its mountain; the range preserves several goals' separate journeys.
- Next action leads Today; the full day plan is secondary, with the mountain still prominent.
- Today, Mountains, and Progress are separate pages. Focus is a mode within Today, entered automatically by Start/Resume, with a short creation flow accessible from Today and Mountains.
- Speech-first entry with an editable transcript reduces typing friction; typing remains an alternative.
- Review the entire AI breakdown before accepting it.
- Countdown sessions with app-suggested, user-editable duration provide a bounded commitment.
- Closing unfinished work should automatically retain the saved place.
- Closing the tab pauses the countdown at its last saved position; returning offers Resume with the saved remaining time, excluding the absence from recorded time.
- Grid intensity uses completed subtasks; a distinct marker records finishing the day's committed plan, with time separately reported.
- Today's plan remains editable; removed/deferred commitments stay visible in daily history and never silently count as completed work.
- Completed checkpoints spread colour locally; confirming the entire mountain complete creates a whole-mountain glow. User explicitly authorized this addition to the PRD.
- New or reordered subtasks do not move existing earned checkpoints. Undo reverses a mistaken completion's colour and count contribution.
- Reopening a mountain keeps its earned colours and summit glow for motivation; explicit Reopened status distinguishes historical achievement from current unfinished work.
- Terrain starts naturally coloured with green trees; recorded completion brings richer colour and light into the landscape rather than transforming a black-and-white world or using dominant neon.

## What We're Building

One person's deployed web experience: reviewed speech/text task capture, large tasks with editable subtasks, daily planning, a next-action dashboard, countdown focus, manual/automatic place retention, persistent mountain trails with checkpoint colour and summit glow, a yearly activity grid with day details, and simple factual reporting. Include empty/error states needed for that loop to remain honest and usable.

This is larger than the initial tiny experiment. Build the creation → focus → save → return → completion loop before completing secondary calendar/report polish. Deployment remains an explicit learner goal.

## Deferred From the POC

- Recurring routines and automatic scheduling: keep first planning behavior simple.
- Native desktop/floating widget: defer platform integration.
- Sharing cards/social feeds: private records are enough to test the core.
- Teams, collaboration, boards, and full project-management features: mountains are large tasks.
- Rich calendar analytics, achievements, XP, and rankings: the chosen records already support the intended feedback.
- Free-roaming 3D exploration or game mechanics: dimensional terrain is a visual direction, not a new gameplay system.

## Non-Goals

Research tutoring, literature review generation, novelty assessment, automatic external-app observation, proof of attention, and medical/behavioral treatment claims. No fabricated data or forecast progress represented as completed work.

## Decisions Ready for Implementation

The consolidated defaults and browser-local architecture were approved on October 15, 2026. See `spec.md` for storage, calendar dates, background timers, voice fallback, AI contracts and deployment. Late completions contribute to their actual completion date and do not retroactively earn an earlier day's all-done marker. The name remains a working title. No cross-device sync or universal voice support is promised.
