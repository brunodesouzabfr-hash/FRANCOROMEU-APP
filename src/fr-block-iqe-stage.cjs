'use strict';
/**
 * Optional, reversible IQE avatar replacement. Enabled ONLY when
 * FR_BLOCK_IQE_STAGING=1 during the site build. Does not touch budget wizard,
 * financial logic, search or original FR assistant event handlers.
 */
module.exports=function installBlockStage(doc,{enabled=process.env.FR_BLOCK_IQE_STAGING==='1'}={}){
  if(!enabled)return {enabled:false,preservesAssistant:true,preservesWizard:true};
  if(!doc||!doc.getElementById('fr-stage5-assistant-engine')||!doc.getElementById('fr-stage5-assistant-styles'))throw Error('Block staging: missing Stage 5 assistant contracts');
  if(doc.getElementById('fr-block-iqe-stage-marker'))throw Error('Block staging: duplicate injection');
  for(const [file,label] of [
    ['assets/js/fr-block-avatar.iife.js','compiled Lovable Block engine'],
    ['assets/js/fr-block-iqe-init.js','staging bootstrap'],
    ['assets/css/fr-block-iqe-stage.css','staging styles']
  ]) {
    if(!require('node:fs').existsSync(file))throw Error('Block staging: missing '+label);
  }
  const mark=doc.createElement('meta');
  mark.id='fr-block-iqe-stage-marker';mark.setAttribute('name','fr-block-iqe-stage');mark.content='staging';
  doc.head.appendChild(mark);
  const robots=doc.querySelector('meta[name="robots"]');
  if(robots)robots.content='noindex,nofollow';else{
    const disallow=doc.createElement('meta');disallow.name='robots';disallow.content='noindex,nofollow';doc.head.appendChild(disallow);
  }
  const css=doc.createElement('link');css.rel='stylesheet';css.href='/assets/css/fr-block-iqe-stage.css';doc.head.appendChild(css);
  const engine=doc.createElement('script');engine.defer=true;engine.src='/assets/js/fr-block-avatar.iife.js';doc.body.appendChild(engine);
  const init=doc.createElement('script');init.defer=true;init.src='/assets/js/fr-block-iqe-init.js';doc.body.appendChild(init);
  return {enabled:true,preservesAssistant:true,preservesWizard:true,visualOnly:true};
};
