# Home e Portfólio — navegação por comparação

Base: `main` em `3f1ac7560fe20980378a324c3244e5b1373b7147`.
Branch: `fix/home-portfolio-scroll-scenes-2026-10-18`.

## Resultado preparado

- Home e Portfólio compartilham dimensões, cartões e revelação vertical em sentidos opostos. O Portfólio contém os 60 pares canônicos (120 imagens), sem gerar a lista duplicada de comparações.
- O estágio original é movido para dentro do contêiner ativo `fr16-portfolio`, preservando os nós e os links dos projetos. O alias `frpm-before-after` continua válido, e o CTA de transformações aponta para ele.
- Cada puxada contínua de roda/trackpad avança somente uma comparação. A distância, velocidade, unidade e repetição dos eventos, uma inversão dentro da puxada ou o término da animação não liberam outro avanço. A sessão permanece consumida até haver mais de 240 ms sem eventos; esse intervalo distingue gestos na API de roda, que não informa o contato físico dos dedos.
- Fotos em sentidos opostos e card central compartilham uma transição de 1.600 ms com interpolação de quinta ordem e velocidade/aceleração nulas nas extremidades. A mudança de cor do card usa 1.200 ms suaves. Nenhuma transição fica parada entre cenas.
- Três puxadas separadas para baixo, iniciadas dentro de 1.600 ms, cancelam a fila e pulam a seção com rolagem suave ao conteúdo seguinte. Uma única puxada contínua não acumula essa contagem. Puxadas mais espaçadas percorrem as cenas uma a uma. Reverter o sentido reinicia a contagem; setas e índice continuam como controles explícitos. A mesma saída vale para três swipes completos; o botão **Pular animação ↓** permanece disponível.
- Saltos diretos pelo índice revelam apenas as duas cenas escolhidas. A regressão de 1 → 60 verifica que no máximo 12 imagens (extremos e vizinhas) recebem fonte, sem hidratar os 58 projetos intermediários.
- Uma puxada da barra avança uma cena, independentemente da distância; manter o ponteiro pressionado conserva a mesma sessão mesmo com pausas. Toque vertical e teclado têm navegação por cena; repetição automática de tecla não acumula fotos. Os limites liberam a rolagem da página após o gesto consumido; zoom, controles de formulário e diálogos abertos permanecem acessíveis.
- Movimento reduzido elimina a interpolação e mantém as 60 comparações acessíveis pelos controles.
- As 48 mídias elegíveis de `FR-C001` ficam em uma única pasta: **Reforma de cozinha e lavanderia — quartzo e móveis**. As duas galerias abertas que repetiam o projeto no Portfólio deixam de ser montadas. O dossier usa o visualizador existente e conserva os rótulos e relações de cada mídia.
- A página própria `/projetos/cozinha-lavanderia` continua com sua galeria. Seu gerador passou a renderizá-la independentemente do Portfólio.
- Descoberta de serviços e galeria de apoio da Home são inseridas antes do percurso horizontal. O percurso passa a ser o último conteúdo, seguido apenas pelo rodapé original.

## Evidências e validação

| Verificação | Estado | Evidência |
| --- | --- | --- |
| Base e trabalho anterior | PASS | Clone limpo da main; branch de tarefa isolada; sem mudanças anteriores |
| 60 pares apenas na animação | PASS | DOM gerado: 60 cartões, 120 imagens; zero `.frpm-pair` no Portfólio |
| Pasta única do projeto | PASS | DOM gerado: um cartão em `frpm-portfolio-projects`; 48 IDs únicos no dossier; zero galerias antigas do projeto no Portfólio |
| Ordem final da Home | PASS | DOM gerado termina em `froutro4` e `.fr6-footer` |
| Interações por cena | PASS | 17 testes em `tests/fr-motion-phase1.test.cjs`: puxada sustentada maior que a animação, deltas/unidades/direções variados, três gestos separados, saída, fila espaçada, card/fotos sincronizados, limites, toque, zoom, teclado, barra mantida, movimento reduzido e cancelamento |
| Montagem e preservação de rotas | PASS | Testes verificam identidade dos nós movidos, alias, CTA e galeria da página própria |
| Suíte geral | PASS | `npm test` |
| Estrutura HTML e invariantes | PASS | `npm run check:html`: seis views, IDs únicos, núcleo financeiro e ponte PDF |
| Build público | PASS | `npm run build` |
| Home e Portfólio em desktop e 390×844 | PASS | Prévia Vercel: transições completas, uma cena ativa com opacidade 1 e sem overflow; captura desktop em `evidence/portfolio-scroll-desktop-2026-10-18.png` |
| Índice e pasta de projeto no navegador | PASS | Índice acessado por teclado até 60/60; pasta com 48 miniaturas, avanço 1 → 2 e foco restaurado ao fechar |
| Navegação nas seis views | PASS | Home, Sobre, Ambientes, Projetos 3D, Portfólio e Orçamento abertos; sem overflow horizontal no desktop |
| Console observado | PASS | Nenhum erro no registro coletado durante a navegação |
| Vercel/GitHub no commit 6955ebe5 | PASS | Status Vercel concluído e FR Quality Gate #117 aprovado; sem promoção de produção |
| API Vercel da equipe | BLOCKED | Conexão recusou leitura do escopo `franco-romeu` com 403; URL e estado da prévia foram obtidos da integração GitHub |

A verificação de toque usa eventos simulados. Resta o aceite do responsável sobre sensibilidade em mouse/trackpad e aparelho móvel físicos. A prévia mostra um aviso INP da barra de feedback Vercel; não é uma medição isolada desta mudança nem permite atribuir causa. Os testes não são medições de desempenho real nem certificação de fidelidade fotográfica.

A prévia local falhou por infraestrutura (`bwrap: Can't mount proc on /newroot/proc: Operation not permitted`); a revisão foi concluída na prévia Vercel da branch. O ajuste posterior de salto direto preserva o layout; sua regressão tem teste próprio.

Revisão de sensibilidade solicitada em seguida: a regressão de 17 testes e a checagem sintática passaram localmente. A validação geral e a revisão visual desta revisão serão registradas no PR #35; as evidências de navegador e CI da tabela acima descrevem a versão anterior já verificada (`e0faad2`).

## Preservação, risco e reversão

Arquivos de origem de mídia, hashes históricos, IDs de serviço, fórmulas, preços, cupons, persistência, IQE e arquivos de SEO/canonical não são alterados. O ajuste atua na apresentação e na navegação do acervo existente. Não há dependência de produção nova.

Risco a conferir: ritmo e distinção de inércia/pulsos variam por dispositivo. A sequência não captura roda/toque fora de um estágio ativo, libera seus limites e possui controles explícitos. A seleção visual foi inspecionada na prévia; o aceite do responsável continua pendente.

Reversão: reverter os commits desta tarefa e executar o build padrão. Nenhuma migração de dados nem movimentação física de fotos é necessária. Produção não foi promovida por esta tarefa.
