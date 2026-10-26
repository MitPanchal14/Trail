// Server-only Web Request adapter. Keep shared implementation outside api/.
import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import { createApi } from './ai.mjs';
import { planErrors } from '../demo/planner.js';

export function trustedOrigin(value){
  if(typeof value!=='string')return null;
  try{
    const url=new URL(value);
    return url.protocol==='https:'&&value===url.origin&&!url.port&&!url.hostname.endsWith('.localhost')&&/^(?=.{1,253}$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(url.hostname)&&!/^\d+(?:\.\d+){3}$/.test(url.hostname)?value:null;
  }catch{return null;}
}
const json=(status,value)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const failure=(status,code)=>json(status,{code,error:planErrors[code]});

export function createVercelApi({origin=process.env.TRAIL_PUBLIC_ORIGIN,...options}={}){
  const expected=trustedOrigin(origin),api=expected?createApi({...options,origin:expected}):null;
  return async function hosted(request){
    const path=new URL(request.url).pathname;
    if(!['/api/plan','/api/ai-status'].includes(path))return new Response('Not found',{status:404});
    if(!api){
      if(path==='/api/ai-status'&&request.method==='GET')return json(200,{enabled:false});
      return failure(request.method===(path==='/api/plan'?'POST':'GET')?503:405,request.method===(path==='/api/plan'?'POST':'GET')?'unconfigured':'invalid_input');
    }
    // Never reconstruct a parsed body. Existing API counts the original bytes.
    if(request.bodyUsed||request.body?.locked)return failure(400,'invalid_input');
    const req=request.body?Readable.fromWeb(request.body):Readable.from([]);
    Object.assign(req,{url:path,method:request.method,headers:Object.fromEntries(request.headers)});
    // No trusted socket IP is exposed by this interface; retain the conservative
    // shared warm-instance fallback bucket, never trust forwarded client headers.
    const res=new EventEmitter();res.writableEnded=false;res.destroyed=false;
    let response,status=502,headers={};
    res.writeHead=(code,fields)=>{status=code;headers=fields;};
    res.end=body=>{res.writableEnded=true;response=new Response(body,{status,headers});};
    const disconnect=()=>{res.destroyed=true;res.emit('close');req.destroy();};
    request.signal.addEventListener('abort',disconnect,{once:true});
    try{
      if(request.signal.aborted)disconnect();else await api(req,res);
      return response||(request.signal.aborted?new Response(null,{status:499}):failure(502,'upstream_unavailable'));
    }catch{return failure(502,'upstream_unavailable');}
    finally{request.signal.removeEventListener('abort',disconnect);req.destroy();}
  };
}
