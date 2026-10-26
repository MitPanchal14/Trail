<div align="center">

# Trail

### Keep your place. Find your next step.

A focus companion for work that gets interrupted.

**Plan a goal · Focus on one action · Leave a way back**

[Explore Trail](#explore-trail) · [Quick start](#quick-start) · [Try the full loop](#try-the-full-loop) · [AI setup](#optional-gemini-planning) · [Vercel setup](#vercel-hosting-preparation) · [Engineering](#under-the-surface)

</div>

![Trail in dark mode: a fictional workshop goal, current action, paused focus timer and saved-place disclosure](docs/images/trail-focus-dark.png)

*An actual screenshot of the labelled fictional example. Its work and timing are illustrative, separate from your records.*

## The problem Trail tackles

You return to a task called **“Prepare the presentation.”** But where were you? Which file was open? What decision did you need to make next?

A task title tells you what remains. Trail lets you leave the detail that helps you restart:

> “Open slide 3. Add the room-booking owner, then check whether the capacity is confirmed.”

For students, solo builders and people working on interrupted projects, Trail brings that next move, optional context and a work link back into view before the progress graphic. These are intended audiences, not claims of completed user studies.

**The mountain tells the story of deliberate completion. Your saved place tells you how to continue.**

## Explore Trail

| Space | What you can do |
| --- | --- |
| **Today** | Return to your unfinished action, read its saved next move and open your work reference. |
| **Focus** | Explicitly Start or Resume, pause, extend a block or complete the action. Switch themes and turn slow background motion off when you prefer. |
| **Goal journey** | Revisit ordered actions and the mountain route. Completed actions advance the illustration; selecting a step does not complete it. |
| **Finished work** | Read completed goals and their saved details, explore twelve months of activity, and see correction-aware streaks. |
| **Later goals** | Keep up to ten separate outcomes without replacing active work. Review/edit now; explicitly make one active after the current goal is finished. |
| **Plan with AI** | Optionally turn a rough description into an editable goal, finish condition and ordered actions with suggested estimates. Manual creation always remains available. |

### A quick path for judges

After starting the app, choose **Try a ready-made demo** on Home. No API key or account is needed.

1. **Return to saved work:** see the next move and context that make an interrupted task easier to pick up.
2. **Focus:** explicitly start the simulated block, pause and save a place. Switch themes or turn background motion off.
3. **Explore sample activity / Finished collection:** inspect the year view and open a finished goal's full details.
4. **Capture a step or a later goal:** read the labelled illustration of keeping the current action while remembering more work.

Choose **Real work** at the top to try the persistent workflow below. Fictional examples stay in memory, reset on reload and never seed real records or call Gemini. The capture example is read-only; use Real work to save steps and Later goals.

<details>
<summary><strong>Preview Finished work in light mode</strong></summary>

![Trail's light-mode finished collection, with fictional goals, priority labels, detail controls and small mountain outlines](docs/images/trail-finished-light.png)

These are fictional sample records. Their disabled reopening controls are intentional: Real work supports guarded reopening when no other goal is active.

</details>

## Quick start

**You need Git and Node.js 24.x, including npm.** Node.js 24.16.0 was used for local verification; the package now selects Vercel's supported24.x runtime. The local server code is unchanged. Use a current browser with IndexedDB and Web Locks; Chromium was used for automated browser checks.

```sh
git clone --branch codex/trail-redesign https://github.com/MitPanchal14/Trail.git
cd Trail
npm run dev
```

Open **[http://127.0.0.1:3000/](http://127.0.0.1:3000/)**.

**No `npm install`, API key or sign-in is needed for manual work and fictional examples.** The application has no third-party runtime package dependencies.

The clone command targets the reviewed development branch. Once merged into `main`, a normal clone of the default branch will contain the same application.

<details>
<summary><strong>Port already in use?</strong></summary>

Choose a free port and open the address printed by the server:

```sh
npm run dev -- --port 52257
```

Records belong to a particular browser **and site address**. Different ports have separate records. An empty app on a new port does not mean the previous port's work was deleted.

</details>

## Try the full loop

Use **Real work** for this walkthrough. It works without AI.

1. **Create a goal.** Choose Start working. Enter a title, what finished means and ordered actions. Save the goal.
2. **Start deliberately.** Start focus on the first unfinished action. Saving a goal never starts its timer.
3. **Leave a useful place.** Pause. Write the exact first thing to do when returning; optionally add context and a work link. Save and return to Today.
4. **Come back.** Reload the same address. Your committed next move is still there. Open your work reference and explicitly Resume when ready.
5. **Capture without replacing.** Add a step to the current goal, or save a separate goal for later. Running capture explicitly pauses first; it keeps the current action and block. Resume is your choice.
6. **Finish deliberately.** Complete actions. Checking every action opens review; explicitly confirm the goal finished to reach the summit and save it in Finished work.

**One active goal. One focus block. More work safely remembered for later.** Later-goal capture is currently manual; AI planning is available when creating a new active goal.

<details>
<summary><strong>What do the mountain, campsite and streaks mean?</strong></summary>

- A committed action completion advances the illustrative journey. Selecting or viewing an action earns nothing.
- A useful saved next move, context or link with timing stopped creates a campsite cue. It is a way back, not another completed task.
- All actions checked is a review state. Only explicitly confirming the goal finished earns the summit.
- Activity and streaks come from currently checked actions and their dates. Undo and reopening can reduce them.
- Suggested estimates, recorded effort and completed outcomes are different quantities. The mountain does not measure distance, attention or productivity.

</details>

## Optional Gemini planning

Prefer to start with a rough paragraph? **Plan with AI** suggests a goal, an observable finish condition and ordered actions with editable estimates, assumptions and conflicts.

**Describe → Draft my trail → Review/edit → Save this goal → Start separately**

Type, paste or use your device's dictation in the text field. Trail does not activate dictation or record/transcribe audio through its UI. Deadline text and available minutes guide a suggestion; they are not calendar scheduling or a feasibility guarantee.

<details>
<summary><strong>Enable Gemini locally — server-side configuration</strong></summary>

Manual work needs no configuration. To enable planning, use a Gemini API key and a model available to your API project. A coding-agent subscription is separate from app API access.

Create a **private `.env.local` in the repository root**, or edit your existing file without replacing its other settings:

```dotenv
GEMINI_API_KEY=replace_with_your_key
GEMINI_MODEL=replace_with_your_enabled_model
```

The values above are placeholders. Keep your actual key private; never paste it into browser code, a screenshot, a public issue or a commit. `.env*` is Git-ignored.

Restart the Node server after configuration changes. Its CLI loads `.env.local` when `process.loadEnvFile` is available (Node 20.12+); older Node 20 installations need the values supplied through the server environment instead.

Only the description and optional deadline/budget you explicitly submit are sent to Gemini through the server. Saved workspace, history, notes and work links are not included. Google processes submitted text under its API terms; Trail does not promise provider zero retention.

The animated mountain appears only while a request is pending, and stays static with reduced motion. Cancel keeps your description; safe errors preserve the manual route. There are no automatic retries. Review the proposal before saving: AI can be wrong.

The server key is never injected into the static build. Serving `dist/` alone supports manual work but **does not provide Gemini endpoints**. The included local server still binds to loopback. The separate Vercel adapter below supplies hosted planning; public abuse/cost controls and final-origin verification remain required.

</details>

## Vercel hosting preparation

**Prepared locally, not deployed.** Use the existing Vercel project; do not create a second app or publish the repository root. This section and [current preflight](devpost/DEPLOYMENT_PREFLIGHT.md) supersede the old seven-file/static-Pages instructions. Local implementation/check results and platform-validation limits: [adapter evidence](devpost/VERCEL_ADAPTER_EVIDENCE.md). Codex independent review is required before any publication.

### Existing-project dashboard settings (after review/authorization)

1. Open the **existing project → Settings → Build and Deployment**. Root Directory: repository root (`.`), Framework Preset: **Other**, Build Command: **`npm run build`**, Output Directory: **`dist`**, Install Command: empty/skip, Node.js Version: **24.x**. Committed `vercel.json` overrides the build/output/install settings; `package.json` pins Node24.x. There are no application dependencies to install. Do not set the output directory to `.` or `demo`, and do not start the local HTTP server on Vercel.
2. Under **Settings → Domains**, identify the existing stable production domain. Do not invent a URL, replace the project or change domains in this local task. Under **Settings → Environment Variables**, add the following for **Production** only, using the already-approved Gemini configuration privately:

   | Name | Server-only purpose |
   | --- | --- |
   | `GEMINI_API_KEY` | Existing Gemini API project credential. Do not print, commit or prefix with `NEXT_PUBLIC_`/`VITE_`. |
   | `GEMINI_MODEL` | Existing approved model identifier, unchanged by this task. |
   | `TRAIL_PUBLIC_ORIGIN` | Exact canonical HTTPS stable origin, e.g. `https://the-existing-project-domain.vercel.app` **with your actual existing domain substituted**. No trailing slash, path, query, credentials, port, wildcard or localhost. |

   No `.env.local` is loaded by build or hosted functions. The local CLI's existing private-file loading remains local only. Do not use `vercel env pull`, print values or download production secrets for verification.
3. **Preview AI is intentionally unavailable by default.** Do not copy production secrets into Preview automatically. Its Host/Origin will not match the production origin. For a deliberately approved preview, set all three variables scoped to that environment/branch and set `TRAIL_PUBLIC_ORIGIN` to its explicitly trusted exact HTTPS domain. A new generated preview URL needs a matching explicit setting and subsequent authorized build; no request-header/`VERCEL_URL` trust or wildcard list is used. Manual work still works without AI configuration.
4. Function settings are in `vercel.json`: Node, **40-second maximum duration**, request cancellation enabled. The shared planner still has its existing **30-second text timeout**,32KiB raw input bound,128KiB upstream response bound,2 concurrent requests and5 requests per10 minutes per local bucket. Model, prompt and provider limits are unchanged. The Vercel API contains only **GET `/api/ai-status`** and **POST `/api/plan`**. `/api/transcribe` is not deployed; its existing local endpoint/tests remain.
5. Configure the WAF rule below **before enabling public Gemini traffic**. Do not buy a plan or accept paid terms without approval. After independent review and explicit deployment authorization, publish the exact reviewed commit using the existing project's normal workflow. No deploy/link/authentication/upload was performed by this task.

### Public API cost/abuse gate — outstanding dashboard work

Origin/Host checking is not authentication: a direct client can supply both headers. Existing in-memory limits are **per warm function instance**, not a global serverless limiter. The Web Request interface has no trusted socket IP, so the existing fallback bucket is conservatively shared by requests in that warm instance; spoofing forwarded IP headers does not create new buckets. Multiple instances can each call Gemini, and legitimate users can share one instance's small limit.

Current [Vercel WAF documentation](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting) supports a **Fixed Window** rule on Hobby, Pro and Enterprise. Hobby permits one rate-limit rule within its three custom rules; account entitlement/availability and any pricing dialog must be checked in the actual dashboard. Setup, not yet applied:

1. Existing project → **Firewall → Configure → + New Rule**; name it `Trail planning request limit`.
2. Conditions (all true): **Request Path equals `/api/plan`**, **Request Method equals `POST`**. Do not filter only on the trusted Origin, as direct clients can spoof it.
3. Action **Rate Limit**, strategy **Fixed Window**, key **IP**, window **600 seconds**, request limit **5**, follow-up **Default (429)**, not Log-only. This mirrors the existing per-client window at the edge without changing application limits.
4. Review plan/pricing/available rule slots without purchasing. **Save Rule → Review Changes → Publish** only when the owner authorizes activation; verify matching traffic and blocked requests in Firewall overview. If unavailable, keep hosted Gemini unconfigured (manual app remains usable) rather than claim protection.

WAF counters are **per region**. Distributed IPs/regions, cold instances, shared IPs and allowed traffic still prevent this from being a global request/dollar cap. The app has no authentication or durable aggregate budget. Before public exposure, the owner must also review Gemini project quotas/billing limits and Vercel usage/available spend controls; no paid resource or quota change was made here. Do not load-test Gemini or make even one live planning verification call without a new explicit budget. WAF/platform failures can be platform responses rather than Trail's JSON errors.

### What still must be verified on the final origin

- Vercel build reports Node24.x and two server functions with the required server dependencies; only the nine `dist/` browser assets are static. Source, tests, ZIPs and `.env*` URLs must404; `/api/transcribe` must404. `.vercelignore` is a CLI upload allowlist, not a sanitizer for Git history; never commit private files. Function `excludeFiles` also excludes private/unnecessary artifacts.
- Without Gemini configuration, status is disabled and manual creation works. With approved configuration, stable-domain status returns only `{enabled:true}`; wrong Host/POST Origin fail. New live planning calls are **not authorized** by this task or checklist.
- Signed-out HTTPS access, IndexedDB/Web Locks, create → explicit Start → Pause/save → reload → explicit Resume, Later-goal capture, finish/Undo/history and fictional isolation work at that actual origin. Verify mobile/Safari separately. Deployment Protection must match intended judge access before calling it public.
- Localhost, preview and stable production domains have separate browser-local records. No records migrate, reset, sync or upload automatically. Select the stable domain before starting real work there.

## Your records and recovery

Trail stores committed real work in **IndexedDB in your browser**. It has no account, cloud sync or external activity tracking. Keep using the same browser/site address; clearing site data can lose records. Unsaved forms and AI proposals are memory-only and lost on reload.

<details>
<summary><strong>Failed saves, multiple tabs and timing</strong></summary>

| Situation | Trail's behaviour |
| --- | --- |
| A write fails | Keep the page open and choose Retry. The draft and exact pending operation are retained; success appears only after commit. |
| Another tab owns the workspace | The second tab is read-only. Close the writer, then explicitly Retry ownership. |
| You reload or return after uncertain timing | Resume is explicit. Gaps over 15 seconds and clock disagreement interrupt timing; uncertain gaps are not credited. The last uncommitted tail can be lost. |
| You leave a blank pause field or Skip | Existing saved context is preserved. Removing saved text/link requires the explicit removal control and Save. |
| You want to reorder actions during a block | Pause and explicitly End focus block first. This keeps the action unfinished, saved place and recorded effort. Append-only capture does not require ending the block. |
| You check an action accidentally | Limited Undo restores its previous context/stopped state until the next saved domain change. Guarded history corrections retain recorded effort. |
| Local data cannot be validated | Records are preserved; raw export is offered where readable. There is no destructive automatic reset. |

Copy saved place has a manual-copy fallback. It is a handoff convenience, not backup or sync. Opening a work link neither starts timing nor tells Trail what happens in the other tab.

There is currently no import/restore, reminders, background capture or real-record deletion/pruning workflow. The UI does not claim to observe attention. Physical sleep, Safari, native phone keyboards and device dictation remain separate from automated Chromium evidence.

</details>

## Under the surface

**HTML + CSS + browser JavaScript modules + custom SVG**, with a Node HTTP server and an optional server-only Gemini proxy. Nine public application assets; no application framework or runtime package dependencies.

| Part | Responsibility |
| --- | --- |
| `demo/index.html`, `styles.css` | Responsive interface, light/dark themes and reduced-motion presentation. |
| `work.js`, `planner.js` | Real-work UI, pause/capture flow and reviewed optional planning. |
| `state.js` | Validated transitions, stable identities, one active goal and bounded Later queue. |
| `storage.js`, `timing.js`, `activity.js` | Transactional local persistence, writer ownership, conservative timing and derived activity. |
| `proof.js` | Labelled in-memory fictional examples, isolated from real records. |
| `scripts/serve.mjs`, `scripts/ai.mjs` | Allowlisted local serving and bounded server-only API requests. |
| `api/*.mjs`, `scripts/vercel-ai.mjs`, `vercel.json` | Two hosted Node endpoints, raw Web-stream bridge to the same planner, explicit trusted origin and dist-only static deployment. |

The reliability goal is straightforward: **a success message must correspond to committed work, and retrying a failed save must not duplicate it.** Explicit completion, planning estimates and measured effort remain separate.

### Verification

```sh
npm run check
npm test
npm run build
```

- **55 Node tests passed** in the latest independent review.
- **63 Node tests pass locally with the Vercel adapter** (eight added mocked/packaging tests). The adapter's independent review and actual Vercel/final-origin verification are still pending; see [current evidence](devpost/VERCEL_ADAPTER_EVIDENCE.md).
- **The full Chromium browser regression passed**, including real IndexedDB abort/Retry, ownership, reload/recovery, capture/queue, planning mocks and fictional isolation.
- Additional touch-enabled checks covered 320px, 390px and landscape in both themes. Viewport/touch emulation is not physical-device acceptance.
- The build contains exactly nine public assets; protected engines/API remained unchanged in the final capture/polish pass, and private/server/test paths returned 404.

See the [independent review](devpost/INDEPENDENT_FINAL_PRODUCT_POLISH_REVIEW.md) and [implementation evidence](devpost/FINAL_PRODUCT_POLISH_EVIDENCE.md) for scope and limitations. These are technical results, not proof of improved productivity or a completed user study.

<details>
<summary><strong>Optional browser regression tooling</strong></summary>

The browser harness requires Playwright and Chromium provisioned separately; they are not needed to run Trail or `npm test`. It does not install them automatically. With that tooling available and the local server running:

```sh
TRAIL_URL=http://127.0.0.1:3000/ TRAIL_EVIDENCE=./test-results/trail node tests/browser.mjs
```

Use `TRAIL_CHROMIUM` to select an already-installed Chromium executable when needed. Tests use synthetic isolated browser records and mocked planning. Do not treat this as authorization to make live provider requests.

</details>

## Planning and project documents

The repository includes the Devpost Learn Skill Pack installation metadata and project planning documents. Their presence records setup/planning; the final submission's account of actual Skill Pack use must match the development history.

| Read | Purpose |
| --- | --- |
| [Scope](devpost/scope.md) | What this proof of concept includes and excludes. |
| [Product requirements](devpost/prd.md) | The user journey and acceptance conditions. |
| [Specification](devpost/spec.md) | Persistence, timing and implementation contracts. |
| [Design brief](devpost/design-brief.md) | Visual and interaction decisions. |
| [Latest independent review](devpost/INDEPENDENT_FINAL_PRODUCT_POLISH_REVIEW.md) | What was verified and what remains unverified. |
| [Delivery checklist](devpost/checklist.md) | Remaining acceptance, hosting, recording and submission work. |

The current repository demonstrates a working proof of concept. Public hosting, final video and physical-device/user acceptance are separate delivery steps; this README does not imply they are complete.

## License

Trail is released under the [MIT License](LICENSE). Retain applicable third-party license notices when reusing incorporated material.

[Back to top](#trail)
