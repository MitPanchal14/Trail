# Trail: product research and submission strategy

Research date: 25 October 2026, IST. This is an assessment and proposed plan, not implementation authorization or a claim of winning odds. The user selected **keep the broader audience**: students, solo builders and other people returning to interrupted individual work. Use one shared situation rather than a long list of personas.

## Recommendation

Make Trail exceptionally clear at this promise:

**Leave your work. Keep your place. Return knowing what to do next.**

The prototype's best opportunity is the transition from interrupted work to an actionable return. A timer, notes and an attractive route alone are not a defensible novelty claim. Do not rebuild the UI or add a general AI assistant to look more ambitious. Preserve the approved composition and concentrate on making the saved place more useful, trustworthy and visible.

No realistic review can certify the product as flawless. A strong submission can demonstrate one complete loop, show evidence of its boundaries and explain the decisions that make it useful.

## Evidence and current status

Fresh local source/docs/Git inspection confirms a dependency-free seven-asset browser runtime. HEAD is c47dc01; the day-build changes remain uncommitted. The immediately preceding combined review independently passed syntax checks, 16 tests, build and the complete source Chromium integration suite. This research did not rerun that unchanged suite. Read COMBINED_LOCAL_REVIEW_2026-10-25.md and DAY_BUILD_EVIDENCE.md for exact evidence.

| Capability | Current state | Remaining acceptance |
| --- | --- | --- |
| Manual goal and ordered actions | Implemented: create, edit, reorder, required definition of finished | Test whether setup feels quick and understandable |
| Focus | Implemented: explicit Start/Resume, pause, extensions and expiry | Physical Mac/background behaviour; longer real usage |
| Save a place | Implemented: next instruction plus optional context | Improve clarity and measure usefulness in a return scenario |
| Local persistence | Implemented: IndexedDB, commit-before-success, exact retries, tab ownership | Public-origin smoke test; clarify local-only ownership |
| Recovery | Implemented: reload/interruption recovery and no unverified away-time credit | Real sleep/wake and primary branded browser |
| Completion | Implemented: action completion, limited durable Undo, final review | User acceptance of wording and controls |
| Finished work | Implemented: real collection, saved context, guarded corrections | Test whether users understand reopen vs new goal |
| UI corrections | Implemented: removed rail, effective motion control, compact reward | Final user review; graphics redesign remains deferred |
| Everyday data portability | Recovery export exists in storage-error flow | No normal backup/import workflow; optional after critical work |
| Product validation | Technical evidence exists | No observed user-value or retention evidence supplied |
| Delivery | Local build exists | Current hosted build, public code/license, video and submission not established here |

Do not put one completion percentage on this project. The bounded core loop is implemented; the larger PRD still includes daily mapping, recommendations, streaks, closed-site reminders, optional PiP and optional AI. Those are separate product milestones, not prerequisites to a coherent hackathon entry.

Two independently reproduced P2 issues remain open:

1. Switching real → example → real loses an unsaved goal form. Preserve create/edit drafts across that transition and test both paths.
2. The real-mode home uses captured fictional landing content, including an ML next instruction presented as “Your next move, kept.” Preserve the composition while making the sample explicit and the real CTA accurate for new/returning users.

Also simplify copy in normal screens: terms such as IDs and independent field-preservation rules describe implementation rather than helping the person work. Essential storage/recovery information should remain accessible, with concise contextual messages when relevant.

## Official competition findings

The official deadline is 26 October, 5 PM EDT: **27 October, 2:30 AM IST**. Four criteria are equally weighted: design, potential impact, innovation/idea and presentation. A new Skill-Pack-built project must demonstrate an end-to-end function and include scope/prd/spec. Public source and a public video under three minutes are required; the rules recommend an open-source license. Judges may evaluate the materials without running the project. These requirements concern AI-assisted development, not a mandatory in-product AI feature. Source: [official rules](https://learn-ai-basics.devpost.com/rules).

The organizer's latest review advice emphasizes immediate product explanation, easy access and a distinctive visual identity. Source: [Will It Ship recap](https://learn-ai-basics.devpost.com/updates/47209-will-it-ship-recording-is-up).

The form also requires Skill Pack usage explanation and age-of-majority confirmation; the public repo belongs in Try it out. Sources: [form update](https://learn-ai-basics.devpost.com/updates/46821-two-new-questions-on-the-submission-form), [repository reminder](https://learn-ai-basics.devpost.com/updates/46766-don-t-forget-to-include-a-url-to-your-public-repo).

No root LICENSE file or local video/submission draft was found by the targeted file inventory. That does not prove an external draft/video does not exist. Verify the public repository and submission directly before claiming readiness. Preserve historical development provenance; document actual Skill Pack use and how planning changed implementation, rather than inferring use from installed skill folders.

## Competitive research

This is a targeted comparison of official feature descriptions, not an exhaustive search, hands-on competitor test or proof that no similar product exists.

| Product | Documented overlap | Implication for Trail |
| --- | --- | --- |
| Todoist | Task descriptions, links, subtasks and contextual comments | Notes attached to a task are not unique. Make the pause/return transition central and effortless. |
| Session | Focus intention, timer, contextual notes, reflection and progress review | A mindful focus timer with notes is already established. Demonstrate continuity after interruption, not merely a countdown. |
| Ellie | Brain dump, timeboxing, subtasks, focus mode, Pomodoro and shutdown | Do not compete on planning breadth. Keep goal setup lightweight. |
| Amazing Marvin | Focus/time tracking, task notes and a guided procrastination intervention | “Helps you get started” alone is too broad. Show precisely how a saved next move supports a return. |

Sources: [Todoist task context](https://www.todoist.com/help/todoist/teams/manage-team-tasks-in-todoist-S99543QzY), [Session workflow](https://stayinsession.com/learn/getting-started-with-session-pomodoro-app), [Ellie](https://ellieplanner.com/), [Marvin Procrastination Wizard](https://help.amazingmarvin.com/amazing-marvin/procrastination-wizard).

Our inference: Trail has a credible positioning opportunity around interrupted-work continuity. It has not established a moat or a first-of-its-kind invention. Explain the workflow and why it is simpler for this situation; do not claim competitors cannot preserve context.

## Research supporting the problem, with an important limit

Leroy and Glomb's ready-to-resume research supports briefly planning where to resume before switching tasks. The university's account reports reduced attention residue and better performance on the interrupting task, and explicitly says the studies did not test performance on returning to the original task. This supports the design rationale; it does not validate Trail or establish saved minutes, improved grades or a productivity percentage. Sources: [university research account](https://www.washington.edu/news/2018/01/16/task-interrupted-a-plan-for-returning-helps-you-move-on/), [original paper](https://pubsonline.informs.org/doi/10.1287/orsc.2017.1184).

## Highest-value proposed improvement

Treat the existing saved-place feature as the main product, with a clear return card in the retained Today layout:

- **Next move:** one concrete action, already supported by saved instruction.
- **Where I stopped:** existing optional context, shown with clear hierarchy.
- **Saved:** timestamp of the user's save, if supported by canonical data or added explicitly; do not invent a timestamp.
- **Resume focus:** explicit start, preserved exactly as implemented.
- **Optional resource:** one document/repository URL only if trials show users need it and there is time. This is new scope: use explicit entry and http(s) validation, avoid remote fetching, and preserve old local records. Do not silently create integration or automatic reopening claims.

The first three presentation improvements reuse the current workflow. A resource link is an optional small feature, not a prerequisite. Do not add new required pause fields. Suggested field prompts: “When I return, the first thing I’ll do is…” and “Where I stopped / what to remember.” Let people skip. Never imply the app can reconstruct a thought they did not save.

Example: Goal “Finish a project proposal”; action “Write the budget section”; context “Drafted staffing costs; equipment costs are still blank”; next move “Open the costs sheet and add the laptop and hosting estimates.” The return view should surface this immediately, then require explicit Resume. The same interaction fits an assignment, analysis, writing or coding project.

For progress, retain the accepted art. Strengthen actual labels: completed actions out of total, separately recorded effort, and next unfinished action. Label full-goal geometry as a goal trail rather than implying today's distance or measured attention. Do not encode minutes into arbitrary route length before defining a mapping.

## Priority and effort assessment

These are planning timeboxes, not performance promises.

| Priority | Work | Timebox | Why now |
| --- | --- | --- | --- |
| P0 | Fix draft loss + real/example home mismatch, add regressions | 45–60 min | Trust and coherent experience |
| P1 | Sharpen saved-place/return presentation and simplify primary copy | 45–75 min | Makes the value visible without a redesign |
| P1 | Three to five short observed user trials | 45–60 min, recruit early | Tests whether people understand and use the differentiator |
| P1 | Physical primary-browser test + final regression | 45–60 min | Protects the actual demonstrated return loop |
| P1 | Final-origin deployment verification and public-repo preparation | 30–45 min | Gives reviewers a working, truthful entry point |
| P1 | Video, screenshots and final submission text | 75–105 min | Makes the demonstrated value judgeable |
| P2 | Optional resource link or accessible normal backup | Only after above, based on observed need | Useful but expands state/UI/testing |
| Later | AI planner, streaks, reminders, multi-goal priority, sync, PiP | Outside this finishing pass | Introduces contracts, infrastructure and failure paths |

Publication remains a separate authorization step. This research neither commits nor deploys anything. Complete reviewable files and checks first, then obtain the user's final publishing direction.

## Fast, honest user validation

The user keeps the broad audience. Seek three to five available people spanning at least two contexts, without claiming representative market research. The user can recruit them; this task sends no messages.

1. Ask each person to bring a small real unfinished activity. Observe setup without explaining every control.
2. Let them focus briefly, save a next move and context, then do an unrelated activity for roughly five minutes.
3. Reopen Trail. Before coaching, ask “What will you do next?” Then observe whether they can find the saved place and explicitly Resume.
4. Record setup friction, note-writing effort, whether the next action is correctly understood, unaided success, confusing controls and errors. Time-to-understand the next step is exploratory; measure consistently from the return screen appearing to a correct stated action.
5. Ask whether this felt more useful than their usual method, what information was missing and whether they would use it on their own next interruption.

Pass target for this small round: everyone can save and recover without data loss; at least three can explain the next action without help. This is a usability target, not an impact benchmark. If fewer participants are available, report the actual count. Record anonymized observations and permission for any attributed quote. Do not claim improved productivity from a tiny guided study or stage a testimonial as independent validation.

## Video plan: about 150 seconds

- 0–15s: show the interruption problem and say who can use Trail, in ordinary language.
- 15–35s: create a short real goal with two actions and a definition of finished.
- 35–65s: start focus, pause and leave a specific next move/context.
- 65–95s: close/reopen or reload; show retained context and explicit Resume. This is the signature moment.
- 95–120s: complete actions, confirm the finished outcome and show durable history. Use an honest edit rather than pretending a full focus block elapsed.
- 120–140s: explain an actual observation from user trials and a concrete planning/Skill Pack decision, if available.
- 140–150s: state the local-storage limitation and invitation to try it.

Suggested pitch: “Trail helps people return to unfinished work without rebuilding the context. Save where you stopped and one useful next move; come back to that move, focus, and see what you finished.” Avoid spending most of the video on home-page animation or architecture.

## Finish schedule and stop boundary

Research completed late morning on 25 October. Preserve the user's desired 17:00–18:00 prototype freeze, with 19:00 the hard coding stop. About five to seven focused hours remain practical depending on breaks and feedback. Recruit testers early; run trials as soon as the fixes and return presentation are usable. Have recording begin by late afternoon rather than consuming the full buffer with features.

First dispatch: only the two fixes plus agreed copy/return presentation, documented before cross-file changes. Verify that bounded change and review it. Next: observed trials and physical browser acceptance. Then fix only demonstrated blockers, freeze the app and prepare publication/video/submission. Do not roll the whole long-term PRD into one OpenCode prompt.

Success for this pass means: coherent new/returning entry, no draft loss, immediately useful saved context, honest progress, demonstrated persistence/recovery, no duplicate completion, accepted primary-browser behaviour, working judge access, accurate planning docs/license and a concise end-to-end video. It does not mean all imaginable features are implemented.
