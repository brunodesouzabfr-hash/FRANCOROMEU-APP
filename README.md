# FRANCOROMEU-APP
Aplicação web e Android de orçamento, portfólio e atendimento da Franco Romeu.

## Automação de engenharia

O prompt operacional para sincronizar GitHub, Linear e Slack, incluindo as
regras de segurança para execução em lote, está documentado em
[`docs/orquestrador-cicd.md`](docs/orquestrador-cicd.md).

Execute a auditoria local em modo somente leitura:

```bash
python3 tools/orchestrator.py --output orchestrator-report.json
```

Snapshots JSON exportados dos conectores podem ser cruzados com
`--github-snapshot` e `--linear-snapshot`. O comando nunca escreve nos
conectores: ele gera o inventário, os achados, o plano em lote com chaves de
idempotência e uma prévia Block Kit para aprovação.
