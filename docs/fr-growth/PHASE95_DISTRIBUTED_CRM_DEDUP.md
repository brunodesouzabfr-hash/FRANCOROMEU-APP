# Franco Romeu · Fase 9.5 — Proteção distribuída de ingresso CRM
**Data:** 17/10/2026. **Branch de tarefa:** `feature/fr-growth-phase95-distributed-dedup-2026-10-17`. **Base:** `9fc50284c59564ce58c149a7ac8d2e06713a13e5`.

## Problema identificado
A Fase 9.4 utilizava leitura no Notion seguida de gravação, combinada a um `Map` na memória de uma única função. Diferentes instâncias serverless podiam consultar a ausência de uma mesma referência ao mesmo tempo e criar oportunidades duplicadas. A duplicidade também podia ocorrer após um timeout se a gravação tivesse sido aceita pelo Notion sem confirmação da resposta.

## Implementação F9.5
- `src/fr-crm-dedup-gate.cjs`: reserva distribuída atomicamente no Redis REST usando `EVAL` por identificador UUID v4 de atendimento. Só a instância que recebeu o lock executa a consulta/gravação Notion; a outra recebe resposta transitória para reenvio.
- Lease de 120 segundos, sem liberação antecipada em caso de falha ou retorno incerto do Notion; isso protege contra reenvio prematuro após timeout.
- Após operação confirmada (nova criação ou referência existente), a instância que ainda detém o lease grava marcador `done` com TTL 30 dias. Retentativas com o mesmo identificador e corpo são respondidas sem nova gravação; corpo alterado sob o mesmo identificador é rejeitado.
- Hash do conteúdo é **HMAC-SHA256** com segredo do backend, e não hash simples. Chaves Redis têm somente identificador aleatório e estado; nunca nome, telefone, e-mail, mensagem, escopo, orçamento ou notas.
- Saídas públicas restritas a `received`, `already_received`, `retry_later`, `conflict`, `not_available` sem campos pessoais.
- Bloqueia ativação de `POST /api/fr-crm-intake` se `FR_CRM_REDIS_REST_URL` e `FR_CRM_REDIS_REST_TOKEN` não estiverem presentes e válidos, mesmo que todas as variáveis antigas estejam configuradas.
- Sem inclusão de dependências NPM no frontend ou novas seções da SPA. A consulta privada `GET /api/fr-crm-due` permanece independente e desativada.

## Pré-requisitos de operação real
1. Criar conta ou selecionar instância **Redis REST privada no Upstash**, sem habilitar ingestão enquanto não existir instância operacional. Usar URL `https://<instância>.upstash.io` e token padrão com permissão de escrita, guardado exclusivamente nas variáveis de ambiente Vercel.
2. No Notion, criar integração restrita ao CRM e conceder acesso ao data source já estabelecido; configurar `FR_CRM_NOTION_TOKEN` e `FR_CRM_NOTION_DATA_SOURCE_ID`.
3. Configurar segredo forte, diferente dos tokens dos fornecedores, em `FR_CRM_INGEST_SECRET`; não transmiti-lo em links, código-fonte, logs ou conversas.
4. Configurar as duas variáveis Redis `FR_CRM_REDIS_REST_URL` e `FR_CRM_REDIS_REST_TOKEN` na Vercel **sem valores de exemplo**.
5. Manter `FR_CRM_INGEST_ENABLED=false` até haver origem confiável do atendimento, assinatura ou autenticação do provedor, limitação central de requisições, protocolo operacional de base legal/retificação/revogação, política de retenção e teste com dados sintéticos em ambiente isolado.
6. Verificar criação, repetição idêntica, repetição divergente, falha Notion, perda Redis e chamadas concorrentes em instâncias reais antes de mudar o flag. Logs devem conter somente contadores, status e IDs opacos quando estritamente necessários.
7. **Nunca** colocar tokens Upstash ou Notion em HTML, scripts `assets/js`, analytics, links externos, recibos ou eventos GA4.

## Protocolo HTTP
`POST /api/fr-crm-intake`:
- 404 `not_available`: não configurado ou desligado;
- 201 `received`: criação Notion confirmada e marcador Redis confirmado;
- 200 `already_received`: marcador Redis ou Notion confirmou operação anterior;
- 409 `conflict`: mesmo identificador com conteúdo diferente enquanto o marcador existir;
- 503 `retry_later`: outro processamento concorrente, Redis indisponível, Notion incerto ou lease perdido. Seguir cabeçalho `Retry-After` e **reutilizar o mesmo eventId**.

`GET /api/fr-crm-due`: mantém o contrato F9.4, sem mensagens enviadas e sem informar contatos individualmente.

## Limitações e riscos residuais
- **Não é uma transação ACID entre Redis e Notion**. A abordagem reduz colisões concorrentes com lock atômico; não garante exatamente-uma-vez após expiração do lease, perda de estado Redis, retenção de 30 dias ou inconsistência de leitura do Notion.
- Se o Notion confirmar criação mas a gravação do marcador Redis falhar, o backend responde `retry_later`; após o lease expirar, nova tentativa consulta novamente o Notion, usando a mesma referência. Se o Notion ainda não estiver consistente, o risco de duplicidade persiste.
- A exclusividade estrita exige um banco com índice `UNIQUE` e controle transacional/outbox, mais reconciliação com o Notion. Esse é um portão para ativação em escala e integrações autônomas; não declarar solução definitiva de exactly-once.
- Cliente enviando dois pedidos diferentes, com UUIDs distintos, não é detectado como duplicado: a triagem humana permanece necessária.
- Falha da dependência Redis significa **não receber** novos registros automaticamente. O atendimento direto por WhatsApp e a inclusão manual no CRM permanecem disponíveis.
- O endpoint não autoriza captação anônima do site; a autenticação servidor-servidor F9.4 continua obrigatória e nenhum terceiro está conectado como remetente.

## Evidências de qualidade e rollback
- `node --test tests/fr-crm-phase94.test.cjs tests/fr-crm-phase95-dedup.test.cjs` testa contrato Notion e lock Redis em memória (não é teste real dos provedores).
- `npm test`, build Vercel, verificações de sitemap, catálogo e idempotência do site devem passar no PR e após o merge.
- Em produção, antes de habilitar, `GET /api/fr-crm-intake` e `GET /api/fr-crm-due` retornam 404; orçamento público continua HTTP 200.
- Para rollback, desabilitar flags antes de qualquer reversão; reverter PR preservando banco e histórico, sem excluir dados do CRM. Segredos do projeto precisam ser revogados separadamente se houver comprometimento.

**Situação desta fase:** controle distribuído implementado e validado por testes simulados, porém dependências externas de Redis/Notion e integrador confiável **não provisionados**. Não confundir deploy técnico com ativação do pipeline.
