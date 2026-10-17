/* FR Block context tips: supplement ONLY when the original IQE bubble is not visible.
 * No modification of Stage-5 handlers, no cookies, no tracking, no business logic. */
(function(win,doc){
 'use strict';
 if(win.FRBlockBalloons)return;
 var content={
  welcome:{title:"Boas-vindas ao IQE",text:"Olá! Sou Block, o mascote do assistente IQE da Franco Romeu. Toque em mim para conhecer os recursos disponíveis.",react:"hello"},
  sobre:{title:"Conheça a Franco Romeu",text:"Nesta aba você encontra a proposta da marca e suas especialidades em arte e engenharia.",react:"tips"},
  ambientes:{title:"Explore os ambientes",text:"Conheça ambientes, soluções de acabamento e inspirações. Abra o Block se quiser orientação.",react:"tips"},
  projetos:{title:"Projetos 3D",text:"Explore estudos tridimensionais e visualizações antes de escolher uma solução.",react:"thinking"},
  portfolio:{title:"Portfólio FR",text:"Veja os projetos e registros disponíveis no portfólio para conhecer os serviços apresentados.",react:"tips"},
  orcamento:{title:"Monte seu orçamento",text:"Na aba Orçamento, selecione serviços e informe seu projeto para criar uma estimativa.",react:"budget"},
  auto:{title:"Orçamento automático",text:"O IQE ajuda a organizar os serviços em uma proposta preliminar. Revise os itens e valores antes de prosseguir.",react:"budget"},
  search:{title:"Busca do IQE",text:"Use a busca para encontrar serviços ou assuntos apresentados no assistente.",react:"search"},
  tips:{title:"Dicas do IQE",text:"As dicas ajudam a navegar pelos recursos e a conhecer os serviços disponíveis.",react:"tips"},
 };
 function nativeVisible(root){
  var native=root&&root.querySelector('.fr-ai-context-bubble');
  if(!native)return false;
  if(native.classList.contains('is-visible') && native.getAttribute('aria-hidden')!=='true')return true;
  var cs=win.getComputedStyle(native),r=native.getBoundingClientRect();
  return cs.visibility!=='hidden' && cs.display!=='none' && Number(cs.opacity)>.65 && r.width>0 && r.height>0 && native.textContent.trim().length>0;
 }
 function routeFromTarget(node){
  if(!node||!node.closest)return null;
  var el=node.closest('a[href],[data-fr-view],[data-fr-ai-action],#fr-ai-search-head');
  if(!el)return null;
  var action=el.getAttribute('data-fr-ai-action')||el.id||'';
  if(action==='search'||action==='fr-ai-search-head')return 'search';
  if(action==='auto'||action==='budget-auto'||action==='automated'||action==='automatic')return 'auto';
  if(action==='budget'||action==='quote'||action==='orcamento')return 'orcamento';
  if(action==='tips')return 'tips';
  var route=(el.getAttribute('data-fr-view')||el.getAttribute('href')||'').toLowerCase();
  if(route.includes('orcament'))return 'orcamento';
  if(route.includes('ambiente'))return 'ambientes';
  if(route.includes('portfolio'))return 'portfolio';
  if(route.includes('projetos-3d')||route.includes('3d'))return 'projetos';
  if(route.includes('sobre'))return 'sobre';
  return null;
 }
 var instance=null;
 function mount(root,react){
  if(instance)return instance;
  if(!root||!root.querySelector('#fr-ai-launcher'))return null;
  var container=doc.createElement('div');container.className='fr-block-tip';
  container.hidden=true;container.setAttribute('role','status');container.setAttribute('aria-live','polite');
  container.setAttribute('aria-atomic','true');
  var info=doc.createElement('div'),title=doc.createElement('strong'),p=doc.createElement('p'),close=doc.createElement('button');
  close.type='button';close.textContent='×';close.setAttribute('aria-label','Fechar explicação do Block');
  info.append(title,p);container.append(info,close);doc.body.appendChild(container);
  var closed=false,removed=false,last='',lastAt=0,timers=[],listeners=[],observer=null;
  var schedule=function(cb,ms){var id=win.setTimeout(cb,ms);timers.push(id);return id;};
  function hide(){container.hidden=true;container.dataset.frBlockTip='';}
  function show(id,force){
   if(removed||closed)return false;
   var data=content[id];if(!data)return false;
   if(nativeVisible(root))return false;
   if(!force&&root.classList.contains('is-open'))return false;
   var now=Date.now();if(!force&&last===id&&now-lastAt<28000)return false;
   title.textContent=data.title;p.textContent=data.text;container.hidden=false;container.dataset.frBlockTip=id;last=id;lastAt=now;
   if(typeof react==='function')react(data.react||'tips');
   schedule(function(){if(container.dataset.frBlockTip===id)hide();},6000);
   return true;
  }
  function waitIntro(tries){
   if(removed)return;
   if(doc.documentElement.classList.contains('fr-intro-active')||doc.getElementById('fr-cinema-overlay')){
     if(tries<35)schedule(function(){waitIntro(tries+1);},1000);
     return;
   }
   schedule(function(){show('welcome',false);},1250);
  }
  function onClick(event){
   var node=event.target;if(node&&container.contains(node))return;
   var id=routeFromTarget(node);
   if(!id)return;
   schedule(function(){show(id,id==='auto'||id==='search'||id==='orcamento');},600);
  }
  function onRoute(){
   var href=win.location.pathname.toLowerCase();
   var id=href.includes('orcament')?'orcamento':href.includes('ambiente')?'ambientes':
     href.includes('portfolio')?'portfolio':href.includes('3d')?'projetos':href.includes('sobre')?'sobre':null;
   if(id)schedule(function(){show(id,false);},420);
  }
  function onOpen(){
   if(root.classList.contains('is-open'))hide();
  }
  function listen(target,type,fn,options){target.addEventListener(type,fn,options);listeners.push(function(){target.removeEventListener(type,fn,options);});}
  listen(close,'click',function(){hide();closed=true;});
  listen(doc,'click',onClick,{passive:true});
  listen(doc,'pointerdown',function(event){
    if(!container.hidden&&!container.contains(event.target))hide();
  },{passive:true});
  listen(win,'scroll',hide,{passive:true});
  listen(win,'popstate',onRoute);
  listen(win,'hashchange',onRoute);
  listen(win,'fr:intro-complete',function(){schedule(function(){show('welcome',false);},1200);});
  observer=new MutationObserver(function(){if(nativeVisible(root))hide();else onOpen();});
  observer.observe(root,{subtree:true,attributes:true,attributeFilter:['class','aria-hidden','style']});
  waitIntro(0);
  instance={
   explain:function(id){return show(id,true);},
   close:hide,
   destroy:function(){if(removed)return;removed=true;listeners.forEach(fn=>fn());timers.forEach(id=>win.clearTimeout(id));observer.disconnect();container.remove();instance=null;},
   state:function(){return {mounted:!removed,visible:!container.hidden,kind:last,available:Object.keys(content)};}
  };
  return instance;
 }
 win.FRBlockBalloons={mount:mount,version:'1.0.0'};
})(window,document);
