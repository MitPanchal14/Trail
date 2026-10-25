import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyWorkspace,transition,validate,activeSession,effort,normalizeResourceUrl} from '../demo/state.js';
let sequence=0;
const cmd=(type,fields={})=>({id:`test-${++sequence}`,type,...fields});
const run=(w,type,fields={})=>transition(w,cmd(type,fields),10000);
function setup(){const w=emptyWorkspace();w.ownerToken='owner';return run(w,'save-goal',{goalId:null,title:'Real goal',definition:'Done means tested.',actions:[{id:'a',title:'First'},{id:'b',title:'Second'}]});}
test('optional v1 priority: old snapshots/commands, defaults, enums and invalid values',()=>{
  let w=setup(),id=w.openGoalId;assert.equal(w.goals[id].priority,'normal');delete w.goals[id].priority;assert.equal(validate(w),w);
  const fields={goalId:id,title:'Real goal',definition:'Done means tested.',actions:[{id:'a',title:'First'},{id:'b',title:'Second'}]};
  w=run(w,'save-goal',fields);assert.equal(Object.hasOwn(w.goals[id],'priority'),false);
  const legacyOp=cmd('save-goal',fields);w=transition(w,legacyOp,10000);assert.throws(()=>transition(w,{...legacyOp,priority:undefined},10000),/priority/);
  for(const priority of ['low','normal','important']){w=run(w,'save-goal',{...fields,priority});w=run(w,'save-goal',fields);assert.equal(w.goals[id].priority,priority);assert.deepEqual(w.goals[id].actionOrder,['a','b']);}
  for(const priority of [undefined,null,'','urgent',0,false,{},[]]){const bad=structuredClone(w);bad.goals[id].priority=priority;assert.throws(()=>validate(bad),/priority/);const before=structuredClone(w);assert.throws(()=>run(w,'save-goal',{...fields,priority}),/priority/);assert.deepEqual(w,before);}
});
test('priority survives completion Undo, finish/reopen/refinish and exact command replay without changing effort/order',()=>{
  let w=setup(),id=w.openGoalId;w=run(w,'save-goal',{goalId:id,title:'Goal',definition:'Done',priority:'important',actions:[{id:'a',title:'First'},{id:'b',title:'Second'}]});
  w=run(w,'complete-action',{actionId:'a'});w=run(w,'undo',{eventId:w.undo.eventId,expectedRevision:w.revision});assert.equal(w.goals[id].priority,'important');
  for(const a of ['a','b'])w=run(w,'complete-action',{actionId:a});w=run(w,'finish-goal',{goalId:id});w=run(w,'reopen-goal',{goalId:id});const op=cmd('finish-goal',{goalId:id});w=transition(w,op,10000);assert.equal(transition(w,op,11000),w);assert.equal(w.goals[id].priority,'important');assert.deepEqual(w.goals[id].actionOrder,['a','b']);assert.equal(effort(w,id),0);
});
test('explicit independent note removal preserves identity/link/effort; blank defaults and exact replay remain',()=>{
  const base=run(setup(),'notes',{instruction:'Next',context:'Context',resourceUrl:'https://example.com/work#next'});
  for(const flags of [{removeInstruction:true},{removeContext:true},{removeInstruction:true,removeContext:true}]){
    const remove=cmd('notes',{instruction:'',context:'',...flags}),w=transition(base,remove,22000);
    assert.equal(w.contexts.a.id,base.contexts.a.id);assert.equal(w.contexts.a.nextInstruction,flags.removeInstruction?'':'Next');assert.equal(w.contexts.a.context,flags.removeContext?'':'Context');assert.equal(w.contexts.a.resourceUrl,base.contexts.a.resourceUrl);assert.equal(w.contexts.a.updatedAt,22000);assert.deepEqual(w.intervals,base.intervals);assert.deepEqual(w.events,base.events);assert.equal(transition(w,remove,23000),w);
  }
  let w=run(base,'notes',{instruction:' ',context:'\n',removeInstruction:false,removeContext:false});assert.equal(w.contexts.a.nextInstruction,'Next');assert.equal(w.contexts.a.context,'Context');
  w=run(w,'notes',{instruction:'',context:'',removeInstruction:true,removeContext:true,resourceUrl:null});const {resourceUrl,...withoutLink}=base.contexts.a;assert.deepEqual(w.contexts.a,{...withoutLink,nextInstruction:'',context:'',updatedAt:10000});
});
test('invalid removal flags and contradictory replacements reject unchanged; cleared context stays protected and Undo restores it',()=>{
  let w=run(setup(),'notes',{instruction:'Next',context:'Context'});
  for(const field of ['removeInstruction','removeContext'])for(const value of [null,undefined,0,1,'true',{},[]]){const before=structuredClone(w);assert.throws(()=>run(w,'notes',{instruction:'',context:'',[field]:value}));assert.deepEqual(w,before);}
  for(const fields of [{instruction:'Replacement',context:'',removeInstruction:true},{instruction:'',context:'Replacement',removeContext:true}]){const before=structuredClone(w);assert.throws(()=>run(w,'notes',fields));assert.deepEqual(w,before);}
  w=run(w,'notes',{instruction:'',context:'',removeInstruction:true,removeContext:true});assert.throws(()=>run(w,'save-goal',{goalId:w.openGoalId,title:'Goal',definition:'Done',actions:[{id:'b',title:'Second'}]}),/cannot be removed/);
  const cleared=structuredClone(w.contexts.a);w=run(w,'complete-action',{actionId:'a'});w=run(w,'undo',{eventId:w.undo.eventId,expectedRevision:w.revision});assert.deepEqual(w.contexts.a,cleared);
});
test('fresh workspace has no sample data; stable IDs, edits/reorder, validation',()=>{
  assert.equal(Object.keys(emptyWorkspace().goals).length,0);let w=setup();const id=w.openGoalId;
  w=run(w,'save-goal',{goalId:id,title:'Renamed',definition:'Still done',actions:[{id:'b',title:'Edited'},{id:'a',title:'First'}]});
  assert.deepEqual(w.goals[id].actionOrder,['b','a']);assert.equal(w.actions.b.id,'b');
  for(const title of ['   ','x'.repeat(161)])assert.throws(()=>run(w,'save-goal',{goalId:id,title,definition:'Done',actions:[{id:'a',title:'First'}]}));
  const bad=structuredClone(w);bad.goals[id].actionOrder=['a','a'];assert.throws(()=>validate(bad));
  assert.throws(()=>validate({...w,schemaVersion:2}));
});
test('one session, exact effort, idempotency and running/paused/expiry extensions',()=>{
  let w=setup();const start=cmd('start',{minutes:20});w=transition(w,start,1000);
  assert.deepEqual(transition(w,start,1000),w);assert.throws(()=>run(w,'start',{minutes:25}));
  const checkpoint=cmd('checkpoint',{deltaMs:5000});w=transition(w,checkpoint,6000);w=transition(w,checkpoint,6000);
  assert.equal(effort(w,w.openGoalId),5000);assert.equal(activeSession(w).remainingMs,1195000);
  for(let i=0;i<79;i++)w=run(w,'checkpoint',{deltaMs:15000});
  w=run(w,'checkpoint',{deltaMs:10000});assert.equal(activeSession(w).status,'expired');
  w=run(w,'extend',{minutes:5});assert.equal(activeSession(w).status,'paused');assert.equal(activeSession(w).creditedMs,1200000);
  assert.equal(activeSession(w).remainingMs,300000);
  w=run(w,'resume');assert.equal(activeSession(w).status,'running');
  let extended=run(setup(),'start',{minutes:20});
  extended=run(extended,'extend-running',{minutes:10,deltaMs:7500});
  assert.equal(activeSession(extended).status,'running');assert.equal(activeSession(extended).creditedMs,7500);assert.equal(activeSession(extended).remainingMs,1800000-7500);
  extended=run(extended,'pause',{deltaMs:500});extended=run(extended,'extend',{minutes:20});
  assert.equal(activeSession(extended).status,'paused');assert.equal(activeSession(extended).creditedMs,8000);assert.equal(activeSession(extended).remainingMs,3000000-8000);
});
test('pause notes independently preserve useful fields; interruption awards no uncertain time',()=>{
  let w=setup();w=run(w,'start',{minutes:20});w=run(w,'pause',{deltaMs:7000});
  w=run(w,'notes',{instruction:'Next move',context:'Useful context'});
  w=run(w,'notes',{instruction:'  ',context:'Replacement'});assert.equal(w.contexts.a.nextInstruction,'Next move');
  w=run(w,'notes',{instruction:'New move',context:'  '});assert.equal(w.contexts.a.context,'Replacement');
  w=run(w,'resume');w=run(w,'checkpoint',{interrupted:true,deltaMs:0});
  assert.equal(activeSession(w).status,'interrupted');assert.equal(effort(w,w.openGoalId),7000);
  w=run(w,'resume');w=run(w,'recover');assert.equal(activeSession(w).status,'interrupted');assert.equal(effort(w,w.openGoalId),7000);
});
test('structural edits are rejected while block exists, titles preserved by ID',()=>{
  let w=setup();w=run(w,'start',{minutes:20});w=run(w,'pause',{deltaMs:0});
  assert.throws(()=>run(w,'save-goal',{goalId:w.openGoalId,title:'Goal',definition:'Done',actions:[{id:'b',title:'Second'},{id:'a',title:'First'}]}));
  w=run(w,'save-goal',{goalId:w.openGoalId,title:'Goal',definition:'Done',actions:[{id:'a',title:'First edited'},{id:'b',title:'Second'}]});
  assert.equal(activeSession(w).actionId,'a');assert.equal(w.actions.a.title,'First edited');
});
test('end stopped blocks releases replanning without completing work or changing saved effort/context',()=>{
  for(const status of ['paused','interrupted','expired']){
    let w=run(setup(),'start',{minutes:20});w=run(w,'checkpoint',{deltaMs:5000});
    if(status==='expired'){for(let i=0;i<79;i++)w=run(w,'checkpoint',{deltaMs:15000});w=run(w,'checkpoint',{deltaMs:10000});}
    else w=run(w,'pause',{deltaMs:123,interrupted:status==='interrupted'});
    w=run(w,'notes',{instruction:'Find prerequisite',context:'Keep draft',resourceUrl:'https://example.com/work#next'});
    const before=structuredClone(w),s=activeSession(w),edit={goalId:w.openGoalId,title:'Goal',definition:'Done',actions:[{id:'prerequisite',title:'Prerequisite'},{id:'b',title:'Second'},{id:'a',title:'First'}]};
    assert.throws(()=>run(w,'save-goal',edit),/locked/);
    const end=cmd('end-block',{sessionId:s.id,ownerToken:w.ownerToken,expectedRevision:w.revision});w=transition(w,end,20000);
    assert.equal(w.activeSessionId,null);assert.deepEqual(w.sessions[s.id],{...s,status:'ended',ownerToken:null});
    for(const key of ['intervals','contexts','actions','goals','events'])assert.deepEqual(w[key],before[key]);
    assert.equal(w.undo,null);assert.equal(w.revision,before.revision+1);assert.equal(transition(w,end,22000),w);
    assert.throws(()=>run(w,'resume'));assert.throws(()=>run(w,'extend',{minutes:5}));
    for(const mutate of [bad=>bad.activeSessionId=s.id,bad=>bad.sessions[s.id].ownerToken='owner']){const bad=structuredClone(w);mutate(bad);assert.throws(()=>validate(bad));}
    const ended=structuredClone(w.sessions[s.id]);w=run(w,'save-goal',edit);assert.equal(w.goals[w.openGoalId].actionOrder[0],'prerequisite');assert.deepEqual(w.contexts,before.contexts);assert.equal(effort(w,w.openGoalId),effort(before,before.openGoalId));
    w=run(w,'start',{minutes:25});assert.notEqual(w.activeSessionId,s.id);assert.equal(activeSession(w).actionId,'prerequisite');assert.deepEqual(w.sessions[s.id],ended);
    const stale=structuredClone(w);assert.throws(()=>run(w,'end-block',{sessionId:s.id,ownerToken:w.ownerToken,expectedRevision:w.revision}));assert.deepEqual(w,stale);
  }
});
test('end rejects missing, running, stale revision/session and foreign owner without mutation',()=>{
  const empty=setup(),running=run(empty,'start',{minutes:20}),paused=run(running,'pause',{deltaMs:10});
  for(const [w,fields,message] of [[empty,{},/No active/],[running,{},/Pause first/],[paused,{sessionId:'old'},/changed/],[paused,{ownerToken:'foreign'},/ownership/],[paused,{expectedRevision:0},/changed/]]){
    const before=structuredClone(w);assert.throws(()=>run(w,'end-block',{sessionId:w.activeSessionId,ownerToken:w.ownerToken,expectedRevision:w.revision,...fields}),message);assert.deepEqual(w,before);
  }
});
test('multiple ended blocks retain aggregate effort through completion, Undo and finished history',()=>{
  let w=run(setup(),'notes',{instruction:'Next',context:'Context'});const goalId=w.openGoalId,context=structuredClone(w.contexts.a),ended=[];
  for(const deltaMs of [1100,2300]){w=run(w,'start',{minutes:20});w=run(w,'pause',{deltaMs});const id=w.activeSessionId;w=run(w,'end-block',{sessionId:id,ownerToken:w.ownerToken,expectedRevision:w.revision});ended.push(id);}
  assert.equal(effort(w,goalId),3400);assert.throws(()=>run(w,'save-goal',{goalId,title:'Goal',definition:'Done',actions:[{id:'b',title:'Second'}]}),/cannot be removed/);
  w=run(w,'start',{minutes:20});w=run(w,'complete-action',{actionId:'a',deltaMs:700});const u=w.undo;
  w=run(w,'undo',{eventId:u.eventId,expectedRevision:w.revision});assert.equal(effort(w,goalId),4100);assert.deepEqual(w.contexts.a,context);
  w=run(w,'end-block',{sessionId:w.activeSessionId,ownerToken:w.ownerToken,expectedRevision:w.revision});assert.equal(w.undo,null);
  w=run(w,'complete-action',{actionId:'a'});w=run(w,'complete-action',{actionId:'b'});w=run(w,'finish-goal',{goalId});
  assert.equal(effort(w,goalId),4100);assert.deepEqual(w.contexts.a,context);for(const id of ended)assert.equal(w.sessions[id].status,'ended');validate(w);
});
test('completion is atomic/idempotent; Undo retains exact trusted tail, notes, IDs and paused timer',()=>{
  let w=setup();w=run(w,'notes',{instruction:'Saved instruction',context:'Saved context'});w=run(w,'start',{minutes:20});
  const completed=cmd('complete-action',{actionId:'a',deltaMs:4231});w=transition(w,completed,15000);
  const snapshot=structuredClone(w.undo),count=Object.keys(w.events).length;
  assert.equal(w.actions.a.status,'completed');assert.equal(w.activeSessionId,null);assert.equal(effort(w,w.openGoalId),4231);
  assert.deepEqual(transition(w,completed,15000),w);assert.equal(Object.keys(w.events).length,count);
  assert.throws(()=>run(w,'complete-action',{actionId:'a'}));
  w=run(w,'undo',{eventId:snapshot.eventId,expectedRevision:w.revision});
  assert.deepEqual(w.actions.a,snapshot.action);assert.deepEqual(w.contexts.a,snapshot.context);assert.deepEqual(activeSession(w),snapshot.session);
  assert.equal(activeSession(w).status,'paused');assert.equal(activeSession(w).remainingMs,1200000-4231);assert.equal(effort(w,w.openGoalId),4231);
  assert.equal(w.undo,null);assert.equal(Object.values(w.events).filter(e=>e.type==='completion-undone').length,1);
});
test('Undo survives read/navigation but a later mutation invalidates it; reject stale revision and event',()=>{
  let w=run(setup(),'complete-action',{actionId:'a'});const u=w.undo;
  assert.deepEqual(validate(structuredClone(w)).undo,u);
  assert.throws(()=>run(w,'undo',{eventId:u.eventId,expectedRevision:w.revision-1}));
  assert.throws(()=>run(w,'undo',{eventId:'wrong',expectedRevision:w.revision}));
  w=run(w,'notes',{instruction:'Next action',context:''});assert.equal(w.undo,null);
  assert.throws(()=>run(w,'undo',{eventId:u.eventId,expectedRevision:w.revision}));
});
test('all checked remains open; review can add/keep open, confirmation creates one history identity',()=>{
  let w=setup(),id=w.openGoalId;w=run(w,'complete-action',{actionId:'a'});w=run(w,'complete-action',{actionId:'b'});
  assert.equal(w.goals[id].status,'open');w=run(w,'keep-open');assert.equal(w.undo,null);
  w=run(w,'add-action',{title:'One more'});const last=w.goals[id].actionOrder.at(-1);
  assert.throws(()=>run(w,'finish-goal',{goalId:id}));w=run(w,'complete-action',{actionId:last});
  const confirm=cmd('finish-goal',{goalId:id});w=transition(w,confirm,20000);
  assert.equal(w.openGoalId,null);assert.equal(w.goals[id].completedAt,20000);assert.deepEqual(transition(w,confirm,22000),w);
  assert.equal(Object.values(w.events).filter(e=>e.type==='goal-finished').length,1);
  assert.throws(()=>run(w,'finish-goal',{goalId:id}));
});
test('guarded reopen and specific action correction preserve effort and audit; refinish updates one goal',()=>{
  let w=setup(),id=w.openGoalId;w=run(w,'start',{minutes:20});w=run(w,'complete-action',{actionId:'a',deltaMs:1900});w=run(w,'complete-action',{actionId:'b'});w=run(w,'finish-goal',{goalId:id});
  const before=effort(w,id);w=run(w,'reopen-goal',{goalId:id});assert.equal(w.actions.a.status,'completed');assert.equal(w.goals[id].completedAt,null);
  w=run(w,'reopen-action',{actionId:'a'});assert.equal(w.actions.a.id,'a');assert.equal(effort(w,id),before);assert.equal(w.activeSessionId,null);
  w=run(w,'complete-action',{actionId:'a'});w=run(w,'finish-goal',{goalId:id});
  assert.equal(Object.values(w.goals).filter(g=>g.status==='completed').length,1);assert.equal(effort(w,id),before);
  const audit=Object.values(w.events);assert.equal(audit.filter(e=>e.type==='goal-finished').length,2);assert.equal(audit.filter(e=>e.type==='goal-reopened').length,1);
  w=run(w,'save-goal',{goalId:null,title:'Another goal',definition:'Done',actions:[{id:'new',title:'New action'}]});
  assert.throws(()=>run(w,'reopen-goal',{goalId:id}));assert.equal(Object.keys(w.goals).length,2);
});
test('expired completion Undo is stopped at zero; interrupted completion credits no uncertain gap',()=>{
  let w=setup();w=run(w,'start',{minutes:20});w=run(w,'complete-action',{actionId:'a',interrupted:true,deltaMs:0});
  assert.equal(effort(w,w.openGoalId),0);assert.equal(w.undo.session.status,'paused');
  w=run(w,'undo',{eventId:w.undo.eventId,expectedRevision:w.revision});assert.equal(activeSession(w).remainingMs,1200000);
});
test('limits, malformed effort and command identity are rejected without mutating input',()=>{
  let w=setup();const saved=structuredClone(w);
  for(const actions of [[],Array.from({length:31},(_,i)=>({id:`a-${i}`,title:'Action'})),[{id:'a',title:' '.repeat(3)}],[{id:'a',title:'x'.repeat(501)}]]){
    assert.throws(()=>run(w,'save-goal',{goalId:w.openGoalId,title:'Goal',definition:'Done',actions}));assert.deepEqual(w,saved);
  }
  const receipt=cmd('notes',{instruction:'Next',context:'Context'});w=transition(w,receipt,1000);
  assert.throws(()=>transition(w,{...receipt,context:'different payload'},1000));
  w=run(w,'start',{minutes:20});w=run(w,'pause',{deltaMs:1000});
  const bad=structuredClone(w);bad.sessions[bad.activeSessionId].creditedMs+=1;assert.throws(()=>validate(bad));
  const newer=structuredClone(w);newer.schemaVersion=99;assert.throws(()=>validate(newer));
});
test('work URLs require explicit safe absolute HTTP(S), preserve query/hash and enforce bounds',()=>{
  assert.equal(normalizeResourceUrl('  HTTPS://Example.COM/work?q=a%20b&view=notes#paragraph-2  '),'https://example.com/work?q=a%20b&view=notes#paragraph-2');
  assert.equal(normalizeResourceUrl('http://127.0.0.1:3001/draft#next'),'http://127.0.0.1:3001/draft#next');
  const prefix='https://example.com/?q=',long=prefix+'x'.repeat(2048-prefix.length);assert.equal(normalizeResourceUrl(long),long);assert.throws(()=>normalizeResourceUrl(long+'x'));
  for(const value of ['',null,undefined,12,{},'example.com','/draft','//example.com','https:example.com','https:/example.com','http://','https://[bad]/','javascript:alert(1)','data:text/html,test','file:///draft','blob:https://example.com/a','ftp://example.com','https://user:pass@example.com','https://%75ser@example.com','https://@example.com','https://example.com\\draft','https://example.com/a\nb','\nhttps://example.com/','https://example.com/\u0000','https://example.com/\u007f','https://example.com/\u0085'])assert.throws(()=>normalizeResourceUrl(value),String(value));
});
test('old v1 contexts load unchanged; absent/blank preserve URLs and only explicit null clears',()=>{
  let w=run(setup(),'notes',{instruction:'Next',context:'Where I stopped'});const old=structuredClone(w);
  assert.deepEqual(validate(w),old);assert.equal(Object.hasOwn(w.contexts.a,'resourceUrl'),false);
  w=run(w,'notes',{instruction:'',context:''});assert.equal(Object.hasOwn(w.contexts.a,'resourceUrl'),false);
  const save=cmd('notes',{instruction:'Open the draft',context:'Keep these notes',resourceUrl:' https://example.com/work?q=1#next '});
  w=transition(w,save,12000);const saved=structuredClone(w);assert.deepEqual(transition(w,save,13000),saved);
  w=run(w,'notes',{instruction:'',context:''});assert.equal(w.contexts.a.resourceUrl,'https://example.com/work?q=1#next');
  w=run(w,'notes',{instruction:'',context:'',resourceUrl:'  '});assert.equal(w.contexts.a.resourceUrl,'https://example.com/work?q=1#next');
  w=run(w,'notes',{instruction:'',context:'',resourceUrl:null});assert.equal(Object.hasOwn(w.contexts.a,'resourceUrl'),false);assert.equal(w.contexts.a.nextInstruction,'Open the draft');assert.equal(w.contexts.a.context,'Keep these notes');
});
test('invalid link commands and malformed stored/Undo links preserve input and reject',()=>{
  let w=run(setup(),'notes',{instruction:'Next',context:'Context',resourceUrl:'https://example.com/draft'});
  for(const resourceUrl of [false,undefined,123,'javascript:alert(1)','https://user:pw@example.com','relative','https://example.com/\n']){
    const before=structuredClone(w);assert.throws(()=>run(w,'notes',{instruction:'Replace',context:'Replace',resourceUrl}));assert.deepEqual(w,before);
  }
  for(const resourceUrl of [null,'','https://USER:pw@example.com/','javascript:alert(1)',' https://example.com/draft ','https://EXAMPLE.com/draft']){
    const corrupt=structuredClone(w);corrupt.contexts.a.resourceUrl=resourceUrl;const before=structuredClone(corrupt);assert.throws(()=>validate(corrupt));assert.deepEqual(corrupt,before);
  }
  w=run(w,'complete-action',{actionId:'a'});const corrupt=structuredClone(w);corrupt.undo.context.resourceUrl='data:text/html,unsafe';assert.throws(()=>validate(corrupt));
});
test('completion Undo, history and correction keep the exact work reference action-scoped',()=>{
  let w=run(setup(),'notes',{instruction:'Saved move',context:'Saved context',resourceUrl:'https://example.com/work?q=2#step'}),id=w.openGoalId;
  const savedContext=structuredClone(w.contexts.a);w=run(w,'start',{minutes:20});w=run(w,'complete-action',{actionId:'a',deltaMs:1200});
  assert.deepEqual(w.undo.context,savedContext);assert.equal(w.contexts.b,undefined);
  w=run(w,'undo',{eventId:w.undo.eventId,expectedRevision:w.revision});assert.deepEqual(w.contexts.a,savedContext);assert.equal(activeSession(w).status,'paused');
  w=run(w,'complete-action',{actionId:'a'});w=run(w,'complete-action',{actionId:'b'});w=run(w,'finish-goal',{goalId:id});assert.deepEqual(w.contexts.a,savedContext);
  w=run(w,'reopen-goal',{goalId:id});w=run(w,'reopen-action',{actionId:'a'});assert.deepEqual(w.contexts.a,savedContext);assert.equal(w.contexts.b,undefined);assert.equal(effort(w,id),1200);
});
test('context-only, link-only and empty saved context protect removal without mutating rejected input',()=>{
  for(const fields of [{instruction:'Next move',context:'Where I stopped'},{instruction:'',context:'',resourceUrl:'https://example.com/work#next'},{instruction:'',context:''}]){
    const w=run(setup(),'notes',fields),before=structuredClone(w);
    assert.equal(Object.keys(w.sessions).length,0);
    assert.throws(()=>run(w,'save-goal',{goalId:w.openGoalId,title:'Goal',definition:'Done',actions:[{id:'b',title:'Second'}]}),/cannot be removed/);
    assert.deepEqual(w,before);
    const save=cmd('save-goal',{goalId:w.openGoalId,title:'Renamed',definition:'Done',actions:[{id:'a',title:'First edited'}]}),edited=transition(w,save,12000);
    assert.equal(edited.actions.b,undefined);assert.deepEqual(edited.contexts.a,before.contexts.a);assert.deepEqual(transition(edited,save,13000),edited);
  }
});
test('recorded/completed removal guards remain conservative; untouched actions remain removable',()=>{
  let w=run(setup(),'start',{minutes:20});w=run(w,'complete-action',{actionId:'a',deltaMs:123});w=run(w,'reopen-action',{actionId:'a'});
  const before=structuredClone(w);assert.throws(()=>run(w,'save-goal',{goalId:w.openGoalId,title:'Goal',definition:'Done',actions:[{id:'b',title:'Second'}]}));assert.deepEqual(w,before);
  w=run(setup(),'complete-action',{actionId:'a'});const completed=structuredClone(w);assert.throws(()=>run(w,'save-goal',{goalId:w.openGoalId,title:'Goal',definition:'Done',actions:[{id:'b',title:'Second'}]}));assert.deepEqual(w,completed);
  w=setup();w=run(w,'save-goal',{goalId:w.openGoalId,title:'Goal',definition:'Done',actions:[{id:'b',title:'Second'}]});assert.equal(w.actions.a,undefined);assert.deepEqual(w.goals[w.openGoalId].actionOrder,['b']);
});
