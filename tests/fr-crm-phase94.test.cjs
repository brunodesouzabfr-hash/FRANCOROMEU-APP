'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {ingest,validate,configured,properties,secureEqual}=require('../src/fr-crm-secure-ingest.cjs');
const sample={
 eventId:'549b1d82-0474-42ac-a337-55ab0e1a88d6',
 source:'WhatsApp',service:'Marcenaria',city:'São Paulo',contactName:'Exemplo QA',
 phone:'+5511999999999',basis:'Solicitação do titular',
 evidence:'Atendimento solicitado voluntariamente'
};
const env={
 FR_CRM_INGEST_ENABLED:'true',
 FR_CRM_INGEST_SECRET:'t'.repeat(64),
 FR_CRM_NOTION_TOKEN:'ntn_'+('x'.repeat(50)),
 FR_CRM_NOTION_DATA_SOURCE_ID:'ce2daa5f-8a64-479f-9c19-6aad58442499',
 FR_CRM_REDIS_REST_URL:'https://fr-crm-test.upstash.io',
 FR_CRM_REDIS_REST_TOKEN:'r'.repeat(50)
};
const notionalId='0cddcc46-80cf-440b-b298-af3604676581';
const req=(body=sample,extra={})=>({
 method:'POST',
 headers:{'content-type':'application/json','x-fr-crm-token':env.FR_CRM_INGEST_SECRET,...extra},
 body
});
const response=()=>{
 const headers={},res={
  code:0,body:null,headers,
  setHeader(k,v){headers[k]=v;return this},
  status(n){this.code=n;return this},
  json(v){this.body=v;return this}
 };return res;
};
const mockFetch=(queryResults=[])=>{
 const calls=[];
 const fetchImpl=async (url,opt)=>{
  calls.push({url,options:opt});
  if(url===env.FR_CRM_REDIS_REST_URL)return {ok:true,json:async()=>({result:1})};
  return {ok:true,json:async()=>url.endsWith('/query')
   ?{results:queryResults}
   :{id:notionalId}
  };
 };return {calls,fetchImpl};
};
test('F9.4 Notion integration is disabled without all explicit private environment variables',async()=>{
 assert.equal(configured({}),false);
 assert.equal(configured({...env,FR_CRM_INGEST_ENABLED:'false'}),false);
 assert.equal(configured({...env,FR_CRM_INGEST_SECRET:'weak'}),false);
 const tracker=mockFetch(),res=response();
 await ingest(req(),res,{env:{},fetchImpl:tracker.fetchImpl});
 assert.equal(res.code,404);assert.deepEqual(res.body,{status:'not_available'});
 assert.equal(tracker.calls.length,0);
});
test('F9.4 authenticated backend rejects browsers, invalid tokens, methods and oversized payloads',async()=>{
 const tracker=mockFetch();
 const invalid=[
  [req(sample,{'x-fr-crm-token':'x'}),401],
  [req(sample,{origin:'https://www.francoromeufr.com.br'}),403],
  [req(sample,{'sec-fetch-site':'same-origin'}),403],
  [req(sample,{'content-type':'text/plain'}),415],
  [req(sample,{'content-length':'8092'}),413],
  [{...req(),method:'GET'},405],
  [req({...sample,message:'private project text'}),400],
  [req({...sample,phone:'+1111'}),400]
 ];
 for(const [request,code] of invalid){
  const r=response();await ingest(request,r,{env,fetchImpl:tracker.fetchImpl});
  assert.equal(r.code,code);
  assert.equal(r.headers['Cache-Control'],'private, no-store, max-age=0');
  assert.equal(r.body.status==='received',false);
 }
 assert.equal(tracker.calls.length,0);
});
test('F9.4 payload validation allowlists contact channels, service types, identity and explicit legal basis',()=>{
 assert.ok(validate(sample));
 assert.equal(validate({...sample,eventId:'user@email.com'}),null);
 assert.equal(validate({...sample,consent:'yes'}),null);
 assert.equal(validate({...sample,basis:'Consentimento específico'}),null);
 assert.equal(validate({...sample,evidence:'\nsecret text'}),null);
 assert.equal(validate({...sample,source:'Malware'}),null);
 assert.ok(validate({...sample,basis:'Consentimento específico',consentRecordedAt:'2026-10-17T10:00:00Z'}));
 assert.equal(validate({...sample,basis:'Solicitação do titular',consentRecordedAt:'2026-10-17T10:00:00Z'}),null);
 assert.equal(secureEqual('alpha','beta'),false);
 assert.equal(secureEqual('same','same'),true);
 const p=properties(validate(sample));
 assert.equal(p['Etapa'].select.name,'Novo');
 assert.equal(p['Consentimento de contato'].select.name,'Não informado');
 assert.equal(p['Base do atendimento'].select.name,'Solicitação do titular');
 assert.equal(p['Referência de integração'].rich_text[0].text.content,sample.eventId);
 assert.equal(p['Nome do contato'].rich_text[0].text.content,sample.contactName);
 assert.equal(p['Próxima ação'].rich_text[0].text.content,'Triagem e atribuição manual de responsável');
});
test('F9.4 creates exactly one real Notion page through secured server-side query/create calls',async()=>{
 const tracker=mockFetch(),res=response();
 await ingest(req(),res,{env,fetchImpl:tracker.fetchImpl});
 assert.equal(res.code,201);
 assert.deepEqual(res.body,{status:'received'});
 assert.equal(tracker.calls.length,4);
 assert.match(tracker.calls[1].url,/^https:\/\/api\.notion\.com\/v1\/data_sources\/[a-f0-9-]+\/query$/);
 assert.equal(tracker.calls[2].url,'https://api.notion.com/v1/pages');
 for(const item of tracker.calls.slice(1,3)){
  assert.equal(item.options.headers['Notion-Version'],'2025-09-03');
  assert.equal(item.options.headers.Authorization,'Bearer '+env.FR_CRM_NOTION_TOKEN);
 }
 const query=JSON.parse(tracker.calls[1].options.body);
 assert.equal(query.filter['property'],'Referência de integração');
 assert.equal(query.filter.rich_text.equals,sample.eventId);
 const create=JSON.parse(tracker.calls[2].options.body);
 assert.equal(create.parent.type,'data_source_id');
 assert.equal(create.parent.data_source_id,env.FR_CRM_NOTION_DATA_SOURCE_ID);
 assert.equal(create.properties['Telefone'].phone_number,sample.phone);
 assert.equal(create.properties['Serviço'].multi_select[0].name,sample.service);
 assert.equal(create.properties['Consentimento de contato'].select.name,'Não informado');
 assert.doesNotMatch(JSON.stringify(create),/utm_|generate_lead|gclid|ga4/);
 assert.equal(JSON.stringify(res.body).includes(sample.contactName),false);
});
test('F9.4 retry for existing event ID is acknowledged but never inserts another page',async()=>{
 const x=mockFetch([{id:notionalId}]),res=response();
 await ingest(req(),res,{env,fetchImpl:x.fetchImpl});
 assert.equal(res.code,200);assert.equal(res.body.status,'already_received');
 assert.equal(x.calls.length,3);
});
test('F9.4 Notion failures respond without leaking client data or credentials',async()=>{
 const failing=async()=>({ok:false,status:429,json:async()=>({message:'secret'})});
 const res=response();await ingest(req(),res,{env,fetchImpl:failing});
 assert.equal(res.code,503);assert.equal(res.headers['Retry-After'],'120');
 assert.equal(JSON.stringify(res.body),JSON.stringify({status:'retry_later'}));
 assert.ok(!JSON.stringify(res).includes('Exemplo QA'));
 assert.ok(!JSON.stringify(res).includes(env.FR_CRM_NOTION_TOKEN));
});
test('F9.4 never bundles ingestion, Notion token, CRM source or integration route into public HTML',()=>{
 const build=fs.readFileSync('scripts/build-site.cjs','utf8');
 const spa=fs.readFileSync('index.html','utf8');
 for(const content of [build,spa]){
  assert.doesNotMatch(content,/FR_CRM_INGEST_SECRET|FR_CRM_NOTION_TOKEN|fr-crm-intake\.js|fr-crm-secure-ingest\.cjs/);
 }
 const module=fs.readFileSync('src/fr-crm-secure-ingest.cjs','utf8');
 assert.doesNotMatch(module,/console\.(log|info|warn|error)|window\.gtag/);
 assert.ok(fs.existsSync('api/fr-crm-intake.js'));
});
