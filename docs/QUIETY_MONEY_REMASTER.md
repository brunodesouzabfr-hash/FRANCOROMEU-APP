# Quiety Money — Palimpsesto de Forja

**Versão do artefato:** `17.0-palimpesto-de-forja`

**Branch de trabalho:** `codex/quiety-money`

**Base canônica:** `main` em `44b76f734f816e8fb842138a555887d596143c77`
**Estado:** candidato em preview automatizado e protegido; sem merge ou alteração de produção.

## Intenção

Esta remasterização não tenta uniformizar as seis views. Ela organiza a diferença. A identidade existente — logo aprovado, verde petróleo, laranja de forja, ouro de inscrição, tipografia editorial e linguagem de Arte + Engenharia — permanece como lastro. A nova camada muda a gramática espacial, a resposta à interação e a relação entre as páginas.

O conceito central é **Palimpsesto de Forja**: cada view se comporta como um material com memória. Scroll, ponteiro e clique deixam sinais temporários, mas nunca alteram conteúdo, cálculo ou estado comercial.

## Seis mundos, uma narrativa

| View | Mundo | Causa visual | Tratamento |
|---|---|---|---|
| Home | Forja | matéria em tensão antes da forma | escala monumental, calor, chapa tipográfica deslocada |
| Sobre | Palimpsesto | decisões deixam camadas e rastros | composição de manifesto, linhas editoriais, ouro envelhecido |
| Ambientes | Pátina | atmosfera surge do tempo e da matéria | cobre, verde oxidado, atlas sensorial |
| Projetos 3D | Wireframe | o espaço é testado antes de existir | malha técnica, ciano de desenho, profundidade axonométrica |
| Portfólio | Arquivo Vivo | imagem e processo não têm o mesmo estatuto | bordô residual, ouro de índice, percurso horizontal |
| Orçamento | Ledger | invenção precisa terminar em medida | verde técnico, grade de custo, prioridade absoluta para leitura |

As frases de cada mundo são metáforas editoriais, não claims comerciais. Nenhuma obra, prazo, métrica ou resultado foi inventado.

## Cinco sistemas conectados

1. **Campo cartográfico** — canvas 2D de baixa complexidade, redesenhado somente em resize, scroll, ponteiro ou troca de view. Não existe loop ocioso. É desligado abaixo de 720 px e com `Save-Data`.
2. **Tipografia tectônica** — títulos respondem com deslocamento mínimo à posição e à velocidade do ponteiro, preservando os transforms dos motores anteriores.
3. **Aberturas materiais** — recortes de imagem variam por mundo e se abrem em hover/foco; no touch, a geometria é simplificada.
4. **Inscrição de ação** — clique em controle deixa uma coordenada efêmera. A memória usa apenas `sessionStorage`; não toca o `localStorage` do orçamento.
5. **Ressonância simpática** — cards relacionados respondem em sequência ao hover/foco sem esconder informação nem mudar ordem de leitura.

Os cinco sistemas compartilham um vetor leve de progresso, energia, velocidade e posição. Isso produz variação contextual sem biblioteca externa, WebGL ou física em execução contínua.

## Correções incluídas

- elimina a colisão entre o manifesto e o corpo de texto no hero de Sobre;
- reserva largura estável para a marca na navegação desktop;
- remove o rótulo de mundo duplicado e mantém uma única espinha espacial;
- impede quebra interna de “transformação” no título móvel do Portfólio;
- afasta a espinha conceitual da barra fixa do orçamento no mobile;
- reposiciona o acesso ao Jornal Técnico fora da área coberta pelo header.

## Contratos preservados

- `FRBudgetCore`, a cópia incorporada e `window.__frCore` não são modificados;
- IDs, serviços, categorias, cupons, preços, fórmulas, quantidade e `configs` não são modificados;
- `appState`, `localStorage`, PDF, IQE, busca e navegação SPA permanecem no fluxo existente;
- as seis views continuam presentes;
- nenhuma imagem foi removida, relabelada ou apresentada como obra executada;
- não há nova dependência de produção, framework, CDN ou backend.

## Acessibilidade e energia

- `prefers-reduced-motion` recebe uma composição estática leve: preserva conteúdo, identidade e correções de layout, mas não participa da cascata imersiva;
- ponteiro coarse/touch não recebe física de hover;
- elementos decorativos usam `aria-hidden` e `pointer-events: none`;
- os sistemas não criam controles ou uma ordem de foco paralela;
- `forced-colors` e impressão ocultam a camada atmosférica;
- a feature flag oferece fallback total sem remover código canônico.

## Rollback

Rollback imediato, definindo a flag antes de `#fr-quiety-money-preflight` no `<head>`:

```html
<script>window.FR_QUIETY_FLAGS = { enabled: false };</script>
```

Rollback estrutural: remover a tag `script` de `assets/js/fr-quiety-money.js` e o bloco `#fr-quiety-money-css`. Todo CSS novo é subordinado a `html.frqm-ready`, portanto o visual anterior retorna quando a classe é removida. Em runtime, `window.FR_QUIETY_MONEY.destroy()` desfaz listeners, atributos, nós decorativos e variáveis da camada.

## Diagnóstico externo verificado

O texto de entrada afirmava que `sitemap.xml` retornava 404 e que havia loop entre domínio com e sem `www`. A verificação em 2026-10-14 encontrou `200` no sitemap e redirecionamento finito do apex/Vercel para `www`; nenhuma “correção” especulativa foi aplicada. Ahrefs não liberou a auditoria no plano conectado. O Search Console respondeu, mas nenhuma solicitação de indexação ou submissão de sitemap foi feita porque esta branch ainda não é uma versão publicada e aprovada.

O push autorizado da branch acionou automaticamente um preview protegido na Vercel. O deployment correspondeu à branch e ao commit enviados, terminou `Ready`, manteve `noindex` e respondeu `200` nas seis rotas, em `sitemap.xml`, `robots.txt` e `/api/google-reviews`; o endpoint de avaliações respondeu explicitamente `not_configured`. A integração automática Cloudflare Workers registrou falha de deployment, mas os logs detalhados exigem acesso ao dashboard. A produção foi verificada separadamente com `200` e sem a camada Quiety.

## Evidência do candidato local

Validado em 2026-10-14, por Chromium headless com emulação local:

- `npm test`: suíte canônica completa aprovada, incluindo Stage 14/15/16, build público, 36 testes Node e 7 integrações de release;
- `npm run test:quiety`: 5/5 testes focais aprovados, incluindo rollback e movimento reduzido;
- `npm run check:html`: estrutura, IDs, seis views, ponte `__frCore`, núcleo incorporado e SEO aprovados;
- `npm run build`: 833 artefatos; fonte não mutada; SHA público `d7810b9b642854f7a28ce36c1b8989cf5d868e0449f9e6048ed4fddbda76a507`; fingerprint `33540b116afab240a8a2897faae6fd154802dec3ab6da3d28c1a54f341142448`;
- auditoria das seis views em 390×844 e 1440×900: zero overflow horizontal, imagem quebrada, controle menor que 44 px ou erro JavaScript observado;
- regressão das seis views em 320×568, 360×800, 390×844, 412×915, 768×1024, 1024×768, 1280×720, 1440×900 e 1920×1080: `PASS`;
- fluxos aprovados: menu/Escape/foco/histórico, CTA e editor real de quantidade, persistência e paridade financeira após recarga, export/import/recovery/rejeição atômica, seis rotas diretas, 404 real, parâmetro admin inócuo, estados sintéticos da integração Google e conteúdo imediato com movimento reduzido;
- o perfil sintético em 390×844 preservou CLS em `0,002757` e acrescentou somente 2 recursos locais e cerca de 27 KB ao build observado. O timing absoluto não foi aprovado: uma amostra inicial marcou LCP mediano de 3472 ms, mas a repetição final, com load médio da máquina próximo de 11 e forte CPU externa, marcou 5044 ms; a comparação intercalada com a feature flag desligada oscilou de 4044 a 11216 ms. Essa dispersão é maior que o efeito procurado e torna a conclusão de LCP/tarefas longas inconclusiva.

## Limites e gates ainda fechados

- `npm test` completo precisa ser repetido se houver qualquer mudança adicional de implementação;
- performance precisa ser repetida em runner isolado ou preview estável antes de aprovação de release; não há alegação de meta Lighthouse ou Core Web Vitals aprovada;
- não houve teste em dispositivo físico, Lighthouse oficial, PDF visual manual, promoção para produção, submissão ao Search Console ou validação por Ahrefs;
- o preview protegido teve rotas e build verificados por CLI autenticada, mas não recebeu uma segunda auditoria visual completa em navegador remoto;
- a falha automática da Cloudflare permanece bloqueada por falta de acesso aos logs do dashboard e impede considerar o gate multihost concluído;
- comparação visual foi feita com screenshots identificados por viewport; a revisão é interna, não independente;
- merge e produção continuam dependentes de revisão e autorização explícita do proprietário.
