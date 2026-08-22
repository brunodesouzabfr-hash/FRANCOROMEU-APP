#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const repoRoot = process.cwd();
const labRoot = path.resolve(option('--lab-root') || process.env.FR_LAB_ROOT || path.join(os.homedir(), 'FR-Design-Lab'));
const capturesRoot = path.join(labRoot, 'captures');
const docsRoot = path.join(repoRoot, 'docs', 'fr-etapa16', 'references');
const localRoot = path.join(repoRoot, '.fr-context');

if (!fs.existsSync(path.join(repoRoot, '.git'))) {
  console.error('ERRO: execute esta ferramenta na raiz do repositório FRANCOROMEU-APP.');
  process.exit(1);
}
if (!fs.existsSync(capturesRoot)) {
  console.error(`ERRO: diretório de capturas não encontrado: ${capturesRoot}`);
  process.exit(1);
}

const specs = [
  { slug: 'vanlent-grid', host: 'vanlent.dev', pathname: '/', purpose: 'Malha editorial, ritmo, grid lateral e hierarquia; nunca copiar paleta, textos ou assets.' },
  { slug: 'sergio-illustration', host: 'sergio-ayala.com', pathname: '/', hash: '#illustration', purpose: 'Interação do cubo e progressão por faces; excluir animação de letras e paleta.' },
  { slug: 'sd-spiral-gallery', host: 'sd-spiral-gallery.vercel.app', pathname: '/', purpose: 'Campo espacial/espiral como atmosfera progressiva do Portfólio.' },
  { slug: 'inspiring-side-scroll', host: 'inspiring.nk.studio', pathname: '/es', purpose: 'Side-scrolling gravitacional e progressão horizontal; traduzir para tokens FR.' },
  { slug: 'bloom-overview', host: 'bloom3d.studio', pathname: '/', purpose: 'Estrutura minimalista suíça, lista expansível e espaçamento da nova base de Ambientes.' },
  { slug: 'bloom-morven', host: 'bloom3d.studio', pathname: '/projects/morven', purpose: 'Dossiê/drawer imersivo de detalhe de uma linguagem de ambiente.' }
];

const curatedNames = [
  'capture-meta.json',
  'analysis-brief.md',
  'codex-summary.md',
  'design-system-reference.md',
  'design-system.json',
  'fr-translation-plan.md',
  'evidence.md'
];

function cleanHost(hostname) {
  return String(hostname || '').toLowerCase().replace(/^www\./, '');
}

function cleanPath(pathname) {
  const value = String(pathname || '/').replace(/\/+$/, '');
  return value || '/';
}

function urlFromMeta(meta) {
  const candidates = [meta?.requestedUrl, meta?.finalUrls?.desktop, meta?.finalUrls?.mobile].filter(Boolean);
  for (const candidate of candidates) {
    try { return new URL(candidate); } catch { /* tenta o próximo */ }
  }
  return null;
}

function matches(meta, spec) {
  const url = urlFromMeta(meta);
  if (!url) return false;
  if (cleanHost(url.hostname) !== spec.host) return false;
  if (cleanPath(url.pathname) !== cleanPath(spec.pathname)) return false;
  if (!spec.hash) return true;
  const scope = String(meta.scopeCss || meta.scope || meta.captureScope || '');
  return url.hash === spec.hash || scope === spec.hash;
}

function analyzed(directory) {
  return curatedNames.slice(1, 6).some((name) => fs.existsSync(path.join(directory, name)));
}

function timestamp(record) {
  const parsed = Date.parse(record.meta.finishedAt || record.meta.startedAt || '');
  if (Number.isFinite(parsed)) return parsed;
  return Number(path.basename(record.directory).replace(/\D/g, '')) || 0;
}

function scanCaptures() {
  const records = [];
  for (const hostEntry of fs.readdirSync(capturesRoot, { withFileTypes: true })) {
    if (!hostEntry.isDirectory()) continue;
    const hostPath = path.join(capturesRoot, hostEntry.name);
    for (const captureEntry of fs.readdirSync(hostPath, { withFileTypes: true })) {
      if (!captureEntry.isDirectory()) continue;
      const directory = path.join(hostPath, captureEntry.name);
      const metaPath = path.join(directory, 'capture-meta.json');
      if (!fs.existsSync(metaPath) || !analyzed(directory)) continue;
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        records.push({ directory, meta });
      } catch (error) {
        console.warn(`AVISO: metadados inválidos ignorados em ${metaPath}: ${error.message}`);
      }
    }
  }
  return records;
}

function copyCurated(record, spec) {
  const destination = path.join(docsRoot, spec.slug);
  fs.mkdirSync(destination, { recursive: true });
  const copied = [];
  for (const name of curatedNames) {
    const source = path.join(record.directory, name);
    if (!fs.existsSync(source)) continue;
    fs.copyFileSync(source, path.join(destination, name));
    copied.push(name);
  }
  return copied;
}

function copyScreenshots(record, spec) {
  const sourceRoot = path.join(record.directory, 'screenshots');
  if (!fs.existsSync(sourceRoot)) return [];
  const destination = path.join(localRoot, 'screenshots', spec.slug);
  fs.mkdirSync(destination, { recursive: true });
  const copied = [];
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(png|jpe?g|webp)$/i.test(entry.name)) continue;
    fs.copyFileSync(path.join(sourceRoot, entry.name), path.join(destination, entry.name));
    copied.push(path.join('.fr-context', 'screenshots', spec.slug, entry.name));
  }
  return copied;
}

function addLocalExclude() {
  try {
    const gitPath = execFileSync('git', ['rev-parse', '--git-path', 'info/exclude'], { cwd: repoRoot, encoding: 'utf8' }).trim();
    const excludePath = path.resolve(repoRoot, gitPath);
    fs.mkdirSync(path.dirname(excludePath), { recursive: true });
    const current = fs.existsSync(excludePath) ? fs.readFileSync(excludePath, 'utf8') : '';
    if (!current.split(/\r?\n/).includes('.fr-context/')) {
      fs.appendFileSync(excludePath, `${current.endsWith('\n') || !current ? '' : '\n'}# Contexto visual local do FR Lab\n.fr-context/\n`);
    }
  } catch (error) {
    console.warn(`AVISO: não foi possível adicionar .fr-context/ ao exclude local: ${error.message}`);
  }
}

const records = scanCaptures();
const selected = [];
const missing = [];

fs.mkdirSync(docsRoot, { recursive: true });
fs.mkdirSync(localRoot, { recursive: true });
addLocalExclude();

for (const spec of specs) {
  const candidates = records.filter((record) => matches(record.meta, spec)).sort((a, b) => timestamp(b) - timestamp(a));
  if (!candidates.length) {
    missing.push(spec);
    continue;
  }
  const record = candidates[0];
  selected.push({
    ...spec,
    sourceDirectory: record.directory,
    requestedUrl: record.meta.requestedUrl,
    finishedAt: record.meta.finishedAt || null,
    files: copyCurated(record, spec),
    screenshots: copyScreenshots(record, spec)
  });
}

const indexJson = { generatedAt: new Date().toISOString(), labRoot, selected, missing: missing.map(({ slug, host, pathname, hash }) => ({ slug, host, pathname, hash: hash || '' })) };
fs.writeFileSync(path.join(docsRoot, 'index.json'), `${JSON.stringify(indexJson, null, 2)}\n`);

const rows = selected.map((item) => `| ${item.slug} | ${item.requestedUrl || `${item.host}${item.pathname}`} | ${item.finishedAt || 'sem data'} | ${item.purpose} | ${item.files.join(', ')} |`);
const missingList = missing.length ? missing.map((item) => `- \`${item.slug}\`: ${item.host}${item.pathname}${item.hash || ''}`).join('\n') : '- Nenhuma.';
const markdown = `# Índice de referências curadas\n\nGerado automaticamente por \`tools/fr-context-prepare.mjs\`. Os arquivos brutos continuam no FR Lab e não são fonte de código para cópia.\n\n| Referência | URL | Captura selecionada | Uso FR permitido | Arquivos curados |\n| --- | --- | --- | --- | --- |\n${rows.join('\n')}\n\n## Referências ausentes\n\n${missingList}\n\n## Regra de uso\n\nAs referências descrevem princípios de interação, ritmo, hierarquia e estrutura. Não copiar marca, textos, código, DOM, classes, imagens, shaders, paleta ou identidade proprietária. Toda implementação deve ser original, usar os tokens FR e permanecer reversível.\n`;
fs.writeFileSync(path.join(docsRoot, 'INDEX.md'), markdown);

console.log(`Capturas analisadas encontradas: ${records.length}`);
console.log(`Referências selecionadas: ${selected.length}/${specs.length}`);
for (const item of selected) console.log(`  OK ${item.slug} <- ${item.sourceDirectory}`);
for (const item of missing) console.log(`  AUSENTE ${item.slug} (${item.host}${item.pathname}${item.hash || ''})`);
console.log(`Índice: ${path.join(docsRoot, 'INDEX.md')}`);
console.log('Arquivos brutos não foram copiados.');

if (missing.length) process.exitCode = 2;

