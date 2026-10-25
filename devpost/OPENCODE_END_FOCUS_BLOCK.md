# Next correction: end a block without completing work

Use the current configured coding model at Medium reasoning for implementation. This is a narrow correction, not a product rewrite. Preserve token efficiency: read the required current documents and relevant functions once; run focused checks during development and the existing complete suite once after the final runtime edit. Do not spend tokens re-researching the product or retelling old handoffs.

## User-approved outcome

The user confirmed that paused work must be able to end its focus block while leaving its action unfinished. Current code locks action insertion/reordering while an active block exists. Only completing the action releases that block, which forces a false outcome when a prerequisite or changed plan is discovered.

Implement one explicit **End focus block** operation, available when timing is stopped. Keep the action unfinished, retain its saved place and all recorded effort, and release the active block so the existing goal editor can add/reorder otherwise valid actions. A later Start creates a fresh supported block; it never silently resumes the ended block.

## Baseline and ownership

- Work in the existing local checkout and preserve all current changes. Local HEAD is 041fe89 with imported source from verified origin/codex/cloud-review-final at 24b7126c25e582cda3ddb1286d3c7444bf516395 plus local review documents. Do not reset, switch branches, cherry-pick or apply the cloud patch again.
- Read AGENTS.md and required product docs, current HANDOFF/checklist, and CRITICAL_PRODUCT_REVIEW_2026-10-25.md. The newest local header supersedes old cloud branch/pending-marker wording.
- One runtime editor. Record exact planned files, session representation/invariants and failure semantics before editing. State validation, controller, tests and current docs are expected to change; explain any additional file first.
- Independent baseline syntax, 22 tests, build, diff and complete Chromium suite passed. Review receipt: LOCAL_CLOUD_REVIEW_EVIDENCE.md.

## Required semantics

1. Permit ending only an existing paused, interrupted or expired block. Running state must ask the user to Pause first; a stale/end command must not silently stop or credit a running interval. No active block must reject visibly without mutation.
2. Store a distinct, explicit terminal block state using the smallest compatible canonical representation. Do not mark the action, goal or completion event finished. Record the representation in spec/evidence; existing schema-v1 records must still load. Validate relationships so ended blocks cannot remain active or resume/extend as active blocks. Do not weaken validation or repurpose an action-completion field to fake the outcome.
3. Atomically retain session identity, immutable effort intervals/totals and context while clearing activeSessionId. Require normal ownership/revision and exact operation receipt semantics. Publish success only after the transaction commits. This is a domain mutation and follows existing Undo invalidation rules; do not introduce a second Undo mechanism.
4. A failed end operation preserves its exact pending command, visible error and Retry. Before commit, the structural lock remains. Retry applies once, without duplicate effort/outcome events or false success. Timing remains stopped throughout.
5. Leave actions/goal open, checked states unchanged, selected/current identities coherent and context/URL/save timestamps unchanged. Ending earns no mountain travel, checkpoint, summit, confetti or saved-place timestamp. Useful stopped context remains a campsite.
6. After success, the existing editor may add/reorder actions as normally permitted. Existing context/session/completion removal protections stay intact. Reordering may change the first unfinished action; old notes/effort remain attached to their original IDs.
7. Existing Start creates a new block on the current unfinished action, with no implicit start on navigation/end/edit/reload. Recorded goal effort includes previous ended sessions. Reload and cross-tab ownership stay conservative.

## Small UI change only

- Provide a reachable secondary End focus block control in stopped real Focus, with concise explanation: ending the block keeps the action unfinished and recorded effort.
- Make the route to this control clear from the blocked goal editor; prefer reuse of the same command/control rather than another flow. Disable correctly while busy/pending or read-only.
- After committed success, show a clear stopped/no-active-block state and a useful route to Edit goal/actions or Start a new block. No forced new session, second modal, broad layout or typography change.
- Preserve the accepted terrain, traveller/campsite, light/dark themes, Focus composition, real/example isolation, optional motion, and all existing return/Retry/Undo contracts. Do not claim real support through a fictional-only control.

## Acceptance checks

- Regression reproduces old failure: create two actions → start → pause → attempt adding a prerequisite/reorder. Then demonstrate end block → add/reorder succeeds with no completed action/goal/event.
- Paused, interrupted and expired ending preserve exact session/interval totals, context/reference, IDs and remaining-time record. Running/no-block/stale/foreign-owner commands reject without mutation.
- End after a real committed checkpoint; abort the end write; verify lock and exact pending Retry, then successful idempotent retry. No extra time, completion or celebration.
- Reload after ending; no active block, no Resume of the terminal block, action unfinished. Start a fresh supported block explicitly, record effort, and verify aggregate old+new effort without double counting.
- Finish/completion/Undo/history still work after multiple ended blocks on one action. Existing context/recorded-action removal guard remains protective.
- Reorder after end with saved context: first unfinished identity updates correctly; prior notes/resource/effort remain action-scoped. A failed edit/Retry must not scramble order.
- Browser checks cover actual IDB transaction abort/Retry, paused Focus/editor control accessibility, keyboard, light/dark and 390px reachability, no false mountain/reward effect, and two-tab read-only behavior.
- Run syntax, meaningful new Node regressions, build parity, diff check and full existing Chromium suite after final runtime changes. Fix failures or report exact blockers; do not weaken existing assertions to pass.

## Stop boundary

Do not implement explicit note clearing in this pass. No streak/audio/AI/sync/reminders, graphics overhaul, backend, dependencies, hosting or submission. Update HANDOFF, checklist, spec/README where necessary and an evidence file with changed paths, command results, captures and limitations. Stop for independent review. No commit, push, merge, deployment or submission.
