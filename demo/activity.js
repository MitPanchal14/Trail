// Derived calendar only. No storage, clock accounting or reward mutations.
export function dayKey(timestamp,timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(timestamp);
  const value=type=>parts.find(p=>p.type===type).value;return `${value('year')}-${value('month')}-${value('day')}`;
}
const calendarDate=key=>{const [y,m,d]=key.split('-').map(Number);return new Date(Date.UTC(y,m-1,d,12));};
export function shiftDay(key,amount){
  const date=calendarDate(key);date.setUTCDate(date.getUTCDate()+amount);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`;
}
export const dayLabel=key=>new Intl.DateTimeFormat(undefined,{timeZone:'UTC',weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(calendarDate(key));
// Fictional presentation fixtures only: never loaded into LocalStore.
export function exampleRecords({now=Date.now(),timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone}={}){
  const calendar=deriveActivity({actions:{},goals:{}},{now,timeZone});
  const w={goals:{},actions:{},contexts:{},sessions:{},intervals:{},openGoalId:null};
  const titles=['Prepare the workshop update','Publish the neighbourhood newsletter','Review community research','Learn accessible web design','Plan a kitchen garden','Organise family photographs','Write a short story','Prepare a learning journal'];
  const tasks=['Compare the two room options','Edit the opening paragraph','Summarise the interview notes','Check keyboard navigation','Choose the planting schedule','Label the selected photographs','Revise the closing scene','Write a clear reflection'];
  titles.forEach((title,i)=>{const id=`sample-goal-${i}`;w.goals[id]={id,title,definitionOfFinished:`${title}: a clear, reviewed version is ready to use.`,priority:['important','normal','low'][i%3],status:'completed',actionOrder:[],createdAt:0,updatedAt:0,completedAt:0};});
  calendar.months.forEach((month,i)=>{
    const day=month.days[Math.min(14,month.days.filter(d=>!d.future).length-1)],timestamp=Math.min(now,Date.parse(`${day.key}T12:00:00Z`));
    for(let j=0;j<[1,2,4,7][i%4];j++){
      const index=(i+j)%titles.length,g=w.goals[`sample-goal-${index}`],id=`sample-action-${i}-${j}`;
      w.actions[id]={id,goalId:g.id,title:`${tasks[index]} — ${month.label}`,status:'completed',completedAt:timestamp,createdAt:timestamp,updatedAt:timestamp};g.actionOrder.push(id);g.completedAt=Math.max(g.completedAt,timestamp);g.updatedAt=g.completedAt;
      w.contexts[id]={id:`sample-context-${i}-${j}`,actionId:id,nextInstruction:'Read the agreed draft and check the next decision.',context:'Fictional work example. The draft and decision were reviewed in this scenario; no external activity was observed.',resourceUrl:'https://example.com/workshop#capacity',updatedAt:timestamp};
    }
  });return w;
}
export function deriveActivity(workspace,{now=Date.now(),timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone}={}){
  const today=dayKey(now,timeZone),byDay=new Map();let total=0;
  const formatter=new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
  for(const action of Object.values(workspace.actions||{})){
    const goal=workspace.goals?.[action.goalId],at=action.completedAt;
    if(action.status!=='completed'||!goal||!Number.isSafeInteger(at)||at<0||at>now||!Number.isFinite(new Date(at).getTime()))continue;
    const parts=formatter.formatToParts(at),value=type=>parts.find(p=>p.type===type).value,key=`${value('year')}-${value('month')}-${value('day')}`;
    if(!byDay.has(key))byDay.set(key,[]);
    byDay.get(key).push({actionId:action.id,goalId:action.goalId,title:action.title,goalTitle:goal.title});total++;
  }
  const keys=[...byDay.keys()].sort();let best=0,streak=0,previous=null;
  for(const key of keys){streak=previous&&shiftDay(previous,1)===key?streak+1:1;best=Math.max(best,streak);previous=key;}
  let current=0,cursor=byDay.has(today)?today:shiftDay(today,-1);
  while(byDay.has(cursor)){current++;cursor=shiftDay(cursor,-1);}
  const currentMonth=calendarDate(today);currentMonth.setUTCDate(1);
  const months=Array.from({length:12},(_,i)=>{
    const first=new Date(currentMonth);first.setUTCMonth(first.getUTCMonth()-11+i);
    const start=dayKey(first,'UTC'),next=new Date(first);next.setUTCMonth(next.getUTCMonth()+1);
    const end=shiftDay(dayKey(next,'UTC'),-1),length=calendarDate(end).getUTCDate();
    const days=Array.from({length},(_,day)=>{
      const key=shiftDay(start,day),items=byDay.get(key)||[],count=items.length;
      return {key,label:dayLabel(key),items,count,level:count>=7?4:count>=4?3:count>=2?2:count?1:0,today:key===today,future:key>today};
    });
    const leading=(first.getUTCDay()+6)%7,slots=Array(Math.ceil((leading+length)/7)*7).fill(null);
    days.forEach((day,index)=>slots[leading+index]=day);
    return {key:start.slice(0,7),label:new Intl.DateTimeFormat(undefined,{timeZone:'UTC',month:'short',year:'numeric'}).format(first),start,end,days,slots};
  });
  const days=months.flatMap(m=>m.days),start=months[0].start;
  const tiers=[{count:1,label:'First step'},{count:5,label:'Five steps'},{count:10,label:'Ten steps'},{count:25,label:'Twenty-five steps'}];
  return {today,timeZone,start,end:days.at(-1).key,months,days,total,periodTotal:days.reduce((n,d)=>n+d.count,0),current,best,badge:tiers.filter(t=>total>=t.count).at(-1)||null,nextBadge:tiers.find(t=>total<t.count)||null};
}
