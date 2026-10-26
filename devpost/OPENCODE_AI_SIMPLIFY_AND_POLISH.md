# OpenCode — simpler input, distinctive AI card, cleaner apply flow

Use GPT-6.1 Sol Medium. Workspace /Users/mitku/Documents/Hackathons/Devpost/Build_With_AI. One writer; Codex independently reviews after completion. This is the next bounded presentation/capture simplification, not an AI rebuild. Target45–55 minutes INCLUDING15–20 minutes verification; protect today's18:00 IST target/19:00 fallback delivery. If time is insufficient, deliver a coherent safe slice and report unfinished items; never weaken checks or silently expand scope.

## Read and establish baseline

Read AGENTS.md, README.md, HANDOFF.md current top, devpost/scope.md, prd.md, design-brief.md, spec.md, checklist.md, INDEPENDENT_AI_DISCOVERY_REVIEW.md and GEMINI_PLANNER_EVIDENCE.md. Inspect branch/status/diff. Reviewed HEAD was2d53bc1 on codex/trail-redesign with local AI/discovery edits; preserve all pre-existing work, ignored private files and ZIPs. No checkout/reset/clean, branch/commit/push/deploy/submission or new dependency.

Record exact cross-file changes in devpost/AI_SIMPLIFY_IMPLEMENTATION_PLAN.md BEFORE editing. Capture isolated light/dark desktop/phone baseline. Inspect actual plannerHTML/createPlanner, work editor/capture hooks, relevant CSS/tests. Current preview52255; stale3000 returned404 for planner/status. Verify actual served assets before blaming source. Never kill unidentified servers or migrate/delete records to change ports. Different origins have separate records. No live Gemini requests; initial3-call budget is exhausted. Use mocks only.

## Product direction

The experience is: type or use DEVICE dictation → Draft my trail → review/edit suggestion → Use this plan → review normal fields → Save goal → explicit Start later.

User explicitly chooses OS/keyboard dictation instead of Trail recording/transcribing audio. Website must not claim that it provides universal dictation or can activate device dictation. This supersedes the previous requirement for visible recording/transcription controls. Preserve textarea input, paste, IME and manual creation.

AI panel should look considered and distinct within Trail, not like a generic grey form and not like a separate chatbot product. Keep existing palette, type, radius/spacing language, mountain identity and surrounding UI.

## A. Single description input: retire web recording controls

- Remove visible Record/Stop/Discard audio/Transcribe/transcript insertion UI from new-goal planner. No microphone button that appears to trigger an OS facility. No navigator speech-recognition replacement, hotkey simulator, device detection/shortcut table or new audio provider.
- Disclosure becomes “Describe your goal”. Title stays “Plan with AI”. Supporting sentence: “Turn a rough idea into clear steps you can edit.” Below the labelled textarea, show “Type your goal, or use your device’s dictation.” Keep textarea empty with useful placeholder; never prefill or autosubmit it.
- Explain that dictated text can be corrected before generation. Do not promise audio privacy/processing for the user's OS or claim it is all offline. Trail's own request remains text plus explicitly entered optional deadline/budget.
- Remove recordingHTML injection/import from work.js and visible recorder-specific statuses, limit copy and source choices. Prefer leaving unused exported recorder helper/server transcription route and their existing unit/security tests intact for this bounded pass; do not perform a broad backend cleanup. Document them as retained, unused by current UI. Do not falsely claim the server endpoint or recorder helper was deleted.
- If current createPlanner still instantiates a recorder solely for cleanup, keeping that inert wiring is acceptable if it never requests media and generates no recorder UI. Do not alter recorder internals to achieve a cosmetic removal. Preserve controller cancellation, allowed/ownership guards, navigation/visibility cleanup and late-result protection for text planning.
- Existing pagehide/visibility cancellation messages should be generic to current text AI requests, not talk about recording when none occurred. Remove dead UI-facing dispatch cases only if a small safe change; helper cleanup is not a completion requirement.
- Do not send source automatically; keep explicit Draft my trail and no automatic retry.

## B. AI card visual specification

Use existing tokens and Trail's own blue/violet/cyan family. No new fonts/images/packages/browser assets. No external asset fetching. Keep the public allowlist at nine files.

Idle card:
- Small Trail-owned decorative geometric star/route accent in an aria-hidden inline SVG or CSS treatment; do not draw an imitation Gemini logo or fetch an unverified official logo. The AI heading and provider explanation convey function; decoration is not a button.
- One restrained blue→violet accent line or border treatment, about1px, with a faint cyan/violet radial wash in a corner. Keep the main text surface almost neutral. No saturated full-card rainbow, giant glow, glass blur or gradient text paragraphs.
- Light theme: near-white/lavender-tinted surface, readable dark text and subtle cool border. Dark: raised blue-grey surface distinct from page, pale readable text and controlled violet/cyan edge. Reuse established tokens; any new tokens must be scoped to this card.
- Add appropriate padding around18–24px desktop/16–20px phone with existing rounded corners. Keep initial card compact, roughly200–240px or less at390px where text permits; do not force fixed height or clip zoomed text. Manual route must remain visible nearby.
- Primary Draft my trail button may use a restrained blue/violet fill if accessible text contrast remains clear; preserve recognizable disabled/busy states. One primary action per stage.
- Native disclosure/keyboard operation, >=44px touched hit areas, visible focus, logical heading order and high-contrast text. No hover-only instructions or colour-only availability. Don't change the entire site's theme.
- No new looping animation. Busy state uses concise “Drafting your plan…” and accessible status; a small optional indicator respects reduced motion. Never fake progress percentage or success.

Provider identity: use a small factual indication such as “AI suggestions · Gemini API” near the panel or privacy details, subject to applicable official branding guidance. Avoid a decorative Google partnership badge or implying endorsement. Retain accurate provider processing disclosure. User requested charm; implement it through Trail-owned colour/geometry rather than a third-party logo dependency.

## C. Correct the independent-review findings

1. Replace copy-prefix UI logic. Current planner.js and work.js use message.startsWith('Suggestion copied') to detect apply success. Add a tiny explicit UI-only marker to the existing in-memory planner state (for example appliedToManual:boolean). No schema/storage changes. Set only on successful transfer, clear on restore/discard/new source/proposal replacement as appropriate. Ordinary manual edits may retain “not saved yet” confirmation while no goal is saved. Define transitions explicitly in the plan. Never derive behavior from English copy.

2. Meaningful destination. Before apply, manual heading “Or build your plan manually”. After apply, “Review and save your plan” with adjacent “Plan added to these editable fields. Not saved yet.” Keep Save goal and Start separate. Restore resets the heading appropriately. This is UI state, not a new domain event.

3. Reduce duplicate scroll after apply. After successful Use this plan, set the MAIN AI disclosure closed (s.open=false) while retaining description/proposal, backup and any optional context. Show a compact applied-status summary in the always-visible card and an explicit “Review AI suggestion” disclosure/reopen label. Focus/instantly reveal the manual destination once, only after success. No rerender-wide scrolling or focus theft. Reopening must recover all edits and accessible restore/discard controls. Do not auto-delete proposal or hide the manual form; no new modal or multi-step wizard.

4. Restore/discard feedback must be truthful. Discarding an AI suggestion after apply must not silently clear already populated manual fields. Restoring a previous manual draft must restore the existing backed-up fields/IDs/estimates under the existing semantics. Do not let a closed disclosure make recovery impossible. Don't promise synchronization between the editable proposal and manual copy: after apply, manual fields are the editable copy; explain “Apply again replaces the manual draft” only where needed, respecting the existing backup guard.

5. Keep review lean. Retain editable title/finish condition/actions/estimates/add/remove/reorder. Show “Not saved yet” and “Estimated time” consistently. Keep unknown/over-budget warnings; omit empty assumptions/conflicts headings if arrays are empty, without dropping nonempty findings. Avoid duplicating the same explanation around every action. Do not change validated model response shape, action counts or estimate math.

6. Raw recorder phase wording disappears with recorder UI. No need to spend time polishing an unused recorder. Existing planner error/manual fallback remains clear and preserves drafts.

## D. Security and scope boundaries

Expected runtime files: demo/planner.js, narrow editor/import/heading code in demo/work.js and scoped demo/styles.css. Update directly affected browser tests and concise current README/scope/design/spec/HANDOFF/checklist descriptions to accurately distinguish retired recorder UI from retained helper/endpoint. Do not rewrite historical evidence.

Protected: state.js, storage.js, timing.js, activity.js, proof.js, index.html, scripts/ai.mjs, scripts/serve.mjs, build/package/config/private files. No API/schema/model/key changes. No workspace/history/links/notes to Gemini. IDs remain app-generated; estimates are suggestions, not effort or calendar/timer allocations. No existing-goal AI rewrite, multi-goal, new AI feature, restore/import, extension, reminders or scheduling.

Do not read/print secrets or use live scripts. No env injection or credential in client/URL/log/response/commit. No real records cleared/created for screenshots; use isolated profiles and fake providers.

## E. Meaningful verification

- npm run check; npm test; npm run build; git diff --check. Record actual counts/results, not copied previous51.
- Run focused planner browser composite with fake provider only. Update old recorder-UI assertions because removal is intentional, NOT by disabling the planner suite. Retain dedicated recording unit/server transcription/security tests for retained helpers/routes. Explain removed UI assertions and retain no-media/no-audio-network assertions for the new product path.
- Keep prior proposal validation, XSS escaping, no credential/network exposure, cancellation and late-result guards, manual/source preservation, exact aborted storage Retry, stable IDs/estimates/reorder/reload, no pre-Save writes/no Start and fictional/existing-goal isolation checks.
- Add focused assertions: zero getUserMedia/audio requests from entire current UI; text-only generation; description survives ordinary type/paste/collapse/mode navigation consistent with current draft rules; copy changes cannot affect applied-state behavior; successful apply closes only the AI panel and focuses correct manual heading; source/proposal/backup recover after reopen; restore resets heading; discard does not wipe manual fields; collapsed/new-source transitions cannot lose manual drafts. Test IME/paste through existing inputs without capturing arbitrary OS speech.
- Inspect light/dark desktop1440x900 and phone390x844 screenshots: collapsed idle AI card/manual route, description, drafting/cancel, proposal with unknown/over-budget, applied collapsed panel + visible manual fields, reopened suggestion/recovery, failed/unconfigured Gemini with manual save. No forced minimum wide rows, horizontal overflow, clipped long text or keyboard focus rings. Inspect gradients at normal scale, not just fullpage thumbnails.
- Verify native keyboard disclosure, labels, disabled and busy controls, >=44px actions and reduced motion. Test actual textarea accessibility, not mock OS dictation. Device dictation itself remains user validation.
- Run relevant existing editor gates if touched. One final complete retained+planner suite preferred within reserve; do not omit an available substantive test merely for cosmetic scope. If an environment blocks execution, report precisely and do not install tooling or weaken assertions.
- Verify nine-asset output/source/served parity; no server/private output. Fresh served preview may require a new identified process; preserve user records and report origin.

## F. Completion and stopping

Update AI_SIMPLIFY_IMPLEMENTATION_PLAN.md with results; add AI_SIMPLIFY_EVIDENCE.md with exact changed files, before/after screenshots, final commands, preview origin, retained unused audio infrastructure, mock-only distinction and honest limits. Update current top of HANDOFF/checklist. No broad historical doc rewrites.

Final response: what changed and click path, tests/counts and actual failures, screenshot paths, preview URL/storage-origin distinction, unverified user/device/hosted aspects and remaining delivery gates. Stop for Codex review/user visual acceptance. No additional AI feature or deployment automatically.

## Explicitly deferred AI idea

A future “Make this step smaller” action might be useful, but is NOT authorized in this pass. It would need a new-goal/proposal-only scope, explicit submission of only selected text, editable preview/acceptance, provider budget and dedicated validation. Do not implement AI importance sorting, background coaching, existing-workspace analysis or automatic replanning while polishing this card.
