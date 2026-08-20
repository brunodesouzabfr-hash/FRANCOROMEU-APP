const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateBudget, resolveConfigOption, roundCurrency } = require('../src/budget-core');

const catalog = {
  porcelanato: {
    id: 'porcelanato', nome: 'Porcelanato', preco_base: 70,
    configuracoes: { formato: { opcoes: [
      { id: 'pequeno', adicional: 0 }, { id: 'liquido', adicional: 150 }
    ] } }
  }
};
const state = overrides => ({
  selectedServices: [{ serviceId: 'porcelanato', quantidade: 2, configs: {} }],
  environment: [], descontoAplicado: 0, paymentMethod: '', ...overrides
});

describe('FRBudgetCore', () => {
  test('calcula preço-base vezes quantidade e cobra visita abaixo do limite', () => {
    assert.equal(calculateBudget(catalog, state()).total, 239);
  });
  for (const selected of [1, 'liquido']) test(`resolve o mesmo adicional por índice legado ou ID (${selected})`, () => {
    const result = calculateBudget(catalog, state({ selectedServices: [{ serviceId: 'porcelanato', quantidade: 2, configs: { formato: selected } }] }));
    assert.equal(result.subtotal, 440); assert.equal(result.total, 539);
  });
  test('resolve opção diretamente por ID', () => {
    assert.equal(resolveConfigOption(catalog.porcelanato.configuracoes.formato, 'liquido').adicional, 150);
  });
  test('acumula markups Comercial, Exterior e Prédio', () => {
    assert.equal(calculateBudget(catalog, state({ environment: ['Comercial', 'Exterior', 'Prédio'] })).subtotal, 161);
  });
  test('aplica cupom antes do desconto de pagamento', () => {
    const result = calculateBudget(catalog, state({ descontoAplicado: 0.10, paymentMethod: 'pix' }));
    assert.equal(result.discount, 14); assert.equal(result.paymentDiscount, 5.04); assert.equal(result.total, 219.96);
  });
  for (const [price, waived, charged] of [[449.99, false, 99], [450, false, 99], [450.01, true, 0]]) test(`aplica fronteira da visita em ${price}`, () => {
    const custom = { item: { id: 'item', nome: 'Item', preco_base: price, configuracoes: {} } };
    const result = calculateBudget(custom, state({ selectedServices: [{ serviceId: 'item', quantidade: 1, configs: {} }] }));
    assert.equal(result.visitWaived, waived); assert.equal(result.visitCharged, charged);
  });
  test('arredonda moeda e ignora dados desconhecidos sem NaN', () => {
    assert.equal(roundCurrency(1.005), 1.01);
    const result = calculateBudget(catalog, state({ selectedServices: [
      { serviceId: 'inexistente', quantidade: 1, configs: {} },
      { serviceId: 'porcelanato', quantidade: 1, configs: { formato: 'inexistente' } }
    ] }));
    assert.equal(Number.isFinite(result.total), true); assert.equal(result.warnings.length, 2);
  });
});
