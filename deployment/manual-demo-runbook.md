# Trail public manual demo — configuration review

Status: **locally verified; not deployed**. Target discovery on October 19, 2026:

| Setting | Exact proposed value / verified state |
| --- | --- |
| Provider / CLI | Vercel / pinned CLI `64.5.0` |
| Signed-in account | `panchalmitkumarraju-2839` (verified by `vercel whoami`) |
| Account/team scope | `panchalmitkumarraju-2839` |
| Team ID / plan | `team_bawzsffpjX8zKvLJMwFOWXBg` / Hobby (verified) |
| Project | **new `trail-demo`**; project listing returned no existing projects |
| Hostname | Vercel-assigned `*.vercel.app`, per user request; **not allocated or verified yet**. Do not assume `trail-demo.vercel.app` is available. No custom domain. |
| Release environment | Production public manual demo, **proposed for approval**, no authentication wall for judges |
| Source | `66940bfe028dadfe320c02e5003d01c1a501cf89` runtime files + the two configuration files below |
| Node / preset | `24.x` in Vercel project settings / Next.js |
| Root / install / build | Staged root `./` / `npm ci` / `npm run build` |
| Build output / server | Next.js defaults (`.next`); retain Node `/api/plan` refusal route, not static export |
| Runtime and build env | `ENABLE_AI_PLANNING=false`; platform sets production `NODE_ENV` |
| Gemini configuration | **No `GEMINI_API_KEY`, `GEMINI_MODEL`, public variants, or shared credential injection** in any project environment |
| Git / integrations | CLI from reviewed source only; automatic git deployments disabled; no repository push, integrations, analytics, database or paid add-ons |

The account, new project and concrete settings still require user approval before remote changes. Creating/linking a project is not publication approval. Record the actual assigned hostname and show it before the first public deploy. The Vercel dry-run could not run while unlinked (`Project is not linked`); do not claim host-side configuration validation yet.

## Reviewed input and privacy boundary

`deployment/manual-demo.vercel.json` is copied to staged `vercel.json`. It uses current documented schema fields: Next.js, `npm ci`, `npm run build`, `git.deploymentEnabled=false`. No deprecated `env`/`build.env` secrets configuration. Project environment values above are configured only after approval; CLI supplies the false flag at build/runtime as a second guard. `deployment/manual-demo.vercelignore` excludes all environment files, generated artifacts, `.git`, `.vercel`, dependencies, private docs/evidence/skills and the local hash manifest.

Stage with `node scripts/prepare-manual-demo.mjs 66940bf`. The helper reads committed blobs only, never the working tree, and emits an ignored manifest with the directory, full source commit and SHA-256 of every input. There are **42 source/config files**, all matching their manifest; no environment files or unexpected files in the pristine upload candidate. The two overlay hashes are:

- `vercel.json`: `7e8b472d4c57b4381728e6f02e236dd1191310b6272645f98a6a60b1e73c6812`
- `.vercelignore`: `65815afa1132907a7dceaed421b696b72be4af3a0885db136c749e071ea9f0d8`

`test-results/manual-demo-candidate.json` identifies the built/tested candidate; `test-results/manual-demo-upload-candidate.json` identifies a second pristine candidate for upload. Never upload the dirty repository root. Unrelated `app/layout.tsx`, `components/SampleToday.tsx`, `e2e/check-server.ts`, generated files and evidence edits remain separate. Thus the candidate retains the committed `Work Trail — Today` metadata and sample branding, rather than silently including uncommitted branding work. The new production checker verifies that reviewed identity without changing the user's existing checker.

No `.env.local` was copied or read for deployment. Build and production start explicitly removed Gemini variables and disabled AI. Local AI source behavior is untouched. Secrets stay server-only; no provider markers were found in the 10 built client artifacts or served client scripts. Code/unit tests prove production generation rejects before `fetch`, even with a configured key; actual local production GET reports disabled, and same-origin POST returns `503 PUBLIC_AI_DISABLED`. A public-host same-origin POST must return `403 ORIGIN` under the retained localhost-only boundary. Do not relax either guard.

## Local production evidence (not public evidence)

- Node `v24.16.0`; fresh locked `npm ci` and production build from the staged source passed. Fresh loopback production process at `http://127.0.0.1:3001`, separate from development.
- Lint, typecheck, 64 unit tests passed. Existing full browser suite against this production build: **273 passed (38.9s)**, desktop/tablet/mobile, disabled/mocked AI only.
- Unmocked production/manual smoke: **8 passed (2.8s)**, desktop/mobile. Real routes/availability/refusal, empty first use, manual three-action review/commit, focus/save/close/return/explicit Resume, completion/Undo, summit confirmation, export/restore/reload, Mountains/Progress, quota recovery and served client-script scan passed. No live provider or microphone requests. Screenshots inspected under ignored `test-results/manual-production-first/`; regression evidence under `test-results/manual-production-regression/`.
- `node scripts/check-manual-bundles.mjs <built-candidate>` checked 10 client artifacts with zero provider/credential markers. This is a marker scan, not a general proof of absence of every possible secret; the committed-source allowlist/no-env build is the complementary safeguard.
- Audit: `npm audit --omit=dev --json` reported **0 runtime vulnerabilities**. Full audit reported **5 high development-tool findings** along `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces` (GHSA-vfj7-8cjw-p6xm). npm's proposed fix downgrades eslint-config-next to 14.2.35; **not applied** to this Next 16 candidate. Disclose for release review; no dependency upgrade/downgrade is included.

## Approval, release and real-URL verification

1. Obtain approval for the account/scope, new `trail-demo` project, Hobby plan, production/manual settings, source/config hashes and audit limitation. No paid upgrades. Only then create/link the project **in the pristine staged directory**, not this dirty repository. Use explicit `--scope panchalmitkumarraju-2839 --project trail-demo`; do not let the random staging-directory name choose a project. Set/inspect Node 24.x and environment names without printing their values. If any Gemini/shared/public credential exists, stop for explicit removal approval; do not pull environment files.
2. Inspect assigned project domains and show the exact assigned hostname before publication. Review anonymous accessibility, root/build/install settings, no add-ons and the env-name inventory. Do not change protection, domain or project settings on an unrelated project. Run CLI `deploy --dry --json` in the now-linked candidate and inspect every upload path against the manifest; allow only intended runtime/config inputs. Recreate a clean candidate if source hashes changed.
3. **Only after publish approval**, from that staged directory use pinned CLI with `--scope panchalmitkumarraju-2839 --project trail-demo --prod --env ENABLE_AI_PLANNING=false --build-env ENABLE_AI_PLANNING=false --meta sourceCommit=66940bfe028dadfe320c02e5003d01c1a501cf89 --meta demoMode=public-manual`. No token argument, `--temporary`, `--prebuilt`, `--turbo`, git push or copied credentials. Capture deployment ID/actual immutable URL/assigned alias and UTC time, inspect ready status and source metadata. No success claim from upload output alone.
4. Run the real public smoke, not mocks or localhost, using a bare approved HTTPS origin:

   ```sh
   PW_PUBLIC_DEMO=1 PW_DEMO_URL=https://ACTUAL-ASSIGNED-HOST npm exec playwright test -- --config playwright.manual-demo.config.ts --output=test-results/manual-public-smoke
   ```

   The config refuses remote URLs unless explicitly opted in, rejects embedded credentials/paths/queries, and refuses live Gemini mode. These are new fictional browser contexts, not anyone's personal profile. Availability/refusal assertions are unmocked. Inspect the desktop/mobile screenshots and actual client/error responses. If protections produce a login page, or AI is available, stop rather than weakening the assertions.
5. Record **actual** deployment ID, source commit, configuration hashes, environment inventory (names only), mode, immutable URL, stable alias, UTC timestamp, checks/results and remaining physical-device/accessibility limitations in HANDOFF. Public evidence is **pending**, not inferred from local production passes. Stop for the user's demo rehearsal; recording/submission are later.

## Disable / rollback without data loss

- On any exposed AI behavior, stop verification and disable access to the affected deployment in the confirmed Vercel project; do not add credentials or remove guards. Review the built source/env inventory before re-enabling.
- On broken core flow, use Vercel's rollback/promote-existing-verified-deployment action for this project and re-run the public smoke on the stable alias. On the **first** release there is no known-good prior deployment: disable/unpublish that deployment until a verified fix exists. Do not claim rollback was tested before a deployment exists.
- Never delete/reset users' browser storage, create migrations, or replace their records as deployment rollback. Same-host browser records remain local; a different hostname, scheme, port, profile or device has separate records. Users transfer only via explicit private export/restore. Backups contain personal notes and are not encrypted.
