import { chromium } from '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';

const target = pathToFileURL('/workspace/scratch/d805c356f63f/FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html').href;
const executablePath = '/workspace/scratch/d805c356f63f/browser.soIywg/chromium';
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'] });
const profiles = [{ name:'mobile', width:390, height:844 },{ name:'desktop', width:1440, height:900 }];
const viewIds = ['view-home','view-sobre','view-ambientes','view-projetos3d','view-projetos','view-orcamento'];
const results = {};

for (const profile of profiles) {
  const page = await browser.newPage({ viewport:{ width:profile.width, height:profile.height }, deviceScaleFactor:1 });
  await page.addInitScript(() => { try { Object.defineProperty(navigator,'connection',{ value:{ saveData:true }, configurable:true }); } catch (_) {} });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(target,{ waitUntil:'load' });
  await page.waitForTimeout(3400);
  const views = {};
  for (const id of viewIds) {
    await page.evaluate(viewId => window.switchView(viewId),id);
    await page.waitForFunction(viewId => document.querySelector('.view-section.active')?.id === viewId,id,{ timeout:2600 });
    await page.waitForTimeout(620);
    if (id === 'view-orcamento') await page.evaluate(() => { window.__frCore.appState.step=2; window.__frCore.renderApp(); });
    views[id] = await page.evaluate(viewId => {
      const active=document.querySelector('.view-section.active');
      const nav=document.getElementById('smart-nav');
      const navControls=[...(nav?.querySelectorAll('[data-fr-view]')||[])];
      const rect=nav?.getBoundingClientRect();
      const rows=new Set(navControls.map(control=>Math.round(control.getBoundingClientRect().y)));
      const key={
        'view-home':'.fr14-forge-route','view-sobre':'.fr14-chapter-rail','view-ambientes':'.fr14-curator-desk',
        'view-projetos3d':'.fr14-matrix-stage','view-projetos':'.fr14-museum-toolbar','view-orcamento':'.fr14-budget-trust'
      }[viewId];
      return {
        active:active?.id||null,world:document.body.dataset.fr14World||null,signature:active?.querySelector('.fr14-world-signature')?.textContent.trim()||'',
        ambient:!!active?.querySelector('.fr14-ambient'),component:!!document.querySelector(key),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        nav:{ width:rect?.width||0,height:rect?.height||0,rows:rows.size,controls:navControls.length },
        categories:document.querySelectorAll('[data-action="toggleCatalogCategory"]').length,
        services:Object.keys(window.__frCore?.SERVICES||{}).length,three:window.FR_STAGE14?.three||null,pdfBridge:typeof window.FR_PERFORMANCE?.ensurePDFStack==='function'
      };
    },id);
    await page.screenshot({ path:`/workspace/scratch/d805c356f63f/qa-stage14-${profile.name}-${id.replace('view-','')}.png`, animations:'disabled' });
  }
  const assertions={
    sixWorlds:Object.keys(views).length===6&&Object.values(views).every((view,index)=>view.active===viewIds[index]),
    signatures:Object.values(views).every(view=>view.signature.startsWith('•FR /')),
    ambientFields:Object.values(views).every(view=>view.ambient),
    uniqueComponents:Object.values(views).every(view=>view.component),
    noOverflow:Object.values(views).every(view=>view.overflow<=2),
    navOrdered:Object.values(views).every(view=>view.nav.controls===6&&view.nav.rows===1&&view.nav.width>view.nav.height*3),
    calculator:views['view-orcamento'].services===115&&views['view-orcamento'].categories===15,
    pdfBridge:Object.values(views).every(view=>view.pdfBridge),
    p3dFallback:views['view-projetos3d'].three==='fallback',
    runtimeErrors:errors.length===0
  };
  results[profile.name]={ views, assertions, errors };
  await page.close();
}
await browser.close();
const failed=Object.entries(results).flatMap(([profile,result])=>Object.entries(result.assertions).filter(([,ok])=>!ok).map(([name])=>`${profile}:${name}`));
console.log(JSON.stringify({ status:failed.length?'failed':'passed', failed, results },null,2));
if(failed.length)process.exitCode=1;
