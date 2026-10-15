'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const destination = path.join(root, 'assets/patches/fr-additions-2026-10-14/service-media-map.json');

function literalBetween(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Marcadores ausentes: ${startMarker} / ${endMarker}`);
  return html.slice(start + startMarker.length, end).trim().replace(/;\s*$/, '');
}

const data = vm.runInNewContext(`(${literalBetween('const DEFAULT_DATA =', '\n    function loadSystemData()')})`, Object.create(null), { timeout: 1000 });
const environments = vm.runInNewContext(`(${literalBetween('const AMB_STYLES =', '\n    const AMB_STAGE3')})`, Object.create(null), { timeout: 1000 });

const portfolioAdapters = {
  porcelanato: { serviceId: 'porcelanato', asset: 'assets/media/portfolio-porcelanato.jpg' },
  marmore: { serviceId: 'tex_marmore', asset: 'assets/media/portfolio-marmore.jpg' },
  automacao: { serviceId: 'ele_automacao', asset: 'assets/media/portfolio-automacao.jpg' },
  iluminacao: { serviceId: 'ilu_dmx', asset: 'assets/media/portfolio-iluminacao.jpg' },
  eventos: { serviceId: 'evt_corporativo', asset: 'assets/media/portfolio-eventos.jpg' },
  resina: { serviceId: 'mar_mesa_rivertable', asset: 'assets/media/portfolio-resina.jpg' },
  reforma: { serviceId: 'pac_reforma_residencial', asset: 'assets/media/portfolio-reforma.jpg' },
  carpintaria: { serviceId: 'mar_instalacao_movel', asset: 'assets/media/portfolio-marcenaria.jpg' },
  eletrica: { serviceId: 'ele_instalacao_completa', asset: 'assets/media/portfolio-eletrica.jpg' },
  pintura: { serviceId: 'tinta', asset: 'assets/media/portfolio-pintura.jpg' }
};

const links = new Map();
function link(serviceId, relationship) {
  if (!data.SERVICES[serviceId]) throw new Error(`Adapter aponta para serviceId inexistente: ${serviceId}`);
  if (!links.has(serviceId)) links.set(serviceId, []);
  links.get(serviceId).push(relationship);
}

Object.entries(portfolioAdapters).forEach(([category, adapter]) => link(adapter.serviceId, {
  relationshipType: 'EXISTING_PORTFOLIO_CATEGORY_ADAPTER',
  confidence: 'EXACT_RUNTIME_ID',
  evidenceRef: `index.html#CATEGORY_META.${category}`,
  previewAsset: adapter.asset,
  previewNature: 'CONCEPT_VISUAL',
  styleIds: []
}));

environments.forEach(environment => {
  (environment.services || []).forEach(item => link(item.id, {
    relationshipType: 'EXISTING_ENVIRONMENT_SERVICE_ADAPTER',
    confidence: 'EXACT_RUNTIME_ID',
    evidenceRef: `index.html#AMB_STYLES.${environment.id}.services.${item.id}`,
    previewAsset: environment.img,
    previewNature: 'REFERENCE_VISUAL',
    styleIds: [environment.id]
  }));
});

const services = Object.entries(data.SERVICES).map(([serviceId, service]) => {
  const relationships = links.get(serviceId) || [];
  const primary = relationships.find(item => item.previewAsset && fs.existsSync(path.join(root, item.previewAsset))) || null;
  return {
    budgetServiceId: serviceId,
    publicLabel: service.nome,
    categoryId: service.categoria,
    unit: service.unidade,
    styleIds: [...new Set(relationships.flatMap(item => item.styleIds))],
    relationshipType: relationships.length ? [...new Set(relationships.map(item => item.relationshipType))].join('+') : null,
    confidence: relationships.length ? 'EXACT_RUNTIME_ID' : 'UNASSESSED',
    evidenceRefs: [...new Set(relationships.map(item => item.evidenceRef))],
    previewAsset: primary ? primary.previewAsset : null,
    previewNature: primary ? primary.previewNature : null,
    status: primary ? 'mapped' : 'needs_review',
    notes: primary
      ? 'Vínculo existente por serviceId exato. A imagem é exemplo visual; não prova execução, material final ou resultado.'
      : 'Sem mídia elegível vinculada por ID exato. Não inferir vínculo por semelhança de nome.'
  };
});

const mappedCount = services.filter(item => item.status === 'mapped').length;
const output = {
  schemaVersion: 'fr-additions-service-media-1.0.0',
  generatedAt: '2026-10-14',
  source: 'index.html DEFAULT_DATA + adapters existentes CATEGORY_META e AMB_STYLES',
  budgetCoreChanged: false,
  serviceCount: services.length,
  mappedCount,
  needsReviewCount: services.length - mappedCount,
  visualCoveragePercent: Number((mappedCount / services.length * 100).toFixed(2)),
  policy: {
    nameSimilarityIsEvidence: false,
    inspectionChangesBudget: false,
    holdMediaEligible: false,
    missingMediaFallback: 'useful_service_sheet'
  },
  services
};

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ destination: path.relative(root, destination), services: services.length, mapped: mappedCount, needsReview: services.length - mappedCount }, null, 2));
