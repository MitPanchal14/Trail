# Work Trail

Slice 2 review build: manual task creation, browser-local work records, focus countdown, optional saved context, explicit Resume, completion checkpoints and Undo. Original Dusk bento/pixel terrain retained. No AI, accounts, sync, voice or deployment.

Use Node 24 LTS. Run `npm ci`, then `npm run dev` and open http://localhost:3000. Add a mountain name, finish condition, first action and session duration. Start, type an optional return note, and Save my place. Close and reopen the page: Resume is explicit. Complete the action to earn a checkpoint; Undo reverses mistaken credit without deleting session history.

Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e` (requires `npx playwright install chromium` and a server at localhost:3000, or `PW_BASE_URL`). Actual evidence and next action live in `HANDOFF.md`.

## Local records and recovery

Records are versioned/validated JSON in localStorage (`work-trail:snapshot:v1`), not server data. Use the same browser/profile/origin; changing ports, clearing storage or changing devices does not preserve access. Download private recovery JSON before clearing storage. Downloads contain personal notes. Import/replacement review belongs to a later slice.

While a tab is open, timestamps catch up delayed countdown ticks. Running sessions persist roughly once per second and on transitions. Reopening recovers the last durable heartbeat as interrupted; closed-tab absence is never added. Browser throttling/crashes can leave an older heartbeat, so exact last-second recovery is not guaranteed. Clock discontinuities pause conservatively. Recorded session time is not proof of attention.

Web Locks allow only one editing tab. A storage-lease fallback checks ownership before writes and interrupts conservatively after expired/contested ownership; background throttling can therefore require Resume in fallback browsers. Secondary tabs are read-only and retry ownership automatically. If neither storage coordination nor Web Locks is available, editing stays blocked rather than risking competing timers.

Storage read, validation, quota and revision-conflict failures show a persistent warning. Corrupt raw data is never automatically overwritten. Work may continue in memory where ownership is available; download recovery before leaving. Recovery export offers the original raw payload when corrupt. No live service is called. Sample previews are separate, opt-in, in-memory examples; returning to work never copies sample records into storage.
