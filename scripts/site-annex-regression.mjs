import { chromium } from '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://127.0.0.1:4181';
const output = process.argv[3] || '/tmp/fr-annex-qa';
await fs.mkdir(output,{recursive:true});
const build=JSON.parse(await fs.readFile('dist/build-report.json','utf8'));
const report={capturedAt:new Date().toISOString(),publicFingerprint:build.publicFingerprint,synthetic:true,engine:'Chromium emulation, not a physical device',profiles:[],three:[]};
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader']});
async function ready(page,route='/'){
  await page.route(/clarity\.ms|googletagmanager\.com|google-analytics\.com/,r=>r.abort());
  await page.goto(base+route,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__frCore&&window.FRMediaCase&&window.FRPriceReference&&window.FR_STAGE16);
  await page.waitForTimeout(1000);
}
try{
  for(const [width,height] of [[390,844],[1440,900]]){
    const page=await browser.newPage({viewport:{width,height},isMobile:width<600,hasTouch:width<600});
    const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
    await ready(page);
    assert.equal(requests.some(url=>url.includes('price-reference-2026')),false,'documentary data is lazy');
    assert.equal(requests.some(url=>url.includes('three@')),false,'no Three on initial Home');
    assert.equal(await page.locator('#fr-price-reference').evaluate(n=>getComputedStyle(n).padding==='0px'),false,'external CSS actually applied');
    assert.equal(await page.locator('iframe').count(),0);
    await page.evaluate(()=>window.switchView('view-projetos'));
    await page.waitForFunction(()=>document.querySelector('#fr16-portfolio #frmedia-cozinha-lavanderia'));
    const section=page.locator('#frmedia-cozinha-lavanderia');
    assert.equal(await section.locator('.frmedia-card').count(),57);
    for(const [group,count] of [['LAV',6],['COZ_ESQ',16],['COZ_DIR',21],['INT',14],['ALL',57]]){
      await section.locator('[data-group="'+group+'"]').click();
      assert.equal(await section.locator('.frmedia-card').count(),count,group);
    }
    await section.locator('[data-group="LAV"]').click();
    const trigger=section.locator('.frmedia-open').last();await trigger.click();
    const dialog=section.locator('dialog');assert.equal(await dialog.evaluate(n=>n.open),true);
    await dialog.locator('img').evaluate(n=>n.decode());
    const dims=await dialog.locator('img').evaluate(n=>({native:n.naturalWidth,display:n.getBoundingClientRect().width}));
    assert.ok(dims.native<=472&&dims.display<=472,'R119P never upscaled');
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
    await page.screenshot({path:path.join(output,width+'-media-dialog.png'),animations:'disabled'});
    await page.keyboard.press('Escape');assert.equal(await dialog.evaluate(n=>n.open),false);
    assert.equal(await trigger.evaluate(n=>n===document.activeElement),true);
    await trigger.click();await page.evaluate(()=>window.switchView('view-orcamento'));
    await page.waitForFunction(()=>!document.querySelector('#frmedia-cozinha-lavanderia dialog').open);
    assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');
    const before=await page.evaluate(()=>JSON.stringify(window.__frCore.appState.selectedServices));
    const panel=page.locator('#fr-price-reference');
    await panel.locator('summary').first().click();
    await page.waitForFunction(()=>document.querySelectorAll('#fr-price-reference .fr-price-results .fr-price-card').length===94);
    assert.equal(await panel.locator('#fr-price-service-select option').count(),116);
    await panel.locator('#fr-price-service-select').selectOption('hid_torneira');
    await page.waitForFunction(()=>document.querySelector('#fr-price-reference .fr-price-fr')?.textContent.includes('249,00'));
    await page.screenshot({path:path.join(output,width+'-price-reference.png'),animations:'disabled'});
    await panel.locator('summary').last().click();
    await page.waitForFunction(()=>document.querySelectorAll('#fr-price-reference details:last-child a').length===17);
    const links=await panel.locator('details:last-child a').evaluateAll(nodes=>nodes.map(n=>n.href));
    assert.ok(links.every(link=>new URL(link).origin==='https://wa.me'&&new URL(link).pathname==='/5511990021603'&&new URL(link).searchParams.has('text')));
    assert.equal(await page.evaluate(()=>JSON.stringify(window.__frCore.appState.selectedServices)),before,'reading references or requesting a new family cannot mutate selection');
    await page.evaluate(()=>{const c=window.__frCore;c.appState.step=2;c.saveAndRender();c.handle.selectService({dataset:{serviceId:'hid_torneira'}});});
    const qty=page.locator('[data-action="updateServiceQty"]');
    await qty.fill('2');await qty.dispatchEvent('input');
    await page.evaluate(()=>{
      window.__frQtyTrace=[];
      for(const type of ['pointerdown','pointerup','click','input','change'])document.addEventListener(type,event=>{
        const input=document.querySelector('[data-action="updateServiceQty"]');
        if(!input)return;
        const plus=document.querySelector('.fr-quantity button:last-child');
        window.__frQtyTrace.push({type,target:event.target.tagName,classes:String(event.target.className),label:event.target.getAttribute('aria-label'),value:input.value,x:event.clientX,y:event.clientY,scrollY,buttonRect:plus?.getBoundingClientRect().toJSON()});
        if(window.__frQtyTrace.length>30)window.__frQtyTrace.shift();
      },true);
    });
    await page.getByRole('button',{name:'Aumentar quantidade',exact:true}).click();
    report.quantityClick=await page.evaluate(()=>window.__frQtyTrace);
    report.quantityAncestors=await qty.evaluate(n=>{const a=[];for(let p=n;p;p=p.parentElement)a.push({tag:p.tagName,id:p.id,classes:p.className,transform:getComputedStyle(p).transform});return a});
    if(await qty.inputValue()!=='3')await page.screenshot({path:path.join(output,width+'-quantity-failure.png'),animations:'disabled'});
    assert.equal(await qty.inputValue(),'3');
    assert.equal(await page.locator('#step-content-container').evaluate(n=>getComputedStyle(n).transform),'none','o editor não pode deslocar controles durante entrada');
    for(let cycle=0;cycle<5;cycle++){
      await page.evaluate(()=>window.__frCore.handle.selectService({dataset:{serviceId:'hid_torneira'}}));
      await qty.fill('2');await qty.dispatchEvent('input');
      await page.getByRole('button',{name:'Aumentar quantidade',exact:true}).click();
      assert.equal(await qty.inputValue(),'3','cada reconstrução precisa aceitar o primeiro clique');
    }
    assert.equal(await page.locator('[data-action="updateServiceConfig"]').first().evaluate(n=>getComputedStyle(n).color),'rgb(230, 214, 181)','opções não podem ficar com texto preto em fundo escuro');
    assert.equal(await qty.getAttribute('aria-valuenow'),'3');
    await page.locator('[data-fr-price-service] summary').click();
    await page.waitForFunction(()=>document.querySelector('[data-fr-price-service] .fr-price-fr')?.textContent.includes('549,00'));
    await qty.fill('4');await qty.dispatchEvent('input');
    await page.waitForFunction(()=>document.querySelector('[data-fr-price-service] .fr-price-fr')?.textContent.includes('600,00'));
    await qty.fill('');await qty.dispatchEvent('input');
    assert.match(await page.locator('[data-fr-price-service] .fr-price-fr').innerText(),/quantidade válida/);
    await qty.fill('4');await qty.dispatchEvent('input');
    await page.locator('[data-action="confirmService"]').click();
    const total=await page.evaluate(()=>window.__frCore.calculateTotal().total);
    assert.equal(total,600);await page.reload();await page.waitForFunction(()=>!!window.__frCore);
    assert.equal(await page.evaluate(()=>window.__frCore.calculateTotal().total),total);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    assert.equal(overflow,false);assert.deepEqual(errors,[]);
    await page.goto(base+'/projetos/cozinha-lavanderia',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!!window.FRMediaCase);
    await page.locator('#fr-case-hero-image').evaluate(n=>n.decode());
    assert.ok(await page.locator('#fr-case-hero-image').evaluate(n=>n.naturalWidth>0));
    assert.equal(await page.locator('.frmedia-card').count(),57);
    assert.equal(await page.evaluate(()=>typeof window.FRBudgetCore),'undefined');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:path.join(output,width+'-study-case.png'),animations:'disabled'});
    if(width<600){await page.locator('.fr-case-menu summary').click();assert.equal(await page.locator('.fr-case-menu').getAttribute('open'),'');}
    await page.locator('.frmedia-open').first().click();await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').evaluate(n=>n.open),false);
    report.profiles.push({width,height,errors,media:57,gaps:17,referenceCodes:94,quantityEntryCycles:6,total,persistence:true,overflow});
    await page.close();console.log('PASS annex mobile/desktop '+width);
  }
  // Cold load with the documentary source unavailable: calculator still works.
  const offline=await browser.newPage({viewport:{width:390,height:844}});
  await offline.route('**/assets/data/price-reference-2026-10-08.json',r=>r.abort());
  await ready(offline,'/orcamento');await offline.locator('#fr-price-reference summary').first().click();
  await offline.waitForFunction(()=>document.querySelector('#fr-price-reference .fr-price-results')?.textContent.includes('indisponível'));
  await offline.evaluate(()=>{const c=window.__frCore;c.appState.step=2;c.saveAndRender();c.handle.selectService({dataset:{serviceId:'chuveiro'}});});
  for(const key of ['tipo','instalacao'])await offline.evaluate(key=>{const c=window.__frCore;const keys=Object.keys(c.SERVICES.chuveiro.configuracoes);c.handle.updateServiceConfig({dataset:{configKey:keys[key==='tipo'?0:1],optionIdx:'0'}});},key);
  await offline.locator('[data-action="updateServiceQty"]').fill('1');
  await offline.locator('[data-action="confirmService"]').click();
  assert.equal(await offline.evaluate(()=>window.__frCore.calculateTotal().total),179);
  report.unavailableReference='PASS; base calculator total 179 preserved';await offline.close();
  for(const blocked of [false,true]){
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    if(blocked)await page.route('**/three@0.161.0/**',r=>r.abort());
    await ready(page,'/projetos-3d');
    await page.waitForFunction(()=>document.querySelector('.fr14-matrix-stage')?.matches('.is-webgl,.is-fallback'),null,{timeout:25000});
    const state=await page.evaluate(()=>({webgl:document.querySelector('.fr14-matrix-stage').classList.contains('is-webgl'),fallback:document.querySelector('.fr14-matrix-stage').dataset.fallbackReason,revision:window.THREE?.REVISION}));
    if(blocked)assert.equal(state.fallback,'load-failure');
    else{
      assert.equal(state.revision,'161');assert.equal(state.webgl,true);
      await page.locator('#fr14-three-canvas').dispatchEvent('webglcontextlost');
      assert.equal(await page.locator('.fr14-matrix-stage').getAttribute('data-fallback-reason'),'context-lost');
    }
    await page.locator('#fr14-matrix-next').click();assert.equal(await page.locator('#fr14-matrix-index').innerText(),'02');
    report.three.push({blocked,...state,compatibleControls:true});await page.close();
  }
  report.status='PASS';
}catch(error){report.status='FAIL';report.failure=error.stack;throw error;}
finally{await browser.close();await fs.writeFile(path.join(output,'annex-regression.json'),JSON.stringify(report,null,2));}
