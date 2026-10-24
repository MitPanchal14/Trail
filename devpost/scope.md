---
doc: scope
status: approved
---

# Trail — Revised scope

Approved by the learner on October 24, 2026. This revision supersedes the previous scope. It describes intended behaviour, not completed implementation. The existing PRD, spec and checklist require revision before implementing this direction.

Trail helps someone start and return to difficult work with little administration, while making accumulated effort visible as a journey.

## The Unique Kernel

Open Trail and immediately find the next action. Enter a calm focus session, leave a short return instruction if useful, and resume later without reconstructing your place. Daily routes and lasting goal landscapes make the work behind that journey visible and rewarding to revisit.

## Who It's For

A student or independent builder doing research, studying, writing or coding across multiple sessions, who finds starting and reconstructing unfinished work difficult. The first test is the learner's own real work, followed by a small number of reachable users.

## The Core Loop

1. Open Trail: the next action is the first visual priority, with saved context and an explicit Start/Resume.
2. Choose or create work. Manual planning remains possible; AI can suggest editable actions from supplied context.
3. Start focus. Leave Trail open while working in another tab or application. A calm focus view records the active session.
4. Pause immediately, or explicitly complete the action. An optional short “When I'm back…” instruction preserves the next move; explaining why you stopped is optional.
5. Return to the saved instruction and Resume. Without a note, restore the known task and action; do not invent context.
6. Revisit the daily route and larger-goal landscape to see recorded effort and completed milestones accumulate.

## Inspiration & Identity

Strava's activity maps inspire a satisfying visual record of ground covered: https://www.strava.com/. This is an analogy, not a literal location map or a requirement to copy its design.

Confirmed visual refinement, October 24: the learner rejects the current pixel-art mountain and graphical presentation entirely. Strong references are Stripe (https://stripe.com/) and Linear (https://linear.app/): light/white surfaces, dark readable text, minimal clutter, selective colour, purposeful bento grouping and restrained dimensional interaction. The next action takes priority over scenery and metrics. A new graphical language must make route movement, glow and meaningful landmarks tangible. Useful behaviour and personal records remain independent of visual replacement. Exact composition, graphical metaphor and reward mapping require PRD/design review; see the revision ledger and design brief in devpost/replan-2026-10-24/.

## Why This Matters

The learner wants Trail to feel like a helping hand, with almost no hassle to update. They want to return without thinking “where did I stop?” and see work contributing to something meaningful. Supporting real work is the first priority.

## What Working Looks Like

Choose one real task, start focus, work elsewhere, pause with an optional short instruction, then reopen Trail. The saved next action is immediately findable and can be resumed. Explicit completion adds a recognizable checkpoint; recorded focus effort remains visible separately. The daily journey and larger goal both retain an understandable history.

Observe whether people can start, pause and resume without guidance, how much administration updates require, and whether the visual record is understandable and worth revisiting. These observations do not establish improved productivity, attention or a biological reward effect.

## Approved POC Boundary

- Continue in the existing repository, preserving useful behaviour and records. Retaining the code does not require retaining the current layout.
- One coherent choose/start/pause/return/complete experience, with optional editable AI assistance.
- Daily route and persistent goal landscape: focus time and completion both contribute, but effort and accomplishment remain distinguishable. Exact mappings need a PRD decision; timer expiry never implies completion and absence earns no focus time.
- Calm focus screen and, where supported and feasible within the deadline, an optional slim floating strip containing a compact task label, timer and pause control. The normal focus experience remains usable independently. Feasibility research is not implementation evidence.
- Meaningful visual feedback tied to real recorded events. Latest refinement: a welcoming saved-place feeling for unfinished work and expressive completion celebration with a beautiful colour transition and route update. Exact effects, celebration hierarchy and landmark rules remain open.
- Persistent saved context and progress, with a clear explanation of storage and AI data handling.

## Confirmed Refinement — Automatic Return Reminders

October 24 clarification: automatically remind users when important work has been neglected, in the morning/daytime, while they work in another tab and after Trail is closed. This is intended behaviour, not an existing implementation. Exact neglect threshold, time/window, frequency, active-focus suppression, browser support and minimal remote reminder data require the PRD/technical contract. Permission must be an explicit opt-in; phone calls are not an agreed feature.

## Later / Unresolved for This Submission

Occasional meaningful encouragement is requested, with a quiet, optional treatment proposed for review. Its frequency and inclusion remain open. The optional floating strip retains its feasibility boundary; it is separate from confirmed background reminders.

## Explicitly Cut

- Automatic observation of external work: the learner clarified that Trail records a chosen focus session rather than monitoring other apps.
- Required pause explanations or mandatory AI processing: these would add friction to stopping and returning.
- A large floating dashboard: the learner wants a narrow, unobtrusive reminder.
- Claims that elapsed time proves useful work or that the landscape measures personal worth: records represent user-reported effort and accomplishment.

Accounts, sync, sharing and a framework migration have not been authorized as revision requirements.
