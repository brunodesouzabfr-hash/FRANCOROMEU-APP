'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const patchRoot = path.join(root, 'assets/patches/fr-additions-2026-10-14');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('patch é fisicamente isolado e registra os oito módulos visuais', () => {
  const manifest = JSON.parse(read('patches/fr-additions-2026-10-14/additions-manifest.json'));
  assert.equal(manifest.policy.additiveOnly, true);
  assert.equal(manifest.policy.hideExistingLayout, false);
  assert.equal(manifest.policy.replaceExistingLayout, false);
  assert.equal(manifest.policy.financialMutation, false);
  assert.deepEqual(manifest.blocks.map(block => block.id), ['HOME-01', 'HOME-02', 'ABOUT-01', 'ENV-01', 'P3D-01', 'PORT-01', 'BUDGET-01', 'JOURNAL-01']);
  ['fr-additions.css', 'fr-additions.js', 'fr-additions-shader.js', 'fr-service-preview.js', 'service-media-map.json'].forEach(file => assert.ok(fs.existsSync(path.join(patchRoot, file)), file));
});

test('CSS e runtime do patch não aplicam overrides aos componentes canônicos', () => {
  const css = read('assets/patches/fr-additions-2026-10-14/fr-additions.css');
  const js = read('assets/patches/fr-additions-2026-10-14/fr-additions.js');
  assert.doesNotMatch(css, /#view-|\.fr6-|\.amb-museum|\.p3d-|\.fr10-/);
  assert.doesNotMatch(js, /FR_STAGE1[456]_FLAGS|portfolioUniverse\s*=|\.hidden\s*=\s*true[^\n]*view/);
  assert.doesNotMatch(js, /addEventListener\(['"](?:wheel|touchstart|touchmove)/);
  assert.match(js, /existingLayoutHiddenByPatch:\s*0/);
  assert.match(js, /financialMutations:\s*0/);
});

test('mapa visual cobre o catálogo sem transportar preço, fórmula ou configuração', () => {
  const map = JSON.parse(read('assets/patches/fr-additions-2026-10-14/service-media-map.json'));
  assert.equal(map.serviceCount, 115);
  assert.equal(map.services.length, 115);
  assert.equal(map.mappedCount, 31);
  assert.equal(map.needsReviewCount, 84);
  assert.equal(map.budgetCoreChanged, false);
  map.services.forEach(record => {
    assert.ok(record.budgetServiceId);
    assert.equal(Object.hasOwn(record, 'price'), false);
    assert.equal(Object.hasOwn(record, 'formula'), false);
    assert.equal(Object.hasOwn(record, 'configs'), false);
  });
  const budgetCoreHash = createHash('sha256').update(read('src/budget-core.js')).digest('hex');
  assert.equal(budgetCoreHash, 'd9b8181bce2387f8087a82d1c82958efd42c0778882598941e2de2c267c9b1cc');
});

test('SPA acrescenta caixas e destroy preserva todos os pontos canônicos', () => {
  const dom = new JSDOM(`<!doctype html><body>
    <main id="view-home" class="view-section active"><section id="fr6-manifesto"></section><section id="fr6-expertise"></section></main>
    <main id="view-sobre" class="view-section"><section id="sobre-hero-section"></section></main>
    <main id="view-ambientes" class="view-section"><div class="amb-museum"><div id="amb-grid-container"></div></div></main>
    <main id="view-projetos3d" class="view-section"><section class="p3d-hero"></section><section class="p3d-showcase"></section></main>
    <main id="view-projetos" class="view-section"><div class="fr10-portfolio-stage"><div id="projects-container"></div></div></main>
    <main id="view-orcamento" class="view-section"></main>
  </body>`, { url: 'http://127.0.0.1:4182/', runScripts: 'outside-only' });
  const { window } = dom;
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.requestAnimationFrame = () => 1;
  window.cancelAnimationFrame = () => {};
  window.IntersectionObserver = class { observe() {} disconnect() {} };
  window.switchView = () => {};
  window.AMB_STYLES = ['Mansory', 'Industrial', 'Contemporâneo'].map((name, index) => ({ id: 'env-' + index, name, essence: 'Essência', desc: 'Descrição factual', img: '/assets/media/ambiente-contemporaneo-01.jpg', palette: ['#000', '#fff'], services: [{ id: 'tinta', role: 'Aplicação relacionada' }] }));
  window.P3D_PROJECTS = [{ title: 'Estudo conceitual', img: '/assets/media/p3d-suite-luxo-01.jpg' }];
  window.GM_PROJECTS = ['porcelanato', 'marmore', 'automacao', 'iluminacao', 'eventos'].map((cat, index) => ({ id: index + 1, cat, catLabel: cat, title: 'Conceito ' + (index + 1), url: '/assets/media/portfolio-' + (cat === 'marmore' ? 'marmore' : cat) + '.jpg' }));
  vm.runInContext(read('assets/patches/fr-additions-2026-10-14/fr-additions.js'), dom.getInternalVMContext());
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  assert.equal(window.document.querySelectorAll('.frap-root').length, 6);
  assert.equal(window.document.querySelectorAll('[data-frap-scene]').length, 12);
  ['fr6-manifesto', 'fr6-expertise', 'sobre-hero-section', 'amb-grid-container', 'projects-container'].forEach(id => assert.ok(window.document.getElementById(id), id));
  assert.equal(window.document.querySelector('#view-projetos .fr10-portfolio-stage').hidden, false);
  assert.equal(window.FRAdditionsPatch.audit().existingLayoutHiddenByPatch, 0);
  window.FRAdditionsPatch.destroy();
  assert.equal(window.document.querySelectorAll('.frap-root').length, 0);
  ['fr6-manifesto', 'fr6-expertise', 'sobre-hero-section', 'amb-grid-container', 'projects-container'].forEach(id => assert.ok(window.document.getElementById(id), id));
});

test('prévia do orçamento é irmã aditiva e não substitui seletor de serviço', async () => {
  const serviceMap = JSON.parse(read('assets/patches/fr-additions-2026-10-14/service-media-map.json'));
  const dom = new JSDOM('<!doctype html><body><main id="view-orcamento"><button id="choice" data-action="selectService" data-service-id="porcelanato">Porcelanato</button></main><script data-frap-map="/map.json"></script></body>', { url: 'http://127.0.0.1:4182/', runScripts: 'outside-only' });
  const { window } = dom;
  window.FR_ADDITIONS_PATCH_FLAGS = { enabled: true, servicePreview: true };
  window.matchMedia = () => ({ matches: false });
  window.requestAnimationFrame = callback => { callback(); return 1; };
  window.cancelAnimationFrame = () => {};
  window.fetch = async () => ({ ok: true, json: async () => serviceMap });
  vm.runInContext(read('assets/patches/fr-additions-2026-10-14/fr-service-preview.js'), dom.getInternalVMContext());
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  await new Promise(resolve => setTimeout(resolve, 0));
  const original = window.document.getElementById('choice');
  const trigger = window.document.querySelector('[data-frap-service-preview="porcelanato"]');
  assert.ok(original.isConnected);
  assert.ok(trigger);
  assert.equal(original.nextElementSibling, trigger);
  trigger.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(window.document.getElementById('frap-service-preview').hidden, false);
  assert.equal(window.FRAdditionsServicePreview.audit().financialMutations, 0);
  window.FRAdditionsServicePreview.destroy();
  assert.ok(original.isConnected);
  assert.equal(window.document.querySelectorAll('[data-frap-service-preview]').length, 0);
});

test('build público conserva Jornal e acrescenta somente a seção isolada', () => {
  const journal = read('dist/projetos/index.html');
  assert.match(journal, /id="frap-journal"/);
  assert.equal((journal.match(/class="frap-journal-card frap-scene"/g) || []).length, 5);
  assert.match(journal, /class="frj-archive" id="arquivo"/);
  assert.match(journal, /data-frj-filter/);
  assert.match(journal, /fr-additions-shader\.js/);
  ['fr-additions.css', 'fr-additions.js', 'fr-additions-shader.js', 'fr-service-preview.js', 'service-media-map.json'].forEach(file => assert.ok(fs.existsSync(path.join(root, 'dist/assets/patches/fr-additions-2026-10-14', file)), file));
});
