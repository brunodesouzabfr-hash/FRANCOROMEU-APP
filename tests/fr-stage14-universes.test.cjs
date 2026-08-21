'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.resolve(__dirname, '..');
const pick = (...candidates) => candidates.find(candidate => fs.existsSync(candidate));
const finalPath = pick(
  path.join(root, 'FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html'),
  path.join(root, 'base-original', 'FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html')
);
const basePath = pick(
  path.join(root, 'upload', 'FRANCO_ROMEU_ETAPA13_ORIGINAL (5)(2).html'),
  path.join(root, 'base-original', 'FRANCO_ROMEU_ETAPA13_ORIGINAL.html')
);
assert.ok(finalPath && basePath, 'Arquivos canônicos da Etapa 13/14 não localizados.');
const html = fs.readFileSync(finalPath, 'utf8');
const base = fs.readFileSync(basePath, 'utf8');

function scriptById(source, id) {
  return source.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`, 'i'))?.[1] || '';
}

test('preserva byte a byte os motores protegidos de Portfólio e PDF', () => {
  for (const id of ['fr-stage2-portfolio-engine', 'fr-pdf-stack-loader']) {
    const before = scriptById(base, id);
    const after = scriptById(html, id);
    assert.ok(before.length > 200, `Motor ${id} não localizado na base.`);
    assert.equal(after, before, `Motor protegido alterado: ${id}`);
  }
});

test('mantém seis views, 115 serviços e divulgação progressiva de 15 categorias', () => {
  assert.equal((html.match(/<main id="view-(?:home|sobre|ambientes|projetos3d|projetos|orcamento)"/g) || []).length, 6);
  const dataStart = html.indexOf('const DEFAULT_DATA =');
  const servicesStart = html.indexOf('        SERVICES: {', dataStart);
  const servicesEnd = html.indexOf('\n        }\n    };', servicesStart);
  assert.ok(dataStart >= 0 && servicesStart > dataStart && servicesEnd > servicesStart);
  const services = [...html.slice(servicesStart, servicesEnd).matchAll(/^\s{12}([a-z0-9_]+):\s*\{\s*id:\s*"([^"]+)"/gm)];
  assert.equal(services.length, 115);
  assert.match(html, /data-action="toggleCatalogCategory"/);
});

test('declara os seis universos e carrega Three.js apenas sob demanda', () => {
  for (const name of ['FORJA', 'MANIFESTO', 'ARTE MATERIAL', 'MODELING SPACE', 'ARQUIVO VIVO', 'ENGENHARIA DE CUSTO']) assert.ok(html.includes(name));
  assert.match(html, /const THREE_CDN='https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/0\.161\.0\/three\.min\.js'/);
  assert.doesNotMatch(html, /<script[^>]+src="[^"]*three(?:\.min)?\.js/i);
  assert.match(html, /webglcontextlost/);
  assert.match(html, /is-fallback/);
});

test('remove promessas não comprovadas e mantém rotulagem das referências', () => {
  assert.doesNotMatch(html, />\s*150\+\s*</);
  assert.doesNotMatch(html, />\s*98%\s*</);
  assert.doesNotMatch(html, /RESPOSTA EM 2H|Portfólio Exclusivo|apenas 2 datas|últimas vagas/i);
  assert.match(html, /Referência visual — não representa obra executada pela Franco Romeu/);
  assert.match(html, /ESTIMATIVA ORIENTATIVA/);
});

test('inclui metadados semânticos e todos os scripts inline são válidos', () => {
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<script type="application\/ld\+json">/);
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => !/application\/ld\+json|\bsrc\s*=/i.test(match[1]));
  const failures = [];
  blocks.forEach((match, index) => {
    try { new Function(match[2]); }
    catch (error) { failures.push(`script ${index + 1}: ${error.message}`); }
  });
  assert.deepEqual(failures, []);
  assert.equal((html.match(/<\/body>/gi) || []).length, 1);
  assert.equal((html.match(/<\/html>/gi) || []).length, 1);
});

test('inicializa seis universos, calculadora e fallback 3D sem erros', { timeout: 14000 }, async () => {
  const runtimeErrors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => {
    if (!/Could not load (script|link)|Not implemented: navigation|Not implemented: HTMLCanvasElement/.test(error.message)) runtimeErrors.push(error.message);
  });
  virtualConsole.on('error', message => runtimeErrors.push(String(message)));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://franco-romeu.local/', virtualConsole,
    beforeParse(window) {
      window.scrollX = 0; window.scrollY = 0;
      window.scrollTo = value => Object.defineProperty(window, 'scrollY', { value: typeof value === 'object' ? Number(value.top || 0) : 0, configurable: true, writable: true });
      window.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      window.requestIdleCallback = callback => window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 10 }), 0);
      window.cancelIdleCallback = id => window.clearTimeout(id);
      class Observer { constructor(callback) { this.callback = callback; } observe(target) { this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }], this); } unobserve() {} disconnect() {} }
      window.IntersectionObserver = Observer;
      window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
      window.HTMLElement.prototype.scrollIntoView = function() {};
      window.HTMLElement.prototype.animate = function() { return { cancel() {}, finished: Promise.resolve() }; };
      window.HTMLElement.prototype.getAnimations = function() { return []; };
      window.HTMLCanvasElement.prototype.getContext = function() { return new Proxy({}, { get(target, key) { return target[key] || (() => {}); }, set(target, key, value) { target[key] = value; return true; } }); };
      window.fetch = async () => ({ ok: false, status: 404, json: async () => ({}) });
      window.open = () => null; window.alert = () => {}; window.confirm = () => false;
      window.URL.createObjectURL = () => 'blob:fr-test'; window.URL.revokeObjectURL = () => {};
      window.CSS = window.CSS || {}; window.CSS.escape = window.CSS.escape || (value => String(value).replace(/[^a-z0-9_-]/gi, '\\$&'));
      Object.defineProperty(window.navigator, 'vibrate', { value: () => true, configurable: true });
      Object.defineProperty(window.navigator, 'clipboard', { value: { writeText: async () => {} }, configurable: true });
    }
  });
  try {
    const { window } = dom, { document } = window;
    await new Promise(resolve => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', resolve, { once: true }) : resolve());
    await new Promise(resolve => setTimeout(resolve, 3700));
    assert.equal(window.FR_STAGE14?.version, '14.0-awwwards-universes');
    assert.equal(window.FR_STAGE14.worlds.length, 6);
    assert.equal(Object.keys(window.__frCore?.SERVICES || {}).length, 115);
    assert.equal(document.querySelectorAll('.fr14-world-signature').length, 6);
    assert.ok(document.querySelector('.fr14-forge-route'));
    assert.ok(document.querySelector('.fr14-chapter-rail'));
    assert.ok(document.querySelector('.fr14-curator-desk'));
    assert.ok(document.querySelector('.fr14-matrix-stage'));
    assert.ok(document.querySelector('.fr14-museum-toolbar'));
    assert.ok(document.querySelector('.fr14-budget-trust'));

    for (const id of ['view-home','view-sobre','view-ambientes','view-projetos3d','view-projetos','view-orcamento']) {
      window.switchView(id);
      const started = Date.now();
      while (document.querySelector('.view-section.active')?.id !== id && Date.now() - started < 2200) await new Promise(resolve => setTimeout(resolve, 60));
      assert.equal(document.querySelectorAll('.view-section.active').length, 1);
      assert.equal(document.querySelector('.view-section.active')?.id, id);
    }
    assert.equal(document.querySelector('.fr14-matrix-stage').classList.contains('is-fallback'), true);
    window.__frCore.appState.step = 2; window.__frCore.renderApp(); await new Promise(resolve => setTimeout(resolve, 60));
    assert.equal(document.querySelectorAll('[data-action="toggleCatalogCategory"]').length, 15);
    window.html2canvas = () => Promise.resolve({}); window.jspdf = { jsPDF: function jsPDF() {} };
    assert.equal(await window.FR_PERFORMANCE.ensurePDFStack(), true);
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    assert.deepEqual([...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))], []);
    assert.deepEqual(runtimeErrors, []);
  } finally { dom.window.close(); }
});
