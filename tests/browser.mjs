// Optional local integration harness. Uses existing Playwright; never installed by npm test.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const url=process.env.TRAIL_URL||'http://127.0.0.1:3000/';
const output=process.env.TRAIL_EVIDENCE||'/private/var/folders/xf/gtc75bps4tx93_x6dlwfm01r0000gn/T/opencode/trail-evidence';
await mkdir(output,{recursive:true});
const browser=await chromium.launch();
try {
  if(process.env.TRAIL_GATE==='correction')await runCorrections(browser);
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
    await page.selectOption('#scenario','focus');
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
  }
} finally {await browser.close();}

async function snapshot(page){return page.evaluate(async()=>{
  const {openDatabase}=await import('/storage.js');const db=await openDatabase();
  return new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readonly'),r=tx.objectStore('workspace').get('current');let value;r.onsuccess=()=>value=r.result;tx.oncomplete=()=>{db.close();resolve(value);};tx.onerror=()=>reject(tx.error);});
});}
async function runCorrections(browser){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage(),errors=[];
  p.on('pageerror',err=>errors.push(err.message));
  try {
    await p.goto(url);await p.locator('#storage-status').waitFor({state:'hidden'});
    async function inspectHome(name,nextMove,cta,destination){
      const before=await snapshot(p);
      for(const theme of ['light','dark'])for(const width of [1440,390]){
        await p.setViewportSize({width,height:width===390?844:1000});await p.click(`[data-theme="${theme}"]`);await p.click('.brand');
        assert.equal(await p.locator('.hero-saved p').textContent(),nextMove);
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
    await inspectHome('fresh','Choose a goal and the first action you want to take.','Create a goal','#goal-form');
    // Fictional landing stays explicitly separate and retains its own sample content.
    const fresh=await snapshot(p);await p.click('#example-mode');await p.selectOption('#scenario','landing');
    assert.match(await p.locator('.hero-saved p').textContent(),/comparison table/);
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
  await second.selectOption('#scenario','focus');await second.waitForTimeout(300);await second.click('#real-mode');await second.locator('.workspace').waitFor();
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
  assert.equal(await p.locator(`[data-action-id="${a}"].current`).count(),1);assert.equal(await p.locator(`[data-action-id="${b}"].earned`).count(),1);
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
