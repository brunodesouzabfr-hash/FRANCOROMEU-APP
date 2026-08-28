const fs = require('fs');
const file = 'base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html';
const html = fs.readFileSync(file, 'utf8');
const ids = [...html.matchAll(/<[a-z][^>]*\sid=["']([^"']+)["']/gi)]
  .map(match => match[1])
  .filter(id => !id.includes('${'));
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
const required = ['view-home', 'view-sobre', 'view-ambientes', 'view-projetos3d', 'view-projetos', 'view-orcamento'];
const missing = required.filter(id => !ids.includes(id));
const heroMediaRule = html.match(/\.fr6-hero-media\{([^}]*)\}/)?.[1] || '';
const referenceRule = html.match(/\.fr-reference-media\{([^}]*)\}/)?.[1] || '';
const heroLayerSafe = /position\s*:\s*absolute/.test(heroMediaRule) && !/position\s*:/.test(referenceRule);
const localDependencies = [...html.matchAll(/<script[^>]+src=[\"'](?!https?:|data:)([^\"']+)/gi)].map(match => match[1]);
const pdfBridge = html.includes('id="fr-pdf-stack-loader"')
  && html.includes('performanceBridge.ensurePDFStack = ensurePDFStack')
  && html.includes('await window.FR_PERFORMANCE.ensurePDFStack()');
const pdfDependencies = [
  'html2canvas/1.4.1/html2canvas.min.js',
  'jspdf/2.5.1/jspdf.umd.min.js'
];
const missingPdfDependencies = pdfDependencies.filter(dependency => !html.includes(dependency));
if (duplicates.length || missing.length || localDependencies.length || missingPdfDependencies.length || !pdfBridge || !heroLayerSafe || !html.includes('window.__frCore') || !html.includes('id="fr-budget-core"')) {
  console.error({ duplicates, missing, localDependencies, missingPdfDependencies, pdfBridge, heroLayerSafe, bridge: html.includes('window.__frCore'), embeddedBudgetCore: html.includes('id="fr-budget-core"') });
  process.exit(1);
}
console.log(`HTML check OK: ${ids.length} IDs únicos, 6 views, ponte __frCore, núcleo financeiro e bridge PDF incorporados, hero preservado e nenhuma dependência local.`);

// Search Control Engineering: valida o artefato de implantação sem substituir a regressão canônica.
const deployedHtml = fs.readFileSync('index.html', 'utf8');
const structuredMatch = deployedHtml.match(/<script id="fr-seo-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/);
let structured;
try { structured = JSON.parse(structuredMatch?.[1] || ''); } catch (error) { console.error('JSON-LD SEO inválido:', error.message); process.exit(1); }
const graph = structured?.['@graph'] || [];
const seoServices = graph.filter(node => node?.['@type'] === 'Service');
const seoViews = ['view-home', 'view-sobre', 'view-ambientes', 'view-projetos3d', 'view-projetos', 'view-orcamento'];
const missingSeoLinks = seoViews.filter(id => !new RegExp(`<a[^>]+data-fr-view=["']${id}["']`).test(deployedHtml));
const trackingFiles = ['robots.txt', 'sitemap.xml', 'vercel.json', 'docs/SEARCH_CONTROL_ENGINEERING.md'].filter(path => !fs.existsSync(path));
if (seoServices.length !== 16 || missingSeoLinks.length || trackingFiles.length || !deployedHtml.includes('id="fr-seo-spa-router"')) {
  console.error({ seoServiceCount: seoServices.length, missingSeoLinks, trackingFiles, seoRouter: deployedHtml.includes('id="fr-seo-spa-router"') });
  process.exit(1);
}
console.log('SEO check OK: JSON-LD com 16 serviços, 6 links de view, roteador e arquivos de rastreamento.');
