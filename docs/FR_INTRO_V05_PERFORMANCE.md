# FR Intro V05 — revisão de desempenho
Data: 2026-10-15. Base: main commit 1d9caa6.

## Causa diagnosticada
O motor V04 executava requestAnimationFrame junto a deadline=setTimeout. Em dispositivos lentos, a interrupção por tempo encerrava o overlay antes do término do fade visual.

## Implementação
- Elimina timeout de finalização e o botão Pular introdução.
- Executa a saída apenas quando position>=1, depois de duas oportunidades de pintura do quadro preto final.
- Limita a progressão por quadro e adapta taxa de atualização à lentidão, sem saltar etapas.
- Perfil leve: Canvas com DPR<=1, nevoa sem blur e redraw de cenário a cada três quadros.
- Configurações visuais aprovadas mantidas: cascade/fracture/fault, #E6D6B5, duration17, speed1.8, motion2.5, fog100.
- Durante a intro, o conteúdo subjacente não é pintado; suas animações CSS são pausadas. Scripts de negocio, SEO e downloads da SPA continuam no HTML. Não é isolamento total do thread principal.
- Pausa ao ocultar aba; o modo reduced motion entrega quadro estático e libera sem animação longa.
- Mantém evento fr:intro-complete e sessionStorage fr_intro_v04_seen para compatibilidade.

## QA
- node --check: aprovado na implementação equivalente de teste local.
- Chromium, celular 390x844: concluiu e liberou fundo sem JS errors.
- Chromium com RAF artificial a 8 FPS: permaneceu na revelação, concluiu a saída e liberou em ~14s.
- prefers-reduced-motion: liberação imediata aprovada.
- Dispositivo físico de baixa potência: QA ainda pendente.

## Rollback
Reverter este commit, sem modificar orçamento, rotas ou base de serviços.
