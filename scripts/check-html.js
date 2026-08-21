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
+];
const missingPdfDependencies = pdfDependencies.filter(dependency => !html.includes(dependency));
if (duplicates.length || missing.length || localDependencies.length || missingPdfDependencies.length || !pdfBridge || !heroLayerSafe || !html.includes('window.__frCore') || !html.includes('id="fr-budget-core"')) {
  console.error({ duplicates, missing, localDependencies, missingPdfDependencies, pdfBridge, heroLayerSafe, bridge: html.includes('window.__frCore'), embeddedBudgetCore: html.includes('id="fr-budget-core"') });
  process.exit(1);
}
console.log(`HTML check OK: ${ids.length} IDs únicos, 6 views, ponte __frCore, núcleo financeiro e bridge PDF incorporados, hero preservado e nenhuma dependência local.`);
