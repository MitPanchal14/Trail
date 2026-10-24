'use strict';
// Isolated fictional model. No production imports, persistence, providers or permissions.
const $ = (selector) => document.querySelector(selector);
const main = $('#main');
const dialog = $('#review');
const standardInstruction = 'Compare precision and recall for the two saved runs; add three sentences to the results section.';
const longInstruction = `${standardInstruction} Open the baseline and revised-run notes side by side. Explain what each metric measures, check that both runs use the same held-out split, and describe the trade-off without inventing scores. If a result is missing, leave a clearly marked question rather than guessing. Finish by reading the paragraph in context and listing anything that still needs checking before submission.`;
const initialSteps = ['Prepare the dataset and split', 'Run & save the baseline', standardInstruction, 'Proofread the results and submit the assignment'];
let state;
let celebrationTimeout;
let headlineTimeout;
let noticeTimeout;
let completionSnapshot = null;
let theme = 'light';
let ambience = true;
let routePreview = null;
let routeSequence = 0;
const makeStep = (title, context='') => ({title, nextInstruction:'', context});
const currentStep = () => state.steps[state.completed];
const comparisonTitle = 'Compare runs & write the results';
const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function reset() {
  clearTimeout(celebrationTimeout);
  clearTimeout(headlineTimeout);
  clearTimeout(noticeTimeout);
  if (dialog.open) dialog.close();
  document.body.classList.remove('celebrating');
  $('#notice').textContent = '';
  $('#add-form').hidden = true;
  $('#new-step').value = '';
  state = {view:'today', steps:initialSteps.map((title,i)=>makeStep(title, i===2?'The baseline run is complete. The comparison still needs writing.':i===0?'The dataset and split were prepared in this fictional example. No actual dataset is connected.':i===1?'The example baseline run is complete. No scores or research findings are fabricated.':'')), completed:2, seconds:20*60, elapsedSeconds:0, duration:20, running:false, deadline:0, blockStarted:false, finished:false, long:false, selected:1};
  completionSnapshot = null;
  routePreview = null;
  state.steps[2].nextInstruction = 'Open the saved comparison table. Write the first three sentences about precision and recall.';
  render();
}
function routeSVG({goal=false, finished=state.finished}={}) {
  // Fixed illustrative spacing, not minutes-to-distance. Existing slots retain identity when a fifth step is added.
  const id=`trail-${++routeSequence}`;
  const slots=state.steps.map((_,i)=>i<5?[[85,340],[215,290],[345,215],[465,140],[550,65]][i]:[550+(i-4)*105,65]);
  const width=Math.max(640,slots.at(-1)[0]+160);
  const active=routePreview??state.selected;
  const labels=['Dataset','Baseline','Comparison','Proofread'];
  const segments=slots.map(([x,y],i)=>{if(!goal&&i===0)return '';const [px,py]=!goal&&i===1?[125,325]:i?slots[i-1]:[20,365];return `<path class="route-segment ${i<state.completed?'earned':''} ${i===active?'highlighted':''}" data-segment="${i}" d="M${px} ${py} C${px+65} ${py},${x-60} ${y},${x} ${y}" fill="none" stroke="url(#${id}-light)"/>`;}).join('');
  const markers=slots.map(([x,y],i)=>`<g class="milestone ${!goal&&i===0?'earlier':''} ${i<state.completed?'earned':i===state.completed?'current':'planned'} ${i===active?'highlighted':''}" data-marker="${i}" transform="translate(${x} ${y})"><ellipse class="stone-shadow" cy="22" rx="45" ry="12"/><path class="stone-side" d="M-42 0L0 24L42 0V9L0 33L-42 9Z"/><path class="stone-top" d="M-42 0L0-24L42 0L0 24Z"/><path class="stone-edge" d="M-42 0L0-24L42 0" fill="none" stroke="url(#${id}-light)"/><circle class="saved-ring" cy="-7" r="17"/><circle class="marker-core" cy="-7" r="12"/><text class="marker-symbol" y="-2" text-anchor="middle">${i<state.completed?'✓':i+1}</text><text class="route-label" x="0" y="57" text-anchor="middle">${labels[i]||`Step ${i+1}`}</text><text class="route-state" x="0" y="74" text-anchor="middle">${!goal&&i===0?'Friday · earlier':i<state.completed?'Checked':i===state.completed?'Saved · unfinished':'Planned'}</text></g>`).join('');
  return `<svg class="route-art" viewBox="0 0 ${width} 440" role="img" aria-label="${goal?'Whole-goal illustrative luminous route, including Friday’s dataset step.':'Today’s illustrative luminous route shows the baseline, comparison and upcoming work; Friday’s dataset step is in the whole-goal journey.'} ${state.completed} of ${state.steps.length} steps checked in the goal. ${finished?'Goal explicitly finished.':'Ring marks the saved unfinished step; numbered surfaces are planned work.'}"><defs><linearGradient id="${id}-light" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#75d7dc"/><stop offset=".35" stop-color="#4167ec"/><stop offset=".7" stop-color="#7849df"/><stop offset="1" stop-color="#f7b49d"/></linearGradient><radialGradient id="${id}-haze"><stop stop-color="#9b8be4" stop-opacity=".16"/><stop offset="1" stop-color="#9b8be4" stop-opacity="0"/></radialGradient></defs><ellipse cx="330" cy="250" rx="300" ry="180" fill="url(#${id}-haze)"/><g class="route-guides" fill="none"><path d="M20 395L610 60M60 425L630 100M0 310L540 0"/></g><g class="route-underlay">${segments}</g><g class="route-lines">${segments}</g>${markers}<g class="destination-token" transform="translate(${width-58} 26)"><path d="M-13 25V-2C-13-24 16-24 16-2V25H7V-2C7-12-4-12-4-2V25Z" fill="url(#${id}-light)"/><text class="route-label" x="0" y="45" text-anchor="middle">${finished?'Finished ✓':'Goal'}</text></g></svg>`;
}
function landing(){return `<section class="landing"><div class="hero-copy"><p class="eyebrow">A little focus. A way back.</p><h1>Nail the<br><span class="hero-trail">Trail<span class="hero-period">.</span></span></h1><p class="hero-lead">Start focused work. Save your next step.<br>Come back knowing what to do.</p><button class="button primary hero-cta" data-action="today">Start working <span aria-hidden="true">↗</span></button><p class="hint">Explore a fictional workday. Nothing starts until you do.</p></div><div class="hero-journey"><div class="hero-art-heading"><span class="eyebrow">One step becomes a journey</span><span class="tag">Live example</span></div>${routeSVG({goal:true})}<div class="hero-saved"><span class="saved-dot" aria-hidden="true"></span><div><span class="muted">Your next move, kept.</span><p>${escapeHTML(instruction())}</p></div></div></div></section><div class="landing-foot"><span><b>01</b> Choose one thing.</span><span><b>02</b> Leave a way back.</span><span><b>03</b> See how far you came.</span></div>`;}
const heading = (title,sub='') => `<div class="page-heading"><div><h1>${title}</h1>${sub?`<p class="muted">${sub}</p>`:''}</div><span class="date">Saturday, October 24 <span class="muted">· example</span></span></div>`;
const goalLabel = () => '<p class="goal-label"><span class="goal-icon" aria-hidden="true">↗</span> Finish my ML assignment</p>';
function instruction(){return currentStep()?.nextInstruction || currentStep()?.title || (state.finished?'This goal is finished. Revisit the work you checked.':'Review the finished steps and decide whether the goal is complete.');}
function originalTitle(){return currentStep()?.nextInstruction?`<p class="original-step">Original step: ${escapeHTML(currentStep().title)}</p>`:'';}
function savedContext(){return currentStep()?.context?`<div class="saved-context"><strong>Where you left off · optional context</strong><p>${escapeHTML(currentStep().context)}</p></div>`:'';}
function stepName(i){return i===2?comparisonTitle:state.steps[i].title;}
function stepContext(i){const step=state.steps[i];return [step.nextInstruction,step.context].filter(Boolean).join('\n')||'A planned action in this fictional example. No actual submission or external work is observed.';}
function stepsHTML(){return state.steps.map((step,i)=>`<button class="step-row ${i<state.completed?'done':i===state.completed?'current':''}" data-record="${i}" aria-pressed="${state.selected===i}"><span class="step-number">${i<state.completed?'✓':i+1}</span><span class="step-name">${escapeHTML(stepName(i))}</span><small>${i<state.completed?'Checked':i===state.completed?'Unfinished':'Planned'}</small></button>`).join('');}
function recordDetail(){return `<div class="selected-detail" tabindex="0" aria-label="Selected step context"><span class="eyebrow">Behind this step</span><h3 id="detail-heading">${escapeHTML(stepName(state.selected))}</h3><p class="record-detail">${escapeHTML(stepContext(state.selected))}</p></div>`;}
function highlightRecord(index){document.querySelectorAll('[data-marker],.route-lines [data-segment]').forEach(el=>el.classList.toggle('highlighted',Number(el.dataset.marker??el.dataset.segment)===index));document.querySelectorAll('[data-record]').forEach(el=>el.classList.toggle('previewed',Number(el.dataset.record)===index));if($('#detail-heading'))$('#detail-heading').textContent=stepName(index);if($('.record-detail'))$('.record-detail').textContent=stepContext(index);}
function routeStatus(){return state.finished?'Goal finished ✓':currentStep()?`Next: step ${state.completed+1} of ${state.steps.length}`:'All steps checked · goal open';}
function scene(){return `<section class="scene-panel" aria-label="Today's illustrative route"><div class="scene-top"><strong>Today’s trail</strong><span>Goal · ${state.completed} of ${state.steps.length} checked</span></div>${routeSVG()}<div class="scene-bottom"><span>45 min today · illustrative <span class="tag">${routeStatus()}</span></span><button class="text-button" data-action="journey">View goal journey ↗</button></div><p class="hint">Today’s sessions + upcoming steps. Friday’s separate marker is earlier context.</p></section>`;}
function today(){return `${heading(state.finished?'A goal, brought home.':'Pick up where you left off.')}<div class="workspace"><section class="action-area" aria-label="Your next action"><div class="stage-top">${goalLabel()}<span class="stage-symbol" aria-hidden="true">↗</span></div><p class="step-label">${state.finished?'Goal explicitly confirmed':currentStep()?`Next action · step ${state.completed+1} of ${state.steps.length}`:'All planned steps checked · goal still open'}</p><h2 class="instruction">${escapeHTML(instruction())}</h2>${originalTitle()}${savedContext()}<div class="work-actions"><button class="button primary" data-action="${state.finished?'finished':!currentStep()?'review':state.running||state.blockStarted&&state.seconds===0?'return-focus':'resume'}">${state.finished?'Revisit finished work':!currentStep()?'Review goal':state.running?'Return to focus':state.blockStarted&&state.seconds===0?'Review ended block':'<span aria-hidden="true">▶</span> Resume focus'}</button>${currentStep()?`<button class="text-button" data-action="pause">${state.running?'Pause & edit place':'Edit saved place'}</button>${!state.blockStarted?`<label class="duration">Block <select id="duration" aria-label="Focus block duration"><option value="20" ${state.duration===20?'selected':''}>20 min</option><option value="25" ${state.duration===25?'selected':''}>25 min</option><option value="45" ${state.duration===45?'selected':''}>45 min</option></select></label>`:''}`:''}</div><p class="hint">${state.finished?'Finished work stays available. Visiting it does not celebrate again.':'One small next move. Your earlier work is still here.'}</p></section>${scene()}</div><div class="lower"><section><div class="section-heading"><h3>The path to finished</h3><span>${state.completed} of ${state.steps.length} checked</span></div>${stepsHTML()}</section><section>${recordDetail()}<div class="history-line"><span>Whole goal · fixed illustration</span><strong>70 min across 2 days</strong></div><div class="history-line"><span>Current example status</span><strong>${routeStatus()}</strong></div></section></div>`;}
function focus(){
  const expired=state.view==='expired';
  return `<div class="focus-surround" aria-hidden="true"><i></i><i></i><i></i></div><div class="focus-topline"><span class="eyebrow">${expired?'A good place to check in.':'One thing at a time.'}</span><button class="text-button ambience-control" data-action="ambience" aria-pressed="${motion.matches||!ambience}" ${motion.matches?'disabled':''}>${motion.matches?'Reduced motion · still':ambience?'Switch to still':'Enable ambience'}</button></div>
  <section class="focus-layout" aria-label="Focus work window">${goalLabel()}<p class="step-label">Step ${state.completed+1} of ${state.steps.length}</p>
    <div class="focus-copy" tabindex="0" aria-label="Current instruction and optional context"><h2 class="instruction">${escapeHTML(instruction())}</h2><details class="focus-details"><summary>Saved context & original step</summary>${originalTitle()}${savedContext()}</details></div>
    <div class="focus-clock" id="clock">${formatTime(state.seconds)}</div>
    <p class="timer-label">${expired?'Block ended. Time is stopped; the action is still unfinished.':state.running?'remaining in this simulated block · running':'remaining in this simulated block · paused'}</p>
    ${expired?'<div class="expiry" aria-label="Extend block"><button class="button" data-extend="5">+5 min</button><button class="button" data-extend="10">+10 min</button><button class="button" data-extend="20">+20 min</button></div>':''}
    <div class="work-actions">${!expired&&!state.running?'<button class="button primary" data-action="resume">Resume focus</button>':''}<button class="button ${state.running||expired?'primary':''}" data-action="pause">${expired||!state.running?'Save my place':'Ⅱ Pause'}</button><button class="button" data-action="complete">✓ Complete step</button></div>
    <p class="hint">Simulated timer. Work in another tab; Trail doesn’t observe it.</p><div class="focus-track" aria-hidden="true"><span></span></div>
  </section><p class="focus-footnote">${state.completed} earlier steps checked. Nothing to rush.</p>`;
}
function paused(){return `${heading('Paused')}<section class="pause-area"><span class="pause-marker" aria-hidden="true">Ⅱ</span><h1>Your place is kept.</h1><p class="muted">Come back when you’re ready. This step stays unfinished.</p><div class="pause-task">${escapeHTML(instruction())}<p class="hint"><span class="tag">Unfinished</span> Demo timer stopped immediately. No completion awarded.</p></div><form id="pause-form"><label for="return-note">When I’m back… <span class="muted">(optional)</span></label><textarea id="return-note" placeholder="Leave yourself a small next move.">${escapeHTML(currentStep()?.nextInstruction||'')}</textarea><details><summary>Add context (optional)</summary><label for="pause-context">Anything else worth keeping</label><textarea id="pause-context">${escapeHTML(currentStep()?.context||'')}</textarea></details><div class="work-actions"><button class="button primary" type="submit">Save & return to Today</button><button class="text-button" type="button" data-action="skip">Skip note</button></div><p class="hint">Blank instruction keeps your prior next move. Context may be cleared. Saved only inside this fictional example; reload resets it.</p></form></section>`;}
function journey(){return `${heading('Look at the ground you’ve covered.',`Finish my ML assignment · ${state.finished?'goal finished':'goal open'}`)}<div class="journey-layout"><section class="scene-panel"><div class="scene-top"><strong>The assignment trail</strong><span>${state.completed} of ${state.steps.length} checkpoints earned</span></div>${routeSVG({goal:true})}<div class="scene-bottom"><span>70 min across 2 days · fixed illustration</span><button class="text-button" data-action="${state.finished?'finished':'today'}">${state.finished?'Revisit finished work':'Back to next action'}</button></div><div class="route-legend"><span>✓ Checked</span><span>◎ Saved / unfinished</span><span>○ Planned</span></div><p class="hint">Illustrative geometry, not literal distance. Today’s 45 example minutes are part of this whole-goal trail.</p></section><section class="records"><div class="section-heading"><h3>The work behind the route</h3><span>Select a step</span></div>${state.steps.map((step,i)=>`<button class="record-button" data-record="${i}" aria-pressed="${state.selected===i}"><span class="record-index">${i<state.completed?'✓':String(i+1).padStart(2,'0')}</span><span>${escapeHTML(stepName(i))}<small>${i===0?'Friday · 25 illustrative min':i===1?'Today · 25 illustrative min':i===2?'Today · 20 illustrative min':'No minute total simulated'} · ${i<state.completed?'completed':i===state.completed?'unfinished':'planned'}</small></span></button>`).join('')}${recordDetail()}</section></div>`;}
function finished(){return `${heading('Work worth looking back on.','A finished goal keeps its place in your story.')}<div class="finished-grid">${state.finished?`<article class="finished-card"><span class="completed-stamp">✓ Goal explicitly confirmed</span><span class="tag">Fictional example</span><h2>Finish my ML assignment</h2><p>${state.steps.length} steps checked · 70 illustrative focus minutes</p><p>October 24, 2026 · example date</p><svg viewBox="0 0 220 200" aria-hidden="true"><path d="M20 200V90C20 0 185 0 185 90v110h-36V91c0-45-92-45-92 0v109Z" fill="none" stroke="white" stroke-width="2"/><path d="M35 200V90C35 20 170 20 170 90v110" fill="none" stroke="white" stroke-width="2"/></svg></article><div class="work-actions"><button class="button" data-action="journey">Revisit the goal journey</button><button class="text-button" data-action="reset">Back to example / reset</button></div><p class="hint">A visual record only. No assignment was actually submitted.</p>`:'<section class="empty"><div class="empty-mark" aria-hidden="true">✓</div><h2>Room for what you finish.</h2><p>Finished goals will live here. Your current assignment is still open.</p><button class="button primary" data-action="today">Back to your next action</button></section>'}</div>`;}
function empty(){return '<section class="empty"><div class="empty-mark" aria-hidden="true">↗</div><h1>A place for your next step.</h1><p>Choose a goal, focus on one action, and leave yourself a way back. Your trail starts with the work you choose.</p><button class="button primary" data-action="reset">Explore the fictional example</button><p class="hint">First-use visual state. Goal creation is not implemented here.</p></section>';}
function render({moveFocus=false}={}) {
  $('.celebration')?.remove();
  document.querySelectorAll('[data-reward-inert]').forEach(el=>{el.inert=false;delete el.dataset.rewardInert;});
  document.body.classList.remove('celebrating');
  document.body.dataset.view=state.view;
  document.body.classList.toggle('still',!ambience);
  main.innerHTML = focusReturnHTML() + (state.view==='landing'?landing():state.view==='today'?today():state.view==='focus'||state.view==='expired'?focus():state.view==='pause'?paused():state.view==='journey'?journey():state.view==='finished'?finished():empty());
  document.querySelectorAll('[data-nav]').forEach(button=>{const active=button.dataset.nav===state.view; if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  $('#scenario').value = state.long && state.view==='today'?'long':state.view;
  if(moveFocus) {main.focus({preventScroll:true});window.scrollTo(0,0);}
}
function focusReturnHTML(){return currentStep()&&state.blockStarted&&!['focus','expired','pause'].includes(state.view)?`<aside class="focus-return" aria-label="Simulated focus status"><span>${state.running?'Focus running':state.seconds===0?'Block ended · unfinished':'Focus paused'} · <span id="return-clock">${formatTime(state.seconds)}</span> · simulated</span><button class="text-button" data-action="return-focus">Return to focus</button>${state.running?'<button class="text-button" data-action="pause">Pause</button>':''}</aside>`:'';}
function go(view){clearTimeout(celebrationTimeout);clearTimeout(headlineTimeout);state.view=view;render({moveFocus:true});}
function formatTime(seconds){seconds=Math.ceil(seconds);return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function settleClock(){if(!state.running)return;const remaining=Math.max(0,(state.deadline-Date.now())/1000);state.elapsedSeconds+=Math.max(0,state.seconds-remaining);state.seconds=remaining;}
function stopClock(){settleClock();state.running=false;state.deadline=0;}
function clearUndo(){completionSnapshot=null;clearTimeout(noticeTimeout);$('#notice').textContent='';}
function startClock(minutes){if(!currentStep()||state.finished)return;if(state.running){go('focus');return;}if(state.blockStarted&&state.seconds<=0&&!minutes){go('expired');return;}clearUndo();if(minutes)state.seconds=minutes*60;state.deadline=Date.now()+state.seconds*1000;state.running=true;state.blockStarted=true;state.view='focus';render({moveFocus:true});}
setInterval(()=>{if(!state?.running)return;settleClock();for(const id of ['#clock','#return-clock']){const clock=$(id);if(clock)clock.textContent=formatTime(state.seconds);}if(state.seconds===0){state.running=false;state.deadline=0;if(state.view==='focus'){state.view='expired';render();}else{const strip=$('.focus-return');if(strip)strip.outerHTML=focusReturnHTML();const action=$('[data-action="return-focus"].primary');if(action)action.textContent='Review ended block';}}},250);
function showReview(){if(state.finished||currentStep())return;$('#add-form').hidden=true;$('#new-step').value='';$('#review-summary').innerHTML=`<span class="summary-check" aria-hidden="true">✓</span><div><strong>${state.completed} of ${state.steps.length} steps checked</strong><span>All planned work acknowledged.<br>Only you decide if the goal is finished.</span></div>`;dialog.showModal();}
function closeReview(){dialog.close();const target=$('[data-action="review"]')||$('[data-action="resume"]');if(target)target.focus();else main.focus();}
function notify(message,undo=false){clearTimeout(noticeTimeout);$('#notice').classList.toggle('completion-notice',undo);$('#notice').innerHTML=`<span class="tick" aria-hidden="true">✓</span><span>${escapeHTML(message)}</span>${undo?'<button class="text-button" data-action="undo">Undo</button>':''}`;noticeTimeout=setTimeout(()=>{$('#notice').textContent='';},undo?12000:5000);}
function complete(){if(!currentStep()||state.finished)return;stopClock();completionSnapshot=structuredClone(state);currentStep().simulatedElapsedSeconds=state.elapsedSeconds;state.completed++;state.long=false;state.seconds=state.duration*60;state.elapsedSeconds=0;state.blockStarted=false;state.view='today';render({moveFocus:true});notify('Step complete. Another checkpoint earned.',true);if(!currentStep())showReview();}
function celebrate(){if(state.finished||currentStep()||!dialog.open)return;dialog.close();clearUndo();state.finished=true;state.view='finished';render();document.body.classList.add('celebrating');const section=document.createElement('section');section.className='celebration';section.setAttribute('role','dialog');section.setAttribute('aria-modal','true');section.setAttribute('aria-label','Goal celebration');section.innerHTML=`<div class="celebration-inner"><span class="celebration-kicker">A goal, brought all the way home.</span><h1 class="celebration-title">${motion.matches?'Look how far you came.':'You followed through.'}</h1><p>Finish my ML assignment</p>${routeSVG({goal:true,finished:true})}<p>One next step became a finished piece of work.<br>Take a moment. This one is yours.</p><button class="button primary" data-action="exit-celebration">View finished work</button><small>Fictional achievement · settles to finished work after 6 seconds</small></div>`;for(const el of document.body.children){el.inert=true;el.dataset.rewardInert='true';}document.body.append(section);$('[data-action="exit-celebration"]').focus();if(!motion.matches)headlineTimeout=setTimeout(()=>{const title=$('.celebration-title');if(title)title.textContent='Look how far you came.';},2400);celebrationTimeout=setTimeout(exitCelebration,6000);}
function exitCelebration(){clearTimeout(celebrationTimeout);clearTimeout(headlineTimeout);go('finished');}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.theme){theme=button.dataset.theme;document.documentElement.dataset.theme=theme;document.querySelectorAll('button[data-theme]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.theme===theme)));return;}
  if(button.dataset.nav){go(button.dataset.nav);return;}
  if(button.dataset.extend){startClock(Number(button.dataset.extend));return;}
  if(button.dataset.record){state.selected=Number(button.dataset.record);routePreview=null;highlightRecord(state.selected);document.querySelectorAll('[data-record]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.record)===state.selected)));return;}
  switch(button.dataset.action){
     case 'reset':reset();break;
     case 'ambience':ambience=!ambience;document.body.classList.toggle('still',!ambience);button.setAttribute('aria-pressed',String(!ambience));button.textContent=motion.matches?'Reduced motion · still':ambience?'Switch to still':'Enable ambience';break;
     case 'resume':startClock();break;
     case 'return-focus':go(state.seconds===0?'expired':'focus');break;
     case 'pause':if(currentStep()){stopClock();go('pause');}break;
    case 'skip':go('today');notify('Your place is kept. Existing context unchanged.');break;
     case 'today':case 'journey':case 'finished':go(button.dataset.action);break;
    case 'complete':complete();break;
    case 'review':showReview();break;
    case 'close-review':case 'keep-open':closeReview();break;
    case 'add':$('#add-form').hidden=false;$('#new-step').focus();break;
    case 'confirm':celebrate();break;
    case 'exit-celebration':exitCelebration();break;
     case 'undo':if(completionSnapshot){if(dialog.open)dialog.close();state=structuredClone(completionSnapshot);state.view='today';clearUndo();render({moveFocus:true});notify('Completion undone. Saved place and simulated effort kept; timer paused.');}break;
  }
});
document.addEventListener('submit',event=>{event.preventDefault();if(event.target.id==='pause-form'&&currentStep()){const note=$('#return-note').value;if(note.trim())currentStep().nextInstruction=note;currentStep().context=$('#pause-context').value;go('today');notify('Return instruction saved in this example.');}if(event.target.id==='add-form'&&dialog.open&&!state.finished){const input=$('#new-step');if(!input.value.trim()){input.setCustomValidity('Write the next step, or keep the goal open.');input.reportValidity();return;}clearUndo();state.steps.push(makeStep(input.value.trim()));dialog.close();go('today');notify('Step added. Goal kept open.');}});
$('#new-step').addEventListener('input',()=>$('#new-step').setCustomValidity(''));
dialog.addEventListener('cancel',event=>{event.preventDefault();closeReview();});
document.addEventListener('keydown',event=>{if(!$('.celebration'))return;if(event.key==='Escape'){event.preventDefault();exitCelebration();}else if(event.key==='Tab'){event.preventDefault();$('[data-action="exit-celebration"]').focus();}});
dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('button,input')].filter(el=>!el.disabled&&el.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
$('#scenario').addEventListener('change',event=>{const scenario=event.target.value;reset();if(scenario==='long'){state.long=true;currentStep().nextInstruction=longInstruction;render();}else if(scenario==='focus')startClock();else if(scenario==='final'){state.completed=state.steps.length;render();showReview();$('#scenario').value='final';}else if(scenario==='expired'){state.seconds=0;state.blockStarted=true;go('expired');}else {if(scenario==='finished'){state.completed=state.steps.length;state.finished=true;}go(scenario);}});
$('#reset').addEventListener('click',reset);
$('.brand').addEventListener('click',event=>{event.preventDefault();go('landing');});
document.addEventListener('change',event=>{if(event.target.id==='duration'){state.duration=Number(event.target.value);state.seconds=state.duration*60;}});
const motion=matchMedia('(prefers-reduced-motion: reduce)');
document.addEventListener('pointerover',event=>{const row=event.target.closest('[data-record]');if(row&&event.pointerType!=='touch'){routePreview=Number(row.dataset.record);highlightRecord(routePreview);}});
document.addEventListener('pointerout',event=>{const row=event.target.closest('[data-record]');if(row&&!row.contains(event.relatedTarget)){routePreview=null;highlightRecord(state.selected);}});
document.addEventListener('focusin',event=>{const row=event.target.closest('[data-record]');if(row){routePreview=Number(row.dataset.record);highlightRecord(routePreview);}});
document.addEventListener('focusout',event=>{if(event.target.closest('[data-record]')){routePreview=null;highlightRecord(state.selected);}});
reset();
go('landing');
