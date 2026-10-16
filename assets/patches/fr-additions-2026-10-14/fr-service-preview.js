(function (global, document) {
  'use strict';

  if (global.FRAdditionsServicePreview) return;

  var script = document.currentScript || document.querySelector('script[data-frap-map]');
  var mapUrl = script && script.dataset.frapMap ? script.dataset.frapMap : '/assets/patches/fr-additions-2026-10-14/service-media-map.json';
  var state = {
    mounted: false,
    destroyed: false,
    records: new Map(),
    panel: null,
    observer: null,
    trigger: null,
    serviceId: null,
    mode: null,
    openTimer: 0,
    closeTimer: 0,
    enhanceFrame: 0,
    listeners: [],
    error: null
  };

  function clean(value, fallback) {
    var text = String(value == null ? '' : value).replace(/[<>]/g, '').trim();
    return text || fallback || '';
  }

  function safeAsset(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      var url = new URL(value.trim(), document.baseURI);
      return url.origin === global.location.origin && /^https?:$/.test(url.protocol) && url.pathname.indexOf('/assets/') === 0 ? url.href : null;
    } catch (error) {
      return null;
    }
  }

  function listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    state.listeners.push(function () { target.removeEventListener(type, handler, options); });
  }

  function shell() {
    var panel = document.createElement('section');
    panel.id = 'frap-service-preview';
    panel.className = 'frap-service-preview';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'frap-service-preview-title');
    panel.innerHTML = [
      '<div class="frap-service-panel">',
        '<header><p>EXEMPLO VISUAL DO ACERVO</p><button type="button" data-frap-preview-close aria-label="Fechar prévia">×</button></header>',
        '<figure data-frap-preview-figure><img alt="" width="1200" height="900" decoding="async"><figcaption data-frap-preview-nature></figcaption></figure>',
        '<div class="frap-service-copy"><p data-frap-preview-status></p><h2 id="frap-service-preview-title"></h2><p data-frap-preview-note></p><dl><div><dt>Unidade</dt><dd data-frap-preview-unit></dd></div><div><dt>Relação</dt><dd data-frap-preview-relation></dd></div></dl><div class="frap-service-actions" data-frap-preview-actions></div></div>',
      '</div>'
    ].join('');
    document.body.appendChild(panel);
    return panel;
  }

  function nature(record) {
    if (record.previewNature === 'REFERENCE_VISUAL') return 'OBRA EXECUTADA · FRANCO ROMEU';
    if (record.previewNature === 'CONCEPT_VISUAL') return 'PROJETO 3D · FRANCO ROMEU';
    return 'SEM MÍDIA ELEGÍVEL · FICHA DE SERVIÇO';
  }

  function relation(record) {
    if (record.relationshipType && record.relationshipType.includes('ENVIRONMENT')) return 'Vínculo existente com linguagem de ambiente';
    if (record.relationshipType && record.relationshipType.includes('PORTFOLIO')) return 'Vínculo existente com categoria do Portfólio';
    return 'Vínculo visual pendente de revisão';
  }

  function populate(record) {
    var figure = state.panel.querySelector('[data-frap-preview-figure]');
    var image = figure.querySelector('img');
    var asset = safeAsset(record.previewAsset);
    figure.hidden = !asset;
    if (asset) {
      image.src = asset;
      image.alt = nature(record) + ': exemplo relacionado a ' + clean(record.publicLabel, 'serviço');
      state.panel.querySelector('[data-frap-preview-nature]').textContent = nature(record);
    } else {
      image.removeAttribute('src');
      image.alt = '';
    }
    state.panel.querySelector('#frap-service-preview-title').textContent = clean(record.publicLabel, record.budgetServiceId);
    state.panel.querySelector('[data-frap-preview-status]').textContent = record.status === 'mapped' ? 'VÍNCULO POR ID EXATO' : 'MÍDIA VISUAL EM REVISÃO';
    state.panel.querySelector('[data-frap-preview-note]').textContent = clean(record.notes, 'A configuração e o escopo devem ser definidos na calculadora.');
    state.panel.querySelector('[data-frap-preview-unit]').textContent = clean(record.unit, 'a confirmar');
    state.panel.querySelector('[data-frap-preview-relation]').textContent = relation(record);
    var actions = state.panel.querySelector('[data-frap-preview-actions]');
    actions.replaceChildren();
    if (Array.isArray(record.styleIds) && record.styleIds.length) {
      var related = document.createElement('button');
      related.type = 'button';
      related.dataset.frapPreviewStyle = record.styleIds[0];
      related.textContent = 'Ver ambiente relacionado';
      actions.appendChild(related);
    }
    var back = document.createElement('button');
    back.type = 'button';
    back.dataset.frapPreviewBack = 'true';
    back.textContent = 'Voltar ao serviço';
    actions.appendChild(back);
  }

  function position(trigger) {
    var rect = trigger.getBoundingClientRect();
    var width = Math.min(390, global.innerWidth - 24);
    var left = Math.max(12, Math.min(global.innerWidth - width - 12, rect.left + rect.width / 2 - width / 2));
    var top = rect.bottom + 10;
    if (top + 520 > global.innerHeight) top = Math.max(12, rect.top - 510);
    state.panel.style.setProperty('--frap-preview-left', left + 'px');
    state.panel.style.setProperty('--frap-preview-top', top + 'px');
  }

  function open(serviceId, trigger, mode) {
    var record = state.records.get(serviceId);
    if (!record || state.destroyed) return false;
    clearTimeout(state.closeTimer);
    state.trigger = trigger || state.trigger;
    state.serviceId = serviceId;
    state.mode = mode === 'drawer' ? 'drawer' : 'popover';
    populate(record);
    state.panel.dataset.frapPreviewMode = state.mode;
    state.panel.hidden = false;
    state.panel.setAttribute('aria-hidden', 'false');
    state.panel.setAttribute('aria-modal', String(state.mode === 'drawer'));
    if (state.mode === 'popover' && state.trigger) position(state.trigger);
    document.dispatchEvent(new CustomEvent('frExperienceEvent', { detail: { name: 'service_preview_open', fields: { view: 'orcamento', serviceId: record.budgetServiceId, origin: state.mode, version: 'fr-additions-2026-10-14' } } }));
    return true;
  }

  function close(returnFocus) {
    clearTimeout(state.openTimer);
    clearTimeout(state.closeTimer);
    if (!state.panel || state.panel.hidden) return;
    state.panel.hidden = true;
    state.panel.setAttribute('aria-hidden', 'true');
    state.panel.setAttribute('aria-modal', 'false');
    if (returnFocus && state.trigger && state.trigger.isConnected) state.trigger.focus({ preventScroll: true });
    state.mode = null;
  }

  function scheduleClose() {
    clearTimeout(state.closeTimer);
    state.closeTimer = setTimeout(function () {
      if (state.mode === 'popover' && !state.panel.matches(':hover') && !state.panel.contains(document.activeElement) && !(state.trigger && (state.trigger.matches(':hover') || state.trigger === document.activeElement))) close(false);
    }, 180);
  }

  function enhance() {
    state.enhanceFrame = 0;
    if (state.destroyed) return;
    document.querySelectorAll('#view-orcamento [data-action="selectService"][data-service-id]').forEach(function (choice) {
      var serviceId = choice.dataset.serviceId;
      var record = state.records.get(serviceId);
      if (!record || choice.dataset.frapPreviewBound === 'true') return;
      choice.dataset.frapPreviewBound = 'true';
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'frap-service-trigger';
      button.dataset.frapServicePreview = serviceId;
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', 'frap-service-preview');
      button.textContent = record.status === 'mapped' ? 'Ver exemplo visual' : 'Sobre este serviço';
      choice.insertAdjacentElement('afterend', button);
    });
    if (state.trigger && !state.trigger.isConnected) close(false);
  }

  function scheduleEnhance() {
    if (!state.enhanceFrame) state.enhanceFrame = global.requestAnimationFrame(enhance);
  }

  function bind() {
    var budget = document.getElementById('view-orcamento');
    if (!budget) return;
    listen(budget, 'click', function (event) {
      var trigger = event.target.closest('[data-frap-service-preview]');
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      open(trigger.dataset.frapServicePreview, trigger, 'drawer');
      state.panel.querySelector('[data-frap-preview-close]').focus({ preventScroll: true });
    });
    listen(budget, 'pointerover', function (event) {
      var trigger = event.target.closest('[data-frap-service-preview]');
      if (!trigger || !(global.matchMedia && global.matchMedia('(hover:hover) and (pointer:fine)').matches)) return;
      clearTimeout(state.openTimer);
      state.openTimer = setTimeout(function () { open(trigger.dataset.frapServicePreview, trigger, 'popover'); }, 220);
    }, { passive: true });
    listen(budget, 'pointerout', function (event) {
      var trigger = event.target.closest('[data-frap-service-preview]');
      if (!trigger || trigger.contains(event.relatedTarget)) return;
      clearTimeout(state.openTimer);
      scheduleClose();
    }, { passive: true });
    listen(budget, 'focusin', function (event) {
      var trigger = event.target.closest('[data-frap-service-preview]');
      if (trigger) open(trigger.dataset.frapServicePreview, trigger, 'popover');
    });
    listen(budget, 'focusout', function (event) {
      if (event.target.closest('[data-frap-service-preview]')) scheduleClose();
    });
    listen(state.panel, 'pointerenter', function () { clearTimeout(state.closeTimer); }, { passive: true });
    listen(state.panel, 'pointerleave', scheduleClose, { passive: true });
    listen(state.panel, 'click', function (event) {
      if (event.target === state.panel || event.target.closest('[data-frap-preview-close]') || event.target.closest('[data-frap-preview-back]')) {
        close(true);
        return;
      }
      var related = event.target.closest('[data-frap-preview-style]');
      if (!related) return;
      var styles = Array.isArray(global.AMB_STYLES) ? global.AMB_STYLES : [];
      var index = styles.findIndex(function (style) { return style.id === related.dataset.frapPreviewStyle; });
      close(false);
      if (typeof global.switchView === 'function') global.switchView('view-ambientes');
      if (index >= 0 && typeof global.openAmbDetail === 'function') setTimeout(function () { global.openAmbDetail(index, { silent: true }); }, 450);
    });
    listen(document, 'keydown', function (event) {
      if (event.key === 'Escape' && state.panel && !state.panel.hidden) {
        event.preventDefault();
        close(true);
      }
    });
    state.observer = new MutationObserver(scheduleEnhance);
    state.observer.observe(budget, { childList: true, subtree: true });
  }

  async function mount() {
    if (state.mounted || state.destroyed) return audit();
    var flags = global.FR_ADDITIONS_PATCH_FLAGS || {};
    if (flags.enabled === false || flags.servicePreview === false || !document.getElementById('view-orcamento')) return audit();
    state.mounted = true;
    state.panel = shell();
    try {
      var response = await fetch(mapUrl, { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var crosswalk = await response.json();
      if (!crosswalk || !Array.isArray(crosswalk.services) || Number(crosswalk.serviceCount) !== crosswalk.services.length) throw new Error('Mapa de serviço incompleto');
      crosswalk.services.forEach(function (record) { state.records.set(record.budgetServiceId, record); });
      bind();
      enhance();
    } catch (error) {
      state.error = error.message;
      if (state.panel) state.panel.remove();
      state.panel = null;
    }
    return audit();
  }

  function refresh() {
    enhance();
    return audit();
  }

  function destroy() {
    if (state.destroyed) return;
    state.destroyed = true;
    if (state.observer) state.observer.disconnect();
    if (state.enhanceFrame) global.cancelAnimationFrame(state.enhanceFrame);
    clearTimeout(state.openTimer);
    clearTimeout(state.closeTimer);
    while (state.listeners.length) state.listeners.pop()();
    document.querySelectorAll('[data-frap-service-preview]').forEach(function (button) { button.remove(); });
    document.querySelectorAll('[data-frap-preview-bound]').forEach(function (choice) { choice.removeAttribute('data-frap-preview-bound'); });
    if (state.panel) state.panel.remove();
    state.mounted = false;
  }

  function audit() {
    return {
      mounted: state.mounted,
      destroyed: state.destroyed,
      records: state.records.size,
      mapped: Array.from(state.records.values()).filter(function (record) { return record.status === 'mapped'; }).length,
      triggers: document.querySelectorAll('[data-frap-service-preview]').length,
      open: Boolean(state.panel && !state.panel.hidden),
      financialMutations: 0,
      error: state.error
    };
  }

  global.FRAdditionsServicePreview = { mount: mount, refresh: refresh, destroy: destroy, audit: audit };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})(window, document);
