# AI demo deployment proposal — not enabled or deployed

## Current verified boundary

`GET /api/plan?availability=1` reports configuration only, never Gemini health. `POST /api/plan` requires same-origin localhost JSON; production generation is unconditionally disabled even if `PUBLIC_AI_PROTECTION_ENABLED=true`. Configuration alone cannot enable a deployed demo. Keys/model values are server-only. No provider requests were made in this phase.

Adapter review: separate system contract/user data; 2–5 concrete actions preferred (runtime permits 1–20), immediate instruction/output, observable finish condition, one focused clarification if subject/outcome is essential and missing; 1–120 editable session minutes, not completion estimates. Daily output can only select unique supplied IDs within supplied numeric capacity (empty/subset allowed). Both responses remain drafts. Runtime schemas prove shape, not usefulness, factual correctness or language quality.

## Proposed protected configuration (approval required)

1. Choose an invitation-only Vercel demo, not anonymous public generation. Protect the entire preview/production deployment, including API routes, using verified platform authentication. Confirm the chosen account plan supports this protection. Do not expose a protection-bypass token in the app, URLs, screenshots or client bundle. Keep the public manual app separate if needed; do not imply local-only records sync across deployments.
2. Retain `ENABLE_AI_PLANNING=false` until gates below pass. Server-only env: `GEMINI_API_KEY` (separate restricted demo-project key), `GEMINI_MODEL` (exact model verified against that project, not assumed from sample), `ENABLE_AI_PLANNING`, `PUBLIC_AI_PROTECTION_ENABLED=false`. No `NEXT_PUBLIC_` credentials. Restrict key to the required API, least privileges, separate billing/quota, rotate after event.
3. Proposed future controls: exact `APP_ORIGIN=https://<approved-host>` allowlist and trusted server-verified access identity; reject direct/cross-origin/unprotected API calls. Preserve JSON/body/schema/time/output bounds. Never substitute CORS/Origin checks for authentication. Replace the localhost-only check and unconditional production block only in a separately reviewed change after real protection tests. A boolean env flag is not proof of protection.
4. Proposed limits: 10 calls per verified identity/day, 100 calls globally/day, 2 concurrent provider calls globally, one client request per editor, no automatic retries, existing 25s timeout/4096 output-token cap. Enforce counters atomically in a durable shared store across server instances, fail closed if unavailable. Provisioning a store/new service requires separate user approval; process-memory counters are not sufficient on serverless. Count attempted calls, including cancellations/errors; cancellation does not guarantee free provider work.
5. Proposed event cost ceiling: $2/day and $10 total, subject to user approval and verified pricing/token ceilings for the selected model. Translate these into conservative request/token admission limits and enforce them server-side before calls. Set provider quota to the minimum demo allowance and independently verify any hard spending controls. Cloud budget alerts alone are NOT a hard cap. Stop if the cap cannot be enforced; do not enable AI based on an alert setting.

## Enablement gates and rollback

- Verify platform access denies anonymous/direct API traffic; approved users work without a client-side shared secret. Test same-origin allowlist and preview-host handling, identity/global limits, concurrent server instances and limiter outage. Verify API keys never appear in status, bundles or logs. Log only safe request IDs/status/latency/counts, not task text, responses or keys.
- With separate explicit permission for bounded fictional live Gemini calls, verify model access, schema compatibility, clear/vague task usefulness, daily budget/subset behavior, quota/error copy, cancellation, editable draft and explicit acceptance/commit. Current mocked evidence does not prove any of these against Gemini.
- Run production build/deployed-browser manual and protected AI journeys before enabling the flag. Keep manual editing/recovery available throughout. Status must describe protected configuration, not promise provider uptime.
- Rollback: set `ENABLE_AI_PLANNING=false`, redeploy, verify GET unavailable and POST refuses without upstream call; revoke demo key if necessary. Keep records in each user's browser; no destructive storage changes.

## Exact next step

User reviews this proposal and chooses protected invitation-only versus manual-only deployment, approves hosting/limiter scope and hard cost limits. Then implement/test protection in a separate phase. No deployment or live calls are authorized by this document.
