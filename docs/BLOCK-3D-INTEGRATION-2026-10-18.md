# BLOCK 3D — integração IQE

## Origem

- Base do site: `7f9ab0cd03faf9ddd9ee4780be6833dff1f4df92`.
- Fonte do mascote: [Block PR #7](https://github.com/brunodesouzabfr-hash/fr-block-mascote-lab/pull/7), commit `7101ef8b782eb11c0fc7192fa0889f3010845945`.
- SHA-256 de `assets/js/fr-block-avatar.iife.js`: `b5dcbe4f4c3aded0ce6a4b99b981d4e1ca029a1124e1d0c783f29dd4a1130869`.
- O arquivo é o bundle gerado por `npm run build:avatar`, também versionado em `release/iqe` no laboratório. O teste do site fixa o mesmo hash.

## Arquitetura e auditoria do recorte

O antigo canvas era descendente de `.fr-ai-robot` no botão `#fr-ai-launcher`. A cadeia IQE possui dimensões de ícone, formas circulares, transformações e contextos de empilhamento. As correções de overflow da PR #33 não removiam a borda física do próprio canvas.

Agora os hosts `data-fr-block-host` de launcher, cabeçalho e companheiro são filhos diretos de `document.body`, com posição fixa, fundo transparente e `pointer-events:none`. Isso remove a dependência de overflow, radius, clip-path, mask, contain e isolation dos ancestrais do ícone. O motor ajusta a projeção à silhueta completa, incluindo acessórios, antes de desenhar; aumentar só o CSS do canvas deixou de ser a estratégia.

Um alvo limitado ao corpo (`data-fr-block-hit`) acompanha o personagem e delega exatamente um clique ao botão original. O launcher continua sendo a parada de teclado e dono do IQE. As trajetórias verificam o corredor inteiro contra controles e formulários. Safe areas, viewport visual, movimento reduzido, modais, foco em campos e jornada crítica limitam ou estacionam o personagem. O Mini Block usa outro host sem capturar cliques.

`destroy()` libera listeners, RAF, observadores e hosts e restaura os nós originais por identidade. O bootstrap permite montar novamente. Bolhas nativas têm prioridade sobre as dicas adicionais.

## Escopo preservado

Não foram alterados serviços, IDs, preços, fórmulas, armazenamento de orçamento, PDF, busca, dados de clientes ou handlers do atendimento. Nenhum nível de fidelidade é inferido de um visitante; descontos dependem de campanha explicitamente autorizada e vigente. Metricool e demais alterações presentes na base continuam no tree original.

## Verificação

O laboratório passou em 68 testes, tipagem e bundle; o CI do primeiro commit passou em todos os passos. A varredura do motor cobriu 336 combinações sem recorte. Natal e Páscoa foram inspecionados na prévia Lovable sincronizada. Os 11 testes de contrato do site passaram localmente. O workflow desta branch verifica a página gerada em Chromium a 1440, 320, 360 e 390 px, arquiva screenshots e testa clique, redução de movimento, companheiro, desmontagem e remontagem.

O resultado efetivo dos workflows está nos checks da PR. Não houve medição em telefone físico nem validação comercial de conversão. Aprovação estética humana permanece distinta dos testes automatizados.

## Ativação e reversão

A branch `feat/block-spatial-iqe-2026-10-18` é permitida apenas como preview Vercel com noindex. A política de ativação da main em produção já existente foi preservada; não houve merge ou promoção de produção nesta tarefa. `FR_BLOCK_IQE_ENABLED=0` no próximo build restaura o visual anterior; a API `FRBlockStage.destroy()` permite rollback visual na sessão.
