# Deployment readiness — focused next phase

Read AGENTS.md, BUILD_PROMPT.md, HANDOFF.md newest entries, README.md, and relevant installed Next.js deployment docs. Record intended changes first. Preserve approved UI, private browser storage, backup/restore, unrelated changes and all provider safeguards. Backup checkpoint 66940bf has independent fresh lint/typecheck/build, 64 unit and 273 browser passes.

## Shared work, independent of hosting mode

Prepare a concise deployment runbook and demo rehearsal checklist. Confirm hosting account/project and intended URL with the user before publishing or changing remote settings. Do not add paid services or push all current changes. Inspect the exact intended commit, ignored secrets/private files and unrelated branding/evidence diffs. Check the actual production build using a fresh local production process and isolated fictional browsers, not only next dev. Verify direct loading of /, /mountains and /progress, create/review/commit/focus/save/reload/explicit Resume/complete/Undo/summit, export/restore and storage errors. No real user records or automatic live provider requests.

Check server-only secrets stay absent from public bundles/error responses. Keep private data local, no default fake activity or implied cross-origin sync. Explain that localhost and the deployed hostname have separate records; transfer only through explicit private backup/restore. No storage clear/migration for deployment. Retain manual editing when AI is unavailable.

## Hosting mode — user selected public manual demo on October 19

Proceed with manual public deployment readiness. Keep local AI behavior intact. Invitation-only production AI is deferred. Exact host/account/project still needs to be identified before publishing.

## Mode requirements

Public manual demo: retain unconditional production AI block and current local-only provider boundary. Omit production Gemini credentials; disable AI configuration. Verify real production availability and POST refusal with no upstream call. Do not label mocked AI as live. AI demo may be shown separately on authorized local development.

Invitation-only AI demo: first review devpost/ai-demo-deployment-proposal-2026-10-18.md with the user. Do not flip flags or remove the production block. Need confirmed hosting protection, verified server-side identity, durable atomic usage/concurrency limits, approved service/cost scope and bounded live-call permission before enablement. A boolean flag, Origin/CORS or an exposed shared client secret does not provide access control.

## Publish and verify

Once user has chosen/authorized exact host/project and reviewed the concrete configuration, deploy only the intended reviewed source. Never print credentials, install integrations, purchase hosting or create limiter infrastructure incidentally. After a successful deploy record actual URL/commit/mode/time, then smoke-test the actual public deployment with isolated fictional records on desktop/mobile. Verify anonymous API behavior for chosen mode, persistence/reload, navigation and backup. Distinguish local production evidence from deployed evidence. Provide disable/rollback instructions without destructive data operations.

Stop after deployment verification for the user's final demo rehearsal. Recording/submission and further visual polish are later; do not mark final user acceptance complete from automated passes.
