# Trail — next-hour cloud completion brief and checklist

This entire document can be pasted into the existing Trail cloud coding chat. Execute the priorities in order; do not merely restate a plan. The user wants productive autonomous work while away, with approximately one hour of the current usage window remaining. Start an elapsed-time budget when this task begins; do not assume quota resets, automatic restarts or guaranteed completion. Make the last ten minutes a verification/handoff window rather than spending the entire window on new code.

## Authority, baseline and first actions — target minutes 0–5

- [ ] Use the existing cloud Trail checkout. If an implementation is already running in this same task, continue it and reconcile this checklist; do not start a competing writer or reset its work.
- [ ] Inspect Git branch/status/remotes and existing edits BEFORE switching/refetching. Preserve all newer work. Do not discard files, stash everything blindly or restore historical code.
- [ ] Fetch `origin/codex/trail-redesign` if network permits. Required baseline is `041fe89ac9b27d91973f39b9505d39e0e64ce998` or a verified descendant. Confirm ancestry with Git, not a matching subject line. If the cloud snapshot is old main, move a clean checkout to the working-branch baseline; if local edits conflict, preserve them and report instead of resetting.
- [ ] Verify the three return fixes are present: saved-context removal protection, bounded long-note controls/full-text expansion, and scoped validation/Retry preservation. These are already implemented and independently reviewed; do not rebuild them.
- [ ] Read AGENTS.md and its required documents once. Latest decisions in this brief/current checklist supersede historical uncommitted/old-checkpoint/graphic-deferral receipts. If this brief is only pasted into chat and absent from Git, save it as `devpost/CLOUD_COMPLETION_CHECKLIST.md` without overwriting a newer version.
- [ ] Confirm one dependency-free runtime, Node 20+, seven built assets and baseline 22 Node tests. Old cloud onboarding describing a three-file/four-test static proof is obsolete; use current source, not those old counts.
- [ ] Record planned changes and exact affected files in `devpost/CLOUD_EXECUTION_PLAN.md` before cross-file edits. Keep a compact actual progress log with timestamps/results.
- [ ] Verify/start the server and inspect available Chromium/browser tools. Use the cloud preview mechanism if provided; a cloud `127.0.0.1` link is not a preview on the user's Mac. Report browser/tooling gaps honestly, and continue unaffected preparation work.

## Accepted product and scope — keep throughout

- [x] Written layout and current mountain silhouette/depth are accepted by the user. Preserve them.
- [x] Current checkpoint/summit rewards are implemented and tested, but the user finds them too similar to a normal chart. Do not claim visual satisfaction.
- [x] Real goals/actions, saved next move/context/link, conservative focus timing, local persistence, Retry, Undo, review/history and guarded reopening exist.
- [ ] Preserve one open goal, canonical IDs/statuses, exact Retry, exclusive writer ownership and explicit Start/Resume.
- [ ] Preserve no unverified away-time credit, no implicit timing from Open work/navigation and no fabricated attention/distance/productivity claim.
- [ ] Keep fictional examples separate and labelled. No seed data in real storage or manipulation of the user's normal local records.
- [ ] No new backend, dependency, framework, account/sync, AI, reminders, streaks/calendar, audio or external art pack in this hour. No wholesale copy/UI rewrite or historical pixel UI restoration.
- [ ] Do not send external messages, modify main, push, deploy or submit. Prepare reviewable results and publication instructions; new publication needs user authorization.

## Priority 1 — one travelling-marker prototype — target minutes 5–35

The objective is one coherent journey response, not more glow/confetti. Keep persistent outcomes authoritative; movement is presentation only.

### Define state mapping before implementation

- [ ] Reuse the existing ascent path/checkpoint geometry and actual goal/action identities; do not create a second route renderer or persistent coordinates.
- [ ] Use one clearly recognizable expedition marker that can become a small campsite when the current action has a useful saved place and timing is stopped. A blank context record alone must not imply a useful saved thought. A link-only saved reference may qualify; define the actual predicate in the plan.
- [ ] No-goal illustration remains explicitly illustrative. Fresh unsaved work has a next-action marker without a fabricated saved campsite.
- [ ] Derive current destination from the actual first unfinished action, independently of selected/highlighted action. Completed actions may be noncontiguous after reopening.
- [ ] For a normal committed completion, describe movement along the route from the just-completed checkpoint to the next unfinished checkpoint. Define behaviour for reopened earlier actions: show existing checked states faithfully and do not invent extra completions on skipped checked checkpoints.
- [ ] When no unfinished action remains, settle at a pre-summit/review position with Ready for review. Final summit arrival/flag belongs only to explicit committed goal finish. Keep review immediately available.
- [ ] Switching view/reload/selection/Undo/reopening shows the correct static position immediately; do not replay travel to invent activity history.

### Implement the smallest complete visual loop

- [ ] On a newly applied completion, render the correct semantic state immediately, then show a short path-following marker movement. Prefer about 600–900ms; tune by watching it rather than treating that number as a research result.
- [ ] The existing checked marker/earned trail remains visible. Replace or coordinate existing transient effects instead of stacking multiple spark/glow/marker celebrations.
- [ ] Keep controls interactive; do not wait for animation completion to accept Undo, navigation or review. Animation callbacks must never write domain state.
- [ ] Successful saved-place capture may change the stationary marker into a campsite quietly; it does not earn ascent or complete an action. Start/Resume may return it to an expedition marker without awarding progress.
- [ ] Confirmed finish coordinates the same marker/summit concept with the existing single dismissible reward. No second modal, forced delay or animation hidden behind the dialog.
- [ ] Target effects by actual real/example goal ID plus action ID; unrelated finished mountains stay still.
- [ ] Cancel transient work on Undo, navigation, rerender, theme/mode switch, reward dismissal and motion preference changes. Clean up listeners/timers/animation handles; no endless loop.
- [ ] Motion Off/reduced motion show final positions and semantic states instantly. Off mid-travel stops cleanly at the correct canonical destination and never resumes/replays on its own.
- [ ] Check 1/2/5/30 actions, long names and phone labels without redrawing the accepted landscape. Keep the full keyboard-accessible action list authoritative.
- [ ] If the marker is not coherent by minute 35, stop new animation scope. Preserve a clean reviewable result or revert only this pass's experimental changes to the known working presentation. Do not reset other work or quietly ship a broken transition. Move to verification and useful delivery drafts.

## Priority 2 — regression and quality gate — target minutes 35–50

Do focused checks during implementation and one full combined run after final runtime edits. Add regression checks that exercise behaviour, not tests that merely mirror CSS strings.

- [ ] Syntax check passes.
- [ ] All existing Node tests pass (22 at baseline); report the actual new count.
- [ ] Build succeeds with the same seven-asset parity unless a justified presentation-module change explicitly updates both serve/build allowlists and checks.
- [ ] `git diff --check` passes; inspect the final diff for unrelated churn/private files.
- [ ] Actual browser completion: marker follows the intended path once, ends correctly and does not alter stored state except the intended completion.
- [ ] Failed completion and failed finish: no success movement/reward; exact Retry commits once and emits at most one response for that operation.
- [ ] Immediate Undo/navigation during travel: correct current/action state survives later animation cleanup; recorded effort is preserved.
- [ ] All-checked is review, not finished. Confirm finish, reload and inspect history without replaying movement/reward.
- [ ] Reopen an earlier action while later actions remain checked; current/selection/earned markers remain distinct and correct.
- [ ] Save a useful place, Skip/blank preservation, reopen/reload and explicitly Resume. Opening a work link changes no timing/state.
- [ ] Saved-context actions stay protected; untouched removal still works. Do not regress the recent fix.
- [ ] Maximum 4,000+4,000 notes keep collapsed controls reachable and full text available; HTML-looking/unbroken text stays literal and safe.
- [ ] Invalid link → Save → Skip clears that validation; aborted saves preserve draft/removal intent/error/pending Retry.
- [ ] Existing ownership/recovery/conservative timing and real/example isolation remain correct; do not weaken assertions to accommodate visuals.
- [ ] Inspect light/dark desktop/390px captures and actual travel/campsite/summit transitions. Check visible focus, label contrast, overlap, overflow and reduced motion/Off mid-transition.
- [ ] Run the full existing Chromium suite once after the final runtime change if tooling is available. If it fails, fix within remaining time or report the exact failure; no unsupported “all passed” claim. If browser tooling is unavailable, record it and do not replace browser verification with invented evidence.

## Priority 3 — prepare judge-facing delivery artifacts — use remaining time, no runtime expansion

These are useful independent tasks if animation work stalls or testing leaves time. Finish a small number of good artifacts instead of scattering placeholders. Do not invent user validation, implementation provenance or a deployed URL.

- [ ] Create `devpost/DEMO_WALKTHROUGH.md`: a reproducible fresh-profile walkthrough using one concrete but broadly relatable task, three meaningful actions, a saved next move and safe example reference URL.
- [ ] Show the distinctive loop: begin work → save a useful place → leave → return knowing the next move → Open work → explicitly Resume → complete/review/finish → revisit the kept mountain.
- [ ] Specify which steps are live, which are clearly labelled fictional examples and any honest time cuts. Do not imply the app inspected an external document or measured attention.
- [ ] Create `devpost/VIDEO_SCRIPT.md`: a timed 2–2.5 minute shot list/narration with the problem in the opening, most time on the actual loop, a brief accurate implementation/Skill Pack explanation and a concise close. Keep total below three minutes; do not spend most of it on the landing animation.
- [ ] Create `devpost/SUBMISSION_DRAFT.md`: short pitch, inspiration/problem, what it does, how it was built, challenges/decisions, actual accomplishments, lessons, future work and known limits. Distinguish implemented from planned. Include broad-audience examples without claiming all audiences have been tested.
- [ ] Create a claim/evidence table: local persistence, no away-time credit, explicit Resume, saved URL, Undo/history, mountain state and new marker status each point to implementation/tests or are marked unverified.
- [ ] Check actual Skill Pack use/provenance from repo docs/history. Explain real planning decisions; do not infer required usage solely from installed skill folders. If evidence is missing, flag it for the user rather than manufacture provenance.
- [ ] Reconcile only contradictory current-status statements in README/scope/PRD/spec/design brief/checklist/HANDOFF. Preserve historical receipts but clearly label their dates; correct old claims of four tests/three assets/no persistence/graphics deferred when presented as current.
- [ ] Prepare `devpost/DEPLOYMENT_PREFLIGHT.md`: inspect the built static output and existing hosting configuration; describe a concrete static-host publication path, required access, correct output directory, working-branch source and post-deploy checks. Do not create accounts, choose paid services or deploy.
- [ ] Include final-origin checks: HTTPS/secure browser capability, all assets, no private paths, fresh state, IndexedDB/Web Locks, full return/completion flow, correct mobile theme, reload and no replay. Browser storage is origin-local; old localhost work is not automatically transferred.
- [ ] Check whether source visibility/license choice is established; flag anything needing the user's decision. Do not add a license or change repository visibility without authorization.
- [ ] Prepare a short list of screenshot shots/captions showing real saved work, campsite/marker if implemented and a finished goal. Use isolated profiles, no private user task data. Do not label synthetic example achievements as user research.

Official requirements reference, checked 25 October: https://learn-ai-basics.devpost.com/rules . The rules require a new Skill-Pack-built end-to-end proof of concept and scope/prd/spec planning docs, public source/instructions, an English description and a publicly viewable YouTube/Vimeo demo; the video should be under three minutes. An open-source license is recommended in the rules. If web access is available, verify current submission fields/updates before finalizing drafts. Do not treat any draft as a submitted entry.

## Priority 4 — save a useful handoff — begin no later than minute 50

- [ ] Stop new feature work. Finish pending tests or isolate the incomplete experiment; keep the last known working core usable.
- [ ] Update `devpost/checklist.md`: mark each item only with actual evidence. Keep implemented, tested, independent review, user visual acceptance, pushed, deployed and submitted as separate statuses.
- [ ] Write `devpost/CLOUD_COMPLETION_EVIDENCE.md` with baseline/final local Git state, exact changed files, commands/results, screenshots/preview access, known failures, unfinished work and an ordered continuation list.
- [ ] Add a current HANDOFF header that supersedes old next-task statements. State whether the travelling marker/campsite is implemented, tested, reverted or incomplete. User visual satisfaction remains pending until they try it.
- [ ] Preserve edits in the cloud task and provide a reviewable diff/patch through supported task artifacts if available. Report the actual persistence mechanism. A cloud-only file is not a verified GitHub checkpoint; no claim of push without remote evidence.
- [ ] Final report: completed work, real test count, browser scope, remaining blockers, accessible preview/capture references, publication status and the next one or two decisions. Do not end with only a plan or keep coding indefinitely because unused quota may remain.

## Human/final-publication checklist — prepare, do not falsely complete in cloud

- [ ] User tries the visual transition and accepts/rejects it; decide freeze/fallback.
- [ ] Observe real interruption/return use and record actual confusion or value. Agent script success is not human validation.
- [ ] Physical Chrome/Mac sleep/wake/background and phone-device checks; a Linux cloud browser cannot establish these. Comet is secondary to the primary supported browser.
- [ ] User authorizes and verifies the next source checkpoint/PR and reviews the diff. No automatic merge/main change.
- [ ] User selects/authorizes hosting and deployment; verify public judge access on the real final origin.
- [ ] Record/upload the actual public video and verify its duration/accessibility; drafts are not recordings.
- [ ] Confirm source visibility, license choice, planning docs, Skill Pack explanation, project history disclosure and actual final form fields. Flag unresolved provenance instead of changing history.
- [ ] Review/submit the final entry with user authorization. Do not attest to eligibility or submit on the user's behalf from this brief.

## Parked product ideas — do not consume this hour

Streaks/productive-day calendar, audio, importance/neglect scoring, closed-site notifications, AI planning, PiP, accounts/sync, automatic capture, multiple mountain themes and external animation packs. Keep them in future work. A working memorable loop plus clear demo materials takes precedence over breadth.

## Execution discipline

Use one editor, one evolving prototype and a compact progress log. Reuse current architecture/tests. Avoid repeated full-repo searches, dependency installs, speculative abstractions and repeated full-suite runs without a new change. If waiting for user input, continue independent tests/drafts. Never fill gaps with fake evidence, hide failed checks, or call the product flawless. Aim for the best reviewable result within the actual window.

Execute this checklist in priority order within the actual remaining usage window. Continue any work already started; preserve newer edits. Reserve time for verification and handoff. Do not wait between independent tasks, and do not claim unchecked items are complete.
