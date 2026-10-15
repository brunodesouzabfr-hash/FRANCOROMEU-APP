'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const { parse } = require('acorn');
const { minify } = require('terser');
const { transform } = require('lightningcss');
const { composeGraph, breadcrumb } = require('../src/public-site-meta.cjs');

// A single active output. Earlier candidates are archived outside this directory.
const output = path.resolve(process.env.FR_OUTPUT_DIR || 'dist');
if (output === path.resolve('.')) throw new Error('Refusing to build into the repository root');
if (output === path.resolve('dist')) fs.rmSync(output, { recursive:true, force:true });
const source = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(source, { runScripts: 'outside-only' });
const doc = dom.window.document;
const sourceStyles = [...doc.querySelectorAll('style')];
const sourceGraph = JSON.parse(doc.getElementById('fr-seo-structured-data').textContent);
const removed = [];
const media = JSON.parse(fs.readFileSync('assets/optimized/media-manifest.json', 'utf8'));
function jpegDimensions(file) {
  const bytes = fs.readFileSync(file); let offset = 2;
  if (bytes.readUInt16BE(0) !== 0xffd8) throw new Error('Invalid JPEG: ' + file);
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset++; continue; }
    const marker = bytes[offset + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  throw new Error('Missing dimensions: ' + file);
}

function pruneAdmin(code) {
  const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'script' });
  const edits = [];
  const removedFunctions = new Set(['exportConfig', 'loadConfigData', 'logoClick', 'toggleGodMode', 'renderAdminPanel', 'validateAdminImport', 'installGodMode']);
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    const text = code.slice(node.start, node.end);
    if (node.type === 'FunctionDeclaration' && removedFunctions.has(node.id?.name)) {
      edits.push([node.start, node.end, '']); removed.push(node.id.name); return;
    }
    if (node.type === 'ExpressionStatement' && (/^window\.admin\s*=/.test(text) || /^(?:installGodMode|loadConfigData)\(\);?$/.test(text))) {
      edits.push([node.start, node.end, '']); return;
    }
    if (node.type === 'IfStatement' && code.slice(node.test.start, node.test.end).includes("get('fr-admin')")) {
      edits.push([node.start, node.end, '']); return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (['start', 'end', 'loc'].includes(key)) continue;
      if (Array.isArray(child)) child.forEach(walk);
      else if (child && typeof child === 'object') walk(child);
    }
  }
  walk(ast);
  for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0])) code = code.slice(0, start) + replacement + code.slice(end);
  return code;
}

async function build() {
  // Only publish the generated public directory, never source HTMLs or documentation.
  fs.mkdirSync(output, { recursive: true });
  const prepared = require('./prepare-project-library.cjs')(output);
  prepared.sourceGraph = sourceGraph;
  dom.window.FR_MEDIA_PRERENDER = true;
  dom.window.FR_MEDIA_LIBRARY = prepared.data;
  const libraryScript=doc.createElement('script');libraryScript.src='/assets/js/fr-project-library.js';
  doc.querySelector('script[src="assets/js/fr-media-case.js"]').before(libraryScript);
  const projectCSS=doc.createElement('link');projectCSS.rel='stylesheet';projectCSS.href='/assets/css/fr-project-media.css';doc.head.appendChild(projectCSS);
  const projectScript=doc.createElement('script');projectScript.src='/assets/js/fr-project-media.js';doc.body.appendChild(projectScript);
  // Same approved gallery renderer for crawler-visible HTML and progressive UI.
  dom.window.eval(fs.readFileSync('assets/js/media-catalog.js', 'utf8'));
  dom.window.eval(fs.readFileSync('assets/js/fr-media-case.js', 'utf8'));
  dom.window.FRMediaCase.integrate();
  dom.window.eval(fs.readFileSync('assets/js/fr-project-media.js','utf8'));
  dom.window.FRProjectMedia.mount();
  for(const pair of doc.querySelectorAll('.frpm-pair'))pair.hidden=false;
  // A concise About selection reuses the same verified media and pair routes.
  const aboutAnchor=doc.querySelector('#view-sobre #fr-google-reviews');
  if(!aboutAnchor)throw new Error('About insertion point missing');
  const aboutPairs=['FR-P007','FR-P030','FR-P055'].map(id=>prepared.data.pairs.find(pair=>pair.project_id===id));
  if(aboutPairs.some(pair=>!pair))throw new Error('Curated About pair missing');
  const aboutSection=doc.createElement('section');aboutSection.id='fr-sobre-materia';aboutSection.className='frsm';
  const aboutHead=doc.createElement('div');aboutHead.className='frsm-head';
  const aboutEyebrow=doc.createElement('p');aboutEyebrow.textContent='FR / ACERVO EM CONTEXTO';
  const aboutTitle=doc.createElement('h2');aboutTitle.textContent='Serviços em matéria';
  const aboutIntro=doc.createElement('p');aboutIntro.textContent='Três leituras que aproximam ambiente, superfície e intervenção proposta. Percorra cada estudo para ver materiais e serviços relacionados.';
  aboutHead.append(aboutEyebrow,aboutTitle,aboutIntro);aboutSection.appendChild(aboutHead);
  const aboutGrid=doc.createElement('div');aboutGrid.className='frsm-grid';
  for(const pair of aboutPairs){
    const mediaRow=prepared.data.media[pair.after_media_id],variant=mediaRow?.variants.find(v=>v.canonical);
    if(!mediaRow||!variant)throw new Error('About image missing: '+pair.project_id);
    const card=doc.createElement('figure');card.className='frsm-card';
    const link=doc.createElement('a');link.href=pair.route;
    const image=doc.createElement('img');image.src='/'+mediaRow.canonicalFile;image.width=variant.width;image.height=variant.height;image.alt=mediaRow.alt;image.setAttribute('loading','lazy');image.setAttribute('decoding','async');image.dataset.frMediaId=mediaRow.media_id;
    const caption=doc.createElement('div');caption.className='frsm-copy';
    const label=doc.createElement('span');label.className='frsm-label';label.textContent=mediaRow.label;
    const title=doc.createElement('h3');title.textContent=pair.title;
    const details=doc.createElement('p');details.textContent='Materiais: '+pair.materials.slice(0,2).join(' · ')+' · Serviços: '+pair.services.slice(0,2).join(' · ');
    const action=doc.createElement('strong');action.textContent='Abrir estudo →';
    caption.append(label,title,details,action);link.append(image,caption);card.appendChild(link);aboutGrid.appendChild(card);
  }
  aboutSection.appendChild(aboutGrid);aboutAnchor.before(aboutSection);
  const aboutPillars=[...doc.querySelectorAll('#view-sobre > .sobre-section')][1];
  if(!aboutPillars)throw new Error('About pillars insertion point missing');
  aboutAnchor.classList.add('fr-google-quiet');
  aboutPillars.after(aboutAnchor);
  for (const section of doc.querySelectorAll('[data-fr-media-live]')) section.dataset.frMediaLive = 'false';
  for (const link of [...doc.querySelectorAll('link[rel="stylesheet"]')]) doc.head.appendChild(link);
  // Preview blocks indexing; production permits eligible visual discovery.
  {
    let robots = doc.querySelector('meta[name="robots"]');
    if (!robots) { robots = doc.createElement('meta'); robots.name = 'robots'; doc.head.appendChild(robots); }
    robots.content = process.env.VERCEL_ENV === 'preview' ? 'noindex, nofollow, noimageindex' : 'index, follow, max-image-preview:large';
  }
  const dimensions = {};
  for (const file of fs.readdirSync('assets/media').filter(n => /\.jpe?g$/i.test(n))) dimensions['assets/media/' + file] = jpegDimensions('assets/media/' + file);
  for (const variant of media.variants) {
    const bytes = fs.readFileSync(variant.path);
    if (crypto.createHash('sha256').update(bytes).digest('hex') !== variant.sha256) throw new Error('Variant integrity: ' + variant.path);
    dimensions[variant.path] = [variant.width, variant.height];
  }
  for (const image of doc.querySelectorAll('img[src]')) {
    const size = dimensions[image.getAttribute('src')];
    if (size) { image.width = size[0]; image.height = size[1]; }
  }
  const hero = doc.querySelector('.fr6-hero-media img');
  const picture = doc.createElement('picture');
  for (const format of ['avif', 'webp']) {
    const node = doc.createElement('source'); node.type = 'image/' + format; node.sizes = '100vw';
    node.srcset = media.variants.filter(v => v.format === format).map(v => `${v.path} ${v.width}w`).join(', '); picture.appendChild(node);
  }
  hero.replaceWith(picture); picture.appendChild(hero);
  hero.alt = 'Composição de interiores com bancada, madeira e acabamentos';
  const preload = doc.querySelector('link[rel="preload"][as="image"]');
  // Match the first picture source so the preload does not fetch a competing JPEG.
  const avifSource=picture.querySelector('source[type="image/avif"]');
  const avifVariant=media.variants.find(v=>v.format==='avif');
  if(!avifSource||!avifVariant)throw new Error('Hero AVIF variant missing');
  const heroPreload=doc.createElement('link');heroPreload.rel='preload';heroPreload.setAttribute('as','image');heroPreload.type='image/avif';heroPreload.href=avifVariant.path;heroPreload.setAttribute('imagesrcset',avifSource.srcset);heroPreload.setAttribute('imagesizes','100vw');heroPreload.setAttribute('fetchpriority','high');
  if(preload)preload.replaceWith(heroPreload);else doc.head.prepend(heroPreload);
  const dimensionScript = doc.createElement('script'); dimensionScript.id = 'fr-media-dimensions';
  dimensionScript.textContent = 'window.FR_MEDIA_DIMENSIONS=' + JSON.stringify(dimensions) + ';'; doc.head.appendChild(dimensionScript);
  for (const node of doc.querySelectorAll('#god-mode-panel,#gm-backdrop,#admin-container,.gm-placeholder')) node.remove();
  for (const node of [...doc.scripts]) {
    if (node.type === 'application/ld+json' || node.type === 'application/json' || node.src || !node.textContent.trim()) continue;
    if (node.textContent.includes('// === GOD MODE 2.0 - PAINEL COMPLETO DE EDIÇÃO ===')) { node.remove(); removed.push('God Mode 2.0 script'); continue; }
    const code = pruneAdmin(node.textContent).replaceAll('https://francoromeufr.com.br', prepared.l.ORIGIN);
    const result = await minify(code, { compress: false, mangle: false, format: { comments: false, inline_script: true } });
    node.textContent = result.code;
  }
  for (const node of doc.querySelectorAll('style')) {
    node.textContent = transform({ filename: 'index.css', code: Buffer.from(node.textContent), minify: true, errorRecovery: false }).code.toString();
  }
  // The source carries successive visual releases after parser-blocking scripts.
  // With a non-blocking intro, painting between those styles exposes incomplete
  // header/hero layouts. Deliver the final cascade before body content, retaining
  // its exact order and IDs for the existing runtime integrations.
  for (const node of [...sourceStyles, ...doc.querySelectorAll('style')].filter((node,index,all)=>all.indexOf(node)===index)) doc.head.appendChild(node);
  const walker = doc.createTreeWalker(doc, 128);
  const comments = []; while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach(n => n.remove());
  const html = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  if (/GOD MODE 2\.0|FRANCO ADMIN|window\.admin\s*=|function renderAdminPanel\b|window\.gmDownloadFinalHTML\s*=/.test(html)) throw new Error('Administrative editor in production output');
  fs.writeFileSync(path.join(output, 'index.html'), html);
  // Pre-render only the six existing URLs. Keep the SPA's DOM contracts intact.
  const routeSource = new JSDOM(source).window.document.getElementById('fr-seo-spa-router').textContent;
  const routeLiteral = routeSource.match(/var routes=(\{[\s\S]*?\n\});/);
  if (!routeLiteral) throw new Error('Route metadata not found');
  const routeMetadata = vm.runInNewContext('(' + routeLiteral[1] + ')', {}, { timeout: 1000 });
  const primaryHeadings = Object.fromEntries(Object.keys(routeMetadata).map(id => [id, doc.getElementById(id).querySelector('h1,h2')]));
  for (const [viewId, meta] of Object.entries(routeMetadata)) {
    doc.title = meta.title;
    doc.querySelector('link[rel="canonical"]').href = prepared.l.ORIGIN + meta.path;
    for (const [selector, value] of Object.entries({ 'meta[name="description"]': meta.description, 'meta[property="og:url"]': prepared.l.ORIGIN + meta.path, 'meta[property="og:title"]': meta.title, 'meta[property="og:description"]': meta.description, 'meta[name="twitter:title"]': meta.title, 'meta[name="twitter:description"]': meta.description })) doc.querySelector(selector).content = value;
    for(const node of doc.querySelectorAll('[content]'))if(node.content)node.content=node.content.replaceAll('https://francoromeufr.com.br',prepared.l.ORIGIN);
    doc.getElementById('fr-seo-structured-data').textContent=JSON.stringify(composeGraph({sourceGraph,organization:prepared.l.organization,pageNodes:[breadcrumb(meta.path,meta.label)],includeServices:true,includeItemList:true,includeFaq:meta.path==='/orcamento'}));
    for (const [id, heading] of Object.entries(primaryHeadings)) {
      const tag = id === viewId ? 'h1' : 'h2';
      if (heading && heading.localName !== tag) {
        const replacement = doc.createElement(tag);
        for (const attribute of heading.attributes) replacement.setAttribute(attribute.name, attribute.value);
        while (heading.firstChild) replacement.appendChild(heading.firstChild);
        heading.replaceWith(replacement); primaryHeadings[id] = replacement;
      }
      const view = doc.getElementById(id), active = id === viewId;
      view.classList.toggle('active', active); view.hidden = !active; view.setAttribute('aria-hidden', String(!active));
      if (active) view.removeAttribute('inert'); else view.setAttribute('inert', '');
    }
    fs.writeFileSync(path.join(output, meta.path === '/' ? 'index.html' : meta.path.slice(1) + '.html'), '<!DOCTYPE html>\n' + doc.documentElement.outerHTML);
  }
  const publicRootFiles=['robots.txt','sitemap.xml','site.webmanifest','browserconfig.xml','favicon.ico','BingSiteAuth.xml','15371fdcae5446498483cb1385b2ccc3.txt'];
  for (const file of publicRootFiles){if(!fs.existsSync(file)||!fs.statSync(file).isFile())throw new Error('Arquivo público obrigatório ausente: '+file);fs.copyFileSync(file,path.join(output,file));}
  // Laboratório de testes separado, explicitamente não indexável e sem navegação pública.
  const introLab='intro-franco-romeu-laboratorio.html';
  const labMarkup=fs.readFileSync(introLab,'utf8');
  if(!/name="robots" content="noindex,nofollow"/.test(labMarkup))throw new Error('Laboratório precisa de noindex');
  fs.copyFileSync(introLab,path.join(output,introLab));
  // Copy only assets referenced by the approved source and its existing modules.
  const referenced=new Set([...source.matchAll(/assets\/[a-zA-Z0-9_./-]+\.(?:avif|webp|png|jpe?g|svg|ico|json|js|css|woff2?)/g)].map(m=>m[0]));
  for(const v of media.variants)referenced.add(v.path);
  // Intro V04 usa um asset na sua própria camada JS, não exposto diretamente no index.html.
  const introMonogram='assets/brand/franco-romeu-monograma-dourado-384.webp';
  if(!fs.existsSync(introMonogram))throw new Error('Monograma da intro ausente: '+introMonogram);
  referenced.add(introMonogram);
  for(const file of referenced){if(file.startsWith('assets/media/fr-coz-lav/')||file==='assets/js/media-catalog.js')continue;if(!fs.existsSync(file)||!fs.statSync(file).isFile())continue;const target=path.join(output,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
  // The public catalog contains only the reconciled selection, no archived URLs.
  fs.writeFileSync(path.join(output,'assets/js/media-catalog.js'),'window.FR_MEDIA_CATALOG='+JSON.stringify(prepared.data.caseCatalog).replaceAll('<','\\u003c')+';');
  // Explicitly optimize the new isolated modules too; Vercel is not the minifier.
  for (const file of fs.readdirSync('assets/js').filter(file=>file.endsWith('.js'))) {
    if(file==='media-catalog.js'||file==='fr-price-reference.js')continue;
    fs.mkdirSync(path.join(output,'assets/js'),{recursive:true});
    const result=await minify(fs.readFileSync(path.join('assets/js',file),'utf8'),{compress:false,mangle:false,format:{comments:false,inline_script:true}});
    fs.writeFileSync(path.join(output,'assets/js',file),result.code);
  }
  for (const file of fs.readdirSync('assets/css').filter(file=>file.endsWith('.css')&&file!=='fr-price-reference.css')) {
    fs.mkdirSync(path.join(output,'assets/css'),{recursive:true});
    fs.writeFileSync(path.join(output,'assets/css',file),transform({filename:file,code:fs.readFileSync(path.join('assets/css',file)),minify:true,errorRecovery:false}).code);
  }
  const studyCase = require('./build-media-case.cjs')(doc, output, prepared);
  const details = require('./build-project-pages.cjs')(doc,prepared);
  const journal = require('./build-journal.cjs')(prepared);
  const editorial = require('./build-editorial-ecosystem.cjs')(prepared);
  const atlasHubs = require('./build-atlas-hubs.cjs')(prepared);
  const routes = { 'view-home': '/', 'view-sobre': '/sobre', 'view-ambientes': '/ambientes', 'view-projetos3d': '/projetos-3d', 'view-projetos': '/portfolio', 'view-orcamento': '/orcamento' };
  const routeRecords=[...Object.entries(routes).map(([viewId,route])=>({route,file:route==='/'?'index.html':route.slice(1)+'.html',indexable:process.env.VERCEL_ENV!=='preview',category:viewId==='view-projetos3d'?'3d':'portfolio',media_ids:[...new Set([...doc.querySelectorAll('#'+viewId+' img[data-fr-media-id]')].map(n=>n.dataset.frMediaId))]})),{route:studyCase.route,file:studyCase.route.slice(1)+'.html',indexable:false,category:'3d',media_ids:prepared.data.caseCatalog.assets.map(a=>a.media_id)},...details,journal,...editorial,...atlasHubs];
  // Main routes predate this integration; new study routes wait for release gates.
  const ns='xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  const xml=rows=>'<?xml version="1.0" encoding="UTF-8"?>\n<urlset '+ns+'>'+rows.join('\n')+'</urlset>\n';
  fs.writeFileSync(path.join(output,'sitemap.xml'),xml(routeRecords.filter(r=>r.indexable).map(r=>'<url><loc>'+prepared.l.ORIGIN+r.route+'</loc></url>')));
  for(const category of ['antes-depois','3d','portfolio']){
    const rows=routeRecords.filter(r=>r.indexable&&r.category===category).flatMap(r=>{const ids=r.media_ids.filter(id=>prepared.data.media[id]?.indexable);return ids.length?['<url><loc>'+prepared.l.ORIGIN+r.route+'</loc>'+ids.map(id=>'<image:image><image:loc>'+prepared.l.ORIGIN+'/'+prepared.data.media[id].canonicalFile+'</image:loc></image:image>').join('')+'</url>']:[]});
    fs.writeFileSync(path.join(output,'sitemap-images-'+category+'.xml'),xml(rows));
  }
  fs.writeFileSync(path.join(output,'sitemap-images.xml'),xml([]));
  fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+prepared.l.ORIGIN+'/sitemap.xml\n'+['antes-depois','3d','portfolio'].map(c=>'Sitemap: '+prepared.l.ORIGIN+'/sitemap-images-'+c+'.xml').join('\n')+'\n');
  for(const record of prepared.publicMap)record.pages=routeRecords.filter(r=>r.media_ids.includes(record.media_id)).map(r=>prepared.l.ORIGIN+r.route);
  const publicMap={schema_version:'fr-public-media-1.0.0',canonical:prepared.l.ORIGIN,local_preview_only:true,media:prepared.publicMap,rejected:prepared.l.rejected,routes:routeRecords};
  fs.mkdirSync(prepared.artifactDir,{recursive:true});
  fs.writeFileSync(path.join(prepared.artifactDir,'PUBLIC_MEDIA_MAP.json'),JSON.stringify(publicMap,null,2)+'\n');
  fs.writeFileSync(path.join(prepared.artifactDir,'IMAGE_INTEGRATION_INVENTORY.json'),JSON.stringify({roots:prepared.l.roots,inventory:prepared.inventory,relocated_sources:prepared.l.relocated,source_documents:prepared.sources,strict_decode:prepared.decoded},null,2)+'\n');
  const notFound = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Página não encontrada — Franco Romeu</title></head><body style="background:#031812;color:#e6d6b5;font:20px/1.6 system-ui;padding:10vw"><h1>Página não encontrada</h1><p>Este endereço não faz parte do acervo publicado.</p><a href="/" style="color:#ffad69">Voltar à Franco Romeu</a></body></html>';
  fs.writeFileSync(path.join(output, '404.html'), notFound);
  const homeHTML = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
  function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
  const artifacts = Object.fromEntries(files(output).filter(file => path.relative(output, file) !== 'build-report.json').sort().map(file => [path.relative(output, file), crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
  const report = { sourceBytes: Buffer.byteLength(source), publicBytes: Buffer.byteLength(homeHTML), publicSha256: crypto.createHash('sha256').update(homeHTML).digest('hex'), publicFingerprint: crypto.createHash('sha256').update(JSON.stringify(artifacts)).digest('hex'), artifacts, removed, buildMutatesSource: false };
  fs.writeFileSync(path.join(prepared.artifactDir,'IMAGE_BUILD_REPORT.json'), JSON.stringify({...report,output,routes:routeRecords.length,media:prepared.publicMap.length,publicationEnabled:prepared.publicMap.filter(item=>item.indexable).length}, null, 2));
  console.log(JSON.stringify({ ...report, artifacts: Object.keys(artifacts).length }, null, 2));
  dom.window.close();
}
build().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
