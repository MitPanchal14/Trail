# October 21 candidate evidence

**Interactive preview:** http://127.0.0.1:3102/ — this checkout, development mode with the existing local AI configuration. It is the functioning app, not the historical static field-desk proof at 4175. No public deployment. `provenance.json` identifies the exact source and final tested production build `LsH6kl346yGeiqUOSbEzx`. That production server was tested on 3102, stopped, then the same source was started in development mode there for hands-on AI use. Production AI remains blocked.

## What changed

- Original full pixel terrain directly above one dark work surface. Restrained glass navigation and controls; Today/Mountains/Progress preserved. Focus/completion/update use the same material. Long return steps stay readable and Start/Resume remains before secondary detail.
- Optional browser dictation into an editable stopping note. Separately requested AI prepares editable note/next-step text. Explicit Save, cancellation, original text recovery and manual fallback remain. AI has no completion, scheduling, time-credit or plan mutation authority.
- Bounded planning schema/provider extension and stronger instruction for a small entry action when avoiding known work. Existing persistence/domain/terrain/timer/ownership guards remain.

## Verification, with scope

| Run | Result | Meaning |
| --- | --- | --- |
| Unit | 78 passed / 12 files | Strict input/output/production lock plus existing domain/API tests; provider adapter mocked |
| Full managed browser regression | 374 passed / 13 failed, 3.4 min | AI disabled, desktop/tablet/phone. 11 failures: hidden completed totals; 2: old mobile world placement assertion |
| Focused production after repairs | 111 passed, 20.3 s | Includes all 13 failures and completion/Undo/summit/layout/update workflows |
| Final rebuilt production after visible AI-unavailable explanation | 72 passed, 13.4 s | Narrow editor, new AI draft/review/cancel/fallback checks, old manual storage/ownership checks, six-state layout, explicit return/completion/Undo/summit |
| Lint / TypeScript / production build | Passed | Final runtime source; generated next-env restored to its prior baseline after server startup |

These counts overlap. There was no single clean full 387-test run on the final build. Logs are retained here; test assertions about persisted records and time/reward were kept. Presentation assertions changed only for the chosen world-above-work composition. Mocked speech/AI browser events do not demonstrate real speech recognition or statistical AI quality.

Screenshots prefixed `production-fixture-` show isolated deterministic fictional records on the final production build (including the deliberately long prior test instruction). `production-layout-*.json` records scroll-zero geometry, no horizontal overflow, and primary placement. `production-return-*` shows the manually created fictional PDF journey on the tested source; `interactive-update-desktop.png` shows the same journey in the final development preview with AI preparation available. Desktop 1280×720 and phone 390×844 were visually inspected. 320px reflow and dialog checks are automated, not a physical-device certification.

## Exactly two approved live checks

The user authorized two local Gemini requests using fictional study text. Both returned HTTP 200, with editable drafts, no automatic save/accept/completion and no microphone use. No more calls were made.

1. Progress input: “Fictional demo: I read one paragraph but could not explain its main idea. I stopped because reading felt boring. I have not started the practice questions.” Existing action: read one paragraph; supplied return step: explain its main idea in one sentence. Actual summary: “Read one paragraph but could not explain its main idea, and stopped due to boredom; practice questions not started.” Actual return step: “Explain the paragraph’s main idea in one sentence.” Grounded in the report; retained the existing instruction. Suggestion cancelled without saving. `live-update-phone.png`.
2. Breakdown input: fictional assignment due the day after tomorrow; already knows it requires class PDF reading/memorising and two practice questions; postpones boring reading; portal unavailable to the model; wants to start without a big plan. Actual first action: “Open PDF and Read Section 1”, instruction “Open the class PDF and read the first section aloud to push past the resistance.” Suggested session 15 minutes. Remaining steps: summarise first section, read remaining sections, solve questions. Full fictional output: `live-breakdown.txt`; screenshot `live-breakdown-phone.png`. **Structured integration passed; small-start quality failed.** Draft kept without acceptance. This does not establish that Trail solves procrastination.

After those calls the prompt was tightened to request a 2–5-minute entry action, one paragraph selected by the user and one sentence of recall for this example, rather than a whole section. **No live call validates this newer prompt.** Do not present it as proven or the fictional PDF as ingested/understood.

## Manual journey and preservation

Created only fictional work in an initially empty isolated review browser at 3102. Used real manual creation/review/accept and update Save. Reload showed saved context and no automatic focus. Explicit Start → Save → reload → Resume → Complete → Undo produced 0 → 1 → 0 checkpoints. No summit. The own fictional work, saved 02:44 remainder, creation draft and correction history remain; no personal browser data was cleared or inspected. Later fresh-tab review confirmed editing access and an enabled AI preparation control in development mode without another provider call. Browser viewport reset and the final preview tab retained.

`preservation.json` compares the 81-file pre-edit baseline, identifies the intended changes and verifies unchanged terrain/domain and unrelated candidate files. The small tsconfig historical-backup exclusion and rejected-proof lint variable rename are separately recorded in the active brief. Existing unrelated dirty files/evidence remain. Nothing staged, committed, pushed or deployed.

## Next decision

Try one actual unpleasant task in this candidate. Judge visual comfort, effort to start, and ease of recording/returning. Real microphone accuracy, better first-action AI quality, personal retention/productivity impact, physical Safari/device behavior and user acceptance remain open. Public AI availability/protection is a later delivery decision. Keep the last day for deployment checks, fixes, video and submission; do not add portal integration, notifications, sync or native apps now, or claim a guaranteed prize.
