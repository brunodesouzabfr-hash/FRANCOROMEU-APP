'use strict';

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function displayToken(value) {
  return String(value || '').replaceAll('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function eligible(media) {
  return Boolean(media && media.canonicalFile && media.nature !== 'REFERENCE_EXTERNAL' && !(media.hold_reasons || []).length && media.publication?.status !== 'HOLD');
}

function label(project, media) {
  if (project.type === 'ILLUSTRATIVE_BEFORE_AFTER') return 'DEPOIS ILUSTRATIVO';
  if (project.type === 'MATERIAL_APPLICATION_STUDY') return 'ESTUDO DE MATERIALIDADE';
  if (media.nature === 'ILLUSTRATIVE') return 'IMAGEM ILUSTRATIVA';
  return media.required_public_label || media.label || 'NATUREZA EM REVISÃO';
}

module.exports = function addJournalBlocks(input) {
  const { html, projects, projectMedia, projectRoute, maps } = input;
  const chosen = [];
  const seen = new Set();
  const preferred = [projects.find(project => project.project_id === 'FR-C001'), ...projects].filter(Boolean);
  for (const project of preferred) {
    const media = projectMedia(project);
    const environment = project.environment_ids[0] || project.project_id;
    if (!eligible(media) || seen.has(environment)) continue;
    chosen.push(project);
    seen.add(environment);
    if (chosen.length === 5) break;
  }
  if (chosen.length < 2) throw new Error('Patch aditivo: mídia elegível insuficiente para o Jornal');

  const cards = chosen.map((project, index) => {
    const media = projectMedia(project);
    const variant = media.variants.find(item => item.canonical) || media.variants[media.variants.length - 1] || { width: 1600, height: 1200 };
    const environment = project.environment_ids.map(id => maps.environments.get(id)?.name).filter(Boolean).join(' / ');
    const title = String(project.title).replace(/^Estudo (?:ilustrativo|de materialidade)\s*[—:-]\s*/i, '');
    const factualLabel = label(project, media);
    const tags = [environment, ...project.material_ids.map(displayToken), ...project.service_ids.map(displayToken)].filter(Boolean).slice(0, 3);
    const sources = media.variants.filter(item => item.path && item.width).map(item => '/' + esc(item.path) + ' ' + Number(item.width) + 'w').join(', ');
    return '<article class="frap-journal-card frap-scene" data-frap-scene data-frap-variant="journal" data-frap-title="' + esc(title) + '">' +
      '<figure><img src="/' + esc(media.canonicalFile) + '"' + (sources ? ' srcset="' + sources + '" sizes="(max-width: 780px) 92vw, 58vw"' : '') + ' width="' + Number(variant.width) + '" height="' + Number(variant.height) + '" alt="' + esc(media.alt) + '" loading="lazy" decoding="async"><figcaption><strong>' + esc(factualLabel) + '</strong>' + esc(media.caption) + '</figcaption></figure>' +
      '<div class="frap-journal-copy"><p class="frap-index">' + String(index + 1).padStart(2, '0') + ' / ' + String(chosen.length).padStart(2, '0') + '</p><h3>' + esc(title) + '</h3><p>' + (environment ? 'Leitura editorial de ' + esc(environment) + '. ' : '') + 'O dossiê preserva a natureza e a proveniência desta imagem.</p><ul aria-label="Contexto">' + tags.map(tag => '<li>' + esc(tag) + '</li>').join('') + '</ul><div class="frap-actions"><a href="' + esc(projectRoute(project)) + '">Explorar o estudo</a><a href="#arquivo">Ir ao índice completo</a></div></div>' +
      '</article>';
  }).join('');

  const section = '<section class="frap-root frap-journal" id="frap-journal" data-frap-journal aria-labelledby="frap-journal-title"><canvas data-frap-shader aria-hidden="true"></canvas><header class="frap-section-head"><div><p class="frap-kicker">PERCURSO VISUAL / PROJETOS FR</p><h2 id="frap-journal-title">A imagem encontra contexto.</h2><p>Cinco entradas do acervo ampliam a leitura sem substituir o Jornal, os filtros ou as 109 leituras existentes.</p></div><a href="#arquivo">Ir direto ao índice completo</a></header><div class="frap-journal-list">' + cards + '</div></section>';

  return html
    .replace('<link rel="stylesheet" href="/assets/css/fr-journal.css">', '<link rel="stylesheet" href="/assets/css/fr-journal.css"><link rel="stylesheet" href="/assets/patches/fr-additions-2026-10-14/fr-additions.css">')
    .replace('<section class="frj-archive" id="arquivo"', section + '<section class="frj-archive" id="arquivo"')
    .replace('<script src="/assets/js/fr-journal.js"></script>', '<script src="/assets/patches/fr-additions-2026-10-14/fr-additions-shader.js"></script><script src="/assets/patches/fr-additions-2026-10-14/fr-additions.js" data-frap-map="/assets/patches/fr-additions-2026-10-14/service-media-map.json"></script><script src="/assets/js/fr-journal.js"></script>');
};
