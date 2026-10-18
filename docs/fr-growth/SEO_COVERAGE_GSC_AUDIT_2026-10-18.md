# FR SEO — Auditoria de indexação, canonicals e reforço editorial — 18/10/2026

## Escopo e proveniência
- **Domínio de produção:** `https://www.francoromeufr.com.br`.
- **Repositório:** `brunodesouzabfr-hash/FRANCOROMEU-APP`.
- **Google Search Console:** propriedade `sc-domain:francoromeufr.com.br`, consulta direta à URL Inspection API em 18/10/2026.
- **Relatório ZIP do usuário:** `https___www.francoromeufr.com.br_-Coverage-2026-10-17.zip`, lido como CSV UTF-8, contém `Gráfico.csv`, `Problemas críticos.csv`, `Problemas não críticos.csv`, `Metadados.csv`.
- **Ponto de partida:** main `d9c728568943ca8a97e21aba77a3c34ad35480b1`, já incorporando a correção técnica de variantes em `vercel.json` e os testes `fr-seo-canonical-variants-20261017.test.cjs`. Não reproduzir o hotfix em PR concorrente.

## Cobertura do ZIP
O gráfico exportado contém um único registro, **11/10/2026**: `1` página não indexada, `0` indexada, `0` impressões. O motivo identificado é **"Página alternativa com tag canônica adequada"**, fonte `Site`, validação `Iniciado`, total `1`. O ZIP **não indica a URL específica**; não extrapolar para todo o site nem tratar uma versão alternativa adequadamente canonicalizada como falha da página preferida.

## Inspeção real: onze URLs canônicas — 18/10/2026
| URL / slug | Veredito da URL Inspection API | Observação |
| --- | --- | --- |
| `/` | PASS / Submitted and indexed | Rastreio mobile em 17/10 22:52:19Z; canonical Google www/ |
| `/sobre` | PASS / Submitted and indexed | Rastreio mobile em 15/10 |
| `/ambientes` | PASS / Submitted and indexed | Rastreio mobile em 15/10 |
| `/projetos-3d` | Crawled - currently not indexed | Rastreada em 15/10; Google não informa bloqueio técnico específico |
| `/portfolio` | Crawled - currently not indexed | Rastreada em 15/10; Google não informa bloqueio técnico específico |
| `/orcamento` | PASS / Submitted and indexed | Rastreio mobile em 15/10 |
| `/solucoes/` | URL is unknown to Google (inspeção 18/10) | Uma consulta anterior relatou `Discovered - currently not indexed`; não tratar diferença entre consultas como resultado de SEO |
| `/solucoes/marcenaria-sob-medida/` | PASS / Submitted and indexed | Rastreio em 17/10 |
| `/solucoes/drywall/` | URL is unknown to Google | Conteúdo indexável ao vivo, ainda sem rastreio documentado |
| `/solucoes/pisos/` | URL is unknown to Google | Conteúdo indexável ao vivo, ainda sem rastreio documentado |
| `/solucoes/revestimentos-e-acabamentos/` | PASS / Submitted and indexed | Rastreio em 17/10 |

**Consolidação:** 6 URLs indexadas, 2 rastreadas e não indexadas, 3 desconhecidas na última inspeção. As 11 páginas estão publicadas com HTTP 200/canonical autorreferente e robots indexável nos endereços preferidos verificados com leitura do HTML ao vivo.

## Sitemap e legado
O sitemap `/sitemap.xml` contém **11 URLs absolutas no host www**, sem erros/warnings informados no GSC. O contador agregado `11 enviadas / 0 indexadas` está em conflito com as inspeções individuais que confirmam seis indexadas: não usar o zero como diagnóstico de desindexação total. O agregado pode depender de momento, identificação ou processamento do Google; não afirmar causa sem documentação.

O host `francoromeu-app.vercel.app` ainda consta como indexado num histórico de rastreio em **08/10/2026**, antes da consolidação; a leitura atual redireciona para o www. O apex teve rastreio em 13/10 e histórico de canonical para Vercel; a configuração de produção e leitura atual já direcionam para o www.

## Erro confirmado e hotfix preexistente na main
Antes do hotfix, a variante `/sobre/` respondia HTTP 200 com **canonical da Home**, embora `/sobre` tivesse título e canonical corretos; as demais variantes SPA tinham risco semelhante. A configuração atual já contém 5 redirecionamentos permanentes de variantes SPA com barra final para as URLs sem barra, 5 redirecionamentos das variantes de Soluções sem barra para os endereços com barra, e redirecionamentos de host legado/apex para www. O arquivo `tests/fr-seo-canonical-variants-20261017.test.cjs` testa as regras. Não reintroduzir outro canônico ou um `noindex` para duplicatas, conforme documentação oficial do Google: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls.

## Alteração incremental deste PR — reforço da descoberta e diferenciação de conteúdo
- `src/fr-seo-indexing-phase910.cjs`: adiciona um bloco semântico de leitura e caminhos internos próprios às views `view-projetos` e `view-projetos3d`. A copy explica o método e os limites de referência/projeto sem alegar nova obra realizada, certificação ou orçamento garantido.
- `assets/css/fr-seo-indexing-phase910.css`: composição editorial FR, responsividade 390px, foco visível e redução de movimento; sem bibliotecas adicionais ou animações necessárias para rastrear.
- `scripts/build-site.cjs`: injeta os dois blocos **antes** de gerar os snapshots estáticos por rota. Preserva IDs, headings principais, dados estruturados, seis views SPA, estados, calculadora de 115 serviços, IQE, portfólio, mídias, navbar, interface e controles de navegação.
- `scripts/build-local-services.cjs`: adiciona links de retorno a `/portfolio` e `/projetos-3d` em **todas as cinco páginas Soluções**, reforçando caminhos a páginas com rastreio já confirmado.
- `tests/fr-seo-indexing-phase910.test.cjs`: valida injeção única, heading/canonical, enlaces mútuos, sitemap estável (11 URLs) e redirecionamentos de legado e variantes.

**Não houve alteração no cálculo financeiro, estado do cliente, registro de CRM, URLs de sitemap, conteúdo original de projeto ou estimativas.**

## Validação e limites
1. O Quality Gate GitHub deve concluir `success`, incluindo `npm test`, build e checks. Testar em preview as duas views e o hub, além dos redirect matchers de `vercel.json`.
2. Vercel produção deve apontar para o SHA de `main` após merge; inspeção do host canônico via ferramenta HTTP/HTML para `/portfolio`, `/projetos-3d`, `/solucoes/`, `/sobre`, `/orcamento`.
3. Verificação do cabeçalho HTTP de 301/308 de cada URL alternativa requer ferramenta que exponha a **primeira resposta sem seguir redirects**. Um crawler que segue redirecionamento e entrega HTTP 200 da página final **não** comprova, isoladamente, o status 308 original. Quando não houver leitura da cadeia, registrar limite e sustentar evidência nos matchers publicados e nos testes.
4. Google decide autonomamente se indexa as duas views rastreadas sem indexação; **conteúdo e links são medidas de qualidade/discovery, não promessa de indexação**.
5. No Search Console, `Testar URL publicada` e `Solicitar indexação` são ações manuais para URLs prioritárias. `inspect_url` apenas lê o estado: não solicita indexação. Reenviar sitemap pode solicitar novo download, mas não força inclusão.
6. Revisar resultados após recrawl Googlebot, distinguindo dados históricos de novas inspeções. Não citar melhora de ranking sem relatório posterior verificável.

## Rollback
Reverter apenas PR desta fase, preservando hotfix de redirect existente. Blocos semânticos e CSS são incrementais e não tocam `FRBudgetCore` ou persistência. Restaurar teste/build da revisão anterior e revalidar as onze rotas, sem editar informações do GSC ou apagar registros.
