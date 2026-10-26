import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createApi } from './ai.mjs';
const root = new URL('../demo/', import.meta.url);
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/proof.js', ['proof.js', 'text/javascript; charset=utf-8']],
  ...['work.js','state.js','storage.js','timing.js','activity.js','planner.js'].map(file=>['/'+file,[file,'text/javascript; charset=utf-8']]),
]);
export async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
  }
  const asset = assets.get((req.url || '/').split('?')[0]);
  if (!asset) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const body = await readFile(new URL(asset[0], root));
    res.writeHead(200, { 'Content-Type': asset[1], 'Cache-Control': 'no-store', 'Content-Length': body.length });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(500); res.end('Unable to load demo'); }
}
export function createHandler(options={}){
  const api=createApi(options);
  return async(req,res)=>{if(!await api(req,res))await handler(req,res);};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Imports, tests and builds never load private configuration.
  try{if(typeof process.loadEnvFile==='function')process.loadEnvFile(new URL('../.env.local',import.meta.url));}
  catch(error){if(error.code!=='ENOENT')console.error('Local AI configuration could not be loaded. Manual creation remains available.');}
  const portIndex = process.argv.indexOf('--port');
  const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Choose a valid port');
  const server = http.createServer(createHandler({origin:`http://127.0.0.1:${port}`}));
  server.requestTimeout=50000;server.headersTimeout=10000;
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Trail demo: http://127.0.0.1:${port}/`));
}
