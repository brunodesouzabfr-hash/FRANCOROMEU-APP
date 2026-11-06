/* FR evidence scenes: scroll/drag ownership, ordered states and numbered image explanations. */
(function(w,d){
  'use strict';
  if(w.FREvidenceScenes)return;
  var instances=new Map(),feeds=new Map(),visible=new Set(),styleNotes=new Map(),listeners=[],observer=null,intersection=null,frame=0,serial=0,destroyed=false;
  var query=w.matchMedia?w.matchMedia('(prefers-reduced-motion: reduce)'):null;
  var reduced=function(){return !!(query&&query.matches);};
  var imageId=function(img){return img&&(img.dataset.frMediaId||img.dataset.fresMediaId);};
  function identifyStyleImage(img){
    if(imageId(img)||!img.closest('#view-ambientes,#amb-detail-overlay,#fr15-amb-project,#fr16-amb-dossier')||!Array.isArray(w.AMB_STYLES))return;
    var source=String(img.getAttribute('src')||'').split('?')[0].replace(/^\//,'');
    var style=w.AMB_STYLES.find(function(s){return String(s.img||'').replace(/^\//,'')===source;});if(!style)return;
    var id='FR-STYLE-'+style.id;
    if(!styleNotes.has(id))styleNotes.set(id,{title:style.name,label:'Composição de referência · '+style.name,pins:[{title:style.name+' · materiais e linguagem',copy:style.desc||style.essence},...((style.services||[]).length?[{title:'Serviços relacionados à composição',copy:style.services.map(function(s){return s.role;}).filter(Boolean).join(' · ')}]:[])]});
    img.dataset.fresMediaId=id;
  }
  var clamp=function(n,min,max){return Math.max(min,Math.min(max,n));};
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  function bind(el,type,handler,options){el.addEventListener(type,handler,options);listeners.push(function(){el.removeEventListener(type,handler,options);});}
  function track(type,root,media){d.dispatchEvent(new w.CustomEvent('frEvidenceInteraction',{detail:{type:type,scene:root&&(root.dataset.fresScene||root.dataset.fresFeed)||'',media_id:media||''}}));}
  function active(root){var view=root.closest('.view-section'),dialog=root.closest('dialog');return root.isConnected&&(!view||view.classList.contains('active'))&&(!dialog||dialog.open)&&!root.closest('[hidden],[inert]');}
  function setImage(img,m){
    img.src='/'+m.canonicalFile;img.alt=m.alt;img.dataset.frMediaId=m.media_id;delete img.dataset.fresAnnotated;
    var v=m.variants.find(function(v){return v.canonical;})||m.variants[m.variants.length-1];img.width=v.width;img.height=v.height;
    img.removeAttribute('srcset');img.removeAttribute('sizes');img.loading='eager';
  }
  function mountScene(root){
    if(instances.has(root))return instances.get(root);
    var range=root.querySelector('.fres-range'),layers=Array.from(root.querySelectorAll('[data-fres-layer]'));
    if(!range||!layers.length)return null;
    var labels=JSON.parse(root.dataset.fresLabels||'[]'),mode=root.dataset.fresMode,status=root.querySelector('[data-fres-status]'),line=root.querySelector('.fres-line');
    var manual=false,value=Number(range.value)||0,trigger=null,local=[];
    function on(el,type,fn,opts){el.addEventListener(type,fn,opts);local.push(function(){el.removeEventListener(type,fn,opts);});}
    function draw(next){
      value=clamp(Number(next)||0,0,1000);var p=value/1000,t=p*(layers.length-1),lower=Math.min(Math.floor(t),Math.max(0,layers.length-2)),mix=t-lower;
      range.value=String(Math.round(value));
      if(mode==='wipe'&&layers.length===2){layers[0].style.opacity='1';layers[1].style.opacity='1';layers[1].style.clipPath='inset(0 0 0 '+(p*100)+'%)';}
      // Same sequential curtains as imersivesite: each next layer reveals from the left.
      // For three layers: drawing=min(1,p*2), result=max(0,p*2-1).
      else if(mode==='sequence')layers.forEach(function(layer,i){layer.style.opacity='1';layer.style.zIndex=String(i);layer.style.clipPath='inset(0 '+(i?100-clamp(t-(i-1),0,1)*100:0)+'% 0 0)';});
      else layers.forEach(function(layer,i){layer.style.opacity=i===lower&&mix<1?'1':i===lower+1?String(mix):'0';layer.style.zIndex=String(i);});
      if(line)line.style.left=(p*100)+'%';
      labels=JSON.parse(root.dataset.fresLabels||'[]');
      var index=Math.round(t),label=labels[index]||'';
      range.setAttribute('aria-valuetext',mode==='wipe'?Math.round(p*100)+'% antes; '+Math.round(100-p*100)+'% depois':label);
      if(status)status.textContent=mode==='wipe'?(manual?'Comparação manual':'Arraste para comparar'):label;
      root.querySelectorAll('[data-fres-set]').forEach(function(button,i){button.setAttribute('aria-pressed',String(i===index));});
      root.dataset.fresState=String(index);root.dataset.fresValue=String(value);
      // Annotations describe the visible state only. No future material is placed on the before image.
      root.querySelectorAll('.fres-annotation').forEach(function(panel){var source=panel.dataset.fresMedia;var shown=mode==='wipe'?(p<.5?1:0):index;var img=layers[shown].querySelector('img');panel.hidden=!img||imageId(img)!==source||(mode==='sequence'&&Math.abs(t-index)>.01);});
    }
    function own(){manual=true;root.dataset.fresManual='true';var b=root.querySelector('[data-fres-resume]');if(b)b.setAttribute('aria-pressed','true');}
    function nativeProgress(){var target=root.closest('[data-fres-story]')||root,rect=target.getBoundingClientRect(),vh=w.innerHeight||800;return target.hasAttribute('data-fres-story')?clamp((88-rect.top)/Math.max(1,rect.height-vh+88),0,1):clamp((vh*.8-rect.top)/Math.max(1,rect.height+vh*.5),0,1);}
    function auto(progress){if(!manual&&!reduced()&&active(root))draw(mode==='wipe'?900-progress*800:progress*1000);}
    function motion(){
      if(trigger){trigger.kill();trigger=null;}
      if(reduced()||!active(root)||root.closest('dialog'))return;
      if(w.ScrollTrigger&&root.getBoundingClientRect().height>0){
        var story=root.closest('[data-fres-story]');
        trigger=w.ScrollTrigger.create({trigger:story||root,start:story?'top 88px':'top 80%',end:story?'bottom bottom':'bottom 30%',scrub:true,invalidateOnRefresh:true,onUpdate:function(self){auto(self.progress);}});
      }
    }
    on(range,'input',function(){own();draw(range.value);track('scene_scrub',root);});
    root.querySelectorAll('[data-fres-set]').forEach(function(button){on(button,'click',function(){own();draw(button.dataset.fresSet);track('scene_state',root);});});
    var resume=root.querySelector('[data-fres-resume]');
    if(resume)on(resume,'click',function(){manual=false;delete root.dataset.fresManual;resume.setAttribute('aria-pressed','false');if(!reduced())auto(trigger?trigger.progress:nativeProgress());track('scene_resume',root);});
    layers.forEach(function(layer){var img=layer.querySelector('img');if(img)on(img,'error',function(){layer.dataset.fresBroken='true';if(status)status.textContent='Esta vista está indisponível. Selecione outra etapa.';});});
    draw(value);
    var api={root:root,draw:draw,own:own,motion:motion,tick:function(){if(!trigger)auto(nativeProgress());},state:function(){return {id:root.dataset.fresScene,value:value,manual:manual,layers:layers.length,active:active(root)};},destroy:function(){if(trigger)trigger.kill();local.forEach(function(fn){fn();});instances.delete(root);visible.delete(root);}};
    instances.set(root,api);if(intersection)intersection.observe(root);else visible.add(root);motion();return api;
  }
  function mountFeed(root){
    if(feeds.has(root))return;
    var rail=root.querySelector('.fres-feed-track'),slides=Array.from(root.querySelectorAll('.fres-feed-slide'));
    if(!rail||!slides.length)return;
    var index=0,requested=null,timer=0,raf=0,local=[],counter=root.querySelector('[data-fres-feed-count]');
    var prev=root.querySelector('[data-fres-feed-prev]'),next=root.querySelector('[data-fres-feed-next]'),dots=Array.from(root.querySelectorAll('[data-fres-feed-set]'));
    var fit=root.querySelector('[data-fres-fit]');
    function on(el,type,fn,opts){el.addEventListener(type,fn,opts);local.push(function(){el.removeEventListener(type,fn,opts);});}
    function position(i){return slides[i].offsetLeft-slides[0].offsetLeft;}
    function nearest(){var distance=Infinity,found=0;slides.forEach(function(slide,i){var delta=Math.abs(position(i)-rail.scrollLeft);if(delta<distance){distance=delta;found=i;}});return found;}
    function sync(i){
      index=clamp(i,0,slides.length-1);var changed=root.dataset.fresFeedIndex!==String(index);
      root.dataset.fresFeedIndex=String(index);
      slides.forEach(function(slide,j){slide.inert=j!==index;slide.toggleAttribute('inert',j!==index);slide.setAttribute('aria-hidden',String(j!==index));});
      if(prev)prev.disabled=index===0;if(next)next.disabled=index===slides.length-1;
      dots.forEach(function(dot,j){dot.setAttribute('aria-pressed',String(j===index));});
      if(counter)counter.textContent=(index+1)+' / '+slides.length;
      if(changed)refresh();
    }
    function go(i){
      var target=clamp(i,0,slides.length-1);requested=target;sync(target);w.clearTimeout(timer);
      if(rail.scrollTo)rail.scrollTo({left:position(target),behavior:reduced()?'instant':'smooth'});else rail.scrollLeft=position(target);
      timer=w.setTimeout(function(){requested=null;sync(nearest());},700);
      track('feed_slide',root);
    }
    if(prev)on(prev,'click',function(){go(index-1);});if(next)on(next,'click',function(){go(index+1);});
    if(fit)on(fit,'click',function(){var whole=root.dataset.fresFit!=='contain';if(whole)root.dataset.fresFit='contain';else delete root.dataset.fresFit;fit.setAttribute('aria-pressed',String(whole));fit.setAttribute('aria-label',whole?'Preencher tela':'Ver imagem inteira');fit.textContent=whole?'Preencher tela':'Imagem inteira';track('feed_fit',root);});
    dots.forEach(function(dot,i){on(dot,'click',function(){go(i);});});
    on(rail,'keydown',function(e){if(e.target!==rail)return;var target=e.key==='ArrowRight'?index+1:e.key==='ArrowLeft'?index-1:e.key==='Home'?0:e.key==='End'?slides.length-1:null;if(target!==null){e.preventDefault();e.stopPropagation();go(target);}});
    function release(){requested=null;w.clearTimeout(timer);}
    on(rail,'pointerdown',release,{passive:true});on(rail,'wheel',release,{passive:true});
    on(rail,'scroll',function(){if(raf)return;raf=w.requestAnimationFrame(function(){raf=0;if(requested!==null&&Math.abs(rail.scrollLeft-position(requested))>1)return;requested=null;sync(nearest());});},{passive:true});
    on(w,'resize',function(){release();if(rail.scrollTo)rail.scrollTo({left:position(index),behavior:'instant'});else rail.scrollLeft=position(index);});
    feeds.set(root,{destroy:function(){local.forEach(function(fn){fn();});w.clearTimeout(timer);w.cancelAnimationFrame(raf);feeds.delete(root);}});sync(0);
  }
  function annotate(img){
    if(img.dataset.fresAnnotated||!imageId(img))return;
    if(img.closest('.fres-view-buttons,.frpm-dossier-thumbs,.fr15-p3d-index,.frms-side,.fr6-hero,.froutro4'))return;
    var record=(w.FR_EVIDENCE_LIBRARY&&w.FR_EVIDENCE_LIBRARY.annotations[imageId(img)])||styleNotes.get(imageId(img));if(!record||!record.pins.length)return;
    img.dataset.fresAnnotated='true';
    var interactive=img.closest('a,button'),host;
    if(img.closest('.fres-layer'))host=img.closest('.fres-viewport');
    else if(interactive){host=interactive.parentElement;if(!host||host.tagName==='BODY')return;}
    else if(img.parentElement.classList.contains('fa-image'))host=img.parentElement;
    else {host=d.createElement('span');img.before(host);host.appendChild(img);host.style.display='block';}
    // A spatial overlay is permitted only for manually inspected coordinates, never from a filename guess.
    var spatial=!interactive&&!img.closest('[data-fres-mode=wipe]')&&record.pins.every(function(pin){return Number.isFinite(pin.x)&&Number.isFinite(pin.y);});
    host.classList.add('fres-annotated');
    if(w.getComputedStyle(host).position==='static'||!w.getComputedStyle(host).position)host.style.position='relative';
    if(Array.from(host.children).some(function(node){return node.classList.contains('fres-annotation')&&node.dataset.fresMedia===imageId(img);}))return;
    var overlay=d.createElement('div');overlay.className='fres-annotation'+(spatial?' fres-spatial':'');overlay.dataset.fresMedia=imageId(img);
    var panelId='fres-annotation-'+(++serial),pins=d.createElement('div');pins.className='fres-annotation-pins';
    var panel=d.createElement('div');panel.className='fres-annotation-panel';panel.id=panelId;panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','Detalhe da imagem');
    var title=d.createElement('h4'),copy=d.createElement('p'),label=d.createElement('small'),close=d.createElement('button');close.type='button';close.textContent='×';close.dataset.fresClose='';close.setAttribute('aria-label','Fechar detalhe da imagem');panel.append(close,title,copy,label);
    var selected=null;
    function hide(){panel.hidden=true;if(selected)selected.setAttribute('aria-expanded','false');}
    record.pins.forEach(function(pin,i){var button=d.createElement('button');button.type='button';button.className='fres-pin';button.textContent=String(i+1).padStart(2,'0');button.setAttribute('aria-label','Detalhe '+(i+1)+': '+pin.title);button.setAttribute('aria-controls',panelId);button.setAttribute('aria-expanded','false');if(spatial){button.style.setProperty('--fres-x',pin.x+'%');button.style.setProperty('--fres-y',pin.y+'%');}
      button.addEventListener('click',function(event){event.preventDefault();event.stopPropagation();var same=selected===button&&!panel.hidden;hide();if(same)return;var scene=img.closest('[data-fres-scene]'),api=scene&&instances.get(scene);if(api)api.own();selected=button;title.textContent=String(i+1).padStart(2,'0')+' / '+pin.title;copy.textContent=pin.copy;label.textContent=record.label;panel.hidden=false;button.setAttribute('aria-expanded','true');track('image_hotspot',null,imageId(img));});pins.appendChild(button);});
    close.addEventListener('click',function(){hide();if(selected)selected.focus({preventScroll:true});});overlay.addEventListener('keydown',function(event){if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();hide();if(selected)selected.focus({preventScroll:true});}});
    overlay.append(pins,panel);host.appendChild(overlay);
    var scene=img.closest('[data-fres-scene]'),api=scene&&instances.get(scene);if(api)api.draw(Number(scene.dataset.fresValue)||0);
  }
  function mountProjectScene(host,mediaId){
    var library=w.FR_EVIDENCE_LIBRARY;if(!library)return false;
    var scene=library.scenes.find(function(s){return s.views.includes(mediaId)||s.layerIds.includes(mediaId);});if(!scene)return false;
    host.innerHTML=scene.template.replaceAll('__INSTANCE__','fres-dossier-'+(++serial));
    var root=host.querySelector('[data-fres-scene]'),controller=mountScene(root);
    var index=scene.layerIds.indexOf(mediaId);if(index<0)index=scene.layerIds.findIndex(function(id){return scene.views.includes(id);});
    if(index>=0&&controller){if(scene.views.includes(mediaId)&&w.FR_MEDIA_LIBRARY){var img=root.querySelectorAll('[data-fres-layer]')[index].querySelector('img');setImage(img,w.FR_MEDIA_LIBRARY.media[mediaId]);var labels=JSON.parse(root.dataset.fresLabels);labels[index]='Projeto 3D · vista selecionada';root.dataset.fresLabels=JSON.stringify(labels);}controller.own();controller.draw(index/Math.max(1,scene.layerIds.length-1)*1000);}
    return true;
  }
  function mountEnvironmentScene(host,group,trailId,mediaId){
    var library=w.FR_EVIDENCE_LIBRARY,scene=library&&library.environments.find(function(s){return s.group===group&&s.id===trailId;});if(!scene)return false;
    host.innerHTML=scene.template.replaceAll('__INSTANCE__','fres-material-'+(++serial));var root=host.querySelector('[data-fres-scene]'),controller=mountScene(root),index=scene.mediaIds.indexOf(mediaId);if(controller){controller.own();controller.draw(Math.max(0,index)*500);}enhance(host);return true;
  }
  function enhance(root){
    if(destroyed||!root)return;
    if(root.matches&&root.matches('[data-fres-feed]'))mountFeed(root);
    root.querySelectorAll('[data-fres-feed]').forEach(mountFeed);
    if(root.matches&&root.matches('[data-fres-scene]'))mountScene(root);
    root.querySelectorAll('[data-fres-scene]').forEach(mountScene);
    if(root.matches&&root.matches('img')){identifyStyleImage(root);annotate(root);}
    root.querySelectorAll('img').forEach(function(img){
      if(!img.isConnected)return;identifyStyleImage(img);var card=img.closest('.frmedia-card'),m=w.FR_MEDIA_LIBRARY&&w.FR_MEDIA_LIBRARY.media[img.dataset.frMediaId];
      if(card&&!img.closest('.fres-scene')&&m&&m.stage==='PROJECT_3D'){if(mountProjectScene(card,m.media_id))return;}annotate(img);
    });
    root.querySelectorAll('[data-fres-view]:not([data-fres-bound])').forEach(function(button){button.dataset.fresBound='true';button.addEventListener('click',function(){var project=button.closest('[data-fres-project]'),scene=project&&project.querySelector('[data-fres-scene]'),api=scene&&instances.get(scene),m=w.FR_MEDIA_LIBRARY&&w.FR_MEDIA_LIBRARY.media[button.dataset.fresView];if(!api||!m)return;
      var layers=Array.from(scene.querySelectorAll('[data-fres-layer]')),i=layers.findIndex(function(layer){var source=w.FR_MEDIA_LIBRARY.media[layer.querySelector('img').dataset.frMediaId];return source&&source.stage==='PROJECT_3D';});if(i<0)return;setImage(layers[i].querySelector('img'),m);var labels=JSON.parse(scene.dataset.fresLabels);labels[i]='Projeto 3D · vista selecionada';scene.dataset.fresLabels=JSON.stringify(labels);api.own();api.draw(i/Math.max(1,layers.length-1)*1000);enhance(scene);scene.querySelector('.fres-range').focus({preventScroll:true});track('project_view',scene,m.media_id);});});
  }
  function tick(){frame=0;if(d.hidden||reduced())return;visible.forEach(function(root){var api=instances.get(root);if(api)api.tick();});}
  function queue(){if(!frame&&!destroyed)frame=w.requestAnimationFrame(tick);}
  function refresh(){
    feeds.forEach(function(api,root){if(!root.isConnected)api.destroy();});
    instances.forEach(function(api,root){if(!root.isConnected)api.destroy();else api.motion();});
    queue();
  }
  function boot(){
    if(w.IntersectionObserver)intersection=new w.IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target);});queue();},{rootMargin:'200px'});
    enhance(d);
    if(w.MutationObserver){observer=new w.MutationObserver(function(records){var changed=false;records.forEach(function(record){record.addedNodes.forEach(function(node){if(node.nodeType===1){enhance(node);changed=true;}});});if(changed){instances.forEach(function(api,root){if(!root.isConnected)api.destroy();});queue();}});observer.observe(d.body,{childList:true,subtree:true});}
    bind(w,'scroll',queue,{passive:true});bind(w,'resize',refresh,{passive:true});
    ['frViewChanged','frStage16Ready','frStage16PortfolioModeChanged'].forEach(function(type){bind(d,type,function(){enhance(d);w.requestAnimationFrame(refresh);});});
    bind(d,'visibilitychange',function(){if(d.hidden){w.cancelAnimationFrame(frame);frame=0;}else queue();});
    if(query){if(query.addEventListener)bind(query,'change',refresh);}
    // Closing a native dialog does not bubble. The capture listener removes dormant triggers.
    bind(d,'close',refresh,true);
    bind(d,'keydown',function(e){if(e.key!=='Escape')return;var panels=Array.from(d.querySelectorAll('.fres-annotation-panel:not([hidden])')).filter(active);if(panels.length){e.preventDefault();e.stopPropagation();panels.forEach(function(panel){var button=panel.parentElement.querySelector('[aria-expanded=true]');panel.hidden=true;if(button){button.setAttribute('aria-expanded','false');button.focus({preventScroll:true});}});}},true);
    if(d.fonts&&d.fonts.ready)d.fonts.ready.then(refresh);
    bind(w,'pagehide',function(){w.FREvidenceScenes.destroy();});
  }
  w.FREvidenceScenes={version:'1.1',enhance:enhance,mountProjectScene:mountProjectScene,mountEnvironmentScene:mountEnvironmentScene,refresh:refresh,getState:function(){return Array.from(instances.values()).map(function(api){return api.state();});},destroy:function(){destroyed=true;if(observer)observer.disconnect();if(intersection)intersection.disconnect();w.cancelAnimationFrame(frame);feeds.forEach(function(api){api.destroy();});instances.forEach(function(api){api.destroy();});listeners.forEach(function(fn){fn();});listeners=[];visible.clear();}};
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(window,document);
