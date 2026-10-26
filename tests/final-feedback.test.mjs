import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createHandler} from '../scripts/serve.mjs';
import {planErrors} from '../demo/planner.js';
const input={description:'Write a short outline',deadlineText:'',availableMinutes:null};
const sentinel='FINAL_FAKE_SECRET_NOT_A_KEY';
async function server(options,run){const s=http.createServer(createHandler({key:sentinel,model:'fake-model',...options}));await new Promise(r=>s.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${s.address().port}`;try{await run(async(body=input)=>{const r=await fetch(base+'/api/plan',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:r.status,...await r.json()};});}finally{s.closeAllConnections();await new Promise(r=>s.close(r));}}
test('fixed safe planning categories distinguish limits, timeout, config, input and unusable outputs',async()=>{
 const cases=[['unconfigured',503,{key:''}],['provider_limit',429,{fetchImpl:async()=>new Response(sentinel,{status:429})}],['upstream_unavailable',502,{fetchImpl:async()=>new Response(sentinel,{status:503})}],['upstream_unavailable',502,{fetchImpl:async()=>{throw Error(sentinel);}}],['invalid_output',502,{fetchImpl:async()=>new Response(JSON.stringify({candidates:[{finishReason:'MAX_TOKENS'}]}))}],['invalid_output',502,{fetchImpl:async()=>new Response('{')}],['timeout',504,{textTimeout:10,fetchImpl:async()=>new Promise(()=>{})}]];
 for(const [code,status,options] of cases)await server(options,async call=>{const result=await call();assert.deepEqual(result,{status,code,error:planErrors[code]});assert.ok(!JSON.stringify(result).includes(sentinel));});
 await server({},async call=>assert.deepEqual(await call({}),{status:400,code:'invalid_input',error:planErrors.invalid_input}));
 let release;const held=new Promise(r=>release=r);await server({fetchImpl:async()=>{await held;return new Response('{}');}},async call=>{const a=call(),b=call();await new Promise(r=>setTimeout(r,30));assert.deepEqual(await call(),{status:429,code:'local_limit',error:planErrors.local_limit});release();await Promise.all([a,b]);});
});
