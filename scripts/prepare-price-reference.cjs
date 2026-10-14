'use strict';
const fs = require('node:fs');
const crypto = require('node:crypto');
const vm = require('node:vm');
const sourceFile = 'FR_COMPARATIVO_LEROY_MERLIN_2026-10-08.md';
function rows(text, heading) {
  const section = text.split('## ' + heading + '\n')[1]?.split('\n## ')[0];
  if (!section) throw new Error('Seção ausente: ' + heading);
  return section.split('\n').filter(line => /^\|/.test(line)).slice(2).map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
}
function money(text) {
  const match = /^R\$\s*(-?[\d.]+,\d{2})$/.exec(text);
  return match ? Number(match[1].replaceAll('.', '').replace(',', '.')) : null;
}
function parseReport(text) {
  const services = rows(text, 'Inventário integral FR: 115 serviços').map(([id, name, unit, price, matches]) => ({ id, name, unit, basePrice: money(price), referenceCodes: [...matches.matchAll(/\[(\d{8})\]/g)].map(match => match[1]) }));
  const references = rows(text, 'Inventário Leroy encontrado: 94 códigos').map(([link, name, observed, unit, related, note]) => {
    const match = /^\[(\d{8})\]\((https:\/\/www\.leroymerlin\.com\.br\/[^)]+)\)$/.exec(link);
    if (!match) throw new Error('Fonte inválida: ' + link);
    const value = money(observed), status = /Divergente/.test(observed) ? 'divergent' : value === 0 ? 'consult' : value !== null ? 'historical' : /indexado/.test(observed) ? 'indexed' : 'unconfirmed';
    return { code: match[1], url: match[2], name, observed, price: status === 'historical' ? value : null, status, unit, serviceIds: related.split(',').map(id => id.trim()).filter(id => services.some(service => service.id === id)), note };
  });
  const options = rows(text, 'Todas as opções FR: 403 adicionais').map(([serviceId, group, name, price]) => ({ serviceId, group, name, additional: money(price) }));
  const gaps = rows(text, 'Ausências e desdobramentos do FR').map(([family, state, observed, recommendation]) => ({ family, state, observed, recommendation, approval: 'pending_scope_and_fr_price' }));
  const priorities = text.split('## Ajustes prioritários antes de mudar preços\n')[1]?.split('\n## ')[0].split('\n').filter(line => /^\d+\./.test(line)).map(line => line.replace(/^\d+\.\s*/, ''));
  if (services.length !== 115 || references.length !== 94 || options.length !== 403 || new Set(services.map(s => s.id)).size !== 115 || new Set(references.map(r => r.code)).size !== 94) throw new Error('Contagens do anexo divergentes');
  return { version: 1, collectedAt: '2026-10-08', source: sourceFile, sourceSha256: crypto.createHash('sha256').update(text).digest('hex'), nature: 'documentary_historical_not_quote', services, references, options, gaps, priorities };
}
function catalog(html) {
  const start = html.indexOf('const DEFAULT_DATA'), assignment = html.indexOf('=', start), end = html.indexOf('function loadSystemData', assignment);
  return vm.runInNewContext('(' + html.slice(assignment + 1, end).trim().replace(/;\s*$/, '') + ')', {}, { timeout: 1000 });
}
function verify(data, current) {
  const differences = [];
  for (const row of data.services) {
    const service = current.SERVICES[row.id];
    if (!service || service.preco_base !== row.basePrice || service.unidade !== row.unit) differences.push(row.id);
  }
  const actualOptions = Object.values(current.SERVICES).flatMap(s => Object.values(s.configuracoes || {}).flatMap(group => group.opcoes.map(o => ({ serviceId: s.id, group: group.nome, name: o.nome, additional: o.adicional }))));
  if (JSON.stringify(actualOptions.map(o => JSON.stringify(o)).sort()) !== JSON.stringify(data.options.map(o => JSON.stringify(o)).sort())) differences.push('configurações');
  if (differences.length) throw new Error('Catálogo divergente do anexo; não sobrescrever: ' + differences.join(', '));
  return { services: data.services.length, groups: Object.values(current.SERVICES).reduce((n,s) => n + Object.keys(s.configuracoes || {}).length, 0), options: actualOptions.length, references: data.references.length, financialChanges: false };
}
if (require.main === module) {
  const data = parseReport(fs.readFileSync(sourceFile, 'utf8'));
  const result = verify(data, catalog(fs.readFileSync('index.html', 'utf8')));
  fs.mkdirSync('assets/data', { recursive: true });
  fs.writeFileSync('assets/data/price-reference-2026-10-08.json', JSON.stringify(data));
  console.log(JSON.stringify(result));
}
module.exports = { parseReport, catalog, verify };
