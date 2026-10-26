# Remove Background motion On/Off control

User explicitly requested removal of the field. [Pre-edit plan](REMOVE_MOTION_CONTROL_PLAN.md). Local uncommitted change; no publication.

- Removed the visible control from fictional Focus in `demo/proof.js` and the real Focus placeholder in `demo/work.js`. Shared label updater, click handlers and unused mobile `.ambience-control` style removed. No hidden replacement control.
- Retained the existing calm decorative background. System reduced-motion preference now stops/clears motion and restores ordinary ambience when the preference is removed. No animation redesign or new setting.
- Updated browser tests to assert no control and exercise system reduced motion instead. State-invariance, motion cleanup, stationary-card and real/example checks retained.
- Kept the separate local AI error-category correction intact. State/storage/timing/activity, Gemini model/prompt/limits/configuration, Vercel adapter/build/config/package and private configuration untouched.

## Verification

- Syntax checks for application and changed browser modules,64 Node tests, nine-file build and `git diff --check`: passed.
- Nine source/build assets match exactly. Protected state/storage/timing/activity/adapter/local-server/build/config/package comparison to HEAD: unchanged.
- Real/example light/dark Focus visual gate passes movement/stationary geometry,320/390/844/1440 layouts, no motion control, system reduced-motion stop/restore and44px targets. Inspected real-light and fictional-dark390px captures.
- Every retained Chromium regression group passed across the combined run and continuation: final visuals, capture, A/B/C/edges, planner, corrections, return, travelling, mountain, rewards, return fixes, end-block, final demo, compact archive, note removal, activity/year, priority, clarity, examples, handoff and Focus surface. This was not one uninterrupted successful run. First attempt caught the additional real Focus placeholder; it was removed before the main rerun. The rewards test then needed to keep the reduced-motion preference active through its last completion, instead of assuming the removed toggle's sticky Off state; that test was corrected without changing application code. Rewards and all remaining groups were then rerun successfully, including the final Focus matrix. No timing/storage/domain change.

Captures: `/private/tmp/trail-motion-control-regression/`. All browser records synthetic/isolated. Local test server has key/model explicitly empty; planning tests mock responses. No live Gemini request, credential access, actual user-record write, branch switch, commit, push or deployment. Hosted UI remains unchanged until authorized publication. Physical-device acceptance remains separate.
