# Checklist de Publicação — FRANCOROMEU-APP

Use este documento antes de disponibilizar site, HTML público, APK ou release. Marque **N/A com justificativa** quando um item realmente não se aplicar. A aprovação de um bloco não substitui os demais.

## 1. Controle de versão e autorização

- [ ] A entrega parte da branch oficialmente aprovada; não usa `codex/etapa-15-sites-individuais`.
- [ ] Existe PR específico, com escopo, risco, testes e rollback documentados.
- [ ] O PR não contém arquivo alheio à entrega.
- [ ] `CHANGELOG.md` registra a mudança de comportamento.
- [ ] Número da versão foi definido sem sobrescrever tag existente.
- [ ] Responsável autorizou a publicação e, separadamente, o merge quando aplicável.
- [ ] Existe ponto de restauração conhecido (commit/tag anterior).

## 2. Qualidade automatizada

- [ ] Workflow `FR Quality Gate` concluiu com sucesso no commit exato da entrega.
- [ ] `npm test` passou.
- [ ] `npm run check:html` passou.
- [ ] Permanecem 115 serviços, 15 categorias, 7 cupons e seis views, salvo migração autorizada.
- [ ] `FRBudgetCore`, núcleo incorporado, `window.__frCore` e integrações críticas permanecem coerentes.
- [ ] Nenhum teste foi removido, ignorado ou enfraquecido apenas para liberar o CI.

## 3. Calculadora, IQE e dados

- [ ] Serviço manual e recomendação do IQE produzem o mesmo cálculo quando as entradas são equivalentes.
- [ ] Configurações obrigatórias impedem avanço incompleto.
- [ ] `serviceId`, `quantidade`, `configs` e compatibilidade legada foram preservados.
- [ ] Orçamento é recuperado após recarga.
- [ ] Cupom, pagamento, markup, arredondamento e visita técnica foram testados nas fronteiras.
- [ ] Entrada inválida não produz `NaN`, total negativo ou estado irrecuperável.
- [ ] Estimativa mantém premissas, limites e indicação de que não é preço fechado.

## 4. Navegação, responsividade e acessibilidade

- [ ] As seis views abrem por navegação normal, link interno e retorno à Home.
- [ ] Teste real em `390x844` sem overflow, texto cortado ou controle inacessível.
- [ ] Teste desktop em Chrome e Firefox atuais.
- [ ] Teste em celular físico ou pendência explicitamente registrada.
- [ ] Alvos de toque têm pelo menos 44 px; botões circulares não ficaram ovais.
- [ ] Teclado, ordem de foco, foco visível, Escape e retorno de foco funcionam.
- [ ] Modais travam o fundo e restauram o scroll ao fechar.
- [ ] Zoom, contraste, rótulos e textos alternativos foram revisados.
- [ ] `prefers-reduced-motion` reduz movimento sem eliminar informação.
- [ ] Console não apresenta erro durante o fluxo principal.

## 5. PDF, rede e estados de falha

- [ ] PDFs curto e longo foram gerados e revisados página a página.
- [ ] Textos, valores, quebras, rodapé e identificação da estimativa estão legíveis.
- [ ] CEP válido, inválido, timeout e preenchimento manual foram testados.
- [ ] Fontes, ícones, imagens e PDF degradam de forma compreensível quando CDNs falham.
- [ ] Estados vazio, carregando, sucesso, erro e nova tentativa existem onde necessário.
- [ ] Links externos usam destino correto e proteção apropriada.

## 6. Segurança, privacidade e administração

- [ ] Nenhum token, senha, chave, `.env`, assinatura Android ou credencial entrou no repositório/artefato.
- [ ] Nenhum dado real de cliente aparece em HTML, captura, log, teste ou PDF de demonstração.
- [ ] God Mode não está acessível como painel administrativo público e não é descrito como autenticação.
- [ ] Fórmula ou valor comercial sensível que exija proteção não depende somente de segredo no cliente.
- [ ] Formulários coletam apenas dados necessários e informam finalidade/consentimento aplicáveis.
- [ ] Política de privacidade, termos e canal de contato correspondem à operação real.
- [ ] Dependências e serviços externos usados na produção são conhecidos e necessários.

## 7. Marca, autoria e verdade comercial

- [ ] Logo oficial foi aplicado sem redesenho, distorção, espelhamento, ovalização, corte ou recoloração indevida.
- [ ] Paleta, tipografia, respiro e contraste seguem o sistema FR.
- [ ] A interface continua reconhecível como Franco Romeu sem depender apenas do logo.
- [ ] Nenhuma obra, cliente, avaliação, prêmio, certificação, métrica, CNPJ, garantia ou prazo foi inventado.
- [ ] Render está identificado como render.
- [ ] Imagem de terceiro está licenciada/autorizada e identificada como referência, não como obra FR.
- [ ] Antes/depois usa contexto e enquadramento honestos.
- [ ] Copy evita promessa absoluta, falsa urgência e linguagem barateadora.
- [ ] Telefone, e-mail, redes e áreas atendidas foram confirmados antes da publicação.

## 8. Desempenho e ativos

- [ ] Imagens têm dimensões, compressão e formato adequados; conteúdo essencial não usa arquivo excessivo.
- [ ] Não há script, estilo, fonte ou biblioteca duplicada.
- [ ] Carregamento inicial, interação e estabilidade visual foram medidos em dispositivo compatível com o público.
- [ ] Motion não mantém processamento contínuo fora de tela.
- [ ] Recursos de terceiros possuem fallback e não bloqueiam cálculo/navegação essenciais.
- [ ] Cache/versionamento não deixa cliente preso em HTML ou ativo antigo.

## 9. Site, domínio e SEO (quando aplicável)

- [ ] Existe `index.html` de produção no destino correto; a publicação não aponta por engano para arquivo interno.
- [ ] HTTPS e domínio oficial funcionam com e sem `www`, conforme a decisão adotada.
- [ ] Título, descrição, favicon, canonical e Open Graph foram conferidos no URL final.
- [ ] Compartilhamento no WhatsApp usa imagem e texto corretos.
- [ ] `robots.txt` e `sitemap.xml` usam o domínio final e não bloqueiam páginas necessárias.
- [ ] Search Console e Perfil da Empresa usam dados reais e consistentes.
- [ ] Dados estruturados `LocalBusiness` contêm somente informações verificadas.
- [ ] Página 404 e redirecionamentos principais funcionam.

## 10. APK/Android (quando aplicável)

- [ ] O APK usa exatamente a versão HTML aprovada e não uma cópia antiga.
- [ ] ID do aplicativo, versão, ícone e nome foram confirmados.
- [ ] WebView, voltar, links externos, upload/download, teclado e rotação foram testados.
- [ ] Permissões Android são mínimas e justificadas.
- [ ] Assinatura foi feita fora do repositório; chave e senha têm backup seguro.
- [ ] APK/AAB de release foi instalado em aparelho físico e passou pelo fluxo completo.

## 11. Entrega, release e rollback

- [ ] Commit final do artefato é o mesmo aprovado no PR.
- [ ] Release possui resumo, limitações, instrução de instalação/uso e arquivos corretos.
- [ ] Checksums dos artefatos distribuídos foram registrados quando aplicável.
- [ ] Tag aponta para o commit aprovado.
- [ ] URL pública foi testada após deploy sem depender do cache do desenvolvedor.
- [ ] Procedimento de rollback foi testado ou é executável com o ponto de restauração registrado.
- [ ] Monitoramento inicial verificou erro de console, navegação, cálculo, PDF e contatos.

## Registro de aprovação

- Versão:
- Commit:
- PR:
- Data/hora:
- Ambiente publicado:
- Responsável pelo aceite:
- Pendências aceitas e prazo:
- Ponto de rollback:
