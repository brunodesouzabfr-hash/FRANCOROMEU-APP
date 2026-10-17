'use strict';
// Phase 8.1: exercise the merged V05 intro in a real browser with a slow frame
// rate. No production deployment, no timeout-based shortcut to completion.
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {mkdirSync,writeFileSync}=require('node:fs');
const {setTimeout:delay}=require('node:timers/promises');
const http=require('node:http');
const assert=require('node:assert/strict');
const PORT=4209,BASE='http://127.0.0.1:'+PORT,OUT='artifacts/intro-phase8';
async function ready(){
 for(let i=0;i<90;i++){
  const ok=await new Promise(resolve=>{
   const req=http.get(BASE+'/',res=>{res.resume();resolve(res.statusCode===200)});
   req.on('error',()=>resolve(false));
  });
  if(ok)return;
  await delay(250);
 }
 throw Error('Intro QA localhost did not start');
}
function registerEvents(){
 window.__FR_INTRO_EVENTS=[];
 window.addEventListener('fr:intro-complete',e=>window.__FR_INTRO_EVENTS.push(e.detail));
}
function lowFpsInit(){
 registerEvents();
 Object.defineProperty(navigator,'deviceMemory',{configurable:true,get:()=>2});
 Object.defineProperty(navigator,'hardwareConcurrency',{configurable:true,get:()=>2});
 const nativeRAF=window.requestAnimationFrame.bind(window);
 const nativeCancel=window.cancelAnimationFrame.bind(window);
 const tasks=new Map();let serial=0;
 window.requestAnimationFrame=function(callback){
  const id=++serial,record={timer:0,raf:0};
  tasks.set(id,record);
  record.timer=setTimeout(()=>{
   record.timer=0;
   record.raf=nativeRAF(ts=>{tasks.delete(id);callback(ts)});
  },125);
  return id;
 };
 window.cancelAnimationFrame=function(id){
  const t=tasks.get(id);if(!t)return;
  if(t.timer)clearTimeout(t.timer);
  if(t.raf)nativeCancel(t.raf);
  tasks.delete(id);
 };
}
(async()=>{
 mkdirSync(OUT,{recursive:true});
 const server=spawn(process.execPath,['scripts/preview-site.cjs',String(PORT)],{stdio:['ignore','pipe','pipe']});
 server.stdout.on('data',d=>process.stdout.write('[intro-preview] '+d));
 server.stderr.on('data',d=>process.stderr.write('[intro-preview] '+d));
 let browser;
 try{
  await ready();
  browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
  const low=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'no-preference'});
  const page=await low.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(lowFpsInit);
  await page.goto(BASE+'/?frIntro=1',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>!!document.getElementById('fr-cinema-overlay'),null,{timeout:12000});
  await page.waitForTimeout(1000);
  const initial=await page.evaluate(()=>({
   active:document.documentElement.classList.contains('fr-intro-active'),
   overlay:!!document.getElementById('fr-cinema-overlay'),
   done:window.__FR_INTRO_EVENTS.length
  }));
  assert.equal(initial.active,true);
  assert.equal(initial.overlay,true);
  assert.equal(initial.done,0,'The intro must not skip to completion before showing');
  await page.screenshot({path:OUT+'/low-fps-during.png',timeout:25000});
  await page.waitForFunction(()=>window.__FR_INTRO_EVENTS.length===1,null,{timeout:90000});
  const done=await page.evaluate(()=>({
   event:window.__FR_INTRO_EVENTS[0],
   overlay:!!document.getElementById('fr-cinema-overlay'),
   active:document.documentElement.classList.contains('fr-intro-active'),
   budget:!!document.getElementById('fr-budget-core'),
   nav:!!document.getElementById('smart-nav')
  }));
  assert.equal(done.event.reason,'visual-complete','Intro must finish only after visual progress');
  assert.equal(done.event.quality,'lite','Low-memory profile must use lite canvas');
  assert.ok(done.event.frames>20,'Too few frames to show the complete intro');
  assert.equal(done.overlay,false);
  assert.equal(done.active,false);
  assert.equal(done.budget,true);
  assert.equal(done.nav,true);
  assert.deepEqual(errors,[],'Uncaught errors in throttled introduction');
  await page.screenshot({path:OUT+'/low-fps-after.png',animations:'disabled',timeout:25000});
  await low.close();

  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const accessible=await reduced.newPage();
  const reducedErrors=[];accessible.on('pageerror',e=>reducedErrors.push(e.message));
  await accessible.addInitScript(registerEvents);
  await accessible.goto(BASE+'/?frIntro=1',{waitUntil:'domcontentloaded',timeout:90000});
  await accessible.waitForFunction(()=>window.__FR_INTRO_EVENTS.length===1,null,{timeout:15000});
  const result=await accessible.evaluate(()=>({
   event:window.__FR_INTRO_EVENTS[0],
   active:document.documentElement.classList.contains('fr-intro-active'),
   overlay:!!document.getElementById('fr-cinema-overlay')
  }));
  assert.equal(result.event.reason,'reduced-motion');
  assert.equal(result.active,false);
  assert.equal(result.overlay,false);
  assert.deepEqual(reducedErrors,[]);
  await accessible.screenshot({path:OUT+'/reduced-motion-after.png',animations:'disabled',timeout:25000});
  await reduced.close();
  const report={schema:'fr/intro/phase8.1-browser',lowFps:done,reducedMotion:result,errors,reducedErrors,
   limitations:['Artificial RAF pacing is not physical device profiling','Lab cannot certify field Core Web Vitals']};
  writeFileSync(OUT+'/intro-audit.json',JSON.stringify(report,null,2)+'\n');
  console.log('FR_INTRO_PHASE8_BROWSER_PASS',JSON.stringify({reason:done.event.reason,frames:done.event.frames,quality:done.event.quality,reduced:result.event.reason}));
 }finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
 }
})().catch(e=>{console.error('FR_INTRO_PHASE8_BROWSER_FAIL',e.stack||e);process.exitCode=1});
