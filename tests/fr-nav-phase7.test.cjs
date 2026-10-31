'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const mountBuild=require('../src/fr-nav-phase7.cjs');
const runtime=fs.readFileSync(path.join(__dirname,'../assets/js/fr-nav-phase7.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../assets/css/fr-nav-phase7.css'),'utf8');
const links=[['/sobre','view-sobre','Sobre'],['/ambientes','view-ambientes','Ambientes'],['/projetos-3d','view-projetos3d','Projetos 3D'],['/portfolio','view-projetos','Portfólio'],['/orcamento','view-orcamento','Orçamento']];
function html(){
 const navItems=links.map(([href,id,label])=>'<li><a class="'+(id==='view-orcamento'?'nav-cta':'nav-link')+'" href="'+href+'" data-fr-view="'+id+'"><i class="fas fa-cube"></i><span class="nav-label">'+label+'</span></a></li>').join('');
 const mobile=links.map(([href,id,label])=>'<a href="'+href+'" data-fr-view="'+id+'">'+label+'</a>').join('');
 return '<!doctype html><html><head></head><body><nav id="smart-nav" class="nav-state-header" aria-label="Navegação principal"><a id="smart-nav-brand" href="/" data-fr-view="view-home"><span class="frx-top-logo"><img src="/assets/brand/logo.webp" alt=""></span><span class="frx-brand-copy">Franco Romeu</span></a><ul class="nav-items">'+navItems+'</ul><div class="fr-site-nav-contact"><a data-fr-contact="instagram" href="https://instagram.com/francoromeu.fr">Instagram</a><a data-fr-contact="whatsapp" href="https://wa.me/5511990021603">WhatsApp</a><button type="button" id="fr-site-menu-open" aria-controls="fr-site-menu" aria-expanded="false">Menu</button></div></nav><dialog id="fr-site-menu" aria-label="Navegação mobile"><button type="button" id="fr-site-menu-close">Fechar</button><nav><a href="/" data-fr-view="view-home">Home</a>'+mobile+'<button id="fr-site-menu-search">Buscar</button></nav></dialog><main class="view-section active" id="view-home"></main><main class="view-section" id="view-sobre"></main><main class="view-section" id="view-ambientes"></main><main class="view-section" id="view-projetos3d"></main><main class="view-section" id="view-projetos"></main><main class="view-section" id="view-orcamento"></main><div id="fr-ai-root"></div><div id="iqe-overlay"></div><div id="fr15-p3d-inspector" aria-hidden="true"></div></body></html>';
}
function fixture(){
 const dom=new JSDOM(html(),{runScripts:'outside-only',pretendToBeVisual:true,url:'https://www.francoromeufr.com.br/'});
 const w=dom.window,d=w.document,nav=d.getElementById('smart-nav'),menu=d.getElementById('fr-site-menu'),open=d.getElementById('fr-site-menu-open');
 let y=0,queue=[],closed=0,search=0;
 Object.defineProperty(w,'scrollY',{configurable:true,get:()=>y});
 w.requestAnimationFrame=callback=>{queue.push(callback);return queue.length;};
 w.cancelAnimationFrame=()=>{};
 w.matchMedia=()=>({matches:false});
 menu.showModal=function(){this.open=true;open.setAttribute('aria-expanded','true');};
 menu.close=function(){this.open=false;closed++;open.setAttribute('aria-expanded','false');this.dispatchEvent(new w.Event('close'));};
 open.addEventListener('click',()=>{if(!menu.open)menu.showModal();});
 d.getElementById('fr-site-menu-close').addEventListener('click',()=>menu.close());
 d.getElementById('fr-site-menu-search').addEventListener('click',()=>{search++;if(menu.open)menu.close();});
 const logo=nav.querySelector('img'),originalLinks=Array.from(nav.querySelectorAll('a')).map(x=>x.href);
 const flush=()=>{let n=0;while(queue.length&&n++<10)queue.shift()();};
 return {dom,w,d,nav,menu,open,logo,links:originalLinks,flush,
  scroll:pos=>{y=pos;w.dispatchEvent(new w.Event('scroll'));flush();},
  getClosed:()=>closed,getSearch:()=>search};
}
function boot(f){f.w.eval(runtime);f.d.dispatchEvent(new f.w.Event('DOMContentLoaded'));f.flush();return f.w.FRNav7;}
test('F7.1 build: only additive assets, preserves original logo, SPA, menu, assistant',()=>{
 const f=fixture(),nav=f.nav,menu=f.menu,logo=f.logo;
 assert.deepEqual(mountBuild(f.d),{originalNav:true,originalMenu:true,originalSpaRouter:true,originalIQE:true});
 assert.equal(f.d.querySelector('link[href="/assets/css/fr-nav-phase7.css"]').rel,'stylesheet');
 assert.equal(f.d.querySelector('script[src="/assets/js/fr-nav-phase7.js"]').defer,true);
 assert.equal(f.d.getElementById('smart-nav'),nav);assert.equal(f.d.getElementById('fr-site-menu'),menu);
 assert.equal(f.d.querySelector('#smart-nav img'),logo);
 assert.throws(()=>mountBuild(f.d),/duplicate installation/);f.dom.window.close();
});
test('F7.1: moving downward docks at footer; remains visible and interactive, never disappears',()=>{
 const f=fixture(),api=boot(f);
 assert.equal(api.getState().position,'header');assert.equal(f.nav.inert,false);
 f.scroll(180);
 assert.equal(api.getState().position,'footer');
 assert.equal(f.nav.classList.contains('fr-nav7-docked'),true);
 assert.equal(f.nav.classList.contains('fr-nav7-modal'),false);
 assert.equal(f.nav.inert,false);
 assert.equal(f.nav.dataset.frNav7Position,'footer');
 assert.equal(f.nav.querySelector('img'),f.logo);
 f.scroll(120);assert.equal(api.getState().position,'footer'); // hysteresis
 f.scroll(55);assert.equal(api.getState().position,'header');
 assert.equal(f.nav.classList.contains('fr-nav7-docked'),false);
 assert.deepEqual(Array.from(f.nav.querySelectorAll('a')).map(x=>x.href),f.links);
 api.destroy();f.dom.window.close();
});
test('F7.2: Orçamento remains fixed in the centered header after all scroll and legacy mutations',async()=>{
 const f=fixture(),api=boot(f);
 f.d.querySelector('#view-home').classList.remove('active');
 f.d.querySelector('#view-orcamento').classList.add('active');
 f.d.body.classList.add('fr10-budget-active');
 f.nav.classList.remove('nav-state-header');
 f.nav.classList.add('nav-state-floating');
 f.d.dispatchEvent(new f.w.CustomEvent('frViewChanged',{detail:{viewId:'view-orcamento'}}));
 await Promise.resolve();f.flush();
 assert.equal(api.getState().budgetPinned,true);
 assert.equal(f.nav.dataset.frNav7View,'view-orcamento');
 assert.equal(f.nav.querySelector('a[href="/orcamento"]').getAttribute('aria-current'),'page');
 for(const y of [180,380,1100,220,490]){
  f.scroll(y);
  assert.equal(api.getState().position,'header','Orçamento cannot dock at scrollY='+y);
  assert.equal(f.nav.dataset.frNav7Position,'header');
  assert.equal(f.nav.classList.contains('fr-nav7-docked'),false);
  assert.equal(f.nav.inert,false);
 }
 f.nav.className='nav-state-floating flex items-center justify-center text-fr-text';
 await Promise.resolve();f.flush();
 assert.equal(f.nav.classList.contains('fr-nav7-ready'),true);
 assert.equal(f.nav.dataset.frNav7Version,'7.1');
 assert.equal(f.nav.dataset.frNav7Position,'header');
 assert.equal(f.nav.classList.contains('fr-nav7-docked'),false);
 // All other views keep the animation: leaving budget with scroll > 160 docks.
 f.d.querySelector('#view-orcamento').classList.remove('active');
 f.d.querySelector('#view-sobre').classList.add('active');
 f.d.body.classList.remove('fr10-budget-active');
 f.d.dispatchEvent(new f.w.CustomEvent('frViewChanged',{detail:{viewId:'view-sobre'}}));
 await Promise.resolve();f.flush();
 assert.equal(api.getState().budgetPinned,false);
 assert.equal(api.getState().position,'footer');
 assert.equal(f.nav.dataset.frNav7Position,'footer');
 // Re-enter budget without resetting scroll. It immediately returns to header.
 f.d.querySelector('#view-sobre').classList.remove('active');
 f.d.querySelector('#view-orcamento').classList.add('active');
 f.d.body.classList.add('fr10-budget-active');
 f.d.dispatchEvent(new f.w.CustomEvent('frViewChanged',{detail:{viewId:'view-orcamento'}}));
 assert.equal(api.getState().position,'header');
 assert.equal(f.nav.dataset.frNav7Position,'header');
 api.destroy();f.dom.window.close();
});
test('F7.2: direct loading of budget at deep scroll initializes the navbar at header',()=>{
 const f=fixture();
 f.d.querySelector('#view-home').classList.remove('active');
 f.d.querySelector('#view-orcamento').classList.add('active');
 f.d.body.classList.add('fr10-budget-active');
 f.scroll(510);
 const api=boot(f);
 assert.equal(api.getState().position,'header');
 assert.equal(api.getState().budgetPinned,true);
 assert.equal(f.nav.dataset.frNav7Position,'header');
 api.destroy();f.dom.window.close();
});
test('F7.1: native mobile menu/search unaffected and restores keyboard operability on close',async()=>{
 const f=fixture(),api=boot(f);f.scroll(270);
 f.open.click();await Promise.resolve();f.flush();
 assert.equal(f.menu.open,true);
 assert.equal(f.nav.dataset.frNav7State,'modal');
 assert.equal(f.nav.inert,true);
 assert.equal(f.open.getAttribute('aria-expanded'),'true');
 f.d.querySelector('#fr-site-menu-search').click();
 assert.equal(f.nav.inert,false); // capture close runs before original focus listener
 await Promise.resolve();f.flush();
 assert.equal(f.menu.open,false);
 assert.equal(f.getSearch(),1);assert.equal(f.getClosed(),1);
 assert.equal(f.open.getAttribute('aria-expanded'),'false');
 assert.equal(api.getState().position,'footer');
 assert.equal(f.nav.inert,false);
 api.destroy();f.dom.window.close();
});
test('F7.1: IQE, budget wizard and project inspector win over the dock, no state modification',async()=>{
 const f=fixture(),api=boot(f),iqe=f.d.getElementById('fr-ai-root');
 f.scroll(360);iqe.classList.add('is-open');
 await Promise.resolve();f.flush();
 assert.equal(f.nav.dataset.frNav7State,'modal');
 assert.equal(f.nav.inert,true);assert.equal(iqe.classList.contains('is-open'),true);
 iqe.classList.remove('is-open');
 const inspector=f.d.getElementById('fr15-p3d-inspector');
 inspector.classList.add('is-open');await Promise.resolve();f.flush();
 assert.equal(f.nav.inert,true);
 inspector.classList.remove('is-open');await Promise.resolve();f.flush();
 assert.equal(f.nav.inert,false);
 assert.equal(api.getState().position,'footer');
 api.destroy();f.dom.window.close();
});
test('F7.1: route changes keep existing SPA active link and native dialog navigation',()=>{
 const f=fixture(),api=boot(f);
 f.d.querySelector('#view-home').classList.remove('active');
 f.d.querySelector('#view-ambientes').classList.add('active');
 f.d.dispatchEvent(new f.w.CustomEvent('frViewChanged',{detail:{viewId:'view-ambientes'}}));f.flush();
 assert.equal(f.nav.querySelector('a[href="/ambientes"]').getAttribute('aria-current'),'page');
 assert.equal(f.d.querySelector('#fr-site-menu a[href="/ambientes"]').getAttribute('aria-current'),'page');
 assert.equal(f.nav.querySelector('a[href="/sobre"]').hasAttribute('aria-current'),false);
 api.destroy();f.dom.window.close();
});
test('F7.1: destroy restores old navbar and all original links without duplication',()=>{
 const f=fixture(),api=boot(f);f.scroll(300);
 api.destroy();
 assert.equal(api.getState().mounted,false);
 assert.equal(f.nav.inert,false);
 assert.equal(f.nav.classList.contains('fr-nav7-ready'),false);
 assert.equal(f.nav.classList.contains('fr-nav7-docked'),false);
 assert.equal(f.d.querySelectorAll('#smart-nav').length,1);
 assert.equal(f.nav.querySelector('img'),f.logo);
 assert.equal(api.mount(),true);assert.equal(api.getState().position,'footer');
 api.destroy();f.dom.window.close();
});
test('mobile nav: five labelled icons fit without a horizontal rail, including at 320px',()=>{
 const mobile=css.slice(css.indexOf('/* Mobile navigation:'));
 assert.match(mobile,/@media\(max-width:750px\)/);
 assert.match(mobile,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)!important/);
 assert.match(mobile,/overflow-x:hidden!important;overflow-y:hidden!important/);
 assert.doesNotMatch(mobile,/overflow-x:auto!important|scroll-snap-type:x proximity|66px!important/);
 assert.match(mobile,/--fr-nav7-h:60px/);
 assert.match(mobile,/height:48px!important;min-height:48px!important/);
 assert.match(mobile,/\.nav-items>li#fr-global-search-item\{display:none!important/);
 assert.match(mobile,/\.fr-site-nav-contact\{display:none!important/);
 assert.match(mobile,/flex-direction:column!important/);
 assert.match(mobile,/\.nav-label,[\s\S]*?position:static!important/);
 assert.match(mobile,/white-space:nowrap!important/);
 assert.match(mobile,/data-fr-nav7-state="immersive"/);
 assert.equal((html().match(/class="nav-label"/g)||[]).length,5);
 for(const viewport of [320,360,390,430]){
  // Viewport - outer margin - border - horizontal padding - brand gap
  // - 44px Home area - four 1px grid gaps, divided by five routes.
  const cell=(viewport-16-2-16-4-44-4)/5;
  assert.ok(cell>=44,'Navigation touch target too small at '+viewport+'px: '+cell);
 }
});
test('F7.3: mobile split immersion makes the nav invisible and inert; it restores after exit or entering budget',()=>{
 const f=fixture();
 f.w.matchMedia=query=>({matches:query==='(max-width: 750px)'});
 const sec=f.d.createElement('section');sec.id='frms-home';sec.className='frms-section';
 f.d.getElementById('view-home').appendChild(sec);
 let rect={top:-20,bottom:2000,height:2020};
 sec.getBoundingClientRect=()=>rect;
 const api=boot(f);
 f.scroll(250);
 assert.equal(api.getState().immersive,true);
 assert.equal(f.nav.dataset.frNav7State,'immersive');
 assert.equal(f.nav.inert,true,'immersive nav cannot retain focus');
 rect={top:-1800,bottom:200,height:2000};
 f.scroll(1700);
 assert.equal(api.getState().immersive,false);
 assert.equal(f.nav.inert,false);
 assert.equal(f.nav.dataset.frNav7State,'footer');
 rect={top:0,bottom:3000,height:3000};
 f.d.getElementById('view-home').classList.remove('active');
 f.d.getElementById('view-orcamento').classList.add('active');
 f.d.dispatchEvent(new f.w.CustomEvent('frViewChanged',{detail:{viewId:'view-orcamento'}}));
 assert.equal(api.getState().immersive,false);
 assert.equal(api.getState().budgetPinned,true);
 assert.equal(f.nav.dataset.frNav7State,'header');
 assert.equal(f.nav.inert,false);
 api.destroy();f.dom.window.close();
});
test('F7.1: CSS enforces single centered, round, mobile-safe budget geometry and real vertical morph',()=>{
 assert.match(css,/border-radius:999px!important/);
 assert.match(css,/left:50vw!important;right:auto!important/);
 assert.match(css,/transform:translate3d\(-50%,0,0\)!important/);
 assert.match(css,/body\.fr10-budget-active #smart-nav\[data-fr-nav7-version/);
 assert.match(css,/data-fr-nav7-position="footer"/);
 assert.doesNotMatch(css,/#smart-nav\.fr-nav7-ready/);
 assert.match(css,/100dvh - var\(--fr-nav7-h\)/);
 assert.match(css,/transition:top \.82s/);
 assert.doesNotMatch(css,/:is\(\.nav-state-header,\.nav-state-floating,\.nav-state-hidden\)/);
 assert.match(css,/@media\(max-width:1100px\)/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/min-width:44px/);
 assert.doesNotMatch(runtime,/addEventListener\(['"](?:wheel|touchmove)/);
 assert.doesNotMatch(runtime,/\.showModal\(/);
 assert.doesNotMatch(runtime,/fr-nav7-concealed/);
});
test('F7 glass: transparent navbar and selected circular lens preserve mobile geometry',()=>{
 const glass=css.slice(css.indexOf('/* FR optical liquid glass'));
 assert.match(glass,/backdrop-filter:blur\(20px\) saturate\(1\.65\)/);
 assert.match(glass,/--fr-glass-lens-size:36px/);
 assert.match(glass,/--fr-glass-lens-size:34px/);
 assert.match(glass,/\[aria-current="page"\]/);
 assert.match(glass,/border-radius:50%!important;aspect-ratio:1!important/);
 assert.match(glass,/@media\(max-width:750px\)/);
 assert.match(glass,/white-space:nowrap!important/);
 assert.match(glass,/@media\(forced-colors:active\)/);
 assert.match(glass,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(glass,/grid-template-columns|overflow-x:auto|pointer-events:auto|addEventListener/);
 // The previous mobile rail fix remains byte-for-byte above the new skin.
 assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)!important/);
});
