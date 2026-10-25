# Trail: critical product review and delivery order

25 October 2026. Local source inspected at 041fe89 with pre-existing planning edits. Cloud branch 24b7126 was fetched and imported; runtime/tests exactly match the original cloud bundle. Independent full Chromium verification passed all ten gates; user acceptance remains pending. Research is from primary product documentation, research institutions and official event materials; competitor products were not personally usability-tested.

## Verdict

Trail is a functional, carefully guarded prototype. Its weakest part is the reason to adopt it. A timer, next-action note, work link and mountain do not establish a novel product by themselves. The product has not yet demonstrated that its return experience is worth the effort of maintaining another tool. More rewards, streaks or AI would not resolve that question.

The defensible submission is a deliberately small interruption-and-return companion: preserve an actionable instruction, show exactly where work stopped, open the relevant resource, and resume deliberately. The mountain can make that relationship memorable if the campsite communicates a saved place. It cannot substitute for the relationship.

No evidence supports a win prediction, dopamine claim, productivity percentage or claim that Trail is better than established alternatives. Automated reliability evidence is useful but does not prove adoption or user value.

## What the judging actually rewards

The official rules specify four equally weighted criteria: Design (complete/coherent experience), Potential Impact (credible specific problem/audience and demonstrated solution), Innovation/Idea (novelty and distinction), and Presentation (clear end-to-end demonstration). The overview page lists only three; the rules include Potential Impact and are the basis for this review. There is no separately listed technical-complexity criterion. It would be a mistake to spend the remaining window adding infrastructure principally to appear more sophisticated.

The organizer's written review recap recommends immediate purpose, easy judge access, realistic content, distinctive design, a working demonstration and public planning documents matching the implementation. I read the recap, not the linked recording.

Sources: [criteria](https://learn-ai-basics.devpost.com/), [official review recap](https://learn-ai-basics.devpost.com/updates/47209-will-it-ship-recording-is-up), [rules](https://learn-ai-basics.devpost.com/rules).

Rules require a new software project using the Devpost Learn Skill Pack, an end-to-end working function, generated scope/prd/spec documents, a public source repository and demo video. Verify project history and actual Skill Pack use; installed skill files alone do not prove their use. Do not fabricate a clean origin story. A license is a sensible publication decision, not an additional requirement asserted by this report. A deployed web link helps access; the rules' public repository/video requirement still matters.

## Competitive reality

| Alternative | Existing capability from first-party documentation | Implication for Trail |
| --- | --- | --- |
| A note in the work document plus a bookmark | This is the practical baseline we should test, not a measured competitor claim. It keeps instructions beside the work. | Trail must earn the extra app switch. A persuasive demo should expose an unresolved decision, not merely display a task title twice. |
| Amazing Marvin | Task/project notes, sequential projects, time tracking and completed-project context are documented. | Notes plus ordered actions are not a defensible novelty claim. |
| Session | Focus sessions, distraction blocking and session-related reflection/notes are documented. | A polished focus screen is insufficient differentiation. |
| Pieces | Its documented memory engine captures workflow context and supports contextual search. | Even 'remember where you stopped' is an existing category. Trail's opportunity is a small, deliberate, understandable manual handoff without automatic capture. |
| Forest | Nature-based focus rewards and visible accumulated work are established product ideas. | A mountain alone changes the metaphor, not the underlying proposition. |

Sources: [Marvin notes](https://help.amazingmarvin.com/amazing-marvin/task-and-project-notes), [Marvin projects](https://help.amazingmarvin.com/amazing-marvin/working-with-projects), [Session](https://www.stayinsession.com/), [Session changelog](https://stayinsession.com/changelog), [Pieces memory](https://docs.pieces.app/products/desktop/configuration/long-term-memory), [Forest](https://www.forestapp.cc/).

These comparisons do not establish that competitors lack Trail's exact loop. Avoid unsupported 'first', 'only' or 'unique' claims.

## Research that challenges our assumptions

University of Washington Bothell describes ready-to-resume notes as a strategy for interrupted work: record the current place and intended next action. This supports a concrete capture prompt; it does not validate this particular website or its mountain.

Microsoft Research's CHI 2010 work compared automated programming-context cues with note-taking and found benefits for the cues in its lab setting. That is a warning against assuming a typed note solves all resumption problems. Trail currently relies on people noticing an interruption, switching to Trail and writing something useful. Sudden interruptions or forgotten capture remain a real limitation. We should disclose it rather than rush in an unverified automatic-capture system.

Sources: [UW Bothell](https://www.uwb.edu/news/2021/02/24/pandemic-interruptions-multitasking), [Microsoft Research](https://www.microsoft.com/en-us/research/publication/evaluating-cues-for-resuming-interrupted-programming-tasks/). Neither study measures Trail or establishes broad-audience benefits.

## Findings in priority order

### 1. Submission access and truthful provenance — delivery blocker until verified

Cloud changes are now committed on the verified working branch 24b7126 and imported locally. Current public access and the final hosted origin still need verification. The newest app cannot be reviewed from an old public URL or inferred from a passing cloud test log.

Next: import both bundles safely, inspect diffs, independently verify the merged build, settle the source/checkpoint and deployment with user authorization, then test the public origin in a fresh browser. Check repository visibility and Skill Pack provenance directly. Record exactly which revision the video and deployment use.

Acceptance: a reviewer can obtain the current source, follow working run instructions, find scope/prd/spec and access the depicted app. The video, source and hosted build agree. No local/cloud/published conflation.

### 2. Initial screen sells a general task app — high impact

The local real-mode lead begins 'Choose one goal. Take one small step.' The dominant heading is 'Nail the Trail.' These are plausible for many task apps and bury the strongest benefit. Returning home includes a saved instruction, but proceeding to Today is another step.

Next candidate: preserve the accepted composition and replace only the supporting proposition with 'Leave your next move. Come back knowing where to begin.' Put a concrete saved instruction in the opening video shot. Keep the broad audience but show one specific piece of work.

Acceptance: after five seconds, a fresh observer can explain that Trail helps resume interrupted work, rather than describing only a timer or to-do list. Five seconds is a local review target, not a scientific threshold.

### 3. Capture has a cost, and unexpected interruptions escape it — central product risk

The user must create a goal, define finished, enter actions, reach the pause form and voluntarily save context. A sensible data model does not guarantee this is an attractive routine. The cloud script improves the story, but a script cannot remove actual interaction cost.

Next: observe the existing short-note flow before changing it. Use one concrete instruction, optional context/link and keyboard Save. Compare with a note in the document. Count clicks, corrections and explanation needed. Do not add compulsory fields, extra dialogs or AI requests to this path.

Acceptance: an observer can save and recover a useful instruction unprompted. Record actual time and mistakes without claiming experimental superiority. If the form is the obstacle, simplify that form in a separate bounded pass.

### 4. Paused work can trap the plan — source-confirmed local limitation

In the current local controller, any active session (including paused/expired) disables adding, removing and reordering actions. The domain also guards structural edits. The available lifecycle ends the active session through completing the action; there is no distinct 'end block, keep action unfinished' command. Someone discovering a missing prerequisite must wait, rename or falsely mark work complete to restructure the plan.

This matters more than another celebration. Reproduced against the imported cloud domain module: paused save-goal with a new prerequisite throws “Action order and removal are locked while a focus block exists.” No state was changed by the rejected operation.

Candidate bounded solution: explicit 'End focus block' while stopped, retaining effort/context and leaving the action unfinished, then permit normal existing structural edits. Starting another block must preserve earlier intervals and explicit Resume/ownership rules. This touches canonical behaviour and requires dedicated failure/Retry/Undo/reload tests. Do not sneak it into a copy pass or weaken guards globally. If insufficient time remains, disclose the restriction and avoid calling this a flexible project manager.

Acceptance: start → pause → end block → add a prerequisite/reorder → reload; no fabricated completion, lost effort, auto-start or duplicate retry. Existing action/context removal protections remain.

### 5. Saved notes cannot be explicitly cleared — source-confirmed local limitation

Blank instruction/context intentionally preserve previous values. The UI provides an explicit clear control for the work URL, but none for the old instruction/context. Deleting text and saving brings the old content back. An independent pure-domain probe against the imported source reproduced preservation of both obsolete strings. Preservation prevents accidental loss but makes an obsolete saved place hard to remove.

Candidate bounded solution: explicit per-field clear intent for saved instruction/context, with cancellation preserving data and success falling back to the unfinished action. Do not change blank/Skip to destructive behaviour. Confirm semantics for an empty context record/campsite before coding.

Acceptance: clear only the intended field after commit; failed save retains old content and clear intent; Retry applies once; Skip/Cancel preserve prior content; Undo/history remain coherent. This should be reviewed separately from ending a block.

### 6. The link must lead somewhere real — demonstration blocker

An example.com placeholder cannot demonstrate continuity with actual work. The community-workshop story is useful only if the linked document visibly contains the unfinished room-booking decision. Keep the story labelled staged if it is staged; do not imply Trail read or verified the document.

Next: user chooses/creates a safe real document or repository artifact, saves its actual URL and records a concrete continuation. Opening a reference remains separate from starting timing. If no such resource is ready, show truthful manual notes rather than a fake integration.

Acceptance: the link opens the intended accessible resource during rehearsal and the saved instruction points to a specific unresolved action in it.

### 7. Mountain semantics must be understood without narration — pending cloud visual review

The campsite must mean 'a useful place was saved', not 'work is complete' or 'a timer is running'. The travelling marker must reflect canonical outcomes, selection must not invent progress, and all-checked review must remain below confirmed summit. Dense routes need legible labels and the full action list.

Acceptance: observer distinguishes current/saved/checked/finished states; 1/2/5/30 actions, light/dark and phone layouts remain usable; failure/Retry/Undo/motion-Off/reload do not replay or misplace progress. If observers cannot read it, improve the explanation or simplify the marker. Do not restart terrain design under deadline pressure.

### 8. The reliability story has real limits — testing gap

The timer is conservative browser accounting, not attention detection. Gaps over 15 seconds can interrupt timing, including background throttling. Short sleep may evade detection. Records are specific to the browser and exact origin; a deployment or port change does not carry them over. Raw export is not a usable import/restore product.

Next: perform actual Chrome/Mac background and sleep tests, then a real phone check if available. Record what happened. Keep primary controls clear when an interruption occurs. Do not convert controlled clock tests into hardware claims.

Acceptance: no unexplained credit/automatic Resume in the tested scenario, recoverable visible state, and deployment-origin storage limits explained where needed. Unverified scenarios remain unverified.

### 9. Documentation contradicted current delivery — largely reconciled by cloud import

Before import, local scope excluded graphical redesign and the design brief called the fixed return issues open. The imported cloud headers now explicitly supersede those historical sections. The fuller local execution brief and new review remain preserved. Historical document length remains a navigation cost, rather than a reason to rewrite implementation evidence.

Next: after cloud import, write a short authoritative current-status section in scope/design brief/HANDOFF/checklist. Keep historical evidence as history and clearly separate built, proposed, user-accepted and published. No wholesale rewrite of historical evidence is necessary.

Acceptance: a fresh agent or judge can identify the runnable app, implemented scope, known limits and next step without reconciling contradictory top-level documents.

## How to spend the remaining window

Execute one result at a time. These are planning estimates, not promises or a reason to exhaust usage.

1. Import/reconcile and verify cloud changes first. No competing runtime writer.
2. Run a 10–15 minute observed interruption/return rehearsal. Inspect the new mountain and use a real resource. This can eliminate speculative work.
3. If replanning is a real blocker, take the explicit end-block change as the next single implementation task, with domain/browser regression checks. Otherwise take the smaller explicit-clear correction. Do not bundle both into an open-ended enhancement pass.
4. Apply only demonstrated clarity problems and align current documents. Freeze the visual direction after this decision.
5. Secure current public source/access, rehearse and record the product-first video, then verify the submission claims and links. Publication and submission require their respective authorization.

Defer streaks, audio, AI planning, accounts, synchronization, automatic capture, reminders and another graphics overhaul. They increase obligations without proving the core return benefit. A broader audience does not require a broad feature set.

## Small human review protocol

Use two or three available people if possible, with one real observation preferable to invented validation. Small convenience tests are qualitative observations, not market validation.

- First screen: 'What do you think this helps you do?'
- Give them a realistic unfinished document and ask them to leave themselves a way back. Do not point to controls.
- After an unrelated short activity, ask them to continue. Observe whether they find the correct instruction/resource and know timing requires a separate explicit start.
- Ask what campsite and summit mean before explaining them.
- Ask whether they would use this instead of a note in their document, and why. Record the refusal as carefully as the approval.
- Record observer count, scenario, elapsed time, mistakes, exact brief comments and limitations. Do not claim a speed improvement from a single rehearsed example.

The decision is whether the saved-place loop is useful enough to keep. 'Looks nice' and passing tests are insufficient evidence for that decision.

## Verification receipt for this review

Pre-import local syntax checks, all 22 Node tests, build and diff check passed on 25 October. No new runtime code was changed. Cloud runtime and revised research/delivery materials are now imported from the verified GitHub branch. Independent Chromium verification passed all ten gates, exit 0; see LOCAL_CLOUD_REVIEW_EVIDENCE.md. The user approved the end-block correction next; see OPENCODE_END_FOCUS_BLOCK.md. Nothing was pushed, deployed or submitted by this review.
