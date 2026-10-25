# One-day prototype checklist

**Superseded schedule/decisions, 25 October morning:** follow [OPENCODE_DAY_BUILD.md](OPENCODE_DAY_BUILD.md) for the current concrete timetable and dispatch. Home layout stays; graphic redesign is deferred. Remove Focus rail, make motion control observable, and replace the slow full-screen reward with compact immediate dialog/confetti. The user requested a full local core loop by 17:00–18:00 IST, hard stop 19:00. Earlier pause and unresolved-UI wording below records the previous session; the new task prepares an OpenCode dispatch, not direct implementation here.

Prepared 25 October 2026, Asia/Kolkata. Work is paused at the user's request. This is the restart plan, not an implementation dispatch or evidence of completed features.

## Recorded planning changes

Cloud preparation update: publish this checklist, FIRST_FUNCTIONAL_SLICE.md, HANDOFF.md and devpost/checklist.md to codex/trail-redesign at the user's explicit request. Clarify the subsequent first-slice authorization in those documents; keep runtime unchanged. The user will configure Cloud. No Cloud task is launched by this publication.

Create this local restart checklist; link it from HANDOFF.md and devpost/checklist.md. Preserve the existing first-slice brief and all runtime files. No implementation, commit, push, deployment or agent dispatch in this preparation task.

## Open this first on return

- [ ] Read AGENTS.md and the current README, HANDOFF, scope, PRD, design brief, spec and delivery checklist. Check current Git changes without discarding existing planning work.
- [ ] Run the retained demo (`npm run dev`, http://127.0.0.1:3000/) and walk landing → Today → Focus → pause → journey → completion in both themes.
- [ ] Confirm the available working hours and check the official submission deadline, required materials and hosting requirements live. Do not rely on an older deadline note.
- [ ] Resolve the single UI decision below, then explicitly dispatch the first bounded build. Pausing now does not authorize overnight implementation.

## One UI decision before building

Recommended: retain the selected composition for the one-day build and prioritize real inputs, saved work and reliable return. After the core loop passes, consider the previously requested landing illustration removal, Focus rail removal, dark styling adjustments and compact completion dialog as one separately approved visual task.

Alternative: approve those specific visual corrections first, with no new visual direction or journey redesign. Confirm the exact list before editing. Do not recover the unpushed historical proof.

Keep other decisions out of the opening Q&A unless they block this build. The first-slice brief already proposes one open goal, manual actions, transactional browser storage, conservative interrupted timing and explicit Resume; review that proposal before dispatch rather than re-designing everything from scratch.

## Finish line for the day

A person can create a goal and ordered actions, start focus, pause with a useful next step, reload, explicitly resume, complete actions, review and finish the goal, and find it in real finished history. Saved state and completion corrections stay coherent. The retained example remains clearly fictional and separate from real records. The shared prototype opens successfully and the submission describes only demonstrated capabilities.

This is a proposed day target. The existing first-slice brief remains the only detailed implementation proposal; completion/history require their own bounded contract and dispatch. The entire long-term PRD is larger than this one-day target.

## Build order and time budget

Example budget for ten available working hours. Scale to actual hours on return; keep the final two hours for verification and delivery. These are timeboxes, not promises.

### 1. Scope and UI lock — 30 minutes

- [ ] Confirm the UI choice and core-loop target.
- [ ] Record actual changed files, state transitions, acceptance checks and example/real separation before each implementation slice.
- [ ] Capture desktop baseline views in both themes.

### 2. Create, focus and return — up to 4 hours

Use [FIRST_FUNCTIONAL_SLICE.md](FIRST_FUNCTIONAL_SLICE.md) as the detailed contract. Implement and verify one bounded increment at a time; update the handoff/checklist after each.

- [ ] Manual goal title, definition of finished and editable ordered actions; explicit Save/Cancel.
- [ ] Real Today view with the saved next instruction first; truthful empty states and no sample activity in real work.
- [ ] Start/pause/extend/expiry and explicit Resume; expiry leaves the action unfinished.
- [ ] Optional pause instruction/context; blanks and Skip preserve useful existing values.
- [ ] Transactional local persistence, visible write failures, reload recovery and single-writer tab ownership.
- [ ] Demonstrate create → focus → pause → reload → Resume before continuing.

If this timebox fails, stop expansion, identify the failure and re-scope with the user. Do not substitute a simulated success for persistence or timing.

### 3. Complete the core loop — up to 2 hours

- [ ] Write a small slice-2 contract first: completion event identity, exact Undo snapshot, paused timing, review confirmation, finished record and reopening/correction behaviour.
- [ ] Complete an action once; no duplicate credit from repeated clicks or navigation.
- [ ] Undo restores the correct action/context and paused timer; do not silently resume.
- [ ] All actions checked opens final review; allow adding an action or keeping the goal open.
- [ ] Explicit goal confirmation creates one durable finished record with actual dates/counts; reload and navigation do not replay completion.
- [ ] Implement and verify reopening/correction as agreed in the contract; do not expose controls that only simulate it.
- [ ] Update spec/README/handoff/checklist with evidence and remaining limits.

### 4. Bounded UI corrections — up to 90 minutes

- [ ] Apply only the explicitly agreed corrections from the opening UI decision. Skip this phase if the core loop needs the time.
- [ ] If approved, replace the full-screen timed reward with a compact, dismissible completion dialog and finite ribbons; preserve surrounding context and reduced motion.
- [ ] Check long titles, empty state, both themes, keyboard controls and phone layout against the retained composition.
- [ ] Keep route artwork illustrative until a real mapping has its own agreed rules. Show actual effort and completion counts separately.

### 5. Verify and deliver — reserve 2 hours

- [ ] Run syntax, relevant domain/storage/timing tests, static-serving tests and build. Existing four static tests do not establish functional acceptance.
- [ ] Browser-check the complete real loop, a second tab, reload during focus, background use and storage failure. Check sleep/wake on the physical target device; label any unperformed checks unverified.
- [ ] Verify completion/Undo/reopening, no duplicate events, no fictional real-history entries and no false saved indicators.
- [ ] Check 390px layout, keyboard access and reduced motion.
- [ ] Prepare the concrete hosting artifact and obtain authorization before pushing/deploying unless separately authorized for that action. Existing cleanup publication authorization is not blanket authorization for the new build.
- [ ] After authorized hosting, open the public URL without relying on a signed-in session and verify assets and the core flow. Browser storage belongs to that site address; localhost data does not transfer automatically.
- [ ] Record a concise product-first walkthrough: create → focus → pause → reload → Resume → finish → history.
- [ ] Prepare submission description, screenshots, video and required materials; verify required fields against current official rules. Obtain authorization for external submission.
- [ ] Save a final receipt: implemented, tested, hosted, submitted and unverified are separate statuses.

## Keep off the critical path

AI planning, accounts/sync, closed-site reminders, floating/PiP windows, priority scoring, streak algorithms and effort-to-route mapping remain deferred unless the user explicitly trades away core-loop work. Do not install a framework or restore the old app. Optional features cannot displace testing and delivery time.

## Restart instruction

“Read devpost/ONE_DAY_BUILD.md and the current project documents. Show me the retained UI, ask the one unresolved UI question, then record and implement only the agreed first bounded slice. Keep the full core loop and delivery reserve visible; report scope tradeoffs before expanding.”

## Pause receipt

Only planning documents were changed for this request. Runtime source is unchanged. No new functional checks, browser review, remote verification, implementation, hosting or submission were performed. Existing modified HANDOFF/checklist and the untracked first-slice brief were preserved.
