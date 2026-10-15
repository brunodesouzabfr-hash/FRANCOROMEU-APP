# Inventário das animações adicionadas

Todas as animações deste patch estão fisicamente isoladas em `assets/patches/fr-additions-2026-10-14/`. Elas usam scroll nativo; não há captura de `wheel`, `touchmove`, smooth-scroll, GSAP ou segundo RAF contínuo.

## Proprietário e progresso compartilhado

- Código: `fr-additions.js`, funções `progressFor()`, `update()` e `schedule()`.
- Trigger: posição de cada `[data-frap-scene]` na viewport.
- Valores: `--frap-progress`, `--frap-energy`, `--frap-near`, `--frap-far`, `--frap-inset` e `--frap-angle`.
- Estado exposto: `normal`, `entering`, `immersive`, `exiting`, `restored` ou `essential` em `data-frap-state`.
- Scheduler: um `requestAnimationFrame` somente após scroll/resize relevante; nenhuma animação ociosa permanente.
- Teardown: `window.FRAdditionsPatch.destroy()` cancela RAF, listeners, observers, renderer e remove apenas raízes `.frap-*` criadas pelo patch.

## Motion efetivamente aplicado

| Família / uso | Página | Código DOM | CSS / propriedade | Comportamento |
|---|---|---|---|---|
| Profundidade estrutural | Home `HOME-01` | `mountHome()` → variante `gravity` | `.frap-gravity`, `.frap-visual` | imagem abre por `clip-path`, ganha profundidade limitada e uma linha estrutural responde ao progresso |
| Janela de superfície | Home `HOME-02` | `mountHome()` → variante `surface` | `.frap-surface` | raio, moldura elíptica, brilho, escala e recorte aproximam o detalhe sem apagar a legenda |
| Camadas Palimpsesto | Sobre `ABOUT-01` | `mountAbout()` | `.frap-palimpsest`, `.frap-layers article` | três cartões mudam deslocamento, rotação e profundidade a partir do mesmo progresso reversível |
| Profundidade espacial | Ambientes `ENV-01` | `mountEnvironments()` | `.frap-environment-card`, estilos compartilhados de `.frap-visual` | crop, máscara, imagem e datum variam sem pin ou bloqueio de rolagem |
| Wireframe / forja | Projetos 3D `P3D-01` | `mountProject3d()` | `.frap-wireframe` | perspectiva `rotateY`, deslocamento, escala e grade azul técnica sobre a vista conceitual |
| Moldura / ressonância | Portfólio `PORT-01` | `mountPortfolio()` | `.frap-portfolio-card` | moldura cresce, imagem expande e anel de ressonância aparece; cards alternam composição sem substituir o grid |
| Reveal / continuidade | Jornal `JOURNAL-01` | `injectJournalAdditions()` + `mountJournal()` | `.frap-journal-card` | `clip-path`, escala, deslocamento de mídia e texto; composição alternada e reversível |
| Popover / drawer | Orçamento `BUDGET-01` | `fr-service-preview.js` → `open()`/`close()` | `.frap-service-preview` | hover/foco abre popover após 220 ms; clique/toque abre drawer; Escape e fechar devolvem foco |
| Microinterações | todos os blocos | `actions()` e controles do preview | `.frap-actions`, `.frap-service-trigger` | transição curta de borda, cor e `translateY(-2px)` com foco visível equivalente |

## Shader isolado

`fr-additions-shader.js` contém cinco funções GLSL originais no mesmo programa:

| Família GLSL | Código | Estado neste patch |
|---|---|---|
| `gravity` | `gravity(vec2 p)` | disponível no renderer; o equivalente DOM é usado na Home |
| `surface` | `surface(vec2 p)` | disponível no renderer; o equivalente DOM é usado na Home |
| `capillarity` | `capillarity(vec2 p)` | executado somente no canvas decorativo de `JOURNAL-01` |
| `forge` | `forge(vec2 p)` | disponível como preset, não montado por outra página deste patch |
| `resonance` | `resonance(vec2 p)` | disponível como preset; o Portfólio usa o equivalente DOM |

O renderer compila e linka WebGL2, tenta WebGL1 como fallback, limita DPR a `1` no mobile e `1.5` no desktop, limita o maior lado a 2048 px, suspende fora da viewport/aba oculta, trata perda/restauração de contexto e destrói buffer/programa/observers. Falha de canvas, contexto ou shader apenas oculta o canvas; HTML, imagem, texto e links permanecem.

## Acessibilidade e modos alternativos

- `@media (prefers-reduced-motion: reduce)`: remove animação, transição, recorte e transform; conteúdo fica completo no estado estático.
- `@media (forced-colors: active)`: devolve cores e bordas ao sistema.
- `@media print`: remove canvas, controles artísticos e janelas; mantém o conteúdo textual legível.
- Touch não depende de hover: CTAs continuam botões/links e a prévia de serviço abre como drawer explícito.
- Nenhuma animação altera preço, quantidade, configuração, seleção, `localStorage`, PDF ou WhatsApp.

## Localização rápida no código

- Montagem e progresso: `fr-additions.js` — `mountHome`, `mountAbout`, `mountEnvironments`, `mountProject3d`, `mountPortfolio`, `update`, `mountJournal`, `destroy`.
- Estilos e fallbacks: `fr-additions.css` — seletores `.frap-gravity`, `.frap-surface`, `.frap-palimpsest`, `.frap-environment-card`, `.frap-wireframe`, `.frap-portfolio-card`, `.frap-journal-card`, `.frap-service-preview`.
- WebGL: `fr-additions-shader.js` — `sources`, `Renderer.initialize`, `Renderer.render`, `Renderer.destroy`.
- Orçamento: `fr-service-preview.js` — `enhance`, `open`, `close`, `bind`, `destroy`.
