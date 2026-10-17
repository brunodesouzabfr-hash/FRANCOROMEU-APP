'use strict';
/* Franco Romeu, Phase 4: editorial horizontal outro anchored above canonical Home footer. */
const HOME_IDS=Object.freeze(['FR-BA055','FR-BA034','FR-BA059']);
function e(doc,tag,cls,txt){const el=doc.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;}
function pick(prepared){
 const media=prepared.data.media,ps=prepared.data.pairs;
 return HOME_IDS.map(id=>{
   const pair=ps.find(x=>x.pair_id===id);if(!pair)throw Error('FR home finale: missing '+id);
   const item=media[pair.after_media_id];
   if(!item||!item.canonicalFile||!(item.variants||[]).length)throw Error('FR home finale: invalid media '+pair.after_media_id);
   const title=String(pair.project?.title||'Franco Romeu').replace(/^Estudo (?:ilustrativo|de materialidade)\s*[—:-]\s*/i,'');
   return {id,title,url:'/'+item.canonicalFile,alt:item.alt||'Obra executada pela Franco Romeu',project:pair.project_id};
 });
}
function install(doc,prepared){
 if(!doc||!prepared?.data)throw Error('FR finale: canonical media catalog required');
 const final=doc.querySelector('#view-home .fr6-final'),footer=doc.querySelector('#view-home .fr6-footer');
 if(doc.getElementById('froutro4'))throw Error('FR finale: duplicate section');
 if(!final||!footer||final.nextElementSibling!==footer)throw Error('FR finale: Home final CTA/footer anchors changed');
 const selected=pick(prepared);
 const section=e(doc,'section','froutro4');
 section.id='froutro4';section.dataset.froutro4Count='4';
 section.setAttribute('aria-label','Percurso final Franco Romeu e canais de atendimento');
 // Four full viewport frames, without blocking vertical browser scroll.
 section.style.height='370svh';
 const pin=e(doc,'div','froutro4-pin'),rail=e(doc,'div','froutro4-rail');
 const copy=[
  ['A forma nasce da intenção.','PROJETO / MATÉRIA','A técnica encontra a identidade em cada superfície.'],
  ['A luz revela o detalhe.','INTERIORES / PERMANÊNCIA','Materiais, precisão e encontros cuidadosamente resolvidos.'],
  ['O espaço encontra sua voz.','EXECUÇÃO / ENTREGA','Soluções construídas para permanecer.']
 ];
 selected.forEach((item,i)=>{
  const panel=e(doc,'article','froutro4-panel froutro4-panel-media');
  panel.dataset.froutro4Index=String(i);
  const photo=e(doc,'div','froutro4-image'),img=e(doc,'img');
  img.src=item.url;img.alt=item.alt;img.decoding='async';img.loading='lazy';
  photo.append(img);
  const shade=e(doc,'div','froutro4-shade'),contents=e(doc,'div','froutro4-content');
  contents.append(e(doc,'span','froutro4-kicker',copy[i][1]),
    e(doc,'span','froutro4-counter','0'+(i+1)+' / 04'),
    e(doc,'h2','froutro4-heading',copy[i][0]),
    e(doc,'p','froutro4-text',copy[i][2]),
    e(doc,'span','froutro4-work',item.title));
  panel.append(photo,shade,contents);rail.append(panel);
 });
 const last=e(doc,'section','froutro4-panel froutro4-panel-cta');last.dataset.froutro4Index='3';
 last.setAttribute('aria-label','Contato e orçamento Franco Romeu');
 const label=e(doc,'span','froutro4-kicker','ꟻR / CONTINUE A CONVERSA');
 const heading=e(doc,'h2','froutro4-heading','Uma ideia. Um espaço. Um novo começo.');
 const description=e(doc,'p','froutro4-text','Transforme uma referência em uma conversa sobre seu projeto. Escolha como começar.');
 const links=e(doc,'div','froutro4-actions');
 const wa=e(doc,'a','froutro4-link froutro4-link-primary');wa.href='https://wa.me/5511990021603';wa.target='_blank';wa.rel='noopener noreferrer';
 wa.setAttribute('aria-label','Conversar com a Franco Romeu no WhatsApp');
 wa.append(e(doc,'span','froutro4-icon',''),e(doc,'strong','','WhatsApp'),e(doc,'span','','↗'));
 const ig=e(doc,'a','froutro4-link');ig.href='https://www.instagram.com/francoromeu.fr/';ig.target='_blank';ig.rel='noopener noreferrer';
 ig.setAttribute('aria-label','Abrir Instagram oficial da Franco Romeu');
 ig.append(e(doc,'span','froutro4-icon',''),e(doc,'strong','','Instagram'),e(doc,'span','','↗'));
 const budget=e(doc,'a','froutro4-link');budget.href='/orcamento';budget.setAttribute('aria-label','Abrir a calculadora de orçamento Franco Romeu');
 budget.append(e(doc,'span','froutro4-icon',''),e(doc,'strong','','Calculadora'),e(doc,'span','','↗'));
 const brandIcons=[['fa-brands fa-whatsapp',wa],['fa-brands fa-instagram',ig],['fa-solid fa-calculator',budget]];
 brandIcons.forEach(function(entry){const icon=e(doc,'i',entry[0]);icon.setAttribute('aria-hidden','true');entry[1].querySelector('.froutro4-icon').append(icon);});
 links.append(wa,ig,budget);
 const content=e(doc,'div','froutro4-cta-inner');content.append(label,heading,description,links);
 last.append(content);rail.append(last);pin.append(rail);
 const bar=e(doc,'div','froutro4-progress'),span=e(doc,'span');bar.setAttribute('aria-hidden','true');bar.append(span);pin.append(bar);
 const skip=e(doc,'button','froutro4-skip','Ir ao rodapé ↓');skip.type='button';skip.dataset.froutro4Skip='';
 pin.append(skip);section.append(pin);
 footer.before(section);
 const link=e(doc,'link');link.rel='stylesheet';link.href='/assets/css/fr-home-outro4.css';doc.head.append(link);
 const script=e(doc,'script');script.src='/assets/js/fr-home-outro4.js';script.defer=true;doc.body.append(script);
 return {scenes:4,sourcePairs:selected.map(x=>x.id),canonicalFooterPreserved:true,canonicalFinalPreserved:true};
}
module.exports=install;
module.exports._internal={pick};
