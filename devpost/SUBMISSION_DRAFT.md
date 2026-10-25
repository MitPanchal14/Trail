# Trail — submission draft

Prepared 25 October 2026; recording positioning revised after the research follow-up. Local draft, not submitted. Replace unresolved links/provenance only with verified facts. The text below describes implemented behavior; the final recording and public source must match the frozen version.

## Short pitch

Keep your place in unfinished work. Trail saves a concrete next move, context and reference so you can return knowing where to begin.

## Inspiration and problem

A task title can tell you what remains without telling you how to restart. After an interruption, the useful detail may be the next sentence to write, a decision still open, or the page you need beside you. Trail is built around keeping that place, with a small mountain journey that follows deliberate completions.

The demonstration follows one staged community-workshop update: activities and volunteer roles are drafted, but the next move is to add who will confirm the room booking. It makes the return problem visible without claiming actual volunteer use.

The same situation can arise while preparing an update, writing an assignment or planning a personal project. These are possible uses, not claims that every audience has been tested.

## What it does

Create one open goal, define what finished means and choose ordered actions. Start focus explicitly. Pause to save a next move, optional context and one work link. Return to the saved instruction, open the reference when you want, and choose Resume separately.

Actions are checked through an explicit completion. The expedition marker travels along the existing mountain route after a successful save; a useful saved place with timing stopped becomes a campsite. Checking all actions opens review. Confirming the goal finished earns the summit and keeps the mountain in local history. Limited Undo and guarded reopening let you correct outcomes while preserving recorded effort.

The route illustrates action states. It does not measure distance, attention or productivity. Opening a work link does not start focus or tell Trail what happened on that page.

## What makes this approach distinctive

Trail brings a concrete return instruction, optional reference, explicit focus control and an outcome-driven mountain into one small workflow. The campsite means a useful place was saved with timing stopped; checked actions and confirmed goal finish remain separate states. Existing task/focus tools also offer notes, timers and visual rewards. The claim here is the particular experience demonstrated, not that Trail invented those features or has proven better outcomes.

## How it was built

One static application uses browser JavaScript modules, HTML and CSS with custom SVG terrain. Node20+ serves/builds seven allowlisted assets; the application has no package dependencies or backend. A canonical transition engine validates goals, actions, sessions, notes and events. IndexedDB commits publish successful state only after the transaction completes. Web Locks gives one tab writer ownership. Exact operation receipts make retries idempotent.

Timing uses conservative wall/monotonic checks. Uncertain gaps and reopening require explicit Resume, with no unverified away-time credit. Fictional examples are labelled and kept outside the real records. Animation updates only presentation and can be cancelled without changing outcomes.

## Challenges and decisions

The main design decision was to put the saved next move before the progress graphic. A useful return can be a short instruction or a link; an empty saved record should not imply that a thought was preserved. Long notes need full text without burying the controls.

Reliability matters at the moment of interruption. Failed saves keep their draft and exact Retry. Completion must not celebrate before a durable commit. Undo must retain effort and context, including when it interrupts movement. All checked and explicitly finished remain separate decisions.

The visual response also needed restraint: one expedition on the existing path, existing checks left visible, a stopped campsite and a summit only after confirmation. The user's acceptance of the current terrain does not establish acceptance of the new transition.

## Actual accomplishments

The local prototype supports the complete create → focus → save place → reload → explicit Resume → complete → review → finish → revisit loop. It includes local storage, writer ownership, guarded corrections, safe optional references, bounded long-note controls and a cancellable travelling marker/campsite presentation.

The existing 22 Node tests pass after this pass's runtime changes. Focused Chromium gates cover the marker, write failures/Retry, Undo/navigation and motion cancellation. See CLOUD_COMPLETION_EVIDENCE.md for the final combined browser result and captures; do not substitute this draft for that evidence. Scripted acceptance is not evidence of human usefulness or physical sleep/background behavior.

## Lessons

Completion, saved context and effort need distinct meanings. A return note can be valuable without earning a checkpoint, and a finished-looking route should not decide that the goal is finished. Keeping those rules explicit made the illustration easier to attach without giving it authority over the work.

## Future work

Observe real interruption/return use and revise the experience around actual confusion. Verify physical Chrome/Mac and phone behavior. Consider export/backup and sync only with an explicit data/recovery design. Reminders, streaks, audio, AI planning and extra mountain themes remain ideas, not current features.

## Known limits

Records are local to a browser and origin; clearing site data can lose them. There is no sync, import/restore, account, backend, AI, notification service or external activity capture. Timing is conservative recorded effort, with bounded detectable gaps and possible loss of the last uncommitted tail. Physical sleep/wake, unrestricted background behavior and phone hardware remain unverified. The travelling marker has no human visual acceptance yet.

## Submission fields to finish — internal notes, remove from public description

| Field/decision | Current evidence / required action |
| --- | --- |
| Public source / Try it out | Connector reports `MitPanchal14/Trail` **private**, default branch `main`; current implementation source is `codex/trail-redesign` at `041fe89…` plus this cloud diff. No new source checkpoint published. User must authorize source checkpoint/public access and ensure judges reach current source, not old main. |
| Hosted app | No final origin selected/verified. Follow DEPLOYMENT_PREFLIGHT.md after user authorization. Do not invent a demo URL. |
| Video | Script only; record/upload, verify public YouTube/Vimeo access and actual duration. |
| License | No root license found; GitHub reports no detected license. User chooses; no license added. Skill Pack's upstream MIT license does not automatically license Trail. |
| Skill Pack use | `skills-lock.json` identifies `challengepost/learn-ai-basics`, six installed stages, and scope/prd/spec exist. Actual step invocation/interview provenance remains unverified. User supplies a truthful concrete account before final wording. |
| Project history | Existing Git history predates this cloud pass and includes removed UI/checkpoint work. Disclose incorporated pre-existing work as applicable; user confirms creation dates/eligibility. Do not imply all work was created in this hour or rewrite history. |
| Eligibility confirmation | User alone reviews/answers the age-of-majority and other eligibility declarations. No attestation made by this task. |

Provenance-safe planning explanation until the user confirms actual Skill Pack steps: **“The repository includes the Devpost Learn Skill Pack installation metadata and scope, PRD and specification documents. Those documents record the one-goal boundary, explicit return behavior and conservative timing/storage contract. I still need to confirm the exact Skill Pack steps used to create them before describing that process.”** This flags a gap; it is not a completed eligibility claim. Installed folders alone are insufficient evidence of use.

## Official requirements checked 25 October 2026

[Official rules](https://learn-ai-basics.devpost.com/rules): a new Skill-Pack-built working end-to-end project, scope/prd/spec in public source with run instructions, English materials and a public YouTube/Vimeo demonstration; video should be under three minutes and an open-source license is recommended. Disclose incorporated prior work. The listed submission cutoff converts to **27 October 2026, 02:30 IST**; this does not extend today's requested work budget.

[Submission-form update](https://learn-ai-basics.devpost.com/updates/46821-two-new-questions-on-the-submission-form): required Skill Pack explanation and age-of-majority confirmation; public repository link goes in **Try it out**. The authenticated final form itself was not opened; the user must review all live fields before submission. [Updates](https://learn-ai-basics.devpost.com/updates) was inspected; do not infer eligibility from these drafts.

## Research follow-up — internal recording note

Use the revised VIDEO_SCRIPT.md and DEMO_WALKTHROUGH.md: saved-place benefit in the opening 8 seconds, realistic staged workshop content and actual return sequence before one minute. The research report compares first-party competitor documentation and official organizer guidance. It proposes a human observation protocol, but no human outcomes were collected. Do not add science/attention/productivity claims from that background research. The earlier completion ZIP contains the prior drafts; current source documents supersede them.
