# Optional planning fields investigation and bounded error correction

User reported the deployed planner rejected a valid description with both optional fields empty, before displaying a provider-limit message. User confirms use of the stable production URL after redeployment. Investigate without live Gemini requests or real records.

Before edits, reproduced the exact supplied description in isolated desktop1440/mobile390 Chromium sessions loading the public UI with every planning request intercepted into the local Vercel adapter with synthetic provider responses. Blank deadline is `''` and blank minutes is `null`; success and provider429 work. A deliberately mismatched configured origin reproduces the misleading field-validation message with zero provider calls. This confirms an error-classification defect, not the cause of the user's earlier request: no failing-request status/body receipt exists for that occurrence.

Bounded cross-file plan:
- `scripts/ai.mjs`: classify existing exact Host/Origin403 as `origin_mismatch`, retaining all checks/statuses and provider/request limits.
- `demo/planner.js`: fixed safe explanation for that category; preserve typed drafts and existing validation/save/start behavior. No optional field becomes required; no model/prompt/config/key changes.
- `tests/vercel.test.mjs`: regression for exact description with both optional fields empty through success/provider429, and origin mismatch distinct from malformed input. No live provider access.
- Evidence, HANDOFF and checklist: fresh results, limits and next delivery step. Preserve unrelated ZIPs, branch, records and private files. No commit/push/deploy in this investigation.

Re-run63 existing Node tests plus focused new coverage, syntax/build/diff, desktop/mobile intercepted browser cases with corrected local assets. Inspect screenshots. Do not claim a historical cause or that provider429 proves a daily quota was exhausted. Hosted version remains unchanged until authorized publication.
