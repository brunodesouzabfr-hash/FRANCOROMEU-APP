'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('jsdom');

execFileSync(process.execPath, ['scripts/build-site.cjs'], { stdio: 'pipe' });
const source = fs.readFileSync('index.html', 'utf8');
const html = fs.readFileSync('dist/index.html', 'utf8');
const document = new JSDOM(html).window.document;
function data(text) {
  const start = text.indexOf('const DEFAULT_DATA');
  const assignment = text.indexOf('=', start);
  const end = text.indexOf('function loadSystemData', assignment);
  return vm.runInNewContext('(' + text.slice(assignment + 1, end).trim().replace(/;\s*$/, '') + ')');
}
test('build público remove editores e conserva catálogo e núcleo financeiro', () => {
  assert.ok(new JSDOM(source).window.document.getElementById('god-mode-panel'), 'editor local deve continuar disponível na fonte');
  assert.equal(document.querySelector('#god-mode-panel,#gm-backdrop,#admin-container'), null);
  assert.doesNotMatch(html, /GOD MODE 2\.0|FRANCO ADMIN|window\.admin\s*=|function renderAdminPanel\b|window\.gmDownloadFinalHTML\s*=/);
  assert.doesNotMatch(html,/function loadConfigData\b|fetch\(["']\.\/config\.json["']\)/,'unused administrative configuration is not requested by the public build');
  assert.equal(JSON.stringify(data(html)), JSON.stringify(data(source)));
  assert.equal(Object.keys(data(html).SERVICES).length, 115);
  assert.equal(Object.keys(data(html).CATEGORIES).length, 15);
  assert.equal(Object.keys(data(html).COUPONS).length, 7);
  const core = new JSDOM(source).window.document.getElementById('fr-budget-core').textContent;
  const a = {}, b = {}; vm.runInNewContext(core, a); vm.runInNewContext(document.getElementById('fr-budget-core').textContent, b);
  assert.equal(a.FRBudgetCore.roundCurrency(1234.567), b.FRBudgetCore.roundCurrency(1234.567));
  assert.deepEqual(Object.keys(a.FRBudgetCore), Object.keys(b.FRBudgetCore));
});
test('scripts compilados e rotas públicas são válidos e não expõem a fonte local', () => {
  for (const script of document.scripts) {
    if (!script.src && (!script.type || script.type === 'text/javascript')) new vm.Script(script.textContent);
  }
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  assert.equal(config.outputDirectory, 'dist', 'single public output matches the deployment configuration');
  assert.equal(config.cleanUrls, true);
  assert.equal(config.rewrites, undefined, 'arquivos HTML próprios, sem fallback indiscriminado para a Home');
  assert.equal(fs.existsSync('dist/base-original'), false);
  assert.equal(fs.existsSync('dist/docs'), false);
  assert.equal(fs.existsSync('dist/.env.example'), false);
  assert.equal(fs.existsSync('dist/assets/js/fr-price-reference.js'), false);
  assert.equal(fs.existsSync('dist/assets/css/fr-price-reference.css'), false);
  assert.equal(fs.existsSync('dist/assets/data/price-reference-2026-10-08.json'), false);
  assert.equal(document.body.querySelector('style'), null, 'a cascata final deve preceder o primeiro paint do conteúdo');
  const sourceStyles = [...new JSDOM(source).window.document.querySelectorAll('style')].map(node => node.id);
  assert.deepEqual([...document.querySelectorAll('style')].map(node => node.id), [...sourceStyles, 'frmedia-style'], 'ordem e IDs preservados; somente estilo isolado da galeria acrescentado');
  for (const view of ['home', 'sobre', 'ambientes', 'projetos3d', 'projetos', 'orcamento']) assert.ok(document.getElementById('view-' + view));
});
test('as seis URLs entregam canonical, título e heading próprios antes do JavaScript', () => {
  const routes = { '/': 'home', '/sobre': 'sobre', '/ambientes': 'ambientes', '/projetos-3d': 'projetos3d', '/portfolio': 'projetos', '/orcamento': 'orcamento' };
  const titles = new Set();
  for (const [route, view] of Object.entries(routes)) {
    const page = new JSDOM(fs.readFileSync('dist/' + (route === '/' ? 'index' : route.slice(1)) + '.html', 'utf8')).window.document;
    assert.equal(page.querySelector('link[rel="canonical"]').href, 'https://www.francoromeufr.com.br' + route);
    assert.equal(page.querySelectorAll('.view-section.active').length, 1);
    assert.equal(page.querySelector('.view-section.active').id, 'view-' + view);
    assert.equal(page.querySelectorAll('h1').length, 1);
    assert.ok(page.querySelector('#view-' + view + ' h1'));
    titles.add(page.title);
  }
  assert.equal(titles.size, 6);
});
test('hero responsivo e sitemap de imagens usam ativos íntegros, sem modificar originais', () => {
  const crypto = require('node:crypto');
  const media = JSON.parse(fs.readFileSync('assets/optimized/media-manifest.json', 'utf8'));
  const hero = document.querySelector('.fr6-hero-media picture');
  assert.equal(hero.querySelectorAll('source').length, 2);
  assert.equal(hero.querySelector('img').getAttribute('loading'), 'eager');
  assert.equal(hero.querySelector('img').getAttribute('fetchpriority'), 'high');
  const preloads=[...document.querySelectorAll('link[rel="preload"][as="image"]')];
  assert.equal(preloads.length,1,'a single hero image should be preloaded');
  assert.equal(preloads[0].type,'image/avif');
  assert.equal(preloads[0].getAttribute('imagesrcset'),hero.querySelector('source[type="image/avif"]').getAttribute('srcset'));
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(media.original)).digest('hex'), media.originalSha256);
  for (const variant of media.variants) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(variant.path)).digest('hex'), variant.sha256);
  const sitemap = new JSDOM(fs.readFileSync('dist/sitemap-images.xml', 'utf8'), { contentType: 'text/xml' }).window.document;
  assert.equal(sitemap.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc').length, 0, 'unreleased images stay out of active sitemaps');
});
test('página própria do estudo tem HTML e imagens sem motor financeiro nem modelo fictício', () => {
  const text=fs.readFileSync('dist/projetos/cozinha-lavanderia.html','utf8'),caseDoc=new JSDOM(text).window.document;
  assert.equal(caseDoc.querySelector('link[rel="canonical"]').href,'https://www.francoromeufr.com.br/projetos/cozinha-lavanderia');
  assert.equal(caseDoc.querySelectorAll('h1').length,1);
  assert.equal(caseDoc.querySelectorAll('.frmedia-card').length,48);
  assert.equal(caseDoc.querySelectorAll('.frmedia-card img[src]').length,48);
  assert.ok([...caseDoc.querySelectorAll('.frmedia-label')].every(n=>/Estudo 3D|Projeto realizado|Antes — reconstituição técnica|Depois — realização Franco Romeu|Materialidade|Capa editorial/.test(n.textContent)));
  assert.equal(caseDoc.getElementById('fr-budget-core'),null);
  assert.doesNotMatch(text,/FRBudgetCore|three@|\.glb|AggregateRating/);
  assert.ok([...caseDoc.querySelectorAll('img[src]')].every(n=>n.getAttribute('src').startsWith('/assets/')));
  assert.ok(caseDoc.getElementById('fr-case-hero-image').srcset.includes('480w'));
  const graph=JSON.parse(caseDoc.querySelector('script[type="application/ld+json"]').textContent);
  const work=graph['@graph'].find(node=>node['@type']==='CreativeWork');
  assert.ok(work);assert.match(work.creativeWorkStatus,/Estudo visual de projeto/);
  const organization=graph['@graph'].find(node=>Array.isArray(node['@type'])&&node['@type'].includes('LocalBusiness'));
  assert.equal(organization['@id'],'https://www.francoromeufr.com.br/#organization');assert.equal(organization.geo,undefined);
  assert.doesNotMatch(fs.readFileSync('dist/sitemap.xml','utf8'),/projetos\/cozinha-lavanderia/, 'noindex study is not an active sitemap entry');
  assert.doesNotMatch(fs.readFileSync('dist/sitemap-images.xml','utf8'),/projetos\/cozinha-lavanderia/);
});

test('intro V04 e laboratório não indexável chegam à saída pública com imagem oficial', () => {
  const introFile = 'dist/assets/intro/fr-intro-cinematic.js';
  const monogram = 'dist/assets/brand/franco-romeu-monograma-dourado-384.webp';
  const profile = 'dist/assets/brand/franco-romeu-medalhao-esmeralda-256.webp';
  const lab = 'dist/intro-franco-romeu-laboratorio.html';
  for (const asset of [introFile,monogram,profile,lab]) {
    assert.ok(fs.existsSync(asset), 'arquivo público ausente: '+asset);
  }
  assert.match(fs.readFileSync(lab,'utf8'), /name="robots" content="noindex,nofollow"/);
  assert.match(fs.readFileSync(introFile,'utf8'), /monograma-dourado-384\.webp/);
  assert.equal(document.querySelector('#loader'), null);
  assert.ok(document.querySelector('script[src="/assets/intro/fr-intro-cinematic.js"]'));
});
