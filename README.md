# Work Trail

Slice 3 review build: reviewed task breakdowns, persistent creation drafts, optional browser voice, a server Gemini planning adapter and explicit daily commitments around the existing Save/Resume loop. Original Dusk bento/pixel terrain retained. No accounts, sync or deployment; public production AI is disabled.

Use Node 24 LTS. Run `npm ci`, then `npm run dev` and open http://localhost:3000. Choose New task, describe the work, then Write manually (works without credentials) or Build with AI. Review/edit the mountain name, finish condition and every ordered action/instruction/session duration; check the review box and Accept breakdown. Plan today selects/orders a draft; Commit today’s plan creates commitments. Remove/Defer keeps their records without awarding completion. Start, type an optional return note, and Save my place. Close and reopen the same URL: Resume is explicit. Complete earns a checkpoint; Undo reverses credit without deleting sessions.

## Optional local AI and voice

If `.env.local` does not exist, copy `.env.example` to it. Open **that file directly in your editor**, enter your own key, and configure:

```dotenv
GEMINI_API_KEY=enter_your_key_directly_in_this_file
GEMINI_MODEL=gemini-3.5-flash-lite
ENABLE_AI_PLANNING=true
```

Never paste a key into chat, screenshots or a commit, and never prefix it with `NEXT_PUBLIC_`. `gemini-3.5-flash-lite` is documented as supporting structured output; documentation does not establish your project's access or quota. Check [your active AI Studio limits](https://aistudio.google.com/rate-limit) and spending controls before enabling. ChatGPT Plus/OpenCode access does not supply Gemini API credits; no free-usage promise is made. Restart your development server after configuring; for AI use bind locally with `npm run dev -- --hostname 127.0.0.1 --port 3000`.

Requests go server-to-server to Gemini, sending only submitted text/context or supplied daily candidates/availability. No automatic retries; each request has a 25-second timeout and a 4096-output-token cap. Blocked/incomplete output is never used as a draft; access, model, quota and request-configuration errors have separate sanitized messages. All valid drafts still require review. Public production AI is locked off in code regardless of the protection flag: a flag alone is not abuse protection. **The authorized three-request live smoke passed with gemini-3.5-flash-lite; qualitative usefulness and real microphone checks remain pending.** See HANDOFF.md for the response-artifact limitation.

Microphone use is explicitly opt-in. Native browser speech recognition may transmit audio to the browser/platform provider; this is not guaranteed on-device transcription. Unsupported/denied recognition falls back to typing. For a real user check: explicitly start recording, speak one short description, stop, correct the transcript, then leave the flow and confirm the browser microphone indicator stops. Submit text separately only when ready. Automated browser doubles do not verify actual transcription; that and physical Safari remain unverified. Typing is a complete alternative.

## Verification

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build`. Install Chromium once with `npx playwright install chromium`.

- **Local browser tests:** `npm run test:e2e` starts its own dev server at `http://127.0.0.1:3100`, waits at most 120 seconds, and shuts down only that managed process. Its `.next-e2e` compiler output is separate from your development server. An occupied port fails instead of silently reusing a stale/unrelated app. AI is forcibly disabled on this managed server even if your `.env.local` enables it.
- **External dev server:** `PW_BASE_URL=http://localhost:3000 npm run test:e2e` explicitly uses the server you started, checks its Work Trail title, and never starts/stops it. Restart it yourself if its source/config is stale. Successful AI in ordinary tests is mocked; unavailable-AI browser behavior is also mocked for external servers to avoid accidental API spending. The managed default exercises the real missing-config endpoint.
- **Production build:** run `npm run build`, start the new build with `npm run start -- --hostname 127.0.0.1 --port 3001`, then in another terminal run `PW_BASE_URL=http://127.0.0.1:3001 npm run test:e2e`. Production AI stays disabled. An old running production process is not refreshed by rebuilding; restart the intended process deliberately. Do not use a production server for the live-AI check.
- Tests use fresh isolated browser contexts, not your normal browser/profile or saved records. Screenshots go to ignored `test-results/`, no longer overwriting reviewed `devpost/evidence/` images. Next may regenerate `next-env.d.ts` and TypeScript include paths for the active build; inspect generated changes before staging.

### Authorized live smoke (not part of routine tests)

After local configuration and explicit approval of **up to three generation requests**, run:

```sh
PW_LIVE_GEMINI=1 PW_BASE_URL=http://localhost:3000 npm run test:e2e -- --project=desktop
```

This selects only `e2e/live-gemini.spec.ts`: a fictional clear goal, a budgeted day using real accepted candidate IDs, and a vague goal needing clarification. No response mocking, retries, saved user-data imports, microphone permission grants or automatic acceptance. The browser test explicitly reviews/edits/accepts, commits a manageable subset, saves/reopens/resumes, completes and undoes one checkpoint. It aborts requests beyond three in that run; do not use repeat/retry options. HTTP/provider failure stops the test. Actual fictional responses are attached under `test-results/` for qualitative review: concrete first actions/outputs, short plans, no invented facts/deadlines or unnecessary clarification. Automated schema checks alone do not prove usefulness. Confirm project model access/limits separately; a successful call does not reveal remaining quota.

Actual outcomes, limitations and the next user check live in `HANDOFF.md`.

## Local records and recovery

Records are versioned/validated JSON in localStorage (`work-trail:snapshot:v1`), not server data. Use the same browser/profile/origin; changing ports, clearing storage or changing devices does not preserve access. Download private recovery JSON before clearing storage. Downloads contain personal task descriptions and notes; keep them private. `localhost:3000` and `127.0.0.1:3000` have separate records.

### Private local backup and restore

1. On Today, use **Download private recovery** beside the private-browser controls. This existing JSON export is the restore format; no account, upload or cloud storage is involved.
2. Choose **Restore private backup**, then a Trail version 1 JSON file (maximum **2 MiB**). Size, schema, relationships and dates are validated locally before replacement. Review goals, actions, sessions, active completions, creation-draft presence and calendar timezone. Selecting a file, previewing it or cancelling does not replace your trail.
3. **Restoring replaces this browser’s entire Trail history; it does not merge.** Use **Download current private data** first if you want to keep it. **Cancel** (or Escape) leaves records unchanged. Only **Replace and restore** authorizes replacement; a failed write never publishes a restored trail.
4. Save your place before restoring during running/paused focus. Close other editing tabs. Changes to the trail/ownership or stored raw data require a fresh preview or reload; inaccessible storage cannot be replaced. Pending planner replies are cancelled, not applied over a restore.
5. Saved IDs, terrain/checkpoint slots, return fields, drafts, commitments/dispositions, completion/Undo and summit history, first use and timezone are retained. Imported running sessions stop at the recorded heartbeat: **Resume** remains explicit, with no closed-tab time or new achievement. After success, reload and inspect Today, Mountains and Progress.

If validation or saving fails, keep the dialog open to download current private data and the original stored data where available. Corrupt raw records stay untouched until a valid, explicitly confirmed replacement is saved; do not clear storage as a recovery step. Storage must be readable and this tab must own editing. To try the flow safely, use fictional work in a separate browser profile rather than replacing real records. Backup files are not encrypted; keep them in a trusted private location.

While a tab is open, timestamps catch up delayed countdown ticks. Running sessions persist roughly once per second and on transitions. Reopening recovers the last durable heartbeat as interrupted; closed-tab absence is never added. Browser throttling/crashes can leave an older heartbeat, so exact last-second recovery is not guaranteed. Clock discontinuities pause conservatively. Recorded session time is not proof of attention.

Web Locks allow only one editing tab. A storage-lease fallback checks ownership before writes and interrupts conservatively after expired/contested ownership; background throttling can therefore require Resume in fallback browsers. Secondary tabs are read-only and retry ownership automatically. If neither storage coordination nor Web Locks is available, editing stays blocked rather than risking competing timers.

Storage read, validation, quota and revision-conflict failures show a persistent warning. Corrupt raw data is never automatically overwritten. Work may continue in memory where ownership is available; download recovery before leaving. Recovery export offers the original raw payload when corrupt. Only explicit AI/voice actions invoke their respective services. Sample previews are separate, opt-in, in-memory examples; returning to work never copies sample records into storage.
