'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'FRANCO_ROMEU_ETAPA15_SITES_INDIVIDUAIS.html');
const minPath = path.join(root, 'FRANCO_ROMEU_ETAPA15_SITES_INDIVIDUAIS.min.html');
const source = fs.readFileSync(sourcePath, 'utf8');
const html = fs.readFileSync(minPath, 'utf8');

test('distribuição compacta é menor e preserva a estrutura crítica', () => {
  assert.ok(Buffer.byteLength(html) < Buffer.byteLength(source));
  assert.equal((html.match(/<main id="view-(?:home|sobre|ambientes|projetos3d|projetos|orcamento)"/g) || []).length, 6);
  assert.match(html, /fr-stage15-individual-sites-engine/);
  assert.match(html, /fr-pdf-stack-loader/);
  assert.doesNotMatch(html, />\s*ESTIMATIVA ORIENTATIVA\s*</);
  const failures = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => !/application\/ld\+json|\bsrc\s*=/i.test(match[1]))
    .flatMap((match, index) => {
      try { new Function(match[2]); return []; }
      catch (error) { return [`script ${index + 1}: ${error.message}`]; }
    });
  assert.deepEqual(failures, []);
});

test('distribuição compacta inicializa os três universos e o motor comercial', { timeout: 12000 }, async () => {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://franco-romeu.local/',
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
    const { window } = dom;
    await new Promise(resolve => window.document.readyState === 'loading' ? window.document.addEventListener('DOMContentLoaded', resolve, { once: true }) : resolve());
    await new Promise(resolve => setTimeout(resolve, 3800));
    assert.equal(window.FR_STAGE15?.version, '15.0-individual-awwwards-sites');
    assert.deepEqual(JSON.parse(JSON.stringify(window.FR_STAGE15.audit())), { services:115, environments:12, p3d:6, archive:16, budgetNoise:0, spiral:'fallback' });
    assert.equal(window.document.querySelectorAll('.fr15-atlas-card').length, 12);
    assert.equal(window.document.querySelectorAll('.fr15-archive-card').length, 32);
    assert.equal(window.document.querySelectorAll('[id]').length, new Set([...window.document.querySelectorAll('[id]')].map(node => node.id)).size);
  } finally { dom.window.close(); }
});
