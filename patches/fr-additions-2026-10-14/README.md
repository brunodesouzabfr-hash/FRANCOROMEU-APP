# Patch aditivo FR — caixas, imagens e motion

Base: `origin/main@ee983ed9eb1d600aa42dd57ae6e61c84431e528b`.

Este diretório isola as partes aproveitáveis da experiência imersiva anterior. O patch é estritamente aditivo: monta novas caixas ao lado do conteúdo canônico e não desliga, esconde ou substitui Hero, Portfólio, atlas de Ambientes, laboratório 3D, Jornal Técnico, formulário ou motor de orçamento.

## Inventário visual

| ID | Página | Ponto de inserção | Caixa / texto | Imagem | Motion |
|---|---|---|---|---|---|
| `HOME-01` | `/` | depois de `#fr6-manifesto` | `FORJA / O INVISÍVEL` — “O que sustenta o resultado também merece ser visto.” | `cozinha-env-lavanderia-imagem-ilustrativa-986cf34222.webp` | profundidade limitada e linha estrutural |
| `HOME-02` | `/` | depois de `#fr6-expertise` | `MATÉRIA / APLICAÇÃO` — “Observe a superfície. Entenda a aplicação.” | `cozinha-bancada-l-imagem-ilustrativa-b239e59121.webp` | abertura `clip-path` e luz de superfície |
| `ABOUT-01` | `/sobre` | depois de `#sobre-hero-section` | `PALIMPSESTO / MÉTODO` e três caixas: observa, decide, verifica | sem imagem raster | camadas, rotação e recomposição |
| `ENV-01` | `/ambientes` | antes de `.amb-museum` | `AMBIENTES / PÁTINA`, com três caixas | `ambiente-mansory-01.jpg`, `ambiente-industrial-01.jpg`, `ambiente-contemporaneo-01.jpg` | profundidade espacial, datum e luz |
| `P3D-01` | `/projetos-3d` | depois de `.p3d-hero` | `WIREFRAME / ESTUDO CONCEITUAL` | primeiro registro vigente de `window.P3D_PROJECTS` | perspectiva, grade técnica e dilatação limitada |
| `PORT-01` | `/portfolio` | antes de `.fr10-portfolio-stage` | `PORTFÓLIO / ARQUIVO VIVO`, cinco cards | cinco primeiras categorias distintas de `window.GM_PROJECTS` | moldura expansiva e ressonância |
| `BUDGET-01` | `/orcamento` | botão irmão de cada seletor de serviço | janela `EXEMPLO VISUAL DO ACERVO` | mapa separado por `serviceId` exato | popover no foco/hover e drawer no clique |
| `JOURNAL-01` | `/projetos/` | antes de `#arquivo` | `PERCURSO VISUAL / PROJETOS FR`, cinco cards | cinco mídias editoriais elegíveis derivadas no build | reveal, máscara e capilaridade WebGL com fallback DOM |

Todas as imagens mantêm rótulo factual. Estudo, conceito, ilustração e referência visual não são apresentados como obra executada.

## Arquivos físicos

- `assets/patches/fr-additions-2026-10-14/fr-additions.css`: somente estilos `.frap-*`.
- `assets/patches/fr-additions-2026-10-14/fr-additions.js`: montagem, interação, motion e teardown dos oito módulos.
- `assets/patches/fr-additions-2026-10-14/fr-additions-shader.js`: renderer WebGL nativo usado apenas pelo canvas do Jornal.
- `assets/patches/fr-additions-2026-10-14/fr-service-preview.js`: janela acessível do Orçamento sem alterar seleção ou cálculo.
- `assets/patches/fr-additions-2026-10-14/service-media-map.json`: vínculos visuais do Orçamento; não contém preço nem fórmula.
- `patches/fr-additions-2026-10-14/journal-additions.cjs`: HTML aditivo do Jornal Técnico.
- `patches/fr-additions-2026-10-14/generate-service-media-map.cjs`: regeneração auditável do mapa.
- `patches/fr-additions-2026-10-14/additions-manifest.json`: inventário legível por máquina.
- `patches/fr-additions-2026-10-14/CONTENT_INVENTORY.md`: cada caixa, texto, imagem, rota e ponto de montagem.
- `patches/fr-additions-2026-10-14/ANIMATIONS.md`: todas as animações, seus seletores, proprietários e fallbacks.
- `patches/fr-additions-2026-10-14/VALIDATION.md`: testes executados, comparação com a `main` e revisão interna.
- `tests/fr-additions-patch.test.cjs`: regressões de escopo aditivo e invariantes.

## Seleção resolvida nesta base

O inventário detalhado está em `CONTENT_INVENTORY.md`. Na base indicada acima, a resolução dinâmica resulta em:

- Home: duas imagens ilustrativas do conjunto Cozinha + Lavanderia;
- Sobre: três caixas de método, sem imagem raster adicional;
- Ambientes: Mansory, Industrial e Contemporâneo, com uma imagem de linguagem para cada card;
- Projetos 3D: `Suíte Master Premium`, usando `assets/media/p3d-suite-luxo-01.jpg`;
- Portfólio: Porcelanato Líquido Sala, Efeito Mármore Premium, Automação Residencial Smart, Iluminação Arquitetural e Produção de Eventos Corporativos;
- Jornal: Cozinha + Lavanderia, Área gourmet 010, Banheiro 037, Banheiro 007 e Closet 030;
- Orçamento: 115 fichas no mapa separado, sendo 31 vínculos visuais exatos e 84 fichas `needs_review`, sem preço ou fórmula no arquivo.

## Garantias do patch

- Não altera `src/budget-core.js`, `FRBudgetCore`, preços, fórmulas, cupons, IDs ou persistência.
- Não altera flags do Stage14/15/16 e não oculta o layout existente.
- Não captura `wheel` ou `touch`; scroll continua nativo.
- `prefers-reduced-motion` conserva todo o conteúdo sem scrub.
- `window.FRAdditionsPatch.destroy()` remove apenas nós, listeners, observers, RAF e WebGL deste patch.
- `window.FRAdditionsServicePreview.destroy()` remove somente botões e janela adicionados ao Orçamento.
- `window.FR_ADDITIONS_PATCH_FLAGS.enabled = false` antes do carregamento impede toda montagem SPA.
- Em `/projetos/`, `window.FR_ADDITIONS_PATCH_FLAGS.journal = false` oculta apenas a seção nova; o arquivo original continua disponível.

## Fora deste patch

O redesign integral, overrides globais de layout, substituição de Portfólio, referências externas e documentação HAR não fazem parte deste commit. Nenhum push, merge ou deploy é implícito.
