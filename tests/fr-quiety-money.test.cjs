'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const runtime = fs.readFileSync(path.join(root, 'assets/js/fr-quiety-money.js'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const fixture = `<!doctype html><html lang="pt-BR"><head></head><body>
  <nav id="smart-nav" class="nav-state-header"><a id="smart-nav-brand" href="/">FR</a></nav>
  <main id="view-home" class="view-section active">
    <section><article class="fr6-service"><div class="fr6-service-media"></div><button type="button">Abrir</button></article></section>
  </main>
  <main id="view-sobre" class="view-section"><section><article class="pillar-card"></article></section></main>
  <main id="view-ambientes" class="view-section"><section><article class="amb-style-card"></article></section></main>
  <main id="view-projetos3d" class="view-section"><section><article class="p3d-card"><div class="p3d-card-media"></div></article></section></main>
  <main id="view-projetos" class="view-section"><section><article class="fr16-portfolio-card"><div class="fr16-portfolio-card-media"></div></article></section></main>
  <main id="view-orcamento" class="view-section"><section><article class="service-card"></article></section></main>
</body></html>`;

function makeDom({ reduced = false, fine = true, enabled = true } = {}) {
  const dom = new JSDOM(fixture, {
    runScripts: 'outside-only',
    url: 'https://www.francoromeufr.com.br/'
  });
  const { window } = dom;
  window.FR_QUIETY_FLAGS = { enabled };
  window.matchMedia = query => ({
    media: query,
    matches: query.includes('prefers-reduced-motion') ? reduced : query.includes('pointer: fine') ? fine : false,
    addEventListener() {},
    removeEventListener() {}
  });
  window.requestAnimationFrame = callback => window.setTimeout(() => callback(window.performance.now()), 0);
  window.cancelAnimationFrame = id => window.clearTimeout(id);
  window.HTMLCanvasElement.prototype.getContext = () => ({
    clearRect() {}, save() {}, restore() {}, setTransform() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, arc() {},
    set globalCompositeOperation(value) {}, set strokeStyle(value) {}, set lineWidth(value) {}
  });
  window.eval(runtime);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return dom;
}

function wait(window, milliseconds = 25) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

test('instala uma única camada tardia, local e reversível', () => {
  assert.equal((html.match(/id="fr-quiety-money-css"/g) || []).length, 1);
  assert.equal((html.match(/id="fr-quiety-money-preflight"/g) || []).length, 1);
  assert.equal((html.match(/src="assets\/js\/fr-quiety-money\.js"/g) || []).length, 1);
  assert.ok(html.indexOf('id="fr-quiety-money-preflight"') < html.indexOf('id="fr-quiety-money-css"'));
  assert.match(html, /FR_QUIETY_FLAGS\.enabled===false/);
  assert.match(html, /prefers-reduced-motion: reduce/);
  assert.ok(html.indexOf('id="fr-quiety-money-css"') > html.indexOf('id="fr-site-foundation"'));
  assert.ok(html.indexOf('assets/js/fr-quiety-money.js') > html.indexOf('id="fr-site-foundation-engine"'));
  assert.match(runtime, /17\.0-palimpesto-de-forja/);
  assert.match(runtime, /FR_QUIETY_FLAGS/);
  assert.match(runtime, /function destroy\(\)/);
  assert.match(runtime, /sessionStorage\.setItem\('frqm-memory-v1'/);
  assert.doesNotMatch(runtime, /localStorage/);
  assert.doesNotMatch(runtime, /\b(?:THREE|gsap|ScrollTrigger|Lenis|Zustand|React)\b/);
  assert.match(html, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(packageJson.scripts.test, /fr-quiety-money\.test\.cjs/);
});

test('declara seis mundos distintos e mantém a linguagem factual', () => {
  for (const [view, key, line] of [
    ['view-home', 'forja', 'A matéria não pede atenção. Ela a toma.'],
    ['view-sobre', 'palimpsesto', 'Toda escolha deixa rastro.'],
    ['view-ambientes', 'patina', 'Nenhuma atmosfera nasce neutra.'],
    ['view-projetos3d', 'wireframe', 'O espaço ensaia antes de existir.'],
    ['view-projetos', 'arquivo', 'O que não foi executado continua dizendo a verdade.'],
    ['view-orcamento', 'ledger', 'Toda invenção precisa caber no mundo.']
  ]) {
    assert.ok(runtime.includes(`'${view}'`), `View ausente: ${view}`);
    assert.ok(runtime.includes(`key: '${key}'`), `Mundo ausente: ${key}`);
    assert.ok(runtime.includes(line), `Linha conceitual ausente: ${line}`);
  }
  assert.match(html, /Referência visual — não representa obra executada pela Franco Romeu/);
  assert.match(html, /estudo 3D ilustrativo/i);
});

test('ativa os sistemas por contexto, muda de mundo e executa rollback', async () => {
  const dom = makeDom();
  const { window } = dom;
  await wait(window);
  const { document } = window;
  const api = window.FR_QUIETY_MONEY;
  assert.ok(api);
  assert.equal(api.version, '17.0-palimpesto-de-forja');
  assert.ok(document.documentElement.classList.contains('frqm-ready'));
  assert.equal(document.documentElement.dataset.frqmWorld, 'forja');
  assert.equal(document.querySelectorAll('#frqm-atmosphere,#frqm-spine,#frqm-veil').length, 3);
  assert.ok(document.querySelector('.fr6-service').hasAttribute('data-frqm-node'));
  assert.ok(document.querySelector('.fr6-service-media').hasAttribute('data-frqm-aperture'));

  document.querySelector('#view-home').classList.remove('active');
  document.querySelector('#view-projetos3d').classList.add('active');
  document.dispatchEvent(new window.CustomEvent('frViewChanged', { detail: { viewId: 'view-projetos3d' } }));
  await wait(window);
  assert.equal(document.documentElement.dataset.frqmWorld, 'wireframe');
  assert.match(document.querySelector('#frqm-spine').textContent, /Wireframe/);

  document.querySelector('button').dispatchEvent(new window.MouseEvent('click', { bubbles: true, clientX: 80, clientY: 120 }));
  assert.equal(document.querySelectorAll('.frqm-inscription').length, 1);
  assert.equal(api.audit().clickMemory, 1);

  api.destroy();
  assert.ok(!document.documentElement.classList.contains('frqm-ready'));
  assert.equal(document.querySelectorAll('#frqm-atmosphere,#frqm-spine,#frqm-veil,.frqm-inscription').length, 0);
  dom.window.close();
});

test('feature flag desliga a camada sem alterar a aplicação', async () => {
  const dom = makeDom({ enabled: false });
  await wait(dom.window);
  assert.equal(dom.window.FR_QUIETY_MONEY.audit().enabled, false);
  assert.ok(!dom.window.document.documentElement.classList.contains('frqm-ready'));
  assert.equal(dom.window.document.querySelectorAll('#frqm-atmosphere,#frqm-spine,#frqm-veil').length, 0);
  dom.window.close();
});

test('movimento reduzido preserva conteúdo e suprime marcas animadas', async () => {
  const dom = makeDom({ reduced: true });
  const { window } = dom;
  await wait(window);
  assert.ok(window.document.documentElement.classList.contains('frqm-reduced'));
  window.document.querySelector('button').dispatchEvent(new window.MouseEvent('click', { bubbles: true, clientX: 50, clientY: 50 }));
  assert.equal(window.document.querySelectorAll('.frqm-inscription').length, 0);
  assert.equal(window.FR_QUIETY_MONEY.audit().reducedMotion, true);
  window.FR_QUIETY_MONEY.destroy();
  dom.window.close();
});
