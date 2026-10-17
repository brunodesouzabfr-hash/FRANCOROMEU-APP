/*
 * Franco Romeu IQE — BLOCK Staging bootstrap.
 * Only injected by FR_BLOCK_IQE_STAGING=1, not loaded in production by default.
 * The existing assistant handles every button, search, budget and action.
 */
(function(win,doc){
  'use strict';
  if(win.FRBlockStage)return;
  var handle=null,booted=false,failed=false,discoverer=null,discoveryTimeout=0;
  function ready(){
    if(booted)return !!handle;
    var root=doc.getElementById('fr-ai-root');
    var button=root&&root.querySelector('#fr-ai-launcher');
    var launcher=root&&root.querySelector('#fr-ai-launcher .fr-ai-robot');
    var header=root&&root.querySelector('.fr-ai-avatar');
    if(!root||!button||!launcher||!header||!root.querySelector('#fr-ai-body'))return false;
    if(!win.FRBlockAvatar||typeof win.FRBlockAvatar.mountIQEBlock!=='function')return false;
    booted=true;
    var probe=doc.createElement('canvas');
    if(!probe.getContext||!probe.getContext('2d'))return false;
    try {
      handle=win.FRBlockAvatar.mountIQEBlock({
        root:root,
        palette:'verdeLaranja',
        disableLegacy:true
      });
      if(handle){
        root.classList.add('fr-block-iqe-staging');
        root.dataset.frBlockAvatar='staging';
        if(discoverer){discoverer.disconnect();discoverer=null;}
        if(discoveryTimeout){win.clearTimeout(discoveryTimeout);discoveryTimeout=0;}
        return true;
      }
    }catch(error){
      if(win.console&&win.console.warn)win.console.warn('[FR Block stage] fallback to legacy avatar',error);
    }
    // A partial mount must never leave IQE without its existing visual fallback.
    failed=true;
    if(win.FRIQEAvatar6&&typeof win.FRIQEAvatar6.mount==='function'){
      try{win.FRIQEAvatar6.mount();}catch(error){if(win.console)win.console.warn(error);}
    }
    if(discoverer){discoverer.disconnect();discoverer=null;}
    if(discoveryTimeout){win.clearTimeout(discoveryTimeout);discoveryTimeout=0;}
    return false;
  }
  function discover(){
    if(ready())return true;
    // The Stage 5 assistant creates its launcher progressively; wait for the REAL anchors.
    if(!doc.body||!win.MutationObserver||discoverer)return false;
    discoverer=new win.MutationObserver(function(){
      if(!booted&&ready()){
        if(discoverer){discoverer.disconnect();discoverer=null;}
      }
    });
    discoverer.observe(doc.body,{subtree:true,childList:true});
    discoveryTimeout=win.setTimeout(function(){
      if(discoverer){discoverer.disconnect();discoverer=null;}
      discoveryTimeout=0;
      if(!booted&&win.console)win.console.warn('[FR Block stage] IQE launcher anchors not available; original avatar retained');
    },15000);
    return false;
  }
  function destroy(){
    if(discoverer){discoverer.disconnect();discoverer=null;}
    if(discoveryTimeout){win.clearTimeout(discoveryTimeout);discoveryTimeout=0;}
    if(handle){handle.destroy();handle=null;}
    var root=doc.getElementById('fr-ai-root');
    if(root){root.classList.remove('fr-block-iqe-staging');delete root.dataset.frBlockAvatar;}
    if(win.FRIQEAvatar6&&typeof win.FRIQEAvatar6.mount==='function'){
      try{win.FRIQEAvatar6.mount();}catch(error){if(win.console)win.console.warn(error);}
    }
  }
  win.FRBlockStage={
    mount:discover,
    destroy:destroy,
    react:function(kind){if(handle&&typeof handle.react==='function')handle.react(kind);},
    update:function(cfg){if(handle&&typeof handle.update==='function')handle.update(cfg);},
    getState:function(){return {
      mounted:!!handle,booted:booted,failed:failed,
      engine:handle&&handle.state?handle.state():null,
      wizardUntouched:!!doc.getElementById('iqe-overlay'),
      assistantUntouched:!!doc.getElementById('fr-ai-body')
    };}
  };
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',discover,{once:true});
  else discover();
})(window,document);
