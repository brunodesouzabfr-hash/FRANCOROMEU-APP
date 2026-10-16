/* FR / Phase 7 — navigation behavior only.
 * Keeps native SPA links, search, mobile dialog and IQE events authoritative.
 * All state is additive and can be fully torn down without rewriting markup. */
(function(w,d){
'use strict';
if(w.FRNav7)return;
var nav=d.getElementById('smart-nav'),menu=d.getElementById('fr-site-menu'),
    opener=d.getElementById('fr-site-menu-open'),closeButton=d.getElementById('fr-site-menu-close'),
    brand=d.getElementById('smart-nav-brand');
var mounted=false,raf=0,lastY=0,visible=true,compact=false,active='view-home',
    listeners=[],observers=[],touchTimer=0;
var OVERLAYS=[
 ['#iqe-overlay',['open','active','is-open','visible']],
 ['#amb-detail-overlay',['open','visible','is-open']],
 ['#fr15-p3d-inspector',['is-open','open']],
 ['#fr15-amb-project',['is-open','open']],
 ['#fr16-amb-dossier',['is-open','open']],
 ['#modal-container',['open','active','is-open','visible']],
 ['#fr-ai-root',['is-open']],
 ['#god-mode-panel',['open','is-open','active']]
];
var prev={};
function listen(t,type,fn,opts){if(!t)return;t.addEventListener(type,fn,opts);listeners.push([t,type,fn,opts]);}
function observe(t,opts,fn){if(!t||!w.MutationObserver)return;var obs=new w.MutationObserver(fn);obs.observe(t,opts);observers.push(obs);}
function reduced(){return Boolean(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);}
function scrolling(){return Math.max(0,w.scrollY||w.pageYOffset||0);}
function overlayIsVisible(el,classes){
 if(!el)return false;
 if(el.tagName==='DIALOG'&&el.open)return true;
 if(el.getAttribute('aria-hidden')==='false')return true;
 return classes.some(function(c){return el.classList&&el.classList.contains(c);});
}
function overlaysOpen(){
 if(menu&&menu.open)return true;
 if(d.body&&d.body.classList.contains('fr16-popup-lock'))return true;
 for(var i=0;i<OVERLAYS.length;i++){
  var entry=OVERLAYS[i],element=d.querySelector(entry[0]);
  if(overlayIsVisible(element,entry[1]))return true;
 }
 return false;
}
function isBudget(){
 var page=d.getElementById('view-orcamento');
 return Boolean(page&&page.classList.contains('active'));
}
function activeView(){
 var section=d.querySelector('.view-section.active');
 return section?section.id:active;
}
function routes(){
 active=activeView()||'view-home';
 var anchors=d.querySelectorAll('#smart-nav [data-fr-view],#fr-site-menu a[data-fr-view]');
 Array.prototype.forEach.call(anchors,function(link){
  var isCurrent=link.dataset.frView===active;
  if(isCurrent)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
 });
 nav.dataset.frNav7View=active;
}
function chooseVisible(){
 var y=scrolling();
 var diff=y-lastY;
 var focus=nav.contains(d.activeElement)||(menu&&menu.open);
 var modal=overlaysOpen();
 var hidden=modal;
 if(!modal){
  if(y<140||reduced()||isBudget()||focus){hidden=false;}
  else if(diff>13&&y>195){hidden=true;}
  else if(diff< -9){hidden=false;}
  else hidden=!visible;
 }
 // Ensure initial and restored SPA views have a usable navbar.
 if(nav.dataset.frNav7Force==='show'&&!modal)hidden=false;
 lastY=y;visible=!hidden;compact=y>=75;
 if(nav.classList.contains('fr-nav7-compact')!==compact)nav.classList.toggle('fr-nav7-compact',compact);
 if(nav.classList.contains('fr-nav7-concealed')!==hidden)nav.classList.toggle('fr-nav7-concealed',hidden);
 nav.inert=hidden;
 nav.dataset.frNav7State=modal?'modal':hidden?'concealed':compact?'compact':'expanded';
}
function frame(){raf=0;if(!mounted)return;chooseVisible();}
function request(){if(mounted&&!raf)raf=w.requestAnimationFrame(frame);}
function forceShow(){
 if(!mounted)return;
 nav.dataset.frNav7Force='show';
 visible=true;
 request();
 if(touchTimer)w.clearTimeout(touchTimer);
 touchTimer=w.setTimeout(function(){if(nav)delete nav.dataset.frNav7Force;touchTimer=0;},900);
}
function onRoute(event){
 if(event&&event.detail&&event.detail.viewId)active=event.detail.viewId;
 routes();lastY=scrolling();visible=true;forceShow();
}
function afterInteraction(event){
 if(!mounted)return;
 var target=event.target;
 if(target&&target.closest&&target.closest('#smart-nav,#fr-site-menu,#fr-ai-root,#iqe-overlay,.fr15-p3d-inspector,.fr16-amb-dossier')){
  // The original click/dialog handlers run unmodified; check state on next frame.
  request();
 }
}
function mount(){
 if(mounted)return true;
 if(!nav||!menu||!opener||!closeButton||!brand)return false;
 prev={inert:nav.inert,ariaLabel:opener.getAttribute('aria-label'),style:nav.getAttribute('style')};
 mounted=true;nav.classList.add('fr-nav7-ready');menu.classList.add('fr-nav7-dialog');
 if(d.body)d.body.classList.add('fr-nav7-active');
 nav.dataset.frNav7Version='7.0';
 if(!opener.getAttribute('aria-label'))opener.setAttribute('aria-label','Abrir menu');
 routes();lastY=scrolling();visible=true;
 listen(w,'scroll',request,{passive:true});listen(w,'resize',request,{passive:true});
 listen(w,'pageshow',function(){visible=true;request();});
 listen(d,'frViewChanged',onRoute);
 listen(nav,'focusin',forceShow);
 listen(d,'keydown',function(e){if(e.key==='Escape'||e.key==='Tab')request();});
 listen(d,'click',afterInteraction,true);
 listen(menu,'close',function(){nav.inert=false;visible=true;nav.classList.remove('fr-nav7-concealed');forceShow();},true);
 listen(menu,'cancel',function(){visible=true;forceShow();});
 listen(d,'visibilitychange',request);
 observe(menu,{attributes:true,attributeFilter:['open','class']},request);
 observe(d.body,{attributes:true,attributeFilter:['class']},request);
 OVERLAYS.forEach(function(entry){
  var node=d.querySelector(entry[0]);
  if(node)observe(node,{attributes:true,attributeFilter:['class','aria-hidden','open']},request);
 });
 observe(nav,{attributes:true,attributeFilter:['class']},function(){
  // Another historical engine may change its nav-state class; our geometry is stable.
  if(!nav.classList.contains('fr-nav7-ready'))return;
  request();
 });
 request();return true;
}
function destroy(){
 if(raf){w.cancelAnimationFrame(raf);raf=0;}
 if(touchTimer){w.clearTimeout(touchTimer);touchTimer=0;}
 observers.forEach(function(o){o.disconnect();});observers=[];
 listeners.forEach(function(x){x[0].removeEventListener(x[1],x[2],x[3]);});listeners=[];
 if(nav){
  nav.classList.remove('fr-nav7-ready','fr-nav7-compact','fr-nav7-concealed');
  nav.inert=Boolean(prev.inert);
  delete nav.dataset.frNav7Version;delete nav.dataset.frNav7View;
  delete nav.dataset.frNav7State;delete nav.dataset.frNav7Force;
 }
 if(menu)menu.classList.remove('fr-nav7-dialog');
 if(d.body)d.body.classList.remove('fr-nav7-active');
 if(opener&&prev.ariaLabel===null)opener.removeAttribute('aria-label');
 mounted=false;visible=true;compact=false;raf=0;
}
w.FRNav7={version:'7.0',mount:mount,destroy:destroy,refresh:function(){routes();request();},
 reveal:forceShow,getState:function(){return {mounted:mounted,visible:visible,compact:compact,
  view:active,modal:overlaysOpen(),menuIntact:!!d.getElementById('fr-site-menu'),iqeIntact:!!d.getElementById('fr-ai-root')};}};
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})(window,document);
