const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;
const ORIGIN = 'https://www.francoromeufr.com.br';

test('metadados apontam para a entidade canônica', () => {
  assert.match(doc.title, /Franco Romeu/);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, `${ORIGIN}/`);
  assert.equal(doc.querySelector('meta[property="og:site_name"]').content, 'Franco Romeu — Arte & Engenharia');
  assert.equal(doc.querySelector('meta[property="og:url"]').content, `${ORIGIN}/`);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, `${ORIGIN}/assets/social/franco-romeu-og-site-1200x630.jpg`);
  assert.equal(doc.querySelector('meta[name="twitter:card"]').content, 'summary_large_image');
  assert.equal(doc.querySelector('meta[name="twitter:image"]').content, `${ORIGIN}/assets/social/franco-romeu-og-site-1200x630.jpg`);
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
  const localBusiness = nodes.find(node => Array.isArray(node['@type']) && node['@type'].includes('LocalBusiness'));
  assert.equal(localBusiness.name, 'Franco Romeu');
  assert.deepEqual(localBusiness.alternateName, ['FR', 'ꟻR', 'Franco Romeu — Arte & Engenharia']);
  assert.deepEqual(localBusiness.sameAs, [
    'https://www.instagram.com/francoromeu.fr/',
    'https://www.facebook.com/FrancoRomeuRF',
    'https://www.linkedin.com/in/franco-romeu-fr/',
    'https://www.youtube.com/@FRANCOROMEU',
    'https://br.pinterest.com/francoromeu_fr/',
    'https://github.com/Francoromeu-fr'
  ]);
  // Esta consolidação não remove informações operacionais existentes da main.
  assert.equal(localBusiness.telephone, '+55-11-99002-1603');
  assert.equal(localBusiness.email, 'romeudifranco@gmail.com');
  assert.equal(localBusiness.address.addressLocality, 'São Paulo');
  assert.equal(localBusiness.address.addressRegion, 'SP');
  assert.deepEqual(localBusiness.geo, { '@type': 'GeoCoordinates', latitude: -23.5505, longitude: -46.6333 });
  assert.deepEqual(localBusiness.areaServed.map(city => city.name), ['São Paulo', 'Guarulhos', 'Osasco', 'Barueri', 'Santo André', 'São Bernardo do Campo']);
  assert.ok(localBusiness.openingHoursSpecification.length > 0);
  assert.ok(localBusiness.paymentAccepted.length > 0);
  assert.ok(localBusiness.priceRange);
  const website = nodes.find(node => node['@type'] === 'WebSite');
  assert.equal(website.potentialAction?.['@type'], 'SearchAction');
  assert.ok(doc.querySelector('meta[name="google-site-verification"]'));

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
  assert.match(doc.querySelector('#fr-seo-spa-router').textContent, /https:\/\/www\.francoromeufr\.com\.br/);
});

test('arquivos de rastreamento usam o domínio canônico', () => {
  const robots = fs.readFileSync('robots.txt', 'utf8');
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  assert.match(robots, /Allow: \/\s/);
  assert.match(robots, /https:\/\/www\.francoromeufr\.com\.br\/sitemap\.xml/);
  assert.equal((sitemap.match(/<url>/g) || []).length, 6);
  assert.equal((sitemap.match(/https:\/\/www\.francoromeufr\.com\.br\//g) || []).length, 6);
  assert.doesNotMatch(sitemap, /#/);
  assert.ok(fs.existsSync('vercel.json'));
  assert.ok(fs.existsSync('docs/SEARCH_CONTROL_ENGINEERING.md'));
});
