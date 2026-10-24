# Step 01 — independent product and edge-case review

## October 24 follow-up — Task 01a independently verified

**Current verdict: F01–F05 addressed in the isolated proof.** The original findings below are historical before-correction evidence, not unresolved defects. Learner visual acceptance remains pending; this is not production integration or full acceptance of proposed route/reward contracts.

Verified from the current source and live in-app-browser flows:

- F01: a distinctive saved next instruction is primary on both Today and Focus; the original step stays secondary, and optional context stays separate.
- F02: Complete → immediate Undo restores the exact custom instruction and context, reopens the same step and shows a paused countdown at its pre-completion remainder. Source snapshots state after settling/stopping the clock. Exact fractional accounting is source/builder-tested evidence, not an independent accounting-engine certification.
- F03: connected confirmation → explicit View finished work → Today shows “This goal is finished” and Revisit finished work; no review confirmation or duration selector. Confirmation guard prevents reward on ordinary navigation. An attempted top-navigation click during the overlay did not change the visible page; explicit overlay exit then navigation worked. No new blocker inferred from that overlay interaction.
- F04: running focus survives Goal journey → Today with the running status strip and a way back. Source expiry handling updates the strip without forcing another internal view to change. Hidden-tab throttling was not independently tested.
- F05: adding a fifth step produces 4/5 then 5/5 progression; selecting the completed comparison record retains its own custom instruction/context. Current labels agree with finished/open status. Geometry and minute totals remain explicitly illustrative.

Corrected saved-action layout inspected at actual DOM dimensions 1280×720 and 390×844; no horizontal overflow in those checked states. Also observed a narrower 325×703 view without horizontal overflow. This was targeted coverage, not a full rerun of every builder check at both widths. Warning/error log query returned no entries. Desktop/phone evidence: [saved desktop](correction-evidence/saved-action-desktop.png), [saved phone](correction-evidence/saved-action-mobile.png), [Undo restored](correction-evidence/undo-restored.png), [finished Today](correction-evidence/finished-consistent.png). Viewport override removed; preview left paused on the saved instruction.

Builder reports 14 Chrome check groups including keyboard/reduced-motion/extension coverage. Those were read, not independently rerun in full here. Chrome/Comet personal-profile, hidden-tab/background, sleep/closure and physical-device parity remain unverified. Reload reset is intentional; no persistence or real records added. Production source not edited by this review and no full app suite rerun.

**Next:** obtain learner approval of the visual direction, then Step 02 contracts and early reminder feasibility. Do not keep dispatching Task 01a or mark Step 01 accepted on the learner’s behalf. The tracker retains 0/8 fully accepted slices pending that decision. No commit, push, deployment or service enrollment.

---

Reviewed October 24, 2026 against the current requirements ledger, design brief and Step 01 task. Target: http://127.0.0.1:52254/. This is a fictional in-memory visual proof, not the production Trail app.

## Verdict

Promising visual direction; requires a bounded correction before integration. Light surfaces, dark typography, deliberate gradient accents, a distinct contour/ribbon/arch object and action-first composition fit the requested direction substantially better than the rejected pixel presentation. The saved next move and goal lifecycle still contradict the core product. Learner visual approval remains pending. **0/8 core slices accepted.**

## Findings, ranked

### F01 · P1 — Saved return instruction is secondary to the old next action

Reproduce: Resume focus → Pause → enter “Independent review: reopen the saved comparison table.” in When I’m back → Save & return to Today → Resume.

Observed: the saved text appears under Where you left off; the main next-action heading and focus instruction remain the original precision/recall instruction. The field explicitly promises a return instruction, but it behaves like a historical note. This undermines the primary requirement: see exactly what to do next without reconstructing context.

Correction: distinguish the next instruction from optional historical context. An explicitly saved return instruction becomes the primary action on Today and Focus for that unfinished step; keep the original step title available. Skip retains the previous saved place. No AI or mandatory note.

Source: proof.js instruction/today/paused and pause-form submission (lines 53, 67, 109). Evidence: [saved-next-action-mobile.png](evidence/saved-next-action-mobile.png).

### F02 · P1 — Undo discards the saved return context

Reproduce: save a custom return instruction → Resume → Complete step → immediately Undo.

Observed: step reopens, but the saved text is replaced by “Completion undone. Your illustrative focus effort is kept.” The original handoff instruction is lost inside the current example.

Correction: snapshot the affected in-memory state before completion and restore it on Undo, including instruction/context and the relevant timer position. Keep legitimate elapsed effort; do not fabricate additional effort. Do not introduce persistence in this proof.

Source: proof.js complete() line 86 and Undo line 106. Evidence: [undo-context-desktop.png](evidence/undo-context-desktop.png).

### F03 · P1 — Confirmed finished goal returns to an unfinished review loop

Reproduce: complete the two remaining steps → Confirm goal finished → View finished work → Today → Review goal.

Observed: route says Goal finished, while Today asks whether the same goal is complete and offers a focus-duration selector. Review opens another confirmation; confirmation can replay the major reward. Keep goal open merely closes that dialog without clearing the finished state.

Correction: render confirmed finished state consistently across Today, journey and finished collection. Normal navigation must not re-offer confirmation or replay celebration. Revisit the finished record, with a clear next destination. If reopening is shown, make it explicit and internally coherent; do not expand this task into production history editing.

Source: proof.js today() line 53, showReview() line 83, celebrate() line 87, keep-open line 102. Evidence: [finished-goal-back-on-today.png](evidence/finished-goal-back-on-today.png).

### F04 · P2 — Internal navigation silently stops the running block

Reproduce: Resume → Goal journey in the top navigation → Today.

Observed: the active timer stops and Today returns to Resume, without a deliberate Pause or explanation. This is internal navigation, not a reproduced browser-tab-switch failure. Source go() unconditionally stops a running clock.

Correction: keep a simulated running block active across ordinary view navigation, with a visible way back to focus, or make leaving an explicit understandable pause action. Prefer continued focus without surprise. Explicit Pause must still stop immediately. Verify expiry while viewing another page does not silently hijack navigation.

Source: proof.js go() line 78 and interval line 82. Source and connected UI inspection; no independent background-tab/Comet claim.

### F05 · P2 — Connected fixture labels and history drift apart

Observed: after all steps are checked/goal confirmed, Today still reports Most recent block: 20 min · unfinished; the route footer still says Comparison checked when the next work has advanced. Journey's comparison record reads the same global note that subsequent steps overwrite, attaching later return instructions to an earlier record.

Correction: make demonstration statuses, selected record context and route labels follow the current fictional scenario coherently. Static illustrative minutes may remain static and labelled; a real effort ledger and variable-length geometry are outside this proof. Do not claim that a fixed preview statistic is real recorded work.

Source: proof.js scene/today lines 52–53 and journey line 68. Visible in finished-goal-back-on-today.png and connected journey inspection.

## Visual assessment against the requested product

| Requirement | Assessment |
|---|---|
| Next executable action first | Strong baseline placement; F01 prevents the saved return instruction taking precedence. Greeting can be quieter than the action. |
| Stripe/Linear inspired restraint | Good direction: light shell, dark text, measured spacing, concentrated contrasting colour. User acceptance still needed. |
| Daily route + longer goal landscape | Both visible and linked; contour/ribbon/arch is a proposed design, with illustrative mapping. It is more sculptural than a literal Strava map. |
| Gentle focus | Calm and readable. Focus is mostly static/white; any ambient colour or motion should stay subtle and optional. This is refinement, not a reason to restart. |
| Small versus major reward | Distinct small completion tick and finite full-goal gradient overlay. Major lifecycle needs F03. |
| Whole-screen colour transition | Present; large white inner panel dominates the celebration. Whether to let more of the gradient show is a learner preference, not a confirmed bug. |
| Neutral finished collection with colourful work card | Present and coherent visually. Finished-record lifecycle needs F03. |
| Minimal friction | Optional note/context, immediate pause, skip, explicit resume and editable additional step are present. F01/F02 affect the central return loop. |
| Truthful demo | Fictional/in-memory labelling is prominent. No claim of actual ML submission or external-work observation. |

## Independently exercised

- Actual DOM viewport dimensions 1280×720 and 390×844; ordinary Today, focus, pause, saved return, journey, final review, celebration and finished state examined. At 390×844 the ordinary Resume button ends around y=540; the long-instruction variant ends around y=830. No horizontal overflow observed in those Today variants.
- Complete/Undo, last-step review, explicit goal confirmation, finished → Today repeat, internal navigation during focus, block-ended/extension controls, first-use state, added step and blank validation.
- Empty added step rejected with a helpful validation message. Input containing angle brackets, ampersand and quotation marks rendered literally and became the next step. Dialog Escape dismissed without goal confirmation. First use clearly says creation is not implemented.
- No captured warning/error entries returned by the tab log API during this review. This is not a security or full accessibility certification.
- Screenshots retained under evidence/. Preview returned to reset Today and viewport override removed.

## Boundaries and unverified work

Persistence/reload recovery, task creation, real focus accounting, AI, ranking, streak, real notifications and floating window are intentionally unbuilt in Step 01. Their absence is **remaining product work**, not a regression of this static proof. Do not integrate until corrections and learner visual feedback are resolved.

Builder reports Chrome 155.0.8059.40 checks and partial Comet 155.0.8059.148 coverage. This review used the in-app browser; it did not independently repeat personal-profile Chrome/Comet, cross-tab/background throttling, physical-device testing, reduced-motion emulation, full keyboard traversal or the builder’s reported 55 groups. CSS reduced-motion guards and builder evidence are source/reported evidence, not independent testing. No full app test suite rerun: app source was not changed.

## Next

Give OpenCode [01a — proof corrections](../../build-tasks/01a-proof-corrections.md) using GPT-6.1 Sol, medium. Return here for review; accept direction with the learner, then settle Step 02 contracts. No proof/runtime code, dependency, Git or deployment changes were made by this review.
