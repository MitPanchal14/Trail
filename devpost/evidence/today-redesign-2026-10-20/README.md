# Today redesign — local production captures

October 20, 2026. **Fictional isolated browser records**, not user work or measured study outcomes. These are the real Next.js application's local production build (`http://127.0.0.1:3101/`), not a standalone prototype. Original mountain geometry/checkpoint positions unchanged. Reduced motion used for stable captures; no provider/microphone calls or deployment.

| State | Desktop (1440px) | Mobile (390px) |
| --- | --- | --- |
| Ready | [Ready](ready-desktop.png) | [Ready](ready-mobile.png) |
| Returning | [Returning](returning-desktop.png) | [Returning](returning-mobile.png) |
| Completed | [Completed](completed-desktop.png) | [Completed](completed-mobile.png) |

Captured by `e2e/today-experience.spec.ts`; source artifacts and 1024/320px variants remain in ignored `test-results/today-redesign-production-final/`. The fixture freezes the time, so the date/18 seconds recorded represent its explicit test transitions, not a claim about attention or real study progress. The brief automatic heading-focus outline is captured as rendered; screenshots do not establish screen-reader/physical-device usability or user acceptance.

The test measures document overflow (zero at 1440/1024/390/320), panel placement and primary-control visibility, checks unchanged stored JSON merely from viewing/disclosures, and exercises actual update/save/reload/explicit focus/completion/Undo. Production subset: **87 passed (14.2s)**, including existing Update progress/storage/ownership/backup, focus-layout, task-reveal and interface-contrast checks. Broader results/limitations and exact changed-file scope: [slice plan](../../replan-2026-10-24/CLEANUP_RECEIPT.md#removed-files), [handoff](../../../HANDOFF.md).

Stop for visual review. The public demo still serves its previously approved release; these captures are not evidence of a new public release.
