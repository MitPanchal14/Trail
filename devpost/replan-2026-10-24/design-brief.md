# Trail — visual and interaction brief

Status: **draft design proposal; not visually approved**. Updated October 24, 2026. Read `requirements-ledger.md` for confirmed requirements and `reference-audit.md` for evidence. This brief makes a concrete direction reviewable without pretending the learner selected every detail.

## Latest learner feedback — visual revision 01b

**Decision:** the existing mixed gradient palette is liked. The contour-route graphic, working composition and emotional presentation are not approved. Task 01a fixed continuity bugs; it did not settle the visual direction. This section supersedes conflicting earlier contour/composition proposals below, which remain exploration history.

### Confirmed requested changes

- A visually beautiful landing page with one clear primary action leading into the working experience. “Nail the Trail” was suggested as wording, not a locked button label.
- Task/completion surfaces must feel composed and engaging rather than a column of text and buttons. Highlight the areas most useful to a viewer while keeping the site minimal.
- Goal journey needs visual depth and coordinated gradient feedback when hovering a subtask. Touch and keyboard users need equivalent selected/focused feedback.
- Focus should feel peaceful and alive. Learner offered either left-aligned essentials with a visual on the right, or a central work window over a softly moving gradient/shapes background.
- Dark mode must be tracked for development; it is not implemented or approved by this note. Do not restore rejected dark-glass/pixel styling.

### One proposed composition for the next proof

**Attention hierarchy (design assumption, not eye-tracking research):** the next executable instruction and Start/Resume have strongest contrast; the earned checkpoint/result comes next; original step title, optional context, duration and secondary navigation recede. Strong colour belongs to accomplishment and journey, not every button or card. Do not remove optional context to make the page look empty.

**Landing:** one screen with quiet Trail navigation, a short headline (“Nail the Trail” is the proposed expressive line), a plain explanation (“Start focused work. Save your next step. Come back knowing what to do.”), one primary “Start working” button and a crafted live journey preview. Reuse the product’s actual proposed visual language, not an unrelated marketing illustration. No pricing section, fake testimonials, fabricated statistics, autoplay video, login wall or long onboarding. First visit can enter here; a returning user should reach the exact saved work directly. Brand/Home can revisit the landing. For this proof, expose first-visit versus return as labelled fictional scenarios; do not add persistence to solve routing.

**Today / small completion:** give the current action one deliberate stage with compact step identity, primary instruction, optional context and dominant Resume; group secondary actions. Support it with a purposeful progress object rather than a competing card dashboard. Completing a step produces a small finite coordinated light/check transition and updates its marker. The next action then becomes clear. No full-screen major reward for a subtask.

**Route / journey:** retire the stacked contour relief as the main object in this revision. Explore one graceful luminous route drawn across a clean open field, with spatially separated milestone surfaces and a precise saved-position marker. Use subtle depth and intentional blue/violet/teal/peach transitions from the existing palette. It should read as a path through accumulated work rather than a decorative squiggle or a standard checklist. Keep daily and goal timescales distinct. Selecting a subtask highlights its corresponding route marker/segment and a nearby detail panel; completed, current, unfinished and planned states remain distinguishable without colour alone. A fifth step remains legible; exact time-to-geometry mapping is still illustrative. Do not return to mountains/trees/avatars or add GIS/geolocation.

**Journey hover/focus:** use the subtask surface edge or contained background for a subtle coordinated multihue highlight, with stable readable text. Apply equivalent styling to keyboard focus and persistent selection; tap selects on touch. Highlight the associated route marker/segment as well. No moving buttons, reflow, hover-only facts or a neon border around everything.

**Focus:** choose the centered work-window option for this proof. Within a readable stable surface, show small goal/step identity, primary next instruction, a prominent timer and clear Pause/Complete. Original instruction and optional context remain reachable without competing with the current action. Behind the window, use large soft gradient fields or restrained shapes in an approximately 24–36 second low-amplitude loop; this timing is a visual starting point, not an attention claim. Keep motion behind a stable reading surface, not across text. Provide an explicit still/ambience control and respect reduced motion from initial render. No ticking pulse, particles, soundtrack or flashing. Narrow screens keep task/timer/controls before decoration; long instructions can scroll without obscuring Pause.

**Whole-goal confirmation / reward:** retain explicit review, add-step, keep-open and confirmation behaviour. Give the final review a clear completion summary and visual goal token with one primary confirmation. On confirmation, expand coordinated gradient colour through the viewport with a readable result message and a meaningful finished route/landmark. Reduce the large opaque-white-card feel of the current celebration. Keep finite motion, immediate exit and a static reduced-motion equivalent; do not invent a new unapproved lifecycle. Return to neutral history with a colourful finished-work block and clear next destination. No repeated celebration on ordinary navigation.

**Dark mode:** use shared semantic surface/text/border/gradient tokens. Preview a deliberate deep neutral version of landing, Today, journey, focus, review, celebration and finished cards, with a small labelled Light/Dark control. Preserve colour relationships and text contrast; do not blindly invert colours, turn everything into glass or assume dark mode is universally more calming. A proof-only theme toggle can be in memory. Real preference storage/OS-default behaviour is a later implementation contract.

### Acceptance evidence for 01b

Show landing → Start working → Today → Focus → Pause/save → Resume → small completion → journey selection → final review → confirmed reward → finished work as one connected proof. Retain and rerun F01–F05 regressions. Capture real desktop/phone evidence in light and dark, demonstrate hover/focus/tap matching the route, long saved instruction, fifth step, keyboard/Escape, reduced motion and a still focus state. Label fictional data, static geometry/minutes and unverified background behaviour. Learner reviews the composition before production integration.

## 1. Design objective

Make it easy to begin and resume meaningful work, and rewarding to look back at the work that accumulated. The first glance answers: **what do I do next?** The second glance reveals: **my work is adding up.**

The learner has rejected the current Trail graphical presentation in full. Build an original, elegant graphical system that belongs with a light, minimal interface. No reuse of the current pixel mountain, avatar, trees, scenery or visual layout as the new design. Retain valuable domain behaviour and user records independently of presentation.

## 2. Confirmed visual requirements

Strong Stripe and Linear inspiration, light/white base, dark readable text, selective colour, minimal clutter, deliberate bento-style grouping, soothing focus atmosphere and smooth motion. Meaningful forward progress and landmarks remain important. “Minimal” does not mean stripping away context or reducing the reward to a generic progress bar.

## 3. Proposed graphical concept — an illuminated contour journey

**Proposal requiring visual review:** a continuous, smoothly drawn route passes through a softly dimensional contour landscape. Fine elevation lines, pale surface shading and a narrow coloured trail give depth without cartoon scenery. A small precise marker is proposed for the saved position. Completed subtasks get a mild glow; unfinished sessions get a simple “Unfinished” tag. Larger landmarks, where used, must tie to actual work.

Use perspective sparingly, like a carefully lit physical relief map. The scene should remain intelligible in a still image, in grayscale labels and with reduced motion. It must have a recognizable silhouette and purposeful whitespace, not a random squiggle floating in a rectangular card.

### Daily representation

An intimate route for the selected day shows recorded work in chronological order. Segments refer to real sessions. Confirmed simple encoding: completed subtasks have a mild differentiated glow; sessions stopped unfinished carry an “Unfinished” tag. Keep duration accessible. Proposed graphical implementation: restrained session segments with an identifiable completion node. Exact geometry and minutes-to-length formula remain proposals, not approved rules.

Selection reveals the task, date/time, duration and saved context in a stable nearby detail region. The same information must be reachable without hover. Label what minutes mean. Do not label illustrative distance as kilometres or imply real location.

### Larger-goal representation

A persistent contour journey summarizes work across days for one goal. Landmarks are named from actual completed actions or approved milestones, not arbitrary “life level” unlocks. Daily sessions contribute to this longer history; do not duplicate the completion count or invent progress percentages.

Goal completion remains an explicit user confirmation, not the end of a drawn path. Adding work later must not erase earned history or randomly relocate its meaningful landmarks. The mapping and correction behaviour must be settled before implementing this graphic.

### Pointer response

Proposal: on a fine-pointer desktop only, permit very small perspective/lighting changes inside the graphical region. Cap tilt around 2–3 degrees and translation around 4–6 pixels during the proof; settle back gently on leave. Do not move the whole page, task instructions, buttons or text selection. No cursor follower. Disable this effect in focus mode and under reduced motion. Values are starting points for review.

## 4. Proposed screen composition

These are proposed placements, not user-approved mockups. Before implementation, make realistic screen proofs at desktop and phone sizes.

### Today — returning

Quiet navigation comes first structurally but recedes visually. Inside a readable content width, show a small goal label, the exact next action, the saved “When I'm back…” instruction where present, and an obvious Resume. Keep optional editing and duration controls nearby but secondary.

Desktop proposal: an unequal two-column bento arrangement. The action occupies the stronger left region; the daily route supports it on the right. A narrow secondary area below holds the remaining steps and access to the goal landscape. Avoid a border around every paragraph. Do not show the same task title in three places.

Phone proposal: next action → context → Start/Resume → daily route → secondary work. No scenic block or greeting should push Resume below the first viewport for an ordinary task. Do not achieve this by hiding necessary task text or reducing its size.

### Recommendations — requested refinement

The learner wants manual importance and category controls when setting up work, with suggestions ranked using importance and time neglected. Show these inputs compactly; do not turn goal creation into an administrative form. Exact values and whether category is optional still need a decision.

Proposed Today placement: a short secondary recommended list with each action's real ranking reason and a clear selection control. The user-chosen next action remains primary, and running focus should not be replaced by a newly higher-ranked suggestion. Important unfinished work remains eligible for the next day even after a recorded session. Show remaining steps with a factual label such as “3 steps remaining,” not a percentage of verified work or a shame label. No extra top-of-page dashboard or priority score hero. Ranking math and precedence need PRD approval before implementation.

### First use

An uncluttered invitation to add a goal, with a brief direct explanation of Trail. A secondary example can demonstrate the route, explicitly labelled as example data. No mandatory tour, invented history or empty dashboard of zero-valued metrics.

### Goal creation and action editing

One clear goal input; manual steps are available without an AI request. AI assistance is optional and asks for needed context rather than inventing it. Keep the resulting editable plan on the same conceptual surface; do not force a chat interface. Reordering/editing belongs to the action list and must not change old accomplishment records.

Use step rows with a readable action and compact duration. Keep primary acceptance distinct from adding another row or requesting AI. Preserve the user's draft on failure. No mandatory five-step onboarding or fixed requirement for 4–6 steps.

### Focus

Show the selected goal quietly, the current action clearly and a readable timer. A low-contrast atmospheric treatment may surround the work but never pass behind text in a way that changes legibility. Keep Pause and Complete visible and distinct. Returning from another tab must not steal keyboard focus or force a modal.

The timer is a commitment cue, not a claim to detect attention. Do not pause merely because the user changes tabs: working elsewhere is the intended session. Closing/recovering the app, sleep and unexpected interruption require separate safe accounting; retain existing semantics until explicitly revised.

### Expired focus and extension controls

The learner explicitly wants compact +5, +10 and +20 minute extension buttons when work remains. Place them close to the timer/ongoing action in the expired state; retain clear pause/save and completion actions. Do not repeat a full planning form. The extension should feel like continuing the same work, without a new-task celebration or loss of context.

### Streak — one completed action earns the day

The learner confirms that completing one subtask qualifies the day. More same-day completed subtasks enrich the small streak icon's colour and flame-like motion. Keep streak length and daily visual intensity distinct. Exact tiers and colour progression are proposed visual work, not selected values.

The streak stays secondary to the next action and shares the interface's deliberate visual system. Use restrained, small flame motion rather than a game HUD or an attention-grabbing loop. Provide a static reduced-motion counterpart. A real zero-history state must not show a fabricated streak. Missed days stay blank, and the learner requests a short grace period before streak reset. Three consecutive missed days break the streak; one or two missed days remain blank without breaking it. Displayed count during grace, day boundary and correction behaviour still need definition. If the streak ends, acknowledge it with a hopeful, easy restart, preserving the visible work history. Do not imply that grace days were productive days.

### Slim floating strip

Optional progressive enhancement. Proposal: one row containing a compact action label, tabular timer and Pause. Provide a simple route back to the main app. No scene, quotes carousel, large task editor or navigation inside it. Start with a target around 320–380px wide; the browser may impose minimum dimensions or window chrome, so never promise an exact strip height before trying it. Closing the strip should not silently complete work; determine whether the session continues in the main app during the technical planning stage.

### Pause and quick update

Latest confirmed feedback: unfinished work should feel like a welcoming saved place that the user expects to revisit. Use a brief warm invitation to return rather than a failure state. The learner offered “hope to see you soon” as a tone example; exact copy is not selected. Do not award completion or erase recorded effort.

Pause takes effect immediately. An optional small inline area offers “When I'm back…” and, only when useful, additional context. Do not put a required form between the user and Pause. Saving a note does not award task completion. Preserve the original wording if AI optionally proposes a clearer version; the user chooses what to save.

### Completion

Latest confirmed direction supersedes the earlier local-only proposal: completion should create a recognizable “hooray” moment. Explore celebratory particles or another beautiful effect, a coordinated contrasting colour transition across the screen, and a visible route/checkpoint update tied to the work just completed. This is a reward moment, while the normal focus environment remains calm.

Two levels are now confirmed:

- **Subtask:** a small check/tick or checkpoint animation that communicates one item finished. Local, concise and easy to continue from. No full-screen gradient celebration for an ordinary step.
- **Whole goal:** the main achievement moment. Animate the light background into a coordinated purple/blue gradient across the screen; transition the text into a warm congratulatory message; use subtle ambient motion once the colour arrives. The change should feel smooth and composed, rather than an abrupt theme switch or particles pasted over the old scene. The route/goal representation must also visibly acknowledge the completed work.

The exact celebration is not visually approved. Whole-goal confirmation trigger, duration and exit behaviour still need decisions. Particle/confetti effects are not mandatory; the latest emphasis is the beautifully animated colour transformation and message. Design recommendations for review: keep the effect finite and non-blocking; keep the completed action, next action and Undo understandable; avoid flashing or changing the contrast of essential text; provide a reduced-motion final composition without moving particles. The page should settle into a usable state without requiring repeated dismissal. These recommendations are not a substitute for the learner's decision on duration and control.

Correcting an accidental completion removes its accomplishment contribution while retaining legitimate recorded focus time. Saving unfinished work must never trigger the completion celebration.

### Final review and finished-work blocks — refinement pending clarification

The final planned subtask should lead to a small review window, with an option to add another subtask. A finished-tasks collection is now requested: beautiful colour-bearing blocks/windows retain completed goals, with the surrounding page background intact. The user should be able to recognize accumulated accomplishment rather than just see a total count.

Do not silently resolve the spoken “raise the task” into a product action. Ask about exact review options as needed. Do not infer mood; colour assignment needs a decision. Most importantly, clarify whether the small colourful window replaces, precedes or otherwise changes the earlier whole-screen gradient celebration. The previous screen-transition proposal is not executable until this relationship is settled. Update all screen proofs consistently after that answer.

### Goal/history exploration

The user can revisit the larger journey and select landmarks to read the work behind them. A concise accessible record accompanies the graphic. History should be deliberate exploration, not an always-expanded wall of logs on Today.


## Colour relationship — working proposal, not final visual approval

The learner is unsure about category-based colour distinctions and is comfortable ruling them out if not useful. The phrase “task virality” is ambiguous and must not become an importance/virality score. No automatic task categorization, mood inference or category-colour engine is required.

Recommended simplification: one coherent Trail palette. Subtask feedback uses a small accent; whole-goal celebration expands the same colour family into a purple/blue gradient; finished-goal blocks keep a contained echo of that colour while the page is neutral. This gives continuity without adding classification or settings. Exact colours and any optional per-goal selection remain unapproved.

Recommended sequence for visual proof: final subtask → compact review (confirm goal finished, add a step, or keep unfinished) → only after explicit confirmation, a finite goal celebration → settle back to the neutral page, retaining a coloured finished-goal block. Review-window actions and this sequence are proposed defaults derived from the approved explicit-confirmation boundary, not a new learner-approved interaction contract. Do not infer implementation authorization.

## 5. Proposed visual system

Exact values below are starting defaults for the proof. They are not vendor-extracted tokens or final learner-approved values.

| Element | Proposed default and purpose |
|---|---|
| Base | Near-white `#FAFAF9`; white working surfaces; occasional neutral tint. |
| Text | Near-black `#202124`; secondary `#5D626B`; muted labels must still be readable. |
| Accent | Controls remain predominantly neutral/black. Small interaction details may use a coherent accent; `#5546D9` is only a proposed starting hue, not the complete colour system. |
| Graphic colour | Composed contrasting mixed gradients, shared across designated graphics and reward surfaces. Purple/blue anchors the goal celebration; exact additional hue balance is proposed for review. Do not reduce all colour to flat muted fills. |
| Type | One well-rendered sans-serif family; existing licensed/local fonts may be evaluated. Do not claim to use Stripe or Linear's proprietary fonts. |
| Task instructions | Approximately 20–24px desktop and 18–20px phone, with comfortable line height; adapt for realistic long content. |
| UI body | Approximately 15–16px; metadata 12–14px only where genuinely secondary. No tiny essential instructions. |
| Timer | Tabular numerals, stable width; approximately 44–64px in main focus, much smaller in the strip. It must not dominate the task. |
| Spacing | A consistent 4/8px rhythm; 24–40px between meaningful groups, less within a row. |
| Containers | Subtle 1px boundaries only when needed; roughly 12–18px corner radii. Avoid pills for every component. |
| Elevation | Soft shadows mainly for dialogs/popovers and scene depth, not all cards. |
| Icons | One consistent restrained line style; use text for critical actions. No decorative icon at every heading. |

Use one primary action per state. Buttons need default, hover, pressed, keyboard focus, disabled and pending treatments. Pending labels describe what is happening without fake percentage estimates. Destructive/correction actions must be distinguishable from starting work.


### Gradient composition — confirmed direction, exact execution for review

The learner explicitly refines “selective colour” to mean rich, beautifully contrasting **mixed gradients**, inspired by Stripe's small, intentional colour details against a predominantly black-and-white layout. This applies wherever this brief already specifies colour. Do not interpret the minimal interface as a flat monochrome dashboard with a single purple button, or satisfy the request with one decorative blob.

**Composition principles for the proof:**

- Establish one related palette with distinct luminous and quiet regions; blend hues deliberately instead of assigning unrelated gradients to each card.
- Use gradient direction and light to follow route geometry, depth or emphasis. Do not stretch the same diagonal rectangle over every element.
- Balance cool blue/violet with a carefully placed contrasting hue where it improves the composition. A teal or restrained warm counterpoint is a design proposal, not a selected extra brand colour.
- Preserve clear silhouettes, legible labels and neutral breathing room. Vivid colour is allowed inside intended graphics; do not wash it out merely to call the interface minimal.
- Maintain stable task/record associations across reload and history. Randomizing a finished block's colours on each render would weaken its identity.
- Controls may remain black/neutral with small coordinated details. Colour richness comes primarily from the graphical journey and achievements, not from making every control a gradient.

| Surface | Required interpretation of colour | Scale / hierarchy |
|---|---|---|
| Daily route and goal landscape | Composed multi-hue trail/light with nuanced transitions and dimensional shading. | Visually engaging supporting region; the next action remains primary. |
| Completed subtask | A restrained glow using the same gradient family and a clear completion marker. | Small local acknowledgement. |
| Unfinished session | Simple legible Unfinished tag; optional restrained palette detail only. | No completion glow or celebratory styling. |
| Milestones | Coordinated gradient light or small dimensional detail tied to actual progress. | Distinctive without turning the route into unrelated coloured ornaments. |
| Whole-goal completion | Smooth white/light-to-purple/blue gradient transformation, composed with deliberate contrast and changing congratulatory text. | Major expressive moment; exact lifecycle remains for review. |
| Finished-goal block | A contained, beautiful gradient composition carrying the goal's visual identity. | Colour belongs inside the block; surrounding page returns to neutral. |
| Streak | A compact gradient-colour icon with small flame-like motion as approved daily intensity increases. | Secondary; exact tiers and motion need proof. |
| Focus atmosphere | A quieter, lower-intensity version of the same colour language. | Soothing background support, never competing with task or controls. |
| Small interface accents | A few precise edge, selection or landmark details that echo the shared palette. | Selective, not a full collection of gradient containers. |

Motion should reveal or gently move the composition, not cycle through arbitrary colours. Review the whole-goal transition in motion and all designated surfaces as stills. Every readable state needs contrast independent of decorative hue; use a stable neutral text zone or appropriately controlled overlay where needed. Reduced motion keeps the final colour composition without parallax or animated gradients.

The proof must make the designer's colour choices visible across Today, Focus, subtask acknowledgement, whole-goal celebration and finished history. Exact hues, stop positions, blend technique and 3D treatment are not approved until reviewed. No third-party artwork or proprietary source copying is required to reach this standard.

## 6. Motion contract — proposed defaults

- Small control feedback: approximately 120–180ms.
- Panels and selection transitions: approximately 180–260ms; no large page jumps.
- Subtask completion: a subtle local tick/checkpoint acknowledgement. Whole-goal completion: light background transitions into purple/blue gradient, congratulatory text changes, subtle ambient motion and visible goal/route recognition. Exact transition timing and exit remain open; the earlier local-only proposal applies to neither the whole-goal scale nor its chosen duration. No endless celebratory loop.
- Focus ambience: if used, a very slow low-amplitude cycle. Offer a still presentation; no claim that motion improves attention.
- Reduced motion: remove parallax and ambient loops, and show final reward states immediately.
- Do not delay saving, pausing or resuming until an animation ends. Do not auto-scroll or move a focused control during a transition.
- Quotes remain unresolved. If included later, they are optional small text without disruptive pop-ups or continuous rotation.

## 7. Responsive and accessible review

Prove the same hierarchy at 1280×720 and 390×844, then check 320px width, a wide desktop and a shortened viewport. These are review targets, not a claim of completed checks. Long task titles, multi-line saved instructions and an expanded plan must remain usable.

Route landmarks need keyboard/tap selection, descriptive labels and textual record access. Essential information must not depend on colour, hover, animation or depth. Dialogs retain sensible focus and keyboard dismissal. Explanations and error recovery must remain reachable at narrow widths. Evaluate actual contrast, not the visual impression of contrast.

## 8. Anti-goals

No pixel art, miniature forest, climber, game HUD, XP, streak punishment, stock 3D illustration, unrelated glowing orb, giant greeting, motivational paragraph above the task, row of equally weighted statistic cards, gradient headline, fake attention score, mandatory AI chat, oversized timer dashboard or ornamental glass panel stack.

Do not preserve the old “mountain above task card” composition with a new palette. Do not reproduce a marketing homepage inside the working application. Do not add feature pages just because a reference website has them.

## 9. Review gates and deliverables

First review a single coherent visual direction through realistic static or isolated interactive proofs: returning Today, running Focus, mid-goal completion and goal/daily journey detail at desktop and phone widths. Include long content and a clear empty state. A pointer interaction, if shown, must be demonstrable rather than claimed from a still image.

Include a welcoming paused state, a subtle subtask acknowledgement and a whole-goal gradient celebration in the visual proof. Show their contrast without confusing saved effort with completion. Whole-goal motion requires an actual interactive or recorded demonstration, plus a reduced-motion still state; a static gradient alone cannot prove the requested transition.

For each proof, identify the source of sample data, what is illustrative, how the same state maps to current domain records, and unresolved decisions. Show screenshots or a local preview. Passing a layout check is not visual approval. Incorporate the learner's feedback before adapting production components.

Definition of design readiness: the learner recognizes the desired character; next action dominates; the replacement graphic is original and meaningful; the whole journey shares one visual language; essential state and controls remain clear at phone size. Then finalize PRD/spec/checklist, and implement bounded slices.


## Confirmed reminder refinement — morning/daytime return

The learner confirms automatic reminders when important work has been neglected, useful in the morning/daytime. Reminders must reach them while working in another tab and after Trail is closed. Exact neglect threshold, local delivery time/window, repeat limit and suppression during active work remain unresolved. Provide an explicit opt-in, clear permission/unsupported/denied states, an easy way to turn reminders off, and a return action to the saved task. Do not rely on a page timer for delivery after closure. Technical planning must define minimal remote reminder data and explain handling truthfully; no specific provider or schedule has been chosen. This does not authorize telephone calls or imply reminders are implemented.

Present notification setup contextually, with a plain explanation before the browser permission prompt. A reminder should identify the neglected work and lead to its saved next action, without shaming or claiming observed inactivity in other apps. Keep text disclosure configurable if work details may appear on a lock screen. Design permission-denied, unsupported and scheduling/delivery failure states. Exact notification copy, privacy default and reminder cadence need review; do not fake closed-page delivery in a visual proof.
