'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const vm = require('node:vm');

const ORIGIN = 'https://www.francoromeufr.com.br';
const output = path.resolve('dist');
const artifactDir = path.resolve('.artifacts/build');
const map = JSON.parse(fs.readFileSync(path.join(artifactDir, 'PUBLIC_MEDIA_MAP.json'), 'utf8'));
const routeFiles = [...new Set(map.routes.map(record => record.file))];

function documentFor(file) {
  return new JSDOM(fs.readFileSync(path.join(output, file), 'utf8'), { url: ORIGIN + '/' }).window.document;
}

function graphFor(document) {
  const script = document.querySelector('script[type="application/ld+json"]');
  assert.ok(script, 'JSON-LD ausente');
  return JSON.parse(script.textContent)['@graph'];
}

function count(text, value) {
  return text.split(value).length - 1;
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

test('todas as rotas públicas usam canonical www e um único conjunto de analytics', () => {
  for (const file of routeFiles) {
    const text = fs.readFileSync(path.join(output, file), 'utf8');
    const document = new JSDOM(text).window.document;
    assert.match(document.querySelector('link[rel="canonical"]')?.href || '', /^https:\/\/www\.francoromeufr\.com\.br\//, file);
    assert.doesNotMatch(text, /https:\/\/francoromeufr\.com\.br(?=[/"'#])/, file);
    assert.equal(count(text, 'analytics.ahrefs.com/analytics.js'), 1, `Ahrefs duplicado em ${file}`);
    assert.equal(count(text, 'www.googletagmanager.com/gtag/js?id=G-C3FMZ4NGGY'), 1, `GA4 duplicado em ${file}`);
    assert.equal(count(text, 'clarity.ms/tag/'), 1, `Clarity duplicado em ${file}`);
    assert.equal(document.querySelectorAll('meta[name="google-site-verification"]').length, 1, file);
    assert.equal(document.querySelectorAll('meta[name="p:domain_verify"]').length, 1, file);
    assert.doesNotMatch(text, /GOD MODE 2\.0|FRANCO ADMIN|window\.admin\s*=|gmDownloadFinalHTML/, file);
    document.defaultView.close();
  }
});

test('o grafo institucional é único, preserva os 16 serviços e restringe FAQ à página visível', () => {
  const mainRoutes = ['index.html', 'sobre.html', 'ambientes.html', 'projetos-3d.html', 'portfolio.html', 'orcamento.html'];
  for (const file of mainRoutes) {
    const document = documentFor(file);
    const nodes = graphFor(document);
    const organizations = nodes.filter(node => Array.isArray(node['@type']) && node['@type'].includes('LocalBusiness'));
    assert.equal(organizations.length, 1, file);
    const organization = organizations[0];
    assert.equal(organization['@id'], `${ORIGIN}/#organization`);
    assert.equal(organization.telephone, '+55-11-99002-1603');
    assert.equal(organization.email, 'romeudifranco@gmail.com');
    assert.equal(organization.geo, undefined);
    assert.deepEqual(organization.areaServed.map(city => city.name), ['São Paulo', 'Guarulhos', 'Osasco', 'Barueri', 'Santo André', 'São Bernardo do Campo']);
    assert.equal(nodes.filter(node => node['@type'] === 'Service').length, 16, file);
    assert.equal(nodes.some(node => node['@type'] === 'FAQPage'), file === 'orcamento.html', file);
    assert.equal(JSON.stringify(nodes).includes('aggregateRating'), false, file);
    document.defaultView.close();
  }

  const budget = documentFor('orcamento.html');
  const faq = graphFor(budget).find(node => node['@type'] === 'FAQPage');
  const visible = [...budget.querySelectorAll('#fr-budget-faq details')];
  assert.equal(visible.length, 5);
  assert.deepEqual(visible.map(node => node.querySelector('summary').textContent.trim()), faq.mainEntity.map(item => item.name));
  budget.defaultView.close();
});

test('SearchAction corresponde ao comportamento real do roteador e à origem canônica', () => {
  const source = fs.readFileSync('index.html', 'utf8');
  const document = new JSDOM(source).window.document;
  const website = graphFor(document).find(node => node['@type'] === 'WebSite');
  assert.equal(website.potentialAction.target.urlTemplate, `${ORIGIN}/orcamento?busca={search_term_string}`);
  const router = document.querySelector('#fr-seo-spa-router').textContent;
  assert.match(router, /URLSearchParams\(location\.search\)\.get\('busca'\)/);
  assert.match(router, /FR_ASSISTANT\.search\(query\)/);
  assert.match(router, /origin='https:\/\/www\.francoromeufr\.com\.br'/);
  document.defaultView.close();
});

test('arquivos públicos de verificação chegam intactos à dist e artefatos internos não chegam', () => {
  for (const file of ['BingSiteAuth.xml', '15371fdcae5446498483cb1385b2ccc3.txt', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'site.webmanifest', 'browserconfig.xml']) {
    assert.ok(fs.existsSync(path.join(output, file)), file);
    if (!['robots.txt', 'sitemap.xml'].includes(file)) {
      assert.deepEqual(fs.readFileSync(path.join(output, file)), fs.readFileSync(file), file);
    }
  }
  for (const file of walk(output).map(item => path.relative(output, item))) {
    assert.doesNotMatch(file, /(?:^|\/)(?:docs|CODEX USE AQUI|prepared-media|\.artifacts)(?:\/|$)|\.(?:zip|csv|md)$/i, file);
  }
  assert.equal(fs.existsSync(path.join(output, '.env.example')), false);
});

test('sitemaps listam apenas rotas canônicas indexáveis e mantêm imagens bloqueadas', () => {
  const byUrl = new Map(map.routes.map(record => [ORIGIN + record.route, record]));
  for (const name of ['sitemap.xml', 'sitemap-images.xml', 'sitemap-images-antes-depois.xml', 'sitemap-images-3d.xml', 'sitemap-images-portfolio.xml']) {
    const dom = new JSDOM(fs.readFileSync(path.join(output, name), 'utf8'), { contentType: 'text/xml' });
    const document = dom.window.document;
    assert.equal(document.querySelector('parsererror'), null, name);
    for (const url of document.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url')) {
      const loc = url.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'loc')[0].textContent;
      const route = byUrl.get(loc);
      assert.ok(route?.indexable, loc);
      assert.ok(fs.existsSync(path.join(output, route.file)), route.file);
    }
    assert.equal(document.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'image').length, 0, name);
    dom.window.close();
  }
  assert.equal(map.media.some(item => item.indexable), false);
});

test('Vercel reúne build estático, hosts canônicos, redirects e cache sem rewrite SPA', () => {
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  assert.equal(config.buildCommand, 'npm run build');
  assert.equal(config.outputDirectory, 'dist');
  assert.equal(config.cleanUrls, true);
  assert.equal(config.rewrites, undefined);
  for (const host of ['francoromeu-app.vercel.app', 'francoromeufr.com.br']) {
    const redirect = config.redirects.find(item => item.has?.some(condition => condition.type === 'host' && condition.value === host));
    assert.ok(redirect, host);
    assert.equal(redirect.destination, `${ORIGIN}/:path*`);
    assert.equal(redirect.permanent, true);
  }
  assert.ok(config.redirects.some(item => item.source === '/jornal' && item.destination === '/projetos/'));
  assert.ok(config.headers.some(item => item.source === '/api/(.*)' && item.headers.some(header => header.value === 'no-store')));
});

test('há um único workflow IndexNow e ele deriva URLs do sitemap após prontidão', () => {
  const workflows = fs.readdirSync('.github/workflows').filter(file => /\.ya?ml$/.test(file));
  const indexNow = workflows.filter(file => /api\.indexnow\.org|FR_INDEXNOW_KEY/.test(fs.readFileSync(path.join('.github/workflows', file), 'utf8')));
  assert.deepEqual(indexNow, ['indexnow.yml']);
  const workflow = fs.readFileSync('.github/workflows/indexnow.yml', 'utf8');
  assert.match(workflow, /branches: \[main\]/);
  assert.match(workflow, /sitemap\.xml/);
  assert.match(workflow, /grep -Fxq/);
  assert.match(workflow, /dict\.fromkeys/);
  assert.match(workflow, /www\.francoromeufr\.com\.br/);
});

test('analytics are limited to canonical production host while verification metadata stays public', () => {
  const { trackingHead } = require('../src/public-site-meta.cjs');
  const markup = trackingHead();
  assert.equal(count(markup, 'name="google-site-verification"'), 1);
  assert.equal(count(markup, 'name="p:domain_verify"'), 1);
  const code = markup.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(code, 'inline conditional analytics loader is present');

  function simulate(hostname) {
    const inserted = [];
    const document = {
      createElement(tagName) {
        return { tagName, setAttribute(key, value) { this[key] = value; } };
      },
      getElementsByTagName() {
        return [{ parentNode: { insertBefore(node) { inserted.push(node); } } }];
      },
      head: { appendChild(node) { inserted.push(node); } }
    };
    const window = { location: { hostname } };
    vm.runInNewContext(code, { window, document, Date }, { timeout: 1000 });
    return { inserted, window };
  }

  for (const hostname of [
    '127.0.0.1',
    'localhost',
    'francoromeu-app.vercel.app',
    'francoromeu-preview-franco-romeu.vercel.app'
  ]) {
    const preview = simulate(hostname);
    assert.equal(preview.inserted.length, 0, hostname);
    assert.equal(preview.window.dataLayer, undefined, hostname);
  }
  const production = simulate('www.francoromeufr.com.br');
  assert.equal(production.inserted.length, 3, 'Clarity, GA4 and Ahrefs should each load once');
  assert.equal(production.inserted.filter(x => String(x.src).includes('gtag/js?id=G-C3FMZ4NGGY')).length, 1);
  assert.equal(production.inserted.filter(x => String(x.src).includes('clarity.ms/tag/')).length, 1);
  assert.equal(production.inserted.filter(x => String(x.src).includes('analytics.ahrefs.com/analytics.js')).length, 1);
  assert.equal(production.window.dataLayer.length, 2, 'gtag initialization + one config');
});
