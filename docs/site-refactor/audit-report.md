# Auditoria e candidato inicial — Franco Romeu

**Registro histórico anterior à integração dos anexos.** A continuação e a cobertura atual estão em [delivery-report-2026-10-11.md](delivery-report-2026-10-11.md). Os hashes, resultados e bloqueadores abaixo pertencem àquela etapa; PDF e loader 3D receberam correções posteriores.

Atualizado em 11/10/2026. **Entrega local parcial; não é a reestruturação completa nem autorização para produção.**

Branch `codex/site-refactor-release-1`, base `4929546`. Nenhum commit, push, PR, merge ou deploy. `.vercel/` e o plano não rastreado anterior foram preservados.

Build atual: `f37716e9c8bb803ecbfe647dd0953a3b3c31c599bbb13e43d9940523cd8a520b`. A regressão final completa usa esse hash e cobre nove perfis/seis fluxos, incluindo ausência da saudação automática na Home e abertura do assistente sob demanda.

## Implementado

- Corrigido texto malformado aparecendo antes do header. Intro breve, decorativa e não bloqueante; sem espera artificial nem progresso fictício; logo oficial com proporção/contain.
- Header global com Instagram, WhatsApp e menu mobile nativo. Foco, Escape, safe area e alvos de toque; contatos em configuração única.
- Contato rápido no Orçamento, fora da região destruída pelo rerender; exportação/importação explícita para recuperar seleção entre navegadores/origens, com validação e backup antes de substituir.
- Contadores estáticos verdadeiros e CTA sem duplicação; ajustes de botões, foco e caixas, sem reescrita visual integral da base.
- Saudação automática do IQE suprimida na Home para não cobrir CTAs. Painel, busca e assistência continuam disponíveis sob demanda.
- Corrigida disputa dos roteadores: metadata e histórico acompanham a view realmente ativada, não uma função substituída tardiamente.
- Pipeline público explícito: minificação com ferramentas já instaladas, remoção real dos editores administrativos, publicação somente de `dist`. Fonte e God Mode local permanecem preservados.
- Cascata CSS completa entregue no head, preservando ordem/IDs: evita exibir header e hero com regras incompletas enquanto scripts bloqueiam o parser.
- HTML pré-renderizado, título, canonical e heading próprios nas seis URLs existentes; ausência de fallback indiscriminado da Home; 404 local real.
- Hero com variantes AVIF/WebP por largura e hash, dimensões estáveis e JPEG de fallback; dimensões das mídias dinâmicas; sitemap de imagens gerado. Carregamento antecipado de imagens do Portfólio removido.
- Bloco Google ao final de Sobre com os links fornecidos e fallback sem nota inventada. Endpoint server-side opt-in, sem chave no cliente ou avaliações persistidas; sucesso/vazio/erro/timeout e atribuições testados com fixtures.

## Preservado

Nenhum diff em `src/budget-core.js`, `package-lock.json`, `assets/brand`, `assets/media` ou arquivos históricos `base-original`. Catálogo comparado entre fonte e build: 115 serviços, 15 categorias, 7 cupons, mesmos IDs/preços/configurações. Ponte financeira, IQE, busca, fidelidade, PDF e views não substituídos por uma aplicação paralela.

Os 138 arquivos de mídia existentes foram inventariados por hash/dimensão; há 10 grupos de duplicados exatos. Eles não foram apagados: remoção/mapeamento de URLs exige revisão editorial. Os dois ZIPs tiveram CRC e hashes verificados; nenhum ativo deles foi publicado. `captures.zip` não foi localizado nas buscas realizadas.

Export/import depende de arquivo salvo pelo usuário: não recupera automaticamente localStorage de outro domínio. Se o host antigo já redireciona antes do HTML, habilitar acesso de exportação controlado lá é uma dependência operacional separada; não foi executado.

## Testes efetivamente executados

| Gate | Resultado |
|---|---|
| `npm test` | PASS — 58 testes, incluindo os 38 anteriores, núcleo puro, API e build público |
| `npm run check:html` | PASS — IDs, seis views, bridges, metadata e rastreamento |
| `git diff --check` | PASS |
| `node --check` nos scripts JS novos | PASS nos arquivos verificados |
| Chromium emulado, nove perfis, seis views | PASS — sem overflow horizontal e sem exceções JS |
| Menu / Escape / foco / link / voltar | PASS |
| CTA Home / editor real / quantidade / total / reload | PASS |
| Exportação e importação / navegador isolado / arquivo inválido | PASS — recusa atômica e preservação do total |
| Seis URLs diretas / canonical / 404 / tentativa `fr-admin=local` pública | PASS local |
| Google sucesso/vazio/indisponível e atribuição de terceiro | PASS com respostas fictícias; API real não habilitada |
| Reduced motion | PASS — conteúdo imediatamente utilizável |
| PDF curto e longo pelo botão real | Geração PASS; **QA visual do longo FAIL** |

O teste de PDF foi realizado antes dos dois ajustes finais de entrega de CSS/saudação IQE. As funções de geração continuam idênticas ao baseline; isso não converte o FAIL visual em PASS nem substitui repetir o QA após corrigir a paginação. A auditoria de tamanhos/imagens em dois perfis precede apenas a condição de saudação; seu hash consta do JSON. Screenshots finais Home/menu/orçamento e a regressão funcional usam o build atual.

Uma execução da suíte em paralelo a navegadores excedeu o timeout de 30 s de um teste histórico. As execuções isoladas posteriores passaram; não aumentamos timeout nem relaxamos assertions. Algumas rodadas de navegador foram interrompidas por perda do servidor local; foram repetidas. O relatório final aponta o hash do build e não reutiliza checkpoints de outro hash.

Evidência: `evidence/responsive-regression.json`, `public-build.json`, screenshots antes/depois e `pdf-engine-parity.json`. Os perfis são emulação Chromium, não Safari/iOS nem teste em aparelho físico.

## Ganho de peso observado

| Item | Antes | Candidato | Limite da medida |
|---|---:|---:|---|
| HTML inicial | 1.393.656 B | 1.164.042 B | 16,5% menor; ainda conserva scripts e DOM da SPA |
| Gzip estimado do HTML | 319.105 B | 268.234 B | Compressão offline, não resposta real Vercel |
| Hero mobile, transferência local | 77.550 B | 9.992 B | Chromium 390×844, headers incluídos; variantes diferentes |

Não declarar “ultra rápido”, CWV em campo aprovado, INP ≤200 ms ou score Lighthouse alcançado. O shell ainda é pesado; o orçamento sugerido de 150 KB não está demonstrado. Code splitting completo, pipeline de todo o acervo e medições de campo permanecem pendentes.

## Performance instrumentada local

Três execuções de cada versão, Chromium 390×844, CPU 4×, cache de navegador desativado, analytics bloqueado e CDNs externos sem controle de rede. Janela observada: carregamento + oito segundos após DOMContentLoaded. Resultados não são Lighthouse/CrUX, não medem INP nem representam p75 de usuários reais.

| Mediana | Baseline | Candidato final |
|---|---:|---:|
| LCP | 2.224 ms | 2.088 ms |
| CLS, maior janela de sessão observada | 0,05774 | 0,00268 |
| Soma de tarefas longas observadas | 7.276 ms | 5.796 ms |
| DOMContentLoaded | 6.881 ms | 4.736 ms |

Sem download inicial de Three.js ou iframe social nessas seis execuções. Os scripts da SPA ainda geram trabalho substancial: não confundir soma de tarefas longas com TBT ou INP. Medianas de LCP/CLS atenderam as metas somente neste ensaio; repetir em condições controladas e medir campo depois da publicação autorizada.

A primeira comparação expôs regressão de CSS tardio: LCP mediano 4.832 ms e soma de deslocamentos 0,36475 no candidato. O rastreamento identificou header/breadcrumb/conteúdo mudando antes da cascata final. O build passou a mover todos os estilos estáticos ao head, sem reordenar a cascata nem alterar o núcleo. O ensaio reprovado permanece em `evidence/performance-before-css-fix.json`: seu campo `cls` era soma simples, **não** CLS por janela de sessão. O relatório final calcula CLS a partir das entradas capturadas, conforme [definição oficial](https://web.dev/articles/cls).

Evidência da comparação: `evidence/performance-lab.json`, hash `9f2d2e405997f416c121365e3de458956209e63b1c4d99fc7b6975d03798d131`. Depois dela, o candidato recebeu somente a condição adicional para não abrir a saudação IQE na Home desktop; no mobile medido, ela já não abria. Não apresentar a comparação como nova execução contra esse último hash. Variação externa de CDNs/CPU impede atribuir toda a diferença a uma única otimização.

## Bloqueadores e trabalho restante

1. **Domínio/produção:** rechecagem em 11/10/2026 03:49–03:50 UTC: apex `/portfolio` 308 para `www`, contrariando o destino desejado; `/portfolio` em `www` 404; host antigo `/portfolio` 307 para `www`. Corrigir painel e testar antes de publicar metadata/canonical novos. Não inserir redirect inverso que crie loop.
2. **PDF longo:** linhas são cortadas entre páginas e rodapé sobrepõe os totais; PDFs rasterizados têm 14 MB/34 MB. As funções `criarConteudoPDF` e `generatePDF` têm hashes idênticos ao commit-base. Defeito preexistente, não escondido por sucesso do download; renderer não foi reescrito nesta etapa.
3. **Mídia real:** registros HOLD/ilustrações não autorizam prova de obra. Bloco de execuções, antes/depois, cases e modelos reais aguardam fotos/documentação/seleção aprovada. Sem cards fictícios para preencher espaços.
4. **Google atualizado:** chave no ambiente de servidor, faturamento, quotas, restrições, termos/privacidade e identidade comercial precisam ser configurados/validados. Não houve consulta paga nesta sessão. Limite em memória não substitui proteção distribuída/quota externa.
5. **3D legado:** URL `three.min.js` 0.161.0 do loader atual respondeu HTTP 404. Fallback foi preservado; corrigir loader e testar WebGL/context loss em módulo separado, sem inserir modelo genérico novo.
6. **Master plan:** modelo de conteúdo completo, spike de arquitetura, páginas de cases/hubs, Arquivo Social com posts reais, auditoria Leroy/preços, GTM/eventos e rollout não foram executados. Esta etapa não conclui M0–M16/M22.
7. **QA restante:** zoom real 200%, Safari/iOS e aparelhos físicos, contraste completo, rede lenta comparável, todos os modais/recomendações e auditoria prolongada de GPU/memória/performance.

## Revisão e rollback

Preview público local: `http://127.0.0.1:4181`, iniciado por `npm run preview`. Rodar `npm run build` antes se reiniciar em outra sessão. Não hospedar a fonte local como build público.

Revisar o diff e os novos caminhos deliberadamente. Não usar `git add .`, reset/clean ou restauração ampla. Para reverter, preservar alterações posteriores e retirar apenas os hunks/arquivos desta tarefa; originais de mídia e núcleo continuam disponíveis. Rollback de DNS/redirect exige snapshot específico e autorização do painel. Não há release pública a reverter nesta entrega.
