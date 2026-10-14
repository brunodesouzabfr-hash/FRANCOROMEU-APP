import { chromium } from '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:4180';
const output = process.argv[3] || '/tmp/fr-site-baseline';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const report = { base, capturedAt: new Date().toISOString(), engine: 'Chromium headless; emulation', profiles: [] };
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const page = await browser.newPage({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failed.push({ url: r.url(), error: r.failure()?.errorText }));
    // Real integrations are loaded, but local audits must not send usage data.
    await page.route(/clarity\.ms|googletagmanager\.com|google-analytics\.com/, r => r.abort());
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => !!window.__frCore && !!window.FR_STAGE16, { timeout: 45000 });
    await page.waitForTimeout(5000);
    const profile = { viewport, errors, failed, views: [] };
    for (const id of ['view-home', 'view-sobre', 'view-ambientes', 'view-projetos3d', 'view-projetos', 'view-orcamento']) {
      await page.evaluate(id => window.switchView(id), id);
      await page.waitForTimeout(1100);
      await page.screenshot({ path: path.join(output, `${viewport.width}-${id}.png`), animations: 'disabled' });
      const view = await page.evaluate(id => {
        const root = document.getElementById(id);
        const visible = n => !!(n.getClientRects().length && getComputedStyle(n).visibility !== 'hidden');
        const controls = [...root.querySelectorAll('a,button,input,select,textarea,[role="button"]')].filter(visible);
        return {
          id, active: root.classList.contains('active'), pathname: location.pathname,
          title: document.title, canonical: document.querySelector('link[rel="canonical"]')?.href,
          width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
          overflow: document.documentElement.scrollWidth > innerWidth,
          loader: { hidden: document.getElementById('loader')?.hidden, pointer: getComputedStyle(document.getElementById('loader')).pointerEvents },
          brokenImages: [...root.querySelectorAll('img')].filter(n => visible(n) && n.complete && !n.naturalWidth).map(n => n.getAttribute('src')),
          smallControls: controls.filter(n => { const b = n.getBoundingClientRect(); return b.width < 44 || b.height < 44; }).slice(0, 35).map(n => ({ text: (n.getAttribute('aria-label') || n.textContent).trim().slice(0, 70), width: Math.round(n.getBoundingClientRect().width), height: Math.round(n.getBoundingClientRect().height) })),
          counters: [...root.querySelectorAll('[data-fr6-count]')].map(n => n.textContent),
          coreKeys: Object.keys(window.__frCore || {}),
          resources: performance.getEntriesByType('resource').map(r => ({ name: r.name, bytes: r.transferSize, duration: Math.round(r.duration) })),
          iframes: document.querySelectorAll('iframe').length,
        };
      }, id);
      profile.views.push(view);
      console.log(JSON.stringify({ viewport: viewport.width, id, overflow: view.overflow, broken: view.brokenImages.length, small: view.smallControls.length, errors: errors.length }));
    }
    report.profiles.push(profile);
    await page.close();
  }
} finally {
  await browser.close();
  await fs.writeFile(path.join(output, 'audit.json'), JSON.stringify(report, null, 2));
}
