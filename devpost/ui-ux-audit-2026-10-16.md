# Work Trail UI/UX audit — 16 October 2026

## Review boundary

Live browser review of Today with an existing saved diagnostic task, blank New task dialog, and expanded daily planner. Inspected desktop and narrow mobile layouts. No AI calls, task completion, data clearing, or application-code edits. Completion animation, populated AI review, keyboard journey, and measured contrast remain unverified in this pass.

## Main conclusion

Preserve Dusk, bento, and pixel terrain. The immediate problem is competing information and weak surface/state differentiation. Refine hierarchy and spacing before expanding features or rebuilding terrain.

## Prioritized findings

| Priority | Finding and visible evidence | Requested correction |
|---|---|---|
| P1 | Saved card repeats the action title under “First thing when I return” when no custom return step exists. “Continue from here,” “First thing…,” “Where I stopped,” destination, finish condition, timestamp, and two time metrics all compete. | Lead with the real return step when provided. Otherwise show the action once. Omit empty-note filler; move timestamp and recorded time into optional session details. Retain finish condition as secondary information. |
| P1 | On mobile, header, introduction, New task, and the tall saved card consume almost the entire first screen. The world is below it, severing the visual feedback from the action. | Reduce introductory spacing and saved-card density. Keep Resume immediately visible and provide a compact world/checkpoint glimpse near the action. Do not shrink text or touch targets to force everything above the fold. |
| P1 | Background, cards, nested return panel, secondary buttons, and selected navigation are all similar green tones. Most meaning comes from text. | Define distinct background, raised card, input, and return-context surfaces. Preserve cream text and pale lime primary actions. Use restrained warm amber for earned checkpoints and cool blue for saved position, accompanied by labels/icons. Verify actual contrast before claiming compliance. |
| P1 | Desktop planner reads in disconnected columns: optional context sits left, time right, candidate selection left, summary/actions right. Its empty selection still offers AI planning prominently. | Group context/time as one compact setup row, then work selection, then ordered plan/total and actions. Make the next required step explicit. If AI can select work, explain that; if it requires selection, reflect that prerequisite in its state. |
| P2 | Large generic heading “Your place is waiting” and world heading “A world of possibility” occupy space without identifying useful work or progress. | Use a smaller state heading and make the actual task/project the content anchor. Replace generic world heading with contextual progress such as completed checkpoints, without inventing success. |
| P2 | The world is muted grey-green; the climber/campsite is small relative to the terrain and the saved-position meaning relies on a tiny legend. | Improve local contrast around current position, campsite, path, and earned checkpoints. Add a short contextual status near the climber. Preserve naturally coloured scenery and distinguish earned light from baseline colour. Major terrain redesign remains separate. |
| P2 | Legends and helper copy are small and spread across the bottom of the world. | Consolidate into a compact, readable legend or optional key; keep current-state text visible. Verify at mobile size without zoom. |
| P2 | New task dialog has large vertical gaps between heading, description, field, optional context, actions, privacy copy, and footer. At the reviewed intermediate width, Discard draft is beyond the visible dialog area. | Tighten section spacing, group actions, and provide an intentionally scrollable dialog with a reachable footer. Primary: Build with AI; secondary: manual entry; microphone belongs near the description input. Keep Close discoverable and preserve drafts. |
| P2 | Too many outlined full-width controls compete, particularly microphone/manual/close in creation. | Establish primary, secondary, and quiet action treatments. Retain comfortable touch targets; reduce visual weight rather than click area. Hide or disable irrelevant empty-draft discard affordance appropriately. |
| P2 | “Edit breakdown” touches the bottom edge of Today’s plan and appears detached from its task. | Place it with the relevant task/project controls, or give its section a clear gap and alignment. Adopt a consistent spacing scale: 8/12/16/24/32px, with roughly 16–24px card padding on mobile and 24–32px on desktop where appropriate. |
| P2 | User-facing copy includes “durable heartbeat,” “earned only by completing this action,” and repeated warnings that AI does not commit. These read like implementation requirements. | Keep necessary consent and storage information accessible. Replace technical copy with plain language; put detailed recovery limitations in disclosure/help. State the main rule once, near the relevant action. |
| P2 | Disabled “Commit today’s plan” retains a pale lime fill, resembling an available primary action. | Give disabled controls a clearly inactive appearance while preserving readable text; add concise guidance such as “Choose work to continue.” Do not rely solely on opacity. |
| P3 | Desktop sidebar consumes substantial width for one working destination and two “Later” items; local-only information repeats in header/sidebar/footer. | Keep unavailable destinations low emphasis or omit until usable. Consolidate local-storage information into one consistent location with recovery access. |

## Implementation boundaries for OpenCode

- Fix P1 items first, then spacing/action hierarchy and copy. Preserve the approved visual direction.
- Do not change timer, persistence, AI acceptance, checkpoint accounting, Undo, or closed-tab recovery semantics as part of visual cleanup.
- Read AGENTS.md and relevant installed Next.js guides before editing code. Preserve unrelated work.
- Use fictional isolated records for state demonstrations. No live Gemini requests are required.
- Verify desktop, intermediate width, and 390px mobile; long task names, real return notes, empty notes, empty planner, and populated planner. Check keyboard focus and reduced motion where affected.
- Capture before/after evidence in ignored test output. Run checks appropriate to the changed behavior and update HANDOFF.md with actual results.
- Completion/reward animation and AI review need a separate observed check; this audit does not assert they are broken or accepted.
