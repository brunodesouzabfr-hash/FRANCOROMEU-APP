# Briefing dirigido — Ambientes / grade editorial e drawer de linguagem

## Papel das referências

Este briefing acompanha duas capturas independentes do mesmo domínio:

- `bloom3d.studio/`: observar somente a arquitetura editorial útil — grande respiro, tipografia de escala, alternância de blocos 2/3 colunas, imagens com proporções variadas, títulos/metadados discretos, hover e ritmo entre seções.
- `bloom3d.studio/projects/morven`: observar a sequência de detalhe — imagem de abertura, título, ficha curta, narrativa técnica/poética, galeria de grande escala e navegação para projetos relacionados.

A página Morven é referência de hierarquia e progressão, não fonte de texto, imagens, projeto arquitetônico ou materiais da Franco Romeu.

## Regra inviolável: preservar a entrada de Ambientes

Preserve integralmente a tela inicial atualmente existente na aba **Ambientes**, inclusive sua primeira dobra, animações, frase de entrada, navegação, dados, IDs, eventos, responsividade e as 12 linguagens/estilos já cadastrados.

A referência pode aprimorar ou reorganizar somente a apresentação abaixo da entrada preservada, sem excluir nenhum estilo e sem mudar contratos. Antes de qualquer mudança futura, exigir screenshots-baseline desktop/mobile e inventário dos componentes reais.

O clique em um estilo deve abrir uma camada aditiva, provisoriamente chamada `FRAmbientStyleDrawer`. Não substituir a aba por outra rota. Ao fechar, devolver exatamente o foco ao card acionador e restaurar scroll, filtros, seleção e estado anterior.

## Observar na página geral

1. Grid e alternância entre blocos largos, médios e assimétricos.
2. Espaçamento vertical, margens, gutters, alinhamentos e relação entre imagem, título e metadado.
3. Tipografia de títulos, subtítulos e rótulos, sem copiar a família como assinatura.
4. Comportamento do hover/foco: revelação de texto, escala, crop, velocidade aparente e contraste.
5. Entrada e saída das imagens durante o scroll, sticky/fixed quando comprovado e comportamento responsivo.
6. Accordion/listas expansíveis somente onde existirem evidências observáveis; não atribuir ao site o que não estiver na captura.

## Observar na página de detalhe

1. Ordem entre hero visual, título, ano/local/tipo, texto conceitual, texto técnico, imagens e próximos itens.
2. Largura de leitura, hierarquia de metadados, ritmo, respiro e mudanças de proporção da galeria.
3. Transições ao entrar, ampliar mídia, percorrer imagens, voltar ou avançar.
4. Comportamento desktop/mobile e manutenção de contexto.

## Excluir integralmente

- Não copiar logotipo Bloom, textos, nomes, imagens, renders, localização, projeto Morven, ícones, fontes proprietárias, assets, classes, código, layout exato ou identidade comercial.
- Não extrair nem adotar a paleta da referência quando a captura usar `--omit-colors`.
- Não substituir as imagens atuais da Franco Romeu por recursos capturados do site.
- Não transformar o drawer em uma nova SPA ou rota que destrua o estado de Ambientes.
- Não alterar calculadora, FRBudgetCore, IQE, busca, índices, IDs ou preços.

## Tradução obrigatória para a grade de 12 linguagens

Proponha uma grade editorial original FR que reutilize os 12 itens e seus dados atuais. A composição pode alternar blocos largos e estreitos e usar imagens próprias/licenciadas, mas deve manter:

- ordem semântica e leitura acessível;
- navegação por teclado;
- títulos e descrições FR;
- fallback sem hover;
- busca e deep-link existentes, se houver;
- layout mobile coerente, sem cortes de frase ou faixas sobrepostas.

O luxo silencioso vem de respiro, precisão, crop e hierarquia — não de copiar o branco, a fonte ou as proporções exatas da referência.

## Drawer imersivo original FR

Ao selecionar um estilo, `FRAmbientStyleDrawer` deve abrir em tela cheia sobre a aba existente, com transição que sugira continuidade vertical. Estrutura proposta para validação:

1. Cabeçalho com nome da linguagem, índice e botão fechar.
2. Carrossel/galeria de imagens próprias ou licenciadas da Franco Romeu.
3. Descrição conceitual e descrição técnica separadas.
4. Especificações: iluminação, materiais, texturas, manutenção e aplicações adequadas.
5. Paleta FR em círculos acessíveis com nome e valor textual; petróleo, ouro/mostarda e osso podem compor o exemplo, sem herdar cores Bloom.
6. Serviços compatíveis e justificativa de cada associação.
7. CTA: **“Injetar Pacote de Soluções do Estilo na Calculadora”**.
8. Próxima/anterior linguagem e retorno ao mesmo card.

Use `<dialog>` ou camada semanticamente equivalente somente após auditar a arquitetura real. Deve haver foco inicial, contenção de foco, `Escape`, botão fechar, bloqueio de fundo sem perder scroll e restauração de foco.

## Contrato seguro com a calculadora

O botão de pacote não pode escrever preços nem criar uma segunda calculadora. Ele deve usar exclusivamente serviços e contratos já existentes no `FRBudgetCore`.

O plano deve exigir:

1. auditoria dos IDs reais de serviços, unidades, quantidades, ambiente e eventos;
2. adaptador de dados entre `styleId` e uma lista de `serviceId` existentes;
3. validação de todos os IDs antes de qualquer inclusão;
4. tela de prévia com itens, quantidades editáveis e justificativas;
5. confirmação explícita do usuário;
6. prevenção de duplicatas ou política clara de mesclagem;
7. operação reversível/undo e mensagem de sucesso acessível;
8. uso das mesmas funções/eventos públicos que a interface atual já utiliza;
9. teste que prove que cálculos, descontos, IQE, busca, exportação e persistência não mudaram.

Se algum contrato não estiver disponível nas capturas de referência, marque-o como dependente da auditoria do FRANCOROMEU-APP; não invente nomes de função ou payloads.

## Máquina de estados proposta

Documente estados equivalentes a:

- `grid-entry-preserved`;
- `grid-browse`;
- `drawer-opening`;
- `drawer-ready`;
- `gallery-expanded`;
- `package-preview`;
- `package-confirming`;
- `package-applied` / `package-error`;
- `drawer-closing`;
- `focus-restored`.

Inclua cancelamento e retorno seguro em todos os estados que alterem a calculadora.

## Desempenho, acessibilidade e responsividade

- Lazy-load de imagens abaixo da dobra e `srcset`/dimensões explícitas.
- Evitar carrosséis duplicados e listeners globais por abertura.
- Mobile pode usar drawer vertical nativo; não exigir hover.
- `prefers-reduced-motion` remove zoom e transições longas.
- Textos permanecem selecionáveis, contraste testado e imagens têm alternativas adequadas.
- Abrir/fechar repetidamente não pode aumentar memória, duplicar eventos ou modificar o histórico indevidamente.

## Entregáveis adicionais nos três relatórios padrão

1. Mapa observado do grid geral e da progressão Morven, mantendo evidências separadas por URL.
2. Arquitetura proposta da grade FR com preservação explícita da primeira tela.
3. Estrutura semântica e máquina de estados de `FRAmbientStyleDrawer`.
4. Esquema de dados para as 12 linguagens, galeria, especificações, paleta e serviços.
5. Contrato conceitual com `FRBudgetCore`, marcando tudo que depende de auditoria real.
6. Plano de foco, scroll, histórico, teclado, mobile e reduced motion.
7. Plano incremental e reversível: baseline, protótipo isolado, drawer somente leitura, prévia de pacote, integração com calculadora, regressão e rollback.

Não altere o repositório do FRANCOROMEU-APP nesta análise.
