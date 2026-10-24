# Trail UI demo

Trail helps you focus on one action, leave a useful next step, and return knowing where to begin.

This repository now contains **one website: the retained 01b UI demo**. The previous Next.js app and old UI have been removed. The demo uses fictional work and in-memory state; reloading resets it. It is not the functional product.

## Run

Use Node.js 20 or newer. No package installation or API keys are needed.

```sh
npm run dev
```

Open http://127.0.0.1:3000/. To choose another port: `npm run dev -- --port 52254`.

`npm run check` checks syntax. `npm test` checks asset serving, private-path rejection, HTTP behaviour and build parity. `npm run build` creates `dist/` for a static host. `npm start` serves the same demo locally; it does not start an old app.

## Current source of truth

- [Scope](devpost/scope.md): demo boundary and future product scope.
- [PRD](devpost/prd.md): intended user experience and acceptance conditions.
- [Design brief](devpost/design-brief.md): retained visual baseline and requested refinements.
- [Specification](devpost/spec.md): current implementation and future architecture decisions.
- [Checklist](devpost/checklist.md): completed cleanup and remaining product work.
- [Handoff](HANDOFF.md) and [build instructions](BUILD_PROMPT.md): how to continue safely.
- [Cleanup receipt](devpost/CLEANUP_RECEIPT.md): removal inventory and recovery.

GitHub publication is a source backup, not a hosted deployment. Demo scenarios and timers do not establish background delivery, persistence or real productivity tracking.
