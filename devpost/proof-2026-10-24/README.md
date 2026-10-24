# Trail — Step 01 visual proof

One connected, isolated design hypothesis. **Fictional work, in memory only.** This is not the production app, approved product behaviour, real focus accounting or evidence of the learner's work.

## Latest — Task 01b visual experience

**Preview:** http://127.0.0.1:52254/ · **[Light/dark evidence gallery](evidence/visual-01b/index.html)** (served at http://127.0.0.1:52254/evidence/visual-01b/).

01b supersedes the earlier contour/layout proposal, not the verified 01a workflow. One new visual hypothesis: a luminous path crosses dimensional milestone surfaces; the same work appears on landing, Today and journey. Local system type, a quiet work stage, explicit Light/Dark controls, a centered Focus window with optional 30-second ambience, composed final review and a card-free screen-wide reward. **Not yet visually accepted.**

### Try it

1. First visit opens **Nail the Trail**. **Start working** enters the fictional saved action without starting time. **Trail Home** revisits landing. **Returning Today** in Preview state skips landing directly; scenario changes reset the example.
2. Choose Light/Dark. Theme is in memory, explicit, and resets to Light on reload; no storage or automatic OS-theme policy. Resume is separate and explicit.
3. Resume → Pause → save your next instruction and optional context → Resume → Complete → Undo. Exact saved wording/context and paused simulated remainder survive. Skip/blank instruction behaviour from 01a remains intact.
4. Select a step on Today or journey. Hover previews its marker/segment and context; keyboard focus/Enter and touch-style tap provide the same information. Selection is independent of the current work. Fixed example minutes do not grow with the timer. The daily view separates Friday’s earlier marker from today’s sessions; the whole-goal journey includes both days.
5. In Focus, **Switch to still** stops ambience without pausing time. **Enable ambience** restores it. Reduced motion is static from first paint. Long instruction/context scroll inside the work window, with timer/Pause/Complete outside that reading area.
6. Complete remaining steps → add a fifth → complete → Keep open/Escape or explicitly confirm. Confirmation alone earns the major reward. View finished work/Escape exits immediately; otherwise it settles after six seconds. Revisiting never repeats it.

### Demonstrated evidence

- **28 key-state screenshots:** landing, Today, Focus, journey, final review, achievement and finished collection in light/dark at actual **1280×720 and 390×844**. Gallery links full-resolution captures plus before/after examples and edge states.
- **42 named regression groups passed** in installed visible Chrome **155.0.8059.40** on macOS: F01–F05 across four theme/viewport combinations; long text/context, fifth step, blank/skip/punctuation, linked hover/keyboard/touch-style selection, keyboard/Escape, still/reduced motion, and measured zero horizontal overflow at 320/390/1024px. See [regressions.json](evidence/visual-01b/regressions.json).
- Actual browser recordings: [dark desktop Focus / still control](evidence/visual-01b/dark-desktop-focus-motion.webm), [light desktop finite achievement](evidence/visual-01b/light-desktop-achievement-motion.webm). These show short excerpts, not a full 30-second ambience cycle. [Motion/contrast/annotated audit results](evidence/visual-01b/motion-audit.json).
- Reading surfaces are opaque and do not inherit moving gradient contrast. Ten selected text/surface pairs measure **5.46:1 or better**; this is not complete WCAG certification. The audit’s remaining tiny-target flag is the intentionally clipped skip link before focus, not a visible 1px control. Actual focused skip link and keyboard outline remain available.
- [Final verification / exact inventory](evidence/visual-01b/verification.json): syntax, served resources, protected-file hashes and browser reports. Failed test-harness assumptions are retained and explained in `REVIEW.md`.

**Limits:** isolated fictional/in-memory work and fixed illustrative geometry/minutes. No production theme storage, creation/auth, persistence/recovery, real time accounting, providers, reminders or deployment. Phone is a browser viewport/touch emulation, not a physical device. No new Comet/personal-profile/hidden-tab/sleep/closure claim; internal navigation is not background-browser evidence. Independent review and learner approval remain pending. **Stop before production integration.**

## Task 01a — corrected proof, awaiting independent review

Historical correction-pass report below. The independent review subsequently verified F01–F05; 01b preserves and reruns them without declaring visual acceptance.

F01–F05 are addressed in this isolated proof; this is **not learner acceptance or production integration**. Latest evidence supersedes the original behavioural claims below: [correction review](REVIEW.md#task-01a--correction-results), [observed checks](evidence/corrections-01a/after.json), [pre-fix reproductions](evidence/corrections-01a/before.json). Preview remains **http://127.0.0.1:52254/**.

- Save a distinctive “When I’m back…” instruction: it becomes the primary text on Today and Focus; the original step is secondary. Context is separate and step-specific. Edit saved place is available on Today. Blank instruction retains the previous instruction; context can be cleared; Skip saves neither draft.
- Immediate Undo restores exact saved instruction/context, remaining simulated time and elapsed simulation at completion, with the clock **paused**. Resume is explicit. Beginning the next block or adding work ends the immediate-Undo opportunity. No production accounting exists.
- Ordinary Today/journey/finished navigation keeps running focus active. A labelled running/paused/ended strip returns to Focus; Pause is explicit. Expiry updates the strip without replacing another view. Extensions stay unfinished.
- Finish the remaining steps, add a fifth, complete it, Escape/Keep open, then confirm. Today, journey and finished collection agree; revisiting cannot replay the reward or ask to confirm again. No reopen feature was added.
- Fixed 45/70 minute illustrations remain labelled and do not change with simulation. Counts include added steps; historical comparison context is not rewritten by later notes.

Fresh checks: installed visible Chrome **155.0.8059.40** on macOS, isolated contexts at actual **1280×720 and 390×844**, 14 named check groups. Includes connected flows, blank/skip/long/punctuation/context, five-step lifecycle, keyboard/Escape, reduced motion, expiry/extensions, reload reset and protected-file checks. No console/page errors or external requests observed. Clock fast-forward tests are distinct from real time.

**Background limit:** a real second-page foreground attempt kept the countdown running and explicit Pause stopped it, but the proof reported `visibilityState: visible`; actual hidden-tab/background throttling is not established. The first overly strong hidden-state assertion failed and is retained in [attempt-1-visibility-limit.json](evidence/corrections-01a/attempt-1-visibility-limit.json). No new Comet, physical-device, sleep/closure, screen-reader or production validation claimed.

## Preview

The proof-only server was started at **http://127.0.0.1:52254/** and left running for review. It serves only this directory, not the repository or production application.

To serve it again from the repository root:

```sh
python3 -m http.server 52254 --bind 127.0.0.1 --directory devpost/proof-2026-10-24
```

If the port is occupied, use another free port; do not stop an unrelated process. No install/build is needed. Directly opening `index.html` is also possible, but the recorded checks used HTTP.

## Try the connected story

1. **Returning Today:** read the concrete action, saved context and Resume. Choose a block if useful.
2. **Resume focus:** countdown is simulated. Working in another tab does not intentionally pause it. Pause stops immediately; Complete step is separate.
3. **Pause:** optionally edit “When I'm back…” and expand context. Save makes that exact instruction primary on Today and Focus. Skip discards both drafts. Blank instruction retains the prior instruction; optional context may be cleared.
4. **Complete step:** a local tick appears and the next action becomes available. Undo remains available for 12 seconds before whole-goal confirmation.
5. **Complete the last step:** review offers Add another step, Keep goal open, or Confirm goal finished. Escape closes without confirming. Added steps become the next instruction.
6. **Confirm goal finished:** finite purple/blue/teal/peach colour reveal, two short messages, completed landmark; View finished work exits immediately. Otherwise it settles to a neutral page after six seconds. Reduced motion shows the final colour/message without animation.
7. **Goal journey:** select a record to inspect its fictional work context. **Reset example** restores the original story.

The top **Preview state** selector seeds Returning Today, Goal journey, Focus, Pause, Block ended, Final-step review, Finished work, First use and Long instruction. State selection resets the example; direct Finished work is a labelled review shortcut, not a completion trigger in the connected journey. +5/+10/+20 controls appear only in Block ended. Reload resets everything.

## Evidence and actual checks

The following are **original Step 01 results**, retained as history. Use the Task 01a evidence above for current corrections and limitations.

- Chrome **155.0.8059.40**, visible automated browser on macOS: 55 named check groups passed. Full connected flow at **1280×720** and **390×844**, plus 320×700, 1600×900 and 1280×600 Today checks.
- [Check results and layout measurements](evidence/checks.json); [selected contrast/resource checks](evidence/static-checks.json).
- [Today desktop](evidence/today-desktop.png), [Today phone](evidence/today-mobile.png), [Focus phone](evidence/focus-mobile.png), [Pause phone](evidence/pause-mobile.png), [review phone](evidence/final-review-mobile.png), [celebration phone](evidence/celebration-mobile.png), [finished phone](evidence/finished-mobile.png).
- [Actual Chrome transition recording](evidence/goal-completion-desktop.webm), [reduced-motion still](evidence/celebration-reduced-motion.png), [long-copy phone](evidence/long-mobile.png), [first-use phone](evidence/empty-mobile.png).
- JavaScript syntax passed `node --check devpost/proof-2026-10-24/proof.js`. Local HTML links resolve. Chrome observed no page/console errors, no external requests and no calls to instrumented storage methods.
- Additional Chrome checks observed a simulated countdown continuing with a second tab foregrounded, paused time staying unchanged, reload resetting the note and a visible keyboard outline: [secondary results](evidence/secondary-checks.json). That report also deliberately retains the subsequent **Comet failure**, rather than presenting an all-green result.
- Comet **155.0.8059.148**: desktop Resume/Pause/save and explicit-confirmation/manual-exit flow passed. Subsequent narrow screenshot timed out; a prior background-tab attempt returned to Today unexpectedly. [Partial Comet report](evidence/comet-checks.json). **No Comet mobile/background/reduced-motion parity claim.**

## Limits / proposed defaults

- Fixed illustrative relief geometry, not a generated or time-proportional renderer. Proposed mapping: minutes extend ribbon; completed actions illuminate checkpoints; explicit goal completion earns the arch. Adding a step changes the list/count, not the sculpted topology.
- 45 example minutes today, 70 across two days. These totals do not grow with the demo countdown. No real research results/scores or actual submission are asserted.
- All geometry, palette, block defaults, review actions, six-second lifecycle and notification/Undo treatments need review; none are approved production contracts.
- No goal-creation implementation in the first-use state, persistence, recovery, multi-tab ownership, AI, rankings, streak engine, floating window or reminders. No system permissions are requested.
- Phone checks are resized browser viewports, not physical-device testing. Reduced motion is browser-emulated. No screen-reader, complete WCAG audit, OS sleep/closure accounting, production regression or deployment verification was performed.

See [REVIEW.md](REVIEW.md) for rationale, state matrix, findings and exact file inventory. **Stop here for visual review; no runtime integration is authorized.**
