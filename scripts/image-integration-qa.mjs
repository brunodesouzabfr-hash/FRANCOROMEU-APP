import {chromium} from '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const url=process.argv[2]||'http://127.0.0.1:4183';
const output=process.argv[3]||'/tmp/fr-image-integration-qa';
const baseline=process.argv.includes('--baseline');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const report={url,baseline,profiles:[],errors:[]};
try{
 const profilesToRun=[['desktop',1440,900],['mobile',390,844]].filter(([name])=>!process.argv.includes('--desktop-only')||name==='desktop').filter(([name])=>!process.argv.includes('--mobile-only')||name==='mobile');
 for(const [name,width,height] of profilesToRun){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce',hasTouch:name==='mobile'});
  const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(url)&&r.status()>=400)failed.push({url:r.url(),status:r.status()})});
  await page.route(/clarity\.ms|googletagmanager\.com|google-analytics\.com/,r=>r.abort());
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.__frCore&&!!window.FR_STAGE16,{timeout:45000});
  await page.waitForTimeout(1500);
  const profiles={name,views:[],errors,failed};
  for(const view of baseline?['home']:['home','projetos3d','projetos','ambientes','orcamento']){
   await page.evaluate(view=>window.switchView('view-'+view),view);
   await page.waitForFunction(view=>document.querySelector('.view-section.active')?.id==='view-'+view,view);
   await page.waitForTimeout(450);
   if(view==='orcamento')await page.evaluate(()=>{window.__frCore.appState.step=2;window.__frCore.renderApp()});
   const state=await page.evaluate(view=>({view,overflow:document.documentElement.scrollWidth-innerWidth,hero:document.getElementById('hero-title').textContent.trim(),services:Object.keys(window.__frCore.SERVICES).length,header:!!document.getElementById('smart-nav'),core:typeof window.__frCore.calculateTotal}),view);
   assert.ok(state.overflow<=2,name+' '+view+' overflow: '+state.overflow);assert.equal(state.services,115);
   await page.screenshot({path:path.join(output,name+'-'+view+'.png'),animations:'disabled'});profiles.views.push(state);
  }
  if(!baseline){
   await page.evaluate(()=>window.switchView('view-projetos'));
   const comparison=page.locator('#frpm-before-after');await page.evaluate(()=>window.scrollTo({top:document.getElementById('frpm-before-after').getBoundingClientRect().top+scrollY-120,behavior:'instant'}));await page.waitForTimeout(300);
   assert.equal(await comparison.locator('[data-fr-pair]').count(),60);
   await page.screenshot({path:path.join(output,name+'-before-after.png'),animations:'disabled'});
   await comparison.locator('[data-frpm-filter="hall"]').click();assert.ok(await comparison.locator('[data-fr-pair]:visible').count()>0);await comparison.locator('[data-frpm-filter="ALL"]').click();
   await page.evaluate(()=>window.switchView('view-projetos3d'));
   const caderno=page.locator('#frmedia-caderno');await caderno.scrollIntoViewIfNeeded();await caderno.locator('[data-group="TEC"]').click();const studyCount=await caderno.locator('.frmedia-card').count();assert.ok(studyCount>0&&studyCount<48,'study filter must change the selection');
   await caderno.locator('.frmedia-carousel').focus();await page.keyboard.press('ArrowRight');await caderno.locator('.frmedia-open').first().click();await page.waitForFunction(()=>!!document.querySelector('.frmedia-dialog[open]'));
   await page.keyboard.press('Escape');assert.equal(await page.locator('.frmedia-dialog[open]').count(),0);assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('frmedia-open')),true);
   await page.screenshot({path:path.join(output,name+'-case-carousel.png'),animations:'disabled'});
   await page.goto(url+'/portfolio/ambientes/biblioteca/',{waitUntil:'domcontentloaded'});
   await page.locator('.frpm-sequence').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(150);
   assert.ok((await page.locator('.frpm-sequence-status').textContent()).includes('2 de 3'));
   await page.locator('.frpm-slide').nth(1).locator('img').evaluate(async img=>{await img.decode();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
   await page.waitForTimeout(900);
   await page.screenshot({path:path.join(output,name+'-environment-sequence.png'),animations:'disabled'});
   const detail=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,canonical:document.querySelector('link[rel="canonical"]').href,steps:document.querySelectorAll('.frpm-slide').length}));assert.ok(detail.overflow<=2);profiles.environmentDetail=detail;
   await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.locator('.frpm-slide').count(),3);
   await page.goto(url+'/projetos/antes-depois/hall-escada-madeira-casa-001/',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('.frpm-comparison img').count(),2);await page.screenshot({path:path.join(output,name+'-pair-detail.png'),animations:'disabled'});
   await page.locator('a[href="/orcamento?fr-reference=FR-P001"]').click();await page.waitForFunction(()=>!!window.__frCore&&!!document.getElementById('frpm-budget-reference'));
   const selection=await page.evaluate(()=>{const core=window.__frCore,service=Object.values(core.SERVICES)[0];core.appState.selectedServices=[{id:'media-qa',serviceId:service.id,quantidade:3,configs:Object.fromEntries(Object.entries(service.configuracoes||{}).map(([k,c])=>[k,c.opcoes?.[0]?.id??0]))}];core.saveAndRender();return JSON.stringify({services:core.appState.selectedServices,total:core.calculateTotal()})});
   await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.__frCore);assert.equal(await page.evaluate(()=>JSON.stringify({services:window.__frCore.appState.selectedServices,total:window.__frCore.calculateTotal()})),selection);profiles.budgetPersistence=true;
   const offline=await browser.newPage({viewport:{width,height},javaScriptEnabled:false});await offline.goto(url+'/projetos/antes-depois/hall-escada-madeira-casa-001/',{waitUntil:'domcontentloaded'});assert.equal(await offline.locator('img[data-fr-media-id]').count(),2);assert.ok((await offline.locator('main').textContent()).includes('Intervenções representadas no estudo'));await offline.close();profiles.noJavaScriptDetail=true;
  }
  assert.equal(errors.length,0,name+' console: '+errors.join(';'));assert.equal(failed.length,0,name+' failed local resources: '+JSON.stringify(failed));
  report.profiles.push(profiles);await page.close();
 }
}finally{await browser.close();await fs.writeFile(path.join(output,'browser-report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify(report,null,2));
