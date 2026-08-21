# Decisão: base canônica da Franco Romeu

**Data:** 21 de agosto de 2026  
**Decisão do proprietário:** a Etapa 15 — Materialidade Imersiva é a base funcional e visual para o desenvolvimento futuro.

## Estado de cada linha de trabalho

| Item | Estado | Uso daqui em diante |
|---|---|---|
| `main` | Versão estável oficial atual | Não desenvolver diretamente. Receberá a nova base somente após aprovação e merge do PR #6. |
| PR #3 / Etapa 13.1.3 | Intermediária, substituída | Manter apenas como histórico. Fundamentos úteis já chegaram à base canônica. |
| PR #4 / Etapa 14 | Intermediária, substituída | Manter apenas como histórico. Não continuar seu visual separadamente. |
| PR #5 / Etapa 15 “sites individuais” | Rejeitada | Não reutilizar layout, navegação nem decisões visuais. |
| PR #6 / Etapa 15 “Materialidade Imersiva” | Canônica, em desenvolvimento | Única base autorizada para melhorias atuais. Permanece rascunho até o gate de qualidade. |
| `develop` | Sem papel no fluxo atual | Não usar como base enquanto não houver uma decisão explícita sobre sua finalidade. |

## Consequências práticas

1. Todo novo trabalho deve partir de `codex/etapa-15-materialidade-imersiva` enquanto o PR #6 não for integrado.
2. Os PRs #3, #4 e #5 podem ser fechados sem merge porque foram substituídos pelo PR #6.
3. As branches anteriores serão mantidas temporariamente como histórico; fechá-las ou manter um PR fechado não apaga código.
4. O PR #6 deve apontar diretamente para `main`, mostrando a mudança completa que poderá virar a próxima versão oficial.
5. Nenhum merge, publicação ou exclusão de branch faz parte desta decisão.
6. A base canônica pode receber melhorias incrementais, mas não deve ser substituída por outro redesign sem nova decisão do proprietário.

## Gate antes de integrar à main

O PR #6 permanece como rascunho até haver validação suficiente de:

- Chrome, Safari e Firefox reais;
- 390 px, touch e navegação responsiva;
- GPU/WebGL e fallbacks;
- rede lenta e falhas de dependências;
- Calculadora, IQE e PDF;
- teclado, foco e movimento reduzido;
- imagens e alegações comerciais;
- testes automatizados existentes.

Quando esse gate for concluído, o proprietário decidirá explicitamente se o PR #6 pode sair de rascunho e ser integrado à `main`.
