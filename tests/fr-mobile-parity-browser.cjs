'use strict';
/** Chromium geometry QA for mobile split-scroll, desktop-parity nav and Block.
 * Runs only against the isolated dist/ preview, never against production.
 */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const http=require('node:http');
const {setTimeout:delay}=require('node:timers/promises');
const PORT=4222,BASE='http://127.0.0.1:'+PORT,OUT='artifacts/mobile-parity';
const viewports=[
 {width:320,height:568},
 {width:360,height:740},
 {width:390,height:844},
 {width:430,height:932},
 {width:1440,height:900}
];
async function ready(){
 for(let i=0;i<80;i++){
  const ok=await new Promise(resolve=>{
   const req=http.get(BASE+'/',res=>{res.resume();resolve(res.statusCode===200)});
   req.on('error',()=>resolve(false));
  });
  if(ok)return;
  await delay(250);
 }
 throw Error('Preview server unavailable');
}
async function sample(page){
 return page.evaluate(()=>{
  const nav=document.getElementById('smart-nav'),items=nav?.querySelector('.nav-items');
  const split=document.getElementById('frms-home');
  const left=split?.querySelector('[data-frms-side="left"]'),right=split?.querySelector('[data-frms-side="right"]');
  const divider=split?.querySelector('.frms-divider');
  const card=split?.querySelector('.frms-card[aria-hidden="false"]');
  const controls=split?.querySelector('.frms-controls');
  const btn=document.getElementById('fr-ai-launcher');
  const info=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  return {
   width:innerWidth,height:innerHeight,
   nav:info(nav),navState:window.FRNav7?.getState()?.position,
   navRadius:parseFloat(getComputedStyle(nav).borderTopLeftRadius),
   navLinksDisplay:getComputedStyle(items).display,
   navScrollWidth:items.scrollWidth,navClientWidth:items.clientWidth,
   navOverflow:getComputedStyle(items).overflowX,links:items.querySelectorAll('li').length,
   instagram:getComputedStyle(nav.querySelector('[data-fr-contact="instagram"]')).display,
   whatsapp:getComputedStyle(nav.querySelector('[data-fr-contact="whatsapp"]')).display,
   search:nav.querySelector('#fr-global-search-item')?getComputedStyle(nav.querySelector('#fr-global-search-item')).display:null,
   captions:[...items.querySelectorAll('li a[data-fr-view]')].map(a=>{
    const label=a.querySelector('.nav-label'),icon=a.querySelector('i');
    const l=label.getBoundingClientRect(),i=icon.getBoundingClientRect();
    return {label:label.textContent.trim(),display:getComputedStyle(label).display,
            position:getComputedStyle(label).position,iconBottom:i.bottom,labelTop:l.top};
   }),
   navVisible:getComputedStyle(nav).visibility,navInert:nav.inert,navImmersive:window.FRNav7?.getState()?.immersive??false,
   split:info(split),pin:info(split.querySelector('.frms-pin')),
   left:info(left),right:info(right),divider:info(divider),
   sideCss:{left:{width:getComputedStyle(left).width,height:getComputedStyle(left).height,left:getComputedStyle(left).left,top:getComputedStyle(left).top},
            right:{width:getComputedStyle(right).width,height:getComputedStyle(right).height,left:getComputedStyle(right).left,top:getComputedStyle(right).top}},
   card:card?info(card):null,controls:info(controls),
   launcher:btn?info(btn):null,
   blockMounted:window.FRBlockStage?.getState()?.mounted??false
  };
 });
}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const server=spawn(process.execPath,['scripts/preview-site.cjs',String(PORT)],{stdio:['ignore','pipe','pipe']});
 server.stdout.on('data',buf=>process.stdout.write('[preview] '+buf));
 server.stderr.on('data',buf=>process.stderr.write('[preview] '+buf));
 let browser;
 try{
  await ready();
  browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
  for(const size of viewports){
   const mobile=size.width<=750,label=size.width+'x'+size.height;
   const page=await browser.newPage({viewport:size,deviceScaleFactor:1,reducedMotion:'no-preference'});
   await page.addInitScript(()=>{try{sessionStorage.setItem('fr_intro_v04_seen','1')}catch(_){}});
   await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:90000});
   await page.waitForFunction(()=>window.FRNav7?.getState()?.mounted===true&&window.FRMotionSplit?.getState()?.length>0,{timeout:45000});
   await page.waitForFunction(()=>window.FRBlockStage?.getState()?.mounted===true,{timeout:45000});
   await page.evaluate(()=>document.fonts?.ready);
   const m=await sample(page);
   console.log('FR_MOBILE_PARITY_GEOMETRY',label,JSON.stringify(m));
   const tolerance=2;
   assert.ok(m.nav.left>=-tolerance&&m.nav.right<=size.width+tolerance,label+' nav outside viewport');
   assert.ok(Math.abs((m.nav.left+m.nav.right)/2-size.width/2)<=3,label+' nav not centered');
   assert.ok(m.navRadius>=100,label+' nav pill lost rounding');
   assert.equal(m.navLinksDisplay,'flex',label+' desktop routes hidden');
   assert.ok(m.links>=5,label+' missing nav icons');
   if(mobile){
    assert.equal(m.instagram,'none',label+' Instagram must be removed from mobile navbar');
    assert.equal(m.whatsapp,'none',label+' WhatsApp must be removed from mobile navbar');
    if(m.search!==null)assert.equal(m.search,'none',label+' search must be removed from mobile navbar');
    assert.ok(m.captions.length>=5,label+' missing route captions');
    for(const caption of m.captions){
     assert.ok(caption.label,label+' unnamed route');
     assert.equal(caption.display,'block',label+' route label invisible');
     assert.equal(caption.position,'static',label+' route label still visually hidden');
     assert.ok(caption.labelTop>=caption.iconBottom-2,label+' route label not beneath icon: '+caption.label);
    }
   }else{
    assert.notEqual(m.instagram,'none',label+' desktop Instagram hidden');
    assert.notEqual(m.whatsapp,'none',label+' desktop WhatsApp hidden');
   }
   assert.ok(Math.abs(m.left.width-m.pin.width/2)<=2,label+' left half not 50% of pin');
   assert.ok(Math.abs(m.right.width-m.pin.width/2)<=2,label+' right half not 50% of pin');
   assert.ok(Math.abs(m.left.right-m.right.left)<=2,label+' split has gap/overlap');
   assert.ok(Math.abs(m.left.top-m.right.top)<=1,label+' halves are stacked vertically');
   assert.ok(Math.abs(m.left.height-m.right.height)<=1,label+' split height mismatch');
   assert.ok(Math.abs(m.divider.left-(m.pin.left+m.pin.width/2))<=2,label+' divider not centered');
   assert.ok(m.card&&m.controls,label+' missing scene card or controls');
   if(mobile){
    assert.equal(m.navOverflow,'auto',label+' mobile route rail not scrollable');
    assert.ok(m.launcher.width<=54,label+' IQE launcher oversized');
    assert.ok(m.card.bottom<=m.controls.top+2,label+' card overlaps comparison controls');
    assert.ok(m.card.width<=size.width-12,label+' card outside screen');
    // Real touch-sized icons remain keyboard/scroll reachable even at 320px.
    await page.evaluate(()=>{const rail=document.querySelector('#smart-nav .nav-items');rail.scrollLeft=rail.scrollWidth;});
    const scroll=await page.evaluate(()=>{const rail=document.querySelector('#smart-nav .nav-items');return {x:rail.scrollLeft,overflow:rail.scrollWidth>rail.clientWidth}});
    if(scroll.overflow)assert.ok(scroll.x>0,label+' route rail cannot be swiped');
   }
   await page.evaluate(()=>document.getElementById('frms-home').scrollIntoView({block:'start',behavior:'instant'}));
   if(mobile){
    await page.waitForFunction(()=>window.FRNav7?.getState()?.immersive===true,{timeout:12000});
    const hidden=await page.evaluate(()=>({state:document.getElementById('smart-nav').dataset.frNav7State,
     visibility:getComputedStyle(document.getElementById('smart-nav')).visibility,
     inert:document.getElementById('smart-nav').inert}));
    assert.equal(hidden.state,'immersive',label+' nav did not enter immersive state');
    assert.equal(hidden.visibility,'hidden',label+' nav still visible during split');
    assert.equal(hidden.inert,true,label+' hidden nav still keyboard accessible');
   }
   await page.waitForTimeout(250);
   await page.screenshot({path:OUT+'/home-'+label+'.png',animations:'disabled',timeout:30000});
   if(mobile){
    await page.evaluate(()=>{
     const el=document.getElementById('frms-home');
     window.scrollTo({top:window.scrollY+el.getBoundingClientRect().bottom+36,behavior:'instant'});
    });
    await page.waitForFunction(()=>window.FRNav7?.getState()?.immersive===false,{timeout:12000});
    assert.equal(await page.evaluate(()=>getComputedStyle(document.getElementById('smart-nav')).visibility),'visible',label+' nav failed to return after split');
    assert.equal(await page.evaluate(()=>document.getElementById('smart-nav').inert),false,label+' nav remained inert after split');
   }
   if(mobile){
    await page.goto(BASE+'/orcamento',{waitUntil:'domcontentloaded',timeout:90000});
    await page.waitForFunction(()=>window.FRNav7?.getState()?.mounted===true,{timeout:45000});
    await page.evaluate(()=>window.scrollTo({top:450,behavior:'instant'}));
    await page.waitForTimeout(350);
    const pinned=await page.evaluate(()=>window.FRNav7?.getState()?.position);
    assert.equal(pinned,'header',label+' budget navbar must remain at header');
   }
   console.log('FR_MOBILE_PARITY_PASS',JSON.stringify({label,navState:m.navState,left:m.left.width,right:m.right.width,launcher:m.launcher?.width,cardBottom:m.card.bottom,controlsTop:m.controls.top}));
   await page.close();
  }
 }finally{if(browser)await browser.close();server.kill('SIGTERM');}
})().catch(error=>{console.error('FR_MOBILE_PARITY_FAIL',error.stack||error);process.exitCode=1;});
