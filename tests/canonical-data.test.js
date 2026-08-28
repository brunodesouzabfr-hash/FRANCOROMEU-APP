const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const HTML_FILE = 'base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html';
const START_MARKER = 'const DEFAULT_DATA =';
const END_MARKER = '\n    function loadSystemData()';

function loadCanonicalFixture() {
  const html = fs.readFileSync(HTML_FILE, 'utf8');
  const start = html.indexOf(START_MARKER);
  const end = html.indexOf(END_MARKER, start);

  assert.notEqual(start, -1, 'DEFAULT_DATA não foi encontrado no HTML canônico');
  assert.notEqual(end, -1, 'fim de DEFAULT_DATA não foi encontrado no HTML canônico');

  const literal = html
    .slice(start + START_MARKER.length, end)
    .trim()
    .replace(/;\s*$/, '');
  const data = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });

  return { html, data };
}

test('preserva 115 serviços, 15 categorias e 7 cupons padrão', () => {
  const { data } = loadCanonicalFixture();

  assert.equal(Object.keys(data.SERVICES || {}).length, 115);
  assert.equal(Object.keys(data.CATEGORIES || {}).length, 15);
  assert.equal(Object.keys(data.COUPONS || {}).length, 7);
});

test('mantém IDs, categorias, preços e ordem do banco canônico coerentes', () => {
  const { data } = loadCanonicalFixture();
  const categories = data.CATEGORIES || {};
  const services = data.SERVICES || {};
  const orders = Object.values(categories)
    .map(category => category.ordem)
    .sort((a, b) => a - b);

  assert.deepEqual(orders, Array.from({ length: 15 }, (_, index) => index + 1));

  for (const [key, service] of Object.entries(services)) {
    assert.equal(service.id, key, `serviceId divergente em ${key}`);
    assert.ok(categories[service.categoria], `categoria inexistente em ${key}`);
    assert.ok(String(service.nome || '').trim(), `nome ausente em ${key}`);
    assert.ok(Number.isFinite(Number(service.preco_base)), `preço-base inválido em ${key}`);
  }

  for (const [code, rate] of Object.entries(data.COUPONS || {})) {
    assert.ok(code.trim(), 'cupom sem código');
    assert.ok(Number.isFinite(Number(rate)), `taxa inválida no cupom ${code}`);
    assert.ok(Number(rate) >= 0 && Number(rate) <= 1, `taxa fora da faixa no cupom ${code}`);
  }
});

test('preserva as seis views e as pontes críticas da calculadora', () => {
  const { html } = loadCanonicalFixture();
  const requiredViews = [
    'view-home',
    'view-sobre',
    'view-ambientes',
    'view-projetos3d',
    'view-projetos',
    'view-orcamento'
  ];

  for (const id of requiredViews) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `view ausente: ${id}`);
  }

  for (const token of [
    'id="fr-budget-core"',
    'window.__frCore',
    'addToBudget',
    'selectedServices',
    'renderApp',
    'saveAndRender'
  ]) {
    assert.ok(html.includes(token), `integração crítica ausente: ${token}`);
  }
});
