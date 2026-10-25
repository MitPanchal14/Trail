# Saved-place / work-reference evidence — 25 October 2026

## Outcome and boundary

Implemented only OPENCODE_RETURN_EXPERIENCE.md on `codex/trail-redesign`, starting and remaining at HEAD `6d9a930`. Exact cross-file plan was recorded in RETURN_IMPLEMENTATION_PLAN.md before edits. Started 11:31 IST; final full integration captures completed around 11:49 IST. Existing planning changes were preserved. No commit, push, deploy, submission, dependency installation or user-profile data manipulation.

Review URL: **http://127.0.0.1:3000/** (HTTP 200 verified after the final suite). Stop for independent review and observed interruption/return usage; this receipt is implementation evidence, not user acceptance.

## Implemented contract

- Optional next-move prompt with illustrative placeholder only; optional context/link remain collapsed. Explicit Save/Skip retained. Pause still freezes and commits trustworthy time before capture.
- Only new canonical field: optional `context.resourceUrl`, schema v1 unchanged. Old missing-field records validate without mutation. Shared normalizer accepts explicit absolute HTTP(S), preserves query/fragment, rejects credentials/controls/backslashes/relative/other schemes and enforces 2,048-character input/output bounds. Malformed stored/Undo metadata rejects without repair/reset.
- Absent/blank URL preserves; valid nonblank replaces after commit; Remove saved link plus Save sends null and deletes the optional key. Skip preserves everything. Notes retain existing independent blank-preservation semantics.
- Pause draft retains exact text, URL, disclosure and removal intent across navigation/modes. Save/Skip clear the action-scoped memory draft. Invalid/aborted saves retain it; exact Retry publishes once. Unsaved drafts are not reload-durable.
- Form-only Cmd/Ctrl+Enter uses normal submit, ignores IME composition and leaves ordinary Enter intact.
- Today shows saved next move versus labelled unfinished-action fallback, where-stopped context and real note-save time. Focus saved context/history expose the reference before potentially long notes. Native escaped `target="_blank" rel="noopener noreferrer"` Open work anchors never fetch automatically or issue a timing/domain command.
- Full-goal “Your goal trail” and checked/total counts are separate from recorded effort; retained home/Focus composition and illustrative route remain unchanged.

## Fresh verification

| Check | Result |
| --- | --- |
| `npm run check` | Passed runtime/server/build syntax checks. |
| `npm test` | 20 passed, 0 failed, including four new domain tests. |
| `npm run build` | Passed; Node tests verify exact seven-asset parity. |
| `git diff --check` | Passed before and after final documentation. |
| Focused `TRAIL_GATE=return node tests/browser.mjs` | Passed after final runtime edits. |
| Final full `node tests/browser.mjs` | Passed once after final runtime edits: A/B/C/edge, correction regressions and return gate. |

Final full command used:

```sh
TRAIL_EVIDENCE=/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-return-evidence/full node tests/browser.mjs
```

Domain additions cover old-v1 compatibility/read immutability, URL normalization/query/hash/bounds/unsafe input, preserve/replace/clear, exact replay, rejected-command input immutability, malformed stored/Undo URL, completion/Undo/history/correction and action isolation.

Return browser gate uses isolated profiles and a temporary local HTTP reference fixture. It verifies actual pause/save/reload with exact notes/link/time, zero fixture requests before Open work, exact new-tab URL/null opener/empty referrer, unchanged canonical paused timing, separate explicit Resume, literal HTML-looking text, normal Enter/IME/form-only shortcuts, blank/Skip/clear, mode/navigation draft retention, transaction-aborted replacement/removal and exact one-commit Retry, stopped Undo/context restoration, history/reopen and no next-action inheritance. An intentionally unsafe raw record follows the preserved-data error path with no executable link/reset. No page errors in the return context.

The full suite also retains the actual 61-second running-navigation/two-tab check, ownership/stale receipt guards, aborted create/checkpoint/completion/finish, reload/Resume, example isolation, completion/review/history, corrected goal drafts/home states, reduced motion and controlled expiry/lifecycle coverage. Controlled fixtures are not physical-sleep/native-BFCache evidence.

During focused test development two harness expectations were corrected: Journey has no pause entry, so navigation returns via Today; canonical notes trim outer whitespace, so post-Retry checks expect trimmed context while failed draft checks retain raw text. No product contract was relaxed.

## Visual evidence

Fresh screenshots are under the full-command output directory above, with `return-{today,focus,pause-removal-draft,pause-long,today-long,history}-{light,dark}-{1440,390}.png`. Focused captures are in its parent directory. Representative desktop Today, phone Focus/pause/history and long-context views were inspected, including final full-run phone pause/history. Tests assert no document horizontal overflow at each capture. Keyboard focus reaches the Focus reference; labels and collapsed extras remain visible/usable.

Long context can make Today/history very tall; no new truncation/layout redesign was introduced. Focus retains its existing scrollable saved-context area with the reference before long text. This is not a complete screen-reader/WCAG audit.

## Changed files and remaining review

Runtime: `demo/state.js`, `demo/work.js`, `demo/styles.css`. Tests: `tests/state.test.mjs`, `tests/browser.mjs`. Documentation: `README.md`, `devpost/spec.md`, `devpost/prd.md`, `devpost/scope.md`, `HANDOFF.md`, `devpost/checklist.md`, `devpost/DAY_BUILD_EVIDENCE.md`, new RETURN_IMPLEMENTATION_PLAN.md and this file. Existing untracked OPENCODE_RETURN_EXPERIENCE.md / RETURN_EXPERIENCE_PLAN_2026-10-25.md and earlier HANDOFF/checklist planning were retained.

Physical Mac sleep/wake, prolonged background use, branded Chrome/Comet, phone hardware, native BFCache eligibility and actual user value remain unverified. Data stays browser/origin-local, may be cleared and does not sync; URL destinations may require sign-in or later become unavailable. HTTP(S) validation is not a trust/safety endorsement of the destination; opening is an explicit user decision. No automatic external capture, AI, reminders, PiP, streaks, priority, backend or real route mapping. No built-artifact browser rerun in this pass (build/byte parity passed). Publication remains unauthorized for this pass.
