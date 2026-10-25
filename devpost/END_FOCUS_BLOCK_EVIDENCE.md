# End focus block — local implementation evidence

25 October 2026. Implemented only OPENCODE_END_FOCUS_BLOCK.md. HEAD remains `041fe89ac9b27d91973f39b9505d39e0e64ce998` on `codex/trail-redesign`; imported cloud source and unrelated local changes are preserved. No reset/branch switch/cherry-pick/reimport, commit, push, merge, deployment or submission. **Stop for independent review.**

Preview: http://127.0.0.1:3000/. Planned paths/invariants/failure contract were recorded before editing in END_FOCUS_BLOCK_PLAN.md.

## Canonical representation and UI

- Schema remains v1. A session gains explicit terminal status `ended`, without new fields or migration. Existing v1 fixtures/tests remain valid. Ended sessions cannot be active or owned; validation rejects either relationship. Extend now explicitly accepts only paused/interrupted/expired active sessions; Resume likewise cannot revive an ended block.
- `end-block` requires sessionId, ownerToken and expectedRevision, and accepts only an existing paused/interrupted/expired block. Running asks Pause first; missing/stale/foreign operations reject without input mutation. Storage still enforces live owner/revision in the existing strict IDB transaction; no storage-engine changes.
- Only status/owner and activeSessionId change, alongside normal operation receipt, revision/updatedAt and Undo invalidation. IDs, remaining/allocation/credited time, checkpoint/sequence/interruption metadata, immutable intervals, context/URL/save timestamp, action/goal checked status and completion events remain unchanged. Exact accepted receipt replay returns unchanged state before stale checks.
- One secondary End focus block control/explanation is reused in stopped real Focus and the locked editor. Success renders only after commit: Focus shows no active block with explicit Start/Edit, or the editor retains its draft and unlocks valid insertion/reorder. End never invokes completion/travel/reward callbacks. Useful stopped context retains its campsite. Ended sessions continue protecting action removal and contributing recorded effort.
- On abort, the same stopped active session and structural lock remain, draft is preserved, mutation controls disable, error/Retry remain visible and the exact command/callback are retained. Retry commits once; no duplicate effort/event or false success. No automatic Start or Resume on End, edit, navigation or reload.

## Regression and verification results

Before runtime edits, the three new domain tests failed with Unknown command. They first reproduce the existing paused-block structural lock, then require End → successful prerequisite insertion/reorder without completing any action. After implementation:

| Command/check | Result |
| --- | --- |
| `node --test tests/state.test.mjs` | 19 passed, 0 failed. |
| `npm run check` | Passed. |
| `npm test` | **25 passed, 0 failed**; includes seven-asset serving/build parity and timing tests. |
| `npm run build` | Passed; same seven static assets. |
| `git diff --check` | Passed, including final docs. |
| `TRAIL_GATE=end-block ... node tests/browser.mjs` | Passed focused gate. |
| Complete `node tests/browser.mjs` after final runtime edit | **All eleven gates passed**, exit 0; existing assertions retained. |

Final full command:

```sh
TRAIL_EVIDENCE=/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-end-block/full node tests/browser.mjs
```

Domain coverage verifies paused/interrupted/expired terminal transitions, exact preservation of session/interval/context/action/goal/event records, no Resume/Extend, malformed terminal relationships, running/missing/stale revision/session/foreign-owner rejection without mutation, successful replan, fresh block identity, action-scoped records/removal protection and aggregate effort through multiple ended blocks, completion, Undo and history.

Browser coverage uses a genuine timer checkpoint followed by committed Pause/context save. It aborts the actual End IDB write, checks the unchanged durable snapshot/lock/draft, then records both commit calls and verifies byte-equivalent command payloads on Retry, one revision and no changed outcome/context/effort. Exact receipt replay through LocalStore is not applied twice; stale-revision and foreign-owner transactions reject unchanged. An aborted prerequisite/reorder save retains old durable order and draft IDs; Retry produces the intended order with saved notes/link/effort still attached to the original action. Reload shows no active block/Resume; explicit Start creates another ID. Two End paths (editor Enter and Focus Space), multiple ended sessions on one action, new credited effort, completion/Undo and explicit finished history all pass. A read-only second tab cannot End/Resume. Deterministic interrupted/expired fixtures use actual canonical IDB commits and verify the same controls and exact preservation after End. Running-control injection asks Pause first without stopping/crediting via End. Existing complete suite covers timing/ownership/recovery, examples, returns/Retry/Undo and marker/motion/reward contracts.

The focused harness was corrected during development to use the actual `camp` station token, a positive committed interval rather than assuming the floored timing sample is exactly 5,000ms, and explicit Start on subsequent no-block actions. No existing assertion was weakened. Final gate reports no page errors in the main end-block context.

## Captures and visual inspection

Final capture directory:
`/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-end-block/full/`

- `end-block-focus-{light,dark}-{1440,390}.png`: stopped Focus secondary control and explanation, keyboard-accessible and scroll-reachable. Tests check enabled control fits viewport after scrolling and no horizontal document overflow.
- `end-block-abort-390.png`: blocked editor/draft, disabled controls and visible failed-save Retry; no success publication.
- `end-block-{interrupted,expired}-390.png`: post-End no-active-block Focus with explicit Start/Edit, no Resume/Extend.

Inspected light 390px stopped Focus, failed editor and no-active Focus captures plus final dark 1440px Focus. Existing composition/terrain/styles are unchanged. On a short phone viewport, the lower secondary control uses normal document scrolling; no overlay/modal or nested scroll was added. Existing keyboard focus styling remains visible. These are implementation inspections, not user visual acceptance or a full screen-reader audit.

## Exact changed paths and limits

Runtime: `demo/state.js`, `demo/work.js`.
Tests: `tests/state.test.mjs`, `tests/browser.mjs`.
Docs: `README.md`, `HANDOFF.md`, `devpost/spec.md`, `devpost/checklist.md`, new `devpost/END_FOCUS_BLOCK_PLAN.md` and this evidence file.

No edits in this correction to proof.js/artwork/styles.css/storage.js/timing.js, dependencies or allowlists. Their existing imported modifications remain untouched. No explicit note clearing or other features implemented.

Independent review is pending. Physical Mac sleep/wake, phone hardware, branded browsers/native BFCache and user value/visual acceptance remain unverified. No deployment/submission readiness claim follows from these tests.
