# Implementation specification

## Current runtime

A dependency-free static browser demo lives in demo/index.html, styles.css and proof.js. The browser runs a fictional in-memory scenario model. Refresh resets it. Node.js 20+ serves an allowlisted set of three assets on localhost; unknown/private paths return 404 and write methods return 405. The build copies only those assets into dist/. No API routes, Next.js runtime, database, remote AI requests or notification service are part of this baseline.

Run and build commands are in README.md. All commands resolve to this same demo. Generic agent skill directories are development guidance only.

## Functional state contract to design next

Separate Goal, Action, FocusSession, PauseContext, CompletionEvent and DayActivity records with stable IDs. Define explicit transitions for start, pause, extend, action completion, goal review, confirmed completion, Undo and reopening. Publish successful UI state only after durable writes succeed; report failure without losing drafts. Handle malformed/old records and migration explicitly. Define session ownership across tabs and conservative crash/reload recovery. Preserve context when optional fields are skipped. Test repeated actions for duplicate effort/completion credit.

Choose persistence only after agreeing the first slice. Local-first storage can support the core workflow, but closed-site reminders require a separately designed and verified delivery mechanism. Do not imply service workers alone schedule arbitrary reliable reminders. No provider or permission prompt is chosen by this document.

## Open decisions

Reminder neglect thresholds, quiet hours, delivery provider and cancellation; priority weights and aging; streak timezone and grace display; effort-to-route mapping; floating-strip capability/fallback; real finished-record schema; AI provider and costs. Resolve only what the next bounded implementation requires.

## Verification boundaries

Current automated checks verify syntax, static serving/security boundaries and exact build copying. Browser inspection verifies representative visual states only. The historical reported regression counts belong to the old proof review and are not new functional test evidence. Persistence, background delivery, physical-device behaviour and sleep recovery are unverified because they are not implemented here.
