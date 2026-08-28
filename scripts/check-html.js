const fs = require('fs');
const file = 'index.html';
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
const structuredDataMatch = html.match(/<script[^>]+id=["']fr-structured-data["'][^>]*>([\s\S]*?)<\/script>/i);
let structuredDataValid = false;
try {
  const graph = JSON.parse(structuredDataMatch?.[1] || '{}')['@graph'] || [];
  structuredDataValid = graph.some(node => Array.isArray(node['@type']) && node['@type'].includes('LocalBusiness'))
    && graph.filter(node => Array.isArray(node['@type']) && node['@type'].includes('Service')).length === 16
    && graph.some(node => node['@type'] === 'FAQPage');
} catch (_) {
  structuredDataValid = false;
}
const seoLinksValid = required.every(id => new RegExp(`<a[^>]+data-fr-view=["']${id}["']`).test(html));
const seoFilesValid = ['robots.txt', 'sitemap.xml', 'vercel.json'].every(name => fs.existsSync(name));
if (duplicates.length || missing.length || localDependencies.length || !heroLayerSafe || !structuredDataValid || !seoLinksValid || !seoFilesValid || !html.includes('window.__frCore') || !html.includes('id="fr-budget-core"')) {
  console.error({ duplicates, missing, localDependencies, heroLayerSafe, structuredDataValid, seoLinksValid, seoFilesValid, bridge: html.includes('window.__frCore'), embeddedBudgetCore: html.includes('id="fr-budget-core"') });
  process.exit(1);
}
console.log(`HTML check OK: ${ids.length} IDs únicos, 6 views, SEO local, ponte __frCore, núcleo financeiro incorporado, hero preservado e nenhuma dependência local.`);
