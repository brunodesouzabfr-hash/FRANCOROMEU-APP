# Auditoria inicial da integração de imagens

Execução local em 12/10/2026. Raiz confirmada por `pwd`, `realpath` e `git rev-parse --show-toplevel`: `/home/romeu/###PROGRAMAS###/FRANCO ROMEU/FRANCOROMEU-APP`.

## Estado confirmado antes da implementação

- Branch: `codex/implementacao-imagens-portfolio-seo`.
- HEAD: `21ae82eee87cb68fc92cc19c41a17da901108c1b`.
- `origin/main...HEAD`: `0 1`; `origin/codex/site-refactor-release-1...HEAD`: `0 0`, após `git fetch origin`.
- Nenhum diff rastreado ou staged. O stash preexistente permaneceu intacto.
- `index.html` tem blob `4d839a4007acfb49d45352958b0c4c252c9c8dfe`, igual à branch remota de trabalho.
- Os cinco arquivos anteriormente alterados tinham sido restaurados pelo comando explícito do proprietário. Os seis arquivos do construtor editorial tinham sido removidos pelos comandos explícitos anteriores. Não foram restaurados ou reconstruídos nesta execução.
- Permaneciam os manifests, a documentação, os derivados, as fontes, `.vercel/`, o plano local e a saída editorial antiga em `dist/`. Foram preservados.

## Cópia de segurança e proteção

Cópia externa à publicação: `/tmp/fr-image-integration-backup-k2bFBL`. Inclui `snapshot.json`, arquivos que seriam alterados, dados editoriais e uma cópia integral de `dist/`. O snapshot registra 1.672 caminhos e os hashes dos arquivos regulares, sem seguir symlinks de diretórios. Não inclui credenciais de `.vercel/`.

Hashes financeiros iniciais:

| Elemento | SHA-256 |
| --- | --- |
| `src/budget-core.js` | `d9b8181bce2387f8087a82d1c82958efd42c0778882598941e2de2c267c9b1cc` |
| Script incorporado `fr-budget-core` | `3b5696aeb51ebbda876a428e657c9e60cd6c08d45bc2f152b1ed98b905517bbc` |
| Trecho `DEFAULT_DATA` | `f8c5bd9078089f08fe38d8624ff80369cef189816118359bc1058fd14ec41a51` |

## Diagnóstico da prévia antiga

Porta 4182: PID `2253038`, comando `node scripts/preview-site.cjs 4182`, diretório de trabalho igual à raiz do repositório. Esse processo carregou a configuração antiga e continua servindo `dist/`. Seu arquivo de entrada é `dist/index.html`, com a Home editorial “A matéria encontra o método.”, e não o `index.html` principal.

A chamada antiga a `build-editorial.cjs` já estava ausente após a restauração autorizada de `scripts/build-site.cjs`. Não havia substituição restante a desativar no código atual. O novo pipeline mantém o HTML principal, o renderizador `FRMediaCase` e as seis vistas, e gera somente `dist-fr-integracao/`. O arquivo e a árvore antigos não foram apagados ou sobrescritos.

## Referência visual

Antes da integração, o construtor original foi executado com saída isolada em `/tmp/fr-image-integration-backup-k2bFBL/baseline`. Essa referência foi servida em 4184, sem servir a raiz do repositório. Capturas desktop 1440×900 e celular 390×844 estão em `visual-before/` na cópia externa. O Hero, cabeçalho e núcleo de 115 serviços foram conferidos em Chromium, sem erro de JavaScript.

## Reconciliação das fontes

Os anexos atuais não reproduzem a estrutura integral da entrega anterior. A cozinha foi subdividida; capas PNG de `_CAPAS_AUTORAIS_POR_AMBIENTE` e diversas fichas antigas estão ausentes. Os Markdown e índices atuais foram lidos, sem edição. A resolução por SHA encontra arquivos relocados sem renomear a origem. Os 20 posters preparados têm seus próprios hashes e decodificação conferidos, mas sua fonte PNG ausente continua registrada e impede publicação.

O validador original do pacote permanece inalterado: sua execução direta encontra 1.489 ocorrências de referências ausentes e duas divergências preexistentes de SHA nos índices `_ESTRATEGIA_SITE_SOCIAL.md` e `_INDICE_GERAL.md`. Ocorrências não equivalem a arquivos únicos. Resultado detalhado em `IMAGE_PACKAGE_VALIDATION.json`. Isso não foi ocultado nem convertido em um PASS integral do acervo histórico.

`PACKAGE_SHA256SUMS.txt`: 82 entradas conferidas, todas OK. Os 15 recortes recuperados permanecem no `PACKAGE_ROOT/media-recovery/`; sua validação pixel a pixel foi executada pelo validador entregue.

## Raízes usadas

- `REPO_ROOT`: raiz confirmada deste repositório.
- `CODEX_ROOT`: realpath de `CODEX USE AQUI` dentro desta raiz.
- `PACKAGE_ROOT`: `CODEX USE AQUI/FRANCO_ROMEU_ACERVO_EDITORIAL`.

Transportes removidos continuam indisponíveis. Nenhum ZIP foi recriado. Nenhuma alteração de branch, commit, push, deploy, DNS ou produção foi executada.
