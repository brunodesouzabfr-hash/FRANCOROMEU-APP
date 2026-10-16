# CHECKPOINT 7 — Navbar Franco Romeu

Data: 15/10/2026.
Branch: feature/fr-motion-phase1-2026-10-15.
Estado: implementação em branch isolada; sem merge nem deploy.

## Diagnóstico confirmado
O site possui várias camadas históricas e conflitantes da navegação: nav-state-header (topo), nav-state-floating (inferior), nav-state-hidden, ajustes de responsividade críticos com !important e estilos fr-site-foundation que forçam todas as versões ao topo. Isso causava geometria instável, tipografia mobile muito pequena, estados neutralizados e risco de sobreposição.

## Implementação
- src/fr-nav-phase7.cjs: insere nova folha de estilos e runtime apenas quando âncoras da navbar original estão presentes.
- assets/css/fr-nav-phase7.css: sistema visual escopado à classe fr-nav7-ready. Nav fixa e estável no topo; cores verde petróleo, osso, dourado e laranja; bordas assimétricas discretas; logo original como Home; rótulos de uma linha; alinhamento; alvos de 44 px.
- assets/js/fr-nav-phase7.js: expandida na parte superior, compacta após 75 px; ocultação orgânica após scroll descendente acima de 195 px; retorna ao subir, à rota inicial e com foco de teclado. Rolagem passiva, um requestAnimationFrame por evento no máximo, sem captura de wheel ou touchmove.
- Abaixo de 1050 px: preserva dialog nativo original de menu, seus seis links e botão de pesquisa; contatos WhatsApp e Instagram continuam no header. Até 600 px: controles compactos, safe area e ajuste de largura.
- Estado atual da SPA é identificado via frViewChanged e view-section.active. Mantém todos os data-fr-view e aria-current, sem trocar roteador, calculadora, IQE, motor dos popups, preço ou armazenamento.
- Oculta e torna não interativa a navegação com menus ou modais ativos (menu, IQE, inspector 3D, modal de ambientes e overlays conhecidos). Fechamento do dialog libera inert imediatamente antes da restauração do foco.
- prefers-reduced-motion preserva navegação estática e elimina as transições.
- window.FRNav7.destroy() limpa classes, observers e listeners e devolve a aparência original; window.FRNav7.mount() reativa.

## Arquivos
src/fr-nav-phase7.cjs
assets/css/fr-nav-phase7.css
assets/js/fr-nav-phase7.js
tests/fr-nav-phase7.test.cjs (oito casos)
scripts/build-site.cjs
package.json
.github/workflows/fr-motion-branch-qa.yml
docs/fr-motion/CHECKPOINT_7.md

## Validação
CI da branch: https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/workflows/fr-motion-branch-qa.yml

Os testes específicos Fases 1–7 passaram na execução GitHub Actions anterior à criação desta documentação. Verificar o resultado do workflow do HEAD para build/HTML/biblioteca e idempotência.

Bloqueios para fechamento:
- GA4 legado: a branch exige G-C3FMZ4NGGY, enquanto a main atual usa G-22Z85RCGQC; o teste de integração reprova a tag antiga/ausente. Não alterar analytics sem reconciliar fonte da verdade.
- Divergência da main: alterações paralelas de introdução, logo, SEO e teste de GA4 requerem integração controlada; não fazer rebase ou merge nesta fase.
- QA visual: inspecionar Chromium real em desktop 1440×900, tablet, mobile 390×844 e 320×568. Conferir overlay, foco, ícones, popups, performance e reduced motion; jsdom e build não são homologação visual.

## Rollback
Runtime: window.FRNav7.destroy().
Persistente: reverter somente commits desta fase. Preservar todas as Fases 1–6.

## Próxima fase
Fase 8: QA visual integrado e correções, reconciliação, analytics e preparação para publicação sob aprovação. Não executar agora.

## REABERTURA E CORREÇÃO DEFEITIVA — Fase 7.1

**Motivo:** a implementação anterior estava tecnicamente aprovada em jsdom, mas não reproduzia a solicitação real. Ela ocultava a navbar no scroll em vez de levá-la ao rodapé da tela; estilos legados voltavam a dominar a cascata após a rolagem, e o Orçamento podia expandir a barra lateralmente.

**Causas verificadas com Chromium:**
1. Com viewport 1440 px, o uso de left:50% em um bloco cujo containing block descontava o scrollbar deslocava o centro 7,5 px. Mudança para left:50vw.
2. Controladores históricos substituem nav.className no scroll, removendo fr-nav7-ready. Assim o CSS novo era desativado e o layout voltava a 1401 px de largura, top:8px e border-radius:0. O contrato CSS agora usa exclusivamente os atributos data-fr-nav7-version="7.1", data-fr-nav7-position="footer" e data-fr-nav7-state="modal", que não são apagados pela substituição de classes.
3. A posição não é mais um simples show/hide. Na origem fica no header; a partir de 160 px no scroll se desloca, com transição orgânica de top/width, para um dock inferior centrado. Retorna ao topo abaixo de 90 px, com histerese. É funcional no Orçamento e em todas as demais rotas.

**Medições reais do navegador Chromium:** execução https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38832216789

| Cenário real | Header (left/right/top/bottom px) | Dock inferior (left/right/top/bottom px) | Resultado |
|---|---|---|---|
| Home 1440×900 | 80 / 1360 / 12 / 84 | 440 / 1000 / 822 / 884 | PASS |
| Orçamento 1440×900 | 80 / 1360 / 12 / 84 | 440 / 1000 / 822 / 884 | PASS |
| Home 390×844 | 8 / 382 / 12 / 72 | 50 / 340 / 774 / 832 | PASS |
| Orçamento 390×844 | 8 / 382 / 12 / 72 | 50 / 340 / 774 / 832 | PASS |
| Home 320×568 | 8 / 312 / 12 / 72 | 15 / 305 / 498 / 556 | PASS |

Todos os cinco cenários passaram nas condições de centro geométrico ±3 px, radius >=100 px (raio efetivo CSS 999px), viewport sem cortes laterais, dock perto do rodapé e retorno ao topo. O teste verifica ainda abertura/fechamento do menu mobile e restauração de interação. Capturas em https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38832216789/artifacts/12017318454.

**Testes adicionais:**
- tests/fr-nav-phase7.test.cjs verifica também a substituição integral de nav.className pelo código legado, e o roteamento SPA sem modificação de handlers.
- tests/fr-nav-browser-phase7.cjs executa navegador Chromium real no dist compilado, com screenshots, sem hospedagem externa/deploy.
- .github/workflows/fr-motion-branch-qa.yml tem job independente nav-chromium para essa validação, além dos testes de regressão e build tradicionais.

**Pendências preservadas fora desta correção:** GA4 (suíte integral), divergência com main, revisão visual global das outras partes do site e performance em dispositivos físicos. Esta correção não autoriza merge nem deploy.

**Rollback:** window.FRNav7.destroy(), que remove os atributos e classes visuais, devolvendo a navbar à apresentação original sem apagar links, dialog, IQE ou Orçamento.


## AJUSTE F7.2 — ORÇAMENTO EXCLUSIVAMENTE FIXO NO HEADER (16/10/2026)

**Instrução do proprietário:** a aba Orçamento é a única em que a navbar deve permanecer fixa no topo para não conflitar com a calculadora e o conteúdo de orçamento. As demais abas continuam com a transição orgânica entre header e dock inferior no scroll.

**Alteração efetiva:** em `assets/js/fr-nav-phase7.js`, o controlador verifica `view-orcamento.active` e inibe o dock independentemente da rolagem. Na troca de rota, sincroniza imediatamente a posição, evitando um frame com a barra no rodapé ao abrir o Orçamento. O comportamento do dock permanece ativo em todas as outras views. Nenhum roteador, botão, popup, IQE ou código de orçamento foi substituído.

**Regressões novas:** `tests/fr-nav-phase7.test.cjs` testa Orçamento sob múltiplas profundidades de scroll, escrita de `className` pelo legado, navegação de saída para Sobre em scroll profundo e retorno ao Orçamento, além de carregamento inicial da aba com scroll alto. `tests/fr-nav-browser-phase7.cjs` testa explicitamente navbar fixa no topo do Orçamento após scroll real e dock inferior na Home, com capturas nos dois estados.

**Medições reais no Chromium:** https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38972807276
- Home desktop 1440×900, após scroll 510: dock `top=822px, bottom=884px`, centro `720px`.
- Orçamento desktop 1440×900, após scroll 510: header `top=12px, bottom=84px`, centro `720px`.
- Home mobile 390×844, após scroll 510: dock `top=774px, bottom=832px`, centro `195px`.
- Orçamento mobile 390×844, após scroll 510: header `top=12px, bottom=72px`, centro `195px`.
- Home mobile 320×568, após scroll 510: dock `top=498px, bottom=556px`, centro `160px`.

**Resultado:** cinco cenários Chromium aprovados, incluindo Orçamento desktop/mobile. Evidências: https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38972807276/artifacts/12076544799.

**Condições preservadas:** sem merge, rebase ou deploy manual; bloqueio legado GA4, divergência da main e QA global continuam para fase posterior.
