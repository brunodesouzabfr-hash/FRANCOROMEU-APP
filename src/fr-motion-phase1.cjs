'use strict';
// Server-rendered foundation for a standalone, reversible split-scroll module.
module.exports=function installFRMotion(doc,prepared){
 if(!doc||!prepared||!prepared.data)throw Error('FR motion requires canonical build DOM + media catalog');
 const pairs=prepared.data.pairs.filter(function(p){return Boolean(prepared.data.media[p.before_media_id]&&prepared.data.media[p.after_media_id]);});
 if(pairs.length<5)throw Error('FR motion requires at least five valid before/after media pairs');
 const homeHost=doc.querySelector('#view-home .fr6-hero');
 const portfolioHost=doc.querySelector('#view-projetos .fr10-portfolio-stage');
 if(!homeHost||!portfolioHost)throw Error('FR motion insert points missing: hero or portfolio stage');
 function element(tag,className,text){
  const e=doc.createElement(tag);if(className)e.className=className;
  if(text!==undefined)e.textContent=text;return e;
 }
 function media(id,where,index,label){
  const data=prepared.data.media[id],image=element('img');
  image.setAttribute('alt',label+' — '+(data.alt||data.title||'Registro Franco Romeu'));
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
  section.style.height=(100+(items.length-1)*85)+'svh';
  const pin=element('div','frms-pin'),sides=[];
  for(const side of ['left','right']){
   const host=element('div','frms-side');host.dataset.frmsSide=side;host.setAttribute('aria-hidden','true');
   items.forEach(function(pair,i){
    const frame=element('figure','frms-frame');frame.dataset.frmsOrder=String(i);
    frame.style.zIndex=String(i+1);
    frame.appendChild(media(side==='left'?pair.before_media_id:pair.after_media_id,side,i,pair.title));
    host.appendChild(frame);
   });
   sides.push(host);pin.appendChild(host);
  }
  pin.appendChild(element('div','frms-divider'));
  const top=element('div','frms-top');
  top.append(element('span','',kind==='home'?'ꟻR / TRANSFORMAÇÕES':'ꟻR / ARQUIVO COMPLETO'),element('span','',kind==='home'?'ANTES · PROJETO · EXECUÇÃO':'ANTES / DEPOIS'),element('span',''));
  top.lastChild.dataset.frmsCounter='';
  pin.appendChild(top);
  const cards=element('div','frms-cards');
  items.forEach(function(pair,i){
   const card=element('article','frms-card');card.dataset.frmsOrder=String(i);card.style.zIndex=String(15+i);
   card.setAttribute('aria-hidden',i?'true':'false');if(i)card.inert=true;
   const header=element('div','frms-card-top');
   header.append(element('span','',kind==='home'?'ꟻR / SELEÇÃO':'ꟻR / ACERVO'),element('span','frms-card-index',String(i+1).padStart(2,'0')));
   const copy=element('div','frms-card-copy');
   copy.append(element('p','frms-card-kicker',pair.environment||'ARTE + ENGENHARIA'));
   copy.append(element('h2','frms-card-title',pair.title));
   const foot=element('div','frms-card-foot');
   foot.append(element('p','',kind==='home'?'Da condição inicial ao resultado.':'Antes e depois de uma intervenção Franco Romeu.'));
   const link=element('a','', '↗');link.href=pair.route;link.setAttribute('aria-label','Abrir projeto: '+pair.title);
   foot.appendChild(link);card.append(header,copy,foot);cards.appendChild(card);
  });
  pin.appendChild(cards);
  const bottom=element('div','frms-bottom');
  bottom.append(element('span','',kind==='home'?'05 LEITURAS / ꟻR':'ACERVO DE TRANSFORMAÇÕES'));
  const progress=element('div','frms-progress');progress.appendChild(element('span'));bottom.append(progress,element('span','','SCROLL PARA EXPLORAR ↓'));pin.appendChild(bottom);
  const details=element('details','frms-index'),summary=element('summary','',kind==='home'?'Ver os cinco projetos':'Índice dos '+items.length+' projetos'),ol=element('ol');
  items.forEach(function(pair){const li=element('li'),a=element('a','',pair.title);a.href=pair.route;li.append(a);ol.appendChild(li);});
  details.append(summary,ol);pin.appendChild(details);
  section.appendChild(pin);return section;
 }
 // First-pass curation: five distinct environments; final semantic choices are a separate acceptance gate.
 const home=[],seen=new Set();
 for(const pair of pairs){
  const key=(pair.environment_ids&&pair.environment_ids[0])||pair.project_id;
  if(seen.has(key))continue;home.push(pair);seen.add(key);if(home.length===5)break;
 }
 if(home.length<5)for(const pair of pairs){if(home.includes(pair))continue;home.push(pair);if(home.length===5)break;}
 homeHost.insertAdjacentElement('afterend',build('home',home));
 portfolioHost.insertAdjacentElement('beforebegin',build('portfolio',pairs));
 const link=element('link');link.rel='stylesheet';link.href='/assets/css/fr-motion-split.css';doc.head.appendChild(link);
 const script=element('script');script.src='/assets/js/fr-motion-split.js';script.defer=true;doc.body.appendChild(script);
 return {home:home.length,portfolio:pairs.length,homePairIds:home.map(p=>p.pair_id)};
};
