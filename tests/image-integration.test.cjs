'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const output=path.resolve('dist'),origin='https://www.francoromeufr.com.br';
const state={};vm.runInNewContext(fs.readFileSync(path.join(output,'assets/js/fr-project-library.js'),'utf8'),{window:state});
const data=state.FR_MEDIA_LIBRARY,master=JSON.parse(fs.readFileSync('content/media/media-master.json')).media;
const map=JSON.parse(fs.readFileSync('.artifacts/build/PUBLIC_MEDIA_MAP.json'));
test('a Home preserva o hero e as seis vistas; o build padrão não substitui sua identidade',()=>{
 const dom=new JSDOM(fs.readFileSync(path.join(output,'index.html'),'utf8')),source=new JSDOM(fs.readFileSync('index.html','utf8'));
 // The original public build already removes the local administrative badge.
 source.window.document.querySelectorAll('#smart-nav .gm-placeholder').forEach(n=>n.remove());
 assert.equal(dom.window.document.querySelector('#smart-nav .gm-placeholder'),null);
 assert.equal(dom.window.document.getElementById('hero-title').innerHTML,source.window.document.getElementById('hero-title').innerHTML);
 assert.equal(dom.window.document.getElementById('smart-nav').outerHTML,source.window.document.getElementById('smart-nav').outerHTML);
 assert.ok(dom.window.document.querySelector('.fr6-hero-media picture img'));
 assert.equal(dom.window.document.querySelectorAll('.view-section').length,6);
 assert.ok(fs.readFileSync('scripts/build-site.cjs','utf8').includes("require('./build-journal.cjs')"),'o Jornal e gerado como rota separada, sem substituir a Home');
 dom.window.close();source.window.close();
});
test('os painéis da Home e o arquivo animado usam derivados selecionados com destinos reais',()=>{
 const dom=new JSDOM(fs.readFileSync(path.join(output,'index.html'),'utf8'));
 const doc=dom.window.document;
 for(const image of doc.querySelectorAll('#fr6-work .fr6-work-panel img')){
  const rel=image.getAttribute('src').replace(/^\//,'');
  assert.ok(fs.existsSync(path.join(output,rel)),rel);
  assert.ok(Object.values(data.media).some(media=>media.canonicalFile===rel));
  assert.ok(Number(image.width)>0&&Number(image.height)>0);
 }
 assert.equal(doc.querySelectorAll('#fr6-work .fr6-work-panel').length,3);
 assert.match(fs.readFileSync('index.html','utf8'),/environmentCards\.concat\(source\.filter\(isRecord\)\)/);
 assert.ok(doc.querySelector('#frpm-portfolio-environments .frpm-cover-grid'));
 dom.window.close();
});
test('Sobre apresenta uma seleção curta de estudos com relações reais e sem prova documental inventada',()=>{
 const dom=new JSDOM(fs.readFileSync(path.join(output,'sobre.html'),'utf8'));
 const section=dom.window.document.querySelector('#fr-sobre-materia');assert.ok(section);
 const cards=[...section.querySelectorAll('figure.frsm-card')];assert.equal(cards.length,3);
 const route=map.routes.find(record=>record.route==='/sobre');assert.ok(route);
 for(const card of cards){const link=card.querySelector('a'),image=card.querySelector('img[data-fr-media-id]');assert.ok(data.pairs.some(pair=>pair.route===link.getAttribute('href')));assert.ok(image&&data.media[image.dataset.frMediaId]);assert.ok(image.width>0&&image.height>0);assert.equal(image.getAttribute('loading'),'lazy');assert.match(card.querySelector('.frsm-copy .frsm-label').textContent,/estudo/i);assert.ok(route.media_ids.includes(image.dataset.frMediaId));assert.ok(map.media.find(item=>item.media_id===image.dataset.frMediaId)?.pages.includes(origin+'/sobre'));}
 assert.doesNotMatch(section.textContent,/Obra executada|cliente|resultado entregue/i);
 dom.window.close();
});
test('o Jornal tem rota própria, conteúdo inicial e acesso ao site sem duplicar a Home',()=>{
 const route=map.routes.find(record=>record.route==='/projetos/');assert.ok(route);assert.equal(route.indexable,false);
 const dom=new JSDOM(fs.readFileSync(path.join(output,route.file),'utf8'));
 const doc=dom.window.document;
 assert.match(doc.querySelector('h1').textContent,/matéria encontra o método/i);
 assert.equal(doc.querySelector('link[rel="canonical"]').href,origin+'/projetos/');
 assert.ok(doc.querySelector('a.frj-return[href="/"]'));
 assert.ok(doc.querySelector('a[href="/projetos/cozinha-lavanderia"]'));
 assert.equal(doc.querySelectorAll('.frj-index-card').length,109);
 assert.ok(doc.querySelector('.frj-explore nav[aria-label="Explorar o Jornal Técnico"]'));
 assert.ok(doc.querySelector('a[href="/projetos/materiais/"]'));
 assert.ok(doc.querySelector('a[href="/projetos/servicos/"]'));
 for(const image of doc.querySelectorAll('.frj-index-card img'))assert.ok(fs.existsSync(path.join(output,image.getAttribute('src').slice(1))));
 assert.doesNotMatch(doc.body.textContent,/Obra executada por Franco Romeu|\[pending_validation\]/);
 dom.window.close();
});
test('Home usa o novo acervo nas quatro posições reais, com Design e Marcenaria agrupados',()=>{
 const doc=new JSDOM(fs.readFileSync(path.join(output,'index.html'),'utf8')).window.document;
 const manifesto=doc.querySelector('[data-fr6-manifesto-image="1"]');
 assert.equal(manifesto.getAttribute('src'),'/assets/media/projects/cozinha-lavanderia/cozinha-env-lavanderia-imagem-ilustrativa-986cf34222.webp');
 const cards=[...doc.querySelectorAll('#fr6-expertise .fr6-service')];assert.equal(cards.length,3);
 const byTitle=new Map(cards.map(card=>[card.querySelector('h3').textContent.trim(),card.querySelector('img')]));
 assert.equal(byTitle.get('Superfícies autorais').getAttribute('src'),'/assets/media/projects/cozinha-lavanderia/cozinha-bancada-l-imagem-ilustrativa-b239e59121.webp');
 assert.equal(byTitle.get('Design & marcenaria').getAttribute('src'),'/assets/media/projects/cozinha-lavanderia/cozinha-torre-quente-imagem-ilustrativa-78d797da36.webp');
 assert.equal(byTitle.get('Projeto 3D').getAttribute('src'),'/assets/media/projects/cozinha-lavanderia/cozinha-ilha-cooktop-estudo-3d-ilustrativo-55a2676b5d.webp');
 for(const image of [manifesto,...byTitle.values()]){assert.ok(image.width>0&&image.height>0);assert.ok(fs.existsSync(path.join(output,image.getAttribute('src').slice(1))));}
 assert.doesNotMatch([...byTitle.values()].map(image=>image.getAttribute('src')).join('\n'),/home-servico-(?:superficies|marcenaria|projeto-3d)\.jpg/);
});
test('Projetos 3D conserva cubo e painel, troca Calacatta e publica navegador visual acessível',()=>{
 const source=fs.readFileSync('index.html','utf8');
 for(const file of [
  'cozinha-bancada-l-imagem-ilustrativa-029-960w.webp',
  'cozinha-env-lavanderia-antes-reconstituido-ilustrativo-76e8550654-960w.webp',
  'cozinha-bancada-l-estudo-3d-ilustrativo-025-960w.webp',
  'cozinha-bancada-l-imagem-ilustrativa-b239e59121-960w.webp'
 ])assert.ok(source.includes('/assets/media/projects/cozinha-lavanderia/'+file),file);
 assert.match(source,/function p3dIndexMarkup\(\)/);assert.match(source,/class="fr15-p3d-thumb"/);assert.match(source,/aria-label="Selecionar projeto/);
 assert.match(source,/class="fr15-p3d-cube/);assert.match(source,/class="fr15-p3d-dossier/);assert.match(source,/Antes — documentação visual/);
 assert.doesNotMatch(source, /imagem ilustrativa(?![-\w])/i);
 assert.doesNotMatch(source,/Cadernos de modelagem|Matriz arquitetônica/);
 assert.ok(fs.existsSync('docs/archive/matriz-arquitetonica/README.md'));
 assert.ok(fs.existsSync('docs/archive/matriz-arquitetonica/matrix-source.js'));
});
test('Sobre, Ambientes e Portfolio refletem a limpeza seletiva e o dossier escalável',()=>{
 const about=new JSDOM(fs.readFileSync(path.join(output,'sobre.html'),'utf8')).window.document;
 const google=about.getElementById('fr-google-reviews'),services=about.getElementById('fr-sobre-materia');assert.ok(google&&services);
 assert.ok(about.querySelector('.fr-google-quiet#fr-google-reviews'));
 assert.ok(google.compareDocumentPosition(services)&about.defaultView.Node.DOCUMENT_POSITION_FOLLOWING);
 assert.doesNotMatch(about.body.textContent,/O método em leitura visual/);
 const ambientes=new JSDOM(fs.readFileSync(path.join(output,'ambientes.html'),'utf8')).window.document;
 assert.equal(ambientes.querySelectorAll('[data-frpm-dossier-open]').length,1);assert.equal(ambientes.querySelector('[data-frpm-dossier-open]').dataset.frpmDossierOpen,'cozinha-lavanderia');
 assert.match(ambientes.querySelector('figure.frpm-dossier-card').textContent,/Depois em estudo/);
 assert.doesNotMatch(ambientes.getElementById('view-ambientes').textContent,/FRANCO ROMEU \/ ARQUIVO DE VISUALIZAÇÃO/);
 assert.equal(data.dossiers.length,1);assert.equal(data.dossiers[0].id,'cozinha-lavanderia');assert.equal(data.dossiers[0].executionDocumented,false);assert.ok(data.dossiers[0].media.length>4);
 assert.ok(data.dossiers[0].media.some(item=>item.category==='materiality'&&data.media[item.media_id].canonicalFile.includes('cozinha-bancada-l-imagem-ilustrativa-b239e59121')));
 const portfolio=new JSDOM(fs.readFileSync(path.join(output,'portfolio.html'),'utf8')).window.document;
 for(const id of ['fr16-case-model','fr16-method','fr16-services','fr16-pricing','frmedia-materialidade'])assert.equal(portfolio.getElementById(id),null,id);
 assert.doesNotMatch(portfolio.getElementById('view-projetos').textContent,/Materialidade: encontros e planos|Transformação é decisão acumulada|Comparação transparente de serviços|Preço sem escopo é apenas um número fora de contexto/);
});
test('ecossistema editorial recupera o inventário útil do dist e mantém metadados próprios',()=>{
 const migration=JSON.parse(fs.readFileSync('docs/additions/LEGACY_PROJECT_ROUTES_MAP.json','utf8'));
 assert.equal(migration.identified,111);assert.equal(migration.project_entries,109);assert.equal(migration.routes.length,111);
 assert.equal(migration.routes.filter(row=>row.oldRoute==='/projetos/').length,1);
 const editorial=map.routes.filter(record=>record.route.startsWith('/projetos/'));
 assert.equal(editorial.filter(record=>record.category==='editorial-estudo-3d').length,48);
 assert.equal(editorial.filter(record=>record.category==='editorial-material').length,147);
 assert.equal(editorial.filter(record=>record.category==='editorial-servico').length,18);
 assert.equal(editorial.filter(record=>record.category==='editorial-ambiente').length,24);
 for(const route of ['/projetos/antes-depois/','/projetos/estudos-3d/','/projetos/materiais/','/projetos/servicos/','/projetos/ambientes/']){
  const record=map.routes.find(row=>row.route===route);assert.ok(record,route);const doc=new JSDOM(fs.readFileSync(path.join(output,record.file),'utf8')).window.document;
  assert.equal(doc.querySelectorAll('h1').length,1);assert.equal(doc.querySelector('link[rel="canonical"]').href,origin+route);assert.ok(doc.querySelector('.frj-breadcrumb'));assert.ok(doc.querySelector('.frj-explore'));
 }
 const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));assert.ok(config.redirects.some(row=>row.source==='/jornal'&&row.destination==='/projetos/'&&row.permanent===true));
});
test('Inspirações e Materiais usam o mesmo atlas elegível sem ativar I124 ou indexação',()=>{
 for(const route of ['/inspiracoes/','/materiais/']){
  const record=map.routes.find(row=>row.route===route);assert.ok(record);assert.equal(record.indexable,false);
  const dom=new JSDOM(fs.readFileSync(path.join(output,record.file),'utf8'));
  const doc=dom.window.document;assert.equal(doc.querySelectorAll('h1').length,1);
  assert.equal(doc.querySelector('link[rel="canonical"]').href,origin+route);
  assert.ok(doc.querySelectorAll('.frh-card').length>=20);
  for(const img of doc.querySelectorAll('img[data-fr-media-id]')){
   assert.ok(data.media[img.dataset.frMediaId]);
   assert.equal(data.media[img.dataset.frMediaId].indexable,false);
   assert.ok(fs.existsSync(path.join(output,img.getAttribute('src').slice(1))));
  }
  assert.doesNotMatch(doc.body.textContent,/FR-I124|Obra executada por Franco Romeu/);
  dom.window.close();
 }
});
test('HOLD, ARCHIVE, DUPLICATE e REFERENCE não entram no catálogo normalizado ou nos arquivos novos',()=>{
 assert.equal(Object.keys(data.media).length,284);
 for(const id of Object.keys(data.media)){const raw=master.find(m=>m.media_id===id);assert.ok(['PRIMARY','SECONDARY'].includes(raw.editorial_rank));assert.notEqual(raw.nature,'REFERENCE');assert.equal(raw.hold_reasons.length,0);assert.equal(data.media[id].indexable,false);}
 assert.equal(data.caseCatalog.assets.length,48);
 assert.equal(data.groups.flatMap(g=>g.trails).some(t=>t.project_id==='FR-I124'),false);
 assert.equal(map.rejected.filter(r=>r.reasons.includes('RANK_HOLD')).length,53);
 assert.equal(map.rejected.filter(r=>r.reasons.includes('RANK_ARCHIVE')).length,123);
 assert.equal(map.rejected.filter(r=>r.reasons.includes('RANK_DUPLICATE')).length,20);
});
test('a montagem retira inert somente dos novos painéis e acompanha o contêiner ativo do Portfólio',()=>{
 const dom=new JSDOM('<main id="view-projetos"><div id="legacy" inert aria-hidden="true"></div><section id="frpm-before-after" class="frpm" inert aria-hidden="true"></section><section id="frpm-portfolio-environments" class="frpm" inert aria-hidden="true"></section><section id="fr16-portfolio"></section></main>',{runScripts:'outside-only',url:origin+'/portfolio'});
 const w=dom.window,d=w.document;w.FR_MEDIA_PRERENDER=true;w.FR_MEDIA_LIBRARY={pairs:[],groups:[],media:{}};
 w.eval(fs.readFileSync('assets/js/fr-project-media.js','utf8'));w.FRProjectMedia.mount();
 for(const id of ['frpm-before-after','frpm-portfolio-environments']){const node=d.getElementById(id);assert.equal(node.parentElement.id,'fr16-portfolio');assert.equal(node.hasAttribute('inert'),false);assert.equal(node.getAttribute('aria-hidden'),'false');}
 assert.equal(d.getElementById('legacy').hasAttribute('inert'),true,'the protected legacy nodes must remain inert');
 d.getElementById('fr16-portfolio').hidden=true;w.FRProjectMedia.mount();assert.equal(d.getElementById('frpm-before-after').parentElement.id,'view-projetos');
 dom.window.close();
});
test('cada ambiente mantém uma capa seguida de pares materiais/exemplo, sem cartelas e sem intercalação',()=>{
 assert.equal(data.groups.length,20);assert.equal(data.groups.flatMap(g=>g.trails).length,48);
 for(const g of data.groups){assert.equal(g.sequence[0].type,'COVER');assert.equal(g.sequence.filter(s=>s.type==='COVER').length,1);assert.equal(g.sequence.length,g.trails.length*2+1);for(let i=1;i<g.sequence.length;i+=2){assert.equal(g.sequence[i].type,'MATERIAL');assert.equal(g.sequence[i+1].type,'EXAMPLE');assert.equal(g.sequence[i].project_id,g.sequence[i+1].project_id);}}
 assert.equal(data.groups.find(g=>g.physical==='biblioteca').cover,'FR-M-14B94B3E47FB47E6');
 assert.equal(data.groups.find(g=>g.physical==='area-gourmet').cover,'FR-M-83EFB6DCE0B7B856');
});
test('os 60 antes/depois têm texto próprio, rótulos visíveis e comparação estática sem slider não validado',()=>{
 assert.equal(data.pairs.length,60);assert.ok(new Set(data.pairs.map(p=>p.initial_condition)).size>40);
 for(const p of data.pairs){const rawBefore=master.find(m=>m.media_id===p.before_media_id),rawAfter=master.find(m=>m.media_id===p.after_media_id);assert.equal(rawBefore.narrative_stage,'RECONSTRUCTED_BEFORE');assert.equal(rawAfter.narrative_stage,'ILLUSTRATIVE_AFTER');assert.equal(p.display,'SIDE_BY_SIDE');const text=fs.readFileSync(path.join(output,p.route.slice(1),'index.html'),'utf8');assert.ok(text.includes('Antes reconstituído'));assert.ok(text.includes('Depois em estudo'));assert.ok(text.includes('Intervenções representadas no estudo'));assert.doesNotMatch(text,/\[A CONFIRMAR\]|Serviços executados|type="range"|Obra executada por Franco Romeu/);}
});
test('URLs, SHA e dimensões das famílias públicas correspondem a derivados existentes; autorização permanece bloqueada',()=>{
 assert.equal(new Set(map.media.map(m=>m.media_id)).size,284);
 const destinations=new Set();for(const m of map.media){assert.ok(m.pages.length);assert.equal(m.publication.published,false);assert.equal(m.seo.active_indexable,false);assert.equal(m.authorship.creator_verified,false);for(const v of m.variants){const file=path.join(output,v.file);assert.ok(fs.existsSync(file));assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),v.sha256);assert.ok(!destinations.has(v.file));destinations.add(v.file);assert.ok(v.width>0&&v.height>0);}}
});
test('sitemaps/XML excluem páginas noindex e imagens sem liberação; URLs indexáveis têm arquivo e canonical',()=>{
 const routes=new Map(map.routes.map(r=>[origin+r.route,r]));
 for(const name of ['sitemap.xml','sitemap-images.xml','sitemap-images-antes-depois.xml','sitemap-images-3d.xml','sitemap-images-portfolio.xml']){
  const dom=new JSDOM(fs.readFileSync(path.join(output,name),'utf8'),{contentType:'text/xml'}),doc=dom.window.document;
  assert.equal(doc.documentElement.namespaceURI,'http://www.sitemaps.org/schemas/sitemap/0.9');
  assert.equal(doc.querySelector('parsererror'),null);
  for(const url of doc.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9','url')){const loc=url.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9','loc')[0].textContent,r=routes.get(loc);assert.ok(r&&r.indexable);assert.ok(fs.existsSync(path.join(output,r.file)));}
  assert.equal(doc.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1','image').length,0,'all current media have active_indexable=false');dom.window.close();
 }
 assert.equal(map.routes.filter(r=>r.indexable).length,6);
 for(const r of map.routes.filter(r=>!r.indexable)){const text=fs.readFileSync(path.join(output,r.file),'utf8');assert.match(text,/name="robots" content="noindex/);assert.ok(text.includes('href="'+origin+r.route+'"'));assert.ok(text.includes('content="'+origin+r.route+'"'));}
});
