'use strict';
/**
 * Reversible IQE avatar visual layer. Active on Vercel production main,
 * or the isolated Block preview branch, or with FR_BLOCK_IQE_STAGING=1.
 * FR_BLOCK_IQE_ENABLED=0 disables it on the next build/deployment.
 * Does not touch wizard, financial logic, search or original assistant handlers.
 */
const isBlockPreview=()=>process.env.VERCEL_ENV==='preview'&&process.env.VERCEL_GIT_COMMIT_REF==='feature/block-iqe-staging-2026-10-17';
const isMainProduction=()=>process.env.VERCEL_ENV==='production'&&process.env.VERCEL_GIT_COMMIT_REF==='main';
const isBlockEnabled=()=>process.env.FR_BLOCK_IQE_ENABLED!=='0' &&
  (process.env.FR_BLOCK_IQE_STAGING==='1'||isBlockPreview()||isMainProduction());
module.exports=function installBlockStage(doc,{enabled=isBlockEnabled()}={}){
  if(!enabled)return {enabled:false,preservesAssistant:true,preservesWizard:true};
  if(!doc||!doc.getElementById('fr-stage5-assistant-engine')||!doc.getElementById('fr-stage5-assistant-styles'))throw Error('Block staging: missing Stage 5 assistant contracts');
  if(doc.getElementById('fr-block-iqe-stage-marker'))throw Error('Block staging: duplicate injection');
  for(const [file,label] of [
    ['assets/js/fr-block-avatar.iife.js','compiled Lovable Block engine'],
    ['assets/js/fr-block-iqe-balloons.js','context bubbles'],
    ['assets/js/fr-block-iqe-init.js','staging bootstrap'],
    ['assets/css/fr-block-iqe-stage.css','staging styles']
  ]) {
    if(!require('node:fs').existsSync(file))throw Error('Block staging: missing '+label);
  }
  const mark=doc.createElement('meta');
  mark.id='fr-block-iqe-stage-marker';mark.setAttribute('name','fr-block-iqe-avatar');mark.content=isMainProduction()?'production':'staging';
  doc.head.appendChild(mark);
  // Never downgrade production SEO. Only isolated preview/staging is noindex.
  if(!isMainProduction()){
    const robots=doc.querySelector('meta[name="robots"]');
    if(robots)robots.content='noindex,nofollow';else{
      const disallow=doc.createElement('meta');disallow.name='robots';disallow.content='noindex,nofollow';doc.head.appendChild(disallow);
    }
  }
  const css=doc.createElement('link');css.rel='stylesheet';css.href='/assets/css/fr-block-iqe-stage.css';doc.head.appendChild(css);
  const engine=doc.createElement('script');engine.defer=true;engine.src='/assets/js/fr-block-avatar.iife.js';doc.body.appendChild(engine);
  const balloons=doc.createElement('script');balloons.defer=true;balloons.src='/assets/js/fr-block-iqe-balloons.js';doc.body.appendChild(balloons);
  const init=doc.createElement('script');init.defer=true;init.src='/assets/js/fr-block-iqe-init.js';doc.body.appendChild(init);
  return {enabled:true,preservesAssistant:true,preservesWizard:true,visualOnly:true};
};
