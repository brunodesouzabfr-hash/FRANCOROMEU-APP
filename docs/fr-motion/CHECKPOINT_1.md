# ꟻR / CHECKPOINT 1 — Motor Dual Split Scroll

Base: `239ba51056a51d6b7b4fa4179f5b62d42e0076af` / branch `feature/fr-motion-phase1-2026-10-15`
Fonte visual: `FR_Arquitetura_em_Movimento_Mersi_Inspirado_v1(1).zip` (SHA-256 `4f92e224aae59a71d2049862152b0c3c9d57ad93bde7d2022107f7c3fca12755`).

## Implementado
- Motor reutilizável de dupla revelação oposta, `clip-path`, sticky `100svh`, dois lados e card central de dupla borda.
- Renderização das cenas no build, com cinco pares de ambientes distintos na Home e todos os pares elegíveis no Portfólio.
- Os cards usam título/rota oriundos do catálogo de mídia compilado, evitando texto copiado de outros sites.
- Carregamento progressivo das imagens, amostragem cromática com fallback, contraste de texto e CSS móvel em duas bandas.
- Links indexáveis para os estudos, lista alternativa acessível e suporte a `prefers-reduced-motion`.
- Somente os arquivos desta integração são alterados; não tocar em preços, serviços, orçamento, IQE, navbar nem no atlas de Ambientes nesta fase.

## Fronteiras de aprovação
- A lista de cinco pares ainda é curadoria técnica provisória; confirmar visualmente os cinco melhores e distinguir projeto 3D→execução na fase editorial.
- Catálogo legado mantém classificações anteriores; proprietário confirmou que o acervo é FR e as obras são reais. Normalização do catálogo exigirá rastreabilidade, revisão e gate de fontes, em fase posterior.
- Fase Ambientes 3+6+3 substituirá o atlas visual APENAS no checkpoint específico; o atual segue preservado.
- A integração não fornece modal novo nesta fase: cada card abre a rota de estudo existente.

## Checagens
Executar `node --check assets/js/fr-motion-split.js`, `node --test tests/fr-motion-phase1.test.cjs`, `npm test`, `npm run check:html`, `npm run build`, `npm run check:idempotence` e QA visual em 390x844 e desktop. Testes completos dependem de checkout acessível no executor. Não afirmar execução não realizada.

## Rollback
Reverter o commit único deste checkpoint ou remover apenas a chamada `require('../src/fr-motion-phase1.cjs')(doc,prepared)` do build. Não existem alterações de `localStorage` ou APIs financeiras.

Sem merge e sem deploy. Revisão independente pendente.

## Evidências observadas no chat (15/10/2026)
- GitHub: branch criada sobre `main@239ba510`, diff isolado e commits de fase, nenhum merge/deploy.
- V8: código fonte do adaptador e runtime compilado com sucesso.
- Mock de build DOM com 60 pares: inserção de 5 cenas na Home e 60 no Portfólio, dois conjuntos independentes; assets e hook do build vinculados.
- Mock de scroll: máscaras esquerda/direita em sentidos opostos, transição 02/05→03/05, progresso cromático de cenas, inicialização e teardown sem exceção.
- Originais de imagem e SPA completos não disponíveis para testes integrados no ambiente conectado. `npm test`, `npm run check:html`, `npm run build` e Chromium sobre o site compilado seguem PENDENTES. O workflow existente só reage a push na `main` ou PR, portanto não foi acionado (sem PR ou publicação autorizada).
- Nenhuma mudança da estrutura 3+6+3 em Ambientes nesta fase; mantém-se como checkpoint futuro aprovado.
