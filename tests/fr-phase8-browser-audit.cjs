'use strict';
/** Phase 8: production-output Chromium QA; no remote deployment.
 * Tests all six canonical routes at desktop/mobile, SPA navigation, original
 * dialogs, IQE entry, nav geometry, loaded media, and captures actual evidence.
 */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {setTimeout:delay}=require('node:timers/promises');
const PORT=4198,BASE='http://127.0.0.1:'+PORT,OUT='artifacts/phase8';
const ROUTES=[
 {route:'/',id:'view-home',label:'home'},
 {route:'/sobre',id:'view-sobre',label:'sobre'},
 {route:'/ambientes',id:'view-ambientes',label:'ambientes'},
 {route:'/projetos-3d',id:'view-projetos3d',label:'projetos-3d'},
 {route:'/portfolio',id:'view-projetos',label:'portfolio'},
 {route:'/orcamento',id:'view-orcamento',label:'orcamento'}
];
const VIEWPORTS=[
 {width:1440,height:900,label:'desktop'},
 {width:390,height:844,label:'mobile'}
];
const isNear=(a,b,tolerance=4)=>Math.abs(a-b)<=tolerance;
async function ready(){
 for(let i=0;i<100;i++){
  const up=await new Promise(resolve=>{
   const req=http.get(BASE+'/',res=>{res.resume();resolve(res.statusCode===200);});
   req.on('error',()=>resolve(false));
  });
  if(up)return;
  await delay(250);
 }
 throw Error('Isolated preview unavailable');
}
async function measure(page){
 return page.evaluate(()=>{
  const nav=document.getElementById('smart-nav'),r=nav?.getBoundingClientRect(),style=nav?getComputedStyle(nav):null;
  const view=document.querySelector('.view-section.active'),box=view?.getBoundingClientRect();
  const imgs=[...document.images].filter(x=>x.complete&&x.currentSrc&&
    x.currentSrc.startsWith(location.origin)&&x.naturalWidth===0);
  const loaded=[...document.images].filter(x=>x.complete&&x.naturalWidth>0).length;
  const links=[...document.querySelectorAll('#smart-nav a[data-fr-view]')]
   .map(a=>({id:a.dataset.frView,href:a.getAttribute('href'),current:a.getAttribute('aria-current')}));
  const perf=performance.getEntriesByType('navigation')[0];
  const contacts=[...document.querySelectorAll('#smart-nav .fr-site-icon-link')].map(a=>a.href);
  return {
   url:location.pathname,activeView:view?.id||null,viewVisible:box?box.width>0&&box.height>0:false,
   scrollY:scrollY,viewport:{w:innerWidth,h:innerHeight},
   documentWidth:document.documentElement.scrollWidth,
   nav:nav?{position:window.FRNav7?.getState()?.position,rect:{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height},
    radius:style.borderTopLeftRadius,inert:nav.inert,version:nav.dataset.frNav7Version}:null,
   links,contacts,brokenImages:imgs.slice(0,15).map(i=>i.currentSrc),brokenCount:imgs.length,
   loadedImages:loaded,totalImages:document.images.length,
   budgetCore:!!document.getElementById('fr-budget-core'),
   summary:!!document.getElementById('summary-container'),
   fpsProxy:null,
   domContentLoadedMs:perf?Math.round(perf.domContentLoadedEventEnd):null
  };
 });
}
function check(record,expected,phase){
 assert.equal(record.activeView,expected.id,'Incorrect active SPA view '+phase+': '+JSON.stringify(record).slice(0,800));
 assert.equal(record.viewVisible,true,'Main view not rendered in '+phase);
 assert.ok(record.nav,'Global nav missing '+phase);
 assert.equal(record.nav.version,'7.1','Nav phase 7 lost after route '+phase);
 assert.equal(record.nav.inert,false,'Nav unexpectedly inert '+phase);
 assert.ok(isNear((record.nav.rect.left+record.nav.rect.right)/2,record.viewport.w/2,4),
   'Navbar not centered '+phase+': '+JSON.stringify(record.nav));
 assert.ok(Number.parseFloat(record.nav.radius)>=100,'Nav pill radius degraded '+phase);
 assert.ok(record.nav.rect.left>=-1&&record.nav.rect.right<=record.viewport.w+1,
   'Nav outside viewport '+phase);
 assert.ok(record.links.length>=5,'SPA links missing '+phase);
 assert.ok(record.links.some(x=>x.id===expected.id&&x.current==='page'),
   'Active link not highlighted '+phase);
 assert.ok(record.contacts.some(x=>x.includes('instagram.com')),'Instagram missing '+phase);
 assert.ok(record.contacts.some(x=>x.includes('wa.me')),'WhatsApp missing '+phase);
 if(expected.route==='/orcamento')assert.equal(record.summary,true,'Budget summary missing');
}
async function oneScenario(page,route,viewport,errors){
 const name=route.label+'-'+viewport.label;
 await page.setViewportSize(viewport);
 const pageErrors=[];
 const onError=err=>pageErrors.push(err.message.slice(0,260));
 page.on('pageerror',onError);
 try{
  const resp=await page.goto(BASE+route.route,{waitUntil:'domcontentloaded',timeout:90000});
  assert.equal(resp?.status(),200,name+' HTTP');
  await page.waitForFunction(()=>window.FRNav7?.getState()?.mounted===true,{timeout:45000});
  assert.equal(await page.locator('#fr-cinema-overlay').count(),0,name+' screenshot obstructed by intro');
  await page.waitForTimeout(500);
  if(route.route==='/portfolio'&&viewport.width<=390){
   await page.evaluate(()=>document.fonts?.ready);
   const word=await page.evaluate(()=>{
    const span=document.querySelector('#view-projetos .fr16-portfolio-title > span');
    const node=span?.firstChild;
    if(!node||node.nodeType!==Node.TEXT_NODE)return null;
    const start=node.textContent.toLowerCase().indexOf('transformação.');
    if(start<0)return null;
    const range=document.createRange();range.setStart(node,start);
    range.setEnd(node,start+'transformação.'.length);
    const rects=[...range.getClientRects()].filter(rect=>rect.width>0);
    return {lines:rects.length,rects:rects.map(rect=>({left:rect.left,right:rect.right,width:rect.width})),viewport:innerWidth};
   });
   assert.ok(word,'Portfolio headline word not found');
   assert.equal(word.lines,1,'TRANSFORMAÇÃO word splits across mobile lines: '+JSON.stringify(word));
   assert.ok(word.rects[0].left>=5&&word.rects[0].right<=viewport.width-5,
    'Portfolio headline word is cropped: '+JSON.stringify(word));
  }
  const top=await measure(page);
  check(top,route,name+' top');
  assert.equal(top.nav.position,'header',name+' starts in header');
  await page.screenshot({path:path.join(OUT,name+'-header.png'),animations:'disabled',timeout:25000});
  await page.evaluate(()=>window.scrollTo({top:Math.min(510,Math.max(350,document.documentElement.scrollHeight-innerHeight-4)),behavior:'instant'}));
  const expectedPosition=route.route==='/orcamento'?'header':'footer';
  await page.waitForFunction(pos=>window.FRNav7?.getState()?.position===pos,expectedPosition,{timeout:16000});
  await page.waitForTimeout(930);
  const after=await measure(page);
  check(after,route,name+' after scroll');
  assert.equal(after.nav.position,expectedPosition,'Wrong nav placement after scroll '+name);
  assert.ok(after.scrollY>=160,'Route did not scroll enough to exercise nav '+name);
  if(route.route==='/orcamento'){
   assert.ok(after.nav.rect.top<65,'Budget nav left header on scroll: '+name);
   assert.ok(isNear(after.nav.rect.top,top.nav.rect.top,4),'Budget nav shifted after scroll '+name);
  }else assert.ok(after.nav.rect.bottom>viewport.height-100,'Dock never reaches bottom '+name);
  await page.screenshot({path:path.join(OUT,name+'-scrolled.png'),animations:'disabled',timeout:25000});
  const report={name,route:route.route,viewport:viewport.label,top,after,
    javascriptErrors:pageErrors.slice(0,25)};
  errors.push(...pageErrors.map(error=>({scenario:name,error})));
  console.log('PHASE8_SCENARIO_PASS',JSON.stringify({name,navAtScroll:after.nav.position,
   center:(after.nav.rect.left+after.nav.rect.right)/2,viewport:after.viewport.w,
   brokenImages:after.brokenCount,consoleErrors:pageErrors.length}));
  return report;
 }finally{page.off('pageerror',onError);}
}
async function originalControls(page){
 await page.setViewportSize({width:390,height:844});
 await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.FRNav7?.getState()?.mounted===true);
 const menu=page.locator('#fr-site-menu');
 await page.evaluate(()=>document.getElementById('fr-site-menu-open').click());
 await page.waitForFunction(()=>document.getElementById('fr-site-menu').open,{timeout:7000});
 assert.equal(await menu.getAttribute('aria-labelledby'),'fr-site-menu-title');
 await page.evaluate(()=>document.getElementById('fr-site-menu-close').click());
 await page.waitForFunction(()=>!document.getElementById('fr-site-menu').open,{timeout:7000});
 await page.waitForFunction(()=>!document.getElementById('smart-nav').inert,{timeout:7000});
 const navigated=await page.evaluate(()=>{
  const a=document.querySelector('#fr-site-menu a[data-fr-view="view-sobre"]');
  a.click();
  return a.getAttribute('href');
 });
 await page.waitForFunction(()=>document.querySelector('.view-section.active')?.id==='view-sobre',{timeout:10000});
 const result=await page.evaluate(()=>({
  active:document.querySelector('.view-section.active')?.id,
  url:location.pathname,
  assistant:!!document.getElementById('fr-ai-launcher'),
  ga4Scripts:[...document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')].map(x=>x.src)
 }));
 assert.equal(result.active,'view-sobre');
 assert.ok(result.assistant,'IQE launcher removed');
 assert.equal(result.ga4Scripts.length,1,'Expected one GA4 script');
 assert.ok(result.ga4Scripts[0].includes('G-22Z85RCGQC'),'GA4 ID disagrees with canonical main');
 console.log('PHASE8_SPA_MENU_IQE_PASS',JSON.stringify({navigated,result}));
 return result;
}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const server=spawn(process.execPath,['scripts/preview-site.cjs',String(PORT)],{stdio:['ignore','pipe','pipe']});
 server.stdout.on('data',chunk=>process.stdout.write('[phase8-preview] '+chunk));
 server.stderr.on('data',chunk=>process.stderr.write('[phase8-preview] '+chunk));
 let browser;
 try{
  await ready();
  browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
  const context=await browser.newContext({deviceScaleFactor:1,reducedMotion:'reduce'});
  // Prevent the 17-second cinematic overlay from hiding page UI in screenshots.
  // Separate intro QA verifies full first-visit behavior and low-FPS playback.
  await context.addInitScript(()=>{try{sessionStorage.setItem('fr_intro_v04_seen','1');}catch(_){}});
  const page=await context.newPage();
  const results=[],errors=[];
  for(const viewport of VIEWPORTS)for(const route of ROUTES)
   results.push(await oneScenario(page,route,viewport,errors));
  const controls=await originalControls(page);
  const report={schema:'fr/phase8/browser-audit/v1',timestamp:new Date().toISOString(),
   totalScenarios:results.length,passed:results.length,routes:ROUTES.map(x=>x.route),
   viewportLabels:VIEWPORTS.map(x=>x.label),results,controls,errors,
   limitations:['Chromium emulado não substitui dispositivo físico','Tempos de DOM não são Core Web Vitals','Revisão editorial das mídias depende de evidências aprovadas']};
  fs.writeFileSync(path.join(OUT,'browser-audit.json'),JSON.stringify(report,null,2)+'\n');
  console.log('FR_PHASE8_BROWSER_PASS',results.length,'scenarios');
  await context.close();
 }finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
 }
})().catch(error=>{console.error('FR_PHASE8_BROWSER_FAIL',error.stack||error);process.exitCode=1;});
