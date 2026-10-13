# ꟻR — Franco Romeu

Aplicação corporativa e acervo digital da **Franco Romeu — Arte + Engenharia**. A experiência reúne apresentação institucional, ambientes, projetos 3D, portfólio e uma calculadora de estimativa orientativa.

**Produção canônica:** https://www.francoromeufr.com.br/  
**Repositório canônico:** `brunodesouzabfr-hash/FRANCOROMEU-APP`, branch `main`.

## Estado atual

O artefato publicado é o `index.html` da raiz. Os arquivos em `base-original/` e os documentos das Etapas 13–16 permanecem como histórico, fonte de regressão e rastreabilidade; eles não substituem a `main` atual.

As rotas públicas da SPA são:

- `/`
- `/sobre`
- `/ambientes`
- `/projetos-3d`
- `/portfolio`
- `/orcamento`

O domínio `www.francoromeufr.com.br` é a origem canônica para metadados, JSON-LD, sitemap e compartilhamento. O domínio automático da Vercel não deve ser promovido como URL pública.

## Arquitetura e invariantes

A aplicação permanece majoritariamente autocontida em HTML/JavaScript, com núcleo financeiro testável em `src/budget-core.js`.

Antes de qualquer alteração, leia `AGENTS.md`. Entre os invariantes protegidos estão:

- `FRBudgetCore` e `window.__frCore`;
- 115 serviços, 15 categorias e 7 cupons padrão;
- as seis views públicas;
- persistência, IQE, busca, PDF e navegação SPA;
- preços, IDs, fórmulas e regras financeiras sem alteração não autorizada.

## Execução local

Na raiz:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000/`.

Para validar a base:

```bash
npm install
npm test
npm run check:html
```

O workflow `.github/workflows/quality.yml` executa as regressões na `main` e em pull requests.

## SEO, rastreamento e indexação

- `robots.txt` aponta para o sitemap canônico.
- `sitemap.xml` lista as seis rotas públicas.
- `vercel.json` mantém recarga direta das rotas da SPA e redireciona o host automático da Vercel para o domínio canônico.
- `.github/workflows/indexnow.yml` lê o sitemap já publicado e notifica o IndexNow após validar a chave pública.
- O HTML contém metadados sociais e dados estruturados; claims, avaliações e credenciais não comprovados continuam proibidos.

Mudanças de SEO devem manter código, testes e documentação na mesma origem canônica.

## Natureza da estimativa

O valor mostrado é uma faixa orientativa baseada nas informações fornecidas pelo cliente, configurações selecionadas e premissas do ambiente. Não é preço fechado. Medidas, condições da base, acesso, materiais e interferências devem ser validados em visita técnica antes de uma proposta comercial.

## Verdade visual e conteúdo

Imagem de referência nunca deve ser apresentada como obra executada. Render deve ser identificado como renderização. O acervo próprio e verificável tem prioridade sobre bancos externos e duplicações editoriais.

Não invente cliente, depoimento, avaliação, prêmio, certificação, prazo, garantia, licença, CNPJ, preço ou resultado.

## Administração e segurança

O God Mode existente é ferramenta local de desenvolvimento, não autenticação. Não publique tokens, senhas, dados de clientes, endereço residencial ou credenciais no cliente, workflow, log ou repositório.

Uma administração pública futura exige backend, sessão e autorização no servidor.

## Documentos principais

- `AGENTS.md` — regras de evolução e invariantes.
- `CHANGELOG.md` — histórico técnico.
- `docs/SEARCH_CONTROL_ENGINEERING.md` — engenharia de busca.
- `docs/REGISTRO_MESTRE_FONTE_CANONICA.md` — rastreabilidade da base.
- `docs/fr-etapa16/` — brief, conteúdo, CRO ético e regressões da Etapa 16.
- `docs/franco-romeu-visual-v2/` — biblioteca e QA visual.

## Publicação

Mudanças na `main` devem permanecer pequenas, reversíveis e cobertas por regressão. Antes de declarar publicação concluída, revise `docs/CHECKLIST_PUBLICACAO.md` e registre qualquer teste manual ainda não executado.
