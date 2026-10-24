import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { handler } from '../scripts/serve.mjs';
async function request(url, method = 'GET') {
  let status, headers, body;
  await handler({url, method}, {writeHead(s, h) {status=s; headers=h;}, end(b) {body=b;}});
  return {status, headers, body};
}
test('all public assets serve the exact demo bytes', async () => {
  for (const file of ['index.html', 'styles.css', 'proof.js']) {
    const result = await request('/' + file);
    assert.equal(result.status, 200);
    assert.deepEqual(result.body, await readFile(new URL('../demo/' + file, import.meta.url)));
  }
  assert.equal((await request('/?demo=1')).status, 200);
});
test('private paths, traversal and unknown paths are inaccessible', async () => {
  for (const path of ['/.env.local', '/../package.json', '/%2e%2e/package.json', '/package.json', '/missing']) {
    assert.equal((await request(path)).status, 404);
  }
});
test('HEAD has no body; writes are rejected', async () => {
  assert.equal((await request('/', 'HEAD')).body, undefined);
  assert.equal((await request('/', 'POST')).status, 405);
});
test('build output exactly matches the three runtime files', async () => {
  execFileSync(process.execPath, ['scripts/build.mjs'], {cwd: new URL('../', import.meta.url)});
  for (const file of ['index.html', 'styles.css', 'proof.js']) {
    assert.deepEqual(await readFile(new URL('../dist/' + file, import.meta.url)), await readFile(new URL('../demo/' + file, import.meta.url)));
  }
});
