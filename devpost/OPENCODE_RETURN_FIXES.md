# Next task — three return-flow corrections

Use GPT-6.1 Sol Medium. Work in the existing checkout on `codex/trail-redesign`. Reviewed/pushed starting checkpoint: `3081396258691175bd6a6d1da3030e16788c08c8`. Preserve subsequent user edits and this documentation update. One implementation owner: OpenCode OR Antigravity. Read AGENTS.md/required documents once, then RETURN_EDGE_REVIEW_2026-10-25.md. Record exact affected files before editing.

Planning receipt: this dispatch, the reconciled checklist and the latest HANDOFF header are documentation-only changes. No fixes or travelling marker are implemented by preparing them.

## Outcome and scope

Fix only the three reproduced return-flow issues. Preserve the written composition, accepted mountain silhouette/depth, current rewards, canonical IDs, timing/storage/ownership and explicit Resume. This pass does not implement the proposed travelling marker, campsite, streaks or sound. Visual delight remains unaccepted; keep that distinction in the evidence.

### 1. Protect context-only actions from removal

Reproduction: create two actions; save next move/context/work URL on the first without starting a timer; edit goal → Remove first → Save. Currently its context is deleted despite the hint saying saved work is protected.

- Extend existing removal protection to actions with saved context records, including link-only context, in both the editor and `save-goal` transition. Prefer the simple conservative rule that any existing context record protects its action, matching current recorded-work protection. Preserve existing session/event/completed-action guards.
- Direct commands must reject such removal without mutating input. Explain the disabled Remove state accessibly; users should understand why the action is protected. Do not add archive/delete/reset workflows or schema changes. Untouched actions remain removable when other existing constraints allow it.

### 2. Keep long return text from burying controls

Reproduction: save an allowed 4,000-character next move plus 4,000-character context; Today places Open work/Start focus roughly 8,000px below the page top at 390px.

- Keep ordinary short-note presentation recognizable. For long next moves/context, use a bounded readable preview and an accessible explicit expansion to reveal the full text. Keep work link and Start/Resume above expanded supporting context. No permanent text truncation, changed storage limits or extra canonical write.
- Store/edit/Undo/history must retain the exact canonical text. Preserve existing normalization semantics, line breaks and literal escaping. Native details/summary is fine; full text must be reachable by keyboard and on mobile. Context expansion must not start timing or change data.
- In a normal-title fixture with both fields at 4,000 characters, the collapsed action area must keep the link and focus control within about one viewport-height of that area's top at 390×844, rather than below thousands of pixels. Check actual element positions and screenshots. Use the full accessible text when expanded; no nested scrolling trap.
- Preserve Focus and history behaviour unless narrowly shared presentation code needs adapting. Do not redesign the page, move the mountain or rewrite ordinary copy throughout the site.

### 3. Clear discarded form validation without hiding storage failures

Reproduction: enter an invalid work URL, Save, then Skip for now. Today retains a Not saved banner asking for correction of invisible fields.

- Explicit Skip/discard clears validation feedback belonging to that discarded pause draft and restores the normal Today status. Canonical saved place stays unchanged; reopening the form shows committed values.
- Do not broadly clear `error` on every render/navigation. Failed writes, pending exact Retry, timing-stop and storage/corrupt-data/ownership messages must retain their existing protective behaviour. Keep failed-save drafts intact. Respect current busy/pending navigation guards.
- Keep create/edit validation and pause validation appropriately scoped. Navigation that preserves an invalid draft must not falsely claim it has been saved.

## Acceptance checks

1. Domain regression: context-only, link-only, and existing recorded-action removal rejects with unchanged input; untouched action removal still works. Actual browser shows protected Remove and saved context survives edit/reload. Cover failed goal save/exact Retry without context loss.
2. Browser: 4,000+4,000 notes (including line breaks and HTML-looking/unbroken text), both themes at desktop/390px. Collapsed preview has reachable controls; expand/collapse is keyboard-operable; complete text/edit/reload/Undo retains the canonical value. Normal short-note composition and mountain remain coherent; no horizontal overflow.
3. Browser: invalid-link Save → Skip clears only that validation; invalid draft round trip still preserves values until explicit discard. Aborted notes write retains draft/pending operation and meaningful error; exact Retry commits once and cannot be hidden by form-error cleanup. Link removal intent survives the existing failure/retry path.
4. Run `npm run check`, `npm test`, `npm run build`, `git diff --check`; focused regressions during work, then existing full Chromium suite once after final changes. Adjust presentation selectors only as needed; preserve domain assertions, reward no-replay/motion cancellation, explicit Resume and real/example isolation.

## Finish and handoff

Target roughly 30–45 minutes including focused verification; report actual status if longer rather than weakening checks. Update HANDOFF.md, checklist and RETURN_FIXES_EVIDENCE.md with exact results and remaining limits. Update README/spec only if semantics need clarification. No new dependencies/backend, no broad refactor, no reset of existing work, no commit/push/deploy/submission.

Stop for independent review. Return local preview URL, changed files, checks, screenshots and any remaining failures. The next candidate is ONE bounded travelling-marker prototype for visual acceptance, followed by feature freeze and delivery. Do not begin it automatically in this pass.
