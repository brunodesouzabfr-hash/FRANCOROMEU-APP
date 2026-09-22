# Decisão: `main` como base canônica da Franco Romeu

**Data da decisão atual:** 22 de setembro de 2026
**Decisão do proprietário:** a branch `main` atual é a única base funcional e visual canônica do projeto e corresponde à aplicação publicada em `https://francoromeu-app.vercel.app/`.

Esta decisão substitui a orientação de 21 de agosto de 2026 que usava a branch `codex/etapa-15-materialidade-imersiva` como base provisória.

## Estado de cada linha de trabalho

| Item | Estado atual | Uso daqui em diante |
|---|---|---|
| `main` | Canônica e publicada | Fonte de verdade do produto. Todo novo trabalho deve partir da versão mais recente da `main`. |
| Site Vercel | Produção | `https://francoromeu-app.vercel.app/` representa a aplicação canônica publicada. |
| PR #6 / `codex/etapa-15-materialidade-imersiva` | Histórico | Não usar como base de desenvolvimento. Conservar apenas para rastreabilidade da evolução. |
| PR #3 / Etapa 13.1.3 | Histórico intermediário | Não continuar separadamente. |
| PR #4 / Etapa 14 | Histórico intermediário | Não continuar separadamente. |
| PR #5 / “sites individuais” | Rejeitado | Não reutilizar layout, navegação nem decisões visuais. |
| `develop` | Sem papel no fluxo atual | Não usar como base sem nova decisão explícita. |

## Consequências práticas

1. Antes de qualquer trabalho, atualizar e inspecionar a `main`.
2. Branches de tarefa, quando necessárias, devem nascer da `main` atualizada.
3. Alterações diretas na `main` são permitidas somente quando o proprietário as autorizar explicitamente.
4. Sem autorização explícita para alteração direta, usar branch de tarefa e revisão antes de integrar.
5. A aplicação publicada e a documentação de governança devem permanecer coerentes com a `main`.
6. Branches e PRs antigos não voltam a ser canônicos por terem nomes de etapa; servem apenas como histórico.
7. A experiência atual pode receber melhorias incrementais, mas não deve ser substituída por outro redesign completo sem nova decisão do proprietário.

## Gate de qualidade

Toda alteração, direta ou via PR, deve preservar os contratos descritos em `AGENTS.md` e executar, no mínimo:

```bash
npm test
npm run check:html
```

Quando aplicável, também devem ser registrados testes visuais, responsivos, de teclado, cálculo, persistência, PDF e integrações externas.

## Registro desta atualização

A atualização da governança e das metatags do site foi autorizada diretamente pelo proprietário em 22 de setembro de 2026. Ela não autoriza exclusão de branches, fechamento de PRs históricos ou redesign da aplicação.
