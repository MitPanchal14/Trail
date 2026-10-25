# Trail — current delivery checklist

Updated 25 October 2026. This replaces the accumulated historical checklist. Historical plans/results remain in their evidence files and Git history. Checked implementation items are not claims of user satisfaction, physical-device verification or deployment.

## Current checkpoint and decisions

- [x] Mountain/rewards checkpoint `3081396` committed and pushed to `codex/trail-redesign`; remote verified during the publication turn. Main was unchanged. No newer remote claim is implied by this checklist update.
- [x] User accepts the written layout and current mountain silhouette/depth. Preserve them.
- [x] User reviewed checkpoint/summit rewards and found them too similar to an ordinary visualization. Visual interaction is NOT accepted/frozen.
- [x] Research and discuss stronger visual feedback; candidate is one travelling expedition marker with a paused campsite. This is proposed, not implemented or visually accepted.
- [x] Reconcile remaining work and prepare the next bounded task: [OPENCODE_RETURN_FIXES.md](OPENCODE_RETURN_FIXES.md).

## Built and verified

- [x] One dependency-free runtime; historical Next.js/pixel app removed. Fictional example isolated from real records.
- [x] Manual goal/actions, explicit Save/Cancel and drafts preserved across in-app mode changes.
- [x] Real home CTAs and saved next-move/fallback content derived from actual records.
- [x] Focus Start/Pause/Extend, conservative recorded effort and explicit Resume after interruption/reload.
- [x] Browser-local transactional storage, exclusive writer ownership, preserved-data errors and exact Retry.
- [x] Saved next move/context, optional validated work link, saved time, pause drafts and keyboard save.
- [x] Complete action, limited durable Undo, all-checked review, explicit goal finish, real history and guarded reopening.
- [x] Shared theme-aligned mountain reflects actual checked IDs/current/selection; handles 1/2/5/30 actions and noncontiguous outcomes.
- [x] Identity-scoped checkpoint feedback, single visible summit reward, clearer mobile captions, motion cancellation and no replay.
- [x] Latest independent checks: syntax, 22 Node tests, build, diff and focused return-fixes Chromium gate passed; earlier mountain/reward gates also independently passed. Implementation evidence records the final full combined suite.

Evidence: [DAY_BUILD_EVIDENCE.md](DAY_BUILD_EVIDENCE.md), [RETURN_EXPERIENCE_EVIDENCE.md](RETURN_EXPERIENCE_EVIDENCE.md), [MOUNTAIN_EVIDENCE.md](MOUNTAIN_EVIDENCE.md), [MOUNTAIN_REWARDS_EVIDENCE.md](MOUNTAIN_REWARDS_EVIDENCE.md). Tests do not establish product value or a winning submission.

## Reliability corrections — independently reviewed

- [x] Protect actions containing any saved context/link record from removal in UI AND canonical transition, even without timer history; accessible explanation and untouched-action removal verified.
- [x] Bound long Today next-move/context presentation with full native expansion; maximum-text phone controls remain within 844px of action-area top; complete canonical/edit/Undo/history text retained.
- [x] Clear only discarded/matching form validation after Skip/Cancel/input, without hiding storage failures, pending Retry or stopped-timing feedback.
- [x] Regressions reproduced failures before fixes; syntax, 22 Node tests, build, diff and full combined Chromium suite passed. Fresh evidence: [RETURN_FIXES_EVIDENCE.md](RETURN_FIXES_EVIDENCE.md).
- [x] Independent diff review, syntax, 22 tests, build, diff check and isolated Chromium return-fixes gate passed. Checked phone collapsed/protected-editor captures; no new blocking finding. Full combined suite is implementation evidence, not independently rerun in this review. Exact original findings: [RETURN_EDGE_REVIEW_2026-10-25.md](RETURN_EDGE_REVIEW_2026-10-25.md).

## Then — one bounded visual experiment

- [ ] Specify one completion transition: expedition marker follows the earned segment to the next unfinished checkpoint; paused campsite represents a saved place. Resolve final-action review/confirmed summit and reopened earlier actions before implementation.
- [ ] Prototype within the current mountain; no external asset-pack hunt, terrain redesign or second runnable UI. Target 45–60 minutes including focused checks; this is an estimate, not a guarantee.
- [ ] User tries it and decides whether it communicates a journey and feels satisfying. Keep the current simpler version if the experiment is not worth the cost.
- [ ] Verify commit-before-feedback, failure/Retry, Undo/navigation mid-motion, reduced motion/Off and no replay.
- [ ] Freeze visual/features after that decision. No further cosmetic loop at the expense of delivery.

The visual experiment is next in the proposed sequence, not part of the current bug-fix dispatch. Do not start multiple implementation editors or bundle deferred features into either pass.

## Required demo and delivery work

- [ ] Observe a real create → work → save place → leave → return → Open work → explicit Resume → finish flow. Record confusion/failures without inventing productivity gains.
- [ ] Check primary Chrome/Mac sleep/wake/background behaviour; record actual limits. Check a phone layout/device where available. Comet/other browsers are secondary to primary-browser delivery.
- [ ] Rehearse the exact judge-facing story on the final build, including fresh/no-goal state and realistic saved-place content. Keep fictional seed content labelled and isolated.
- [ ] Freeze a reviewable build and save a GitHub checkpoint when authorized; preserve main unless explicitly requested otherwise.
- [ ] Select hosting, authorize deployment, deploy and verify public judge access, asset loading and the complete core flow on the final origin. Local records do not automatically move between origins.
- [ ] Record a concise product-first video and prepare submission copy/screenshots/repository documentation. Verify the current event requirements before submission.
- [ ] Align all claims with implemented/tested behaviour and disclose local-only storage and remaining background/device limits.
- [ ] User reviews final submission materials and submits/authorizes submission.

Working target remains a demo ready around 17:00–18:00 IST on 25 October, with 19:00 as the user's latest desired prototype finish, leaving submission preparation time. Check actual remaining time before starting another scope; these targets do not assert hours remaining or the event deadline.

## Deferred beyond the current delivery scope

These are product ideas, not unfinished requirements that all have to ship today. Reconsider only after the core demo and delivery work are secure.

- Productive-day calendar/streaks: agree timezone, qualifying work, missed-day/grace and Undo/recompletion rules first. Earlier three-missed-day rule is a proposal, not implemented behaviour.
- Optional completion sound with a separate explicit toggle. Background motion currently has no audio.
- Importance/neglect recommendations and closed-site reminders with verified delivery/quiet hours.
- Floating focus/PiP window and browser fallback.
- Optional editable AI planning with manual fallback.
- Sync/accounts, automatic activity capture and richer multi-goal features.
- Daily effort-to-route mapping. Current mountain maps action states; height/distance are illustrative and not measured productivity.

Update this checklist after each bounded result. Keep implementation, user acceptance, source publication, deployment and submission distinct. The current task authorizes documentation and a bug-fix dispatch; it does not authorize a new push/deployment/submission.
