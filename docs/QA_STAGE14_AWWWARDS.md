# QA — Franco Romeu Etapa 14 / Seis Universos

## Veredito

**Aprovado nos gates automatizados de estrutura, contrato e runtime simulado.**  
**Pendente de aceite visual em navegador real e WebGL real**, porque os dois binários Chromium disponíveis encerraram com `SIGSEGV` antes de abrir a página.

## Fonte testada

- Arquivo: `FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html`
- SHA-256: `328aa8aa4e6ea04e77048b978b07c1ccdca23c353f7f9d5d716509e150ca0a31`
- Tamanho: `1.038.544 bytes`
- Linhas: `15.259`
- Base: `FRANCO_ROMEU_ETAPA13_ORIGINAL (5)(2).html`, correspondente à Etapa 13.1.3 canônica.

## Resultado automatizado

Comando:

```bash
NODE_PATH=qa-tools/node_modules node --test tests/fr-stage14-universes.test.cjs
```

Resultado: **6/6 testes aprovados**.

| Gate | Resultado | Evidência |
|---|---|---|
| Motores protegidos | Aprovado | Portfólio e PDF iguais byte a byte à base |
| Banco técnico | Aprovado | 115 serviços |
| Catálogo progressivo | Aprovado | 15 categorias em runtime |
| Views | Aprovado | 6 views; uma ativa por vez |
| Scripts | Aprovado | 26 scripts inline executáveis sem erro de sintaxe |
| DOM | Aprovado | um fechamento `body`, um fechamento `html`, zero IDs duplicados |
| Stage 14 | Aprovado | seis marcadores, seis canvases e seis componentes exclusivos |
| Projetos 3D | Aprovado parcialmente | fallback acionado e navegável em JSDOM; WebGL real pendente |
| PDF | Aprovado por contrato | ponte existe e resolve quando `html2canvas`/`jsPDF` expõem suas APIs |
| Claims | Aprovado | `150+`, `98%`, “resposta em 2h” e falsa escassez ausentes |
| Runtime | Aprovado | zero erro capturado no cenário integral simulado |

## Integridade dos motores protegidos

| Motor | Base | Etapa 14 | Estado |
|---|---|---|---|
| `fr-stage2-portfolio-engine` | `98dc336b…ff844` | `98dc336b…ff844` | idêntico |
| `fr-pdf-stack-loader` | `b9f17ab1…34015` | `b9f17ab1…34015` | idêntico |

## Validação de dados e alegações

### Evidência segura

- 115 serviços: recontados no banco padrão e em runtime.
- 15 categorias: recontadas após renderização da etapa de serviços.
- 12 linguagens de ambientes: derivadas da curadoria existente.
- 6 conceitos 3D: derivados do conjunto `P3D_PROJECTS`.
- 6 views: derivadas da estrutura HTML.

### Alegações removidas por ausência de fonte

- “150+ projetos entregues”.
- “98% de satisfação”.
- “10+ anos de excelência”.
- “Resposta em 2h”.
- “Portfólio exclusivo” e linguagem que apresentava Unsplash como obra executada.
- Qualquer escassez de datas ou vagas não conectada a uma fonte operacional.

### Regra de comunicação

Imagens de banco permanecem como referências e recebem o aviso: **“Referência visual — não representa obra executada pela Franco Romeu.”**

## PDF

O erro “Núcleo de PDF ainda não inicializado” é mitigado pela infraestrutura já presente na Etapa 13.1.3:

- carregamento sob demanda;
- deduplicação de promessas;
- verificação das APIs;
- timeout;
- remoção do script quebrado;
- nova tentativa possível.

A Etapa 14 preserva esse motor e adiciona pré-aquecimento não bloqueante ao aproximar o ponteiro de uma ação de PDF.

### Aceite manual obrigatório do PDF

1. Abrir a aplicação com rede normal.
2. Preencher um orçamento mínimo válido.
3. Gerar o PDF na primeira tentativa.
4. Confirmar download e abertura do A4.
5. Bloquear `cdnjs.cloudflare.com` e confirmar mensagem recuperável.
6. Liberar a rede e repetir sem recarregar a página.
7. Repetir em Android Chrome e iOS Safari.

## Aceite visual pendente

Executar a matriz abaixo em ambiente com navegador funcional:

| Perfil | Viewports | Navegadores |
|---|---|---|
| Mobile | 360×800, 390×844, 430×932 | Chrome Android, Safari iOS |
| Tablet | 768×1024, 1024×1366 | Safari, Chrome |
| Desktop | 1280×720, 1440×900, 1920×1080 | Chrome, Firefox, Safari/Edge |

Para cada perfil, validar:

- navbar em uma linha, sem sidebar ou overflow;
- marcador `•FR` legível e fora do dock contextual;
- Home: rota em 3 colunas/1 coluna e parallax sem corte;
- Sobre: capítulos sticky sem cobrir conteúdo;
- Ambientes: grid 12 colunas e mobile 2 colunas alternadas;
- Projetos 3D: um único contexto WebGL, seleção, drag, fallback e rolagem normal;
- Portfólio: full-bleed, visita guiada e ausência de modal;
- Orçamento: scroll preservado, categorias progressivas, resumo e dock;
- PDF: carregamento, erro de rede e nova tentativa;
- foco por teclado, contraste e movimento reduzido.

## Performance e resiliência

### Implementado

- Canvas só anima na view ativa.
- Pausa em `document.hidden`.
- DPR máximo de `1.5`.
- Ponteiro agrupado por `requestAnimationFrame`.
- Three.js lazy e restrito a Projetos 3D.
- Fallback para mobile, economia de dados, reduced motion, WebGL ausente, CDN indisponível e perda de contexto.
- Geometrias, materiais e renderer descartados no encerramento.
- `content-visibility` aplicado apenas a módulos pesados selecionados.

### Riscos restantes

- HTML monolítico acima de 1 MB.
- Dependência de CDNs para fontes, ícones, imagens, Three.js e PDF.
- Banco técnico e interface no mesmo documento dificultam cache e revisão.
- Acervo de referência depende de URLs externas.

### Próximo gate de produção

- modularizar CSS/JS/dados;
- hospedar ativos próprios;
- adicionar CSP e monitoramento de erro;
- rodar Lighthouse/WebPageTest em 4G;
- medir LCP, INP e CLS por view;
- testar contexto WebGL real e consumo de memória após 20 trocas de view.

## Limitação do navegador deste ambiente

Foram tentados dois executáveis Chromium empacotados com Playwright. Ambos encerraram antes da criação da primeira página, com `SIGSEGV`. Por isso:

- não há screenshots aprovadas nesta entrega;
- não foi atribuído resultado visual fictício;
- o script `stage14-visual-qa.mjs` foi incluído para repetição em ambiente compatível.

## Critério de liberação

O HTML está apto para **prototipagem e revisão funcional**. Não deve ser promovido a site público nem empacotado como APK antes do aceite visual em navegadores reais, substituição do acervo por evidências verificadas e modularização de produção.
