# Independent Vercel discovery correction review

Codex continuation on 26 October 2026, explicitly requested after OpenCode reached its usage limit. **No blocking defect found in the local correction. Ready for an authorized commit/push and a new Vercel cloud build.** A successful hosted deployment is still unverified.

## Confirmed cause and retained fix

Local HEAD and refreshed remote `codex/trail-redesign` are `97cfee115fa6586f06d37f4a20c7ce99105d81ac`. Refreshed remote `main` is `e7098cf1c19c289fc0a602d010067d8ee5fd977e`. No branch was switched or remote modified. OpenCode's uncommitted correction and two unrelated ZIPs were preserved.

The original `.vercelignore` excludes the bare `api`, `scripts` and `demo` directory names before the CLI descends into them. Its trailing-slash parent exceptions do not rescue those names. Correcting only `!/api/`, `!/scripts/`, `!/demo/` to `!/api`, `!/scripts`, `!/demo` restores exactly the intended 17 inputs. Child deny rules and exact file exceptions remain. Both current factory-property default exports are accepted; no entrypoint rename/rewrite or function-configuration removal is required.

The first independent adapter review tested Git-ignore behavior and executable import closure but did not exercise Vercel's walker. That missed this discovery defect. This review replaces those earlier upload/discovery conclusions with actual pinned-tool results.

## Fresh independent checks

- `npm run check`, `node --check tests/vercel-discovery.mjs`, `npm run build`, `git diff --check`: passed.
- `npm test`: **63 passed**, zero failed, skipped or cancelled. Local listener permission was granted for the mocked tests.
- `tests/vercel-discovery.mjs` executed with the already-installed official CLI **65.1.0**, build-utils **15.0.0**, Node builder **27.0.0**, local Node **24.16.0**. No repository dependency installation or tooling version change.
- Original-filter negative control reproduced exactly the reported `[unused_function]` error, including with entrypoint filtering disabled. Only `.vercelignore`, `package.json`, `vercel.json` survived that control.
- Corrected filter retained exactly **17 inputs** and excluded all **nine synthetic private/extra paths**. Actual CLI detector discovered both configured Node entries without errors. Factory exports and explicit method controls passed; helper-only controls failed.
- Actual Node builder produced both `nodejs24.x` Lambda packages. Each contains its own API entry, `scripts/vercel-ai.mjs`, `scripts/ai.mjs`, `demo/planner.js`, and `package.json`: exactly five files, with no private/test/ZIP assets.
- Both packages ran through Vercel's local Node runtime: status **200** with capability-only response; planning **200** with validated synthetic proposal. Harness verifies per-child mock-ready receipt **before** POST and records exactly one mocked provider call. No live Gemini request in this Codex continuation; no real key/configuration file read.
- Filtered-input application build produced exactly the **nine byte-identical browser assets**, synthetic credential sentinel absent. `git diff --exit-code HEAD -- demo api scripts/vercel-ai.mjs scripts/ai.mjs scripts/serve.mjs scripts/build.mjs vercel.json package.json` passed. Existing UI, schema/storage/timing/activity, API security, prompts/model/limits and deployment configuration are unchanged.

Fresh pinned-tool report:
`/private/tmp/trail-codex-discovery-review/run-amEPjY/report.json`

Reproduction used sanitized environment and external temporary fixtures:

```sh
env -i PATH="$PATH" HOME=/private/tmp/trail-codex-discovery-home node tests/vercel-discovery.mjs /private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-vercel-discovery/tooling /private/tmp/trail-codex-discovery-review
```

## Limits and next action

No additional runtime correction was necessary. Codex updated only the continuation plan/review/evidence/handoff/checklist after verifying OpenCode's candidate. No browser regression rerun: all browser assets are unchanged and prior browser evidence remains separate.

OpenCode's evidence discloses a preliminary harness attempt that may have contacted Gemini with synthetic-only values before mock injection was corrected. That historical exception remains disclosed; it is not erased by this continuation's successful mock-only run.

No Git publication, authentication, project linking, upload, cloud build, deployment, secret change, real-record write or migration occurred. The exact screenshot failure is reproduced and locally corrected; final Vercel discovery/artifacts/routing/headers/cancellation must still be checked after authorized publication. Keep Gemini environment variables absent for that initial deployment. Then establish the actual stable domain, apply/confirm public API controls, configure server-only Production variables and redeploy. A live planning verification requires fresh explicit budget. Physical-device/user acceptance and submission remain separate.
