# Franco Romeu — Fase 9.4 · Integração privada CRM / Notion e acompanhamento
**Data:** 17/10/2026. **Base:** main `63e64a5f5e865b5e444170c087a76eec99be39f6`. **Estado:** implementação do backend publicada apenas depois dos gates; ativação de ingresso real bloqueada na ausência de credenciais.

## Elementos executados
- O CRM Notion privado criado em 9.3 recebeu as propriedades **Referência de integração** (`rich_text`) e **Base do atendimento** (select: Solicitação do titular / Consentimento específico / Outra base validada).
- Visões nativas do Notion: **Pipeline comercial** (board agrupado por Etapa), **Agenda de retornos** (calendário por Prazo próxima ação) e **Ações e acompanhamento** (tabela por prazo com filtros interativos).
- Receptor **`POST /api/fr-crm-intake`** implementado em `src/fr-crm-secure-ingest.cjs`; valida origem, UUID v4 de evento, serviço, contato, cidade, base do atendimento e prova curta. Armazena somente campos mínimos no Notion autorizado e define etapa `Novo` e próxima ação de triagem manual.
- Consulta **`GET /api/fr-crm-due`** em `src/fr-crm-private-followups.cjs`; sumariza contagens de atividades com prazo vencido/até hoje, por etapa, sem expor nomes, telefones, e-mails, notas ou identificadores. Data local de São Paulo, sem criar notificação nem enviar mensagem.
- Compatibilidade confirmada com **Notion API versão `2025-09-03`**: `POST /v1/data_sources/{id}/query` e `POST /v1/pages` com `parent.type=data_source_id`.
- Gate de autenticação por token privado de alta entropia e comparação temporal constante; aceita somente chamada servidor-servidor (bloqueio de Origin/sec-fetch-site), sem CORS. Política `Cache-Control: private, no-store`.
- **Nenhuma** nova entrada no frontend, no JS público ou no Analytics. O formulário de orçamento de 115 serviços, navbar F7 e intro V05 permanecem intactos.

## Variáveis privadas e dependências de habilitação
Todas precisam estar no ambiente Vercel de produção, fora do repositório, e o sistema deve ser liberado só após inspeção do acesso ao CRM:

| Variável | Uso |
|---|---|
| `FR_CRM_INGEST_ENABLED` | Padrão ausente/false; tornar `true` apenas após teste operacional |
| `FR_CRM_DUE_ENABLED` | Padrão ausente/false; habilita consulta privada agregada |
| `FR_CRM_INGEST_SECRET` | Token randômico de pelo menos 32 caracteres para header `x-fr-crm-token`, mantido somente entre servidores autorizados |
| `FR_CRM_NOTION_TOKEN` | Segredo de integração interna criada em `https://www.notion.so/profile/integrations`; compartilhar o banco CRM **apenas** com essa integração de escopo mínimo |
| `FR_CRM_NOTION_DATA_SOURCE_ID` | Identificador do data source do CRM Notion, informado pela conexão responsável, mantido apenas no servidor |

**Não criar uma chave fictícia e não copiar token do Notion para ChatGPT, GitHub, HTML ou planilhas públicas.** Antes de habilitar, confirmar configurações de acesso no Notion, limites da Vercel, LGPD, prazos de retenção e rotas de operação.

## Contrato do receptor privado
`POST /api/fr-crm-intake`, com `Content-Type: application/json` e `x-fr-crm-token` de uma fonte de confiança; corpo com tamanho máximo de 4 KiB:

```json
{
  "eventId": "549b1d82-0474-42ac-a337-55ab0e1a88d6",
  "source": "WhatsApp",
  "service": "Marcenaria",
  "city": "São Paulo",
  "contactName": "EXEMPLO SINTÉTICO — NÃO USAR EM PRODUÇÃO",
  "phone": "+5511999999999",
  "basis": "Solicitação do titular",
  "evidence": "Pedido de atendimento registrado pelo operador"
}
```

O evento de entrada precisa ser comprovadamente recebido, e não inferido de clique `wa.me` ou PDF do orçamento. Somente um integrador backend autorizado pode enviar esse registro. Não adicionar `message`, endereço residencial, valor de proposta, observações detalhadas, cookies, URL de referência ou identificadores do Analytics. Para `basis = Consentimento específico`, exigir `consentRecordedAt` em ISO UTC e evidência curta; a base legal deve ser validada operacionalmente por quem recebeu a solicitação. O campo `Revogado` é gerido no CRM, não importado como novo pedido com consentimento implícito.

Respostas genéricas:
- `404 not_available` quando desabilitado ou mal configurado, sem chamada à API do Notion;
- `401 unauthorized` quando a autenticação falha;
- `403 not_available` para chamada de navegador;
- `400 invalid_payload` para campo extra ou inválido;
- `201 received` se Notion confirmou nova criação;
- `200 already_received` em repetição do mesmo UUID encontrada no banco;
- `503 retry_later` quando Notion não confirmou o resultado; no caso de timeout após escrita, o reenvio deve usar **o mesmo eventId**.

**Limitação material:** a verificação de `Referência de integração` no Notion evita duplicidade em tentativas sequenciais e o processo agrupa chamadas simultâneas na mesma instância. Não há transação única nem índice de unicidade entre instâncias serverless: duas requisições simultâneas executadas em instâncias distintas **podem** duplicar registro. Para garantia exatamente-uma-vez, adicionar uma base transacional com constraint UNIQUE e fila antes de ativar integração com alto volume. A identidade de evento **não** detecta quando o mesmo cliente envia pedidos novos distintos: isso exige triagem humana.

## Contrato de pendências
`GET /api/fr-crm-due` exige mesmo header servidor-servidor e configuração separada `FR_CRM_DUE_ENABLED=true`. Responde só `asOf`, número de oportunidades com prazo até hoje, contagem sem responsável, contagem de consentimento revogado e contagens por etapa. Consulta somente fases não terminais, pagina até 1.000 resultados e **falha** se o limite for excedido (não exibe totais parciais). Não envia WhatsApp, e-mail, push ou alertas automáticos.

## Segurança e liberação da operação
1. Criar uma integração Notion no workspace com acesso restrito ao CRM, gerar segredo nela; nunca usar credenciais pessoais em código.
2. Registrar os valores no **Vercel Settings → Environment Variables → Production**; preferir segredos protegidos e ambientes separados. Manter os dois flags desligados até validar tudo.
3. Usar `node --test tests/fr-crm-phase94.test.cjs tests/fr-crm-phase94-due.test.cjs`, `npm test`, build, regressões e GitHub Quality Gate. Testes usam somente informações sintéticas e `fetch` simulado.
4. Fazer teste de contrato com dados sintéticos apenas em ambiente seguro e descartar os registros de QA segundo política de retenção antes de ativar fluxo real.
5. Antes da liberação pública, adicionar integrador de origem confiável e controle de ingresso upstream (assinatura/verificação do provedor, rate limiting central/WAF, chave única transacional, política de consentimento e LGPD).
6. Implementar notificações agendadas **somente depois** de definir responsáveis, cadência e canal privado. A API de pendências não prova que qualquer notificação esteja ativa.

## Critérios para acompanhamento
- Medir **oportunidade registrada no CRM** pela criação confirmada no Notion, não cliques.
- Follow-up válido tem responsável definido e prazo; `novo` pode inicialmente estar sem responsável, destacando pendência.
- Contrato comercial aprovado exige registro de aprovação documental; não marcar `generate_lead` ou `purchase` no GA4 sem confirmação.
- Zero segredos no HTML, no JSON-LD, em repositório ou no relatório do GitHub.
- A integração está **provisionada no código, mas não operacional** enquanto os segredos e a habilitação não forem configurados.

## Rollback
Reverter PR e manter desligados `FR_CRM_INGEST_ENABLED` e `FR_CRM_DUE_ENABLED`. Não apagar banco Notion ou dados comerciais em rollback de código. Voltar a usar entrada manual no CRM.
