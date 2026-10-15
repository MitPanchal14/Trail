# Trail UI research — October 14, 2026

This is a focused qualitative reference study, not an exhaustive review, market ranking, or proof that a visual style caused a hackathon win. Public feature pages, submission stories, winner announcements, and available imagery were reviewed. No authenticated apps were tested. Some submission videos/prototypes were inaccessible; those projects inform interaction/storytelling principles, not verified live behavior.

## Verified winning examples

| Project | Verified award | Evidence and observation | Lesson for Trail (our interpretation) |
| --- | --- | --- | --- |
| Served | Philadelphia Social Justice Hackathon 2026, first place | [Organizer announcement](https://sjhphl2026.devpost.com/updates/43007-and-the-winner-is), [submission](https://devpost.com/software/project-01-2kpvy3). A community dinner table uses illustrated objects and messages to express care; the story explicitly discusses warmth and scope tradeoffs. Full live workflow was not verified; future-work section includes activating pipeline components. | The metaphor should embody the product's purpose. Trail's landscape should carry real work records rather than be decorative. |
| BEACON | Same event, second place | [Organizer announcement](https://sjhphl2026.devpost.com/updates/43007-and-the-winner-is), [submission](https://devpost.com/software/beacon-4itued). Guided multilingual input for a silent emergency-communication prototype. These are project-reported capabilities, not verified emergency-service integration. | Match interaction to the user's constraints. On a difficult return, show the saved place and one actionable step, not an entire planning burden. |
| DEVHACK | Hack Devpost, Community Choice Idea, 2023 | [Organizer winners](https://hackdevpost.devpost.com/details/winners), [submission](https://devpost.com/software/devhack). Submission describes surveying peers and wireframing. Submitted screenshot visually inspected: light mint surfaces, strong mint action controls, playful illustrations, conventional readable content area. Video is private. | Playfulness and readable information can coexist. Audience research matters. Community-choice design concept is not evidence for a functional-product judging rubric. |
| Time Ranger | Hack Devpost, Most Readily Usable, 2023 | [Organizer winners](https://hackdevpost.devpost.com/details/winners), [submission](https://devpost.com/software/time-ranger). Narrow browser utility addresses local-time confusion; submission documents before/after and error states. Live extension not installed/tested. | Make the improvement demonstrable and handle consequential errors. Saved-place recovery is a better demo story than merely displaying a landscape. |

These events have different criteria and award categories from Build With AI. They are transferable examples, not predictors of a win in this event.

## Established task-app references

No claim is made that these are currently the highest-revenue or most-used task apps; comparable business metrics were not verified. They are established references with public product documentation.

- [Things features](https://culturedcode.com/things/features/): expandable task detail, Today/Evening separation, checklist structure, and a reduced-sidebar Slim Mode. Public screenshots visually inspected. Lesson: reveal detail when needed and reduce surrounding chrome during work.
- [Todoist features](https://www.todoist.com/features): natural-language Quick Add, Today versus Upcoming, task descriptions and subtasks, completion archive. Lesson: reduce capture friction; keep today's work distinct from planning and history. Its listed AI tools and existing task features also mean AI breakdown is not sufficient differentiation.
- [TickTick features](https://ticktick.com/features): voice capture, list/detail columns, Pomodoro, statistics and calendar views. Lesson: capture, focus, and reflection are different jobs. A timer plus task list is established functionality, not novelty.
- [Habitica official repository](https://github.com/HabitRPG/habitica), [official overview](https://translate.habitica.com/projects/habitica/overview/en_GB/): RPG task/habit rewards and health-loss mechanics. Lesson: pixel gamification is established; Trail must distinguish itself through contextual return and a persistent work landscape, not just an avatar.

## Recommendation

A readable bento working shell around a substantial pixel-art landscape. Forest-green primary actions, warm cream surfaces, moss foliage, soft-blue water/sky, and golden completion light. The exact palette is an original recommendation, not copied from a winner or experimentally validated.

The lab offers a fully pixel-framed alternative and three palettes in the same composition so comparisons do not change the feature set. Woodland is the recommended default; Alpine has cooler atmosphere; Dusk is an optional dark comparison. Golden light is reserved for earned completion, not every UI control.

### Layers

1. Working interface: navigation, one next action, saved context, duration, clear controls.
2. World: pixel terrain, named checkpoints, a small climber; progress changes the landscape.
3. Response: small local illumination on completion, saved resting place, persistent glow after a genuinely completed goal is reopened.
4. Reflection: separate Progress page; illustrative grid and factual labels.

### Cases in the demo

First-use empty scene, in-progress/saved-place return, focus mode, timer expiry, completed action, completed mountain, reopened mountain with retained glow, and an illustrative AI error. These are design states, not production behavior. Demo completion, countdown, notes and page switching work locally in memory; refresh resets the sample. No AI API, voice recognition, user accounts, persistence, or real productivity data is provided.

## What to decide next

Choose hybrid or pixel UI chrome, choose a palette, and assess whether the selected next action remains obvious. Then incorporate the chosen direction into the PRD in one batch. The lab does not approve a design or authorize additional features.
