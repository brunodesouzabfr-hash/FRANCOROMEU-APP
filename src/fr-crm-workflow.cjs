'use strict';
/** FR CRM — pure, private workflow rules. No PII persistence or network calls.
 * This module is never copied to dist. The Notion database is the operator-owned store.
 */
const config=require('../config/fr-crm-pipeline.json');
const byStage=new Map(config.pipeline.map(s=>[s.id,s]));
const normalized=s=>typeof s==='string'?s.trim():'';
function canTransition(from,to){
 const s=byStage.get(normalized(from));
 return Boolean(s&&s.next.includes(normalized(to)));
}
function review(record,now=new Date()){
 if(!(now instanceof Date)||Number.isNaN(now.getTime()))throw new TypeError('Invalid current date');
 const errors=[],actions=[];
 if(!record||typeof record!=='object'||Array.isArray(record))return {valid:false,errors:['record_required'],actions:[]};
 const stage=normalized(record.stage),owner=normalized(record.owner),next=normalized(record.nextAction);
 const consent=normalized(record.consent),time=record.followUpAt?new Date(record.followUpAt):null;
 if(!byStage.has(stage))errors.push('invalid_stage');
 if(!owner&&stage!=='perdido')errors.push('owner_required');
 if(!next&&['novo','triagem','qualificacao','visita_tecnica','proposta_enviada','negociacao'].includes(stage))errors.push('next_action_required');
 if(time&&Number.isNaN(time.getTime()))errors.push('invalid_followup_date');
 if(stage==='aprovado'&&!record.approvedAt)errors.push('approval_date_required');
 if(stage==='perdido'&&!normalized(record.lossReason))errors.push('loss_reason_required');
 if(!config.consent_status.includes(consent))errors.push('consent_status_required');
 if(consent==='Revogado')actions.push('stop_outreach_review_retention');
 if(stage==='proposta_enviada'&&!record.lastContactAt)errors.push('last_contact_required');
 if(time&&time.getTime()<=now.getTime()&&!['perdido','pos_obra'].includes(stage))actions.push('review_followup_due');
 return {valid:errors.length===0,errors,actions};
}
module.exports=Object.freeze({config,canTransition,review});
