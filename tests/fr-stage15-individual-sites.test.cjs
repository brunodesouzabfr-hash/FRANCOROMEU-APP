'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.resolve(__dirname, '..');
const finalPath = path.join(root, 'FRANCO_ROMEU_ETAPA15_SITES_INDIVIDUAIS.html');
const basePath = path.join(root, 'FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html');
assert.ok(fs.existsSync(finalPath) && fs.existsSync(basePath), 'Etapas 14/15 não localizadas.');
const html = fs.readFileSync(finalPath, 'utf8');
const base = fs.readFileSync(basePath, 'utf8');

function scriptById(source, id) {
  return source.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`, 'i'))?.[1] || '';
}

test('preserva byte a byte os motores financeiros e de arquivo protegidos', () => {
  for (const id of ['fr-stage2-portfolio-engine', 'fr-pdf-stack-loader']) {
    assert.equal(scriptById(html, id), scriptById(base, id), `Motor protegido alterado: ${id}`);
  }
});

test('mantém seis views, 115 serviços e 15 categorias progressivas', () => {
  assert.equal((html.match(/<main id="view-(?:home|sobre|ambientes|projetos3d|projetos|orcamento)"/g) || []).length, 6);
  const dataStart = html.indexOf('const DEFAULT_DATA =');
  const servicesStart = html.indexOf('        SERVICES: {', dataStart);
  const servicesEnd = html.indexOf('\n        }\n    };', servicesStart);
  const services = [...html.slice(servicesStart, servicesEnd).matchAll(/^\s{12}([a-z0-9_]+):\s*\{\s*id:\s*"([^"]+)"/gm)];
  assert.equal(services.length, 115);
  assert.match(html, /data-action="toggleCatalogCategory"/);
});

test('instala os três sites individuais e remove o bloco sem finalidade do Orçamento', () => {
  assert.match(html, /fr-stage15-individual-sites-engine/);
  assert.match(html, /Category → Enter → Back \/ Next/);
  assert.match(html, /fr15-loop-track/);
  assert.match(html, /fr15-env-gallery/);
  assert.doesNotMatch(html, />\s*ESTIMATIVA ORIENTATIVA\s*</);
  assert.doesNotMatch(html, />\s*RETORNO PELO WHATSAPP\s*</);
  assert.doesNotMatch(html, /<strong>Escopo editável<\/strong>/i);
  assert.doesNotMatch(html, /<strong>Faixa orientativa<\/strong>/i);
});

test('mantém dependências gráficas sob demanda e fallback explícito', () => {
  assert.match(html, /script\.src='https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/0\.161\.0\/three\.min\.js'/);
  assert.doesNotMatch(html, /<script[^>]+src="[^"]*three(?:\.min)?\.js/i);
  assert.match(html, /webglcontextlost/);
  assert.match(html, /is-static/);
  assert.match(html, /prefers-reduced-motion:reduce/);
});

test('todos os scripts inline permanecem sintaticamente válidos', () => {
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

test('runtime integra Atlas, jornada 3D, loop horizontal, Calculadora e PDF', { timeout: 18000 }, async () => {
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
    await new Promise(resolve => setTimeout(resolve, 3800));
    assert.equal(window.FR_STAGE15?.version, '15.0-individual-awwwards-sites');
    assert.deepEqual(JSON.parse(JSON.stringify(window.FR_STAGE15.audit())), { services:115, environments:12, p3d:6, archive:16, budgetNoise:0, spiral:'fallback' });
    assert.equal(document.querySelectorAll('.fr15-atlas-card').length, 12);
    assert.equal(document.querySelectorAll('.fr15-archive-card').length, 32);
    assert.ok(document.querySelector('.fr15-p3d'));
    assert.equal(document.querySelector('.fr14-matrix-stage'), null);
    assert.equal(document.querySelector('.fr14-museum-toolbar'), null);
    assert.equal(document.querySelector('.fr14-budget-trust'), null);

    document.querySelector('.fr15-atlas-card').click();
    assert.equal(document.querySelector('.fr15-atlas').classList.contains('is-detail'), true);
    assert.equal(document.querySelectorAll('.fr15-env-shot').length, 4);
    assert.equal(document.querySelectorAll('.fr15-env-shot .fr15-ref').length, 4);
    document.querySelector('[data-env-back]').click();

    document.querySelector('[data-p3-discipline="0"]').click();
    document.querySelector('[data-p3-enter]').click();
    assert.equal(document.querySelector('.fr15-p3d').classList.contains('is-entered'), true);
    assert.match(document.querySelector('[data-p3-title]').textContent, /Suíte Master/i);
    document.querySelector('[data-p3-next]').click();
    await new Promise(resolve => setTimeout(resolve, 360));
    assert.match(document.querySelector('[data-p3-title]').textContent, /Sala de Estar/i);

    window.__frCore.appState.step = 2; window.__frCore.renderApp();
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(document.querySelectorAll('[data-action="toggleCatalogCategory"]').length, 15);
    window.html2canvas = () => Promise.resolve({}); window.jspdf = { jsPDF: function jsPDF() {} };
    assert.equal(await window.FR_PERFORMANCE.ensurePDFStack(), true);
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    assert.deepEqual([...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))], []);
    assert.deepEqual(runtimeErrors, []);
  } finally { dom.window.close(); }
});
