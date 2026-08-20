(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.FRBudgetCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const PAYMENT_DISCOUNTS = Object.freeze({ cash: 0.10, pix: 0.04, crypto: 0.20 });

  function roundCurrency(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.round((number + Number.EPSILON) * 100) / 100 : 0;
  }

  function resolveConfigOption(configDef, selectedValue) {
    const options = Array.isArray(configDef && configDef.opcoes) ? configDef.opcoes : [];
    if (Number.isInteger(selectedValue)) return options[selectedValue] || null;
    if (typeof selectedValue === 'string') {
      const selected = selectedValue.trim();
      const byId = options.find(option => option && String(option.id) === selected);
      if (byId) return byId;
      if (/^\d+$/.test(selected)) return options[Number(selected)] || null;
    }
    return null;
  }

  function normalizeConfigSelection(configDef, selectedValue) {
    const option = resolveConfigOption(configDef, selectedValue);
    return option ? String(option.id) : null;
  }

  function calculateBudget(catalog, state, policy) {
    const services = catalog && typeof catalog === 'object' ? catalog : {};
    const source = state && typeof state === 'object' ? state : {};
    const settings = Object.assign({ visitFee: 99, visitWaiverThreshold: 450, estimateVariance: 0.12 }, policy);
    const selected = Array.isArray(source.selectedServices) ? source.selectedServices : [];
    const warnings = [];
    let baseSubtotal = 0;
    let estimatedItems = 0;

    selected.forEach(item => {
      const service = services[item && item.serviceId];
      if (!service) {
        warnings.push(`Serviço desconhecido: ${item && item.serviceId ? item.serviceId : 'sem identificador'}.`);
        return;
      }
      const quantity = Number(item.quantidade);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        warnings.push(`Quantidade inválida em ${service.nome || service.id}.`);
        return;
      }
      let unitPrice = Number(service.preco_base) || 0;
      Object.entries(item.configs || {}).forEach(([key, selectedValue]) => {
        const config = service.configuracoes && service.configuracoes[key];
        const option = resolveConfigOption(config, selectedValue);
        if (!option) {
          warnings.push(`Configuração desconhecida em ${service.nome || service.id}: ${key}.`);
          return;
        }
        unitPrice += Number(option.adicional) || 0;
      });
      if (item.estimated || item.source === 'iqe' || item.source === 'ambiente') estimatedItems += 1;
      baseSubtotal += unitPrice * quantity;
    });

    const environments = Array.isArray(source.environment) ? source.environment : [];
    const markupRate = ['Comercial', 'Exterior', 'Prédio'].reduce(
      (rate, condition) => rate + (environments.includes(condition) ? 0.05 : 0), 0
    );
    const subtotal = roundCurrency(baseSubtotal * (1 + markupRate));
    const couponRate = Math.min(1, Math.max(0, Number(source.descontoAplicado) || 0));
    const couponDiscount = roundCurrency(subtotal * couponRate);
    const paymentRate = PAYMENT_DISCOUNTS[source.paymentMethod] || 0;
    const paymentDiscount = roundCurrency((subtotal - couponDiscount) * paymentRate);
    const visitWaived = subtotal > settings.visitWaiverThreshold;
    const visitCharged = visitWaived ? 0 : roundCurrency(settings.visitFee);
    const total = roundCurrency(Math.max(0, subtotal + visitCharged - couponDiscount - paymentDiscount));
    const variance = Math.max(0, Number(settings.estimateVariance) || 0);
    const estimateMin = roundCurrency(Math.max(0, total * (1 - variance)));
    const estimateMax = roundCurrency(total * (1 + variance));
    const validItems = selected.length - warnings.filter(message => /Serviço desconhecido|Quantidade inválida/.test(message)).length;
    const confidence = validItems <= 0 ? 'baixa' : estimatedItems > 0 || warnings.length ? 'média' : 'alta';

    return {
      subtotal,
      discount: couponDiscount,
      paymentDiscount,
      total,
      visit: roundCurrency(settings.visitFee),
      visitCharged,
      visitWaived,
      eligibleSubtotal: subtotal,
      markupRate,
      estimateMin,
      estimateMax,
      estimatedItems,
      confirmedItems: Math.max(0, selected.length - estimatedItems),
      confidence,
      warnings
    };
  }

  return { PAYMENT_DISCOUNTS, roundCurrency, resolveConfigOption, normalizeConfigSelection, calculateBudget };
});
