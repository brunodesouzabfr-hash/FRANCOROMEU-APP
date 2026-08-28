# ꟻR — Franco Romeu Arte & Engenharia

Aplicação corporativa e acervo digital da Franco Romeu — **Arte + Engenharia**. A experiência reúne apresentação institucional, ambientes, estudos 3D, portfólio de referências e uma calculadora de estimativa orientativa.

## Baixar somente o arquivo HTML

O aplicativo principal agora é autocontido: o núcleo financeiro foi incorporado no próprio documento. Para guardar ou enviar apenas a aplicação, baixe este arquivo:

```text
index.html
```

No GitHub, abra o arquivo, clique em **Raw** e use **Salvar página como…** (`Ctrl+S`). Dentro da própria aplicação, o God Mode também oferece o botão **“⬇️ Baixar HTML definitivo”**, que exporta uma cópia limpa com as personalizações salvas.

O HTML funciona diretamente com duplo clique. Recursos online — imagens externas, fontes, consulta de CEP e bibliotecas de PDF — continuam exigindo conexão com a internet, mas nenhum arquivo JavaScript local adicional é necessário.

## Execução local

Sirva a raiz do repositório por HTTP para que módulos e integrações funcionem corretamente:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000/index.html`. A abertura por `file://` possui suporte degradado: consulta de CEP, fontes, imagens e geração de PDF podem depender da rede.

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
7. Gerar estimativas curta e longa em PDF e conferir a paginação.
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

## Branch principal e inventário versionado

A linha canônica de desenvolvimento é a branch `main`. Ela reúne o histórico das fundações técnicas anteriores e mantém versionados os seguintes grupos de artefatos:

- aplicação de produção: `index.html`;
- referência histórica preservada: `base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html`;
- rastreamento e deploy: `robots.txt`, `sitemap.xml` e `vercel.json`;
- documentação técnica e estratégica: `docs/`;
- núcleo financeiro e sua suíte: `src/`, `tests/` e `scripts/`.

## SEO local e rotas

O artefato de produção é `index.html`. As rotas `/sobre`, `/ambientes`, `/projetos3d`, `/portfolio` e `/orcamento` usam History API e o rewrite de `vercel.json`. Consulte `docs/ESTRATEGIA_SEO_AUTORIDADE.md` antes de publicar: dados provisórios de contato e operação precisam de validação do proprietário.
