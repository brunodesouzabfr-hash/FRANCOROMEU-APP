# Plano de Search Control Engineering — Franco Romeu

**Versão:** 1.0 · **Base canônica:** `https://francoromeu.com.br` · **Praça:** Grande São Paulo

> Nota de governança: o arquivo `FRANCO_ROMEU_MENTE_ESTRATEGICA_LLM_MASTER_v1.1.md` citado no briefing não está presente neste repositório. A revisão editorial aplicou as diretrizes fornecidas no próprio briefing: arte + engenharia, matéria, estrutura, precisão, autoria, prova antes de promessa e ausência de escassez ou avaliações inventadas. Antes da publicação, confirme endereço, e-mail, meios de pagamento, cidades atendidas e URLs sociais.

## A. Diagnóstico técnico (estado anterior, 462 palavras)

A SPA já apresentava seis views, HTML semântico em partes, conteúdo visual amplo, imagens responsivas e lazy loading em grande parte do acervo. Também possuía identidade forte, estimador com ressalvas responsáveis e navegação acessível por teclado em vários componentes. Esses ativos favorecem experiência, tempo de permanência e conversão.

O `<head>`, porém, usava um título de versão interna, sem descrição, canonical, robots, Open Graph, Twitter Cards ou dados estruturados. Isso enfraquecia relevância para “reformas em SP”, entendimento da entidade e compartilhamento social. A marca não estava conectada a serviços, área atendida, telefone, horários ou FAQ. A ausência de URLs reais por view impedia links profundos confiáveis: controles principais eram botões com `onclick`, portanto rastreadores não recebiam destinos navegáveis. O sitemap e o robots também não existiam.

A hierarquia visual é rica, mas cada view usa títulos próprios e componentes gerados por JavaScript. O conteúdo inicial contém as views, o que é melhor do que uma casca vazia, porém apenas uma view fica visível. Headings e textos alternativos estavam inconsistentes: logo e hero tinham `alt` vazio; algumas imagens dinâmicas tinham descrições genéricas (“Projeto FR”). Imagens de referência são corretamente sinalizadas no produto, evitando apresentar banco de imagens como obra executada.

A maior lacuna era a falta de clusters de intenção comercial e local: reforma residencial, porcelanato líquido, pintura residencial, projetos 3D e marcenaria sob medida precisavam de associação explícita a São Paulo. Conteúdo editorial sobre processo, preparação de base, prazo e materiais também era insuficiente para capturar buscas informacionais. Como uma SPA depende de execução JavaScript para troca de metadados, compartilhadores e alguns robôs ainda podem enxergar somente o head da Home.

Prioridades: (1) consolidar entidade e NAP verificado; (2) publicar metadados e JSON-LD sem avaliações fictícias; (3) trocar a navegação principal por links e habilitar rotas com rewrite; (4) enviar sitemap ao Search Console; (5) criar páginas pré-renderizadas ou migrar gradualmente para SSG para cada intenção; (6) trocar referências por fotos próprias com localização, contexto e autorização; (7) construir citações, avaliações e backlinks locais. O código agora cobre os quatro primeiros fundamentos, mas indexação independente robusta exige que cada rota entregue HTML e head próprios no servidor, não apenas metadados alterados no navegador.

## B–E. Implementação on-page e dados estruturados

- O head principal contém title, description, robots, canonical, OG e Twitter Card, mantendo a imagem oficial solicitada.
- O JSON-LD usa `@graph`: `LocalBusiness` + `GeneralContractor`, `WebSite/SearchAction`, `BreadcrumbList`, `ItemList`, cinco FAQs e 16 nós combinados `Service`/`Product` com IDs reais do catálogo.
- **Não foi criado `aggregateRating`**: Schema e políticas do Google exigem avaliações reais e verificáveis. Inserir placeholder ou nota fabricada seria dado enganoso. Adicione somente depois de reunir fonte, contagem e média auditáveis.
- O endereço foi limitado a cidade/UF/país porque logradouro e CEP não foram fornecidos. Não inventar NAP é mais importante do que completar campos. Confirme também `contato@francoromeu.com.br` e os meios de pagamento antes do deploy.
- Logo e hero receberam textos alternativos descritivos. Próxima auditoria: revisar imagens geradas em runtime, usando descrição objetiva do conteúdo, sem repetir palavras-chave artificialmente.
- Navbar e rodapé agora expõem `<a href>`; o roteador intercepta clique, usa `pushState`, reage a `popstate` e atualiza title, description, canonical e breadcrumb visual. O `vercel.json` devolve `index.html` nas rotas profundas.
- `robots.txt` libera rastreamento e referencia o sitemap. O sitemap lista somente URLs HTTP amigáveis; fragmentos `#` não são páginas separadas para indexação.

## F. Pauta editorial: 10 artigos

Para todos: **Introdução** com problema real e contexto de SP; **desenvolvimento** com diagnóstico, critérios, etapas, riscos e checklist; **conclusão** resumindo decisões; **CTA**: “Envie fotos e medidas para estruturarmos o escopo. A proposta final depende de visita técnica.”

| # | Título | 3 palavras-chave primárias | 5 palavras-chave secundárias |
|---|---|---|---|
| 1 | Reforma residencial em São Paulo: como planejar escopo, prazo e orçamento | reforma residencial SP; empresa de reformas SP; orçamento de reforma | checklist reforma apartamento; quanto custa reformar em SP; etapas de uma reforma; visita técnica reforma; planejamento de obra residencial |
| 2 | Porcelanato líquido ou porcelanato tradicional: qual escolher? | porcelanato líquido; porcelanato tradicional; piso para reforma | porcelanato líquido vale a pena; piso sem rejunte SP; diferença piso epóxi porcelanato; preparo da base; manutenção do porcelanato líquido |
| 3 | Porcelanato líquido em apartamento: base, umidade e tempo de cura | porcelanato líquido SP; piso epóxi residencial; aplicação de resina | porcelanato líquido apartamento; teste de umidade piso; regularização de contrapiso; tempo de cura resina; piso monolítico residencial |
| 4 | Pintura residencial com textura: técnicas, preparação e durabilidade | pintura residencial SP; pintura com textura; pintor em São Paulo | preparação de parede; textura cimento queimado; corrigir infiltração antes de pintar; acabamento de pintura premium; preço pintura apartamento |
| 5 | Como evitar retrabalho na pintura de um imóvel | reforma e pintura; preparação de parede; pintura de apartamento | selador ou fundo preparador; massa corrida correta; umidade na parede; sequência de pintura; inspeção de acabamento |
| 6 | Projeto 3D para reforma: decisões que você deve validar antes da obra | projeto 3D reforma; projeto de interiores SP; render de interiores | visualizar reforma antes; layout de apartamento; iluminação no projeto 3D; compatibilização de projeto; reduzir retrabalho na obra |
| 7 | Do 3D à execução: como compatibilizar estética, matéria e custo | projeto executivo interiores; reforma planejada; engenharia de custo | especificação de materiais; projeto e orçamento reforma; paginação de piso; marcenaria no projeto; cronograma de execução |
| 8 | Marcenaria sob medida: 12 decisões antes de aprovar o projeto | marcenaria sob medida SP; móveis planejados; projeto de marcenaria | MDF para cozinha; ferragens para armário; medidas de marcenaria; iluminação em móveis; orçamento marcenaria planejada |
| 9 | Cozinha planejada: fluxo, ergonomia, hidráulica e marcenaria | reforma de cozinha SP; cozinha planejada; marcenaria de cozinha | triângulo de trabalho cozinha; altura bancada cozinha; pontos hidráulicos cozinha; tomada para eletrodomésticos; iluminação bancada |
| 10 | Reforma de apartamento ocupado: fases, proteção e comunicação | reforma de apartamento SP; obra em apartamento; gestão de reforma | reforma sem sair de casa; proteção de móveis na obra; regras de condomínio reforma; barulho e horários obra; cronograma por ambientes |

## G. Google Business Profile (GBP)

### Configuração passo a passo

1. Reivindique e verifique o perfil com o mesmo nome público: **Franco Romeu — Arte & Engenharia**. Não acrescente palavras-chave ao nome se não fizerem parte da marca real.
2. Categoria principal sugerida: **Empresa de reformas**. Secundárias, somente se disponíveis e verdadeiras: **Designer de interiores**, **Pintor**, **Marceneiro**, **Serviço de instalação de pisos** e **Empreiteira**.
3. Configure como empresa de área de serviço se clientes não forem atendidos no endereço. Oculte endereço residencial; selecione cidades efetivamente atendidas.
4. Padronize telefone `+55 11 99002-1603`, site, horário seg–sex 08:00–18:00 e WhatsApp. Adicione fotos próprias, equipe, processo e antes/depois com autorização.
5. Cadastre serviços, publique semanalmente, responda mensagens em horário declarado e solicite avaliações após entregas. Nunca ofereça recompensa nem condicione atendimento à nota.

### Serviços para copiar

- **Reforma Residencial Completa:** Planejamento e execução de reformas em São Paulo, com escopo claro, compatibilização técnica, acabamento preciso e visita técnica.
- **Instalação de Porcelanato Líquido:** Preparação da base e aplicação de porcelanato líquido em SP, com nivelamento, acabamento contínuo e orientação de cura e manutenção.
- **Pintura Residencial:** Preparação, correções e pintura residencial em São Paulo, com especificação do sistema e controle responsável do acabamento.
- **Projetos 3D:** Projeto 3D de interiores para visualizar layout, matéria, iluminação e marcenaria antes da reforma e reduzir retrabalho.
- **Marcenaria sob Medida:** Projeto e instalação de marcenaria sob medida para cozinhas, salas e quartos, alinhando estética, uso e precisão.

### Q&A para o proprietário publicar

1. **Vocês fazem orçamento de reforma residencial em São Paulo?** Sim. Recebemos fotos, medidas e objetivos para estruturar uma estimativa inicial. Quando necessário, fazemos visita técnica para validar base, acesso, materiais e interferências antes da proposta.
2. **A Franco Romeu aplica porcelanato líquido em apartamento?** Sim, após avaliar contrapiso, umidade, nivelamento, circulação e regras do condomínio. A durabilidade começa na base; por isso, indicamos preparação e cura adequadas ao ambiente.
3. **É possível visualizar a reforma antes de começar?** Sim. O projeto 3D antecipa layout, iluminação, acabamentos e marcenaria. Ele transforma decisões abstratas em uma referência visual e técnica para reduzir dúvidas na execução.

### Rotina e atributos

- Segunda: antes/depois próprio; quarta: dica técnica; sexta: bastidor ou vídeo curto; mensal: caso completo com desafio, decisão e resultado.
- Marque apenas atributos oferecidos e comprováveis: orçamento on-line, atendimento no local, agendamento, formas de pagamento e acessibilidade real.
- UTM do site no GBP: `?utm_source=google&utm_medium=organic&utm_campaign=gbp`.

## H. Instagram

### Bio

**Reformas e interiores em São Paulo**  
Arte aplicada · precisão na execução  
Porcelanato | Pintura | 3D | Marcenaria  
**Estruture seu projeto ↓**

Link: `https://wa.me/5511990021603?text=Olá%2C%20vim%20do%20Instagram%20e%20quero%20estruturar%20meu%20projeto.`

### 30 hashtags (usar 8–15 relevantes por post, não todas automaticamente)

- **Marca:** #FrancoRomeu #FrancoRomeuArteEngenharia #SeuImovelNossaArte #ArteAplicada #EngenhariaDeCusto
- **Local:** #SaoPaulo #ReformasSP #InterioresSP #ArquiteturaSP #DecoracaoSP #ObrasSP #ApartamentoSP #GrandeSaoPaulo #CasaEmSaoPaulo #DesignDeInterioresSP
- **Serviço/nicho:** #ReformaResidencial #ReformaDeApartamento #PorcelanatoLiquido #PisoEpoxi #PinturaResidencial #PinturaComTextura #Projeto3D #ProjetoDeInteriores #MarcenariaSobMedida #MoveisPlanejados #AcabamentoDeObra #AntesEDepois #PlanejamentoDeObra #ConstrucaoCivil #DesignAutoral

### Calendário de 10 publicações (iniciar na próxima segunda; ajustar datas antes de programar)

| Dia | Formato | Tema | Legenda sugerida |
|---|---|---|---|
| 1 | Reel | Diagnóstico da base | “O acabamento revela o que a base tentou esconder. Veja os três testes que fazemos antes de especificar um piso.” |
| 3 | Carrossel | Porcelanato líquido x tradicional | “Não existe material universal. Existe matéria adequada ao uso, à base e à manutenção.” |
| 5 | Reel | Antes/depois próprio | “O comum ocupava espaço. O novo projeto criou fluxo e presença. Imagens de obra própria, com autorização.” |
| 8 | Carrossel | 5 etapas da reforma | “Escopo, diagnóstico, projeto, execução e entrega: estrutura antes de velocidade.” |
| 10 | Stories | Caixa de perguntas | “Qual decisão da sua reforma está travada? Responderemos com critérios, não com promessas.” |
| 12 | Reel | Bastidor de pintura | “Não pintamos apenas paredes; preparamos telas. A precisão começa na correção da superfície.” |
| 15 | Carrossel | Projeto 3D | “Antes de mover matéria, movemos decisões. Veja o que validar no 3D.” |
| 17 | Reel | Marcenaria | “Milímetros mudam portas, fluxos e encontros. Três medidas que não podem ser improvisadas.” |
| 19 | Depoimento | Prova verificável | “Contexto, escopo e resultado nas palavras do cliente — publicado com autorização, sem editar o sentido.” |
| 22 | Reel | Visita técnica | “Uma boa visita não vende certeza: reduz incerteza. Veja o que medimos antes da proposta.” |

Use geotag do local real da obra (com autorização) e alterne São Paulo, bairros efetivamente atendidos e Grande SP. Uma página de links própria no domínio é preferível; Linktree pode ser solução transitória com botões para orçamento, WhatsApp, portfólio e GBP, todos com UTM.

## I. Citações e consistência NAP

**NAP-base provisório:** Franco Romeu — Arte & Engenharia · São Paulo/SP (empresa de área de serviço; não publicar rua sem confirmação) · +55 11 99002-1603 · https://francoromeu.com.br.  
**Status inicial:** a verificar — audite antes de criar duplicatas.

| Diretório | Status | Ação |
|---|---|---|
| Google Business Profile | A verificar | Reivindicar, verificar e remover duplicatas |
| Apple Business Connect | A verificar | Cadastrar empresa de serviço e validar telefone/site |
| Bing Places | A verificar | Importar do GBP e revisar campos |
| Facebook Business | A verificar | Criar/ajustar Página, categoria e NAP |
| Instagram Business | A verificar | Vincular à Página e adicionar botões de contato |
| LinkedIn Company Page | A verificar | Cadastrar organização, site, local e especialidades |
| Apontador | A verificar | Buscar duplicata, reivindicar e padronizar NAP |
| GuiaMais | A verificar | Buscar cadastro existente e corrigir dados |
| Yelp Brasil | A verificar | Verificar disponibilidade e reivindicar perfil |
| Houzz Brasil | A verificar | Criar perfil profissional com projetos próprios |

Guarde URL, login corporativo, data de revisão e evidência em planilha. Compare cobertura e disponibilidade local do Semrush Listing Management/Yext antes de contratar; não automatize campos incorretos.

## J. Backlinks, imprensa e pitches

1. **Guest post técnico:** mapear blogs de arquitetura, condomínios e decoração com audiência em SP. Pitch: “Olá, [nome]. Posso contribuir com um artigo original e não promocional sobre como diagnosticar umidade e base antes do porcelanato líquido. Incluo checklist técnico, fotos próprias autorizadas e uma breve autoria da Franco Romeu. Há interesse?”
2. **Fornecedores:** produzir caso conjunto com ficha técnica. Pitch: “Usamos [produto] no contexto [real]. Podemos documentar preparação, aplicação e resultado, com revisão técnica de vocês e links recíprocos para o caso completo?”
3. **Imprensa de bairro:** oferecer dados e orientação sazonal. Pitch: “Com o período de chuvas, podemos explicar sinais de umidade que moradores devem investigar antes de pintar, sem indicação comercial disfarçada. Franco Romeu está disponível como fonte técnica local.”
4. **Comunidades:** responder primeiro, linkar apenas quando uma página aprofundar a resposta. Não criar perfis para spam nem copiar respostas idênticas.
5. **Jornalistas:** HARO foi descontinuado; use Connectively/Qwoted, Featured e contato direto com redações, verificando disponibilidade atual. Responda em até duas horas com credenciais, 2–3 pontos objetivos, exemplo verificável e contato.

### Roteiro de resposta a jornalistas

**Assunto:** Fonte SP — [tema] — Franco Romeu  
“Olá, [nome]. Sou [responsável], da Franco Romeu — Arte & Engenharia, empresa de reformas e interiores em São Paulo. Em [tema], três critérios práticos são: [1], [2] e [3]. Em um caso autorizado, observamos [contexto e decisão, sem números inventados]. Posso explicar o diagnóstico em entrevista e fornecer imagens próprias com crédito. Telefone: +55 11 99002-1603.”

### 10 respostas-base para Q&A (personalizar ao contexto; não fazer autopromoção em comunidades que proíbem links)

1. **Quanto custa reformar um apartamento?** Área sozinha não basta: demolição, base, instalações, acesso, condomínio, materiais e acabamento alteram o custo. Comece por escopo e levantamento. Checklist: https://francoromeu.com.br/orcamento
2. **Porcelanato líquido risca?** Todo revestimento tem limites. Sistema, cura, uso, limpeza e proteção de móveis influenciam. Peça especificação compatível com tráfego e manutenção.
3. **Pode aplicar sobre piso existente?** Às vezes, após testar aderência, estabilidade, umidade, cotas de portas e planicidade. Uma inspeção deve preceder a decisão.
4. **Quanto demora para curar?** Depende do sistema e das condições ambientais. Respeite a ficha técnica do fabricante e não confunda secagem superficial com cura para uso.
5. **Textura esconde infiltração?** Não resolve a causa e pode atrasar o diagnóstico. Corrija origem, aguarde estabilização e prepare a superfície antes do acabamento.
6. **Projeto 3D substitui executivo?** Não. A imagem comunica intenção; medidas, pontos, paginações e detalhes executivos orientam a obra.
7. **MDF pode ser usado na cozinha?** Sim, com especificação, bordas protegidas, ventilação e distância de fontes de água/calor adequadas ao projeto.
8. **Como escolher uma empresa de reforma?** Compare escopo, responsabilidades, premissas, cronograma, contrato, referências verificáveis e clareza sobre mudanças.
9. **Preciso sair do imóvel?** Depende de poeira, ruído, instalações interrompidas e sequência. Fases e isolamento ajudam, mas segurança e habitabilidade orientam a escolha.
10. **Como evitar aditivos?** Levantamento e projeto reduzem incertezas, mas imprevistos existem. Defina processo de aprovação e registre preço/prazo antes de executar mudanças.

## K. GSC, GA4 e rotina de controle

### Checklist

- [ ] Verificar o domínio no Search Console por DNS; enviar `/sitemap.xml`; inspecionar as seis URLs; acompanhar Pages, HTTPS, Core Web Vitals e ações manuais.
- [ ] Confirmar que cada rota responde HTTP 200 após deploy e não vira soft 404. Solicitar indexação só após conteúdo próprio e canonical correto.
- [ ] No GA4, excluir tráfego interno e habilitar medição cross-domain apenas se realmente houver outro domínio.
- [ ] Disparar eventos: `generate_lead` (estimativa enviada), `form_start`, `form_submit`, `click_whatsapp`, `click_phone`, `budget_service_add` e `view_virtual_page` após troca de view. Marcar `generate_lead`, `form_submit` e `click_whatsapp` como eventos principais.
- [ ] Preservar consentimento e política de privacidade antes de ativar publicidade/remarketing.
- [ ] Usar UTMs padronizadas em GBP, Instagram, parceiros e posts.

**Semanal:** cliques, impressões, CTR por consulta/página, leads por canal, erros de formulário e URLs excluídas.  
**Mensal:** usuários orgânicos não pagos, posição média por cluster, participação local, conversão orgânico→lead, leads qualificados, Core Web Vitals, novos domínios de referência, avaliações e consistência NAP.  
Ferramentas: Search Console e GA4 como fonte primária; Semrush/Ahrefs para concorrência e backlinks; Ubersuggest ou rank tracker local para orçamento menor. Registre baseline antes de atribuir crescimento.

## Melhorias adicionais e roadmap SPA

1. **SSG/prerender por rota:** gerar HTML e head únicos para `/sobre`, `/ambientes`, `/projetos3d`, `/portfolio` e `/orcamento`. Metadados JavaScript melhoram UX, mas não garantem previews sociais por rota.
2. **Páginas de serviço dentro do build:** apesar da restrição atual de arquivo único, o próximo passo técnico deve gerar rotas como `/porcelanato-liquido` a partir da mesma fonte de conteúdo, sem duplicar manutenção.
3. **Imagens próprias:** WebP/AVIF, dimensões explícitas, `srcset`, geocontexto verdadeiro e autorização. Não inserir coordenadas EXIF como “tática de ranking”.
4. **Performance:** hospedar fontes e ícones críticos, eliminar CSS/JS não usado do HTML monolítico, adiar PDF/admin até interação e medir LCP/INP/CLS em campo.
5. **Acessibilidade:** auditoria WCAG 2.2 AA, skip link, foco visível, nomes acessíveis nos botões gerados, contraste e diálogos com foco contido.
6. **Conversão ética:** formulário curto em etapas, expectativa de resposta verdadeira, resumo do pedido e consentimento. Evitar pop-up de saída ou urgência falsa; oferecer checklist útil é alternativa coerente.
7. **CRM:** webhook server-side para HubSpot/Pipedrive/RD Station, com deduplicação, origem UTM, consentimento e SLA. Nunca expor chave no HTML.
8. **Conteúdo interativo:** calculadora já existente deve enviar eventos e explicar premissas; acrescentar quiz de prontidão da base e checklist PDF sem declarar preço fechado.
9. **Segurança operacional:** mover preços, cupons e administração para backend autenticado antes de qualquer compromisso comercial.
10. **Canonical e schema dinâmicos no servidor:** gerar por rota no deploy; JSON-LD no cliente pode complementar, não substituir HTML indexável.

## DNA estratégico aplicado

- **Verdade/prova:** estimativa é orientativa; visita, base e escopo são explicitados; nenhum rating, prazo ou case foi inventado.
- **Frames:** arte aplicada + engenharia de custo; acabamento nasce da estrutura; matéria é consequência de decisão.
- **Autoria:** voz precisa e segura, sem superlativos vazios; “O comum ocupa espaço. O extraordinário cria presença” é usado somente como manifesto, não como alegação mensurável.
- **Compiladores:** hooks começam por tensão técnica real, desenvolvem critério/prova e terminam em CTA de baixo atrito (“estruturar o escopo”), sem pressão enganosa.
