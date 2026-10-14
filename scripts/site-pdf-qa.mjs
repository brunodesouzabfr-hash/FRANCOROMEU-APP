import { chromium } from '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const output = process.argv[3] || '/tmp/fr-site-pdf-qa';
await fs.mkdir(output, { recursive:true });
const browser = await chromium.launch({ executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage'] });
const report = {synthetic:true,cases:[],errors:[]};
try {
  const page = await browser.newPage({viewport:{width:1440,height:900}});
  const errors=report.errors; page.on('pageerror', e=>errors.push(e.message));
  page.on('dialog', dialog=>dialog.dismiss());
  await page.route(/clarity\.ms|googletagmanager\.com|google-analytics\.com/, r=>r.abort());
  await page.goto((process.argv[2] || 'http://127.0.0.1:4181')+'/orcamento',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.__frCore&&!!window.FR_STAGE16&&!!window.FR_BUDGET_TRANSFER);
  await page.waitForTimeout(1800);
  await page.evaluate(()=>window.switchView('view-orcamento'));
  await page.waitForFunction(()=>document.getElementById('view-orcamento').classList.contains('active'));
  for (const [name,count] of [['short',2],['long',28]]) {
    console.log('Prepare PDF '+name);
    await page.evaluate(count=>{
      const core=window.__frCore,state=core.appState;
      const services=count===2?[Object.values(core.SERVICES)[0],core.SERVICES.pac_reforma_residencial]:Object.values(core.SERVICES).slice(0,count);
      state.selectedServices=services.map((s,i)=>({id:'pdf-fixture-'+i,serviceId:s.id,quantidade:3,configs:Object.fromEntries(Object.entries(s.configuracoes||{}).map(([key,c])=>[key,c.opcoes?.[0]?.id??0]))}));
      Object.assign(state.clientData,{nome:'Cliente fictício QA',telefone:'11900000000',tipo:'Pessoa Física',origem:'Teste',finalidade:'Teste de paginação',prazo:'A definir'});
      Object.assign(state.address,{cep:'01001000',logradouro:'Endereço fictício de teste',numero:'100',bairro:'Teste',cidade:'São Paulo',estado:'SP'});
      state.environment=['Cozinha'];state.paymentMethod='pix';state.step=5;core.saveAndRender();
      document.getElementById('terms-agree').checked=true;
    },count);
    const before=await page.evaluate(()=>JSON.stringify({selection:window.__frCore.appState.selectedServices,quote:window.__frCore.calculateTotal()}));
    const [download]=await Promise.all([page.waitForEvent('download',{timeout:120000}),page.locator('[data-action="generatePDF"]').click({noWaitAfter:true,timeout:90000})]);
    await download.saveAs(path.join(output,name+'.pdf'));
    assert.equal(await page.evaluate(()=>JSON.stringify({selection:window.__frCore.appState.selectedServices,quote:window.__frCore.calculateTotal()})),before,'PDF não pode modificar seleção ou valor');
    report.cases.push({name,services:count,downloaded:true,bytes:(await fs.stat(path.join(output,name+'.pdf'))).size,preservesFinancialState:true,containsUnpricedScope:count===2});
    console.log('PDF '+name+' downloaded');
  }
  report.errors=errors;
}catch(error){report.failure=error.stack;throw error}finally{await browser.close();await fs.writeFile(path.join(output,'pdf-qa.json'),JSON.stringify(report,null,2))}
