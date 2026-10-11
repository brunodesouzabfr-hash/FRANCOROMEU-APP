'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const { parse } = require('acorn');
const { minify } = require('terser');
const { transform } = require('lightningcss');

const output = path.resolve('dist');
const source = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(source, { runScripts: 'outside-only' });
const doc = dom.window.document;
const sourceStyles = [...doc.querySelectorAll('style')];
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
  const removedFunctions = new Set(['exportConfig', 'logoClick', 'toggleGodMode', 'renderAdminPanel', 'validateAdminImport', 'installGodMode']);
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    const text = code.slice(node.start, node.end);
    if (node.type === 'FunctionDeclaration' && removedFunctions.has(node.id?.name)) {
      edits.push([node.start, node.end, '']); removed.push(node.id.name); return;
    }
    if (node.type === 'ExpressionStatement' && (/^window\.admin\s*=/.test(text) || /^installGodMode\(\);?$/.test(text))) {
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
  // Same approved gallery renderer for crawler-visible HTML and progressive UI.
  dom.window.eval(fs.readFileSync('assets/js/media-catalog.js', 'utf8'));
  dom.window.eval(fs.readFileSync('assets/js/fr-media-case.js', 'utf8'));
  dom.window.FRMediaCase.integrate();
  for (const section of doc.querySelectorAll('[data-fr-media-live]')) section.dataset.frMediaLive = 'false';
  for (const link of [...doc.querySelectorAll('link[rel="stylesheet"]')]) doc.head.appendChild(link);
  if (process.env.VERCEL_ENV === 'preview') {
    let robots = doc.querySelector('meta[name="robots"]');
    if (!robots) { robots = doc.createElement('meta'); robots.name = 'robots'; doc.head.appendChild(robots); }
    robots.content = 'noindex, nofollow';
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
  hero.alt = 'Referência visual de interiores com bancada, madeira e acabamento; não representa obra executada';
  const preload = doc.querySelector('link[rel="preload"][as="image"]');
  // The picture is in the initial HTML; no competing JPEG preload is needed.
  if (preload) preload.remove();
  const dimensionScript = doc.createElement('script'); dimensionScript.id = 'fr-media-dimensions';
  dimensionScript.textContent = 'window.FR_MEDIA_DIMENSIONS=' + JSON.stringify(dimensions) + ';'; doc.head.appendChild(dimensionScript);
  for (const node of doc.querySelectorAll('#god-mode-panel,#gm-backdrop,#admin-container,.gm-placeholder')) node.remove();
  for (const node of [...doc.scripts]) {
    if (node.type === 'application/ld+json' || node.type === 'application/json' || node.src || !node.textContent.trim()) continue;
    if (node.textContent.includes('// === GOD MODE 2.0 - PAINEL COMPLETO DE EDIÇÃO ===')) { node.remove(); removed.push('God Mode 2.0 script'); continue; }
    const code = pruneAdmin(node.textContent);
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
    doc.querySelector('link[rel="canonical"]').href = 'https://francoromeufr.com.br' + meta.path;
    for (const [selector, value] of Object.entries({ 'meta[name="description"]': meta.description, 'meta[property="og:url"]': 'https://francoromeufr.com.br' + meta.path, 'meta[property="og:title"]': meta.title, 'meta[property="og:description"]': meta.description, 'meta[name="twitter:title"]': meta.title, 'meta[name="twitter:description"]': meta.description })) doc.querySelector(selector).content = value;
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
  for (const file of ['robots.txt', 'sitemap.xml', 'site.webmanifest', 'browserconfig.xml', 'favicon.ico']) fs.copyFileSync(file, path.join(output, file));
  fs.cpSync('assets', path.join(output, 'assets'), { recursive: true });
  // Explicitly optimize the new isolated modules too; Vercel is not the minifier.
  for (const file of fs.readdirSync('assets/js').filter(file=>file.endsWith('.js'))) {
    const result=await minify(fs.readFileSync(path.join('assets/js',file),'utf8'),{compress:false,mangle:false,format:{comments:false,inline_script:true}});
    fs.writeFileSync(path.join(output,'assets/js',file),result.code);
  }
  for (const file of fs.readdirSync('assets/css').filter(file=>file.endsWith('.css'))) {
    fs.writeFileSync(path.join(output,'assets/css',file),transform({filename:file,code:fs.readFileSync(path.join('assets/css',file)),minify:true,errorRecovery:false}).code);
  }
  const studyCase = require('./build-media-case.cjs')(doc, output);
  const pageSitemap = fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8').replace('</urlset>', `<url><loc>https://francoromeufr.com.br${studyCase.route}</loc></url>\n</urlset>`);
  fs.writeFileSync(path.join(output, 'sitemap.xml'), pageSitemap);
  const routeImages = new Map();
  const routes = { 'view-home': '/', 'view-sobre': '/sobre', 'view-ambientes': '/ambientes', 'view-projetos3d': '/projetos-3d', 'view-projetos': '/portfolio', 'view-orcamento': '/orcamento' };
  for (const [viewId, route] of Object.entries(routes)) {
    const files = [...doc.querySelectorAll('#' + viewId + ' img[src]')].map(n => n.getAttribute('src')).filter(src => /^assets\/media\//.test(src));
    if (files.length) routeImages.set(route, [...new Set(files)]);
  }
  routeImages.set(studyCase.route, studyCase.images);
  const imageSitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + [...routeImages].map(([route, files]) => `<url><loc>https://francoromeufr.com.br${route}</loc>${files.map(file => `<image:image><image:loc>https://francoromeufr.com.br/${file}</image:loc></image:image>`).join('')}</url>`).join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(output, 'sitemap-images.xml'), imageSitemap);
  const notFound = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Página não encontrada — Franco Romeu</title></head><body style="background:#031812;color:#e6d6b5;font:20px/1.6 system-ui;padding:10vw"><h1>Página não encontrada</h1><p>Este endereço não faz parte do acervo publicado.</p><a href="/" style="color:#ffad69">Voltar à Franco Romeu</a></body></html>';
  fs.writeFileSync(path.join(output, '404.html'), notFound);
  const homeHTML = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
  function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
  const artifacts = Object.fromEntries(files(output).filter(file => path.relative(output, file) !== 'build-report.json').sort().map(file => [path.relative(output, file), crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
  const report = { sourceBytes: Buffer.byteLength(source), publicBytes: Buffer.byteLength(homeHTML), publicSha256: crypto.createHash('sha256').update(homeHTML).digest('hex'), publicFingerprint: crypto.createHash('sha256').update(JSON.stringify(artifacts)).digest('hex'), artifacts, removed, buildMutatesSource: false };
  fs.writeFileSync(path.join(output, 'build-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, artifacts: Object.keys(artifacts).length }, null, 2));
  dom.window.close();
}
build().catch(error => { console.error(error.message); process.exitCode = 1; });
