# Integração de imagens ao site existente — candidata local

> Registro histórico da etapa anterior. Os caminhos `dist-fr-integracao/`, portas e estado do `index.html` abaixo descrevem aquela etapa, não o estado atual. A consolidação posterior usa uma única saída ativa `dist/`; consulte `docs/additions/FINAL_REPORT.md` para os resultados e bloqueios atuais. Nenhum arquivo da etapa anterior foi apagado para atualizar este registro.

Branch inicial/final: `codex/implementacao-imagens-portfolio-seo`. HEAD inicial/final: `21ae82eee87cb68fc92cc19c41a17da901108c1b`. Nenhum commit, push ou deploy.

## Resultado implementado

A Home conserva “Espaços Forjados Para durar.”, o cabeçalho, a composição e a navegação das seis vistas. O `index.html` da raiz permanece intacto. A candidata deriva desse HTML e do renderizador `FRMediaCase`, com galerias acrescentadas nas abas existentes. O arquivo editorial antigo em `dist/` e a cópia de segurança externa permanecem preservados.

Saída candidata: `dist-fr-integracao/`. `npm run build` e `npm run preview -- 4183` usam essa saída. A configuração de produção em `vercel.json` permanece inalterada; uma futura publicação exige tratar a saída de hospedagem deliberadamente. A tarefa não autoriza publicar esta candidata.

Prévia: **http://127.0.0.1:4183/**. O processo é `node scripts/preview-site.cjs 4183`, PID `2471461`, com cwd na raiz do repositório e entrada `dist-fr-integracao/index.html`. A porta 4182 continua sendo a saída antiga; não é a candidata desta entrega.

## Implementação e rastreabilidade

- `src/media-library.cjs`: leitura dos dez envelopes, versão, IDs, eixos, CSVs, resolução física/SHA, exclusões e distinção explícita entre prévia e indexação.
- `scripts/prepare-project-library.cjs`: seleção, conferência de fontes/derivados, cópia de famílias WebP com nomes SEO, inventário, leitura de fontes e catálogo público sanitizado.
- `assets/js/fr-media-case.js`: reaproveitamento do renderizador existente para o case; filtros de setor, etapa e núcleo; carrossel acessível; modal com Escape e retorno do foco. O catálogo legado na origem continua intacto, mas a saída candidata recebe somente a seleção reconciliada.
- `assets/js/fr-project-media.js` e `assets/css/fr-project-media.css`: BeforeAfterCard, comparação estática, filtros, sequências de ambientes e contexto editorial seguro para o orçamento. Os estilos são restritos às galerias e páginas de detalhe.
- `scripts/build-project-pages.cjs`: HTML inicial de comparativos e ambientes, texto específico, breadcrumbs, canonical, Open Graph e JSON-LD condicional.
- `scripts/build-site.cjs`, `scripts/build-media-case.cjs`, `scripts/preview-site.cjs`: integração no pipeline original e saída isolada. Não há chamada ao construtor editorial removido.
- `tests/seo-brand-godmode.test.cjs`: leitura somente de arquivos regulares de texto, com diretórios/symlinks de diretório ignorados. Os symlinks de fontes não foram alterados.
- `tests/public-build.test.cjs`: contratos preservados e adaptados à saída candidata, ao domínio www, à exclusão de ARCHIVE e à indexação desativada.
- `tests/image-integration.test.cjs`: regressões de Home, gates, sequenciamento, comparativos, famílias de arquivos e sitemaps.
- `tests/price-media-integration.test.cjs`: acrescenta uma regressão de clonagem do host, preservando os testes anteriores de 57 mídias/162 variantes da origem.
- `scripts/check-project-library.cjs`, `scripts/verify-image-files.py`, `scripts/image-integration-qa.mjs`, `scripts/snapshot-image-integration.cjs`: verificações e evidências locais.
- `scripts/verify-source-originals.cjs`: conserva a comparação de SHA e fichas; resolve a reorganização por hash e registra individualmente fontes ausentes, sem convertê-las em sucesso.
- `package.json`: acrescenta os seis testes de integração à suíte. `.gitignore`: isola `dist-fr-integracao/`.

## Inventário e seleção

| Conjunto atual | Arquivos | Imagens |
| --- | ---: | ---: |
| before_after_organized | 247 | 181 |
| IMAGENS-CODEX | 108 | 108 |
| reels_design_organized | 224 | 165 |
| Total dos três anexos | 579 | 454 |

Os três conjuntos atuais têm 445 hashes distintos e nove cópias exatas extras. Esse escopo difere da entrega histórica de 1.020 fontes e 521 ocorrências de imagem. Não se confundiram os 48 conjuntos atuais com as 51 trilhas completas históricas: 48 são de ambientes; três outras são relações do case. I124 continua incompleto e fora da saída.

Foram selecionadas **284 mídias distintas**, reutilizando **372 arquivos WebP**: 284 derivados preparados e 88 variantes responsivas adequadas do case. Não houve nova conversão, recompressão ou upscale: os WebP existentes foram decodificados integralmente, conferidos e copiados com nomes semânticos. Cada mídia mantém uma URL principal e variantes por largura, compartilhadas entre as vistas.

Distribuição: 120 imagens dos 60 comparativos, 48 imagens de cozinha/lavanderia, 96 imagens de materiais/aplicações e 20 capas. Os nove itens do catálogo legado classificados como ARCHIVE não foram copiados para a nova seleção. Os 53 HOLD, 123 ARCHIVE e 20 DUPLICATE, incluindo as duas referências dentro dessas categorias, permanecem recusados: 196 registros.

`PUBLIC_MEDIA_MAP.json` registra media_id, SHA original, SHA da fonte de publicação, SHA do preparado e de cada variante, dimensões, URL, usos e gates originais. `IMAGE_INTEGRATION_INVENTORY.json` cobre os 480 registros semânticos, fontes resolvidas/ausentes, origem dos textos, autoria e direitos, e 125 documentos auxiliares atuais lidos integralmente. `RENAMING_EXECUTION.csv` preserva as 684 linhas anteriores e acrescenta 372 registros de cópias candidatas, sem duplicá-los na reexecução.

O cache de decodificação aceita somente resultados completos para o SHA atual e a mesma versão do verificador. Cada build ainda compara hashes, dimensões e destinos; bytes modificados exigem nova decodificação.

## Fontes e recuperações

Foram encontradas 86 referências relocadas por SHA. Vinte fontes PNG de capas históricas estão ausentes; seus derivados preparados foram conferidos por seu próprio SHA, resolução e decodificação, utilizados apenas na prévia, com ausência mantida no inventário. Não se atribuiu disponibilidade ao original por existir um derivado.

As 15 recuperações do PACKAGE_ROOT foram utilizadas para os endpoints correspondentes. Permanecem separados dos originais truncados. O original de cozinha 021 permanece HOLD, sem tolerância a truncamento e sem reconstrução.

O gate legado espera 120 originais: 107 são localizados por SHA e 13 estão ausentes no conjunto atual. As 57 cópias verificadas de fichas no repositório permanecem intactas; suas 57 referências externas antigas também estão ausentes. A falta dos originais não foi apagada do gate ou tratada como recuperação; o resultado é `INCOMPLETE_EXTERNAL_SOURCES`, detalhado em `IMAGE_SOURCE_GATE.json`.

O validador original da entrega retorna FAIL no layout atual: 1.489 ocorrências de referências ausentes e duas divergências nos índices sociais. As divergências já estavam presentes no snapshot inicial; não foram causadas pela integração. O pacote e seu validador não foram editados. As 82 entradas de PACKAGE_SHA256SUMS.txt conferem, e as 15 recuperações têm pixels iguais aos recortes de seus comparativos pais.

## Narrativas e rotas

Há **87 rotas com conteúdo**, incluindo as seis vistas originais:

- `/`, `/sobre`, `/ambientes`, `/projetos-3d`, `/portfolio`, `/orcamento`.
- `/projetos/cozinha-lavanderia`: uma única página canônica do case, compartilhada por Projetos 3D e Portfólio.
- 60 rotas `/projetos/antes-depois/{legacy_slug}/`, com Markdown específico, condição inicial, intervenções representadas, materiais, serviços e orçamento.
- 20 rotas `/portfolio/ambientes/{ambiente}/`, com uma capa por ambiente e sequência ordenada MATERIAL → EXEMPLO para seus conjuntos.

Os comparativos ficam lado a lado ou empilhados no celular. Não existe slider: nenhum alinhamento geométrico foi confirmado. A cozinha oferece as etapas e detalhes disponíveis, sem preencher demolição/processo ausentes e sem converter variantes em cronologia factual. As capas de biblioteca e área gourmet foram conferidas visualmente e seguem SOURCE_CORRECTIONS.json. Encerramentos e contactcard ficam fora da sequência.

O orçamento recebe somente `fr-reference` com ID editorial conhecido. A referência aparece como texto contextual; não preenche serviços, medidas, preço ou qualquer estado financeiro automaticamente. A persistência existente continua sendo a fonte do orçamento.

## SEO e publicação

Canônico da saída e do roteador gerado: `https://www.francoromeufr.com.br`. Em 12/10/2026, a conferência HTTP observou www com 200; apex redirecionando com 308 para www; endereço Vercel redirecionando com 307 para www. Nenhuma configuração externa foi alterada.

Organização: Franco Romeu, alternateName FR e ꟻR. Não foram acrescentados endereço, sameAs não verificado, avaliações, autoria, licença, Product, SKU, oferta ou data. Estudos usam CreativeWork e publisher, sem reivindicar creator.

Todas as mídias da biblioteca continuam com `published=false`, `auto_publish=false` e `active_indexable=false`. As 81 páginas de estudo têm noindex; as seis rotas originais conservam sua elegibilidade textual e recebem noimageindex. A prévia também responde com X-Robots-Tag noindex/nofollow.

Foram gerados sitemap principal e `sitemap-images-antes-depois.xml`, `sitemap-images-3d.xml`, `sitemap-images-portfolio.xml`, além do arquivo compatível `sitemap-images.xml`. O principal contém somente as seis rotas originais. Os sitemaps de imagens são XML válidos **sem entradas**, porque nenhuma mídia passou os gates de publicação/indexação. Não se inseriram páginas noindex ou imagens pendentes para preencher os arquivos. O gerador possui emissão condicional de ImageObject para dados elegíveis; nesta entrega emite zero ImageObjects.

Não foi aplicada autoria/copyright em EXIF/IPTC/XMP, porque não há confirmação individual. Isso permanece uma pendência, não uma atribuição automática à FR.

Referências técnicas conferidas: [Google — sitemaps de imagens](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps) e [Google — metadados de imagens](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata). Não se usaram tags descontinuadas de legenda, título, geolocalização ou licença no XML.

O Teste de Resultados Ricos externo não foi executado para a candidata privada. Após liberação e publicação autorizadas, testar as URLs efetivamente publicadas nessa ferramenta e no Search Console. A validação local de sintaxe, entidades, URLs e gates está registrada separadamente; não equivale a aprovação externa nem garante indexação.

## Validação final

| Verificação executada | Resultado final |
| --- | --- |
| `npm run build` | PASS; 87 rotas, 284 mídias, 594 arquivos |
| `npm test` | PASS; 71 testes, zero falhas/cancelamentos/skips |
| `npm run check:html` | PASS; 253 IDs únicos na fonte, seis vistas e pontes protegidas |
| `npm run check:source-media` | INCOMPLETE_EXTERNAL_SOURCES, exit 1; 107/120 originais presentes e 57 cópias de fichas íntegras, com ausências registradas |
| Validador original do pacote | FAIL, exit 1; referências históricas ausentes e duas divergências preexistentes, sem falsificar aprovação |
| `PACKAGE_SHA256SUMS.txt` | 82/82 OK |
| Validação da candidata | PASS; 87 rotas, 4.117 links, 3.216 ocorrências de imagens, 87 JSON-LD e cinco sitemaps |
| Proteção de fontes | PASS; 1.533 caminhos protegidos comparados com o snapshot, incluindo symlinks |
| Decodificação dos arquivos usados | 636 verificações completas registradas; nenhum arquivo usado falhou |
| Reexecução do build | PASS; fingerprint idêntico, 594 arquivos e 1.056 linhas de nomenclatura, sem duplicações |
| Chromium desktop e celular | PASS; 1440×900 e 390×844, sem exceção de JavaScript, recurso local com erro ou overflow horizontal |
| Orçamento e PDF | PASS; seleção/total persistidos após reload; PDF curto de duas seleções/uma página e longo de 28 seleções/três páginas |
| Sintaxe e diff | `node --check` nos módulos alterados e `git diff --check` passaram; diff revisado |

Fingerprint final dos artefatos públicos: `b18e63e4baf1542b61350732491b0370d59acb3efeaefd10d22a584528419012`. SHA-256 da Home candidata: `85c2030f3472a34b02650f69d2b1ab59057e4063121006a974d8877a5fff4626`.

A revisão identificou e corrigiu três problemas de integração: painéis movidos que retinham `inert` aplicado pelo legado; hosts clonados que conservavam um atributo de “live” sem conservar listeners; consulta administrativa opcional a config.json na saída pública. Somente os painéis próprios têm inert restaurado, a identidade dos nós é conferida por WeakSet e observação de substituições de contêiner, e a consulta opcional é removida apenas pelo construtor público. Não se alteraram loadSystemData, cálculos, persistência ou o HTML-fonte.

Os testes de navegador exerceram filtros reais (incluindo seleção de 18 estudos 3D), navegação por teclado, modal, Escape e retorno do foco, sequência da biblioteca, reload de página de detalhe, contexto do comparativo no orçamento e conteúdo essencial sem JavaScript. As quatro páginas dos PDFs foram renderizadas e inspecionadas pela rotina da skill de PDF; não houve texto cortado, sobreposição ou perda de linhas nas tabelas dos casos testados. Safari/iOS, aparelhos físicos e uma auditoria completa de WCAG não foram executados.

Evidências visuais externas à publicação em `/tmp/fr-image-integration-qa/`: `desktop-home.png`, `mobile-home.png`, capturas das cinco vistas, `desktop/mobile-before-after.png`, `desktop/mobile-case-carousel.png`, `desktop/mobile-environment-sequence.png` e `desktop/mobile-pair-detail.png`. Relatórios: `browser-report.json` e `pdf/pdf-qa.json`. A referência anterior permanece em `/tmp/fr-image-integration-backup-k2bFBL/visual-before/`.

O HTML-fonte conserva o blob Git `4d839a4007acfb49d45352958b0c4c252c9c8dfe`. Os três hashes financeiros registrados na auditoria permanecem iguais. Os 392 arquivos da antiga `dist/` foram comparados com a cópia externa e estão intactos. O prefixo original de RENAMING_EXECUTION.csv também permanece byte a byte igual; somente as novas linhas foram acrescentadas.

Estado Git final, sem staged:

```text
## codex/implementacao-imagens-portfolio-seo
 M .gitignore
 M assets/js/fr-media-case.js
 M package.json
 M scripts/build-media-case.cjs
 M scripts/build-site.cjs
 M scripts/preview-site.cjs
 M scripts/verify-source-originals.cjs
 M tests/price-media-integration.test.cjs
 M tests/public-build.test.cjs
 M tests/seo-brand-godmode.test.cjs
?? .vercel/
?? "CODEX USE AQUI/"
?? "FR_PLANO_MESTRE_SITE_CODEX_2026-10-10 (1).md"
?? assets/css/fr-project-media.css
?? assets/js/fr-project-media.js
?? content/before-after/
?? content/environments/
?? content/inspirations/
?? content/materials/
?? content/media/
?? content/projects/
?? content/services/
?? content/social/
?? docs/media/
?? prepared-media/
?? scripts/build-project-pages.cjs
?? scripts/check-build-idempotence.cjs
?? scripts/check-project-library.cjs
?? scripts/image-integration-qa.mjs
?? scripts/prepare-project-library.cjs
?? scripts/snapshot-image-integration.cjs
?? scripts/verify-image-files.py
?? src/media-library.cjs
?? tests/image-integration.test.cjs
```

## Pendências humanas e riscos antes de publicação

1. Confirmar direitos e autoria por mídia e decidir a liberação individual; nenhuma flag foi ativada em lote.
2. Resolver as capas originais ausentes e as 13 lacunas do gate legado; esclarecer as duas divergências dos índices sociais.
3. Fornecer original íntegro do 021 e contexto/aplicação de I124 caso se pretenda reavaliá-los; continuam HOLD.
4. Confirmar produtos, especificações e eventuais URLs sociais; os estudos não documentam execução física, fornecedor ou postagem.
5. Revisar visualmente a candidata e aprovar separadamente a configuração de saída da hospedagem. `dist/` é um arquivo preservado, não deve ser tomado como saída nova.

Rollback local: a cópia externa contém os arquivos anteriores e a árvore editorial antiga. A revisão pode selecionar os trechos da integração sem afetar dados editoriais, fontes, orçamento ou histórico Git. Nenhuma restauração, exclusão ou limpeza automática foi executada.
