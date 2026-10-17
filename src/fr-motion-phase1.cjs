'use strict';

const HOME_IDS=Object.freeze(['FR-BA010','FR-BA055','FR-BA007','FR-BA034','FR-BA059']);
function normalizePair(p,environmentMap) {
 const project=p.project||{};
 const original=String(project.title||p.title||'').trim();
 const title=original.replace(/^Estudo (?:ilustrativo|de materialidade)\s*[—:-]\s*/i,'').trim()||'Transformação Franco Romeu';
 const ids=project.environment_ids||p.environment_ids||[];
 const environment=ids.map(id=>environmentMap?.get(id)?.name||id).join(' / ')||p.environment||'Ambiente';
 return Object.assign({},p,{id:p.pair_id,title,environment,environment_ids:ids,kind:'ANTES_DEPOIS',beforeLabel:'ANTES',afterLabel:'DEPOIS',summary:(p.interventions||[]).slice(0,2).join(' · ')});
}
function findSameProject3D(prepared) {
 // No synthetic pairing: both media must belong to the same identified project.
 const items=Object.values(prepared.data.media||{}).filter(m=>(m.project_ids||[]).includes('FR-C001'));
 const design=items.find(m=>m.stage==='PROJECT_3D' || m.nature==='RENDER');
 const execution=items.find(m=>m.stage==='APPLICATION' && m.nature!=='RENDER');
 if(!design||!execution||design.media_id===execution.media_id)return null;
 return {id:'FR-C001-3D-EXEC',pair_id:'FR-C001-3D-EXEC',project_id:'FR-C001',title:'Cozinha + Lavanderia',environment:'Cozinha / Lavanderia',
   environment_ids:['cozinha','lavanderia'],kind:'3D_EXECUCAO',beforeLabel:'PROJETO 3D',afterLabel:'EXECUÇÃO',
   before_media_id:design.media_id,after_media_id:execution.media_id,route:'/projetos/cozinha-lavanderia',
   summary:'Da composição tridimensional ao espaço construído'};
}
function chooseHome(pairs,case3D) {
 const ids=case3D?HOME_IDS.slice(0,4):HOME_IDS;
 const home=ids.map(id=>pairs.find(p=>p.pair_id===id));
 if(home.some(p=>!p))throw Error('FR Motion: missing one of the five curated Home comparisons');
 if(case3D)home.splice(2,0,case3D);
 if(home.length!==5||new Set(home.map(p=>p.pair_id)).size!==5)throw Error('FR Motion: invalid Home curation');
 return home;
}
function collectionLinks(doc) {
 const nav=doc.createElement('nav');nav.id='frms-portfolio-links';nav.className='frms-portfolio-links';
 nav.setAttribute('aria-label','Coleções especiais Franco Romeu');
 const links=[
  ['/projetos/cozinha-lavanderia','Cozinha e Lavanderia','Projeto integrado'],
  ['/portfolio#frpm-before-after','Antes & Depois','Obras em transformação'],
  ['/portfolio#frpm-portfolio-environments','Reels Ambience','Ambientes em sequência']
 ];
 links.forEach((row,i)=>{
  const a=doc.createElement('a');a.href=row[0];a.className='frms-collection';
  const n=doc.createElement('span');n.className='frms-collection-number';n.textContent=String(i+1).padStart(2,'0');
  const t=doc.createElement('strong');t.textContent=row[1];
  const d=doc.createElement('small');d.textContent=row[2];
  const arrow=doc.createElement('span');arrow.textContent='↗';
  a.append(n,t,d,arrow);nav.append(a);
 });
 return nav;
}
// Server-rendered foundation for a standalone, reversible split-scroll module.
module.exports=function installFRMotion(doc,prepared){
 if(!doc||!prepared||!prepared.data)throw Error('FR motion requires canonical build DOM + media catalog');
 const invalid=prepared.data.pairs.filter(p=>!prepared.data.media[p.before_media_id]||!prepared.data.media[p.after_media_id]);
 if(invalid.length)throw Error('FR Motion: '+invalid.length+' incomplete canonical comparisons');
 const pairs=prepared.data.pairs.map(p=>normalizePair(p,prepared.l?.maps?.environments));
 if(pairs.length<5)throw Error('FR motion requires at least five valid before/after media pairs');
 const homeHost=doc.querySelector('#view-home .fr6-hero');
 const portfolioHost=doc.querySelector('#view-projetos .fr10-portfolio-stage');
 if(!homeHost||!portfolioHost)throw Error('FR motion insert points missing: hero or portfolio stage');
 function element(tag,className,text){
  const e=doc.createElement(tag);if(className)e.className=className;
  if(text!==undefined)e.textContent=text;return e;
 }
 function pairType(text){return /PROJETO 3D/i.test(text)?'3d':'photo';}
 function media(id,where,index,label){
  const data=prepared.data.media[id],image=element('img');
  image.setAttribute('alt',label+(pairType(label)==='3d'?' — visualização tridimensional criada pela Franco Romeu':' — registro fotográfico da obra Franco Romeu'));
  image.setAttribute('decoding','async');
  image.setAttribute('loading',index===0?'eager':'lazy');
  const canonical=data.variants.find(v=>v.canonical)||data.variants[data.variants.length-1];
  if(canonical){image.width=canonical.width;image.height=canonical.height;}
  const url='/'+data.canonicalFile;
  if(index===0)image.setAttribute('src',url);else image.dataset.frmsSrc=url;
  return image;
 }
 function build(kind,items){
  const section=element('section','frms-section');
  section.id=kind==='home'?'frms-home':'frms-portfolio';
  section.dataset.frmsKind=kind;
  section.setAttribute('aria-label',kind==='home'?'Transformações Franco Romeu — destaque':'Arquivo de transformações Franco Romeu');
  section.dataset.frmsCount=String(items.length);
  section.dataset.frmsScrollHeight=String(100+(items.length-1)*(kind==='home'?100:80));
  section.style.height=section.dataset.frmsScrollHeight+'svh';
  const pin=element('div','frms-pin'),sides=[];
  for(const side of ['left','right']){
   const host=element('div','frms-side');host.dataset.frmsSide=side;host.setAttribute('aria-hidden','true');
   items.forEach(function(pair,i){
    const frame=element('figure','frms-frame');frame.dataset.frmsOrder=String(i);
    frame.style.zIndex=String(i+1);
    frame.appendChild(media(side==='left'?pair.before_media_id:pair.after_media_id,side,i,(side==='left'?pair.beforeLabel:pair.afterLabel)+' — '+pair.title));
    host.appendChild(frame);
   });
   sides.push(host);pin.appendChild(host);
  }
  pin.appendChild(element('div','frms-divider'));
  const top=element('div','frms-top');
  top.append(element('span','',kind==='home'?'ꟻR / TRANSFORMAÇÕES':'ꟻR / ARQUIVO COMPLETO'),element('span','',kind==='home'?'ANTES · PROJETO · EXECUÇÃO':'ANTES / DEPOIS'),element('span',''));
  top.lastChild.dataset.frmsCounter='';top.lastChild.textContent='01 / '+String(items.length).padStart(2,'0');
  pin.appendChild(top);
  const cards=element('div','frms-cards');
  items.forEach(function(pair,i){
   const card=element('article','frms-card');card.dataset.frmsOrder=String(i);card.style.zIndex=String(15+i);card.dataset.frmsPairId=pair.pair_id;
   card.setAttribute('aria-hidden',i?'true':'false');if(i)card.inert=true;
   const header=element('div','frms-card-top');
   header.append(element('span','',pair.beforeLabel+' / '+pair.afterLabel),element('span','frms-card-index',String(i+1).padStart(2,'0')));
   const copy=element('div','frms-card-copy');
   copy.append(element('p','frms-card-kicker',pair.environment||'ARTE + ENGENHARIA'));
   copy.append(element('h2','frms-card-title',pair.title));
   const foot=element('div','frms-card-foot');
   foot.append(element('p','',pair.summary||'Da condição inicial ao resultado executado pela Franco Romeu.'));
   const link=element('a','', '↗');link.href=pair.route;link.setAttribute('aria-label','Abrir projeto: '+pair.title);
   foot.appendChild(link);card.append(header,copy,foot);cards.appendChild(card);
  });
  pin.appendChild(cards);
  const bottom=element('div','frms-bottom');
  bottom.append(element('span','',kind==='home'?'05 COMPOSIÇÕES / ꟻR':String(items.length)+' OBRAS / ꟻR'));
  const progress=element('div','frms-progress');progress.appendChild(element('span'));bottom.append(progress,element('span','','SCROLL PARA EXPLORAR ↓'));pin.appendChild(bottom);
  const details=element('details','frms-index'),summary=element('summary','',kind==='home'?'Explorar cinco composições':'Índice das '+items.length+' obras'),ol=element('ol');
  items.forEach(function(pair,i){
 const li=element('li'),jump=element('button','frms-index-jump',String(i+1).padStart(2,'0')+' · '+pair.title),a=element('a','frms-index-link','Estudo ↗');
 jump.type='button';jump.dataset.frmsJump=String(i);jump.setAttribute('aria-label','Ir à cena '+(i+1)+': '+pair.title);
 a.href=pair.route;a.setAttribute('aria-label','Abrir projeto '+pair.title);li.append(jump,a);ol.appendChild(li);
});
  details.append(summary,ol);pin.appendChild(details);
  const skip=element('button','frms-skip',kind==='home'?'Pular destaques →':'Ir ao restante do Portfólio →');skip.type='button';skip.dataset.frmsSkip='';pin.appendChild(skip);
  section.appendChild(pin);return section;
 }
 const case3D=findSameProject3D(prepared);
 const home=chooseHome(pairs,case3D);
 homeHost.insertAdjacentElement('afterend',build('home',home));
 const portfolio=build('portfolio',pairs);
 portfolioHost.insertAdjacentElement('beforebegin',portfolio);
 portfolio.insertAdjacentElement('afterend',collectionLinks(doc));
 const link=element('link');link.rel='stylesheet';link.href='/assets/css/fr-motion-split.css';doc.head.appendChild(link);
 const script=element('script');script.src='/assets/js/fr-motion-split.js';script.defer=true;doc.body.appendChild(script);
 return {home:home.length,portfolio:pairs.length,homePairIds:home.map(p=>p.pair_id),projectToExecution:!!case3D};
};

module.exports._internal={normalizePair,findSameProject3D,chooseHome};
