import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {readFile,readdir} from 'node:fs/promises';
import {createHandler} from '../scripts/serve.mjs';
import {validatePlanInput,validateAudioInput} from '../scripts/ai.mjs';
import {validateProposal,estimatedSummary} from '../demo/planner.js';
const sentinel='FAKE_SENTINEL_ONLY_NOT_A_REAL_CREDENTIAL_82741';
export const proposal={title:'Prepare a workshop',definition:'A reviewed outline is ready.',actions:[{title:'Choose the audience',estimatedMinutes:5},{title:'Draft the outline',estimatedMinutes:null}],assumptions:['Audience not yet confirmed.'],conflicts:[]};
const input={description:'Prepare a workshop',deadlineText:'Friday',availableMinutes:10};
test('audio strict canonical base64/MIME/decoded/body bounds and transcript-only provider contract',async()=>{
  const input={mimeType:'audio/webm;codecs=opus',audio:Buffer.from('synthetic').toString('base64')};assert.deepEqual(validateAudioInput(input),input);
  for(const v of [{...input,mimeType:'audio/mp4'}, {...input,audio:''},{...input,audio:'ZA='},{...input,audio:'Zh=='},{...input,audio:'x'.repeat(2796208)},{...input,extra:1}])assert.throws(()=>validateAudioInput(v));
  let calls=0;await server({fetchImpl:async(_,init)=>{calls++;const b=JSON.parse(init.body);assert.deepEqual(b.contents[0].parts[1],{inlineData:{mimeType:input.mimeType,data:input.audio}});assert.match(b.systemInstruction.parts[0].text,/empty transcript for silence/);return output({transcript:''});}},async({base})=>{
    const call=body=>fetch(base+'/api/transcribe',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(body)});let r=await call(input);assert.equal(r.status,200);assert.deepEqual(await r.json(),{transcript:''});assert.equal((await call({...input,audio:'bad'})).status,400);assert.equal((await call({...input,audio:'x'.repeat(3*1024*1024)})).status,413);assert.equal(calls,1);
  });
});
const output=(v=proposal,finishReason='STOP')=>new Response(JSON.stringify({candidates:[{finishReason,content:{parts:[{text:JSON.stringify(v)}]}}]}));
async function server(options,fn){const s=http.createServer(createHandler({key:sentinel,model:'fake-model',...options}));await new Promise(r=>s.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${s.address().port}`;const call=(body=input,init={})=>fetch(base+'/api/plan',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify(body),...init});try{await fn({base,call,s});}finally{s.closeAllConnections();await new Promise(r=>s.close(r));}}
test('strict independent plan/proposal schemas and deterministic incomplete estimates',()=>{
  assert.deepEqual(validatePlanInput(input),input);assert.deepEqual(validateProposal(proposal),proposal);
  for(const v of [null,{}, {...input,extra:1},{...input,description:''},{...input,description:'a'.repeat(6001)},{...input,availableMinutes:0},{...input,availableMinutes:1.5},{...input,deadlineText:'a'.repeat(161)}])assert.throws(()=>validatePlanInput(v));
  for(const v of [null,{...proposal,extra:1},{...proposal,actions:[]},{...proposal,actions:Array(13).fill(proposal.actions[0])},{...proposal,title:' '},{...proposal,actions:[{title:'x',estimatedMinutes:1441}]},{...proposal,actions:[{title:'x',estimatedMinutes:undefined}]},{...proposal,conflicts:Array(4).fill('x')}])assert.throws(()=>validateProposal(v));
  assert.match(estimatedSummary(proposal.actions,2),/5 estimated min.*1 unknown.*incomplete.*Over estimated budget/);
});
test('same-origin fixed provider header/body, no private data, only capability status, static/private isolation',async()=>{
  let calls=0;await server({fetchImpl:async(url,init)=>{calls++;assert.equal(url,'https://generativelanguage.googleapis.com/v1beta/models/fake-model:generateContent');assert.equal(init.headers['x-goog-api-key'],sentinel);assert.equal(init.redirect,'error');const b=JSON.parse(init.body);assert.deepEqual(JSON.parse(b.contents[0].parts[0].text),input);assert.equal(b.tools,undefined);return output();}},async({base,call})=>{
    const r=await call();assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');assert.deepEqual(await r.json(),{proposal});
    assert.deepEqual(await(await fetch(base+'/api/ai-status')).json(),{enabled:true});
    for(const p of ['/scripts/ai.mjs','/.env.local','/.env','/tests/ai.test.mjs','/%2e%2e/.env.local'])assert.equal((await fetch(base+p)).status,404);
    for(const p of ['/','/work.js','/planner.js'])assert.ok(!(await(await fetch(base+p)).text()).includes(sentinel));assert.equal((await fetch(base+'/',{method:'POST'})).status,405);assert.equal((await fetch(base+'/api/plan')).status,405);
    for(const file of await readdir(new URL('../demo/',import.meta.url)))assert.ok(!(await readFile(new URL(`../demo/${file}`,import.meta.url),'utf8')).includes(sentinel));
    assert.equal(calls,1);
  });
});
test('rejected input, raw chunked bounds, origin/Host/type never invoke Google',async()=>{
  let calls=0;await server({fetchImpl:async()=>{calls++;return output();}},async({base,call})=>{
    for(const body of [{...input,tools:[]},null,{}, {...input,availableMinutes:'1'}])assert.equal((await call(body)).status,400);
    assert.equal((await call(input,{body:'{'})).status,400);
    assert.equal((await call(input,{headers:{'Content-Type':'text/plain',Origin:base}})).status,415);
    for(const origin of ['http://evil.test','null',''])assert.equal((await call(input,{headers:{'Content-Type':'application/json',Origin:origin}})).status,403);
    const hostStatus=await new Promise((resolve,reject)=>{const r=http.request(base+'/api/plan',{method:'POST',headers:{Host:'evil.test',Origin:base,'Content-Type':'application/json'}},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});r.on('error',reject);r.end(JSON.stringify(input));});assert.equal(hostStatus,403);
    const stream=new ReadableStream({start(c){for(let i=0;i<40;i++)c.enqueue(new TextEncoder().encode('x'.repeat(1024)));c.close();}});
    assert.equal((await call(input,{body:stream,duplex:'half'})).status,413);assert.equal(calls,0);
  });
});
test('missing configuration and every upstream failure are sanitized, including escaped credential echoes',async()=>{
  await server({key:''},async({call})=>assert.equal((await call()).status,503));
  const cases=[()=>new Response(sentinel,{status:403}),()=>new Response(sentinel,{status:429}),()=>new Response('{'),()=>output(proposal,'MAX_TOKENS'),()=>new Response(JSON.stringify({promptFeedback:{blockReason:'SAFETY'}})),()=>output({...proposal,title:sentinel}),()=>new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({...proposal,title:sentinel})}]}}]}).replaceAll('FAKE','\\u0046AKE')),()=>output({...proposal,actions:[]}),()=>new Response('x'.repeat(130*1024)),()=>{throw Error(sentinel);}];
  for(const make of cases)await server({fetchImpl:async()=>make()},async({call})=>{const r=await call();assert.ok(r.status>=400);const t=await r.text();assert.ok(!t.includes(sentinel));assert.ok(!t.includes('stack'));assert.ok(!t.includes('x-goog'));});
});
test('bounded concurrency, rate expiry and timeout/disconnect propagate cancellation',async()=>{
  let time=0;await server({now:()=>time,fetchImpl:async()=>output()},async({call})=>{for(let i=0;i<5;i++)assert.equal((await call()).status,200);assert.equal((await call()).status,429);time=600001;assert.equal((await call()).status,200);});
  let release;const held=new Promise(r=>release=r);await server({fetchImpl:async()=>{await held;return output();}},async({call})=>{const a=call(),b=call();await new Promise(r=>setTimeout(r,40));assert.equal((await call()).status,429);release();assert.equal((await a).status,200);assert.equal((await b).status,200);});
  let aborted=false;await server({textTimeout:25,fetchImpl:async(_,init)=>new Promise((_,reject)=>init.signal.addEventListener('abort',()=>{aborted=true;reject(Error('abort'));}))},async({call})=>{assert.equal((await call()).status,504);assert.equal(aborted,true);});
  let disconnected;const notified=new Promise(r=>disconnected=r);await server({fetchImpl:async(_,init)=>new Promise((_,reject)=>init.signal.addEventListener('abort',()=>{disconnected();reject(Error('abort'));}))},async({call})=>{const c=new AbortController(),r=call(input,{signal:c.signal});setTimeout(()=>c.abort(),40);await assert.rejects(r);await notified;});
});
