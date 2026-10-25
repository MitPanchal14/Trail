# Trail local prototype

Trail helps you focus on one action, leave a useful next step, and return knowing where to begin.

This repository contains **one dependency-free website using the retained 01b composition**. Create a real goal/actions, focus, pause with return context, reload and explicitly Resume, then complete/review/finish into local history. Limited Undo and guarded reopening preserve recorded effort. A separate, clearly labelled fictional example resets on reload and never changes real records. The previous Next.js app remains removed. This is a reviewable local prototype, not a deployed or submission-ready product.

## Run

Use Node.js 20 or newer. No package installation or API keys are needed.

```sh
npm run dev
```

Open http://127.0.0.1:3000/. To choose another port: `npm run dev -- --port 52254`.

`npm run check` checks syntax. `npm test` runs dependency-free domain/clock/static-serving/build tests. `npm run build` creates an allowlisted `dist/`. `npm start` serves this same prototype locally.

For browser integration, `node tests/browser.mjs` uses the already available local Playwright/Chromium tooling against port 3000. This optional harness is not an application dependency and installs nothing. Set `TRAIL_URL` for another local origin and `TRAIL_EVIDENCE` for screenshots. See [day-build evidence](devpost/DAY_BUILD_EVIDENCE.md) for tested behaviour and gaps.

For this cloud environment, the preinstalled browser is selected with `TRAIL_CHROMIUM=/usr/bin/chromium`; Playwright is linked from existing runtime tooling into ignored `node_modules/`, without a package install. The harness uses an isolated Chromium profile. Cloud loopback is not a preview on your Mac; no public preview/deployment was created. Current results and capture/patch paths: [cloud completion evidence](devpost/CLOUD_COMPLETION_EVIDENCE.md).

## Use and recovery

- Start working → Create a goal → enter title, definition and ordered actions → Save. Cancel changes no saved records. One open goal at a time.
- Start/Resume is explicit. Pause stops local accrual before the note form. Blank fields and Skip preserve prior instruction/context independently. Extend adds time; paused/expired blocks stay paused until Resume.
- Save an optional next move, where-stopped context and one work link under the collapsed extras. Blank link keeps the saved reference; check Remove saved link and Save to delete it. Cmd/Ctrl+Enter submits only the pause form (not during IME composition). Unsaved pause drafts survive in-app navigation/mode switching, not reload.
- Today shows the saved next move (or a labelled unfinished-action fallback) and actual context-save time. Open work is a user-triggered new-tab reference, also available in Focus saved context and finished history. It never starts timing or captures external activity. Only explicit absolute HTTP(S) URLs without credentials/controls are accepted, up to 2,048 characters; no automatic fetching or title lookup. Older v1 records need no migration. See [return-experience evidence](devpost/RETURN_EXPERIENCE_EVIDENCE.md).
- Complete action is explicit and stops timing. Undo restores its saved context and stopped timer until the next saved domain change; navigation/reload alone preserves the window. Recorded effort is retained.
- One expedition marker follows the existing illustrative path after a newly committed action completion. A useful saved note or link with timing stopped becomes a campsite; an empty context record does not. Selection does not move the destination. All-checked stops below the summit for review; only explicit finish brings summit arrival in the existing reward. Motion Off/reduced motion settles instantly; Undo/navigation/reload cannot replay or be overwritten by travel. This prototype awaits the user's visual decision.
- All actions checked opens review, not automatic goal completion. Add an action, keep open, or confirm finished. The compact reward follows a committed finish and never replays merely through navigation/reload.
- Finished work contains real titles, timestamps, counts, context and recorded effort. Reopen a goal only if no other goal is open. It stays all-checked until you explicitly reopen an action or add one; refinish updates the same history identity.
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

Physical Mac sleep/wake, branded Chrome/Comet, phone hardware and native BFCache eligibility remain unverified. No AI, reminders, PiP, priority scoring, streaks or real effort-to-route mapping are implemented. No commit, push, hosting or submission is authorized for this local build.
