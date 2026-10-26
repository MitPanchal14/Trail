import test from 'node:test';
import assert from 'node:assert/strict';
import {createRecording,plannerState} from '../demo/planner.js';
function harness(options={}){
  const s=plannerState(),track={readyState:'live',stop(){this.readyState='ended';}},stream={getTracks:()=>[track]};let active,interval,time=0;
  class Recorder{static isTypeSupported(){return true;}constructor(_,o){active=this;this.mimeType=o.mimeType;this.state='inactive';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['synthetic'],{type:this.mimeType})});this.onstop?.();}}
  const r=createRecording({state:()=>s,allowed:()=>true,changed:()=>{},media:()=>({getUserMedia:async()=>stream}),Recorder:()=>Recorder,every:fn=>{interval=fn;return 1;},clear:()=>{interval=null;},now:()=>time,...options});
  return {s,r,track,get active(){return active;},advance:ms=>{time=ms;interval?.();}};
}
test('record is explicit; stop prepares only, transcribe is separate, no source mutation, discard ends tracks',async()=>{
  let calls=0;const h=harness({transport:async(_,init)=>{calls++;const v=JSON.parse(init.body);assert.equal(v.mimeType,'audio/webm;codecs=opus');assert.equal(atob(v.audio),'synthetic');return new Response(JSON.stringify({transcript:'A faithful synthetic fixture.'}));}});h.s.description='Keep typed text';assert.equal(calls,0);await h.r.click('record');assert.equal(h.s.recordPhase,'recording');await h.r.click('stop');assert.equal(h.track.readyState,'ended');assert.equal(h.s.recordPhase,'ready');assert.equal(calls,0);await h.r.click('transcribe');assert.equal(calls,1);assert.equal(h.s.description,'Keep typed text');assert.equal(h.s.transcript,'A faithful synthetic fixture.');await h.r.click('discard-audio');assert.equal(h.s.recordPhase,'idle');await h.r.click('transcribe');assert.equal(calls,1);
});
test('late permission, denied/no capability, recorder failure and size/duration cap always release media',async()=>{
  let grant;const lateTrack={stop(){this.stopped=true;}};const h=harness({media:()=>({getUserMedia:()=>new Promise(r=>grant=r)})});const waiting=h.r.click('record');h.r.cancel();grant({getTracks:()=>[lateTrack]});await waiting;assert.equal(lateTrack.stopped,true);assert.equal(h.s.recordPhase,'idle');
  for(const options of [{media:()=>({getUserMedia:async()=>{throw Error('denied');}})},{Recorder:()=>undefined}]){const h=harness(options);await h.r.click('record');assert.equal(h.s.recordPhase,'idle');assert.match(h.s.message,/unavailable|compatible/);}
  for(const mode of ['error','size','cancel','duration']){const h=harness();await h.r.click('record');if(mode==='error')h.active.onerror();if(mode==='size')h.active.ondataavailable({data:new Blob([new Uint8Array(2*1024*1024+1)])});if(mode==='cancel')h.r.cancel();if(mode==='duration')h.advance(61000);assert.equal(h.track.readyState,'ended');assert.equal(h.s.recordPhase,mode==='duration'?'ready':'idle');}
});
test('empty speech, transport errors, late callbacks and cancellation never overwrite source or revive recording',async()=>{
  for(const response of [()=>new Response(JSON.stringify({transcript:''})),()=>new Response('bad'),()=>new Response('{}',{status:500})]){const h=harness({transport:async()=>response()});h.s.description='Typed';await h.r.click('record');await h.r.click('stop');await h.r.click('transcribe');assert.equal(h.s.description,'Typed');assert.equal(h.track.readyState,'ended');assert.match(h.s.message,/No clear speech|failed/);}
  let done;const h=harness({transport:()=>new Promise(r=>done=r)});await h.r.click('record');await h.r.click('stop');const wait=h.r.click('transcribe');await new Promise(r=>setImmediate(r));h.r.cancel();done(new Response(JSON.stringify({transcript:'Late'})));await wait;assert.equal(h.s.transcript,null);assert.equal(h.s.recordPhase,'idle');
});
