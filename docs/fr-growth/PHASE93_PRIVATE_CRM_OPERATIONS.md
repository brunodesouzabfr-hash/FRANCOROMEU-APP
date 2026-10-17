# Franco Romeu — Fase 9.3 | CRM comercial e gestão segura de oportunidades

**Implementado em 17/10/2026.** Origem da branch: `main` SHA `8a7f02eba1833660f2d76ed4515a4fc2f5c3ccc3`.

## Recursos efetivamente criados
CRM **ꟻR — CRM Comercial Privado**, banco Notion privado na conta conectada. Painel: https://app.notion.com/p/dde16006c3ef471aa2b27bad277b21ce. O banco foi criado com estrutura de oportunidades; **não contém clientes importados, leads fictícios ou automações externas ativas**. Identificadores internos do espaço não são embutidos no site ou scripts públicos.

Colunas nativas do CRM: oportunidade, ID sequencial, etapa, origem, serviços, responsável, prioridade, próxima ação, prazo da ação, último contato, cidade, nome, telefone, e-mail, situação de consentimento, evidência/origem do consentimento, valor de proposta em BRL, data de aprovação, motivo de perda, notas internas e datas de criação/alteração.

Os nove estados são: Novo → Triagem → Qualificação → Visita técnica (quando aplicável) → Proposta enviada → Negociação → Aprovado / Perdido → Pós-obra. A aprovação não é presumida após o simples clique no WhatsApp. O campo de consentimento registra `Não informado`, `Registrado` ou `Revogado`; a base legal para cada tratamento deve ser determinada pela operação, não inferida automaticamente de uma checkbox ou clique.

## Contrato operacional versionado
- `config/fr-crm-pipeline.json`: estágios, transições autorizadas, eventos de atenção e os dois desabilitadores `public_intake_enabled=false` e `automated_sending_enabled=false`.
- `src/fr-crm-workflow.cjs`: regras puras de validação do registro, consistência das etapas e detecção de ações vencidas; **não integra o CRM Notion por API, não armazena dados, não envia mensagens, não lê cookies ou localStorage**.
- `tests/fr-crm-phase93.test.cjs`: proíbe coleta pública, transição não autorizada, alteração indevida do fluxo, notificações autônomas e dependência pública do contrato de CRM.

## Rotina de operação, inicialmente manual
1. **Primeiro contato:** atendimento verifica se o contato é efetivo e qual canal o originou. Registrar somente os dados adequados ao atendimento, sem copiar toda a conversa pessoal.
2. **Novo / Triagem:** descrever interesse, classificar serviço/cidade, definir responsável e próxima ação, registrar eventual solicitação de não contato.
3. **Qualificação:** delimitar ambiente, natureza do trabalho, urgência e dados mínimos para o levantamento. Não registrar dados sensíveis sem necessidade.
4. **Visita / Projeto:** conferir se a visita técnica foi solicitada/aceita e organizar dados no canal restrito.
5. **Proposta enviada:** anotar data do último contato, escopo formalizado, valor da proposta quando houver e próxima data de retorno.
6. **Negociação / Decisão:** registrar dúvidas e revisões. Aprovado exige confirmação material e data; Perdido exige motivo e interrupção de insistência comercial.
7. **Pós-obra:** acompanhar conclusão e eventuais retornos, observando a base jurídica e o prazo de retenção aplicável.

Não contabilizar em GA4 `generate_lead`, valor financeiro ou contratação a partir de cliques ou de aberturas do WhatsApp. O evento de `fr_contact_click` da Fase 9.1 continua medindo **somente intenção** e não recebe valores de CRM, identificadores, telefones, nomes ou mensagens.

## Privacidade e segurança
- Site público: **nenhum endpoint de CRM ou formulário de coleta novo**. A `main` mantém o formulário/orçamento atual.
- O conteúdo do CRM deve permanecer privado e com acesso apenas dos responsáveis comerciais. Confirmar manualmente permissões dos usuários Notion antes de inserir clientes.
- Nunca escrever nome, telefone, e-mail, endereço residencial ou conversa em Git, GitHub Actions, console do navegador, query string de métricas ou GA4.
- Solicitações de acesso, retificação, oposição e eliminação devem ser encaminhadas ao responsável definido pela operação; não prometer exclusão automática sem mecanismo real.
- Definir e registrar política de retenção, resposta a incidentes, minimização e base legal antes do uso real em produção.
- Registros com consentimento revogado exigem bloqueio de **mensagens promocionais automáticas** e revisão de retenção; isso não significa necessariamente apagar dados sujeitos a obrigações legais.
- Nenhuma API Key Notion, credencial ou token é publicada no repositório ou código frontend.

## Pendências de integração que exigem configuração controlada
1. Criar um serviço de integração com credenciais secretas restritas no backend, autenticação e controle de acesso, observabilidade sem PII, controles contra spam, rate limiting e registro auditável. O projeto Vercel não possuía variáveis de ambiente configuradas para CRM na verificação desta fase.
2. Definir e publicar aviso de privacidade, base legal aplicável ao tratamento e retenção; obter revisão jurídica/operacional adequada.
3. Implantar mecanismo auditável de confirmação de chegada do contato: êxito do backend, e não clique ou PDF gerado.
4. Criar notificações e tarefas futuras privadas a partir de `Prazo próxima ação`, após permissões e preferências dos responsáveis estarem definidas.
5. Testar com dados sintéticos, revisar permissões, segredos e rollback antes de habilitar captura pública.

**Critério de sucesso desta subfase:** existe um CRM privado utilizável para cadastro manual e um fluxo de estágios versionado, protegido contra coleta automática prematura. **Não** significa integração automática, entregabilidade de mensagens, dashboards comerciais com dados reais ou verificação jurídica completa.

## Rollback
O módulo não é carregado pelo browser nem copiado para a pasta pública `dist`; remover os arquivos de configuração e testes por reversão do PR preserva orçamento, navegação, intro, conteúdo, SEO e analytics. O banco Notion é um recurso externo independente e não deve ser apagado ao reverter commits; qualquer exclusão deverá ser solicitada separadamente com conferência de dados.
