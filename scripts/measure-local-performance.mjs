import {chromium} from '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright/index.mjs';

const url=process.argv[2]||'http://127.0.0.1:4183/';
const runs=Number(process.argv[3]||3);
if(!/^http:\/\/127\.0\.0\.1:\d+\/$/.test(url)||!Number.isInteger(runs)||runs<1||runs>10)throw Error('Use a loopback preview root and 1–10 runs');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const samples=[];
try{
 for(let i=0;i<runs;i++){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.route(/clarity\.ms|googletagmanager\.com|google-analytics\.com/,route=>route.abort());
  const cdp=await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.addInitScript(()=>{
   window.__frPerf={lcp:null,cls:0,longTasks:0};
   new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__frPerf.lcp={time:entry.startTime,size:entry.size,element:entry.element?.tagName||null,url:entry.url||null};}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__frPerf.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});
   new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__frPerf.longTasks+=entry.duration;}).observe({type:'longtask',buffered:true});
  });
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(8000);
  const result=await page.evaluate(()=>({
   ...window.__frPerf,
   loaded:performance.getEntriesByType('resource').filter(x=>x.name.startsWith(location.origin)).length,
   bytes:performance.getEntriesByType('resource').filter(x=>x.name.startsWith(location.origin)).reduce((sum,x)=>sum+(x.transferSize||0),0),
   nav:performance.getEntriesByType('navigation')[0]?.responseEnd||null,
   hero:document.getElementById('hero-title')?.textContent?.trim()||null
  }));
  samples.push(result);
  await context.close();
 }
}finally{await browser.close();}
const times=samples.map(x=>x.lcp?.time).filter(Number.isFinite).sort((a,b)=>a-b);
console.log(JSON.stringify({kind:'synthetic-local-lab',profile:{viewport:'390x844',cpuSlowdown:4,latencyMs:150,downloadBytesPerSecond:200000,coldCache:true,externalAnalyticsBlocked:true},url,samples,medianLcpMs:times.length?times[Math.floor(times.length/2)]:null},null,2));
