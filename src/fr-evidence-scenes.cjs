'use strict';
/* Shared evidence scenes. No budget state, formulas or canonical media records are changed. */
const fs = require('node:fs');
const path = require('node:path');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const configPath = 'content/experience/project-stages.json';
const shortTitle = text => String(text || '').replace(/^(?:Projeto executado|Estudo ilustrativo|Estudo de materialidade)\s*[—:-]\s*/i, '').replace(/\s*[—-]\s*\d{3}\s*$/, '');
function image(m, eager = false) {
  const v = m.variants.find(v => v.canonical) || m.variants.at(-1);
  return `<img ${m.media_id.startsWith('FR-LIGHT-')?'data-fres-media-id':'data-fr-media-id'}="${esc(m.media_id)}" src="/${esc(m.canonicalFile)}" width="${v.width}" height="${v.height}" alt="${esc(m.alt)}" loading="${eager?'eager':'lazy'}" decoding="async"${m.variants.length>1?' srcset="'+m.variants.map(v=>'/'+esc(v.file)+' '+v.width+'w').join(', ')+'" sizes="(max-width:750px) 92vw, 65vw"':''}>`;
}
function comparison({id, layers, mode = 'sequence', title = '', compact = false}) {
  if (!layers.length) throw Error('Evidence scene has no layers: ' + id);
  const cover = layers.at(-1).media;
  const v = cover.variants.find(v=>v.canonical) || cover.variants.at(-1);
  const initial = mode==='light'?0:500;
  const initialIndex = Math.round(initial/1000*(layers.length-1));
  return `<div class="fres-scene${compact?' fres-compact':''}" data-fres-scene="${esc(id)}" data-fres-mode="${esc(mode)}" data-fres-labels="${esc(JSON.stringify(layers.map(l=>l.label)))}">
    <div class="fres-viewport" style="--fres-ratio:${v.width}/${v.height}">
      ${layers.map((l,i)=>`<figure class="fres-layer" data-fres-layer="${i}"${mode==='sequence'?' style="opacity:1;clip-path:inset(0 '+(i?100-Math.max(0,Math.min(1,.5*(layers.length-1)-(i-1)))*100:0)+'% 0 0)"':i?' style="opacity:0"':''}>${image(l.media)}<figcaption class="${mode==='wipe'?'fres-sr':'fres-layer-origin'}">${esc(l.media.label)}</figcaption></figure>`).join('')}
      <div class="fres-stage-labels" aria-hidden="true"><span>${esc(layers[0].label)}</span><span>${esc(layers.at(-1).label)}</span></div>
      <div class="fres-line" aria-hidden="true"><span>‹ ›</span></div>
      <label class="fres-sr" for="${esc(id)}-range">${esc(title || 'Explorar as etapas deste ambiente')}</label>
      <input class="fres-range" id="${esc(id)}-range" type="range" min="0" max="1000" step="1" value="${initial}" aria-valuetext="${esc(layers[initialIndex].label)}">
    </div>
    ${mode==='wipe'?`<p class="fres-comparison-origin">${layers.map(l=>esc(l.media.label)).join(' / ')}</p>`:''}
    <div class="fres-scene-footer"><p data-fres-status aria-live="off">${esc(layers[initialIndex].label)}</p><button type="button" data-fres-resume>Seguir scroll</button></div>
    ${mode==='wipe'?'':`<div class="fres-steps" role="group" aria-label="Etapas de ${esc(title||'comparação')}">${layers.map((l,i)=>`<button type="button" data-fres-set="${layers.length===1?0:i/(layers.length-1)*1000}" aria-pressed="${i===initialIndex}"><span>${String(i+1).padStart(2,'0')}</span>${esc(l.label)}</button>`).join('')}</div>`}
  </div>`;
}
function partition(pairs) {
  // Alternate sorted environments before dividing, so each half has a variety of spaces.
  const buckets = new Map();
  for(const p of pairs){const key=p.environment_ids?.[0] || p.environment || 'outros';if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(p);}
  const ordered=[], lists=[...buckets.entries()].sort(([a],[b])=>a.localeCompare(b,'pt-BR')).map(([,v])=>v);
  for(let i=0;lists.some(list=>list[i]);i++)for(const list of lists)if(list[i])ordered.push(list[i]);
  return {organic:ordered.slice(0,Math.ceil(ordered.length/2)),split:ordered.slice(Math.ceil(ordered.length/2))};
}
function resolveProjects(prepared) {
  const config=JSON.parse(fs.readFileSync(configPath,'utf8'));
  return config.scenes.map(s=>{
    const layers=s.stages.filter(stage=>stage.media_id && prepared.data.media[stage.media_id]).map(stage=>({label:stage.label,media:prepared.data.media[stage.media_id],stage:stage.stage}));
    const views=(s.views || []).filter(id=>prepared.data.media[id]);
    if(!layers.length)throw Error('Project scene missing approved media: '+s.id);
    return {...s,layers,views};
  });
}
function projectScenes(prepared, prefix='fres-project') {
  const scenes=resolveProjects(prepared);
  return `<section class="fres fres-project-archive" id="${esc(prefix)}-stages" aria-labelledby="${esc(prefix)}-title"><header class="fres-section-head"><p class="fres-eyebrow">PROJETOS 3D / COZINHA + LAVANDERIA</p><h2 id="${esc(prefix)}-title">O espaço.<br>Em cada etapa.</h2><p>Do ambiente inicial à leitura do resultado. Percorra os setores e arraste para observar as mudanças.</p></header><div class="fres-project-grid">${scenes.map((s,i)=>`<article class="fres-project" data-fres-project="${esc(s.id)}"><div class="fres-project-copy"><p class="fres-eyebrow">${String(i+1).padStart(2,'0')} / ${esc(s.sector)}</p><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><p class="fres-origin">${esc(s.note)}</p></div><div>${comparison({id:prefix+'-'+s.id,layers:s.layers,title:s.title})}${s.views.length>1?`<details class="fres-views"><summary>Outras vistas do projeto 3D · ${s.views.length}</summary><div class="fres-view-buttons">${s.views.map(id=>`<figure><button type="button" data-fres-view="${esc(id)}" aria-label="Ver ${esc(prepared.data.media[id].title)}">${image(prepared.data.media[id])}<span>${esc(prepared.data.media[id].title)}</span></button><figcaption class="fres-origin">${esc(prepared.data.media[id].label)}</figcaption></figure>`).join('')}</div></details>`:''}</div></article>`).join('')}</div></section>`;
}
function organicHTML(prepared, pairs) {
  const media=prepared.data.media;
  const posts=Array.from({length:Math.ceil(pairs.length/3)},(_,i)=>pairs.slice(i*3,i*3+3));
  const formats=['portrait','compact','story'];
  const postHTML=posts.map((entries,i)=>{
    const id='fres-feed-'+i,format=formats[i%formats.length];
    const slides=entries.map((p,j)=>`<article class="fres-organic-card fres-feed-slide" data-fres-pair="${esc(p.pair_id)}" role="group" aria-roledescription="slide" aria-label="${j+1} de ${entries.length}: ${esc(p.environment)}">${comparison({id:'fres-ba-'+p.pair_id,layers:[{label:media[p.before_media_id].label,media:media[p.before_media_id]},{label:media[p.after_media_id].label,media:media[p.after_media_id]}],mode:'wipe',title:'Comparar antes e depois de '+p.environment})}<div class="fres-card-description"><p class="fres-eyebrow">${esc(p.environment)}</p><h3>${esc(shortTitle(p.title))}</h3><p>${esc((p.interventions||[]).join(' · ') || p.result)}</p><a class="fres-text-link" href="${esc(p.route)}">Conhecer este ambiente ↗</a></div></article>`).join('');
    const post=`<section class="fres-feed-post fres-feed-${format}" data-fres-feed="${id}" aria-label="Antes e depois · publicação ${i+1} de ${posts.length}"><header class="fres-feed-header"><div><strong>Franco Romeu</strong><span>Arte + Engenharia / Antes & Depois</span></div><span class="fres-feed-edition">${String(i+1).padStart(2,'0')} / ${String(posts.length).padStart(2,'0')}</span></header><div class="fres-feed-track" id="${id}-track" role="group" aria-roledescription="carrossel" aria-label="Comparativos da publicação ${i+1}" tabindex="0" aria-describedby="fres-feed-help">${slides}</div><footer class="fres-feed-controls"><button type="button" data-fres-feed-prev aria-label="Comparativo anterior" aria-controls="${id}-track">‹</button><div class="fres-feed-dots" role="group" aria-label="Escolher comparativo">${entries.map((p,j)=>`<button type="button" data-fres-feed-set="${j}" aria-label="Mostrar comparativo ${j+1}: ${esc(p.environment)}" aria-pressed="${j===0}" aria-controls="${id}-track"><span></span></button>`).join('')}</div><p data-fres-feed-count aria-live="polite" aria-atomic="true">1 / ${entries.length}</p><button type="button" data-fres-feed-next aria-label="Próximo comparativo" aria-controls="${id}-track">›</button></footer></section>`;
    const services=[...new Set(entries.flatMap(p=>p.interventions||[]))].slice(0,4);
    const note=(i+1)%3===0?`<aside class="fres-feed-note"><p class="fres-eyebrow">POR TRÁS DA MUDANÇA</p><h3>${['O detalhe faz parte do todo.','Matéria e método.','Cada escolha tem uma função.'][Math.floor(i/3)]}</h3><p>${esc(services.join(' · ') || entries[0].result)}</p><a class="fres-text-link" href="${esc(entries[0].route)}">Explorar materiais e serviços ↗</a></aside>`:'';
    return post+note;
  }).join('');
  return `<section class="fres fres-organic fres-feed" id="fres-before-after" aria-labelledby="fres-organic-title"><span id="frpm-before-after" class="fres-anchor" aria-hidden="true"></span><header class="fres-section-head"><p class="fres-eyebrow">PORTFÓLIO / ANTES & DEPOIS</p><h2 id="fres-organic-title">Ambientes.<br>Em transformação.</h2><p>Um feed de escolhas e resultados. Arraste a linha para comparar; deslize fora dela para ver o próximo ambiente.</p><p class="fres-sr" id="fres-feed-help">Use as setas ou deslize as fotos para trocar de comparativo. No controle sobre a imagem, as setas comparam antes e depois.</p><a href="#frms-portfolio" class="fres-text-link">Ir para o duplo scroll ↓</a></header><div class="fres-organic-grid fres-feed-list">${postHTML}</div><p class="fres-continuation">O percurso continua.<span>Outras ${prepared.data.pairs.length-pairs.length} transformações no duplo scroll.</span></p></section>`;
}
function environmentScenes(group,data,prefix='fres-environment') {
  const scenes=group.trails.flatMap(trail=>{
    const steps=group.sequence.filter(step=>step.trail_id===trail.trail_id);
    const material=steps.find(step=>step.type==='MATERIAL'),application=steps.find(step=>step.type==='APPLICATION'||step.type==='EXAMPLE');
    if(!material||!application)return [];
    const cover=group.cover || group.sequence.find(step=>step.type==='COVER')?.media_id;
    if(!data.media[cover])return [];
    const layers=[{label:'Local · '+group.name,media:data.media[cover]},{label:'Materiais · '+trail.materials.join(' + '),media:data.media[material.media_id]},{label:'Ambiente · '+data.media[application.media_id].label,media:data.media[application.media_id]}];
    return [{id:trail.trail_id,group:group.physical,mediaIds:layers.map(l=>l.media.media_id),title:trail.title,layers,template:comparison({id:'__INSTANCE__',layers,title:trail.title,compact:true})}];
  });
  return scenes;
}
function environmentHTML(group,data,prefix='fres-environment') {
  const scenes=environmentScenes(group,data,prefix);
  return `<section class="fres fres-project-archive"><header class="fres-section-head"><p class="fres-eyebrow">AMBIENTE / MATERIAL / COMPOSIÇÃO</p><h2>${esc(group.name)}.<br>Camada por camada.</h2><p>Uma leitura do local, da paleta de materiais e de sua composição no ambiente.</p></header><div class="fres-project-grid">${scenes.map((s,i)=>`<article class="fres-project"><div class="fres-project-copy"><p class="fres-eyebrow">${String(i+1).padStart(2,'0')} / ${esc(group.name)}</p><h3>${esc(shortTitle(s.title))}</h3><p>${esc(group.trails.find(t=>t.trail_id===s.id).materials.join(' · '))}</p><a class="fres-text-link" href="/orcamento?fr-reference=${esc(group.trails.find(t=>t.trail_id===s.id).project_id)}">Conversar sobre esta composição ↗</a></div>${comparison({id:prefix+'-'+s.id,layers:s.layers,title:s.title})}</article>`).join('')}</div></section>`;
}
function lightStory(prefix='fres-light') {
  const cfg=JSON.parse(fs.readFileSync('content/experience/light-sequence.json','utf8'));
  const layers=cfg.states.map(state=>({label:state.hour+' / '+state.title,media:{media_id:'FR-LIGHT-'+state.hour,label:'Estudo visual de iluminação',canonicalFile:state.file,alt:state.alt,variants:[{width:cfg.width,height:cfg.height,canonical:true}]}}));
  return `<section class="fres fres-light-story" id="${esc(prefix)}" data-fres-story aria-labelledby="${esc(prefix)}-title"><div class="fres-light-sticky"><div class="fres-light-copy"><p class="fres-eyebrow">AMBIENTES / UM DIA NA MESMA COZINHA</p><h2 id="${esc(prefix)}-title">O espaço permanece.<br>A luz transforma.</h2><p>Do primeiro brilho do dia à luz que acolhe à noite. Observe o teto, os móveis e os sóculos.</p><p class="fres-origin">Estudo visual de iluminação sobre a cozinha Franco Romeu.</p><a class="fres-text-link" href="/orcamento?fr-reference=FR-C001">Planejar a luz do meu ambiente ↗</a></div><div class="fres-light-comparison">${comparison({id:prefix+'-scene',layers,mode:'light',title:'Horário da luz da cozinha'})}</div></div></section>`;
}
function annotations(prepared) {
  const fixed=JSON.parse(fs.readFileSync('content/experience/image-hotspots.json','utf8'));
  const out={};
  for(const m of Object.values(prepared.data.media)){
    const materialNames=(m.material_ids||[]).map(id=>prepared.l.maps.materials.get(id)?.name).filter(Boolean);
    const services=(m.service_ids||[]).map(id=>prepared.l.maps.services.get(id)?.name).filter(Boolean);
    const pins=m.stage==='BEFORE'?[{title:'Condição inicial',copy:m.caption}]:fixed[m.media_id] || [{title:materialNames.join(' + ') || shortTitle(m.title),copy:m.caption + (materialNames.length?' Materiais desta composição: '+materialNames.join(' · ')+'.':'')},...(services.length?[{title:'Serviços deste ambiente',copy:services.join(' · ')+'. Leve esta referência à definição do seu projeto.'}]:[])];
    out[m.media_id]={label:m.label,title:m.title,pins};
  }
  for(const state of JSON.parse(fs.readFileSync('content/experience/light-sequence.json','utf8')).states)out['FR-LIGHT-'+state.hour]={label:'Estudo visual de iluminação',title:state.title,pins:fixed['FR-M-986CF342224E81F1']};
  return out;
}
function addResources(doc) {
  if(!doc.querySelector('link[href="/assets/css/fr-evidence-scenes.css"]'))doc.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="/assets/css/fr-evidence-scenes.css">');
  if(!doc.querySelector('script[src="/assets/js/fr-evidence-library.js"]'))doc.body.insertAdjacentHTML('beforeend','<script defer src="/assets/js/fr-evidence-library.js"></script><script defer src="/assets/js/fr-evidence-scenes.js"></script>');
}
function install(doc,prepared) {
  const {organic,split}=partition(prepared.data.pairs);
  const root=doc.getElementById('frms-portfolio');if(!root)throw Error('Evidence: canonical split scene missing');
  const keep=new Set(split.map(p=>p.pair_id));
  const originalCards=[...root.querySelectorAll('.frms-card')];
  const removedOrders=new Set(originalCards.filter(card=>!keep.has(card.dataset.frmsPairId)).map(card=>card.dataset.frmsOrder));
  originalCards.filter(card=>removedOrders.has(card.dataset.frmsOrder)).forEach(card=>card.remove());
  root.querySelectorAll('.frms-frame').forEach(frame=>{if(removedOrders.has(frame.dataset.frmsOrder))frame.remove();});
  const indexEntries=[...root.querySelectorAll('.frms-index li')];indexEntries.forEach((li,i)=>{if(removedOrders.has(String(i)))li.remove();});
  // Preserve the controller and each remaining image node, with contiguous indices.
  for(const parent of [...root.querySelectorAll('.frms-side'),root.querySelector('.frms-cards')])
    [...parent.children].forEach((node,i)=>{node.dataset.frmsOrder=String(i);node.style.zIndex=String(parent.classList.contains('frms-cards')?15+i:i+1);if(parent.classList.contains('frms-cards')){node.setAttribute('aria-hidden',String(i!==0));if(i)node.setAttribute('inert','');else node.removeAttribute('inert');node.querySelector('.frms-card-index').textContent=String(i+1).padStart(2,'0');}});
  root.querySelectorAll('[data-frms-jump]').forEach((button,i)=>{button.dataset.frmsJump=String(i);button.textContent=button.textContent.replace(/^\d+/,String(i+1).padStart(2,'0'));});
  root.dataset.frmsCount=String(split.length);root.dataset.frmsScrollHeight=String(split.length*100);root.style.height=split.length*100+'svh';
  root.querySelector('[data-frms-counter]').textContent='01 / '+String(split.length).padStart(2,'0');
  root.querySelector('.frms-bottom>span').textContent=split.length+' TRANSFORMAÇÕES / ꟻR';
  root.querySelector('.frms-index>summary').textContent='Índice das '+split.length+' transformações';
  root.querySelector('#frpm-before-after')?.remove();
  root.insertAdjacentHTML('beforebegin',organicHTML(prepared,organic));
  const p3d=doc.getElementById('view-projetos3d');
  p3d.querySelector('.p3d-hero').insertAdjacentHTML('afterend','<nav class="fres-archive-jump" aria-label="Explorar o acervo 3D"><a href="#fres-project-stages">Demolido → Projeto 3D → Render → Resultado <span>Explorar as etapas ↓</span></a></nav>');
  const caderno=doc.getElementById('frmedia-caderno');
  if(caderno){caderno.insertAdjacentHTML('beforebegin',projectScenes(prepared));caderno.remove();}
  else p3d.querySelector('.p3d-process').insertAdjacentHTML('beforebegin',projectScenes(prepared));
  const environments=doc.getElementById('view-ambientes');environments.querySelector('.amb-hero').insertAdjacentHTML('afterend',lightStory());
  addResources(doc);
  const scenes=resolveProjects(prepared);
  const library={version:1,annotations:annotations(prepared),scenes:scenes.map(s=>({id:s.id,title:s.title,views:s.views,layerIds:s.layers.map(l=>l.media.media_id),template:comparison({id:'__INSTANCE__',layers:s.layers,title:s.title,compact:true})})),environments:prepared.data.groups.flatMap(g=>environmentScenes(g,prepared.data).map(({layers,...entry})=>entry))};
  fs.writeFileSync(path.join(prepared.output,'assets/js/fr-evidence-library.js'),'window.FR_EVIDENCE_LIBRARY='+JSON.stringify(library).replaceAll('<','\\u003c')+';\n');
  // Only generated, project-bound derivatives and licensed font files are copied.
  for(const dir of ['assets/experience/light-sequence','assets/fonts']){
    if(fs.existsSync(dir))fs.cpSync(dir,path.join(prepared.output,dir),{recursive:true});
  }
  return {organic:organic.length,split:split.length,projectScenes:scenes.length,annotations:Object.keys(library.annotations).length};
}
module.exports={install,comparison,projectScenes,environmentScenes,environmentHTML,lightStory,annotations,addResources,partition,resolveProjects};
