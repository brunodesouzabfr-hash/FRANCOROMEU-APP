# FR / CHECKPOINT 3 — Ambientes 3 + 6 + 3
**Data:** 15/10/2026  
**Branch:** \`feature/fr-motion-phase1-2026-10-15\`  
**Status:** Código implementado na branch; sem merge nem deploy; validação completa pendente.

## Implementado
- O atlas visual foi substituído **na apresentação em runtime**, sem apagar ou alterar a estrutura HTML canônica, \`AMB_STYLES\`, \`#amb-grid-container\`, \`.amb-museum\`, \`.amb-hero\`, o ticker, as rotas e os handlers existentes.
- A substituição somente é ativada se as 12 mídias fornecidas por \`window.AMB_STYLES\` estiverem presentes e forem caminhos de \`/assets/\` pertencentes à própria origem.
- **01–03:** três cards de abertura na mesma viewport desktop. **Apenas as imagens** recebem reveal \`clip-path\`, sem animação de entrada no card inteiro.
- **04–09:** seis cards, com três simultaneamente visíveis no desktop, dentro de uma faixa de 200% guiada pelo scroll vertical; as fotos variam \`rotateY\` com perspectiva sem capturar \`wheel\` ou \`touchmove\`. Mobile usa scroll horizontal nativo e snap.
- **10–12:** três composições inclinadas em losango horizontal dentro de uma única viewport desktop; mobile oferece swipe acessível sem overflow de documento.
- O botão de cada composição chama \`window.openAmbDetail(index)\` e preserva a relação de índice com o atlas canônico. Os IDs dos serviços originais são mantidos no atributo \`data-fa-services\`. Textos de nome, essência, descrição e paleta são derivados do catálogo existente.
- O atlas legado só fica visualmente oculto após todos os 12 elementos serem criados. Na falha de fonte, erro de imagem ou handler de detalhes ausente, a implementação mantém/restaura o atlas antigo.
- A introdução extra de 3 imagens do \`fr-additions\` foi desabilitada somente quando o novo shell 3+6+3 está presente, evitando duplicação.
- Fallback \`prefers-reduced-motion\`, impressão e high contrast; sem dependências de produção novas.

## Arquivos alterados ou adicionados nesta fase
1. \`src/fr-ambientes-363.cjs\`: inserção da seção e assets no pipeline sem modificar index.html.
2. \`assets/js/fr-ambientes-363.js\`: runtime 3+6+3, scroll, reveal, popup, rollback.
3. \`assets/css/fr-ambientes-363.css\`: organização visual, profundidade, responsividade e media queries.
4. \`assets/patches/fr-additions-2026-10-14/fr-additions.js\`: guarda localizada contra duplicação de introdução.
5. \`scripts/build-site.cjs\`: chamada para o montador modular.
6. \`tests/fr-ambientes-363.test.cjs\`: cinco casos de regressão.
7. \`package.json\`: inclusão da suíte 3+6+3 no \`npm test\`.
8. Este registro.

## Evidências executadas
- **PASS**: sintaxe dos scripts, verificada no ambiente JavaScript conectado.
- **PASS (mock de DOM/V8)**: catálogo de 12 fontes => 12 composições divididas 3+6+3, botões com índices originais.
- **PASS (mock de DOM/V8)**: clique no quinto card chama \`openAmbDetail(4)\`.
- **PASS (mock de DOM/V8)**: \`destroy()\` deixa zero novos cards e mantém \`#amb-grid-container\`.
- **PENDENTE**: npm test, npm run check:html, npm run build, navegação com Chromium 390x844 e desktop, contraste visual, dados reais da \`AMB_STYLES\` em execução e disponibilidade de todas as imagens em produção.

## Nota sobre escopo
O atlas foi substituído no **estado visual**, não removido do DOM: isto é intencional para manter os dados, a função original de popup, deep links e reversibilidade. A sequência dos 12 ambientes usa exatamente a ordem do array canônico, sem renomear itens e sem substituir suas imagens por recursos criados artificialmente.

## Rollback
Usar \`window.FRAmbientes363.destroy()\` para retornar ao atlas antigo durante a sessão. Para rollback de código, reverter os commits desta fase de forma estreita; **não** reverter indiscriminadamente as Fases 1 e 2. Os elementos anteriores não são apagados e o orçamento não é alterado.

## Fora desta fase
Projeto 3D, IQE, Navbar, Jornal FR e rodapé. Esses componentes continuam para checkpoints seguintes, sem alterações não relacionadas.
