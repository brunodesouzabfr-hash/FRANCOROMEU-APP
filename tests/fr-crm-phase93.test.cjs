'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {config,canTransition,review}=require('../src/fr-crm-workflow.cjs');
test('CRM remains entirely private and automatic intake/outreach is off',()=>{
 assert.equal(config.schema_version,'fr-crm-pipeline-1.0.0');
 assert.equal(config.public_intake_enabled,false);
 assert.equal(config.automated_sending_enabled,false);
 assert.equal(config.pipeline.length,9);
 assert.equal(config.workflows.length,6);
 for(const item of config.workflows)assert.equal(item.external_side_effects,false);
});
test('CRM pipeline enforces valid sequence and forbids skipping eligibility checks',()=>{
 assert.equal(canTransition('novo','triagem'),true);
 assert.equal(canTransition('novo','aprovado'),false);
 assert.equal(canTransition('qualificacao','visita_tecnica'),true);
 assert.equal(canTransition('negociacao','aprovado'),true);
 assert.equal(canTransition('perdido','triagem'),true);
 assert.equal(canTransition('pos_obra','proposta_enviada'),false);
 assert.equal(canTransition('nonexistent','novo'),false);
});
test('manual opportunities require owner, action, consent status and stage evidence',()=>{
 const now=new Date('2026-10-17T15:00:00Z');
 const item={stage:'proposta_enviada',owner:'gestor',nextAction:'revisar proposta',consent:'Não informado',lastContactAt:'2026-10-16',followUpAt:'2026-10-18'};
 assert.deepEqual(review(item,now),{valid:true,errors:[],actions:[]});
 assert.ok(review({...item,owner:''},now).errors.includes('owner_required'));
 assert.ok(review({...item,stage:'aprovado'},now).errors.includes('approval_date_required'));
 assert.ok(review({...item,stage:'perdido',lossReason:''},now).errors.includes('loss_reason_required'));
 assert.ok(review({...item,consent:'consentido por inferência'},now).errors.includes('consent_status_required'));
});
test('expired followups generate operator review only, revoked consent blocks outreach',()=>{
 const now=new Date('2026-10-17T15:00:00Z');
 const item={stage:'triagem',owner:'gestor',nextAction:'reavaliar',consent:'Revogado',followUpAt:'2026-10-16'};
 const result=review(item,now);
 assert.equal(result.valid,true);
 assert.deepEqual(result.actions,['stop_outreach_review_retention','review_followup_due']);
 assert.deepEqual(review({...item,stage:'perdido',lossReason:'Outro'},now).actions,['stop_outreach_review_retention']);
});
test('workflow module stays server-side; public build never exposes CRM internals',()=>{
 const build=fs.readFileSync('scripts/build-site.cjs','utf8');
 assert.doesNotMatch(build,/fr-crm-workflow\.cjs|fr-crm-pipeline\.json/);
 const vercel=fs.readFileSync('vercel.json','utf8');
 assert.doesNotMatch(vercel,/\/api\/crm|\/crm\/admin/);
 const base=fs.readFileSync('assets/js/fr-conversion-phase9.js','utf8');
 assert.doesNotMatch(base,/contact_name|phone_number|consent_status|crm_.*lead/);
});
