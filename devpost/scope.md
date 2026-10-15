---
doc: scope
status: approved
---

# Work Trail — working title

A personal web app that turns today's work into manageable actions, records a visible trail of effort, and helps you resume unfinished work with context.

## Document Purpose and Decision Status

This document carries the product context into another coding agent, including OpenCode, without requiring the conversation history. It describes the problem, intended experience, proposed first-version boundary, and ideas deferred for later. It is a scope document, not a complete UI specification or implementation plan.

**Status: approved.** The user approved this scope after requesting the expanded handoff. The first-version boundary and deferrals are agreed. UI representations explicitly labeled as proposals remain candidates for PRD review; scope approval does not settle their precise visual treatment or the technical choices listed as open.

The canonical planning sequence is `scope.md` → `prd.md` → `spec.md` → `checklist.md`. The PRD will settle screens, interactions, and behavior; the spec will settle technical choices. Read the actual files that exist and their statuses before starting work. A missing downstream document is an unresolved planning stage, not permission to invent the decisions silently. `scope.html` is a visual review companion; this Markdown file remains canonical.

## The Problem We Are Exploring

The first user's reported difficulty has several stages:

- A large or unfamiliar task creates uncertainty about how to start.
- Learning something difficult can consume the energy needed to apply it. Understanding an explanation does not reliably lead back to the work.
- Planning the next day can become a stopping point rather than a commitment that results in action.
- Interruptions and longer gaps make the task harder to resume because its context has faded.
- Recording unfinished work can feel shameful, creating a reason to avoid tracking precisely when a useful return point is needed.

These are interview observations, not a diagnosis or evidence about all users. The product hypothesis is that small next actions, low-effort context capture, and a satisfying record of work can make starting and returning easier. We need to test that hypothesis rather than assume an attractive dashboard solves procrastination.

## The Unique Kernel

The combination of a visible work trail and **Save my place**: when difficult work is interrupted, retain the current action and a short optional context note; on return, put that context and a concrete next action first. Progress should make returning inviting without making unfinished work shameful.

This is a differentiation hypothesis, not a claim of market novelty or a proven treatment for procrastination.

## Who It's For

The learner is the first test user: a startup founder working on a challenging research project who can plan and seek explanations, but struggles to begin applying them and return after interruptions. Today, they use ChatGPT for explanations and make plans, then sometimes leave the work; longer gaps mean losing context.

People facing similar difficulties are a possible later audience. Their needs and demand have not been validated.

## The Core Loop

1. At the start of the day, enter today's tasks and brief context about available time and how busy the day is.
2. AI suggests manageable steps and a day plan that the user can review and adjust.
3. Open the dashboard to one next action and a way to commit to starting it. Keep the trail prominent; the full plan is secondary.
4. Do the work outside the app. Record completion, or tap **Save my place** to retain the current step and optionally note where work stopped or what is unclear.
5. See the trail reflect the reported activity. On return, see saved context and the next action; unfinished work remains available across days.

The reason to return is to see concrete past effort and know how to continue. Check-ins should take at most 20–30 seconds, preferably less.

## Experience Intent and Functional Responsibilities

### 1. Plan the day without making planning another project

The user wants to open the app at the start of the day and enter the tasks they intend to work on. They may add a short description of the day: hectic, busy, or relatively free, plus available time. They can return multiple times during the day as work progresses.

AI-assisted breakdown is meant to remove the effort of composing every subtask manually. The suggested plan should use the supplied tasks and constraints, be understandable, and remain adjustable by the user. Avoid turning one intimidating task into a long, equally intimidating checklist. The number and size of steps, editing behavior, and planning controls will be specified in the PRD.

Recurring routines were requested as a possible source of repeated tasks. They are proposed for a later version, rather than implicitly included in the first build.

### 2. Make the next action the easiest thing to find

The user explicitly chose the next task and commitment to it as the first dashboard priority. The whole day's plan should remain accessible as a secondary view, such as below the primary content or in a compact timeline; the precise arrangement is undecided.

The next action should describe something the user can do, not only a broad aspiration such as “understand the field.” The product should help move from deciding to acting. Exact commitment controls, step-selection logic, and handling of several tasks belong in the PRD.

The user originally wanted the trail to be the first thing seen, then clarified that the next task should lead the dashboard. Preserve both intentions by making the next action primary and keeping the trail prominent in the opening view; resolve the layout during UI planning.

### 3. Support work happening outside the app

The actual task may involve reading papers, writing, contacting people, or using other tools. This app organizes and records that work; it does not perform or automatically observe it. The user mentioned checking the current task and time without navigating back through the full planning flow. A lightweight session/time record is proposed, but timer modes and controls remain undecided.

A floating widget could reduce navigation friction, but a real desktop overlay is a separate platform capability. Do not silently promise it through a normal web page or treat a decorative on-page panel as the requested desktop widget.

### 4. Record completion or save a place with minimal effort

The user said 20–30 seconds is acceptable for recording, and shorter is preferable. Longer recording would become distracting. A completion check-in should therefore be lightweight; elaborate journaling, mandatory evidence uploads, or long questionnaires are not part of this proposed experiment.

For unfinished work, the user explicitly said they would tap **Save my place** because revisiting and completing the task matters to them. The proposed action retains the current step and offers an optional brief note about where work stopped or what was difficult. The optional note is a design proposal; exact fields are not approved yet.

Pausing must be represented neutrally. The user wants useful records of unfinished work without feeling punished for admitting it. Keep unfinished work available rather than requiring a false completion to receive positive feedback.

### 5. Return with enough context to act

When the user returns to an unfinished task, they want to know where they left off and the very next step. Preserve supplied context across visits and days. Show the current step even if no note was added. If the user never saved additional context, the app must not manufacture an account of their external work.

An AI-suggested smaller next step may be useful when a blocker is recorded, but its behavior and boundaries need a PRD decision. Saving a place and actually reducing the next-action uncertainty are distinct responsibilities; neither should be assumed to solve the other automatically.

## Inspiration & Identity

[Strava](https://www.strava.com/) inspires revisitable activity records, visible progress, and a route that makes effort tangible. This trail represents self-reported work, not geographic movement or verified productivity. The next action is the dashboard's first priority, with the trail visible alongside it and the broader day plan below or compact.

Use an encouraging tone, keep personal progress private by default, and avoid excessive pop-ups. The exact visual style will be decided in the PRD; sharing templates are inspiration for later.

## The Trail's Purpose and Meaning

**User-stated requirement:** depict progress in a useful, positive manner that motivates revisiting work. The user values Strava because they can record activity, return to it later, and see concrete improvement. The desired analogue is a revisitable record of work, not a route generated independently of work.

The trail should help answer three questions: “What have I moved forward?”, “Where did I leave off?”, and “Where can I continue?” It should remain connected to recorded actions and context. A decorative line that grows without useful information would not meet this intent.

**Proposed representation for later UI review:** completed actions could become named, inspectable checkpoints; the current action could have an active marker; and Save my place could leave a distinct resting marker. Opening a checkpoint could reveal what was completed and its recorded context. This is a conceptual proposal, not an approved layout or art direction.

The user suggested combining checkboxes and time to develop the trail. The exact combination is unresolved. Completion, recorded effort, and pauses should remain distinguishable so the app does not imply that time alone proves accomplishment. No XP formula, productivity score, level system, or competitive ranking has been agreed.

**Proposed positive feedback principles:** preserve past effort when work pauses or days are quiet; avoid punitive resets, shame-based messages, or broken-streak warnings; make completion feel satisfying without interrupting the work. The trail needs meaningful empty, first-progress, and accumulated-progress states. Whether to use a landscape, pixel art, other illustration, animations, or a particular palette belongs in the PRD. The HTML sketch is illustrative and should not become the build design by default.

Motivating the user to do more is the hoped-for effect, not a verified result. Trail growth must have an explainable relationship to user records, and the history must remain readable as it grows.

## Why This Matters to the Learner

“I want to deploy this project.” Helping someone with similar difficulties would be “a big win for me.” The immediate stake is making it easier to return to their own research work and revisit progress, while shipping a first live web project for the hackathon.

## What "Working" Looks Like

On the deployed app, enter a real research task and today's time constraints, review suggested steps, start one, then save its place with a brief note. Reload or revisit the app: it still shows where work stopped and a clear action to resume. Complete an action and see a corresponding entry in the trail that can be revisited.

The memorable demo moment is leaving a difficult task and returning to a contextual invitation to continue, with previous effort still visible. Demonstrate this end to end in the hackathon video and provide the public source repository with planning documents.

Test the loop on the learner's actual work. Verify persistence and whether a check-in fits the 30-second limit. Record whether the learner actually resumes after a pause; a successful demo alone does not establish better consistency.

### Demonstrable Success Versus Behavioral Success

The first working version should demonstrate:

- A task and day constraints can be entered and reviewed.
- Suggested steps can be reviewed and adjusted, with one concrete action ready to start.
- A completed action appears in the work history/trail without a long recording process.
- An unfinished action and its supplied context survive a revisit or reload.
- Returning makes the saved place and next action easy to locate.
- Recorded completion, time, and pauses can be understood without misleading labels.
- The deployed app supports the same core loop demonstrated locally.

Personal testing should separately investigate whether the user actually records pauses, whether recording stays within 30 seconds, and whether they return and resume real work. Record observations honestly. Do not turn a few sessions into claims about improved productivity for a broad audience.

## The POC Boundary

Proposed first version: one person's daily planning, editable AI-suggested small steps, one current action, lightweight session/time recording, completion and Save my place, saved context, a revisitable work trail, and persistence across visits. Include deployment as the learner's explicit goal.

AI suggests steps from supplied context; it cannot observe the external research or infer missing progress. Preserve current context even when a pause note is omitted. Distinguish completed work, time spent, and paused work; exact trail rules and metrics belong in the PRD. API provider and storage choices belong in the technical spec.

### AI and Data Boundaries

The user mentioned Gemini as a possible API for breaking down tasks and tailoring a day plan. It is a candidate, not a selected integration. Planning must settle cost, provider, request behavior, and failure handling before implementation. Never present a template or fabricated response as a successful live AI call.

Private-by-default progress means no public sharing without user action. It does not establish a storage architecture or guarantee that AI requests stay on the device. Decide storage, accounts, sync, and what data is sent to the provider in the technical spec; keep the user informed. No authentication system or cloud backend has been selected yet.

Persistence is required at the product level because revisiting work is the core idea. Whether it is initially browser-local or server-backed remains open. Explain any implications for device changes or cleared browser data rather than assuming cross-device continuity.

## Later

- Recurring routines and richer automatic daily scheduling: useful, but add planning complexity before the basic work-and-return loop is tested.
- Desktop/floating widget: potentially reduces navigation friction; defer platform integration for this first web deployment.
- Optional sharing cards: the learner values some sharing but would not share everything; private progress is sufficient for the experiment.
- Broader audience testing and tailoring: first establish whether the learner uses the core experience on real work.

## Explicitly Cut

- Full research tutoring, literature review generation, and novelty assessment: different products from recording and resuming work; the learner already seeks explanations elsewhere.
- Automatic observation of work in other apps and claims of verified productivity: the experiment relies on user reports and supplied context.
- Social feeds, competitive leaderboards, and aggressive reminders: unnecessary for the private loop and risk distraction or shame.

## Decisions Still to Make

The title is provisional. Resolve these in the next planning stages:

**PRD — product and interface:** task entry and editing; constraints used by the plan; subtask size and selection; the commitment action; completion and pause controls; optional-note behavior; saved-place presentation; next-step handling when blocked; fallback if the user leaves without saving; time recording; trail growth and interpretation; daily versus longer-term history; and the visual style, responsive layout, and feedback states.

**Spec — implementation:** framework, persistence model, accounts if needed, AI provider and credential handling, latency/error behavior, hosting, deployment, and appropriate checks. Explain unfamiliar backend and shipping choices because this is the learner's first deployment.

These choices must support the agreed boundary. Additions such as routines, widgets, or social features require an explicit scope revision rather than appearing as routine implementation decisions.

## Handoff to OpenCode and Later Building Agents

The user's intended workflow is to plan with 6.1 Sol, then use OpenCode with 6 Luna at medium or lower effort for implementation. This is a tool preference, not evidence that a particular model can complete the whole product unaided.

Before building, read this scope, the approved PRD and spec when available, the build checklist, and the relevant installed skill instructions. The local curriculum is available under `.agents/skills/`; do not assume another tool loads it automatically. Explicitly ensure OpenCode discovers the instructions and reads the planning files.

Implement one complete user flow at a time against written acceptance criteria, verify it in the browser, and carry forward the actual build state. Escalate unresolved product or architectural decisions for clarification rather than inventing them. The user intends to bring difficult bugs and milestone reviews back to Sol. Deploy a minimal working loop early enough to expose hosting problems before final polish.

Do not recreate personal interview material in public product copy. `learner-profile.md` supplies private collaboration context and is ignored by Git; this scope contains only context useful for the public project. Earlier experiments outside this folder are not implementation progress here. Assess any reuse against hackathon requirements before incorporating it.

The learner's first-deployment goal and eight-day target remain part of planning. Recheck the live hackathon requirements before submission. Prepare the required public repository and functioning demo; model choice and a polished plan are not substitutes for showing the actual product working.
