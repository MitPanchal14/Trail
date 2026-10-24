# Next coding handoff

Use GPT-6.1 Sol, medium reasoning, for a bounded implementation task when the user dispatches it. Read AGENTS.md and all current product documents first.

Current boundary: only the retained static UI demo exists. Do not restore the removed app or substitute a new visual direction. The first functional task should be a written state/data contract and then a single working slice: manually create a goal and ordered actions, start/pause focus, save the next action, reload, explicitly resume. Preserve the retained composition as the visual reference and make only agreed adaptations for real inputs.

Before implementation, record changed files, acceptance criteria and what remains simulated. Propose storage failure handling and interrupted-session rules. Do not add AI, push providers, auth or a backend until their scope is explicitly chosen. Run relevant checks, inspect the actual UI and report limitations. Update devpost/checklist.md and HANDOFF.md. Stop at the assigned boundary; no automatic visual acceptance or production integration claims.
