# QA — Animações e acervo FR

Data: 06/11/2026. Base canônica: `8d31ff2`. Destino da implementação: branch `codex/integracao-animacoes-acervo-20261105`, repositório `FRANCOROMEU-APP`.

## Verificações automáticas

| Verificação | Resultado |
| --- | --- |
| `npm test` | PASS — regressões existentes, inclusive núcleo financeiro, catálogo, IQE, navegação, mídia e SEO. |
| `npm run test:evidence` | PASS — 15 testes para partição do Portfólio, cobertura 3D, trios de materiais, dissoluções, propriedade manual, teclado, reduced motion, marcadores, estilos e liberação do novo painel de `inert`. |
| `npm run check:html` | PASS — seis views, ponte `__frCore`, núcleo financeiro e bridge PDF preservados. |
| `npm run check:project-library` | PASS — 337 rotas, 2.353 imagens verificadas nas páginas e 284 registros canônicos de mídia; sem erros de referência, dimensões ou rótulos. |
| `npm run check:idempotence` | PASS — 880 arquivos públicos idênticos em builds consecutivos; fontes rastreadas preservadas. |
| `git diff --cached --check` | PASS. |

Fingerprint público verificado: `78513ae8de2ea6fb23a39f6200690a5a5c90adc126ed535e19bbb26b880daa1f`.

Os dois ajustes em testes antigos acompanham os requisitos novos: os 60 comparativos agora são validados como 30 + 30, sem perda ou duplicação; a antiga proibição de sliders dá lugar à exigência de range com label, limites e texto acessível. As restrições de origem, claims, mídia e finanças permanecem.

## Navegador

Verificação realizada na prévia HTTP com o build público, em desktop de 1363 × 936 e em frame de 390 × 844, com viewport de conteúdo de 375 px por causa da barra de rolagem do navegador.

- Abertura orgânica com imagens carregadas, sem overflow lateral; arraste e tecla Home alteram o comparador.
- Transição entre as abas mantém os comparadores acessíveis. Foi corrigida a herança de `aria-hidden` e `inert` do Portfólio antigo.
- Os quatro estados da integração foram selecionados pelo teclado no navegador: demolido, 3D cinza, render e resultado. Valores observados: 0, 333, 667 e 1000.
- Sequência de iluminação com os cinco arquivos carregados. Seleção manual de 22h permanece ativa, mostra a cena noturna e mantém os cinco botões acima da navegação flutuante.
- Ponto 01 abre a explicação do quartzo; Escape fecha o detalhe e restitui o foco. O primeiro Escape é reservado ao detalhe aberto.
- Trio da adega validado nos estados de material e ambiente, com valores 500 e 1000, três imagens carregadas e ausência de overflow lateral.
- Contraste do botão selecionado conferido no navegador: texto `rgb(230,214,181)` sobre `rgb(18,63,52)`. Corrigida a interferência das regras antigas do Jornal.
- Atlas de estilos inspecionado com 24 marcadores nos 12 cards, sem rolagem lateral. Descrições e IDs do catálogo original não são alterados.
- A revisão CSS acrescenta quebra de linha às legendas numeradas e limita os centros dos pontos a 24 px da borda; assim, os botões de 44 px não são recortados quando a foto encolhe. Essa proteção de borda é posterior à inspeção visual acima.
- Nenhum erro de JavaScript da aplicação nas páginas inspecionadas. O navegador registrou mensagens próprias da extensão, sem relação com o código do site.

## Limites e decisões de conteúdo

Os testes mobile verificam layout e controles no frame; não são uma medição em aparelho físico. A redução de movimento foi verificada nos testes de estado e na implementação CSS, sem simulação de preferência do sistema no navegador remoto.

A integração completa possui quatro imagens de estado. Recortes sem demolido ou render próprio exibem somente as etapas disponíveis, conforme a matriz. Não foram geradas novas etapas de obra nem apresentadas representações como fotografia documental.

As cinco imagens novas são estudos de iluminação, sem cálculo fotométrico. O teto fica apagado na cena noturna desta versão. Coordenadas de itens são usadas apenas nas imagens inspecionadas; demais números funcionam como legenda factual de materiais e serviços.

Orçamento, preços, fórmulas, `serviceId`, persistência e contatos não foram alterados. O fluxo de PDF permanece na implementação existente; não foi feita nova revisão visual do PDF, pois essa função está fora do diff.

## Publicação

Esta entrega prepara a branch e a prévia. A aplicação da versão na `main` e no domínio oficial depende da autorização de merge/publicação prevista no `AGENTS.md` do repositório.

## Compatibilidade da validação visual no GitHub

O workflow auxiliar do Block falhou na instalação do Chromium porque `ubuntu-latest` passou a usar Ubuntu 26.04, incompatível com o Playwright 1.56.1 já fixado no próprio workflow. O runner desse workflow foi fixado em `ubuntu-24.04`, preservando a versão do harness e todos os testes. Não houve alteração no personagem ou nos motores do site. A validação é executada novamente no PR.

Com a instalação corrigida, o harness revelou outra expectativa anterior à `main` atual: exigia `display:flex` e uma faixa mobile com rolagem horizontal, removida pelo commit canônico `77bc205`. A verificação foi alinhada à grade compacta aprovada: cinco rotas visíveis, sem overflow, com alvos de 44 px contidos na linha e centro desobstruído. Permanecem os checks de legenda, desktop, ocultação/acessibilidade da navegação durante a imersão, geometria do comparador, saída acessível e cabeçalho fixo no orçamento. O CSS e o JavaScript da navegação não foram alterados.

## Correção de barra e feed — 06/11/2026

A dissolução dos projetos foi substituída pelos recortes progressivos do código da referência. A regressão anterior de opacidade deu lugar a verificações dos recortes de três e quatro camadas, extremos, saltos rápidos, linha e seleção única de etapa. A navegação do feed ganhou teste de carrossel, teclado, slides inativos, persistência da comparação manual e destruição de listeners. Os demais contratos e a partição sem perda de 60 pares continuam verificados.

Navegador: desktop 1363 × 936 e frame 390 × 844 (375 px de conteúdo). A barra vertical foi observada com `display:block` e alça de 48 × 48 px. Na integração, valor 500 apresentou recortes de 0%, 0%, 50% e 100%; o arraste real até 739 manteve a escolha manual e revelou 21,7% da última camada. O foco do slider de projeto mantém a indicação na alça, sem apresentar uma segunda barra horizontal.

O feed foi observado com 10 posts, 30 comparativos e três pausas editoriais. Foram conferidos indicadores e navegação entre fotos por controles e teclado, bem como a ausência de overflow da página em desktop e no frame mobile. As 30 fotos iniciais continuam presentes nos carrosséis, sem duplicar os 30 pares seguintes. O teste mobile é de layout e teclado no navegador; não representa teste em aparelho físico ou gesto de toque físico. Os erros registrados no console inspecionado pertencem à extensão do navegador, sem erro da aplicação.

Evidências: `docs/experience/qa/3d-bar-20261106.png` e `docs/experience/qa/portfolio-feed-20261106.png`. A imagem da barra registra a conferência do mecanismo; a indicação de foco foi posteriormente ajustada para permanecer na alça.

## Portfólio em tela cheia — 06/11/2026

A versão atual substitui os cards limitados a 660 px por hero e cenas de viewport inteiro. Foi conferido no navegador: desktop de 1363 × 936, com largura útil de 1348 px; hero, cena, trilho e foto mediram 1348 × 936. Bordas e margens de card: 0 px, sem overflow da página.

No frame de 390 × 844, com 375 px de conteúdo, cena e foto mediram 375 × 844. No frame de 320 × 568, com 305 px de conteúdo, a cena preserva a altura mínima de 680 px e a rolagem vertical, sem overflow lateral. Esses frames não representam teste em aparelho físico.

Foram conferidos: navegação para o segundo comparativo, leitura de título/legenda, botões de 44 × 44 px, mudança de enquadramento cover ↔ contain e disclosure dos serviços por teclado. O painel de serviços no frame de 390 px mediu 346 × 147,6 px. A posição dos controles foi elevada: no canvas de 844 px, seu limite inferior relativo à cena é 676 px; o launcher fixo começava em 692 px. Essa folga é considerada com a cena alinhada à janela.

Os 15 testes específicos preservam as verificações de partição, recorte, teclado e estado manual e passam a conferir o modo imersivo e o controle de enquadramento. O código dos comparadores 3D e a sequência de luz não foram alterados nesta revisão. Os registros de erro inspecionados no navegador referem-se à extensão, sem erro da aplicação.

Evidências atuais: `docs/experience/qa/portfolio-fullscreen-desktop-20261106.png` e `docs/experience/qa/portfolio-fullscreen-mobile-20261106.png`.
