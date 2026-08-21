'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.resolve(__dirname, '..');
const finalPath = path.join(root, 'FRANCO_ROMEU_ETAPA15_MATERIALIDADE_IMERSIVA.html');
const basePath = path.join(root, 'base-original', 'FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html');
assert.ok(fs.existsSync(finalPath) && fs.existsSync(basePath), 'Etapas 14/15 não localizadas.');
const html = fs.readFileSync(finalPath, 'utf8');
const base = fs.readFileSync(basePath, 'utf8');

function scriptById(source, id) {
  return source.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>', 'i'))?.[1] || '';
}

function serviceCount(source) {
  const dataStart = source.indexOf('const DEFAULT_DATA =');
  const servicesStart = source.indexOf('        SERVICES: {', dataStart);
  const servicesEnd = source.indexOf('\n        }\n    };', servicesStart);
  return [...source.slice(servicesStart, servicesEnd).matchAll(/^\s{12}([a-z0-9_]+):\s*\{\s*id:\s*"([^"]+)"/gm)].length;
}

test('parte da Etapa 14 e preserva byte a byte os três motores críticos', () => {
  for (const id of ['fr-stage2-portfolio-engine', 'fr-pdf-stack-loader', 'fr-budget-core']) {
    assert.ok(scriptById(base, id).length > 1000, 'Motor ausente na base: ' + id);
    assert.equal(scriptById(html, id), scriptById(base, id), 'Motor protegido alterado: ' + id);
  }
});

test('mantém seis views, 115 serviços e o conteúdo 3D existente', () => {
  assert.equal((html.match(/<main id="view-(?:home|sobre|ambientes|projetos3d|projetos|orcamento)"/g) || []).length, 6);
  assert.equal(serviceCount(html), 115);
  assert.match(html, /const PROJECTS = Object\.freeze\(\[/);
  assert.match(html, /window\.P3D_PROJECTS = PROJECTS/);
  assert.match(html, /fr-stage15-materialidade-engine/);
});

test('declara os novos universos e os casos solicitados', () => {
  for (const phrase of [
    'Bancada Calacatta em Órbita',
    'Armários & Guarda-Roupas Integrados',
    'Brinquedomóvel FR',
    'Arena Futebol X1',
    'Tabela de Basquete em Aço',
    'Patinação + Luz DMX',
    'Iluminação Integrada ao Móvel',
    'fr15-portfolio-track',
    'Atlas de atmosferas'
  ]) assert.ok(html.includes(phrase), 'Conteúdo ausente: ' + phrase);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /min-height:44px/);
  assert.match(html, /Referência visual — não é obra FR/);
});

test('remove os blocos sem finalidade do Orçamento sem remover o bridge de PDF', () => {
  const markupOnly = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.doesNotMatch(markupOnly, />\s*ESTIMATIVA ORIENTATIVA\s*</i);
  assert.doesNotMatch(markupOnly, />\s*RETORNO PELO WHATSAPP\s*</i);
  assert.doesNotMatch(html, /<strong>115 serviços<\/strong><small>Catálogo técnico preservado<\/small>/i);
  assert.doesNotMatch(html, /<strong>Escopo editável<\/strong>/i);
  assert.doesNotMatch(html, /<strong>Faixa orientativa<\/strong>/i);
  assert.match(html, /ensurePDFStack/);
});

test('todos os scripts inline permanecem sintaticamente válidos', () => {
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => !/application\/ld\+json|\bsrc\s*=/i.test(match[1]));
  const failures = [];
  blocks.forEach((match, index) => {
    try { new Function(match[2]); }
    catch (error) { failures.push('script ' + (index + 1) + ': ' + error.message); }
  });
  assert.deepEqual(failures, []);
  assert.equal((html.match(/<\/body>/gi) || []).length, 1);
  assert.equal((html.match(/<\/html>/gi) || []).length, 1);
});

test('runtime integra materialidade, arquivo vivo, atlas, orçamento e PDF', { timeout: 18000 }, async () => {
  const runtimeErrors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => {
    if (!/Could not load (script|link)|Not implemented: navigation|Not implemented: HTMLCanvasElement/.test(error.message)) runtimeErrors.push(error.message);
  });
  virtualConsole.on('error', message => runtimeErrors.push(String(message)));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://franco-romeu.local/',
    virtualConsole,
    beforeParse(window) {
      window.scrollX = 0;
      window.scrollY = 0;
      window.scrollTo = value => Object.defineProperty(window, 'scrollY', {
        value: typeof value === 'object' ? Number(value.top || 0) : 0,
        configurable: true,
        writable: true
      });
      window.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      window.requestIdleCallback = callback => window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 10 }), 0);
      window.cancelIdleCallback = id => window.clearTimeout(id);
      class Observer {
        constructor(callback) { this.callback = callback; }
        observe(target) { this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }], this); }
        unobserve() {}
        disconnect() {}
      }
      window.IntersectionObserver = Observer;
      window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
      window.HTMLElement.prototype.scrollIntoView = function() {};
      window.HTMLElement.prototype.animate = function() { return { cancel() {}, finished: Promise.resolve() }; };
      window.HTMLElement.prototype.getAnimations = function() { return []; };
      window.HTMLCanvasElement.prototype.getContext = function() {
        return new Proxy({}, {
          get(target, key) { return target[key] || (() => {}); },
          set(target, key, value) { target[key] = value; return true; }
        });
      };
      window.fetch = async () => ({ ok: false, status: 404, json: async () => ({}) });
      window.open = () => null;
      window.alert = () => {};
      window.confirm = () => false;
      window.URL.createObjectURL = () => 'blob:fr-test';
      window.URL.revokeObjectURL = () => {};
      window.CSS = window.CSS || {};
      window.CSS.escape = window.CSS.escape || (value => String(value).replace(/[^a-z0-9_-]/gi, '\\$&'));
      Object.defineProperty(window.navigator, 'vibrate', { value: () => true, configurable: true });
      Object.defineProperty(window.navigator, 'clipboard', { value: { writeText: async () => {} }, configurable: true });
    }
  });
  try {
    const { window } = dom;
    const { document } = window;
    await new Promise(resolve => document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', resolve, { once: true })
      : resolve());
    await new Promise(resolve => setTimeout(resolve, 3900));

    const audit = window.FR_STAGE15?.audit();
    assert.equal(window.FR_STAGE15?.version, '15.0-materialidade-imersiva');
    assert.equal(audit.services, 115);
    assert.equal(audit.p3dExisting, 6);
    assert.equal(audit.p3dAdded, 10);
    assert.equal(audit.portfolio, 16);
    assert.equal(audit.environments, 12);
    assert.equal(audit.budgetTrustRemoved, true);
    assert.equal(audit.pdfBridge, true);
    assert.ok(document.querySelector('.fr14-matrix-stage'), 'A matriz 3D existente foi removida.');
    assert.equal(document.querySelectorAll('.fr15-p3d-card').length, 10);
    assert.equal(document.querySelectorAll('[data-fr15-group="0"] .fr15-portfolio-card').length, 16);
    assert.equal(document.querySelectorAll('.fr15-amb-row').length, 12);

    document.querySelector('[data-fr15-p3d-card="2"]').click();
    assert.match(document.getElementById('fr15-p3d-name').textContent, /Calacatta/i);
    window.__frCore.appState.selectedServices = [];
    document.getElementById('fr15-p3d-add').click();
    assert.deepEqual(
      window.__frCore.appState.selectedServices.map(item => item.serviceId).sort(),
      ['proj_bancada', 'proj_interiores']
    );
    document.getElementById('fr15-p3d-open').click();
    assert.equal(document.getElementById('fr15-p3d-inspector').classList.contains('is-open'), true);
    document.querySelector('[data-fr15-material="2"]').click();
    assert.match(document.getElementById('fr15-materiality-image').alt, /Materialidade/i);
    document.getElementById('fr15-inspector-close').click();

    document.querySelector('[data-fr15-amb="1"]').click();
    assert.equal(document.getElementById('fr15-amb-project').classList.contains('is-open'), true);
    assert.equal(document.querySelectorAll('.fr15-amb-gallery figure').length, 3);
    assert.match(document.getElementById('fr15-amb-project-title').textContent, /Industrial/i);
    document.getElementById('fr15-amb-add').click();
    assert.ok(window.__frCore.appState.selectedServices.length >= 3);
    document.getElementById('fr15-amb-close').click();

    document.querySelector('[data-fr15-filter="marmore"]').click();
    assert.equal(document.querySelectorAll('[data-fr15-group="0"] .fr15-portfolio-card').length, 3);
    document.querySelector('[data-fr15-group="0"] .fr15-portfolio-card').click();
    assert.equal(document.getElementById('project-modal').classList.contains('open'), true);
    window.closeProjectModal();

    window.__frCore.appState.step = 2;
    window.__frCore.renderApp();
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(document.querySelectorAll('[data-action="toggleCatalogCategory"]').length, 15);
    window.html2canvas = () => Promise.resolve({});
    window.jspdf = { jsPDF: function jsPDF() {} };
    assert.equal(await window.FR_PERFORMANCE.ensurePDFStack(), true);

    assert.equal(document.querySelector('.fr14-budget-trust'), null);
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    assert.deepEqual([...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))], []);
    const buttonsWithoutType = [...document.querySelectorAll('button:not([type])')];
    assert.deepEqual(buttonsWithoutType.map(button => button.outerHTML.slice(0, 240)), []);
    assert.deepEqual(runtimeErrors, []);
  } finally {
    dom.window.close();
  }
});
