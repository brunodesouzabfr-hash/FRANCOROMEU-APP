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

test('inicializa a aplicação e os três novos motores sem erros de runtime', async () => {
  const virtualConsole = new VirtualConsole();
  const errors = [];
  virtualConsole.on('jsdomError', error => errors.push('jsdom: ' + error.message));
  virtualConsole.on('error', (...args) => errors.push(args.join(' ')));

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://franco-romeu.local/',
    virtualConsole,
    beforeParse(window) {
      window.alert = () => {};
      window.confirm = () => true;
      window.matchMedia = () => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {}
      });
      window.requestAnimationFrame = () => 1;
      window.cancelAnimationFrame = () => {};
      window.IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
      window.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
      window.HTMLCanvasElement.prototype.getContext = function() {
        return {
          clearRect() {}, fillRect() {}, beginPath() {}, arc() {}, fill() {}, stroke() {},
          moveTo() {}, lineTo() {}, save() {}, restore() {}, translate() {}, rotate() {},
          scale() {}, setTransform() {}, drawImage() {}, createLinearGradient() {
            return { addColorStop() {} };
          }
        };
      };
      Object.defineProperty(window.navigator, 'connection', {
        configurable: true,
        value: { saveData: false }
      });
      window.fetch = async () => ({
        ok: true,
        json: async () => ({})
      });
    }
  });

  await new Promise(resolve => setTimeout(resolve, 300));
  assert.equal(errors.length, 0, errors.join('\n'));
  assert.equal(typeof dom.window.FR15_MATERIALIDADE, 'object');
  assert.equal(typeof dom.window.FR15_ARCHIVE, 'object');
  assert.equal(typeof dom.window.FR15_ATLAS, 'object');
  dom.window.close();
});
