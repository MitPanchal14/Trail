# Latest judge-clarity revision — 25 October, after 21:29 IST

## What is accepted and what remains

User accepts the twelve-month calendar itself. Retain its month spacing, count rules, keyboard/date alternative, density and archive grid. Source implementation of Pass 2 never began, so fictional mode still lacks the populated year; that is an unfinished requirement, not a hidden feature or a calendar storage defect.

User rejects the long selected-day section above finished cards, the visible “Review actions & saved context” row, the lightning-like brand icon, unclear home positioning and identical gradients. These latest decisions supersede the corresponding earlier presentation requirements. Pass 1 technical review remains passed; its entire visual presentation is not accepted/frozen.

## Concrete design decisions

### Home: demonstrate returning to work

Replace the ambiguous slogan with this first-use hierarchy:

- Eyebrow: **Your productivity and focus companion**
- Headline: **Pick up where you left off.**
- Supporting text: **Plan a goal, focus on one action, and save exactly where to restart. Your next step stays ready when you come back.**
- Primary button: **Start working** (retain appropriate Continue/Review/New goal behaviour for actual returning records).
- Clear secondary entry/panel: **Try a ready-made demo**; **Return to saved work**, **Explore sample activity**, **Browse demo states**. Explain “Fictional examples. Your own work stays separate.”

Retain accepted typography/white space and the mountain as supporting goal progress, not the headline story. Put a realistic saved-place card beside/in front of the illustration, with explicit work labels: “Goal: Prepare the workshop update”, “Next move: Open the capacity table and compare the two room options.” Mark seeded content fictional; real return content comes from actual records. A small three-step line says “Plan → Focus → Save your place.” No animation or fabricated live data is necessary to explain the product.

Do not replace genuine returning-work cues with canned marketing. Judge/example entries stay accessible on home even when real goals exist. The ordinary fresh desktop viewport must show the category, benefit, primary action and demo access; inspect 1440×900 and 390×844, not only giant full-page images.

### Activity: details on demand, archive unmistakable

Keep the year and compact summary. Default selected-day display is one short line: date, count and **View actions**. The action list is collapsed on initial entry and remains collapsed on date selection unless the user explicitly opens it. Expansion must preserve full exact goal/action names, eight-at-a-time/native further disclosure as needed, empty-day feedback and accessible keyboard/date selection. Do not delete details to make the screen shorter.

Add a clear **Finished goals (N)** heading at the archive and a compact **Jump to finished goals** anchor near the calendar heading/stats, with keyboard/focus-safe navigation. Closing details restores compactness; changing selections cannot unexpectedly reopen a large list. Keep the calendar counting/help wording available in its existing disclosure. Do not introduce another modal for ordinary day selection.

### Finished cards: remove the review row, retain records

Remove “Review actions & saved context” and its inline disclosure from each card. Keep title, priority label, action count/effort, completion date and guarded Reopen goal. Make the goal title an accessible **View completed work** control opening a concise read-only detail dialog, containing the complete definition, actions, notes, saved times and safe links. No information is deleted or made dependent on reopening/editing a goal. Use an obvious focus/hover treatment and accessible name to reveal that the title opens details.

Dialog requires a labelled title, reachable Close, Escape, natural long-content scrolling and focus return to its invoker; it must not conflict with existing review/reward dialogs or replay rewards. Viewing history is presentation-only and works read-only/pending without hiding storage errors or mutating canonical records. Existing Reopen guard/identity/effort remains intact. The user asked to remove clutter, not erase saved work.

### Branding

Replace the lightning-like glyph with a small original two-peak mountain mark: simple blue/violet strokes, restrained teal accent if legible. Preserve “Trail.” wordmark/spacing and theme contrast; update the inline favicon to match. No external images/fonts/library or new asset needed. The logo supports identity; explicit productivity wording handles category clarity.

### Priority and card colour

Add optional **goal-level Priority** on create/edit: **Low / Normal / Important**, default Normal. A goal is the archive card's unit, so do not create independent per-action priorities in this pass. A missing field in existing records means Normal. Explain “Changes the label and card colour; action order stays yours.” No urgency scoring, deadlines, reminder or sorting behaviour is implied.

| Priority | Stored value | Card family | Visible cue |
| --- | --- | --- | --- |
| Low | low | Deep teal / blue | Low |
| Normal | normal | Indigo / violet | Normal |
| Important | important | Deep plum / restrained warm amber | Important |

Use family-specific dark gradients/white or verified contrasting text; tune actual colour values against both themes rather than blindly applying hex values. Keep the accepted outline mountain and compact sizing. Colour must not be the only priority cue. Do not use alarming red or random hues. Completion count stays a numeric label and heatmap intensity, never a proxy for importance or task difficulty.

Priority is real persisted product data, not a CSS-only convenience. Optional schema-v1 extension must validate values, preserve older records and omitted-command edits, retain draft/Save/Cancel/exact Retry behaviour and survive reload, finish/Undo/reopen/refinish. No reset/migration that discards old records. Existing records honestly remain Normal; only clearly fictional samples use varied seeded priorities.

### Fictional examples and parity

Deliver the previously agreed visible homepage demo entries and eight useful states from DEMO_REFINEMENT_REPORT.md Pass 2. At least six realistic finished sample goals, varied priorities and dates across all twelve visible months. Include all five heatmap tiers, gaps and meaningful exact per-day tasks. Use deterministic in-memory fixtures, not randomness or fake real IndexedDB records.

Share the calendar model and presentation/control boundaries where feasible; do not copy a divergent second calendar. Preserve a single runnable runtime. Reuse modules or small shared exports within the eight existing assets; no second engine or storage backend. Keep visible Fictional example labels, reset/Real work exit and exact safeguards for real drafts/running/pending work. No auto-starting focus on opening a preview. Clearly label simulated recovery states; do not present sample content as actual observation or activity capture.

## Execution order

One next OpenCode brief, with tested milestones: A) priority compatibility/model/form; B) home/logo and compact detail presentation/priority palettes; C) shared populated examples/discovery. Run focused checks after each, then full combined checks. Stop for independent and user visual review. If a milestone fails, correct it before moving on; do not conceal failing work behind screenshots.

Focus dark/motion remains a separate subsequent correction. No further badge system, AI, sync, audio, timers, external calendars, art generation, source publication/deployment/submission in this brief. After this scope and bounded Focus correction, freeze features and move to delivery.

Prepared documents are not implementation. Current baseline stays 35 Node tests plus independently passed year/archive, compact and activity gates; no new runtime test result is implied by this planning update.
