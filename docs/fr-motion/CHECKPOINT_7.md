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