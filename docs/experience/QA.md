# QA — Animações e acervo FR

Data: 05/11/2026. Base canônica: `8d31ff2`. Destino da implementação: branch `codex/integracao-animacoes-acervo-20261105`, repositório `FRANCOROMEU-APP`.

## Verificações automáticas

| Verificação | Resultado |
| --- | --- |
| `npm test` | PASS — regressões existentes, inclusive núcleo financeiro, catálogo, IQE, navegação, mídia e SEO. |
| `npm run test:evidence` | PASS — 13 testes para partição do Portfólio, cobertura 3D, trios de materiais, dissoluções, propriedade manual, teclado, reduced motion, marcadores, estilos e liberação do novo painel de `inert`. |
| `npm run check:html` | PASS — seis views, ponte `__frCore`, núcleo financeiro e bridge PDF preservados. |
| `npm run check:project-library` | PASS — 337 rotas, 2.347 imagens verificadas nas páginas e 284 registros canônicos de mídia; sem erros de referência, dimensões ou rótulos. |
| `npm run check:idempotence` | PASS — 880 arquivos públicos idênticos em builds consecutivos; fontes rastreadas preservadas. |
| `git diff --cached --check` | PASS. |

Fingerprint público verificado: `6c28394637648671bd537b8b502a2374319b3ac77fc2e17c1e30874435d9cd9e`.

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
