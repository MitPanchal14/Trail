# OpenCode dispatch — make Trail's existing AI planner discoverable

Use GPT-6.1 Sol Medium. Implement this bounded presentation task in the existing workspace /Users/mitku/Documents/Hackathons/Devpost/Build_With_AI. Do not rebuild AI. One writer; Codex independently reviews afterward. User wants an accepted, hosted, recorded product by 18:00 IST today, with 19:00 fallback. This pass gets 45–55 minutes total, including at least 15–20 minutes for verification and handoff. Time is a scope cap, never permission to leave unsafe changes or claim unrun checks. If the window is exceeded, finish the smallest safe coherent slice and report remaining work.

## 1. Read and establish facts

Read AGENTS.md, README.md, top current sections of HANDOFF.md, devpost/scope.md, prd.md, design-brief.md, spec.md, checklist.md, RESEARCH_IMPLEMENTATION_AUDIT_2026-10-26.md and GEMINI_PLANNER_EVIDENCE.md. Inspect git status/branch/diff before editing. Expected last reviewed local HEAD is 2d53bc1 on codex/trail-redesign with substantial uncommitted AI work. Preserve every pre-existing change, private ignored file and both ZIPs. A mismatch requires inspection, not reset, checkout or cleanup. Record exact intended cross-file changes in devpost/AI_DISCOVERY_IMPLEMENTATION_PLAN.md before editing.

Read demo/planner.js and relevant editor/render/capture handlers in demo/work.js, scoped CSS and existing planner browser harness. Reuse the implementation. Do not reread unrelated research or install packages. No broad refactor/formatting churn.

Known audit: old port3000 server serves new work.js but returns404 for planner.js/api/ai-status; current reviewed preview was port52255. Verify the current origin/assets/config flag before attributing missing UI to source. enabled:true means configured, not provider health. Do not terminate unidentified processes. If a fresh server is needed, start a clearly identified task-owned loopback server and report its origin; verify served bytes. Different ports have different IndexedDB records: never clear/migrate real records or imply missing records are lost.

## 2. Product outcome

A first-time visitor opening a NEW REAL goal should immediately understand: "I can describe or speak what I need to do; Trail can suggest editable actions and rough estimates; I choose what to keep."

Current problem: the feature hides under “Describe your goal (optional)”; expansion produces too much explanatory copy and competing controls. Make discovery obvious and the sequence calm. Keep the existing mountain identity, restrained blue/violet/teal palette, light/dark themes, typography, rounded surfaces and manual editing. No chatbot, flashy gradient hero, dashboard redesign, wizard framework, new imagery or dependency.

Trail's central promise remains saving and recovering the exact next move after interruption. AI is an optional setup aid, not the whole app.

## 3. Exact presentation requirements

### A. Visible compact entry before manual fields

In the new real-goal editor, place a compact, clearly visible AI entry above the manual goal fields, in normal document flow. It must be visible without expanding an ambiguously named disclosure.

Preferred copy:
- Heading: “Plan with AI”
- Supporting sentence: “Describe it or say it. Turn a rough idea into steps you can edit.”
- Small honest attribution: “Powered by Gemini · optional”
- Explicit disclosure/entry: “Describe or record your goal”

A compact always-visible entry with an initially collapsed panel is preferred over a long expanded form pushing manual creation below the fold. No automatic focus theft on opening the editor; preserve existing manual title focus unless user activates AI. Label the manual section “Or build your plan manually” for new goals only. Existing-goal editing remains unchanged.

Do not add a redundant hero, modal or home-level CTA that fails when another goal is open. AI remains absent from fictional examples and existing-goal rewriting.

### B. Description stage

On explicit expansion, expose a labelled description field first. Use a short visible example or placeholder, such as: “I need to prepare a five-slide presentation for tomorrow. I have 90 minutes and still need research, slides and a rehearsal.” It is a placeholder only: never prefill/send fictional text, create records or imply that output was generated.

Keep “Draft my trail” as the clear generation action, with concise helper copy “Creates a suggestion. Nothing is saved or started.” Typing remains fully usable without microphone support. Retain the description limit and all validation.

Keep deadline text and available minutes optional, grouped compactly beneath description/voice controls. They may remain visible as two responsive fields; a new disclosure is unnecessary if it requires more state/capture machinery. Label “Deadline (optional)” and “Time available in minutes (optional)”; concise nearby copy must explain that these guide a suggestion, not calendar scheduling. No “timeline created” promises.

Keep one short disclosure near the request action: “Only this description and optional planning details are sent to Gemini. Saved work and history stay local.” Put longer explanation in an accessible secondary details area or existing documentation. Do not erase necessary consent, reload-loss or provider-processing facts; place them where relevant instead of repeating them at every step. Do not claim zero retention or that submitted text never leaves the device.

### C. Voice as an alternative source

Use the existing bounded recorder/transcriber. Do not replace it with browser speech recognition, a third-party SDK or new endpoints.

Initial state should emphasize “Record instead” (or equivalent clear label). Clicking it is the explicit permission action; expanding the AI panel itself must never request microphone access. Keep the short 60-second limit visible.

Make recording/ready/transcribing states readable. Show or emphasize actions appropriate to the current phase: stop while recording; Transcribe with Gemini and discard when audio is ready; cancellation while requesting. Avoid four equally prominent inactive controls in the idle state. Reuse existing state/sync logic and semantic disabled/hidden attributes; do not invent a second recorder state machine or derive state from status strings. Controls must still support keyboard use and safe cleanup. If hiding controls adds lifecycle risk, retain the stable DOM and reduce visual prominence with clear disabled state instead.

Before transcription, clearly state that the explicit Transcribe action sends the recording to Gemini. Recording alone does not send it. Transcript stays separately editable, with explicit append/replace into description; generation is a separate user action. Show “Review the transcript” at that stage. No auto-transcribe, auto-insert or auto-generate. Retain accurate memory-only handling and unsaved-draft/reload limitations.

### D. Review and apply stage

Make “Review your suggested plan” and “Not saved yet” apparent when a proposal exists. Keep title, observable finish condition, actions, estimates, add/remove/reorder, assumptions/conflicts and validation. Use consistent spacing and responsive action/estimate controls; avoid decorative step counters or duplicate summary blocks.

Show estimates as suggestions, including unknown/incomplete totals and over-budget warnings. Never suggest that an exact budget fit guarantees feasible completion. No calendar or timer allocation changes.

Keep “Use this plan” with concise explanation “Fills the editable fields below. Save goal is still separate.” Preserve previous manual draft backup/restore/discard. On successful apply, clearly confirm transfer and reveal/focus a sensible manual section heading/control without scrolling on every render. Use native focus/scroll and respect reduced motion if movement is added. Do not hide or discard source/proposal/manual content merely to shorten the page. Do not imply already saved. Keep Save goal and Start separate explicit actions.

### E. Failures, availability and manual fallback

Manual creation must work when Gemini is unconfigured, unavailable, cancelled, malformed, rate-limited or recording is unsupported/denied. Preserve drafts on failures and no automatic retries. Reuse the existing configured-status mechanism; no new health probes or provider requests. Do not label configured status as verified live availability.

Use plain short copy identifying what happened and the available manual/explicit retry path. Keep provider-request cancellation separate from exact storage Retry. Show/emphasize Cancel AI request only while relevant, using existing request state, without breaking cancellation or tests. Preserve accessibility status announcements without repeatedly announcing the entire form.

## 4. Scope and invariants

Expected runtime scope: demo/planner.js, narrow new-goal presentation/focus changes in demo/work.js, scoped demo/styles.css. Update only directly relevant test selectors/assertions in tests/planner-browser.mjs or existing browser harness if necessary. Documentation/evidence updates follow verification.

Do not change demo/state.js, storage.js, timing.js, activity.js, proof.js, index.html, scripts/ai.mjs, server/build configuration, schema, API contracts, dependencies, model or environment configuration for this presentation pass. If a genuine blocker appears there, document it for review rather than expanding scope. Do not rewrite existing uncommitted AI changes.

Preserve stable IDs/data attributes and event delegation where practical. Existing capture uses planner details/field IDs and manual capture; presentation changes must not null-dereference them or lose drafts. Label changes may require meaningful accessible-name test updates, not deleted assertions.

Preserve: explicit source/record/transcribe/insert/generate/review/apply/Save/Start; no saved workspace/history sent; no AI commands/IDs; app-generated identities; exact storage Retry; no pre-Save record writes; no automatic timer start. One open real goal; fictional isolation. Recording stays memory-only, max60s/2MiB, with track/request/late-response cleanup across cancellation, mode/nav, ownership loss, visibility/pagehide and existing recovery. No new network call on initial render.

Never read/print/copy secrets, inject env into frontend/build, expose private/server sources, put keys in URLs or logs, or change private env files. Initial THREE live Gemini calls are exhausted. ALL verification here uses mocks/synthetic media. Do not invoke live smoke scripts or an actual provider request. Human microphone/live testing remains a separate user step requiring the additional request authorization already documented.

No waypoints, Switchback, new 5-minute duration, multi-goal, backup/import, PiP, reminders, new history schema, existing-goal AI rewriting or broad reskin. No branch switch, commit, push, merge, deployment, upload or submission.

## 5. Acceptance and verification

Before changing UI, capture the new-goal baseline using an isolated browser profile. Never alter the user's real records. After final edits:

1. npm run check; npm test; npm run build; git diff --check. Report actual counts, exit codes and failures. No stale “51 passed” claim if current run differs.
2. Run the existing focused planner composite using fake provider only: TRAIL_GATE=planner TRAIL_EVIDENCE=<fresh absolute temp path> node tests/browser.mjs. Inspect harness/preview requirements first. Retain substantive assertions for credential/network isolation, cancellation, metadata, exact Retry, identity and recording cleanup.
3. Add/update only meaningful browser assertions for this change: visible AI entry in new-goal editor; no initial provider/media request; expansion/keyboard focus; draft preserved through collapse/reopen; explicit voice stages; preview/apply remains unsaved; clear manual fallback. Do not write brittle CSS/copy snapshot tests or duplicate domain tests.
4. Inspect screenshots in LIGHT and DARK at desktop1440x900 and phone390x844: compact idle entry/manual route, expanded description/voice, active recording or ready state using synthetic media, transcript review, proposal with unknown/over-budget estimates, applied manual plan and provider/microphone failure. Ensure no horizontal overflow, clipped controls, tiny hit areas or colour-only state. Long content scrolls naturally. Group captures efficiently; test synthetic states, not extra live calls.
5. Check keyboard labels, visible focus, disclosure semantics, status messages, manual form submit and no focus jump while typing or on background rerender. Ensure error/cancel still leaves the manual route accessible. Confirm fictional/example and existing-goal editing don't acquire the AI UI.
6. If shared editor layout changes, run the relevant existing editor/end-block/compact gates identified in tests/browser.mjs. One final full retained suite plus planner is preferred if it fits the window. Do not rerun completed suites repeatedly without new changes. Clearly distinguish focused independently reviewable evidence from any full suite not run.
7. Verify exactly nine public build assets and no unexpected server/private output; retain established existing security assertions. Do not inspect actual key bytes for a cosmetic task.

If the harness cannot run because of sandbox/tooling, report exact limitation; do not install dependencies or weaken tests. Any runtime edit after final checks requires rerunning affected checks. Fix regressions in touched presentation or revert only your own bounded changes; preserve the pre-existing work.

## 6. Evidence, completion and stop boundary

Update HANDOFF.md and devpost/checklist.md with implemented changes and exact evidence. Add devpost/AI_DISCOVERY_EVIDENCE.md containing touched files, before/after capture paths, final command results, preview origin, mock-vs-live distinction and remaining human/native/hosted gates. Record plan progress without a long new research report. README user instructions should match the visible label if changed; only narrowly update other docs if a material fact changed.

Final response:
- What the user now sees and exact click path.
- Current verified preview URL and warning that a different origin has separate local records; report any stale server without killing it.
- Changed files and concise reason.
- Actual test results, screenshots and any unresolved defect.
- Explicitly say no live Gemini requests, no record migration/deletion, no publication.
- Stop for Codex independent review and user's visual/physical acceptance. Do not start hosting or another feature automatically.

## 7. Delivery schedule after this task — planning only

Aim for18:00 IST, hard fallback19:00. Start this UI pass immediately; target45–55min maximum including verification. Then allocate20–25min for Codex review plus user visual/actual-work rehearsal;45–60min for separately authorized hosting configuration/deployment;25–30min final-origin regression;45–60min recording/screenshots/final materials, with contingency until19:00. Use existing video/submission drafts rather than writing a new story from scratch.

These are planning estimates and do NOT authorize Git publication/deployment or additional live Gemini calls. If hosting threatens the timeline, cut optional visual touches and editing flourishes first. Preserve a working complete demo, required1–3min video, public-source/provenance correctness and submission buffer. Never claim those delivery gates complete based on local tests.
