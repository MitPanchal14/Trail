// Optional local integration harness. Uses existing Playwright; never installed by npm test.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import http from 'node:http';
const url=process.env.TRAIL_URL||'http://127.0.0.1:3000/';
const output=process.env.TRAIL_EVIDENCE||'/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-evidence';
await mkdir(output,{recursive:true});
const browser=await chromium.launch(process.env.TRAIL_CHROMIUM?{executablePath:process.env.TRAIL_CHROMIUM,args:['--no-sandbox']}:{});
try {
  if(process.env.TRAIL_GATE==='examples')await runExamples(browser);
  else if(process.env.TRAIL_GATE==='clarity')await runClarity(browser);
  else if(process.env.TRAIL_GATE==='priority')await runPriority(browser);
  else if(process.env.TRAIL_GATE==='year-archive')await runYearArchive(browser);
  else if(process.env.TRAIL_GATE==='activity')await runActivity(browser);
  else if(process.env.TRAIL_GATE==='note-removal')await runNoteRemoval(browser);
  else if(['compact','compact-before'].includes(process.env.TRAIL_GATE))await runCompact(browser,process.env.TRAIL_GATE==='compact-before');
  else if(process.env.TRAIL_GATE==='final-demo')await runFinalDemo(browser);
  else if(process.env.TRAIL_GATE==='end-block')await runEndBlock(browser);
  else if(process.env.TRAIL_GATE==='travelling')await runTravelling(browser);
  else if(process.env.TRAIL_GATE==='return-fixes')await runReturnFixes(browser);
  else if(process.env.TRAIL_GATE==='rewards')await runRewards(browser);
  else if(process.env.TRAIL_GATE==='mountain')await runMountain(browser);
  else if(process.env.TRAIL_GATE==='return')await runReturn(browser);
  else if(process.env.TRAIL_GATE==='correction')await runCorrections(browser);
  else {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.click('#example-mode');
  for(const theme of ['light','dark']) {
    await page.click(`[data-theme="${theme}"]`);
    for(const view of ['landing','today','focus','pause']){
      await page.selectOption('#scenario',view);
      await page.screenshot({path:`${output}/final-${theme}-${view}.png`,fullPage:true});
    }
    await page.selectOption('#scenario','focus');await page.click('[data-action="resume"]');
    assert.equal(await page.locator('.focus-track').count(),0);
    const motion=page.locator('[data-action="ambience"]');
    await motion.focus();await page.keyboard.press('Space');
    assert.match(await motion.textContent(),/Off/);
    const transform=()=>page.locator('.focus-surround i').first().evaluate(e=>getComputedStyle(e).transform);
    const frozen=await transform();await page.waitForTimeout(250);
    assert.equal(await transform(),frozen);
    await page.click('[data-nav="today"]');await page.click('[data-action="return-focus"]');
    assert.match(await motion.textContent(),/Off/);
    await motion.click();const moving=await transform();await page.waitForTimeout(500);
    assert.notEqual(await transform(),moving);
    await page.screenshot({path:`${output}/A-${theme}-focus.png`,fullPage:true});
    await page.selectOption('#scenario','final');await page.click('[data-action="confirm"]');
    await page.locator('#reward[open]').waitFor();
    assert.match(await page.locator('#reward-title').textContent(),/You followed through. One step at a time./);
    assert.equal(await page.locator('.finished-card').count(),1);
    assert.ok(await page.locator('#reward').evaluate(e=>e.getBoundingClientRect().width<=480));
    assert.equal(await page.locator('.confetti i').count(),36);
    assert.equal(await page.locator('.confetti i').first().evaluate(e=>getComputedStyle(e).animationIterationCount),'1');
    await page.waitForTimeout(220);
    assert.ok(await page.locator('.confetti i').nth(1).evaluate(e=>Number(getComputedStyle(e).opacity)>0));
    await page.screenshot({path:`${output}/A-${theme}-reward.png`,fullPage:true});
    await page.waitForTimeout(1500);assert.equal(await page.locator('.confetti').count(),0);
    await page.keyboard.press('Escape');assert.equal(await page.locator('#reward').evaluate(e=>e.open),false);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
    await page.click('[data-nav="today"]');await page.click('[data-nav="finished"]');
    assert.equal(await page.locator('#reward').evaluate(e=>e.open),false);
    await page.click('[data-nav="journey"]');await page.locator('[data-record="3"]').click();
    assert.match(await page.locator('.record-detail').textContent(),/Checked in this fictional example/);
  }
  await page.setViewportSize({width:390,height:844});
  await page.selectOption('#scenario','final');await page.click('[data-action="confirm"]');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:output+'/A-phone-reward.png',fullPage:true});
  await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.selectOption('#scenario','focus');
  assert.equal(await page.locator('[data-action="ambience"]').isDisabled(),true);
  assert.equal(await page.locator('.focus-surround i').first().evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.selectOption('#scenario','final');await page.click('[data-action="confirm"]');
  assert.equal(await page.locator('.confetti').count(),0);
  assert.deepEqual(errors,[]);
  console.log('Gate A passed: motion, keyboard, reward, cleanup/no replay, themes, 390px, reduced motion.');
  if(process.env.TRAIL_GATE!=='C')await runB(browser);
  await runC(browser);
  await runEdges(browser);
  await runCorrections(browser);
  await runReturn(browser);
  await runTravelling(browser);
  await runMountain(browser);
  await runRewards(browser);
  await runReturnFixes(browser);
  await runEndBlock(browser);
  await runFinalDemo(browser);
  await runCompact(browser);
  await runNoteRemoval(browser);
  await runActivity(browser);
  await runYearArchive(browser);
  await runPriority(browser);
  await runClarity(browser);
  await runExamples(browser);
  }
} finally {await browser.close();}

async function snapshot(page){return page.evaluate(async()=>{
  const {openDatabase}=await import('/storage.js');const db=await openDatabase();
  return new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readonly'),r=tx.objectStore('workspace').get('current');let value;r.onsuccess=()=>value=r.result;tx.oncomplete=()=>{db.close();resolve(value);};tx.onerror=()=>reject(tx.error);});
});}
async function runExamples(browser){
  const c=await browser.newContext({viewport:{width:1440,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await create(p,'Real work stays separate',['Draft','Review']);await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('[data-work="undo"]').waitFor();const before=await snapshot(p);assert.ok(before.undo);await p.click('[data-work="edit"]');await p.fill('#goal-title','Unsaved real draft');await p.selectOption('#goal-priority','important');await p.click('.brand');await p.click('[data-demo-entry="activity"]');await p.locator('.activity-month').first().waitFor();assert.match(await p.locator('#mode-label').textContent(),/Fictional example/);assert.equal(await p.locator('.finished-card').count(),8);assert.equal(await p.locator('.finished-card[data-priority="important"]').count()>0,true);assert.equal(await p.locator('#activity-actions').evaluate(el=>el.open),false);
    const expected=await p.evaluate(async()=>{const {exampleRecords,deriveActivity}=await import('/activity.js');return deriveActivity(exampleRecords());});assert.equal(await p.locator('[data-activity-total]').textContent(),String(expected.total));
    for(const month of expected.months){const d=month.days.find(d=>d.count);await p.locator(`[data-activity-day="${d.key}"]`).click();await p.click('#activity-actions-toggle');assert.equal(await p.locator('.activity-details li').count(),d.count);for(const item of d.items)assert.ok((await p.locator('.activity-details').textContent()).includes(item.title));}
    for(const level of [0,1,2,3,4]){const day=expected.days.find(d=>d.level===level&&!d.future);await p.fill('#activity-date',day.key);await p.click('#activity-view-day');assert.equal(await p.locator(`[data-activity-day="${day.key}"]`).getAttribute('data-level'),String(level));assert.equal(await p.locator('#activity-actions').evaluate(el=>el.open),false);await p.click('#activity-actions-toggle');assert.match(await p.locator('.activity-details').textContent(),new RegExp(`${day.count} completed action`));}
    const map=await p.locator('[data-activity-day]').evaluateAll(ds=>ds.map(d=>[d.dataset.activityDay,d.dataset.level]));await p.click('#reset');assert.deepEqual(await p.locator('[data-activity-day]').evaluateAll(ds=>ds.map(d=>[d.dataset.activityDay,d.dataset.level])),map);assert.deepEqual(await snapshot(p),before);
    for(const width of [1440,390])for(const theme of ['light','dark']){await p.setViewportSize({width,height:width===390?844:900});await p.click(`button[data-theme="${theme}"]`);await p.waitForTimeout(200);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/examples-year-${theme}-${width}.png`,fullPage:true});await p.locator('.archive-title').first().click();await p.locator('#history-detail[open]').waitFor();assert.match(await p.locator('#history-detail-body').textContent(),/Fictional example/);await p.screenshot({path:`${output}/examples-dialog-${theme}-${width}.png`});await p.click('#history-detail-close');}
    await p.evaluate(()=>{window.exampleClock=Date.parse('2027-01-01T12:00Z');Date.now=()=>window.exampleClock;window.dispatchEvent(new Event('focus'));});await p.waitForFunction(()=>document.querySelector('.activity-month:last-child')?.getAttribute('aria-label')==='Jan 2027');assert.equal(await p.locator('.activity-month').evaluateAll(ms=>ms.every(m=>m.querySelector('[data-level]:not([data-level="0"])'))),true);assert.deepEqual(await snapshot(p),before);
    await p.selectOption('#scenario','sample-browse');assert.equal(await p.locator('.scenario-choice').count(),8);await p.click('[data-example-scene="focus"]');assert.match(await p.locator('.timer-label').textContent(),/paused/);await p.click('[data-action="resume"]');assert.match(await p.locator('.timer-label').textContent(),/running/);await p.click('[data-action="pause"]');await p.click('#pause-form [type="submit"]');await p.click('[data-action="return-focus"]');await p.click('[data-action="end-example-block"]');assert.equal(await p.locator('.end-block-control').count(),0);
    await p.selectOption('#scenario','sample-interrupted');assert.match(await p.locator('#main').textContent(),/simulated interruption/);await p.selectOption('#scenario','sample-review');await p.locator('#review[open]').waitFor();assert.equal(await p.locator('#reward[open]').count(),0);await p.click('#review [data-action="keep-open"]');await p.selectOption('#scenario','sample-long');assert.ok((await p.locator('.action-area .instruction').textContent()).length>240);await p.click('[data-action="pause"]');await p.check('[data-example-remove="return-note"]');await p.click('#pause-form [type="submit"]');assert.equal(await p.locator('.original-step').count(),0);
    await p.selectOption('#scenario','sample-empty');assert.equal(await p.locator('[data-activity-total]').textContent(),'0');assert.equal(await p.locator('.finished-card').count(),0);await p.selectOption('#scenario','sample-saved');assert.match(await p.locator('.action-area .instruction').textContent(),/capacity table/);assert.equal(await p.locator('#clock').count(),0);await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{}}));await p.click('[data-action="copy-example"]');await p.locator('textarea[aria-label="Fictional saved-place brief"]').waitFor();assert.match(await p.locator('textarea[aria-label="Fictional saved-place brief"]').inputValue(),/Goal: Prepare the workshop update/);assert.deepEqual(await snapshot(p),before);
    await p.click('#real-mode');await p.click('[data-work="edit"]');assert.equal(await p.inputValue('#goal-title'),'Unsaved real draft');assert.equal(await p.inputValue('#goal-priority'),'important');assert.deepEqual(await snapshot(p),before);await p.click('[data-work="cancel"]');await p.click('[data-work="start"]');await p.click('#example-mode');const paused=await snapshot(p);assert.equal(paused.sessions[paused.activeSessionId].status,'paused');assert.match(await p.locator('#mode-label').textContent(),/Fictional example/);await p.click('#real-mode');await p.click('[data-work="edit"]');await p.selectOption('#goal-priority','low');await p.evaluate(()=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);this.transaction.abort();return r;};});await p.click('#goal-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();await p.click('#example-mode');assert.match(await p.locator('#mode-label').textContent(),/Real work/);assert.deepEqual(await snapshot(p),paused);assert.deepEqual(errors,[]);
    console.log('Examples gate passed: populated shared twelve months/every tier/exact tasks, eight priority goals/dialogs, reset, gallery/stopped Focus/explicit timer/pause/End/simulated recovery/review/long/removal/empty, themes/390/desktop, real drafts/Undo/snapshots/running pause/pending guard isolation.');
  }finally{await c.close();}
}
async function runClarity(browser){
  const c=await browser.newContext({viewport:{width:1440,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});assert.equal(await p.locator('.hero-copy h1').textContent(),'Pick up where you left off.');assert.equal(await p.locator('[data-demo-entry]').count(),3);assert.ok((await p.locator('.hero-discovery').boundingBox()).y+(await p.locator('.hero-discovery').boundingBox()).height<=900);
    for(const width of [1440,390])for(const theme of ['light','dark']){await p.setViewportSize({width,height:width===390?844:900});await p.click(`button[data-theme="${theme}"]`);await p.waitForTimeout(200);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/clarity-fresh-${theme}-${width}.png`});}
    const note='Exact <draft> 日本語\n'.repeat(150).trim(),title='Review workshop capacity and every confirmed room option '.repeat(3).slice(0,160);
    await p.evaluate(async({note,title})=>{const {LocalStore,openDatabase}=await import('/storage.js'),s=new LocalStore(()=>{});s.db=await openDatabase();s.writer=true;let w=await s.read();s.token=w.ownerToken;const run=async(type,fields={})=>w=(await s.commit(w,{id:crypto.randomUUID(),type,...fields})).workspace;for(const [i,priority] of ['low','normal','important'].entries()){await run('save-goal',{goalId:null,title:i===2?title:`Workshop ${priority}`,definition:'Confirmed room and attendance plan.',priority,actions:[{id:`clarity-${i}`,title:'Compare room options'}]});const id=w.openGoalId;await run('notes',{instruction:note,context:note,resourceUrl:'https://example.com/capacity?q=rooms#next'});await run('complete-action',{actionId:`clarity-${i}`});await run('finish-goal',{goalId:id});}s.db.close();},{note,title});
    await p.reload();await p.locator('.hero-cta').waitFor();assert.equal(await p.locator('[data-demo-entry]').count(),3);await p.click('[data-nav="finished"]');const before=await snapshot(p);assert.equal(await p.locator('#activity-actions').evaluate(el=>el.open),false);await p.click('#activity-actions-toggle');assert.equal(await p.locator('.activity-details li:visible').count(),3);await p.locator('[data-activity-day]:not(:disabled)').first().click();assert.equal(await p.locator('#activity-actions').evaluate(el=>el.open),false);await p.click('[data-archive-jump]');assert.equal(await p.locator('#finished-goals').evaluate(el=>el===document.activeElement),true);assert.equal(await p.locator('#finished-goals').textContent(),'Finished goals (3)');assert.equal(await p.locator('.finished-card details').count(),0);
    for(const width of [1440,390])for(const theme of ['light','dark']){await p.setViewportSize({width,height:width===390?844:900});await p.click(`button[data-theme="${theme}"]`);await p.waitForTimeout(200);assert.equal(await p.locator('.finished-card[data-priority]').count(),3);const gradients=await p.locator('.finished-card').evaluateAll(els=>els.map(el=>getComputedStyle(el).backgroundImage));assert.equal(new Set(gradients).size,3);await p.locator(`[data-priority="important"] .archive-title`).click();await p.locator('#history-detail[open]').waitFor();assert.ok((await p.locator('#history-detail-body').textContent()).includes(note));assert.equal(await p.locator('#history-detail-body .work-link').getAttribute('href'),'https://example.com/capacity?q=rooms#next');assert.equal(await p.locator('#history-detail-body draft').count(),0);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/clarity-detail-${theme}-${width}.png`});await p.keyboard.press('Escape');assert.equal(await p.locator('[data-priority="important"] .archive-title').evaluate(el=>el===document.activeElement),true);}
    await p.locator('.archive-title').first().click();await p.click('#history-detail-close');assert.deepEqual(await snapshot(p),before);const reader=await c.newPage();await reader.goto(url);await reader.locator('#storage-status').waitFor();await reader.click('[data-nav="finished"]');await reader.locator('.archive-title').first().click();await reader.locator('#history-detail[open]').waitFor();await reader.click('#history-detail-close');await reader.close();assert.deepEqual(await snapshot(p),before);
    await p.evaluate(()=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);if(window.clarityAbort){window.clarityAbort=false;this.transaction.abort();}return r;};window.clarityAbort=true;});await p.locator('[data-reopen-goal]').first().click();await p.locator('#storage-status [role="alert"]').waitFor();const message=await p.locator('#storage-status').textContent();await p.locator('.archive-title').first().click();await p.locator('#history-detail[open]').waitFor();assert.equal(await p.locator('#storage-status').textContent(),message);assert.deepEqual(await snapshot(p),before);await p.click('#history-detail-close');await p.click('#storage-status [data-work="retry"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="keep-open"]');
    assert.deepEqual(errors,[]);console.log('Clarity gate passed: fresh viewport/home demo access, collapsed day details/jump, three semantic palettes, exact escaped history dialog/safe links, themes/phone/desktop/focus return/read-only/pending exact Retry/no writes.');
  }finally{await c.close();}
}
async function runPriority(browser){
  const c=await browser.newContext(),p=await c.newPage();
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await create(p,'Priority compatibility',['First']);let w=await snapshot(p),id=w.openGoalId;assert.equal(w.goals[id].priority,'normal');
    await p.evaluate(async()=>{const {openDatabase}=await import('/storage.js'),db=await openDatabase();await new Promise(resolve=>{const tx=db.transaction('workspace','readwrite'),os=tx.objectStore('workspace'),r=os.get('current');r.onsuccess=()=>{delete r.result.goals[r.result.openGoalId].priority;os.put(r.result,'current');};tx.oncomplete=resolve;});db.close();});await p.reload();await p.locator('.workspace').waitFor();await p.click('[data-work="edit"]');assert.equal(await p.inputValue('#goal-priority'),'normal');await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();
    await p.click('[data-work="edit"]');await p.selectOption('#goal-priority','important');await p.click('[data-nav="journey"]');await p.click('#example-mode');await p.click('#real-mode');await p.click('[data-work="edit"]');assert.equal(await p.inputValue('#goal-priority'),'important');await p.click('[data-work="cancel"]');assert.equal((await snapshot(p)).goals[id].priority,'normal');
    for(const priority of ['low','normal','important']){await p.click('[data-work="edit"]');await p.selectOption('#goal-priority',priority);await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();assert.equal((await snapshot(p)).goals[id].priority,priority);}
    await p.click('[data-work="edit"]');await p.selectOption('#goal-priority','low');const before=await snapshot(p);
    await p.evaluate(async()=>{window.priorityOps=[];const {LocalStore}=await import('/storage.js'),commit=LocalStore.prototype.commit;LocalStore.prototype.commit=function(w,op){window.priorityOps.push(structuredClone(op));return commit.call(this,w,op);};const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);if(window.priorityAbort){window.priorityAbort=false;this.transaction.abort();}return r;};window.priorityAbort=true;});
    await p.click('#goal-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();assert.deepEqual(await snapshot(p),before);assert.equal(await p.inputValue('#goal-priority'),'low');await p.click('#storage-status [data-work="retry"]');await p.locator('.workspace').waitFor();const ops=await p.evaluate(()=>window.priorityOps);assert.deepEqual(ops[0],ops[1]);assert.equal((await snapshot(p)).goals[id].priority,'low');await p.reload();await p.locator('.workspace').waitFor();await p.click('[data-work="edit"]');assert.equal(await p.inputValue('#goal-priority'),'low');await p.click('[data-work="cancel"]');
    await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-work="undo"]');await p.locator('.workspace').waitFor();assert.equal((await snapshot(p)).goals[id].priority,'low');await p.click('[data-work="resume"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');await p.click('[data-reopen-goal]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');w=await snapshot(p);assert.equal(w.goals[id].priority,'low');assert.deepEqual(w.goals[id].actionOrder,before.goals[id].actionOrder);assert.equal(Object.values(w.actions).filter(a=>a.status==='completed').length,1);
    console.log('Priority gate passed: enum/default/drafts/Cancel/modes, actual aborted save/exact Retry/reload, Undo/finish/reopen/refinish and unchanged order/count.');
  }finally{await c.close();}
}
async function runYearArchive(browser){
  const dimensions=[];
  for(const total of [0,1,8,9,30]){
    const c=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'America/New_York'}),p=await c.newPage(),errors=[];p.on('pageerror',err=>errors.push(err.message));
    await c.addInitScript(()=>{window.yearNow=Date.parse('2026-10-25T16:00Z');Date.now=()=>window.yearNow;});
    try{
      await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});
      // Isolated canonical historical fixtures; never normal-profile seed data.
      const fixture=await p.evaluate(async total=>{
        const {transition,validate}=await import('/state.js'),{openDatabase}=await import('/storage.js'),db=await openDatabase();
        let w=await new Promise(resolve=>{const r=db.transaction('workspace').objectStore('workspace').get('current');r.onsuccess=()=>resolve(r.result);});let seq=0;
        const run=(type,fields={},at=window.yearNow)=>{w=transition(w,{id:`year-op-${++seq}`,type,...fields},at);};
        const note=('Exact <draft> 日本語 résumé\n').repeat(100).trim(),reference='https://example.com/work?note='+ 'a'.repeat(1800)+'#next',longTitle=('Review the community workshop notes and prepare the complete volunteer briefing. ').repeat(3).slice(0,160);
        for(let i=0;i<total;i++){
          const actions=Array.from({length:i===total-1?30:1},(_,j)=>({id:`year-${i}-${j}`,title:j===0?'Exact <b> action 日本語':`Action ${j+1}`}));
          run('save-goal',{goalId:null,title:i===0?longTitle:`Workshop ${i+1}`,definition:'Agreed briefing ready.',actions});const goalId=w.openGoalId;
          run('notes',{instruction:note,context:note,resourceUrl:reference});
          const time=i===total-1?window.yearNow-1000:Date.UTC(2025,10+i%12,15,12);
          for(const action of actions)run('complete-action',{actionId:action.id},time);
          run('finish-goal',{goalId},time+i);
        }
        validate(w);await new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readwrite');tx.objectStore('workspace').put(w,'current');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();return {note,reference,longTitle};
      },total);
      await p.reload();await p.locator('.hero-cta').waitFor();await p.click('[data-nav="finished"]');await p.locator('#real-activity').waitFor();
      const canonical=await snapshot(p),expected=Math.min(8,total);assert.equal(await p.locator('[data-finished-goal]').count(),expected);assert.equal(await p.locator('#archive-count').textContent(),`Showing ${expected} of ${total} finished ${total===1?'goal':'goals'}`);assert.equal(await p.locator('.activity-month').count(),12);assert.equal(await p.locator('[data-activity-day]').count(),365);assert.equal(await p.locator('.activity-day').evaluateAll(ds=>ds.every(d=>d.textContent==='')),true);assert.equal(await p.locator('.activity-padding').evaluateAll(ds=>ds.every(d=>d.getAttribute('aria-hidden')==='true'&&!d.hasAttribute('tabindex'))),true);
      for(const month of ['2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10']){
        const date=month+'-15';await p.fill('#activity-date',date);await p.click('#activity-date-form button');assert.equal(await p.locator(`[data-activity-day="${date}"]`).getAttribute('aria-pressed'),'true');assert.equal(await p.locator('#activity-date').inputValue(),date);
      }
      await p.locator('[data-activity-day="2025-12-31"]').focus();await p.keyboard.press('ArrowDown');assert.equal(await p.locator('[data-activity-day="2026-01-01"]').getAttribute('aria-pressed'),'true');await p.keyboard.press('Home');assert.equal(await p.locator('[data-activity-day="2025-12-29"]').getAttribute('aria-pressed'),'true');await p.keyboard.press('End');assert.equal(await p.locator('[data-activity-day="2026-01-04"]').getAttribute('aria-pressed'),'true');
      await p.fill('#activity-date','2026-10-26');assert.equal(await p.locator('#activity-date').evaluate(el=>el.validity.rangeOverflow),true);assert.equal(await p.locator('[data-activity-day="2026-10-26"]').isDisabled(),true);await p.fill('#activity-date','2026-10-25');await p.click('#activity-date-form button');
      if(total){assert.equal(await p.locator('.activity-details li').count(),30);assert.equal(await p.locator('.activity-details li:visible').count(),0);await p.click('#activity-actions-toggle');assert.equal(await p.locator('.activity-details li:visible').count(),8);assert.equal(await p.locator('[data-activity-day="2026-10-25"]').getAttribute('data-level'),'4');await p.click('#activity-more summary');assert.equal(await p.locator('.activity-details li:visible').count(),30);assert.equal(await p.locator('.activity-details b').count(),0);await p.click('#activity-more summary');}
      for(const width of [1440,390])for(const theme of ['light','dark']){
        await p.setViewportSize({width,height:width===390?844:1000});await p.click(`button[data-theme="${theme}"]`);await p.waitForTimeout(200);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await p.locator('#activity-view-day').evaluate(el=>getComputedStyle(el).backgroundColor===getComputedStyle(el.closest('.activity-panel')).backgroundColor),true,'Date alternative matches the settled theme surface');
        const layout=await p.locator('.finished-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);assert.equal(layout,width===390?1:2);
        const size=await p.locator('.activity-day').first().boundingBox();assert.equal(size.width,14);assert.equal(size.height,14);assert.ok(await p.locator('#activity-date-form button').evaluate(el=>el.getBoundingClientRect().height>=44));
        if(total===9){const sizes=await p.locator('.finished-card').evaluateAll(els=>els.map(el=>({width:Math.round(el.getBoundingClientRect().width),height:Math.round(el.getBoundingClientRect().height)})));dimensions.push({width,theme,cards:sizes});await p.screenshot({path:`${output}/year-archive-after-${theme}-${width}.png`,fullPage:true});}
      }
      while(await p.locator('[data-archive-more]').isVisible())await p.click('[data-archive-more]');assert.equal(await p.locator('[data-finished-goal]').count(),total);assert.equal(await p.locator('[data-finished-goal]').evaluateAll(els=>new Set(els.map(el=>el.dataset.finishedGoal)).size),total);
      if(total){
        const long=p.locator('.finished-card').filter({has:p.getByRole('heading',{name:fixture.longTitle,exact:true})});await long.locator('.archive-title').click();assert.ok((await p.locator('#history-detail-body').textContent()).includes(fixture.note));assert.equal(await p.locator('#history-detail .work-link').first().getAttribute('href'),fixture.reference);assert.ok(await p.locator('#history-detail').evaluate(el=>el.getBoundingClientRect().width>innerWidth*.8));await p.click('#history-detail-close');await p.click('[data-nav="today"]');await p.click('[data-nav="finished"]');assert.equal(await p.locator('[data-finished-goal]').count(),total);await long.locator('.archive-title').click();assert.ok((await p.locator('#history-detail-body').textContent()).includes(fixture.note));await p.click('#history-detail-close');
      }
      assert.deepEqual(await snapshot(p),canonical);assert.equal(await p.locator('.travelling,.confetti,#reward[open]').count(),0);
      if(total===9){
        await p.evaluate(()=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);if(window.yearAbort){window.yearAbort=false;this.transaction.abort();}return r;};window.yearAbort=true;});const first=p.locator('[data-reopen-goal]').first(),id=await first.getAttribute('data-reopen-goal');await first.click();await p.locator('#storage-status [role="alert"]').waitFor();assert.deepEqual(await snapshot(p),canonical);assert.equal(await p.locator('[data-reopen-goal]:disabled').count(),9);await p.fill('#activity-date','2026-01-15');await p.click('#activity-date-form button');assert.deepEqual(await snapshot(p),canonical);await p.click('#storage-status [data-work="retry"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="keep-open"]');assert.equal((await snapshot(p)).openGoalId,id);await p.click('[data-nav="finished"]');assert.equal(await p.locator('[data-reopen-goal]:disabled').count(),8);
      }
      if(total===30){
        if(!await p.locator('#activity-help').evaluate(el=>el.open))await p.click('#activity-help summary');if(!await p.locator('#activity-actions').evaluate(el=>el.open))await p.click('#activity-actions-toggle');if(!await p.locator('#activity-more').evaluate(el=>el.open))await p.click('#activity-more summary');await p.fill('#activity-date','2026-10-20');await p.locator('#activity-date').focus();await p.evaluate(()=>window.yearNow=Date.parse('2026-11-01T05:01Z'));await p.waitForFunction(()=>document.querySelector('[data-activity-day="2026-11-01"]'));assert.equal(await p.locator('.activity-month').first().getAttribute('aria-label'),'Dec 2025');assert.equal(await p.locator('#activity-date').inputValue(),'2026-10-20');assert.equal(await p.locator('#activity-date').evaluate(el=>el===document.activeElement),true,'Date input focus retained');assert.equal(await p.locator('#activity-help').evaluate(el=>el.open),true,'Help expansion retained');assert.equal(await p.locator('#activity-more').evaluate(el=>el.open),true,'Busy-day expansion retained');assert.equal(await p.locator('[data-finished-goal]').count(),30);assert.deepEqual(await snapshot(p),canonical);
        const reader=await c.newPage();await reader.goto(url);await reader.locator('#storage-status').waitFor();await reader.click('[data-nav="finished"]');await reader.click('[data-archive-more]');assert.equal(await reader.locator('[data-finished-goal]').count(),16);assert.equal(await reader.locator('[data-reopen-goal]:disabled').count(),16);await reader.fill('#activity-date','2026-01-15');await reader.click('#activity-date-form button');assert.deepEqual(await snapshot(p),canonical);await reader.close();
      }
      assert.deepEqual(errors,[]);
    }finally{await c.close();}
  }
  console.log('Year/archive dimensions:',JSON.stringify(dimensions));console.log('Year/archive gate passed: 0/1/8/9/30, all months/date alternative/padding/keyboard/busy-day details, 14px tiles/44px equivalent, themes/desktop/390, eight + Show more/all IDs/expansion, long text/URL, read-only/pending Reopen and exact Retry, month rollover/focus/drafts/no writes.');
}
async function runActivity(browser){
  // Synthetic clock and browser timezone, isolated from the user's profile.
  const c=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York'}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>{errors.push(e.message);console.error('Activity page error:',e.message);});
  await c.addInitScript(()=>{
    window.activityNow=Number(sessionStorage.getItem('activityTestNow'))||Date.parse('2026-03-10T03:59:00Z');Date.now=()=>window.activityNow;
    const Format=Intl.DateTimeFormat,make=(locale,options)=>new Format(locale,{...options,...(!options?.timeZone&&window.activityZone?{timeZone:window.activityZone}:{})});Intl.DateTimeFormat=new Proxy(Format,{apply:(_target,_this,args)=>make(...args),construct:(_target,args)=>make(...args)});
  });
  const history=async n=>{await p.click('[data-nav="finished"]');await p.locator('[data-activity-total]').waitFor();assert.equal(await p.locator('[data-activity-total]').textContent(),String(n));};
  const complete=async()=>{await p.locator('[data-work="start"],[data-work="resume"]').first().click();await p.click('[data-work="complete"]');};
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await history(0);assert.match(await p.locator('.activity-details').textContent(),/No completed actions/);assert.match(await p.locator('.activity-badge').textContent(),/None earned/);assert.equal(await p.locator('[data-activity-day]').count(),365);assert.equal(await p.locator('.activity-month').count(),12);
    await p.click('a.brand');const title='<b>Exact goal 日本語</b>',action='<img src=x onerror=alert(1)> '+ 'Long action résumé '.repeat(20);
    await create(p,title,[action,'Second']);await complete();await history(1);assert.equal(await p.locator('.activity-details strong').textContent(),title);assert.equal(await p.locator('.activity-details li span').textContent(),action.trim());assert.equal(await p.locator('.activity-details img,.activity-details b').count(),0);
    const before=await snapshot(p),today=p.locator('[data-activity-day="2026-03-09"]');await today.focus();await p.keyboard.press('ArrowLeft');assert.equal(await p.locator('[data-activity-day="2026-03-02"]').getAttribute('aria-pressed'),'true');await p.keyboard.press('End');assert.equal(await p.locator('[data-activity-day="2026-03-08"]').getAttribute('aria-pressed'),'true');await p.keyboard.press('Home');await p.keyboard.press('ArrowRight');assert.equal(await today.getAttribute('aria-pressed'),'true');await p.keyboard.press('ArrowDown');assert.equal(await today.getAttribute('aria-pressed'),'true');assert.equal(await p.locator('[data-activity-day][tabindex="0"]').count(),1);assert.notEqual(await today.evaluate(el=>getComputedStyle(el).outlineStyle),'none');assert.deepEqual(await snapshot(p),before);assert.ok(before.undo);assert.equal(await p.locator('.travelling,.confetti,#reward[open]').count(),0);
    const cardIdentity=await p.evaluate(()=>{window.activityHeading=document.querySelector('.page-heading');document.querySelector('.activity-scroll').scrollLeft=220;return document.querySelector('.activity-scroll').scrollLeft;});
    await p.evaluate(()=>window.activityNow=Date.parse('2026-03-10T04:01:00Z'));await p.waitForFunction(()=>document.querySelector('[data-activity-day="2026-03-10"]')?.disabled===false);assert.equal(await today.evaluate(el=>el===document.activeElement),true);assert.equal(await p.locator('.activity-scroll').evaluate(el=>el.scrollLeft),cardIdentity);assert.equal(await p.evaluate(()=>window.activityHeading===document.querySelector('.page-heading')),true);
    await p.evaluate(()=>{window.activityZone='Asia/Tokyo';window.dispatchEvent(new Event('focus'));});await p.waitForFunction(()=>document.querySelector('[data-activity-zone]').textContent==='Asia/Tokyo');await p.click('[data-activity-day="2026-03-10"]');assert.match(await p.locator('.activity-details').textContent(),/1 completed action/);assert.deepEqual(await snapshot(p),before);
    for(const theme of ['light','dark']){await p.click(`button[data-theme="${theme}"]`);await p.waitForTimeout(200);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await today.evaluate(el=>el.getBoundingClientRect().width),14);assert.ok(await p.locator('#activity-date').evaluate(el=>el.getBoundingClientRect().height>=44));assert.ok(await p.locator('#activity-date-form button').evaluate(el=>el.getBoundingClientRect().height>=44));await p.screenshot({path:`${output}/activity-synthetic-${theme}-390.png`,fullPage:true});}
    await p.click('[data-work="undo"]');await history(0);await p.click('[data-nav="today"]');await complete();await history(1);await p.evaluate(()=>sessionStorage.setItem('activityTestNow',String(window.activityNow)));await p.reload();await p.locator('.workspace').waitFor();await history(1);
    await p.click('[data-nav="today"]');await complete();await p.locator('#review[open]').waitFor();await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');await history(2);await p.click('[data-reopen-goal]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');await history(2);
    await p.click('[data-reopen-goal]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="keep-open"]');const w=await snapshot(p),id=w.goals[w.openGoalId].actionOrder[0];await p.click(`[data-select="${id}"]`);await p.click('[data-work="reopen-action"]');await history(1);
    await p.click('[data-nav="today"]');await p.click('[data-work="start"]');await p.evaluate(async()=>{window.activityCommands=[];const {LocalStore}=await import('/storage.js'),commit=LocalStore.prototype.commit;LocalStore.prototype.commit=function(w,cmd){window.activityCommands.push(structuredClone(cmd));return commit.call(this,w,cmd);};const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const result=put.apply(this,args);if(window.activityAbort){window.activityAbort=false;this.transaction.abort();}return result;};window.activityAbort=true;});
    const preAbort=await snapshot(p);await p.click('[data-work="complete"]');await p.locator('#storage-status [role="alert"]').waitFor();assert.deepEqual(await snapshot(p),preAbort);await p.click('#storage-status [data-work="retry"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="keep-open"]');await history(2);const commands=await p.evaluate(()=>window.activityCommands.filter(c=>c.type==='complete-action'));assert.equal(commands.length,2);assert.deepEqual(commands[0],commands[1]);
    const reader=await c.newPage();await reader.addInitScript(()=>window.activityNow=Date.parse('2026-03-10T04:01:00Z'));await reader.goto(url);await reader.locator('.workspace').waitFor();await reader.click('[data-nav="finished"]');await reader.locator('[data-activity-total]').waitFor();assert.equal(await reader.locator('[data-activity-total]').textContent(),'2');const stable=await snapshot(p);await reader.locator('[data-activity-day]:not(:disabled)').first().click();assert.deepEqual(await snapshot(p),stable);await reader.close();
    await p.click('[data-nav="today"]');await p.click('[data-work="edit"]');await p.fill('#goal-title','Unsaved activity rollover draft');await p.evaluate(()=>{window.activityNow+=86400000;document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('focus'));});await p.waitForTimeout(1100);assert.equal(await p.inputValue('#goal-title'),'Unsaved activity rollover draft');assert.equal(await p.locator('#goal-title').evaluate(el=>el===document.activeElement),true);assert.deepEqual(await snapshot(p),stable);
    assert.deepEqual(errors,[]);console.log('Activity gate passed: canonical complete/Undo/recomplete, goal refinish/action reopen, aborted exact Retry, reload, escaped titles, keyboard/14px tiles + 44px date alternative/themes/390px, read-only/no writes, synthetic midnight/timezone refresh, focus/scroll/draft preservation.');
  }finally{await c.close();}
}
async function runNoteRemoval(browser){
  const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const extras=async()=>{if(!await p.locator('#pause-extras').evaluate(el=>el.open))await p.locator('#pause-extras summary').click();};
  async function edit(){await p.click('[data-work="pause"]');await extras();}
  async function save(){await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();}
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await create(p,'Remove an obsolete cue',['Draft','Review']);await edit();await p.fill('#return-note','Old next move');await p.fill('#pause-context','Old context');await p.fill('#work-url','https://example.com/draft#next');await save();let w=await snapshot(p);const id=w.goals[w.openGoalId].actionOrder[0],original=w.contexts[id];
    await edit();await p.fill('#return-note','Unsaved replacement');await p.locator('#remove-instruction').focus();await p.keyboard.press('Space');assert.equal(await p.locator('#return-note').evaluate(el=>el.readOnly),true);await p.uncheck('#remove-instruction');assert.equal(await p.inputValue('#return-note'),'Unsaved replacement');assert.equal(await p.locator('#return-note').evaluate(el=>el.readOnly),false);await p.check('#remove-instruction');await p.check('#remove-context');await p.click('[data-nav="journey"]');await p.click('#example-mode');await p.click('#real-mode');await edit();assert.equal(await p.isChecked('#remove-instruction'),true);assert.equal(await p.isChecked('#remove-context'),true);assert.equal(await p.inputValue('#return-note'),'Unsaved replacement');await p.click('[data-work="skip"]');assert.deepEqual((await snapshot(p)).contexts[id],original);
    await edit();assert.equal(await p.isChecked('#remove-instruction'),false);await p.fill('#return-note',' ');await p.fill('#pause-context','\n');await save();assert.equal((await snapshot(p)).contexts[id].nextInstruction,'Old next move');assert.equal((await snapshot(p)).contexts[id].context,'Old context');
    await edit();await p.check('#remove-instruction');await save();w=await snapshot(p);assert.equal(w.contexts[id].nextInstruction,'');assert.equal(w.contexts[id].context,'Old context');assert.equal(w.contexts[id].resourceUrl,original.resourceUrl);assert.match(await p.locator('.action-area .instruction').textContent(),/Draft/);assert.equal(await p.locator('.expedition-marker').first().getAttribute('data-station'),'camp');
    await edit();await p.fill('#return-note','New cue');await p.check('#remove-context');await save();w=await snapshot(p);assert.equal(w.contexts[id].nextInstruction,'New cue');assert.equal(w.contexts[id].context,'');assert.equal(w.contexts[id].id,original.id);
    await edit();await p.fill('#pause-context','New context');await save();await edit();await p.check('#remove-instruction');await p.check('#remove-context');await p.check('#remove-resource');const before=await snapshot(p);
    await p.evaluate(async()=>{window.noteCommands=[];const {LocalStore}=await import('/storage.js'),commit=LocalStore.prototype.commit;LocalStore.prototype.commit=function(w,cmd){window.noteCommands.push(structuredClone(cmd));return commit.call(this,w,cmd);};const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);if(window.abortRemoval){window.abortRemoval=false;this.transaction.abort();}return r;};window.abortRemoval=true;});
    await p.click('#real-pause-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();assert.deepEqual(await snapshot(p),before);assert.equal(await p.isChecked('#remove-instruction'),true);assert.equal(await p.locator('#remove-context').isDisabled(),true);assert.equal(await p.locator('[data-work="skip"]').isDisabled(),true);await p.screenshot({path:`${output}/notes-removal-abort-390.png`,fullPage:true});
    await p.click('#storage-status [data-work="retry"]');await p.locator('.workspace').waitFor();w=await snapshot(p);const commands=await p.evaluate(()=>window.noteCommands);assert.equal(commands.length,2);assert.deepEqual(commands[0],commands[1]);assert.equal(w.revision,before.revision+1);assert.equal(w.contexts[id].id,original.id);assert.equal(w.contexts[id].nextInstruction,'');assert.equal(w.contexts[id].context,'');assert.equal(Object.hasOwn(w.contexts[id],'resourceUrl'),false);assert.equal(await p.locator('[data-copy-place]').count(),0);assert.equal(await p.locator('.expedition-marker').first().getAttribute('data-station'),'expedition');assert.equal(await p.locator('.travelling,.confetti,#reward[open]').count(),0);assert.deepEqual(w.events,before.events);assert.deepEqual(w.intervals,before.intervals);
    await p.reload();await p.locator('.workspace').waitFor();assert.equal(await p.locator('[data-copy-place]').count(),0);await p.click('[data-work="edit"]');assert.equal(await p.locator(`[data-draft="remove"][data-id="${id}"]`).isDisabled(),true);await p.click('[data-work="cancel"]');
    const reader=await c.newPage();await reader.goto(url);await reader.locator('.workspace').waitFor();assert.equal(await reader.locator('[data-work="pause"]').isDisabled(),true);await reader.close();
    const cleared=(await snapshot(p)).contexts[id];await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('[data-work="undo"]').waitFor();await p.click('[data-work="undo"]');await p.locator('[data-work="resume"]').first().waitFor();assert.deepEqual((await snapshot(p)).contexts[id],cleared);
    await edit();await p.fill('#return-note','A current cue');await p.fill('#pause-context','A current context');await save();await edit();for(const theme of ['light','dark']){await p.click(`button[data-theme="${theme}"]`);await p.waitForTimeout(180);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/notes-removal-controls-${theme}-390.png`,fullPage:true});}assert.deepEqual(errors,[]);
    console.log('Phase A passed: independent/both text removal, blank/Skip, draft/toggle/navigation/modes, real aborted notes/exact Retry/reload, cleared copy/campsite/protected context, completion/Undo, read-only controls and keyboard/390px.');
  }finally{await c.close();}
}
async function runCompact(browser,beforeOnly=false){
  const c=await browser.newContext({viewport:{width:1440,height:1000}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const longTitle=('Review the community workshop plan with every volunteer and confirm the remaining room-booking decisions. ').repeat(2).slice(0,160),note=('Keep <draft> & 日本語 context exactly.\n').repeat(100).trim(),reference='https://example.com/workshop?q=1#next';
  async function capture(state){for(const theme of ['light','dark'])for(const width of [1440,390]){await p.setViewportSize({width,height:width===390?844:1000});await p.locator(`button[data-theme="${theme}"]`).evaluate(el=>el.click());await p.waitForTimeout(200);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/compact-${beforeOnly?'before':'after'}-${state}-${theme}-${width}.png`,fullPage:true});}}
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});
    // Synthetic canonical history fixtures, each committed through the actual storage engine.
    await p.evaluate(async({longTitle,note,reference})=>{
      const {LocalStore,openDatabase}=await import('/storage.js'),store=new LocalStore(()=>{});store.db=await openDatabase();store.writer=true;let w=await store.read();store.token=w.ownerToken;
      const apply=async(type,fields={})=>{w=(await store.commit(w,{id:crypto.randomUUID(),type,...fields})).workspace;};
      for(const [i,title] of ['Plan the workshop','Write the recap',longTitle].entries()){
        const actionId=`fixture-action-${i}`;await apply('save-goal',{goalId:null,title,definition:'The agreed update is ready.',actions:[{id:actionId,title:`Action ${i+1}`}]});const goalId=w.openGoalId;
        await apply('start',{minutes:20});await apply('pause',{deltaMs:15000});await apply('notes',{instruction:i===2?note:'Check the room booking.',context:i===2?note:'Keep the confirmed details.',resourceUrl:reference});await apply('complete-action',{actionId});await apply('finish-goal',{goalId});
      }store.db.close();
    },{longTitle,note,reference});
    await p.reload();await p.locator('.hero-cta').waitFor();await p.click('[data-nav="finished"]');await p.locator('.finished-card').first().waitFor();const history=await snapshot(p);assert.equal(await p.locator('.finished-card').count(),3);await capture('collapsed');
    const heights=await p.locator('.finished-card').evaluateAll(cards=>cards.map(el=>({title:el.querySelector('h2').textContent,height:Math.round(el.getBoundingClientRect().height)})));console.log(`${beforeOnly?'Before':'After'} compact phone heights:`,JSON.stringify(heights));
    await p.locator('.archive-title').first().click();await capture('long-expanded');await p.click('#history-detail-close');
    const ordinary=p.locator('.finished-card').filter({has:p.getByRole('heading',{name:'Plan the workshop',exact:true})});await ordinary.locator('.archive-title').click();await capture('ordinary-expanded');await p.click('#history-detail-close');
    if(beforeOnly)return;
    assert.equal(await p.locator('.finished-card .mountain-art,.finished-card .expedition-marker,.finished-card .mountain-mobile-caption,.expedition-person,.expedition-pack,.expedition-head,.expedition-coat').count(),0);
    assert.equal(await p.locator('.finished-outline').count(),3);assert.equal(await p.locator('.finished-art').evaluateAll(nodes=>nodes.every(n=>n.getAttribute('aria-hidden')==='true'&&getComputedStyle(n).pointerEvents==='none'&&getComputedStyle(n).overflow==='hidden')),true);
    for(const g of Object.values(history.goals)){const card=p.locator(`[data-finished-goal="${g.id}"]`);assert.equal(await card.locator('h2').textContent(),g.title);assert.equal(await card.locator(':scope > p').nth(0).textContent(),'1 action checked · 00:15 recorded effort');assert.equal(await card.locator(':scope > p').nth(1).textContent(),await p.evaluate(at=>`Completed ${new Date(at).toLocaleString()}`,g.completedAt));}
    for(const width of [1440,390]){
      await p.setViewportSize({width,height:1000});const box=await ordinary.boundingBox();assert.ok(box.height>=180&&box.height<=240,`Ordinary collapsed card height ${box.height} at ${width}`);
      assert.equal(await ordinary.evaluate(el=>{const card=el.getBoundingClientRect();return [...el.querySelectorAll('h2,p,summary,button')].filter(n=>n.getClientRects().length).every(n=>n.getBoundingClientRect().left>=card.left&&n.getBoundingClientRect().right<=card.right);}),true,'Foreground content stays within the full card width; decoration is non-interactive behind it');
      assert.equal(await ordinary.evaluate(el=>{const art=el.querySelector('.finished-art'),svg=art.querySelector('svg'),a=art.getBoundingClientRect(),s=svg.getBoundingClientRect();return s.bottom>a.bottom&&s.top<a.bottom&&getComputedStyle(svg).pointerEvents==='none'&&svg.getAttribute('focusable')==='false';}),true,'Decorative base is deliberately cropped, not the card contents');
      await p.bringToFront();await ordinary.locator('.archive-title').focus();await p.keyboard.press('Tab');const focus=await ordinary.locator('[data-reopen-goal]').evaluate(el=>{const card=el.closest('.finished-card'),r=el.getBoundingClientRect(),b=card.getBoundingClientRect();return {active:el===document.activeElement,documentFocused:document.hasFocus(),overflow:getComputedStyle(card).overflow,contained:r.left>=b.left+7&&r.right<=b.right-7,outline:getComputedStyle(el).outlineStyle,actualFocus:document.activeElement?.outerHTML.slice(0,200)};});assert.ok(focus.active&&focus.documentFocused&&focus.overflow==='visible'&&focus.contained&&focus.outline!=='none',`Unclipped keyboard focus: ${JSON.stringify(focus)}`);
    }
    const longCard=p.locator('.finished-card').filter({has:p.getByRole('heading',{name:longTitle,exact:true})});await longCard.locator('.archive-title').click();assert.equal(await longCard.locator('h2').textContent(),longTitle);assert.ok((await p.locator('#history-detail-body').textContent()).includes(note));const link=p.locator('#history-detail .work-link');assert.equal(await link.getAttribute('href'),reference);assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
    await p.route('https://example.com/**',route=>route.fulfill({body:'Synthetic work-reference target'}));const popupPromise=p.waitForEvent('popup');await link.click();const popup=await popupPromise;await popup.waitForLoadState();assert.equal(await popup.evaluate(()=>window.opener),null);await popup.close();assert.deepEqual(await snapshot(p),history);assert.equal(await p.locator('.travelling,.confetti,#reward[open]').count(),0);
    await p.reload();await p.click('[data-nav="finished"]');assert.equal(await p.locator('.finished-outline').count(),3);assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);const preReopen=await snapshot(p),goal=Object.values(preReopen.goals).find(g=>g.title==='Plan the workshop');
    await p.locator(`[data-finished-goal="${goal.id}"] [data-reopen-goal]`).click();await p.locator('#review[open]').waitFor();await p.keyboard.press('Escape');let w=await snapshot(p);assert.equal(w.openGoalId,goal.id);assert.deepEqual(w.intervals,preReopen.intervals);assert.deepEqual(w.contexts,preReopen.contexts);assert.equal(await p.locator('.mountain-art').count(),1);assert.equal(await p.locator('.progress-dot').count(),1);assert.equal(await p.locator('.expedition-marker').getAttribute('data-station'),'review');await p.click('[data-nav="finished"]');assert.equal(await p.locator('[data-reopen-goal]:disabled').count(),2);assert.match(await p.locator('.finished-card').first().textContent(),/Another goal is open/);await capture('blocked');
    await p.click('#example-mode');await p.selectOption('#scenario','finished');assert.equal(await p.locator('.finished-card .mountain-art').count(),0);assert.equal(await p.locator('.finished-outline').count(),1);assert.match(await p.locator('.finished-card').textContent(),/Fictional example/);await p.click('[data-nav="journey"]');assert.equal(await p.locator('.progress-dot').count(),1);assert.equal(await p.locator('.expedition-person').count(),0);assert.deepEqual(errors,[]);
    console.log('Compact gate passed: short/max titles, long exact notes/safe link, multiple goals, natural expansion, measured card heights, reserved art/cropped base/visible focus, real history/reopen/blocked guard/no writes or replay, circle-only active/review and isolated fictional cards.');
  }finally{await c.close();}
}
async function runFinalDemo(browser){
  const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  async function clipboard(page){await page.evaluate(()=>{
    window.copyPayloads=[];window.clipMode='success';const api={writeText:async text=>{window.copyPayloads.push(text);if(window.clipMode==='denied')throw new DOMException('Denied','NotAllowedError');if(window.clipMode==='delay')await new Promise(resolve=>window.finishCopy=resolve);}};
    Object.defineProperty(navigator,'clipboard',{configurable:true,get:()=>window.clipMode==='unavailable'?undefined:api});
  });}
  async function copy(){const before=await snapshot(p);await p.locator('[data-copy-place]').click();await p.locator('.copy-status').filter({hasText:'Saved place copied.'}).waitFor();assert.deepEqual(await snapshot(p),before);return p.evaluate(()=>window.copyPayloads.at(-1));}
  async function capture(name){for(const theme of ['light','dark'])for(const width of [1440,390]){await p.setViewportSize({width,height:width===390?844:1000});if(await p.locator('dialog[open]').count())await p.locator(`button[data-theme="${theme}"]`).evaluate(el=>el.click());else await p.click(`button[data-theme="${theme}"]`);await p.waitForTimeout(200);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/demo-${name}-${theme}-${width}.png`,fullPage:true});}}
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});const fresh=await snapshot(p);assert.match(await p.locator('.hero-cta').textContent(),/Start working/);await capture('entry');
    await p.locator('[data-example-entry]').focus();await p.keyboard.press('Enter');await p.locator('[data-action="resume"]').waitFor();assert.match(await p.locator('#mode-label').textContent(),/Fictional example.*Real work to return/);assert.match(await p.locator('.action-area .instruction').textContent(),/capacity table/);assert.equal(await p.locator('.expedition-marker').first().getAttribute('data-station'),'camp');assert.equal(await p.locator('#clock').count(),0);assert.deepEqual(await snapshot(p),fresh);
    await p.click('#real-mode');await p.locator('.hero-cta').waitFor();assert.deepEqual(await snapshot(p),fresh);
    const firstReader=await c.newPage();await firstReader.goto(url);await firstReader.locator('[data-example-entry]').waitFor();assert.equal(await firstReader.locator('.hero-cta').isDisabled(),true);await firstReader.click('[data-example-entry]');await firstReader.locator('[data-action="resume"]').waitFor();await firstReader.click('#real-mode');assert.equal(await firstReader.locator('.hero-cta').isDisabled(),true);assert.deepEqual(await snapshot(firstReader),fresh);await firstReader.close();
    // First-use entry preserves an unsaved new goal and action identities.
    await p.click('.hero-cta');await p.fill('#goal-title','Unsaved workshop');await p.fill('#goal-definition','A useful update');await p.locator('[data-draft-id]').fill('Draft update');const draftId=await p.locator('[data-draft-id]').getAttribute('data-draft-id');await p.click('.brand');await p.click('[data-example-entry]');await p.click('#real-mode');await p.click('.hero-cta');assert.equal(await p.inputValue('#goal-title'),'Unsaved workshop');assert.equal(await p.locator('[data-draft-id]').getAttribute('data-draft-id'),draftId);assert.deepEqual(await snapshot(p),fresh);
    await p.fill('#goal-title','Prepare the community workshop update');await p.click('[data-draft="add"]');await p.locator('[data-draft-id]').last().fill('Check names and owners');await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();let w=await snapshot(p);const goalId=w.openGoalId,[a,b]=w.goals[goalId].actionOrder;
    await p.click('.brand');assert.equal(await p.locator('[data-example-entry]').count(),1);await p.click('.hero-cta');assert.equal(await p.locator('[data-copy-place]').count(),0);
    const instruction=('In Workshop update → Next steps, paragraph 2: decide who confirms the room. 🧭 <draft>&\n').repeat(35).trim(),context=('Activities drafted; room capacity remains unresolved. 日本語 </textarea><img src=x onerror=alert(1)>\n').repeat(30).trim(),reference='https://example.com/workshop?q=room#next-steps';
    await p.click('[data-work="pause"]');await p.fill('#return-note',instruction);await p.locator('#pause-extras summary').click();await p.fill('#pause-context',context);await p.fill('#work-url',reference);await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();await clipboard(p);
    const expected=`Goal: Prepare the community workshop update\n\nAction: Draft update\n\nSaved next move: ${instruction}\n\nWhere I stopped: ${context}\n\nWork link: ${reference}`;
    await p.locator('[data-copy-place]').focus();await p.keyboard.press('Space');await p.locator('.copy-status').filter({hasText:'Saved place copied.'}).waitFor();assert.equal(await p.evaluate(()=>window.copyPayloads.at(-1)),expected);assert.equal(await p.locator('.action-area img').count(),0);await capture('saved-place');
    // Denied and unavailable clipboard get identical selectable text, never a false success.
    for(const mode of ['denied','unavailable']){const before=await snapshot(p);await p.evaluate(mode=>window.clipMode=mode,mode);await p.click('[data-copy-place]');await p.locator('#saved-place-brief').waitFor();assert.equal(await p.inputValue('#saved-place-brief'),expected);assert.equal(await p.locator('#saved-place-brief').getAttribute('readonly'),'');assert.match(await p.locator('.copy-status').textContent(),/Copy the text below manually/);assert.equal(await p.locator('.copy-status').filter({hasText:'Saved place copied.'}).count(),0);await p.locator('#saved-place-brief').scrollIntoViewIfNeeded();await p.locator('#saved-place-brief').focus();assert.equal(await p.evaluate(()=>document.activeElement.id),'saved-place-brief');assert.deepEqual(await snapshot(p),before);if(mode==='denied')await capture('manual-copy');await p.getByRole('button',{name:'Close copy text'}).click();assert.equal(await p.locator('#saved-place-brief').count(),0);}
    // Pending clipboard completion cannot attach a stale notice after navigation.
    await p.evaluate(()=>window.clipMode='delay');await p.click('[data-copy-place]');await p.click('[data-nav="journey"]');await p.evaluate(()=>window.finishCopy());await p.waitForTimeout(30);assert.equal(await p.locator('.copy-status,#saved-place-brief').count(),0);await p.click('[data-nav="today"]');await p.evaluate(()=>window.clipMode='success');
    await p.click('[data-work="pause"]');await p.fill('#return-note','UNSAVED secret instruction');await p.click('[data-nav="today"]');assert.equal(await copy(),expected);await p.click('#example-mode');await p.click('#real-mode');await p.click('[data-work="pause"]');assert.equal(await p.inputValue('#return-note'),'UNSAVED secret instruction');await p.click('[data-work="skip"]');
    // Pre-save the later action via legal reordering, so copying with a durable Undo can be tested.
    await p.click('[data-work="edit"]');await p.locator(`[data-draft="up"][data-id="${b}"]`).click();await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();await p.click('[data-work="pause"]');await p.locator('#pause-extras summary').click();await p.fill('#pause-context','Later action context only');await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();await p.click('[data-work="edit"]');await p.locator(`[data-draft="up"][data-id="${a}"]`).click();await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();assert.equal(await copy(),expected);
    const reader=await c.newPage();await reader.goto(url);await reader.locator('.workspace').waitFor();await clipboard(reader);const readBefore=await snapshot(reader);await reader.click('[data-copy-place]');await reader.locator('.copy-status').filter({hasText:'Saved place copied.'}).waitFor();assert.equal(await reader.locator('[data-work="start"]').isDisabled(),true);assert.equal(await reader.locator('[data-work="edit"]').isDisabled(),true);assert.deepEqual(await snapshot(reader),readBefore);assert.equal(await reader.evaluate(()=>window.copyPayloads.at(-1)),expected);await reader.close();
    await p.click('[data-work="start"]');await p.locator('.focus-details summary').click();assert.equal(await copy(),expected);assert.equal((await snapshot(p)).sessions[(await snapshot(p)).activeSessionId].status,'running');
    await p.evaluate(()=>window.clipMode='denied');await p.click('[data-copy-place]');await p.locator('#saved-place-brief').waitFor();assert.equal(await p.inputValue('#saved-place-brief'),expected);await p.locator('#saved-place-brief').scrollIntoViewIfNeeded();await p.locator('#saved-place-brief').focus();await p.screenshot({path:`${output}/demo-focus-manual-390.png`,fullPage:true});await p.getByRole('button',{name:'Close copy text'}).click();
    // Abort a completion while Focus still displays committed saved context. Copy must not steal Retry.
    await p.evaluate(()=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);if(window.abortDemoWrite){window.abortDemoWrite=false;this.transaction.abort();}return r;};window.abortDemoWrite=true;});await p.click('[data-work="complete"]');await p.locator('#storage-status [role="alert"]').waitFor();const failed=await snapshot(p),failure=await p.locator('#storage-status').textContent();await p.click('[data-copy-place]');await p.locator('#saved-place-brief').waitFor();assert.equal(await p.inputValue('#saved-place-brief'),expected);assert.equal(await p.locator('#saved-place-brief').isEnabled(),true);assert.equal(await p.locator('#storage-status').textContent(),failure);assert.equal(await p.locator('#storage-status [data-work="retry"]').isEnabled(),true);assert.equal(await p.locator('[data-work="complete"]').isDisabled(),true);assert.deepEqual(await snapshot(p),failed);
    await p.evaluate(()=>window.clipMode='success');assert.equal(await copy(),expected);assert.equal(await p.locator('#storage-status').textContent(),failure);assert.equal(await p.locator('#storage-status [data-work="retry"]').isEnabled(),true);
    await p.click('#storage-status [data-work="retry"]');await p.locator('.workspace').waitFor();assert.equal(await p.locator('#saved-place-brief').count(),0);await p.evaluate(()=>window.clipMode='success');const undoBefore=await snapshot(p);assert.ok(undoBefore.undo);const later=await copy();assert.match(later,/Action: Check names and owners/);assert.match(later,/Where I stopped: Later action context only/);assert.doesNotMatch(later,/Saved next move:|UNSAVED|room capacity|Work link:/);assert.deepEqual((await snapshot(p)).undo,undoBefore.undo);
    await p.waitForTimeout(850);await capture('current');await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();await capture('review');await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.waitForTimeout(1000);await capture('summit');await p.keyboard.press('Escape');assert.equal(await p.locator('[data-copy-place]').count(),0);assert.equal((await snapshot(p)).goals[goalId].status,'completed');assert.deepEqual(errors,[]);
    // Discovery must still be usable without real storage, without disguising the storage failure.
    const unavailable=await browser.newContext(),q=await unavailable.newPage();try{await q.addInitScript(()=>Object.defineProperty(window,'indexedDB',{value:undefined}));await q.goto(url);await q.locator('#storage-status [role="alert"]').waitFor();const message=await q.locator('#storage-status').textContent();await q.click('[data-example-entry]');await q.locator('[data-action="resume"]').waitFor();await q.click('#real-mode');assert.equal(await q.locator('#storage-status').textContent(),message);assert.equal(await q.locator('.hero-cta').isDisabled(),true);assert.equal(await q.locator('[data-example-entry]').isEnabled(),true);}finally{await unavailable.close();}
    const native=await browser.newContext({permissions:['clipboard-read','clipboard-write']}),n=await native.newPage();try{await n.goto(url);await n.locator('#storage-status').waitFor({state:'hidden'});await create(n,'Native clipboard check',['Linked action']);await n.click('[data-work="pause"]');await n.locator('#pause-extras summary').click();await n.fill('#work-url','https://example.com/work#section');await n.click('#real-pause-form [type="submit"]');await n.locator('.workspace').waitFor();const before=await snapshot(n);await n.click('[data-copy-place]');await n.locator('.copy-status').filter({hasText:'Saved place copied.'}).waitFor();assert.equal(await n.evaluate(()=>navigator.clipboard.readText()),'Goal: Native clipboard check\n\nAction: Linked action\n\nWork link: https://example.com/work#section');assert.deepEqual(await snapshot(n),before);}finally{await native.close();}
    console.log('Final demo gate passed: first-use stopped example/draft/storage-error isolation; exact full Unicode copy, denial/unavailable/manual/async cleanup, committed-only/action-scoped/Undo/running/read-only/pending-Retry safety; light/dark 1440/390 entry, saved place, manual copy, current/review/summit captures.');
  }finally{await c.close();}
}
async function runEndBlock(browser){
  const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const total=w=>Object.values(w.intervals).reduce((n,i)=>n+i.deltaMs,0);
  const noReward=async()=>{assert.equal(await p.locator('.travelling,.confetti,.summit-halo.active').count(),0);assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);};
  async function instrument(){await p.evaluate(async()=>{
    const {LocalStore}=await import('/storage.js'),commit=LocalStore.prototype.commit;window.endCommands=[];
    LocalStore.prototype.commit=function(w,cmd){if(cmd.type==='end-block')window.endCommands.push(structuredClone(cmd));return commit.call(this,w,cmd);};
    const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);if(window.abortEndWrite){window.abortEndWrite=false;this.transaction.abort();}return r;};
  });}
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await create(p,'Discover a prerequisite',['Draft','Review']);
    let w=await snapshot(p);const goalId=w.openGoalId,[a,b]=w.goals[goalId].actionOrder;
    await p.click('[data-work="start"]');await p.locator('.focus-clock').waitFor();assert.equal(await p.locator('[data-work="end-block"]').count(),0);
    await p.evaluate(()=>{const b=document.createElement('button');b.dataset.work='end-block';b.textContent='Attempt stale End';document.querySelector('#main').append(b);b.click();b.remove();});await p.locator('#storage-status [role="alert"]').waitFor();assert.match(await p.locator('#storage-status').textContent(),/Pause first/);assert.equal((await snapshot(p)).sessions[(await snapshot(p)).activeSessionId].status,'running');
    // A genuine committed checkpoint precedes ending (not synthetic elapsed time).
    await p.waitForFunction(async()=>{const {openDatabase}=await import('/storage.js'),db=await openDatabase();return new Promise(resolve=>{const tx=db.transaction('workspace','readonly'),r=tx.objectStore('workspace').get('current');r.onsuccess=()=>{db.close();resolve(Object.keys(r.result.intervals).length>0);};});});
    await p.click('[data-work="pause"]');await p.fill('#return-note','Open the research first');await p.locator('#pause-extras summary').click();await p.fill('#pause-context','Draft paragraph two');await p.fill('#work-url','https://example.com/draft?q=1#next');await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();
    const before=await snapshot(p),sessionId=before.activeSessionId,context=before.contexts[a];assert.ok(total(before)>0);assert.ok(before.sessions[sessionId].sequence>=1);
    await p.click('[data-work="edit"]');assert.equal(await p.locator('[data-draft="add"]').isDisabled(),true);assert.equal(await p.locator('[data-draft="down"]').first().isDisabled(),true);
    assert.match(await p.locator('#goal-form').textContent(),/without completing the action/);
    await p.fill('#goal-title','Draft title retained');await instrument();await p.evaluate(()=>window.abortEndWrite=true);
    await p.locator('[data-work="end-block"]').focus();await p.keyboard.press('Enter');await p.locator('#storage-status [role="alert"]').waitFor();
    assert.deepEqual(await snapshot(p),before);assert.equal(await p.locator('[data-draft="add"]').isDisabled(),true);assert.equal(await p.locator('[data-work="end-block"]').isDisabled(),true);assert.equal(await p.inputValue('#goal-title'),'Draft title retained');await noReward();
    await p.screenshot({path:`${output}/end-block-abort-390.png`,fullPage:true});
    await p.click('#storage-status [data-work="retry"]');await p.locator('[data-draft="add"]:enabled').waitFor();w=await snapshot(p);
    const log=await p.evaluate(()=>window.endCommands);assert.equal(log.length,2);assert.deepEqual(log[0],log[1]);assert.equal(w.revision,before.revision+1);assert.equal(w.activeSessionId,null);assert.deepEqual(w.sessions[sessionId],{...before.sessions[sessionId],status:'ended',ownerToken:null});
    for(const key of ['intervals','contexts','actions','goals','events'])assert.deepEqual(w[key],before[key]);assert.equal(await p.inputValue('#goal-title'),'Draft title retained');await noReward();
    // The exact receipt reconciles once; stale revision and foreign-owner storage calls reject.
    const receipts=await p.evaluate(async({cmd,old})=>{
      const {LocalStore,openDatabase}=await import('/storage.js'),store=new LocalStore(()=>{});store.db=await openDatabase();store.writer=true;store.token=old.ownerToken;const current=await store.read(),replay=await store.commit(old,cmd),results=[replay.applied,replay.workspace.revision===current.revision];
      for(const [source,token] of [[old,old.ownerToken],[current,'foreign-owner']]){store.token=token;try{await store.commit(source,{...cmd,id:crypto.randomUUID()});results.push(false);}catch{results.push(true);}}
      store.db.close();return results;
    },{cmd:log[0],old:before});assert.deepEqual(receipts,[false,true,true,true]);assert.deepEqual(await snapshot(p),w);
    // New prerequisite plus reorder; aborted Save preserves old order, Retry preserves IDs/draft.
    await p.click('[data-draft="add"]');const prerequisite=await p.locator('[data-draft-id]').last().getAttribute('data-draft-id');await p.locator('[data-draft-id]').last().fill('Research prerequisite');await p.locator(`[data-draft="up"][data-id="${prerequisite}"]`).click();await p.locator(`[data-draft="up"][data-id="${prerequisite}"]`).click();
    await p.evaluate(()=>window.abortEndWrite=true);await p.click('#goal-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();assert.deepEqual((await snapshot(p)).goals[goalId].actionOrder,[a,b]);assert.equal(await p.locator('[data-draft-id]').first().getAttribute('data-draft-id'),prerequisite);
    await p.click('#storage-status [data-work="retry"]');await p.locator('.workspace').waitFor();w=await snapshot(p);assert.deepEqual(w.goals[goalId].actionOrder,[prerequisite,a,b]);assert.deepEqual(w.contexts[a],context);assert.equal(w.contexts[prerequisite],undefined);assert.equal(total(w),total(before));assert.match(await p.locator('.action-area h2').textContent(),/Research prerequisite/);await noReward();
    await p.reload();await p.locator('.workspace').waitFor();assert.equal((await snapshot(p)).activeSessionId,null);assert.equal(await p.locator('[data-work="resume"]').count(),0);assert.equal(await p.locator('[data-work="start"]').count(),1);assert.equal((await snapshot(p)).actions[a].status,'open');
    // Put Draft first again, preserving the prerequisite and action-scoped saved place.
    await p.click('[data-work="edit"]');assert.equal(await p.locator(`[data-draft="remove"][data-id="${a}"]`).isDisabled(),true);await p.locator(`[data-draft="up"][data-id="${a}"]`).click();await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();assert.deepEqual((await snapshot(p)).contexts[a],context);
    await p.click('[data-work="start"]');await p.click('[data-work="pause"]');await p.click('[data-work="skip"]');await p.click('[data-work="focus"]');w=await snapshot(p);const secondId=w.activeSessionId;assert.notEqual(secondId,sessionId);assert.equal(w.sessions[secondId].actionId,a);
    const reader=await c.newPage();await reader.goto(url);await reader.locator('.workspace').waitFor();await reader.click('[data-work="focus"]');assert.equal(await reader.locator('[data-work="end-block"]').isDisabled(),true);assert.equal(await reader.locator('[data-work="resume"]').isDisabled(),true);await reader.close();
    for(const theme of ['light','dark'])for(const width of [1440,390]){
      await p.setViewportSize({width,height:width===390?844:1000});await p.click(`[data-theme="${theme}"]`);const end=p.locator('[data-work="end-block"]');await end.scrollIntoViewIfNeeded();assert.equal(await end.isEnabled(),true);assert.ok(await end.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}));assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/end-block-focus-${theme}-${width}.png`,fullPage:true});
    }
    const secondBefore=await snapshot(p);await p.locator('[data-work="end-block"]').focus();await p.keyboard.press('Space');await p.locator('[data-work="edit"]').waitFor();w=await snapshot(p);assert.equal(w.activeSessionId,null);assert.match(await p.locator('.timer-label').textContent(),/No active focus block/);assert.equal(await p.locator('[data-work="resume"]').count(),0);assert.equal(total(w),total(secondBefore));assert.deepEqual(w.contexts[a],context);await noReward();
    await p.click('[data-nav="today"]');assert.equal(await p.locator('.expedition-marker').first().getAttribute('data-station'),'camp');await p.reload();await p.locator('.workspace').waitFor();assert.equal((await snapshot(p)).activeSessionId,null);
    await p.click('[data-work="start"]');await p.waitForTimeout(300);await p.click('[data-work="complete"]');await p.locator('[data-work="undo"]').waitFor();w=await snapshot(p);const effortAfter=total(w);assert.ok(effortAfter>total(secondBefore));assert.equal(w.sessions[sessionId].status,'ended');assert.equal(w.sessions[secondId].status,'ended');
    await p.click('[data-work="undo"]');await p.locator('[data-work="resume"]').first().waitFor();assert.equal(total(await snapshot(p)),effortAfter);assert.deepEqual((await snapshot(p)).contexts[a],context);
    await p.click('[data-work="focus"]');await p.click('[data-work="end-block"]');await p.locator('[data-work="edit"]').waitFor();await p.click('[data-work="complete"]');await p.locator('.workspace').waitFor();await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('.workspace').waitFor();await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();const finalEffort=total(await snapshot(p));assert.ok(finalEffort>=effortAfter);await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');await p.locator('.finished-card').waitFor();w=await snapshot(p);assert.equal(w.goals[goalId].status,'completed');assert.equal(total(w),finalEffort);assert.deepEqual(w.contexts[a],context);
    // Deterministic canonical fixtures exercise interrupted/expired Focus controls with real IDB commits.
    for(const status of ['interrupted','expired']){
      const fixture=await browser.newContext({viewport:{width:390,height:844}}),q=await fixture.newPage();
      try{
        await q.goto(url);await q.locator('#storage-status').waitFor({state:'hidden'});await create(q,`${status} block`,['Unfinished','Later']);
        await q.evaluate(async status=>{const {LocalStore,openDatabase}=await import('/storage.js'),store=new LocalStore(()=>{});store.db=await openDatabase();store.writer=true;let w=await store.read();store.token=w.ownerToken;const apply=async(type,fields={})=>{w=(await store.commit(w,{id:crypto.randomUUID(),type,...fields})).workspace;};await apply('start',{minutes:20});await apply('checkpoint',{deltaMs:5000});if(status==='expired'){for(let i=0;i<79;i++)await apply('checkpoint',{deltaMs:15000});await apply('checkpoint',{deltaMs:10000});}else await apply('recover');store.db.close();},status);
        await q.reload();await q.locator('.workspace').waitFor();const old=await snapshot(q),id=old.activeSessionId;assert.equal(old.sessions[id].status,status);await q.click('[data-work="focus"]');await q.locator('[data-work="end-block"]').focus();await q.keyboard.press('Enter');await q.locator('[data-work="edit"]').waitFor();const ended=await snapshot(q);assert.equal(ended.activeSessionId,null);assert.deepEqual(ended.sessions[id],{...old.sessions[id],status:'ended',ownerToken:null});for(const key of ['intervals','contexts','actions','goals','events'])assert.deepEqual(ended[key],old[key]);assert.equal(await q.locator('[data-work="resume"],[data-work^="extend-"]').count(),0);await q.screenshot({path:`${output}/end-block-${status}-390.png`,fullPage:true});
      }finally{await fixture.close();}
    }
    assert.deepEqual(errors,[]);console.log('End block gate passed: real checkpoint, editor/Focus keyboard controls, aborted end/edit + exact Retry/replay, ownership/revision/running rejection, reorder/context identity, reload/fresh Start, multiple ended blocks/aggregate effort/completion/Undo/history, interrupted/expired IDB fixtures, no end rewards, campsite, themes/390px and read-only tab.');
  }finally{await c.close();}
}
async function assertRouteTravel(page){
  const marker=page.locator('.expedition-marker.travelling').first();
  assert.equal(await marker.locator('circle.progress-dot').isVisible(),true);assert.equal(await page.locator('.expedition-person,.expedition-head,.expedition-pack,.expedition-coat,.expedition-outline').count(),0);
  const samples=await marker.evaluate(async el=>{
    const path=el.closest('svg').querySelector('.mountain-path-bed'),length=path.getTotalLength(),positions=[];
    for(let i=0;i<4;i++){
      const m=el.transform.baseVal.consolidate().matrix,p={x:m.e,y:m.f};let closest=Infinity;
      for(let j=0;j<=1600;j++){const q=path.getPointAtLength(length*j/1600);closest=Math.min(closest,Math.hypot(p.x-q.x,p.y-q.y));}
      positions.push({...p,distance:closest});await new Promise(resolve=>setTimeout(resolve,35));
    }
    return positions;
  });
  assert.ok(samples.every(p=>p.distance<1),'Traveller follows the existing winding path, not a straight chord');
  assert.ok(samples.slice(1).some(p=>Math.hypot(p.x-samples[0].x,p.y-samples[0].y)>1),'Marker visibly changes position');
}
async function assertCanonicalMarker(page){
  assert.equal(await page.locator('.travelling').count(),0);
  const correct=await page.locator('#main .expedition-marker').first().evaluate(el=>{
    const svg=el.closest('svg'),path=svg.querySelector('.mountain-path-bed'),matrix=el.transform.baseVal.consolidate().matrix;
    const point=svg.dataset.phase==='finished'?{x:374,y:65}:path.getPointAtLength(path.getTotalLength()*Number(el.dataset.routeFraction));
    return Math.hypot(matrix.e-point.x,matrix.f-point.y)<.1;
  });
  assert.equal(correct,true,'Cleanup/static rendering settles at canonical destination');
}
async function runTravelling(browser){
  const c=await browser.newContext({viewport:{width:1440,height:1000}}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  const marker=()=>p.locator('#main .expedition-marker').first();
  const station=()=>marker().getAttribute('data-station');
  const pause=async()=>{await p.click('[data-work="pause"]');await p.locator('#real-pause-form').waitFor();};
  const save=async()=>{await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();};
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});
    assert.equal(await p.locator('.expedition-marker').count(),0,'No personal expedition in no-goal illustration');
    await create(p,'Prepare a useful project update',['Choose the three key points','Draft the update','Check and share the update']);
    assert.equal(await station(),'expedition');await assertCanonicalMarker(p);
    const initial=await snapshot(p),ids=initial.goals[initial.openGoalId].actionOrder;
    await pause();await save();assert.ok((await snapshot(p)).contexts[ids[0]],'Fixture actually creates a blank context record');
    assert.equal(await station(),'expedition','Blank saved record is not a campsite');assert.equal(await p.locator('.position-label text').textContent(),'Next action');
    await pause();await p.locator('#pause-extras summary').click();await p.fill('#work-url','https://example.com/project-update#outline');await save();
    assert.equal(await station(),'camp','Link-only useful reference qualifies');assert.equal(await marker().locator('.expedition-camp').isVisible(),true);
    const useful=await snapshot(p);await p.locator('[data-select]').nth(2).click();await assertCanonicalMarker(p);assert.equal(await marker().getAttribute('data-action-id'),ids[0]);assert.deepEqual(await snapshot(p),useful);
    for(const theme of ['light','dark'])for(const width of [1440,390]){
      await p.click(`[data-theme="${theme}"]`);await p.setViewportSize({width,height:width===390?844:1000});await p.evaluate(()=>scrollTo(0,0));
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.keyboard.press('Tab');await p.locator('[data-select]').first().focus();assert.notEqual(await p.locator('[data-select]').first().evaluate(el=>getComputedStyle(el).outlineStyle),'none');
      await p.screenshot({path:`${output}/marker-campsite-${theme}-${width}.png`,fullPage:true});
    }
    await p.setViewportSize({width:1440,height:1000});await p.click('[data-theme="light"]');
    await p.click('[data-work="start"]');await p.click('[data-nav="journey"]');assert.equal(await station(),'expedition','Running work does not show a stopped campsite');await assertCanonicalMarker(p);
    await p.locator('.focus-return [data-work="focus"]').click();await p.click('[data-work="pause"]');await p.click('[data-work="skip"]');assert.equal(await station(),'camp');
    await p.reload();await p.locator('.workspace').waitFor();assert.equal(await station(),'camp');await assertCanonicalMarker(p);
    const stopped=await snapshot(p);assert.equal(stopped.sessions[stopped.activeSessionId].status,'paused');
    const opened=p.waitForEvent('popup');await p.locator('.work-link').click();const popup=await opened;await popup.close();assert.deepEqual(await snapshot(p),stopped,'Open work changes no timing or state');
    await p.click('[data-work="resume"]');await p.waitForTimeout(150);await p.click('[data-work="complete"]');await p.locator('.travelling').waitFor();
    const committed=await snapshot(p);assert.equal(committed.actions[ids[0]].status,'completed');assert.equal(await marker().getAttribute('data-action-id'),ids[1]);await assertRouteTravel(p);
    await p.locator('.mountain-scene').screenshot({path:`${output}/marker-live-travel.png`});await p.waitForFunction(()=>!document.querySelector('.travelling'));await assertCanonicalMarker(p);assert.deepEqual(await snapshot(p),committed,'Animation writes no domain data');
    // A render/selection never replays travel; correcting a prior completion returns instantly.
    await p.locator('[data-select]').first().click();await assertCanonicalMarker(p);await p.click('[data-work="reopen-action"]');await p.waitForFunction(()=>document.querySelector('.mountain-art')?.dataset.current==='0');await assertCanonicalMarker(p);assert.equal(await marker().getAttribute('data-action-id'),ids[0]);
    assert.equal(await station(),'camp');await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('.travelling').waitFor();await p.click('#example-mode');await p.waitForTimeout(900);assert.equal(await p.locator('.travelling').count(),0);await p.click('#real-mode');await assertCanonicalMarker(p);
    const afterMode=await snapshot(p);assert.equal(afterMode.actions[ids[0]].status,'completed');assert.equal(afterMode.actions[ids[1]].status,'open');
    assert.deepEqual(errors,[]);
    console.log('Travelling gate passed: blank/link-only saved-place predicate, Start/Resume form, static selection/reload/reopen, Open work no writes, actual winding-path motion and final destination, animation no writes, mode cancellation, visible keyboard focus and both-theme desktop/390px campsites.');
  }finally{await c.close();}
}
async function runReturnFixes(browser){
  const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const repeatTo=(text,n)=>(text.repeat(Math.ceil(n/text.length))).slice(0,n-1)+'Z';
  const instruction=repeatTo('Open <draft> & keep this line.\nUnbroken'+ 'word'.repeat(30)+'\n',4000),context=repeatTo('Remember <source> & costs.\n'+ 'long'.repeat(40)+'\n',4000),reference='https://example.com/draft?q=1#next';
  async function pause(){await p.click('[data-work="pause"]');await p.locator('#real-pause-form').waitFor();}
  async function extras(){if(!await p.locator('#pause-extras').evaluate(el=>el.open))await p.locator('#pause-extras summary').click();}
  async function saved(){await p.locator('.workspace').waitFor();return snapshot(p);}
  async function controlsReachable(){return p.locator('.action-area').evaluate(area=>{const top=area.getBoundingClientRect().top,link=area.querySelector('.work-link').getBoundingClientRect(),focus=area.querySelector('[data-work="start"],[data-work="resume"],[data-work="focus"]').getBoundingClientRect();return {link:link.bottom-top,focus:focus.bottom-top};});}
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await create(p,'A normal-title goal',['Write the draft','Untouched action']);let w=await snapshot(p);const goalId=w.openGoalId,[a,b]=w.goals[goalId].actionOrder;
    await pause();await p.fill('#return-note',instruction);await extras();await p.fill('#pause-context',context);await p.fill('#work-url',reference);await p.click('#real-pause-form [type="submit"]');w=await saved();const exact=structuredClone(w.contexts[a]);
    assert.equal(exact.nextInstruction,instruction);assert.equal(exact.context,context);assert.equal(Object.keys(w.sessions).length,0);
    const reach=await controlsReachable();await p.click('[data-work="edit"]');const protectedRemove=await p.locator(`[data-draft="remove"][data-id="${a}"]`).isDisabled();await p.click('[data-work="cancel"]');
    await pause();await extras();await p.fill('#work-url','javascript:alert(1)');await p.click('#real-pause-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();await p.click('[data-work="skip"]');const cleared=await p.locator('#storage-status').isHidden();
    console.log('Return-fix reproduction/acceptance:',JSON.stringify({protectedRemove,linkFromAreaTop:reach.link,focusFromAreaTop:reach.focus,discardedValidationCleared:cleared}));
    assert.equal(protectedRemove,true);assert.ok(reach.link<=844&&reach.focus<=844);assert.equal(cleared,true);assert.deepEqual((await snapshot(p)).contexts[a],exact);
    // Protection applies in UI and survives actual failed goal save / exact Retry / reload.
    await p.click('[data-work="edit"]');const remove=p.locator(`[data-draft="remove"][data-id="${a}"]`);assert.equal(await remove.isDisabled(),true);const description=await remove.getAttribute('aria-describedby');assert.ok(description);assert.match(await p.locator(`#${description}`).textContent(),/saved context|recorded work/i);await p.screenshot({path:`${output}/return-fixes-protected-editor-390.png`,fullPage:true});
    assert.equal(await p.locator(`[data-draft="remove"][data-id="${b}"]`).isEnabled(),true);await p.locator(`[data-draft="remove"][data-id="${b}"]`).click();await p.fill(`[data-draft-id="${a}"]`,'Write the draft, edited');
    await p.evaluate(()=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);if(window.abortFixWrite){window.abortFixWrite=false;this.transaction.abort();}return r;};window.abortFixWrite=true;});
    const beforeGoalSave=await snapshot(p);await p.click('#goal-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();assert.deepEqual(await snapshot(p),beforeGoalSave);assert.equal(await p.inputValue(`[data-draft-id="${a}"]`),'Write the draft, edited');
    await p.click('#storage-status [data-work="retry"]');w=await saved();assert.equal(w.revision,beforeGoalSave.revision+1);assert.equal(w.actions[b],undefined);assert.deepEqual(w.contexts[a],exact);await p.reload();await p.locator('.workspace').waitFor();assert.deepEqual((await snapshot(p)).contexts[a],exact);
    // Native expansion preserves exact literal/multiline full text and never writes or starts timing.
    for(const theme of ['light','dark'])for(const width of [1440,390]){
      await p.setViewportSize({width,height:width===390?844:1000});await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(180);await p.click(`[data-theme="${theme}"]`);await p.waitForTimeout(180);
      const beforeExpansion=await snapshot(p),position=await controlsReachable();assert.ok(position.link<=844&&position.focus<=844);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      const details=p.locator('.return-expansion');assert.equal(await details.evaluate(el=>el.open),false);await p.screenshot({path:`${output}/return-fixes-collapsed-${theme}-${width}.png`,fullPage:true});
      await details.locator('summary').focus();await p.keyboard.press('Enter');assert.equal(await details.evaluate(el=>el.open),true);assert.equal(await p.locator('.return-full-instruction').textContent(),instruction);assert.equal(await p.locator('.return-full-context').textContent(),context);assert.equal(await p.locator('.action-area img,.action-area script').count(),0);
      assert.equal(await details.evaluate(el=>getComputedStyle(el).overflowY==='visible'&&el.scrollHeight<=el.clientHeight+1),true,'Full text expands in document flow, not a nested scrolling trap');
      await p.screenshot({path:`${output}/return-fixes-expanded-${theme}-${width}.png`,fullPage:true});await p.keyboard.press('Space');assert.equal(await details.evaluate(el=>el.open),false);assert.deepEqual(await snapshot(p),beforeExpansion);
    }
    await pause();assert.equal(await p.inputValue('#return-note'),instruction);await extras();assert.equal(await p.inputValue('#pause-context'),context);await p.click('[data-work="skip"]');
    await p.click('[data-work="start"]');await p.locator('.focus-clock').waitFor();await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();await p.keyboard.press('Escape');await p.click('#main [data-work="undo"]');await p.locator('[data-work="resume"]').first().waitFor();assert.deepEqual((await snapshot(p)).contexts[a],exact);
    await p.click('[data-work="focus"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');await p.locator('.archive-title').click();assert.ok((await p.locator('.finished-action').textContent()).includes(instruction));assert.ok((await p.locator('.finished-action').textContent()).includes(context));assert.deepEqual((await snapshot(p)).contexts[a],exact);await p.click('#history-detail-close');
    await p.click('[data-reopen-goal]');await p.locator('#review[open]').waitFor();await p.keyboard.press('Escape');await p.locator(`[data-select="${a}"]`).click();await p.click('[data-work="reopen-action"]');await saved();
    // Invalid pause draft survives navigation. Only explicit matching discard/input clears its error.
    await pause();await extras();await p.fill('#return-note','Unsaved invalid draft');await p.fill('#work-url','javascript:alert(1)');const beforeInvalid=await snapshot(p);await p.click('#real-pause-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();
    await p.click('[data-nav="journey"]');assert.match(await p.locator('#storage-status').textContent(),/Not saved/);await p.click('[data-nav="today"]');await p.click('[data-work="edit"]');await p.fill('#goal-title','Unrelated edit');assert.match(await p.locator('#storage-status').textContent(),/Not saved/);await p.click('[data-work="cancel"]');await pause();await extras();assert.equal(await p.inputValue('#return-note'),'Unsaved invalid draft');assert.equal(await p.inputValue('#work-url'),'javascript:alert(1)');
    await p.click('[data-work="skip"]');assert.equal(await p.locator('#storage-status').isHidden(),true);assert.deepEqual(await snapshot(p),beforeInvalid);await pause();await extras();assert.equal(await p.inputValue('#return-note'),instruction);assert.equal(await p.inputValue('#work-url'),reference);await p.click('[data-work="skip"]');
    await p.click('[data-work="edit"]');await p.fill('#goal-title','   ');await p.click('#goal-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();await p.click('[data-nav="today"]');await pause();await p.fill('#return-note','Not the goal form');assert.match(await p.locator('#storage-status').textContent(),/Not saved/);await p.click('[data-work="skip"]');assert.match(await p.locator('#storage-status').textContent(),/Not saved/);await p.click('[data-work="edit"]');await p.click('[data-work="cancel"]');assert.equal(await p.locator('#storage-status').isHidden(),true);
    // A write failure is not discarded validation: navigation/Skip must not hide pending exact Retry.
    await pause();await extras();await p.fill('#return-note','Saved after exact Retry');await p.check('#remove-resource');const beforeNotes=await snapshot(p);await p.evaluate(()=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=put.apply(this,args);if(window.abortFixWrite){window.abortFixWrite=false;this.transaction.abort();}return r;};window.abortFixWrite=true;});await p.click('#real-pause-form [type="submit"]');await p.locator('#storage-status [role="alert"]').waitFor();assert.deepEqual(await snapshot(p),beforeNotes);assert.equal(await p.inputValue('#return-note'),'Saved after exact Retry');assert.equal(await p.isChecked('#remove-resource'),true);
    assert.equal(await p.locator('[data-work="skip"]').isDisabled(),true);await p.click('[data-nav="today"]');await p.evaluate(()=>{document.querySelector('[data-work="skip"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));document.querySelector('#return-note').dispatchEvent(new Event('input',{bubbles:true}));});
    assert.equal(await p.locator('#real-pause-form').count(),1);assert.match(await p.locator('#storage-status').textContent(),/Not saved.*real timing stopped/);assert.equal(await p.locator('#storage-status [data-work="retry"]').count(),1);assert.deepEqual(await snapshot(p),beforeNotes);
    await p.click('#storage-status [data-work="retry"]');w=await saved();assert.equal(w.revision,beforeNotes.revision+1);assert.equal(w.contexts[a].nextInstruction,'Saved after exact Retry');assert.equal(Object.hasOwn(w.contexts[a],'resourceUrl'),false);assert.equal(w.contexts[a].context,context);
    // Ordinary short notes retain the familiar unexpanded composition.
    await pause();await p.fill('#return-note','Open the draft.');await extras();await p.fill('#pause-context','Check the budget first.');await p.fill('#work-url',reference);await p.click('#real-pause-form [type="submit"]');await saved();assert.equal(await p.locator('.return-expansion').count(),0);assert.equal(await p.locator('.action-area .instruction').textContent(),'Open the draft.');assert.equal(await p.locator('.action-area .saved-context p').textContent(),'Check the budget first.');
    for(const theme of ['light','dark'])for(const width of [1440,390]){await p.setViewportSize({width,height:width===390?844:1000});await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(180);await p.click(`[data-theme="${theme}"]`);await p.waitForTimeout(180);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/return-fixes-short-${theme}-${width}.png`,fullPage:true});}assert.deepEqual(errors,[]);
    const linkOnlyContext=await browser.newContext(),linkOnly=await linkOnlyContext.newPage();
    try{
      await linkOnly.goto(url);await linkOnly.locator('#storage-status').waitFor({state:'hidden'});await create(linkOnly,'Link-only saved work',['Linked action','Untouched action']);await linkOnly.click('[data-work="pause"]');await linkOnly.locator('#pause-extras summary').click();await linkOnly.fill('#work-url',reference);await linkOnly.click('#real-pause-form [type="submit"]');await linkOnly.locator('.workspace').waitFor();const linkState=await snapshot(linkOnly),id=linkState.goals[linkState.openGoalId].actionOrder[0];assert.equal(linkState.contexts[id].nextInstruction,'');assert.equal(linkState.contexts[id].context,'');assert.equal(Object.keys(linkState.sessions).length,0);
      await linkOnly.reload();await linkOnly.locator('.workspace').waitFor();await linkOnly.click('[data-work="edit"]');assert.equal(await linkOnly.locator(`[data-draft="remove"][data-id="${id}"]`).isDisabled(),true);assert.deepEqual((await snapshot(linkOnly)).contexts[id],linkState.contexts[id]);
    }finally{await linkOnlyContext.close();}
    console.log('Return fixes gate passed: protected context edit/abort/Retry/reload, 4000+4000 bounded controls/full keyboard expansion/edit/Undo/history, scoped Skip/input/discard validation, preserved failed-write draft/removal intent/pending Retry, short notes and themes/390px.');
  }finally{await c.close();}
}
async function runRewards(browser){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  const effects=()=>p.locator('.travelling,.summit-celebrating').count();
  async function complete(){
    await p.locator('[data-work="focus"],[data-work="start"],[data-work="resume"]').first().click();await p.locator('.focus-clock').waitFor();await p.click('[data-work="complete"]');await p.waitForFunction(()=>document.body.dataset.view==='today');
  }
  async function observe(){await p.evaluate(()=>{
    window.feedbackLog=[];
    new MutationObserver(records=>{for(const r of records){const n=r.target;if(!(n instanceof Element)||r.attributeName!=='class')continue;for(const kind of ['travelling','summit-celebrating'])if(n.classList.contains(kind)&&!(r.oldValue||'').split(' ').includes(kind)){const svg=n.closest('.mountain-art');window.feedbackLog.push({kind,goal:svg?.dataset.goalId,action:n.dataset.completedActionId||null,node:n.tagName});}}}).observe(document,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['class']});
    const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const result=put.apply(this,args);if(window.abortRewardWrite){window.abortRewardWrite=false;this.transaction.abort();}return result;};
  });}
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await observe();
    await create(p,'An earlier finished goal',['Its first action']);await complete();await p.locator('#review[open]').waitFor();assert.equal(await p.locator('.summit-celebrating').count(),0);await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();const priorMountain=await p.locator('#reward-summit .mountain-art').evaluate(el=>{const clone=el.cloneNode(true);clone.classList.remove('summit-celebrating');const marker=clone.querySelector('.expedition-marker');marker.classList.remove('travelling');marker.removeAttribute('data-completed-action-id');marker.setAttribute('transform','translate(374 65)');return clone.outerHTML;});await p.keyboard.press('Escape');
    const priorCard=(await p.locator('.finished-card').evaluate(el=>el.outerHTML))+priorMountain;let w=await snapshot(p);const priorGoal=Object.keys(w.goals)[0];
    await p.click('.brand');await create(p,'A summit worth confirming',['Research','Outline','Write','Check','Deliver']);w=await snapshot(p);const goalId=w.openGoalId,ids=w.goals[goalId].actionOrder;
    // Controlled DOM-only fixture: retain an unrelated finished mountain alongside the active scene,
    // synchronously during render, before the actual applied-completion callback runs.
    await p.evaluate(card=>{const main=document.querySelector('#main'),html=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(main,'innerHTML',{configurable:true,get(){return html.get.call(this);},set(value){html.set.call(this,value);if(value.includes('mountain-scene'))this.insertAdjacentHTML('beforeend',`<aside data-unrelated-fixture>${card}</aside>`);}});},priorCard);
    await p.click('[data-work="pause"]');await p.fill('#return-note','Open the outline.');await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();assert.equal(await effects(),0);assert.equal(await p.locator('.mountain-mobile-caption .mountain-place-label').first().textContent(),'Saved place · action 1');
    await p.click('[data-work="start"]');const beforeAbort=await snapshot(p);await p.evaluate(()=>{window.feedbackLog=[];window.abortRewardWrite=true;});await p.click('[data-work="complete"]');await p.locator('#storage-status [role="alert"]').waitFor();assert.deepEqual(await snapshot(p),beforeAbort);assert.equal(await effects(),0);assert.deepEqual(await p.evaluate(()=>feedbackLog),[]);
    await p.click('#storage-status [data-work="retry"]');await p.locator('.expedition-marker.travelling').waitFor();w=await snapshot(p);assert.equal(w.revision,beforeAbort.revision+1);assert.equal(w.actions[ids[0]].status,'completed');
    assert.equal(await p.locator('[data-unrelated-fixture] .travelling').count(),0);assert.equal(await p.locator('.expedition-marker.travelling').getAttribute('data-completed-action-id'),ids[0]);assert.equal(await p.locator('.expedition-marker.travelling').getAttribute('data-action-id'),ids[1]);
    await assertRouteTravel(p);assert.equal(await p.locator('#main [data-work="undo"]').isEnabled(),true);
    await p.locator('.mountain-scene').first().screenshot({path:`${output}/rewards-live-checkpoint.png`});await p.waitForFunction(()=>!document.querySelector('.travelling'));assert.equal(await effects(),0);
    const feedback=await p.evaluate(()=>feedbackLog);assert.equal(feedback.length,1);assert.ok(feedback.every(e=>e.goal===goalId&&e.action===ids[0]));
    await p.click('#main [data-work="undo"]');await p.waitForFunction(id=>document.querySelector(`.milestone[data-action-id="${id}"]`)?.classList.contains('current'),ids[0]);
    await complete();await p.locator('.expedition-marker.travelling').waitFor();await p.click('#main [data-work="undo"]');await p.waitForTimeout(900);w=await snapshot(p);assert.equal(w.actions[ids[0]].status,'open');assert.equal(await effects(),0);await assertCanonicalMarker(p);assert.equal(await p.locator('.milestone.earned').count(),1,'Only unrelated history remains checked');
    await complete();await p.locator('.expedition-marker.travelling').waitFor();await p.click('[data-nav="journey"]');const afterNavigation=await snapshot(p);assert.equal(await effects(),0);await assertCanonicalMarker(p);await p.locator(`[data-select="${ids[4]}"]`).click();assert.equal(await p.locator('.mountain-art').first().getAttribute('data-current'),'1');assert.deepEqual(await snapshot(p),afterNavigation);
    await p.click('[data-nav="today"]');await complete();await p.locator('.expedition-marker.travelling').waitFor();await p.click('[data-theme="dark"]');assert.equal(await effects(),0);await assertCanonicalMarker(p);await p.click('[data-theme="light"]');assert.equal(await effects(),0);
    // Retain an existing motion control as a DOM-only fixture to exercise Off during a response.
    await p.click('[data-work="start"]');await p.locator('.focus-clock').waitFor();await p.evaluate(()=>{const b=document.querySelector('[data-action="ambience"]').cloneNode(true);b.id='motion-fixture';document.querySelector('.header').append(b);});await p.click('[data-work="complete"]');await p.locator('.expedition-marker.travelling').waitFor();const beforeOff=await snapshot(p);await p.click('#motion-fixture');assert.equal(await effects(),0);await assertCanonicalMarker(p);assert.equal(await p.locator('body').evaluate(e=>e.classList.contains('still')),true);assert.deepEqual(await snapshot(p),beforeOff);await p.click('#motion-fixture');assert.equal(await effects(),0);await p.evaluate(()=>document.querySelector('#motion-fixture').remove());
    await complete();await p.locator('.expedition-marker.travelling').waitFor();await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.body.classList.contains('still'));assert.equal(await effects(),0);await p.emulateMedia({reducedMotion:'no-preference'});await complete();await p.locator('#review[open]').waitFor();assert.equal(await p.locator('.summit-celebrating,#reward[open]').count(),0);assert.equal(await p.locator('.mountain-art').first().getAttribute('data-phase'),'review');
    await p.evaluate(()=>{delete document.querySelector('#main').innerHTML;document.querySelector('[data-unrelated-fixture]')?.remove();});
    // Turn motion back on before the confirmed summit, without touching canonical data.
    await p.evaluate(()=>{const b=document.createElement('button');b.dataset.action='ambience';document.body.append(b);b.click();b.remove();});
    const beforeFinish=await snapshot(p);await p.evaluate(()=>{window.feedbackLog=[];window.abortRewardWrite=true;});await p.click('#review [data-action="confirm"]');await p.locator('#review-status [role="alert"]').waitFor();assert.deepEqual(await snapshot(p),beforeFinish);assert.equal(await effects(),0);assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);
    await p.click('#review-status [data-work="retry"]');await p.locator('#reward[open] .summit-celebrating').waitFor();w=await snapshot(p);assert.equal(w.revision,beforeFinish.revision+1);assert.equal(w.goals[goalId].status,'completed');assert.equal(await p.locator('#reward-summit .mountain-art').getAttribute('data-goal-id'),goalId);assert.equal(await p.locator('main .summit-celebrating').count(),0);assert.equal(await p.locator('.finished-card .mountain-art').count(),0);assert.equal(await p.locator('.finished-card .finished-outline').count(),2);
    assert.equal(await p.locator('#reward [data-action="exit-celebration"]').last().isEnabled(),true);assert.equal(await p.locator('#reward .progress-dot').isVisible(),true);assert.equal(await p.locator('#reward .expedition-person,#reward .expedition-pack').count(),0);
    assert.equal(await p.locator('#reward-summit').evaluate(el=>{const a=el.getBoundingClientRect(),d=el.closest('dialog').getBoundingClientRect();return a.width>0&&a.height>0&&a.top>=d.top&&a.bottom<=d.bottom;}),true,'Summit response is inside the visible dialog, not behind it');
    await p.waitForTimeout(120);assert.ok(await p.locator('#reward .summit-halo').evaluate(el=>Number(getComputedStyle(el).opacity)>0));await p.locator('#reward').screenshot({path:`${output}/rewards-live-summit.png`});
    const finishLog=await p.evaluate(()=>feedbackLog);assert.equal(finishLog.filter(e=>e.kind==='summit-celebrating').length,1);assert.equal(finishLog.at(-1).goal,goalId);assert.notEqual(finishLog.at(-1).goal,priorGoal);
    await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.body.classList.contains('still'));assert.equal(await effects(),0);assert.equal(await p.locator('.confetti').count(),0);assert.equal(await p.locator('#reward').evaluate(e=>e.open),true);await p.keyboard.press('Escape');assert.equal(await effects(),0);assert.equal(await p.locator('#reward-summit svg').count(),0);assert.equal(await p.locator('#main').evaluate(el=>el===document.activeElement),true);
    await p.reload();await p.locator('.hero-cta').waitFor();await p.click('[data-nav="finished"]');assert.equal(await effects(),0);assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);assert.equal(await p.locator('.finished-card').count(),2);
    const stableHistory=await snapshot(p);
    for(const theme of ['light','dark'])for(const width of [1440,390]){await p.setViewportSize({width,height:width===390?844:1000});await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(180);await p.click(`[data-theme="${theme}"]`);await p.waitForTimeout(180);const svgIds=await p.locator('svg defs [id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(svgIds).size,svgIds.length);assert.equal(await effects(),0);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/rewards-history-pair-${theme}-${width}.png`,fullPage:true});}
    assert.deepEqual(await snapshot(p),stableHistory);
    const beforeExample=await snapshot(p);await p.click('#example-mode');await p.selectOption('#scenario','final');await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();assert.equal(await p.locator('#reward-summit .mountain-art').getAttribute('data-mode'),'example');assert.deepEqual(await snapshot(p),beforeExample);await p.keyboard.press('Escape');await p.click('#real-mode');assert.deepEqual(await snapshot(p),beforeExample);assert.deepEqual(errors,[]);
  }finally{await context.close();}
  // Visual matrix uses real UI and isolated storage: normal/reduced, 1/5/30, themes and widths.
  for(const reduced of [false,true])for(const total of [1,5,30])for(const theme of ['light','dark']){
    const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:reduced?'reduce':'no-preference'}),q=await c.newPage(),pageErrors=[];q.on('pageerror',e=>pageErrors.push(e.message));
    try{
      await q.goto(url);await q.locator('#storage-status').waitFor({state:'hidden'});await q.click(`[data-theme="${theme}"]`);await create(q,`A ${total}-action goal`,Array.from({length:total},(_,i)=>`Action ${i+1}`));await q.click('[data-work="start"]');await q.click('[data-work="complete"]');
      if(total===1){await q.locator('#review[open]').waitFor();await q.click('#review [data-action="confirm"]');await q.locator('#reward[open]').waitFor();if(reduced)assert.equal(await q.locator('.summit-celebrating,.confetti').count(),0);}
      else{await q.locator('.workspace').waitFor();if(reduced)assert.equal(await q.locator('.travelling').count(),0);}
      await q.waitForTimeout(1600);
      for(const width of [1440,390]){
        await q.setViewportSize({width,height:width===390?844:1000});await q.evaluate(()=>scrollTo(0,0));await q.waitForTimeout(180);assert.ok(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        if(width===390&&total!==1){const caption=q.locator('.mountain-mobile-caption');assert.equal(await caption.isVisible(),true);assert.match(await caption.textContent(),new RegExp(`1 of ${total} checked`));assert.equal(await caption.evaluate(el=>[...el.children].every(n=>parseFloat(getComputedStyle(n).fontSize)>=12)),true);}
        await q.screenshot({path:`${output}/rewards-${total}-${reduced?'reduced':'normal'}-${theme}-${width}.png`,fullPage:true});
        if(total!==1)await q.locator('.mountain-scene').screenshot({path:`${output}/rewards-${total}-${reduced?'reduced':'normal'}-scene-${theme}-${width}.png`});
      }
      assert.deepEqual(pageErrors,[]);
    }finally{await c.close();}
  }
  console.log('Rewards gate passed: post-commit path-following expedition marker, failed completion/finish and exact Retry, identity isolation, immediate Undo/navigation, theme/mid-effect Off/reduced cleanup, visible single summit dialog, review/finish distinction, note-save quietness, reload/no replay, example isolation and 1/5/30 normal/reduced light/dark desktop/390px.');
}
async function runMountain(browser){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage(),errors=[],external=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!r.url().startsWith(new URL(url).origin)&&!r.url().startsWith('data:'))external.push(r.url());});
  async function capture(name){
    const before=await snapshot(p),view=await p.locator('body').getAttribute('data-view');
    for(const theme of ['light','dark'])for(const width of [1440,390]){
      await p.setViewportSize({width,height:width===390?844:1000});await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(180);await p.click(`[data-theme="${theme}"]`);await p.waitForTimeout(180);
      assert.equal(await p.locator('body').getAttribute('data-view'),view,'Theme and viewport must preserve the current view');
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
      assert.equal(await p.locator('.mountain-art').evaluateAll(nodes=>nodes.every(n=>n.viewBox.baseVal.width===640)),true);
      assert.equal(await p.locator('.stone-top,.stone-side').count(),0);
      const ids=await p.locator('svg defs [id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(ids).size,ids.length);
      assert.equal(await p.locator('.mountain-art').evaluateAll(nodes=>nodes.every(svg=>[...svg.querySelectorAll('text')].every(t=>{const b=t.getBBox(),matrix=svg.getCTM().inverse().multiply(t.getCTM()),a=new DOMPoint(b.x,b.y).matrixTransform(matrix),z=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(matrix);return a.x>=0&&z.x<=640&&a.y>=0&&z.y<=440;}))),true,'SVG labels stay inside bounded scene');
      await p.screenshot({path:`${output}/mountain-${name}-${theme}-${width}.png`,fullPage:true});
      await p.locator('.mountain-art,.finished-outline').first().screenshot({path:`${output}/mountain-${name}-scene-${theme}-${width}.png`});
    }
    assert.deepEqual(await snapshot(p),before,'Rendering, themes and resizing cannot write records');
  }
  async function graphic(checked,total,phase,current){
    await p.waitForFunction(({checked,total,phase,current})=>{const svg=document.querySelector('.mountain-art');return svg?.dataset.phase===phase&&Number(svg.dataset.current)===current&&svg.querySelectorAll('.milestone').length===total&&svg.querySelectorAll('.milestone.earned').length===checked;},{checked,total,phase,current});
    const svg=p.locator('.mountain-art').first();assert.equal(await svg.getAttribute('data-phase'),phase);assert.equal(Number(await svg.getAttribute('data-current')),current);
    assert.equal(await svg.locator('.milestone').count(),total);assert.equal(await svg.locator('.milestone.earned').count(),checked);assert.equal(await svg.locator('.route-segment.earned').count(),checked);
    assert.equal(await svg.locator('.summit-earned').count(),phase==='finished'?1:0);
    assert.equal(await svg.evaluate(svg=>{const rect=svg.querySelector('.position-label rect');if(!rect)return true;const b=rect.getBBox(),m=rect.getCTM(),a=new DOMPoint(b.x,b.y).matrixTransform(m),z=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(m);return [...svg.querySelectorAll('.marker-core')].every(c=>{const p=new DOMPoint(0,0).matrixTransform(c.getCTM()),r=c.r.baseVal.value*c.getCTM().a;return p.x+r<=a.x||p.x-r>=z.x||p.y+r<=a.y||p.y-r>=z.y;});}),true,'Current label must not cover an action checkpoint');
  }
  async function historyGraphic(goalId,total){
    const w=await snapshot(p),g=w.goals[goalId];assert.equal(g.status,'completed');assert.equal(g.actionOrder.length,total);assert.ok(g.actionOrder.every(id=>w.actions[id].status==='completed'));assert.equal(await p.locator(`[data-finished-goal="${goalId}"] .finished-outline`).count(),1);assert.equal(await p.locator('.finished-card .mountain-art,.finished-card .milestone').count(),0);
  }
  async function complete(){
    const focus=p.locator('[data-work="focus"]');
    if(await focus.count())await focus.first().click();else await p.locator('[data-work="start"],[data-work="resume"]').first().click();
    await p.locator('.focus-clock').waitFor();await p.click('[data-work="complete"]');await p.waitForFunction(()=>document.body.dataset.view==='today');
  }
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await capture('no-goal-home');await graphic(0,4,'illustration',-1);
    await create(p,'A proposal worth finishing',['Research <source> & constraints','Draft the outline','Write the proposal','Check the numbers','Send the final draft']);
    let w=await snapshot(p);const goalId=w.openGoalId,ids=w.goals[goalId].actionOrder;
    await graphic(0,5,'active',0);assert.equal(await p.locator('.position-label text').textContent(),'Next action');
    await p.click('[data-work="pause"]');await p.fill('#return-note','Open the actual outline.');await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();
    assert.equal(await p.locator('.position-label text').textContent(),'Saved place');await capture('saved-today');
    await p.click('.brand');await capture('active-home');await p.click('.hero-cta');await p.click('[data-nav="journey"]');await capture('journey');
    const beforeSelection=await snapshot(p);await p.locator(`[data-select="${ids[3]}"]`).focus();await p.keyboard.press('Enter');
    await graphic(0,5,'active',0);assert.equal(await p.locator('.milestone.highlighted').getAttribute('data-action-id'),ids[3]);assert.equal(await p.locator('.milestone.current').getAttribute('data-action-id'),ids[0]);assert.deepEqual(await snapshot(p),beforeSelection);
    await p.click('[data-nav="today"]');await p.click('[data-work="start"]');await p.waitForTimeout(400);await p.click('[data-work="complete"]');
    await p.locator('.expedition-marker.travelling').waitFor();await assertRouteTravel(p);
    await p.screenshot({path:`${output}/mountain-earned-transition.png`,fullPage:true});await p.waitForFunction(()=>!document.querySelector('.travelling'));assert.equal(await p.locator('.travelling').count(),0);
    await graphic(1,5,'active',1);w=await snapshot(p);const recorded=Object.values(w.intervals).reduce((n,i)=>n+i.deltaMs,0);assert.ok(recorded>0);
    await p.click('[data-work="undo"]');await graphic(0,5,'active',0);w=await snapshot(p);assert.equal(w.sessions[w.activeSessionId].status,'paused');assert.equal(Object.values(w.intervals).reduce((n,i)=>n+i.deltaMs,0),recorded);
    await complete();await graphic(1,5,'active',1);await p.click('[data-nav="journey"]');assert.equal(await p.locator('.travelling').count(),0,'Navigation never replays completion');await p.click('[data-nav="today"]');
    for(let i=1;i<5;i++)await complete();await p.locator('#review[open]').waitFor();await p.keyboard.press('Escape');await graphic(5,5,'review',-1);await capture('ready-review');
    await p.click('[data-work="review"]');await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');await historyGraphic(goalId,5);await capture('finished');
    await p.reload();await p.locator('.hero-cta').waitFor();await p.click('[data-nav="finished"]');await historyGraphic(goalId,5);assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);const effortBeforeReopen=Object.values((await snapshot(p)).intervals).reduce((n,i)=>n+i.deltaMs,0);
    await p.click('[data-reopen-goal]');await p.locator('#review[open]').waitFor();await p.keyboard.press('Escape');await graphic(5,5,'review',-1);
    await p.locator(`[data-select="${ids[0]}"]`).click();await p.click('[data-work="reopen-action"]');await graphic(4,5,'active',0);
    assert.deepEqual(await p.locator('.milestone.earned').evaluateAll(nodes=>nodes.map(n=>n.dataset.actionId)),ids.slice(1));
    await p.locator(`[data-select="${ids[4]}"]`).click();await graphic(4,5,'active',0);await capture('reopened-earlier');assert.equal(await p.locator('.milestone.highlighted').getAttribute('data-action-id'),ids[4]);
    w=await snapshot(p);assert.equal(Object.values(w.intervals).reduce((n,i)=>n+i.deltaMs,0),effortBeforeReopen);
    // Complete that same goal again, then create a second to verify simultaneous SVG definitions.
    const beforeRecompletion=await snapshot(p);await complete();await p.locator('#review[open]').waitFor();
    const afterRecompletion=await snapshot(p);assert.equal(Object.keys(afterRecompletion.events).length,Object.keys(beforeRecompletion.events).length+1,'Passing later checked checkpoints creates only the intended completion');
    assert.equal(await p.locator('.expedition-marker').getAttribute('data-station'),'review');assert.equal(await p.locator('.expedition-marker').getAttribute('data-route-fraction'),'1');
    await p.waitForFunction(()=>!document.querySelector('.travelling'));await assertCanonicalMarker(p);await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');
    await p.click('.brand');await create(p,'A one-action goal',['One <long> action '+ 'unbroken'.repeat(50)]);await graphic(0,1,'active',0);await capture('one-action-long');await complete();await p.keyboard.press('Escape');await graphic(1,1,'review',-1);await capture('one-ready-review');await p.click('[data-work="review"]');await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');await capture('two-finished-goals');assert.equal(await p.locator('.mountain-art').count(),0);assert.equal(await p.locator('.finished-outline').count(),2);
    await p.click('.brand');await create(p,'Thirty actions, one legible mountain',Array.from({length:30},(_,i)=>`Action ${i+1}: ${'long-unbroken-name'.repeat(25)}`));await graphic(0,30,'active',0);await capture('thirty-today');await p.click('[data-nav="journey"]');const beforeThirty=await snapshot(p);await p.locator('[data-select]').nth(29).click();await graphic(0,30,'active',0);assert.equal(await p.locator('.milestone.highlighted').getAttribute('data-marker'),'29');assert.deepEqual(await snapshot(p),beforeThirty);await capture('thirty-selected');
    // Motion Off disables the earned response without disabling the immediate checked state.
    await p.click('[data-nav="today"]');await p.click('[data-work="start"]');await p.click('[data-action="ambience"]');assert.equal(await p.locator('body').evaluate(e=>e.classList.contains('still')),true);await p.click('[data-work="complete"]');await graphic(1,30,'active',1);assert.equal(await p.locator('.travelling').count(),0);
    await p.emulateMedia({reducedMotion:'reduce'});await complete();await graphic(2,30,'active',2);assert.equal(await p.locator('.travelling').count(),0);await capture('reduced-motion-thirty');
    const beforeExample=await snapshot(p);await p.click('#example-mode');await graphic(2,4,'active',2);await p.selectOption('#scenario','finished');assert.equal(await p.locator('.finished-outline').count(),1);assert.equal(await p.locator('.mountain-art').count(),0);assert.match(await p.locator('.finished-card').textContent(),/4 actions checked.*no effort simulated/);await capture('example-finished');await p.click('#real-mode');assert.deepEqual(await snapshot(p),beforeExample);
    const pairContext=await browser.newContext(),pair=await pairContext.newPage();
    try{
      await pair.goto(url);await pair.locator('#storage-status').waitFor({state:'hidden'});await create(pair,'A two-action ascent',['First action','Second action']);
      assert.equal(await pair.locator('.mountain-art .milestone').count(),2);
      for(const theme of ['light','dark'])for(const width of [1440,390]){await pair.setViewportSize({width,height:844});await pair.evaluate(()=>scrollTo(0,0));await pair.waitForTimeout(180);await pair.click(`[data-theme="${theme}"]`);await pair.waitForTimeout(180);assert.equal(await pair.locator('body').getAttribute('data-view'),'today');await pair.locator('.mountain-art').screenshot({path:`${output}/mountain-two-actions-scene-${theme}-${width}.png`});}
    }finally{await pairContext.close();}
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    console.log('Mountain gate passed: actual completion/Undo/review/finish/reload/reopen, noncontiguous checked IDs, independent keyboard selection, saved-context label, 1/2/5/30 actions, repeated unique SVG definitions, no render writes/external requests, finite path-following transition, motion Off/reduced motion, examples and light/dark desktop/390px.');
  }finally{await context.close();}
}
async function runReturn(browser){
  const requests=[];
  const fixture=http.createServer((req,res)=>{if(req.url.startsWith('/work'))requests.push({url:req.url,referer:req.headers.referer});res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><title>Work reference fixture</title><p>Local test document</p>');});
  await new Promise(resolve=>fixture.listen(0,'127.0.0.1',resolve));
  const reference=`http://127.0.0.1:${fixture.address().port}/work?draft=1&view=notes#paragraph-2`;
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  try{
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});
    await p.click('.hero-cta');const empty=await snapshot(p);await p.fill('#goal-title','A draft, not yet saved');await p.locator('#goal-title').press('Control+Enter');
    assert.deepEqual(await snapshot(p),empty);assert.equal(await p.locator('#goal-form').count(),1);await p.click('[data-work="cancel"]');await p.click('.brand');
    await create(p,'Finish the actual proposal',['Write the budget section','Read the final draft']);
    let w=await snapshot(p);const goalId=w.openGoalId,[a,b]=w.goals[goalId].actionOrder;
    assert.match(await p.locator('.action-area .step-label').textContent(),/Next unfinished action/);
    assert.equal(await p.locator('.action-area time').count(),0);assert.equal(await p.locator('.action-area .work-link').count(),0);
    await p.click('[data-work="start"]');await p.waitForTimeout(500);await p.click('[data-work="pause"]');await p.locator('#real-pause-form').waitFor();
    w=await snapshot(p);const sessionId=w.activeSessionId;assert.equal(w.sessions[sessionId].status,'paused');
    assert.equal(await p.inputValue('#return-note'),'');assert.match(await p.locator('#return-note').getAttribute('placeholder'),/For example/);
    assert.equal(await p.locator('#pause-extras').evaluate(e=>e.open),false);assert.equal(await p.locator('#work-url').isVisible(),false);
    const move='Open <draft> and add the hosting estimate.',stopped='Staffing costs are written. Equipment costs are still blank.';
    await p.fill('#return-note',move);await p.locator('#pause-extras summary').click();await p.fill('#pause-context',stopped);await p.fill('#work-url',reference);
    const beforeSave=await snapshot(p);
    await p.locator('#work-url').dispatchEvent('keydown',{key:'Enter',ctrlKey:true,isComposing:true,bubbles:true});assert.deepEqual(await snapshot(p),beforeSave);
    await p.locator('#work-url').press('Control+Enter');await p.locator('.workspace').waitFor();
    w=await snapshot(p);assert.equal(w.contexts[a].resourceUrl,reference);const saved=structuredClone(w.contexts[a]);
    await p.reload();await p.locator('.workspace').waitFor();
    assert.equal(await p.locator('.action-area .instruction').textContent(),move);assert.equal(await p.locator('.action-area .saved-context p').textContent(),stopped);
    assert.match(await p.locator('.action-area .step-label').textContent(),/Saved next move/);
    assert.equal(Number(await p.locator('.action-area time').getAttribute('data-saved-at')),saved.updatedAt);
    assert.equal(await p.locator('.action-area time').getAttribute('datetime'),new Date(saved.updatedAt).toISOString());
    assert.equal((await snapshot(p)).contexts[a].updatedAt,saved.updatedAt);
    assert.match(await p.locator('.scene-top').textContent(),/Your goal trail.*0 of 2 actions checked/);assert.doesNotMatch(await p.locator('.scene-top').textContent(),/Today/);
    const link=p.locator('.action-area .work-link');assert.equal(await link.getAttribute('href'),reference);assert.equal(await link.getAttribute('target'),'_blank');assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
    const beforeOpen=await snapshot(p);assert.equal(requests.length,0,'Saving/rendering a reference must not fetch it.');const [opened]=await Promise.all([context.waitForEvent('page'),link.click()]);await opened.waitForLoadState();
    assert.equal(opened.url(),reference);assert.equal(await opened.evaluate(()=>window.opener),null);assert.equal(await opened.evaluate(()=>document.referrer),'');assert.equal(requests[0].referer,undefined);
    assert.deepEqual(await snapshot(p),beforeOpen);assert.equal((await snapshot(p)).sessions[sessionId].status,'paused');await opened.close();
    await p.click('[data-work="resume"]');await p.locator('.focus-clock').waitFor();assert.equal((await snapshot(p)).sessions[sessionId].status,'running');
    await p.click('[data-work="pause"]');await p.locator('#real-pause-form').waitFor();await p.click('[data-work="skip"]');
    async function capture(view){
      for(const theme of ['light','dark'])for(const width of [1440,390]){
        await p.setViewportSize({width,height:width===390?844:1000});if(await p.locator('#history-detail[open]').count())await p.locator(`button[data-theme="${theme}"]`).evaluate(el=>el.click());else await p.click(`button[data-theme="${theme}"]`);await p.waitForTimeout(180);
        assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await p.screenshot({path:`${output}/return-${view}-${theme}-${width}.png`,fullPage:true});
      }
    }
    await capture('today');await p.click('[data-work="focus"]');await p.locator('.focus-details summary').click();await p.locator('.focus-details .work-link').waitFor({state:'visible'});await p.locator('.focus-details .work-link').focus();assert.equal(await p.locator('.focus-details .work-link').evaluate(e=>e===document.activeElement),true);await capture('focus');
    assert.equal((await snapshot(p)).sessions[sessionId].status,'paused');
    await p.click('[data-work="pause"]');await p.locator('#pause-extras summary').click();
    await p.fill('#return-note','Unsaved next move');await p.fill('#pause-context','Unsaved context');await p.fill('#work-url',reference.replace('draft=1','draft=unsaved'));await p.check('#remove-resource');
    const prior=await snapshot(p);
    async function assertDraft(){assert.equal(await p.inputValue('#return-note'),'Unsaved next move');assert.equal(await p.inputValue('#pause-context'),'Unsaved context');assert.match(await p.inputValue('#work-url'),/draft=unsaved/);assert.equal(await p.isChecked('#remove-resource'),true);assert.equal(await p.locator('#work-url').evaluate(e=>e.readOnly),true);assert.equal(await p.locator('#pause-extras').evaluate(e=>e.open),true);assert.deepEqual(await snapshot(p),prior);}
    await p.click('[data-nav="journey"]');await p.click('[data-nav="today"]');await p.click('[data-work="pause"]');await assertDraft();
    await p.click('#example-mode');await p.click('#reset');await p.click('#real-mode');await p.click('[data-work="pause"]');await assertDraft();
    await capture('pause-removal-draft');await p.click('[data-work="skip"]');assert.deepEqual(await snapshot(p),prior);
    await p.click('[data-work="pause"]');assert.equal(await p.inputValue('#return-note'),move);await p.locator('#pause-extras summary').click();assert.equal(await p.inputValue('#work-url'),reference);assert.equal(await p.isChecked('#remove-resource'),false);
    await p.fill('#return-note','  ');await p.fill('#pause-context','  ');await p.fill('#work-url','  ');await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();
    w=await snapshot(p);assert.equal(w.contexts[a].nextInstruction,move);assert.equal(w.contexts[a].context,stopped);assert.equal(w.contexts[a].resourceUrl,reference);
    await p.click('[data-work="pause"]');await p.locator('#pause-extras summary').click();await p.fill('#return-note','Retain my invalid-link draft');await p.fill('#work-url','javascript:alert(1)');
    const beforeInvalid=await snapshot(p);await p.click('#real-pause-form [type="submit"]');await p.getByRole('alert').waitFor();
    assert.deepEqual(await snapshot(p),beforeInvalid);assert.equal(await p.inputValue('#work-url'),'javascript:alert(1)');assert.equal(await p.inputValue('#return-note'),'Retain my invalid-link draft');
    const longReference=reference.replace('draft=1',`draft=${'x'.repeat(1700)}`),longContext='Remember <source> notes. '.repeat(120);
    await p.fill('#work-url',longReference);await p.fill('#pause-context',longContext);await p.fill('#return-note','Line one');await p.locator('#return-note').press('End');await p.locator('#return-note').press('Enter');await p.keyboard.type('Line two');
    assert.equal(await p.inputValue('#return-note'),'Line one\nLine two');assert.deepEqual(await snapshot(p),beforeInvalid);await capture('pause-long');
    await p.evaluate(()=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const result=put.apply(this,args);if(window.abortReturnWrite){window.abortReturnWrite=false;this.transaction.abort();}return result;};window.abortReturnWrite=true;});
    await p.click('#real-pause-form [type="submit"]');await p.getByRole('alert').waitFor();assert.deepEqual(await snapshot(p),beforeInvalid);assert.equal(await p.inputValue('#work-url'),longReference);assert.equal(await p.inputValue('#pause-context'),longContext);
    await p.click('[data-work="retry"]');await p.locator('.workspace').waitFor();w=await snapshot(p);assert.equal(w.revision,beforeInvalid.revision+1);assert.equal(Object.keys(w.operations).length,Object.keys(beforeInvalid.operations).length+1);assert.equal(w.contexts[a].resourceUrl,longReference);assert.equal(w.contexts[a].context,longContext.trim());assert.equal(w.sessions[sessionId].status,'paused');assert.equal(w.sessions[sessionId].creditedMs,beforeInvalid.sessions[sessionId].creditedMs);await capture('today-long');
    await p.click('[data-work="pause"]');await p.locator('#pause-extras summary').click();await p.check('#remove-resource');const beforeRemove=await snapshot(p);await p.evaluate(()=>window.abortReturnWrite=true);
    await p.click('#real-pause-form [type="submit"]');await p.getByRole('alert').waitFor();assert.equal(await p.isChecked('#remove-resource'),true);assert.deepEqual(await snapshot(p),beforeRemove);
    await p.click('[data-work="retry"]');await p.locator('.workspace').waitFor();w=await snapshot(p);assert.equal(w.revision,beforeRemove.revision+1);assert.equal(Object.hasOwn(w.contexts[a],'resourceUrl'),false);assert.equal(await p.locator('.action-area .work-link').count(),0);
    await p.click('[data-work="pause"]');await p.locator('#pause-extras summary').click();await p.fill('#work-url',reference);await p.locator('#work-url').press('Meta+Enter');await p.locator('.workspace').waitFor();
    const forUndo=await snapshot(p),exactContext=structuredClone(forUndo.contexts[a]);
    await p.click('[data-work="focus"]');await p.click('[data-work="complete"]');await p.locator('[data-work="undo"]').waitFor();
    assert.equal(await p.locator('.action-area .work-link').count(),0);assert.match(await p.locator('.action-area .step-label').textContent(),/Next unfinished action/);
    await p.click('[data-work="undo"]');await p.locator('[data-work="resume"]').first().waitFor();w=await snapshot(p);assert.deepEqual(w.contexts[a],exactContext);assert.equal(w.sessions[sessionId].status,'paused');assert.equal(w.sessions[sessionId].remainingMs,forUndo.sessions[sessionId].remainingMs);
    await p.click('[data-work="focus"]');await p.click('[data-work="complete"]');await p.locator('[data-work="start"]').waitFor();await p.click('[data-work="start"]');await p.click('[data-work="pause"]');
    assert.equal(await p.inputValue('#return-note'),'');await p.locator('#pause-extras summary').click();assert.equal(await p.inputValue('#work-url'),'');await p.click('[data-work="skip"]');
    await p.click('[data-work="focus"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');
    await p.locator('.archive-title').click();assert.equal(await p.locator('#history-detail .work-link').count(),1);assert.equal(await p.locator('#history-detail .work-link').getAttribute('href'),reference);await capture('history');await p.click('#history-detail-close');
    await p.click('[data-reopen-goal]');await p.locator('#review[open]').waitFor();await p.keyboard.press('Escape');await p.locator(`[data-select="${a}"]`).click();await p.click('[data-work="reopen-action"]');
    w=await snapshot(p);assert.deepEqual(w.contexts[a],exactContext);assert.equal(w.contexts[b],undefined);assert.equal(w.activeSessionId,null);assert.equal(await p.locator('.action-area .work-link').getAttribute('href'),reference);
    assert.deepEqual(errors,[]);
    // Deliberately corrupt stored metadata in another isolated profile; it must not render or reset.
    const badContext=await browser.newContext(),bad=await badContext.newPage();
    try{await bad.goto(url);await bad.locator('#storage-status').waitFor({state:'hidden'});await create(bad,'Malformed link test',['One action']);await bad.click('[data-work="pause"]');await bad.fill('#return-note','A real note');await bad.click('#real-pause-form [type="submit"]');await bad.locator('.workspace').waitFor();
      const unsafe=await bad.evaluate(async()=>{const {openDatabase}=await import('/storage.js');const db=await openDatabase();let raw;await new Promise(resolve=>{const tx=db.transaction('workspace','readwrite'),s=tx.objectStore('workspace'),r=s.get('current');r.onsuccess=()=>{raw=r.result;raw.contexts[raw.goals[raw.openGoalId].actionOrder[0]].resourceUrl='javascript:alert(1)';s.put(raw,'current');};tx.oncomplete=resolve;});db.close();return raw;});
      await bad.reload();await bad.getByRole('alert').waitFor();assert.match(await bad.locator('#storage-status').textContent(),/Invalid saved work link/);assert.equal(await bad.locator('a[href^="javascript:"]').count(),0);assert.deepEqual(await snapshot(bad),unsafe);
    }finally{await badContext.close();}
    console.log('Return gate passed: safe optional URL/save time, local isolated new-tab reference without timing mutation, shortcuts/IME, pause drafts/removal, blank/Skip/clear, aborted saves/exact Retry, Undo/history/action isolation, corrupt data and both themes/390px.');
  }finally{await context.close();fixture.closeAllConnections();await new Promise(resolve=>fixture.close(resolve));}
}
async function runCorrections(browser){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage(),errors=[];
  p.on('pageerror',err=>errors.push(err.message));
  try {
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});
    async function inspectHome(name,nextMove,cta,destination){
      const before=await snapshot(p);
      for(const theme of ['light','dark'])for(const width of [1440,390]){
        await p.setViewportSize({width,height:width===390?844:1000});await p.click(`[data-theme="${theme}"]`);await p.click('.brand');
        assert.equal(await p.locator('.hero-saved p').textContent(),`Next move: ${nextMove}`);
        assert.equal((await p.locator('.hero-cta').textContent()).trim(),`${cta} ↗`);
        assert.doesNotMatch(await p.locator('#main').textContent(),/ML assignment|comparison table|precision and recall|Explore a fictional workday/);
        assert.match(await p.locator('.hero-art-heading .tag').textContent(),/illustrat/i);
        assert.equal(await p.locator('.hero-saved p *').count(),0);
        if(!before.openGoalId){assert.equal(await p.locator('.milestone.earned,.milestone.current').count(),0);}
        assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await p.screenshot({path:`${output}/correction-${name}-${theme}-${width}.png`,fullPage:true});
        await p.click('.hero-cta');await p.locator(destination).waitFor();
        assert.deepEqual(await snapshot(p),before,'Home CTA must not save or start timing.');
        if(destination==='#goal-form')await p.click('[data-work="cancel"]');
        assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);
      }
    }
    async function formDraft(){return {title:await p.inputValue('#goal-title'),definition:await p.inputValue('#goal-definition'),actions:await p.locator('[data-draft-id]').evaluateAll(inputs=>inputs.map(input=>({id:input.dataset.draftId,title:input.value})))};}
    async function roundTrip(reopen){await p.click('#example-mode');await p.locator('#scenario').waitFor({state:'visible'});await p.click('#reset');await p.click('#real-mode');await p.click(reopen);await p.locator('#goal-form').waitFor();}
    await inspectHome('fresh','Open the capacity table and compare the two room options.','Start working','#goal-form');
    // Fictional landing stays explicitly separate and retains its own sample content.
    const fresh=await snapshot(p);await p.click('#example-mode');await p.selectOption('#scenario','landing');
    assert.match(await p.locator('.hero-saved p').textContent(),/capacity table/);
    assert.match(await p.locator('#mode-label').textContent(),/Fictional example/);await p.click('#real-mode');
    assert.deepEqual(await snapshot(p),fresh);
    await p.click('.hero-cta');await p.fill('#goal-title','Unsaved <b>goal</b>');await p.fill('#goal-definition','Keep this unsaved definition.');
    await p.locator('[data-draft-id]').fill('Alpha');
    for(const title of ['Beta','Remove this']){await p.click('[data-draft="add"]');await p.locator('[data-draft-id]').last().fill(title);}
    await p.locator('[data-draft="remove"]').last().click();await p.locator('[data-draft="down"]').first().click();
    await p.click('[data-draft="add"]');await p.locator('[data-draft-id]').last().fill('Gamma');await p.locator('[data-draft="up"]').last().click();
    await p.locator('[data-draft-id]').last().fill('Alpha — typed after the last reorder');
    const createDraft=await formDraft();await roundTrip('.hero-cta');
    assert.deepEqual(await formDraft(),createDraft);assert.deepEqual(await snapshot(p),fresh);
    // Editing after the first return must also be captured on the next round trip.
    await p.fill('#goal-title','Unsaved title, revised');const revised=await formDraft();await roundTrip('.hero-cta');assert.deepEqual(await formDraft(),revised);
    for(const theme of ['light','dark']){await p.click(`[data-theme="${theme}"]`);await p.waitForTimeout(200);await p.screenshot({path:`${output}/correction-create-draft-${theme}-390.png`,fullPage:true});}
    await p.click('[data-work="cancel"]');await p.click('.brand');await p.click('.hero-cta');
    assert.equal(await p.inputValue('#goal-title'),'');assert.equal(await p.inputValue('#goal-definition'),'');assert.equal(await p.locator('[data-draft-id]').count(),1);
    assert.equal(await p.locator('[data-draft-id]').inputValue(),'');assert.deepEqual(await snapshot(p),fresh);await p.click('[data-work="cancel"]');
    await p.click('.brand');await create(p,'Canonical goal',['Saved first action','Saved second action']);
    const saved=await snapshot(p),goalId=saved.openGoalId;await p.click('[data-work="edit"]');
    await p.fill('#goal-title','Edited <img src=x> goal');await p.fill('#goal-definition','Edited definition, not saved yet.');
    await p.locator('[data-draft-id]').first().fill('Edited first action');await p.locator('[data-draft="remove"]').last().click();
    await p.click('[data-draft="add"]');await p.locator('[data-draft-id]').last().fill('New draft action');await p.locator('[data-draft="up"]').last().click();
    await p.locator('[data-draft-id]').first().fill('New draft action — unsaved text');
    const editDraft=await formDraft();await roundTrip('[data-work="edit"]');
    assert.deepEqual(await formDraft(),editDraft);assert.deepEqual(await snapshot(p),saved);
    await p.click('[data-work="cancel"]');await p.click('[data-work="edit"]');
    assert.equal(await p.inputValue('#goal-title'),saved.goals[goalId].title);
    assert.deepEqual((await formDraft()).actions,saved.goals[goalId].actionOrder.map(id=>({id,title:saved.actions[id].title})));
    // Save the retained edit only after another explicit round trip.
    await p.fill('#goal-title',`${'A'.repeat(140)}<b>goal</b>`);await p.locator('[data-draft-id]').first().fill('Write the real opening paragraph');
    const finalDraft=await formDraft();await roundTrip('[data-work="edit"]');assert.deepEqual(await formDraft(),finalDraft);assert.deepEqual(await snapshot(p),saved);
    await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();
    const changed=await snapshot(p);assert.equal(changed.goals[goalId].title,finalDraft.title);assert.deepEqual(changed.goals[goalId].actionOrder,finalDraft.actions.map(a=>a.id));
    await inspectHome('open-no-context','Write the real opening paragraph','Continue your goal','.workspace');
    await p.click('[data-work="pause"]');await p.fill('#return-note','Open <draft> and write the next sentence.');await p.locator('#real-pause-form summary').click();await p.fill('#pause-context','Real notes, not the example.');await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();
    await inspectHome('open-saved-context','Open <draft> and write the next sentence.','Continue your goal','.workspace');
    for(let i=0;i<finalDraft.actions.length;i++){await p.click('[data-work="start"]');await p.click('[data-work="complete"]');}
    await p.locator('#review[open]').waitFor();await p.keyboard.press('Escape');
    await inspectHome('all-checked','All actions are checked. Review the goal, add another action, or confirm it’s finished.','Review your goal','[data-work="review"]');
    await p.click('[data-work="review"]');await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');
    await inspectHome('finished-only','1 finished goal. Revisit your work or make room for something new.','Create a new goal','#goal-form');
    assert.deepEqual(errors,[]);
    console.log('Correction regressions passed: create/edit drafts and IDs/order survive modes; Cancel/Save isolation; five real-home states and navigation-only CTAs; both themes at 1440px/390px.');
  } finally {await context.close();}
}
async function create(page,title='Ship <img src=x onerror=alert(1)>',actions=['First action','Second action','Third action']){
  await page.click('.hero-cta');
  await page.fill('#goal-title',title);await page.fill('#goal-definition','Finished means the tests pass.');
  for(let i=0;i<actions.length;i++){if(i)await page.click('[data-draft="add"]');await page.locator('[data-draft-id]').nth(i).fill(actions[i]);}
  await page.click('#goal-form [type="submit"]');await page.locator('.workspace').waitFor();
}
async function runB(browser){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage(),errors=[];
  p.on('pageerror',err=>errors.push(err.message));await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});
  assert.equal(Object.keys((await snapshot(p)).goals).length,0);
  await create(p);let w=await snapshot(p);const id=w.openGoalId,order=w.goals[id].actionOrder;
  assert.equal(await p.locator('img').count(),0);assert.match(await p.locator('.goal-label').textContent(),/<img/);
  await p.click('[data-work="edit"]');await p.locator('[data-draft="down"]').first().click();
  await p.click('#goal-form [type="submit"]');w=await snapshot(p);assert.deepEqual(w.goals[id].actionOrder,[order[1],order[0],order[2]]);
  await p.click('[data-work="edit"]');await p.fill('#goal-title','Cancelled');await p.click('[data-work="cancel"]');
  assert.notEqual((await snapshot(p)).goals[id].title,'Cancelled');
  await p.click('[data-work="edit"]');await p.fill('#goal-title','   ');await p.click('#goal-form [type="submit"]');
  await p.getByRole('alert').waitFor();assert.equal(await p.locator('#goal-title').inputValue(),'   ');
  await p.fill('#goal-title','Real goal');await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();
  await p.click('[data-work="start"]');await p.locator('.focus-clock').waitFor();
  await p.click('[data-nav="journey"]');assert.equal((await snapshot(p)).sessions[(await snapshot(p)).activeSessionId].status,'running');
  const second=await context.newPage();second.on('pageerror',err=>errors.push(err.message));await second.goto(url);await second.getByText('Open in another tab.',{exact:false}).waitFor();
  assert.equal(await second.locator('[data-work="resume"]').isDisabled(),true);
  // An actual continuously running browser interval, not a fake-clock sleep assertion.
  await p.waitForTimeout(61000);w=await snapshot(p);const s=w.sessions[w.activeSessionId];
  assert.equal(s.status,'running');assert.ok(s.creditedMs>=55000&&s.creditedMs<=65000);
  await p.click('[data-work="pause"]');await p.locator('#real-pause-form').waitFor();
  await p.fill('#return-note','Open the actual draft.');await p.locator('#real-pause-form summary').click();await p.fill('#pause-context','Keep this useful context.');
  await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();
  const credit=(await snapshot(p)).sessions[s.id].creditedMs;
  await p.reload();await p.locator('.workspace').waitFor();w=await snapshot(p);
  assert.equal(w.sessions[s.id].status,'paused');assert.equal(w.sessions[s.id].creditedMs,credit);
  assert.match(await p.locator('.instruction').textContent(),/Open the actual draft/);
  await p.click('[data-work="pause"]');await p.fill('#return-note','   ');await p.locator('#real-pause-form summary').click();await p.fill('#pause-context','   ');
  await p.click('#real-pause-form [type="submit"]');await p.locator('.workspace').waitFor();
  assert.equal((await snapshot(p)).contexts[order[1]].context,'Keep this useful context.');
  await p.click('[data-work="pause"]');await p.fill('#return-note','Discard me');await p.click('[data-work="skip"]');
  assert.equal((await snapshot(p)).contexts[order[1]].nextInstruction,'Open the actual draft.');
  await p.click('[data-work="resume"]');await p.locator('.focus-clock').waitFor();await p.reload();await p.locator('.workspace').waitFor();
  w=await snapshot(p);assert.equal(w.sessions[s.id].status,'interrupted');assert.equal(w.sessions[s.id].creditedMs,credit);
  await p.click('[data-work="resume"]');await p.locator('.focus-clock').waitFor();await p.close();
  await second.click('[data-work="ownership"]');await second.locator('.workspace').waitFor();
  w=await snapshot(second);assert.equal(w.sessions[s.id].status,'interrupted');assert.equal(Object.keys(w.sessions).length,1);
  // Abort an actual IndexedDB write after put; draft and durable snapshot must survive unchanged.
  await second.evaluate(()=>{const original=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=original.apply(this,args);if(window.abortTrailWrite){window.abortTrailWrite=false;this.transaction.abort();}return r;};window.abortTrailWrite=true;});
  await second.click('[data-work="pause"]');await second.fill('#return-note','Retry this exact note.');await second.click('#real-pause-form [type="submit"]');
  await second.getByRole('alert').waitFor();assert.equal(await second.locator('#return-note').inputValue(),'Retry this exact note.');
  assert.equal((await snapshot(second)).contexts[order[1]].nextInstruction,'Open the actual draft.');
  await second.click('[data-work="retry"]');await second.locator('.workspace').waitFor();
  assert.equal((await snapshot(second)).contexts[order[1]].nextInstruction,'Retry this exact note.');
  // A failed checkpoint stops accrual and retries the exact interval only once.
  await second.click('[data-work="resume"]');await second.locator('.focus-clock').waitFor();await second.evaluate(()=>window.abortTrailWrite=true);
  await second.getByRole('alert').waitFor({timeout:10000});const failed=await snapshot(second);await second.waitForTimeout(1000);
  assert.equal((await snapshot(second)).sessions[s.id].creditedMs,failed.sessions[s.id].creditedMs);
  await second.click('[data-work="retry"]');await second.locator('#storage-status strong').waitFor({state:'hidden'});
  await second.click('[data-work="pause"]');await second.locator('#real-pause-form').waitFor();await second.click('[data-work="skip"]');
  // Example entry/reset cannot alter real records.
  const before=await snapshot(second);await second.click('#example-mode');await second.click('#reset');await second.click('#real-mode');await second.locator('.workspace').waitFor();
  assert.deepEqual(await snapshot(second),before);
  await second.click('[data-work="resume"]');await second.locator('.focus-clock').waitFor();
  await second.evaluate(()=>{window.realNow=Date.now;window.realMono=performance.now.bind(performance);Date.now=()=>window.realNow()+20000;performance.now=()=>window.realMono()+20000;});
  await second.waitForFunction(async()=>{const {openDatabase}=await import('/storage.js');const db=await openDatabase();return new Promise(resolve=>{const tx=db.transaction('workspace','readonly'),r=tx.objectStore('workspace').get('current');r.onsuccess=()=>{const w=r.result;resolve(w.sessions[w.activeSessionId].status==='interrupted');};tx.oncomplete=()=>db.close();});});
  w=await snapshot(second);assert.equal(w.sessions[s.id].creditedMs,before.sessions[s.id].creditedMs);
  await second.evaluate(()=>{Date.now=window.realNow;performance.now=window.realMono;});
  // Near-expiry fixture is explicit test data, never seeded in the product.
  await second.evaluate(async()=>{const {openDatabase}=await import('/storage.js');const db=await openDatabase();await new Promise(resolve=>{const tx=db.transaction('workspace','readwrite'),store=tx.objectStore('workspace'),r=store.get('current');r.onsuccess=()=>{const w=r.result,s=w.sessions[w.activeSessionId];s.remainingMs=200;s.allocatedMs=s.creditedMs+200;store.put(w,'current');};tx.oncomplete=resolve;});db.close();});
  await second.reload();await second.locator('.workspace').waitFor();await second.click('[data-work="resume"]');
  await second.getByText('Block ended. Action still unfinished.',{exact:true}).waitFor();
  w=await snapshot(second);const expiredCredit=w.sessions[s.id].creditedMs;
  assert.equal(w.actions[order[1]].status,'open');
  await second.click('[data-work="extend-5"]');await second.getByText('remaining · paused; explicit Resume required',{exact:true}).waitFor();
  w=await snapshot(second);assert.equal(w.sessions[s.id].remainingMs,300000);assert.equal(w.sessions[s.id].creditedMs,expiredCredit);
  await second.click('[data-work="resume"]');await second.locator('.focus-clock').waitFor();await second.waitForTimeout(300);
  await second.click('#example-mode');await second.locator('#scenario').waitFor({state:'visible'});
  const pausedForExample=await snapshot(second);assert.equal(pausedForExample.sessions[s.id].status,'paused');
  await second.selectOption('#scenario','focus');await second.click('[data-action="resume"]');await second.waitForTimeout(300);await second.click('#real-mode');await second.locator('.workspace').waitFor();
  assert.deepEqual(await snapshot(second),pausedForExample);
  await second.click('[data-nav="today"]');
  for(const theme of ['light','dark']){await second.click(`[data-theme="${theme}"]`);await second.screenshot({path:`${output}/B-${theme}-today.png`,fullPage:true});}
  await second.setViewportSize({width:390,height:844});await second.click('[data-work="focus"]');
  assert.ok(await second.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await second.screenshot({path:`${output}/B-phone-focus.png`,fullPage:true});
  assert.deepEqual(errors,[]);await context.close();
  // Capability and malformed/new-schema errors preserve raw data, rather than resetting.
  for(const failure of ['denied','locks','malformed','newer']){
    const c=await browser.newContext();if(failure==='denied')await c.addInitScript(()=>{indexedDB.open=()=>{throw new Error('Storage denied');};});
    if(failure==='locks')await c.addInitScript(()=>Object.defineProperty(navigator,'locks',{value:undefined}));
    const p=await c.newPage();await p.goto(url);
    if(['malformed','newer'].includes(failure)){
      await p.locator('#storage-status').waitFor({state:'hidden'});
      await p.evaluate(async version=>{const {openDatabase}=await import('/storage.js');const db=await openDatabase();await new Promise(resolve=>{const tx=db.transaction('workspace','readwrite');tx.objectStore('workspace').put({schemaVersion:version,untouched:'keep me'},'current');tx.oncomplete=resolve;});db.close();},failure==='newer'?2:1);
      await p.reload();
    }
    await p.getByRole('alert').waitFor();assert.equal(await p.locator('.hero-cta').isDisabled(),true);
    if(['malformed','newer'].includes(failure)){
      const [download]=await Promise.all([p.waitForEvent('download'),p.click('[data-work="export"]')]);
      const stream=await download.createReadStream();let raw='';for await(const chunk of stream)raw+=chunk.toString();
      assert.deepEqual(JSON.parse(raw),{schemaVersion:failure==='newer'?2:1,untouched:'keep me'});
      assert.deepEqual(await snapshot(p),JSON.parse(raw));
    }
    await p.click('#example-mode');await p.locator('#scenario').waitFor({state:'visible'});await c.close();
  }
  console.log('Gate B passed: real IDB create/edit/reorder, 61s running navigation, notes/reload/Resume, two-tab takeover, abort/retry, isolated examples, capability/corruption errors, themes/phone. Physical sleep not tested.');
}

async function runC(browser){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage(),errors=[];
  p.on('pageerror',err=>errors.push(err.message));await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});
  await create(p,'A real finished goal',['Write a draft','Review it']);let w=await snapshot(p);const goalId=w.openGoalId,[a,b]=w.goals[goalId].actionOrder;
  await p.click('[data-work="pause"]');await p.fill('#return-note','Start at paragraph two.');await p.locator('#real-pause-form summary').click();await p.fill('#pause-context','Keep the source notes.');await p.click('#real-pause-form [type="submit"]');
  await p.locator('.workspace').waitFor();await p.click('[data-work="start"]');await p.waitForTimeout(900);
  await p.evaluate(()=>{const original=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=original.apply(this,args);if(window.abortTrailWrite){window.abortTrailWrite=false;this.transaction.abort();}return r;};window.abortTrailWrite=true;});
  await p.click('[data-work="complete"]');await p.getByRole('alert').waitFor();assert.equal((await snapshot(p)).actions[a].status,'open');
  await p.click('[data-work="retry"]');await p.locator('[data-work="undo"]').waitFor();w=await snapshot(p);
  const undo=w.undo,credited=Object.values(w.intervals).reduce((s,i)=>s+i.deltaMs,0);
  assert.ok(credited>=800);assert.equal(w.actions[a].status,'completed');
  await p.click('[data-nav="journey"]');await p.reload();await p.locator('[data-work="undo"]').waitFor();
  w=await snapshot(p);assert.equal(w.undo.eventId,undo.eventId);assert.equal(w.undo.expectedRevision,w.revision);
  await p.click('[data-work="undo"]');await p.locator('[data-work="resume"]').first().waitFor();
  w=await snapshot(p);assert.equal(w.actions[a].status,'open');assert.equal(w.sessions[undo.session.id].remainingMs,undo.session.remainingMs);assert.equal(w.sessions[undo.session.id].creditedMs,credited);assert.equal(w.sessions[undo.session.id].status,'paused');assert.equal(w.contexts[a].context,'Keep the source notes.');
  await p.click('[data-work="focus"]');await p.click('[data-work="complete"]');await p.locator('[data-work="start"]').waitFor();
  await p.click('[data-work="start"]');await p.locator('[data-work="complete"]').waitFor();
  // Repeated clicks cannot complete the next action or duplicate this event.
  await p.locator('[data-work="complete"]').evaluate(b=>{b.click();b.click();});await p.locator('#review[open]').waitFor();
  w=await snapshot(p);assert.equal(w.goals[goalId].status,'open');assert.equal(w.actions[b].status,'completed');
  assert.equal(Object.values(w.events).filter(e=>e.type==='action-completed'&&e.actionId===b).length,1);
  await p.click('#review [data-action="keep-open"]');await p.locator('#review').waitFor({state:'hidden'});
  assert.equal((await snapshot(p)).undo,null);assert.equal((await snapshot(p)).goals[goalId].status,'open');
  await p.click('[data-work="review"]');await p.click('#review [data-action="add"]');await p.fill('#new-step','Check <script>literal</script>');await p.click('#add-form [type="submit"]');
  await p.locator('.workspace').waitFor();w=await snapshot(p);assert.equal(w.goals[goalId].actionOrder.length,3);
  await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();
  await p.evaluate(()=>{const original=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=original.apply(this,args);if(window.abortTrailWrite){window.abortTrailWrite=false;this.transaction.abort();}return r;};window.abortTrailWrite=true;});
  await p.click('#review [data-action="confirm"]');await p.locator('#review-status [role="alert"]').waitFor();
  assert.equal((await snapshot(p)).goals[goalId].status,'open');assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);
  await p.click('#review-status [data-work="retry"]');await p.locator('#reward[open]').waitFor();
  assert.equal(await p.locator('#reward-goal').textContent(),'A real finished goal');
  w=await snapshot(p);assert.equal(w.openGoalId,null);assert.equal(w.goals[goalId].status,'completed');assert.equal(Object.values(w.events).filter(e=>e.type==='goal-finished').length,1);
  await p.screenshot({path:`${output}/C-real-reward.png`,fullPage:true});await p.keyboard.press('Escape');
  const completedEffort=Object.values(w.intervals).reduce((s,i)=>s+i.deltaMs,0);
  await p.reload();await p.click('[data-nav="finished"]');assert.equal(await p.locator('.finished-card').count(),1);assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);
  await p.click('[data-reopen-goal]');await p.locator('#review[open]').waitFor();w=await snapshot(p);assert.equal(w.actions[a].status,'completed');assert.equal(w.goals[goalId].status,'open');
  await p.keyboard.press('Escape');await p.locator(`[data-select="${a}"]`).click();await p.click('[data-work="reopen-action"]');
  w=await snapshot(p);assert.equal(w.actions[a].status,'open');assert.equal(w.activeSessionId,null);assert.equal(Object.values(w.intervals).reduce((s,i)=>s+i.deltaMs,0),completedEffort);
  // Explicit correction does not silently restart a block or reopen other actions.
  assert.equal(w.actions[b].status,'completed');await p.click('[data-nav="journey"]');
  assert.equal(await p.locator(`.milestone[data-action-id="${a}"].current`).count(),1);assert.equal(await p.locator(`.milestone[data-action-id="${b}"].earned`).count(),1);assert.equal(await p.locator(`.route-segment[data-action-id="${b}"].earned`).count(),1);
  await p.click('[data-nav="today"]');await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.click('#reward .primary');
  assert.equal(await p.locator('.finished-card').count(),1);assert.equal(Object.keys((await snapshot(p)).goals).length,1);
  await p.click('[data-work="create"]');await p.fill('#goal-title','Second real goal');await p.fill('#goal-definition','Two actions done');await p.locator('[data-draft-id]').fill('One next move');await p.click('#goal-form [type="submit"]');await p.locator('.workspace').waitFor();
  await p.click('[data-nav="finished"]');assert.equal(await p.locator('[data-reopen-goal]').isDisabled(),true);assert.match(await p.locator('.finished-card').textContent(),/Another goal is open/);
  await p.click('[data-nav="today"]');await p.click('[data-work="start"]');await p.click('[data-work="complete"]');await p.locator('#review[open]').waitFor();await p.click('#review [data-action="confirm"]');await p.locator('#reward[open]').waitFor();await p.keyboard.press('Escape');
  assert.equal(await p.locator('.finished-card').count(),2);
  for(const theme of ['light','dark']){await p.click(`[data-theme="${theme}"]`);await p.screenshot({path:`${output}/C-${theme}-history.png`,fullPage:true});}
  await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${output}/C-phone-history.png`,fullPage:true});
  await p.reload();await p.click('[data-nav="finished"]');assert.equal(await p.locator('.finished-card').count(),2);assert.equal(await p.locator('#reward').evaluate(e=>e.open),false);
  assert.deepEqual(errors,[]);await context.close();
  console.log('Gate C passed: durable completion/Undo/reload, review/add/keep-open, aborted finish retry, history/no replay, guarded reopen/correction/refinish, two real goals, themes/390px.');
}

async function runEdges(browser){
  const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage();
  await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});await p.click('.hero-cta');
  await p.fill('#goal-title','T'.repeat(160));await p.fill('#goal-definition','D'.repeat(2000));await p.locator('[data-draft-id]').fill('A'.repeat(500));
  for(let i=1;i<30;i++){await p.locator('[data-draft="add"]').focus();await p.keyboard.press('Enter');await p.locator('[data-draft-id]').nth(i).fill(`Action ${i+1}`);}
  assert.equal(await p.locator('[data-draft="add"]').isDisabled(),true);assert.equal(await p.locator('[data-draft-id]').count(),30);
  const firstId=await p.locator('[data-draft-id]').first().getAttribute('data-draft-id');
  await p.locator('[data-draft="down"]').first().focus();await p.keyboard.press('Space');
  assert.equal(await p.locator('[data-draft-id]').nth(1).getAttribute('data-draft-id'),firstId);
  await p.evaluate(()=>{const original=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){const r=original.apply(this,args);if(window.abortTrailWrite){window.abortTrailWrite=false;this.transaction.abort();}return r;};window.abortTrailWrite=true;});
  await p.click('#goal-form [type="submit"]');await p.getByRole('alert').waitFor();
  assert.equal((await snapshot(p)).openGoalId,null);assert.equal(await p.locator('#goal-title').inputValue(),'T'.repeat(160));assert.equal(await p.locator('[data-draft-id]').count(),30);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.click('[data-work="retry"]');await p.locator('.workspace').waitFor();let w=await snapshot(p);
  assert.equal(w.goals[w.openGoalId].actionOrder.length,30);assert.equal(Object.keys(w.operations).length,1);
  await p.screenshot({path:`${output}/edge-phone-long-today.png`,fullPage:true});
  const receipts=await p.evaluate(async()=>{
    const {LocalStore,openDatabase}=await import('/storage.js');const store=new LocalStore(()=>{});store.db=await openDatabase();const w=await store.read();store.writer=true;store.token=w.ownerToken;
    const cmd={id:crypto.randomUUID(),type:'notes',instruction:'Transaction receipt',context:''};
    const one=await store.commit(w,cmd),two=await store.commit(w,cmd);const results=[one.applied,two.applied,one.workspace.revision===two.workspace.revision];
    for(const [source,next,token] of [[w,{...cmd,id:crypto.randomUUID()},store.token],[one.workspace,{...cmd,context:'changed'},store.token],[one.workspace,{...cmd,id:crypto.randomUUID()},'stale-owner']]){
      store.token=token;try{await store.commit(source,next);results.push(false);}catch{results.push(true);}
    }
    store.db.close();return results;
  });assert.deepEqual(receipts,[true,false,true,true,true,true]);
  await p.reload();await p.locator('.workspace').waitFor();
  // Deterministic lifecycle race: delay publication of a committed Start across a synthetic BFCache return.
  await p.evaluate(()=>{
    const descriptor=Object.getOwnPropertyDescriptor(IDBTransaction.prototype,'oncomplete');
    Object.defineProperty(IDBTransaction.prototype,'oncomplete',{...descriptor,set(handler){const tx=this;descriptor.set.call(tx,function(event){if(window.delayTrailCommit&&tx.mode==='readwrite'){window.delayTrailCommit=false;setTimeout(()=>handler.call(tx,event),1000);}else handler.call(tx,event);});}});
    window.delayTrailCommit=true;
  });
  await p.click('[data-work="start"]');
  await p.evaluate(()=>{dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
  await p.locator('[data-work="resume"]').first().waitFor();w=await snapshot(p);assert.equal(w.sessions[w.activeSessionId].status,'interrupted');assert.equal(w.sessions[w.activeSessionId].creditedMs,0);
  await p.click('[data-work="resume"]');await p.locator('.focus-clock').waitFor();
  await p.goto('about:blank');await p.goBack();await p.locator('[data-work="resume"]').first().waitFor();
  w=await snapshot(p);assert.equal(w.sessions[w.activeSessionId].status,'interrupted');
  await context.close();
  console.log('Edge checks passed: 30-action/input bounds, keyboard reorder, aborted create/draft retry, real transaction replay/stale owner guards, synthetic lifecycle race and actual away/back recovery. Native BFCache eligibility and physical sleep are not established.');
}
