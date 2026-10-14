# Continuação — cobertura do pedido e candidato revisável

11/10/2026 · base `main` / `49295469979958569d2f6f5a32c397853f2fb7a9` · branch `codex/site-refactor-release-1`.

**Não foram executados todos os módulos do plano mestre.** Correções locais, integração dos anexos e primeiro case estático estão implementados. Domínio, dados comerciais/Google e conteúdos documentais continuam com gates próprios. Sem merge ou publicação de produção.

## O que foi implementado

- Intro não bloqueante, logo proporcional, contadores corretos, CTA sem duplicação, header global com Instagram/WhatsApp e drawer mobile acessível. Balões automáticos do IQE não cobrem a Home ou as ações mobile; assistente permanece sob demanda.
- Contato rápido no Orçamento e transferência explícita de seleção por JSON, com validação, backup e persistência. Não há leitura automática de localStorage de outra origem.
- Build público separado da fonte local: remove os editores administrativos, minifica explicitamente inline e módulos novos, preserva ordem de CSS e publica somente `dist`. God Mode local e núcleo financeiro preservados.
- Seis URLs com HTML/metadata próprios e 404 real; ainda compartilham a SPA. Novo `/projetos/cozinha-lavanderia` com conteúdo independente e nenhuma calculadora paralela.
- Galeria com **57 mídias / 162 WebP**, filtros, rótulos, modal, Escape/foco, recuperação do host Stage16 e apoios de Home, Sobre, Ambientes, estudos e Orçamento. **Zero HOLD**, nenhum original/PNG publicado. R119P limitado a 472 px. As imagens são ilustrativas, não prova de execução ou modelos GLB.
- Sitemap de imagens e página do estudo com contexto, alt, dimensões, lazy abaixo da dobra, canonical, OG e schema CreativeWork. Hero original com derivados AVIF/WebP. Isso prepara descoberta; não garante presença/ranking no Google.
- Comparativo completo na calculadora: **115 serviços, 167 grupos, 403 opções e 94 códigos Leroy**. Observações datadas de 08/10/2026, fontes e limites de equivalência. Zeros/divergências/preços indexados não viram benchmark numérico. Cenários FR usam o motor existente, não outro cálculo. A descrição do vinílico foi corrigida conforme prioridade 8: não promete impermeabilidade ou adequação geral a áreas molhadas.
- Controles `− / +`, teclado decimal, digitação, limites, foco/ARIA e motion curto com reduced motion. O input e seu evento originais continuam atualizando a quantidade, sem truncar medidas a seis casas. Entrada do editor usa opacidade, sem deslocar os controles transacionais; opções recebem texto legível sobre fundo escuro.
- Após o “sim” do proprietário: **17 famílias** disponíveis como pedidos de avaliação via WhatsApp. Não são serviços com preço aprovado, não entram no total e não foram cadastradas gratuitamente.
- PDF paginado por linhas completas, cabeçalho repetido e rodapé separado; imagens por página, sem captura gigante. Data pt-BR com fuso São Paulo e moeda brasileira preservando o `toFixed(2)` anterior. Mostra visita efetivamente cobrada ou isenta. Escopo com base zero fica “sob avaliação — não precificado”. Não muda valores.
- Loader 3D corrigido para o módulo ESM da mesma versão 0.161.0, preservando controles e fallback. Estudos fornecidos continuam raster.
- Bloco Google com links oficiais fornecidos, fallback e endpoint server-side opt-in. Sem nota inventada, scraping, chave no cliente ou AggregateRating autorreferente.

## Cobertura do plano mestre

| Pedido | Estado real | Limite / próxima condição |
|---|---|---|
| M0: fontes, Git, ZIPs e inventário | Parcial | Fontes recebidas inventariadas; 57 publicadas revisadas. `captures.zip` ausente; não declarar todos os arquivos de Downloads lidos |
| M1: baseline e proteção | Parcial com gates funcionais | Base, catálogo inteiro e contratos verificados; bateria completa de combinações IQE/manual e campo não concluída |
| M2: domínio/DNS/redirects/Search Console/e-mail | Gate de produção / integrações externas | GET autenticado da Vercel confirma apex → `www` 308 e antigo → `www` 307. Acesso de leitura disponível; alteração do tráfego público aguarda aprovação. Search Console/e-mail não configurados nesta tarefa |
| M3/P0: intro/logo/header/contadores/CTA/admin | Implementado no candidato | Não foi publicado no domínio |
| Design system e matriz de todos os componentes | Parcial | Foundation e novos módulos padronizados; CSS legado ainda não extraído integralmente |
| M4: modelo de conteúdo | Parcial | Catálogo de mídia e referência de preços validados; entidades editoriais globais ainda não unificadas |
| M5: arquitetura híbrida | Parcial / spike concreto | Seis URLs preservadas + case estático independente; sem Next.js, novos hubs ou migração completa |
| M6: Leroy e calculadora | Implementado como referência | Preços/115 IDs/403 opções intactos. Novos preços FR dependem de aprovação explícita |
| M7: projetos reais e modelos 3D | Parcial | Estudo publicado no candidato; nenhuma execução/modelo real inventado. GLB/CAD/cotas ausentes |
| M8: Ambientes/antes-depois/Portfólio | Parcial | Lavanderia e galeria ilustrativa integradas. Sem pareamento documental artificial; registros existentes mantidos |
| Arquivo Social NK/30 cards e atmosfera Spiral | Pendente | Posts, posters, direitos e capturas faltantes. Adapters antigos preservados; nenhum embed inicial novo |
| M9: materiais e caderno técnico | Parcial | Apoio visual de materialidade/estudos; páginas técnicas completas dependem de conteúdo específico |
| M10: Sobre com execuções reais | Bloqueado por fonte | Bloco de método ilustrativo não substitui comprovação de serviços executados |
| M10: Google atualizado | Layout/fallback implementados; live bloqueado | Chave, quotas, faturamento, identidade/permissões/termos precisam ser validados. Nenhuma consulta paga executada |
| M11: SEO visual | Parcial implementado | 57 mídias vinculadas ao case/sitemaps; todo o acervo e hubs ainda não concluídos |
| M12: desempenho/cache/motion | Parcial | Minificação e cache seletivo; novos modules lazy quando aplicável. Shell ainda pesado; não afirmar “ultra rápido” ou CWV de campo aprovados |
| M13/M15: QA | Funcional/visual executado; aceite global parcial | Nove perfis Chromium e PDFs renderizados; emulação não é Safari/iOS/aparelho físico. LCP de laboratório reprova a meta |
| M14: analytics/GTM/canais | Pendente | Tags existentes preservadas. Contêiner/consentimento/eventos completos não implantados; não duplicar tags |
| M16/rollout | Não autorizado para produção | PR de rascunho para revisão; sem merge, deploy de produção ou monitoramento recorrente |

## Evidências e limites

- `npm test`: **64 testes, zero falhas**. `npm run check:html`: aprovado; sintaxe dos módulos e `git diff --check` aprovados. Evidência resumida: `evidence/unit-gates-current.json` e `check-html-current.txt`.
- Chromium emulado: **nove resoluções × seis views**, sem overflow horizontal involuntário ou erro JS crítico nos fluxos testados. Menu, Escape/foco, voltar/deep links/404, persistência, transferência JSON e rejeição atômica, reduced motion e Google mock verificados. Relatório: `evidence/responsive-regression-current.json`.
- Anexos em **390×844 e 1440×900**: 57 mídias, filtros/modal/remount, 94 referências, 17 solicitações, quantidade/configuração e reload. Seis reconstruções do editor por perfil validam o primeiro clique sem deslocamento transacional. Cenários FR: três torneiras = R$ 549 e quatro = R$ 600; quantidade vazia é rejeitada. Loader Three revision 161, falha de CDN e perda simulada de contexto com controles preservados. Relatório: `evidence/annex-regression-current.json`.
- PDF pelo botão real: seleção e cálculo intactos; curto de dois itens (inclui escopo não precificado), **1 A4 / 175.664 bytes**; longo de 28 itens, **3 A4 / 587.659 bytes**. As quatro páginas foram renderizadas e inspecionadas: cabeçalhos, linhas completas, moeda/data pt-BR, visita isenta e rodapé sem sobreposição/corte. `evidence/pdf-download-qa-current.json`, `pdf-visual-current.json` e `release-pdf-*.png`.
- `npm run check:source-media`: **120 originais e 57 fichas preservados byte a byte**. Nenhum PNG original ou HOLD no build. SHA do HTML: `1491c2b5a7247103e009fcff2aede3ca950e83ab629bbadcc090fab4a50f3539`; fingerprint completo dos arquivos públicos: `0151633538195b2ab61ce2f5e114fad6240b300fac9d51dd29bbce4f5f06d8c0`.

Laboratório da revisão final (`evidence/performance-lab-current.json`), mediana de três execuções por versão: **LCP 2.740 → 3.328 ms**, **CLS 0,05774 → 0,00268**, soma de tarefas longas **8.630 → 6.766 ms**. Condições: Chromium 390×844, CPU 4×, cache desativado, sem throttle de rede, CDNs externos variáveis, analytics bloqueado. CLS observado durante a carga, não a sessão inteira. **LCP piorou e não passa ≤2,5 s**; este candidato não tem aceite de performance global nem promessa “ultra rápido”. Não há download inicial de Three.js ou iframe social nos fluxos testados, mas imagens legadas de views inativas ainda aparecem na captura de recursos e precisam de isolamento posterior. A medição não é Lighthouse, CrUX, INP ou p75 em campo.

Preservação: comparação integral de DEFAULT_DATA com o blob-base, permitindo **somente a correção textual explícita do vinílico**; 115 serviços, 15 categorias, 7 cupons e todos os valores/opções idênticos. O teste fixa a descrição corrigida e mantém igualdade de todos os demais campos. Sem diff em `src/budget-core.js`, `package-lock.json`, `assets/brand` ou `base-original`. Os 138 ativos anteriores continuam protegidos pelo teste de hash; a pasta nova possui gate separado para as 162 variantes. As fontes locais têm verificação própria, sem enviar seus 248 MB ao GitHub.

Medições em `audit-report.md` e arquivos de evidência sem sufixo `current` são checkpoints históricos, anteriores aos anexos ou às últimas correções. Não foram rebatizadas como aprovação desta revisão. O shell ainda mantém o DOM/JS de seis views.

PDFs de QA usam dados explicitamente fictícios. Os arquivos intermediários ficam em `/tmp`; screenshots de paginação e relatório podem ser usados como evidência de revisão, não como orçamento de cliente.

Limite do PDF: o documento continua rasterizado, sem texto selecionável ou tags de acessibilidade. A paginação foi corrigida, mas isso não equivale a um PDF acessível completo.

O CI passa a obter histórico completo para conferir o catálogo contra o commit-base fixado. Não depende dos PNGs privados de `IMAGENS`.

Vercel, leitura de 11/10 às 05:39 UTC: projeto/repositório corretos, branch de produção `main` e domínios verificados. A regra atual é contrária ao apex canônico pedido. Snapshot filtrado em `evidence/vercel-routing-readonly.json`; nenhuma configuração remota foi alterada.

## Riscos e rollback

- Não publicar antes de resolver host canônico/rotas e validar redirects. Um redirect inverso agora pode gerar loop.
- API Google desativada por padrão; não habilitar sem quotas/credencial/termos. Limite em memória não é proteção distribuída.
- Novas famílias são solicitações, não ofertas/estimativas aprovadas. Escopo de base zero continua fora do total calculado, claramente identificado.
- Reverter apenas módulos/hunks desta tarefa, com trabalho posterior preservado. Original/core não precisam ser restaurados; nunca reset/clean amplo.
- Case independente: retirar gerador, link e entradas de sitemap juntos. Galeria: retirar imports, seções e derivados pelo inventário, sem apagar fontes.
- PDF: rollback localizado do renderer/template; reintroduziria a paginação preexistente defeituosa, portanto exige decisão explícita.
- Commit/push de branch e rascunho não autorizam merge ou deploy em `main`.
