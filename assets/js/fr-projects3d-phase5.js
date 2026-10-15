/* Franco Romeu / Projetos 3D, phase 5.
   Progressive enhancement ONLY: retains Stage 15 selection, cube rotation, inspector and budget handlers. */
(function(w,d){
 'use strict';
 if(w.FRProjects3DPhase5)return;
 var view=d.getElementById('view-projetos3d'),lab=null,rail=null,orbit=null,toolbar=null;
 var viewButtons=[],mutation=null,bootstrap=null,flipping=false,active=-1,installed=false;
 var listenerPairs=[],animationEnd=null;
 function reduced(){return Boolean(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);}
 function closest(node,sel){return node&&node.closest?node.closest(sel):null;}
 function el(tag,cls,text){var x=d.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=String(text);return x;}
 function bind(element,type,cb,opts){element.addEventListener(type,cb,opts);listenerPairs.push([element,type,cb,opts]);}
 function legacy(){return w.FR_STAGE15;}
 function getProjects(){var api=legacy();return api&&Array.isArray(api.projects3d)?api.projects3d:null;}
 function selected(){var found=rail&&rail.querySelector('[data-fr15-p3d-index][aria-current="true"]');return found?Number(found.dataset.fr15P3dIndex):0;}
 function focusTile(index){
  var card=viewButtons[index];if(!card||!rail)return;
  var left=card.offsetLeft-rail.offsetLeft-(rail.clientWidth-card.getBoundingClientRect().width)/2;
  if(typeof rail.scrollTo==='function')rail.scrollTo({left:Math.max(0,left),behavior:reduced()?'auto':'smooth'});
 }
 function mark(){
  if(!installed||!rail)return;
  var projects=getProjects();if(!projects)return;
  var current=selected();
  if(!Number.isInteger(current)||current<0||current>=projects.length)return;
  var changed=current!==active;
  active=current;
  var counter=toolbar&&toolbar.querySelector('[data-fr5d-counter]');
  if(counter)counter.textContent=String(current+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');
  var previous=toolbar&&toolbar.querySelector('[data-fr5d-prev]'),next=toolbar&&toolbar.querySelector('[data-fr5d-next]');
  if(previous)previous.disabled=current===0;
  if(next)next.disabled=current===projects.length-1;
  if(changed){
   focusTile(current);
   if(!reduced()&&lab){
    lab.classList.remove('fr5d-flipping');
    // Restart purely CSS-transform transition; no continuous loop added to the old cube engine.
    void lab.offsetWidth;
    lab.classList.add('fr5d-flipping');
   }
  }
 }
 function choose(index){
  var projects=getProjects(),api=legacy();
  if(!projects||!api||typeof api.selectProject3D!=='function')return;
  var idx=Math.min(projects.length-1,Math.max(0,Number(index)));
  if(!Number.isFinite(idx))return;
  api.selectProject3D(idx,true);
  mark();
 }
 function openInspector(){
  var api=legacy();if(api&&typeof api.openProject3D==='function')api.openProject3D(selected());
 }
 function face(index){
  if(!orbit)return;
  var yaw=[28,118,208][index],pitch=[-13,-8,15][index];
  if(!Number.isFinite(yaw))return;
  var cubes=orbit.querySelectorAll('.fr15-p3d-cube');
  if(!cubes.length)return;
  if(w.FR_STAGE16_FLAGS&&w.FR_STAGE16_FLAGS.cubeNarrativeScroll===true){
   orbit.dispatchEvent(new CustomEvent('fr16P3DSnap',{bubbles:false,detail:{yaw:yaw,pitch:pitch,hold:true}}));
  }else{
   // Stage 16 narrative interaction is not active. Set temporary visible face without
   // replacing the original pointer/auto-rotation controller.
   cubes[0].style.setProperty('--ry',yaw+'deg');
   cubes[0].style.setProperty('--rx',pitch+'deg');
  }
  var buttons=lab&&lab.querySelectorAll('[data-fr5d-face]')||[];
  Array.prototype.forEach.call(buttons,function(btn){btn.setAttribute('aria-pressed',String(Number(btn.dataset.fr5dFace)===index));});
 }
 function createToolbar(projects){
  var bar=el('div','fr5d-toolbar');bar.id='fr5d-toolbar';
  var label=el('span','fr5d-toolbar-label','ꟻR / CUBO + ARQUIVO / TRÊS VISTAS');
  var controls=el('div','fr5d-controls');
  var prev=el('button','','← Anterior');prev.type='button';prev.dataset.fr5dPrev='';
  prev.setAttribute('aria-label','Selecionar projeto anterior');
  var counter=el('span','fr5d-progress','01 / '+String(projects.length).padStart(2,'0'));counter.dataset.fr5dCounter='';
  var next=el('button','','Próximo →');next.type='button';next.dataset.fr5dNext='';
  next.setAttribute('aria-label','Selecionar próximo projeto');
  var inspect=el('button','','Abrir inspector ↗');inspect.type='button';inspect.dataset.fr5dInspect='';
  inspect.setAttribute('aria-label','Abrir visualização tridimensional e ângulos do projeto selecionado');
  controls.append(prev,counter,next,inspect);bar.append(label,controls);
  bind(prev,'click',function(){choose(selected()-1);});
  bind(next,'click',function(){choose(selected()+1);});
  bind(inspect,'click',openInspector);
  return bar;
 }
 function createFaces(){
  var faces=el('div','fr5d-face-controls');faces.setAttribute('aria-label','Visualizações do cubo');
  for(var i=0;i<3;i++){
   var button=el('button','',String(i+1).padStart(2,'0'));
   button.dataset.fr5dFace=String(i);button.type='button';
   button.setAttribute('aria-label','Mostrar face '+String(i+1)+' do projeto');
   button.setAttribute('aria-pressed',String(i===0));
   bind(button,'click',(function(index){return function(){face(index);};})(i));
   faces.append(button);
  }
  return faces;
 }
 function mount(){
  if(installed||!view)return false;
  lab=view.querySelector('.fr15-p3d-lab');
  rail=lab&&lab.querySelector('.fr15-p3d-index');
  orbit=lab&&lab.querySelector('#fr15-p3d-orbit');
  var projects=getProjects();
  if(!lab||!rail||!orbit||!projects||projects.length<3)return false;
  viewButtons=Array.prototype.slice.call(rail.querySelectorAll('[data-fr15-p3d-index]'));
  if(viewButtons.length!==projects.length||!orbit.querySelector('.fr15-p3d-cube')||!d.getElementById('fr15-p3d-inspector')){
   return false;
  }
  var workbench=lab.querySelector('.fr15-p3d-workbench');
  if(!workbench)return false;
  toolbar=createToolbar(projects);workbench.before(toolbar);
  var faces=createFaces();lab.querySelector('.fr15-p3d-viewport').append(faces);
  viewButtons.forEach(function(button,i){button.style.setProperty('--fr5d-card-index',String(i%3));});
  lab.classList.add('fr5d-ready');installed=true;
  bind(lab,'animationend',function(e){if(e.animationName==='fr5d-cube-swap')lab.classList.remove('fr5d-flipping');});
  bind(rail,'keydown',function(e){
   if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
    e.preventDefault();choose(selected()+(e.key==='ArrowRight'?1:-1));
    if(viewButtons[selected()])viewButtons[selected()].focus({preventScroll:true});
   }else if(e.key==='Home'||e.key==='End'){
    e.preventDefault();choose(e.key==='Home'?0:projects.length-1);
   }
  });
  mutation=new w.MutationObserver(function(records){
   if(records.some(function(record){return record.attributeName==='aria-current';}))mark();
  });
  viewButtons.forEach(function(button){mutation.observe(button,{attributes:true,attributeFilter:['aria-current']});});
  // Stage 15 may already have selected the first project before our script arrives.
  mark();
  return true;
 }
 function destroy(){
  if(bootstrap){bootstrap.disconnect();bootstrap=null;}
  if(mutation){mutation.disconnect();mutation=null;}
  listenerPairs.forEach(function(row){row[0].removeEventListener(row[1],row[2],row[3]);});listenerPairs=[];
  if(lab)lab.classList.remove('fr5d-ready','fr5d-flipping');
  if(toolbar){toolbar.remove();toolbar=null;}
  if(lab){var controls=lab.querySelector('.fr5d-face-controls');if(controls)controls.remove();}
  viewButtons.forEach(function(button){button.style.removeProperty('--fr5d-card-index');});
  viewButtons=[];installed=false;active=-1;lab=null;rail=null;orbit=null;
 }
 function discover(){
  if(mount())return;
  if(!view||!w.MutationObserver)return;
  if(bootstrap)bootstrap.disconnect();
  bootstrap=new w.MutationObserver(function(){
   if(!installed&&mount()&&bootstrap){bootstrap.disconnect();bootstrap=null;}
  });
  bootstrap.observe(view,{childList:true,subtree:true});
 }
 w.FRProjects3DPhase5={version:'5.0',mount:mount,destroy:destroy,refresh:mark,
  select:choose,inspect:openInspector,face:face,
  getState:function(){return {installed:installed,count:viewButtons.length,selected:active,
    originalCube:!!(view&&view.querySelector('#fr15-p3d-orbit .fr15-p3d-cube')),
    originalInspector:!!d.getElementById('fr15-p3d-inspector')};}};
 if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',discover,{once:true});else discover();
})(window,document);
