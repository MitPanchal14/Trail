# Trail — final capture flow and visual polish

Work in `/Users/mitku/Documents/Hackathons/Devpost/Build_With_AI`.

Read AGENTS.md, README.md, HANDOFF.md, scope/prd/design-brief/spec/checklist, FINAL_FEEDBACK_EVIDENCE.md and INDEPENDENT_FINAL_FEEDBACK_REVIEW.md first. Inspect branch, dirty files, current source and server origin. Current verified base is codex/trail-redesign HEAD721fd12; final-feedback work is uncommitted and must be preserved. Do not reset, restore wholesale, change branch, commit, push, deploy or submit. Preserve ZIPs/private files. OpenCode implements; Codex reviews after you stop.

## Outcome and priority

The user rejected the present pastel archive, generic Focus composition and three-dot loader. More importantly, the user confirmed BOTH needs: add a step while retaining the current unfinished action, and save a different goal to work on later. Resolve those practical restrictions first. Keep one active goal and one focus session; a Later-goals queue is enough. This is not a multi-project dashboard or simultaneous-timer redesign.

Use GPT-6.1 Sol High for the capture/domain/Retry work. Once its targeted tests pass, Medium is suitable for the bounded CSS/SVG presentation and screenshots; keep the same chat and leave a short verified checkpoint before changing effort. If using one setting for the entire pass, use High. Do not spend tokens exploring alternate redesigns.

Work budget: approximately 75–90 minutes, with at least the final25 minutes reserved for regression and evidence. This is a work budget, not permission to skip checks. If domain changes cannot be made safe within it, retain the last verified state for that feature and report the exact gap; do not conceal a partial implementation as complete. Record a file-level implementation plan BEFORE editing. Complete and verify the functional slice before styling.

## A. Add a step without losing the current action — required

Current source explanation: work.js blocks running edit; save-goal rejects changing action order while a block exists; add-action currently applies only after every action is checked. Do not merely enable the buttons and then hit these domain errors.

Provide a discoverable **Add a step** action on Today and a quiet secondary capture control in Focus. On running focus, explicitly label the transition **Pause & add a step**, or show equivalent clear copy before the explicit action. Use the existing trusted pause/checkpoint path before entering the form. Never silently stop/complete the current action, end its block, clear its context or create a replacement block.

After pause, allow APPEND ONLY to the current goal, keeping the active session and its action unchanged. A small form is sufficient: required step title, optional estimate with current validation rules, Save step, Cancel. Append after existing actions; no reorder/remove/current-action switch in this shortcut. Preserve existing general-editor restrictions; do not broadly unlock save-goal ordering. Use a narrowly validated domain command for the append rather than mutating the workspace from the renderer. Decide whether to extend existing add-action with explicit guards or add a focused command; preserve the old all-checked review behaviour/tests.

On successful append, return to the previous useful surface, identify the added step and show **Resume focus** if a paused block exists. Same session ID, action ID, remaining time and previously credited effort. No automatic Resume. Cancel keeps the action and paused block; tell the user it remains paused. No focus block must be ended simply to capture another step. With no session, append must also work. Enforce the existing30-action maximum and prevent empty/overlong/invalid estimates.

All writes use existing transition → command → LocalStore commit → pending exact Retry. Allocate IDs once per accepted command. Double-click does not duplicate; failed save retains the form and retries the same operation/IDs. No success confirmation until transaction commit. Read-only/ownership/busy/pending guards stay effective. No away-time credit while editing.

## B. Save a separate goal for later — required, bounded queue

Retain the distinction: a **goal** is an outcome, its **steps/actions** are what you do. Name the UI so the user knows whether they are adding a step or saving a new goal. Do not require finishing the current goal merely to remember a different one.

Add a compact **Later goals** section on Today and a **Save another goal for later** entry. Do not crowd Focus with the queue list; at most a quiet capture entry. If entered from running focus, explicitly pause through the same established path and preserve the current block/action/context. Keeping the timer running while filling unrelated forms is outside this pass.

Suggested bounded domain representation: queued goals in the existing canonical goals/actions records with an explicitly validated queued status; openGoalId continues to designate the sole active/open goal. This is an additive schema1 extension, not a reset/migration or permission to accept multiple open goals. If source review identifies a safer equivalent additive representation, record its contract first and keep it in the SAME validated workspace/transaction system. Do not introduce localStorage, a new IndexedDB database, a private unvalidated array, a second source of truth, or fake completed goals.

Requirements regardless of representation:

- Existing schema1 snapshots without queued data must load unchanged. No automatic rewrite/reset of real work. Explicit new data is validated, including optional fields BEFORE operation receipt replay, matching current contracts. Do not increment schema version casually or silently strip unknown/bad records.
- One active/open goal and one active focus block remain. Queue entries are neither active nor completed. Enforce existing overall storage/goal/action limits; cap the visible queue at a documented small bound, e.g.10 goals, with a clear recoverable limit message.
- A queued goal has a required title, finish condition and1–30 ordered actions using current text/estimate/priority validation. Reuse a focused manual form where feasible, with explicit **Save for later** wording. The initial route can be manual only; do not extend Gemini provider behaviour or disturb the existing reviewed AI Save flow.
- Saving for later cannot overwrite active goal fields, actions, saved context, IDs, current selection or session. It must survive reload. Present Later goals separately from Finished work, activity, streaks and earned routes. It awards no completion or effort.
- Allow reviewing/editing a queued goal using the same validated save pathway; queued edits never target the active goal. Preserve failed edits and exact Retry. Do not build deletion/archive/reorder features in this pass.
- Activation is explicit and available ONLY when no open goal/session exists. Label **Make active**, with copy that Start is still separate. Do not offer switching away from an unfinished active goal in this pass. While one exists, show a truthful explanation rather than a button that appears broken.
- After finishing the current goal, Later goals are available for explicit activation; activation preserves all existing completed history and uses the original queued goal/action IDs. It does not start focus, finish any step, inflate history or erase the queue on reload.
- Restoring/reopening a finished goal still respects the one-open-goal invariant. Queue presence alone does not block reopen; an active goal still does. Existing Undo must remain valid or become invalid through the established revision rules, never silently reverse an unrelated queued write.

This user request narrowly authorizes state.js validation/transition changes necessary for append and queued-goal capture. It does NOT authorize broad relaxation of invariants. Storage.js, timing.js and activity.js remain protected; server/API/model/config/private files also remain unchanged. If an essential engine change seems necessary, document the specific reason and stop that slice rather than implementing an unrelated rewrite.

## C. One coherent Trail palette — required

Critique of supplied screenshots: the peach/lilac Important archive looks disconnected from the blue-violet Trail mark; mint/grey Focus haze lacks a clear visual centre; equal pastel intensity makes the page look washed out. Do not solve this by increasing saturation everywhere.

Use existing `--blue:#4167ec`, `--violet:#7849df`, neutral ink/canvas and restrained cyan as the family. Keep colour concentrated around structure and a few accents. Reuse tokens rather than adding unrelated literal colours to each component.

Concrete starting palette, adjustable only for contrast/hierarchy after visual inspection:

- Light canvas remains #f8f9fc; surfaces white/near-white. Archive wash approximately #edf2ff → #eeeaff → #f4f2ff, dark ink. Optional cool cyan is a small edge accent, not mint filling half the card.
- Dark surfaces remain near existing #191c25/#212530 with muted navy/indigo #202b45 → #2d2949. Text near white. Avoid muddy mauve/brown or neon purple slabs.
- Priority remains an explicit word. Differentiate subtly using a small accent rule/tag: blue for Normal, violet for Important, cool neutral/cyan for Low. Do not make three unrelated whole-card colour systems. Priority never changes ordering/counts/earned geometry.

Keep archive dimensions,8+Show more, details, long-title handling and guarded Reopen. Make title/secondary affordance look deliberate: keep a clear goal-title control, put the small View details cue on its own tidy line or aligned position rather than squeezed into underlined long titles. Avoid a fake external-link icon. Do not duplicate focus stops just for the label. Separate text and peak so the peak cannot sit behind explanatory copy on narrow cards. Keep a complete crisp minimalist silhouette and one ridge using Trail blue/violet; no extra jagged detail. Preserve active journey/terrain/path/marker semantics.

If fictional cards show a disabled Reopen, retain truthful read-only behaviour but reduce its visual dominance. A clear labelled read-only explanation is useful; do not repeatedly stack oversized disabled controls and dense legalistic copy. Keep labels sufficient to distinguish fictional work from real records.

## D. Focus should feel intentionally composed — required

Retain the established composition and actual controls; improve it as a place to work, not as a landing-page hero. The current screenshot has a very wide white card, a flat halo and little connection to the brand beyond the logo.

- Use a focused desktop card width around760–840px, naturally shrinking on phones. Tune padding and spacing around a clear hierarchy: compact goal/step context, readable current action, dominant countdown, primary Pause/Resume, secondary completion/capture. Do not shrink long text into unreadability to force a fixed height.
- Timer uses tabular numerals and stable width so it cannot jitter. Keep numbers and action still. A restrained blue-violet edge light or static hairline accent can connect the card to Trail; do not add a decorative progress ring/rail that appears to measure completion or effort.
- Use two or three broad soft blue/indigo/violet atmospheric fields, with a little cyan at the edge if needed. Keep central text/control contrast high. Prefer asymmetric placement and slow translational drift (roughly24–32 seconds) to a uniform washed-out backdrop. No pulse/breathing scale, text motion, flashing, oscillating focus card or full-page saturated gradient.
- Dark mode must be designed deliberately: a raised charcoal/navy card, subtle blue-violet ambience, no muddy grey/pink veil. Background motion Off freezes the fields; reduced motion is static. Preserve existing visible control and user setting semantics.
- Keep saved-place disclosure, extensions, expiry/end-block controls, conservative timing status and usable long context. Do not hide necessary states to make a beauty screenshot. Capture entry remains secondary; queue list belongs on Today.
- Check both running and paused/expired states at desktop,390 portrait and844x390 landscape; no hidden primary controls, clipped content or page-wide overflow. Allow natural vertical scrolling on short screens.

## E. Replace the three-dot AI loader — required

Use one compact **Trail mountain-path indicator**: a small outline related to the existing two-peak brand, with a blue-to-violet highlight travelling along part of it. CSS/inline SVG only, no library, image download or external logo. Approximately40–48px overall, thin crisp strokes and a restrained glow; visually adjacent to normal-sized status text. This is an indeterminate request indicator, never an earned trail or percentage. Do not use three bouncing pills, a fake completion meter or a huge animated hero.

Alternative only if SVG animation proves unreliable in Safari: a small masked blue-violet sweep inside a rounded line/outline with equal restraint; record why. Animation should have a smooth2–3second loop, no abrupt flashing, and transform/opacity or inexpensive SVG stroke motion. No animated blur or large repaints. Verify with before/after frames.

Only actual request pending mounts/animates the indicator. Keep one polite status and aria-busy. On reduced motion render a static coloured path and the same text. Preserve accessible Cancel and the existing safe error categories, source text, edited proposal, manual fallback and exact proposal Save/Retry/no automatic Start.

Copy: **Drafting your plan…** while waiting. If useful, add ONE factual secondary line after about10 seconds, such as **Still waiting for Gemini. You can cancel and keep your description.** Clear any timer on success/failure/cancel/navigation/mode/ownership changes. Do not simulate stages such as Understanding → Scheduling → Finalising, invent a countdown, claim an imminent response or retry automatically. Do not hold a ready plan to finish an animation. No extra live requests, provider calls or model changes: live budget is exhausted.

For maintainability, replace the current plannerHTML string-replace trick with direct template markup ONLY where changing this loader/action area; preserve selectors and tested behaviour. Do not reformat the whole file.

## F. Fictional examples — required parity, no contamination

All palette, archive, Focus and loader presentation is shared. Add one concise labelled in-memory capture example that demonstrates current unfinished step + a later step + a separate Later goal. If activating/editing is simulated, say so and reset on reload. Real IndexedDB snapshots must be byte-identical before/after exploring/resetting fictional examples. Do not silently seed real records. Do not send fictional content to Gemini. The real planner can be demonstrated using the deterministic test mock in evidence, never masquerading as a live fictional AI response.

Current fictional3-day streak remains. Do not add another streak engine, quotes, badges, terrain overhaul, AI coaching or dashboards. No further optional features in this pass.

## Verification — meaningful assertions, not cosmetic counts

First snapshot source/record-test fixtures to an approved temporary directory, not private env. Never inspect/export user record contents into evidence; use synthetic isolated browser contexts. Verify targeted functionality before style.

Domain/transaction cases:

1. Start a synthetic action, accrue bounded trusted effort, explicitly pause-and-add, append a new step. Same current action/session/remaining/credited time/context, new action last, Resume explicit. Cancel preserves paused session; maximum/invalid estimate/title/read-only cases reject cleanly.
2. Save a separate queued goal while an active goal is retained. Reload: original action/block/context intact, queued title/actions/IDs persisted, no extra completion/effort. Edit queue entry cannot edit active work.
3. Abort actual append/queue-save/queue-activation transactions; no premature success, exact same command/IDs on Retry, no duplicates after double click/reload. Preserve existing stale revision/ownership/writer and validation-before-replay protections. Test old schema1 fixture with no queue, malformed queued records/fields and record bounds.
4. Queue activation is rejected with an open goal/session; finish current goal explicitly, then activate queued entry: original IDs, next correct action, no timer until Start. Completed history/Undo/activity totals remain correct. Reopen with only queued goals retains one active-goal rules.
5. Existing reviewed AI direct Save still saves one new active goal when allowed, not a duplicate queue/active record. No change to provider payload/config/API limits or secret boundary. Manual routes continue without Gemini.

Browser/presentation cases:

- Run syntax, dependency-free Node tests, build and diff check; relevant focused capture/queue + planner/Retry + visuals; then all retained browser gates. Keep previous regression assertions unless source behaviour is intentionally superseded; explain any legitimate test update and add the replacement invariant. Do not weaken tests to pass screenshots.
- Both themes at320/390/1440 and844x390 landscape. Long action/title/context, mobile keyboard form scrolling, visible >=44px targets/focus, no horizontal document overflow, colour contrast and no text/peak overlap. Inspect screenshots, do not rely only on bounding boxes. Physical devices/Safari remain separate unless actually exercised.
- Actual pending loader motion over multiple frames; reduced static; cancellation/error/navigation cleanup; no fake staged progress, duplicate live announcements, late proposal, leaked timer or extra request. All planner calls mocked.
- Real and fictional Focus: movement over at least5.5 seconds when On; stable countdown/card geometry; Off and reduced remain static. No added effort because of motion/capture/queued work.
- Fictional exploration/reset never changes real workspace. Queue does not enter finished cards, activity, streaks or route counts. Same nine allowlisted browser assets; source/build/preview parity and private/server/test404 retained.

## Completion and stop boundary

Update only relevant current docs (AGENTS/HANDOFF/checklist/scope/prd/spec/design brief as necessary) to explain capture, queued vs active, explicit activation/Resume and current visual result. Reconcile older contradictory one-goal/capture statements with a clear current section; preserve historical evidence. Add FINAL_PRODUCT_POLISH_EVIDENCE.md with exact tests/results, source changes, before/after screenshots, incomplete work, preview origin and limits. Report independently measured vs inherited results accurately.

Stop for Codex independent review and user visual/physical acceptance. Do not call Gemini, read/change credentials, install frameworks/dependencies, migrate/delete real records, launch stale origins as current, commit/push/deploy/submit or silently enlarge scope. Leave a concise final report: implemented, verified, deferred, exact preview and evidence paths.

## Design rationale sources

The specific palette and mountain indicator are product design judgments, not research-proven winning choices. Status remains factual and available to assistive technology without stealing focus: https://www.w3.org/WAI/WCAG21/Understanding/status-messages . Honour user control/reduced motion: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions . These support the behaviour requirements; they do not establish aesthetic acceptance or hackathon success.
