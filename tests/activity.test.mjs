import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveActivity,dayKey,shiftDay,exampleRecords} from '../demo/activity.js';
import {emptyWorkspace,transition} from '../demo/state.js';
const at=text=>Date.parse(text),now=at('2026-03-09T16:00:00Z');
function fixture(dates){return {goals:{g:{id:'g',title:'Goal <draft>'},h:{id:'h',title:'Other 日本語'}},actions:Object.fromEntries(dates.map((date,i)=>[`a${i}`,{id:`a${i}`,goalId:i%2?'h':'g',title:`Action ${i}`,status:'completed',completedAt:typeof date==='number'?date:at(date)}]))};}
const model=w=>deriveActivity(w,{now,timeZone:'America/New_York'});
test('fictional year is deterministic, within real field/action limits, nonfuture and covers every month/tier through rollover',()=>{
  for(const time of ['2026-10-25T16:00Z','2027-01-01T00:00Z','2028-03-01T00:00Z'])for(const timeZone of ['UTC','America/New_York','Asia/Tokyo']){
    const options={now:at(time),timeZone},w=exampleRecords(options),m=deriveActivity(w,options);assert.deepEqual(exampleRecords(options),w);assert.equal(Object.keys(w.goals).length,8);assert.deepEqual(new Set(m.days.map(d=>d.level)),new Set([0,1,2,3,4]));assert.ok(m.months.every(month=>month.days.some(d=>d.count>0)));assert.ok(Object.values(w.actions).every(a=>a.completedAt<=options.now&&a.title.length<=500));assert.ok(Object.values(w.goals).every(g=>g.actionOrder.length>=1&&g.actionOrder.length<=30&&['low','normal','important'].includes(g.priority)));assert.equal(m.total,Object.keys(w.actions).length);assert.deepEqual(w.intervals,{});
  }
});
test('empty calendar is twelve named months with unavailable future dates and no badge',()=>{
  const m=model(fixture([]));assert.equal(m.days.length,365);assert.equal(m.start,'2025-04-01');assert.equal(m.today,'2026-03-09');assert.equal(m.end,'2026-03-31');assert.equal(m.days.filter(d=>d.future).length,22);assert.equal(m.total,0);assert.equal(m.current,0);assert.equal(m.best,0);assert.equal(m.badge,null);assert.equal(m.nextBadge.count,1);
});
test('counts, goals, five intensity levels and badge boundaries use actions once, not events',()=>{
  for(const n of [0,1,2,3,4,5,6,7,9,10,24,25,26]){
    const w=fixture(Array(n).fill('2026-03-09T12:00:00Z'));w.events={fake:{type:'action-completed'}};const m=model(w),day=m.days.find(d=>d.today);
    assert.equal(m.total,n);assert.equal(m.periodTotal,n);assert.equal(day.count,n);assert.equal(day.level,n>=7?4:n>=4?3:n>=2?2:n?1:0);assert.equal(m.badge?.count??0,[25,10,5,1].find(t=>n>=t)||0);assert.equal(m.nextBadge?.count??null,[1,5,10,25].find(t=>n<t)||null);if(n>1)assert.equal(day.items[1].goalTitle,'Other 日本語');
  }
});
test('today/yesterday gaps and best streak across all retained history, not just visible weeks',()=>{
  assert.equal(model(fixture(['2026-03-09T12:00Z','2026-03-08T12:00Z'])).current,2);
  assert.equal(model(fixture(['2026-03-08T12:00Z','2026-03-07T12:00Z'])).current,2);
  assert.equal(model(fixture(['2026-03-07T12:00Z'])).current,0);
  const old=Array.from({length:10},(_,i)=>`${shiftDay('2025-01-01',i)}T12:00Z`),m=model(fixture([...old,'2026-03-09T12:00Z']));assert.equal(m.best,10);assert.equal(m.current,1);assert.equal(m.total,11);assert.equal(m.periodTotal,1);
});
test('local day bucketing handles midnight, real DST offsets, timezone regrouping and future/invalid dates',()=>{
  assert.equal(dayKey(at('2026-03-08T04:59Z'),'America/New_York'),'2026-03-07');assert.equal(dayKey(at('2026-03-08T05:00Z'),'America/New_York'),'2026-03-08');assert.equal(dayKey(at('2026-03-09T04:00Z'),'America/New_York'),'2026-03-09');
  assert.equal(dayKey(at('2026-11-01T05:30Z'),'America/New_York'),'2026-11-01');assert.equal(dayKey(at('2026-11-01T06:30Z'),'America/New_York'),'2026-11-01');
  const w=fixture(['2026-03-08T04:30Z',now+1,null,NaN,-1]);assert.equal(model(w).total,1);const utc=deriveActivity(w,{now,timeZone:'UTC'});assert.equal(utc.days.find(d=>d.key==='2026-03-08').count,1);assert.equal(model(w).days.find(d=>d.key==='2026-03-07').count,1);
});
test('calendar arithmetic crosses leap/year/Sunday/Monday and DST without duplicate or omitted days',()=>{
  assert.equal(shiftDay('2024-02-28',1),'2024-02-29');assert.equal(shiftDay('2024-02-29',1),'2024-03-01');assert.equal(shiftDay('2026-01-01',-1),'2025-12-31');
  for(const time of ['2026-01-01T12:00Z','2026-03-08T16:00Z','2026-03-09T16:00Z','2026-11-01T17:00Z']){const m=deriveActivity(fixture([]),{now:at(time),timeZone:'America/New_York'});assert.equal(new Set(m.days.map(d=>d.key)).size,365);assert.equal(m.months.length,12);assert.equal(m.days.at(-1).key,shiftDay(m.start,364));}
});
test('twelve calendar months cross years, include leap dates once and pad Monday-first weeks decoratively',()=>{
  for(const [time,start,end,length] of [['2026-10-25T12:00Z','2025-11-01','2026-10-31',365],['2024-02-29T12:00Z','2023-03-01','2024-02-29',366],['2025-01-01T12:00Z','2024-02-01','2025-01-31',366],['2025-02-01T12:00Z','2024-03-01','2025-02-28',365],['2026-12-31T12:00Z','2026-01-01','2026-12-31',365],['2027-01-01T12:00Z','2026-02-01','2027-01-31',365]]){
    const m=deriveActivity(fixture([]),{now:at(time),timeZone:'UTC'});assert.equal(m.start,start);assert.equal(m.end,end);assert.equal(m.days.length,length);assert.equal(new Set(m.days.map(d=>d.key)).size,length);assert.equal(m.months.length,12);
    for(const month of m.months){assert.ok(month.label.includes(month.key.slice(0,4)));assert.equal(month.slots.length%7,0);assert.deepEqual(month.slots.filter(Boolean),month.days);assert.equal(month.slots.findIndex(Boolean),(new Date(`${month.start}T12:00Z`).getUTCDay()+6)%7);month.slots.forEach((d,i)=>{if(d)assert.equal((new Date(`${d.key}T12:00Z`).getUTCDay()+6)%7,i%7);});}
    m.days.forEach((d,i)=>{assert.equal(d.key,shiftDay(start,i));assert.equal(d.future,d.key>m.today);});
  }
  const m=deriveActivity(fixture([]),{now:at('2026-10-25T12:00Z'),timeZone:'UTC'});assert.deepEqual(m.months.map(m=>m.key),['2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10']);
});
test('local midnight month rollover shifts only visible months and period totals, not all-time history',()=>{
  const w=fixture(['2025-03-01T12:00Z','2026-03-31T12:00Z']),before=deriveActivity(w,{now:at('2026-04-01T03:59Z'),timeZone:'America/New_York'}),after=deriveActivity(w,{now:at('2026-04-01T04:01Z'),timeZone:'America/New_York'});
  assert.equal(before.today,'2026-03-31');assert.equal(after.today,'2026-04-01');assert.equal(before.start,'2025-04-01');assert.equal(after.start,'2025-05-01');assert.equal(before.total,2);assert.equal(after.total,2);assert.equal(after.periodTotal,1);assert.equal(after.current,1);
  assert.equal(deriveActivity(w,{now:at('2026-04-01T03:59Z'),timeZone:'Asia/Tokyo'}).today,'2026-04-01');
});
test('actual canonical completion/Undo/recompletion/reopen/refinish derives correction-aware totals',()=>{
  let w=emptyWorkspace();w.ownerToken='owner';let seq=0;const run=(type,fields={},date=now)=>{w=transition(w,{id:`op-${++seq}`,type,...fields},date);};
  run('save-goal',{goalId:null,title:'Goal',definition:'Done',actions:[{id:'a',title:'A'}]});const id=w.openGoalId;run('complete-action',{actionId:'a'},now-86400000);assert.equal(model(w).total,1);run('undo',{eventId:w.undo.eventId,expectedRevision:w.revision});assert.equal(model(w).total,0);run('complete-action',{actionId:'a'});assert.equal(model(w).days.find(d=>d.today).count,1);run('finish-goal',{goalId:id});run('reopen-goal',{goalId:id});assert.equal(model(w).total,1);run('finish-goal',{goalId:id});assert.equal(model(w).total,1);run('reopen-goal',{goalId:id});run('reopen-action',{actionId:'a'});assert.equal(model(w).total,0);
});
