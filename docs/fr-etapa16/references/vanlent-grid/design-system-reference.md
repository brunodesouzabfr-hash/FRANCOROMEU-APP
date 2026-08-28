# Leitura do sistema visual e comportamental da referência

## Resumo executivo

Esta análise usa exclusivamente os arquivos locais da captura de `https://vanlent.dev/`, realizada em 21 de agosto de 2026. Ela descreve a interface pública renderizada; não representa recuperação do código-fonte privado original.

**OBSERVADO — alta confiança.** A composição é construída sobre uma malha quadrada persistente, escura e de baixo contraste. No viewport desktop 1440 × 900, o módulo mede 75 px, o conteúdo central mede 1350 px e o cabeçalho mede 75 px; no viewport mobile 390 × 844, o módulo e o cabeçalho medem 53 px e o conteúdo central mede 318 px. Evidências: `design-tokens.json`, viewports desktop/mobile, variáveis `--grid-block-size`, `--grid-max-width`, `--header-height`; `layout-map.json`, `#header > div.relative.flex`, `div.section-grid > div.grid-row:nth-of-type(1)`.

**OBSERVADO — alta confiança.** A hierarquia depende de Montserrat em pesos 200/300, grandes títulos em caixa alta e texto utilitário pequeno. IBM Plex Mono aparece de forma pontual. Evidências: `design-tokens.json`, ambos os viewports, `fontFamilies`, `fontWeights`; `layout-map.json`, elementos `div.heading-reveal__inner > h2...` e `div > h3.grid-font--5xl.flex`.

**OBSERVADO — alta confiança.** A referência usa fundo `#1c1c1c`, texto principal `#fafafa`, texto secundário `#d4d4d8`, borda `#404040` e um acento verde-água. Evidências: `design-tokens.json`, ambos os viewports, variáveis `--background-primary`, `--text-primary`, `--text-secondary`, `--border-primary`, `--accent-primary`.

**OBSERVADO — alta confiança.** No desktop, hero, trabalho e serviços combinam áreas sticky/pinning com longas distâncias de rolagem; no mobile, o conteúdo se reorganiza em fluxo vertical e o hero perde sua distância extra de scroll. Evidências: `layout-map.json`, desktop, `#hero-section` 1440 × 1800, `#work-section` 1440 × 5400, `#services-section` 1440 × 5400 e respectivos `.pinning-container`; mobile, `#hero-section` 390 × 848, `#work-section` 390 × 2120 e `#services-section` 390 × 1325; `design-tokens.json`, `--grid-hero-scroll-distance` 1800 px/0 px.

**OBSERVADO — média/alta confiança.** Uma cena canvas cobre o viewport e as detecções locais assinalam GSAP, Three e WebGL. Evidências: `dependencies.json`, ambos os viewports, `detected.gsap`, `detected.three`, `detected.webglCanvas` e canvas `div > canvas`; `browser-console.json`, desktop, avisos WebGL. A função exata de GSAP/Three e suas versões são **INDISPONÍVEIS**, pois os bundles JS não foram salvos.

## Inventário de tokens observados

### Cor

| Papel observado | Valor | Status e evidência |
| --- | --- | --- |
| Fundo principal | `#1c1c1c` | **OBSERVADO** — `design-tokens.json`, desktop/mobile, `--background-primary`; também `rgb(28, 28, 28)` nos valores computados. |
| Fundo inverso | `#fafafa` | **OBSERVADO** — mesmo arquivo/viewports, `--background-inverse`. |
| Fundo secundário | `rgba(73,73,73,.2)` | **OBSERVADO** — mesmo arquivo/viewports, `--background-secondary`. |
| Fundo terciário | `#27272a` | **OBSERVADO** — mesmo arquivo/viewports, `--background-tertiary`. |
| Texto principal | `#fafafa` | **OBSERVADO** — mesmo arquivo/viewports, `--text-primary`; cor computada mais frequente. |
| Texto secundário | `#d4d4d8` | **OBSERVADO** — mesmo arquivo/viewports, `--text-secondary`; segunda cor computada mais frequente. |
| Texto terciário | `#a1a1aa` | **OBSERVADO** — mesmo arquivo/viewports, `--text-tertiary`. |
| Texto quaternário | `#71717a` | **OBSERVADO** — mesmo arquivo/viewports, `--text-quaternary`. |
| Borda principal | `#404040` | **OBSERVADO** — mesmo arquivo/viewports, `--border-primary`. |
| Linha grande da malha | `#282727` | **OBSERVADO** — mesmo arquivo/viewports, `--grid-line-large`. |
| Linha pequena da malha | `rgba(255,255,255,.05)` | **OBSERVADO** — mesmo arquivo/viewports, `--grid-line-small`. |
| Acento/CTA principal | `#57ded3` | **OBSERVADO** — mesmo arquivo/viewports, `--accent-primary` e `--cta-primary`. |
| Acento/hover escuro | `#43cabc` | **OBSERVADO** — mesmo arquivo/viewports, `--accent-hover`, `--accent-dark`, `--cta-hover`. |

As cores utilitárias vermelhas, âmbar, amarelas e verdes declaradas no CSS são **OBSERVADAS** como tokens do framework, mas sua relevância visual é **INDISPONÍVEL**: sua declaração não prova uso expressivo na página. Evidência: `resources/css/85b910ff11d5b23795ed.css`, `:root,:host`.

### Tipografia

- **OBSERVADO.** Família dominante: `Montserrat, "Montserrat Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; 3684 ocorrências computadas no desktop e 3438 no mobile. Evidência: `design-tokens.json`, `fontFamilies`.
- **OBSERVADO.** Família mono pontual: `"IBM Plex Mono", "IBM Plex Mono Fallback"`; 2 ocorrências desktop e 6 mobile. Evidência: mesmo arquivo/chave.
- **OBSERVADO.** Pesos computados: 200, 300 e 500. O peso 200 domina (3427 desktop; 3166 mobile). Evidência: `design-tokens.json`, `fontWeights`.
- **OBSERVADO.** Escala computada dominante no desktop: 12.5333, 14.5333, 16.5333, 23.0667, 39.0667 e 50.1333 px; no mobile: 9.6, 11.6, 13.2, 13.6, 33.2 e 38.4 px. Evidência: `design-tokens.json`, `fontSizes`.
- **OBSERVADO.** Títulos de seção: 39.0667/39.0667 px no desktop e 33.2/33.2 px no mobile, peso 200, caixa alta. Evidência: `layout-map.json`, ambos os viewports, `div.heading-reveal__inner > h2...`.
- **OBSERVADO.** Título expressivo: 50.1333/55.1467 px no desktop e 38.4/42.24 px no mobile, peso 300. Evidência: `layout-map.json`, `div > h3.grid-font--5xl.flex`.
- **INFERIDO.** A combinação de peso muito leve, caixa alta e espaçamento estrutural produz austeridade técnica e sofisticação. Esta é interpretação visual sustentada por `screenshots/desktop.png`, `screenshots/mobile.png` e pelos valores acima, não um token recuperado.

### Espaçamento, raios e sombras

- **OBSERVADO.** Espaçamentos explícitos recorrentes: 4, 8 e 16 px; a variável global de espaçamento é `.25rem`. Evidência: `design-tokens.json`, desktop/mobile, `spacing` e `--spacing`.
- **OBSERVADO.** Margens laterais do conteúdo: desktop 45 px; mobile 36 px. Evidência: `layout-map.json`, `#header > div.relative.flex` (x 45, largura 1350; x 36, largura 318).
- **OBSERVADO.** Não há `border-radius` não zero inventariado nos valores computados. Evidência: `design-tokens.json`, `radii: []` em ambos os viewports. O reset também define controles com raio zero em `resources/css/85b910ff11d5b23795ed.css`.
- **OBSERVADO.** As “bordas” da malha são predominantemente sombras inset de 1 px, incluindo `rgb(40,39,39) 1px 1px 0 0 inset`. Evidência: `design-tokens.json`, `shadows`; CSS público, `.grid-row`, `.loader-cell` e utilitários `.s-border-*`.
- **OBSERVADO.** O comprimento de cantos desenhados é 24 px, com variantes 16, 24, 32 e 48 px. Isso é comprimento de traço/recorte, não raio. Evidência: `design-tokens.json`, `--corner-length`; `resources/css/85b910ff11d5b23795ed.css`, `.cornered-border-sm/md/lg/xl`.

## Grid, medidas, responsividade e hierarquia

### Desktop — 1440 × 900

- **OBSERVADO.** Página: 1440 × 17100, DPR 1. Evidência: `capture-meta.json` e `layout-map.json`, `desktop.metrics`.
- **OBSERVADO.** Módulo de 75 px; 12 linhas por viewport, 20 colunas por viewport, 18 colunas de conteúdo, conteúdo máximo de 1350 px, offset x de 15 px e loader de 22 colunas/1650 px. Evidência: `design-tokens.json`, desktop, variáveis `--grid-*`.
- **OBSERVADO.** A malha efetivamente renderizada começa em x = -30, com linhas de 75 px e 22 colunas de 75 px. Evidência: `layout-map.json`, desktop, `div.fixed > div.section-grid...` e `.grid-row:nth-of-type(1)`.
- **OBSERVADO.** Cabeçalho fixo, z-index 50, altura 75 px; conteúdo interno 1350 px. Evidência: `layout-map.json`, desktop, `#header` e `#header > div.relative.flex`.
- **OBSERVADO.** Hero: 1800 px de seção, conteúdo sticky de 900 px; grade interna 1350 × 450, entre y = 225 e 675. Evidência: `layout-map.json`, desktop, `#hero-section`, filho `.w-full.z-[10]`, `div.w-full > div.hero-grid.grid`; `design-tokens.json`, `--grid-hero-*`.
- **OBSERVADO.** Trabalho: seção de 5400 px com `.pinning-container` sticky de 900 px; serviços: mesma altura e padrão sticky. Evidência: `layout-map.json`, desktop, `#work-section`, `#services-section` e filhos `.pinning-container`.

### Mobile — 390 × 844

- **OBSERVADO.** Página: 390 × 7208, DPR 1. Evidência: `capture-meta.json` e `layout-map.json`, `mobile.metrics`.
- **OBSERVADO.** Módulo de 53 px; 16 linhas e 8 colunas por viewport, 6 colunas de conteúdo, conteúdo máximo de 318 px, offset x de 19 px e loader de 10 colunas/530 px. Evidência: `design-tokens.json`, mobile, variáveis `--grid-*`.
- **OBSERVADO.** A malha renderizada começa em x = -17 e usa células de 53 px. Evidência: `layout-map.json`, mobile, `div.fixed > div.section-grid...` e `.grid-row:nth-of-type(1)`.
- **OBSERVADO.** Cabeçalho/conjunto superior tem 53 px; o conteúdo central ocupa x = 36 a 354. Há também navegação fixa inferior com controles de 53 × 53 px em y = 791. Evidência: `layout-map.json`, mobile, `#header > div.relative.flex`, `#bottom-nav > button.relative.z-10` e controles irmãos.
- **OBSERVADO.** Hero: 390 × 848, grade interna 318 × 424 entre y = 212 e 636; distância extra de scroll é 0. Evidência: `layout-map.json`, mobile, `#hero-section` e `div.w-full > div.hero-grid.grid`; `design-tokens.json`, `--grid-hero-scroll-distance`.
- **OBSERVADO.** Trabalho e serviços tornam-se blocos verticais de 2120 e 1325 px. Evidência: `layout-map.json`, mobile, `#work-section`, `#services-section`.

### Breakpoints

**OBSERVADO.** O CSS expõe consultas em 40 rem, 48 rem, 64 rem, 80 rem e 96 rem, além de `(max-width: 768px)`, capacidades de hover/pointer e preferência de movimento reduzido. Evidência: `design-tokens.json`, `mediaQueries`; `resources/css/85b910ff11d5b23795ed.css`, regras `@media`. Qual consulta governa cada mudança de componente é parcialmente **INDISPONÍVEL** sem uma matriz de capturas intermediárias; somente os estados de 390 e 1440 px foram observados.

## Catálogo de animações e interações

| Padrão | Parâmetros comprovados | Status e evidência |
| --- | --- | --- |
| Revelação de título | `translateY(100%) → 0%`, 600 ms, `cubic-bezier(.22,1,.36,1)` | **OBSERVADO** — `resources/css/85b910ff11d5b23795ed.css`, `.heading-reveal__inner`; `animations.json`, mobile, alvo `div.heading-reveal > div.heading-reveal__inner`. |
| Revelação por letra | opacidade 0 → 1, 100 ms, `ease`, atrasos escalonados observados em incrementos de 17.5 ms e outros grupos em 50 ms | **OBSERVADO** — `animations.json`, desktop, `sampledDuringExercise`, alvo `span.textreveal-letter`; CSS `.textreveal-letter`. |
| Saída por letra | opacidade 1 → 0, 150 ms, `ease`, sem atraso | **OBSERVADO** — `animations.json`, desktop/mobile, fases de scroll e `activeAtFinalState`. |
| Reveal vertical genérico | `translateY(100%) → 0%`, 600 ms; variante lenta 1 s | **OBSERVADO** — CSS público, `.reveal-y__inner`, `.reveal-y--slower`. |
| Reveal de imagem | `clip-path: inset(100% 0 0) → inset(0)`, entrada ativa de 2 s; escala 1.1 → 1 em outra variante de 500 ms | **OBSERVADO** — CSS público, `.reveal-y--image...` e `.about-image-reveal...`. |
| Galeria/miniaturas | opacidade com 650 ms desktop e 500 ms mobile, curva `cubic-bezier(.33,1,.68,1)`, delays progressivos de 50 ms/70 ms | **OBSERVADO** — CSS público, `.device-mockup-gallery-thumbnails--desktop/mobile`. |
| Troca vertical de mockup | translateY acima/abaixo com 1 s e `cubic-bezier(.22,1,.36,1)` | **OBSERVADO** — CSS público, `.device-mockup-y-shell...`, `.device-mockup-slide-y...`. |
| Expansão de controles | largura 0 → 75/150 px em 200 ms, `cubic-bezier(.4,0,.2,1)` | **OBSERVADO** — `animations.json`, desktop, fase `initial`, alvos de header e CTA. |
| Células por clip-path | 600 ms, `ease`, 40 alvos no scroll desktop amostrado | **OBSERVADO** — `animations.json`, desktop, fase `scroll-3`, `div.col-span-1.row-span-1`. |
| Hover de CTA | fundo transparente → mistura de 20% do acento, transição 200 ms | **OBSERVADO** — CSS público, `.btn-hover-accent:hover`; `layout-map.json`, desktop, `a.btn-hover-accent.h-full`. O estado visual não foi capturado (`hoverChanges: []`), logo a aparência final é **INDISPONÍVEL** na captura exercitada. |
| Loader | `activate-box` 800 ms; pulso de palavra 800 ms alternado; `spin` e `spin-slow` declarados | **OBSERVADO** — `animations.json`, `keyframes`; CSS público, `.loader-progress-box`, `.initial-loader-word...`. Duração de `spin`/`spin-slow` em uso é **INDISPONÍVEL**. |
| Movimento reduzido | media query presente | **OBSERVADO** — `design-tokens.json`, `mediaQueries`. O efeito final de todas as regras sob essa preferência é **INDISPONÍVEL** sem captura específica. |

Os cliques abrem/alternam menus, tema, idioma e previews conforme rótulos e elementos interativos renderizados, mas o estado posterior a cada clique não foi documentado de forma completa. Portanto, as transições de estado e contratos funcionais são **INDISPONÍVEIS**. Evidência: `layout-map.json`, `interactive`; `animations.json`, `hoverChanges: []`.

## Componentes observáveis

- **OBSERVADO.** Moldura de malha persistente: `.section-grid`, `.grid-row`, `.grid-cell`, linhas/sombras inset. Evidências: CSS público e `layout-map.json`, ambos os viewports.
- **OBSERVADO.** Cabeçalho fixo com marca central/lateral, chave de tema e, no mobile, controle de menu; `#header`, `#theme-switch`. Evidência: `layout-map.json`, `interactive`.
- **OBSERVADO.** Navegação inferior mobile fixa, com controles modulares de 53 px; `#bottom-nav` e irmãos. Evidência: `layout-map.json`, mobile, `interactive`.
- **OBSERVADO.** Hero em grade com labels, duas áreas de palavras e cena canvas central; `.hero-grid`, `.hero-grid-part`, `div > canvas`. Evidência: `layout-map.json` e `dependencies.json`.
- **OBSERVADO.** Galeria de trabalhos com título de seção, CTA, mockups desktop/mobile e botões de miniatura acessivelmente nomeados. Evidência: `layout-map.json`, `interactive`, seletores `.device-mockup-gallery-thumb > button...`.
- **OBSERVADO.** Seções extensas de serviços/resultados ancoradas à grade. Evidência: `layout-map.json`, `#services-section`, `#results-section`.
- **INFERIDO.** A malha atua simultaneamente como decoração, sistema de alinhamento e mecanismo de ritmo de rolagem. Sustentação: recorrência de `.section-grid`, medidas modulares e screenshots; o propósito autoral não está disponível.

## Dependências detectadas e confiança

| Dependência/capacidade | Confiança | Fundamentação |
| --- | --- | --- |
| CSS utilitário compatível com Tailwind | Alta, como característica do CSS; versão indisponível | **OBSERVADO:** variáveis `--tw-*`, camadas e classes utilitárias em `resources/css/85b910ff11d5b23795ed.css`. O pacote/versão exatos são **INDISPONÍVEIS**. |
| GSAP | Média | **OBSERVADO:** `dependencies.json`, desktop/mobile, `detected.gsap: true`. Bundle não salvo; versão e uso preciso **INDISPONÍVEIS**. |
| Three.js | Média | **OBSERVADO:** `dependencies.json`, `detected.three: true`; canvas de viewport. Bundle, versão e cena **INDISPONÍVEIS**. |
| WebGL/canvas | Alta | **OBSERVADO:** canvas 1440 × 900 e 390 × 844 em `dependencies.json`; avisos WebGL em `browser-console.json`. |
| Next.js/Turbopack | Média/alta | **OBSERVADO:** URLs `/_next/static/chunks/...` e chunk nomeado `turbopack...` em `dependencies.json`/`resources-manifest.json`. `detected.next` foi falso; arquitetura e versão são **INDISPONÍVEIS**. |
| Montserrat variável | Alta | **OBSERVADO:** `@font-face` 100–900 no CSS e uso computado em `design-tokens.json`. |
| IBM Plex Mono | Alta | **OBSERVADO:** `@font-face` peso 400 no CSS e uso computado pontual. |
| Lenis, Locomotive Scroll, Barba, Swiper | Baixa evidência de ausência | **OBSERVADO:** detectores falsos em `dependencies.json`. Isso não prova ausência absoluta; classificado como **INDISPONÍVEL** quanto à arquitetura original. |

## Evidências por viewport

| Aspecto | Desktop 1440 × 900 | Mobile 390 × 844 |
| --- | --- | --- |
| Documento | **OBSERVADO:** 1440 × 17100, 11715 elementos | **OBSERVADO:** 390 × 7208, 10873 elementos |
| Módulo | **OBSERVADO:** 75 px | **OBSERVADO:** 53 px |
| Conteúdo | **OBSERVADO:** 1350 px, margem 45 px | **OBSERVADO:** 318 px, margem 36 px |
| Header | **OBSERVADO:** fixo, 75 px, z 50 | **OBSERVADO:** barra superior 53 px; navegação inferior modular |
| Hero | **OBSERVADO:** seção 1800 px; sticky 900 px; grade 1350 × 450 | **OBSERVADO:** seção 848 px; grade 318 × 424; sem scroll extra |
| Trabalho | **OBSERVADO:** 5400 px com pinning sticky | **OBSERVADO:** 2120 px em fluxo vertical |
| Serviços | **OBSERVADO:** 5400 px com pinning sticky | **OBSERVADO:** 1325 px em fluxo vertical |
| Canvas | **OBSERVADO:** 1440 × 900 | **OBSERVADO:** 390 × 844 |
| Título de seção | **OBSERVADO:** 39.0667 px, peso 200 | **OBSERVADO:** 33.2 px, peso 200 |

Fontes desta tabela: `capture-meta.json`, `design-tokens.json`, `layout-map.json` e `dependencies.json`, nos viewports indicados e seletores/variáveis já citados.

## Limitações da captura

- **OBSERVADO.** `deepCapture` é falso e somente o CSS (81721 bytes) foi salvo; recursos JS e imagens constam no manifesto, mas não foram armazenados. Evidência: `capture-meta.json`; `resources-manifest.json`, `deepCapture`, `savedBytes`, `localFile`.
- **INDISPONÍVEL.** Código-fonte privado original, versões de bibliotecas, configurações de build, shaders, modelos 3D, lógica completa de scroll e estados de aplicação.
- **INDISPONÍVEL.** Comportamento entre 390 e 1440 px; há media queries declaradas, mas só duas larguras foram capturadas.
- **INDISPONÍVEL.** Resultado visual de hover: `animations.json` contém `hoverChanges: []`.
- **INDISPONÍVEL.** Estados de login, gestos específicos, longa temporização, hardware e preferência real de movimento reduzido, conforme `capture-meta.json`.
- **OBSERVADO.** O console desktop registrou stalls de `ReadPixels` WebGL e interrupções de `play()` por nova carga. Evidência: `browser-console.json`. O impacto sustentado em FPS e energia é **INDISPONÍVEL**.
- Os recursos brutos permanecem material local de pesquisa e não devem ser preparados para publicação.
