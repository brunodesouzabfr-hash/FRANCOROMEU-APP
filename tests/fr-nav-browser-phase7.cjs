'use strict';
/* Real-browser QA: runs ONLY against locally built dist/; no deployment.
 * Requires a separately installed pinned Playwright/Chromium in CI. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {mkdirSync}=require('node:fs');
const {setTimeout:delay}=require('node:timers/promises');
const http=require('node:http');
const assert=require('node:assert/strict');
const PORT=4197,BASE='http://127.0.0.1:'+PORT,OUT='artifacts/nav-phase7';
async function ready(){
 for(let i=0;i<65;i++){
  const ok=await new Promise(resolve=>{
   const r=http.get(BASE+'/',res=>{res.resume();resolve(res.statusCode===200);});
   r.on('error',()=>resolve(false));
  });
  if(ok)return;await delay(250);
 }
 throw Error('Local public preview server did not start');
}
function near(value,expected,tolerance=3){return Math.abs(value-expected)<=tolerance;}
async function metrics(page){
 return page.evaluate(()=>{
  const n=document.getElementById('smart-nav'),r=n.getBoundingClientRect(),c=getComputedStyle(n);
  return {viewport:{width:innerWidth,height:innerHeight},rect:{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height},
   radius:c.borderTopLeftRadius,navClasses:n.className,position:window.FRNav7?.getState().position,
   navState:n.dataset.frNav7Position,bodyBudget:document.body.classList.contains('fr10-budget-active'),
   scrollY:window.scrollY,cssLeft:c.left,cssTop:c.top,inert:n.inert,menu:getComputedStyle(document.getElementById('fr-site-menu-open')).display,
   instagram:!!n.querySelector('[data-fr-contact="instagram"]'),whatsapp:!!n.querySelector('[data-fr-contact="whatsapp"]')};
 });
}
function validate(m,phase,kind){
 assert.equal(m.position,kind,'Not docked to '+kind+' in '+phase+'; '+JSON.stringify(m));
 assert.ok(m.rect.width<=m.viewport.width+1,'Nav overflows viewport: '+JSON.stringify(m));
 assert.ok(near((m.rect.left+m.rect.right)/2,m.viewport.width/2,3),'Nav off-center in '+phase+': '+JSON.stringify(m));
 assert.ok(parseFloat(m.radius)>=100,'Navbar is not organically rounded in '+phase+': '+JSON.stringify(m));
 assert.ok(m.rect.left>=-1&&m.rect.right<=m.viewport.width+1,'Navbar clipped horizontally: '+JSON.stringify(m));
 assert.equal(m.inert,false,'Navbar is inert in '+phase);
 if(kind==='footer'){
  assert.ok(m.rect.bottom<m.viewport.height-3&&m.rect.bottom>m.viewport.height-95,'Floating dock not near footer in '+phase+': '+JSON.stringify(m));
 }else{
  assert.ok(m.rect.top>=0&&m.rect.top<65,'Header not near top in '+phase+': '+JSON.stringify(m));
 }
}
async function audit(page,width,height,pathname,name){
 await page.setViewportSize({width,height});
 await page.goto(BASE+pathname,{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForFunction(()=>window.FRNav7&&window.FRNav7.getState().mounted,{timeout:45000});
 assert.equal(await page.locator('#fr-cinema-overlay').count(),0,'Intro overlay obscures navbar QA screenshots');
 // Prevent unrelated intro overlays from obscuring the geometry measurement,
 // but do not manipulate or replace the nav.
 await page.waitForTimeout(950);
 let start=await metrics(page);validate(start,name+' top','header');
 await page.screenshot({path:OUT+'/'+name+'-top.png',animations:'disabled',timeout:25000});
 await page.evaluate(()=>window.scrollTo({top:Math.min(510,Math.max(300,document.documentElement.scrollHeight-innerHeight-5)),behavior:'instant'}));
 const onBudget=pathname==='/orcamento';
 await page.waitForFunction((budget)=>window.scrollY>=160&&window.FRNav7?.getState()?.position===(budget?'header':'footer'),onBudget,{timeout:16000});
 await page.waitForTimeout(1050);
 let dock=await metrics(page);
 validate(dock,name+(onBudget?' fixed top after scroll':' footer'),onBudget?'header':'footer');
 assert.ok(dock.scrollY>=160,'Page did not actually scroll: '+JSON.stringify(dock));
 if(onBudget){
  assert.ok(dock.bodyBudget,'Budget view must retain the original budget state');
  assert.ok(near(dock.rect.top,start.rect.top,3),'Budget nav moved from header on scroll');
 }else{
  assert.ok(dock.rect.top>start.rect.top+100,'Other view did not actually move nav to the bottom');
 }
 await page.screenshot({path:OUT+'/'+name+(onBudget?'-fixed-top-scrolled.png':'-footer.png'),animations:'disabled',timeout:25000});
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>window.FRNav7?.getState()?.position==='header',{timeout:16000});
 await page.waitForTimeout(950);
 let restored=await metrics(page);validate(restored,name+' restored','header');
 console.log('PASS_NAV_BROWSER',JSON.stringify({name,start,dock,restored}));
 if(width<=390){
  await page.evaluate(()=>{
   document.getElementById('fr-site-menu-open').click();
  });
  await page.waitForFunction(()=>document.getElementById('fr-site-menu')?.open,{timeout:10000});
  assert.ok(await page.locator('#fr-site-menu').getAttribute('aria-labelledby'));
  await page.evaluate(()=>document.getElementById('fr-site-menu-close').click());
  await page.waitForFunction(()=>!document.getElementById('fr-site-menu')?.open,{timeout:10000});
  await page.waitForFunction(()=>!document.getElementById('smart-nav').inert,{timeout:10000});
 }
}
(async()=>{
 mkdirSync(OUT,{recursive:true});
 const server=spawn(process.execPath,['scripts/preview-site.cjs',String(PORT)],{stdio:['ignore','pipe','pipe']});
 server.stdout.on('data',d=>process.stdout.write('[preview] '+d));
 server.stderr.on('data',d=>process.stderr.write('[preview] '+d));
 let browser;
 try{
  await ready();
  browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
  const context=await browser.newContext({reducedMotion:'no-preference',deviceScaleFactor:1});
  // UI geometry and screenshots must be taken AFTER the cinematic overlay.
  // Skip intro only in navbar QA; intro playback has its own dedicated test.
  await context.addInitScript(()=>{try{sessionStorage.setItem('fr_intro_v04_seen','1');}catch(_){}});
  const page=await context.newPage();
  await audit(page,1440,900,'/','home-desktop');
  await audit(page,1440,900,'/orcamento','budget-desktop');
  await audit(page,390,844,'/','home-mobile-390');
  await audit(page,390,844,'/orcamento','budget-mobile-390');
  await audit(page,320,568,'/','home-mobile-320');
  console.log('NAV_CHROMIUM_AUDIT_PASS',5,'budget header always; other routes dock');
  await context.close();
 }finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
 }
})().catch(error=>{console.error('NAV_CHROMIUM_AUDIT_FAIL',error.stack||error);process.exitCode=1;});
