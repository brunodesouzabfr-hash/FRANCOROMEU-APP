/* ꟻR / Jornal FR: image-only reveal in the previously static 109-entry archive. */
(function(w,d){
 'use strict';
 if(w.FRJornalMotion4)return;
 var archive=d.getElementById('arquivo'),observer=null,cards=[],mounted=false;
 function reduced(){return !!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);}
 function show(card){card.dataset.frj4Visible='true';}
 function mount(){
  if(mounted||!archive)return false;
  cards=Array.prototype.slice.call(archive.querySelectorAll('.frj-index-card'));
  if(!cards.length)return false;
  // Progressive enhancement: no class = all images always visible.
  if(reduced()||typeof w.IntersectionObserver!=='function')return false;
  observer=new w.IntersectionObserver(function(entries){
   entries.forEach(function(entry){
    if(entry.isIntersecting){show(entry.target);observer.unobserve(entry.target);}
   });
  },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
  cards.forEach(function(card,i){
   // Delay images only, never the whole card; filtering/navigation remains untouched.
   card.style.setProperty('--frj4-delay',String((i%3)*75)+'ms');
   observer.observe(card);
  });
  mounted=true;d.body.classList.add('frj4-motion-ready');
  return true;
 }
 function destroy(){
  if(observer){observer.disconnect();observer=null;}
  if(d.body)d.body.classList.remove('frj4-motion-ready');
  cards.forEach(function(card){card.style.removeProperty('--frj4-delay');delete card.dataset.frj4Visible;});
  cards=[];mounted=false;
 }
 w.FRJornalMotion4={version:'4.0',mount:mount,destroy:destroy,getState:function(){
  return {mounted:mounted,total:cards.length,revealed:cards.filter(function(c){return c.dataset.frj4Visible==='true';}).length,
  existingPatchIntact:!!d.getElementById('frap-journal')};
 }};
 if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',mount,{once:true});
 else mount();
})(window,document);
