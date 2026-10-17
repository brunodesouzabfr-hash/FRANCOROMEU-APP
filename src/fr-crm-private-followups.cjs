'use strict';
/**
 * FR 9.4: server-only aggregate follow-up inspection.
 * Does not reveal lead titles, names, contact details or Notion page IDs.
 * Scheduling and messages are intentionally NOT activated by this endpoint.
 */
const {secureEqual}=require('./fr-crm-secure-ingest.cjs');
const {config}=require('./fr-crm-workflow.cjs');
const VERSION='2025-09-03',NOTION='https://api.notion.com/v1';
const UUID=/^[a-f0-9-]{32,36}$/i;
function configured(env=process.env){
 return env.FR_CRM_DUE_ENABLED==='true'
  &&typeof env.FR_CRM_INGEST_SECRET==='string'&&env.FR_CRM_INGEST_SECRET.length>=32
  &&typeof env.FR_CRM_NOTION_TOKEN==='string'&&env.FR_CRM_NOTION_TOKEN.length>=30
  &&typeof env.FR_CRM_NOTION_DATA_SOURCE_ID==='string'&&UUID.test(env.FR_CRM_NOTION_DATA_SOURCE_ID);
}
function todaySaoPaulo(now=new Date()){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const value=k=>parts.find(x=>x.type===k)?.value;
 return value('year')+'-'+value('month')+'-'+value('day');
}
function reply(res,status,value){return res.status(status).json(value)}
async function followups(req,res,{env=process.env,fetchImpl=fetch,now=new Date()}={}){
 res.setHeader('Cache-Control','private, no-store, max-age=0');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(!configured(env))return reply(res,404,{status:'not_available'});
 if(req.method!=='GET'){res.setHeader('Allow','GET');return reply(res,405,{status:'not_available'})}
 if(req.headers?.origin||req.headers?.['sec-fetch-site'])return reply(res,403,{status:'not_available'});
 const authorization=req.headers?.['x-fr-crm-token'];
 if(typeof authorization!=='string'||!secureEqual(authorization,env.FR_CRM_INGEST_SECRET))return reply(res,401,{status:'unauthorized'});
 const current=todaySaoPaulo(now),counts=Object.fromEntries(config.pipeline.map(p=>[p.label,0]));
 let overdue=0,unassigned=0,consentRevoked=0,cursor=null;
 try{
  for(let page=0;page<10;page++){
   const filters=[
    {property:'Prazo próxima ação',date:{on_or_before:current}},
    {property:'Etapa',select:{does_not_equal:'Perdido'}},
    {property:'Etapa',select:{does_not_equal:'Pós-obra'}}
   ];
   const payload={page_size:100,filter:{and:filters}};
   if(cursor)payload.start_cursor=cursor;
   const response=await fetchImpl(NOTION+'/data_sources/'+env.FR_CRM_NOTION_DATA_SOURCE_ID+'/query',{
    method:'POST',headers:{'Content-Type':'application/json','Notion-Version':VERSION,Authorization:'Bearer '+env.FR_CRM_NOTION_TOKEN},
    body:JSON.stringify(payload),signal:AbortSignal.timeout(8000)
   });
   if(!response.ok)throw new Error('NOTION_QUERY');
   const data=await response.json();
   if(!Array.isArray(data.results))throw new Error('NOTION_RESPONSE');
   for(const row of data.results){
    const props=row.properties||{},stage=props['Etapa']?.select?.name||'';
    if(stage==='Perdido'||stage==='Pós-obra')continue;
    if(!Object.hasOwn(counts,stage))throw new Error('UNKNOWN_STAGE');
    counts[stage]++;overdue++;
    if(!Array.isArray(props['Responsável']?.people)||props['Responsável'].people.length===0)unassigned++;
    if(props['Consentimento de contato']?.select?.name==='Revogado')consentRevoked++;
   }
   if(!data.has_more)return reply(res,200,{status:'ok',asOf:current,due:overdue,unassigned,consentRevoked,byStage:counts});
   if(!data.next_cursor)throw new Error('NOTION_CURSOR');
   cursor=data.next_cursor;
  }
  // Never emit a partial dashboard that understates commercial liabilities.
  throw new Error('PAGE_LIMIT');
 }catch(_){res.setHeader('Retry-After','30');return reply(res,503,{status:'retry_later'})}
}
module.exports={configured,todaySaoPaulo,followups};
