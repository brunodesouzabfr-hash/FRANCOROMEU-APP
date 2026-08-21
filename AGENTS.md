# AGENTS.md — Franco Romeu (ꟻR) / FRANCOROMEU-APP

Estas instruções valem para todo o repositório. Elas existem para permitir evolução incremental sem perder o motor de orçamento, a rastreabilidade técnica, a identidade Franco Romeu ou a possibilidade de reverter uma mudança.

## 0. Decisão canônica vigente

- A única base funcional e visual autorizada para desenvolvimento é a branch `codex/etapa-15-materialidade-imersiva` e seu PR #6.
- Enquanto o PR #6 não for aprovado e integrado, toda nova branch de trabalho deve partir dessa branch.
- A `main` continua sendo a versão estável oficial atual, mas ainda não representa a direção visual escolhida para o próximo lançamento.
- PRs #3 e #4 e suas branches são histórico intermediário. Não continuar o visual dessas etapas separadamente.
- O PR #5 e `codex/etapa-15-sites-individuais` foram rejeitados. Não reutilizar layout, navegação ou decisões visuais dessa tentativa.
- A branch `develop` não tem papel aprovado no fluxo atual.
- Fundamentos técnicos anteriores já incorporados à Materialidade Imersiva devem ser preservados.
- Não substitua a Materialidade Imersiva por um novo redesign completo sem autorização explícita.
- A decisão formal está em `docs/DECISAO_BASE_CANONICA_ETAPA15.md`.

## 1. Missão do repositório

O `FRANCOROMEU-APP` é a aplicação corporativa da Franco Romeu — **Arte + Engenharia**. A base atual combina uma SPA HTML autocontida, calculadora de estimativa, IQE, busca, Ambientes, Projetos 3D, Portfólio, geração de PDF e ferramentas locais de administração.

Prioridades, nesta ordem:

1. preservar segurança, integridade dos dados e funcionamento comercial;
2. manter fórmulas, IDs e integrações rastreáveis;
3. garantir uso mobile, acessibilidade e desempenho;
4. expressar a identidade FR com autoria, matéria, método e permanência;
5. evoluir visualmente sem transformar a aplicação em template genérico.

## 2. Fontes de verdade

Ao encontrar conflito, use esta ordem:

1. pedido explícito da tarefa atual;
2. código e testes da branch em trabalho;
3. `README.md`, `CHANGELOG.md` e documentação vigente em `docs/`;
4. decisões já aprovadas e registradas no PR;
5. inferência técnica, identificada como tal.

Antes de editar, confirme a branch, leia o diff existente e localize a implementação real. Não assuma que uma versão antiga é canônica apenas pelo nome do arquivo.

### Base rejeitada

A branch `codex/etapa-15-sites-individuais` e o PR correspondente representam uma tentativa rejeitada. **Não use essa branch como base, fonte de código ou atalho de implementação.** Uma eventual recuperação de ideia exige autorização explícita e reimplementação sobre a base aprovada.

## 3. Mapa técnico atual

- `base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html`: aplicação principal autocontida preservada na base canônica; o nome legado do arquivo não transforma a Etapa 13 em base de desenvolvimento.
- `src/budget-core.js`: núcleo financeiro puro e testável.
- `tests/`: testes do Node.js (`node:test`).
- `scripts/check-html.js`: regressões estruturais do HTML principal.
- `docs/`: decisões, auditorias e checklists duráveis.
- `.github/workflows/`: validações automáticas do GitHub Actions.

Não crie um segundo motor, um segundo estado global ou uma calculadora paralela para contornar a arquitetura existente.

## 4. Invariantes protegidos

Qualquer mudança deve conservar, salvo autorização explícita acompanhada de migração e atualização dos testes:

- `FRBudgetCore` e sua cópia incorporada no HTML (`id="fr-budget-core"`);
- ponte pública `window.__frCore`;
- `appState`, persistência em `localStorage` e recuperação do orçamento;
- `selectedServices`, `serviceId`, `quantidade`, `configs` e compatibilidade com índices legados;
- fluxo `addToBudget(serviceId, quantity, configs)`;
- chamadas de atualização `renderApp()` e/ou `saveAndRender()`;
- IQE, busca, PDF, navegação SPA, fidelidade, Ambientes, Projetos 3D, Portfólio e God Mode local;
- seis views: Home, Sobre, Ambientes, Projetos 3D, Portfólio e Orçamento;
- banco canônico atual: **115 serviços, 15 categorias e 7 cupons padrão**;
- inventário editorial atual: 12 estilos de Ambientes, 6 conceitos 3D e 16 projetos de Portfólio.

### Fórmulas e valores

- Não altere preço, desconto, cupom, markup, visita técnica, arredondamento, faixa estimada ou regra de pagamento sem autorização explícita.
- Valores do navegador são referências configuráveis; não os apresente como preço fechado ou mercado validado.
- Mudança autorizada em fórmula deve atualizar o núcleo puro, a cópia incorporada, os testes e a documentação de premissas no mesmo PR.
- Preserve IDs e índices existentes. Renomear um `serviceId` exige migração de todos os mapas e dados persistidos relacionados.

### God Mode e segurança

- Preserve o fluxo local enquanto ele fizer parte da base de desenvolvimento.
- Nunca trate God Mode, parâmetro de URL ou código no cliente como autenticação real.
- Não grave tokens, senhas, chaves, dados de clientes ou segredos no HTML, JavaScript, workflow, log ou PR.
- Uma publicação pública deve impedir acesso administrativo e manter cálculos comerciais sensíveis sujeitos a validação adequada.

## 5. Método de implementação

1. Inspecione antes de editar: arquivos, chamadas, estado, testes e regressões conhecidas.
2. Faça a menor mudança completa possível, em branch de tarefa criada a partir da base aprovada.
3. Reuse APIs existentes. Para extensões externas, prefira `window.__frCore`.
4. Mantenha CSS e JavaScript novos com namespace FR para reduzir colisões.
5. Não adicione dependência de produção, framework, bundler ou backend sem autorização explícita.
6. Preserve funcionamento degradado quando CDN, fonte, imagem, ViaCEP ou biblioteca de PDF estiver indisponível.
7. Documente premissas, limites, teste manual pendente e caminho de reversão.

Não faça reescrita ampla para resolver defeito localizado. Não remova motion, componentes ou recursos funcionais de forma indiscriminada para simplificar a implementação.

## 6. UX, frontend e acessibilidade

- Trabalhe mobile-first e valide pelo menos `390x844` e desktop.
- Zero overflow horizontal, texto cortado ou elemento interativo inacessível.
- Alvo de toque mínimo de 44 px; círculos devem manter largura = altura e `aspect-ratio: 1`.
- Preserve zoom, teclado, foco visível, ARIA, contraste e bloqueio correto de fundo em modais.
- Respeite safe areas e `prefers-reduced-motion`; reduza movimento, não apague a identidade.
- Motion deve orientar, explicar estado ou reforçar a narrativa — nunca bloquear uso.
- Preserve Core Web Vitals: evite trabalho contínuo, mídia sem dimensão, scripts duplicados e dependências desnecessárias.
- A estética pode buscar excelência Awwwards sem copiar trabalhos e sem sacrificar clareza, desempenho ou conversão.

## 7. Marca e conteúdo FR

Núcleo: Franco Romeu, ꟻR, Forjada Resistência, Arte + Engenharia, verdade material, método, autoria, resistência, execução controlada e sofisticação sem ostentação.

- Voz: direta, técnica, autoral, material, consultiva e humana.
- Vocabulário útil: presença, matéria, método, execução, acabamento, precisão, oficina, forja, curadoria material, engenharia de custo e permanência.
- Evite linguagem barateadora ou vazia, incluindo “baratinho”, “mágico”, “fazemos de tudo” e superlativos sem prova.
- Não invente obra, cliente, depoimento, métrica, prêmio, certificação, CNPJ, prazo, garantia, licença, preço ou resultado.
- Render deve ser identificado como render. Imagem de terceiro deve ser identificada como referência visual e nunca apresentada como obra executada.
- Use somente o arquivo de logo aprovado para a tarefa. Nunca redesenhe, ovalize, espelhe, distorça, recorte ou gere o monograma por IA. Preserve proporção e área de respiro.
- Não use `®` sem comprovação de registro.

## 8. Verificações obrigatórias

Antes de considerar qualquer PR pronto, execute na raiz:

```bash
npm test
npm run check:html
```

Quando aplicável, acrescente:

- JavaScript alterado: `node --check caminho/do/arquivo.js`;
- HTML/UI: abrir por HTTP, testar as seis views, console, teclado, toque, `390x844` e desktop;
- cálculo/IQE: comparar seleção manual e recomendação, recarregar a página e validar persistência;
- PDF: gerar casos curto e longo e revisar paginação;
- integração externa: validar sucesso, vazio, erro, timeout e indisponibilidade de rede;
- ativos: conferir licença, origem, texto alternativo, dimensão e peso.

Não declare teste visual, navegador, dispositivo ou PDF como aprovado se ele não foi realmente executado. Registre pendências no PR.

## 9. Git e Pull Requests

- Não desenvolva diretamente na `main`.
- Antes de trocar de branch, confirme que o trabalho local está limpo.
- Não use `git add .`, `git add -A`, `git push --force`, `git reset --hard` ou operação destrutiva ampla.
- Adicione apenas caminhos deliberadamente alterados.
- Commits devem ser pequenos, descritivos e reversíveis.
- Abra PR em rascunho até testes automáticos e aceite manual estarem documentados.
- Não faça merge sem autorização do responsável e sem os checks exigidos.
- Mudança visual significativa precisa de evidência de antes/depois ou descrição verificável no PR.
- Mudança de fórmula, banco, segurança ou publicação deve declarar risco e rollback.

## 10. Code Review Rules

Ao revisar, sinalize como bloqueador:

- alteração não autorizada de fórmula, preço, cupom, serviço, categoria ou ID;
- divergência entre `src/budget-core.js` e o núcleo incorporado;
- perda de serviço, view, integração, persistência, PDF, IQE ou busca;
- segredo ou dado pessoal enviado ao cliente, log, workflow ou repositório;
- God Mode apresentado como autenticação segura;
- quebra em 390 px, foco invisível, alvo de toque pequeno ou motion incontornável;
- imagem de referência apresentada como obra ou render sem identificação;
- logo deformado ou reconstruído;
- claim comercial sem fonte ou evidência;
- código reaproveitado da Etapa 15 rejeitada;
- teste removido, enfraquecido ou ignorado para fazer o CI passar.

Caminho seguro: preservar a API existente, adicionar regressão reproduzível, documentar a exceção e manter a mudança reversível.

## 11. Definição de concluído

Uma tarefa só está concluída quando:

- o escopo pedido funciona e o diff contém apenas arquivos relacionados;
- `npm test` e `npm run check:html` passam;
- invariantes protegidos permanecem válidos;
- estados normal, vazio, erro e persistência foram considerados;
- QA manual aplicável foi executado ou marcado explicitamente como pendente;
- riscos, limitações e rollback estão descritos no PR;
- não houve merge, publicação ou comunicação externa além do que foi autorizado.
