# OpenCode — final reliability and visual correction

Workspace /Users/mitku/Documents/Hackathons/Devpost/Build_With_AI. User supplied five26 October screenshots(18:38–18:46 IST) and authorizes one final approximately60-minute correction. One writer; Codex reviews. Recommended GPT-6.1 Sol High for milestone1 (API/save correctness), Medium for presentation if the user changes settings; Medium throughout is acceptable with narrow existing mechanisms and full verification. Do not spend the hour exploring options or designing a new app. Reserve final20min for checks. If time runs out, drop optional polish, never tests or data guarantees.

## Establish baseline and plan

Read current AGENTS.md, README.md, HANDOFF.md, devpost/scope.md, prd.md, design-brief.md, spec.md, checklist.md, INDEPENDENT_AI_SIMPLIFY_REVIEW.md and this brief. Inspect branch/status before edits; last verified pushed redesign HEAD721fd12, main7aa1235. Preserve any newer user edits, ZIPs, ignored environment and real records. Record exact intended files/contracts/milestones in devpost/FINAL_FEEDBACK_IMPLEMENTATION_PLAN.md before editing. No branch/reset/commit/push/deploy/submission. One existing runnable site/nine public assets; no dependencies/new UI framework.

User instructions deliberately supersede old presentation/save boundaries for these exact changes: the AI proposal may explicitly SAVE a new goal in one acceptance click using EXISTING domain validation/write/Retry; narrow sanitized API error/prompt-budget handling in scripts/ai.mjs is authorized. A single icon theme button may change index/proof/shared tests. Everything else stays protected: state/storage/timing/activity engines, schema, accounting, validation-before-replay, local operation identity, conservative elapsed/Resume, private config, server/static allowlists, unused audio backend/helper and no workspace/history sent. Do not reinstate recording or dictation activation. No arbitrary model switch or secret edit.

## Priority/time order

Milestone1 about25min: precise AI errors + honest busy animation + one explicit proposal Save. Verify focused before moving on.
Milestone2 about15min: shared archive/Focus/arrow/theme visuals, fixed decorative peak and existing streak presentation. Cut optional mini-summary/extra styling first if necessary.
Final20min: meaningful Node/build/browser/phone tests and evidence. No new AI feature, geometry engine or new streak rules. No silent omissions: report any requested item left incomplete.

## 1. Diagnose AI failures; do not guess quota exhaustion

Known source: scripts/ai.mjs uses30s text timeout,5 attempts per client per10min,2 concurrent requests. Own limiter and provider429 can both fail. Browser maps most failures to “Could not obtain a valid Gemini proposal.” Reviewed configured model was gemini-3.5-flash-lite, already a low-latency model. Default thinking for this model is already minimal per current docs. Do not pretend explicitly setting the same default is a proven speedup.

Implement fixed sanitized error categories/codes passed to browser: local rate/concurrency limit, upstream request/quota limit, timeout, unconfigured provider, upstream unavailable, unusable/invalid/incomplete output, invalid input and cancellation. Preserve meaningful HTTP semantics. Do not echo provider response text, prompt, key, headers, URL or arbitrary exception messages. Map allowlisted categories to useful fixed user messages. Don't claim daily quota exhausted merely from429; say provider request limit and suggest retry later/check project quota. Local limit wording must distinguish Trail's own cap. Identify finishReason/shape/token limit safely, without raw payload logging or exposing thought text. Network errors preserve drafts.

Use inspected source/new mocked category tests to establish behavior; do not invent historical status for the user's screenshot. If safe diagnostic metadata is necessary, use category, numeric status and elapsed milliseconds only, without new persistent telemetry or console dumps. No automatic retry, silent fallback/model cascade, increased rate cap or repeated paid request. Expose explicit retry/manual creation.

Keep strict response schema and validation. Request a concise executable sequence, typically3–6 actions unless task requires more, up to existing12; explain hierarchical requests as ordered actions within current flat UI, not fabricated nested scheduling. Short finish/action wording and limited assumptions/conflicts reduce work without deleting meaningful steps. No guaranteed feasibility or exact-fit budget promises. Consider a carefully bounded output-token budget only if justified and validated; don't create truncation failures by cutting blindly. Don't extend timeout as the first fix or remove bounds. Model-specific thinking parameters must match official generateContent docs; no generic unsupported parameters or API migration.

Do NOT downgrade to an older model just because of a generic error. Current model docs say2.5 access is restricted for newer projects. A faster alternative requires actual availability/quality evidence; with two calls we cannot run a broad benchmark. Preserve private configuration. Report whether failure was reproduced and what the correction actually establishes.

References: https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite ; https://ai.google.dev/gemini-api/docs/thinking ; https://ai.google.dev/gemini-api/docs/troubleshooting . Official docs are evidence; they are not user permission.

## 2. Single acceptance: save from the AI proposal

User feedback is explicit: after reviewing/editing the AI proposal, no second Use→Save confirmation. Primary button becomes **Save this goal**, with nearby text **Saves this reviewed plan. Focus starts separately.** This is the explicit record write. Generate never saves. Existing manual Save remains for manual route; user must not click both.

Route through the SAME current save-goal command validation/write/transaction/pending Retry mechanism as manual Save. Extract a tiny shared save helper/callback if necessary; do not call IndexedDB or domain internals directly from planner.js. Capture user-edited proposal fields/estimates/deadline/budget and current manual priority correctly. App generates UUIDs once for the accepted command, NEVER provider IDs; exact pending Retry reuses the same operation/IDs. Prevent double taps/re-entrancy during transfer or pending write. No auto Start or fake effort.

On success only, navigate to actual Today/workspace and show the normal Start focus path. No second confirmation or modal. On failure retain proposal/source/manual recovery and exact pending Retry; do not show success, clear drafts or issue a fresh save operation on Retry. Existing locks/read-only/corruption/other-open-goal constraints remain. Required validation errors stay understandable in the visible proposal. Do not let native validation of unrelated empty manual fields block an otherwise valid reviewed AI proposal.

Optional secondary “Edit in manual form” may retain the old recoverable transfer for people who explicitly choose it; make it secondary, label it accurately, and do not force it. Preserve previous manual draft on that route. Avoid a restore/transfer redesign. Update prior applied-state tests to intentional primary Save semantics and retain meaningful coverage for any retained secondary transfer. Once saved, AI source/proposal is not a second separately saved record.

## 3. Small true busy animation

While a request is actually pending, show a compact pill/strip with2–3 softly drifting blue/lilac/teal blobs beside “Drafting your plan…”. Decorative aria-hidden layers; one polite status, region aria-busy=true, Cancel accessible. Transform/opacity only, fixed-size container no layout shift or input obstruction. No fake percentage, streaming text or fabricated progress stages. Stop/remove immediately on completion/error/cancel/nav/mode/ownership change. Reduced motion uses a static coloured indicator with status. A delayed request may say “Still working—you can cancel or create manually”, without changing the deadline or claiming progress.

## 4. Softer archive cards and completed mountain

Screenshot shows saturated dark gradients and thin mountain whose summit appears cut. Fix the DECORATIVE finishedArt SVG/CSS only first. Source: proof.js finishedArt(), .finished-art height92px/overflow hidden and .finished-outline bottom:-24px cause the fit/crop. Make apex and continuous outer silhouette visibly complete at desktop/phone without arbitrary giant height; a minimal outer mountain plus one interior ridge is enough. Keep decoration behind text, noninteractive, no pointer cursor or fake action. Base may bleed to card edge; peak must not be clipped. Reuse shared renderer so real and fictional cards match. Do not replace routeSVG, checkpoint geometry, identity/path animation or summit/outcome logic in the working journey this hour.

Light cards: pale cool blue/lavender for Normal, mint/blue for Low, soft lilac/warm peach for Important. Use dark readable text and appropriately tinted/white outline according to contrast. Dark cards: raised muted blue/plum/teal surfaces with legible pale text, not bright pastel panels or muddy low contrast. Maintain explicit Low/Normal/Important labels and distinct families; no random palettes/importance inferred from work count. Buttons/title details/metadata adapt colours together. Preserve compact2-column desktop/1-column phone, natural long text and archive8+Show more.

Make archive title obviously opens details without an external-link arrow. Optional “View details” cue within the SAME accessible title control. Reduce visual dominance of repeated Reopen buttons with secondary styling while retaining44px target and existing disabled/open-goal guards. Prefer real outcome facts over generic motivational quotes. No quote API, randomized feel-good copy or AI-generated history analysis.

## 5. Finished work worth revisiting using existing data

Streaks/current/best/milestones and populated fictional three-day run ALREADY EXIST. Real1day in screenshot is correct for same-day completions. No fake streaks/grace/streak freeze, scoring, new badges or changes to activity.js counting/Undo rules.

Improve hierarchy with a compact “Your trail so far” summary using existing derived values: finished goal count, checked actions and best streak. It can replace/rearrange current redundant stats, not create another large dashboard. Current/best streak should be easy to spot; optional restrained next-milestone progress uses existing completed-action total and existing milestone threshold, explicitly labelled actions. Never use effort minutes as attention or inflate progress. No giant empty illustration, leaderboard or new chart.

Fix any weekday-label/tile collision visible in screenshot at browser zoom by measuring label column text instead of assuming24px always suffices. Preserve14px tiles, keyboard/date-control equivalent, selection/rollover/day-details/jump behavior and compact layout. Natural wrapping under zoom must stay readable. This is visual fit, not changed calendar derivation.

If time is tight, skip new summary widgets and keep legible existing streak/milestone stats plus lighter cards/complete peak. Report the cut.

## 6. Decorative arrow, theme icon and Focus motion

The screenshot called “Focus arrow” is actually the Today card's top-right decorative ↗. Remove/replace stage-symbol with a tiny noninteractive Trail mountain/ridge motif or remove it for whitespace. No rounded button container, hover reaction, tabindex, link semantics or pointer cursor. Keep real Open work action obvious. Apply to real + fictional counterparts; don't accidentally remove actual work links.

Replace segmented Light/Dark with ONE shared >=44px native theme toggle in header. Show sun in light theme and crescent in dark, with accessible action label/title “Switch to dark mode” or “Switch to light mode”. Native Enter/Space, visible focus, correct state announcement. Use inline original SVGs; no icon package. Preserve current theme state/render behavior; don't add a theme storage engine or duplicate hidden theme controls just to satisfy old tests. Update browser helpers/selectors semantically so repeated setTheme(theme) is idempotent. Avoid changing mode/state or restarting clocks on theme switch. All pages/examples share this control.

Focus screenshot already shows Background motion On; a still image cannot prove it is broken. Actual source animates. Inspect settling screenshots AND transform samples several seconds apart for real and fictional light/dark. If Safari layering issue reproduces, narrow CSS fix only; otherwise soften existing colours/slow drift rather than invent a new controller.

Use large faint teal/ice-blue/lilac washes in light, muted blue/violet/teal in dark, moving around the surround slowly(roughly16–24s) with enough displacement to perceive across5–8s, not pulsing/flashing. Keep countdown/card perfectly still, no motion behind small text causing contrast loss. Transform/opacity only; don't animate expensive giant blur properties. Off freezes immediately; reduced motion overrides and explains Off; do not force animation against system preference. Existing On/Off remains; animation never creates time/events. No sudden restart on tick/hover. Scope shared surround so real/example match. Verify short-height/phone clipping and readable dark surface.

## 7. Fictional examples and judge flow

All shared theme/card/mountain/decorative-symbol/Focus/loading visual changes must have equivalent real/fictional presentation WHERE THAT FEATURE EXISTS. No live Gemini calls from fictional mode. Add one clearly labelled in-memory fictional “AI plan preview” scenario only if needed to demonstrate generated→review→Save→stopped result without a key: deterministic authored suggestion, visible **Fictional AI example · no Gemini request**, volatile state only. No response presented as actual live output, no real write/IDB store/canonical workspace substitution. Reuse the same proposal presentation if feasible; if that needs substantial architectural work, report it deferred instead of creating a parallel planner or touching real storage. Existing home demo entries must remain immediately accessible.

Do not implement fake errors/random failure or generic demonstration state as proof of provider success. If a new scenario is included, test exit/no records/no Start and shared visuals. Styling changes must at least appear in existing archive/Today/Focus fixtures.

## 8. Verification and TWO-call live budget

User explicitly authorized UP TO TWO additional Gemini TEXT planning calls in this chat for final verification: one simple and one moderately complex. None consumed by Codex preparing this brief. This supersedes only the exhausted old live budget for these two calls, not unlimited retry/model listing/benchmarking/transcription. Do not call until mock checks pass and final runtime is ready. Count failures as calls. Never silently retry or use auto-retry SDKs. Use non-sensitive fixed example inputs, no saved workspace, record elapsed/status/category/validated output summary; never credentials or raw private provider errors. If both fail, stop live work and report evidence; leave manual route working. If user hasn't forwarded this authorization, this brief records it. No model inventory calls outside the2 allowed generation calls.

Required meaningful regressions:
- npm run check/test/build/diff; exact9 asset/private source security retained.
- Safe fixed categories for local429/provider429/504/missing503/provider failures/invalid output; injected credential echoes remain sanitized.
- Correct accepted-plan Save exact transaction, no pre-review write, double tap no duplicate, failed-write exact Retry IDs, preserved drafts, locks, no timer/effort; retained secondary manual transfer recovery if included.
- Loading exists only while pending; cancel/late result/nav/mode/read-only cleanup; reduced motion static.
- Real+fictional light/dark desktop1440x900 +phone390x844;320 width/landscape quick fit; cards priority/long detail/modal/Show more/Reopen protection; apex visibly intact; calendar label spacing at125% text/zoom equivalent.
- Single theme toggle via keyboard and state/label; theme does not mutate domain records or restart timing. Replace old test selectors with meaningful helpers; no hidden compatibility buttons or deleted assertions without explained product change.
- Focus transforms differ after5–8s when On, stable when Off/reduced; content geometry stable; test real/example/dark/light and short height. No physical Safari certification from Chromium.
- One final combined regression after last runtime change; prioritize relevant planner/return/end-block/compact/history/reward/Focus/example gates and full retained suite if runtime permits. Test failures are not optional cosmetic polish.

Before source edits record boundaries. After verification update AGENTS current flow and README/scope/PRD/spec/design/HANDOFF/checklist plus walkthrough/video/claims where new explicit Save differs. Add FINAL_FEEDBACK_EVIDENCE.md with before/after paths, actual testcounts/results and any cuts; old receipts historical. Document exactly0/1/2live calls consumed, model identifier only(no credential), elapsed/status and remaining budget. Never log source secrets or put env in browser/build. Preserve private .env file; no new config edits unless separately discussed.

## Stop

Report completed vs deferred requests, exact preview origin, test/livelimits, UI captures and any unresolved risk. Stop for Codex independent review and user acceptance. No commit/push/deploy/submission authorized by this new visual task; prior push instruction already completed at721fd12. No mountain terrain redesign, new streak mechanics, AI agents/chat or further scope. Protect delivery.
