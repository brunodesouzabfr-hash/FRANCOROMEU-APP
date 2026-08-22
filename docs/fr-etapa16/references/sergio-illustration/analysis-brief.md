# Briefing dirigido — Sergio Ayala / `#illustration`

## Papel desta referência

Esta é uma referência **comportamental e estrutural**, não uma referência de identidade visual. Analise somente a seção `#illustration` e traduza seus princípios para uma solução original da Franco Romeu.

## Observar e documentar

1. A sequência produzida pelo scroll dentro da seção: entrada, fixação/sticky, rotação ou mudança de face, encaixe da obra, painel informativo e avanço para o projeto seguinte.
2. Como o progresso do scroll se relaciona com o índice da obra, a navegação lateral, o estado ativo e os comandos anterior/próximo.
3. O cubo/volume como navegador de projetos: quantidade de estados observáveis, alternância de faces, transição entre volume e apresentação da obra, e comportamento ao selecionar um item.
4. A arquitetura do painel lateral: título, categoria, descrição, metadados, ações, hierarquia, alternância de lado, entrada/saída e relação com a mídia central.
5. Os elementos úteis do restante da interface desta seção: indicador de progresso, trilho/lista de projetos, instrução de exploração, expansão de mídia, controles e feedback de seleção.
6. Diferenças entre desktop e mobile. A proposta de scroll coreografado será exclusiva do desktop; o mobile deve manter fluxo simples, toque direto e fallback acessível.

## Excluir integralmente

- Não extrair, recomendar ou traduzir a paleta desta referência. O campo `colors` deve registrar que a paleta foi excluída por decisão do usuário, sem sugerir hexadecimais do site.
- Não absorver animações de letras embaralhadas, glifos aleatórios, duplicação de caracteres, aparência de criptografia/terminal, ruído pseudo-matemático ou textos fragmentados.
- Não copiar tipografia como assinatura, marca, textos, nomes de projetos, imagens, ilustrações, ícones, assets, sons, classes, código, shaders ou geometria exata do cubo.
- Não levar densidade visual, scanlines ou decoração ruidosa para valores financeiros, calculadora, IQE, busca ou outros fluxos funcionais.

## Tradução obrigatória para o FRANCOROMEU-APP

A aplicação já possui um cubo 3D na experiência **Projetos 3D**. Ele não deve ser substituído, redesenhado do zero ou perder qualquer propriedade existente. Antes de implementar, a aplicação real deverá ser auditada para preservar:

- modelo/geometria, materiais, texturas e iluminação;
- rotação atual, controles de ponteiro/toque e estados de câmera;
- IDs, funções, listeners, dados de projetos, seleção e integrações;
- carregamento, fallback, desempenho e comportamento mobile existentes.

A referência deve acrescentar somente uma camada adaptadora de navegação desktop, provisoriamente chamada `FRCubeProjectRail`.

## Modelo original de “duplo scroll” FR

Não criar duas barras de rolagem concorrentes. “Duplo scroll” significa duas fases sequenciais controladas pelo mesmo scroll do documento, repetidas para cada projeto:

1. **Face phase:** o trecho inicial acumula progresso, gira o cubo existente até a face associada ao projeto e faz um encaixe/snap previsível.
2. **Panel phase:** depois do encaixe, o trecho seguinte revela e progride o painel lateral daquele projeto, sem continuar girando o cubo.
3. **Release/next phase:** ao concluir o painel, a rolagem libera a transição para o projeto/face seguinte.

Não inventar percentuais, durações, curvas ou distâncias. Extraia o que for observável e deixe valores finais como pendentes de protótipo no hardware real da Franco Romeu.

O painel pode alternar entre esquerda e direita quando isso melhorar a leitura, mas deve manter ordem DOM estável. Teclado, botões anterior/próximo e navegação por trilho devem oferecer a mesma mudança de projeto sem depender exclusivamente do scroll.

## Mistura autorizada com a referência Van Lent

Há autorização para consultar **somente** estes relatórios já sintetizados da captura Van Lent, se existirem:

- `captures/vanlent.dev/latest/fr-translation-plan.md`
- `captures/vanlent.dev/latest/design-system-reference.md`

Use-os apenas para princípios de grid, alinhamento, filetes, ritmo modular e painel lateral. Não consulte nem copie HTML, CSS, JavaScript, imagens ou recursos brutos da Van Lent. Não herde a malha exata de 75/53 px, offsets, contagens, tipografia ou paleta.

O painel lateral final deve usar grid e tokens **originais FR**, derivados da estrutura real do FRANCOROMEU-APP e da paleta oficial Franco Romeu.

## Entregáveis adicionais dentro dos três relatórios padrão

Além do formato normal, inclua:

1. Uma máquina de estados observada/inferida para a seção de referência.
2. Uma máquina de estados proposta para `FRCubeProjectRail`, separando `face`, `snap`, `panel` e `release`.
3. Contratos que a camada adaptadora precisa ler do cubo atual sem modificá-los.
4. Estrutura semântica proposta para o painel lateral FR e o trilho de projetos.
5. Plano desktop, fallback mobile e `prefers-reduced-motion`.
6. Riscos de scroll trapping, conflito entre controles, desempenho WebGL, foco, histórico e regressão do cubo existente.
7. Plano incremental que comece por auditoria do cubo atual e protótipo isolado. Não altere o repositório da aplicação nesta análise.

