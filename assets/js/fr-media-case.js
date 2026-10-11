/* Isolated raster media case. Does not mutate FR registries or budget state. */
(function (w, d) {
  'use strict';
  var activeDialog=null;
  function closeActive(){if(!activeDialog)return;var state=activeDialog;activeDialog=null;state.dialog.close();d.body.style.overflow=state.overflow;if(state.opener&&state.opener.isConnected)state.opener.focus({preventScroll:true});}
  function node(tag, cls, text) {
    var el = d.createElement(tag); if (cls) el.className = cls;
    if (text != null) el.textContent = text; return el;
  }
  var styles = '.frmedia{--frg:#0a2f26;--frb:#e6d6b5;--fra:#c9a24d;background:var(--frg);color:var(--frb);padding:clamp(24px,5vw,72px);font-family:Georgia,serif}.frmedia *{box-sizing:border-box}.frmedia h2{font-size:clamp(30px,4vw,58px);font-weight:400;max-width:850px;margin:18px 0}.frmedia p{font-family:Arial,sans-serif;line-height:1.7;max-width:800px}.frmedia-kicker,.frmedia-label{color:var(--fra);font:12px/1.5 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}.frmedia-controls{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0}.frmedia button{cursor:pointer;background:transparent;color:inherit;border:1px solid #c9a24d66;border-radius:3px;padding:12px 18px;font:14px Arial,sans-serif}.frmedia button:focus-visible{outline:3px solid var(--fra);outline-offset:4px}.frmedia-controls button[aria-pressed=true]{background:var(--fra);color:var(--frg)}.frmedia-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.frmedia-card{margin:0;background:#ffffff08;border:1px solid #e6d6b522}.frmedia .frmedia-open{display:block;width:100%;padding:0;border:0;position:relative}.frmedia-card img{width:100%;height:390px;object-fit:contain;display:block;background:#10251f}.frmedia-label{display:block;padding:12px 18px}.frmedia-card figcaption{padding:8px 18px 20px;font-size:20px}.frmedia-card small{font:12px/1.6 Arial,sans-serif;display:block;margin-top:8px;opacity:.8}.frmedia-dialog{max-width:min(94vw,1100px);max-height:94vh;border:1px solid #c9a24d;background:#0a2f26;color:#e6d6b5;padding:24px}.frmedia-dialog::backdrop{background:#000c}.frmedia-dialog img{display:block;max-width:85vw;max-height:70vh;object-fit:contain;margin:16px auto}.frmedia-dialog button{background:#e6d6b5;color:#0a2f26;border:0;padding:12px 18px;cursor:pointer}.frmedia-dialog p{font:14px/1.7 Arial,sans-serif;max-width:850px}.frmedia-status{font:12px Arial,sans-serif}@media(max-width:950px){.frmedia-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:580px){.frmedia-grid{grid-template-columns:1fr}.frmedia-card img{height:440px}}@media(prefers-reduced-motion:reduce){.frmedia *{scroll-behavior:auto!important}}';
  styles+=' .frmedia-case-link{display:inline-flex;align-items:center;min-height:44px;padding:10px 0;color:#e0bf79;text-decoration:underline}';
  function mount(target, catalog, options) {
    var host = typeof target === 'string' ? d.querySelector(target) : target;
    if (!host || !catalog || !Array.isArray(catalog.assets)) return null;
    options = options || {};
    var id = options.id || 'frmedia-cozinha-lavanderia';
    var prior=d.getElementById(id);if(prior&&prior.dataset.frMediaLive==='true'&&prior.parentElement===host)return prior;
    if(prior){if(activeDialog&&prior.contains(activeDialog.dialog))closeActive();prior.remove();}
    if (!d.getElementById('frmedia-style')) {var st=node('style');st.id='frmedia-style';st.textContent=styles;d.head.appendChild(st);}
    var section=node('section','frmedia');section.id=id;section.dataset.frMediaLive='true';section.setAttribute('aria-labelledby',id+'-title');
    section.appendChild(node('div','frmedia-kicker','FRANCO ROMEU / ARQUIVO DE VISUALIZAÇÃO'));
    var h=node('h2',null,options.title||'Cozinha e lavanderia: leitura do projeto');h.id=id+'-title';section.appendChild(h);
    section.appendChild(node('p',null,options.lead||'Imagens ilustrativas e estudos raster organizados por ambiente. Não são fotografias de execução. Medidas executivas e registro documental da obra estão pendentes.'));
    if(id==='frmedia-cozinha-lavanderia'){var caseLink=node('a',null,'Ver leitura do projeto em página própria →');caseLink.href='/projetos/cozinha-lavanderia';caseLink.className='frmedia-case-link';section.appendChild(caseLink);}
    var controls=node('div','frmedia-controls');controls.setAttribute('aria-label','Filtrar imagens por setor');
    var status=node('p','frmedia-status');status.setAttribute('aria-live','polite');
    var grid=node('div','frmedia-grid');var dialog=node('dialog','frmedia-dialog');dialog.setAttribute('aria-label','Detalhe da visualização ilustrativa');
    var close=node('button',null,'Fechar detalhe');close.type='button';dialog.appendChild(close);
    var detailImage=node('img');detailImage.alt='';dialog.appendChild(detailImage);var detailLabel=node('p');dialog.appendChild(detailLabel);
    var opener=null;
    close.addEventListener('click',function(){dialog.close();});
    var oldOverflow='';
    dialog.addEventListener('close',function(){if(activeDialog&&activeDialog.dialog===dialog){activeDialog=null;d.body.style.overflow=oldOverflow;if(opener&&opener.isConnected)opener.focus({preventScroll:true});}});
    dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();});
    var prefix=options.assetPrefix || '';
    function source(v){return prefix+v.file;}
    var allowed=catalog.assets.filter(function(a){return a.status==='READY_WITH_LABEL' && a.publication_label && a.variants && a.variants.length && (!options.mediaIds||options.mediaIds.includes(a.media_id)) && (!options.studyOnly||a.represented_stage==='projeto_3d') && (!options.sector||a.sector_id===options.sector);});
    function render(group){
      controls.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.group===group));});
      grid.replaceChildren();var selection=allowed.filter(function(a){return group==='ALL'||(group==='TEC'?a.represented_stage==='projeto_3d':a.sector_id===group);});
      selection.forEach(function(a){
        var card=node('figure','frmedia-card'),button=node('button','frmedia-open');button.type='button';button.setAttribute('aria-label','Abrir detalhe: '+a.alt);
        var variants=a.variants.slice().sort(function(x,y){return x.width-y.width;});
        var img=node('img');img.alt=a.alt;img.loading='lazy';img.decoding='async';img.width=variants[variants.length-1].width;img.height=variants[variants.length-1].height;img.style.maxWidth=variants[variants.length-1].width+'px';img.style.marginInline='auto';
        img.src=source(variants[Math.min(1,variants.length-1)]);img.srcset=variants.map(function(v){return source(v)+' '+v.width+'w';}).join(', ');img.sizes='(max-width:580px) 90vw, (max-width:950px) 45vw, 30vw';button.appendChild(img);
        button.addEventListener('click',function(){closeActive();opener=button;detailImage.src=source(variants[variants.length-1]);detailImage.alt=a.alt;detailImage.width=variants[variants.length-1].width;detailImage.height=variants[variants.length-1].height;detailImage.style.width='auto';detailImage.style.height='auto';detailImage.style.maxWidth='min(80vw,'+variants[variants.length-1].width+'px)';detailLabel.textContent=a.publication_label+' — '+a.description;oldOverflow=d.body.style.overflow;activeDialog={dialog:dialog,overflow:oldOverflow,opener:opener};d.body.style.overflow='hidden';dialog.showModal();close.focus();});
        card.appendChild(button);card.appendChild(node('span','frmedia-label',a.publication_label));var cap=node('figcaption',null,a.title);cap.appendChild(node('small',null,a.description));card.appendChild(cap);grid.appendChild(card);
      });status.textContent=selection.length+' imagens ilustrativas neste recorte.';
    }
    [['ALL','Todos'],['COZ_ESQ','Cozinha esquerda'],['COZ_DIR','Cozinha direita'],['LAV','Lavanderia'],['INT','Integração'],['TEC','Estudos 3D']].forEach(function(pair){var b=node('button',null,pair[1]);b.type='button';b.dataset.group=pair[0];b.addEventListener('click',function(){render(pair[0]);});controls.appendChild(b);});
    controls.hidden=!!options.mediaIds||!!options.studyOnly||!!options.sector;
    section.append(controls,status,grid,dialog);host.appendChild(section);render('ALL');return section;
  }
  var hostObserver=null;
  function integrate(){
    if (!w.FR_MEDIA_CATALOG) return;
    if(activeDialog){var activeView=activeDialog.dialog.closest('.view-section');if(!activeDialog.dialog.isConnected||(activeView&&!activeView.classList.contains('active')))closeActive();}
    d.querySelectorAll('.frmedia-dialog[open]').forEach(function(dialog){var view=dialog.closest('.view-section');if(view&&!view.classList.contains('active'))dialog.close();});
    var stageHost=d.getElementById('fr16-portfolio');
    var host=stageHost || d.getElementById('view-projetos');
    if(host)mount(host,w.FR_MEDIA_CATALOG);
    sections.forEach(function(spec){var target=d.getElementById(spec.host);if(target)mount(target,w.FR_MEDIA_CATALOG,spec);});
    var about=d.getElementById('frmedia-metodo'),google=d.getElementById('fr-google-reviews');if(about&&google&&about.nextElementSibling!==google)google.before(about);
    var view=d.getElementById('view-projetos');
    if(view&&!hostObserver&&typeof MutationObserver==='function'){hostObserver=new MutationObserver(integrate);hostObserver.observe(view,{childList:true,subtree:true});}
  }
  var sections=[
    {host:'fr16-portfolio',id:'frmedia-materialidade',title:'Materialidade: encontros e planos',mediaIds:['M029','M_a008a94127','M035'],lead:'Leitura ilustrativa dos encontros entre bancada, frontão, tampo cinza e madeira. A aparência da imagem não comprova especificação ou execução da obra.'},
    {host:'view-home',id:'frmedia-home-case',title:'Um projeto, muitas decisões',mediaIds:['M_986cf34222','M_b239e59121']},
    {host:'view-ambientes',id:'frmedia-lavanderia',title:'Lavanderia: luz, bancada e circulação',sector:'LAV'},
    {host:'view-projetos3d',id:'frmedia-caderno',title:'Caderno de estudos do projeto',studyOnly:true,lead:'Estudos ilustrativos em imagens 2D. Não são modelos manipuláveis nem desenhos executivos; medidas, CAD e GLB não foram fornecidos.'},
    {host:'view-sobre',id:'frmedia-metodo',title:'O método em leitura visual',mediaIds:['M_134fab7c78','M_66df774c0e'],lead:'Estudos ilustrativos de bancada e marcenaria como apoio de leitura do projeto. Não constituem prova de serviços executados.'},
    {host:'view-orcamento',id:'frmedia-pedido',title:'Referência visual do pedido',mediaIds:['M_b239e59121'],lead:'Imagem ilustrativa para conversar sobre o escopo. A seleção de serviços, materiais e medidas depende da avaliação do seu projeto.'}
  ];
  w.FRMediaCase={mount:mount,integrate:integrate,sections:sections,styles:styles,version:'1.1.0'};
  d.addEventListener('frStage16Ready',integrate);d.addEventListener('frViewChanged',integrate);
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',integrate);else integrate();
})(window,document);
