# Demo-only cleanup receipt — 25 October 2026

## Selection and preservation

The current 01b static proof is the selected UI. Its index.html, styles.css and proof.js were moved to demo/ without content changes. A complete readable archive of 513 tracked/untracked non-ignored files was created before cleanup at /Users/mitku/.codex/visualizations/2026/10/24/01a16c8e-0237-72c3-a8f0-3127a3975161/repo-cleanup-2026-10-25/before-demo-only.tar.gz. The accompanying manifest records original HEAD and runtime SHA-256 hashes. Credentials and ignored caches were not archived. The archive is local recovery, not committed site content.

Original HEAD: b3effee180fc1f07e3ae42c86987129cb607049b. Git history and the existing pre-sync stash are retained. Later 01d/functional work is not the selected baseline. Recover individual useful files only after review.

## Removed from the active repository

- Old app/, components/ and lib/ including the rejected UI and old functional runtime.
- Old deployment/, e2e/, unit tests, scripts and framework/test configuration.
- Next.js/React dependencies and obsolete environment example.
- Historical devpost plans, audit outputs, evidence galleries and alternate proof implementations that could be mistaken for current instructions.

Ignored private environment files and local caches were left untouched and are not part of the new website or GitHub source. Generic agent planning workflows remain available. Seven visual reference screenshots are retained as design context.

## Replacement

One demo/ source, one static server/build workflow, focused serving/build tests, and current root/product instructions. No functional integration or deployment is claimed. See checklist.md for live verification status.

## Verification

All three runtime hashes match the archived originals. Syntax checks, four serving/build tests and the static build passed. Browser inspection confirmed landing → Today → Focus and running-timer navigation. No functional product or complete visual acceptance is claimed. The test command explicitly targets tests/ so ignored historical test caches cannot be mistaken for current checks.
