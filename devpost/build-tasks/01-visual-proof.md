# OpenCode task 01 — a convincing Trail visual proof

## Assignment

Create **one polished, connected, isolated visual proof** of the newly defined Trail. The learner will judge the design before app implementation. This task is ready when the learner pastes the dispatch prompt into OpenCode; it does not authorize this planning chat to start coding.

**Model:** GPT-6.1 Sol. **Reasoning:** medium. One implementation agent/session; no parallel subagents, tool configuration changes or model experiments required. Work in `/Users/mitku/Documents/Hackathons/Devpost/Build_With_AI`, branch `codex/trail-redesign`. Baseline is `b436ce6`. Inspect actual Git status first; preserve any new user work since this packet was written.

## Read once, then build the proof

1. Root `AGENTS.md`, newest `HANDOFF.md` entry and `BUILD_PROMPT.md`.
2. `devpost/checklist.md` for status/ownership and this task's boundary.
3. `devpost/scope.md` and `devpost/replan-2026-10-24/requirements-ledger.md`.
4. `devpost/replan-2026-10-24/design-brief.md` and `reference-audit.md`; inspect the seven JPEG reference images in the adjacent `references/` directory, not just the filenames.
5. `devpost/prd.md` for the relevant journey, focus, pause, final-step review and celebration states. These are draft requirements; unresolved mechanics remain proposals.

Do not reread all historical evidence/archived plans, reopen the full questionnaire, research alternative product ideas or copy the existing app screenshot as the target. The relevant references have already been gathered. Use targeted source reads only if needed to understand a behaviour. No new service/library is required for this task.

## Product and art direction

Trail makes it easy to start, preserve a place and return to real work, while showing effort accumulating into an emotionally satisfying journey. A returning user must see their exact next action and an obvious Resume before scenery, streaks or statistics.

Use a predominantly light/white working interface, readable near-black text, precise typography/spacing/controls, and carefully composed contrasting gradients in designated graphics/rewards. Stripe informs expressive colour and dimensional craft; Linear informs hierarchy, density and restraint. Do not copy logos, branded illustrations, homepage sections or an enterprise dashboard. The design must work as a daily work tool.

Reject the old pixel mountain, trees, climber, dark/glass treatment and old panel arrangement. Do not produce the old app with a new font/colour, a generic equal-card dashboard, a faint wavy line above stats, random lavender blobs or a large illustration that pushes the next action below the fold.

Use the brief's illuminated contour/ribbon journey as **one proposed design hypothesis**. Make a composed, legible graphical object with a clear route, earned checkpoints, a meaningful goal landmark and a quiet dimensional material. It must visually communicate accumulated work, not just decorate whitespace. Exact graphic/reward rules have not been accepted, so label demonstration metrics/mapping as illustrative. Make the scene support the work hierarchy.

Primary review target: Chrome on the learner's MacBook Pro. Comet is a secondary desired target, not assumed identical capability. Also demonstrate a narrow 390×844 view. Keep keyboard/reduced-motion behaviour usable. No browser version claims without observing the actual version.

## Allowed files and implementation

Create a self-contained proof under `devpost/proof-2026-10-24/`:

- `index.html`, `styles.css`, `proof.js` or a comparably small local structure.
- `README.md`: how to serve locally, state controls, known limitations and checks actually performed.
- `PLAN.md`: intended files/steps recorded before cross-file edits.
- `REVIEW.md`: design rationale, fictional-data label, state matrix, actual checks, open decisions and exact changed paths.
- `evidence/`: screenshots/measurements if your available browser tools can produce them.

You may add a short newest HANDOFF entry with proof location and observed results. Do not mark the canonical checklist accepted or call the PRD approved; reviewer/learner acceptance happens afterward.

Plain HTML/CSS/JavaScript plus original SVG/canvas/CSS graphics are sufficient. Prefer reusable design tokens and clean component-like sections so the chosen design can later be adapted. Avoid remote fonts/assets/CDNs and paid generation. If you reuse local reference images in a rationale panel, keep them out of the actual product interface. Preserve their provenance.

**Do not edit** app/, components/, lib/, tests/, e2e/, package files, production CSS/configuration, storage records, provider settings or the current app server. Do not remove the old renderer yet. Do not add dependencies, clear storage, make network/provider generation requests, subscribe a device, implement push infrastructure, commit, push or deploy. This proof uses labelled fictional in-memory state; reload may reset it if disclosed. It must not read/write the real `work-trail:snapshot:v1` key.

## Realistic sample story

Use a clearly labelled fictional example such as “Finish my ML assignment.” Show a concrete next action: “Compare precision and recall for the two saved runs; add three sentences to the results section.” Saved context can say that the baseline run is complete but the comparison still needs writing. Keep the task hierarchy and sample history consistent across screens. Do not fabricate real research findings, model scores or work by this user.

Sample focus minutes, completed actions, route positions, dates and streaks are illustrative. For design exploration only, you may show minutes extending a route, completed subtasks lighting checkpoints and a completed goal revealing a landmark; explicitly list that as a proposed mapping. Do not bake it into persisted domain rules or claim the learner approved it.

## Connected states to show

1. **Returning Today:** saved next action is the main visual anchor, goal/context legible, Resume obvious. Show a modest daily route and a readable way to access the lasting goal journey. Recommendations/history are secondary. Include a discreet “Demo — fictional work” label.
2. **Focus running:** task/instruction and timer with Pause and Complete. Calm, soft, restrained motion; scenery supports concentration. Working in another tab is intended. A simulated countdown may support the proof, but clearly distinguish it from actual app time accounting. Show illustrative +5/+10/+20 controls only in the appropriate expiry state.
3. **Pause / saved place:** Pause responds immediately. A short optional “When I'm back…” field and optional context are easy to save/skip. Welcome the user's return without guilt. Show the saved instruction when navigating back to Today. An in-memory Unfinished tag must not award task completion.
4. **Accomplishment:** a subtle local tick/glow for a completed subtask. For the illustrative last subtask, show a small final review that allows adding a step/keeping the goal open or explicitly confirming completion. Only explicit confirmation launches a finite purple/blue multihue celebration with clear exit; then show the finished goal as an attractive coloured block on a neutral page. The exact flow is a proposal for review. Make a reset/back-to-example control available so it is easy to compare states.

Show enough daily-versus-goal detail to judge the graphical idea without building a full task manager or separate complex analytics section. Include a first-use/empty state and a long-instruction case using a small state switcher. Do not build auth, onboarding tours, full ranking logic, a real streak engine, AI, PiP or real background reminders in this proof. A tiny capability/setup placeholder, if present, must say it is unimplemented and must not trigger system permission.

## Visual and interaction quality

- Use purposeful hierarchy and asymmetric composition where it helps. Text and controls should feel finished: consistent spacing, hover/focus/disabled states, realistic line lengths and full long-text access.
- Compose gradients across route material, checkpoints, celebration and finished-work card from a coherent palette. Keep reading surfaces and most controls neutral. No colour-only status meaning or low-contrast text on saturated art.
- Use deliberate motion on earned progress. A brief hover/cursor response may enhance the route outside focus; avoid perpetual attention-grabbing movement, flashing and unbounded particle effects. Provide a static/reduced-motion equivalent.
- Preserve primary action visibility on 1280×720 and 390×844 with ordinary sample content. For long instructions, allow readable expansion/scroll rather than clipping task meaning or shrinking the type.
- Keyboard controls/dialogs must have visible focus and a sensible return path; use real buttons/forms. Animation must not trap navigation or delay Pause.

## Verify and report honestly

Serve only the proof directory on a free localhost port; use a temporary local server if available, not the current app process. Do not stop another process to claim a port. Record the exact URL and whether your process is still running.

Inspect the connected flow at 1280×720 and 390×844, then first-use, long text and reduced motion. Verify no document-level horizontal overflow, visible next action/Resume, working Pause/save/skip, explicit final confirmation and reset. Save state screenshots when available and visually inspect them; do not call a file's existence a design review. Check JavaScript syntax and local resource links.

If your environment lacks browser/screenshot capability, finish the actual files and clearly say which browser checks were not performed; give reproducible preview instructions. Never invent screenshots, pass counts, local URLs being served or browser observations. No need to run unrelated production regression for an isolated proof with no source changes.

## Completion response and stop boundary

Return:

1. Exact files changed and brief design rationale.
2. Preview URL/command and state-switch controls.
3. Actual verification and evidence paths; unverified cases separately.
4. Proposed product defaults used in the proof and any key open decision.
5. Confirmation that production source/dependencies/personal records were not changed.

Update HANDOFF with factual proof status. Stop at this point for learner visual feedback and Codex review. Do not start runtime integration or a second alternative design automatically. The learner returns to the review chat with “Review Step 01.”
