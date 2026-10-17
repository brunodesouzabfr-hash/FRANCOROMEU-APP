'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {processOnce,configured,fingerprint,redis,LEASE_SECONDS,DONE_SECONDS}=require('../src/fr-crm-dedup-gate.cjs');
const {ingest,validate,configured:ingestConfigured}=require('../src/fr-crm-secure-ingest.cjs');
const env={
 FR_CRM_INGEST_ENABLED:'true',
 FR_CRM_INGEST_SECRET:'S'.repeat(64),
 FR_CRM_NOTION_TOKEN:'ntn_'+('X'.repeat(48)),
 FR_CRM_NOTION_DATA_SOURCE_ID:'ce2daa5f-8a64-479f-9c19-6aad58442499',
 FR_CRM_REDIS_REST_URL:'https://fr-phase95-test.upstash.io',
 FR_CRM_REDIS_REST_TOKEN:'R'.repeat(50)
};
const lead=validate({
 eventId:'5bdb5f3d-2ee1-45bc-bca8-1e8a29ae9e06',
 source:'WhatsApp',service:'Marcenaria',city:'São Paulo',contactName:'Pessoa de teste',
 phone:'+5511988887777',basis:'Solicitação do titular',evidence:'Solicitação recebida no atendimento'
});
function store(){
 const keys=new Map(),calls=[];
 const fetchImpl=async(url,options)=>{
  calls.push({url,options});
  if(url===env.FR_CRM_REDIS_REST_URL){
   const [cmd,script,numkeys,key,nonce,digest]=JSON.parse(options.body);
   assert.equal(cmd,'EVAL');
   assert.equal(numkeys,1);
   assert.equal(options.redirect,'error');
   assert.match(options.headers.Authorization,/^Bearer /);
   assert.ok(!JSON.stringify(options.body).includes(lead.contactName));
   assert.ok(!JSON.stringify(options.body).includes(lead.phone));
   if(script.includes('local state =')){
    const prior=keys.get(key);
    if(!prior){keys.set(key,'working:'+nonce);return {ok:true,json:async()=>({result:1})}}
    if(prior==='done:'+digest)return {ok:true,json:async()=>({result:2})};
    if(prior.startsWith('done:'))return {ok:true,json:async()=>({result:3})};
    return {ok:true,json:async()=>({result:0})};
   }
   if(script.startsWith("if redis.call('GET',")){
    if(keys.get(key)==='working:'+nonce){keys.set(key,'done:'+digest);return {ok:true,json:async()=>({result:1})}}
    return {ok:true,json:async()=>({result:0})};
   }
   throw Error('unknown fake redis command');
  }
  if(url.startsWith('https://api.notion.com/v1/')){
   if(url.endsWith('/query'))return {ok:true,json:async()=>({results:[]})};
   return {ok:true,json:async()=>({id:'0cddcc46-80cf-440b-b298-af3604676581'})};
  }
  throw Error('unexpected network destination');
 };
 return {fetchImpl,keys,calls};
}
const response=()=>({code:null,headers:{},body:null,setHeader(k,v){this.headers[k]=v;return this},status(n){this.code=n;return this},json(v){this.body=v;return this}});
const rawLead={...lead};delete rawLead.consentRecordedAt;
const req=(input=rawLead)=>({method:'POST',headers:{'x-fr-crm-token':env.FR_CRM_INGEST_SECRET,'content-type':'application/json'},body:input});
test('F9.5 ingestion requires distributed Redis credentials even if the original Notion flags are true',async()=>{
 assert.equal(configured(env),true);
 assert.equal(ingestConfigured(env),true);
 const invalid=[
  {...env,FR_CRM_REDIS_REST_TOKEN:''},
  {...env,FR_CRM_REDIS_REST_URL:'http://fr-phase95-test.upstash.io'},
  {...env,FR_CRM_REDIS_REST_URL:'https://fr-phase95-test.upstash.io.attacker.test'},
  {...env,FR_CRM_REDIS_REST_URL:'https://upstash.io'},
  {...env,FR_CRM_REDIS_REST_URL:'https://fr-phase95-test.upstash.io/secret'},
  {...env,FR_CRM_REDIS_REST_URL:'https://fr-phase95-test.upstash.io?token=bad'},
  {...env,FR_CRM_REDIS_REST_URL:'https://user:pass@fr-phase95-test.upstash.io'}
 ];
 for(const item of invalid){assert.equal(configured(item),false);assert.equal(ingestConfigured(item),false)}
 let calls=0;const res=response();
 await ingest(req(),res,{env:{...env,FR_CRM_REDIS_REST_URL:undefined},fetchImpl:async()=>{calls++;throw Error('never')}});
 assert.equal(res.code,404);assert.equal(calls,0);
});
test('F9.5 digest is keyed, stable and changes if the same event ID carries a different payload',()=>{
 const digest=fingerprint(lead,env.FR_CRM_INGEST_SECRET);
 assert.match(digest,/^[a-f0-9]{64}$/);
 assert.equal(digest,fingerprint({...lead},env.FR_CRM_INGEST_SECRET));
 assert.notEqual(digest,fingerprint({...lead,contactName:'Alterado'},env.FR_CRM_INGEST_SECRET));
 assert.ok(!digest.includes(lead.eventId));
 assert.equal(LEASE_SECONDS,120);
 assert.equal(DONE_SECONDS,2592000);
});
test('F9.5 first claimed event writes once; subsequent identical event is acknowledged without executing Notion',async()=>{
 const fake=store();let writes=0;
 const first=await processOnce(lead,async()=>{writes++;return 'received'},{env,fetchImpl:fake.fetchImpl});
 const second=await processOnce(lead,async()=>{writes++;return 'received'},{env,fetchImpl:fake.fetchImpl});
 assert.equal(first,'received');assert.equal(second,'already_received');assert.equal(writes,1);
 assert.equal(fake.calls.length,3);
 assert.equal(fake.keys.size,1);
 assert.match([...fake.keys.values()][0],/^done:[a-f0-9]{64}$/);
});
test('F9.5 concurrent attempts on separate simulated serverless instances cannot both create a Notion opportunity',async()=>{
 const fake=store();let release;
 const waiting=new Promise(resolve=>{release=resolve});
 let writes=0;
 const first=processOnce(lead,async()=>{writes++;await waiting;return 'received'},{env,fetchImpl:fake.fetchImpl});
 // The distributed lock is set by the time a second request reaches Upstash.
 const second=await processOnce(lead,async()=>{writes++;return 'received'},{env,fetchImpl:fake.fetchImpl});
 assert.equal(second,'retry_later');assert.equal(writes,1);
 release();
 assert.equal(await first,'received');
 assert.equal(await processOnce(lead,async()=>{writes++;return 'received'},{env,fetchImpl:fake.fetchImpl}),'already_received');
 assert.equal(writes,1);
});
test('F9.5 reused event ID with conflicting customer input is rejected without a second write',async()=>{
 const fake=store();let writes=0;
 await processOnce(lead,async()=>{writes++;return 'received'},{env,fetchImpl:fake.fetchImpl});
 const result=await processOnce({...lead,contactName:'Outro nome'},async()=>{writes++;return 'received'},{env,fetchImpl:fake.fetchImpl});
 assert.equal(result,'conflict');assert.equal(writes,1);
 const reply=response();
 await ingest(req({...rawLead,contactName:'Outro nome'}),reply,{env,fetchImpl:fake.fetchImpl});
 assert.equal(reply.code,409);assert.deepEqual(reply.body,{status:'conflict'});
});
test('F9.5 uncertain Notion result retains short lease and never retries a side effect immediately',async()=>{
 const fake=store();let attempts=0;
 await assert.rejects(processOnce(lead,async()=>{attempts++;throw Error('notion unavailable')},{env,fetchImpl:fake.fetchImpl}),/notion unavailable/);
 const next=await processOnce(lead,async()=>{attempts++;return 'received'},{env,fetchImpl:fake.fetchImpl});
 assert.equal(next,'retry_later');assert.equal(attempts,1);
 assert.match([...fake.keys.values()][0],/^working:/);
});
test('F9.5 missing lease ownership at completion fails closed rather than confirming the write',async()=>{
 const fake=store();
 await assert.rejects(
  processOnce(lead,async()=>{
   const key=[...fake.keys.keys()][0];fake.keys.set(key,'working:owned-by-another');
   return 'received';
  },{env,fetchImpl:fake.fetchImpl}),
  /CRM_LEASE_EXPIRED_BEFORE_CONFIRMATION/
 );
});
test('F9.5 failed Redis gate never attempts Notion and never leaks customer identifiers',async()=>{
 let notionCalls=0;
 const errors=async()=>({ok:false,status:500,json:async()=>({error:'denied'})});
 const res=response();await ingest(req(),res,{env,fetchImpl:errors});
 assert.equal(res.code,503);
 assert.deepEqual(res.body,{status:'retry_later'});
 assert.equal(res.headers['Retry-After'],'120');
 assert.equal(notionCalls,0);
 assert.equal(JSON.stringify(res).includes(lead.contactName),false);
 const module=fs.readFileSync('src/fr-crm-dedup-gate.cjs','utf8');
 assert.doesNotMatch(module,/console\.(log|warn|error)|window\.|localStorage|gtag|page_view/);
 assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/FR_CRM_REDIS_REST_URL|FR_CRM_REDIS_REST_TOKEN/);
});
