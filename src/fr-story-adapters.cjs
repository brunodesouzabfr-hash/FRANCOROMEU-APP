'use strict';
/* Optional narrative adapters. Source tools and all commercial defaults stay canonical. */
module.exports = function adapt(doc) {
 const patches = [
  [
    " while(p.images.length<3&&p.images.length)p.images.push(p.images[0]);",
    " while(!p.keepExactImages&&p.images.length<3&&p.images.length)p.images.push(p.images[0]);"
  ],
  [
    " track.innerHTML=state.images.map(function(src,i){return '<div class=\"pm-slide'+(i===0?' is-active':'')+'\"><div class=\"pm-slide-fallback\" aria-hidden=\"true\">FR</div><img src=\"'+esc(imageUrl(src,1400))+'\" alt=\"'+esc(state.project.title)+' — imagem '+(i+1)+'\" loading=\"'+(i===0?'eager':'lazy')+'\" draggable=\"false\" onerror=\"this.style.display=\\'none\\'\"></div>'}).join('');",
    " track.innerHTML=state.images.map(function(src,i){return '<div class=\"pm-slide'+(i===0?' is-active':'')+'\"><div class=\"pm-slide-fallback\" aria-hidden=\"true\">FR</div><img src=\"'+esc(imageUrl(src,1400))+'\" alt=\"'+esc((state.project.imageAlts||[])[i]||state.project.title+' — imagem '+(i+1))+'\" loading=\"'+(i===0?'eager':'lazy')+'\" draggable=\"false\" onerror=\"this.style.display=\\'none\\'\">'+((state.project.imageLabels||[])[i]?'<span class=\"pm-media-label\">'+esc(state.project.imageLabels[i])+'</span>':'')+'</div>'}).join('');"
  ],
  [
    "function isAdded(){var core=window.__frCore;if(!core||!state.project)return false;var meta=CATEGORY_META[state.project.cat]||CATEGORY_META.reforma;return core.appState.selectedServices.some(function(s){return s.serviceId===meta.serviceId})}",
    "function isAdded(){var core=window.__frCore;if(!core||!state.project)return false;var meta=Object.assign({},CATEGORY_META[state.project.cat]||CATEGORY_META.reforma,state.project.serviceId?{serviceId:state.project.serviceId}:{});return core.appState.selectedServices.some(function(s){return s.serviceId===meta.serviceId})}"
  ],
  [
    " var meta=CATEGORY_META[state.project.cat]||CATEGORY_META.reforma,service=core.SERVICES[meta.serviceId];",
    " var meta=Object.assign({},CATEGORY_META[state.project.cat]||CATEGORY_META.reforma,state.project.serviceId?{serviceId:state.project.serviceId}:{}),service=core.SERVICES[meta.serviceId];"
  ],
  [
    " var meta=CATEGORY_META[state.project.cat]||CATEGORY_META.reforma;",
    " var meta=Object.assign({},CATEGORY_META[state.project.cat]||CATEGORY_META.reforma,state.project.serviceId?{serviceId:state.project.serviceId}:{});"
  ]
];
 const modal=doc.getElementById('fr-stage2-portfolio-engine');
 for(const [before,after] of patches){if(!modal.textContent.includes(before))throw Error('Story modal contract changed');modal.textContent=modal.textContent.replace(before,after);}
 for(const script of doc.scripts){if(script.textContent.includes('function hideLegacy(hidden)')){
 const before='return node!==rootNode';
 if(!script.textContent.includes(before))throw Error('Story legacy container contract changed');
 script.textContent=script.textContent.replace(before,"return node!==rootNode&&!node.classList.contains('story-surface')");
 }}
};
