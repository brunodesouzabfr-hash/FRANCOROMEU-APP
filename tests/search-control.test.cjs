const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

test('metadados apontam para a entidade canônica', () => {
  assert.match(doc.title, /Franco Romeu/);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, 'https://francoromeu.com.br/');
  assert.equal(doc.querySelector('meta[property="og:site_name"]').content, 'Franco Romeu — Arte & Engenharia');
  assert.equal(doc.querySelector('meta[name="twitter:card"]').content, 'summary_large_image');
});

test('grafo estruturado é válido e usa 16 IDs reais sem avaliações fictícias', () => {
  const graph = JSON.parse(doc.querySelector('#fr-seo-structured-data').textContent);
  const nodes = graph['@graph'];
  const services = nodes.filter(node => node['@type'] === 'Service');
  assert.equal(services.length, 16);
  assert.equal(new Set(services.map(service => service.identifier)).size, 16);
  assert.ok(services.some(service => service.identifier === 'proj_interiores'));
  assert.ok(services.some(service => service.identifier === 'porcelanato'));
  assert.ok(nodes.some(node => node['@type'] === 'WebSite'));
  assert.ok(nodes.some(node => node['@type'] === 'BreadcrumbList'));
  assert.equal(nodes.find(node => node['@type'] === 'FAQPage').mainEntity.length, 5);
  assert.equal(html.includes('aggregateRating'), false);
});

test('as seis views têm links HTTP e configuração de rota', () => {
  const ids = ['view-home', 'view-sobre', 'view-ambientes', 'view-projetos3d', 'view-projetos', 'view-orcamento'];
  for (const id of ids) {
    const link = doc.querySelector(`#smart-nav a[data-fr-view="${id}"]`);
    assert.ok(link, `link ausente: ${id}`);
    assert.ok(link.getAttribute('href').startsWith('/'));
  }
  assert.ok(doc.querySelector('#fr-seo-spa-router'));
  assert.match(doc.querySelector('#fr-seo-spa-router').textContent, /popstate/);
  assert.match(doc.querySelector('#fr-seo-spa-router').textContent, /history\.pushState/);
});

test('arquivos de rastreamento usam o domínio canônico', () => {
  const robots = fs.readFileSync('robots.txt', 'utf8');
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  assert.match(robots, /Allow: \/\s/);
  assert.match(robots, /https:\/\/francoromeu\.com\.br\/sitemap\.xml/);
  assert.equal((sitemap.match(/<url>/g) || []).length, 6);
  assert.doesNotMatch(sitemap, /#/);
  assert.ok(fs.existsSync('vercel.json'));
  assert.ok(fs.existsSync('docs/SEARCH_CONTROL_ENGINEERING.md'));
});
