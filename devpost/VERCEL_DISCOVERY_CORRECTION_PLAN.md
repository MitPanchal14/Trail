# Bounded Vercel discovery correction

Baseline: `codex/trail-redesign`, HEAD `97cfee115fa6586f06d37f4a20c7ce99105d81ac`; tracked tree clean, two unrelated ZIPs preserved. Reported CLI65.1.0 `unused_function` is not yet locally explained. Prior adapter evidence proves Node execution, not platform discovery or packaging.

## Investigation before correction

1. Obtain matching official Vercel65.1.0 CLI and bundled build utilities in an approved temporary directory only. Use a sanitized environment and synthetic fixture containing only explicit tracked build inputs; no private configuration, user credentials, linking, uploads, deployment or live Gemini calls. Inspect actual filter, detector and builder source and first-party documentation.
2. Reproduce unchanged upload filtering and detector behavior independently. Test the existing factory-property default export against an explicit `fetch(request)` method. Confirm causes with measured results, not assumptions.
3. Only after confirmation, patch the two entry exports to explicit delegating methods if needed. Change `.vercelignore` only if actual filtering requires it. Retain `vercel.json` function configuration and all security/adapter behavior.

## Allowed cross-file work

- `api/plan.mjs`, `api/ai-status.mjs`: minimal statically recognizable delegation if supported by detector evidence.
- `.vercelignore`: minimal necessary filtering correction only after reproducing actual Vercel behavior.
- Focused regression in `tests/vercel.test.mjs` and/or a dependency-free fixture verifier under tests, invoking temporary pinned tooling explicitly rather than adding application dependencies.
- This plan, correction evidence, existing adapter evidence, `HANDOFF.md`, `devpost/checklist.md`: record confirmed cause, actual commands/tool versions, package manifests, limitations and review boundary.

## Confirmed investigation / selected correction

Actual CLI65.1.0 bundled `staticFiles` (not Git ignore simulation) returns only `.vercelignore`, package.json and vercel.json with the baseline filter, and matching detectBuilders reproduces the exact unused_function error. Its walker tests bare directory paths before stat/descent; `!/api/`, `!/scripts/`, `!/demo/` fail to rescue those bare paths. A temporary control removing only those three trailing slashes yields all17 intended inputs, no synthetic private files, both Node builders and static builder with configuration retained. Matching build-utils15.0.0 isNodeEntrypoint accepts both existing factory-property default exports, including with VERCEL_NODE_FILTER_ENTRYPOINTS=1. Thus correct only three directory exceptions; do not rewrite handlers on an unconfirmed detector theory. Actual node27.0.0 packaging still to verify before completion.

## Verification / stop

Use actual matching detector/filter/builder to prove both functions discovered and packaged with shared dependencies; inspect generated static/function outputs and execute mocked packaged handlers if possible. Record negative baseline/control results too. Run syntax, full Node tests, build and diff checks; compare all nine browser assets and shared adapter/API/server/build bytes to baseline. Preserve trusted origin/raw bodies/cancellation/errors/secrets and unchanged model/config/limits. No auth/link/upload/deploy/commit/push. Stop for independent review; real hosted acceptance remains separate.

## Final phase check

Selected three-line correction is implemented; no handler rewrite. Actual CLI65.1.0 utilities reproduce the bad-filter error with entrypoint filtering on/off, then discover both unchanged exports using the corrected filter. Node27.0.0 build produces exact five-file Lambda packages for both; confirmed-mock Vercel local runtime tests pass. Nine static assets/protected source/config bytes unchanged; syntax/63 Node tests/build/diff pass. Final focused receipt: temporary trail-vercel-discovery/evidence/run-ziJaF5/report.json. No app dependencies, auth/link/upload/deploy or Git publication.

Deviation disclosed in correction evidence: a preliminary failed runtime harness did not inject its mock and may have attempted one outbound Gemini request with synthetic-only credentials; no real credential access/no successful live generation. Cannot certify zero task-wide outbound attempts. Corrected verifier requires per-child mock-ready receipt before POST and records exactly one mocked provider receipt. Stop for independent review; full linked/cloud build and final-origin/WAF/cost/cancellation verification remain open.

## Codex continuation / documentation plan

The owner explicitly asked Codex to continue after OpenCode reached its usage limit. Preserve the existing three-line correction and verify it independently with the installed pinned CLI utilities, Node builder/runtime and guarded synthetic-provider harness. No further application change is planned unless verification finds a defect. Record the fresh review in `INDEPENDENT_VERCEL_DISCOVERY_REVIEW.md`, prepend the current result to HANDOFF and correction evidence, and mark only the independent-review checklist item complete. Keep hosted acceptance open. No private configuration, live provider requests, dependency changes, branch switch, commit, push or deployment in this continuation.
