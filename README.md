# Work Trail

Slice 3 review build: reviewed task breakdowns, persistent creation drafts, optional browser voice, a server Gemini planning adapter and explicit daily commitments around the existing Save/Resume loop. Original Dusk bento/pixel terrain retained. No accounts, sync or deployment; public production AI is disabled.

Use Node 24 LTS. Run `npm ci`, then `npm run dev` and open http://localhost:3000. Choose New task, describe the work, then Write manually (works without credentials) or Build with AI. Review/edit the mountain name, finish condition and every ordered action/instruction/session duration; check the review box and Accept breakdown. Plan today selects/orders a draft; Commit today’s plan creates commitments. Remove/Defer keeps their records without awarding completion. Start, type an optional return note, and Save my place. Close and reopen the same URL: Resume is explicit. Complete earns a checkpoint; Undo reverses credit without deleting sessions.

## Optional local AI and voice

Copy `.env.example` to ignored `.env.local`, set your own `GEMINI_API_KEY` and a project-accessible `GEMINI_MODEL`, and opt in with `ENABLE_AI_PLANNING=true`; restart the development server. Never use `NEXT_PUBLIC_` for secrets. Requests go server-to-server to Gemini, sending only submitted text/context or supplied daily candidates/availability. No automatic retries; responses time out at 25 seconds and require review. Restrict local exposure and set provider spending/quota limits before enabling. Public production AI is locked off in code regardless of the protection flag: a flag alone is not abuse protection. The adapter has mocked contract coverage; live Gemini has not been tested because credentials are absent.

Microphone use is explicitly opt-in. Native browser speech recognition may transmit audio to the browser/platform provider; this is not guaranteed on-device transcription. Stop recording, correct the editable transcript, then submit text separately. Unsupported/denied recognition falls back to typing. Real microphone/provider behavior and physical Safari remain unverified.

Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e` (requires `npx playwright install chromium` and a server at localhost:3000, or `PW_BASE_URL`). Actual evidence and next action live in `HANDOFF.md`.

## Local records and recovery

Records are versioned/validated JSON in localStorage (`work-trail:snapshot:v1`), not server data. Use the same browser/profile/origin; changing ports, clearing storage or changing devices does not preserve access. Download private recovery JSON before clearing storage. Downloads contain personal notes. Import/replacement review belongs to a later slice.

While a tab is open, timestamps catch up delayed countdown ticks. Running sessions persist roughly once per second and on transitions. Reopening recovers the last durable heartbeat as interrupted; closed-tab absence is never added. Browser throttling/crashes can leave an older heartbeat, so exact last-second recovery is not guaranteed. Clock discontinuities pause conservatively. Recorded session time is not proof of attention.

Web Locks allow only one editing tab. A storage-lease fallback checks ownership before writes and interrupts conservatively after expired/contested ownership; background throttling can therefore require Resume in fallback browsers. Secondary tabs are read-only and retry ownership automatically. If neither storage coordination nor Web Locks is available, editing stays blocked rather than risking competing timers.

Storage read, validation, quota and revision-conflict failures show a persistent warning. Corrupt raw data is never automatically overwritten. Work may continue in memory where ownership is available; download recovery before leaving. Recovery export offers the original raw payload when corrupt. Only explicit AI/voice actions invoke their respective services. Sample previews are separate, opt-in, in-memory examples; returning to work never copies sample records into storage.
