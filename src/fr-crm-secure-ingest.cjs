'use strict';
/**
 * FR 9.4: authenticated, server-to-server Notion intake. Never bundle into dist.
 * No browser-facing submission, CRM secrets, PII logs or GA4 events.
 * A Notion read-before-write check makes *retries* idempotent; it is not an
 * atomic uniqueness constraint across parallel serverless instances.
 */
const crypto=require('node:crypto');
const {config}=require('./fr-crm-workflow.cjs');
const NOTION_ORIGIN='https://api.notion.com/v1';
const NOTION_VERSION='2025-09-03';
const FIELDS=new Set(['eventId','source','service','city','contactName','phone','email','basis','evidence','consentRecordedAt']);
const SERVICES=new Set(['Reformas','Marcenaria','Pisos','Drywall','Pintura','Revestimentos','Bancadas','Elétrica','Hidráulica','Projetos 3D','Outros']);
const CITIES=new Set(['São Paulo','Guarulhos','Osasco','Barueri','Santo André','São Bernardo do Campo','Outra / confirmar']);
const BASES=new Set(['Solicitação do titular','Consentimento específico','Outra base validada']);
const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const inflight=new Map();
const clip=(value,max)=>typeof value==='string'&&value.trim()&&value.trim().length<=max?value.trim():null;
const rich=value=>[{type:'text',text:{content:value}}];
const select=name=>({select:{name}});
const header=(req,key)=>{const v=req.headers?.[key];return typeof v==='string'?v:null};
function secureEqual(left,right){
 if(typeof left!=='string'||typeof right!=='string')return false;
 const a=crypto.createHash('sha256').update(left).digest();
 const b=crypto.createHash('sha256').update(right).digest();
 return crypto.timingSafeEqual(a,b);
}
function configured(env=process.env){
 const ds=env.FR_CRM_NOTION_DATA_SOURCE_ID;
 return env.FR_CRM_INGEST_ENABLED==='true'
   &&typeof env.FR_CRM_INGEST_SECRET==='string'&&env.FR_CRM_INGEST_SECRET.length>=32
   &&typeof env.FR_CRM_NOTION_TOKEN==='string'&&env.FR_CRM_NOTION_TOKEN.length>=30
   &&typeof ds==='string'&&/^[a-f0-9-]{32,36}$/i.test(ds);
}
function validate(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!FIELDS.has(k)))return null;
 if(!UUID.test(input.eventId||''))return null;
 if(!config.lead_origin.includes(input.source))return null;
 if(!SERVICES.has(input.service)||!CITIES.has(input.city))return null;
 const name=clip(input.contactName,100);
 const phone=clip(input.phone,16),email=clip(input.email,180);
 if(!name||(!phone&&!email))return null;
 if(phone&&!/^\+55\d{10,11}$/.test(phone))return null;
 if(email&&!/^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/u.test(email))return null;
 if(!BASES.has(input.basis))return null;
 const evidence=clip(input.evidence,180);
 if(!evidence||/[\r\n<>]/.test(evidence))return null;
 const stamp=input.consentRecordedAt;
 if(input.basis==='Consentimento específico'){
   if(typeof stamp!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(stamp)||Number.isNaN(Date.parse(stamp)))return null;
 }else if(stamp!==undefined)return null;
 return {eventId:input.eventId.toLowerCase(),source:input.source,service:input.service,city:input.city,contactName:name,phone:phone||null,email:email?.toLowerCase()||null,basis:input.basis,evidence,consentRecordedAt:stamp||null};
}
function properties(lead){
 const props={
  'Oportunidade':{title:rich('Atendimento • '+lead.service)},
  'Etapa':select('Novo'),
  'Origem':select(lead.source),
  'Serviço':{multi_select:[{name:lead.service}]},
  'Cidade':select(lead.city),
  'Nome do contato':{rich_text:rich(lead.contactName)},
  'Próxima ação':{rich_text:rich('Triagem e atribuição manual de responsável')},
  'Consentimento de contato':select(lead.basis==='Consentimento específico'?'Registrado':'Não informado'),
  'Base do atendimento':select(lead.basis),
  'Base e origem consentimento':{rich_text:rich(lead.evidence+(lead.consentRecordedAt?' | '+lead.consentRecordedAt:''))},
  'Referência de integração':{rich_text:rich(lead.eventId)}
 };
 if(lead.phone)props['Telefone']={phone_number:lead.phone};
 if(lead.email)props['E-mail']={email:lead.email};
 return props;
}
async function notionPost(relative,body,{env=process.env,fetchImpl=fetch}={}){
 // relative is generated internally, never accepts user-controlled destinations.
 const res=await fetchImpl(NOTION_ORIGIN+relative,{
  method:'POST',headers:{Authorization:'Bearer '+env.FR_CRM_NOTION_TOKEN,'Notion-Version':NOTION_VERSION,'Content-Type':'application/json'},
  body:JSON.stringify(body),signal:AbortSignal.timeout(8000)
 });
 if(!res.ok)throw new Error('NOTION_UNAVAILABLE');
 const json=await res.json();
 if(!json||typeof json!=='object')throw new Error('NOTION_BAD_RESPONSE');
 return json;
}
async function receive(lead,{env=process.env,fetchImpl=fetch}={}){
 const source=env.FR_CRM_NOTION_DATA_SOURCE_ID;
 const current=await notionPost('/data_sources/'+source+'/query',{
  page_size:2,filter:{property:'Referência de integração',rich_text:{equals:lead.eventId}}
 },{env,fetchImpl});
 if(!Array.isArray(current.results)||current.results.length>1)throw new Error('NOTION_UNEXPECTED_QUERY');
 if(current.results.length===1)return 'already_received';
 const created=await notionPost('/pages',{
  parent:{type:'data_source_id',data_source_id:source},
  properties:properties(lead)
 },{env,fetchImpl});
 if(!UUID.test(created.id||''))throw new Error('NOTION_BAD_CREATE');
 return 'received';
}
function send(res,status,label){
 return res.status(status).json({status:label});
}
async function ingest(req,res,{env=process.env,fetchImpl=fetch}={}){
 res.setHeader('Cache-Control','private, no-store, max-age=0');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(!configured(env))return send(res,404,'not_available');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return send(res,405,'not_available');}
 // Browsers never call this endpoint. Do not enable CORS or trust page-origin claims.
 if(header(req,'origin')||header(req,'sec-fetch-site'))return send(res,403,'not_available');
 const key=header(req,'x-fr-crm-token');
 if(!key||!secureEqual(key,env.FR_CRM_INGEST_SECRET))return send(res,401,'unauthorized');
 if(!/^application\/json(?:\s*;.*)?$/i.test(header(req,'content-type')||''))return send(res,415,'invalid_payload');
 const declared=Number(header(req,'content-length')||0);
 if(!Number.isFinite(declared)||declared>4096)return send(res,413,'invalid_payload');
 const body=req.body;
 if(!body||typeof body!=='object'||Buffer.byteLength(JSON.stringify(body),'utf8')>4096)return send(res,400,'invalid_payload');
 const lead=validate(body);
 if(!lead)return send(res,400,'invalid_payload');
 // A single running instance coalesces overlapping retries. Other instances
 // still require a database-backed unique key for absolute exactly-once writes.
 let pending=inflight.get(lead.eventId);
 if(!pending){
  pending=receive(lead,{env,fetchImpl});
  inflight.set(lead.eventId,pending);
  pending.finally(()=>{if(inflight.get(lead.eventId)===pending)inflight.delete(lead.eventId)}).catch(()=>{});
 }
 try{
  const result=await pending;
  return send(res,result==='received'?201:200,result);
 }catch(_){
  res.setHeader('Retry-After','20');
  return send(res,503,'retry_later');
 }
}
module.exports={ingest,validate,configured,secureEqual,properties,receive};
