/* Isolated raster media case. Does not mutate FR registries or budget state. */
(function (w, d) {
  'use strict';
  var activeDialog=null;
  var liveSections=new WeakSet();
  function closeActive(){if(!activeDialog)return;var state=activeDialog;activeDialog=null;state.dialog.close();d.body.style.overflow=state.overflow;if(state.opener&&state.opener.isConnected)state.opener.focus({preventScroll:true});}
  function node(tag, cls, text) {
    var el = d.createElement(tag); if (cls) el.className = cls;
    if (text != null) el.textContent = text; return el;
  }
  var styles = '.frmedia{--frg:#0a2f26;--frb:#e6d6b5;--fra:#c9a24d;background:var(--frg);color:var(--frb);padding:clamp(24px,5vw,72px);font-family:Georgia,serif}.frmedia *{box-sizing:border-box}.frmedia h2{font-size:clamp(30px,4vw,58px);font-weight:400;max-width:850px;margin:18px 0}.frmedia p{font-family:Arial,sans-serif;line-height:1.7;max-width:800px}.frmedia-kicker,.frmedia-label{color:var(--fra);font:12px/1.5 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}.frmedia-controls{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0}.frmedia button{cursor:pointer;background:transparent;color:inherit;border:1px solid #c9a24d66;border-radius:3px;padding:12px 18px;font:14px Arial,sans-serif}.frmedia button:focus-visible{outline:3px solid var(--fra);outline-offset:4px}.frmedia-controls button[aria-pressed=true]{background:var(--fra);color:var(--frg)}.frmedia-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.frmedia-card{margin:0;background:#ffffff08;border:1px solid #e6d6b522}.frmedia .frmedia-open{display:block;width:100%;padding:0;border:0;position:relative}.frmedia-card img{width:100%;height:390px;object-fit:contain;display:block;background:#10251f}.frmedia-label{display:block;padding:12px 18px}.frmedia-card figcaption{padding:8px 18px 20px;font-size:20px}.frmedia-card small{font:12px/1.6 Arial,sans-serif;display:block;margin-top:8px;opacity:.8}.frmedia-dialog{max-width:min(94vw,1100px);max-height:94vh;border:1px solid #c9a24d;background:#0a2f26;color:#e6d6b5;padding:24px}.frmedia-dialog::backdrop{background:#000c}.frmedia-dialog img{display:block;max-width:85vw;max-height:70vh;object-fit:contain;margin:16px auto}.frmedia-dialog button{background:#e6d6b5;color:#0a2f26;border:0;padding:12px 18px;cursor:pointer}.frmedia-dialog p{font:14px/1.7 Arial,sans-serif;max-width:850px}.frmedia-status{font:12px Arial,sans-serif}@media(max-width:950px){.frmedia-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:580px){.frmedia-grid{grid-template-columns:1fr}.frmedia-card img{height:440px}}@media(prefers-reduced-motion:reduce){.frmedia *{scroll-behavior:auto!important}}';
  styles+=' .frmedia-case-link{display:inline-flex;align-items:center;min-height:44px;padding:10px 0;color:#e0bf79;text-decoration:underline}';
  styles+=' .frmedia{background:transparent;font-family:Rokkitt,Georgia,serif}.frmedia h2{font:700 clamp(34px,4vw,64px)/.98 "Stardos Stencil",Georgia,serif;text-transform:uppercase;color:#fff}.frmedia p,.frmedia-card small,.frmedia-dialog p{font-family:Rokkitt,Georgia,serif}.frmedia-grid{gap:12px}.frmedia-card{border:0;background:#071b16}.frmedia-card img{object-fit:cover;background:#061711}.frmedia-card figcaption{padding:14px 18px}.frmedia button{min-width:44px;min-height:44px;font-family:"Share Tech Mono",monospace}.frmedia-dialog{width:min(96vw,1440px);max-width:96vw;max-height:96dvh;border:1px solid #c9a24d}.frmedia-dialog img{max-width:min(90vw,1200px);max-height:76dvh}';
  function mount(target, catalog, options) {
    var host = typeof target === 'string' ? d.querySelector(target) : target;
    if (!host || !catalog || !Array.isArray(catalog.assets)) return null;
    options = options || {};
    var id = options.id || 'frmedia-cozinha-lavanderia';
    var prior=d.getElementById(id);if(prior&&liveSections.has(prior)&&prior.parentElement===host)return prior;
    if(prior){if(activeDialog&&prior.contains(activeDialog.dialog))closeActive();prior.remove();}
    if (!d.getElementById('frmedia-style')) {var st=node('style');st.id='frmedia-style';st.textContent=styles;d.head.appendChild(st);}
    var section=node('section','frmedia');section.id=id;section.dataset.frMediaLive='true';section.setAttribute('aria-labelledby',id+'-title');
    section.appendChild(node('div','frmedia-kicker','FRANCO ROMEU / ARQUIVO DE VISUALIZAÇÃO'));
    var h=node('h2',null,options.title||'Cozinha e lavanderia: leitura do projeto');h.id=id+'-title';section.appendChild(h);
    section.appendChild(node('p',null,options.lead||'Vistas de projeto organizadas por ambiente, material e detalhe.'));
    if(id==='frmedia-cozinha-lavanderia'){var caseLink=node('a',null,'Ver leitura do projeto em página própria →');caseLink.href='/projetos/cozinha-lavanderia';caseLink.className='frmedia-case-link';section.appendChild(caseLink);}
    var controls=node('div','frmedia-controls');controls.setAttribute('aria-label','Filtrar imagens por setor');
    var status=node('p','frmedia-status');status.setAttribute('aria-live','polite');
    var grid=node('div','frmedia-grid');var dialog=node('dialog','frmedia-dialog');dialog.setAttribute('aria-label','Detalhe do projeto');
    var close=node('button',null,'Fechar detalhe');close.type='button';dialog.appendChild(close);
    var detailImage=node('img');detailImage.alt='';dialog.appendChild(detailImage);var detailLabel=node('p');dialog.appendChild(detailLabel);
    var opener=null;
    close.addEventListener('click',function(){dialog.close();});
    var oldOverflow='';
    dialog.addEventListener('close',function(){if(activeDialog&&activeDialog.dialog===dialog){activeDialog=null;d.body.style.overflow=oldOverflow;if(opener&&opener.isConnected)opener.focus({preventScroll:true});}});
    dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();});
    var prefix=options.assetPrefix || '';
    function source(v){return prefix+v.file;}
    var allowed=catalog.assets.filter(function(a){return a.status==='READY_WITH_LABEL' && a.publication_label && a.variants && a.variants.length && (!options.mediaIds||options.mediaIds.includes(a.media_id)||options.mediaIds.includes(a.legacy_media_id)) && (!options.studyOnly||options.narrative||a.represented_stage==='projeto_3d') && (!options.sector||a.sector_id===options.sector) && (!options.frontalOnly||a.front_view===true);});
    if(options.carousel){grid.classList.add('frmedia-carousel');grid.tabIndex=0;grid.setAttribute('role','region');grid.setAttribute('aria-label','Etapas e detalhes ilustrativos do mesmo projeto');var cc=node('div','frmedia-carousel-controls'),playing=null;function stop(){if(playing)clearInterval(playing);playing=null;play.textContent='Reproduzir';play.setAttribute('aria-pressed','false');}function move(direction){var step=grid.firstElementChild?grid.firstElementChild.getBoundingClientRect().width+24:380;grid.scrollBy({left:direction*step,behavior:w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}var prev=node('button',null,'← Anterior'),next=node('button',null,'Próximo →'),play=node('button',null,'Reproduzir');[prev,next,play].forEach(function(b){b.type='button';cc.appendChild(b)});play.setAttribute('aria-pressed','false');prev.addEventListener('click',function(){stop();move(-1)});next.addEventListener('click',function(){stop();move(1)});play.addEventListener('click',function(){if(playing){stop();return}if(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches){move(1);return}play.textContent='Pausar';play.setAttribute('aria-pressed','true');playing=setInterval(function(){if(d.hidden||!grid.isConnected||grid.closest('.view-section')&&!grid.closest('.view-section').classList.contains('active')){stop();return}if(grid.scrollLeft+grid.clientWidth>=grid.scrollWidth-8)grid.scrollTo({left:0});else move(1)},6000)});grid.addEventListener('pointerdown',stop,{passive:true});grid.addEventListener('keydown',function(e){if(e.target===grid&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();stop();move(e.key==='ArrowRight'?1:-1)}});d.addEventListener('frViewChanged',stop);d.addEventListener('visibilitychange',function(){if(d.hidden)stop()});section.appendChild(cc);}
    var currentGroup='ALL',nucleus='ALL';
    function render(group){
      currentGroup=group;
      controls.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.group===group));});
      grid.replaceChildren();var selection=allowed.filter(function(a){return group==='ALL'||(group==='TEC'?a.represented_stage==='projeto_3d':group==='BEFORE'?a.represented_stage==='antes_existente':group==='APPLICATION'?a.represented_stage==='depois_terminado':a.sector_id===group);});
      if(options.narrative)selection.sort(function(a,b){var order={antes_existente:0,projeto_3d:1,depois_terminado:2};return (order[a.represented_stage]??3)-(order[b.represented_stage]??3);});
      selection=selection.filter(function(a){return nucleus==='ALL'||a.object_ids.includes(nucleus)});
      selection.forEach(function(a){
        var card=node('figure','frmedia-card'),button=node('button','frmedia-open');button.type='button';button.setAttribute('aria-label','Abrir detalhe: '+a.alt);
        var variants=a.variants.slice().sort(function(x,y){return x.width-y.width;});
        var img=node('img');img.alt=a.alt;img.title=a.title;if(w.FR_MEDIA_LIBRARY)img.dataset.frMediaId=a.media_id;img.loading='lazy';img.decoding='async';img.width=variants[variants.length-1].width;img.height=variants[variants.length-1].height;img.style.maxWidth=variants[variants.length-1].width+'px';img.style.marginInline='auto';
        img.src=source(variants[Math.min(1,variants.length-1)]);img.srcset=variants.map(function(v){return source(v)+' '+v.width+'w';}).join(', ');img.sizes='(max-width:580px) 90vw, (max-width:950px) 45vw, 30vw';button.appendChild(img);
        button.addEventListener('click',function(){closeActive();opener=button;detailImage.src=source(variants[variants.length-1]);detailImage.alt=a.alt;detailImage.width=variants[variants.length-1].width;detailImage.height=variants[variants.length-1].height;detailImage.style.width='auto';detailImage.style.height='auto';detailImage.style.maxWidth='min(80vw,'+variants[variants.length-1].width+'px)';detailLabel.textContent=a.publication_label+' — '+a.description;oldOverflow=d.body.style.overflow;activeDialog={dialog:dialog,overflow:oldOverflow,opener:opener};d.body.style.overflow='hidden';dialog.showModal();close.focus();});
        card.appendChild(button);card.appendChild(node('span','frmedia-label',a.publication_label));var cap=node('figcaption',null,a.title);cap.appendChild(node('small',null,a.description));card.appendChild(cap);if(w.FR_MEDIA_LIBRARY){var link=node('a',null,'Ler o mesmo projeto →');link.href='/projetos/cozinha-lavanderia';card.appendChild(link);}grid.appendChild(card);
      });status.textContent=selection.length+' imagens neste recorte.';
    }
    var filters=[['ALL','Todos'],['COZ_ESQ','Cozinha esquerda'],['COZ_DIR','Cozinha direita'],['LAV','Lavanderia'],['INT','Integração'],['TEC','Estudos 3D']];if(options.narrative)filters.push(['BEFORE','Condição inicial representada'],['APPLICATION','Resultado ilustrativo']);filters.forEach(function(pair){var b=node('button',null,pair[1]);b.type='button';b.dataset.group=pair[0];b.addEventListener('click',function(){render(pair[0]);});controls.appendChild(b);});
    controls.hidden=!!options.mediaIds||!!options.studyOnly&&!options.narrative||!!options.sector;
    if(w.FR_MEDIA_LIBRARY&&!controls.hidden){var label=node('label',null,'Núcleo do projeto '),select=node('select');select.setAttribute('aria-label','Selecionar núcleo do projeto');var option=node('option',null,'Todos os núcleos');option.value='ALL';select.appendChild(option);var names={OBJ_ILHA_COOKTOP_01:'Ilha e cooktop',OBJ_ILUMINACAO_DUPLO_L_01:'Iluminação proposta',OBJ_FRONTAO_COZINHA_DIREITO_01:'Frontão direito',ENV_COZINHA_LAVANDERIA_01:'Integração cozinha/lavanderia',OBJ_TORRE_QUENTE_01:'Torre e módulos',OBJ_RIPADO_LED_PENDENTE_01:'Ripado e luz',OBJ_MARCENARIA_COZINHA_ESQUERDA_01:'Marcenaria esquerda',OBJ_BANCADA_COZINHA_L_01:'Bancada em L',OBJ_CUBA_KOKAY_INTEGRACAO_01:'Integração de cuba',OBJ_MARCENARIA_LAVANDERIA_01:'Marcenaria da lavanderia',OBJ_GELADEIRA_01:'Módulo da geladeira',OBJ_BANCADA_LAVANDERIA_01:'Bancada da lavanderia'};Array.from(new Set(allowed.flatMap(function(a){return a.object_ids}))).forEach(function(id){if(!names[id])return;var o=node('option',null,names[id]);o.value=id;select.appendChild(o)});select.addEventListener('change',function(){nucleus=select.value;render(currentGroup)});label.appendChild(select);controls.appendChild(label);}
    section.append(controls,status,grid,dialog);liveSections.add(section);host.appendChild(section);render('ALL');return section;
  }
  var hostObserver=null,directObserver=null;
  function integrate(){
    if (!w.FR_MEDIA_CATALOG) return;
    var catalog=w.FR_MEDIA_LIBRARY?w.FR_MEDIA_LIBRARY.caseCatalog:w.FR_MEDIA_CATALOG;
    if(activeDialog){var activeView=activeDialog.dialog.closest('.view-section');if(!activeDialog.dialog.isConnected||(activeView&&!activeView.classList.contains('active')))closeActive();}
    d.querySelectorAll('.frmedia-dialog[open]').forEach(function(dialog){var view=dialog.closest('.view-section');if(view&&!view.classList.contains('active'))dialog.close();});
    var stageHost=d.getElementById('fr16-portfolio');
    var host=stageHost || d.getElementById('view-projetos');
    if(host)mount(host,catalog);
    sections.forEach(function(spec){var target=d.getElementById(spec.host);if(target)mount(target,catalog,spec);});
    var view=d.getElementById('view-projetos');
    if(view&&!hostObserver&&typeof MutationObserver==='function'){hostObserver=new MutationObserver(integrate);hostObserver.observe(view,{childList:true,subtree:true});}
    if(!directObserver&&typeof MutationObserver==='function'){directObserver=new MutationObserver(integrate);d.querySelectorAll('.view-section:not(#view-projetos)').forEach(function(v){directObserver.observe(v,{childList:true})});}
  }
  var sections=[
    {host:'view-home',id:'frmedia-home-case',title:'Um projeto, muitas decisões',mediaIds:['M_986cf34222','M_b239e59121']},
    {host:'view-projetos3d',id:'frmedia-caderno',title:'Caderno de estudos do projeto',studyOnly:true,narrative:true,carousel:true,lead:'Percurso visual de cozinha e lavanderia: condição inicial representada, estudo 3D, materialidade e aplicação proposta.'},
    {host:'fr16-portfolio',id:'frmedia-frontais',title:'Cozinha e lavanderia: vistas frontais',frontalOnly:true,lead:'Vistas frontais do mesmo projeto apresentado em Projetos 3D.'},
    {host:'view-orcamento',id:'frmedia-pedido',title:'Referência visual do pedido',mediaIds:['M_b239e59121'],lead:'Use esta vista para conversar sobre o escopo; serviço e medida são definidos no orçamento.'}
  ];
  w.FRMediaCase={mount:mount,integrate:integrate,sections:sections,styles:styles,version:'1.1.0'};
  d.addEventListener('frStage16Ready',integrate);d.addEventListener('frViewChanged',integrate);
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',integrate);else integrate();
})(window,document);
