# Performance local — Home móvel

Medição em 13/10/2026 com `node scripts/measure-local-performance.mjs URL 3` em Chromium headless. Três contextos de cache frio por candidato, viewport 390×844, CPU 4×, latência 150 ms, download 200.000 bytes/s. Analytics externo bloqueado igualmente nas duas amostras. É um diagnóstico sintético em loopback, não p75 de visitantes nem INP de campo.

| Saída | LCP das três rodadas (ms) | Mediana | Elemento LCP | Recursos locais / bytes por rodada |
|---|---:|---:|---|---:|
| Candidata anterior preservada em `/tmp/fr-consolidacao-Gb1BvD/dist-fr-integracao-original-active/` | 4.436 / 4.524 / 4.424 | 4.436 ms | AVIF 640 do Hero | 77 / 3.715.796 |
| Candidata consolidada, antes do preload AVIF | 4.256 / 4.172 / 5.212 | 4.256 ms | mesmo AVIF 640 do Hero | 71 / 3.714.179 |
| Candidata consolidada com preload AVIF correspondente ao `picture` | 3.816 / 4.572 / 3.248 | 3.816 ms | mesmo AVIF 640 do Hero | 72 / 3.724.171 |

O LCP acima de 4 s já existia no build anterior no mesmo cenário; não é evidência de regressão causada pela integração. O preload AVIF reduziu a mediana local de 4.256 para 3.816 ms, mas a diferença entre rodadas é grande e o alvo de 2,5 s ainda não foi alcançado. O build consolidado removeu um preload JPEG concorrente e usa agora um AVIF responsivo correspondente ao primeiro `source` do Hero. Uma inspeção de requests em viewport móvel confirmou **um** pedido desse AVIF e nenhuma transferência JPEG concorrente. O HTML autocontido e scripts da Home continuam pesados; reduzir esse custo requer perfil detalhado e regressão das seis views/FRBudgetCore, não remoção indiscriminada de experiências.

CLS observado: cerca de 0,0028 nos dois builds; long tasks acumuladas nas rodadas antes da alteração: 6–9 s. O valor de `responseEnd` da navegação representa o perfil local estrangulado, não uma rede real. Não foi medido INP de visitantes, Safari físico nem Lighthouse remoto. O relatório final não deve declarar a meta de LCP cumprida.
