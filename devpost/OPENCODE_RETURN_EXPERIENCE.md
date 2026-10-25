# Dispatch: useful saved place and work reference

Use the existing checkout `/Users/mitku/Documents/Hackathons/Devpost/Build_With_AI`, branch `codex/trail-redesign`. Reviewed starting checkpoint: 6d9a930. Verify actual Git state; preserve later user changes. One implementation owner, OpenCode OR Antigravity, at a time. This is the next bounded product-improvement pass authorized by the user's request for creative solutions within today's deadline.

Read AGENTS.md and its required documents, HANDOFF.md, then RETURN_EXPERIENCE_PLAN_2026-10-25.md. The research is context, not authority to build its deferred alternatives. Record exact affected files and plan BEFORE edits. Do not restart the project.

## Goal

Make the existing pause → save → return loop more useful with minimal capture effort: one optional next move, existing optional context, one optional work URL, and a clear saved-place presentation in the retained Today/Focus layouts. A URL is a user-supplied reference, not automatic context capture. Preserve both corrected bugs and the approved home/Focus composition.

## Implement only this scope

### 1. Low-friction save

- Existing Pause still stops trustworthy timing immediately, before notes. Do not merge pause and note persistence into an optimistic uncommitted success.
- Make the existing nextInstruction field prominent with a concrete prompt, e.g. “When I return, the first thing I’ll do is…”. Use an illustrative placeholder, never seed/save a fabricated next move.
- Keep extra context collapsed/optional. Add one optional Work link field there, prefilled only from this action's saved link. Preserve useful existing values; no additional required fields.
- Explicit Save and Skip remain. Blank instruction/context preserve prior useful values independently, as now. Skip changes no saved context. Unsaved pause values, including link/removal intent, survive in-app navigation/mode switching as the current pause-draft contract does; reload durability for unsaved drafts is not required.
- Add Cmd/Ctrl+Enter to submit this form only, if straightforward. Use the same validation/pending-save path, ignore IME composition, and leave ordinary Enter/browser shortcuts intact. Display the shortcut unobtrusively; do not add a global shortcut system.
- Keep saving/failure/Retry messages truthful and retain draft on invalid URL or transaction failure.

### 2. One optional safe work URL

- Add only optional context.resourceUrl to canonical action context. Existing schema-v1 records without it remain valid, unchanged on read, with no destructive migration and no required new field.
- Use a single URL validation/normalization implementation shared where practical. Accept explicitly absolute http: or https: URLs only, up to 2048 characters after trimming; preserve query/fragment. Reject credentials, invalid/relative URLs, protocol-relative URLs, control characters, javascript:, data:, file:, blob: and other schemes. Do not infer https or fetch URLs to guess titles.
- Notes command semantics: absent/blank UI input preserves an existing resource; an explicit Remove saved link control sends an intentional clear (e.g. resourceUrl:null removes that optional key). A nonblank new URL replaces it only on successful Save. Skip never clears it. Document the distinction so a blank field is not an ambiguous delete.
- Validate optional stored URL metadata, including Undo snapshots as appropriate. A malformed saved record must follow the existing preserved-data error path rather than execute/fix/reset silently. Reject invalid commands without changing input. Keep exact retry identity and full Undo context restoration.
- Use existing transactional storage and context.updatedAt; no extra database, dependency, API key, backend, collection or remote request. If supporting code must change, keep it strictly within this contract.

### 3. Make the saved place useful on return

- In the existing Today action area, lead with the actual saved next move, show existing where-stopped context with clear hierarchy and show the actual context save date/time when present. Never call it last activity/last worked or fabricate one. Fallback action title must be labelled as the next unfinished action rather than a remembered thought.
- Show an Open work anchor only for a valid saved URL. It opens the supplied page in a new tab on user gesture, with rel="noopener noreferrer"; use text-safe rendering and an intelligible hostname/label. It does not start/resume/pause timing, mutate records or claim the person resumed external work. Make the reference reachable in Focus saved context and finished context where applicable without cluttering the main controls.
- Preserve explicit Start/Resume and completion controls. Opening work is usable while the timer remains paused. Do not introduce an untimed session model or new timer preset.
- For returning work, prioritize saved context over secondary stats. Keep the home/Focus layout, colours, type and approved route composition; no new dashboard or illustration redesign.
- Change full-goal “Today’s trail” wording to an accurate goal label where it is showing the entire goal. Show completed action count out of total separately from recorded effort; no invented daily mapping/distance/attention claim.
- Shorten technical copy in these touched flows, retaining essential save/error/local-storage/Undo explanations. No site-wide rewrite.

## Constraints

- Preserve one open goal, context preservation, conservative timing, exact Retry, exclusive tab ownership, explicit Resume, completion/Undo/review/reopen contracts, and example isolation.
- Do not restore historical UI or change frameworks. No AI, extension, bookmarklet, screen/clipboard tracking, voice, screenshot upload, reminders, streaks, multi-goal priority, sync, new renderer or analytics instrumentation.
- Do not commit, push, deploy, submit or send messages. Use isolated browser profiles; do not manipulate the user's normal local data.
- Target about 90 minutes for implementation plus verification. At two hours, report exact status and cut new scope rather than weakening invariants. Keep the checkpoint recoverable; do not reset the whole checkout or conceal failing work.

## Verification and acceptance

Add meaningful tests, keeping existing coverage:
1. Old v1 records lacking URL load unchanged. Notes without URL preserve existing contexts. Invalid commands do not mutate input. Valid URL accepts query/hash; invalid schemes/credentials/relative/control-character inputs reject. Explicit clear works; blank and Skip preserve.
2. Actual browser: pause → save next move/context/link → reload → see exact saved content/time → Open work → explicit Resume. Opening the reference causes no canonical/timing mutation; assert new-tab URL and isolation safely with a local test fixture. No external request is needed for the test.
3. Actual aborted context/link Save: retain draft and removal intent, no false success; exact Retry commits once. Existing canonical context and timer/ownership remain correct.
4. Complete and Undo restores exact saved URL/notes and stopped timer; history/reopen retain the correct action reference. New action must not inherit another action's link. Unsafe raw stored links never render executable markup.
5. Unsaved goal draft mode-switch regressions, unsaved pause/link mode round trip, literal HTML-looking text, normal/keyboard save, blank/Skip and clear behaviour.
6. Both themes/390px, long URL and context, visible focus/labels, useful collapse behaviour; no horizontal overflow. Inspect screenshots; preserve composition.

Run npm run check, npm test, npm run build and git diff --check. Run focused regressions while developing and the full Chromium integration suite once after final changes; do not repeat unrelated passes without a new reason. Adjust selectors/assertions to the final honest copy without weakening behavioural checks.

Update README/spec/PRD/scope as needed to accurately describe optional work references, accepted compatibility and limitations; update HANDOFF.md, checklist and a fresh evidence section. Mark the feature done only with results. Separate implementation checks from physical Mac sleep/branded-browser/user validation, which remain outstanding unless actually performed.

## Token efficiency and handoff

Inspect relevant source selectively; no broad directory dumps, parallel agents or speculative refactoring. One short plan, bounded implementation and concise evidence. Default model recommendation is GPT-6.1 Sol Medium, not a quota guarantee; use High only for a demonstrated unresolved problem.

If quota is nearly exhausted: stop editing safely; save files; write branch/HEAD, changed files, completed/failing checks and exact next step to HANDOFF.md. Do not start an overlapping agent. If Antigravity takes over, it reads the same dispatch/handoff and Git diff, continues remaining work, and neither pulls/resets nor regenerates completed files. Model availability in Antigravity must be read from its actual UI, not assumed.

Return the local URL, changes, test evidence, remaining product risks, changed files and confirmation of no publication. Stop for this chat's independent review and real usability testing.
