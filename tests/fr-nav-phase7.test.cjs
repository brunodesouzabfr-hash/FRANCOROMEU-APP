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
test('F7.1: Orçamento cannot force navbar left/right full screen or prevent bottom dock',async()=>{
 const f=fixture(),api=boot(f);
 f.d.querySelector('#view-home').classList.remove('active');
 f.d.querySelector('#view-orcamento').classList.add('active');
 f.d.body.classList.add('fr10-budget-active');
 f.nav.classList.remove('nav-state-header');
 f.nav.classList.add('nav-state-floating');
 f.d.dispatchEvent(new f.w.CustomEvent('frViewChanged',{detail:{viewId:'view-orcamento'}}));
 await Promise.resolve();f.flush();
 assert.equal(f.nav.dataset.frNav7View,'view-orcamento');
 assert.equal(f.nav.querySelector('a[href="/orcamento"]').getAttribute('aria-current'),'page');
 f.scroll(380);assert.equal(api.getState().position,'footer');
 assert.equal(f.nav.inert,false);assert.equal(f.nav.classList.contains('fr-nav7-docked'),true);
 f.nav.classList.remove('nav-state-floating');f.nav.classList.add('nav-state-header');
 await Promise.resolve();f.flush();
 assert.equal(f.nav.classList.contains('fr-nav7-docked'),true);
 // Legacy engines may remove ALL nav-state classes during scroll; geometry
 // must still be styled by fr-nav7-ready and docked state alone.
 f.nav.classList.remove('nav-state-header','nav-state-floating','nav-state-hidden');
 await Promise.resolve();f.flush();
 assert.equal(f.nav.classList.contains('fr-nav7-docked'),true);
 f.scroll(0);assert.equal(api.getState().position,'header');
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
test('F7.1: CSS enforces single centered, round, mobile-safe budget geometry and real vertical morph',()=>{
 assert.match(css,/border-radius:999px!important/);
 assert.match(css,/left:50vw!important;right:auto!important/);
 assert.match(css,/transform:translate3d\(-50%,0,0\)!important/);
 assert.match(css,/body\.fr10-budget-active #smart-nav\.fr-nav7-ready/);
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
