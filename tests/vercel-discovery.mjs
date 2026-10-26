// Opt-in platform regression, not an application dependency or deployment command.
// node tests/vercel-discovery.mjs <temporary tooling directory> <temporary evidence directory>
// Tooling must contain vercel@65.1.0 (with its pinned builders); never use a linked project.
import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,writeFile,copyFile,readdir} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import {createRequire} from 'node:module';
import {dirname,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const repo=fileURLToPath(new URL('../',import.meta.url)),run=promisify(execFile);
assert.equal(process.argv.length,4,'Supply external temporary tooling and evidence directories');
const tooling=resolve(process.argv[2]),evidence=resolve(process.argv[3]);
for(const path of [tooling,evidence])assert.ok(relative(repo,path).startsWith('..'),'Keep tooling/artifacts outside the repository');
await mkdir(evidence,{recursive:true});
const scratch=await mkdtemp(join(evidence,'run-')),home=join(scratch,'home');await mkdir(home);
// Before loading platform tooling, discard inherited credentials/configuration.
const cleanEnv={PATH:process.env.PATH,HOME:home,VERCEL_TELEMETRY_DISABLED:'1',VERCEL_NODE_FILTER_ENTRYPOINTS:'1'};
for(const key of Object.keys(process.env))delete process.env[key];Object.assign(process.env,cleanEnv);
const require=createRequire(join(tooling,'package.json'));
assert.equal(require('vercel/package.json').version,'65.1.0');
assert.equal(require('@vercel/build-utils/package.json').version,'15.0.0');
assert.equal(require('@vercel/node/package.json').version,'27.0.0');
// These are the actual unmodified CLI65.1.0 bundled utilities, not reimplementations.
const chunks=join(tooling,'node_modules/vercel/dist/chunks');
const {staticFiles}=(await import(join(chunks,'chunk-QWE7OFE7.js'))).require_get_files();
const {detectBuilders}=(await import(join(chunks,'chunk-CVDK3IYT.js'))).require_dist2();
const utils=require('@vercel/build-utils'),nodeBuilder=require('@vercel/node');
const output={debug(){},time:async(_,promise)=>promise};
const ignore=await readFile(join(repo,'.vercelignore'),'utf8');
const assets=['index.html','styles.css','proof.js','work.js','state.js','storage.js','timing.js','activity.js','planner.js'];
const entries=['api/ai-status.mjs','api/plan.mjs'];
const inputs=['.vercelignore','package.json','vercel.json',...entries,'scripts/build.mjs','scripts/ai.mjs','scripts/vercel-ai.mjs',...assets.map(f=>'demo/'+f)].sort();
const privateNames=['.env.local','private.zip','api/.env.local','api/private.zip','api/extra.mjs','scripts/private.mjs','demo/private.txt','tests/private.mjs','devpost/private.md'];
const sentinel='SYNTHETIC_PRIVATE_DISCOVERY_SENTINEL';
const fixture=join(scratch,'filter-fixture');await mkdir(fixture);
async function copy(source,destination){await mkdir(dirname(destination),{recursive:true});await copyFile(source,destination);}
for(const file of inputs)await copy(join(repo,file),join(fixture,file));
for(const file of privateNames){await mkdir(dirname(join(fixture,file)),{recursive:true});await writeFile(join(fixture,file),sentinel);}
const list=async()=> (await staticFiles(fixture,{},output)).map(f=>relative(fixture,f)).sort();
const config=JSON.parse(await readFile(join(repo,'vercel.json'))),pkg=JSON.parse(await readFile(join(repo,'package.json')));
const detect=files=>detectBuilders([...files],pkg,{...config,projectSettings:config,workPath:fixture});
const badIgnore=ignore.replace(/^!\/(api|scripts|demo)$/gm,'!/$1/');
assert.notEqual(badIgnore,ignore,'Must exercise the reported trailing-slash failure');
await writeFile(join(fixture,'.vercelignore'),badIgnore);
const baselineFiles=await list(),baseline=await detect(baselineFiles);
assert.deepEqual(baselineFiles,['.vercelignore','package.json','vercel.json']);
assert.equal(baseline.errors[0].code,'unused_function');
delete process.env.VERCEL_NODE_FILTER_ENTRYPOINTS;
assert.equal((await detect(baselineFiles)).errors[0].code,'unused_function');
process.env.VERCEL_NODE_FILTER_ENTRYPOINTS='1';
await writeFile(join(fixture,'.vercelignore'),ignore);
const filtered=await list();assert.deepEqual(filtered,inputs);
assert.ok(privateNames.every(f=>!filtered.includes(f)));
const discovered=await detect(filtered);assert.equal(discovered.errors,null);
assert.deepEqual(discovered.builders.filter(b=>b.use==='@vercel/node').map(b=>b.src).sort(),entries);
const detectorControls={};
for(const entry of entries){
 const path=join(fixture,entry),source=await readFile(path,'utf8');
 assert.equal(await utils.isNodeEntrypoint({fsPath:path}),true);
 await writeFile(path,"import { createVercelApi } from '../scripts/vercel-ai.mjs';\nconst handle=createVercelApi();\nexport default {fetch(request){return handle(request);}};\n");
 assert.equal(await utils.isNodeEntrypoint({fsPath:path}),true);
 await writeFile(path,'export const helper = 1;\n');assert.equal(await utils.isNodeEntrypoint({fsPath:path}),false);
 await writeFile(path,source);detectorControls[entry]={factory:true,explicitMethod:true,helperOnly:false};
}
const filteredAgain=await detect(filtered);assert.equal(filteredAgain.errors,null);
const upload=join(scratch,'upload');await mkdir(upload);
for(const file of filtered)await copy(join(fixture,file),join(upload,file));
// Build only actual filtered inputs, with the unchanged application configuration.
const files=Object.fromEntries(filtered.map(file=>[file,new utils.FileFsRef({fsPath:join(upload,file)})]));
const packages=[];
for(const builder of filteredAgain.builders.filter(b=>b.use==='@vercel/node')){
 const built=await nodeBuilder.build({files,entrypoint:builder.src,workPath:upload,config:{...builder.config,projectSettings:{...config,nodeVersion:'24.x'}},meta:{skipDownload:true}});
 const lambda=built.output,names=Object.keys(lambda.files).sort();
 assert.equal(lambda.type,'Lambda');assert.equal(lambda.runtime,'nodejs24.x');assert.equal(lambda.handler,builder.src);
 assert.deepEqual(names,[builder.src,'scripts/vercel-ai.mjs','scripts/ai.mjs','demo/planner.js','package.json'].sort());
 const directory=join(scratch,'packages',builder.src.replace('.mjs','.func'));await mkdir(directory,{recursive:true});
 for(const [name,file]of Object.entries(lambda.files)){
  const target=join(directory,name);await mkdir(dirname(target),{recursive:true});await pipeline(await file.toStreamAsync(),createWriteStream(target));
  assert.ok(!(await readFile(target,'utf8')).includes(sentinel));
 }
 packages.push({entry:builder.src,runtime:lambda.runtime,handler:lambda.handler,files:names,directory});
}
// Real Vercel Node runtime, not merely importing our source in Node. Provider mock
// exists only in the temporary test bootstrap, never in either function artifact.
const mock=join(scratch,'mock-provider.mjs');
const ready=join(scratch,'mock-ready-'),calls=join(scratch,'mock-calls');
await writeFile(mock,`import {writeFileSync,appendFileSync} from 'node:fs';const original=globalThis.fetch;globalThis.fetch=async(url,init)=>{if(String(url).startsWith('https://generativelanguage.googleapis.com/')){appendFileSync(${JSON.stringify(calls)},'mocked\\n');return new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({title:'Synthetic goal',definition:'A checked outline',actions:[{title:'Draft outline',estimatedMinutes:null}],assumptions:[],conflicts:[]})}]}}]}));}if(new URL(url).hostname==='127.0.0.1')return original(url,init);throw Error('External request blocked by test');};writeFileSync(${JSON.stringify(ready)}+process.pid,'ready');`);
const origin='https://trail-discovery-test.vercel.app';
const runtime=[];
for(const item of packages){
 process.env.NODE_OPTIONS='--import '+mock;
 const server=await nodeBuilder.startDevServer({files:{},entrypoint:item.entry,workPath:item.directory,config:{},meta:{env:{...cleanEnv,NODE_OPTIONS:'--import '+mock,TRAIL_PUBLIC_ORIGIN:origin,GEMINI_API_KEY:'SYNTHETIC_DISCOVERY_KEY',GEMINI_MODEL:'synthetic-model'}}});
 delete process.env.NODE_OPTIONS;
 try{
  assert.equal(await readFile(ready+server.pid,'utf8'),'ready','Never POST until the child mock/egress guard is confirmed loaded');
  const path=item.entry.replace('.mjs',''),planning=path==='/api/plan'||path==='api/plan';
  // The direct dev-runtime socket normally sits behind the CLI proxy, which
  // supplies x-forwarded-host; its runtime copies that value into Host.
  const response=await fetch(`http://127.0.0.1:${server.port}/${path}`,{method:planning?'POST':'GET',headers:{host:new URL(origin).host,'x-forwarded-host':new URL(origin).host,origin,'content-type':'application/json'},...(planning?{body:JSON.stringify({description:'Synthetic outline',deadlineText:'',availableMinutes:null})}:{})});
  assert.equal(response.status,200);const body=await response.json();
  if(planning)assert.equal(body.proposal.title,'Synthetic goal');else assert.deepEqual(body,{enabled:true});
  runtime.push({entry:item.entry,status:response.status});
 }finally{await server.shutdown();}
}
assert.equal(await readFile(calls,'utf8'),'mocked\n');
await run(process.execPath,['scripts/build.mjs'],{cwd:upload,env:{...cleanEnv,GEMINI_API_KEY:sentinel}});
assert.deepEqual((await readdir(join(upload,'dist'))).sort(),[...assets].sort());
for(const file of assets){const data=await readFile(join(upload,'dist',file));assert.deepEqual(data,await readFile(join(repo,'demo',file)));assert.ok(!data.toString().includes(sentinel));}
const report={versions:{cli:'65.1.0',buildUtils:'15.0.0',nodeBuilder:'27.0.0',nodeRuntime:process.version},scratch,baseline:{files:baselineFiles,errors:baseline.errors},filtered,privateExcluded:privateNames,detectorControls,discovered:filteredAgain,packages,runtime,staticAssets:assets,successfulRunLiveGeminiCalls:0,linked:false,deployed:false};
await writeFile(join(scratch,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log(`PASS: exact baseline failure; 17 filtered inputs; both functions discovered, Vercel-built and runtime-tested with mocks; nine unchanged static assets. Evidence: ${scratch}/report.json`);
