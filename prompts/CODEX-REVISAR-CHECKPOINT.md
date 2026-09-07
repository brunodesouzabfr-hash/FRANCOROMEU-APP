# Prompt curto de revisão de checkpoint

Revise as alterações não commitadas da Etapa 16 sem modificar arquivos.

Leia `AGENTS.md`, `docs/fr-etapa16/MASTER-BRIEF.md`, `docs/fr-etapa16/HTML-AUDIT-ETAPA15.md`, `docs/fr-etapa16/ETHICAL-CRO-POLICY.md` e `docs/fr-etapa16/REGRESSION-CHECKLIST.md`.

Priorize:

1. regressão em `FRBudgetCore`, `__frCore`, calculadora, IQE, busca, rotas, storage e modal de projeto;
2. duplicação de listener/RAF/observer e competição entre etapas históricas;
3. cursor/foco/body lock em overlays;
4. gesto do cubo, captura de scroll e mobile;
5. acessibilidade, reduced motion, zoom e teclado;
6. embed inseguro, script antecipado, URL sem allowlist ou raw HTML;
7. claims, cases, valores, prova social, escassez ou direitos não validados;
8. cópia indevida de referências;
9. ausência de rollback por flag;
10. performance e vazamento de recursos.

Entregue achados por severidade com arquivo/símbolo, evidência, impacto e correção mínima. Depois liste testes faltantes. Não elogie nem resuma antes dos achados. Se não houver achado, declare quais superfícies foram realmente verificadas e quais não puderam ser verificadas.

