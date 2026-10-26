import { emptyWorkspace, openGoal, nextAction, activeSession, effort, transition, normalizeResourceUrl } from './state.js';
import { LocalStore } from './storage.js';
import { sample, CHECKPOINT_MS } from './timing.js';
import { deriveActivity, dayKey, shiftDay } from './activity.js';

export async function bootWork(ui){
  const {$,main,escapeHTML:e,formatTime}=ui;
  let workspace=emptyWorkspace(),ready=false,real=true,view='landing',draft=null,selected=null,duration=20;
  let busy=false,pending=null,error='',anchor=null,frozen=true,suspended=false;
  let needsRecovery=false;
  let pauseDraft=null;
  let validationError=null;
  let activityDate=null,activityModel=null;
  let activityInput=null,activityHelp=false,archiveLimit=8;
  const expandedDays=new Set(),expandedGoals=new Set();
  let dayActionsOpen=false,historyInvoker=null;
  let exampleWorkspace=null,realArchivePresentation=null;
  const archiveSource=()=>real?workspace:exampleWorkspace;
  const quantity=(n,word)=>`${n} ${word}${n===1?'':'s'}`;
  function captureActivity(){
    if(!$('#real-activity'))return;
    activityInput=$('#activity-date').value;activityHelp=$('#activity-help').open;
    dayActionsOpen=$('#activity-actions')?.open||false;
    const more=$('#activity-more');if(more){if(more.open)expandedDays.add(activityDate);else expandedDays.delete(activityDate);}
  }
  function activityDetails(){
    const day=activityModel.days.find(d=>d.key===activityDate);
    const list=items=>`<ul>${items.map(item=>`<li><strong>${e(item.goalTitle)}</strong><span>${e(item.title)}</span></li>`).join('')}</ul>`;
    return `<h3>${e(day.label)}</h3><p>${quantity(day.count,'completed action')}</p><details id="activity-actions" ${dayActionsOpen?'open':''}><summary id="activity-actions-toggle">View actions</summary>${day.count?list(day.items.slice(0,8))+(day.count>8?`<details id="activity-more" ${expandedDays.has(day.key)?'open':''}><summary id="activity-more-toggle">Show ${quantity(day.count-8,'more action')}</summary>${list(day.items.slice(8))}</details>`:''):'<p class="muted">No completed actions.</p>'}</details>`;
  }
  function activity(){
    const m=activityModel=deriveActivity(archiveSource());
    if(!m.days.some(d=>d.key===activityDate&&!d.future)){activityDate=m.today;dayActionsOpen=false;}
    return `<section id="real-activity" class="activity-panel" aria-labelledby="activity-title"><div class="activity-heading"><h2 id="activity-title">Your activity</h2><a class="text-button" href="#finished-goals" data-archive-jump>Jump to finished goals</a><span class="hint">${e(m.months[0].label)} – ${e(m.months.at(-1).label)} · <span data-activity-zone>${e(m.timeZone)}</span></span></div>
      <div class="activity-stats"><span><strong data-activity-period>${m.periodTotal}</strong> ${m.periodTotal===1?'action':'actions'} in these 12 months</span><span><strong data-activity-total>${m.total}</strong> all-time</span><span>Current streak: <strong>${m.current}</strong> ${m.current===1?'day':'days'}</span><span>Best streak: <strong>${m.best}</strong> ${m.best===1?'day':'days'}</span></div>
      <div class="activity-scroll" role="region" aria-label="Twelve months of local completed actions" tabindex="0"><div class="activity-calendar">${m.months.map(month=>`<section class="activity-month" aria-label="${e(month.label)}"><h3>${e(month.label)}</h3><div class="activity-month-body"><div class="activity-weekdays" aria-hidden="true">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<span>${d}</span>`).join('')}</div><div class="activity-month-days">${month.slots.map(d=>d?`<button type="button" data-activity-day="${d.key}" data-level="${d.level}" class="activity-day${d.today?' is-today':''}" aria-label="${e(d.label)}: ${quantity(d.count,'completed action')}${d.today?', today':''}${d.future?', unavailable (future)':''}" aria-pressed="${d.key===activityDate}" tabindex="${d.key===activityDate?'0':'-1'}" ${d.future?'disabled':''}></button>`:'<span class="activity-padding" aria-hidden="true"></span>').join('')}</div></div></section>`).join('')}</div></div>
      <div class="activity-legend"><span>Actions / day</span>${['0','1','2–3','4–6','7+'].map((n,i)=>`<span data-level="${i}">${n}</span>`).join('')}<span>Dot: today · outline: selected</span></div>
      <p class="activity-badge">Milestone: ${m.badge?e(m.badge.label):'None earned'}${m.nextBadge?` · Next: ${e(m.nextBadge.label)} at ${quantity(m.nextBadge.count,'action')}`:' · Highest tier reached (25 actions)'}</p>
      <form id="activity-date-form" class="activity-date-control"><label for="activity-date">Choose a date</label><input id="activity-date" type="date" required min="${m.start}" max="${m.today}" value="${e(activityInput??activityDate)}"><button id="activity-view-day" class="button" type="submit" data-readonly="true">View day</button><span id="activity-date-error" role="status"></span></form>
      <details id="activity-help" ${activityHelp?'open':''}><summary id="activity-help-toggle">How this works</summary><p class="hint">Currently checked actions, including corrections. Undo or reopening can reduce counts, streaks and milestones. Browser-local days; future dates are unavailable. No attention or time measurement.</p><p class="hint">Use the date control or select a square. Tab to the selected day; up/down move one day, left/right one week, Home/End to Monday/Sunday (within this period, no future dates). Enter or Space selects. Months wrap on smaller screens; scroll sideways if needed.</p></details>
      <div class="activity-details" aria-live="polite" aria-atomic="true">${activityDetails()}</div></section>`;
  }
  function selectActivity(key){
    const target=$(`[data-activity-day="${key}"]`);if(!target||target.disabled)return;
    captureActivity();if(activityDate!==key)dayActionsOpen=false;activityDate=key;activityInput=key;$('#activity-date').value=key;$('#activity-date-error').textContent='';
    main.querySelectorAll('[data-activity-day]').forEach(b=>{b.tabIndex=b===target?0:-1;b.setAttribute('aria-pressed',String(b===target));});
    $('.activity-details').innerHTML=activityDetails();
  }
  function refreshActivity(){
    if((!real&&!exampleWorkspace)||!$('#real-activity'))return;
    const zone=Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(activityModel?.today===dayKey(Date.now(),zone)&&activityModel?.timeZone===zone)return;
    const focused=document.activeElement,day=focused?.dataset.activityDay,id=focused?.id,scroll=$('.activity-scroll').scrollLeft,region=focused===$('.activity-scroll');
    captureActivity();
    if(!real)exampleWorkspace=ui.refreshExampleRecords?.()||exampleWorkspace;
    $('#real-activity').outerHTML=activity();
    if(day)($(`[data-activity-day="${day}"]:not(:disabled)`)||$(`[data-activity-day="${activityDate}"]`))?.focus({preventScroll:true});
    else if(region)$('.activity-scroll').focus({preventScroll:true});
    else if(id&&$(`#${id}`))$(`#${id}`).focus({preventScroll:true});
    else if(focused?.closest('#real-activity'))$('#activity-date').focus({preventScroll:true});
    $('.activity-scroll').scrollLeft=scroll;
  }
  window.addEventListener('focus',refreshActivity);
  window.addEventListener('pageshow',refreshActivity);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshActivity();});
  setInterval(refreshActivity,1000);
  document.addEventListener('keydown',event=>{
    const b=event.target.closest?.('[data-activity-day]');if((!real&&!exampleWorkspace)||!b||event.altKey||event.metaKey||event.ctrlKey||event.isComposing)return;
    const weekday=(new Date(`${b.dataset.activityDay}T12:00Z`).getUTCDay()+6)%7;
    const delta={ArrowLeft:-7,ArrowRight:7,ArrowUp:-1,ArrowDown:1,Home:-weekday,End:6-weekday}[event.key];
    if(delta===undefined)return;event.preventDefault();
    const key=shiftDay(b.dataset.activityDay,delta),target=$(`[data-activity-day="${key}"]:not(:disabled)`);
    if(target){selectActivity(key);target.focus({preventScroll:true});target.scrollIntoView({block:'nearest',inline:'nearest'});}
  });
  const clock=()=>({wall:Date.now(),mono:performance.now()});
  const store=new LocalStore(async problem=>{
    if(problem){frozen=true;anchor=null;validationError=null;error=problem.message;status();return;}
    if(!store.writer&&!busy){try{workspace=await store.read();if(real&&!draft)render();}catch(err){validationError=null;error=err.message;status();}}
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
  function copyControl(){
    const c=context();return c&&(c.nextInstruction.trim()||c.context.trim()||c.resourceUrl)?`<div class="saved-place-copy"><button type="button" class="text-button" data-copy-place="${e(action().id)}">Copy saved place</button><span class="copy-status" role="status" aria-live="polite"></span><div class="copy-fallback" hidden></div></div>`:'';
  }
  async function copySavedPlace(b){
    if(b.disabled||b.dataset.copyPlace!==action()?.id)return;
    const c=context(),g=goal(),a=action();if(!c||!g||!a)return;
    const brief=[`Goal: ${g.title}`,`Action: ${a.title}`,c.nextInstruction?`Saved next move: ${c.nextInstruction}`:'',c.context?`Where I stopped: ${c.context}`:'',c.resourceUrl?`Work link: ${c.resourceUrl}`:''].filter(Boolean).join('\n\n');
    const area=b.closest('.saved-place-copy'),notice=area.querySelector('.copy-status'),fallback=area.querySelector('.copy-fallback');
    b.disabled=true;notice.textContent='';fallback.replaceChildren();fallback.hidden=true;
    try{
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(brief);
      if(b.isConnected&&real)notice.textContent='Saved place copied.';
    }catch{
      if(!b.isConnected||!real)return;
      notice.textContent='Clipboard unavailable. Copy the text below manually.';
      const label=document.createElement('label'),text=document.createElement('textarea'),help=document.createElement('p'),close=document.createElement('button');
      text.id='saved-place-brief';text.dataset.copyText='true';text.readOnly=true;text.value=brief;text.rows=7;text.spellcheck=false;text.setAttribute('aria-describedby','saved-place-copy-help');
      label.htmlFor=text.id;label.textContent='Saved-place brief';help.id='saved-place-copy-help';help.className='hint';help.textContent='Select this text and use your device’s Copy command. This is a copy convenience, not a backup.';
      close.type='button';close.className='text-button';close.textContent='Close copy text';close.addEventListener('click',()=>{fallback.replaceChildren();fallback.hidden=true;notice.textContent='';b.focus();});
      fallback.append(label,text,help,close);fallback.hidden=false;text.focus();
    }finally{b.disabled=false;}
  }
  function notes(referenceFirst=false){
    const c=context(),original=originalAction(),stopped=c?.context?`<div class="saved-context"><strong>Where I stopped</strong><p>${e(c.context)}</p></div>`:'',reference=savedAt(c)+workLink(c);
    return original+(referenceFirst?reference+stopped:stopped+reference)+copyControl();
  }
  const needsPreview=text=>text.length>240||text.split('\n').length>4;
  const returnPreview=text=>needsPreview(text)?`${Array.from(text.split('\n').slice(0,3).join('\n')).slice(0,160).join('')}…`:text;
  const originalAction=()=>context()?.nextInstruction&&context().nextInstruction.trim()!==action().title.trim()?`<p class="original-step">Action: ${e(action().title)}</p>`:'';
  function returnReference(){
    const c=context();return `${originalAction()}${savedAt(c)}${workLink(c)}${copyControl()}`;
  }
  function expandedReturn(){
    const c=context(),fullMove=needsPreview(instruction()),fullContext=needsPreview(c?.context||'');
    return `${c?.context?`<div class="saved-context"><strong>Where I stopped</strong><p>${e(returnPreview(c.context))}</p></div>`:''}<details class="return-expansion"><summary>Read full saved place</summary>${fullMove?`<strong>${c?.nextInstruction?'Next move':'Action'}</strong><p class="return-full-instruction">${e(instruction())}</p>`:''}${fullContext?`<strong>Where I stopped</strong><p class="return-full-context">${e(c.context)}</p>`:''}</details>`;
  }
  const actionLabel=()=>`${context()?.nextInstruction?'Saved next move':'Next unfinished action'} · ${goal().actionOrder.indexOf(action().id)+1} of ${goal().actionOrder.length}`;
  const completedCount=()=>goal().actionOrder.filter(id=>workspace.actions[id].status==='completed').length;
  function endBlockControl(){return session()&&session().status!=='running'?`<div class="end-block-control">${button('End focus block','end-block')}<p class="hint">Keeps the action unfinished, your saved place and recorded effort. Frees the action order for editing.</p></div>`:'';}
  function clearFormValidation(formId){
    if(busy||pending||!formId||validationError!==formId)return false;
    validationError=null;error='';return true;
  }
  function status(){
    const box=$('#storage-status');
    box.innerHTML=error?`<strong role="alert">Not saved${validationError?'':' / real timing stopped'}: ${e(error)}</strong><p>${validationError?'Correct the fields and save again. Your draft is unchanged.':'Keep this page open. Your draft is unchanged. Reload recovers only the last committed checkpoint.'}</p>${!validationError?`<button class="button" data-work="retry">Retry ${pending?'save':'storage'}</button>`:''}<button class="text-button" data-work="export" ${store.raw===null?'disabled':''}>Export raw local records</button>`:!ready?'Opening local storage…':!store.writer?'Open in another tab. This tab is read-only. Close the writer tab, then <button class="text-button" data-work="ownership">Retry ownership</button>.':busy?'Saving…':session()?.interruptionReason?e(session().interruptionReason):'';
    box.hidden=!real||!box.innerHTML;
    if(real){
      main.querySelectorAll('[data-work],form button[type="submit"]').forEach(b=>{if(!b.dataset.readonly)b.disabled=disabled()||(b.dataset.work==='edit'&&running())||(b.dataset.work==='reopen-action'&&!!session());});
      if(busy||pending)main.querySelectorAll('input:not(#activity-date),textarea:not([data-copy-text]),select,[data-draft]').forEach(el=>el.disabled=true);
      main.querySelectorAll('#remove-instruction,#remove-context,#remove-resource').forEach(el=>el.disabled=disabled());
      main.querySelectorAll('[data-reopen-goal]').forEach(el=>el.disabled=disabled()||!!goal());
    }
    if(real&&$('#review').open){
      document.querySelectorAll('#review [data-action],#review button[type="submit"],#review [data-work="undo"]').forEach(b=>b.disabled=disabled());
      if(!$('#review-status')){const div=document.createElement('div');div.id='review-status';$('#review').append(div);}
      $('#review-status').innerHTML=error?`<p role="alert">Not saved: ${e(error)}. Review and draft are unchanged.</p>${pending?'<button class="button" data-work="retry">Retry save</button>':''}`:'';
    }
  }
  function mountainModel(g){
    const actions=g.actionOrder.map(id=>{const c=workspace.contexts[id];return {...workspace.actions[id],hasSavedContext:!!(c?.nextInstruction?.trim()||c?.context?.trim()||c?.resourceUrl)};});
    return {goalId:g.id,steps:actions,selected:actions.findIndex(a=>a.id===selected),running:g.id===goal()?.id&&running()};
  }
  const art=(g=goal())=>ui.routeSVG({goal:true,real:true,finished:g.status==='completed',model:mountainModel(g)});
  function rows(){return goal().actionOrder.map((id,i)=>`<button class="step-row ${workspace.actions[id].status==='completed'?'done':id===action()?.id?'current':''}" data-select="${id}" aria-pressed="${selected===id}"><span class="step-number">${workspace.actions[id].status==='completed'?'✓':i+1}</span><span class="step-name">${e(workspace.actions[id].title)}</span><small>${workspace.actions[id].status==='completed'?'Checked':'Unfinished'}</small></button>`).join('');}
  function detail(){const a=workspace.actions[selected]||action();if(!a)return '';const c=workspace.contexts[a.id];return `<div class="selected-detail" tabindex="0"><span class="eyebrow">Behind this action</span><h3>${e(a.title)}</h3><p class="record-detail">${e([c?.nextInstruction,c?.context].filter(Boolean).join('\n')||'No saved context yet.')}</p></div>${correction()}`;}
  function empty(){return `<section class="empty"><div class="empty-mark" aria-hidden="true">↗</div><h1>A place for your next step.</h1><p>Create a real goal with ordered actions. One open goal at a time.</p>${button('Create a goal','create',true)}<p class="hint">Saved only in this browser on this site address. No sync.</p></section>`;}
  function home(){
    // Keep the approved landing composition; all real-mode content comes from saved work.
    const template=document.createElement('template');template.innerHTML=ui.landingHTML;
    const find=selector=>template.content.querySelector(selector),g=goal(),a=action();
    find('.hero-copy .eyebrow').textContent='Your productivity and focus companion';
    find('.hero-copy h1').textContent='Pick up where you left off.';
    const finishedCount=Object.values(workspace.goals).filter(g=>g.status==='completed').length;
    const cta=find('.hero-cta');delete cta.dataset.action;
    cta.dataset.work=g?'today':'create';
    cta.innerHTML=`${g?(a?'Continue your goal':'Review your goal'):finishedCount?'Create a new goal':'Start working'} <span aria-hidden="true">↗</span>`;
    find('.hero-lead').textContent=g?'Your work is here. Come back knowing what to do next.':'Plan a goal, focus on one action, and save exactly where to restart. Your next step stays ready when you come back.';
    find('.hero-copy .hint').textContent=g?'Opening your goal won’t start the timer. Choose Start or Resume when you’re ready.':finishedCount?'Your finished work is here. Start a new goal whenever you’re ready.':'Give your goal a name and add a first action. Nothing is saved until you choose Save.';
    {
      find('.hero-discovery')?.remove();
      const discovery=document.createElement('div');discovery.className='hero-discovery';
      discovery.innerHTML='<h2>Try a ready-made demo</h2><div><button type="button" class="button" data-example-entry data-demo-entry="saved">Return to saved work</button><button type="button" class="button" data-demo-entry="activity">Explore sample activity</button><button type="button" class="text-button" data-demo-entry="browse">Browse demo states</button></div><p class="hint">Fictional examples. Your own work stays separate.</p>';
      find('.hero-copy').append(discovery);
    }
    find('.hero-art-heading .eyebrow').textContent=g?g.title:'One step becomes a journey';
    find('.hero-art-heading .eyebrow').classList.add('instruction');
    find('.hero-art-heading .tag').textContent=g?'Your goal · illustrative route':'Illustration · not your progress';
    find('.hero-saved .muted').textContent=g?`Goal: ${g.title}`:finishedCount?`Finished goals: ${finishedCount}`:'Goal: Prepare the workshop update · Fictional example';
    find('.hero-saved p').textContent=g?`Next move: ${a?instruction():'All actions are checked. Review the goal, add another action, or confirm it’s finished.'}`:finishedCount?`Next move: ${finishedCount} finished ${finishedCount===1?'goal':'goals'}. Revisit your work or make room for something new.`:'Next move: Open the capacity table and compare the two room options.';
    find('.landing-foot').innerHTML='<span>Plan → Focus → Save your place</span>';
    const illustration={steps:['Choose a goal','Take one step','Save your place','Come back'].map((title,i)=>({id:`illustration-${i}`,title,status:'planned'})),illustration:true,selected:-1};
    find('.mountain-scene').outerHTML=g?art():ui.routeSVG({goal:true,real:true,finished:false,model:illustration});
    return template.innerHTML;
  }
  function today(){
    if(!goal())return empty();
    if(!action())return `${heading('All actions checked. Your goal is still open.')}<div class="workspace"><section class="action-area"><div class="stage-top">${label()}</div><h2 class="instruction">Only you decide if the goal is finished.</h2><p class="hint">${e(goal().definitionOfFinished)}</p><div class="work-actions">${button('Review goal','review',true)}${button('Edit goal / actions','edit')}</div><p class="hint">Add an action, keep this goal open, or explicitly confirm finished.</p></section><section class="scene-panel"><div class="scene-top"><strong>Your goal trail</strong><span>${completedCount()} of ${goal().actionOrder.length} actions checked</span></div>${art()}<p class="hint">Illustrative route · ${formatTime(effort(workspace,goal().id)/1000)} recorded effort</p></section></div><div class="lower"><section>${rows()}</section><section>${detail()}</section></div>`;
    const s=session(),compact=needsPreview(instruction())||needsPreview(context()?.context||'');
    return `${heading('Pick up where you left off.')}<div class="workspace"><section class="action-area" aria-label="Your next action"><div class="stage-top">${label()}<span class="stage-symbol" aria-hidden="true">↗</span></div><p class="step-label">${actionLabel()}</p><h2 class="instruction">${e(returnPreview(instruction()))}</h2>${compact?returnReference():notes()}<div class="work-actions">${button(running()?'Return to focus':!s?'▶ Start focus':s.remainingMs?'▶ Resume focus':'Review ended block',running()||s?.remainingMs===0?'focus':s?'resume':'start',true)}${button(running()?'Pause & edit place':'Edit saved place','pause')}${!s?`<label class="duration">Block <select id="real-duration"><option value="20">20 min</option><option value="25">25 min</option><option value="45">45 min</option></select></label>`:''}</div><p class="hint">Open your work whenever you’re ready. Start or Resume focus is a separate choice.</p>${compact?expandedReturn():''}</section><section class="scene-panel"><div class="scene-top"><strong>Your goal trail</strong><span>${completedCount()} of ${goal().actionOrder.length} actions checked</span></div>${art()}<div class="scene-bottom"><span>${formatTime(effort(workspace,goal().id)/1000)} recorded effort</span><button class="text-button" data-work="journey" data-readonly="true">View goal journey ↗</button></div><p class="hint">Illustrative route, not a measure of time or distance.</p></section></div><div class="lower"><section><div class="section-heading"><h3>The path to finished</h3>${button('Edit goal / actions','edit')}</div>${rows()}</section><section>${detail()}<p class="hint">Finished means: ${e(goal().definitionOfFinished)}</p></section></div>`;
  }
  function focus(){
    if(!action())return today();const s=session(),expired=s?.remainingMs===0;
    return `<div class="focus-surround" aria-hidden="true"><i></i><i></i><i></i></div><div class="focus-topline"><span class="eyebrow">One thing at a time.</span><button class="text-button ambience-control" data-action="ambience"></button></div><section class="focus-layout" aria-label="Focus work window">${label()}<p class="step-label">${actionLabel()}</p><div class="focus-copy" tabindex="0" aria-label="Current instruction and optional context"><h2 class="instruction">${e(instruction())}</h2><details class="focus-details"><summary>Saved place & original action</summary>${notes(true)}</details></div><div class="focus-clock" id="clock">${formatTime((s?.remainingMs??duration*60000)/1000)}</div><p class="timer-label">${!s?'No active focus block. Action still unfinished. Start a new block when ready.':expired?'Block ended. Action still unfinished.':running()?'remaining · running':'remaining · paused; explicit Resume required'}</p><div class="expiry" aria-label="Extend block">${s?[5,10,20].map(n=>button(`+${n} min`,`extend-${n}`)).join(''):''}</div><div class="work-actions">${!running()&&!expired?button(s?'Resume focus':'Start focus',s?'resume':'start',true):''}${button(running()?'Ⅱ Pause':'Save my place','pause',running())}${button('✓ Complete action','complete')}${!s?button('Edit goal / actions','edit'):''}</div>${endBlockControl()}<p class="hint">Conservative local timing. Gaps over 15 seconds interrupt; unverified time is not credited.</p></section><p class="focus-footnote">Work in another tab; Trail doesn’t observe it.</p>`;
  }
  function pause(){return `<div class="handoff-heading">${heading('Leave yourself a way back.','Timing is stopped. This action stays unfinished.')}</div><section class="pause-area pause-capture"><div class="pause-task"><span class="eyebrow">Current action</span>${e(action().title)}</div>
    <form id="real-pause-form"><label for="return-note">When I return, the first thing I’ll do is… <span class="muted">(optional)</span></label><textarea id="return-note" maxlength="4000" placeholder="For example: Open the draft and write the first paragraph.">${e(context()?.nextInstruction||'')}</textarea><p class="hint">Up to 4,000 characters. Leave it blank to keep your saved next move.</p>${context()?.nextInstruction?'<label class="remove-link" for="remove-instruction"><input id="remove-instruction" type="checkbox">Remove saved next move when I save</label>':''}
    <div class="work-actions"><button class="button primary" type="submit">Save & return to Today</button>${button('Skip for now','skip')}</div><p class="hint">Blank notes keep what you saved before. Skip changes nothing. <kbd>⌘/Ctrl + Enter</kbd> to save.</p>
    <details id="pause-extras"><summary>Add context or a work link (optional)</summary><label for="pause-context">Where I stopped / what to remember</label><textarea id="pause-context" maxlength="4000">${e(context()?.context||'')}</textarea>${context()?.context?'<label class="remove-link" for="remove-context"><input id="remove-context" type="checkbox">Remove saved context when I save</label>':''}<label for="work-url">Work link (optional)</label><input id="work-url" type="text" inputmode="url" autocomplete="url" spellcheck="false" aria-describedby="work-url-help" placeholder="https://…" value="${e(context()?.resourceUrl||'')}"><p id="work-url-help" class="hint">Use a full http:// or https:// address, up to 2,048 characters. A blank field keeps your saved link. Trail does not capture or reopen work automatically.</p>${context()?.resourceUrl?'<label class="remove-link" for="remove-resource"><input id="remove-resource" type="checkbox">Remove saved link when I save</label>':''}</details></form></section>`;}
  function journey(){if(!goal())return empty();return `${heading('Look at the ground you’ve covered.',goal().title)}<div class="journey-layout"><section class="scene-panel"><div class="scene-top"><strong>Your goal trail</strong><span>${completedCount()} of ${goal().actionOrder.length} actions checked</span></div>${art()}<div class="scene-bottom">${formatTime(effort(workspace,goal().id)/1000)} recorded effort · illustrative route</div><p class="hint">${e(goal().definitionOfFinished)}</p></section><section class="records">${rows()}${detail()}</section></div>`;}
  function editor(){
    return `${heading(draft.goalId?'Edit your goal.':'Choose one thing.','One goal at a time. Save when you’re ready.')}<section class="pause-area"><form id="goal-form"><label for="goal-title">Goal title (required, up to 160 characters)</label><input id="goal-title" maxlength="160" required value="${e(draft.title)}"><label for="goal-definition">What does finished mean? (required, up to 2,000 characters)</label><textarea id="goal-definition" maxlength="2000" required>${e(draft.definition)}</textarea><h3>Your actions · 1–30</h3><p class="hint">Required, up to 500 characters each. ${session()?'You can rename actions while paused. End the focus block below to add or move steps without completing the action.':'Put your actions in the order you want to work on them.'}</p>${endBlockControl()}<div id="action-drafts">${draft.actions.map((a,i)=>`<div class="action-draft"><label for="action-${a.id}">Action ${i+1}</label><input id="action-${a.id}" data-draft-id="${a.id}" maxlength="500" required value="${e(a.title)}"><div class="draft-controls">${['up','down','remove'].map(t=>`<button class="text-button" type="button" data-draft="${t}" data-id="${a.id}" ${session()||t==='up'&&i===0||t==='down'&&i===draft.actions.length-1||t==='remove'&&draft.actions.length===1?'disabled':''} aria-label="${t==='up'?'Move up':t==='down'?'Move down':'Remove'} action ${i+1}">${t==='up'?'↑ Move up':t==='down'?'↓ Move down':'Remove'}</button>`).join('')}</div></div>`).join('')}</div><button class="button" type="button" data-draft="add" ${session()||draft.actions.length>=30?'disabled':''}>Add action</button><div class="work-actions"><button class="button primary" type="submit">Save goal</button><button class="text-button" type="button" data-work="cancel">Cancel</button></div></form></section>`;
  }
  function correction(){return workspace.actions[selected]?.status==='completed'?`<p class="hint">Correct a checked action without changing its recorded effort. ${session()?'Finish the current block/action before reopening another.':''}</p>${button('Reopen selected action','reopen-action')}`:'';}
  function historyAction(id){
    const source=archiveSource(),c=source.contexts[id],a=source.actions[id];
    return `<div class="finished-action"><h3>✓ ${e(a.title)}</h3><p>Completed ${e(new Date(a.completedAt).toLocaleString())}</p>${savedAt(c)}${workLink(c)}${c?`<p>${e([c.nextInstruction,c.context].filter(Boolean).join('\n'))}</p>`:''}</div>`;
  }
  const finishedGoals=()=>Object.values(archiveSource().goals).filter(g=>g.status==='completed').sort((a,b)=>b.completedAt-a.completedAt);
  function archiveCards(goals){
    return goals.map(g=>`<article class="finished-card" data-priority="${g.priority??'normal'}" data-finished-goal="${g.id}">${ui.finishedArt()}<span class="completed-stamp">${real?'✓ Goal explicitly confirmed':'Fictional example'} · <strong>${({low:'Low',normal:'Normal',important:'Important'})[g.priority??'normal']}</strong></span><h2 aria-label="${e(g.title)}"><button class="archive-title" type="button" data-completed-goal="${g.id}" aria-haspopup="dialog" aria-label="View completed work: ${e(g.title)}" title="View completed work">${e(g.title)}</button></h2><p>${quantity(g.actionOrder.length,'action')} checked · ${real?`${formatTime(effort(workspace,g.id)/1000)} recorded effort`:'no effort simulated'}</p><p>Completed ${e(new Date(g.completedAt).toLocaleString())}${real?'':' · example date'}</p><button class="button" data-reopen-goal="${g.id}" ${!real||disabled()||goal()?'disabled':''}>Reopen goal</button>${!real?'<p class="finished-help">Sample archive is read-only. Real work supports guarded corrections.</p>':goal()?'<p class="finished-help">Another goal is open. Finish it before reopening this one.</p>':''}</article>`).join('');
  }
  function showHistory(id,invoker){
    const g=archiveSource()?.goals[id];if(!g||g.status!=='completed'||$('#review').open||$('#reward').open)return;
    historyInvoker=invoker;$('#history-detail-title').textContent=g.title;
    $('#history-detail-body').innerHTML=`<p>${real?'Read-only completed work':'Fictional example · read-only sample work'}</p><p>${e(g.definitionOfFinished)}</p><p>Priority: ${e(g.priority??'normal')} · Completed ${e(new Date(g.completedAt).toLocaleString())}</p>${g.actionOrder.map(historyAction).join('')}<p class="hint">Real work corrections preserve IDs, context and recorded effort.</p>`;
    $('#history-detail').showModal();$('#history-detail-close').focus();
  }
  $('#history-detail-close').addEventListener('click',()=>$('#history-detail').close());
  $('#history-detail').addEventListener('close',()=>{if(historyInvoker?.isConnected)historyInvoker.focus({preventScroll:true});historyInvoker=null;});
  function captureArchive(){
    main.querySelectorAll('[data-finished-goal] details').forEach(el=>{const id=el.closest('[data-finished-goal]').dataset.finishedGoal;if(el.open)expandedGoals.add(id);else expandedGoals.delete(id);});
  }
  function history(){
    const goals=finishedGoals(),shown=Math.min(archiveLimit,goals.length);
    return `${heading('Work worth looking back on.',real?'Actual local goals · outcomes and effort are separate':'Fictional example · sample dates, not your records')}<div class="finished-grid">${goals.length?archiveCards(goals.slice(0,shown)):'<section class="empty"><h2>Room for what you finish.</h2><p>No finished goals yet. All-checked goals still need explicit confirmation.</p></section>'}</div><div class="archive-controls"><p id="archive-count" tabindex="-1" role="status">Showing ${shown} of ${quantity(goals.length,'finished goal')}</p><button type="button" class="button" data-archive-more ${shown===goals.length?'hidden':''}>Show more</button></div><div class="work-actions">${real?button(goal()?'Return to open goal':'Create a new goal',goal()?'today':'create',true):'<button class="button" data-example-scene="saved">Return to saved work example</button><button class="text-button" data-example-scene="browse">Browse demo states</button>'}</div>`;
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
    captureActivity();captureArchive();if(view==='finished'&&document.body.dataset.view!=='finished')dayActionsOpen=false;
    ui.clearMountainFeedback();
    if(!real)return;
    document.body.dataset.view=view;
    main.innerHTML=undoHTML()+strip()+(view==='landing'?home():view==='edit'&&draft?editor():view==='focus'?focus():view==='pause'&&action()?pause():view==='journey'?journey():view==='finished'?history():today());
    document.querySelectorAll('[data-nav]').forEach(b=>{if(b.dataset.nav===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    if(view==='finished')$('.page-heading').insertAdjacentHTML('afterend',activity());
    if(view==='finished')$('.finished-grid').insertAdjacentHTML('beforebegin',`<h2 id="finished-goals" tabindex="-1">Finished goals (${finishedGoals().length})</h2>`);
    $('#real-duration')&&($('#real-duration').value=String(duration));
    if(view==='edit'&&draft){
      $('#goal-definition').insertAdjacentHTML('afterend',`<label for="goal-priority">Priority</label><select id="goal-priority" aria-describedby="priority-help">${['low','normal','important'].map(p=>`<option value="${p}" ${p===draft.priority?'selected':''}>${p[0].toUpperCase()+p.slice(1)}</option>`).join('')}</select><p id="priority-help" class="hint">Changes the label and card colour; action order stays yours.</p>`);
      const recorded=new Set([...Object.keys(workspace.contexts),...Object.values(workspace.sessions).map(s=>s.actionId),...Object.values(workspace.events||{}).map(e=>e.actionId)]);
      main.querySelectorAll('[data-draft="remove"]').forEach(b=>{
        if(!recorded.has(b.dataset.id)&&workspace.actions[b.dataset.id]?.status!=='completed')return;
        b.disabled=true;const explanation=document.createElement('p');explanation.id=`protected-${b.dataset.id}`;explanation.className='hint';explanation.textContent='This action has saved context or recorded work and can’t be removed.';b.setAttribute('aria-describedby',explanation.id);b.closest('.action-draft').append(explanation);
      });
      $('#goal-form h3').nextElementSibling.textContent+=' Actions with saved context or recorded work can’t be removed.';
    }
    if(view==='pause'&&pauseDraft&&action()&&pauseDraft.actionId===action().id){
      $('#return-note').value=pauseDraft.instruction;$('#pause-context').value=pauseDraft.context;
      $('#work-url').value=pauseDraft.resourceUrl;$('#pause-extras').open=pauseDraft.extrasOpen;
      if($('#remove-resource'))$('#remove-resource').checked=pauseDraft.removeResource;
      if($('#remove-instruction'))$('#remove-instruction').checked=pauseDraft.removeInstruction;
      if($('#remove-context'))$('#remove-context').checked=pauseDraft.removeContext;
      $('#return-note').readOnly=!!pauseDraft.removeInstruction;$('#pause-context').readOnly=!!pauseDraft.removeContext;
      $('#work-url').readOnly=pauseDraft.removeResource;
    }
    $('.footer').innerHTML='<span>Real records stored in this browser on this site address. Geometry is illustrative.</span><span>No sync. Clearing site data can lose records. No reminders, AI or PiP.</span>';
    ui.updateMotion();status();if(moveFocus){main.focus({preventScroll:true});window.scrollTo(0,0);}
  }
  function go(next){if(pending||busy)return;captureDraft();capturePauseDraft();if($('#review').open)$('#review').close();if($('#history-detail').open)$('#history-detail').close();ui.closeReward();if(next==='finished'&&view!=='finished')dayActionsOpen=false;view=next;render(true);}
  async function write(cmd,onSuccess,{background=false}={}){
    if(disabled())return false;
    try{transition(workspace,cmd,Date.now());}catch(err){
      validationError=session()?.status!=='running'?({notes:'real-pause-form','save-goal':'goal-form','add-action':'add-form'}[cmd.type]||'command'):null;
      if(session()?.status==='running'){frozen=true;anchor=null;pending={cmd,onSuccess};}
      error=err.message;status();return false;
    }
    busy=true;validationError=null;status();
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
  function captureDraft(){if(!draft||!$('#goal-form'))return;draft.title=$('#goal-title').value;draft.definition=$('#goal-definition').value;draft.priority=$('#goal-priority').value;draft.actions.forEach(a=>{a.title=$(`[data-draft-id="${a.id}"]`).value;});}
  function capturePauseDraft(){
    if(!$('#real-pause-form')||!action())return;
    pauseDraft={actionId:action().id,instruction:$('#return-note').value,context:$('#pause-context').value,resourceUrl:$('#work-url').value,removeResource:$('#remove-resource')?.checked||false,removeInstruction:$('#remove-instruction')?.checked||false,removeContext:$('#remove-context')?.checked||false,extrasOpen:$('#pause-extras').open};
  }
  async function initialize(){
    busy=true;error='';validationError=null;status();
    try{if(!store.db)await store.open();const owned=await store.acquire();workspace=await store.read();ready=true;busy=false;frozen=true;anchor=null;view=goal()?'today':'landing';if(!owned)error='';render();}
    catch(err){busy=false;ready=false;error=err.message;status();}
  }
  async function changeMode(toReal,entry='saved'){
    if(busy||pending){error='Finish or retry the pending save before changing modes.';status();return;}
    if(real){captureDraft();capturePauseDraft();captureActivity();captureArchive();realArchivePresentation={activityDate,activityInput,activityHelp,archiveLimit,dayActionsOpen};}
    if(!toReal&&running()){
      const cmd=timed('pause');frozen=true;anchor=null;
      if(!await write(cmd,()=>{}))return;
    }
    real=toReal;$('#mode-label').textContent=real?'Real work · local to this browser':'Fictional example · resets on reload · Use Real work to return';$('#example-controls').hidden=real;
    if(real){ui.leaveExample();main.replaceChildren();exampleWorkspace=null;if(realArchivePresentation){({activityDate,activityInput,activityHelp,archiveLimit,dayActionsOpen}=realArchivePresentation);}try{if(ready)workspace=await store.read();}catch(err){validationError=null;error=err.message;}view=goal()?'today':'landing';render();}
    else{ui.enterExample(entry);$('.footer').innerHTML='<span>Fictional example — not your real records.</span><span>In memory only. Reload resets this example.</span>';status();}
  }
  $('#real-mode').addEventListener('click',()=>changeMode(true));$('#example-mode').addEventListener('click',()=>changeMode(false));
  document.addEventListener('click',async event=>{
    const jump=event.target.closest('[data-archive-jump]');if(jump){event.preventDefault();$('#finished-goals')?.focus();$('#finished-goals')?.scrollIntoView({block:'start'});return;}
    const b=event.target.closest('button,a.brand');if(!b)return;
    if(b.dataset.completedGoal){showHistory(b.dataset.completedGoal,b);return;}
    if(b.dataset.activityDay){selectActivity(b.dataset.activityDay);return;}
    if(b.hasAttribute('data-archive-more')){
      const goals=finishedGoals(),shown=main.querySelectorAll('[data-finished-goal]').length;archiveLimit+=8;
      $('.finished-grid').insertAdjacentHTML('beforeend',archiveCards(goals.slice(shown,archiveLimit)));
      const count=Math.min(archiveLimit,goals.length);$('#archive-count').textContent=`Showing ${count} of ${quantity(goals.length,'finished goal')}`;
      b.hidden=count===goals.length;if(b.hidden)$('#archive-count').focus({preventScroll:true});return;
    }
    if(!real)return;
    if(b.dataset.demoEntry){await changeMode(false,b.dataset.demoEntry);return;}
    if(b.hasAttribute('data-example-entry')){await changeMode(false);return;}
    if(b.dataset.copyPlace){await copySavedPlace(b);return;}
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
      if(running())return;const g=goal();if(!draft||draft.goalId!==(g?.id||null))draft={goalId:g?.id||null,title:g?.title||'',definition:g?.definitionOfFinished||'',priority:g?.priority??'normal',actions:g?g.actionOrder.map(id=>({id,title:workspace.actions[id].title})):[{id:crypto.randomUUID(),title:''}]};go('edit');$('#goal-title')?.focus();
    }else if(type==='cancel'){clearFormValidation('goal-form');draft=null;go('today');}
    else if(type==='start')await write(command('start',{minutes:duration}),()=>go('focus'));
    else if(type==='resume')await write(command('resume'),()=>go('focus'));
    else if(type==='pause')await stopForNotes();
    else if(type==='end-block'){
      if(session()?.status==='running'){validationError='command';error='Pause first before ending this focus block.';status();return;}
      captureDraft();await write(command('end-block',{sessionId:session()?.id,ownerToken:workspace.ownerToken,expectedRevision:workspace.revision}),()=>render(true));
    }
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
    else if(type==='skip'){clearFormValidation('real-pause-form');go('today');pauseDraft=null;}
    else if(type.startsWith('extend-')){
      const minutes=Number(type.split('-')[1]);await write(running()?timed('extend-running',{minutes}):command('extend',{minutes}),()=>go('focus'));
    }
  });
  document.addEventListener('change',event=>{if(real&&event.target.id==='real-duration')duration=Number(event.target.value);});
  $('#review').addEventListener('cancel',event=>{if(!real)return;event.preventDefault();if(!pending&&!busy){$('#review').close();$('[data-work="review"]')?.focus();}});
  document.addEventListener('input',event=>{if(!real)return;if(clearFormValidation(event.target.closest('form')?.id))status();if(event.target.closest('#real-pause-form')){capturePauseDraft();$('#work-url').readOnly=pauseDraft.removeResource;$('#return-note').readOnly=pauseDraft.removeInstruction;$('#pause-context').readOnly=pauseDraft.removeContext;}});
  document.addEventListener('toggle',event=>{if(real&&event.target.id==='pause-extras')capturePauseDraft();},true);
  document.addEventListener('keydown',event=>{
    if(!real||event.isComposing||event.keyCode===229||event.key!=='Enter'||!(event.metaKey||event.ctrlKey)||event.altKey||event.shiftKey)return;
    const form=event.target.closest?.('#real-pause-form');if(!form)return;
    event.preventDefault();if(!disabled())form.requestSubmit();
  });
  document.addEventListener('submit',async event=>{
    if(event.target.id==='activity-date-form'){
      event.preventDefault();const key=$('#activity-date').value;
      if(activityModel.days.some(d=>d.key===key&&!d.future))selectActivity(key);
      else $('#activity-date-error').textContent='Choose a date in the displayed period, no later than today.';
      return;
    }
    if(!real)return;
    if(event.target.id==='goal-form'){
      event.preventDefault();if(disabled())return;captureDraft();await write(command('save-goal',{goalId:draft.goalId,title:draft.title,definition:draft.definition,priority:draft.priority,actions:structuredClone(draft.actions)}),()=>{draft=null;selected=action()?.id;go('today');});
    }else if(event.target.id==='real-pause-form'){
      event.preventDefault();capturePauseDraft();await write(command('notes',{instruction:pauseDraft.removeInstruction?'':pauseDraft.instruction,context:pauseDraft.removeContext?'':pauseDraft.context,removeInstruction:pauseDraft.removeInstruction,removeContext:pauseDraft.removeContext,resourceUrl:pauseDraft.removeResource?null:pauseDraft.resourceUrl}),()=>{go('today');pauseDraft=null;});
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
  ui.installSharedViews?.({
    history(source){
      if(exampleWorkspace!==source){activityDate=null;activityInput=null;activityHelp=false;archiveLimit=8;dayActionsOpen=false;}
      exampleWorkspace=source;
      const template=document.createElement('template');template.innerHTML=history();
      template.content.querySelector('.page-heading').insertAdjacentHTML('afterend',activity());
      template.content.querySelector('.finished-grid').insertAdjacentHTML('beforebegin',`<h2 id="finished-goals" tabindex="-1">Finished goals (${finishedGoals().length})</h2>`);
      return template.innerHTML;
    },
    close(){if($('#history-detail').open)$('#history-detail').close();}
  });
  render();await initialize();
}
