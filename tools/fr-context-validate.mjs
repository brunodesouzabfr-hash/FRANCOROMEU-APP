#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'docs/fr-etapa16/MASTER-BRIEF.md',
  'docs/fr-etapa16/HTML-AUDIT-ETAPA15.md',
  'docs/fr-etapa16/REFERENCE-MAP.md',
  'docs/fr-etapa16/CONTENT-BLUEPRINT.md',
  'docs/fr-etapa16/EMBED-CONTRACT.md',
  'docs/fr-etapa16/ETHICAL-CRO-POLICY.md',
  'docs/fr-etapa16/REGRESSION-CHECKLIST.md',
  'prompts/CODEX-IMPLEMENTAR-ETAPA16.md',
  'content/examples/fr-social-embeds.example.json',
  'content/examples/fr-pricing-guide.example.json'
];

let failures = 0;
for (const relative of required) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute) || fs.statSync(absolute).size === 0) {
    console.error(`FALHA: arquivo ausente ou vazio: ${relative}`);
    failures++;
  } else {
    console.log(`OK: ${relative}`);
  }
}

for (const relative of required.filter((name) => name.endsWith('.json'))) {
  try {
    JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
  } catch (error) {
    console.error(`FALHA: JSON inválido em ${relative}: ${error.message}`);
    failures++;
  }
}

const referenceIndex = path.join(root, 'docs/fr-etapa16/references/index.json');
if (fs.existsSync(referenceIndex)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(referenceIndex, 'utf8'));
    console.log(`OK: índice de capturas com ${parsed.selected?.length || 0} referência(s).`);
    if (parsed.missing?.length) console.warn(`AVISO: ${parsed.missing.length} referência(s) ainda ausente(s).`);
  } catch (error) {
    console.error(`FALHA: índice de capturas inválido: ${error.message}`);
    failures++;
  }
} else {
  console.warn('AVISO: execute tools/fr-context-prepare.mjs para gerar o índice das capturas.');
}

if (failures) {
  console.error(`Validação encerrada com ${failures} falha(s).`);
  process.exit(1);
}
console.log('Contexto Etapa 16 validado. Nenhuma aplicação ou API foi executada.');

