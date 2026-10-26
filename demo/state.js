export const SCHEMA_VERSION=1;
export const LIMITS={goals:200,actions:30,records:100000,title:160,definition:2000,action:500,context:4000};
export const PRIORITIES=['low','normal','important'];
const fail=message=>{throw new Error(message);};
const validId=id=>typeof id==='string'&&/^[a-zA-Z0-9:-]{1,120}$/.test(id);
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const text=(value,max,required=true)=>typeof value==='string'&&value.length<=max&&(!required||value.trim().length>0);
function validateEstimate(value){if(!(value===null||Number.isInteger(value)&&value>=1&&value<=1440))fail('Estimated minutes must be blank or a whole number from 1 to 1,440.');}
function validatePlanning(value){
  if(value===null)return;
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==2||!Object.hasOwn(value,'deadlineText')||!Object.hasOwn(value,'availableMinutes')||!text(value.deadlineText,160,false)||!(value.availableMinutes===null||Number.isInteger(value.availableMinutes)&&value.availableMinutes>=1&&value.availableMinutes<=10080))fail('Planning context needs deadline text and optional whole available minutes (1–10,080).');
}
const values=map=>Object.values(map);
export function normalizeResourceUrl(value){
  const message='Use a full http:// or https:// work link, without sign-in details, up to 2,048 characters.';
  if(typeof value!=='string'||/[\u0000-\u001f\u007f-\u009f\\]/u.test(value))fail(message);
  const trimmed=value.trim();
  if(!/^https?:\/\//i.test(trimmed)||trimmed.length>2048)fail(message);
  let url;try{url=new URL(trimmed);}catch{fail(message);}
  const authority=trimmed.slice(trimmed.indexOf('//')+2).split(/[/?#]/,1)[0];
  if(!['http:','https:'].includes(url.protocol)||!url.hostname||url.username||url.password||authority.includes('@')||url.href.length>2048)fail(message);
  return url.href;
}
function validateResource(context){
  if(!Object.hasOwn(context,'resourceUrl'))return;
  try{if(normalizeResourceUrl(context.resourceUrl)===context.resourceUrl)return;}catch{}
  fail('Invalid saved work link. Records have not been changed.');
}
export function emptyWorkspace(){return {schemaVersion:1,revision:0,ownerToken:null,goals:{},openGoalId:null,actions:{},contexts:{},sessions:{},activeSessionId:null,intervals:{},operations:{},events:{},undo:null,updatedAt:0};}
export const openGoal=w=>w.goals[w.openGoalId]||null;
export const nextAction=w=>openGoal(w)?.actionOrder.map(id=>w.actions[id]).find(a=>a.status==='open')||null;
export const activeSession=w=>w.sessions[w.activeSessionId]||null;
export const effort=(w,goalId)=>values(w.intervals).filter(i=>w.sessions[i.sessionId]?.goalId===goalId).reduce((sum,i)=>sum+i.deltaMs,0);
export function validate(w){
  if(!w||w.schemaVersion!==1)fail('Unsupported storage schema. Records have not been changed.');
  if(!integer(w.revision)||!integer(w.updatedAt)||!(w.ownerToken===null||validId(w.ownerToken)))fail('Invalid workspace metadata.');
  for(const name of ['goals','actions','contexts','sessions','intervals','operations'])if(!w[name]||typeof w[name]!=='object'||Array.isArray(w[name]))fail(`Invalid ${name} records.`);
  if(values(w.goals).length>LIMITS.goals)fail('Goal storage limit reached.');
  for(const name of ['actions','contexts','sessions','intervals','operations'])if(values(w[name]).length>LIMITS.records)fail('Local record limit reached. Export your records.');
  const checkRecord=(key,r)=>{if(!r||!validId(key)||r.id!==key)fail('Invalid record identity.');};
   let open=0,queued=0;
  for(const [key,g] of Object.entries(w.goals)){
    checkRecord(key,g);
    if(Object.hasOwn(g,'planning'))validatePlanning(g.planning);
    if(Object.hasOwn(g,'priority')&&!PRIORITIES.includes(g.priority))fail('Invalid goal priority. Records have not been changed.');
    if(!text(g.title,160)||!text(g.definitionOfFinished,2000)||!integer(g.createdAt)||!integer(g.updatedAt)||!['open','completed','queued'].includes(g.status)||(g.status==='completed'&&!integer(g.completedAt))||(g.status!=='completed'&&g.completedAt!=null))fail('Invalid goal.');
    if(g.status==='open')open++;
    if(!Array.isArray(g.actionOrder)||g.actionOrder.length<1||g.actionOrder.length>30||new Set(g.actionOrder).size!==g.actionOrder.length||g.actionOrder.some(id=>w.actions[id]?.goalId!==key))fail('Invalid action order.');
    if(g.status==='queued'){
      queued++;if(g.completionEventId!=null||g.actionOrder.some(id=>w.actions[id].status!=='open'||w.actions[id].completionEventId!=null||Object.hasOwn(w.contexts,id))||values(w.sessions).some(s=>s.goalId===key)||values(w.events||{}).some(e=>e.goalId===key))fail('Queued goals cannot contain completed or recorded work.');
    }
   }
   if(queued>10)fail('Later goals is full (10). Make room by activating and finishing a goal.');
  if(open>1||(open===1&&openGoal(w)?.status!=='open')||(open===0&&w.openGoalId!==null))fail('Invalid open goal.');
  for(const [key,a] of Object.entries(w.actions)){
    if(a&&Object.hasOwn(a,'estimatedMinutes'))validateEstimate(a.estimatedMinutes);
    checkRecord(key,a);if(!w.goals[a.goalId]?.actionOrder.includes(key)||!text(a.title,500)||!['open','completed'].includes(a.status)||!integer(a.createdAt)||!integer(a.updatedAt)||(a.status==='completed'&&!integer(a.completedAt))||(a.status==='open'&&a.completedAt!=null))fail('Invalid action.');
  }
  for(const [key,c] of Object.entries(w.contexts)){
    if(key!==c.actionId||!validId(c.id)||!w.actions[key]||!text(c.nextInstruction,4000,false)||!text(c.context,4000,false)||!integer(c.updatedAt))fail('Invalid saved context.');
    validateResource(c);
  }
  const totals={},counts={},sequences={};
  for(const [key,i] of Object.entries(w.intervals)){
    checkRecord(key,i);if(!w.sessions[i.sessionId]||!integer(i.sequence)||i.sequence<1||key!==`${i.sessionId}:${i.sequence}`||!integer(i.deltaMs)||!i.deltaMs||i.deltaMs>15000||!integer(i.recordedAt))fail('Invalid effort interval.');
    totals[i.sessionId]=(totals[i.sessionId]||0)+i.deltaMs;
    counts[i.sessionId]=(counts[i.sessionId]||0)+1;sequences[i.sessionId]=Math.max(sequences[i.sessionId]||0,i.sequence);
  }
  let running=0;
  for(const [key,s] of Object.entries(w.sessions)){
    checkRecord(key,s);
    if(w.actions[s.actionId]?.goalId!==s.goalId||!['running','paused','interrupted','expired','completed','ended'].includes(s.status)||!integer(s.allocatedMs)||s.allocatedMs>86400000||!integer(s.remainingMs)||!integer(s.creditedMs)||s.allocatedMs!==s.remainingMs+s.creditedMs||s.creditedMs!==(totals[key]||0)||!integer(s.sequence)||!integer(s.lastCheckpointAt)||!(s.ownerToken===null||validId(s.ownerToken))||!(s.interruptionReason===null||text(s.interruptionReason,500)))fail('Invalid focus session.');
    if((counts[key]||0)!==s.sequence||(sequences[key]||0)!==s.sequence)fail('Invalid effort sequence.');
    if(s.status==='running'){running++;if(key!==w.activeSessionId||!validId(s.ownerToken)||s.ownerToken!==w.ownerToken||s.remainingMs===0)fail('Invalid running owner.');}
    if(s.status==='expired'&&s.remainingMs!==0)fail('Invalid expired block.');
    if(s.status==='ended'&&(key===w.activeSessionId||s.ownerToken!==null))fail('Ended blocks cannot be active or owned.');
  }
  if(running>1||(w.activeSessionId!==null&&!activeSession(w)))fail('Invalid active block.');
  if(activeSession(w)&&activeSession(w).actionId!==nextAction(w)?.id)fail('Block target differs from next action.');
  for(const [key,op] of Object.entries(w.operations))if(!validId(key)||!text(op.fingerprint,50000)||!integer(op.revision)||op.revision>w.revision)fail('Invalid operation receipt.');
  const events=w.events===undefined?{}:w.events;
  if(!events||typeof events!=='object'||Array.isArray(events)||values(events).length>LIMITS.records)fail('Invalid completion events.');
  for(const [key,event] of Object.entries(events)){
    checkRecord(key,event);if(!['action-completed','completion-undone','goal-finished','goal-reopened','action-reopened'].includes(event.type)||!w.goals[event.goalId]||!integer(event.at)||(event.actionId&&w.actions[event.actionId]?.goalId!==event.goalId))fail('Invalid completion event.');
    if(event.reverses&&!events[event.reverses])fail('Invalid reversal reference.');
    if(['action-completed','completion-undone','action-reopened'].includes(event.type)&&!event.actionId)fail('Action event has no action.');
    if(['completion-undone','action-reopened','goal-reopened'].includes(event.type)){
      const original=events[event.reverses];if(!original||original.goalId!==event.goalId||original.type!==(event.type==='goal-reopened'?'goal-finished':'action-completed')||original.actionId!==event.actionId)fail('Invalid correction audit.');
    }
    if(!w.operations[key])fail('Event has no committed operation receipt.');
  }
  for(const g of values(w.goals))if(g.status==='completed'&&g.actionOrder.some(id=>w.actions[id].status!=='completed'))fail('Finished goal has unfinished actions.');
  for(const a of values(w.actions))if(a.status==='completed'&&(events[a.completionEventId]?.type!=='action-completed'||events[a.completionEventId]?.actionId!==a.id))fail('Completed action has no matching audit event.');
  for(const g of values(w.goals))if(g.status==='completed'&&(events[g.completionEventId]?.type!=='goal-finished'||events[g.completionEventId]?.goalId!==g.id))fail('Finished goal has no matching audit event.');
  const undo=w.undo;
  if(undo!==undefined&&undo!==null&&(typeof undo!=='object'||Array.isArray(undo)))fail('Invalid Undo record.');
  if(undo){
    if(undo.action&&Object.hasOwn(undo.action,'estimatedMinutes'))validateEstimate(undo.action.estimatedMinutes);
    const event=events[undo.eventId],a=w.actions[undo.action?.id];
    if(a&&(Object.hasOwn(undo.action,'estimatedMinutes')!==Object.hasOwn(a,'estimatedMinutes')||undo.action.estimatedMinutes!==a.estimatedMinutes))fail('Invalid Undo estimate snapshot.');
    if(!event||event.type!=='action-completed'||event.actionId!==a?.id||a.status!=='completed'||a.completionEventId!==undo.eventId||undo.goalId!==w.openGoalId||undo.expectedRevision!==w.revision||undo.action.status!=='open'||undo.action.goalId!==a.goalId||undo.action.title!==a.title||undo.action.createdAt!==a.createdAt||undo.activeSessionId!==(undo.session?.id??null))fail('Invalid or stale Undo snapshot.');
    if(undo.session){const current=w.sessions[undo.session.id];if(!current||current.status!=='completed'||current.actionId!==a.id||undo.session.actionId!==a.id||undo.session.creditedMs!==current.creditedMs||undo.session.remainingMs!==current.remainingMs||!['paused','expired'].includes(undo.session.status))fail('Invalid Undo timer snapshot.');}
    if(undo.context&&(undo.context.actionId!==a.id||!text(undo.context.nextInstruction,4000,false)||!text(undo.context.context,4000,false)))fail('Invalid Undo context.');
    if(undo.context)validateResource(undo.context);
  }
  return w;
}
export function transition(input,command,now){
  validate(input);if(!validId(command.id)||!integer(now))fail('Invalid command.');
   if(['save-goal','save-queued-goal'].includes(command.type)&&Object.hasOwn(command,'priority')&&!PRIORITIES.includes(command.priority))fail('Choose Low, Normal or Important priority.');
  // Validate explicit optional values before receipt lookup: JSON drops undefined.
   if(['save-goal','save-queued-goal'].includes(command.type)){
    if(Object.hasOwn(command,'planning'))validatePlanning(command.planning);
    if(Array.isArray(command.actions))for(const a of command.actions)if(a&&Object.hasOwn(a,'estimatedMinutes'))validateEstimate(a.estimatedMinutes);
   }
   if(command.type==='append-action'&&Object.hasOwn(command,'estimatedMinutes'))validateEstimate(command.estimatedMinutes);
   if(['append-action','activate-goal'].includes(command.type)&&!validId(command.goalId)||command.type==='save-queued-goal'&&!(command.goalId===null||validId(command.goalId)))fail('Choose a valid goal to capture or activate.');
  const fingerprint=JSON.stringify(command);
  const prior=input.operations[command.id];
  if(prior){if(prior.fingerprint!==fingerprint)fail('Operation identity reused.');return input;}
  const w=structuredClone(input),g=openGoal(w),a=nextAction(w),s=activeSession(w);
  w.events??={};const previousUndo=w.undo;w.undo=null;
  const event=(type,fields={})=>{w.events[command.id]={id:command.id,type,goalId:g?.id||command.goalId,at:now,...fields};};
  const requireAction=()=>{if(!g||!a)fail('No unfinished action.');};
  const applyTime=()=>{
    if(!s||s.status!=='running')fail('Focus is not running.');
    if(command.interrupted){s.status='interrupted';s.ownerToken=null;s.interruptionReason='Timing gap or clock change. Unverified time was not recorded.';return;}
    if(!integer(command.deltaMs)||command.deltaMs>15000||command.deltaMs>s.remainingMs)fail('Invalid trusted interval.');
    if(command.deltaMs){s.sequence++;const id=`${s.id}:${s.sequence}`;w.intervals[id]={id,sessionId:s.id,sequence:s.sequence,deltaMs:command.deltaMs,recordedAt:now};s.creditedMs+=command.deltaMs;s.remainingMs-=command.deltaMs;}
    s.lastCheckpointAt=now;if(s.remainingMs===0){s.status='expired';s.ownerToken=null;}
  };
  switch(command.type){
    case 'save-queued-goal':case 'save-goal': {
      const queued=command.type==='save-queued-goal',g=queued?(command.goalId===null?null:w.goals[command.goalId]):openGoal(w);
      if(s?.status==='running')fail('Pause before editing.');
      if(queued&&command.goalId!==null&&g?.status!=='queued')fail('Only a Later goal can be edited here.');
      if(!text(command.title,160)||!text(command.definition,2000)||!Array.isArray(command.actions)||command.actions.length<1||command.actions.length>30||command.actions.some(a=>!validId(a.id)||!text(a.title,500))||new Set(command.actions.map(a=>a.id)).size!==command.actions.length)fail('Enter a goal, definition and 1–30 nonblank actions within the shown limits.');
      if(command.goalId!==(g?.id||null))fail('Goal changed. Reload before saving.');
      const order=command.actions.map(a=>a.id);
      if(!queued&&s&&JSON.stringify(order)!==JSON.stringify(g.actionOrder))fail('Action order and removal are locked while a focus block exists.');
      if(!g&&w.goals[command.id])fail('Goal identity already exists.');
      const goal=g||{id:command.id,createdAt:now,status:queued?'queued':'open',priority:'normal'};
      if(Object.hasOwn(command,'priority'))goal.priority=command.priority;
      if(Object.hasOwn(command,'planning'))goal.planning=structuredClone(command.planning);
      for(const item of command.actions){const old=w.actions[item.id];if(old&&old.goalId!==goal.id)fail('Action belongs to another goal.');w.actions[item.id]={...old,id:item.id,goalId:goal.id,title:item.title.trim(),status:old?.status??'open',createdAt:old?.createdAt??now,updatedAt:now};}
      for(const item of command.actions)if(Object.hasOwn(item,'estimatedMinutes'))w.actions[item.id].estimatedMinutes=item.estimatedMinutes;
      if(g)for(const id of g.actionOrder)if(!order.includes(id)){
        if(Object.hasOwn(w.contexts,id)||w.actions[id].status==='completed'||values(w.sessions).some(s=>s.actionId===id)||values(w.events).some(e=>e.actionId===id))fail('Actions with saved context or recorded work cannot be removed.');
        delete w.actions[id];delete w.contexts[id];
      }
      Object.assign(goal,{title:command.title.trim(),definitionOfFinished:command.definition.trim(),actionOrder:order,updatedAt:now});w.goals[goal.id]=goal;if(!queued)w.openGoalId=goal.id;break;
    }
    case 'append-action':
      if(s?.status==='running')fail('Pause before adding a step.');
      if(!g||command.goalId!==g.id||g.actionOrder.length>=30||!text(command.title,500)||w.actions[command.id])fail('Add a nonblank step (up to 500 characters) to the active goal; maximum 30 steps.');
      w.actions[command.id]={id:command.id,goalId:g.id,title:command.title.trim(),status:'open',createdAt:now,updatedAt:now};if(Object.hasOwn(command,'estimatedMinutes'))w.actions[command.id].estimatedMinutes=command.estimatedMinutes;g.actionOrder.push(command.id);g.updatedAt=now;break;
    case 'activate-goal': {
      if(g||s)fail('Finish the active goal before making a Later goal active. Start remains separate.');
      const queued=w.goals[command.goalId];if(queued?.status!=='queued')fail('This goal is not in Later goals.');
      queued.status='open';queued.updatedAt=now;w.openGoalId=queued.id;break;
    }
    case 'start':
      requireAction();if(s)fail('A block already exists. Resume or extend it.');
      if(![20,25,45].includes(command.minutes))fail('Choose a supported duration.');
      w.sessions[command.id]={id:command.id,goalId:g.id,actionId:a.id,status:'running',allocatedMs:command.minutes*60000,remainingMs:command.minutes*60000,creditedMs:0,ownerToken:w.ownerToken,lastCheckpointAt:now,interruptionReason:null,sequence:0};w.activeSessionId=command.id;break;
    case 'resume':
      requireAction();if(!s||!['paused','interrupted'].includes(s.status)||s.remainingMs<=0)fail('This block cannot resume.');
      s.status='running';s.ownerToken=w.ownerToken;s.lastCheckpointAt=now;s.interruptionReason=null;break;
    case 'end-block':
      if(!s)fail('No active focus block to end.');
      if(command.sessionId!==s.id||command.expectedRevision!==w.revision)fail('Focus block changed. Review it before ending.');
      if(!validId(w.ownerToken)||command.ownerToken!==w.ownerToken)fail('Writer ownership changed. Reload before continuing.');
      if(s.status==='running')fail('Pause first before ending this focus block.');
      if(!['paused','interrupted','expired'].includes(s.status))fail('This focus block cannot end.');
      s.status='ended';s.ownerToken=null;w.activeSessionId=null;break;
    case 'checkpoint':case 'pause':
      applyTime();if(command.type==='pause'&&s.status==='running'){s.status='paused';s.ownerToken=null;}break;
    case 'recover':
      if(s?.status==='running'){s.status='interrupted';s.ownerToken=null;s.interruptionReason='Page reopened or restored. Resume explicitly; away time was not recorded.';}break;
    case 'notes': {
      requireAction();if(s?.status==='running')fail('Pause before saving notes.');
      if(!text(command.instruction,4000,false)||!text(command.context,4000,false))fail('Notes may contain up to 4,000 characters each.');
      for(const [flag,field] of [['removeInstruction','instruction'],['removeContext','context']]){
        if(Object.hasOwn(command,flag)&&typeof command[flag]!=='boolean')fail('Note removal choices must be booleans.');
        if(command[flag]&&command[field].trim())fail('Choose removal or replacement for each saved field, not both.');
      }
      const old=w.contexts[a.id]||{id:command.id,actionId:a.id,nextInstruction:'',context:''};
      if(Object.hasOwn(command,'resourceUrl')){
        if(command.resourceUrl===null)delete old.resourceUrl;
        else if(typeof command.resourceUrl!=='string')fail('Enter a work link or leave it blank to keep the saved link.');
        else if(command.resourceUrl.trim())old.resourceUrl=normalizeResourceUrl(command.resourceUrl);
      }
      if(command.removeInstruction)old.nextInstruction='';else if(command.instruction.trim())old.nextInstruction=command.instruction.trim();
      if(command.removeContext)old.context='';else if(command.context.trim())old.context=command.context.trim();old.updatedAt=now;w.contexts[a.id]=old;break;
    }
    case 'extend':
      if(!s||!['paused','interrupted','expired'].includes(s.status)||![5,10,20].includes(command.minutes))fail('Pause before extending this block.');
      s.allocatedMs+=command.minutes*60000;s.remainingMs+=command.minutes*60000;s.status='paused';s.ownerToken=null;break;
    case 'extend-running':
      if(![5,10,20].includes(command.minutes))fail('Choose a supported extension.');applyTime();
      s.allocatedMs+=command.minutes*60000;s.remainingMs+=command.minutes*60000;
      if(s.status==='expired')s.status='paused';break;
    case 'complete-action': {
      requireAction();if(command.actionId!==a.id)fail('This action changed or is already complete.');
      if(s?.status==='running')applyTime();
      if(s){s.status=s.remainingMs?'paused':'expired';s.ownerToken=null;}
      w.undo={goalId:g.id,action:structuredClone(a),context:structuredClone(w.contexts[a.id]??null),session:structuredClone(s??null),activeSessionId:w.activeSessionId,eventId:command.id,expectedRevision:w.revision+1};
      a.status='completed';a.completedAt=now;a.completionEventId=command.id;a.updatedAt=now;
      if(s)s.status='completed';w.activeSessionId=null;event('action-completed',{actionId:a.id});break;
    }
    case 'undo': {
      const u=previousUndo;
      if(!u||command.eventId!==u.eventId||command.expectedRevision!==w.revision||u.expectedRevision!==w.revision)fail('Undo expired after another change.');
      w.actions[u.action.id]=structuredClone(u.action);
      if(u.context)w.contexts[u.action.id]=structuredClone(u.context);else delete w.contexts[u.action.id];
      if(u.session)w.sessions[u.session.id]=structuredClone(u.session);
      w.activeSessionId=u.activeSessionId;event('completion-undone',{actionId:u.action.id,reverses:u.eventId});break;
    }
    case 'keep-open':if(!g||a)fail('Review is available after all actions are completed.');break;
    case 'add-action':
      if(!g||a||g.actionOrder.length>=30||!text(command.title,500))fail('Add a nonblank action (up to 500 characters); maximum 30 actions.');
      w.actions[command.id]={id:command.id,goalId:g.id,title:command.title.trim(),status:'open',createdAt:now,updatedAt:now};g.actionOrder.push(command.id);g.updatedAt=now;break;
    case 'finish-goal':
      if(!g||a||command.goalId!==g.id)fail('Check every action, then explicitly confirm this open goal.');
      g.status='completed';g.completedAt=now;g.completionEventId=command.id;g.updatedAt=now;w.openGoalId=null;event('goal-finished',{goalId:g.id});break;
    case 'reopen-goal': {
      const completed=w.goals[command.goalId];
      if(g)fail('Another goal is open. Finish it before reopening this goal.');
      if(!completed||completed.status!=='completed')fail('This goal is not currently finished.');
      event('goal-reopened',{reverses:completed.completionEventId});completed.status='open';completed.completedAt=null;completed.completionEventId=null;completed.updatedAt=now;w.openGoalId=completed.id;break;
    }
    case 'reopen-action': {
      const completed=w.actions[command.actionId];
      if(!g||completed?.goalId!==g.id||completed.status!=='completed'||s)fail('Reopen a checked action on the open goal when no focus block exists.');
      event('action-reopened',{actionId:completed.id,reverses:completed.completionEventId});completed.status='open';completed.completedAt=null;completed.completionEventId=null;completed.updatedAt=now;break;
    }
    default:fail('Unknown command.');
  }
  w.revision++;w.updatedAt=now;w.operations[command.id]={fingerprint,revision:w.revision};return validate(w);
}
