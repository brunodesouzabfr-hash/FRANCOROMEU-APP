'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {configured,todaySaoPaulo,followups}=require('../src/fr-crm-private-followups.cjs');
const env={FR_CRM_DUE_ENABLED:'true',FR_CRM_INGEST_SECRET:'S'.repeat(64),FR_CRM_NOTION_TOKEN:'ntn_'+('T'.repeat(50)),FR_CRM_NOTION_DATA_SOURCE_ID:'ce2daa5f-8a64-479f-9c19-6aad58442499'};
const req=(headers={})=>({method:'GET',headers:{'x-fr-crm-token':env.FR_CRM_INGEST_SECRET,...headers}});
const res=()=>({statusCode:0,result:null,headers:{},setHeader(k,v){this.headers[k]=v;return this},status(n){this.statusCode=n;return this},json(v){this.result=v;return this}});
test('F9.4 followups stay unavailable without explicit read flag and secrets',async()=>{
 assert.equal(configured({}),false);
 assert.equal(configured({...env,FR_CRM_DUE_ENABLED:'false'}),false);
 let networkCalls=0,response=res();
 await followups(req(),response,{env:{},fetchImpl:async()=>{networkCalls++;throw Error('never')}});
 assert.equal(response.statusCode,404);assert.equal(networkCalls,0);
});
test('F9.4 due inspector refuses cross-site calls and unauthenticated access',async()=>{
 const mock=async()=>{throw Error('no network allowed')};
 const cases=[[req({'x-fr-crm-token':'wrong'}),401],[req({origin:'https://www.francoromeufr.com.br'}),403],[req({'sec-fetch-site':'same-origin'}),403],[{...req(),method:'POST'},405]];
 for(const [request,code] of cases){const response=res();await followups(request,response,{env,fetchImpl:mock});assert.equal(response.statusCode,code)}
});
test('F9.4 dates are resolved in Brazil timezone (not UTC)',()=>{
 assert.equal(todaySaoPaulo(new Date('2026-10-17T01:30:00Z')),'2026-10-16');
 assert.equal(todaySaoPaulo(new Date('2026-10-17T12:00:00Z')),'2026-10-17');
});
test('F9.4 followup aggregation returns only anonymized counts and excludes terminal stages',async()=>{
 let sent=null;
 const fetchImpl=async(url,opts)=>{
  assert.equal(url,'https://api.notion.com/v1/data_sources/'+env.FR_CRM_NOTION_DATA_SOURCE_ID+'/query');
  sent=JSON.parse(opts.body);
  return {ok:true,json:async()=>({has_more:false,results:[
   {properties:{'Etapa':{select:{name:'Novo'}},'Responsável':{people:[]},'Consentimento de contato':{select:{name:'Não informado'}},'Nome do contato':{rich_text:[{plain_text:'PII never returned'}]}}},
   {properties:{'Etapa':{select:{name:'Triagem'}},'Responsável':{people:[{id:'x'}]},'Consentimento de contato':{select:{name:'Revogado'}}}},
   {properties:{'Etapa':{select:{name:'Perdido'}},'Responsável':{people:[]}}}
  ]})};
 };
 const response=res();await followups(req(),response,{env,fetchImpl,now:new Date('2026-10-17T18:00:00Z')});
 assert.equal(response.statusCode,200);
 assert.equal(response.result.due,2);
 assert.equal(response.result.unassigned,1);
 assert.equal(response.result.consentRevoked,1);
 assert.equal(response.result.byStage.Novo,1);
 assert.equal(response.result.byStage.Triagem,1);
 assert.equal(response.result.asOf,'2026-10-17');
 assert.deepEqual(sent.filter.and[0],{property:'Prazo próxima ação',date:{on_or_before:'2026-10-17'}});
 assert.ok(!JSON.stringify(response.result).includes('PII never returned'));
 assert.ok(!JSON.stringify(response.result).includes(env.FR_CRM_NOTION_TOKEN));
});
test('F9.4 followup counts never return misleading partial results when Notion requests fail',async()=>{
 const fetchImpl=async()=>({ok:false,status:503});
 const response=res();await followups(req(),response,{env,fetchImpl});
 assert.equal(response.statusCode,503);
 assert.deepEqual(response.result,{status:'retry_later'});
});
test('F9.4 followup files are not imported into public build or analytics',()=>{
 const text=fs.readFileSync('scripts/build-site.cjs','utf8')+fs.readFileSync('index.html','utf8');
 assert.doesNotMatch(text,/fr-crm-private-followups|FR_CRM_DUE_ENABLED|fr-crm-due\.js/);
 assert.ok(fs.existsSync('api/fr-crm-due.js'));
});
