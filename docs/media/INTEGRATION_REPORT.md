# Relatório de integração do acervo editorial FR

Data da execução: 2026-10-12  
Branch: `codex/site-refactor-release-1`  
Canônico editorial: `https://www.francoromeufr.com.br`

## Raízes resolvidas

- `CODEX_ROOT`: `/home/romeu/###PROGRAMAS###/FRANCO ROMEU/FRANCOROMEU-APP/CODEX USE AQUI`
- `REPO_ROOT`: `/home/romeu/###PROGRAMAS###/FRANCO ROMEU/FRANCOROMEU-APP`
- `PACKAGE_ROOT`: `/home/romeu/###PROGRAMAS###/FRANCO ROMEU/FRANCOROMEU-APP/CODEX USE AQUI/FRANCO_ROMEU_ACERVO_EDITORIAL`

A entrega estava extraída; não foi necessário usar ZIP de transporte. O conteúdo existente em `CODEX USE AQUI/` e as alterações não rastreadas anteriores foram preservados.

## Integrado

- Oito manifests obrigatórios e três manifests complementares em `content/`.
- Documentação, auditoria, catálogos, mapas, CSVs, exemplos, sitemap rascunho e atlas em `docs/media/`.
- `docs/media/RENAMING_EXECUTION.csv`, com 684 linhas, fontes, hashes, destinos planejados, status e motivo.
- `prepared-media/editorial/`, fora de `public/`, com 284 WebP, um por mídia `PRIMARY`/`SECONDARY` elegível única.

`media-recovery/` permanece resolvível no `PACKAGE_ROOT`, com 15 derivados recuperados. Ele não foi duplicado para o site nem convertido em publicação automática.

## Fontes, derivados e bloqueios

- 684 linhas do lote de nomenclatura: zero colisões, zero fonte ausente e zero divergência de SHA-256.
- 284 derivados preparados: fontes WebP adequadas reutilizadas; demais fontes convertidas realmente para WebP por Pillow, sem upscale.
- Todos os 284 derivados decodificam como WebP e respeitam a dimensão nativa da fonte.
- `HOLD.csv`: 53 registros; `I124` permanece `HOLD_INCOMPLETE`.
- `DUPLICATES.csv`: 199 relações/ocorrências auditadas; não houve exclusão de original.
- `SOURCE_REFERENCE_GAPS.json`: lacunas históricas mantidas como diagnóstico. O ledger registra 138 fontes históricas ausentes, 45 presentes no pacote por hash e quatro com variante aprovada disponível no repositório.
- Os arquivos de transporte removidos permanecem indisponíveis e não foram recriados. Isso não remove os 15 recortes recuperados nem altera fontes.

Nenhuma mídia `HOLD`, `ARCHIVE`, `DUPLICATE`, `REFERENCE` ou referência externa foi exportada como derivado editorial elegível. Os pares continuam ANTES RECONSTITUÍDO / DEPOIS ILUSTRATIVO e as trilhas terminam em exemplo ilustrativo.

## Validações executadas

- `PACKAGE_SHA256SUMS.txt`: 82/82 entradas `OK`.
- Validador entregue: `PASS`, zero erros; 1.020 originais hasheados, 1.451 pares de hash verificados, 4.404 referências resolvidas, 162 dimensões de variantes, 15 recuperações pixel-a-pixel, 60 pares e 52 trilhas.
- Política: publicação habilitada `0`; `auto_publish=false`; indexação ativa `false`.
- Integridade dos derivados: 284/284 decodificados, 0 upscale, 0 ausentes.
- Nenhuma alteração em `FRBudgetCore`, preços, cupons, domínio, páginas, componentes ou produção.

## Pendências humanas

- Confirmar fontes/documentação das lacunas listadas em `SOURCE_REFERENCE_GAPS.json` antes de qualquer afirmação documental.
- Decidir eventuais liberações dos 53 itens em `HOLD.csv`; não há recomendação de liberação automática.
- Confirmar autoria, direitos, URLs sociais e páginas reais antes de ativar ImageObject, sitemap ou publicação.
- Fazer a implementação posterior das páginas e revisar visualmente a narrativa no navegador; esta execução não implementa páginas ou redesign.

## Rollback e próximos passos

Os novos caminhos são isolados e podem ser removidos/revertidos por caminho deliberado: `content/` integrado, `docs/media/`, `prepared-media/editorial/` e `docs/media/RENAMING_EXECUTION.csv`. Não houve commit, push, merge ou publicação. O próximo passo autorizado é construir o adaptador de manifests e a implementação editorial sobre os gates existentes, mantendo o acervo fora de publicação até revisão humana.
