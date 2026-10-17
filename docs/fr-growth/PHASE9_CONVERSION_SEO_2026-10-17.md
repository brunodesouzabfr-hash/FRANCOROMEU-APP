# FRANCO ROMEU — FASE 9 · Inteligência de conversão e descoberta orgânica
**Data:** 2026-10-17  
**Base verificada:** `main` commit `2e6fb9040ccd64ce6cac05b9eb9d6951ac760369`  
**Status:** implementação técnica em branch; não significa que haja leads reais ou que eventos foram recebidos no GA4 até a publicação.

## Objetivo
Instrumentar **intenções mensuráveis**, sem comprometer o núcleo de orçamento (115 serviços), a experiência SPA, a introdução V05 ou a privacidade de clientes. Preparar uma base operacional para SEO, atendimento e automação empresarial.

## Baseline factual anterior à Fase 9
Fonte: GSC Wizard, propriedade de domínio `sc-domain:francoromeufr.com.br`, últimos 28 dias com dados consolidados até 2026-10-14:
- GSC: **1 clique, 9 impressões, CTR 11,11%, posição média 10,67**. Amostra pequena demais para estimar evolução do ranking.
- Página observada: `https://www.francoromeufr.com.br/`.
- Consultas por página: não usar como prova de cobertura de palavras-chave; a consulta individual disponível foi “construtora franco da rocha”, com 1 impressão.
- GA4 da mesma propriedade: `properties/559008285`, janela `2026-09-17 → 2026-10-14`: **16 usuários, 103 page_views, 25 session_starts, 43 user_engagement, 27 scroll**; nenhum evento comercial nos cinco tipos retornados.
- Sitemap: `https://www.francoromeufr.com.br/sitemap.xml`, Google informou **6 URLs enviadas, 0 URLs indexadas no relatório daquele sitemap** (15/10); isso **não** prova que todo o domínio tenha zero URLs indexadas. Sitemap público conferido em 17/10, 6 URLs canônicas, HTTP 200.
- A geração estática possui mais rotas técnicas/editoriais do que rotas elegíveis para indexação; **não publicar automaticamente páginas nem imagens em HOLD**, nem sem direitos/origem validados.

## Contrato de eventos
Todos os eventos começam com `fr_`. O envio ocorre somente em HTTPS na origem **www.francoromeufr.com.br**, quando existe `window.gtag`, sem `navigator.doNotTrack=1` nem `navigator.globalPrivacyControl=true`. Não altera a inicialização existente do GA4 e **não dispara `page_view` manual** para evitar duplicação com o Enhanced Measurement e com a SPA.

| Evento | Disparo realmente implementado | Natureza | Parâmetros permitidos |
|---|---|---|---|
| `fr_budget_view` | Uma vez por ativação visível da seção Orçamento | Visita ao orçamento, não lead | `fr_section, fr_placement` |
| `fr_contact_click` | Clique em link de WhatsApp, telefone ou e-mail | Tentativa de contato externo, não conversa confirmada | `fr_channel, fr_section, fr_placement` |
| `fr_social_click` | Clique em link Instagram | Visita à rede social, não conversão | `fr_channel, fr_section, fr_placement` |
| `fr_quote_whatsapp_attempt` | Clique inicial no botão de envio do orçamento, ANTES da validação | Intenção; pode ser rejeitada pelo formulário | `fr_section, fr_placement` |
| `fr_quote_pdf_attempt` | Clique em Gerar PDF | Intenção; NÃO confirma arquivo emitido | `fr_section, fr_placement` |
| `fr_quote_file_export_attempt` | Clique em Salvar arquivo do orçamento | Intenção; NÃO confirma arquivo salvo | `fr_section, fr_placement` |
| `fr_quote_review_click` | Clique em revisar proposta/orçamento | Intenção | `fr_section, fr_placement` |
| `fr_iqe_open_click` | Clique no antigo FAB do IQE | Intenção | `fr_section, fr_placement` |
| `fr_iqe_mode_select` | Seleção manual/automática no wizard | Escolha de modo, não conclusão do IQE | `fr_mode, fr_section, fr_placement` |
| `fr_assistant_open_click` | Clique no botão de assistente | Intenção de assistência | `fr_section, fr_placement` |

Eventos não incluem nome, telefone, e-mail, endereço, ID de cliente, valor, cupom, mensagem do WhatsApp, `href`, query string, texto digitado ou dados armazenados localmente. `fr_section`, `fr_channel`, `fr_placement` e `fr_mode` possuem vocabulário fechado (baixa cardinalidade). Não armazenar dados adicionais em `localStorage`.

**Importante:** um clique em `wa.me` não comprova mensagem enviada. A propriedade GA4 só deve marcar como evento-chave uma **conversão comprovada**; não usar `generate_lead`, `purchase` ou receita inferida para clicks.

## Testes e gates
- `node --test tests/fr-conversion-phase9.test.cjs` após gerar `dist`.
- `npm test`, `npm run check:html`, `npm run build`, `npm run check:project-library`, `npm run check:idempotence`.
- Verificar exactamente uma inclusão do JS diferido em cada uma das seis páginas SPA.
- QA de domínio: eventos silenciosos em preview/apex; clique externo só transmite canal e placement; envio de WhatsApp de orçamento separa `attempt` do acesso ao link efetivo.
- Pós-publicação: testar Realtime e DebugView no GA4 com interação manual no domínio oficial e verificar parâmetros sem PII. O teste automatizado local não é evidência de ingestão efetiva no GA4.
- Controle: excluir tráfego de QA interno conforme política de medição; não inflar KPIs com testes.

## Próximos pacotes de crescimento (não implementados nesta subfase)
1. **SEO local e demanda:** Google Business Profile, NAP consistente, fotos próprias validadas, serviços/categorias reais e páginas de serviços indexáveis após QA.
2. **Conversão comprovada:** instrumentar confirmação de envio/sucesso do atendimento/solicitação, preferencialmente via backend/webhook auditável; marcar como evento-chave somente após validação.
3. **CRM e automação:** integrar consentimento de contato, captura consciente da origem, etapa comercial e responsável; não conectar WhatsApp/CRM por scraping, não enviar dados de clientes ao GA4.
4. **Operação recorrente:** painel semanal com sessões engajadas, impressões/cliques por serviço, contatos intentados, solicitações recebidas e propostas aceitas. Separar cada unidade de análise para não inflar taxas.

## Interpretação dos KPIs
`CTR orgânico = cliques / impressões`; amostras pequenas e sazonalidade tornam tendências frágeis.
`Intenções de contato / sessões` é taxa de **intenção**, não conversão em cliente.
`Lead qualificado`, `proposta enviada`, `proposta aprovada` e `faturamento` não são mensuráveis neste módulo sem evidência no sistema comercial.

## Rollback
Reverter o PR da Fase 9 caso haja regressão; o módulo não modifica a lógica do orçamento, do IQE, da SPA ou da intro. O build passa a incluir o JS diferido; removê-lo na reversão e rodar novamente todas as verificações. Preservar todo o histórico Git sem reset ou force-push.
