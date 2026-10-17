'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync('assets/js/fr-conversion-phase9.js','utf8');
function setup({url='https://www.francoromeufr.com.br/',dnt=false,gpc=false,budget=false}={}){
 const doc=new JSDOM(`<!doctype html><html><body>
 <section class="view-section ${budget?'':'active'}" id="view-home"></section>
 <section class="view-section ${budget?'active':''}" id="view-orcamento" ${budget?'':'hidden'}></section>
 <nav id="smart-nav"><a id="wa-nav" href="https://wa.me/5511990021603?text=NOME_PRIVADO_9999"><span>Contato</span></a></nav>
 <footer><a id="phone" href="tel:+5511990021603">Ligar</a><a id="mail" href="mailto:exemplo@francoromeu.fr">Email</a></footer>
 <a id="instagram" href="https://instagram.com/francoromeu.fr">Instagram</a>
 <a id="quote-wa" data-action="sendWhatsApp" href="#">Orçamento</a>
 <button id="pdf" data-action="generatePDF">Gerar PDF</button>
 <button id="export" >Exportar</button>
 <button id="fr-budget-export">Salvar orçamento</button>
 <button id="iqe-fab">IQE</button><button id="iqe-btn-auto">Automático</button>
 <button id="iqe-btn-manual">Manual</button><button id="fr-ai-launcher">Assistente</button>
 </body></html>`,{url,runScripts:'outside-only'});
 const win=doc.window, events=[];
 Object.defineProperty(win.navigator,'doNotTrack',{configurable:true,value:dnt?'1':'0'});
 Object.defineProperty(win.navigator,'globalPrivacyControl',{configurable:true,value:gpc});
 win.gtag=(...args)=>events.push(args);
 win.eval(source);
 win.document.dispatchEvent(new win.Event('DOMContentLoaded'));
 const click=id=>{const el=win.document.getElementById(id);el.addEventListener('click',e=>e.preventDefault(),{once:true});el.dispatchEvent(new win.MouseEvent('click',{bubbles:true,cancelable:true}));};
 return {win,events,click,close:()=>win.close()};
}
test('one production listener, low-cardinality contact data, and no PII from href',()=>{
 const t=setup();
 assert.equal(t.win.FRConversion9.version,'9.0.0');
 t.win.eval(source); // repeated script cannot register an extra listener
 t.click('wa-nav');
 t.click('phone');
 t.click('mail');
 t.click('instagram');
 assert.deepEqual(t.events.map(v=>v[1]),['fr_contact_click','fr_contact_click','fr_contact_click','fr_social_click']);
 assert.deepEqual(t.events.map(v=>v[2].fr_channel),['whatsapp','phone','email','instagram']);
 assert.equal(t.events[0][2].fr_placement,'navigation');
 assert.equal(t.events[0][2].fr_section,'home');
 const serialized=JSON.stringify(t.events);
 for(const secret of ['NOME_PRIVADO','9999','5511990021603','exemplo@','?text=','href','page_location','value','price'])assert.equal(serialized.includes(secret),false,secret);
 t.close();
});
test('quote intent does not claim a lead, and validation precedes outbound WhatsApp signal',()=>{
 const t=setup({budget:true,url:'https://www.francoromeufr.com.br/orcamento'});
 assert.equal(t.events.filter(e=>e[1]==='fr_budget_view').length,1);
 t.click('quote-wa');
 assert.equal(t.events.filter(e=>e[1]==='fr_quote_whatsapp_attempt').length,1);
 assert.equal(t.events.filter(e=>e[1]==='fr_contact_click').length,0);
 t.win.document.querySelector('#quote-wa').href='https://wa.me/5511990021603?text=DADOS_DO_CLIENTE';
 t.click('quote-wa');
 t.click('pdf');
 t.click('fr-budget-export');
 t.click('iqe-fab');
 t.click('iqe-btn-auto');
 t.click('iqe-btn-manual');
 t.click('fr-ai-launcher');
 assert.deepEqual(t.events.map(x=>x[1]),[
   'fr_budget_view','fr_quote_whatsapp_attempt','fr_contact_click','fr_quote_pdf_attempt',
   'fr_quote_file_export_attempt','fr_iqe_open_click','fr_iqe_mode_select',
   'fr_iqe_mode_select','fr_assistant_open_click'
 ]);
 assert.equal(t.events[6][2].fr_mode,'automatic');
 assert.equal(t.events[7][2].fr_mode,'manual');
 assert.doesNotMatch(JSON.stringify(t.events),/DADOS_DO_CLIENTE|generate_lead|purchase/);
 t.close();
});
test('budget-view count changes only after real view activation; no duplicate on class churn',async()=>{
 const t=setup();
 const view=t.win.document.getElementById('view-orcamento');
 assert.equal(t.events.length,0);
 view.hidden=false;view.classList.add('active');
 await new Promise(resolve=>t.win.queueMicrotask(resolve));
 assert.equal(t.events.filter(x=>x[1]==='fr_budget_view').length,1);
 view.setAttribute('aria-hidden','false');view.classList.add('test');
 await new Promise(resolve=>t.win.queueMicrotask(resolve));
 assert.equal(t.events.filter(x=>x[1]==='fr_budget_view').length,1);
 view.classList.remove('active');
 await new Promise(resolve=>t.win.queueMicrotask(resolve));
 view.classList.add('active');
 await new Promise(resolve=>t.win.queueMicrotask(resolve));
 assert.equal(t.events.filter(x=>x[1]==='fr_budget_view').length,2);
 t.close();
});
test('previews, non-canonical hosts and privacy opt-outs are silent',()=>{
 for(const options of [
   {url:'https://francoromeu-fr.vercel.app/orcamento',budget:true},
   {url:'https://francoromeufr.com.br/orcamento',budget:true},
   {dnt:true,budget:true},
   {gpc:true,budget:true}
 ]){
   const t=setup(options);t.click('wa-nav');t.click('pdf');
   assert.equal(t.events.length,0,JSON.stringify(options));
   t.close();
 }
});
test('public build carries only one deferred conversion module per canonical SPA route',()=>{
 const paths=['index.html','sobre.html','ambientes.html','projetos-3d.html','portfolio.html','orcamento.html'];
 for(const f of paths){
   const target='dist/'+f;
   assert.equal(fs.existsSync(target),true,target);
   const html=fs.readFileSync(target,'utf8');
   assert.equal(html.split('/assets/js/fr-conversion-phase9.js').length-1,1,f);
 }
 const deployed=fs.readFileSync('dist/assets/js/fr-conversion-phase9.js','utf8');
 assert.match(deployed,/fr_budget_view/);
 assert.doesNotMatch(deployed,/generate_lead|client_name|client_phone|location\.search/);
});
