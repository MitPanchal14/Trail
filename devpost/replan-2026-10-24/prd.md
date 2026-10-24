---
doc: prd
status: draft
---

# Trail — revised product requirements

October 24, 2026. **Product interview and design review in progress.** This draft supersedes previous presentation requirements but is not an approved implementation contract. Previous PRD/spec/checklist copies are archived in `replan-2026-10-24/`. The revised core scope is approved; this PRD is not.

Trail helps a student or independent builder start and resume difficult work, with little administration and a meaningful visual record of effort.

## Document Map and Decision Authority

- `scope.md`: approved purpose and boundary.
- `replan-2026-10-24/requirements-ledger.md`: confirmed learner requirements and remaining decisions.
- `replan-2026-10-24/reference-audit.md`: first-party research and screenshot evidence.
- `replan-2026-10-24/design-brief.md`: detailed proposed design; exact composition, graphic and tokens need visual review.
- `replan-2026-10-24/OPENCODE_HANDOFF.md`: portable read order and bounded next task.

Latest explicit learner choices supersede historical design language. Preserve user records and useful behaviour, not the rejected presentation. Proposed defaults are not learner decisions.

## Latest presentation revision — October 24, Task 01b

The learner approves the gradient palette but not the current contour-route/layout. Add a beautiful first-visit landing with one clear start action leading into the work flow; retain direct saved-work entry for returning users. Improve next-action/subtask-completion hierarchy and whole-goal reward composition, make goal journey selection visually engaging with coordinated gradient hover/keyboard/touch feedback tied to the route, and give focus a peaceful animated gradient background with a stable work surface and still/reduced-motion alternatives. A centered focus window is the next design proposal, not a final learner choice. Add intentional light/dark themes to the tracked build. No new login, marketing funnel or productivity-science claim is implied. Full proposed composition and proof acceptance matrix: `replan-2026-10-24/design-brief.md`, latest 01b section. Task 01a behaviour fixes remain required. Production integration awaits visual review and unresolved contracts.

## The Core Journey

Source: `scope.md > The Core Loop`.

1. On return, see the next action before scenery or statistics. Read the saved return instruction where one exists, and explicitly Start/Resume.
2. For new work, enter a goal. Write and edit steps manually, or optionally request editable AI suggestions. Never require AI to create a usable task.
3. Choose a focus block. Start a calm focus session and work in another tab/application while Trail remains open.
4. Pause immediately without explaining why. Optionally save a short “When I'm back…” instruction or additional stopping context.
5. Return to known context and Resume without a mandatory generation, plan review or questionnaire.
6. Explicitly complete work. Its checkpoint is acknowledged locally; the next action stays reachable. Support correcting accidental completion.
7. Explore the day's route and the larger-goal journey to understand the real records behind accumulated progress.

## Screens and Layout

Source: `scope.md > Inspiration & Identity`; confirmed priority R01 and R14 in the ledger.

The next action is the strongest visual element on Today. The daily route and larger-goal visual are secondary to working. Do not retain the old mountain-above-task composition.

Proposed structure for review: Today, goals and progress/history as a small set of destinations, with a dedicated focus surface and contextual creation/editing. Exact navigation names and grouping remain open. A landing page is now explicitly requested in Task 01b; login and a settings centre remain outside this visual task.

Desktop and phone composition proposals are detailed in `design-brief.md > 4. Proposed screen composition`. They must be shown before production UI changes. A realistic long action and saved return instruction must remain readable; visual simplicity cannot be achieved by silently dropping content.

## Look and Feel

The learner explicitly requests strong Stripe/Linear inspiration, a light neutral background and dark text, minimal clutter, purposeful bento grouping, selective colour, dimensional graphics and comfortable smooth interaction.

The existing pixel-art mountain and graphical treatment are rejected. No old art or composition is required in the new experience. The proposed replacement is a smooth illuminated route in a subtle contour landscape; this is an agent proposal pending visual approval. Exact palette, typography sizes, depth and timings in the design brief are proof defaults, not approved product decisions or extracted vendor tokens.


### Composed Gradients on a Neutral Interface — confirmed colour requirement

The learner explicitly requests beautifully composed, contrasting mixed gradients in the designated colour-bearing parts of Trail, strongly inspired by Stripe's use of rich colour details within a predominantly light/black-and-white interface. Colour should feel designed as a composition: coordinated hue transitions, deliberate balance of saturated and quiet regions, and depth that belongs to the graphic. A single flat accent or generic default gradient does not fulfil this request.

Apply the shared gradient language to the route/goal graphics, mild completed-subtask glow, completion celebration, finished-goal blocks and streak icon treatment wherever those elements already call for colour. Small accent details elsewhere may echo the same palette without adding new feature surfaces. The unfinished state remains a simple readable tag; it must not look like earned completion.

Keep normal page backgrounds, essential task instructions, forms and most controls neutral and readable. Preserve one clear primary action. Use larger expressive colour coverage for the agreed goal-celebration moment, then return to a calm page with colour contained in the finished block. Calm focus uses lower-intensity colour and slower or static atmosphere. No automatic category-based gradient assignment is required.

The precise hue stops, gradient geometry, lighting and motion remain for visual proof; purple/blue is the learner's stated goal-celebration reference, not a mandate to paste one identical two-stop gradient everywhere. Functional meaning must remain understandable without colour. Review still, interactive and reduced-motion states, with text contrast maintained over every gradient frame.

## Features and Behavior

### Goal Creation and Manual Steps

Source: `scope.md > The Core Loop`.

Users can enter a goal and create steps without an AI request. They can edit action wording and focus duration before starting. Preserve input when validation fails. Do not force a fixed number of steps. The minimum required fields, direct single-action path and goal finish-condition wording must be settled during the remaining interview.

### Optional AI Assistance

AI proposes actions from supplied context. Users can inspect/edit before accepting. A clarification is preferable to invented project facts. Preserve drafts on provider failure and keep manual planning available. AI is optional for starting, stopping and returning. No automatic observation of external work. Do not send additional context simply because a different account runs the coding agent.

### Recommended Work

**Confirmed learner direction:** while creating a goal/task, the user can select its importance and category using small, low-effort controls. Important work that has been held back for longer should rise in a recommended list. Combine importance and a time-neglected variable with weights; higher priority should lead to a stronger recommendation. The learner also mentioned a threshold for surfacing recommendations.

Keep this an understandable task-priority mechanism, not an attention/productivity score. Manual category input is requested; automatic category inference and category-driven colours are not. The relationship among the spoken words severity, importance and need is not settled: do not create three redundant selectors. Exact categories, importance levels, weights, normalization, threshold and tie-break are open. Category is not established as an input to the weighted score.

The key missing decision is the clock: when neglect starts, and whether a real focus session without completion resets or reduces it. A newly created important goal and an older paused goal must be handled deliberately. Do not count timer duration as proof of useful activity.

Recommended design constraints for review: show a concise reason such as “High importance · last worked on …” using real stored data once the rule is defined; keep recommendations visually subordinate to the currently chosen next action; require the user to select before changing work; do not interrupt an active session or reorder accepted steps silently. These are proposed safeguards, not yet an approved sorting contract.


### Priority after partial work — confirmed refinement

Important unfinished work should appear in the next day's recommended work even if a focus session was recorded without completing it. Remaining subtasks influence the goal's priority level. Recent effort must not make important unfinished work disappear from recommendations.

Proposed label distinction: “In progress” for recently worked-on unfinished goals, while age/neglect is a separate ranking signal. The learner has not approved labelling all unfinished work “neglected.” A recommendation is an in-app suggestion; that earlier answer did not select a browser notification channel; the later reminder clarification now requires background notifications.

The ranking now needs to consider importance, time neglected and remaining work. Exact weights, time decay, whether remaining work is a count or fraction, and the direction/normalization of that contribution are unresolved. Do not claim that completing 1 of 5 steps means 20% of real effort is done, or let adding trivial steps automatically produce a higher priority. Propose an explainable bounded heuristic for review rather than asking the learner to choose arbitrary coefficients.

### Focus and Session Controls

Source: `scope.md > Approved POC Boundary`.

The user chooses a work block. Running focus shows task, timer and clear Pause/Complete controls. Changing tabs is expected; it must not pause a legitimate session solely because the document becomes hidden. App closure, reload recovery and absence are separate cases: no credit for time after a closed/interrupted session. Quick +5/+10/+20 minute extensions at block end are now requested. The proposed expiry state stops counting until an explicit extension; timer presentation still needs visual review. Timer expiry never completes a task automatically.

The optional floating companion is a narrow task/timer strip with minimal control, conditional on browser support and deadline. It is not a second dashboard. The normal focus screen must remain useful without it. Browser limits, strip close behaviour and a single source of timer truth belong in the technical plan after decisions are resolved.


### Focus Block Extension — confirmed

When the chosen focus block ends and work remains, the user can extend it using compact +5, +10 and +20 minute buttons. The action stays unfinished until explicitly completed. Retain existing session context and recorded focus time; extension must not create duplicate completion credit. Exact placement and transition into the extension controls belong in the screen proof.

Proposed expiry behaviour: stop counting the ended block, keep its context, and let the user explicitly extend, pause/save or mark the action complete. This follows the existing safe expiry boundary; auto-extension or unlimited unobserved overtime has not been requested. Further arbitrary duration editing can be evaluated alongside the already requested user-selected blocks, without forcing another settings screen.


### Streak Qualification and Visual Intensity — confirmed refinement

The first explicitly completed subtask on a day qualifies that day for the streak. Recorded focus time or opening Trail alone does not qualify. More completed subtasks on the same day should improve the streak icon's colour/treatment and add a small flame-like animation. Treat the calendar streak length and that day's visual intensity as separate values; additional same-day completions do not create additional streak days.

Exact colour tiers, count thresholds, maximum intensity and animation treatment need design review. Proposed safeguard: cap the effect so it remains a compact secondary cue; provide a static reduced-motion equivalent. The indicator is based on self-reported action completion, not work quality, attention or overall life growth.

Day boundary remains open. The learner confirms three consecutive missed days break the streak; see Streak Grace Period and Return. Proposed correction rule: derive qualification from non-undone completion records; undoing the only qualifying completion removes that day's eligibility without deleting legitimate effort history. This correction rule has not been explicitly approved yet. The short grace period is now requested and defined below. No paid freezes, purchases or penalties are requested. Background reminders are a separately confirmed requirement; see Re-engagement and Encouragement.


### Streak Grace Period and Return — learner refinement

A day without an explicitly completed subtask stays blank in the streak calendar. **Three consecutive missed calendar days break the streak.** One or two consecutive missed days are tolerated. A qualifying completion before the third missed day interrupts the run of misses. Do not treat three nonconsecutive misses as a break or mark today's still-open calendar day missed before it ends. Prior routes, completed tasks and calendar history remain intact after a break. The next qualifying completion after a break starts a new streak.

The exact three-day consecutive rule is explicitly confirmed by the learner. Day-boundary timezone, the displayed streak count during tolerated gaps and Undo/correction handling remain technical/product details for review.

When the allowance is exceeded, acknowledge that the streak has ended. The learner wants a small sense of loss together with hope that they can start again. Use concise, encouraging copy, optional motivational text and an easy next action. Do not erase the route, completed tasks or past calendar records, and do not use insulting or punitive language. Exact message and quote treatment require review.

Calendar qualification and grace are separate: grace does not fill a missed day or manufacture a completion. The meaning of the displayed streak count during tolerated gaps still needs a clear definition; it must not claim uninterrupted daily completion when blank days exist. No paid freezes are requested. Automatic neglected-work reminders are separately confirmed below; they are not a streak penalty.

### Pause, Update and Return

Pause is immediate and can be left without a note. The user may supply why they stopped or a concise next action. If a return instruction exists, show it prominently on return. Otherwise restore known task/action; do not fabricate a stopped location. Optional AI rewriting requires review and explicit save. Saving a note does not complete work or award a completion checkpoint. Latest learner refinement: leaving work unfinished should feel welcoming and ready to return to, rather than like failure. A brief warm return invitation is desired; exact wording remains open.

### Daily Route and Goal Landscape

Source: `scope.md > The Unique Kernel` and `Approved POC Boundary`.

Both timescales are required by the approved scope. Recorded focus and completed actions both contribute but retain distinct meanings. Selecting a segment or landmark should expose its real work record. Exact encodings, growth formula, landmark rules and chronological layout need approval. A scene may illustrate effort but may not claim geographic movement, measured attention or life progress.

Proposed correction principle: removing an accidental completion removes its completion contribution without erasing legitimately recorded session time. New action ordering must not rewrite earlier accomplishment identity. Any conversion from the existing representation needs an explicit compatibility plan.


### Route Encoding — confirmed simple distinction

A subtask is a unit of work inside a larger goal; it may have unfinished focus sessions before it is completed. The learner requests simple visual states: an explicitly completed subtask receives a mild glowing colour or similarly clear differentiated treatment; a session stopped before completion carries a simple “Unfinished” tag. Recorded focus time remains accessible and does not automatically create a completed landmark.

Avoid treating a session as a separate completed subtask merely because its timer ended. A subtask may accumulate multiple sessions, and later completion must not erase its earlier effort or double-count its completion. Keep the saved next step available for unfinished work. Use labels/symbols as well as colour and offer a static reduced-motion completed treatment.

Exact route geometry, the minutes-to-length mapping and landmark placement still need a reviewable proposal. This confirmed distinction does not authorize fake distance, earned completion from time alone or a complicated unfinished-state badge system.

### Completion Reward and Emotional Contrast

Latest learner decision, October 24: completed work should feel celebratory and achievable. Explore expressive effects, potentially screen-wide particles, a beautiful contrasting screen-colour transition and an obvious route update associated with the completed action. This supersedes the earlier quiet-local-only proposal. Focus remains calm; unfinished work receives a welcoming return cue.

Subtask-versus-goal intensity is now confirmed. A subtask gets a small satisfying tick/checkpoint animation. A completed larger goal gets the major screen transformation: animate the white/light background into purple/blue gradient colour, change the text to an enthusiastic congratulatory message, retain gentle background motion and show the resulting route/goal achievement. Exact copy and graphical execution require review; the learner's “woohoooo” is an emotional reference, not approved text.

Whole-goal confirmation trigger, exact graphics, duration and exit remain unresolved. Recommended proof constraints: preserve legible content and next-action/Undo access; use a finite effect; avoid flashing; offer a static reduced-motion composition. These recommendations require design review. Pausing, elapsed time and saving a note never trigger accomplishment celebration.

### Final-Step Review and Finished Tasks

Latest learner refinement: after the last planned subtask is checked off, open a small review window. Allow adding more subtasks rather than automatically finalizing the goal. Completed goals should remain in a finished-tasks destination, presented as attractive colourful blocks/windows with the surrounding background unchanged. Blocks are records of completed work, not invented ratings of work quality.

Exact final-review options require clarification: the learner's spoken “raise the task” is ambiguous. Colour assignment and the relationship between this local window and the earlier full-screen gradient celebration also remain open. Do not introduce mood inference or implement a whole-screen transition until that relationship is clarified. Prior explicit-goal-confirmation safeguards remain in force while planning.

### Re-engagement and Encouragement

The learner confirms automatic reminders when important work has been neglected, useful in the morning/daytime. Reminders must reach them while working in another tab and after Trail is closed. Exact neglect threshold, local delivery time/window, repeat limit and suppression during active work remain unresolved. Provide an explicit opt-in, clear permission/unsupported/denied states, an easy way to turn reminders off, and a return action to the saved task. Do not rely on a page timer for delivery after closure. Technical planning must define minimal remote reminder data and explain handling truthfully; no specific provider or schedule has been chosen. This does not authorize telephone calls or imply reminders are implemented.

Occasional meaningful quotes remain a requested enhancement; frequency and inclusion are still open. Keep them quiet and optional. Notification permission is a future user-facing opt-in, not a subscription to create during planning. No quote API has been selected.

## States and Boundaries

- First use: clear way to add work, no invented records; any sample mode explicitly labelled and separated.
- Returning: exact next instruction where saved; Resume is explicit.
- Empty day with prior history: today's route may be empty without erasing larger-goal history.
- Running/paused/expired/interrupted: distinct visible states; no automatic accomplishment.
- AI unavailable/error: draft retained and manual entry works; do not pretend templates are live AI output.
- Storage blocked/corrupt: preserve recovery access and do not overwrite unreadable records with empty state.
- Multiple tabs: preserve existing ownership/conflict protection until revised and verified.
- Accidental completion: Undo/correction remains available and history stays coherent.
- All current steps complete: do not infer that the larger goal is finished; separate goal confirmation.
- Reduced motion/no pointer: meaningful static graphic and accessible textual record.
- Unsupported floating window: main focus experience remains complete.

## Observable Acceptance Criteria

These describe intended checks, not completed verification.

1. Create usable steps manually without a provider call; review and edit an AI plan before acceptance.
2. Returning Today makes the next action and Start/Resume clear ahead of the route; verify desktop and phone with realistic long content.
3. Start, work in another tab, return and Pause; confirm consistent session state without claiming to detect attention.
4. Pause without typing; separately save a short return instruction, reload and find that instruction intact.
5. Complete one action and identify its subtle acknowledgement and record in the visual journey. Undo it without losing legitimate focus time. Separately verify the whole-goal gradient celebration only at the agreed goal-completion trigger.
6. Daily and goal views expose understandable real records; illustrative sample records never become personal activity.
7. Optional enhancements can be unavailable without blocking the core flow.
8. Visual review covers control states, narrow widths, keyboard access and reduced motion alongside the intended aesthetic.


## Colour relationship — working proposal, not final visual approval

The learner is unsure about category-based colour distinctions and is comfortable ruling them out if not useful. The phrase “task virality” is ambiguous and must not become an importance/virality score. No automatic task categorization, mood inference or category-colour engine is required.

Recommended simplification: one coherent Trail palette. Subtask feedback uses a small accent; whole-goal celebration expands the same colour family into a purple/blue gradient; finished-goal blocks keep a contained echo of that colour while the page is neutral. This gives continuity without adding classification or settings. Exact colours and any optional per-goal selection remain unapproved.

Recommended sequence for visual proof: final subtask → compact review (confirm goal finished, add a step, or keep unfinished) → only after explicit confirmation, a finite goal celebration → settle back to the neutral page, retaining a coloured finished-goal block. Review-window actions and this sequence are proposed defaults derived from the approved explicit-confirmation boundary, not a new learner-approved interaction contract. Do not infer implementation authorization.

## Product Decisions

Confirmed: manual importance/category selection and importance-plus-neglect recommendations; next action first; manual and optional AI steps; chosen focus blocks; work elsewhere with Trail open; immediate pause; optional return instruction; daily and long-term graphics; both time and completion matter; replace old pixel graphics; strong Stripe/Linear inspiration; continue existing repository.

Proposed, not approved: contour landscape, precise route encoding, three navigation destinations, exact token values, placement dimensions and motion timings. See ledger for details.

## Deferred / Non-Goals

No external work surveillance, compulsory stopping explanation, required AI chat, attention/productivity score, scientifically universal focus duration, accounts/sync, telephone integration, framework migration, stock 3D scenery or copied vendor artwork. Preserve data independently of visual replacement.

## Open Questions Before Implementation Contract

1. Graphical direction and exact screen composition: requires visible design review.
2. Time/completion encoding and landmarks: requires product decision.
3. Weighted importance/neglect recommendations: time definition/reset, levels, weights/threshold and current-action precedence require decisions.
4. Timer extension controls are confirmed; review expiry-state presentation and chosen duration defaults.
5. New-goal minimum input and navigation: requires product decision.
6. Final-step review options, explicit whole-goal confirmation, timing/exit and local-window versus whole-screen celebration: requires clarification. The small-versus-large reward distinction is confirmed.
7. Finished-task collection layout, colour assignment and post-completion interaction: requires product/design decision.
8. Streak qualification is one explicitly completed subtask per day; three consecutive missed days break the streak and one or two are tolerated. Define count semantics during grace, day boundary/correction and visual intensity tiers before implementation.
9. Background reminders are confirmed for neglected important work, in morning/daytime, including after Trail closes. Define eligibility, local time/window, repeat limits, cancellation and browser support. Quotes and the floating strip retain their separate review/feasibility boundaries.

Do not mark this PRD approved until the consequential gaps are settled. The current authorized activity is planning/documentation; the OpenCode handoff describes the bounded proposed design-proof task for the learner to dispatch.
