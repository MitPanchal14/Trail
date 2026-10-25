# Trail return experience: deeper findings and finishing decision

25 October 2026, IST. Baseline: reviewed checkpoint 6d9a930 on codex/trail-redesign. User authorized deeper research and creative product improvement, retains a broad audience and can use OpenCode or Antigravity sequentially. This document records the next planned work BEFORE cross-file changes. It does not claim implementation or permission to publish another revision.

## Planned files for this planning pass

- This file: deeper research, choices, timeboxes, usability experiment and editor-switch protocol.
- OPENCODE_RETURN_EXPERIENCE.md: one bounded implementation dispatch with acceptance tests; can be run by either editor.
- HANDOFF.md and checklist.md: point to this next pass and distinguish proposed from implemented work.
- Runtime, schema and tests are not edited by the planning/research chat. One implementation agent owns the next runtime diff; this chat reviews the result. Do not launch both editors against the same checkout.

## What the deeper research changes

The first comparison with Todoist/Session/Ellie/Marvin was insufficient for judging novelty. Closer examples exist:

- [Amna](https://www.getamna.com/) advertises context-first task workspaces and automatic tab saving. Its page also contains old launch information: treat it as evidence of a published concept, not verified current availability or quality.
- [Pieces](https://pieces.app/) describes background context capture, a chronological memory and retrieval of past work. These are vendor claims, not an independent test.
- [CueBack](https://devpost.com/software/cueback) describes next-step capture, saved work links and return cards, with automatic Android detection. The page identifies RevenueCat Shipaton 2026; do NOT present it as a verified entrant in our Build With AI competition. Its claimed features and measurements have not been independently tested here. Do not copy its copy, visual identity, thresholds or code.

Consequence: neither “save your place” nor adding a work URL establishes first-of-its-kind novelty. The attainable proposition is a particularly clear **intentional work loop: next action → optional focus → useful stopping point → return to the work → finished outcome**. Broad audience, low setup, explicit user control and useful context are design hypotheses to prove, not a moat.

Research also strengthens the need to preserve the work reference, not just a task name. [Parnin and DeLine's CHI study](https://www.microsoft.com/en-us/research/publication/evaluating-cues-for-resuming-interrupted-programming-tasks/) surveyed 371 programmers and compared automated resumption cues with notes. The abstract reports better task success with the cues in its controlled programming setting. Trail is not implementing their automated cues and cannot inherit their measured benefit. Our inference is narrower: show the actual relevant work reference alongside a concrete next step, and test whether that helps.

[Ready-to-resume research](https://www.washington.edu/news/2018/01/16/task-interrupted-a-plan-for-returning-helps-you-move-on/) supports a brief plan before switching tasks. Its reported benefits concern attention on the interrupting task; it did not establish Trail's return speed or effectiveness. Avoid the often-repeated universal “23 minutes lost per interruption” claim.

## Problems → proposed solutions → evidence required

| Problem | Bounded solution | What would count as useful evidence |
| --- | --- | --- |
| User must write at the worst moment | One optional next-move field, prior content retained; extra context collapsed; keyboard save; visible Skip | Measure actual time/keystrokes to leave a useful place; ask whether doing so felt burdensome |
| A note does not reopen the work | One optional user-pasted work link tied to the current action, preserved across saves | Returner can open the correct saved reference without searching; without a link the workflow still works |
| Return view can feel like another task dashboard | Existing Today card leads with concrete next move; supporting stopped-context and actual saved time; resource action next to explicit focus control | Can a returning person name the next action and reach their work unaided? |
| Timer-centric framing hides the benefit | Link opening never requires or starts focus; explicit Start/Resume stays available | People can use the saved place without running a timer; no invented effort credit |
| Illustrative route says little | Retain art; label full-goal trail accurately and show checked-action count separately from recorded effort | Users can distinguish completed work from elapsed time; no false daily-distance story |
| Broad audience makes pitch vague | One universal situation, concrete assignment/writing/coding examples, one story in the video | An unfamiliar person can explain the product's purpose after seeing the entry screen |
| Value is unproven | Small observed interruption/return experiment against usual method | Actual individual results, including failures; no causal/market claims from tiny samples |
| Engineering can overwhelm delivery | One bounded pass, review, then real trials and blocker fixes | Working final-origin demo and concise honest video, not unfinished feature breadth |

## Selected next pass

Implement **a useful saved place with one optional work link**, not a new product or an automatic memory system. Keep the approved layout. Use existing nextInstruction/context/updatedAt as much as possible. Add only optional, validated context.resourceUrl; old v1 records must still load without mutation or fabricated values. No new required fields. Save and Skip semantics, explicit Resume and conservative timing remain intact.

Desired loop:

1. Create a goal and a first action; planning the whole project is unnecessary.
2. Focus if desired using the existing explicit controls.
3. Pause: timing stops immediately. One short next move is prominent. Optional context and work link sit behind progressive disclosure; existing saved values remain available. Save is explicit. Skip preserves prior useful context.
4. Return: the existing Today card shows the user's saved next instruction, optional where-stopped context, actual note-save time and Open work when a valid saved URL exists. An action title used as fallback is labelled as the next unfinished action, never a remembered thought.
5. Open work is a user-triggered new-tab link and does not start timing or claim attention. Resume focus remains a distinct explicit action. Actual goal review/history retain the existing completion contract.

Potential UI copy: “What’s your next move?”; “Where I stopped”; “Work link (optional)”; “Save my place”; “Skip for now”; “Open work”; “Saved [date/time]”; “Start focus” / “Resume focus”. Keep a short explanation that the saved URL opens the supplied page, not a reconstruction of all tabs, cursor position or external unsaved work.

Do not advertise “10-second capture” as an achieved metric. Use that only as an internal aspirational usability target until observed. Keep exact user-authored wording; no generated next move presented as remembered fact.

## Alternatives evaluated

| Alternative | Benefit | Cost/risk in today's window | Decision |
| --- | --- | --- | --- |
| Copy/UI improvements only | Fast, low regression risk | Still leaves users hunting for the work | Ship these plus one bounded link field |
| Optional work link | Connects saved intention to the actual reference; easy real demonstration | Small canonical validation/Undo/UI test expansion | Selected; about 90 minutes including verification, review at two-hour limit |
| Browser extension/automatic capture | Reduces manual link entry | Installation, permissions, capture scope, separate runtime and judge setup | Defer |
| Background screen/clipboard tracking | Rich context without typing | New native/privacy/storage system and wrong-context failures | Defer |
| AI-generated return summary | Can compress long context | Provider/server/cost/quality/privacy work; hallucinated intention; competitors already do it | Defer |
| Voice notes/screenshots | Alternative capture | Permissions, browser/device variation, blob storage/transcription and review burden | Defer |
| Multi-goal priority/streaks/reminders | Longer-term retention potential | Does not test the main stopping/return assumption; large contract expansion | Defer |
| New route renderer | Stronger visuals | User deferred graphics and no proven value improvement | Retain approved art; fix labels only |

Extra agent subscriptions can increase available coding capacity; they cannot remove testing, coordination or user-feedback time.

## Small validation round

Recruit three to five people if available, spanning two kinds of work. User handles recruitment; no messages are sent by this plan. Record results anonymously and ask before publishing attributable quotes. One participant's useful experience is a real observation; it is not proof for everyone.

For each person:
- Ask what they normally use to remember unfinished work and when that failed most recently. Do not pitch the answer first.
- Use two comparable short activities from their real work or controlled exercises, one with their usual method and one with Trail. Alternate order across participants when practical; record that tasks are not equivalent and learning effects remain.
- At an interruption, measure capture time and observe friction. Allow Skip and note whether they choose it.
- After an unrelated five-minute activity, observe the return without coaching. Measure from return-screen appearance to a correct stated next action, then whether they reach the right document/reference. Also record uncertainty and wrong actions.
- Ask whether they would keep using this and why. Ask what they would remove.

Suggested record columns: participant code, work context, task/order, method, capture seconds, return-to-correct-action seconds, correct reference reached, assistance needed, error, quote permission, observation. No tracking code or accounts needed. Do not compare timer clicks to actual resumption; Trail cannot observe external work.

Decision rules:
- Any data loss, unintended timing start, unsafe link or wrong-action restoration blocks acceptance.
- If people understand the saved next move but find capture burdensome, reduce UI/copy/steps before adding fields.
- If the link is unused or confusing, remove its prominence; keep it optional rather than defending our design.
- If three or more people can return unaided and explain a benefit, report their actual results with sample size and limits. Do not turn this into an efficacy percentage.
- If participants are unavailable, run and label a self-test, then state that independent user validation remains missing.

## Time plan from late morning, 25 October IST

These are operational timeboxes, not promises. Aim for feature freeze at 17:00–18:00 and hard coding stop at 19:00. The official external deadline remains 27 October 02:30 IST, but protect the user's earlier submission-preparation window.

- Next 90 minutes: one implementation owner runs OPENCODE_RETURN_EXPERIENCE.md; recruit testers while implementation proceeds.
- Next 30 minutes: independent review and physical Chrome smoke check. If the link addition is still failing at the two-hour boundary, leave the existing checkpoint intact and report the concrete failure; cut the feature rather than weakening storage/timing invariants.
- Following 45–60 minutes: observed trials and physical background/sleep acceptance. Native sleep is performed by the user; headless simulations are not evidence of physical sleep.
- Following 45–60 minutes: only observed blocker fixes and the most useful copy adjustment; no feature expansion.
- Remaining pre-freeze time: final-origin smoke check, documentation/license decision and screenshots. Keep normal-browser local data separate from test profiles; a new hosted origin does not automatically contain localhost records.
- After freeze: record the 2–2.5 minute demonstration, edit with honest time skips, write the description/Skill Pack explanation and complete submission. Nothing gets published without authorization.

## OpenCode / Antigravity handoff

Only one runtime writer at a time. Default OpenCode GPT-6.1 Sol Medium is a practical starting choice, not a measured token-optimal guarantee. Use a stronger reasoning setting only for a demonstrated unresolved design/failure issue. Antigravity model availability and account limits have not been inspected; use a capable coding model available there rather than relying on an invented model name or quota promise.

If switching editors:
1. Stop the old worker and wait until it is no longer editing/running mutations. A quota pause is not proof the process stopped.
2. Have it save files and write a compact checkpoint in HANDOFF.md: branch/HEAD, files changed, completed acceptance checks, failing checks, exact next step. If quota prevents a write, the incoming editor must inspect Git/source before continuing.
3. In the same checkout, run git status --short and git diff --stat. Do not pull/reset/stash or regenerate the project. Uncommitted work is valid work to inspect and continue.
4. Give the incoming editor the same bounded dispatch plus the handoff; continue remaining work rather than repeat completed implementation/tests. Never restore an old UI or overwrite existing local records.
5. No commit/push/deploy/submit unless separately authorized. Do not launch a replacement while the first writer could resume.

## Claims and remaining risk

Improving this workflow may strengthen coherence and demonstrated usefulness. It does not guarantee prizes, erase close competitors or establish retention. The key unresolved product risk remains whether people will leave useful context and value it later. A useful link and better return card are testable improvements, not evidence that this risk is solved.
