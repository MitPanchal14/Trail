# Trail — submission draft

Prepared 25 October 2026; recording positioning revised after the research follow-up. Local draft, not submitted. Replace unresolved links/provenance only with verified facts. The text below describes implemented behavior; the final recording and public source must match the frozen version.

## Short pitch

Keep your place in unfinished work. Trail saves a concrete next move, context and reference so you can return knowing where to begin.

## Inspiration and problem

A task title can tell you what remains without telling you how to restart. After an interruption, the useful detail may be the next sentence to write, a decision still open, or the page you need beside you. Trail is built around keeping that place, with a small mountain journey that follows deliberate completions.

The demonstration follows one staged community-workshop update: in Next steps, paragraph 2, add the room-booking owner and decide whether to announce 20 places before the booking is confirmed. It makes the return problem visible without claiming actual volunteer use. Friend/public trials were intentionally skipped for this demo; no user-validation result is claimed.

The same situation can arise while preparing an update, writing an assignment or planning a personal project. These are possible uses, not claims that every audience has been tested.

## What it does

Optional new-goal setup uses typed/pasted text or the user's device dictation (device-dependent, not activated by Trail). Generate a suggestion with Gemini, review/edit actions and estimates, apply to editable manual fields, then explicitly Save goal and Start separately. Manual creation works without AI. The current website does not record/transcribe audio. Retained unused audio helper/renderer and transcription endpoint are infrastructure, not a current product feature. Estimates/deadline text guide suggestions, not guaranteed schedules or recorded effort.

Create one open goal, define what finished means and choose ordered actions. Start focus explicitly. Pause to save a next move, optional context and one work link. Return to the saved instruction, open the reference when you want, and choose Resume separately.

First-use Try a saved place opens a clearly isolated, stopped fictional example without adding real work. Copy saved place in real Today or Focus produces a full plain-text handoff from committed values, with manual-copy fallback if clipboard access fails. It is a copy convenience, not sync or backup. End focus block lets stopped work remain unfinished while freeing valid replanning; a later Start is a fresh explicit block.

Actions are checked through an explicit completion. A small circular progress marker travels along the existing mountain route after a successful save; a useful saved place with timing stopped becomes a campsite. Checking all actions opens review. Confirming the goal finished earns the summit and keeps a compact goal card with decorative white outline art in local history, not another progress chart. Limited Undo and guarded reopening let you correct outcomes while preserving recorded effort.

The route illustrates action states. It does not measure distance, attention or productivity. Opening a work link does not start focus or tell Trail what happened on that page.

## What makes this approach distinctive

Trail brings a concrete return instruction, optional reference, explicit focus control and an outcome-driven mountain into one small workflow. The campsite means a useful place was saved with timing stopped; checked actions and confirmed goal finish remain separate states. Existing task/focus tools also offer notes, timers and visual rewards. The claim here is the particular experience demonstrated, not that Trail invented those features or has proven better outcomes.

## How it was built

One application uses browser JavaScript modules, HTML/CSS and custom SVG terrain, with nine allowlisted public assets and no application package dependencies. Node serves the optional server-only Gemini text proxy; static-only hosting cannot provide AI. Server credentials never belong in browser assets. A canonical transition engine validates goals/actions/sessions/notes/events. IndexedDB commits before publishing successful state; Web Locks gives one writer and operation receipts make Retry idempotent. Public-host abuse/cost controls and final-origin verification remain pending.

The latest local increments add explicit saved-text removal (blank/Skip still preserve), twelve named browser-local months with accessible date selection and on-demand exact day tasks, current/best streaks and highest/next 1/5/10/25 milestone. A compact two-column desktop/one-column phone archive starts newest eight + Show more; titles open full read-only saved work dialogs. Optional goal Priority changes explicit label/card palette only (Low/Normal/Important), not action order or urgency scoring. Currently checked actions alone count, including corrections; this is not external tracking or proof of attention/productivity.

Home explains the productivity/focus benefit and exposes a labelled ready-made demo panel even for returning users. Shared fictional year/archive/gallery remain in memory and never become real records; simulated timing and correction/link-editor limitations are explicit. The scoped dark Focus surface is implemented locally. Independent review of the latest AI pass, user acceptance, native/device checks, publication, video recording and submission remain pending; local examples/tests do not establish them.

Timing uses conservative wall/monotonic checks. Uncertain gaps and reopening require explicit Resume, with no unverified away-time credit. Fictional examples are labelled and kept outside the real records. Animation updates only presentation and can be cancelled without changing outcomes.

## Challenges and decisions

The main design decision was to put the saved next move before the progress graphic. A useful return can be a short instruction or a link; an empty saved record should not imply that a thought was preserved. Long notes need full text without burying the controls.

Reliability matters at the moment of interruption. Failed saves keep their draft and exact Retry. Completion must not celebrate before a durable commit. Undo must retain effort and context, including when it interrupts movement. All checked and explicitly finished remain separate decisions.

The visual response also needed restraint: one expedition on the existing path, existing checks left visible, a stopped campsite and a summit only after confirmation. The user's acceptance of the current terrain does not establish acceptance of the new transition.

## Actual accomplishments

The local prototype supports the complete create → focus → save place → reload → explicit Resume → complete → review → finish → revisit loop. It includes local storage, writer ownership, guarded corrections, safe optional references, bounded long-note controls and a cancellable travelling marker/campsite presentation.

Consult AI_SIMPLIFY_EVIDENCE.md for the latest actual test count/results and current UI capture paths; earlier counts are dated checkpoints, not current guarantees. Mocked browser checks and unit tests do not establish human usefulness, physical-device/dictation behavior, user acceptance or hosted readiness.

## Lessons

Completion, saved context and effort need distinct meanings. A return note can be valuable without earning a checkpoint, and a finished-looking route should not decide that the goal is finished. Keeping those rules explicit made the illustration easier to attach without giving it authority over the work.

## Future work

Observe real interruption/return use, verify physical Chrome/Mac/phone and device dictation, then consider backup/sync only with a recovery design. AI text planning is implemented locally; reminders, website audio capture and extra mountain themes are not current product features.

## Known limits

Records are browser/origin-local; clearing site data can lose them. No sync, import/restore, account, notifications or external activity capture. Optional AI sends explicitly supplied text to Gemini through the Node server; it can be wrong and requires review. No website audio recording/transcription UI. Timing is conservative with possible uncommitted-tail loss. Physical sleep/background/phone/device dictation, user visual acceptance, final deployment URL and public video remain pending.

## Submission fields to finish — internal notes, remove from public description

| Field/decision | Current evidence / required action |
| --- | --- |
| Public source / Try it out | Local work is on `codex/trail-redesign`, reviewed baseline `2d53bc1` plus uncommitted changes. No source checkpoint/public access was published or freshly verified in this pass. Prior connector metadata is historical. User must authorize and verify public access to the accepted current source rather than assume main contains it. |
| Hosted app | No final origin selected/verified. Follow DEPLOYMENT_PREFLIGHT.md after user authorization. Do not invent a demo URL. |
| Video | Script only; record/upload, verify public YouTube/Vimeo access and actual duration. |
| Recording reference | Pending user-owned document/section URL. example.com is a labelled rehearsal placeholder, not evidence of real work. No external document created/published. |
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
