'use strict';
const fs=require('node:fs'),path=require('node:path');
const {ORIGIN,trackingHead,composeGraph,breadcrumb}=require('../src/public-site-meta.cjs');
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cfg=()=>JSON.parse(fs.readFileSync('content/local-services.json','utf8'));
const route=id=>'/solucoes/'+id+'/';
const hub='/solucoes/';
const css='/assets/css/fr-local-services.css';
function injectDiscovery(doc){
 const data=cfg();
 if(doc.getElementById('frls-discovery'))throw Error('Local services discovery injected twice');
 const links=data.services.map(s=>'<a href="'+route(s.id)+'">'+escape(s.title)+'</a>').join('');
 const section=doc.createElement('aside');section.id='frls-discovery';section.className='frls-discovery';
 section.setAttribute('aria-label','Soluções e serviços Franco Romeu');
 section.innerHTML='<span class="frls-eyebrow">FR / SOLUÇÕES</span><h2>Matéria, método e execução.</h2><p>Conheça algumas frentes de trabalho e suas etapas técnicas. O levantamento orienta escopo e orçamento.</p><nav aria-label="Conheça nossos serviços">'+links+'<a class="frls-all" href="'+hub+'">Todas as soluções →</a></nav>';
 for(const id of ['view-home','view-sobre','view-orcamento']){
  const view=doc.getElementById(id);if(!view)throw Error('Service discovery anchor missing: '+id);
  // Only the current view is exposed by the canonical SPA router.
  view.appendChild(id==='view-home'?section.cloneNode(true):id==='view-sobre'?section.cloneNode(true):section);
 }
 const sheet=doc.createElement('link');sheet.rel='stylesheet';sheet.href=css;doc.head.appendChild(sheet);
}
function build(prepared){
 const {output,l}=prepared,data=cfg(),rows=[],map=l.maps.services;
 if(data.schema_version!=='fr-local-solutions-1.0.0'||data.services.length!==4)throw Error('Unapproved service catalog version');
 if(data.source_services!=='content/services/media-service-map.json'||data.source_organization!=='content/media/organization.json')throw Error('Local SEO provenance mismatch');
 const org=l.organization?.jsonld_base;
 if(org?.name!=='Franco Romeu'||!org.telephone||!Array.isArray(org.areaServed)||org.areaServed.length!==6)throw Error('Verified institutional source missing');
 const phone='+'+org.telephone.replace(/\D/g,'');
 const whatsapp='https://wa.me/'+org.telephone.replace(/\D/g,'');
 const areas=org.areaServed.map(a=>a.name);
 const indexable=process.env.VERCEL_ENV!=='preview';
 const schemaBase=(target,title,description,isHub,sourceId)=>[
   {'@type':isHub?'CollectionPage':'WebPage','@id':ORIGIN+target+'#page',url:ORIGIN+target,name:title,description,isPartOf:{'@id':ORIGIN+'/#website'}},
   ...(!isHub?[{'@type':'Service','@id':ORIGIN+target+'#service',serviceType:map.get(sourceId).name,name:title,provider:{'@id':ORIGIN+'/#organization'},areaServed:org.areaServed,url:ORIGIN+target}]:[]),
   breadcrumb(target,title,isHub?null:{name:'Soluções',route:hub})
 ];
 function page(target,title,description,body,sourceId){
  if(!target.startsWith(hub)||rows.some(r=>r.route===target))throw Error('Duplicate or unsafe local route '+target);
  const isHub=!sourceId;
  const structured=composeGraph({sourceGraph:prepared.sourceGraph,organization:l.organization,pageNodes:schemaBase(target,title,description,isHub,sourceId)});
  const head='<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+trackingHead()
   +'<meta name="robots" content="'+(indexable?'index,follow,max-image-preview:large':'noindex,nofollow,noimageindex')+'">'
   +'<title>'+escape(title)+' | Franco Romeu</title><meta name="description" content="'+escape(description)+'">'
   +'<link rel="canonical" href="'+ORIGIN+target+'"><meta property="og:type" content="website">'
   +'<meta property="og:title" content="'+escape(title)+'"><meta property="og:description" content="'+escape(description)+'">'
   +'<meta property="og:url" content="'+ORIGIN+target+'"><meta property="og:image" content="'+ORIGIN+'/assets/social/franco-romeu-og-site-1200x630.jpg">'
   +'<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="'+css+'">'
   +'<script type="application/ld+json">'+JSON.stringify(structured).replaceAll('<','\\u003c')+'</script>'
   +'<script src="/assets/js/fr-conversion-phase9.js" defer></script>';
  const nav='<nav class="frls-topnav" aria-label="Navegação"><a href="/">Início</a><a href="'+hub+'">Soluções</a><a href="/portfolio">Portfólio</a><a href="/orcamento">Orçamento</a></nav>';
  const markup='<!doctype html>\n<html lang="pt-BR"><head>'+head+'</head><body class="frls-page">'
   +'<a class="frls-skip" href="#conteudo">Ir ao conteúdo</a><header class="frls-header"><a href="/" class="frls-brand"><img src="/assets/brand/franco-romeu-logo-remaster-384.webp" width="56" height="56" alt=""><span>FRANCO ROMEU<small>ARTE + ENGENHARIA</small></span></a>'+nav+'</header>'
   +'<main id="conteudo">'+body+'</main><footer class="frls-footer"><span>FRANCO ROMEU / MATÉRIA E MÉTODO</span><div><a href="'+hub+'">Soluções</a><a href="/sobre">Sobre</a><a href="/orcamento">Orçamento</a><a href="'+whatsapp+'" target="_blank" rel="noopener noreferrer">WhatsApp</a></div></footer></body></html>';
  const file=path.join(output,target.slice(1),'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,markup);
  rows.push({route:target,file:path.relative(output,file),indexable,category:'local-service',media_ids:[]});
 }
 const action='<div class="frls-actions"><a class="frls-primary" href="/orcamento">Preparar orçamento →</a><a class="frls-secondary" href="'+whatsapp+'" target="_blank" rel="noopener noreferrer">Conversar no WhatsApp ↗</a></div>';
 const area='<p class="frls-area"><strong>Área de atendimento declarada:</strong> '+escape(areas.join(' · '))+'. A disponibilidade para cada endereço e escopo depende de confirmação.</p>';
 function items(rows,tag){return rows.map(([heading,text],i)=>'<article class="frls-item"><span>'+String(i+1).padStart(2,'0')+'</span><'+tag+'>'+escape(heading)+'</'+tag+'><p>'+escape(text)+'</p></article>').join('')}
 function servicePage(s){
  const link=route(s.id);
  const body='<section class="frls-hero"><div class="frls-eyebrow">SOLUÇÕES / '+escape(s.title.toUpperCase())+'</div><h1>'+escape(s.heading)+'</h1><p>'+escape(s.intro)+'</p>'+action+'</section>'
    +'<section class="frls-section"><div class="frls-section-head"><p class="frls-eyebrow">ESCOPO</p><h2>Onde essa solução se aplica.</h2></div><div class="frls-grid">'+items(s.applications,'h3')+'</div></section>'
    +'<section class="frls-section frls-process"><div class="frls-section-head"><p class="frls-eyebrow">MÉTODO</p><h2>Do levantamento ao acabamento.</h2></div><div class="frls-grid">'+items(s.steps,'h3')+'</div></section>'
    +'<section class="frls-section"><div class="frls-section-head"><p class="frls-eyebrow">CRITÉRIOS</p><h2>Decisões que exigem avaliação.</h2></div><p class="frls-note">'+escape(s.care)+'</p></section>'
    +'<section class="frls-section"><div class="frls-section-head"><p class="frls-eyebrow">DÚVIDAS COMUNS</p><h2>Antes de começar.</h2></div><div class="frls-faq">'+s.faq.map(([q,a])=>'<details><summary>'+escape(q)+'</summary><p>'+escape(a)+'</p></details>').join('')+'</div></section>'
    +'<section class="frls-end"><h2>Seu ambiente pede uma solução própria.</h2><p>O orçamento começa pela descrição do espaço, do uso e do objetivo. Não há preço fechado, prazo ou especificação sem levantamento.</p>'+area+action+'</section>';
  page(link,s.heading,s.meta,body,s.id);
 }
 const ids=new Set();
 for(const s of data.services){
  if(!map.has(s.id)||map.get(s.id).name!==s.title&&s.id!=='pisos'&&s.id!=='revestimentos-e-acabamentos')throw Error('Unverified local service id/title '+s.id);
  if(ids.has(s.id)||!(/^[a-z0-9-]+$/).test(s.id))throw Error('Invalid local slug '+s.id);
  if(s.applications.length!==3||s.steps.length!==4||s.faq.length!==2)throw Error('Local service page incomplete '+s.id);
  ids.add(s.id);
 }
 const cards=data.services.map((s,i)=>'<article class="frls-item"><span>'+String(i+1).padStart(2,'0')+' / SERVIÇO</span><h2><a href="'+route(s.id)+'">'+escape(s.title)+' →</a></h2><p>'+escape(s.meta)+'</p></article>').join('');
 const hubBody='<section class="frls-hero"><p class="frls-eyebrow">FR / SOLUÇÕES / SÃO PAULO E REGIÃO</p><h1>Soluções em matéria, técnica e permanência.</h1><p>Reformas e interiores pedem leitura do espaço, compatibilização entre serviços e atenção à execução. Explore as frentes de trabalho e seus critérios para iniciar uma conversa de orçamento com a Franco Romeu.</p>'+action+'</section>'
   +'<section class="frls-section"><div class="frls-section-head"><p class="frls-eyebrow">ESCOLHA UM CAMINHO</p><h2>O que seu ambiente exige.</h2></div><div class="frls-grid">'+cards+'</div></section>'
   +'<section class="frls-end"><h2>Uma proposta começa com diagnóstico.</h2><p>As informações dessas páginas descrevem possibilidades de serviço; material, escopo, logística e investimento são definidos por caso.</p>'+area+action+'</section>';
 page(hub,'Soluções para reformas e interiores','Conheça serviços de marcenaria, drywall, pisos e revestimentos da Franco Romeu em São Paulo e região.',hubBody,null);
 for(const s of data.services)servicePage(s);
 return rows;
}
module.exports={build,injectDiscovery};
