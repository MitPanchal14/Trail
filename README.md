# Trail local prototype

Trail helps you focus on one action, leave a useful next step, and return knowing where to begin.

Current capture flow: **Add a step** appends without replacing the unfinished action. Running focus explicitly pauses first; the same block is kept and Resume is separate. **Save another goal for later** opens a separate manual outcome form. Up to10 Later goals persist locally, can be reviewed/edited, and can be made active only after active work is finished; Start stays separate. Queued goals are not finished work, effort or activity. The labelled fictional capture illustration never writes real records. See [current evidence](devpost/FINAL_PRODUCT_POLISH_EVIDENCE.md); independent review and user acceptance remain pending.

This repository contains **one dependency-free website using the retained 01b composition**. Create a real goal/actions, focus, pause with return context, reload and explicitly Resume, then complete/review/finish into local history. Limited Undo and guarded reopening preserve recorded effort. A separate, clearly labelled fictional example resets on reload and never changes real records. The previous Next.js app remains removed. This is a reviewable local prototype, not a deployed or submission-ready product.

## Run

Use Node.js 20 or newer. No package installation or API keys are needed.

Manual work needs no API key. Optional Gemini assistance requires this Node server, not static-only hosting. Tested on Node24.16.0; CLI explicitly loads the existing ignored root `.env.local` with `process.loadEnvFile` (available in Node20.12+). Older Node20 can run manual work or receive configuration through its server environment; it does not automatically load `.env.local`. Never put credentials in public variables or browser files. Root `.env.local` uses server-only `GEMINI_API_KEY` and `GEMINI_MODEL`; leave existing values private and untracked.

```sh
npm run dev
```

Open http://127.0.0.1:3000/. To choose another port: `npm run dev -- --port 52254`.

`npm run check` checks syntax. `npm test` runs dependency-free domain/clock/static-serving/build tests. `npm run build` creates an allowlisted `dist/`. `npm start` serves this same prototype locally.

## Optional new-goal assistance

New real goals show **Plan with AI · Gemini API · optional** above the manual route. Open **Describe your goal**, type/paste up to6,000 characters or use your device’s dictation and correct the resulting text. Trail cannot activate or guarantee device dictation; availability/processing depend on your OS/keyboard. Add optional deadline/time available, then **Draft my trail**. Review/edit the unsaved suggestion and estimates; check assumptions/conflicts. **Save this goal** saves the reviewed proposal directly through the same validated transaction/exact Retry as manual Save, then opens Today. **Start focus is always separate.** Optional secondary **Edit in manual form** retains the recoverable transfer/collapsed-panel route; it is not required before proposal Save. Discarding a suggestion never erases its manual copy. Existing goals and fictional examples never invoke AI rewriting.

While generation is actually pending, a small animated colour indicator accompanies the polite status and accessible Cancel; reduced motion stays static. Errors distinguish Trail’s local cap, provider request limit, timeout, unconfigured service and unusable output without exposing provider details. There are no automatic retries or model downgrades. Final verification used exactly two newly authorized text calls; see [final feedback evidence](devpost/FINAL_FEEDBACK_EVIDENCE.md). Further live requests need authorization.

The current website does not record or transcribe audio and never requests microphone permission. The old exported recorder/renderer and server `/api/transcribe` route remain unused infrastructure with unit/security tests; they were not deleted or newly validated on physical hardware. Source and proposal drafts are memory-only and lost on reload. Manual creation stays available if AI is unconfigured, busy, cancelled or fails; retries are explicit.

Only supplied description/deadline/budget text goes to Gemini from the current UI, via same-origin `/api/plan`; never saved workspace/history/notes/links or audio. Google processes submitted text under its API terms; Trail makes no provider zero-retention promise. Only server code calls Google with its authentication header. `/api/ai-status` exposes configuration presence only, not provider health. Errors are sanitized. Cancel/navigation/modes/ownership loss stop requests; late responses cannot replace a different draft. API retry is a fresh explicit request, separate from exact local storage Retry. Pending physical-device, device-dictation, deployment and video/user-acceptance gates are not claimed complete.

Optional estimated minutes and planning context persist by action ID through normal editing/reload/completion/Undo. Blank estimates mean unknown; totals identify incomplete estimates and over-budget suggestions. Deadline text is context, never a calendar appointment or enforced promise. Estimates never become recorded effort, Focus allocation or completed actions. Legacy records remain schema1-compatible.

Build output is exactly nine public assets, without server/configuration files. Serving only dist supports manual work, **not** Gemini APIs. The local loopback server uses origin/Host checks, time/body/response/concurrency/rate bounds; these are not authentication or sufficient public shared-key/cost protection. No public deployment is authorized. [Current UI evidence](devpost/AI_SIMPLIFY_EVIDENCE.md) covers mock-only text planning; [historical provider evidence](devpost/GEMINI_PLANNER_EVIDENCE.md) records the three earlier live calls and retired audio flow. Do not repeat the exhausted live budget automatically.

For browser integration, `node tests/browser.mjs` uses the already available local Playwright/Chromium tooling against port 3000. This optional harness is not an application dependency and installs nothing. Set `TRAIL_URL` for another local origin and `TRAIL_EVIDENCE` for screenshots. See [day-build evidence](devpost/DAY_BUILD_EVIDENCE.md) for tested behaviour and gaps.

For this cloud environment, the preinstalled browser is selected with `TRAIL_CHROMIUM=/usr/bin/chromium`; Playwright is linked from existing runtime tooling into ignored `node_modules/`, without a package install. The harness uses an isolated Chromium profile. Cloud loopback is not a preview on your Mac; no public preview/deployment was created. Current results and capture/patch paths: [cloud completion evidence](devpost/CLOUD_COMPLETION_EVIDENCE.md).

## Use and recovery

- Start working → Create a goal → enter title, definition and ordered actions → Save. Cancel changes no saved records. One open goal at a time.
- Home explains Trail as a productivity/focus companion and keeps Start working/Continue/Review/New goal tied to actual records. **Try a ready-made demo** remains available for returning users too: Return to saved work, Explore sample activity and Browse demo states. Workshop previews are labelled fictional; genuine saved cues remain primary. Use **Real work** at the top to return; real goal/note drafts are preserved.
- Goal **Priority** is Low / Normal / Important (default Normal). It changes the label/card palette only; action order stays yours. Old missing-priority records render Normal without migration. There is no automatic sorting, scoring, deadline or reminder behavior.
- Start/Resume is explicit. Pause stops local accrual before the note form. Blank fields and Skip preserve prior instruction/context independently. Extend adds time; paused/expired blocks stay paused until Resume.
- To change plans without falsely completing work, Pause, then choose **End focus block** in stopped Focus or the locked goal editor. This keeps the action unfinished, saved place and recorded effort, and unlocks valid action insertion/reordering. Ended blocks never Resume/Extend; explicitly Start creates a fresh block. A failed End keeps the lock until Retry commits. See [end-block evidence](devpost/END_FOCUS_BLOCK_EVIDENCE.md).
- Save an optional next move, where-stopped context and one work link under the collapsed extras. Blank link keeps the saved reference; check Remove saved link and Save to delete it. Cmd/Ctrl+Enter submits only the pause form (not during IME composition). Unsaved pause drafts survive in-app navigation/mode switching, not reload.
- Pause now has one compact heading and identifiable action, with next-move capture and Save/Skip before optional extras. Existing independent removals and blank/Skip preservation are unchanged. A saved cue identical to the action after trimming no longer repeats an extra Action row; full stored text, Copy and different original instructions remain available.
- Today shows the saved next move (or a labelled unfinished-action fallback) and actual context-save time. Open work is a user-triggered new-tab reference, also available in Focus saved context and finished history. It never starts timing or captures external activity. Only explicit absolute HTTP(S) URLs without credentials/controls are accepted, up to 2,048 characters; no automatic fetching or title lookup. Older v1 records need no migration. See [return-experience evidence](devpost/RETURN_EXPERIENCE_EVIDENCE.md).
- **Copy saved place** in Today or Focus's saved context copies the current action's committed goal/action, full saved cue/context and link. If clipboard access fails, a labelled selectable text area supports manual copying. Copy works on displayed read-only records and does not save, change timing/Undo or dismiss Retry. It is not backup, sync or import. See [final-demo evidence](devpost/FINAL_DEMO_PASS_EVIDENCE.md).
- Complete action is explicit and stops timing. Undo restores its saved context and stopped timer until the next saved domain change; navigation/reload alone preserves the window. Recorded effort is retained.
- One small circular progress marker follows the existing illustrative path after a newly committed action completion. A useful saved note or link with timing stopped becomes a campsite; an empty context record does not. Selection does not move the destination. All-checked stops below the summit for review; only explicit finish brings summit arrival in the existing reward. Motion Off/reduced motion settles instantly; Undo/navigation/reload cannot replay or be overwritten by travel. This prototype awaits the user's visual decision.
- All actions checked opens review, not automatic goal completion. Add an action, keep open, or confirm finished. The compact reward follows a committed finish and never replays merely through navigation/reload.
- Finished work uses compact priority-coloured cards with decorative white mountain outlines. Activate a goal title (**View completed work**) to read its complete definition, actions, saved times/notes and safe links in a read-only dialog; Close/Escape returns focus. Viewing works read-only/pending and never saves. Reopen still requires no other open goal; refinish updates the same identity. Low uses teal/blue, Normal indigo/violet, Important plum/amber, always with an explicit priority label.
- Failed writes stop timing and keep the draft/pending operation. Retry reconciles the same operation once, then requires explicit Resume if timing was running. Corrupt/newer records are preserved with raw export where readable; there is no destructive reset/import flow.
- Actions with any saved context record (including a link alone) cannot be removed, even before starting a timer. Long Today notes use bounded previews with keyboard-accessible full-text expansion below the work/focus controls; stored/editable text is unchanged. Skip discards only its pause-form validation, never a pending write or storage error. See [return-fix evidence](devpost/RETURN_FIXES_EVIDENCE.md).

## Current source of truth

- [Scope](devpost/scope.md): demo boundary and future product scope.
- [PRD](devpost/prd.md): intended user experience and acceptance conditions.
- [Design brief](devpost/design-brief.md): retained visual baseline and requested refinements.
- [Specification](devpost/spec.md): current implementation and future architecture decisions.
- [Checklist](devpost/checklist.md): completed cleanup and remaining product work.
- [Handoff](HANDOFF.md) and [build instructions](BUILD_PROMPT.md): how to continue safely.
- [Demo walkthrough](devpost/DEMO_WALKTHROUGH.md), [video script](devpost/VIDEO_SCRIPT.md), [submission draft](devpost/SUBMISSION_DRAFT.md), [claim evidence](devpost/CLAIM_EVIDENCE.md) and [deployment preflight](devpost/DEPLOYMENT_PREFLIGHT.md): reviewable delivery preparation, not publication or human validation.
- [Cleanup receipt](devpost/CLEANUP_RECEIPT.md): removal inventory and recovery.

Real work requires IndexedDB and Web Locks. The writer holds an exclusive lock for its document lifetime; other tabs are read-only until the owner closes and you choose Retry ownership. No unsafe storage fallback is used.

Records belong to this browser and site address; changing port/origin changes storage. Clearing site data can lose them; there is no sync or permanent-storage guarantee. Checkpoints are about 5 seconds apart. Gaps over 15 seconds, clock reversal or wall/monotonic disagreement over 2 seconds interrupt without crediting that gap. Reload/BFCache recovery requires explicit Resume and may lose the last uncommitted tail. Committed checkpoints intentionally omit write latency; background throttling can interrupt. Sleeps shorter than the threshold are not universally detectable.

Limits: 160-character goal title, 2,000-character definition, 1–30 actions of 500 characters, 4,000 characters per note, 200 goals, 100,000 records per bounded collection, 24-hour maximum allocation per block. At limits, saving fails visibly rather than silently deleting history. There is no pruning/import/delete workflow.

Finished work includes the latest **twelve named calendar months**, 14px heatmap squares and a labelled 44px date alternative. Day selection shows a compact date/count; explicitly choose **View actions** for complete tasks, with further disclosure beyond eight items. A changed date collapses the list. Jump to finished goals reaches the counted archive heading. Current/best streaks and highest/next 1/5/10/25 milestones remain correction-aware: only currently checked actions with valid nonfuture dates count, including open goals; Undo/reopening can reduce totals. Nothing derived is persisted. Archive remains two desktop columns/one phone column, newest eight + Show more, all history reachable.

Fictional examples include a populated shared year/archive (eight realistic goals, 42 actions, mixed priorities, all intensity levels and gaps), saved workshop return, stopped Focus with explicit simulated Resume/Pause/End, labelled simulated interruption, all-checked review, long content and empty records. Reset is deterministic for a given date/timezone; varied local sample dates and a historical three-day run regenerate for the current twelve-month range. Samples stay in memory and never enter real storage or call Gemini. Sample archive corrections and link editing are intentionally limited and labelled; Real work supports the full guarded paths. Existing real note removal, clipboard fallback, timing/storage/Undo are unchanged. Browser build now has nine allowlisted assets.

The bounded handoff/Focus pass adds a clearer raised dark Focus surface and calm blue/violet peripheral drift using existing classes, without changing light appearance or layout. Background motion Off/reduced motion retains the existing immediate freeze/settle behavior. Current verification/review status: [handoff/Focus evidence](devpost/HANDOFF_FOCUS_EVIDENCE.md); independent/user visual review remains separate. No native Safari success is claimed.

Physical Mac sleep/wake, branded Chrome/Comet, phone hardware, device dictation/native Safari and native BFCache eligibility remain unverified. Optional Gemini text assistance is implemented as described above; no reminders, PiP, priority scoring or real effort-to-route mapping. No commit, push, hosting or submission is authorized for this local build.
