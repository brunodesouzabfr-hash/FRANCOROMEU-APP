(function () {
  'use strict';

  const w = window;
  const d = document;
  const root = d.documentElement;
  const VERSION = '17.0-palimpesto-de-forja';
  const DEFAULT_FLAGS = Object.freeze({
    enabled: true,
    field: true,
    tectonicType: true,
    apertures: true,
    inscriptions: true,
    resonance: true,
    transitions: true
  });
  const flags = Object.freeze(Object.assign({}, DEFAULT_FLAGS, w.FR_QUIETY_FLAGS || {}));

  if (w.__FR_QUIETY_MONEY__) return;

  const WORLDS = Object.freeze({
    'view-home': Object.freeze({
      key: 'forja', index: '01', title: 'Forja',
      line: 'A matéria não pede atenção. Ela a toma.',
      accent: '#fc7016', trace: '#f6a700', paper: '#e6d6b5',
      field: Object.freeze(['#fc7016', '#f6a700', '#c8986a'])
    }),
    'view-sobre': Object.freeze({
      key: 'palimpsesto', index: '02', title: 'Palimpsesto',
      line: 'Toda escolha deixa rastro.',
      accent: '#d8b768', trace: '#f1e5c9', paper: '#f1e5c9',
      field: Object.freeze(['#d8b768', '#f1e5c9', '#8f1133'])
    }),
    'view-ambientes': Object.freeze({
      key: 'patina', index: '03', title: 'Patina',
      line: 'Nenhuma atmosfera nasce neutra.',
      accent: '#c8986a', trace: '#f6a700', paper: '#eadbc0',
      field: Object.freeze(['#c8986a', '#f6a700', '#0b3d3e'])
    }),
    'view-projetos3d': Object.freeze({
      key: 'wireframe', index: '04', title: 'Wireframe',
      line: 'O espaço ensaia antes de existir.',
      accent: '#71e5f4', trace: '#c8986a', paper: '#e5f4f1',
      field: Object.freeze(['#71e5f4', '#1a6069', '#c8986a'])
    }),
    'view-projetos': Object.freeze({
      key: 'arquivo', index: '05', title: 'Arquivo Vivo',
      line: 'O que não foi executado continua dizendo a verdade.',
      accent: '#f6a700', trace: '#8f1133', paper: '#e6d6b5',
      field: Object.freeze(['#f6a700', '#8f1133', '#c8986a'])
    }),
    'view-orcamento': Object.freeze({
      key: 'ledger', index: '06', title: 'Ledger',
      line: 'Toda invenção precisa caber no mundo.',
      accent: '#a9d8bd', trace: '#f6a700', paper: '#e9e0ca',
      field: Object.freeze(['#a9d8bd', '#f6a700', '#1a6069'])
    })
  });

  const state = {
    viewId: 'view-home',
    world: WORLDS['view-home'],
    pointerX: 0.5,
    pointerY: 0.5,
    pointerVelocity: 0,
    scrollVelocity: 0,
    scrollProgress: 0,
    energy: 0,
    clickCount: 0,
    lastPointerX: w.innerWidth / 2,
    lastPointerY: w.innerHeight / 2,
    lastPointerAt: performance.now(),
    lastScrollY: w.scrollY,
    lastScrollAt: performance.now(),
    frame: 0,
    resizeFrame: 0,
    destroyed: false
  };

  const reduced = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false, addEventListener() {}, removeEventListener() {} };
  const finePointer = w.matchMedia ? w.matchMedia('(hover: hover) and (pointer: fine)') : { matches: false, addEventListener() {}, removeEventListener() {} };
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const controller = new AbortController();
  const signal = controller.signal;
  const created = [];
  let canvas = null;
  let context = null;
  let spine = null;
  let spineCoordinate = null;
  let spineMarker = null;
  let spineIndex = null;
  let spineTitle = null;
  let spineLine = null;
  let veil = null;
  let fieldEnabled = false;

  function activeViewId() {
    const active = d.querySelector('.view-section.active');
    return active && WORLDS[active.id] ? active.id : 'view-home';
  }

  function make(tag, className, attributes) {
    const node = d.createElement(tag);
    if (className) node.className = className;
    if (attributes) Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    return node;
  }

  function rememberClick() {
    state.clickCount += 1;
    try {
      sessionStorage.setItem('frqm-memory-v1', JSON.stringify({ clicks: state.clickCount }));
    } catch (error) {
      // Session memory is decorative; the experience remains complete without it.
    }
  }

  function restoreMemory() {
    try {
      const value = JSON.parse(sessionStorage.getItem('frqm-memory-v1') || '{}');
      state.clickCount = Number.isFinite(value.clicks) ? Math.max(0, Math.min(value.clicks, 999)) : 0;
    } catch (error) {
      state.clickCount = 0;
    }
  }

  function installAtmosphere() {
    const atmosphere = make('div', 'frqm-atmosphere', { id: 'frqm-atmosphere', 'aria-hidden': 'true' });
    canvas = make('canvas', 'frqm-field', { id: 'frqm-field' });
    const grain = make('span', 'frqm-grain');
    const datum = make('span', 'frqm-datum');
    atmosphere.append(canvas, grain, datum);
    d.body.append(atmosphere);
    created.push(atmosphere);

    fieldEnabled = Boolean(flags.field && !reduced.matches && !saveData && w.innerWidth >= 720);
    if (fieldEnabled) {
      try {
        context = canvas.getContext('2d', { alpha: true, desynchronized: true });
      } catch (error) {
        context = null;
      }
      fieldEnabled = Boolean(context);
    }
  }

  function installSpine() {
    spine = make('aside', 'frqm-spine', { id: 'frqm-spine', 'aria-hidden': 'true' });
    spineCoordinate = make('span', 'frqm-spine-coordinate');
    spineCoordinate.textContent = 'ꟻR / 01 / FORJA';
    const track = make('span', 'frqm-spine-track');
    spineMarker = make('i', 'frqm-spine-marker');
    track.append(spineMarker);
    const copy = make('span', 'frqm-spine-copy');
    spineIndex = make('b', 'frqm-spine-index');
    spineTitle = make('strong', 'frqm-spine-title');
    spineLine = make('em', 'frqm-spine-line');
    copy.append(spineIndex, spineTitle, spineLine);
    spine.append(spineCoordinate, track, copy);
    d.body.append(spine);
    created.push(spine);
  }

  function installVeil() {
    veil = make('div', 'frqm-veil', { id: 'frqm-veil', 'aria-hidden': 'true' });
    const plane = make('span', 'frqm-veil-plane');
    const code = make('span', 'frqm-veil-code');
    veil.append(plane, code);
    d.body.append(veil);
    created.push(veil);
  }

  const RESONANT_SELECTORS = [
    '.fr6-service', '.fr6-work-panel', '.fr6-process-item',
    '.pillar-card', '.sobre-stat', '.frsm-card',
    '.amb-style-card', '.amb-row', '.fr16-amb-row',
    '.p3d-card', '.p3d-how-card', '.fr15-p3d-card',
    '.fr16-portfolio-card', '.fr16-portfolio-insight-card',
    '.fr9-project', '.service-card', '.category-card'
  ].join(',');

  const APERTURE_SELECTORS = [
    '.fr6-service-media', '.fr6-work-panel', '.frsm-card',
    '.amb-style-card', '.amb-row', '.fr16-amb-row',
    '.p3d-card-media', '.fr15-p3d-face',
    '.fr16-portfolio-card-media', '.fr9-project-media'
  ].join(',');

  function classifyNodes(scope) {
    if (!flags.resonance && !flags.apertures) return;
    const owner = scope && scope.querySelectorAll ? scope : d;
    if (flags.resonance && finePointer.matches && !reduced.matches) owner.querySelectorAll(RESONANT_SELECTORS).forEach((node, index) => {
      node.dataset.frqmNode = '';
      node.style.setProperty('--frqm-node-index', String(index % 9));
    });
    if (flags.apertures && !reduced.matches) owner.querySelectorAll(APERTURE_SELECTORS).forEach(node => node.dataset.frqmAperture = '');
  }

  function scheduleFrame() {
    if (state.frame || state.destroyed) return;
    state.frame = w.requestAnimationFrame(updateFrame);
  }

  function setMotionVariables() {
    const x = (state.pointerX - 0.5) * 2;
    const y = (state.pointerY - 0.5) * 2;
    const view = d.getElementById(state.viewId);
    if (view && finePointer.matches && !reduced.matches && flags.tectonicType) {
      view.style.setProperty('--frqm-px', x.toFixed(4));
      view.style.setProperty('--frqm-py', y.toFixed(4));
    }
    const nav = d.getElementById('smart-nav');
    if (nav) nav.style.setProperty('--frqm-progress', state.scrollProgress.toFixed(5));
  }

  function updateFrame() {
    state.frame = 0;
    setMotionVariables();
    if (spineMarker) spineMarker.style.setProperty('--frqm-marker', state.scrollProgress.toFixed(5));
    if (fieldEnabled && !d.hidden) drawField();
  }

  function resizeField() {
    if (!canvas || !context) return;
    fieldEnabled = Boolean(flags.field && context && !reduced.matches && !saveData && w.innerWidth >= 720);
    if (!fieldEnabled) {
      canvas.width = 1;
      canvas.height = 1;
      return;
    }
    const ratio = Math.min(w.devicePixelRatio || 1, 1.25);
    const width = Math.max(1, Math.round(w.innerWidth * ratio));
    const height = Math.max(1, Math.round(w.innerHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = w.innerWidth + 'px';
      canvas.style.height = w.innerHeight + 'px';
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    scheduleFrame();
  }

  function rgba(hex, alpha) {
    const normalized = hex.replace('#', '');
    const value = parseInt(normalized.length === 3 ? normalized.split('').map(char => char + char).join('') : normalized, 16);
    return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
  }

  function drawField() {
    if (!context || !canvas || !fieldEnabled) return;
    const width = w.innerWidth;
    const height = w.innerHeight;
    const palette = state.world.field;
    context.clearRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = 'source-over';

    const amplitude = 9 + state.energy * 18;
    const offset = state.scrollProgress * Math.PI * 4;
    for (let band = 0; band < 7; band += 1) {
      const y = height * (0.12 + band * 0.135);
      const color = palette[band % palette.length];
      context.beginPath();
      context.moveTo(-20, y);
      for (let x = -20; x <= width + 30; x += 64) {
        const wave = Math.sin(x * 0.008 + band * 0.93 + offset) * amplitude;
        const pointerPull = finePointer.matches && !reduced.matches
          ? Math.max(0, 1 - Math.abs(x - state.pointerX * width) / (width * 0.5)) * (state.pointerY * height - y) * 0.035
          : 0;
        context.lineTo(x, y + wave + pointerPull);
      }
      context.strokeStyle = rgba(color, 0.085 + band * 0.008);
      context.lineWidth = band % 3 === 0 ? 1.25 : 0.75;
      context.stroke();
    }

    context.strokeStyle = rgba(state.world.trace, 0.12);
    context.lineWidth = 0.75;
    const axisX = Math.round(width * (0.18 + state.pointerX * 0.14));
    context.beginPath();
    context.moveTo(axisX, 0);
    context.lineTo(axisX, height);
    context.stroke();

    if (finePointer.matches && !reduced.matches) {
      const radius = 54 + state.energy * 42;
      context.beginPath();
      context.arc(state.pointerX * width, state.pointerY * height, radius, 0.18, Math.PI * 1.62);
      context.strokeStyle = rgba(state.world.accent, 0.18);
      context.lineWidth = 1;
      context.stroke();
    }
    context.restore();
  }

  function updateProgress() {
    const max = Math.max(1, d.documentElement.scrollHeight - w.innerHeight);
    state.scrollProgress = Math.max(0, Math.min(1, w.scrollY / max));
  }

  function onScroll() {
    const now = performance.now();
    const elapsed = Math.max(16, now - state.lastScrollAt);
    const delta = Math.abs(w.scrollY - state.lastScrollY);
    state.scrollVelocity = Math.min(1, delta / elapsed / 1.5);
    state.energy = Math.min(1, Math.max(state.energy * 0.72, state.scrollVelocity));
    state.lastScrollY = w.scrollY;
    state.lastScrollAt = now;
    updateProgress();
    scheduleFrame();
  }

  function onPointerMove(event) {
    if (!finePointer.matches || reduced.matches || !flags.tectonicType) return;
    const now = performance.now();
    const elapsed = Math.max(16, now - state.lastPointerAt);
    const distance = Math.hypot(event.clientX - state.lastPointerX, event.clientY - state.lastPointerY);
    state.pointerX = Math.max(0, Math.min(1, event.clientX / Math.max(1, w.innerWidth)));
    state.pointerY = Math.max(0, Math.min(1, event.clientY / Math.max(1, w.innerHeight)));
    state.pointerVelocity = Math.min(1, distance / elapsed / 1.4);
    state.energy = Math.min(1, Math.max(state.energy * 0.78, state.pointerVelocity));
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    state.lastPointerAt = now;
    scheduleFrame();
  }

  function clearResonance() {
    d.querySelectorAll('[data-frqm-node].frqm-source,[data-frqm-node].frqm-echo').forEach(node => {
      node.classList.remove('frqm-source', 'frqm-echo');
      node.style.removeProperty('--frqm-wave');
    });
  }

  function resonate(source) {
    if (!flags.resonance || reduced.matches || !finePointer.matches || !source) return;
    clearResonance();
    source.classList.add('frqm-source');
    const group = source.parentElement || source.closest('section') || d;
    const siblings = Array.from(group.querySelectorAll('[data-frqm-node]')).slice(0, 18);
    const sourceIndex = Math.max(0, siblings.indexOf(source));
    siblings.forEach((node, index) => {
      if (node === source) return;
      const distance = Math.abs(index - sourceIndex);
      node.classList.add('frqm-echo');
      node.style.setProperty('--frqm-wave', String(Math.max(0.08, 1 - distance * 0.16)));
    });
  }

  function onPointerOver(event) {
    const source = event.target.closest && event.target.closest('[data-frqm-node]');
    if (source && !source.contains(event.relatedTarget)) resonate(source);
  }

  function onPointerOut(event) {
    const source = event.target.closest && event.target.closest('[data-frqm-node]');
    if (source && !source.contains(event.relatedTarget)) clearResonance();
  }

  function onFocusIn(event) {
    const source = event.target.closest && event.target.closest('[data-frqm-node]');
    if (source) resonate(source);
  }

  function inscription(event) {
    if (!flags.inscriptions || reduced.matches) return;
    const target = event.target.closest && event.target.closest('a,button,[role="button"],summary');
    if (!target || target.closest('#frqm-spine,#frqm-veil')) return;
    rememberClick();
    const x = Number.isFinite(event.clientX) && event.clientX > 0 ? event.clientX : w.innerWidth / 2;
    const y = Number.isFinite(event.clientY) && event.clientY > 0 ? event.clientY : w.innerHeight / 2;
    const mark = make('span', 'frqm-inscription', { 'aria-hidden': 'true' });
    const ring = make('i', 'frqm-inscription-ring');
    const slash = make('i', 'frqm-inscription-slash');
    const label = make('b', 'frqm-inscription-label');
    label.textContent = `${state.world.index}.${String(state.clickCount).padStart(2, '0')} / ${Math.round(x)}:${Math.round(y)}`;
    mark.style.left = x + 'px';
    mark.style.top = y + 'px';
    mark.append(ring, slash, label);
    d.body.append(mark);
    created.push(mark);
    const remove = () => {
      mark.remove();
      const index = created.indexOf(mark);
      if (index >= 0) created.splice(index, 1);
    };
    mark.addEventListener('animationend', remove, { once: true });
    w.setTimeout(remove, 2600);
  }

  function playTransition(previousKey) {
    if (!veil || !flags.transitions || reduced.matches) return;
    veil.dataset.from = previousKey || state.world.key;
    veil.dataset.to = state.world.key;
    const code = veil.querySelector('.frqm-veil-code');
    if (code) code.textContent = `${state.world.index} / ${state.world.title}`;
    veil.classList.remove('is-active');
    void veil.offsetWidth;
    veil.classList.add('is-active');
  }

  function setWorld(viewId, transition) {
    const next = WORLDS[viewId] || WORLDS['view-home'];
    const previous = state.world;
    state.viewId = WORLDS[viewId] ? viewId : 'view-home';
    state.world = next;
    state.scrollVelocity = 0;
    state.scrollProgress = 0;
    if (root.dataset.frqmWorld !== next.key) root.dataset.frqmWorld = next.key;
    if (spineCoordinate) spineCoordinate.textContent = `ꟻR / ${next.index} / ${next.title}`;
    if (spineIndex) spineIndex.textContent = next.index + ' / 06';
    if (spineTitle) spineTitle.textContent = next.title;
    if (spineLine) spineLine.textContent = next.line;
    if (transition && previous.key !== next.key) playTransition(previous.key);
    classifyNodes(d.getElementById(state.viewId));
    updateProgress();
    scheduleFrame();
  }

  function onViewChanged(event) {
    const viewId = event.detail && event.detail.viewId ? event.detail.viewId : activeViewId();
    setWorld(viewId, true);
  }

  function onMotionPreference() {
    if (root.classList.contains('frqm-reduced') !== reduced.matches) root.classList.toggle('frqm-reduced', reduced.matches);
    root.classList.toggle('frqm-lite', reduced.matches);
    root.classList.toggle('frqm-ready', !reduced.matches);
    state.pointerX = 0.5;
    state.pointerY = 0.5;
    state.energy = 0;
    clearResonance();
    scheduleFrame();
  }

  function onPointerPreference() {
    if (root.classList.contains('frqm-fine-pointer') !== finePointer.matches) root.classList.toggle('frqm-fine-pointer', finePointer.matches);
    if (!finePointer.matches) clearResonance();
    scheduleFrame();
  }

  function audit() {
    return Object.freeze({
      version: VERSION,
      enabled: flags.enabled,
      viewId: state.viewId,
      world: state.world.key,
      reducedMotion: reduced.matches,
      finePointer: finePointer.matches,
      saveData,
      fieldEnabled,
      classifiedNodes: d.querySelectorAll('[data-frqm-node]').length,
      clickMemory: state.clickCount
    });
  }

  function refresh() {
    if (state.destroyed || !flags.enabled) return audit();
    classifyNodes(d.getElementById(activeViewId()));
    setWorld(activeViewId(), false);
    resizeField();
    return audit();
  }

  function destroy() {
    if (state.destroyed) return;
    state.destroyed = true;
    controller.abort();
    if (state.frame) w.cancelAnimationFrame(state.frame);
    if (state.resizeFrame) w.cancelAnimationFrame(state.resizeFrame);
    reduced.removeEventListener && reduced.removeEventListener('change', onMotionPreference);
    finePointer.removeEventListener && finePointer.removeEventListener('change', onPointerPreference);
    clearResonance();
    d.querySelectorAll('[data-frqm-node]').forEach(node => {
      delete node.dataset.frqmNode;
      node.style.removeProperty('--frqm-node-index');
    });
    d.querySelectorAll('[data-frqm-aperture]').forEach(node => delete node.dataset.frqmAperture);
    created.slice().forEach(node => node.remove());
    created.length = 0;
    d.querySelectorAll('.view-section').forEach(view => {
      view.style.removeProperty('--frqm-px');
      view.style.removeProperty('--frqm-py');
    });
    const nav = d.getElementById('smart-nav');
    if (nav) nav.style.removeProperty('--frqm-progress');
    delete root.dataset.frqmWorld;
    root.classList.remove('frqm-ready', 'frqm-lite', 'frqm-reduced', 'frqm-fine-pointer');
  }

  function boot() {
    if (!flags.enabled) return;
    restoreMemory();
    if (!reduced.matches) {
      installAtmosphere();
      installSpine();
      installVeil();
    }
    onMotionPreference();
    onPointerPreference();
    setWorld(activeViewId(), false);
    resizeField();

    w.addEventListener('scroll', onScroll, { passive: true, signal });
    w.addEventListener('resize', () => {
      if (state.resizeFrame) return;
      state.resizeFrame = w.requestAnimationFrame(() => {
        state.resizeFrame = 0;
        resizeField();
        updateProgress();
      });
    }, { passive: true, signal });
    w.addEventListener('pointermove', onPointerMove, { passive: true, signal });
    d.addEventListener('pointerover', onPointerOver, { passive: true, signal });
    d.addEventListener('pointerout', onPointerOut, { passive: true, signal });
    d.addEventListener('focusin', onFocusIn, { signal });
    d.addEventListener('focusout', clearResonance, { signal });
    d.addEventListener('click', inscription, { signal });
    d.addEventListener('frViewChanged', onViewChanged, { signal });
    d.addEventListener('visibilitychange', () => {
      if (!d.hidden) scheduleFrame();
    }, { signal });
    w.addEventListener('pagehide', event => {
      if (!event.persisted) destroy();
    }, { signal });
    reduced.addEventListener && reduced.addEventListener('change', onMotionPreference);
    finePointer.addEventListener && finePointer.addEventListener('change', onPointerPreference);

    d.dispatchEvent(new CustomEvent('frQuietyMoneyReady', { detail: audit() }));
  }

  const api = Object.freeze({ version: VERSION, worlds: WORLDS, flags, audit, refresh, destroy });
  w.__FR_QUIETY_MONEY__ = api;
  w.FR_QUIETY_MONEY = api;

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
