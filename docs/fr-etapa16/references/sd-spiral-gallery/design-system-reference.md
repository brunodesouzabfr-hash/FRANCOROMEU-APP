# Especificação de referência — galeria espacial

## Resumo executivo

Esta leitura cobre exclusivamente a captura local de 22/08/2026. Ela não recupera nem pretende reconstruir o código-fonte original. O padrão comprovado no desktop é uma composição de uma dobra: canvas WebGL em tela inteira, conteúdo editorial central em camada superior, cabeçalho e crédito fixos e um CTA em cápsula. No mobile, a experiência principal não é oferecida: a página mostra um estado centralizado de “não suportado”.

O princípio transferível para a Franco Romeu é a **profundidade espacial como experiência adicional**, com interface editorial mínima acima de uma superfície visual imersiva. A implementação FR deverá ser original, acionada explicitamente após a entrada atual de cada aba, possuir fallback funcional e restaurar foco, scroll, seleção e estado ao fechar.

Confiança geral: **média**. Geometria, tipografia computada, camadas e breakpoint têm evidência direta; paleta, parâmetros 3D, curvas de easing, gestos, estados de hover e custo real de assets estão indisponíveis.

## Inventário de tokens observados

### Cores

- **INDISPONÍVEL** — a paleta foi omitida intencionalmente. Evidência: `design-tokens.json`, desktop 1440×900 e mobile 390×844, `colors: []`, `paletteOmitted: true`; `capture-meta.json`, `paletteOmitted: true`. Nenhuma cor da referência deve ser deduzida.

### Tipografia

- **OBSERVADO** — família `Jaguar`: 10 ocorrências desktop e 4 mobile. `Arial`: 5 ocorrências desktop. Evidência: `design-tokens.json`, viewports 1440×900 e 390×844, inventários `fontFamilies`.
- **OBSERVADO** — H1 desktop `section.hero > h1`: Jaguar, 92.8px, peso 700, line-height e tracking `normal`; caixa 1002.48×178px em (218.75, 317.5). Evidência: `layout-map.json`, desktop 1440×900, seletor citado.
- **OBSERVADO** — tamanhos desktop: 16px (9), 13.3333px (5), 92.8px (1); pesos 400 (14) e 700 (1). Evidência: `design-tokens.json`, desktop 1440×900.
- **OBSERVADO** — fallback mobile `#not-supported > h1`: Jaguar, 48px, 700, caixa 350×46px em (20, 371). O inventário ainda registra 24px (2) e 16px (1). Evidência: `layout-map.json` e `design-tokens.json`, mobile 390×844.
- **INDISPONÍVEL** — licença, métricas internas, substitutos e adequação de `Jaguar` à marca FR. O arquivo foi solicitado publicamente, mas não salvo. Evidência: `resources-manifest.json`, ambos os viewports, recurso `/assets/font/Jaguar.otf`, `localFile: null`.

### Espaçamento, raios e sombras

- **OBSERVADO** — espaçamentos discriminantes no desktop: 32px entre as linhas do hero, 12px no CTA; paddings recorrentes 30px horizontal/20px vertical (2 ocorrências cada), além de valores isolados 24, 16, 10, 6, 5 e 4px. Evidência: `layout-map.json`, desktop, `.hero` e `section.hero > button`; `design-tokens.json`, desktop.
- **OBSERVADO** — mobile: padding horizontal 20px e margin-bottom 10px, uma ocorrência cada. Evidência: `design-tokens.json`, mobile 390×844.
- **OBSERVADO** — raios desktop: `100%` (4) e `50px` (4); nenhum raio computado no estado mobile. Evidência: `design-tokens.json`, `radii`.
- **OBSERVADO** — nenhuma sombra ou filtro foi inventariada em nenhum viewport. Evidência: `design-tokens.json`, `shadows: []`, `filters: []`.

## Grid, medidas, responsividade e hierarquia

- **OBSERVADO** — documento sem rolagem: viewport e área rolável medem 1440×900 no desktop e 390×844 no mobile; checkpoints permanecem em `scrollY: 0`. Evidência: `capture-meta.json` e `layout-map.json`, `metrics`/`scrollCheckpoints`.
- **OBSERVADO** — desktop: `#main-content > canvas` é fixo, 1440×900, z-index 0 e overflow `clip`; `.hero` ocupa 1440×900, posição relativa, z-index 30, grid central de 1002.48px com linhas 178px/55px e gap 32px. Evidência: `layout-map.json`, desktop, seletores citados.
- **OBSERVADO** — header fixo mede 1440×55px, z-index 50, flex horizontal com `space-between`. Footer fixo ocupa 112.41×55px no canto inferior direito, também z-index 50. Evidência: `layout-map.json`, desktop, `#main-content > header.header` e `#main-content > footer.footer`.
- **OBSERVADO** — CTA desktop mede 184.14×55px, é flex com alinhamento central e gap 12px; o invólucro circular do ícone mede 40×40px e o SVG 18.38×18.38px com rotação computada de 45°. Evidência: `layout-map.json`, desktop, `section.hero > button`, `button > span.icon:nth-of-type(2)` e `span.icon > svg`.
- **OBSERVADO** — media queries públicas detectadas em `max-width: 1024px` e `min-width: 1025px`. Em 390px, `body` é flex centralizado, sem overflow, e somente o fallback é mapeado; o canvas possui buffer 390×844, porém caixa renderizada 0×0. Evidência: `design-tokens.json`, `mediaQueries`; `layout-map.json` e `dependencies.json`, mobile.
- **INFERIDO** — 1024/1025px funciona como corte entre experiência imersiva e estado não suportado, pois o desktop acima do limite expõe hero/canvas e o mobile abaixo do limite não expõe interativos. Não há captura exatamente no limite. Evidência: mesmos arquivos e viewports acima.

Hierarquia visual comprovada por camadas: canvas (0) → hero (30) → chrome fixo (50). É uma relação transferível; os números específicos não precisam ser copiados.

## Catálogo de animações e interações

- **OBSERVADO** — CTA: cursor pointer e transição `transform 0.3s, background-color 0.3s, box-shadow 0.3s`. Evidência: `layout-map.json`, desktop 1440×900, `section.hero > button`.
- **OBSERVADO** — um `transform 0.3s` adicional e 13 ocorrências de transição `all` aparecem no inventário desktop; no mobile são 4 ocorrências de `all`. Evidência: `design-tokens.json`, `transitions`.
- **OBSERVADO** — link do footer tem cursor pointer e `transition: all`. Evidência: `layout-map.json`, desktop, `footer.footer > a`.
- **INDISPONÍVEL** — nenhum keyframe, animação ativa, amostra durante exercício ou mudança de hover foi registrada. Evidência: `animations.json`, todos os arrays vazios.
- **INDISPONÍVEL** — movimento da galeria, gestos, inércia, duração, easing, resposta a ponteiro/teclado, abertura do CTA e restauração de estado. Não houve ação de entrada, clique nem screenshot pós-ação. Evidência: `capture-meta.json`, `entryAction: null`; `layout-map.json`, `entryTransition.clicked: false` e `stateScreenshots: []`.

## Dependências detectadas e confiança

- **OBSERVADO / confiança alta** — um módulo público `/assets/index-BSSXJ9N0.js` e um stylesheet `/assets/index-DmlARsBh.css` foram carregados; CSS acessível com 19 regras. Evidência: `dependencies.json` e `design-tokens.json`, ambos os viewports.
- **OBSERVADO / confiança média-alta** — detector sinaliza `three: true` e `webglCanvas: true`; canvas desktop em tela inteira confirma renderização WebGL. Evidência: `dependencies.json`, desktop e mobile; `layout-map.json`, desktop canvas.
- **OBSERVADO / confiança média** — detector não encontrou GSAP, Lenis, Locomotive Scroll, Barba, Swiper, Next ou Nuxt. Ausência de detecção não prova ausência no código original. Evidência: `dependencies.json`, `detected`.
- **OBSERVADO / confiança alta** — manifesto registra 178 requisições de imagem WebP, além de documento, fonte, script e stylesheet; os recursos têm `localFile: null`. Evidência: `resources-manifest.json`, ocorrências por `resourceType`.
- **INFERIDO / confiança média** — a repetição de URLs de imagens com parâmetros variáveis sugere atualização dinâmica da textura/seleção; sem bundle salvo ou exercício de interação, não se pode atribuir mecanismo. Evidência: `resources-manifest.json`, URLs `/assets/img/*.webp?v=...`.
- **OBSERVADO / risco de desempenho** — console desktop registrou quatro avisos WebGL de stall de GPU por `ReadPixels`. Evidência: `browser-console.json`, desktop 1440×900.

## Evidências por viewport

| Viewport | Evidência comprovada | Leitura |
| --- | --- | --- |
| Desktop 1440×900, DPR 1 | 19 elementos no escopo; hero e canvas de uma dobra; header/footer fixos; CTA interativo; H1 92.8px | Experiência espacial funcional com interface mínima e camadas explícitas. |
| Mobile 390×844, DPR 1 | 19 elementos no escopo; body centralizado; H1 de fallback; zero interativos; canvas com rect 0×0 | A experiência principal é deliberadamente substituída por fallback, não responsivamente adaptada. |

Fontes: `capture-meta.json`, `layout-map.json`, `design-tokens.json`, `dependencies.json`, `animations.json`, `resources-manifest.json` e `browser-console.json`.

## Limitações da captura

- Captura não profunda, sem ação de entrada e sem estados exercitados.
- Paleta omitida intencionalmente; cores são indisponíveis.
- Arquivos citados em `evidence.md` (`page-desktop.html`, `page-mobile.html` e screenshots) não existem no diretório auditado; portanto não foram usados.
- HTML, CSS, fonte, imagens e bundle aparecem apenas como metadados/URLs, não como arquivos locais. Não houve inspeção de bundle JavaScript.
- Somente dois viewports; comportamento entre 391 e 1439px e exatamente em 1024/1025px não foi observado.
- Sem evidência de teclado, leitor de tela, foco, contraste, reduced motion, orientação, touch, resize, perda de contexto WebGL ou falha de rede.
- O manifesto registra solicitações, não peso transferido real: `savedBytes` globais não devem ser confundidos com custo dos recursos não salvos.

