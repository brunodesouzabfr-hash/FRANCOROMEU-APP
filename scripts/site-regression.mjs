import { chromium } from '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:4181';
const output = process.argv[3] || '/tmp/fr-site-regression';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const views = ['home', 'sobre', 'ambientes', 'projetos3d', 'projetos', 'orcamento'];
const routes = ['/', '/sobre', '/ambientes', '/projetos-3d', '/portfolio', '/orcamento'];
const report = { base, capturedAt: new Date().toISOString(), engine: 'Chromium headless; emulation, not physical Safari/iOS', profiles: [], flows: [] };
report.buildSha256=JSON.parse(await fs.readFile('dist/build-report.json','utf8')).publicSha256;
report.buildFingerprint=JSON.parse(await fs.readFile('dist/build-report.json','utf8')).publicFingerprint;
if (process.argv.includes('--resume')) {
  const previous=JSON.parse(await fs.readFile(path.join(output,'regression.json'),'utf8'));
  assert.equal(previous.base,base);
  if(previous.buildFingerprint && previous.buildFingerprint===report.buildFingerprint)report.profiles=previous.profiles;
  report.previousInterruption=previous.failure;report.firstCapturedAt=previous.capturedAt;
}
async function ready(page, route = '/') {
  await page.route(/clarity\.ms|googletagmanager\.com|google-analytics\.com/, r => r.abort());
  const response = await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  await page.waitForFunction(() => window.__frCore && window.FR_STAGE16 && window.FR_BUDGET_TRANSFER);
  await page.waitForTimeout(1800);
}
try {
  for (const [width, height] of [[320,568],[360,800],[390,844],[412,915],[768,1024],[1024,768],[1280,720],[1440,900],[1920,1080]]) {
    if(report.profiles.some(profile=>profile.width===width))continue;
    const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 600, hasTouch: width < 600 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await ready(page);
    assert.equal(await page.locator('.fr-ai-context-bubble').count(), 1, 'assistente preservado');
    assert.equal(await page.locator('.fr-ai-context-bubble').evaluate(n=>n.classList.contains('is-visible')), false, width + ': Home deve manter CTAs sem saudação automática');
    if(width===390||width===1440)await page.screenshot({path:path.join(output,width+'-home.png'),animations:'disabled'});
    if(width===1440){
      await page.evaluate(()=>window.FR_ASSISTANT.open('home'));
      assert.equal(await page.locator('#fr-ai-panel').getAttribute('aria-hidden'),'false','assistente continua abrindo sob demanda');
      await page.evaluate(()=>window.FR_ASSISTANT.close());
      assert.equal(await page.locator('#fr-ai-panel').getAttribute('aria-hidden'),'true');
    }
    const profile = { width, height, errors, views: [] };
    for (const view of views) {
      await page.evaluate(id => window.switchView('view-' + id), view);
      await page.waitForFunction(id => document.getElementById('view-'+id).classList.contains('active'), view);
      await page.waitForTimeout(720);
      const state = await page.evaluate(view => {
        const root = document.getElementById('view-' + view);
        return { view, path: location.pathname, active: root.classList.contains('active'), overflow: document.documentElement.scrollWidth > innerWidth,
          publicEditor: !!document.querySelector('#god-mode-panel,#admin-container'),
          navVisible: document.getElementById('smart-nav').getBoundingClientRect().bottom > 0,
          iframes: document.querySelectorAll('iframe').length };
      }, view);
      assert.equal(state.overflow, false, width + ': overflow in ' + view);
      assert.equal(state.active, true); assert.equal(state.publicEditor, false); assert.equal(state.navVisible, true);
      assert.equal(state.path, routes[views.indexOf(view)]);
      if(width<600)assert.equal(await page.locator('.fr-ai-context-bubble').evaluate(n=>n.classList.contains('is-visible')),false,'context bubbles must not cover mobile actions');
      profile.views.push(state);
    }
    report.profiles.push(profile); assert.deepEqual(errors, []);
    if (width === 390 || width === 1440) await page.screenshot({ path: path.join(output, width + '-budget.png'), animations: 'disabled' });
    await page.close(); console.log('PASS viewport ' + width + 'x' + height + ' / six views');
  }
  const page = await browser.newPage({ viewport: { width:390, height:844 }, hasTouch: true, isMobile: true });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  await page.locator('#fr-site-menu-open').click();
  assert.equal(await page.locator('#fr-site-menu').evaluate(n => n.open), true);
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  await page.screenshot({ path: path.join(output, 'mobile-menu.png'), animations: 'disabled' });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#fr-site-menu').evaluate(n => n.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'fr-site-menu-open');
  await page.locator('#fr-site-menu-open').click();
  await page.locator('#fr-site-menu [data-fr-view="view-sobre"]').click();
  await page.waitForFunction(()=>document.getElementById('view-sobre').classList.contains('active'));
  assert.equal(new URL(page.url()).pathname, '/sobre');
  await page.waitForTimeout(720);await page.goBack();await page.waitForFunction(()=>document.getElementById('view-home').classList.contains('active'));assert.equal(new URL(page.url()).pathname, '/');
  report.flows.push('native menu, Escape, focus restore, link and back');

  // Existing UI producer -> public bridge -> persistence. No alternate calculator.
  await page.locator('[data-fr6-service="porcelanato"]').click();
  const item = await page.evaluate(() => window.__frCore.appState.selectedServices[0]);
  assert.equal(item.serviceId, 'porcelanato');
  await page.evaluate(() => { window.switchView('view-orcamento'); window.__frCore.appState.step = 2; window.__frCore.saveAndRender(); });
  await page.waitForFunction(()=>document.getElementById('view-orcamento').classList.contains('active'));
  await page.evaluate(id => window.__frCore.handle.editService({dataset:{id}}), item.id);
  await page.locator('[data-action="updateServiceQty"]').fill('12');
  await page.locator('[data-action="updateServiceQty"]').dispatchEvent('input');
  // Required options already supplied by the Home CTA; editing keeps them.
  await page.locator('[data-action="confirmService"]').click();
  assert.equal(await page.evaluate(() => window.__frCore.appState.selectedServices[0].quantidade), 12);
  const total = await page.evaluate(() => window.__frCore.calculateTotal().total);
  await page.reload(); await page.waitForFunction(() => window.FR_BUDGET_TRANSFER);
  assert.equal(await page.evaluate(() => window.__frCore.calculateTotal().total), total);
  assert.equal(await page.evaluate(() => window.__frCore.appState.selectedServices[0].quantidade), 12);
  report.flows.push('Home CTA, real quantity editor, save, reload and financial parity');

  await page.evaluate(() => window.switchView('view-orcamento'));
  await page.locator('.fr-budget-transfer summary').click();
  const downloadPromise = page.waitForEvent('download'); await page.locator('#fr-budget-export').click();
  const download = await downloadPromise, exported = path.join(output, 'synthetic-budget.json');
  await download.saveAs(exported); const payload = JSON.parse(await fs.readFile(exported, 'utf8'));
  await page.evaluate(() => { window.__frCore.appState.selectedServices=[]; window.__frCore.saveAndRender(); });
  await page.locator('#fr-budget-import').setInputFiles(exported);
  await page.waitForFunction(() => document.getElementById('fr-budget-transfer-status').textContent.startsWith('Orçamento recuperado'));
  assert.equal(await page.evaluate(() => window.__frCore.calculateTotal().total), total);
  const invalid = structuredClone(payload); invalid.data.selectedServices[0].serviceId='unknown';
  await page.locator('#fr-budget-import').setInputFiles({ name:'invalid.json', mimeType:'application/json', buffer:Buffer.from(JSON.stringify(invalid)) });
  await page.waitForFunction(() => document.getElementById('fr-budget-transfer-status').textContent.startsWith('Importação recusada'));
  assert.equal(await page.evaluate(() => window.__frCore.calculateTotal().total), total);
  assert.ok(await page.evaluate(() => localStorage.getItem('fr_budget_import_backup_v1')));
  const other = await browser.newPage(); await ready(other, '/orcamento');
  await other.locator('.fr-budget-transfer summary').click(); await other.locator('#fr-budget-import').setInputFiles(exported);
  await other.waitForFunction(() => document.getElementById('fr-budget-transfer-status').textContent.startsWith('Orçamento recuperado'));
  assert.equal(await other.evaluate(() => window.__frCore.calculateTotal().total), total); await other.close();
  report.flows.push('JSON export, valid import, isolated browser recovery and atomic rejection');

  for (const route of routes) {
    await page.goto(base + route, {waitUntil:'domcontentloaded'}); await page.waitForTimeout(500);
    assert.equal(new URL(page.url()).pathname, route);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://francoromeufr.com.br' + route);
  }
  assert.equal((await page.request.get(base + '/missing-page')).status(), 404);
  assert.equal((await page.request.get(base + '/base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html')).status(), 404);
  await page.goto(base + '/?fr-admin=local'); await page.waitForTimeout(1000);
  assert.deepEqual(await page.evaluate(() => [typeof window.toggleGodMode, typeof window.admin, typeof window.gmDownloadFinalHTML]), ['undefined','undefined','undefined']);
  report.flows.push('six direct routes, own metadata, real 404 and admin query harmless');

  await page.route('**/api/google-reviews', r => r.fulfill({json:{status:'ok',rating:4.7,userRatingCount:9,attributions:[{provider:'Fornecedor de teste',providerUri:'https://example.org/attribution'}],reviews:[{rating:5,text:'Comentário fictício apenas para QA',author:{displayName:'Autor de teste',uri:'https://www.google.com/maps/contrib/test'},googleMapsUri:'https://www.google.com/maps/reviews/test'}]}}));
  await page.evaluate(() => window.switchView('view-sobre')); await page.locator('#fr-google-refresh').click();
  await page.waitForFunction(() => document.querySelector('.fr-google-review'));
  assert.match(await page.locator('#fr-google-results').innerText(), /4,7 de 5/);
  assert.equal(await page.locator('.fr-google-review blockquote').innerText(), 'Comentário fictício apenas para QA');
  assert.equal(await page.locator('#fr-google-results a', {hasText:'Fornecedor de teste'}).getAttribute('href'),'https://example.org/attribution');
  await page.unroute('**/api/google-reviews');
  await page.route('**/api/google-reviews', r => r.fulfill({json:{status:'ok',reviews:[]}}));
  await page.locator('#fr-google-refresh').click(); await page.waitForFunction(() => document.getElementById('fr-google-results').textContent.includes('Nenhum comentário'));
  await page.unroute('**/api/google-reviews');
  await page.route('**/api/google-reviews', r => r.fulfill({status:503,json:{status:'unavailable'}}));
  await page.locator('#fr-google-refresh').click(); await page.waitForFunction(() => document.getElementById('fr-google-results').textContent.includes('indisponível'));
  assert.equal(await page.locator('[data-fr-contact="googleReview"]').last().getAttribute('href'), 'https://g.page/r/CS2qUAHyBrWZEBM/review');
  await page.screenshot({path:path.join(output,'google-fallback.png'),animations:'disabled'});
  assert.deepEqual(errors, []); report.flows.push('Google success, empty and unavailable; synthetic responses, no real paid API');
  await page.close();

  const reduced = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await ready(reduced); assert.equal(await reduced.locator('#loader').evaluate(n=>getComputedStyle(n).display), 'none');
  assert.equal(await reduced.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await reduced.close(); report.flows.push('reduced motion, immediate usable content');
  report.status = 'PASS';
} catch(error) { report.status='FAIL'; report.failure=error.stack; throw error; }
finally { await browser.close(); await fs.writeFile(path.join(output,'regression.json'), JSON.stringify(report,null,2)); }
