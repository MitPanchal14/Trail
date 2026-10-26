import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,mkdtemp,mkdir,cp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname,resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';
import {execFile} from 'node:child_process';
import {createVercelApi,trustedOrigin} from '../scripts/vercel-ai.mjs';

const run=promisify(execFile),root=fileURLToPath(new URL('../',import.meta.url));
const origin='https://trail-adapter-test.vercel.app',key='SYNTHETIC_ONLY_VERCEL_SENTINEL_62483',model='synthetic-model';
const input={description:'Prepare a workshop',deadlineText:'Friday',availableMinutes:10};
const proposal={title:'Workshop',definition:'A reviewed outline',actions:[{title:'Draft outline',estimatedMinutes:null}],assumptions:[],conflicts:[]};
const output=(value=proposal)=>new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(value)}]}}]}));
const request=(path='/api/plan',init={})=>new Request(origin+path,{method:'POST',headers:{host:new URL(origin).host,origin,'content-type':'application/json'},body:JSON.stringify(input),...init});
const statusRequest=()=>request('/api/ai-status',{method:'GET',body:undefined});
const api=options=>createVercelApi({origin,key,model,...options});

test('Vercel Web Request bridges raw bytes to unchanged planner and exposes only capability',async()=>{
  let calls=0;const handler=api({fetchImpl:async(url,init)=>{calls++;assert.equal(url,`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`);assert.equal(init.headers['x-goog-api-key'],key);assert.equal(init.redirect,'error');const body=JSON.parse(init.body);assert.deepEqual(JSON.parse(body.contents[0].parts[0].text),input);assert.equal(body.generationConfig.maxOutputTokens,8192);assert.equal(body.tools,undefined);return output();}});
  assert.deepEqual(await(await handler(statusRequest())).json(),{enabled:true});assert.equal(calls,0);
  assert.deepEqual(await(await handler(request('/api/ai-status',{method:'GET',body:undefined,headers:{host:new URL(origin).host}}))).json(),{enabled:true});
  const response=await handler(request());assert.equal(response.status,200);assert.deepEqual(await response.json(),{proposal});assert.equal(calls,1);assert.equal(response.headers.get('cache-control'),'no-store');assert.equal(response.headers.get('x-content-type-options'),'nosniff');assert.equal(response.headers.get('access-control-allow-origin'),null);
});

test('hosted origin must be explicit canonical HTTPS DNS; missing key/model/origin disables safely',async()=>{
  assert.equal(trustedOrigin(origin),origin);
  const invalid=[undefined,'',' https://trail.test','https://trail.test/','http://trail.test','https://user:pass@trail.test','https://trail.test:443','https://trail.test:123','https://trail.test/path','https://trail.test?x=1','https://trail.test#hash','https://localhost','https://trail.localhost','https://127.0.0.1','https://[::1]','https://TRAIL.test','https://*.vercel.app','not an origin'];
  for(const value of invalid)assert.equal(trustedOrigin(value),null);
  let calls=0;
  for(const missing of [{key:''},{model:''},{model:'bad/model'},...invalid.map(origin=>({origin:origin??''}))]){
    const handler=api({...missing,fetchImpl:async()=>{calls++;return output();}});
    assert.deepEqual(await(await handler(statusRequest())).json(),{enabled:false});const response=await handler(request());assert.equal(response.status,503);const body=await response.text();assert.ok(!body.includes(key));assert.match(body,/unconfigured/);
  }assert.equal(calls,0);
});

test('hosted Host/POST Origin/type/method guards never trust URL or forwarded headers',async()=>{
  let calls=0;const handler=api({fetchImpl:async()=>{calls++;return output();}});
  for(const headers of [{host:'evil.test',origin},{host:new URL(origin).host},{host:new URL(origin).host,origin:'null'},{host:new URL(origin).host,origin:'https://preview.vercel.app'},{host:'evil.test',origin,'x-forwarded-host':new URL(origin).host,'x-forwarded-proto':'https'}]){
    const response=await handler(request('/api/plan',{headers:{'content-type':'application/json',...headers}}));assert.equal(response.status,403);
  }
  for(const method of ['GET','HEAD','PUT','DELETE','OPTIONS'])assert.equal((await handler(request('/api/plan',{method,body:['GET','HEAD'].includes(method)?undefined:JSON.stringify(input)}))).status,405);
  assert.equal((await handler(request('/api/ai-status'))).status,405);
  for(const content of ['text/plain','application/x-www-form-urlencoded','application/json; charset=latin1',''])assert.equal((await handler(request('/api/plan',{headers:{host:new URL(origin).host,origin,'content-type':content}}))).status,415);
  assert.equal((await handler(request('/api/plan',{body:'{'}))).status,400);
  assert.equal((await handler(request('/api/plan',{body:JSON.stringify({...input,extra:'not allowed'})}))).status,400);assert.equal(calls,0);
});

test('raw Web stream limits count wire bytes, not parsed objects or misleading content-length',async()=>{
  let calls=0;const handler=api({fetchImpl:async()=>{calls++;return output();}});
  // This is valid small JSON after parsing but oversized on the wire.
  assert.equal((await handler(request('/api/plan',{body:' '.repeat(32768)+JSON.stringify(input)}))).status,413);
  const bytes=new TextEncoder().encode('猫'.repeat(11000));assert.ok(bytes.length>32768);
  const body=new ReadableStream({start(c){for(let i=0;i<bytes.length;i+=1024)c.enqueue(bytes.slice(i,i+1024));c.close();}});
  assert.equal((await handler(request('/api/plan',{body,duplex:'half',headers:{host:new URL(origin).host,origin,'content-type':'application/json','content-length':'1'}}))).status,413);
  const consumed=request();await consumed.json();assert.equal((await handler(consumed)).status,400);assert.equal(calls,0);
  const locked=request(),reader=locked.body.getReader();assert.equal((await handler(locked)).status,400);reader.releaseLock();
  const exact=' '.repeat(32768-Buffer.byteLength(JSON.stringify(input)))+JSON.stringify(input);assert.equal((await handler(request('/api/plan',{body:exact}))).status,200);assert.equal(calls,1);
});

test('hosted sanitized failures, strict output, timeout and disconnect preserve existing categories',async()=>{
  for(const [make,status,code] of [
    [()=>new Response(key,{status:429}),429,'provider_limit'],[()=>new Response(key,{status:403}),502,'upstream_unavailable'],
    [()=>{throw Error(key);},502,'upstream_unavailable'],[()=>output({...proposal,title:key}),502,'invalid_output'],
    [()=>new Response('{'),502,'invalid_output'],[()=>output({...proposal,actions:[]}),502,'invalid_output'],
    [()=>new Response('x'.repeat(129*1024)),502,'invalid_output']
  ]){
    const response=await api({fetchImpl:async()=>make()})(request());assert.equal(response.status,status);const text=await response.text();assert.equal(JSON.parse(text).code,code);assert.ok(!text.includes(key));assert.ok(!text.includes('stack'));assert.ok(!text.includes('x-goog'));
  }
  let aborted=false;const timed=api({textTimeout:15,fetchImpl:async(_,init)=>new Promise((_,reject)=>init.signal.addEventListener('abort',()=>{aborted=true;reject(Error('synthetic abort'));}))});
  const response=await timed(request());assert.equal(response.status,504);assert.equal((await response.json()).code,'timeout');assert.equal(aborted,true);
  let begin;const started=new Promise(r=>begin=r),controller=new AbortController();aborted=false;
  const pending=api({fetchImpl:async(_,init)=>{begin();return new Promise((_,reject)=>init.signal.addEventListener('abort',()=>{aborted=true;reject(Error('synthetic abort'));}));}})(request('/api/plan',{signal:controller.signal}));
  await started;controller.abort();assert.equal((await pending).status,499);assert.equal(aborted,true);
});

test('hosted body stalls time out and cancel the stream; warm limits are retained, not global',async()=>{
  let cancelled=false;const body=new ReadableStream({cancel(){cancelled=true;}});
  const response=await api({textTimeout:15,fetchImpl:async()=>{throw Error('must not call');}})(request('/api/plan',{body,duplex:'half'}));assert.equal(response.status,504);await new Promise(r=>setImmediate(r));assert.equal(cancelled,true);
  let time=0;const handler=api({now:()=>time,fetchImpl:async()=>output()});for(let i=0;i<5;i++)assert.equal((await handler(request('/api/plan',{headers:{host:new URL(origin).host,origin,'content-type':'application/json','x-forwarded-for':`192.0.2.${i}`}}))).status,200);
  assert.equal((await handler(request())).status,429);time=600001;assert.equal((await handler(request())).status,200);
  // A second warm instance has separate state: this is not a distributed limiter.
  assert.equal((await api({fetchImpl:async()=>output()})(request())).status,200);
  let release,begin,count=0;const started=new Promise(r=>begin=r),held=new Promise(r=>release=r),concurrent=api({fetchImpl:async()=>{if(++count===2)begin();await held;return output();}});const a=concurrent(request()),b=concurrent(request());await started;assert.equal((await concurrent(request())).status,429);release();assert.equal((await a).status,200);assert.equal((await b).status,200);
});

test('Vercel has exactly two functions and never exposes transcription, server sources or catchall',async()=>{
  const names=await readdir(new URL('../api/',import.meta.url));assert.deepEqual(names.sort(),['ai-status.mjs','plan.mjs']);const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
  assert.equal(config.framework,null);assert.equal(config.outputDirectory,'dist');assert.equal(config.buildCommand,'npm run build');assert.equal(config.installCommand,'');assert.equal(config.rewrites,undefined);assert.equal(config.routes,undefined);assert.equal(config.env,undefined);assert.equal(config.build,undefined);
  const fn=config.functions['api/*.mjs'];assert.equal(fn.maxDuration,40);assert.equal(fn.supportsCancellation,true);
  for(const path of ['/api/transcribe','/api/transcribe/','/scripts/ai.mjs','/.env.local','/tests/vercel.test.mjs'])assert.equal((await api({fetchImpl:async()=>{throw Error('must not call');}})(request(path))).status,404);
});

test('deployment upload allowlist, minimal executable function package and sentinel-free nine-file build',async()=>{
  const scratch=await mkdtemp(join(tmpdir(),'trail-vercel-package-'));
  try{
    const config=JSON.parse(await readFile(join(root,'vercel.json'),'utf8')),ignore=await readFile(join(root,'.vercelignore'),'utf8'),lines=ignore.split('\n').filter(s=>s&&!s.startsWith('#'));
    assert.equal(lines[0],'/*');for(const dir of ['api','scripts','demo']){assert.ok(lines.includes(`!/${dir}/`));assert.ok(lines.includes(`/${dir}/*`));}
    const uploaded=lines.filter(s=>s.startsWith('!/')&&!s.endsWith('/')).map(s=>s.slice(2));
    const assets=['index.html','styles.css','proof.js','work.js','state.js','storage.js','timing.js','activity.js','planner.js'];
    const expected=['package.json','vercel.json','.vercelignore','api/plan.mjs','api/ai-status.mjs','scripts/build.mjs','scripts/ai.mjs','scripts/vercel-ai.mjs',...assets.map(f=>'demo/'+f)];assert.deepEqual(uploaded.sort(),expected.sort());
    assert.ok(!uploaded.some(f=>/\.env|\.zip|node_modules|tests\/|devpost\/|docs\//.test(f)));
    for(const f of uploaded){await mkdir(dirname(join(scratch,f)),{recursive:true});await cp(join(root,f),join(scratch,f));}
    const fn=config.functions['api/*.mjs'],included=fn.includeFiles.slice(1,-1).split(',');assert.deepEqual(included,['scripts/vercel-ai.mjs','scripts/ai.mjs','demo/planner.js']);assert.match(fn.excludeFiles,/\.env\*/);assert.match(fn.excludeFiles,/\.zip/);
    // Resolve the actual static import closure and execute it in an isolated
    // package, not against dependencies accidentally present in root.
    const packaged=join(scratch,'isolated-function');const closure=new Set();
    async function trace(file){if(closure.has(file))return;closure.add(file);const text=await readFile(join(root,file),'utf8');for(const match of text.matchAll(/import\s+(?:[^'";]+\s+from\s+)?['"]([^'"]+)['"]/g)){if(match[1].startsWith('node:'))continue;assert.ok(match[1].startsWith('.'),'No undeclared runtime dependency');await trace(relative(root,resolve(root,dirname(file),match[1])));}}
    await trace('api/plan.mjs');assert.deepEqual([...closure].sort(),['api/plan.mjs',...included].sort());
    await trace('api/ai-status.mjs');assert.deepEqual([...closure].sort(),['api/plan.mjs','api/ai-status.mjs',...included].sort());
    for(const f of ['package.json',...closure]){await mkdir(dirname(join(packaged,f)),{recursive:true});await cp(join(root,f),join(packaged,f));}
    await run(process.execPath,['--input-type=module','-e',`globalThis.fetch=async()=>new Response(JSON.stringify(${JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(proposal)}]}}]})}));const {default:entry}=await import('./api/plan.mjs');const r=await entry.fetch(new Request('${origin}/api/plan',{method:'POST',headers:{host:'${new URL(origin).host}',origin:'${origin}','content-type':'application/json'},body:JSON.stringify(${JSON.stringify(input)})}));if(r.status!==200||(await r.json()).proposal.title!=='Workshop')throw Error('Isolated package failed');const {default:status}=await import('./api/ai-status.mjs');const s=await status.fetch(new Request('${origin}/api/ai-status',{headers:{host:'${new URL(origin).host}'}}));if(s.status!==200||(await s.json()).enabled!==true)throw Error('Isolated status failed');`],{cwd:packaged,env:{...process.env,TRAIL_PUBLIC_ORIGIN:origin,GEMINI_API_KEY:key,GEMINI_MODEL:model}});
    await run('npm',['run','build'],{cwd:scratch,env:{...process.env,GEMINI_API_KEY:key,GEMINI_MODEL:model,TRAIL_PUBLIC_ORIGIN:origin}});
    assert.deepEqual((await readdir(join(scratch,'dist'))).sort(),assets.sort());for(const file of assets){const built=await readFile(join(scratch,'dist',file));assert.deepEqual(built,await readFile(join(root,'demo',file)));assert.ok(!built.toString().includes(key));assert.ok(!built.toString().includes(origin));}
    assert.equal(JSON.parse(await readFile(join(root,'package.json'),'utf8')).engines.node,'24.x');assert.ok((await readFile(join(root,'.gitignore'),'utf8')).split('\n').includes('.env*'));
  }finally{await rm(scratch,{recursive:true,force:true});}
});
