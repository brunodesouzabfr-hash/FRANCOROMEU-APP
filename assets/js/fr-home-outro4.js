/* ꟻR / Phase 4: native-scroll horizontal outro, no wheel/touch capture. */
(function(w,d){
 'use strict';
 if(w.FRHomeOutro4)return;
 var root=d.getElementById('froutro4'),rail=root&&root.querySelector('.froutro4-rail');
 var progress=root&&root.querySelector('.froutro4-progress span');
 var skip=root&&root.querySelector('[data-froutro4-skip]');
 var footer=d.querySelector('#view-home .fr6-footer'),view=d.getElementById('view-home');
 var raf=0,mounted=false,clickFn=null;
 function reduced(){return !!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);}
 function compact(){return !!(w.matchMedia&&w.matchMedia('(max-width: 800px)').matches);}
 function clamp(v){return Math.min(1,Math.max(0,v));}
 function update(){
  raf=0;if(!mounted||!root||!rail||reduced()||compact())return;
  if(view&&view.classList&&!view.classList.contains('active'))return;
  var rect=root.getBoundingClientRect(),travel=Math.max(1,rect.height-w.innerHeight);
  var p=clamp(-rect.top/travel);
  rail.style.transform='translate3d('+(-75*p).toFixed(3)+'%,0,0)';
  if(progress)progress.style.width=(p*100).toFixed(2)+'%';
  root.dataset.froutro4Progress=String(Math.round(100*p));
 }
 function schedule(){if(mounted&&!raf&&!reduced()&&!compact())raf=w.requestAnimationFrame(update);}
 function mount(){
  if(mounted||!root||!rail||!footer)return false;
  if(root.querySelectorAll('.froutro4-panel').length!==4)return false;
  root.hidden=false;
  mounted=true;
  w.addEventListener('scroll',schedule,{passive:true});
  w.addEventListener('resize',schedule,{passive:true});
  w.addEventListener('pageshow',schedule,{passive:true});
  if(skip){
   clickFn=function(){footer.scrollIntoView({block:'start',behavior:reduced()?'auto':'smooth'});};
   skip.addEventListener('click',clickFn);
  }
  schedule();return true;
 }
 function destroy(){
  if(raf){w.cancelAnimationFrame(raf);raf=0;}
  w.removeEventListener('scroll',schedule);w.removeEventListener('resize',schedule);
  w.removeEventListener('pageshow',schedule);
  if(skip&&clickFn){skip.removeEventListener('click',clickFn);clickFn=null;}
  mounted=false;
  if(root)root.hidden=true;
  if(rail)rail.style.transform='';
  if(progress)progress.style.width='';
 }
 w.FRHomeOutro4={version:'4.0',mount:mount,destroy:destroy,refresh:schedule,
  getState:function(){return {mounted:mounted,panels:root?root.querySelectorAll('.froutro4-panel').length:0,footerPreserved:!!footer};}};
 if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',mount,{once:true});
 else mount();
})(window,document);
