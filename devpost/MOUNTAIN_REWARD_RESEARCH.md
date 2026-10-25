# Mountain reward research — 25 October 2026

Research/design recommendation only. No runtime changes or implementation dispatch by this pass.

## User decision

The user likes the current mountain silhouette, depth and overall visual direction. Preserve them. The request is a more satisfying sense of progress and completion, informed by web research. Earlier reviewer suggestions to replace the flat terrain are not the user's preference. Written layout remains accepted. Streaks and sound are still unimplemented proposals.

## What the sources support

- [Duolingo's milestone design account](https://blog.duolingo.com/streak-milestone-design-animation/) describes understandable milestone imagery, deliberate animation timing and stronger celebrations for milestone achievements. This is a company account, not independent evidence for Trail.
- [Duolingo's streak account](https://blog.duolingo.com/how-duolingo-streak-builds-habit/) reports a retention increase after animation changes. Its metric is product-specific and must not be reused as an expected Trail effect.
- [Forest's official product](https://www.forestapp.cc/) connects focus sessions to a persistent virtual forest. Useful design inspiration: work leaves an artifact. Its claims and mechanisms do not verify Trail's attention tracking or efficacy.
- [Sailer et al., 2017 experiment](https://doi.org/10.1016/j.chb.2016.12.033) reports different motivational effects from different game elements; gamification is not inherently effective. Publisher abstract was accessible via search; full DOI fetch returned 403. No result is treated as a validated Trail outcome.
- [Elliot's colour review, 2015](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00368/full) treats colour effects as dependent on context and methodological limits. It does not supply a universal app palette that guarantees motivation or dopamine release.

## Proposed Trail design — our inference, not a research result

Use a calm mountain with a clear, deterministic response to real saved outcomes. Keep response time short and work pace user-controlled. A reward based on fastest checkbox completion would incentivize clicks rather than meaningful work.

| Moment | Feedback | Persistent result |
| --- | --- | --- |
| Save a place | Quiet saved confirmation; current marker becomes a saved-place cue | Exact next move/context/reference; no earned ascent |
| Complete action | After commit, briefly trace that action's newly earned segment; marker resolves into a tick; a few local sparks fade | Checked marker and coloured segment remain |
| All checked | Clear Ready for review state | Goal stays open until confirmation |
| Confirm goal finished | Brief summit halo/flag reveal, coordinated with the existing compact reward | Finished mountain remains in history |
| Return/reload/Undo/reopen | Immediately show the correct state; no replayed celebration | Existing canonical records remain authoritative |

Colour roles are design choices using the existing palette, not biological claims:

- Mountain/remaining trail: current calm neutral surfaces and subdued route.
- Current/saved place: existing violet `#7849df` with a clear ring and label.
- Earned trail: existing cyan `#75d7dc` through blue `#4167ec`.
- Confirmed summit: a restrained warm peach accent such as `#f7b49d`, tested against both themes. Reserve it for the major moment.
- Pair colour with tick, shape and text. Increase mobile label readability without redrawing the mountain.

Suggested action response budget: roughly 450–650ms, tuning the existing 650ms ring rather than stacking another long sequence on top. This is a prototype timing target. Never delay controls while it plays. Keep effects finite, respect motion Off/reduced motion, and do not show success before transaction completion. No camera swoops, flashing background or replay on navigation.

Optional later enhancement: one short completion chime with a separate Sound toggle, initially off. Background motion must not become a misleading audio control. Sound is supplementary; the full outcome remains readable silently.

Finished history already contains mountains: improve the feeling that these are kept accomplishments before building a new collectible system. A productive-day calendar/streak can follow separately after timezone, qualifying work, Undo/recompletion and missed-day rules are agreed. Avoid rewarding repeated Undo/recomplete cycles with cumulative points; no points economy is needed.

## Next bounded scope recommendation

After agreement: preserve the accepted mountain; coordinate earned-path/marker feedback, summit celebration, mobile labels and colour roles. No terrain redesign, streak implementation, new backend or schema. Fix the three reproduced return-edge issues in the separately tracked correction pass before delivery; visual delight must not hide those failures.

Validate with a few real tasks: can users explain what changed, distinguish Save from Complete and Review from Finish, and still feel the feedback is pleasant after repeated actions? Check silent/reduced-motion modes and actual mobile presentation. Record observations, including annoyance; make no dopamine, productivity or retention claim from this small usability check.
