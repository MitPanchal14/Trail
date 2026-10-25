# Trail product requirements

## Purpose and hierarchy

Help a person start work, preserve an unfinished thought and return directly to the next useful action. First-time users see a clear, confident landing page with one primary entry action. Returning users should see the saved next action first; goal imagery, statistics and streaks remain secondary. Avoid onboarding overhead.

## Goal setup

Users can manually name a goal, describe what finished means and create/reorder/edit subtasks. AI assistance is optional and any proposed breakdown must be editable before explicit acceptance. Manual creation always works. Category and importance use small, optional selectors; do not require a lengthy form.

## Focus and interruption

Users choose a block duration and explicitly start or resume. Keep the task and saved instruction prominent. Show a readable timer, Pause and completion controls with calm optional ambience and still/reduced-motion support. Running time is recorded effort, not proof of attention. Navigation within the loaded app or another tab must not implicitly pause a session.

Pause stops timing immediately. An optional short note records where work stopped and what to do next. Skipping or leaving fields blank preserves previous useful context. Return language is welcoming. Reopening after closure, crash or sleep must conservatively show paused/interrupted work, award no unverified away-time credit and require explicit Resume. Specify the precise recovery rules before implementation.

Expiry does not complete a subtask. Offer +5/+10/+20 minutes without losing context or double-counting effort. Undo must restore the exact task context and paused timer state. Only one active session can own timing, including across tabs.

The bounded return pass adds an optional concrete next-move prompt, collapsed optional where-stopped context and one user-supplied HTTP(S) work reference. Blank fields preserve prior useful values; only an explicit Remove saved link plus Save clears a reference. Skip changes nothing. Pause drafts survive in-app navigation/mode changes, not reload. Cmd/Ctrl+Enter saves only this form and ignores IME composition. Invalid/failed saves retain the draft for correction/exact Retry.

Today distinguishes an actual saved next move from the next unfinished-action fallback and shows the actual context-save time, never “last activity.” Open work is available there, in Focus saved context and finished history; opening the supplied page in an isolated new tab neither starts/resumes timing nor claims external work was resumed. Trail does not fetch, inspect or automatically reopen references. Goal-wide counts and recorded effort remain distinct; no daily mapping is implied.

## Completion and history

Completing a subtask earns restrained visual feedback and a differentiated completed state. When all subtasks are checked, offer final review: add a subtask, keep the goal open or confirm completion. Completing a whole goal shows a compact window with a stable message and finite colourful ribbons; preserve the surrounding page, allow dismissal, respect reduced motion and never replay celebration through navigation. The local day-build implements this bounded flow; user acceptance is still pending.

Finished work should persist as a real collection with restrained goal-coloured cards, dates, counts and context. Reopen/correct/Undo behaviour must stay coherent across Today, Journey and Finished work. Navigation cannot create new completion events.

## Progress and motivation

Current bounded mountain presentation maps actual action statuses to the existing route. The first unfinished action determines the expedition destination independently of selection or checked-count. A useful saved next move/context/reference with timing stopped shows a campsite; a blank record is insufficient. Newly applied completion moves the marker briefly; navigation/Undo/reopening/reload show canonical position without replay. All-checked is Ready for review below the summit. Only committed explicit finish brings summit arrival inside the existing single reward. Controls stay interactive and Off/reduced motion immediately settles the marker. This behavior is implemented for review, not yet visually accepted by the user.

Daily progress and the larger goal journey should visually connect effort to outcomes. Encode focus minutes and completed actions separately and honestly, with stable milestone identity and unfinished tags. Do not claim scientifically measured attention, dopamine or life growth. Exact route geometry and time-to-distance mapping remain undecided.

Recommend important neglected work using an explainable combination of importance, elapsed neglect and remaining actions. Define weights, aging origin, thresholds and ties before implementation; never silently replace active work. A completed subtask qualifies a productive day. Extra completions may strengthen the streak icon. Missed calendar days remain blank; three consecutive missed days break the streak, while one or two do not. Define timezone, grace display, correction and visual tier rules explicitly. Returning after a break should feel hopeful.

## Reminders and browser support

Requested reminders concern important neglected work during morning/daytime, while using another tab and after Trail is closed. Obtain opt-in and permission, define quiet hours and frequency, cancel stale reminders and verify actual delivery. Page timers cannot satisfy the closed-site requirement. Provider, neglect thresholds and infrastructure remain open. A slim optional floating focus strip may use supported browser capability; provide a graceful fallback. Chrome on MacBook Pro is the primary target. Comet, physical devices, sleep and background behaviour need separate evidence.

## Quality acceptance

Use minimal composition, legible hierarchy, coherent light/dark styling and selective composed gradients inspired by Stripe and Linear. Validate long text, empty state, mobile controls, keyboard access, reduced motion, storage failure, reload recovery, repeated completion and Undo. Demo data must remain clearly fictional and separate from user records. Do not advertise unimplemented AI, reminders or persistence.

## Current implementation boundary

The local day-build, return fixes and bounded mountain passes implement manual goal/actions, focus/pause/explicit return, optional saved work references, transactional local storage, tab ownership, completion/limited Undo/review/history, guarded reopening and action-state route/marker presentation. Fictional examples remain separate. Daily effort-to-route mapping, priority scoring, streak rules, AI, push delivery, sync and floating browser windows remain future work. Passing local tests is not physical-device, deployment or user product acceptance. See CLOUD_COMPLETION_EVIDENCE.md and the dated earlier evidence.
