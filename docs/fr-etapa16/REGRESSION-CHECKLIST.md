# Checklist de regressão — Etapa 16

## 0. Evidência e rollback

- [ ] Branch atual é `codex/etapa-16-portfolio-ambientes` ou equivalente aprovado.
- [ ] Ponto de retorno da Etapa 15 existe.
- [ ] `git status --short` estava limpo antes do checkpoint.
- [ ] Screenshots baseline existem para 1440×900, 1024×768, 768×1024, 390×844 e 360×800.
- [ ] Hash do HTML base foi registrado.
- [ ] Flags `fr16` restauram a experiência anterior sem alteração de dados.
- [ ] Nenhum push, merge ou deploy automático foi feito.

## 1. Núcleo financeiro

- [ ] `window.FRBudgetCore` existe e expõe as mesmas chaves.
- [ ] `window.__frCore` existe e `frCoreReady` continua disparando.
- [ ] Quantidade de serviços/categorias é igual ao baseline.
- [ ] Adicionar/remover serviço produz o mesmo estado.
- [ ] Quantidade e configurações preservam tipo/valor.
- [ ] Totais, moeda, casas decimais e arredondamento são idênticos.
- [ ] Cupons/regras, se existentes, permanecem idênticos.
- [ ] Persistência sobrevive a recarregar e retornar de outra aba.
- [ ] Exportação/PDF/compartilhamento existentes continuam funcionando.
- [ ] Nenhum valor depende de animação, canvas, embed ou CDN.

## 2. Navegação global

- [ ] Home, Sobre, Ambientes, Projetos 3D, Portfólio e Orçamento abrem pelo nav.
- [ ] Indicador de localização e estado ativo estão corretos.
- [ ] Voltar/avançar do navegador mantém a rota quando suportado.
- [ ] Links/âncoras profundas existentes continuam válidos.
- [ ] Busca global encontra os mesmos destinos/serviços.
- [ ] IQE abre, navega, fecha e retorna foco.
- [ ] Assistente abre/fecha sem bloquear nav ou scroll após fechamento.
- [ ] God Mode/admin permanece isolado e funcional.

## 3. Cursor

- [ ] Em mouse/fine pointer, o cursor aparece na primeira movimentação.
- [ ] O cursor visual está acima de backdrop e painéis autorizados.
- [ ] Projeto modal, dossiê de Ambientes, inspector 3D, IQE, busca e assistente mantêm cursor.
- [ ] Botões/links mudam estado de cursor sem flicker.
- [ ] Inputs e áreas editáveis usam indicação adequada.
- [ ] Abrir/fechar múltiplos overlays não duplica cursor/listener.
- [ ] Ao perder foco da janela, o cursor não fica congelado no centro.
- [ ] Em touch/coarse pointer, o cursor customizado não existe.
- [ ] Se o controlador falhar, o cursor nativo permanece disponível.

## 4. Cubo 3D

- [ ] Mouse: pointerdown + drag gira sem salto inicial.
- [ ] Soltar fora da área encerra o drag.
- [ ] `pointercancel`/lost capture não deixa estado preso.
- [ ] Touch horizontal gira após limiar de intenção.
- [ ] Touch vertical rola a página.
- [ ] Teclado: quatro setas orientam; foco é visível.
- [ ] Reduced motion remove auto-rotação e mantém controle direto.
- [ ] Auto-rotação pausa durante interação e fora da aba/viewport.
- [ ] Trocar projeto atualiza as seis faces e o dossiê correto.
- [ ] Modos Render/Wireframe/Luz continuam funcionando.
- [ ] Abrir/fechar inspector restaura foco.
- [ ] Face → drawer, quando ativado, tem começo/fim e libera scroll.

## 5. Portfólio

- [ ] Hero/título/copy aparecem sem JavaScript visual.
- [ ] Dados vêm de `GM_PROJECTS` ou `FR_DEFAULT_PROJECTS`.
- [ ] IDs, categorias, filtros e ordem permanecem corretos.
- [ ] Clique/Enter abre `openProjectModal` com projeto correto.
- [ ] Arraste não dispara modal acidentalmente.
- [ ] Setas, Home e navegação por teclado funcionam.
- [ ] Seção sticky possui entrada/saída e não aprisiona scroll.
- [ ] Canvas não intercepta eventos e pode ser desligado.
- [ ] Canvas pausa fora de viewport, aba oculta, save-data e reduced motion.
- [ ] Sem WebGL/canvas, cards e conteúdo continuam completos.
- [ ] Nenhuma imagem de referência é rotulada como obra FR.
- [ ] Antes/depois só aparece para par verificado do mesmo case.

## 6. Arquivo social

- [ ] Todos os providers têm placeholder local legível.
- [ ] Nenhum script/iframe externo carrega no primeiro paint.
- [ ] Botão de placeholder não tenta carregar URL nula.
- [ ] URL/host inválido é recusado e produz fallback.
- [ ] Um embed com falha não quebra os demais cards.
- [ ] Scripts oficiais são carregados no máximo uma vez.
- [ ] Iframes têm `title`, proporção reservada e permissões mínimas.
- [ ] Foco não entra automaticamente no iframe.
- [ ] Mobile usa scroll nativo/snap sem bloquear vertical.
- [ ] Offline/bloqueador/CSP preserva link e copy.
- [ ] Não existem tokens, cookies ou credenciais no código.
- [ ] Não existem métricas sociais inventadas.

## 7. Ambientes

- [ ] Hero canônico está visível e corresponde ao baseline aprovado.
- [ ] `AMB_STYLES` continua sendo fonte única com 12 itens.
- [ ] Grid/lista funciona com mouse, teclado e toque.
- [ ] Hover apenas antecipa; foco/click confirma corretamente.
- [ ] Mobile não depende de hover.
- [ ] Dossiê exibe o estilo selecionado e referências rotuladas.
- [ ] Escape, close, backdrop e focus trap funcionam.
- [ ] Fechamento retorna ao item que abriu o dossiê.
- [ ] Scroll do body retorna à posição correta.
- [ ] Serviços exibidos existem em `__frCore.SERVICES`.
- [ ] CTA adiciona cada serviço uma vez e informa existentes/ausentes.
- [ ] Abrir orçamento preserva a seleção.
- [ ] Faixas de preço não verificadas permanecem ocultas.

## 8. Conteúdo e marca

- [ ] Paleta usa aliases/tokens FR; nenhuma referência importou sua paleta.
- [ ] Fontes continuam Stardos Stencil, Rokkitt, Share Tech Mono e uso raro de Rock Salt.
- [ ] Não há efeito criptografia/letras ilegíveis.
- [ ] Copy evita termos proibidos pela marca.
- [ ] Claims, prazos, garantias e valores possuem fonte/condição ou não são publicados.
- [ ] Cases, depoimentos, pessoas e locais possuem direitos/autorização.
- [ ] Conteúdo técnico diferencia orientação de requisito profissional/normativo.
- [ ] CTAs são claros e não usam urgência sintética.
- [ ] Auditoria de dark patterns foi concluída.

## 9. Acessibilidade

- [ ] Ordem de headings é coerente.
- [ ] Todos os controles têm nome acessível.
- [ ] Foco é visível em todas as superfícies.
- [ ] Tab não entra em clones `aria-hidden`.
- [ ] Dialogs usam `aria-modal`, `aria-hidden` e título associado corretamente.
- [ ] Estados/filtros usam `aria-pressed`, `aria-current` ou semântica adequada.
- [ ] Regiões dinâmicas anunciam mudanças úteis sem excesso.
- [ ] Canvas possui alternativa textual/DOM.
- [ ] Zoom 200% não corta ação ou total.
- [ ] Alvos de toque têm pelo menos a dimensão adotada pelo projeto (mínimo atual 44px).
- [ ] Contraste de texto, ícone, foco e controle foi medido.
- [ ] `prefers-reduced-motion` produz uma experiência completa e estável.

## 10. Responsividade

- [ ] 1440×900 sem conteúdo cortado.
- [ ] 1024×768 sem grid comprimido ou drawer fora da tela.
- [ ] 768×1024 em retrato e paisagem.
- [ ] 390×844 e 360×800 sem overflow horizontal global.
- [ ] Teclado virtual não esconde close/CTA/input.
- [ ] Safe areas são respeitadas.
- [ ] Landscape mobile mantém saída de modais e conteúdo rolável.
- [ ] Texto ampliado não sobrepõe metadados.
- [ ] Portfólio/Ambientes não herdam alturas fixas inadequadas.

## 11. Performance e estabilidade

- [ ] Nenhum erro novo no console.
- [ ] Não há mais de um RAF por universo ativo para a mesma função.
- [ ] RAFs param com `document.hidden`, seção inativa e pagehide.
- [ ] Listeners não duplicam após trocar de aba várias vezes.
- [ ] ResizeObserver/IntersectionObserver são desconectados quando necessário.
- [ ] CLS não aumenta por cards, embeds ou imagens sem dimensão.
- [ ] Imagens não críticas usam lazy/decoding adequados.
- [ ] Save-data/low-power/reduced-motion têm fallback.
- [ ] A primeira interação não espera script social.
- [ ] Memória não cresce continuamente após abrir/fechar modais.

## 12. Revisão Git

- [ ] `git diff --check` sem erros.
- [ ] Diff contém apenas arquivos do checkpoint.
- [ ] Nenhum asset de referência foi adicionado.
- [ ] Nenhum arquivo bruto do FR Lab foi versionado.
- [ ] Nenhuma credencial ou dado pessoal foi adicionado.
- [ ] `/review` ou revisão equivalente não tem achado alto/médio aberto.
- [ ] Mensagem de commit descreve uma única unidade reversível.
- [ ] Relatório registra testes executados, não apenas “testado”.

