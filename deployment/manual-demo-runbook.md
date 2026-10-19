# Trail public manual demo — configuration review

Status: **project created/configured after user approval; not deployed**. Project created October 19, 2026 at 13:06:03.221 UTC; configuration/deployment inventory verified at 13:09:49.851 UTC.

| Setting | Exact proposed value / verified state |
| --- | --- |
| Provider / CLI | Vercel / pinned CLI `64.5.0` |
| Signed-in account | `panchalmitkumarraju-2839` (verified by `vercel whoami`) |
| Account/team scope | `panchalmitkumarraju-2839` |
| Team ID / plan | `team_bawzsffpjX8zKvLJMwFOWXBg` / Hobby (verified) |
| Project | **`trail-demo`**, ID `prj_2AFvYa6vfTmljs28ZZ5zOO1q5c9r`, created in the approved account |
| Hostname | **`trail-demo-seven.vercel.app`**, assigned by Vercel and returned as verified by the project domains API. No custom domain. Not serving an app yet. |
| Release environment | Production public manual settings approved; **publication still awaits hostname approval**. Vercel SSO is preview-only, not production. |
| Source | `66940bfe028dadfe320c02e5003d01c1a501cf89` runtime files + the two configuration files below |
| Node / preset | `24.x` in Vercel project settings / Next.js |
| Root / install / build | Staged root `./` / `npm ci` / `npm run build` |
| Build output / server | Next.js defaults (`.next`); retain Node `/api/plan` refusal route, not static export |
| Runtime and build env | `ENABLE_AI_PLANNING=false`; platform sets production `NODE_ENV` |
| Gemini configuration | **No `GEMINI_API_KEY`, `GEMINI_MODEL`, public variants, or shared credential injection** in any project environment |
| Git / integrations | CLI from reviewed source only; automatic git deployments disabled; no repository push, integrations, analytics, database or paid add-ons |

The user approved creation/configuration under this exact Hobby account, but explicitly required the hostname before publishing. The project is configured with Node 24.x, Next.js, `npm ci`, `npm run build`, root/output defaults, no Git connection, and preview-only SSO so a later production manual release can be public. The environment inventory contains **only `ENABLE_AI_PLANNING=false` for production/preview**, no Gemini variables. Approved settings are recorded in `deployment/trail-demo-project-settings.json` and `deployment/trail-demo-environment.json`. API inventory confirms **zero deployments**. Do not deploy until the user approves publication to **`trail-demo-seven.vercel.app`**.

CLI dry-run now passes on the linked pristine staging directory: **42 files / 497,216 bytes**, all matching the source/config SHA-256 manifest, no missing or unexpected upload files. `.vercel` and the review manifest are excluded. Evidence is ignored `test-results/manual-demo-vercel-dry.json`. **No source has been uploaded.** CLI 64.5.0 `link --yes` unexpectedly downloaded a fresh Vercel OIDC `.env.local` and created `.gitignore` in the staging directory; neither was displayed or uploaded, and both generated files were deleted immediately before dry-run. No Gemini credential was fetched/copied. Do not assume future `vercel link` runs are environment-file-free: check/remove its generated staging env files without displaying them, retain `.vercelignore`, and recheck hashes/upload paths before release. The user's root environment files were untouched.

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

1. **Creation/configuration approval received and applied. Do not recreate the project.** Continue with existing ID `prj_2AFvYa6vfTmljs28ZZ5zOO1q5c9r` under `--scope panchalmitkumarraju-2839 --project trail-demo`. No paid upgrades. The pristine staging directory, not the dirty repository, is linked. Re-inspect Node 24.x and environment names without printing values before publication. If any Gemini/shared/public credential appears, stop; do not pull environment files. See the automatic CLI-link env-file warning above.
2. **Hostname shown for approval: `trail-demo-seven.vercel.app`. Publication is not authorized yet.** Domain verification, settings, environment inventory and upload dry-run are complete; anonymous app behavior cannot be checked until a deployment exists. Recheck every upload path against the manifest before release and recreate a clean candidate if runtime/config hashes change. Do not change any unrelated project.
3. **Only after publish approval**, from that staged directory use pinned CLI with `--scope panchalmitkumarraju-2839 --project trail-demo --prod --env ENABLE_AI_PLANNING=false --build-env ENABLE_AI_PLANNING=false --meta sourceCommit=66940bfe028dadfe320c02e5003d01c1a501cf89 --meta demoMode=public-manual`. No token argument, `--temporary`, `--prebuilt`, `--turbo`, git push or copied credentials. Capture deployment ID/actual immutable URL/assigned alias and UTC time, inspect ready status and source metadata. No success claim from upload output alone.
4. Run the real public smoke, not mocks or localhost, using a bare approved HTTPS origin:

   ```sh
   PW_PUBLIC_DEMO=1 PW_DEMO_URL=https://trail-demo-seven.vercel.app npm exec playwright test -- --config playwright.manual-demo.config.ts --output=test-results/manual-public-smoke
   ```

   The config refuses remote URLs unless explicitly opted in, rejects embedded credentials/paths/queries, and refuses live Gemini mode. These are new fictional browser contexts, not anyone's personal profile. Availability/refusal assertions are unmocked. Inspect the desktop/mobile screenshots and actual client/error responses. If protections produce a login page, or AI is available, stop rather than weakening the assertions.
5. Record **actual** deployment ID, source commit, configuration hashes, environment inventory (names only), mode, immutable URL, stable alias, UTC timestamp, checks/results and remaining physical-device/accessibility limitations in HANDOFF. Public evidence is **pending**, not inferred from local production passes. Stop for the user's demo rehearsal; recording/submission are later.

## Disable / rollback without data loss

- On any exposed AI behavior, stop verification and disable access to the affected deployment in the confirmed Vercel project; do not add credentials or remove guards. Review the built source/env inventory before re-enabling.
- On broken core flow, use Vercel's rollback/promote-existing-verified-deployment action for this project and re-run the public smoke on the stable alias. On the **first** release there is no known-good prior deployment: disable/unpublish that deployment until a verified fix exists. Do not claim rollback was tested before a deployment exists.
- Never delete/reset users' browser storage, create migrations, or replace their records as deployment rollback. Same-host browser records remain local; a different hostname, scheme, port, profile or device has separate records. Users transfer only via explicit private export/restore. Backups contain personal notes and are not encrypted.
