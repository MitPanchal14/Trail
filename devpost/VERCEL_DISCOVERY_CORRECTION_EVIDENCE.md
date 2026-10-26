# Vercel65.1.0 discovery correction — independent review next

**Current result:** Codex independently reproduced and verified this correction after the owner requested continuation. All63 Node tests and actual pinned CLI discovery/Node packaging/mocked-runtime checks passed again. No additional runtime change needed; ready for authorized publication, not yet hosted. [Independent review](INDEPENDENT_VERCEL_DISCOVERY_REVIEW.md); fresh report `/private/tmp/trail-codex-discovery-review/run-amEPjY/report.json`. Remaining text records OpenCode's implementation and its disclosed preliminary harness exception.

Baseline `97cfee115fa6586f06d37f4a20c7ce99105d81ac`, branch `codex/trail-redesign`. Tracked tree was clean; both untracked ZIPs preserved. [Bounded plan](VERCEL_DISCOVERY_CORRECTION_PLAN.md) recorded before correction. No branch switch, authentication, project linking, environment download, upload, deploy, commit or push. Temporary tooling only; no application dependency/config/model change or real credential/private configuration access.

## Confirmed cause, not a hypothesis

**The CLI file walker prunes the three directories before seeing their allowed files.** The original `.vercelignore` used `!/api/`, `!/scripts/`, `!/demo/` below `/*`. Vercel65.1.0's `staticFiles` passes **bare directory paths** (`api`, not `api/`) into `ig.createFilter()` **before stat or directory descent**. The trailing-slash exception doesn't rescue that bare path. The same issue excluded browser and shared-server inputs, not just API entries.

Measured with **actual, unmodified CLI65.1.0 bundled staticFiles and detectBuilders** in an isolated synthetic fixture:

| Case | Actual result |
| --- | --- |
| Original filter | Only `.vercelignore`, `package.json`, `vercel.json` survive; exact reported `unused_function` error reproduced, with entrypoint filtering enabled **and disabled**. |
| Same inputs without file pruning | Both API entries discovered, function configuration matched. |
| Correct only three parent exceptions to `!/api`, `!/scripts`, `!/demo` | All17 intended files survive; both Node functions plus static builder discovered; no discovery errors;9 synthetic private/extra paths excluded. Child deny rules and exact file exceptions unchanged. |

**The factory-property export is not the cause.** The matching `@vercel/build-utils@15.0.0` isNodeEntrypoint recognizes `default` exports (it does not require statically resolving the factory). Both current `export default {fetch:createVercelApi()};` entries pass. Explicit method controls also pass; helper-only exports fail, establishing that the detector actually ran. No handler rewrite is justified: both unchanged entries also package and run under the matching Vercel Node builder/runtime.

The earlier Git-ignore and Node import simulations were insufficient, and their apparent success did not prove CLI traversal. This correction supersedes those earlier upload/discovery conclusions, not the underlying adapter's security tests.

## Minimal correction / files

- `.vercelignore`: **three trailing slashes removed**, no widened child allowlist.
- `tests/vercel.test.mjs`: ordinary regression checks require bare parent exceptions and retain exact17-file assertions.
- `tests/vercel-discovery.mjs`: opt-in pinned-platform reproduction. Not part of the application or ordinary dependency-free npm test; requires tooling explicitly supplied outside the repository. Uses actual CLI utilities, matching Node builder and runtime; creates only temporary synthetic fixtures.
- Plan/evidence, `devpost/VERCEL_ADAPTER_EVIDENCE.md`, `HANDOFF.md`, `devpost/checklist.md`: current correction/review boundary.

Both API entry files, `scripts/vercel-ai.mjs`, `scripts/ai.mjs`, `scripts/serve.mjs`, `scripts/build.mjs`, `vercel.json`, `package.json` and **all nine browser assets** remain byte-identical to HEAD. Raw-body handling, cancellation, trusted origin, sanitized errors, model/prompts/provider limits and function configuration remain unchanged.

## Actual discovery and packaging proof

Tool versions: CLI **65.1.0**, build-utils **15.0.0**, Node builder **27.0.0** (exact CLI dependency pins); local Node **24.16.0**. CLI `--version` confirms65.1.0. Installed under approved temporary `trail-vercel-discovery/tooling` using `npm install --ignore-scripts --no-audit --no-fund vercel@65.1.0`, sanitized environment and isolated HOME. No CLI deploy/build/login/link command was invoked; exported local utilities avoid requiring project linking. The builder's ordinary dependency step runs only against the dependency-free synthetic upload fixture; no repository install/lockfile/dependency change.

The fixed filtered inputs are passed to **@vercel/node.build**, not to a hand-written dependency tracer. Actual Lambda outputs materialized to isolated function directories:

| Endpoint | Runtime / handler | Exact files in builder Lambda |
| --- | --- | --- |
| GET `/api/ai-status` | nodejs24.x / `api/ai-status.mjs` | `api/ai-status.mjs`, `scripts/vercel-ai.mjs`, `scripts/ai.mjs`, `demo/planner.js`, `package.json` |
| POST `/api/plan` | nodejs24.x / `api/plan.mjs` | `api/plan.mjs`, `scripts/vercel-ai.mjs`, `scripts/ai.mjs`, `demo/planner.js`, `package.json` |

No private/test/ZIP/local-server/build files in either Lambda. Neither is served as static source. Detector routes map both endpoints and supply an API404 fallback. Existing application build on the filtered upload produces exactly the9 browser assets, byte-identical to source with a synthetic credential sentinel absent. The static builder is discovered with `dist`/`npm run build`; the full CLI Build Output API assembly/cloud build was **not** run. These are actual local builder Lambda results, not a claim of hosted production artifacts.

Both materialized packages run through **@vercel/node.startDevServer**, not only Node imports: status200 `{enabled:true}`, plan200 validated synthetic proposal. Its internal proxy copies `x-forwarded-host` to Host, so this direct-runtime fixture supplies the header a normal CLI proxy would supply; this does not alter the application's explicit Host/Origin checks or establish deployed header guarantees. The successful run verifies the provider mock/outbound guard loaded in each child **before** any POST and requires exactly one mocked provider receipt.

### Verification-harness exception — do not claim zero task-wide outbound attempts

An initial direct-runtime attempt returned403 until the fixture supplied the CLI proxy header. A subsequent failed attempt returned502: the mock had been passed through meta.env NODE_OPTIONS, but the runtime fork overwrote that field from its parent environment. That attempt **may have sent one outbound Gemini request using only synthetic key/model values**; no real credential was accessed and no successful live generation occurred. There is no network receipt proving whether it reached Gemini, so this task must not claim zero outbound attempts. This was unintended and not authorized. No further unguarded retry was made. The corrected verifier sets the parent test bootstrap and confirms a per-child mock-ready receipt before POST; successful runs record the mocked provider receipt and no live provider calls. Earlier temporary packaging harness stream-extraction errors also occurred; using the builder files' async streams through Node pipeline resolved them. These were harness issues, not application or discovery causes.

## Reproduce without credentials or linking

Set `TOOLING` and `EVIDENCE` to approved external temporary directories (not the project), then:

```sh
env -i PATH="$PATH" HOME="$EVIDENCE/home" npm install --prefix "$TOOLING" --ignore-scripts --no-audit --no-fund vercel@65.1.0
env -i PATH="$PATH" HOME="$EVIDENCE/home" node tests/vercel-discovery.mjs "$TOOLING" "$EVIDENCE"
```

The verifier pins/checks versions, clears inherited environment before platform imports, uses an isolated HOME, copies only17 explicit public build inputs, creates only synthetic excluded files, reintroduces the bad filter as a negative control, checks detector controls and packages both functions. No source/credential from `.env*`, ZIPs, `.vercel/` or other private files is read. Leave the output for independent inspection; do not turn this into a deployment command or add tooling to package.json.

Evidence base:
`/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-vercel-discovery/`

- `baseline-result.json`: original CLI filtering/exact error and unfiltered detector comparison.
- `filter-control-result.json`: three-line filter control with unchanged handlers.
- `focused-verification.log` and `evidence/run-ziJaF5/report.json`: final actual CLI utility, detector control (including bad filter with entrypoint filtering on/off), Node Lambda manifests, runtime mock receipts, static parity. Failed preliminary run directories are not acceptance receipts.
- `syntax.log`, `discovery-syntax.log`, `test.log`, `build.log`, `diff.log`: syntax, opt-in verifier syntax, **63 Node tests passed**, app build and diff check passed. Nine demo/dist bytes and all protected files listed above compared to HEAD.

No browser regression rerun is claimed for this three-line upload correction; browser assets and retained UI/server code are unchanged. Prior browser results remain historical evidence. No unresolved application/test failure. Final cloud build/routing/cancellation, stable-origin setup, public WAF/cost controls and user/physical-device acceptance remain separate and unperformed. Stop for independent review; no commit/push/deployment.

## Official source/documentation consulted

The exact source executed is the official npm65.1.0 distribution, whose package.json pins the versions above. CLI tarball integrity from the public npm registry: `sha512-DOi/GBlLIEqaVYK3cZJJV66GvETjMxk3tN3Yp+jdfFBM+AQiDEjLKR1N/keE5yTCQMSZ/+u8+jcJTu3E0exucw==`.

- [Official .vercelignore docs](https://vercel.com/docs/deployments/vercel-ignore): deny-all example uses bare `!api`.
- [Current official file walker source](https://github.com/vercel/vercel/blob/main/internals/cli-builder-integration/src/get-files.ts): filter bare relative path before stat/descent. Matching code executed from65.1.0 `dist/chunks/chunk-QWE7OFE7.js` exported require_get_files().staticFiles.
- [Current official Node entrypoint source](https://github.com/vercel/vercel/blob/main/packages/build-utils/src/node-entrypoint.ts): recognized handler export names include `default`; lexer parses names, not the factory result. Matching installed build-utils15 source/execution checked.
- [Current official Node serverless runtime](https://github.com/vercel/vercel/blob/main/packages/node/src/serverless-functions/serverless-handler.mts): loaded default listener's callable fetch selects Web handlers. Matching27.0.0 runtime tested locally.
- Matching CLI `chunk-CVDK3IYT.js` require_dist2().detectBuilders checks unused function patterns and uses isNodeEntrypoint when VERCEL_NODE_FILTER_ENTRYPOINTS=1; matching `chunk-L6TM45P4.js` client getVercelIgnore combines default exclusions and user rules. Official installed Node builder's downloadInstallAndBundle/compile/build trace and produce Lambda file maps.

GitHub main links are current explanatory references, not asserted version pins; the reproduction executes the pinned published packages. No inference that merely importing an entry in Node proves Vercel discovery.
