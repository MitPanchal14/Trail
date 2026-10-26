# Vercel adapter — local evidence and review handoff

## Current correction — Vercel65.1.0 discovery

[Discovery correction evidence](VERCEL_DISCOVERY_CORRECTION_EVIDENCE.md) supersedes the historical Git-ignore simulation/discovery gap below. Actual CLI65.1.0 walker reproduced the exact unused_function error: trailing-slash parent exceptions pruned api/scripts/demo. Three bare parent exceptions fix it; current factory default exports are recognized, so entries/shared adapter/config remain unchanged. Both functions now discovered and packaged by pinned Node27.0.0 builder (five required files each), then run with confirmed provider mocks through Vercel's local runtime; all9 static bytes preserved. Syntax/63 Node tests/build/diff passed. This is local utility/builder verification, not a linked/cloud build or deployment. Independent review next. **Harness caveat:** one preliminary failed runtime attempt may have issued an outbound request with synthetic-only credentials before mock injection was corrected; no real credentials accessed/no successful live generation. Do not extend the older zero-call claim to this correction. See the full receipt/guard fix in correction evidence.

Prepared locally on `codex/trail-redesign`, baseline `48f1dfbe4d6bdd2a59556c231f6486b4caea3b40`. Before edits: clean tracked tree plus the two unrelated untracked ZIPs; both preserved. Origin remote configuration inspected (`MitPanchal14/Trail`, HTTPS fetch/push). No branch switch/reset/commit/push/fetch/deployment/project linking/authentication/upload/secret download. Private files not opened or changed. Pre-edit [implementation plan](VERCEL_ADAPTER_IMPLEMENTATION_PLAN.md).

**Zero live Gemini requests. Not a Vercel deployment or independent acceptance.** Local manual preview: http://127.0.0.1:52258/ (a different origin has separate local records). Exact existing stable production domain must be taken from the owner's Vercel dashboard; no hosted URL is asserted here.

## Changes / preserved boundaries

- `api/plan.mjs`, `api/ai-status.mjs`: two minimal Node Web `fetch` function entries; no transcription or catch-all entry.
- `scripts/vercel-ai.mjs`: explicit canonical HTTPS trusted-origin validation, Web Request raw stream → Node Readable bridge, small response bridge and cancellation/stream cleanup. Imports unchanged `scripts/ai.mjs`; no duplicated prompt/provider/validation/limiter logic. Consumed or locked bodies reject; no parsed-object fallback, JSON reserialization or double read. Original32KiB byte limit still runs in the existing API, including whitespace/chunked/multibyte/misleading-length requests. Response/error/category/30s timeout contracts remain.
- `vercel.json`: Other framework, `npm run build`, skipped install, static `dist` only;40s maximum function duration, cancellation enabled, explicit three-module includeFiles and private/unnecessary excludeFiles. No rewrites, root fallback, public env injection or framework/dependencies.
- `.vercelignore`: deny-all CLI upload allowlist for17 exact required files. `.gitignore`: additionally ignores `.vercel/`; existing `.env*` ignore retained. This does not sanitize committed Git history.
- `package.json`: Node24.x hosted runtime selection and three extra syntax checks; no dependency added. Local `npm run dev` implementation unchanged.
- `tests/vercel.test.mjs`: eight focused mocked tests; builds an isolated synthetic package/build fixture, never local configuration.
- `README.md`, `devpost/DEPLOYMENT_PREFLIGHT.md`: existing-project setup, env/domain/preview/runtime/duration/packaging and current WAF/public cost limits, explicit supersession of obsolete seven-file/static-Pages preflight.
- `HANDOFF.md`, `devpost/checklist.md`, this evidence and plan: current result/review boundary.

All nine `demo/` browser assets, state/schema/task flow, storage/timing/activity, scripts/ai.mjs/serve.mjs/build.mjs and tests for retained behavior remain byte-for-byte unchanged from HEAD. No recorder/transcription UI, model, prompt, provider limit or live budget change. Existing local transcription still passes its retained tests. Browser-local records and fictional isolation/explicit Save vs Start remain unchanged.

## Measured verification

Evidence base:
`/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-vercel-adapter/`

| Check actually run | Result / receipt |
| --- | --- |
| `node --test tests/vercel.test.mjs` |8 passed: configured-origin success/exact provider envelope and capability-only status; missing/invalid key/model/origin; Host/Origin/method/type rejection; wire-byte/body-use protections; sanitized failures/strict proposal/timeout/disconnect; stalled-body cancellation and unchanged per-warm concurrency/count; transcription/unknown404; isolated package/build/privacy. Included in final npm test too. |
| `npm run check` | Passed, `check.log`. Includes the new entries/adapter syntax. |
| `npm test` |63 passed, zero failed/skipped, `test.log`. Includes retained local transcription/provider/security/domain/storage-build tests and8 new mocked adapter tests. |
| `npm run build` | Passed, `build.log`; exactly9 unchanged browser assets, no env injection. Additional isolated build with synthetic env sentinel passes byte equality and sentinel/origin absence. |
| Local `npm run dev -- --port 52258` | Running; exact9 source/dist/served bytes compared to HEAD, capability GET and6 private/server/test/ZIP404 checks passed. No planning POST to the configured local API. `local-boundary.json`. |
| Function package inputs | Static import closure verified against explicit includeFiles; isolated six-file package contains two entries, three shared modules and package.json. Both default entry exports imported/executed with a fake provider in a child process; configured plan/status work without repository/node_modules fallback. This is a dependency-closure/package simulation, **not a Vercel-produced deployment artifact**. |
| Upload filter | Actual gitignore-pattern semantics checked with read-only `git -c core.excludesFile=.vercelignore check-ignore --no-index --stdin`:17 required files allowed;18 private/local/extra paths denied. No candidate contents read; no persistent Git config change. `upload-filter.json`. |
| Config schema | Configured fields validated using current official schema constraints and preinstalled Ajv; `schema-validation.json`, `vercel-schema.json`. Full published schema meta-validation failed: it declares draft-04 but has modern numeric exclusiveMinimum in unrelated experimental triggers. No dependency installed or config weakened; this is **field validation**, not full Vercel CLI validation. |
| Missing-origin/manual browser | Actual adapter unconfigured503 response replayed through Playwright interception: typed description/manual fields retained; manual Save makes exactly one goal/no session/Start; zero provider calls. `manual-unconfigured.png` (synthetic390px screenshot). |
| Full existing Chromium regression | **Passed, exit0**, fresh complete run against local CLI52258; `browser.log`, `browser/`. Includes capture/visual, A/B/C/edge, mocked planner/Save/estimates, correction/return/travelling/mountain/rewards, end-block/copy/compact/removal/activity/year/priority/clarity/examples/handoff/Focus. No test assertion/runtime/browser file changed for this hosting task. This is local regression, not hosted Vercel proof. |
| `git diff --check` | Passed; final audit repeats before stop. |

No Vercel CLI, @vercel/node or @vercel/nft is installed. None was installed, authenticated or linked. Local schema/closure/import tests do not establish Vercel file discovery, artifact layout, live forwarded-header semantics, cancellation/timeout envelopes or correct public routing. Inspect those in the actual authorized build and final-origin gate. Tests only use synthetic credentials/mocked provider responses; no actual key/model values are printed/copied to artifacts.

## Security / availability decisions

The hosted adapter cannot fall back to `127.0.0.1`: `TRAIL_PUBLIC_ORIGIN` must be one exact canonical HTTPS DNS origin with no trailing slash/path/query/credentials/port/wildcard/localhost. Missing/invalid origin reports `{enabled:false}` and planning503/unconfigured. With a valid origin, the unchanged API requires exact Host and POST Origin; GET status may omit Origin, as a normal same-origin browser GET does. URL/forwarded headers never establish trust. Unconfigured key/model also leaves manual work usable.

Preview AI is not automatically trusted; Production-only env settings are recommended. A deliberately approved Preview needs its own explicit exact-origin config and approved credentials/model, not an inferred VERCEL_URL or wildcard. Records remain browser-and-origin local; no existing records migrate/reset/upload.

Origin checks are not authentication. Direct clients can spoof Host/Origin. Existing memory limits are independent per warm function instance, not a global serverless rate/cost cap. The Web interface supplies no trusted socket IP; calls conservatively share the existing fallback bucket in a warm instance. Forwarded IP spoofing cannot bypass it, but other instances have independent buckets. Nothing increases existing2 concurrent/5 per10min limits.

Outstanding owner gate: configure Vercel WAF Fixed Window on **POST + exact `/api/plan`**, IP key, **5 requests /600s**, Default429; verify actual plan entitlement/rule slots/pricing, then Save Rule → Review Changes → Publish only after authorization. Current docs allow one Hobby rate-limit rule within three custom rules; Pro/Enterprise have larger quotas. WAF counts are per-region, not a global dollar cap. Distributed IP/region abuse, legitimate shared-IP limits and permitted traffic still require Gemini quota/billing and Vercel usage/spend review. No auth/durable aggregate budget added, services bought or firewall/billing settings applied. Keep Gemini unconfigured until the owner accepts/configures adequate public controls.

## Exact dashboard handoff and remaining work

Follow [README Vercel steps](../README.md#vercel-hosting-preparation): existing project → Settings → Build and Deployment: root`.`, Other, `npm run build`, output`dist`, install skip, Node24.x; Settings → Domains: identify actual stable domain; Settings → Environment Variables (Production): private `GEMINI_API_KEY`, unchanged `GEMINI_MODEL`, exact `TRAIL_PUBLIC_ORIGIN=https://the-existing-project-domain.vercel.app` with actual existing domain substituted. Functions:40s and cancellation in vercel.json. Firewall setup above is outstanding. No dashboard setting was changed here.

Stop for Codex independent review. Publication needs separate authorization. Final Vercel artifact inspection must verify only9 static files plus2 function artifacts with shared dependencies/no private files, `/api/transcribe`404, private/server/test/ZIP404, secure signed-out final-domain access, exact origin enforcement, missing-config manual fallback and core record/fictional/explicit Start behavior. Physical devices/Safari and hosted cancellation remain unverified. A new Gemini live verification call requires fresh explicit budget; this task grants none.

## Official sources consulted

- [Node runtime / native ESM and Web entries](https://vercel.com/docs/functions/runtimes/node-js)
- [Functions API / default fetch export and opt-in cancellation](https://vercel.com/docs/functions/functions-api-reference)
- [Advanced Node / helper parsing and NODEJS_HELPERS alternative](https://vercel.com/docs/functions/runtimes/node-js/advanced-node-configuration) — no Next.js bodyParser assumption; selected raw Web interface instead.
- [vercel.json / dist output, includeFiles/excludeFiles/duration](https://vercel.com/docs/project-configuration/vercel-json)
- [Supported Node versions / engines override](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Function duration](https://vercel.com/docs/functions/configuring-functions/duration)
- [.vercelignore deny-all allowlist](https://vercel.com/docs/deployments/vercel-ignore)
- [WAF rate limiting / setup, plan limits, regional counters](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)

These are current first-party documentation checks, not evidence that this existing Vercel account/project was accessed or deployed.

## Stop audit

All authorized local implementation and verification complete; independent review is next. No unresolved local test failure. The only validation-tool attempts that failed were official full-schema meta-validation (missing bundled draft-04 registration, then published mixed-draft experimental constraints); configured-field validation subsequently passed with unchanged official field constraints. Hosted Vercel artifact/routing/cancellation, actual stable-domain setting, WAF activation/abuse-cost policy and final public-origin verification remain explicitly unperformed owner/platform gates. No live-call budget consumed or extended.
