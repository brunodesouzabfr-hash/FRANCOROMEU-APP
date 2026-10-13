# Implementação da arquitetura editorial Franco Romeu

Execução: 2026-10-12. Branch: `codex/site-refactor-release-1`. Base local preservada: `21ae82eee87cb68fc92cc19c41a17da901108c1b`. Canônico da saída editorial: `https://www.francoromeufr.com.br`.

## Resultado e execução local

A arquitetura editorial funciona na stack existente: Node.js para geração estática e HTML/CSS/JavaScript para a interface. Não houve migração de framework. As páginas em `dist/` entregam conteúdo, links, títulos, descriptions, canonical, Open Graph e JSON-LD antes de executar JavaScript. As melhorias progressivas acrescentam busca, filtros, menu por teclado, tratamento de imagem indisponível e contexto editorial do orçamento.

```bash
npm run build
npm run preview -- 4182
```

Revisão local: `http://127.0.0.1:4182/`. O servidor entrega somente `dist/` e responde 404 para caminhos desconhecidos e fontes. A configuração existente de hospedagem continua com `cleanUrls` e saída `dist`, sem fallback indiscriminado para a Home. Nenhum deploy ou configuração remota foi executado.

## Arquivos criados e modificados

Criados:

- `src/editorial-adapter.cjs`: leitura dos dez manifests, validação de schema/IDs/relações e normalização das entidades e dos gates.
- `scripts/build-editorial.cjs`: curadoria, geração das rotas, seleção e verificação dos derivados, navegação do orçamento, metadados e sitemaps.
- `assets/css/fr-editorial.css`: interface editorial responsiva com identidade verde, matéria e tipografia, foco visível e movimento reduzido.
- `assets/js/fr-editorial.js`: filtros, estados vazios, navegação por teclado, composição de erro e contexto seguro do orçamento.
- `scripts/check-editorial.cjs`: validação da saída real, links, fragmentos, ativos, hashes, labels, canonical e JSON-LD.
- `scripts/editorial-browser-qa.mjs`: roteiro reproduzível de Chromium, responsividade e integração com o orçamento.
- `docs/media/SITE_BUILD_MANIFEST.json`: rotas, usos de mídia, IDs, hashes, dimensões, recusas e flags de publicação.
- `docs/media/SITE_VALIDATION.json` e `SITE_SOURCE_VALIDATION.json`: resultados das validações de implementação e da biblioteca.
- `docs/media/SITE_BROWSER_QA.json` e `SITE_PDF_QA.json`: evidência persistente dos roteiros de navegador e PDF.
- Este relatório.

Modificados:

- `scripts/build-site.cjs`: conecta a geração editorial ao build existente, preservando a compilação do orçamento e remoção de administração da saída pública.
- `tests/seo-brand-godmode.test.cjs`: aceita somente arquivos regulares, preserva symlinks das fontes e acrescenta uma regressão de diretório, symlink e link quebrado. As fontes locais ficam fora da varredura de conteúdo destinado ao site, com exclusão da publicação conferida nos testes do build.
- `tests/public-build.test.cjs`: atualiza o contrato público para a nova arquitetura e amplia a cobertura para rotas, relações, gates, hashes, integridade financeira, SEO e fidelidade editorial.
- `package.json`: acrescenta os checks e roteiro editorial ao fluxo de validação.
- `README.md`: documenta a execução local correta em `dist/`.

`index.html`, `src/budget-core.js`, o banco comercial, fontes originais, manifests aprovados, pacote e derivados preparados não foram modificados. A aparência e navegação editoriais são geradas na saída; o HTML histórico permanece a fonte do orçamento.

## Rotas

São 74 rotas com HTML próprio. Não se gerou uma página automática para cada projeto ou termo de material.

| Área | Rotas geradas |
| --- | --- |
| Home | `/` |
| Serviços | `/servicos` e 18 detalhes `/servicos/[slug]` |
| Projetos | `/projetos` e seis comparativos detalhados `/projetos/[slug]` |
| Projetos 3D | `/projetos-3d` e `/projetos-3d/cozinha-lavanderia-estudo-fr` |
| Ambientes | `/ambientes` e 24 detalhes `/ambientes/[slug]` |
| Materiais | `/materiais` e 11 detalhes `/materiais/[slug]` |
| Portfólio | `/portfolio`, com Estudos & Materialidade, Execuções Documentadas e Arquivo Social |
| Inspirações | `/inspiracoes`, com trilhas e comparativos compartilháveis por fragmentos estáveis |
| Estilos | `/estilos`, com 39 rótulos de estilo derivados dos estudos |
| Método | `/processo` e `/caderno-tecnico` |
| Institucional | `/sobre` e `/contato` |
| Orçamento | `/orcamento`, com o motor existente e contexto editorial |

O endereço anterior `/projetos/cozinha-lavanderia` aponta para a leitura canônica do C001 por redirecionamento HTML e link real, sem galeria duplicada. Todos os caminhos efetivos e seus arquivos constam em `SITE_BUILD_MANIFEST.json`. Os 109 conjuntos permitidos aparecem na listagem de projetos; os restantes são consumidos pelas narrativas de inspirações, sem inflar páginas repetitivas.

## Mídias, curadoria e fidelidade

251 mídias únicas foram copiadas para `dist/assets/media/fr-editorial/`, totalizando aproximadamente 32,7 MB no conjunto. Cada mídia tem uma única URL, filename SEO, `media_id`, SHA-256, dimensões, label e lista de rotas consumidoras no manifesto de execução do site. São cópias byte a byte dos preparados; esta implementação não converteu novamente, recortou ou ampliou imagens. Imagens fora do hero usam lazy loading. Pranchas e peças com texto são exibidas integralmente com `contain`.

196 registros foram recusados: 53 HOLD, 123 ARCHIVE e 20 DUPLICATE, incluindo as referências externas nas classes bloqueadas. 33 preparados elegíveis não foram selecionados. Não há fallback para mídia bloqueada. Uma falha de fonte produz diagnóstico e composição textual; uma falha de rede mantém caption e contexto, sem trocar a imagem por outra origem.

A Home apresenta posicionamento, visão integrada C001, serviços, ambientes, estudos 3D, materialidade, método, portfólio curado e orçamento. Os blocos têm funções editoriais declaradas. A página do case segue ambiente, estudo 3D, materialidade, detalhe, exemplo ilustrativo e serviços. Comparativos usam lado a lado; não existe slider que pressuponha registro geométrico.

- 60 pares preservam ANTES RECONSTITUÍDO / DEPOIS ILUSTRATIVO, condição inicial, intervenções propostas, materiais e serviços representados.
- 51 trilhas completas preservam AMBIENTE → MATERIAL → EXEMPLO ILUSTRATIVO.
- I124 permanece fora das rotas e das trilhas visíveis.
- Execuções Documentadas permanece vazio, com mensagem editorial honesta e sem ilustrações nessa categoria.
- 48 conjuntos sociais aparecem como ativos locais e curados, sem embeds, URLs, datas ou provedores inventados.
- Medidas executivas, modelos manipuláveis, fornecedor, produto físico e autoria desconhecidos permanecem sem alegações fabricadas.

## Orçamento e SEO

Projeto, ambiente, material, serviço e inspiração podem encaminhar um ID de contexto ao orçamento. O contexto é validado contra um catálogo normalizado incorporado ao HTML e persistido em uma chave própria; não escreve em `appState`, seleciona serviços automaticamente ou recalcula regras. Remover o contexto preserva a seleção. Quantidade, configuração, cupom, pagamento, persistência, IQE e PDF continuam no motor existente.

Organization usa Franco Romeu e alternateName FR/ꟻR. Estudos detalhados usam CreativeWork com natureza ilustrativa. Não se emite LocalBusiness, Review, AggregateRating, VideoObject, telefone, endereço, licença ou creator não comprovados na nova camada de dados estruturados. Os canais que já existiam no orçamento permanecem em sua integração histórica; a nova página de contato não inventa canais.

**Disponibilidade local não equivale a ativação editorial em produção.** As 251 mídias estão acessíveis no build para revisão, mas os manifests continuam com `publication.published=false`, `publication.auto_publish=false` e `seo.active_indexable=false`. O gerador respeita essas flags: zero ImageObject ativo e zero entrada no sitemap real de imagens. O XML real é válido e separado do rascunho entregue; quando houver liberação explícita nos dados, o gerador incluirá somente arquivos usados, existentes e elegíveis. As páginas têm sitemap próprio; `noimageindex` preserva o bloqueio das imagens. Previews Vercel recebem `noindex, nofollow`.

## Validações e evidências

- `npm test`: 67 testes passaram, zero falhas, incluindo regressões financeiras, catálogo, views históricas e novo build editorial.
- `npm run check:html`: PASS para o HTML protegido e a saída editorial.
- Check editorial: 74 rotas, 6.404 links, 735 referências de ativos, 74 blocos JSON-LD e 502 usos visuais conferidos, sem erros.
- Validador editorial entregue: PASS, zero erros; 1.020 originais hasheados, 1.451 pares de hash verificados, 162 dimensões de variantes, 15 recuperações pixel a pixel, pares e trilhas íntegros. O campo de data interno do validador conserva a data da auditoria; a execução ocorreu em 12/10/2026.
- Os dez manifests integrados continuam byte a byte iguais aos arquivos do pacote. Os 284 preparados conferem com `RENAMING_EXECUTION.csv`.
- Revisão Chromium: rotas diretas, canonical e heading; celular 390×844 e desktop 1440×900; ausência de overflow nas telas verificadas; filtros, vazio, recuperação, menu, Escape, foco, navegação sem JavaScript, contexto e persistência do orçamento. Evidências em `/tmp/fr-editorial-qa/`.
- O roteiro final também conferiu IQE por teclado e composição de erro com imagens bloqueadas e movimento reduzido: oito fluxos, zero erro de execução. As capturas finais corrigem a sobreposição do label no card e mostram o título do orçamento com preenchimento legível.
- PDFs sintéticos gerados pelo fluxo existente: dois serviços em uma página e 28 serviços em três páginas, preservando seleção e total. As quatro páginas foram renderizadas e inspecionadas visualmente, com cabeçalhos, tabelas, valores, rodapés e paginação legíveis. Evidências em `/tmp/fr-editorial-pdf-qa/`.
- `node --check` nos módulos novos; `git diff --check`; revisão de diff, sem alteração do núcleo financeiro ou da biblioteca aprovada.

## Limitações, decisões humanas e riscos antes da publicação

O site está implementado e disponível para revisão local. Ainda são necessárias confirmação de direitos/autoria por mídia, revisão dos rodapés e contatos impressos nas peças sociais, e aceite da seleção e da experiência visual. Fotos e documentação reais são necessárias para preencher Execuções Documentadas; I124 e demais HOLD exigem as decisões registradas em `HUMAN_DECISIONS.json` e `HOLD.csv`.

Não há modelo CAD/GLB para um visualizador 3D manipulável: a experiência apresenta os estudos raster existentes. Autoria é tratada como curadoria quando não comprovada. O orçamento/PDF conserva dependências externas anteriores; a nova navegação e conteúdo editorial funcionam sem JavaScript, mas a calculadora requer JavaScript. Chromium foi executado nesta máquina; Safari, Firefox e aparelhos físicos não foram validados. Não se declarou aprovação de Core Web Vitals ou de uma auditoria WCAG completa.

Uma publicação futura exige provisionar os arquivos selecionados e manifests no checkout de build, resolver os gates de mídia e revisar domínio/roteamento no ambiente de hospedagem autorizado. As fontes e o pacote local não entram automaticamente nessa publicação.

## Reversão e estado do Git

Nenhum commit, push, merge ou deploy foi executado. Alterações anteriores e o pacote permanecem preservados. A reversão consiste em retirar o módulo editorial do build e reverter somente os arquivos de código/testes/documentação desta implementação; os motores e a aplicação histórica continuam em `index.html`. `dist/` contém somente artefatos gerados e pode ser reconstruído a partir das fontes escolhidas. Não remover `CODEX USE AQUI/`, `content/`, a documentação entregue ou `prepared-media/` para reverter a interface.
