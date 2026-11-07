# A linha que fica — entrega da prévia

Data: 7/11/2026. Base: `main` em `8d31ff2d1bb13f51a0ec4fccb62ae219442d520d`. Branch: `codex/fr-narrativa-linha-que-fica`. Publicação destinada exclusivamente ao ambiente Preview da Vercel. O domínio principal não é promovido por este trabalho.

## Cobertura e capítulos

A matriz completa Inventário × Cena está em [STORY_BIBLE.md](STORY_BIBLE.md). As seis views, 115 serviços, 15 categorias, 7 cupons, 12 linguagens de ambientes, seis conceitos 3D, laboratório e acervo original permanecem no código e nos acessos públicos. Os 60 pares, com 120 identificadores únicos de mídia, são percorridos em 12 conjuntos de cinco pares. Os IDs públicos originais são conferidos automaticamente. Isso verifica preservação de dados e acesso, não equivale a revisão visual individual de cada registro.

| Aba | Premissa, objeto, atos e resultado |
| --- | --- |
| Home | O espaço conta uma história; linha material; superfície → desenho → volume → evidência → método; convite ao próximo capítulo. |
| Sobre | A decisão precede a forma; desenho de construção; manifesto → jornada → vertentes → 115 serviços → FAQ; escolha informada. |
| Ambientes | O espaço encontra linguagem; fragmentos de uma composição; 12 linguagens, paletas, materiais e dossiês; composição para o próprio espaço. |
| Projetos 3D | Ver antes de executar; linha transforma-se em volume; proporção → circulação → luz → material → compatibilização → decisão; projeto compreensível. |
| Portfólio | A transformação é lida em pares; imagens que se encontram; entrada → 12 conjuntos → índice completo → dossiês; prova e passagem ao orçamento. |
| Orçamento | Intenção torna-se escopo; percurso de decisões; seis etapas originais, estimativa e revisão; contato voluntário. |

| Inventário | Destino / evidência |
| --- | --- |
| Textos e seções originais | Cenas principais e painéis “Explorar o capítulo completo”, preservando nós e IDs |
| Serviços, preços, unidades, configurações e cupons | Catálogo original; catálogo editorial de Sobre; testes comerciais |
| 12 ambientes e seus serviços | 12 cenas e acesso a `openAmbDetail` original |
| Seis conceitos e laboratório 3D | Seis cenas, botão para o estudo e laboratório original |
| 120 mídias dos 60 pares | Galeria com janela de dez imagens; teste percorre e compara todos os IDs |
| 16 projetos históricos, 20 grupos e dossiês | Painel de acervo completo e rotas originais |
| FAQ | Conteúdo original reutilizado em Sobre; permanece no Orçamento |
| IQE, busca, PDF, persistência, navegação e orçamento | Motores originais mantidos; testes existentes e verificações abaixo |
| Rotas de conteúdo, SEO e imagens | Geradores originais mantidos; build conserva canonical oficial e Preview com noindex |

## Testes executados

- `npm test`: 215 testes passaram, nenhum teste falhou. Inclui regressões de orçamento, navegação, IQE, 3D, mídia, rotas, SEO, CRM e build público.
- `npm run check:html`: aprovado; 253 IDs únicos na fonte, seis views e bridges comerciais/PDF preservadas.
- `node --test tests/fr-story.test.cjs`: dois testes passaram após a correção de heading SPA. Confere integridade do núcleo financeiro após minificação idêntica, contagens, todos os IDs públicos originais e percurso completo 1–12, reversão, hash e abertura direta no conjunto solicitado, janela de dez imagens, pré-carga de no máximo dez e destruição dos módulos por rota.
- Build com `VERCEL_ENV=preview`: concluído. Deploy Vercel observado em estado READY, com canonical oficial e noindex. A transformação não altera a fonte `index.html`. Acorn declarado diretamente na mesma versão já resolvida pelo lockfile.
- Compilação de CSS pelo Lightning CSS e `git diff --check`: aprovados após os ajustes responsivos.
- Chrome remoto, desktop: Home, Ambientes e Portfólio inspecionados visualmente; avanço do conjunto 1 para 2; modal com exatamente duas imagens e rótulos; adição do serviço ao orçamento e abertura da calculadora observadas.
- Chrome remoto, viewport via iframe de 390×844: todas as seis abas navegáveis. `scrollWidth === clientWidth`, sem overflow horizontal. Galeria com cinco pares visíveis após correção de `minmax(0,1fr)`.
- Viewports via iframe de 320, 768 e 1440 pixels: conferência de largura; área útil respectivamente 305, 753 e 1425 pixels devido à barra vertical do Chrome. Sem overflow horizontal nas cenas verificadas. Tablet 3D inspecionado visualmente.
- Detalhes do primeiro Ambiente abertos pelo novo botão. Botão do estudo 3D abre o painel original. Nenhum erro de aplicação observado nas navegações finais; o console do ambiente registrou mensagens da extensão do navegador, externas ao site.

## Testes não executados e limitações

- [PENDENTE] FPS em aparelho celular físico, Safari/iOS e trackpad físico. Os testes responsivos foram executados em Chromium por viewport, não em hardware móvel.
- [PENDENTE] Auditoria assistiva completa com leitor de tela e contraste de todas as superfícies do legado. O novo conteúdo usa foco visível, rótulos, controles de teclado e redução de movimento.
- [PENDENTE] Envio real por WhatsApp, geração e inspeção visual do PDF com um orçamento final e teste completo de atendimento. Não foram enviados dados ou mensagens a clientes.
- [PENDENTE] Aceite visual do proprietário e pontuação editorial por aba. Não se atribui nota de Awwwards nem se apresenta a prévia como certificada ou premiada.
- [PENDENTE] Revisão visual de todos os dossiês expandidos. O conteúdo extenso continua nos painéis de capítulo completo; alguns componentes desses painéis e ferramentas conservam a aparência da implementação anterior.
- God Mode segue preservado na fonte local e removido do build público pela proteção já existente. Não é exposto na prévia.

## Changelog

| Arquivo / módulo | Alteração |
| --- | --- |
| `src/fr-story.cjs` | Montagem das seis narrativas a partir do catálogo e acervo canônicos; matriz de mídia, cenas, índice, FAQ e acessos originais |
| `src/fr-story-adapters.cjs` | Adaptações opcionais do modal para par exato, rótulos e serviço; exclusão da nova superfície do bloqueio `inert` legado |
| `assets/js/fr-story.js` | Ciclo de vida das cenas, progressão, máquina de conjuntos, animações determinísticas, teclado, toque, roda, hash e título principal por rota |
| `assets/css/fr-story.css` | Sistema visual Quiet Evidence, linhas, composição, mobile, redução de movimento e resolução dos conflitos da cascata anterior |
| `scripts/build-site.cjs` | Integração dos adaptadores e apresentação na geração pública, preservando os geradores e a poda administrativa |
| `assets/intro/fr-intro-cinematic.js` | Abertura imediata da edição narrativa; laboratório original mantido |
| `assets/js/fr-project-media.js` | Montagem do acervo dentro do painel correto e referência correta ao pai DOM |
| `assets/patches/fr-additions-2026-10-14/fr-additions.js` | Inserção das composições no pai real do museu preservado |
| `package.json` / `package-lock.json` | Comando de prévia, teste narrativo e declaração direta de Acorn 8.18.0, já existente no lockfile |
| `tests/fr-story.test.cjs` | Integridade do conteúdo e percurso completo das 120 mídias |
| `tests/image-integration.test.cjs` | Atualização das expectativas de layout substituído; invariantes de mídia mantidos |
| `docs/fr-narrativa/` | Direção, cobertura, decisões, verificação e limitações |

A fonte `index.html`, o núcleo financeiro, fórmulas, IDs e catálogo não foram reescritos. Nenhuma imagem nova foi gerada. A tipografia, paleta e ritmo seguem Quiet Evidence do anexo. Serviços e FAQ ficam no capítulo Sobre. Conteúdo extenso também permanece acessível nos painéis de capítulo completo. A galeria usa Web Animations e IntersectionObserver, sem dependência nova de animação no navegador.

## Verificação das regras e gates

- R1 — cumprida: inventário G0 antecedeu o código; execução prosseguiu no modo autônomo autorizado.
- R2 — preservação estrutural verificada; matriz acima registra os destinos. A revisão visual completa de todos os componentes expandidos permanece pendente.
- R3 — cumprida na nova camada: dados extraídos da fonte; rótulos diferenciam reconstituição, representação e estudo 3D; nenhuma prova comercial nova inventada.
- R4 — cumprida pelos testes de integridade e regressão: motor comercial preservado.
- R5 — seis narrativas e objeto comum implementados. Componentes auxiliares de formulário mantêm estabilidade durante uso; componentes de acervo expandido conservam parte da apresentação anterior.
- R6 — implementada: navegação visível, resultado direto, botões, teclado e liberação da galeria nas bordas. Teste físico de toque/trackpad pendente.
- R7 — código integral entregue na branch, sem placeholders de implementação.
- R8 — cumprida: testes executados e limitações separados neste documento.
- R9 — cumprida: pedido atual e anexo de direção orientam a apresentação; invariantes comerciais da main preservados.
- R10 — G0/G1 documentados, implementação e regressão aprovadas para prévia. G8 de aceite integral permanece condicionado aos itens pendentes acima; esta entrega não promove produção nem declara aprovação final.

Rollback: reverter o commit desta branch elimina a camada narrativa. Não há migração de dados ou alteração de estado persistido que precise ser desfeita.
