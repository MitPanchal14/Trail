import { emptyWorkspace, openGoal, nextAction, activeSession, effort, transition, normalizeResourceUrl } from './state.js';
import { LocalStore } from './storage.js';
import { sample, CHECKPOINT_MS } from './timing.js';

export async function bootWork(ui){
  const {$,main,escapeHTML:e,formatTime}=ui;
  let workspace=emptyWorkspace(),ready=false,real=true,view='landing',draft=null,selected=null,duration=20;
  let busy=false,pending=null,error='',anchor=null,frozen=true,suspended=false;
  let needsRecovery=false;
  let pauseDraft=null;
  let validationError=false;
  const clock=()=>({wall:Date.now(),mono:performance.now()});
  const store=new LocalStore(async problem=>{
    if(problem){frozen=true;anchor=null;error=problem.message;status();return;}
    if(!store.writer&&!busy){try{workspace=await store.read();if(real&&!draft)render();}catch(err){error=err.message;status();}}
  });
  const command=(type,fields={})=>({id:crypto.randomUUID(),type,...fields});
  const goal=()=>openGoal(workspace),action=()=>nextAction(workspace),session=()=>activeSession(workspace);
  const context=()=>workspace.contexts[action()?.id];
  const instruction=()=>context()?.nextInstruction||action()?.title||'Review your goal.';
  const running=()=>session()?.status==='running'&&!frozen&&!suspended;
  const disabled=()=>!ready||!store.writer||busy||!!pending;
  const button=(text,type,primary=false)=>`<button type="button" class="button ${primary?'primary':''}" data-work="${type}" ${disabled()?'disabled':''}>${text}</button>`;
  const heading=(title,sub='')=>`<div class="page-heading"><div><h1>${e(title)}</h1><p class="muted">${e(sub)}</p></div><span class="date">${e(new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}))} · local work</span></div>`;
  const label=()=>`<p class="goal-label"><span class="goal-icon" aria-hidden="true">↗</span>${e(goal().title)}</p>`;
  const savedAt=c=>c?`<p class="hint saved-at">Saved <time datetime="${new Date(c.updatedAt).toISOString()}" data-saved-at="${c.updatedAt}">${e(new Date(c.updatedAt).toLocaleString())}</time></p>`:'';
  function workLink(c){
    if(!c?.resourceUrl)return '';
    let url;try{url=normalizeResourceUrl(c.resourceUrl);}catch{return '';}
    return `<a class="button work-link" href="${e(url)}" target="_blank" rel="noopener noreferrer" title="${e(url)}"><span>Open work · ${e(new URL(url).hostname)}</span><span aria-hidden="true">↗</span></a>`;
  }
  function notes(referenceFirst=false){
    const c=context(),original=c?.nextInstruction?`<p class="original-step">Action: ${e(action().title)}</p>`:'',stopped=c?.context?`<div class="saved-context"><strong>Where I stopped</strong><p>${e(c.context)}</p></div>`:'',reference=savedAt(c)+workLink(c);
    return original+(referenceFirst?reference+stopped:stopped+reference);
  }
  const actionLabel=()=>`${context()?.nextInstruction?'Saved next move':'Next unfinished action'} · ${goal().actionOrder.indexOf(action().id)+1} of ${goal().actionOrder.length}`;
  const completedCount=()=>goal().actionOrder.filter(id=>workspace.actions[id].status==='completed').length;
  function status(){
    const box=$('#storage-status');
    box.innerHTML=error?`<strong role="alert">Not saved${validationError?'':' / real timing stopped'}: ${e(error)}</strong><p>${validationError?'Correct the fields and save again. Your draft is unchanged.':'Keep this page open. Your draft is unchanged. Reload recovers only the last committed checkpoint.'}</p>${!validationError?`<button class="button" data-work="retry">Retry ${pending?'save':'storage'}</button>`:''}<button class="text-button" data-work="export" ${store.raw===null?'disabled':''}>Export raw local records</button>`:!ready?'Opening local storage…':!store.writer?'Open in another tab. This tab is read-only. Close the writer tab, then <button class="text-button" data-work="ownership">Retry ownership</button>.':busy?'Saving…':session()?.interruptionReason?e(session().interruptionReason):'';
    box.hidden=!real||!box.innerHTML;
    if(real){
      main.querySelectorAll('[data-work],form button[type="submit"]').forEach(b=>{if(!b.dataset.readonly)b.disabled=disabled()||(b.dataset.work==='edit'&&running())||(b.dataset.work==='reopen-action'&&!!session());});
      if(busy||pending)main.querySelectorAll('input,textarea,select,[data-draft]').forEach(el=>el.disabled=true);
    }
    if(real&&$('#review').open){
      document.querySelectorAll('#review [data-action],#review button[type="submit"],#review [data-work="undo"]').forEach(b=>b.disabled=disabled());
      if(!$('#review-status')){const div=document.createElement('div');div.id='review-status';$('#review').append(div);}
      $('#review-status').innerHTML=error?`<p role="alert">Not saved: ${e(error)}. Review and draft are unchanged.</p>${pending?'<button class="button" data-work="retry">Retry save</button>':''}`:'';
    }
  }
  function mountainModel(g){
    const actions=g.actionOrder.map(id=>({...workspace.actions[id],hasSavedContext:!!workspace.contexts[id]}));
    return {goalId:g.id,steps:actions,selected:actions.findIndex(a=>a.id===selected)};
  }
  const art=(g=goal())=>ui.routeSVG({goal:true,real:true,finished:g.status==='completed',model:mountainModel(g)});
  function rows(){return goal().actionOrder.map((id,i)=>`<button class="step-row ${workspace.actions[id].status==='completed'?'done':id===action()?.id?'current':''}" data-select="${id}" aria-pressed="${selected===id}"><span class="step-number">${workspace.actions[id].status==='completed'?'✓':i+1}</span><span class="step-name">${e(workspace.actions[id].title)}</span><small>${workspace.actions[id].status==='completed'?'Checked':'Unfinished'}</small></button>`).join('');}
  function detail(){const a=workspace.actions[selected]||action();if(!a)return '';const c=workspace.contexts[a.id];return `<div class="selected-detail" tabindex="0"><span class="eyebrow">Behind this action</span><h3>${e(a.title)}</h3><p class="record-detail">${e([c?.nextInstruction,c?.context].filter(Boolean).join('\n')||'No saved context yet.')}</p></div>${correction()}`;}
  function empty(){return `<section class="empty"><div class="empty-mark" aria-hidden="true">↗</div><h1>A place for your next step.</h1><p>Create a real goal with ordered actions. One open goal at a time.</p>${button('Create a goal','create',true)}<p class="hint">Saved only in this browser on this site address. No sync.</p></section>`;}
  function home(){
    // Keep the approved landing composition; all real-mode content comes from saved work.
    const template=document.createElement('template');template.innerHTML=ui.landingHTML;
    const find=selector=>template.content.querySelector(selector),g=goal(),a=action();
    const finishedCount=Object.values(workspace.goals).filter(g=>g.status==='completed').length;
    const cta=find('.hero-cta');delete cta.dataset.action;
    cta.dataset.work=g?'today':'create';
    cta.innerHTML=`${g?(a?'Continue your goal':'Review your goal'):finishedCount?'Create a new goal':'Create a goal'} <span aria-hidden="true">↗</span>`;
    find('.hero-lead').innerHTML=g?'Your work is here.<br>Come back knowing what to do next.':'Choose one goal. Take one small step.<br>Leave a way back when you pause.';
    find('.hero-copy .hint').textContent=g?'Opening your goal won’t start the timer. Choose Start or Resume when you’re ready.':finishedCount?'Your finished work is here. Start a new goal whenever you’re ready.':'Give your goal a name and add a first action. Nothing is saved until you choose Save.';
    find('.hero-art-heading .eyebrow').textContent=g?g.title:'One step becomes a journey';
    find('.hero-art-heading .eyebrow').classList.add('instruction');
    find('.hero-art-heading .tag').textContent=g?'Your goal · illustrative route':'Illustration · not your progress';
    find('.hero-saved .muted').textContent=g?(a?(context()?.nextInstruction?'Your next move, kept.':'Next unfinished action.'): 'Ready for your review.'):finishedCount?'Work you’ve finished.':'Start with one thing.';
    find('.hero-saved p').textContent=g?(a?instruction():'All actions are checked. Review the goal, add another action, or confirm it’s finished.'):finishedCount?`${finishedCount} finished ${finishedCount===1?'goal':'goals'}. Revisit your work or make room for something new.`:'Choose a goal and the first action you want to take.';
    const illustration={steps:['Choose a goal','Take one step','Save your place','Come back'].map((title,i)=>({id:`illustration-${i}`,title,status:'planned'})),illustration:true,selected:-1};
    find('.mountain-scene').outerHTML=g?art():ui.routeSVG({goal:true,real:true,finished:false,model:illustration});
    return template.innerHTML;
  }
  function today(){
    if(!goal())return empty();
    if(!action())return `${heading('All actions checked. Your goal is still open.')}<div class="workspace"><section class="action-area"><div class="stage-top">${label()}</div><h2 class="instruction">Only you decide if the goal is finished.</h2><p class="hint">${e(goal().definitionOfFinished)}</p><div class="work-actions">${button('Review goal','review',true)}${button('Edit goal / actions','edit')}</div><p class="hint">Add an action, keep this goal open, or explicitly confirm finished.</p></section><section class="scene-panel"><div class="scene-top"><strong>Your goal trail</strong><span>${completedCount()} of ${goal().actionOrder.length} actions checked</span></div>${art()}<p class="hint">Illustrative route · ${formatTime(effort(workspace,goal().id)/1000)} recorded effort</p></section></div><div class="lower"><section>${rows()}</section><section>${detail()}</section></div>`;
    const s=session();
    return `${heading('Pick up where you left off.')}<div class="workspace"><section class="action-area" aria-label="Your next action"><div class="stage-top">${label()}<span class="stage-symbol" aria-hidden="true">↗</span></div><p class="step-label">${actionLabel()}</p><h2 class="instruction">${e(instruction())}</h2>${notes()}<div class="work-actions">${button(running()?'Return to focus':!s?'▶ Start focus':s.remainingMs?'▶ Resume focus':'Review ended block',running()||s?.remainingMs===0?'focus':s?'resume':'start',true)}${button(running()?'Pause & edit place':'Edit saved place','pause')}${!s?`<label class="duration">Block <select id="real-duration"><option value="20">20 min</option><option value="25">25 min</option><option value="45">45 min</option></select></label>`:''}</div><p class="hint">Open your work whenever you’re ready. Start or Resume focus is a separate choice.</p></section><section class="scene-panel"><div class="scene-top"><strong>Your goal trail</strong><span>${completedCount()} of ${goal().actionOrder.length} actions checked</span></div>${art()}<div class="scene-bottom"><span>${formatTime(effort(workspace,goal().id)/1000)} recorded effort</span><button class="text-button" data-work="journey" data-readonly="true">View goal journey ↗</button></div><p class="hint">Illustrative route, not a measure of time or distance.</p></section></div><div class="lower"><section><div class="section-heading"><h3>The path to finished</h3>${button('Edit goal / actions','edit')}</div>${rows()}</section><section>${detail()}<p class="hint">Finished means: ${e(goal().definitionOfFinished)}</p></section></div>`;
  }
  function focus(){
    if(!action())return today();const s=session(),expired=s?.remainingMs===0;
    return `<div class="focus-surround" aria-hidden="true"><i></i><i></i><i></i></div><div class="focus-topline"><span class="eyebrow">One thing at a time.</span><button class="text-button ambience-control" data-action="ambience"></button></div><section class="focus-layout" aria-label="Focus work window">${label()}<p class="step-label">${actionLabel()}</p><div class="focus-copy" tabindex="0" aria-label="Current instruction and optional context"><h2 class="instruction">${e(instruction())}</h2><details class="focus-details"><summary>Saved place & original action</summary>${notes(true)}</details></div><div class="focus-clock" id="clock">${formatTime((s?.remainingMs??duration*60000)/1000)}</div><p class="timer-label">${expired?'Block ended. Action still unfinished.':running()?'remaining · running':'remaining · paused; explicit Resume required'}</p><div class="expiry" aria-label="Extend block">${s?[5,10,20].map(n=>button(`+${n} min`,`extend-${n}`)).join(''):''}</div><div class="work-actions">${!running()&&!expired?button(s?'Resume focus':'Start focus',s?'resume':'start',true):''}${button(running()?'Ⅱ Pause':'Save my place','pause',running())}${button('✓ Complete action','complete')}</div><p class="hint">Conservative local timing. Gaps over 15 seconds interrupt; unverified time is not credited.</p></section><p class="focus-footnote">Work in another tab; Trail doesn’t observe it.</p>`;
  }
  function pause(){return `${heading('Paused')}<section class="pause-area"><span class="pause-marker" aria-hidden="true">Ⅱ</span><h1>Leave yourself a way back.</h1><p class="muted">Timing is stopped. Save a small next move for your return.</p><div class="pause-task">${e(action().title)}</div>
    <form id="real-pause-form"><label for="return-note">When I return, the first thing I’ll do is… <span class="muted">(optional)</span></label><textarea id="return-note" maxlength="4000" placeholder="For example: Open the draft and write the first paragraph.">${e(context()?.nextInstruction||'')}</textarea><p class="hint">Up to 4,000 characters. Leave it blank to keep your saved next move.</p>
    <details id="pause-extras"><summary>Add context or a work link (optional)</summary><label for="pause-context">Where I stopped / what to remember</label><textarea id="pause-context" maxlength="4000">${e(context()?.context||'')}</textarea><label for="work-url">Work link (optional)</label><input id="work-url" type="text" inputmode="url" autocomplete="url" spellcheck="false" aria-describedby="work-url-help" placeholder="https://…" value="${e(context()?.resourceUrl||'')}"><p id="work-url-help" class="hint">Use a full http:// or https:// address, up to 2,048 characters. A blank field keeps your saved link. Trail does not capture or reopen work automatically.</p>${context()?.resourceUrl?'<label class="remove-link" for="remove-resource"><input id="remove-resource" type="checkbox">Remove saved link when I save</label>':''}</details>
    <div class="work-actions"><button class="button primary" type="submit">Save & return to Today</button>${button('Skip for now','skip')}</div><p class="hint">Blank notes keep what you saved before. Skip changes nothing. <kbd>⌘/Ctrl + Enter</kbd> to save.</p></form></section>`;}
  function journey(){if(!goal())return empty();return `${heading('Look at the ground you’ve covered.',goal().title)}<div class="journey-layout"><section class="scene-panel"><div class="scene-top"><strong>Your goal trail</strong><span>${completedCount()} of ${goal().actionOrder.length} actions checked</span></div>${art()}<div class="scene-bottom">${formatTime(effort(workspace,goal().id)/1000)} recorded effort · illustrative route</div><p class="hint">${e(goal().definitionOfFinished)}</p></section><section class="records">${rows()}${detail()}</section></div>`;}
  function editor(){
    return `${heading(draft.goalId?'Edit your goal.':'Choose one thing.','One goal at a time. Save when you’re ready.')}<section class="pause-area"><form id="goal-form"><label for="goal-title">Goal title (required, up to 160 characters)</label><input id="goal-title" maxlength="160" required value="${e(draft.title)}"><label for="goal-definition">What does finished mean? (required, up to 2,000 characters)</label><textarea id="goal-definition" maxlength="2000" required>${e(draft.definition)}</textarea><h3>Your actions · 1–30</h3><p class="hint">Required, up to 500 characters each. ${session()?'You can rename actions while paused. Finish the current action before adding, removing or moving steps.':'Put your actions in the order you want to work on them.'}</p><div id="action-drafts">${draft.actions.map((a,i)=>`<div class="action-draft"><label for="action-${a.id}">Action ${i+1}</label><input id="action-${a.id}" data-draft-id="${a.id}" maxlength="500" required value="${e(a.title)}"><div class="draft-controls">${['up','down','remove'].map(t=>`<button class="text-button" type="button" data-draft="${t}" data-id="${a.id}" ${session()||t==='up'&&i===0||t==='down'&&i===draft.actions.length-1||t==='remove'&&draft.actions.length===1?'disabled':''} aria-label="${t==='up'?'Move up':t==='down'?'Move down':'Remove'} action ${i+1}">${t==='up'?'↑ Move up':t==='down'?'↓ Move down':'Remove'}</button>`).join('')}</div></div>`).join('')}</div><button class="button" type="button" data-draft="add" ${session()||draft.actions.length>=30?'disabled':''}>Add action</button><div class="work-actions"><button class="button primary" type="submit">Save goal</button><button class="text-button" type="button" data-work="cancel">Cancel</button></div></form></section>`;
  }
  function correction(){return workspace.actions[selected]?.status==='completed'?`<p class="hint">Correct a checked action without changing its recorded effort. ${session()?'Finish the current block/action before reopening another.':''}</p>${button('Reopen selected action','reopen-action')}`:'';}
  function historyAction(id){
    const c=workspace.contexts[id];
    return `<div class="finished-action"><p>✓ ${e(workspace.actions[id].title)}</p>${savedAt(c)}${workLink(c)}${c?`<p>${e([c.nextInstruction,c.context].filter(Boolean).join(' · '))}</p>`:''}</div>`;
  }
  function history(){
    const goals=Object.values(workspace.goals).filter(g=>g.status==='completed').sort((a,b)=>b.completedAt-a.completedAt);
    return `${heading('Work worth looking back on.','Actual local goals · outcomes and effort are separate')}<div class="finished-grid">${goals.length?goals.map(g=>`<article class="finished-card"><span class="completed-stamp">✓ Goal explicitly confirmed</span><h2>${e(g.title)}</h2><p>${g.actionOrder.length} actions checked · ${formatTime(effort(workspace,g.id)/1000)} recorded effort</p><p>Completed ${e(new Date(g.completedAt).toLocaleString())}</p>${art(g)}<details><summary>Review actions & saved context</summary><p>${e(g.definitionOfFinished)}</p>${g.actionOrder.map(historyAction).join('')}</details><button class="button" data-reopen-goal="${g.id}" ${disabled()||goal()?'disabled':''}>Reopen goal</button>${goal()?'<p>Another goal is open. Finish it before reopening this one.</p>':'<p>Correction preserves IDs, context and recorded effort.</p>'}</article>`).join(''):'<section class="empty"><h2>Room for what you finish.</h2><p>No finished goals yet. All-checked goals still need explicit confirmation.</p></section>'}<div class="work-actions">${button(goal()?'Return to open goal':'Create a new goal',goal()?'today':'create',true)}</div></div>`;
  }
  function undoHTML(){return workspace.undo?`<aside class="focus-return" aria-label="Latest action completion"><span>Action complete. Undo is available until the next saved change; navigation alone keeps it.</span>${button('Undo latest completion','undo')}</aside>`:'';}
  function showReview(){
    if(!goal()||action())return;
    $('#add-form').hidden=true;$('#new-step').value='';$('.review-goal').textContent=goal().title;
    $('#review-summary').innerHTML=`<span class="summary-check" aria-hidden="true">✓</span><div><strong>${goal().actionOrder.length} of ${goal().actionOrder.length} actions checked</strong><span>${e(goal().definitionOfFinished)}</span>${workspace.undo?button('Undo latest completion','undo'):''}</div>`;
    $('#review>small').textContent='Real local work — finishing requires a committed save.';
    $('#review').showModal();status();$('#review [data-action="confirm"]').focus();
  }
  function strip(){const s=session();return s&&!['focus','pause','edit'].includes(view)?`<aside class="focus-return" aria-label="Local focus status"><span>${running()?'Focus running':s.remainingMs?'Focus paused':'Block ended · unfinished'} · <span id="return-clock">${formatTime(s.remainingMs/1000)}</span></span><button class="text-button" data-work="focus" data-readonly="true">Return to focus</button>${running()?button('Pause','pause'):''}</aside>`:'';}
  function render(moveFocus=false){
    ui.clearMountainFeedback();
    if(!real)return;
    document.body.dataset.view=view;
    main.innerHTML=undoHTML()+strip()+(view==='landing'?home():view==='edit'&&draft?editor():view==='focus'?focus():view==='pause'&&action()?pause():view==='journey'?journey():view==='finished'?history():today());
    document.querySelectorAll('[data-nav]').forEach(b=>{if(b.dataset.nav===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    $('#real-duration')&&($('#real-duration').value=String(duration));
    if(view==='edit'&&draft){
      const recorded=new Set([...Object.values(workspace.sessions).map(s=>s.actionId),...Object.values(workspace.events||{}).map(e=>e.actionId)]);
      main.querySelectorAll('[data-draft="remove"]').forEach(b=>{if(recorded.has(b.dataset.id))b.disabled=true;});
      $('#goal-form .hint').textContent+=' Actions with saved work can’t be removed.';
    }
    if(view==='pause'&&pauseDraft&&action()&&pauseDraft.actionId===action().id){
      $('#return-note').value=pauseDraft.instruction;$('#pause-context').value=pauseDraft.context;
      $('#work-url').value=pauseDraft.resourceUrl;$('#pause-extras').open=pauseDraft.extrasOpen;
      if($('#remove-resource'))$('#remove-resource').checked=pauseDraft.removeResource;
      $('#work-url').readOnly=pauseDraft.removeResource;
    }
    $('.footer').innerHTML='<span>Real records stored in this browser on this site address. Geometry is illustrative.</span><span>No sync. Clearing site data can lose records. No reminders, AI or PiP.</span>';
    ui.updateMotion();status();if(moveFocus){main.focus({preventScroll:true});window.scrollTo(0,0);}
  }
  function go(next){if(pending||busy)return;captureDraft();capturePauseDraft();if($('#review').open)$('#review').close();ui.closeReward();view=next;render(true);}
  async function write(cmd,onSuccess,{background=false}={}){
    if(disabled())return false;
    try{transition(workspace,cmd,Date.now());}catch(err){
      validationError=session()?.status!=='running';
      if(session()?.status==='running'){frozen=true;anchor=null;pending={cmd,onSuccess};}
      error=err.message;status();return false;
    }
    busy=true;validationError=false;status();
    try{
      const saved=await store.commit(workspace,cmd);workspace=saved.workspace;pending=null;error='';busy=false;
      const s=session();
      if(cmd.type==='recover')needsRecovery=false;
      frozen=suspended||needsRecovery||s?.status!=='running';anchor=frozen?null:clock();
      // A write finishing across pagehide/BFCache cannot revive the old running clock.
      if(needsRecovery&&s?.status==='running')return write(command('recover'),()=>{if(onSuccess)onSuccess(saved.applied);else render();});
      if(onSuccess)onSuccess(saved.applied);else if(!background||frozen)render();status();return true;
    }catch(err){busy=false;frozen=true;anchor=null;pending={cmd,onSuccess};error=err.message;status();return false;}
  }
  function timed(type,fields={}){
    const s=session();const measured=running()&&anchor?sample(anchor,clock(),s.remainingMs):{deltaMs:0,interrupted:false};
    return command(type,{...fields,deltaMs:measured.deltaMs,interrupted:measured.interrupted});
  }
  async function stopForNotes(){
    if(running()){
      const cmd=timed('pause');frozen=true;anchor=null;
      await write(cmd,()=>go('pause'));
    }else if(action())go('pause');
  }
  function captureDraft(){if(!draft||!$('#goal-form'))return;draft.title=$('#goal-title').value;draft.definition=$('#goal-definition').value;draft.actions.forEach(a=>{a.title=$(`[data-draft-id="${a.id}"]`).value;});}
  function capturePauseDraft(){
    if(!$('#real-pause-form')||!action())return;
    pauseDraft={actionId:action().id,instruction:$('#return-note').value,context:$('#pause-context').value,resourceUrl:$('#work-url').value,removeResource:$('#remove-resource')?.checked||false,extrasOpen:$('#pause-extras').open};
  }
  async function initialize(){
    busy=true;error='';validationError=false;status();
    try{if(!store.db)await store.open();const owned=await store.acquire();workspace=await store.read();ready=true;busy=false;frozen=true;anchor=null;view=goal()?'today':'landing';if(!owned)error='';render();}
    catch(err){busy=false;ready=false;error=err.message;status();}
  }
  async function changeMode(toReal){
    if(busy||pending){error='Finish or retry the pending save before changing modes.';status();return;}
    if(real){captureDraft();capturePauseDraft();}
    if(!toReal&&running()){
      const cmd=timed('pause');frozen=true;anchor=null;
      if(!await write(cmd,()=>{}))return;
    }
    real=toReal;$('#mode-label').textContent=real?'Real work · local to this browser':'Fictional example · resets on reload';$('#example-controls').hidden=real;
    if(real){ui.leaveExample();try{if(ready)workspace=await store.read();}catch(err){error=err.message;}view=goal()?'today':'landing';render();}
    else{ui.enterExample();$('.footer').innerHTML='<span>Fictional example — not your real records.</span><span>In memory only. Reload resets this example.</span>';status();}
  }
  $('#real-mode').addEventListener('click',()=>changeMode(true));$('#example-mode').addEventListener('click',()=>changeMode(false));
  document.addEventListener('click',async event=>{
    if(!real)return;const b=event.target.closest('button,a.brand');if(!b)return;
    if(b.dataset.nav){go(b.dataset.nav);return;}
    if(b.matches('.brand')){event.preventDefault();go('landing');return;}
    if(b.dataset.action==='today'){go('today');return;}
    if(b.dataset.select){selected=b.dataset.select;render();return;}
    if(b.dataset.reopenGoal){
      if(disabled())return;await write(command('reopen-goal',{goalId:b.dataset.reopenGoal}),()=>{selected=goal().actionOrder[0];go('today');showReview();});return;
    }
    if(b.closest('#review')&&b.dataset.action){
      const type=b.dataset.action;
      if(type==='close-review'){if(!pending&&!busy)$('#review').close();return;}
      if(disabled())return;
      if(type==='add'){$('#add-form').hidden=false;$('#new-step').focus();}
      if(type==='keep-open')await write(command('keep-open'),()=>{$('#review').close();go('today');});
      if(type==='confirm'){
        const title=goal().title,goalId=goal().id;let celebrated=false;
        await write(command('finish-goal',{goalId}),applied=>{$('#review').close();go('finished');if(applied&&!celebrated){celebrated=true;ui.showReward(title,false,mountainModel(workspace.goals[goalId]));}});
      }
      return;
    }
    if(b.dataset.draft){
      if(disabled())return;captureDraft();const i=draft.actions.findIndex(a=>a.id===b.dataset.id);
      if(b.dataset.draft==='add')draft.actions.push({id:crypto.randomUUID(),title:''});
      if(b.dataset.draft==='remove')draft.actions.splice(i,1);
      if(b.dataset.draft==='up')[draft.actions[i-1],draft.actions[i]]=[draft.actions[i],draft.actions[i-1]];
      if(b.dataset.draft==='down')[draft.actions[i+1],draft.actions[i]]=[draft.actions[i],draft.actions[i+1]];
      render();const target=b.dataset.draft==='add'?draft.actions.at(-1).id:b.dataset.id;$(`[data-draft-id="${target}"]`)?.focus();return;
    }
    const type=b.dataset.work;if(!type)return;
    if(['today','journey','finished','focus'].includes(type)){go(type);return;}
    if(type==='export'){
      const blob=new Blob([JSON.stringify(store.raw,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='trail-local-records.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
    }
    if(type==='ownership'){await initialize();return;}
    if(type==='retry'){
      if(pending){
        const retry=pending;pending=null;error='';
        let applied=false;
        const saved=await write(retry.cmd,value=>{applied=value;frozen=true;anchor=null;});
        if(saved){
          if(session()?.status==='running')await write(command('recover'),()=>{if(retry.onSuccess)retry.onSuccess(applied);else render();});
          else if(retry.onSuccess)retry.onSuccess(applied);else render();
        }
      }else await initialize();return;
    }
    if(disabled())return;
    if(type==='create'||type==='edit'){
      if(running())return;const g=goal();if(!draft||draft.goalId!==(g?.id||null))draft={goalId:g?.id||null,title:g?.title||'',definition:g?.definitionOfFinished||'',actions:g?g.actionOrder.map(id=>({id,title:workspace.actions[id].title})):[{id:crypto.randomUUID(),title:''}]};go('edit');$('#goal-title')?.focus();
    }else if(type==='cancel'){draft=null;go('today');}
    else if(type==='start')await write(command('start',{minutes:duration}),()=>go('focus'));
    else if(type==='resume')await write(command('resume'),()=>go('focus'));
    else if(type==='pause')await stopForNotes();
    else if(type==='review')showReview();
    else if(type==='complete'){
      const cmd=running()?timed('complete-action',{actionId:action().id}):command('complete-action',{actionId:action().id});
      const completedGoalId=goal().id,completedActionId=action().id;let celebrated=false;
      frozen=true;anchor=null;await write(cmd,applied=>{selected=action()?.id||selected;go('today');if(applied&&!celebrated){celebrated=true;ui.respondToCompletion(completedGoalId,completedActionId);}if(!action())showReview();});
    }
    else if(type==='undo'){
      const u=workspace.undo;if(!u)return;await write(command('undo',{eventId:u.eventId,expectedRevision:workspace.revision}),()=>{if($('#review').open)$('#review').close();selected=action()?.id;go('today');});
    }
    else if(type==='reopen-action')await write(command('reopen-action',{actionId:selected}),()=>go('today'));
    else if(type==='skip'){go('today');pauseDraft=null;}
    else if(type.startsWith('extend-')){
      const minutes=Number(type.split('-')[1]);await write(running()?timed('extend-running',{minutes}):command('extend',{minutes}),()=>go('focus'));
    }
  });
  document.addEventListener('change',event=>{if(real&&event.target.id==='real-duration')duration=Number(event.target.value);});
  $('#review').addEventListener('cancel',event=>{if(!real)return;event.preventDefault();if(!pending&&!busy){$('#review').close();$('[data-work="review"]')?.focus();}});
  document.addEventListener('input',event=>{if(!real)return;if(validationError){validationError=false;error='';status();}if(event.target.closest('#real-pause-form')){capturePauseDraft();$('#work-url').readOnly=pauseDraft.removeResource;}});
  document.addEventListener('toggle',event=>{if(real&&event.target.id==='pause-extras')capturePauseDraft();},true);
  document.addEventListener('keydown',event=>{
    if(!real||event.isComposing||event.keyCode===229||event.key!=='Enter'||!(event.metaKey||event.ctrlKey)||event.altKey||event.shiftKey)return;
    const form=event.target.closest?.('#real-pause-form');if(!form)return;
    event.preventDefault();if(!disabled())form.requestSubmit();
  });
  document.addEventListener('submit',async event=>{
    if(!real)return;
    if(event.target.id==='goal-form'){
      event.preventDefault();if(disabled())return;captureDraft();await write(command('save-goal',{goalId:draft.goalId,title:draft.title,definition:draft.definition,actions:structuredClone(draft.actions)}),()=>{draft=null;selected=action()?.id;go('today');});
    }else if(event.target.id==='real-pause-form'){
      event.preventDefault();capturePauseDraft();await write(command('notes',{instruction:pauseDraft.instruction,context:pauseDraft.context,resourceUrl:pauseDraft.removeResource?null:pauseDraft.resourceUrl}),()=>{go('today');pauseDraft=null;});
    }else if(event.target.id==='add-form'){
      event.preventDefault();await write(command('add-action',{title:$('#new-step').value}),()=>{$('#review').close();selected=action()?.id;go('today');});
    }
  });
  setInterval(async()=>{
    if(!real||!running()||busy||pending||!anchor)return;
    const measured=sample(anchor,clock(),session().remainingMs);
    const remaining=session().remainingMs-measured.deltaMs;
    for(const id of ['#clock','#return-clock'])if($(id))$(id).textContent=formatTime(remaining/1000);
    if(measured.interrupted||clock().mono-anchor.mono>=CHECKPOINT_MS||remaining===0){
      const cmd=command('checkpoint',{deltaMs:measured.deltaMs,interrupted:measured.interrupted});
      if(measured.interrupted)frozen=true;
      await write(cmd,null,{background:true});
    }
  },250);
  window.addEventListener('pagehide',()=>{suspended=true;needsRecovery=true;frozen=true;anchor=null;});
  window.addEventListener('pageshow',async event=>{
    if(!event.persisted)return;suspended=false;frozen=true;anchor=null;
    if(store.writer&&ready&&!pending&&!busy&&session()?.status==='running')await write(command('recover'),()=>render());
    else if(!busy&&!pending&&session()?.status!=='running')needsRecovery=false;
  });
  render();await initialize();
}
