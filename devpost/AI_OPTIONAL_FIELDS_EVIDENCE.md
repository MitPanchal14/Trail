# Description-only planning investigation

User reported an earlier description/optional-fields error on the stable URL after redeployment, followed by the provider-limit message shown in their screenshot. The exact historical request status/body is unavailable; **its cause is not confirmed**. No assumption that the user used a preview URL or entered invalid optional data.

## Findings

- Exact supplied description with both optional inputs empty is accepted by current browser validation and the Vercel/shared API. Wire payload contains `deadlineText:''` and `availableMinutes:null`. The blank fields are genuinely optional; text mentioning tomorrow/90 minutes need not be duplicated into them.
- A real classification defect was reproduced: the shared API's exact Host/Origin403 inherited the default `invalid_input` category, so the UI misleadingly asked users to check their description and optional fields. A deliberately different configured origin reproduces that wording with zero provider calls. This is a confirmed defect, not proof of the historical user's cause.
- Fixed only this classification: exact Host/Origin rejection keeps403 but uses fixed `origin_mismatch` copy: “AI planning could not verify this website address. Reload the published site or create manually. Your text is kept.” No URL/header/key/provider output is reflected in that message. All origin checks remain intact.
- Genuine malformed input retains400/invalid_input. Provider429 retains provider_limit. A provider-limit category alone does not establish daily versus minute quota exhaustion. No live provider call was made to diagnose quota.
- Read-only public status after the user's setup returns200, `{enabled:true}`. This confirms capability configuration, not provider quota or successful live planning.

## Changes and fresh checks

Pre-edit scope: [AI_OPTIONAL_FIELDS_PLAN.md](AI_OPTIONAL_FIELDS_PLAN.md). `scripts/ai.mjs` changes only the403 error category; `demo/planner.js` adds its fixed message. `tests/vercel.test.mjs` adds the exact-description regression: blank optional fields, deadline-only, budget-only, distinct origin403/malformed-input400/provider429, with mock provider counts.

- `npm run check`, `npm run build`, `git diff --check`: passed.
- `npm test`: **64 passed**, no failures/skips/cancellations.
- Exact public browser UI tested in isolated Chromium1440px/390px contexts, with **every planning POST intercepted** into the local adapter and synthetic provider. Success, provider429 and origin403: **all six cases passed before and after correction**. After correction, only `planner.js` is locally substituted for the public asset to test the new message. Source description/blank inputs retained, and no goal saved or session started. The test never sends a planning POST to production or Gemini. Existing real browser profiles/records untouched.
- Retained `runPlanner` browser regression passed against a temporary local server with key/model explicitly empty: manual fallback, pending/cancel/late result handling, proposal editing/transfer/restore, reviewed Save, aborted-write exact Retry/IDs, estimates/reload and no auto-Start.
- Inspected the390px corrected-origin-error capture: source, optional controls and readable safe message remain visible; no layout change. Full browser21-gate/physical-device acceptance not rerun or claimed for this copy/category fix.

Temporary receipts:
- `/private/tmp/trail-optional-fields-review/report.json`: original six-case reproduction.
- `/private/tmp/trail-optional-fields-corrected/report.json`: corrected six-case reproduction and screenshots.
- `/private/tmp/trail-optional-planner-regression/`: retained planner regression captures.
- Temporary reproduction harnesses `/private/tmp/trail-optional-fields-check.mjs` and `/private/tmp/trail-optional-fields-corrected.mjs` use isolated browser contexts, synthetic credentials and mocked provider responses. No private configuration read.

Storage/timing/activity/state/schema, task-save/Start flows, model/prompts/provider limits, server configuration/origin value and credentials unchanged. No branch switch, commit, push, deployment or live Gemini call. Hosted application does not include this local correction until authorized publication. If the earlier field message recurs after deployment, inspect that failed request's status and sanitized category; do not claim the optional fields caused it or that this investigation proved a historical origin mismatch.
