---
doc: handoff-review
status: approved
---

# Work Trail — Final Planning Review

User approved these recommendations on October 15, 2026. Accepted decisions are consolidated into prd.md and spec.md. BUILD_PROMPT.md is the implementation entry point; preserve design-lab as a reference. This sheet records the review, not current build progress.

## Product defaults approved for the PRD

1. **Next action:** most recently saved unfinished action first; otherwise the first unfinished action in today's committed order. The user can override it. If neither exists, choose work or create a task.
2. **Day commitment:** edit suggestions as a draft, then press Commit today's plan. Subsequent additions enter commitment history; removed/deferred items remain visible. A nonempty historical commitment set must be fully completed on that day to earn its all-done marker. A late completion belongs to its actual completion day.
3. **Pause:** temporary Pause/Continue controls stop/resume the countdown without requiring a note. Save my place exits focus and offers an optional context note. Reload always requires explicit Resume.
4. **Editing:** allow add, rename, remove and reorder before accepting an AI draft. After acceptance, preserve completed records and stable checkpoint positions; archive steps instead of deleting their history.
5. **Grid:** fixed bands 0, 1, 2–3, 4–5, 6+ completed subtasks, with an accessible legend. Counts are activity rather than productivity scores.
6. **Summit correction:** Reopen means the goal was achieved and now has more work, so it retains its glow. Correct mistaken goal completion is a separate explicit action that revokes erroneous summit confirmation/glow while preserving valid checkpoints. Undoing a subtask asks whether a linked summit confirmation is also mistaken; no silent historical rewriting.
7. **Celebration:** brief local colour spread after completion and a short summit illumination that settles into persistent light. Reduced motion shows the final appearance immediately. No blocking reward modal.
8. **Palette:** user-selected Dusk now supersedes the original Woodland recommendation: evening green surfaces, pale text, sage controls with dark text, blue water and warm localized earned light. Preserve bento controls and the original detailed pixel world. The design-lab comparisons remain historical research.

## Recommended technical approach — approved

**One Next.js/TypeScript app, browser-local storage, Gemini behind a server endpoint, deployed on Vercel.** No accounts, hosted database, payments or cross-device sync in this first build.

The browser remembers tasks, notes, sessions and achievements on that browser/device. Clearing site data removes them; provide JSON export/import for recovery. Other people can try the public app with their own separate browser data. This is the important tradeoff to accept before building.

The server handles AI calls so the Gemini secret never reaches the browser. Only the description/context submitted for planning goes to Gemini; ordinary focus records stay local. Voice is optional browser-supported transcription with a visible typing fallback and disclosure that recognition may use the browser vendor's service. No custom transcription service initially.

Use ordinary React/CSS for accessible bento controls and an original Canvas pixel scene with HTML checkpoint controls/details. Avoid a 3D engine and game framework. Gemini returns structured drafts that are validated before review, never automatically accepted. Next.js supports server route handlers; Gemini supports structured output. Verify current model availability, quotas, deployment limits and dependency versions during setup, then lock versions.

Official references:
- https://nextjs.org/docs/app/getting-started/route-handlers
- https://ai.google.dev/gemini-api/docs/structured-output
- https://vercel.com/docs/plans/hobby
- https://vercel.com/docs/functions/limitations

Public AI access needs bounded inputs, timeouts and deploy-appropriate abuse protection; a browser-only throttle is insufficient. If protection is unavailable, disable public AI generation and retain manual creation rather than expose an unlimited key-backed endpoint. No promise of zero API costs.

## Build order proposed

1. **Visual slice:** Today, bento hierarchy, responsive pixel mountain, empty/one-checkpoint/rich-history states. Sample data clearly labeled. Review in desktop and mobile browser before adding breadth.
2. **Real work loop:** persistent task records, timer, save context, interruption recovery, explicit Resume, completion and Undo. Test reload/background/closure cases; don't credit closed-tab absence. Persist heartbeats and report recovery precision honestly rather than promising perfect close-event delivery.
3. **Creation and planning:** editable manual creation first, optional voice, validated live AI breakdown, full review, day commitments and editing history.
4. **Mountains and Progress:** stable checkpoint mapping, inspectable history, summit/reopen/correction, yearly grid and factual comparisons.
5. **Ship:** export/import, meaningful checks, browser verification, protected deployed AI or clearly disclosed manual fallback, README, demo script and submission preparation. Recheck actual hackathon requirements and deadline before submission.

## What the final handoff must contain

- Approved PRD and synced visual companion.
- Technical spec and offline visual architecture companion: precise storage schema, timer recovery, stable terrain positions, event correction rules, local calendar dates/timezone policy, AI contracts, error states and file structure.
- BUILD_PROMPT.md: read order, first slice, review boundaries, explicit exclusions and design quality bar.
- checklist.md: ordered slices tied to PRD/spec sections with acceptance checks.
- HANDOFF.md: honest current status, verified commands/results, next slice and known limitations; no fabricated implementation or test results.

## Readiness

Planning is approved. No application has been implemented. See HANDOFF.md for current status and BUILD_PROMPT.md for the first slice.
