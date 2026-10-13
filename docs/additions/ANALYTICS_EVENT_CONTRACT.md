# Medição — contrato não ativado

`index.html` já contém `gtag` com `G-22Z85RCGQC`. Sua propriedade não foi confirmada nesta execução; não se adicionou GTM nem uma segunda configuração GA4. O envio real de eventos permanece bloqueado até confirmar conta e consentimento aplicável.

Eventos previstos em uma única camada: `view_service`, `view_project`, `view_environment`, `view_material`, `project_3d_open`, `before_after_interaction`, `social_archive_open`, `social_embed_open`, `budget_start`, `budget_add_service`, `budget_remove_service`, `budget_complete`, `pdf_generate`, `whatsapp_click`, `instagram_click`, `google_profile_click`, `google_review_click`. Emitir apenas após ação real e sem nome, telefone, endereço, texto livre ou URL com dados sensíveis. Uma transição SPA deve produzir uma visualização, não gtag mais GTM em paralelo.

Próxima decisão: confirmar se `G-22Z85RCGQC` é a propriedade FR e escolher instalação direta ou container. Depois testar no modo de depuração com consentimento aceito/recusado e rede indisponível; o orçamento deve funcionar em todos os casos.
