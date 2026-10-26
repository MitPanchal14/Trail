'use strict';
import { bootWork } from './work.js';
import { exampleRecords } from './activity.js';
// Isolated fictional model. No production imports, persistence, providers or permissions.
const $ = (selector) => document.querySelector(selector);
const main = $('#main');
const dialog = $('#review');
const standardInstruction = 'Open the capacity table and compare the two room options.';
const longInstruction = `${standardInstruction} Read the attendance estimates alongside the accessibility checklist. Confirm seating, step-free access, projector availability and the quiet space for participants who need a break. Compare the volunteer setup time for each room. If a capacity or booking detail is missing, write a clear question rather than guessing. Then draft the room recommendation, explain the trade-off in ordinary language, and list the two decisions that still need confirmation before sending the update.`;
const initialSteps = ['Gather the attendance estimates', 'Check room availability', standardInstruction, 'Send the reviewed workshop update'];
const exampleGoalTitle='Prepare the workshop update';
let sharedViews=null,sampleHistory=null,useSamples=false;
let state;
let exampleMode=false;
let celebrationTimeout;
let noticeTimeout;
let completionSnapshot = null;
let theme = 'light';
let ambience = true;
let routePreview = null;
let routeSequence = 0;
const feedbackCleanups=new Set();
const makeStep = (title, context='') => ({title, nextInstruction:'', context});
const currentStep = () => state.steps[state.completed];
const comparisonTitle = 'Compare room capacity and prepare the update';
const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function reset() {
  sharedViews?.close();useSamples=false;sampleHistory=exampleRecords();
  clearTimeout(celebrationTimeout);
  closeReward();
  clearTimeout(noticeTimeout);
  if (dialog.open) dialog.close();
  $('#notice').textContent = '';
  $('#add-form').hidden = true;
  $('#new-step').value = '';
  state = {view:'today', steps:initialSteps.map((title,i)=>makeStep(title, i===2?'Attendance estimates are ready. Compare capacity and accessibility before choosing a room.':i<2?'Prepared in this fictional workshop example; no external work is observed.':'')), completed:2, seconds:20*60, elapsedSeconds:0, duration:20, running:false, deadline:0, blockStarted:false, finished:false, long:false, selected:1};
  completionSnapshot = null;
  routePreview = null;
  state.steps[2].nextInstruction = standardInstruction;state.steps[2].resourceUrl='https://example.com/workshop#capacity';
  render();
}
function routeSVG({goal=false, finished=state.finished,model=state,real=false}={}) {
  // Presentation only: checkpoint geometry is illustrative, never stored or converted to effort.
  const id=`trail-${++routeSequence}`;
  const steps=real?model.steps:model.steps.map((s,i)=>({...s,id:`example-${i}`,status:i<model.completed?'completed':'open',hasSavedContext:!!(s.nextInstruction||s.context)}));
  const total=steps.length,checked=steps.filter(s=>s.status==='completed').length,current=steps.findIndex(s=>s.status==='open');
  const active=real?model.selected:routePreview??model.selected,illustration=!!model.illustration;
  const phase=illustration?'illustration':finished?'finished':current<0?'review':'active';
  const camp=phase==='active'&&steps[current].hasSavedContext&&!model.running;
  const status=phase==='illustration'?'Illustration':phase==='finished'?'Goal finished':phase==='review'?'Ready for review':camp?'Saved place':'Next action';
  // Five cubic switchbacks. Equal arc-length samples keep dense checkpoints separated.
  const curves=[[[100,355],[130,325],[304,348],[300,302]],[[300,302],[298,278],[204,288],[225,252]],[[225,252],[247,218],[393,245],[383,203]],[[383,203],[375,175],[303,193],[330,151]],[[330,151],[347,128],[365,117],[374,88]]];
  const samples=[{x:100,y:355,length:0}];
  for(const c of curves)for(let j=1;j<=40;j++){
    const t=j/40,u=1-t,x=u*u*u*c[0][0]+3*u*u*t*c[1][0]+3*u*t*t*c[2][0]+t*t*t*c[3][0],y=u*u*u*c[0][1]+3*u*u*t*c[1][1]+3*u*t*t*c[2][1]+t*t*t*c[3][1],last=samples.at(-1);
    samples.push({x,y,length:last.length+Math.hypot(x-last.x,y-last.y)});
  }
  const length=samples.at(-1).length;
  const point=f=>{const target=length*f,index=samples.findIndex(p=>p.length>=target),b=samples[Math.max(1,index)],a=samples[Math.max(0,index-1)],r=(target-a.length)/(b.length-a.length);return {x:a.x+(b.x-a.x)*r,y:a.y+(b.y-a.y)*r};};
  const xy=p=>`${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  const section=(from,to)=>`M${[point(from),...samples.filter(p=>p.length>from*length&&p.length<to*length),point(to)].map(xy).join(' L')}`;
  const slots=steps.map((_,i)=>point((i+.5)/Math.max(1,total))),dense=total>5;
  const segments=steps.map((s,i)=>`<path class="route-segment ${s.status==='completed'?'earned':''} ${i===active?'highlighted':''}" data-segment="${i}" data-action-id="${escapeHTML(s.id)}" d="${section(i/total,(i+1)/total)}"/>`).join('');
  const markers=steps.map((s,i)=>{const large=!dense||i===current||i===active,r=large?12:4.5;return `<g class="milestone ${s.status==='completed'?'earned':i===current?'current':'planned'} ${i===active?'highlighted':''}" data-marker="${i}" data-action-id="${escapeHTML(s.id)}" transform="translate(${xy(slots[i])})"><title>${escapeHTML(s.title)} — ${s.status==='completed'?'Checked':i===current?status:'Unfinished'}</title><circle class="selection-ring" r="${r+7}"/><circle class="saved-ring" r="${r+5}"/><circle class="marker-core" r="${r}"/>${large?`<text class="marker-symbol" y="4.5" text-anchor="middle">${s.status==='completed'?'✓':i+1}</text>`:''}</g>`;}).join('');
  const destination=phase==='finished'?{x:374,y:65}:current>=0?slots[current]:point(1);
  const station=camp?'camp':phase==='review'?'review':phase==='finished'?'summit':'expedition';
  const traveller=illustration?'':`<g class="expedition-marker" data-station="${station}" data-action-id="${escapeHTML(current>=0?steps[current].id:'')}" data-route-fraction="${current>=0?(current+.5)/total:1}" transform="translate(${xy(destination)})" aria-hidden="true"><circle class="progress-dot" r="8"/><g class="expedition-camp"><path class="tent-roof" d="M-18-4L0-33L19-4Z"/><path class="tent-door" d="M0-30L0-4H12Z"/><path class="tent-line" d="M-22-3H23M0-33L-2-38"/></g></g>`;
  const position=current>=0&&!illustration?slots[current]:null;
  let callout='';
  if(position){
    let x=position.x+25,y=position.y+8;
    // Keep the label off every checkpoint, including dense/noncontiguous states.
    if(slots.some(p=>p.x+19>x&&p.x-19<x+151&&p.y+19>y&&p.y-19<y+34))x=448;
    callout=`<g class="position-label" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})"><path d="M${(position.x-x+16).toFixed(2)} ${(position.y-y).toFixed(2)}L-2 12"/><rect width="151" height="34" rx="8"/><text x="12" y="23">${status}</text></g>`;
  }
  return `<figure class="mountain-scene"><svg class="route-art mountain-art ${dense?'mountain-overview':''}" viewBox="0 0 640 440" role="img" data-goal-id="${escapeHTML(real?model.goalId||'illustration':'example-goal')}" data-mode="${real?'real':'example'}" data-phase="${phase}" data-current="${current}" aria-label="${escapeHTML(`${illustration?'Illustration, not your progress.':`${checked} of ${total} actions checked. ${status}.` } Mountain route is illustrative, not an effort or distance scale. Selection does not move your next action.`)}"><defs><linearGradient id="${id}-terrain" x1="0" y1="0" x2=".8" y2="1"><stop class="terrain-top"/><stop offset="1" class="terrain-bottom"/></linearGradient><linearGradient id="${id}-trail" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#75d7dc"/><stop offset="1" stop-color="#4167ec"/></linearGradient></defs>
    <path class="mountain-distant" d="M24 358Q96 261 156 202L194 239L251 155L338 283L427 202L478 242L518 181Q566 255 618 358Z"/>
    <path class="mountain-back" d="M36 372L187 183L217 216L270 142L347 241L429 147L582 372Z"/>
    <path class="mountain-main" fill="url(#${id}-terrain)" d="M51 379Q111 316 167 270L214 239Q261 171 306 141L374 65Q416 121 446 177L479 219Q526 312 594 379Q337 405 51 379Z"/>
    <path class="mountain-face" d="M374 65L354 139L395 186L369 245L439 303L473 390Q536 388 594 379Q526 312 479 219L446 177Q416 121 374 65Z"/>
    <path class="mountain-snow" d="M340 103L374 65L401 104L383 96L373 105L363 94L354 108Z"/>
    <g class="mountain-contours"><path d="M211 247Q288 183 347 184M158 291Q249 215 322 225M119 332Q234 267 311 271M91 365Q244 318 366 320M421 177Q410 216 451 242M436 278Q457 313 506 328M455 346Q493 363 548 363"/></g>
    <path class="mountain-path-bed" d="${section(0,1)}"/><g class="route-lines" style="--trail-paint:url(#${id}-trail)">${segments}</g>${markers}${callout}
    <g class="mountain-summit ${phase==='finished'?'summit-earned':''}" transform="translate(374 65)"><circle class="summit-halo" cy="-14" r="26"/><path class="summit-pole" d="M0 0V-25"/><path class="summit-flag" d="M1-25L24-19L1-12Z"/><text class="summit-label" x="38" y="-8">${phase==='finished'?'Goal finished ✓':phase==='review'?'Ready for review':'Your summit'}</text></g>
    ${traveller}
    <g class="mountain-caption"><text x="48" y="413">${illustration?'A possible path. Your work makes it yours.':`${checked} / ${total} actions checked`}</text>${!illustration?`<text x="592" y="413" text-anchor="end">${dense?'Overview · checkpoints':'One action at a time'}</text>`:''}</g></svg><figcaption class="mountain-mobile-caption"><strong class="mountain-place-label">${illustration?'Illustration':phase==='finished'?'Goal finished ✓':phase==='review'?'Ready for review':`${status} · action ${current+1}`}</strong>${!illustration?`<span class="mountain-count-label">${checked} of ${total} checked</span>`:''}<span class="mountain-destination-label">${illustration?'A possible path, not your progress.':phase==='finished'?'Summit confirmed':phase==='review'?'Summit awaits your confirmation':'Summit ahead · illustrative route'}</span></figcaption></figure>`;
}
function clearMountainFeedback(){for(const cleanup of [...feedbackCleanups])cleanup();}
function playMountainFeedback(nodes,className,duration){
  clearMountainFeedback();
  if(motion.matches||!ambience||!nodes.length)return;
  nodes.forEach(node=>node.classList.add(className));
  const cleanup=()=>{clearTimeout(timer);nodes.forEach(node=>node.classList.remove(className));feedbackCleanups.delete(cleanup);};
  const timer=setTimeout(cleanup,duration);feedbackCleanups.add(cleanup);
}
function travelMarker(svg,fromFraction,{summit=false,actionId=''}={}){
  // The DOM already describes committed outcomes. Only this presentation transform moves;
  // every cancellation restores that render's destination, never a captured domain snapshot.
  if(motion.matches||!ambience)return;
  const marker=svg.querySelector('.expedition-marker'),path=svg.querySelector('.mountain-path-bed');
  if(!marker||!path)return;
  const destination=marker.getAttribute('transform'),toFraction=Number(marker.dataset.routeFraction),length=path.getTotalLength();
  const point=f=>path.getPointAtLength(Math.max(0,Math.min(1,f))*length);
  const start=point(fromFraction),end=point(toFraction);
  let frame,started;
  const cleanup=()=>{cancelAnimationFrame(frame);marker.setAttribute('transform',destination);marker.classList.remove('travelling');delete marker.dataset.completedActionId;feedbackCleanups.delete(cleanup);};
  feedbackCleanups.add(cleanup);
  marker.dataset.completedActionId=actionId;
  marker.classList.add('travelling');
  marker.setAttribute('transform',`translate(${start.x} ${start.y})`);
  const tick=now=>{
    if(!marker.isConnected){cleanup();return;}
    started??=now;const t=Math.min(1,(now-started)/780),eased=t*t*(3-2*t);
    const p=summit?{x:end.x+(374-end.x)*eased,y:end.y+(65-end.y)*eased}:point(fromFraction+(toFraction-fromFraction)*eased);
    marker.setAttribute('transform',`translate(${p.x} ${p.y})`);
    if(t<1)frame=requestAnimationFrame(tick);else cleanup();
  };
  frame=requestAnimationFrame(tick);
}
function respondToCompletion(goalId,actionId,fictional=false){
  clearMountainFeedback();
  for(const svg of main.querySelectorAll('.mountain-art')){
    if(svg.dataset.goalId!==goalId||svg.dataset.mode!==(fictional?'example':'real'))continue;
    const checkpoints=[...svg.querySelectorAll('.milestone')],index=checkpoints.findIndex(node=>node.dataset.actionId===actionId&&node.classList.contains('earned'));
    if(index>=0)travelMarker(svg,(index+.5)/checkpoints.length,{actionId});
  }
}
function landing(){return `<section class="landing"><div class="hero-copy"><p class="eyebrow">Your productivity and focus companion</p><h1>Pick up where you left off.</h1><p class="hero-lead">Plan a goal, focus on one action, and save exactly where to restart. Your next step stays ready when you come back.</p><button class="button primary hero-cta" data-action="today">Return to saved work ↗</button><p class="hint">Fictional example. Nothing starts until you do.</p><div class="hero-discovery"><h2>Try a ready-made demo</h2><div><button class="button" data-example-scene="saved">Return to saved work</button><button class="button" data-example-scene="activity">Explore sample activity</button><button class="text-button" data-example-scene="browse">Browse demo states</button></div><p class="hint">Fictional examples. Your own work stays separate.</p></div></div><div class="hero-journey"><div class="hero-art-heading"><span class="eyebrow">Goal progress, one action at a time</span><span class="tag">Fictional example</span></div>${routeSVG({goal:true})}<div class="hero-saved"><span class="saved-dot" aria-hidden="true"></span><div><span class="muted">Goal: Prepare the workshop update · Fictional example</span><p>Next move: ${escapeHTML(instruction())}</p></div></div></div></section><div class="landing-foot"><span>Plan → Focus → Save your place</span></div>`;}
const heading = (title,sub='') => `<div class="page-heading"><div><h1>${title}</h1>${sub?`<p class="muted">${sub}</p>`:''}</div><span class="date">Saturday, October 24 <span class="muted">· example</span></span></div>`;
const goalLabel = () => `<p class="goal-label"><span class="goal-icon" aria-hidden="true">↗</span> ${exampleGoalTitle} <span class="tag">Important · fictional</span></p>`;
function instruction(){return currentStep()?.nextInstruction || currentStep()?.title || (state.finished?'This goal is finished. Revisit the work you checked.':'Review the finished steps and decide whether the goal is complete.');}
function originalTitle(){const s=currentStep();return s?.nextInstruction&&s.nextInstruction.trim()!==s.title.trim()?`<p class="original-step">Original step: ${escapeHTML(s.title)}</p>`:'';}
function savedContext(){const s=currentStep();return (s?.context?`<div class="saved-context"><strong>Where you left off · optional context</strong><p>${escapeHTML(s.context)}</p></div>`:'')+(s?.resourceUrl?`<a class="button work-link" href="${escapeHTML(s.resourceUrl)}" target="_blank" rel="noopener noreferrer">Open example work · example.com ↗</a>`:'')+(s&&(s.nextInstruction||s.context||s.resourceUrl)?'<div class="saved-place-copy"><button class="text-button" data-action="copy-example">Copy saved place</button><span id="example-copy-status" role="status"></span></div>':'');}
function stepName(i){return i===2?comparisonTitle:state.steps[i].title;}
function stepContext(i){const step=state.steps[i];return [step.nextInstruction,step.context].filter(Boolean).join('\n')||(i<state.completed?'Checked in this fictional example. No actual submission or external work is observed.':'A planned action in this fictional example. No actual submission or external work is observed.');}
function stepsHTML(){return state.steps.map((step,i)=>`<button class="step-row ${i<state.completed?'done':i===state.completed?'current':''}" data-record="${i}" aria-pressed="${state.selected===i}"><span class="step-number">${i<state.completed?'✓':i+1}</span><span class="step-name">${escapeHTML(stepName(i))}</span><small>${i<state.completed?'Checked':i===state.completed?'Unfinished':'Planned'}</small></button>`).join('');}
function recordDetail(){return `<div class="selected-detail" tabindex="0" aria-label="Selected step context"><span class="eyebrow">Behind this step</span><h3 id="detail-heading">${escapeHTML(stepName(state.selected))}</h3><p class="record-detail">${escapeHTML(stepContext(state.selected))}</p></div>`;}
function highlightRecord(index){clearMountainFeedback();document.querySelectorAll('[data-marker],.route-lines [data-segment]').forEach(el=>el.classList.toggle('highlighted',Number(el.dataset.marker??el.dataset.segment)===index));document.querySelectorAll('[data-record]').forEach(el=>el.classList.toggle('previewed',Number(el.dataset.record)===index));if($('#detail-heading'))$('#detail-heading').textContent=stepName(index);if($('.record-detail'))$('.record-detail').textContent=stepContext(index);}
function routeStatus(){return state.finished?'Goal finished ✓':currentStep()?`Next: step ${state.completed+1} of ${state.steps.length}`:'All steps checked · goal open';}
function scene(){return `<section class="scene-panel" aria-label="Today's illustrative route"><div class="scene-top"><strong>Today’s trail</strong><span>Goal · ${state.completed} of ${state.steps.length} checked</span></div>${routeSVG()}<div class="scene-bottom"><span>45 min today · illustrative <span class="tag">${routeStatus()}</span></span><button class="text-button" data-action="journey">View goal journey ↗</button></div><p class="hint">Today’s sessions + upcoming steps. Friday’s separate marker is earlier context.</p></section>`;}
function today(){return `${heading(state.finished?'A goal, brought home.':'Pick up where you left off.')}<div class="workspace"><section class="action-area" aria-label="Your next action"><div class="stage-top">${goalLabel()}<span class="stage-symbol" aria-hidden="true">↗</span></div><p class="step-label">${state.finished?'Goal explicitly confirmed':currentStep()?`Next action · step ${state.completed+1} of ${state.steps.length}`:'All planned steps checked · goal still open'}</p><h2 class="instruction">${escapeHTML(instruction())}</h2>${originalTitle()}${savedContext()}<div class="work-actions"><button class="button primary" data-action="${state.finished?'finished':!currentStep()?'review':state.running||state.blockStarted&&state.seconds===0?'return-focus':'resume'}">${state.finished?'Revisit finished work':!currentStep()?'Review goal':state.running?'Return to focus':state.blockStarted&&state.seconds===0?'Review ended block':'<span aria-hidden="true">▶</span> Resume focus'}</button>${currentStep()?`<button class="text-button" data-action="pause">${state.running?'Pause & edit place':'Edit saved place'}</button>${!state.blockStarted?`<label class="duration">Block <select id="duration" aria-label="Focus block duration"><option value="20" ${state.duration===20?'selected':''}>20 min</option><option value="25" ${state.duration===25?'selected':''}>25 min</option><option value="45" ${state.duration===45?'selected':''}>45 min</option></select></label>`:''}`:''}</div><p class="hint">${state.finished?'Finished work stays available. Visiting it does not celebrate again.':'One small next move. Your earlier work is still here.'}</p></section>${scene()}</div><div class="lower"><section><div class="section-heading"><h3>The path to finished</h3><span>${state.completed} of ${state.steps.length} checked</span></div>${stepsHTML()}</section><section>${recordDetail()}<div class="history-line"><span>Whole goal · fixed illustration</span><strong>70 min across 2 days</strong></div><div class="history-line"><span>Current example status</span><strong>${routeStatus()}</strong></div></section></div>`;}
function focus(){
  const expired=state.view==='expired';
   return `<div class="focus-surround" aria-hidden="true"><i></i><i></i><i></i></div><div class="focus-topline"><span class="eyebrow">${expired?'A good place to check in.':'One thing at a time.'}</span><button class="text-button ambience-control" data-action="ambience" aria-pressed="${!motion.matches&&ambience}" ${motion.matches?'disabled':''}>Background motion: ${!motion.matches&&ambience?'On':'Off'}${motion.matches?' · system preference':''}</button></div>
  <section class="focus-layout" aria-label="Focus work window">${goalLabel()}<p class="step-label">Step ${state.completed+1} of ${state.steps.length}</p>
    <div class="focus-copy" tabindex="0" aria-label="Current instruction and optional context"><h2 class="instruction">${escapeHTML(instruction())}</h2><details class="focus-details"><summary>Saved context & original step</summary>${originalTitle()}${savedContext()}</details></div>
    <div class="focus-clock" id="clock">${formatTime(state.seconds)}</div>
    <p class="timer-label">${expired?'Block ended. Time is stopped; the action is still unfinished.':state.running?'remaining in this simulated block · running':'remaining in this simulated block · paused'}</p>
    ${expired?'<div class="expiry" aria-label="Extend block"><button class="button" data-extend="5">+5 min</button><button class="button" data-extend="10">+10 min</button><button class="button" data-extend="20">+20 min</button></div>':''}
    <div class="work-actions">${!expired&&!state.running?'<button class="button primary" data-action="resume">Resume focus</button>':''}<button class="button ${state.running||expired?'primary':''}" data-action="pause">${expired||!state.running?'Save my place':'Ⅱ Pause'}</button><button class="button" data-action="complete">✓ Complete step</button></div>
     <p class="hint">Simulated timer. Work in another tab; Trail doesn’t observe it.</p>
  </section><p class="focus-footnote">${state.completed} earlier steps checked. Nothing to rush.</p>`;
}
function paused(){return `<div class="handoff-heading">${heading('Leave yourself a way back.','Simulated timing is stopped. This action stays unfinished.')}</div><section class="pause-area pause-capture"><div class="pause-task"><span class="eyebrow">Current action · fictional example</span>${escapeHTML(currentStep()?.title||instruction())}</div><form id="pause-form"><label for="return-note">When I return, the first thing I’ll do is… <span class="muted">(optional)</span></label><textarea id="return-note" maxlength="4000" placeholder="Leave yourself a small next move.">${escapeHTML(currentStep()?.nextInstruction||'')}</textarea><div class="work-actions"><button class="button primary" type="submit">Save & return to Today</button><button class="text-button" type="button" data-action="skip">Skip note</button></div><p class="hint">Blank fields and Skip preserve prior notes. In memory only; reload resets this fictional example.</p><details><summary>Add context (optional)</summary><label for="pause-context">Anything else worth keeping</label><textarea id="pause-context" maxlength="4000">${escapeHTML(currentStep()?.context||'')}</textarea></details></form></section>`;}
function journey(){return `${heading('Look at the ground you’ve covered.',`Finish my ML assignment · ${state.finished?'goal finished':'goal open'}`)}<div class="journey-layout"><section class="scene-panel"><div class="scene-top"><strong>The assignment trail</strong><span>${state.completed} of ${state.steps.length} checkpoints earned</span></div>${routeSVG({goal:true})}<div class="scene-bottom"><span>70 min across 2 days · fixed illustration</span><button class="text-button" data-action="${state.finished?'finished':'today'}">${state.finished?'Revisit finished work':'Back to next action'}</button></div><div class="route-legend"><span>✓ Checked</span><span>◎ Saved / unfinished</span><span>○ Planned</span></div><p class="hint">Illustrative geometry, not literal distance. Today’s 45 example minutes are part of this whole-goal trail.</p></section><section class="records"><div class="section-heading"><h3>The work behind the route</h3><span>Select a step</span></div>${state.steps.map((step,i)=>`<button class="record-button" data-record="${i}" aria-pressed="${state.selected===i}"><span class="record-index">${i<state.completed?'✓':String(i+1).padStart(2,'0')}</span><span>${escapeHTML(stepName(i))}<small>${i===0?'Friday · 25 illustrative min':i===1?'Today · 25 illustrative min':i===2?'Today · 20 illustrative min':'No minute total simulated'} · ${i<state.completed?'completed':i===state.completed?'unfinished':'planned'}</small></span></button>`).join('')}${recordDetail()}</section></div>`;}
function finishedArt(){return '<div class="finished-art" aria-hidden="true"><svg class="finished-outline" viewBox="0 0 240 260" aria-hidden="true" focusable="false"><path d="M-14 272L111 38L247 272M111 38L94 102L126 88L152 144M94 102L58 169M126 88L137 121L127 154"/></svg></div>';}
function finished(){return `${heading('Work worth looking back on.','A finished goal keeps its place in your story.')}<div class="finished-grid">${state.finished?`<article class="finished-card">${finishedArt()}<span class="completed-stamp">✓ Goal explicitly confirmed</span><span class="tag">Fictional example</span><h2>Finish my ML assignment</h2><p>${state.steps.length} steps checked · 70 illustrative focus minutes</p><p>October 24, 2026 · example date</p></article><div class="work-actions"><button class="button" data-action="journey">Revisit the goal journey</button><button class="text-button" data-action="reset">Back to example / reset</button></div><p class="hint">A visual record only. No assignment was actually submitted.</p>`:'<section class="empty"><div class="empty-mark" aria-hidden="true">✓</div><h2>Room for what you finish.</h2><p>Finished goals will live here. Your current assignment is still open.</p><button class="button primary" data-action="today">Back to your next action</button></section>'}</div>`;}
function empty(){return '<section class="empty"><div class="empty-mark" aria-hidden="true">↗</div><h1>A place for your next step.</h1><p>Choose a goal, focus on one action, and leave yourself a way back. Your trail starts with the work you choose.</p><button class="button primary" data-action="reset">Explore the fictional example</button><p class="hint">First-use visual state. Goal creation is not implemented here.</p></section>';}
function legacyHistory(){
  const w={goals:{},actions:{},contexts:{},sessions:{},intervals:{},openGoalId:null};if(!state.finished)return w;
  const g={id:'example-goal',title:exampleGoalTitle,definitionOfFinished:'A reviewed workshop update with a clear room recommendation.',priority:'important',status:'completed',completedAt:Date.now(),actionOrder:state.steps.map((_,i)=>`example-${i}`)};w.goals[g.id]=g;
  state.steps.forEach((s,i)=>{const id=`example-${i}`;w.actions[id]={id,goalId:g.id,title:s.title,status:'completed',completedAt:g.completedAt};w.contexts[id]={id:`example-context-${i}`,actionId:id,nextInstruction:s.nextInstruction,context:s.context,resourceUrl:s.resourceUrl,updatedAt:g.completedAt};});return w;
}
function gallery(){return `${heading('Try a ready-made demo','Fictional examples. Your own work stays separate.')}<section class="scenario-gallery">${[['saved','Return to saved work','A stopped workshop update with a useful next move.'],['focus','Focus, paused and End block','Start explicitly; pause, save a place or end a simulated block.'],['interrupted','Interrupted recovery','Labelled simulated interruption; Resume is explicit.'],['review','All actions checked','Review is not confirmed finish.'],['archive','Finished collection','Eight sample goals with mixed priorities; title opens complete work.'],['activity','Explore sample activity','Twelve months, exact tasks, varied counts and inactive gaps.'],['long','Long content','Read and edit a longer saved instruction.'],['empty','Fresh / empty','An honestly empty sample calendar and archive.']].map(([id,title,detail])=>`<button type="button" class="button scenario-choice" data-example-scene="${id}"><strong>${title}</strong><span>${detail}</span></button>`).join('')}</section>`;}
function loadExample(scene){
  reset();state.sampleScene=scene;
  if(['activity','archive','empty'].includes(scene)){useSamples=true;if(scene==='empty')sampleHistory={goals:{},actions:{},contexts:{},sessions:{},intervals:{},openGoalId:null};go('finished');}
  else if(scene==='browse')go('gallery');
  else if(scene==='focus')go('focus');
  else if(scene==='interrupted'){state.interrupted=true;state.blockStarted=true;go('today');}
  else if(scene==='review'){state.completed=state.steps.length;go('today');showReview();}
  else if(scene==='long'){state.long=true;currentStep().nextInstruction=longInstruction;go('today');}
  else go('today');
}
function render({moveFocus=false}={}) {
  clearMountainFeedback();
  document.body.dataset.view=state.view;
  document.body.classList.toggle('still',motion.matches||!ambience);
  main.innerHTML = (state.interrupted?'<aside class="focus-return">Fictional example · simulated interruption. No away time recorded; Resume explicitly.</aside>':'')+focusReturnHTML() + (state.view==='gallery'?gallery():state.view==='landing'?landing():state.view==='today'?today():state.view==='focus'||state.view==='expired'?focus():state.view==='pause'?paused():state.view==='journey'?journey():state.view==='finished'&&sharedViews?sharedViews.history(useSamples?sampleHistory:legacyHistory()):state.view==='finished'?finished():empty());
  if(state.view==='pause')for(const [field,id,label] of [['nextInstruction','return-note','next move'],['context','pause-context','context']]){if(currentStep()?.[field])$(`#${id}`).insertAdjacentHTML('afterend',`<label class="remove-link"><input type="checkbox" data-example-remove="${id}">Remove saved ${label} when I save</label>`);}
  if(state.view==='pause')$('#pause-form').insertAdjacentHTML('beforeend','<p class="hint">Fictional note editor. The example work link is fixed; Real work supports editing/removing links and committed text drafts.</p>');
  if(state.view==='journey'){$('.page-heading .muted').textContent=`${exampleGoalTitle} · fictional example`;$('.scene-top strong').textContent='The workshop trail';}
  if(['focus','expired'].includes(state.view)&&!state.running&&state.blockStarted)$('.focus-layout').insertAdjacentHTML('beforeend','<div class="end-block-control"><button class="button" data-action="end-example-block">End focus block</button><p class="hint">Simulated block only. Keeps this action unfinished.</p></div>');
  document.querySelectorAll('[data-nav]').forEach(button=>{const active=button.dataset.nav===state.view; if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  $('#scenario').value = state.sampleScene?`sample-${state.sampleScene}`:state.long && state.view==='today'?'long':state.view;
  if(moveFocus) {main.focus({preventScroll:true});window.scrollTo(0,0);}
}
function focusReturnHTML(){return currentStep()&&state.blockStarted&&!['focus','expired','pause'].includes(state.view)?`<aside class="focus-return" aria-label="Simulated focus status"><span>${state.running?'Focus running':state.seconds===0?'Block ended · unfinished':'Focus paused'} · <span id="return-clock">${formatTime(state.seconds)}</span> · simulated</span><button class="text-button" data-action="return-focus">Return to focus</button>${state.running?'<button class="text-button" data-action="pause">Pause</button>':''}</aside>`:'';}
function go(view){sharedViews?.close();closeReward();state.view=view;render({moveFocus:true});}
function formatTime(seconds){seconds=Math.ceil(seconds);return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function settleClock(){if(!state.running)return;const remaining=Math.max(0,(state.deadline-Date.now())/1000);state.elapsedSeconds+=Math.max(0,state.seconds-remaining);state.seconds=remaining;}
function stopClock(){settleClock();state.running=false;state.deadline=0;}
function clearUndo(){completionSnapshot=null;clearTimeout(noticeTimeout);$('#notice').textContent='';}
function startClock(minutes){if(!currentStep()||state.finished)return;if(state.running){go('focus');return;}if(state.blockStarted&&state.seconds<=0&&!minutes){go('expired');return;}state.interrupted=false;clearUndo();if(minutes)state.seconds=minutes*60;state.deadline=Date.now()+state.seconds*1000;state.running=true;state.blockStarted=true;state.view='focus';render({moveFocus:true});}
setInterval(()=>{if(!exampleMode||!state?.running)return;settleClock();for(const id of ['#clock','#return-clock']){const clock=$(id);if(clock)clock.textContent=formatTime(state.seconds);}if(state.seconds===0){state.running=false;state.deadline=0;if(state.view==='focus'){state.view='expired';render();}else{const strip=$('.focus-return');if(strip)strip.outerHTML=focusReturnHTML();const action=$('[data-action="return-focus"].primary');if(action)action.textContent='Review ended block';}}},250);
function showReview(){if(state.finished||currentStep())return;$('#add-form').hidden=true;$('#new-step').value='';$('.review-goal').textContent=exampleGoalTitle;$('#review>small').textContent='Fictional example · simulated review, no real records saved';$('#review-status')?.remove();dialog.querySelectorAll('button').forEach(b=>b.disabled=false);$('#review-summary').innerHTML=`<span class="summary-check" aria-hidden="true">✓</span><div><strong>${state.completed} of ${state.steps.length} steps checked</strong><span>All planned work acknowledged.<br>Only you decide if the goal is finished.</span></div>`;dialog.showModal();}
function closeReview(){dialog.close();const target=$('[data-action="review"]')||$('[data-action="resume"]');if(target)target.focus();else main.focus();}
function notify(message,undo=false){clearTimeout(noticeTimeout);$('#notice').classList.toggle('completion-notice',undo);$('#notice').innerHTML=`<span class="tick" aria-hidden="true">✓</span><span>${escapeHTML(message)}</span>${undo?'<button class="text-button" data-action="undo">Undo</button>':''}`;noticeTimeout=setTimeout(()=>{$('#notice').textContent='';},undo?12000:5000);}
function complete(){if(!currentStep()||state.finished)return;stopClock();completionSnapshot=structuredClone(state);currentStep().simulatedElapsedSeconds=state.elapsedSeconds;const completedIndex=state.completed;state.completed++;state.long=false;state.seconds=state.duration*60;state.elapsedSeconds=0;state.blockStarted=false;state.view='today';render({moveFocus:true});respondToCompletion('example-goal',`example-${completedIndex}`,true);notify('Step complete. Another checkpoint earned.',true);if(!currentStep())showReview();}
function celebrate(){if(state.finished||currentStep()||!dialog.open)return;dialog.close();clearUndo();state.finished=true;state.view='finished';render();showReward(exampleGoalTitle,true);}
function showReward(title,fictional=false,model=state){
  closeReward();$('#reward-goal').textContent=title;$('#reward-kind').textContent=fictional?'Fictional example — no real work was submitted.':'Goal finished and stored in this browser.';
  $('#reward-summit').innerHTML=routeSVG({finished:true,real:!fictional,model});
  $('#reward').showModal();$('#reward [data-action="exit-celebration"]').focus();
  const summit=$('#reward-summit .mountain-art');
  playMountainFeedback([summit],'summit-celebrating',950);
  travelMarker(summit,1,{summit:true});
  if(motion.matches||!ambience)return;
  const burst=document.createElement('div');burst.className='confetti';burst.setAttribute('aria-hidden','true');
  for(let i=0;i<36;i++){const piece=document.createElement('i');piece.style.cssText=`--x:${(i*37)%100}vw;--y:${45+(i*17)%40}vh;--turn:${i*43}deg;--drift:${(i%2?1:-1)*(35+i*3)}px;background:${['#4167ec','#75d7dc','#7849df','#f7b49d','#e7bf45'][i%5]}`;burst.append(piece);}
  $('#reward').append(burst);celebrationTimeout=setTimeout(()=>burst.remove(),1450);
}
function closeReward(){clearMountainFeedback();clearTimeout(celebrationTimeout);$('.confetti')?.remove();$('#reward-summit').replaceChildren();if($('#reward')?.open){$('#reward').close();main.focus({preventScroll:true});}}
function exitCelebration(){closeReward();}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.theme){clearMountainFeedback();theme=button.dataset.theme;document.documentElement.dataset.theme=theme;document.querySelectorAll('button[data-theme]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.theme===theme)));return;}
   if(button.dataset.action==='ambience'){if(!motion.matches)ambience=!ambience;updateMotion();return;}
   if(button.dataset.action==='exit-celebration'){exitCelebration();return;}
    if(!exampleMode)return;
    if(button.dataset.exampleScene){loadExample(button.dataset.exampleScene);return;}
   if(button.dataset.nav){go(button.dataset.nav);return;}
  if(button.dataset.extend){startClock(Number(button.dataset.extend));return;}
  if(button.dataset.record){state.selected=Number(button.dataset.record);routePreview=null;highlightRecord(state.selected);document.querySelectorAll('[data-record]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.record)===state.selected)));return;}
  switch(button.dataset.action){
     case 'end-example-block':state.blockStarted=false;state.seconds=state.duration*60;go('focus');break;
     case 'copy-example':{
       const s=currentStep(),brief=[`Goal: ${exampleGoalTitle}`,`Action: ${s.title}`,s.nextInstruction&&`Saved next move: ${s.nextInstruction}`,s.context&&`Where I stopped: ${s.context}`,s.resourceUrl&&`Work link: ${s.resourceUrl}`].filter(Boolean).join('\n\n');
       Promise.resolve().then(()=>{if(typeof navigator.clipboard?.writeText!=='function')throw new Error('Clipboard unavailable');return navigator.clipboard.writeText(brief);}).then(()=>{if(button.isConnected&&$('#example-copy-status'))$('#example-copy-status').textContent='Saved place copied (fictional example).';}).catch(()=>{if(button.isConnected)manualExampleCopy(brief);});break;
     }
     case 'reset':reset();break;
      case 'ambience':if(!motion.matches)ambience=!ambience;updateMotion();break;
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
document.addEventListener('submit',event=>{if(!exampleMode)return;event.preventDefault();if(event.target.id==='pause-form'&&currentStep()){const note=$('#return-note').value;if($('[data-example-remove="return-note"]')?.checked)currentStep().nextInstruction='';else if(note.trim())currentStep().nextInstruction=note;const context=$('#pause-context').value;if($('[data-example-remove="pause-context"]')?.checked)currentStep().context='';else if(context.trim())currentStep().context=context;go('today');notify('Return instruction saved in this example.');}if(event.target.id==='add-form'&&dialog.open&&!state.finished){const input=$('#new-step');if(!input.value.trim()){input.setCustomValidity('Write the next step, or keep the goal open.');input.reportValidity();return;}clearUndo();state.steps.push(makeStep(input.value.trim()));dialog.close();go('today');notify('Step added. Goal kept open.');}});
$('#new-step').addEventListener('input',()=>$('#new-step').setCustomValidity(''));
dialog.addEventListener('cancel',event=>{if(exampleMode){event.preventDefault();closeReview();}});
$('#reward').addEventListener('cancel',event=>{event.preventDefault();closeReward();});
dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('button,input')].filter(el=>!el.disabled&&el.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
$('#scenario').addEventListener('change',event=>{if(!exampleMode)return;const scenario=event.target.value;if(scenario.startsWith('sample-')){loadExample(scenario.slice(7));return;}reset();if(scenario==='long'){state.long=true;currentStep().nextInstruction=longInstruction;render();}else if(scenario==='focus')go('focus');else if(scenario==='final'){state.completed=state.steps.length;render();showReview();$('#scenario').value='final';}else if(scenario==='expired'){state.seconds=0;state.blockStarted=true;go('expired');}else {if(scenario==='finished'){state.completed=state.steps.length;state.finished=true;}go(scenario);}});
$('#reset').addEventListener('click',()=>{if(exampleMode)loadExample(state.sampleScene||'saved');});
function manualExampleCopy(brief){const area=$('#example-copy-status');if(!area)return;area.textContent='Clipboard unavailable. Copy fictional brief: ';const input=document.createElement('textarea');input.readOnly=true;input.setAttribute('aria-label','Fictional saved-place brief');input.value=brief;area.append(input);input.focus();}
document.addEventListener('input',event=>{if(exampleMode&&event.target.dataset.exampleRemove)$(`#${event.target.dataset.exampleRemove}`).readOnly=event.target.checked;});
$('.brand').addEventListener('click',event=>{event.preventDefault();if(exampleMode)go('landing');});
document.addEventListener('change',event=>{if(event.target.id==='duration'){state.duration=Number(event.target.value);state.seconds=state.duration*60;}});
const motion=matchMedia('(prefers-reduced-motion: reduce)');
ambience=!motion.matches;
function updateMotion(){document.body.classList.toggle('still',motion.matches||!ambience);if(motion.matches||!ambience){clearMountainFeedback();clearTimeout(celebrationTimeout);$('.confetti')?.remove();}const button=$('[data-action="ambience"]');if(button){button.disabled=motion.matches;button.setAttribute('aria-pressed',String(!motion.matches&&ambience));button.textContent=`Background motion: ${!motion.matches&&ambience?'On':'Off'}${motion.matches?' · system preference':''}`;}}
motion.addEventListener('change',()=>{if(motion.matches)ambience=false;updateMotion();});
document.addEventListener('pointerover',event=>{const row=event.target.closest('[data-record]');if(row&&event.pointerType!=='touch'){routePreview=Number(row.dataset.record);highlightRecord(routePreview);}});
document.addEventListener('pointerout',event=>{const row=event.target.closest('[data-record]');if(row&&!row.contains(event.relatedTarget)){routePreview=null;highlightRecord(state.selected);}});
document.addEventListener('focusin',event=>{const row=event.target.closest('[data-record]');if(row){routePreview=Number(row.dataset.record);highlightRecord(routePreview);}});
document.addEventListener('focusout',event=>{if(event.target.closest('[data-record]')){routePreview=null;highlightRecord(state.selected);}});
reset();
go('landing');
bootWork({$,main,escapeHTML,formatTime,routeSVG,finishedArt,respondToCompletion,clearMountainFeedback,landingHTML:main.innerHTML,showReward,closeReward,updateMotion,
  installSharedViews(api){sharedViews=api;},
  refreshExampleRecords(){if(useSamples&&state.sampleScene!=='empty')sampleHistory=exampleRecords();return useSamples?sampleHistory:legacyHistory();},
  enterExample(entry='saved'){exampleMode=true;loadExample(entry);},
  leaveExample(){stopClock();exampleMode=false;closeReward();if(dialog.open)dialog.close();clearUndo();}});
