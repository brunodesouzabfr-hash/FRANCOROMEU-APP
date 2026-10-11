import { chromium } from '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const output=process.argv[2]||'/tmp/fr-site-performance.json';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const report={kind:'instrumented-lab-not-CrUX-not-INP',capturedAt:new Date().toISOString(),conditions:{viewport:'390x844',cpuThrottle:4,networkThrottle:'none; external CDNs variable',cache:'disabled per browser context',analytics:'blocked'},runs:[]};
report.buildSha256=crypto.createHash('sha256').update(await fs.readFile('dist/index.html')).digest('hex');
report.buildFingerprint=JSON.parse(await fs.readFile('dist/build-report.json','utf8')).publicFingerprint;
report.conditions.clsMethod='maximum session window; gap <1s, duration <5s; observed loading period only';
try{
  for(const [name,base]of [['baseline','http://127.0.0.1:4182'],['candidate','http://127.0.0.1:4181']]){
    for(let run=1;run<=3;run++){
      const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
      await page.route(/clarity\.ms|googletagmanager\.com|google-analytics\.com/,r=>r.abort());
      const client=await context.newCDPSession(page);await client.send('Network.enable');await client.send('Network.setCacheDisabled',{cacheDisabled:true});await client.send('Emulation.setCPUThrottlingRate',{rate:4});
      await page.addInitScript(()=>{
        window.__lab={lcp:null,lcpElement:null,cls:0,shifts:[],longTasks:0,longTaskMs:0};
        new PerformanceObserver(list=>{for(const e of list.getEntries()){window.__lab.lcp=e.startTime;window.__lab.lcpElement=e.element?.className||e.element?.tagName}}).observe({type:'largest-contentful-paint',buffered:true});
        let sessionStart=null,lastShift=0,sessionValue=0;
        new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){
          if(sessionStart!==null&&e.startTime-lastShift<1000&&e.startTime-sessionStart<5000)sessionValue+=e.value;
          else{sessionStart=e.startTime;sessionValue=e.value}lastShift=e.startTime;
          window.__lab.cls=Math.max(window.__lab.cls,sessionValue);
          window.__lab.shifts.push({time:e.startTime,value:e.value,elements:e.sources.map(s=>s.node?.id||s.node?.className||s.node?.tagName)})
        }}).observe({type:'layout-shift',buffered:true});
        new PerformanceObserver(list=>{for(const e of list.getEntries()){window.__lab.longTasks++;window.__lab.longTaskMs+=e.duration}}).observe({type:'longtask',buffered:true});
      });
      await page.goto(base,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(8000);
      const value=await page.evaluate(()=>({...window.__lab,domContentLoaded:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,initialThree:performance.getEntriesByType('resource').filter(r=>/three[^/]*\.js|three\.js/i.test(r.name)).map(r=>r.name),iframes:document.querySelectorAll('iframe').length,hero:document.querySelector('.fr6-hero-media img')?.currentSrc,resources:performance.getEntriesByType('resource').filter(r=>new URL(r.name).origin===location.origin).map(r=>({path:new URL(r.name).pathname,bytes:r.transferSize}))}));
      report.runs.push({name,run,...value});console.log(name+' #'+run+': '+JSON.stringify({lcp:value.lcp,cls:value.cls,longTaskMs:value.longTaskMs,initialThree:value.initialThree.length}));await context.close();
    }
  }
  report.medians={};
  for(const name of ['baseline','candidate']){const rows=report.runs.filter(r=>r.name===name),median=key=>rows.map(r=>r[key]).sort((a,b)=>a-b)[1];report.medians[name]={lcp:median('lcp'),cls:median('cls'),longTaskMs:median('longTaskMs'),domContentLoaded:median('domContentLoaded')}}
}finally{await browser.close();await fs.writeFile(output,JSON.stringify(report,null,2))}
