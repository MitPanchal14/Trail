# Deployment preflight — prepared, not authorized or executed

25 October 2026. No host/account/domain was selected, no hosting configuration was created, no paid service chosen and nothing was deployed. Current source is the local `codex/cloud-completion` diff over verified `041fe89ac9b27d91973f39b9505d39e0e64ce998`. The remote implementation branch is `codex/trail-redesign`; default `main` is an older source and must not be used accidentally.

## Inspected build and access

- `npm run build` produces **`/workspace/Trail/dist/`**, containing exactly `index.html`, `styles.css`, `proof.js`, `work.js`, `state.js`, `storage.js`, `timing.js`. Relative asset imports make subpath hosting possible; navigation stays in the page. No backend/build dependency/package install is needed.
- `scripts/serve.mjs` is a local verification server, not a hosting platform. It binds 127.0.0.1, allows GET/HEAD for seven assets and rejects private/unknown paths. Its loopback URL is not reachable on the user's Mac as a cloud preview.
- No active GitHub Actions/Pages, Netlify, Vercel or other deployment config was found in the inspected tracked snapshot. A historical external deployment cannot be inferred from that absence.
- Read-only GitHub connector metadata reports `MitPanchal14/Trail` **private**, default branch **main**, no detected license. There is no root license file in this snapshot. Public source and a license decision need the user; do not change visibility or add a license silently.

## Concrete publication path for approval

One suitable static path is **GitHub Pages from the reviewed working-branch build**, after the user authorizes the source checkpoint, public repository access and Pages hosting. This is a proposed path, not a choice made for the user. If the user has an existing different static host, upload the same seven-file `dist/` output there instead.

1. User reviews the patch and chooses marker/fallback. In their full checkout fetch `origin/codex/trail-redesign`, verify required ancestry, apply/check the cloud patch, and run the documented gates. Authorize and create a new source checkpoint on the working branch. Do not merge or change main as part of deployment.
2. User confirms source visibility/license/history disclosure and authorizes any visibility change. Confirm Pages is available for their repository/account without buying a plan. Required access: repository settings/Pages management, ability to publish a workflow and approve its environment. Cloud task has not exercised any of these permissions.
3. In repository Settings→Pages choose GitHub Actions. Prepare/review a manual `workflow_dispatch` workflow on the working branch. Check out that reviewed ref, use Node 20+, run `npm run check`, `npm test`, `npm run build`, upload `dist` as the Pages artifact, then deploy it in the GitHub Pages environment. Deployment job needs Pages write and OIDC token permissions; no application secret or API key is required. Do not add a push trigger or publish source root by accident. Pin/verify action versions when implementing; no workflow has been added here.
4. User authorizes the manual deployment of the exact reviewed commit. Record that SHA and the actual Pages URL returned by the deployment. Never invent a URL from the repo name; settings/custom domains may differ.
5. Run the post-deploy checks below at that returned URL while signed out. Only then describe it as judge-accessible. Keep the app/source freely accessible for judging as required by the official rules.

The public source link should lead judges to the actual final branch/commit and instructions. Devpost's Try it out field needs the public repository link per its published update; provide a hosted app link separately where the live form permits. No authenticated submission form was inspected by this task.

## Final-origin checks

- [ ] HTTPS loads without certificate/security warnings. In that browser `window.isSecureContext`, IndexedDB and `navigator.locks` are available. An insecure LAN URL is not equivalent to localhost's secure-browser treatment.
- [ ] Exactly the expected seven runtime assets load successfully with correct MIME types; inspect network/console for failed module imports. Test a subpath if using Pages. No API keys, private profiles, machine paths, notes or test artifacts in the published directory.
- [ ] Unknown/private paths do not serve repository files. Generic static hosts may serve an index fallback rather than the local server's404; ensure they cannot expose source-private paths and module loading still works.
- [ ] New isolated profile starts fresh with no real records and explicitly illustrative no-goal art. The optional fictional mode remains labelled and separate. Do not clear anyone's existing records to simulate freshness.
- [ ] Create a three-action goal; Start/Pause/save useful place/link; reload/close/reopen; observe correct notes, stopped timing and explicit Resume. Open work leaves timing unchanged.
- [ ] Complete/Undo/recomplete; all checked opens review; explicit finish creates history. Reload/navigation/selection/history never replay travel/reward. Correct/reopen an earlier action with later actions still checked.
- [ ] Failed-write behavior remains honest where safely testable in an isolated profile. Two-tab Web Lock ownership/read-only recovery works on the final origin.
- [ ] Light/dark desktop and 390px controls/labels/focus/overflow look correct; Off/reduced motion and Off mid-travel settle correctly. Then perform actual Chrome/Mac/phone checks separately.
- [ ] Confirm source link and hosted app open without authentication from a signed-out browser. Record public video URL, duration and access separately. No deployed-success claim until this is done.

Storage is browser-and-origin local. Existing localhost/another port/cloud-preview records do not automatically migrate. Deploying static assets does not transfer saved work, add sync or guarantee persistent storage. No import/reset/migration tool was added.

## Release decisions still open

User visual acceptance/freeze; source checkpoint/public visibility; license and third-party notice choices; confirmed Skill Pack usage/project history; host authorization/final-origin verification; physical supported-browser checks; public recording and final submission review. See SUBMISSION_DRAFT.md for verified official requirements and the form update. This document grants no publication authorization.
