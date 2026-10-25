import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(new URL('dist/', root), { recursive: true });
for (const file of ['index.html', 'styles.css', 'proof.js', 'work.js', 'state.js', 'storage.js', 'timing.js']) {
  await cp(new URL(`demo/${file}`, root), new URL(`dist/${file}`, root));
}
console.log(`Built static demo: ${fileURLToPath(new URL('dist/', root))}`);
