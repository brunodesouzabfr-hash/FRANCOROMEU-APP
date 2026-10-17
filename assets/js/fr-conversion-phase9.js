/* Franco Romeu | Fase 9 — mensuração de intenção sem PII.
 * Não mede leads fechados; não captura entradas, preços, URLs ou mensagens.
 * Somente o domínio canônico pode emitir eventos; previews são silenciosos.
 */
(() => {
  'use strict';
  if (window.FRConversion9) return;

  const RELEASE='9.0.0';
  const ORIGIN_HOST='www.francoromeufr.com.br';
  const VIEWS=Object.freeze({
    'view-home':'home','view-sobre':'sobre','view-ambientes':'ambientes',
    'view-projetos3d':'projetos_3d','view-projetos':'portfolio',
    'view-orcamento':'orcamento'
  });
  const names=new Set([
    'fr_contact_click','fr_social_click','fr_budget_view',
    'fr_quote_whatsapp_attempt','fr_quote_pdf_attempt',
    'fr_quote_file_export_attempt','fr_quote_review_click',
    'fr_iqe_open_click','fr_iqe_mode_select','fr_assistant_open_click'
  ]);
  const production=location.hostname===ORIGIN_HOST && location.protocol==='https:';
  const privacyOptOut=navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true;

  function section(){
    const active=document.querySelector('.view-section.active');
    if(active && VIEWS[active.id]) return VIEWS[active.id];
    return 'other';
  }
  function placement(element){
    if(element.closest('#smart-nav')) return 'navigation';
    if(element.closest('#view-orcamento')) return 'budget';
    if(element.closest('#view-home')) return 'home';
    if(element.closest('#view-sobre')) return 'about';
    if(element.closest('footer')) return 'footer';
    return 'other';
  }
  function emit(name, detail={}){
    if(!names.has(name)||!production||privacyOptOut||typeof window.gtag!=='function')return false;
    // Fixed, low-cardinality values. Never forward text, URL, name, amount or query.
    const values={
      fr_section:section(),
      fr_placement:['navigation','budget','home','about','footer','other'].includes(detail.placement)?detail.placement:'other'
    };
    if(['whatsapp','phone','email','instagram'].includes(detail.channel))values.fr_channel=detail.channel;
    if(['automatic','manual'].includes(detail.mode))values.fr_mode=detail.mode;
    window.gtag('event',name,values);
    return true;
  }
  function classify(href){
    if(typeof href!=='string'||!href.trim())return null;
    if(/^tel:/i.test(href))return {name:'fr_contact_click',channel:'phone'};
    if(/^mailto:/i.test(href))return {name:'fr_contact_click',channel:'email'};
    let url;
    try{url=new URL(href,location.href)}catch(_){return null}
    const host=url.hostname.toLowerCase();
    if(url.protocol!=='https:')return null;
    if(host==='wa.me'||host==='api.whatsapp.com'||host==='web.whatsapp.com')return {name:'fr_contact_click',channel:'whatsapp'};
    if(host==='instagram.com'||host==='www.instagram.com')return {name:'fr_social_click',channel:'instagram'};
    return null;
  }
  function click(event){
    const element=event.target?.nodeType===1?event.target:event.target?.parentElement;
    if(!element||!element.closest)return;
    const target=element.closest('a,button');
    if(!target||target.disabled||target.getAttribute('aria-disabled')==='true')return;
    const where=placement(target);
    if(target.matches('a[href]')){
      const contact=classify(target.getAttribute('href'));
      if(contact){
        emit(contact.name,{placement:where,channel:contact.channel});
        return;
      }
      if(target.matches('[data-action="sendWhatsApp"]')){
        // A primeira ativação valida os dados; somente o clique externo
        // efetivo (wa.me) entra em fr_contact_click.
        emit('fr_quote_whatsapp_attempt',{placement:'budget'});
        return;
      }
    }
    if(target.matches('[data-action="generatePDF"]'))emit('fr_quote_pdf_attempt',{placement:'budget'});
    else if(target.matches('#fr-budget-export'))emit('fr_quote_file_export_attempt',{placement:'budget'});
    else if(target.matches('[data-action="viewQuote"]'))emit('fr_quote_review_click',{placement:'budget'});
    else if(target.matches('#iqe-fab'))emit('fr_iqe_open_click',{placement:where});
    else if(target.matches('#iqe-btn-auto, #iqe-btn-manual'))
      emit('fr_iqe_mode_select',{placement:where,mode:target.id==='iqe-btn-auto'?'automatic':'manual'});
    else if(target.matches('#fr-ai-launcher'))emit('fr_assistant_open_click',{placement:where});
  }

  let lastBudgetActive=false;
  function budgetState(){
    const node=document.getElementById('view-orcamento');
    const active=!!node&&node.classList.contains('active')&&!node.hidden;
    if(active&&!lastBudgetActive)emit('fr_budget_view',{placement:'budget'});
    lastBudgetActive=active;
  }
  function install(){
    document.addEventListener('click',click,true);
    const node=document.getElementById('view-orcamento');
    budgetState();
    if(node&&typeof MutationObserver==='function'){
      const observer=new MutationObserver(budgetState);
      observer.observe(node,{attributes:true,attributeFilter:['class','hidden','aria-hidden']});
    }
  }
  window.FRConversion9=Object.freeze({version:RELEASE,production,privacyOptOut});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
