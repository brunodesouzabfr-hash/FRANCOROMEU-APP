# CHECKPOINT 2 — Curadoria e integração Home / Portfólio

Data: 2026-10-15  
Branch: `feature/fr-motion-phase1-2026-10-15`  
Base canônica: `main@239ba51056a51d6b7b4fa4179f5b62d42e0076af`  
Estado: **implementação em branch, sem merge e sem deploy; QA integrado pendente**

## Especificação do proprietário aplicada
- Home: Dual Split Scroll na primeira seção após o Hero, com cinco composições; cada etapa usa 100svh de progressão enquanto a área visual permanece sticky em 100svh.
- Portfólio: **todos os 60 pares válidos** presentes no catálogo; o algoritmo bloqueia vínculos incompletos ao invés de omiti-los silenciosamente.
- Card central retangular, dupla borda, cores amostradas das duas fotografias, movimento oposto de máscaras e estética do patch aprovado.
- Fotografia de obra executada pela FR e visualização 3D de autoria FR, conforme declaração de titularidade e natureza dada pelo proprietário; arquivos originais e classificações legadas permanecem para futura reconciliação.
- Nenhuma ação na sequência 3 + 6 + 3 de Ambientes nesta fase: substituição do atlas original ficará para a fase própria.
- Sem símbolo ®; © reservado a aviso de direitos autorais em etapa editorial apropriada.

## Seleção editorial inicial da Home
Ordem e vínculos reais extraídos de `content/before-after/before-after-pairs.json`:
1. `FR-BA010` — Área gourmet / cozinha planejada
2. `FR-BA055` — Cozinha / bancada
3. `FR-BA007` — Banheiro / bancada
4. `FR-BA034` — Sala de estar / automação
5. `FR-BA059` — Fachada / revestimento

A quinta composição dá lugar a `FR-C001-3D-EXEC` (Cozinha + Lavanderia) **somente** se o catálogo compilado contiver simultaneamente uma imagem de estágio PROJECT_3D/RENDER e uma de estágio APPLICATION não RENDER, ambas vinculadas ao mesmo projeto FR-C001. A associação da mesma obra não garante enquadramentos iguais: verificação visual/câmera ainda necessária. Nunca usar mídias de projetos distintos para compor uma falsa linha do tempo.

**Limite:** a escolha dos cinco pares é curadoria por tema e catálogo, ainda não seleção visual homologada das cinco melhores fotos em alta resolução. O arquivo multipartido enviado na conversa refere-se a capturas de sites de referência, não às fotos das 60 obras.

## Integração
- `src/fr-motion-phase1.cjs`: resolve títulos em `pair.project.title`, ambientes em `pair.project.environment_ids` e `prepared.l.maps.environments`, valida os 60 vínculos, curadoria determinística da Home e fallback sem 3D.
- `assets/js/fr-motion-split.js`: navegação por índice, salto por scroll e botão de saída; atualização esparsa de cenas visíveis/adjacentes para evitar recalcular 60 imagens a cada frame.
- `assets/css/fr-motion-split.css`: controle das camadas, dupla borda, responsive, seção editorial com três destinos.
- `tests/fr-motion-phase1.test.cjs`: teste das 60 comparações, seleção de cinco, associações 3D condicionais e falhas explícitas.

### Destinos editoriais
- Cozinha e Lavanderia: `/projetos/cozinha-lavanderia`
- Antes & Depois: `/portfolio#frpm-before-after`
- Reels Ambience: `/portfolio#frpm-portfolio-environments` (mantém âncora existente)

## Evidências executadas nesta conversa
1. **PASS**: leitura de 60 pares + catálogo de projetos da `main`, confirmando IDs e diversidade de ambientes.
2. **PASS**: compilação sintática do adaptador e runtime em V8.
3. **PASS em DOM simulado, não Chromium**: montagem de cinco cenas reais da Home, sessenta pares no Portfólio (120 quadros), títulos, ambientes, hrefs e três destinos da caixa de coleções.
4. **PASS em runtime simulado**: contador 01/60→02/60, index jump, reversibilidade das máscaras, retorno a cenas anteriores e teardown de eventos.
5. **PASS em runtime simulado**: em movimento mantendo o mesmo índice, apenas 21 gravações de estilos, evitando 180+ atualizações em todos os 60 itens.
6. **PENDENTE**: `npm test`, `npm run check:html`, `npm run build`, `npm run check:idempotence`, verificação por Chromium no site compilado em desktop e 390×844.
7. **PENDENTE**: confirmação visual do par de projeto 3D com foto do executado e validação final das cinco imagens com fontes originais.

## Rollback
Reverter os commits desta fase na branch ou reverter a branch para o checkpoint anterior (somente se não houver trabalho local novo), mantendo a main inalterada. Flags/teardown `window.FRMotionSplit.destroy()` para sessão. O fallback DOM permanece presente para links e navegação.

## Continuação após aceite
A próxima fase aprovada será **Ambientes 3 + 6 + 3**, substituindo apenas a apresentação visual do atlas, mantendo conteúdo/links/12 ambientes. Não executar antes do aceite do usuário.
