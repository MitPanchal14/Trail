# Next dispatch — make Trail's mountain worth completing

Use GPT-6.1 Sol Medium initially. This is a bounded visual/product task, not a repository-wide rewrite. One editor only: OpenCode or Antigravity, never both concurrently. Start from verified pushed checkpoint `4d2b9fb2006b31564a8e5c2ebe3e6c710df09336` on `codex/trail-redesign`; preserve any newer local changes.

Read AGENTS.md and required product documents once, including the latest design-brief/HANDOFF decisions. The user's latest feedback supersedes prior graphic deferral. Record affected files and the design/state mapping BEFORE cross-file edits. Then implement; do not spend this pass producing competing plans.

## Outcome

Replace the floating stepping-stone illustration with a refined mountain ascent that fits the existing website. The user accepts the written layout but finds the graphic poor and the product too similar to a to-do list. The mountain should show the relationship between completed actions, the next action and the place the user saved. Preserve home/Today/Focus page structure, typography and current colours. Do not restore historical pixel art/code or another runtime.

## Concrete art direction

- Build one shared, responsive custom SVG mountain scene for existing graphic slots, using the existing renderer or a small shared presentation module only if necessary. No new dependency, WebGL engine, asset download or stock illustration.
- Compose a clear main mountain silhouette, a few restrained layered ridges and contour lines, and a winding ascent integrated into the terrain. Aim for a calm, crafted landscape with breathing room; avoid noisy low-poly triangles, giant emoji, excessive neon, glass cards and the old floating stones.
- Use the site's cyan/blue/violet accents selectively on the earned trail/current marker. Mountain surfaces should use deliberate theme tokens: pale, readable terrain in light mode; distinguishable charcoal/indigo terrain in dark mode. Preserve sufficient contrast for meaningful markers/text.
- Show a distinct current-position/return marker and a subtle summit destination. Use compact nearby labels; full action names/context remain in the existing text/list. Long text must not spill across the landscape.
- Keep visible action counts and recorded effort separate. Do not label geometric height/distance as measured productivity, effort or percentage of actual work.

## Truthful state mapping

- Derive each action marker from its actual status/ID, not just `index < completedCount`. Reopening an earlier action must not turn later checked actions into unchecked ones.
- The next action is the first unfinished action in canonical order. A saved-place label appears only if that action has saved context; otherwise label it Next action. Selecting another action highlights it without moving the actual current marker or writing state.
- Complete action produces a brief restrained visual response and updates the earned marker/path. Undo and reopening restore the correct visual state without removing recorded effort or inventing movement history. Rendering/navigation must not mutate canonical records or start timing.
- All actions checked is **Ready for review**, not Goal finished. Only the explicit committed finish may earn the finished summit state. Existing reward remains immediate/dismissible and never replays on reload.
- Fresh/no-goal home remains a clearly labelled illustration with no fake earned progress. Fictional example remains isolated. Preserve the renderer's existing example consumers, including any reward use, rather than leaving one old graphic behind accidentally.
- For many actions, keep the mountain at a legible bounded width. Show a simplified overview with the current neighbourhood/checkpoint count as needed; retain the complete existing action list. Do not squeeze 30 labels into the scene, hide access to actions or imply a different completed count. Geometry may adapt when actions change; do not claim a literal historical route.
- Handle 1, 2, 5 and 30 actions, long names, fresh/partial/all-checked/finished/reopened states without division errors or misleading states. No new persistent visual coordinates or schema changes.

## Interaction and motion

- Existing accessible action controls/list remain the source of selection; do not make critical interactions hover-only or hide them in the SVG. An illustrative SVG must not look like a drag control.
- Respect reduced motion and existing Background motion Off. Use a short earned-state transition only where state actually changes, not an arrival animation on every render. Keep the final state immediately readable when motion is disabled. Avoid continuous render loops and slow page entrances.
- Preserve Focus composition. No audio implementation in this pass: the existing control is background motion, not sound. No streaks/calendar, reminders, AI, sync, capture, new goal model or unrelated copy overhaul.

## Known review findings — preserve and report, not silently close

`RETURN_EDGE_REVIEW_2026-10-25.md` records context-only removal/data loss, long return text burying controls and stale validation after Skip. Keep these open for the following bounded correction pass; do not claim this renderer fixes them or include unrelated state-engine changes. Normal-sized written layout is accepted.

## Verification and stop boundary

1. Run syntax, current unit tests, build and diff check. If a new presentation module is created, update serving/build allowlists and syntax checks intentionally.
2. Exercise real create → complete → Undo → complete → review → finish → reload → reopen. Verify graphic states/counts and separate selection vs current position, especially reopening an earlier step while later steps remain checked.
3. Browser-check existing return/timing/storage/example regressions after adapting presentation selectors only where needed. Do not weaken domain assertions to make a visual change pass.
4. Inspect screenshots of light/dark at desktop and 390px: no-goal home, active home, Today, Journey and finished state. Include 1/30 actions, long labels, all-checked-but-unconfirmed and reduced motion. Check layout/label readability, overflow and keyboard access, not just screenshot existence. Inspect at least one transition in the browser.
5. Verify repeated SVGs use unique definition IDs. No new external network requests, unsafe HTML or record writes from rendering.
6. Update HANDOFF.md, checklist, design brief and one concise evidence file with actual results, screenshots and remaining limits. Keep current changes recoverable; do not reset another worker's changes.

Target a reviewable first implementation within 60–90 minutes including checks; cut decorative detail if needed, not state correctness. Stop for user visual review. No commit, push, deployment or submission. Return local URL, changed files, verified states, screenshot paths and remaining issues. After review, the next separate pass can address the three edge cases, a gentle productive-day indicator and optional sound.
