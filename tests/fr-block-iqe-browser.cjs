'use strict';
/* FR Block staging smoke test: actual browser rendering with original IQE DOM and events. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const assert=require('node:assert/strict');

(async()=>{
 const port=4189, base='http://127.0.0.1:'+port;
 const server=spawn(process.execPath,['scripts/preview-site.cjs',String(port)],{stdio:['ignore','pipe','pipe']});
 let serverLog='';
 server.stdout.on('data',d=>serverLog+=String(d));
 server.stderr.on('data',d=>serverLog+=String(d));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 fs.mkdirSync('artifacts/block-iqe-staging',{recursive:true});
 try{
  for(const mode of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
   const page=await browser.newPage({viewport:{width:mode.width,height:mode.height},deviceScaleFactor:1});
   page.on('pageerror',err=>{if(/fr-block|FRBlock|block-engine/i.test(err.stack||err.message))console.error('Block browser error:',err.message);});
   // Site is intentionally offline-capable; third-party fonts and trackers are not part of avatar QA.
   await page.route('**/*',route=>{
    if(route.request().url().startsWith(base))route.continue();
    else route.abort();
   });
   let connected=false;
   for(let attempt=0;attempt<35;attempt++){
     try{
      await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:8000});
      connected=true;break;
     }catch(error){if(attempt===34)throw new Error('Preview failed to start: '+serverLog);await new Promise(r=>setTimeout(r,280));}
   }
   assert.ok(connected,'Preview is running');
   try{
     await page.waitForFunction(()=>window.FRBlockStage?.getState()?.mounted===true,undefined,{timeout:14000});
   }catch(error){
     const diag=await page.evaluate(()=>({
       state:window.FRBlockStage?.getState?.()??null,
       root:!!document.getElementById('fr-ai-root'),
       launcher:!!document.querySelector('#fr-ai-launcher .fr-ai-robot'),
       header:!!document.querySelector('.fr-ai-avatar'),
       legacy:window.FRIQEAvatar6?.getState?.()??null,
       bundle:!!window.FRBlockAvatar,
       scripts:Array.from(document.querySelectorAll('script[src*="fr-block"]')).map(el=>el.src),
       canvasSupport:!!document.createElement('canvas').getContext('2d')
     }));
     console.error('Block diagnostics for '+mode.name,JSON.stringify(diag));
     await page.screenshot({path:'artifacts/block-iqe-staging/'+mode.name+'-failed.png'});
     throw error;
   }
   await page.waitForTimeout(850);
   const info=await page.evaluate(()=>{
     const root=document.getElementById('fr-ai-root');
     const btn=document.getElementById('fr-ai-launcher');
     const canvases=[...root.querySelectorAll('canvas[data-fr-block-avatar="visual-only"]')];
     return {
       avatar:window.FRBlockStage.getState(),
       stageClass:root.classList.contains('fr-block-iqe-staging'),
       label:btn.getAttribute('aria-label'),
       budgetPreserved:!!document.getElementById('fr-ai-body'), // IQE wizard overlay is lazy-mounted, not present until requested
       canvases:canvases.map(canvas=>{
         let coverage=-1;
         try{
           const ctx=canvas.getContext('2d',{willReadFrequently:true}),w=canvas.width,h=canvas.height;
           if(ctx&&w>0&&h>0){
             const {data}=ctx.getImageData(0,0,w,h);
             for(let i=3;i<data.length;i+=4)if(data[i]>10)coverage++;
           }
         }catch(e){}
         return {w:canvas.width,h:canvas.height,cssW:canvas.clientWidth,cssH:canvas.clientHeight,coverage};
       })
     };
   });
   assert.ok(info.stageClass,mode.name+' stage class missing');
   assert.ok(info.label,mode.name+' original launcher label missing');
   assert.equal(info.canvases.length,2,mode.name+' must render launcher and header');
   assert.ok(info.budgetPreserved,mode.name+' original IQE wizard missing');
   for(const c of info.canvases){assert.ok(c.w>0&&c.h>0,mode.name+' canvas has zero pixels');assert.ok(c.coverage>0,mode.name+' mascot did not paint pixels');}
   await page.screenshot({path:'artifacts/block-iqe-staging/'+mode.name+'.png',fullPage:false});
   const rollback=await page.evaluate(()=>{
     window.FRBlockStage.destroy();
     return {canvasCount:document.querySelectorAll('canvas[data-fr-block-avatar]').length,legacy:window.FRIQEAvatar6?.getState()?.mounted===true,
       assistant:!!document.getElementById('fr-ai-body')};
   });
   assert.equal(rollback.canvasCount,0,mode.name+' destroy left canvas');
   assert.ok(rollback.assistant,mode.name+' destroyed the assistant');
   assert.ok(rollback.legacy,mode.name+' rollback did not restore the legacy visual');
   console.log(mode.name,'PASS',JSON.stringify(info));
   await page.close();
  }
 }finally{await browser.close();server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
