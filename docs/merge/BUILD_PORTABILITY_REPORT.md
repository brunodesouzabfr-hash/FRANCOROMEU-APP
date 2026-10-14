# Relatório de portabilidade do build

## Falha histórica comprovada

O deployment Vercel `dpl_BgEg3WvsgTexJ5xB6h5VvJZgZRuc`, do commit candidato `f9a5f1147719`, falhou em 13/10/2026. Os logs registram como primeiro erro fatal:

`ENOENT: no such file or directory, lstat '/vercel/path0/CODEX USE AQUI'`

A pilha aponta para `realpathSync` em `src/media-library.cjs`, chamado por `scripts/prepare-project-library.cjs` durante `npm run build`. Portanto, a causa raiz não era hipotética: o build dependia de uma pasta privada ausente no clone Vercel.

## Correção implementada

- `CODEX USE AQUI` tornou-se fonte histórica opcional.
- Dados públicos necessários vêm de `content/`, `prepared-media/editorial/`, `assets/media/` e snapshots versionados.
- `docs/additions/LEGACY_PROJECT_ROUTES_MAP.json` substitui a leitura de `CODEX USE AQUI/dist/projetos.html`.
- Ausência de fonte histórica é mantida como `SOURCE_UNAVAILABLE`.
- Caches, inventários, mapas transitórios e relatórios do build são gravados em `.artifacts/build/`, ignorado pelo Git.
- O build não reescreve CSVs ou documentos versionados.
- A saída pública é recriada em `dist/` e contém somente allowlists/ativos referenciados.

## Allowlist pública de raiz

- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- `browserconfig.xml`
- `favicon.ico`
- `BingSiteAuth.xml`
- `15371fdcae5446498483cb1385b2ccc3.txt`

## Evidência local

- `npm ci`: PASS, 54 pacotes, 0 vulnerabilidades reportadas.
- `npm run build`: PASS sem `CODEX USE AQUI` na worktree isolada.
- Output: 832 arquivos, 332 rotas e 284 mídias normalizadas.
- SHA-256 do HTML público final: `0e0e3cb52e5c89ba1700fc403160161e63f2edc901c08768d334c55c7429255e`.
- Fingerprint da árvore pública final: `f83093b5bb5629ea71e3a8e09d36ac407490482a8f434716eff6dc043f128604`.
- `node scripts/check-project-library.cjs`: PASS; 6.788 links, 2.919 imagens, 332 JSON-LD e 5 sitemaps verificados.
- `node scripts/check-build-idempotence.cjs`: PASS no estado final, com o mesmo fingerprint em duas execuções.
- Fontes privadas, ZIPs, CSVs, Markdown, God Mode e dados administrativos ausentes da `dist`.

## Ambiente Vercel

- Projeto confirmado por leitura: equipe `franco-romeu`, projeto `francoromeu-app`, root directory `.`.
- `vercel.json` define `npm run build`, output `dist` e `cleanUrls: true`, sobrepondo os defaults genéricos do projeto.
- Nenhum deploy manual foi executado; o Git criou automaticamente um preview.
- O commit `a969729` foi aberto em uma segunda worktree limpa, sem `.vercel`, `CODEX USE AQUI`, `dist`, `node_modules` ou artefatos herdados.
- Nessa worktree, `npm ci`, `npm run build`, `node scripts/check-project-library.cjs` e `node scripts/check-build-idempotence.cjs` passaram e reproduziram o fingerprint `f83093b5bb5629ea71e3a8e09d36ac407490482a8f434716eff6dc043f128604`.
- O preview Git `dpl_6zM7Ne5NeSLwswUwM2Hoc4Vw1A3v`, commit `90dba44`, terminou `READY`. O log confirma clone sem cache, 54 dependências instaladas, build de 832 artefatos, ausência de mutação de fontes e remoção do God Mode público.
- A Home, as seis rotas institucionais, `/projetos/`, uma página editorial, a 404 real, `robots.txt`, sitemaps, Bing, IndexNow e favicon responderam corretamente via acesso autenticado ao preview.
- O preview aplica `X-Robots-Tag: noindex` e gera sitemap principal vazio; o build de produção local mantém as seis URLs canônicas. Essa diferença é deliberada e impede indexação da prévia.

