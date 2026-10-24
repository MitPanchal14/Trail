# Trail — completed cleanup record

October 24, 2026. Authorized by the learner: “remove the files that are not needed according to the md file and doc which you feel like is not relavant to the new demo,” followed by “continue.”

## Result

Removed **76 files**, totalling **2,365,903 bytes** before compression: 34 historical top-level briefs, rejected study files/assets in four directories, and `devpost/ui-preview.html`. The four now-empty study directory trees were removed as well. Of the selected files, 25 are tracked deletions and 51 were previously untracked. No Git staging, commit or push was performed.

Preserved the entire application, tests, scripts, package/configuration files, credentials/private files, active skills, current product/design plans, seven new Stripe/Linear reference images, prior approved planning baselines, October 23 strategic research and standalone `devpost/evidence/`. The old mountain renderer and styles still have active callers and remain until replacement. Files inside removed study folders were archived with their study, including their local images; standalone evidence remains in the repo.

## Temporary recovery archive

Archive: `/private/tmp/trail-pre-cleanup-2026-10-24-6hhqmhda/removed-files-and-docs.tar.gz`

Archive SHA-256: `e8afd95bbb30d7e74b865a809c95910203d5f76debb2b0c0a7f406ba20a05da6`

Manifest: `/private/tmp/trail-pre-cleanup-2026-10-24-6hhqmhda/manifest.json`

Every selected file was checked byte-for-byte against its archive member before deletion. The archive also holds before-edit copies of the retained documentation changed during cleanup. It is outside the repository, under temporary storage, and is not a durable backup or part of Git. Copy it elsewhere if long-term recovery matters. Recover only desired exact paths into a separate review location first; do not blindly overwrite new work with the archive.

## Verification

Follow-up review before the GitHub checkpoint: **no required current-demo file needs restoration**. All 76 archive members were rechecked; fresh 78 unit tests, lint/typecheck, isolated webpack build and 35 focused production browser checks passed. See [GITHUB_BASELINE_REVIEW.md](GITHUB_BASELINE_REVIEW.md) for exact scope and limitations. Earlier “no tests run” statements below describe the original cleanup turn only.

- All 76 selected paths are absent, and the four study directory trees are removed.
- All 80 application/test/script fingerprints match the pre-cleanup baseline.
- All seven new reference images and all 128 standalone evidence files remain.
- Checked 93 local Markdown/HTML references: no newly broken links. Three incoming links to removed briefs were redirected to this receipt.
- Five already-broken links remain in archived `previous-approved-prd.html` / `previous-approved-spec.html` snapshots; these predate cleanup and do not affect the current app or active reading path.
- Recovery archive SHA-256 still matches the verified pre-deletion archive.
- Documentation `git diff --check` passed. No app build or runtime tests are claimed: no application/test/script files were edited or selected for removal.

## Removed files

These paths intentionally no longer exist. Hashes preserve the exact deleted versions, including untracked work.

| Removed path | Bytes | SHA-256 |
|---|---:|---|
| `devpost/ai-demo-deployment-proposal-2026-10-18.md` | 4834 | `917ca89b4a6c115d0a25eac2bdfc21347323e1a32bbef325f4f6133f5a578581` |
| `devpost/ai-readiness-plan-2026-10-18.md` | 712 | `849745a1747c2224a18322ff00955127203f75a4f72e0ea8bcf5a30b869ff33e` |
| `devpost/backup-restore-opencode-2026-10-19.md` | 4757 | `6233734385606b9f10e9ef85dbb5a4a5653e6bd3a89d63d23e9ab78000761046` |
| `devpost/backup-restore-plan-2026-10-19.md` | 1389 | `069d1af0a91280a8d59284cdb8b5478632bea36cae1e9fa874bbbfcc6bffaea7` |
| `devpost/code-review-2026-10-17.md` | 5280 | `5595d06355b0f13c37cdd289d798ef6d1e74d4626a4e8c78574e328d79d70454` |
| `devpost/continuation-ux-2026-10-18.md` | 1039 | `c02abb06e7528158cf6c224b00b0fa4612f689d9451b6a3392ebe5cb7e9062c6` |
| `devpost/deployment-readiness-opencode-2026-10-19.md` | 3427 | `2b9aa9d6f49869058dcce86e1516d4f5fe8c5b87ddd29b17aef2a804ca1879db` |
| `devpost/deployment-readiness-plan-2026-10-19.md` | 2690 | `c9ee793e99a5d0b9f186419f0bbbc5a0d69213ac87b9b61d986f085b493efca1` |
| `devpost/design-lab/desktop.jpg` | 108607 | `d4fd1b5719c81c95201e823acba55899b26d14af0117c6a3966921d37da326fc` |
| `devpost/design-lab/index.html` | 37018 | `f686983f60a3a2a0d8f62258f06d304268a3bfcec28122156943ddd6ff323021` |
| `devpost/design-lab/mobile.jpg` | 41466 | `f3b08595e35e5f8bd684055eddb3256683a58d1f55420eff986b2c43cf8c1e57` |
| `devpost/design-lab/research.md` | 6151 | `543d5b1575a0725141ffe17d1c3d3b45501bf1acd21848780f397f61283a89bf` |
| `devpost/design-proof-2026-10-21/asset-provenance.json` | 572 | `aac2963f94aed2ae2cfa2e0e66b784d58e859eb72ba22ec892adca4a77f08606` |
| `devpost/design-proof-2026-10-21/build-proof.mjs` | 4536 | `ae578e746ce1ba11ef2f70a3ab2b201995618fdac95dca905e32add99f16cc95` |
| `devpost/design-proof-2026-10-21/design-decision.md` | 10969 | `5869be874d96fb54c8a205ce9db992f34b22b376a34aa6a75249a684a35b341a` |
| `devpost/design-proof-2026-10-21/fixture.json` | 7065 | `b587deb975b2435855ea7e7426105b85341cf40f4f03f689257e350d8d6f577e` |
| `devpost/design-proof-2026-10-21/frames.html` | 2505 | `3f08788a6149e96e9ef3bcd4c31574bb6dbd58a2b7c55bd024e52afc49c67054` |
| `devpost/design-proof-2026-10-21/frames/completed-desktop.png` | 153314 | `c7c9f561c52c84e98b143022d4ce2b9af954e9b75b51135d1a116fc76244a23e` |
| `devpost/design-proof-2026-10-21/frames/completed-mobile.png` | 96034 | `fe63402a9358487250f66ea873efb6c7fcdd74564e10efac427a5abd1c1da919` |
| `devpost/design-proof-2026-10-21/frames/measurements.json` | 3652 | `ce8ed3f8365304a3de4d6e9a7ccc9d8279395db46d229162a2fe810b7d18b911` |
| `devpost/design-proof-2026-10-21/frames/narrow-checks.json` | 777 | `7c3268fd90cd79351219d8fa1c2ea6390ed3b5931daa032a7fa86a9ce15d7e95` |
| `devpost/design-proof-2026-10-21/frames/returning-desktop.png` | 162724 | `39a0fb1b865252cfafd609d4b3e33c6b8aef27b9bf7bbc18fc2fe128805af1c9` |
| `devpost/design-proof-2026-10-21/frames/returning-mobile.png` | 97374 | `18ad65dc2a217d0110cbec3894bdc82039313a2acbcbe77faccf4ee17cecc2d4` |
| `devpost/design-proof-2026-10-21/index.html` | 4389 | `3ed57904ef7f17b2500a9427c10a84aab1702542efb592c7dadb54a657a45113` |
| `devpost/design-proof-2026-10-21/preservation-check.json` | 260 | `26e153102a62594efadd9381260eed3e0b93d532d16b04d4797eef11140cb0a5` |
| `devpost/design-proof-2026-10-21/proof.css` | 9469 | `87efd4e74680eedd4a159009445d3225820ddbf4baf5b14fe87007bc7087d652` |
| `devpost/design-proof-2026-10-21/proof.mjs` | 3661 | `ff2930b252c88b3da7a5ba2c050ad8889e85f31b29af8fd861f89f6fb2a00be6` |
| `devpost/design-proof-2026-10-21/references.html` | 2237 | `ec86b7bec67672b26d59edcb8ba1748a431fa180a7935e31fb31914b6892f2f9` |
| `devpost/design-proof-2026-10-21/references/habitica-home.png` | 124168 | `940bbfd639190efde931fb3e827dcc39cd36081908fe557361463135a5d25db7` |
| `devpost/design-proof-2026-10-21/references/habitica-reward.png` | 105289 | `df2dfaafdaf4771b1b4b901cec3084077d018642b5bb7f61b88f95a7eb3a5a4f` |
| `devpost/design-proof-2026-10-21/references/habitica-task-columns.png` | 46236 | `467181ad76544f0f073ff5d6547d3e2b26cb9748a683856ca814afa61a349aec` |
| `devpost/design-proof-2026-10-21/references/habitica-task-world.png` | 18739 | `5d6fc14abc696b52555e4372791b9730add7160902dd5b0c5735246093e68832` |
| `devpost/design-proof-2026-10-21/references/linear-my-issues.png` | 413065 | `1870b029f51aacd69a53737debb4297aba379b15a8bb9ae5c3a8cc1042e4c810` |
| `devpost/design-proof-2026-10-21/references/reference-strip.png` | 191901 | `cd14f9c0a4109d26c39b28c68286998769e39c58b08ec8f735b09caa0f059c1b` |
| `devpost/design-proof-2026-10-21/render-proof.mjs` | 4444 | `7fe44f10ba8c4249327cb63415dd3d413cf238321d117070f2d2d106b58b33d3` |
| `devpost/design-proof-2026-10-21/terrain.mjs` | 9552 | `b231508e3c5ddfa21e19eeea0c0a5bb388c326bbb79d10e1d2199e19745a0181` |
| `devpost/design-proof-review-2026-10-21.md` | 7926 | `be1c1ccf99d6df4acf50e10f70a6d1ac37b512ef8519916b81949a19c88cee01` |
| `devpost/four-day-direction-2026-10-20.md` | 6896 | `fa04f0063fd71fc39a2645bd43354d32784a5f4ea0bdacc24ee4c3ab6383bfa4` |
| `devpost/handoff-review.md` | 6157 | `04cf3deabddff6bb075e4a8e51ffe2bcb7d3f2d9259c8d51adccf79933599246` |
| `devpost/live-fixes-2026-10-18.md` | 3037 | `d81b6341078ef699c64eec5d234625814e19c006da8ba36a6f0044543651946a` |
| `devpost/mountains-opencode-2026-10-18.md` | 6703 | `f0e5d203f867c31ab3c6662d682deece8343d5fd9f1f3e1e8e54487c703963b3` |
| `devpost/mountains-plan-2026-10-18.md` | 1074 | `c9fa4b13413eabd534433a88c8d7e1dd2f9ccb50749c1b9137f6fbb2c59ae446` |
| `devpost/next-chat-hackathon-review-2026-10-20.md` | 8841 | `1d7f5170317b4d212af96d74610511f76a696301840af99d1cac619ba21ebfc6` |
| `devpost/opencode-continuation-fix.md` | 8063 | `4994d45183220d6219b43a9fd28202c39e8f82d7ada87e1832d3fa4969c485c1` |
| `devpost/opencode-design-contract-2026-10-21.md` | 10973 | `aacd986d023006b3f5fa2dc9e520aca86cff112b256e57d16df0ba848147919c` |
| `devpost/opencode-diagnosis-2026-10-21.md` | 19379 | `c6f8e4ac8653479aab8e3e8dd3ed1ebdc7d7ce320d3efb3c8c8592a6a621beb5` |
| `devpost/product-reset-2026-10-20.md` | 8174 | `e4cf5dd2ca9210d56c7b55e69ff37eaeb2764f205f8526859969dea85e535239` |
| `devpost/product-reset/directions.html` | 10230 | `a0a7318e52c49b2bb694dfd5c69777e3581175e10d2e91ecd9b9b9ca1f0618f3` |
| `devpost/progress-heatmap-plan-2026-10-19.md` | 838 | `9fbb1a1c4d80a3dea9363970685adbfdc351850438c2113b401d0a43b3682f78` |
| `devpost/progress-opencode-2026-10-18.md` | 7866 | `6b31464a5e205df388cd7ca538e450672fbb2061ea7452fe3bc16f18f979357b` |
| `devpost/progress-plan-2026-10-18.md` | 1082 | `4b7e57cd1b4692ec3281df3dedfa0a06bc0b4f9510f3635a1ec13d8f55af685d` |
| `devpost/progress-simplification-opencode-2026-10-18.md` | 5809 | `69021e69479a54584cb36e7c46f46350d41550b96b0991995b6500c85e75d697` |
| `devpost/progress-simplification-plan-2026-10-18.md` | 1079 | `0205394d011cc440ffebcb48db6db3bdb99a9d907147031b94c66249ead52348` |
| `devpost/progress-update-plan-2026-10-20.md` | 6055 | `f5ff5b960191d3045d7ae4159b8a6ee9137faa55aaca02ac07a96af00c41c3a6` |
| `devpost/restart-report-2026-10-18.md` | 9993 | `17b080cdd465504b3906486e0f1f012ba7854b07163a078836e1ac8b3db5577f` |
| `devpost/today-build-2026-10-21.md` | 10135 | `f39024e8116d43f7fd36b9ba5d76d4c9ff47136d6fee1e8b60543df77974bf1e` |
| `devpost/today-correction-plan-2026-10-20.md` | 10027 | `c9f3b0fa85d929432b2bb95c2f245720e77ec1892a353ff507c9156e77a70753` |
| `devpost/today-experience-correction-brief-2026-10-20.md` | 26808 | `0c1aa9c7ebcbdf17a8c4d536a53e32fd536a5c66f804803b3e32ab7fa8384a85` |
| `devpost/today-redesign-plan-2026-10-20.md` | 9300 | `6808903f614e227493b73d47585171773210dfae2174df27e3890fd78c53a6c6` |
| `devpost/ui-preview.html` | 10493 | `56ab779f99eb0f0706b65360475c7901e158664786c9ca21f843385bbb0cc198` |
| `devpost/ui-review-2026-10-18.md` | 10832 | `44db3b4e084aece1a358008a5b7575a158bdc3c2060bcdcb44fddfdf12f4e7d3` |
| `devpost/ui-ux-audit-2026-10-16.md` | 6654 | `4807abfde8369aa962929fb7feb2b44f2375c1217a04c2d7cba6448eb04b2c57` |
| `devpost/undo-planner-opencode-2026-10-18.md` | 7442 | `126303cd33c1efd2a2bc59bc924adce600bd89a7dc5b11b1cd51b68e147bd631` |
| `devpost/undo-planner-plan-2026-10-18.md` | 941 | `cf23b1bed9570b4ebd6d39312e8d179ac2bdd6ac24943dc741065ffc232c11b2` |
| `devpost/voice-return/README.md` | 2555 | `831ec88c2dc186de306d152e0f725aa7a0b4cd887f8f595cab07bb911d73a690` |
| `devpost/voice-return/evidence/current-preview.png` | 58339 | `cbb02e629405988ccc89dcf782d18704d3a215ff8d18c18d7e5e44d871eae8a4` |
| `devpost/voice-return/evidence/desktop-1440.png` | 80699 | `8496c071e9b9e995fe68e5fd9a6db67644f4c3a026e7744f9ffac749e55056bd` |
| `devpost/voice-return/evidence/desktop-completed.png` | 74174 | `627ba93a67c9b65bcb0357030676c28a7dd950b4a2b659f5cad30bf7d300b769` |
| `devpost/voice-return/evidence/desktop-review.png` | 38317 | `3eee9cbb0e7ca859e3560e9237179f5514002667981fbe0699ae55d510b709ae` |
| `devpost/voice-return/evidence/desktop.png` | 76838 | `b0f2f34b7af1065befb6e7ad42e05030f00b5f5f481b32f36b67c0eb6f4e3535` |
| `devpost/voice-return/evidence/mobile-review.png` | 26902 | `f3ac0455bea9277c7ecc9e896469789bc5e959956c3299b4f079ecae29d7f9c3` |
| `devpost/voice-return/evidence/mobile.png` | 46349 | `d970c178186bafe92846b4c84239f75a0c2aed24dd78edb4b7c1da6cd13e2ed3` |
| `devpost/voice-return/index.html` | 9696 | `f24f1d28e6883deb9052c7ee1698b41842b3808f1598b887dd37deec3df4cec0` |
| `devpost/voice-return/study.css` | 20961 | `51ec10f7c49235eac5d4f7ffde823b399717de3a13aae5ceaccf7d68b07fb011` |
| `devpost/voice-return/study.js` | 8334 | `3d5af16ffa2a1bb7dbbcdc7948c828ab74d89eae11b5006d764e113399ceaf1b` |
| `devpost/voice-return/terrain-study.js` | 9630 | `92738e73af648380a771467006ae778de35d4805523fdce952dc2a467139cff6` |

## Repaired documentation links

- `README.md`: historical link `devpost/today-correction-plan-2026-10-20.md` now points to this cleanup record.
- `devpost/evidence/today-correction-2026-10-21/README.md`: historical link `../../today-correction-plan-2026-10-20.md` now points to this cleanup record.
- `devpost/evidence/today-redesign-2026-10-20/README.md`: historical link `../../today-redesign-plan-2026-10-20.md` now points to this cleanup record.

Historical plain-text path mentions remain in old HANDOFF sections and archived approved plans. They are dated provenance, not available files or active build instructions.
