import { emptyWorkspace, validate, transition } from './state.js';
export const DATABASE='trail-local-work';
export const LOCK='trail-local-work-writer';
export function openDatabase(){
  return new Promise((resolve,reject)=>{
    if(!globalThis.indexedDB){reject(new Error('IndexedDB is unavailable. Real work cannot be saved.'));return;}
    const request=indexedDB.open(DATABASE,1);
    let blocked=false;
    request.onupgradeneeded=()=>request.result.createObjectStore('workspace');
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>{blocked=true;reject(new Error('Database upgrade blocked. Close other Trail tabs and retry.'));};
    request.onsuccess=()=>{if(blocked)request.result.close();else resolve(request.result);};
  });
}
export class LocalStore {
  constructor(onChange){this.onChange=onChange;this.db=null;this.writer=false;this.token=crypto.randomUUID();this.raw=null;this.release=null;this.channel=null;}
  async open(){
    if(!navigator.locks)throw new Error('Web Locks unavailable. Real timing is disabled; use a supported browser.');
    this.db=await openDatabase();
    this.db.onversionchange=()=>{this.writer=false;this.db.close();this.onChange(new Error('Storage version changed. Reload Trail.'));};
    if(globalThis.BroadcastChannel){this.channel=new BroadcastChannel(LOCK);this.channel.onmessage=()=>this.onChange();}
    return this.read();
  }
  read(){return new Promise((resolve,reject)=>{
    const tx=this.db.transaction('workspace','readonly'),request=tx.objectStore('workspace').get('current');
    let raw;request.onsuccess=()=>{raw=request.result;};
    tx.oncomplete=()=>{this.raw=raw??null;try{resolve(validate(raw??emptyWorkspace()));}catch(error){reject(error);}};
    tx.onerror=tx.onabort=()=>reject(tx.error||new Error('Storage read failed.'));
  });}
  async acquire(){
    if(this.writer)return true;
    return new Promise((resolve,reject)=>{
      navigator.locks.request(LOCK,{mode:'exclusive',ifAvailable:true},async lock=>{
        if(!lock){resolve(false);return;}
        this.writer=true;
        try{
          await this.claim();resolve(true);
          await new Promise(done=>{this.release=done;});
        }catch(error){this.writer=false;reject(error);}
        finally{this.writer=false;this.release=null;}
      }).catch(reject);
    });
  }
  claim(){return this.write(null,null,true);}
  commit(snapshot,command){return this.write(snapshot,command,false);}
  write(snapshot,command,claim){return new Promise((resolve,reject)=>{
    if(!this.writer){reject(new Error('Open in another tab. Close the writer tab, then retry ownership.'));return;}
    const tx=this.db.transaction('workspace','readwrite',{durability:'strict'}),store=tx.objectStore('workspace'),request=store.get('current');
    let result,error,applied=true;
    request.onsuccess=()=>{
      try{
        const current=request.result??emptyWorkspace();validate(current);
        if(claim){
          result=structuredClone(current);result.ownerToken=this.token;
          const session=result.sessions[result.activeSessionId];
          if(session?.status==='running'){session.status='interrupted';session.ownerToken=null;session.interruptionReason='Page reopened. Unverified away time was not recorded. Resume explicitly.';}
          result.revision++;result.updatedAt=Date.now();
          if(result.undo)result.undo.expectedRevision=result.revision;
          validate(result);
        }else{
          if(current.ownerToken!==this.token)throw new Error('Writer ownership changed. Reload before continuing.');
          // A repeated operation can reconcile an uncertain commit even if revision advanced.
          if(current.revision!==snapshot.revision&&!current.operations[command.id])throw new Error('Saved work changed. Reload before continuing.');
          applied=!current.operations[command.id];result=transition(current,command,Date.now());
        }
        store.put(result,'current');
      }catch(e){error=e;tx.abort();}
    };
    tx.oncomplete=()=>{
      this.raw=result;
      // Notification is only a hint; a failed channel cannot hide a committed save.
      try{this.channel?.postMessage({revision:result.revision});}catch{}
      resolve({workspace:result,applied});
    };
    tx.onerror=tx.onabort=()=>reject(error||tx.error||new Error('Write aborted. Nothing was saved. Retry without closing this page.'));
  });}
}
