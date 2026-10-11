/* Accessible quantity presentation. The original input/event contract is preserved. */
(function(w,d){
  'use strict';
  var observer=null;
  function mount(){
    d.querySelectorAll('[data-action="updateServiceQty"]:not([data-fr-quantity])').forEach(function(input){
      input.dataset.frQuantity='true';
      var wrap=d.createElement('div');wrap.className='fr-quantity';
      var minus=d.createElement('button'),plus=d.createElement('button');
      minus.type=plus.type='button';minus.textContent='−';plus.textContent='+';
      minus.setAttribute('aria-label','Diminuir quantidade');plus.setAttribute('aria-label','Aumentar quantidade');
      input.setAttribute('aria-label','Quantidade ou medida do serviço');
      input.inputMode='decimal';
      input.before(wrap);wrap.append(minus,input,plus);
      function sync(){
        var min=Number(input.min)||0,value=input.valueAsNumber,max=input.max?Number(input.max):Infinity;
        minus.disabled=!Number.isFinite(value)||value<=min;plus.disabled=Number.isFinite(value)&&value>=max;
        input.setAttribute('aria-valuemin',String(min));
        if(Number.isFinite(value))input.setAttribute('aria-valuenow',String(value));else input.removeAttribute('aria-valuenow');
        if(Number.isFinite(max))input.setAttribute('aria-valuemax',String(max));
      }
      function change(direction){
        var value=input.valueAsNumber,min=Number(input.min)||0,max=input.max?Number(input.max):Infinity;
        var step=input.step&&input.step!=='any'?Number(input.step):1;
        if(!Number.isFinite(value))value=0;
        input.value=String(Math.max(min,Math.min(max,value+direction*step)));
        // Existing delegated handler updates activeServiceConfig; no state or math here.
        input.dispatchEvent(new Event('input',{bubbles:true}));
        if(!w.matchMedia('(prefers-reduced-motion: reduce)').matches){input.classList.remove('fr-quantity-change');void input.offsetWidth;input.classList.add('fr-quantity-change');}
      }
      minus.addEventListener('click',function(){change(-1);});plus.addEventListener('click',function(){change(1);});
      input.addEventListener('input',sync);input.addEventListener('animationend',function(){input.classList.remove('fr-quantity-change');});sync();
    });
    var host=d.getElementById('step-content-container');
    if(host)host.classList.toggle('fr-quantity-editor',!!host.querySelector('[data-action="updateServiceQty"]'));
    if(host&&!observer){observer=new MutationObserver(mount);observer.observe(host,{childList:true,subtree:true});}
  }
  d.addEventListener('frCoreReady',mount);d.addEventListener('DOMContentLoaded',mount);
  w.FRQuantityControl={mount:mount,version:1};mount();
})(window,document);
