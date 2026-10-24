# Corrective work-loop evidence — October 21, 2026

Real locally served **production** application, not a mockup. Matched deterministic fictional study records (`e2e/correction-fixtures.ts`), identical viewport and scroll zero in each before/after pair. The test date is deliberately frozen at October 20; this is not a claim of real study activity. No personal records, provider/microphone calls, commit or publication.

## Matched visual matrix

| State | Desktop 1280×720 | Mobile 390×844 |
| --- | --- | --- |
| Ready | [Before](before/ready-desktop.png) · [After](after/ready-desktop.png) | [Before](before/ready-mobile.png) · [After](after/ready-mobile.png) |
| Exact 30-word return | [Before](before/returning-desktop.png) · [After](after/returning-desktop.png) | [Before](before/returning-mobile.png) · [After](after/returning-mobile.png) |
| Update progress | [Before](before/update-desktop.png) · [After](after/update-desktop.png) | [Before](before/update-mobile.png) · [After](after/update-mobile.png) |
| Running Focus | [Before](before/focus-desktop.png) · [After](after/focus-desktop.png) | [Before](before/focus-mobile.png) · [After](after/focus-mobile.png) |
| Completed, next action | [Before](before/middle-desktop.png) · [After](after/middle-desktop.png) | [Before](before/middle-mobile.png) · [After](after/middle-mobile.png) |
| Final checkpoint, summit unconfirmed | [Before](before/final-desktop.png) · [After](after/final-desktop.png) | [Before](before/final-mobile.png) · [After](after/final-mobile.png) |

## What changed, measured

- The exact instruction is now reading text (18px mobile), not a 32px multiline heading. The original action remains identifiable. Start/Resume precedes stopping context and settings; no floating/sticky action bar obscures content.
- At **390×844 / scrollY=0**, context-only **Start** changed from **y=875.19–926.44** to **484.55–535.80**. The whole control fits. [Before rectangles](before/measurements-mobile.json) · [After rectangles](after/measurements-mobile.json).
- At **320×844 / scrollY=0**, context-only **Start** is **631.97–683.22**. Genuine **Resume** is **665.66–716.91** at 320 and **518.23–569.48** at 390. [Start capture](after/start-320.png) · [Resume 320](after/resume-320.png) · [Resume 390](after/resume-390.png) · [Start rectangle](after/start-320-measurements.json) · [Resume rectangles](after/resume-measurements.json).
- Work stays first/left through Focus, with the same ivory material, moderate timer and primary Complete / secondary Save. Project identity joins work/world; captions distinguish destination, saved context and actually earned checkpoint/action. The original forest/checkpoint geometry/renderer remains unchanged.
- Update progress shares the work surface/field/focus/button treatment. Final planned completion has one acknowledgement, one all-planned-steps statement, the actual finish condition and separate explicit Confirm goal complete. Undo, add step and summit history/reopen/corrections remain available.
- Screenshot review caught a further middle-completion density issue. Tightening the acknowledgement puts its next Start fully in view at **624.56–675.81** on 1280×720 and **684.17–735.42** on 390×844; the return-field disclosure gap was reduced without changing field persistence.

No horizontal document overflow in the tested 320/390/640/1024/1280/1440 reflows. Maximum 500-character next step and 2,000-character note remain accessible in full without rewriting stored content. 640×360 is an equivalent 200% reflow viewport from 1280×720, not an OS/browser-zoom or physical-keyboard certification. A 320×480 dialog check approximates reduced visible height with a keyboard; real device keyboard/Safari/screen-reader checks remain pending.

## Provenance and verification

[Source/build hashes](provenance.json): base `0bd540e` plus preserved dirty candidate and this bounded correction; production build **`o60UF-wt_heJqR65fEXRH`**, preview **http://127.0.0.1:3101/**, AI disabled. Before captures were taken from the previous production preview before runtime editing. The public release was not changed.

Final targeted production run after screenshot-review repairs: **45 passed (10.0s)** (new five-case suite × desktop/tablet/mobile plus existing Update progress/storage/ownership/backup cases). Final ordinary regression rerun: **363 passed (3.0m)**. Lint/typecheck, 74 unit tests and production build passed. Fresh-eyes reviewer found the four requested corrections visible, then rechecked the compacted Focus/middle captures with no remaining screenshot-visible blockers. Commands/limits are in the [implementation plan](../../replan-2026-10-24/CLEANUP_RECEIPT.md#removed-files) and [HANDOFF](../../../HANDOFF.md), not inferred from pictures.

Full-page versions, 1024px matrix, maximum text, paused/expired ordinary-project, short-height dialog, write-failure and confirmed/reopened captures remain in ignored `test-results/today-correction-reviewed-production/`. The existing four independent-review images and all earlier evidence were preserved untouched. Screenshots and mechanical checks make this candidate reviewable; **user visual acceptance remains pending**.
