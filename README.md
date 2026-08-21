# ꟻR — Franco Romeu Alpha 2.0

Aplicação corporativa e acervo digital da Franco Romeu — **Arte + Engenharia**. A experiência reúne apresentação institucional, ambientes, estudos 3D, portfólio de referências e uma calculadora de estimativa orientativa.

## Fonte canônica e documentos de decisão

Este repositório, branch `main`, é a fonte de verdade do produto. A versão preparada na branch de revisão é a **Etapa 13.1.3**, que restaura o carregamento resiliente das bibliotecas de PDF sem alterar o motor financeiro.

- [Registro mestre da fonte canônica](docs/REGISTRO_MESTRE_FONTE_CANONICA.md)
- [Anexo comentado: mudanças reais e direção Awwwards](docs/ANEXO_EVOLUCAO_VISUAL_AWWWARDS.md)
- [Brief JSON para prompts e roadmap](docs/fr_awwwards_redesign_brief.json)

Os documentos distinguem explicitamente o que está implementado, proposto, dependente de conteúdo, não comprovado ou proibido. Referências Awwwards são repertório de princípios, não código/layout a copiar.

## Baixar somente o arquivo HTML

O aplicativo principal agora é autocontido: o núcleo financeiro foi incorporado no próprio documento. Para guardar ou enviar apenas a aplicação, baixe este arquivo:

```text
base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html
```

No GitHub, abra o arquivo, clique em **Raw** e use **Salvar página como…** (`Ctrl+S`). Dentro da própria aplicação, o God Mode também oferece o botão **“⬇️ Baixar HTML definitivo”**, que exporta uma cópia limpa com as personalizações salvas.

O HTML funciona diretamente com duplo clique. Recursos online — imagens externas, fontes, consulta de CEP e bibliotecas de PDF — continuam exigindo conexão com a internet, mas nenhum arquivo JavaScript local adicional é necessário.

## Execução local

Sirva a raiz do repositório por HTTP para que módulos e integrações funcionem corretamente:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000/base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html`. A abertura por `file://` possui suporte degradado: consulta de CEP, fontes, imagens e geração de PDF podem depender da rede.

## Natureza da estimativa

O valor mostrado é uma faixa orientativa baseada nas informações fornecidas pelo cliente, configurações selecionadas e premissas do ambiente. Não é preço fechado. Medidas, condições da base, acesso, materiais e interferências devem ser validados em visita técnica antes de uma proposta comercial.

## Imagens de referência

Imagens carregadas de bancos externos recebem a indicação **“Referência visual — não representa obra executada pela Franco Romeu”**. Elas devem ser substituídas gradualmente por acervo próprio e validado. Estudos 3D devem continuar identificados como renderizações.

## Testes automatizados

A suíte usa o test runner nativo do Node.js, equivalente ao Jest para esta fundação sem dependências externas:

```bash
npm test
npm run check:html
```

Os testes cobrem resolução de configuração por ID e índice legado, adicionais, markups, cupons, desconto de pagamento, arredondamento, dados inválidos e a fronteira de abatimento da visita técnica.

## Checklist manual

1. Abrir as seis views e confirmar que a navegação SPA permanece funcional.
2. Adicionar porcelanato manualmente e confirmar que todas as opções obrigatórias são exigidas.
3. Executar o IQE, adicionar recomendações e comparar o total com as mesmas escolhas manuais.
4. Recarregar a página e confirmar a recuperação do orçamento.
5. Testar CEP válido, inválido, timeout e preenchimento manual.
6. Tentar finalizar sem serviço, dados, endereço, pagamento e aceite dos termos.
7. Gerar estimativas curta e longa em PDF, confirmar o carregamento sob demanda de `html2canvas`/`jsPDF` e conferir a paginação.
8. Navegar por teclado em 390×844 e desktop, verificando foco, modais e ausência de overflow horizontal.
9. Simular indisponibilidade de CDNs e conferir a degradação de fontes, ícones e imagens.
10. Confirmar que toda imagem do Unsplash apresenta a ressalva de referência visual.

## Administração local

O God Mode não possui senha no cliente. Em ambiente local controlado, abra a aplicação com `?fr-admin=local` e digite `ADMIN` no campo de cupom para acessar a ferramenta. Isso **não é autenticação** e não deve ser habilitado como painel administrativo público. Uma administração real exige backend, sessão e autorização no servidor.

## Limitações conhecidas e evolução

- A aplicação ainda é um HTML monolítico; a modularização progressiva está planejada após a estabilização técnica.
- Ativos visuais, Font Awesome, ViaCEP e a pilha de PDF ainda dependem de serviços externos.
- Preços e cupons calculados no navegador precisam ser revalidados antes de uso comercial vinculante.
- O CNPJ demonstrativo e métricas não validadas não devem ser publicados.
