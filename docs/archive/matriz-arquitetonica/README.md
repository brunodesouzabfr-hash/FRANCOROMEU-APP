# Matriz arquitetônica — arquivo

## Origem

Componente experimental da Etapa 14, anteriormente injetado antes do visualizador de Projetos 3D em `index.html`.

## Conteúdo preservado

- `matrix-source.js`: carregamento sob demanda de Three.js, cena WebGL, seleção, controles e fallback bidimensional.
- `matrix-styles.css`: composição visual, estados de foco e regras responsivas exclusivas.

## Motivo do arquivamento

A Matriz arquitetônica duplicava a navegação do laboratório principal sem acrescentar uma função necessária. Ela foi retirada da interface pública e do carregamento em produção para reduzir peso e ruído antes do cubo 3D preservado.

## Dependências originais

- Three.js `0.161.0`, carregado por CDN;
- utilitários `$`, `$$`, `activeView` e `safeEvent` da Etapa 14;
- integração opcional com `window.p3dSetActive`;
- `ResizeObserver`, WebGL e Pointer Events.

## Reutilização futura

O código pode servir como protótipo para um índice espacial isolado. Qualquer retorno deve ocorrer sobre a base canônica vigente, com justificativa funcional, teste de desempenho e sem competir com o laboratório tridimensional principal.

