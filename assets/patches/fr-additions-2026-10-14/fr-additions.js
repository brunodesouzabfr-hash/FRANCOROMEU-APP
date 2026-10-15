(function (global, document) {
  'use strict';

  if (global.FRAdditionsPatch) return;

  var flags = global.FR_ADDITIONS_PATCH_FLAGS = Object.assign({
    enabled: true,
    home: true,
    about: true,
    environments: true,
    project3d: true,
    portfolio: true,
    servicePreview: true,
    journal: true,
    webgl: true
  }, global.FR_ADDITIONS_PATCH_FLAGS || {});

  var state = {
    mounted: false,
    destroyed: false,
    frame: 0,
    roots: [],
    listeners: [],
    observers: [],
    renderer: null,
    lastScroll: 0,
    lastTime: 0,
    version: 'fr-additions-2026-10-14'
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clean(value, fallback) {
    var text = String(value == null ? '' : value).replace(/[<>]/g, '').trim();
    return text || fallback || '';
  }

  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      var url = new URL(value.trim(), document.baseURI);
      if (!/^https?:$/.test(url.protocol) || url.origin !== global.location.origin) return null;
      return url.href;
    } catch (error) {
      return null;
    }
  }

  function node(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }

  function listen(target, type, handler, options) {
    if (!target) return;
    target.addEventListener(type, handler, options);
    state.listeners.push(function () { target.removeEventListener(type, handler, options); });
  }

  function remember(root) {
    if (root) state.roots.push(root);
    return root;
  }

  function insertAfter(reference, addition) {
    if (!reference || !reference.parentNode || !addition) return false;
    reference.parentNode.insertBefore(addition, reference.nextSibling);
    return true;
  }

  function actions(items) {
    var host = node('div', 'frap-actions');
    (items || []).forEach(function (item) {
      var control = item.href ? node('a', '', item.label) : node('button', '', item.label);
      if (item.href) control.href = item.href;
      else control.type = 'button';
      if (item.view) control.dataset.frapNav = item.view;
      if (item.environment != null) control.dataset.frapOpenEnvironment = String(item.environment);
      if (item.project != null) control.dataset.frapOpenProject = String(item.project);
      if (item.project3d != null) control.dataset.frapOpen3d = String(item.project3d);
      host.appendChild(control);
    });
    return host;
  }

  function visual(options) {
    var host = node('div', 'frap-visual');
    if (options.image) {
      var source = safeUrl(options.image);
      if (source) {
        var figure = node('figure');
        var image = node('img');
        image.src = source;
        image.alt = clean(options.alt, 'Imagem do acervo Franco Romeu');
        image.loading = 'lazy';
        image.decoding = 'async';
        image.width = Number(options.width) || 1122;
        image.height = Number(options.height) || 1402;
        figure.append(image, node('figcaption', '', clean(options.label, 'NATUREZA EM REVISÃO')));
        host.appendChild(figure);
      }
    }
    if (Array.isArray(options.layers)) {
      var layers = node('div', 'frap-layers');
      options.layers.forEach(function (layer, index) {
        var card = node('article');
        card.style.setProperty('--frap-layer-index', String(index));
        card.append(node('span', '', String(index + 1).padStart(2, '0')), node('strong', '', layer.title), node('p', '', layer.text));
        layers.appendChild(card);
      });
      host.appendChild(layers);
    }
    var datum = node('div', 'frap-datum');
    datum.setAttribute('aria-hidden', 'true');
    host.appendChild(datum);
    return host;
  }

  function narrative(options) {
    var section = node('section', 'frap-root frap-scene frap-narrative frap-' + options.variant);
    section.id = options.id;
    section.dataset.frapScene = options.id;
    section.dataset.frapVariant = options.variant;
    section.setAttribute('aria-labelledby', options.id + '-title');
    var frame = node('div', 'frap-frame');
    var copy = node('div', 'frap-copy');
    copy.append(node('p', 'frap-kicker', options.kicker), node('h2', '', options.title), node('p', 'frap-description', options.copy));
    if (Array.isArray(options.steps)) {
      var steps = node('ol', 'frap-steps');
      options.steps.forEach(function (step, index) {
        var item = node('li');
        item.append(node('span', '', String(index + 1).padStart(2, '0')), node('strong', '', step));
        steps.appendChild(item);
      });
      copy.appendChild(steps);
    }
    copy.appendChild(actions(options.actions));
    frame.append(visual(options), copy);
    section.appendChild(frame);
    return section;
  }

  function mountHome() {
    if (!flags.home) return;
    var manifesto = document.getElementById('fr6-manifesto');
    var expertise = document.getElementById('fr6-expertise');
    if (!manifesto || !expertise) return;
    var structure = narrative({
      id: 'frap-home-structure',
      variant: 'gravity',
      kicker: 'FORJA / O INVISÍVEL',
      title: 'O que sustenta o resultado também merece ser visto.',
      copy: 'Planos, encontros e luz se separam para explicar relações de projeto. A imagem continua identificada como estudo ilustrativo.',
      image: '/assets/media/projects/cozinha-lavanderia/cozinha-env-lavanderia-imagem-ilustrativa-986cf34222.webp',
      alt: 'Imagem ilustrativa da integração entre cozinha e lavanderia',
      label: 'IMAGEM ILUSTRATIVA · NÃO COMPROVA EXECUÇÃO',
      actions: [{ label: 'Explorar projetos', view: 'view-projetos' }, { label: 'Estimar meu projeto', view: 'view-orcamento' }]
    });
    var surface = narrative({
      id: 'frap-home-surface',
      variant: 'surface',
      kicker: 'MATÉRIA / APLICAÇÃO',
      title: 'Observe a superfície. Entenda a aplicação.',
      copy: 'Uma abertura controlada aproxima detalhe, matéria e serviço sem transformar referência visual em garantia de acabamento.',
      image: '/assets/media/projects/cozinha-lavanderia/cozinha-bancada-l-imagem-ilustrativa-b239e59121.webp',
      alt: 'Imagem ilustrativa de bancada, frontão e encontro entre superfícies',
      label: 'IMAGEM ILUSTRATIVA · MATERIAL A CONFIRMAR',
      actions: [{ label: 'Ver Ambientes', view: 'view-ambientes' }, { label: 'Abrir orçamento', view: 'view-orcamento' }]
    });
    if (insertAfter(manifesto, structure)) remember(structure);
    if (insertAfter(expertise, surface)) remember(surface);
  }

  function mountAbout() {
    if (!flags.about) return;
    var hero = document.getElementById('sobre-hero-section');
    if (!hero) return;
    var section = narrative({
      id: 'frap-about-palimpsest',
      variant: 'palimpsest',
      kicker: 'PALIMPSESTO / MÉTODO',
      title: 'Camadas que explicam critério.',
      copy: 'O texto permanece legível enquanto as camadas distinguem observação, decisão e verificação — sem inventar biografia, prêmio ou tempo de mercado.',
      layers: [
        { title: 'O que se observa', text: 'Uso, contexto, restrições e condição disponível.' },
        { title: 'O que se decide', text: 'Proporção, matéria, compatibilização e prioridades.' },
        { title: 'O que se verifica', text: 'Escopo, interfaces, acabamento e próximos passos.' }
      ],
      actions: [{ label: 'Conhecer Ambientes', view: 'view-ambientes' }, { label: 'Vamos conversar', view: 'view-orcamento' }]
    });
    if (insertAfter(hero, section)) remember(section);
  }

  function mountEnvironments() {
    if (!flags.environments || document.getElementById('framb363-atlas')) return;
    var view = document.getElementById('view-ambientes');
    var museum = view && view.querySelector('.amb-museum');
    var styles = Array.isArray(global.AMB_STYLES) ? global.AMB_STYLES.slice(0, 3) : [];
    if (!view || !museum || styles.length < 3) return;
    var section = node('section', 'frap-root frap-environments');
    section.id = 'frap-environments';
    section.setAttribute('aria-labelledby', 'frap-environments-title');
    var header = node('header', 'frap-section-head');
    var intro = node('div');
    intro.append(node('p', 'frap-kicker', 'AMBIENTES / PÁTINA'), node('h2', '', 'Matéria, luz e proporção.'), node('p', '', 'Três leituras visuais são acrescentadas antes do atlas existente. As imagens representam linguagens de ambiente, não documentação de obra.'));
    var atlas = node('a', '', 'Abrir atlas completo · ' + String(global.AMB_STYLES.length));
    atlas.href = '#amb-grid-container';
    header.append(intro, atlas);
    var grid = node('div', 'frap-environment-grid');
    styles.forEach(function (style, index) {
      var card = node('article', 'frap-scene frap-environment-card');
      card.dataset.frapScene = 'environment-' + clean(style.id, index + 1);
      card.dataset.frapVariant = 'environment';
      var media = visual({
        image: style.img,
        alt: 'Referência visual da linguagem ' + clean(style.name, 'de ambiente'),
        label: 'REFERÊNCIA VISUAL · LINGUAGEM DE AMBIENTE',
        width: 1600,
        height: 1100
      });
      var copy = node('div', 'frap-copy');
      copy.append(node('p', 'frap-index', String(index + 1).padStart(2, '0') + ' / 03'), node('h3', '', clean(style.name, 'Ambiente')), node('strong', 'frap-essence', clean(style.essence, 'Linguagem de ambiente')), node('p', 'frap-description', clean(style.desc, 'Referência visual para conversa de projeto.')));
      var sequence = node('ol', 'frap-steps');
      var palette = Array.isArray(style.palette) ? style.palette.slice(0, 3).join(' · ') : 'Paleta a confirmar';
      var services = Array.isArray(style.services) ? style.services.slice(0, 2).map(function (service) { return clean(service.role || service.id); }).join(' · ') : 'Serviços a confirmar';
      [['Ambiente', style.name], ['Matéria e luz', palette], ['Serviços relacionados', services]].forEach(function (entry, entryIndex) {
        var item = node('li');
        item.append(node('span', '', String(entryIndex + 1).padStart(2, '0')), node('strong', '', entry[0] + ' — ' + clean(entry[1])));
        sequence.appendChild(item);
      });
      copy.append(sequence, actions([{ label: 'Explorar este ambiente', environment: index }, { label: 'Voltar ao atlas', href: '#amb-grid-container' }]));
      var frame = node('div', 'frap-frame');
      frame.append(media, copy);
      card.appendChild(frame);
      grid.appendChild(card);
    });
    section.append(header, grid);
    view.insertBefore(section, museum);
    remember(section);
  }

  function mountProject3d() {
    if (!flags.project3d) return;
    var view = document.getElementById('view-projetos3d');
    var hero = view && view.querySelector('.p3d-hero');
    var projects = Array.isArray(global.P3D_PROJECTS) ? global.P3D_PROJECTS : [];
    if (!hero || !projects.length) return;
    var project = projects[0];
    var section = narrative({
      id: 'frap-3d-wireframe',
      variant: 'wireframe',
      kicker: 'WIREFRAME / ESTUDO CONCEITUAL',
      title: 'O espaço ensaia antes de existir.',
      copy: 'Uma única vista conceitual muda de leitura por camadas. Não é levantamento, modelo fiel nem sequência de obra executada.',
      image: project.img,
      alt: 'Estudo 3D conceitual: ' + clean(project.title, 'visualização espacial'),
      label: 'ESTUDO 3D · VISUALIZAÇÃO CONCEITUAL',
      width: 1600,
      height: 1100,
      steps: ['Desenho conceitual', 'Volume e proporção', 'Detalhe para decisão'],
      actions: [{ label: 'Abrir no laboratório 3D', project3d: 0 }, { label: 'Preparar estimativa', view: 'view-orcamento' }]
    });
    if (insertAfter(hero, section)) remember(section);
  }

  function projectSource() {
    var source = Array.isArray(global.GM_PROJECTS) ? global.GM_PROJECTS : global.FR_DEFAULT_PROJECTS;
    return (Array.isArray(source) ? source : []).filter(function (project) { return project && safeUrl(project.url || project.img); });
  }

  function distinctProjects(projects, limit) {
    var selected = [];
    var categories = new Set();
    projects.forEach(function (project) {
      var category = clean(project.cat, 'outros');
      if (selected.length >= limit || categories.has(category)) return;
      categories.add(category);
      selected.push(project);
    });
    return selected;
  }

  function mountPortfolio() {
    if (!flags.portfolio) return;
    var view = document.getElementById('view-projetos');
    var stage = view && view.querySelector('.fr10-portfolio-stage');
    var projects = projectSource();
    var selected = distinctProjects(projects, 5);
    if (!view || !stage || selected.length < 2) return;
    var section = node('section', 'frap-root frap-portfolio');
    section.id = 'frap-portfolio';
    section.setAttribute('aria-labelledby', 'frap-portfolio-title');
    var header = node('header', 'frap-section-head');
    var intro = node('div');
    intro.append(node('p', 'frap-kicker', 'PORTFÓLIO / ARQUIVO VIVO'), node('h2', '', 'Cada imagem pede contexto.'), node('p', '', 'Cinco conceitos visuais são acrescentados como percurso curto. O grid, os filtros e todos os registros existentes continuam logo abaixo.'));
    var journal = node('a', '', 'Abrir Jornal Técnico');
    journal.href = '/projetos/';
    header.append(intro, journal);
    var list = node('div', 'frap-portfolio-list');
    selected.forEach(function (project, index) {
      var article = node('article', 'frap-scene frap-portfolio-card');
      article.dataset.frapScene = 'portfolio-' + String(index + 1);
      article.dataset.frapVariant = 'portfolio';
      var frame = node('div', 'frap-portfolio-frame');
      var media = visual({
        image: project.url || project.img,
        alt: 'Conceito visual: ' + clean(project.title, 'estudo do acervo'),
        label: 'CONCEITO VISUAL · NÃO COMPROVA EXECUÇÃO',
        width: 1600,
        height: 1200
      });
      var copy = node('div', 'frap-copy');
      copy.append(node('p', 'frap-index', String(index + 1).padStart(2, '0') + ' / ' + String(selected.length).padStart(2, '0')), node('h3', '', clean(project.title, 'Conceito visual')), node('p', 'frap-description', 'Conceito de ' + clean(project.catLabel || project.cat, 'materialidade') + ', apresentado sem alegação de obra executada.'));
      var tags = node('ul', 'frap-tags');
      [clean(project.catLabel || project.cat, 'Conceito visual'), 'Acervo FR', 'Referência visual'].forEach(function (tag) { tags.appendChild(node('li', '', tag)); });
      copy.append(tags, actions([{ label: 'Explorar o estudo', project: projects.indexOf(project) }, { label: 'Ver grid completo', href: '#projects-container' }]));
      frame.append(media, copy);
      article.appendChild(frame);
      list.appendChild(article);
    });
    section.append(header, list);
    stage.parentNode.insertBefore(section, stage);
    remember(section);
  }

  function sceneActive(scene) {
    var view = scene.closest('.view-section');
    return !view || view.classList.contains('active');
  }

  function progressFor(element) {
    var rect = element.getBoundingClientRect();
    return clamp((global.innerHeight - rect.top) / Math.max(1, global.innerHeight + rect.height), 0, 1);
  }

  function update() {
    state.frame = 0;
    if (state.destroyed || document.hidden) return;
    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-frap-scene]').forEach(function (scene) {
      if (!sceneActive(scene)) return;
      var progress = reduced ? 0.5 : progressFor(scene);
      var energy = reduced ? 1 : Math.sin(progress * Math.PI);
      scene.style.setProperty('--frap-progress', progress.toFixed(4));
      scene.style.setProperty('--frap-energy', clamp(energy, 0, 1).toFixed(4));
      scene.style.setProperty('--frap-near', ((progress - 0.5) * 42).toFixed(2) + 'px');
      scene.style.setProperty('--frap-far', ((0.5 - progress) * 22).toFixed(2) + 'px');
      scene.style.setProperty('--frap-inset', ((1 - energy) * 9).toFixed(3) + '%');
      scene.style.setProperty('--frap-angle', ((0.5 - progress) * 8).toFixed(3) + 'deg');
      scene.dataset.frapState = reduced ? 'essential' : progress <= 0 ? 'normal' : progress >= 1 ? 'restored' : progress < 0.2 ? 'entering' : progress > 0.82 ? 'exiting' : 'immersive';
    });
    var journal = document.querySelector('[data-frap-journal]');
    if (journal && state.renderer) {
      var rect = journal.getBoundingClientRect();
      var visible = rect.bottom > 0 && rect.top < global.innerHeight;
      if (visible && !reduced) {
        state.renderer.resume();
        var now = global.performance ? performance.now() : Date.now();
        var elapsed = Math.max(16, now - (state.lastTime || now));
        var scroll = global.scrollY || 0;
        var velocity = clamp((scroll - state.lastScroll) / elapsed, -1, 1);
        state.renderer.render(progressFor(journal), velocity);
        state.lastScroll = scroll;
        state.lastTime = now;
      } else state.renderer.suspend();
    }
  }

  function schedule() {
    if (!state.frame && !state.destroyed) state.frame = global.requestAnimationFrame(update);
  }

  function bindActions() {
    listen(document, 'click', function (event) {
      var navigation = event.target.closest('[data-frap-nav]');
      if (navigation && typeof global.switchView === 'function') {
        global.switchView(navigation.dataset.frapNav);
        return;
      }
      var environment = event.target.closest('[data-frap-open-environment]');
      if (environment && typeof global.openAmbDetail === 'function') {
        global.openAmbDetail(Number(environment.dataset.frapOpenEnvironment), { silent: true });
        return;
      }
      var project = event.target.closest('[data-frap-open-project]');
      if (project) {
        var projects = projectSource();
        var record = projects[Number(project.dataset.frapOpenProject)];
        if (record && typeof global.openProjectModal === 'function') global.openProjectModal(record);
        else {
          var legacy = document.querySelector('[data-fr16-project-index="' + Number(project.dataset.frapOpenProject) + '"]');
          if (legacy) legacy.click();
        }
        return;
      }
      var project3d = event.target.closest('[data-frap-open-3d]');
      if (!project3d) return;
      var index = Number(project3d.dataset.frapOpen3d);
      if (global.FR_STAGE15 && typeof global.FR_STAGE15.selectProject3D === 'function') global.FR_STAGE15.selectProject3D(index, false);
      var target = document.querySelector('#view-projetos3d .fr15-p3d-lab, #view-projetos3d .p3d-showcase');
      if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  function mountJournal() {
    var root = document.querySelector('[data-frap-journal]');
    if (!root) return;
    if (!flags.journal) {
      root.hidden = true;
      return;
    }
    if (flags.webgl && typeof global.FRAdditionsShaderRenderer === 'function') {
      var canvas = root.querySelector('[data-frap-shader]');
      state.renderer = new global.FRAdditionsShaderRenderer(canvas, { family: 'capillarity', amplitude: 0.72, seed: 0.618, quality: 0.8 });
      state.renderer.mount();
      listen(root, 'pointermove', function (event) {
        if (!state.renderer) return;
        var rect = root.getBoundingClientRect();
        state.renderer.setPointer((event.clientX - rect.left) / Math.max(1, rect.width), (event.clientY - rect.top) / Math.max(1, rect.height));
        schedule();
      }, { passive: true });
    }
  }

  function mount() {
    if (state.mounted || state.destroyed || !flags.enabled) return audit();
    state.mounted = true;
    mountHome();
    mountAbout();
    mountEnvironments();
    mountProject3d();
    mountPortfolio();
    mountJournal();
    bindActions();
    listen(global, 'scroll', schedule, { passive: true });
    listen(global, 'resize', schedule, { passive: true });
    listen(global, 'pageshow', schedule, false);
    listen(global, 'popstate', schedule, false);
    listen(document, 'visibilitychange', schedule, false);
    listen(document, 'frViewChanged', schedule, false);
    if ('IntersectionObserver' in global) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { entry.target.toggleAttribute('data-frap-visible', entry.isIntersecting); });
        schedule();
      }, { rootMargin: '12% 0px', threshold: [0, 0.2, 0.6] });
      document.querySelectorAll('[data-frap-scene]').forEach(function (scene) { observer.observe(scene); });
      state.observers.push(observer);
    }
    schedule();
    document.dispatchEvent(new CustomEvent('frAdditionsPatchReady', { detail: audit() }));
    return audit();
  }

  function refresh() {
    schedule();
    if (global.FRAdditionsServicePreview && global.FRAdditionsServicePreview.refresh) global.FRAdditionsServicePreview.refresh();
    return audit();
  }

  function destroy() {
    if (state.destroyed) return;
    state.destroyed = true;
    if (state.frame) global.cancelAnimationFrame(state.frame);
    state.frame = 0;
    while (state.listeners.length) state.listeners.pop()();
    state.observers.forEach(function (observer) { observer.disconnect(); });
    state.observers = [];
    if (state.renderer) state.renderer.destroy();
    state.renderer = null;
    if (global.FRAdditionsServicePreview && global.FRAdditionsServicePreview.destroy) global.FRAdditionsServicePreview.destroy();
    state.roots.forEach(function (root) { if (root.isConnected) root.remove(); });
    state.roots = [];
    var journal = document.querySelector('[data-frap-journal]');
    if (journal) journal.hidden = true;
    state.mounted = false;
  }

  function audit() {
    var roots = Array.from(document.querySelectorAll('.frap-root'));
    return {
      version: state.version,
      mounted: state.mounted,
      destroyed: state.destroyed,
      roots: roots.map(function (root) { return root.id; }),
      scenes: document.querySelectorAll('[data-frap-scene]').length,
      managedListeners: state.listeners.length,
      rafActive: state.frame ? 1 : 0,
      renderer: state.renderer ? state.renderer.audit() : null,
      existingLayoutHiddenByPatch: 0,
      financialMutations: 0,
      wheelListeners: 0,
      touchListeners: 0
    };
  }

  global.FRAdditionsPatch = { mount: mount, refresh: refresh, destroy: destroy, audit: audit, flags: flags };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})(window, document);
