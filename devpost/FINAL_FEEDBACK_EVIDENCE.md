# Final feedback correction — 26 October 2026

One writer on `codex/trail-redesign`, baseline `721fd12`. Implementation plan recorded before edits: FINAL_FEEDBACK_IMPLEMENTATION_PLAN.md. Existing HANDOFF/checklist/brief edits, ZIPs/private configuration and real records preserved. No branch/reset/commit/push/deploy/submission. No new application asset or dependency.

## Completed vs deferred

| Request | Result |
| --- | --- |
| Safe precise AI errors | Fixed allowlisted codes/messages distinguish Trail local limit, provider request limit, timeout, unconfigured, upstream unavailable, invalid input/output; cancellation remains explicit/client-controlled. HTTP semantics retained. No raw exception/provider body/prompt/header/key/URL in responses. Provider429 does not claim daily quota exhaustion. |
| Concise planning | Prompt requests typically3–6 dependency-ordered flat executable actions, fewer for trivial work, existing maximum12; short finish/action wording and only meaningful findings. No false hierarchical scheduling/exact-fit promise. Strict response validation retained. |
| Model/bounds | Unchanged model/config,30s text timeout,5/client/10min,2concurrency,8192 output cap. No unsupported thinking parameter, token cut, API migration, fallback or automatic retry. The existing model is already Flash-Lite; not claiming a measured model/default-thinking speedup. |
| Explicit proposal Save | Save this goal routes through shared work.js saveDraft → existing command/write/commit/pending Retry, then actual Today only on success. Reviewed edits/estimates/deadline/budget and current manual priority used. App UUIDs allocated for accepted command; exact Retry reuses IDs/operation. Generate never saves; Start remains separate. Empty unrelated manual fields do not block proposal Save. |
| Secondary recovery | Optional Edit in manual form preserves former recoverable transfer/applied-state/collapse/focus. Not required acceptance. Failed primary Save retains source/proposal/manual draft; no success navigation or second saved record. |
| True busy animation | UI-only actual pending flag drives aria-busy, decorative fixed-size colour strip and one polite status. Cancel/navigation/mode/ownership cleanup removes indicator. Transform/opacity only; reduced motion static; no fabricated percentage/stages. |
| Archive | Shared softer pale light/muted dark priority families; explicit labels, same title detail control with View details cue instead of external arrow; secondary bordered Reopen with44px/guards. Same compact columns,8+Show more, full details/long text. |
| Decorative peak | Only finishedArt SVG/CSS changed: complete outer silhouette/one ridge within container. Active routeSVG/terrain/path/marker/outcome rules unchanged. |
| Calendar | Weekday column sizes to actual text instead of fixed24px.14px tile/date-control/keyboard/count/rollover contracts unchanged;125% text fit checked. |
| Theme/Today decoration | One native sun/crescent44px button, action label/title updated; Enter/Space and domain isolation tested. All test theme selectors migrated to idempotent semantic helper; no hidden compatibility controls. Shared top-right decorative Today arrow hidden; actual Open work links retained. |
| Focus | Existing animated surround softened in both themes,20s transform drift. Real/example5.5s samples differ; card geometry stays stationary; Off/reduced tested, no timing controller changes. Chromium evidence is not Safari certification. |
| Summary / fictional AI preview | Deferred optional mini-summary and extra AI-preview scenario to protect verification. Existing current/best streaks/milestones and labelled fictional three-day run retained; no fake streak rules, real seed or parallel planner. Shared archive/Today/Focus styling appears in current fictional fixtures. |

## Verification and attempts

Evidence base: `/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-final-feedback/`.

- Fresh `npm run check`, `npm test`, `npm run build`: exit0 in `final-{check,test,build}.log`; **52 Node tests passed**,0 failures/skips. Tests cover error categories/config/provider429/local concurrency/timeout and existing credential echo/schema/static/audio/security contracts.
- Focused planner (milestone1/ and planner/): passed explicit Save validation, empty manual fields, current priority/edited estimate, double click, actual aborted IDB write, exact Retry operation/IDs, one goal/no timer; retained secondary recovery and no-media/no-secret/network/late-result/estimate/reload/isolation checks. No live calls in browser tests.
- Focused final visual gate passed (`visual-verified/`): keyboard single theme/domain snapshot isolation, pending blobs/static reduced state/fixed local-limit message, priority archive/apex/320/390/844landscape/1440,125% weekday text and real/example light/dark5.5s On vs Off/short-height/stationary-card checks.
- One first visual attempt sampled a CSS paused animation before its next rendered frame; it saw a fraction-frame difference. Added direct computed play-state=paused assertion and two-render-frame synchronization before measuring stability, not an engine change or weakened motion assertion. Subsequent focused and full gate passed that check.
- First combined run (`final-browser.log`) passed new visual gate, core A/B/C, planner, correction/return/travelling/mountain/reward/return-fix/end-block/final-demo, then failed an obsolete assertion requiring the old decorative base to crop outside its container. Replaced only that superseded presentation assertion with actual screen-transformed apex/full-silhouette containment plus noninteraction. Existing foreground width/focus/reopen/record assertions retained.
- Second combined attempt (`verified-browser.log`) passed through compact/note-removal/activity, then the unchanged settled-date-surface assertion found the test pointer still hovering the View day button. The migrated idempotent theme helper had stopped moving the pointer as the old segmented-button click did. Cleared incidental hover before semantic theme selection; no product CSS or surface assertion changed. Focused year/archive passed all0/1/8/9/30,theme,month-rollover/detail/Retry cases afterward (`year-verified/`). Focused compact also passed the new complete-apex contract (`compact-verified/`); its old console wording was corrected without changing behavior.
- Fresh complete combined repeat after those test-only corrections **passed, exit0**: all21 retained browser gates plus planner/explicit-Save composite and new final visual gate. Receipt `final-verified-browser.log`, captures `final-verified/`. Includes full year/archive/priority/clarity/examples/handoff/Focus after the earlier partial attempts. No runtime edit followed focused/mock/live checks. No unresolved test failure remains; earlier attempts are retained above rather than hidden.
- Protected state/storage/timing/activity, serve/build allowlists and package compare byte-for-byte with pre-edit snapshots. Exact nine source/build/served bytes match new preview; server/private/test paths404. No secret read into browser/build. Final `git diff --check` passed after documentation completion.

## Live text verification — budget2/2 consumed,0 remaining

Both calls made only after mocked API/save/visual checks passed, using fixed non-sensitive example descriptions in a temporary loopback server process loading existing private config. No model inventory, transcript, retries, raw provider error or private workspace. Persisted receipt prevents script rerun: `live-receipt.json`; script `live.mjs`. Configuration unchanged.

| Call | Model | Elapsed | HTTP/category | Validated summary |
| --- | --- | --- | --- | --- |
|1 simple gardening presentation|gemini-3.5-flash-lite|8,320ms|200 / validated|3 actions,0 unknown estimates,2 assumptions,1 conflict;104 total action-title characters|
|2 moderate workshop preparation|gemini-3.5-flash-lite|19,404ms|200 / validated|6 actions,0 unknown estimates,2 assumptions,1 conflict;142 total action-title characters|

Two successes establish these two current transport/schema/conciseness checks only. The user's prior screenshot failure was NOT reproduced or historically diagnosed. Mocks distinguish possible categories; no quota-exhaustion story or broad speed/quality benchmark is claimed. Further live calls require fresh authorization.

## Captures and review

Exact before public snapshots were captured in an isolated static allowlist server (no API/provider): `before-{sample-activity,sample-saved,sample-focus}-{light,dark}-{1440,390}.png` at base. Current shared archive/calendar/theme/focus/busy: `visual-verified/`; current planner stage/secondary recovery/primary failed-save Retry: `planner/`; final combined captures under `final-verified/`. Earlier failed-run captures/logs remain distinguishable, not substituted for final results.

Inspected light390 archive (pale families/complete peak), dark1440 archive, dark390 real Focus (raised stable card/crescent), and current planner captures. Natural long proposals/details scroll; no claim every form fits one viewport. Full matrix includes desktop/phone/320/landscape and text-size equivalent, not physical hardware/browser zoom certification.

## Preview and stop

Use **http://127.0.0.1:52256/**, new identified Node process with current API module. Old52255/3000 left untouched; their loaded API modules may be stale even when static bytes update. Changing origin/port gives a separate browser-local store; no records migrated/deleted. Manual creation remains available on failure. No public hosting/API abuse-cost protections, final-origin checks, physical Safari/phone/OS dictation/sleep/BFCache, user visual/usefulness acceptance, owned-reference rehearsal, video URL or submission completed here. Stop for Codex independent review/user acceptance; no next feature or publication automatically.
