# QA — ETAPA 15 / SITES INDIVIDUAIS

## Resultado automatizado

- Suíte acumulada: **34/34 aprovada**.
- Suíte específica: **8/8 aprovada**.
- Scripts inline: 27 válidos.
- Fechamentos `body` / `html`: únicos.
- IDs duplicados em runtime: zero.
- Serviços: 115.
- Categorias progressivas: 15.
- Ambientes: 12 × 4 referências.
- Projetos 3D: 6.
- Arquivo Vivo: 16 fontes / 32 cards apenas para loop visual.
- Distribuição compacta: sintaxe, inicialização, 115 serviços e três universos validados.

## Fluxos cobertos

1. Atlas inicial → ambiente dedicado → quatro imagens → retorno ao Atlas.
2. Disciplina 3D → Entrar → Back/Next → atualização cinematográfica.
3. Arquivo Vivo → loop duplicado → filtros derivados dos dados existentes.
4. Calculadora → 15 categorias progressivas.
5. PDF → núcleo retorna pronto quando `html2canvas` e `jsPDF` estão disponíveis.
6. Motores `fr-stage2-portfolio-engine` e `fr-pdf-stack-loader` comparados byte a byte com a Etapa 14.

## Resiliência verificada por código/teste

- Three.js não existe como script bloqueante no HTML.
- Espiral inicia apenas em Portfólio.
- Timeout de 8 s no CDN e proteção contra inicialização concorrente.
- Fallback para economia de dados, movimento reduzido, WebGL ausente, falha de rede e perda de contexto.
- A trilha horizontal é DOM; continua funcionando sem a espiral.
- Projetos 3D não depende de WebGL.
- Nenhum cálculo financeiro foi duplicado ou modificado.

## Aceite manual obrigatório antes de produção

- Chrome, Firefox e Safari: 1440 px, 1024 px, 768 px e 390 px.
- Arrasto horizontal com mouse e touch.
- Movimento e textura da espiral com WebGL real.
- Fallback com `prefers-reduced-motion` e economia de dados.
- Seleção de pacote de Ambiente e projeto 3D em dispositivo real com armazenamento persistente.
- Geração, abertura e compartilhamento do PDF real.
- FPS e temperatura em Android intermediário e iPhone.

O protótipo permanece em draft até esse aceite visual/hardware.
