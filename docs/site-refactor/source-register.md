# Registro de fontes — auditoria e candidato local

Iniciado em 10/10/2026; retomado em 11/10/2026. Este registro distingue fontes recebidas, evidência observada e trabalho ainda não executado.

## Base e escopo

- Checkout: `/home/romeu/###PROGRAMAS###/FRANCO ROMEU/FRANCOROMEU-APP`.
- Base canônica: `main`, commit `4929546`, sincronizado com `origin/main` no preflight.
- Branch de trabalho: `codex/site-refactor-release-1`.
- Já existiam `.vercel/` e `FR_PLANO_MESTRE_SITE_CODEX_2026-10-10 (1).md` não rastreados. Foram preservados.
- Fonte operacional publicada: `index.html`, não somente o arquivo legado em `base-original/` coberto por parte dos testes.
- Instruções aplicáveis: `AGENTS.md`, plano do usuário, decisão da base canônica, README, package, núcleo e testes. Nenhum código da branch rejeitada foi recuperado.

## Anexos encontrados e inspecionados

| Fonte | Integridade | Tratamento |
|---|---|---|
| Downloads/ENTREGA_FRANCO_ROMEU_parte_01.zip | ZIP independente válido; 911 entradas; CRC sem erro | Inventário por entrada, sem extração ou publicação |
| Downloads/FR_COZINHA_LAVANDERIA_FORENSICS_v1.1.0.zip | ZIP válido; 136 entradas; CRC sem erro | Inventário por entrada, sem extração ou publicação |
| captures.zip | Não localizado na busca efetuada | As 442 entradas e quatro capturas mencionadas no handoff não foram confirmadas |

SHA-256, tamanhos e hashes individuais estão em `archives.json` e `archive-inventory.csv`. O inventário de diretório não equivale a revisão visual: os registros continuam com `visualReview=pending`.

Instruções relevantes efetivamente inspecionadas na entrega: `03_SEQUENCIAS/LEIA_ME.md`, `08_SITE/SITE_INTEGRATION_CONTEXT.json`, registros de aprovação/HOLD e relatório do clone M047. Elas distinguem 57 ilustrações aprovadas de 67 registros HOLD, não aprovam tripletas documentais e mantêm modelos 3D pendentes. Fotos originais não estão incluídas nessa entrega. A aprovação de ilustração não autoriza apresentá-la como obra executada.

Outros pacotes relacionados encontrados em Downloads não receberam auditoria completa e não foram incorporados. Não declarar toda a biblioteca de mídia revisada. O bloco de execuções reais e os novos cases dependem de confirmação documental e revisão visual dos ativos específicos.

## Fontes técnicas revalidadas

- [Vercel — configuração estática](https://vercel.com/docs/project-configuration/vercel-json): `cleanUrls` para arquivos HTML próprios; sem rewrite indiscriminado da Home.
- [Google — políticas Places](https://developers.google.com/maps/documentation/places/web-service/policies): atribuições, autoria, link da avaliação e limites de retenção. Consulta desativada por padrão; nenhum cache de avaliações persistido.
- [Google — imagens](https://developers.google.com/search/docs/appearance/google-images): imagens em HTML, contexto, URLs rastreáveis e sitemap.

Place ID resolvido pelo link de avaliação fornecido: `ChIJGYE8a2tCQKcRLapQAfIGtZk`. Não houve consulta paga nem validação de conta/chave Google nesta sessão.

## Continuação com fontes disponibilizadas em 11/10/2026

- Relatório da raiz `FR_COMPARATIVO_LEROY_MERLIN_2026-10-08.md`: extração integral de 115 serviços, 167 grupos, 403 opções, 94 códigos oficiais, 17 famílias e 10 prioridades. Todos os valores/unidades/opções FR conferem com o catálogo atual; não houve alteração financeira. Uma consulta à página oficial de chuveiro não apresentou preço recuperável: os dados continuam observações históricas, não cotação revalidada.
- `IMAGENS/`: 120 PNGs originais preservados; manifesto, instruções e fichas técnicas. Hashes no registro; **não enviados ao build público nem ao PR**. Preservação local verificável por `npm run check:source-media`; esse gate exige as fontes locais e não é apresentado como check executado pelo CI remoto.
- Entrega extraída pelo usuário em `Downloads/ENTREGA_FRANCO_ROMEU/08_SITE`: `MAPA_SITE.md` lido; 57 registros `READY_WITH_LABEL` e 162 WebP conferidos por ficha, SHA-256 e dimensão real. Índices visuais dos 57 e inspeção do detalhe R119P realizados. O painel direito permanece no teto de 472 px, sem ampliação/crop adicional. Zero HOLD publicado.
- As 219 fichas correspondentes aos masters/variantes liberados foram copiadas, sem edição, para `media-context/`, fora do build público. Isso permite testar o vínculo da variante com sua classificação no CI sem enviar os 248 MB de originais.
- `media-catalog.js` preserva os dados fornecidos; `fr-media-case.js` recebeu adaptação de montagem, teclado/modal, remount, labels e subseções. Originais, logo e registros comerciais não foram alterados.
- A página própria é **um estudo ilustrativo**, não prova de execução. Render em raster não virou GLB, CAD ou antes/depois documental.
