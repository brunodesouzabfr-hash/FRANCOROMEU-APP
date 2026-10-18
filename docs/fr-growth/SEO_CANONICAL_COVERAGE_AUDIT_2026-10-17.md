# FR SEO · correção de variantes de URL e diagnóstico GSC — 17/10/2026

## Evidência do usuário
Exportação `https___www.francoromeufr.com.br_-Coverage-2026-10-17.zip`, com gráficos apenas em **11/10/2026**: 1 não indexada, 0 indexadas. Motivo: **Página alternativa com tag canônica adequada**; validação iniciada. Os CSVs não contêm **qual URL** gerou esse motivo e o gráfico não é a cobertura atual do domínio.

## Leitura direta da URL Inspection API (17/10/2026)
Na propriedade `sc-domain:francoromeufr.com.br`:
- Home (`/`): `PASS`, `Submitted and indexed`, Google canonical igual ao `www`, Googlebot **MOBILE**, último rastreio **2026-10-17T22:52:19Z**.
- `/sobre`, `/ambientes`, `/orcamento`: `PASS`, indexadas, canonical correspondente a cada URL.
- `/solucoes/marcenaria-sob-medida/`, `/solucoes/revestimentos-e-acabamentos/`: `PASS`, indexadas, canonical correspondente.
- `/portfolio`, `/projetos-3d`: `Crawled - currently not indexed`, rastreadas em 15/10/2026; nenhuma causa de desindexação técnica confirmada pela ferramenta; não atribuir causa automaticamente.
- `/solucoes/`: `Discovered - currently not indexed`, ainda sem rastreio reportado.
- `/solucoes/drywall/` e `/solucoes/pisos/`: `URL is unknown to Google` na inspeção, embora as páginas existam publicamente e constem no sitemap.
- `https://francoromeufr.com.br/`: `Page with redirect`, último rastreio 13/10. Canonical histórico informado pelo Google aponta `https://francoromeu-app.vercel.app/`, mas a URL atualmente redireciona para `https://www.francoromeufr.com.br/`; o dado histórico **não** deve ser confundido com o estado atual da origem.
- Propriedade `https://francoromeu-app.vercel.app/`: índice antigo, último rastreio **08/10/2026**. Redirecionamento de produção para `www` continua implementado.
- Sitemap enviado em 17/10, processado, **11 enviadas e 0 indexadas no campo agregado**, com 0 warnings/erros. A consulta específica de URL prova que esse contador **não** equivale a zero páginas indexadas no site.
- Performance de 28 dias consolidados até 15/10: 2 cliques, 12 impressões, CTR 16,7%, posição média 8,83 — amostra pequena, não justificar ranking/ganhos.

## Erro técnico confirmado no HTML servido
Na URL preferida `https://www.francoromeufr.com.br/sobre`, `/portfolio`, `/projetos-3d`, `/ambientes` e `/orcamento`: HTTP 200, título próprio, `<link rel="canonical">` correto.

Mas em cada variante **com barra final**, como `/sobre/`, o servidor responde **HTTP 200 com canonical da home**, `https://www.francoromeufr.com.br/`, e com título genérico da Home. Esse status/metadata é inadequado para variantes de páginas próprias. Na família estática de soluções ocorre o inverso: `/solucoes` e `/solucoes/drywall` respondem HTTP 200 com canonical equivalente **com barra final**.

## Mudanças no repositório
Em `vercel.json`: regras explícitas de redirecionamento permanente das **5 SPA variantes com barra** para a URL limpa `/sobre`, `/ambientes`, `/projetos-3d`, `/portfolio`, `/orcamento`; e das **5 variantes de Soluções sem barra** para `/solucoes/` e os quatro serviços `/solucoes/<slug>/`.

As regras anteriores (domínio Vercel e apex → `www`, legacy editorial, headers e cache) foram mantidas.

`tests/fr-seo-canonical-variants-20261017.test.cjs` valida redirecionamentos sem colisão, canônicos gerados e URLs do sitemap. `package.json` adiciona o teste ao Quality Gate.

## Homologação após deploy
1. CI `FR Quality Gate`: `npm test`, `npm run build`, HTML, integridade de mídias e build determinístico.
2. Verificar `www` de cada URL canônica: HTTP 200, canonical autorreferenciado, indexação permitida.
3. Verificar cada variante alternativa: **HTTP 308/301** apontando para URL canônica, e não HTTP 200/canonical da home. Testar a antiga Vercel e apex até o `www`.
4. `robots.txt` permite rastreio e declara sitemap, e sitemap contém **apenas** 11 URLs canônicas.
5. **Não** requerer a indexação de URLs alternativas. Para URLs `Crawled - currently not indexed` ou `Discovered - currently not indexed`, usar `URL Inspection > Testar URL publicada`, revisar conteúdo útil e links internos, e `Solicitar indexação` manualmente para URLs críticas. A API de inspeção não envia pedido de indexação. A aceitação do sitemap não garante indexação nem ranking.
6. Verificar relatórios após o recrawl e após processamento do GSC, sem esperar retificação imediata de índices históricos.

Referência oficial Google: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

## O que NÃO é efeito desta correção
Este hotfix não altera as seis views da SPA, a calculadora financeira/FRBudgetCore, orçamento, intro, navegação, portfólio, projeto 3D, conteúdos locais, layout, mídia e nenhuma configuração de Analytics. Também não cria falsas páginas municipais, reviews, backlinks ou métricas.

## Rollback
Reverter o PR de hotfix, sem force push, somente se os testes revelarem regressão de roteamento e descartar alterações feitas em `vercel.json`. Não mexer em dados da aplicação nem credenciais.
