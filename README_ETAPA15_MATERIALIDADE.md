# Franco Romeu — Etapa 15: Materialidade Imersiva

Esta revisão parte diretamente de `FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html`. A tentativa anterior da Etapa 15 não foi reutilizada.

## Entrega principal

- `FRANCO_ROMEU_ETAPA15_MATERIALIDADE_IMERSIVA.html`: SPA completa e executável em arquivo único.
- `tests/fr-stage15-materialidade-imersiva.test.cjs`: regressão estrutural e cenário integral em JSDOM.
- `docs/ANEXO_ETAPA15_REFERENCIAS_E_MUDANCAS.md`: inventário das alterações e referências.
- `docs/fr_etapa15_materialidade_brief.json`: contexto estruturado para futuras IAs e automações.
- `QA_ETAPA15_MATERIALIDADE.md`: evidências e roteiro de aceite visual.

## Três universos reconstruídos

### Projetos 3D — Matéria em órbita

Mantém os seis conceitos e a matriz tridimensional da Etapa 14 e acrescenta dez cadernos editoriais. O usuário alterna entre Render, Wireframe e Luz cênica, rotaciona o volume, abre quatro ângulos, percorre Antes → Projeto 3D → Materialidade e vincula soluções reais ao orçamento.

### Portfólio — Arquivo Vivo

Substitui a apresentação estática por uma galeria horizontal de tela cheia com arrasto, toque, inércia, filtros e fundo espiral em Canvas. As 16 obras canônicas continuam ligadas ao modal protegido, à galeria e ao CTA existente de orçamento.

### Ambientes — Atlas de atmosferas

Mantém as 12 linguagens arquitetônicas e acrescenta um atlas editorial de alto contraste. Cada linguagem abre um dossiê em tela cheia com três referências, texto técnico-poético, paleta, soluções compatíveis e injeção em lote na Calculadora.

## Núcleo financeiro preservado

Os scripts abaixo permanecem byte a byte iguais à Etapa 14:

| Motor | SHA-256 |
|---|---|
| Portfólio protegido | `98dc336bb8174ab5a2d18617776c9abd8f8071fb19789d325ee8f7fb275ff844` |
| Carregador de PDF | `b9f17ab1b6b52afc3cf215ca1ee54e6a59afa35beae5a6344bd92c2c20934015` |
| `FRBudgetCore` | `3b5696aeb51ebbda876a428e657c9e60cd6c08d45bc2f152b1ed98b905517bbc` |

O novo código conversa com o orçamento apenas por `window.__frCore`, usando IDs já existentes no catálogo. Nenhum preço-base ou fórmula foi alterado.

## Executar

Abra o HTML em um navegador moderno. Para desenvolvimento local, sirva o diretório por HTTP para permitir carregamento uniforme de recursos externos.

```bash
npm install
npm test
```

Resultado desta entrega: `12/12` testes aprovados, somando regressão da Etapa 14 e aceitação da Etapa 15.

## Compatibilidade e resiliência

- alvos interativos com mínimo de 44 px;
- teclado, foco visível, `Escape`, setas e armadilha de foco em diálogos;
- `prefers-reduced-motion` sem remover conteúdo;
- animações pausadas em views inativas e quando a página fica oculta;
- DPR do Canvas limitado;
- imagens externas identificadas como referências, nunca como obra executada pela FR;
- estrutura standalone compatível com evolução futura para PWA e WebView Android.

## Gate restante

O ambiente automatizado não forneceu um Chromium executável para capturas. O aceite visual em navegadores reais — incluindo 390 px, touch, GPU/WebGL e redes lentas — deve seguir o roteiro em `QA_ETAPA15_MATERIALIDADE.md` antes da promoção para produção.
