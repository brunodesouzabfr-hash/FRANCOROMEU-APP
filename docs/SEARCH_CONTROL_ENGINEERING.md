# Search Control Engineering — Franco Romeu

> Plano operacional para copiar, executar e auditar. **Antes de publicar:** confirmar endereço completo, categorias disponíveis no GBP, meios de pagamento, áreas efetivamente atendidas e domínio apontado. Não publicar avaliação, obra, prazo ou credencial sem prova.

## 1. Diagnóstico técnico (resumo)

A SPA já preservava seis views, conteúdo editorial amplo, orçamento interativo, descrição, canonical, Open Graph, Twitter Card e um JSON-LD básico. Imagens-chave usam dimensões, carregamento adaptativo e ressalvas para referências externas. As fragilidades eram: canonical provisório da Vercel; navegação principal em `button`, portanto não rastreável; ausência de roteamento compartilhável; grafo sem `WebSite` ou breadcrumbs e com apenas cinco serviços; ausência de sitemap/robots; metadados iguais em todas as views; e imagens decorativas com `alt=""` sem inventário formal. Uma SPA entregue somente no cliente também não equivale a seis documentos HTML indexáveis: History API melhora descoberta e compartilhamento, mas o crescimento orgânico deve priorizar prerender/SSG no futuro.

Prioridade: (1) consolidar entidade e NAP confirmado; (2) disponibilizar URLs HTTP com rewrite e metadados coerentes; (3) validar Search Console, sitemap e conversões; (4) publicar conteúdo técnico original com evidência; (5) conquistar citações e links locais. Não foram incluídos `aggregateRating`, endereço de rua ou depoimentos fictícios. O grafo mapeia 16 IDs reais sem alterar catálogo, preços ou fórmulas.

## 2. Implementação on-page

- Canonical: `https://francoromeu.com.br/`, alterado por view para `/sobre`, `/ambientes`, `/projetos-3d`, `/portfolio` e `/orcamento`.
- Grafo: `LocalBusiness`, `WebSite/SearchAction`, `BreadcrumbList`, `ItemList`, cinco FAQs e 16 `Service` com IDs reais.
- Navegação: links HTTP rastreáveis; History API e `popstate`; fallback de produção em `vercel.json`.
- ALT: textos alternativos permanecem vazios em camadas estritamente decorativas. Logo dentro de marca já nomeada é decorativo; peças editoriais devem descrever o conteúdo e declarar “render” ou “referência visual”, nunca “obra executada” sem comprovação.
- Limite: metadados alterados no cliente não substituem HTML prerenderizado. Fase seguinte: snapshot estático de cada rota no deploy, mantendo o mesmo `index.html` como fonte.

## 3. Google Business Profile — texto pronto

### Configuração
1. Confirmar propriedade e preencher o **mesmo NAP** usado abaixo; se não houver atendimento no endereço, ocultá-lo e definir área de serviço.
2. Escolher a categoria principal que melhor represente a operação real e esteja disponível no painel: **Empresa de reformas**. Avaliar secundárias: Designer de interiores, Pintor, Marceneiro e Empreiteira de revestimentos.
3. Vincular `https://francoromeu.com.br/` e o telefone `+55 11 99002-1603`; cadastrar horário segunda–sexta, 08h–18h, somente se vigente.
4. Adicionar fotos próprias identificadas por etapa, sem apresentar render ou referência como obra. Publicar semanalmente e responder avaliações com contexto real.
5. Ativar mensagens, orçamento e atributos somente quando verdadeiros. Não inserir palavras-chave no nome comercial.

### Serviços
- **Reforma Residencial Completa:** Planejamento e execução de reformas em São Paulo, com escopo, materiais e etapas validados tecnicamente. Arte aplicada e precisão.
- **Instalação de Porcelanato Líquido:** Diagnóstico da base e aplicação de revestimento monolítico em São Paulo, com especificação e acabamento definidos por projeto.
- **Pintura Residencial:** Preparação de superfícies, pintura e texturas com método, proteção do ambiente e acabamento controlado.
- **Projetos 3D:** Visualização de layout, proporções e materiais para decidir antes de executar e reduzir incompatibilidades.
- **Marcenaria Sob Medida:** Móveis desenhados para o espaço, o uso e a linguagem material do projeto, sujeitos a medição técnica.

### Q&A para o proprietário publicar
1. **A Franco Romeu faz orçamento de reforma residencial em São Paulo?** Sim. O estimador organiza uma faixa orientativa e as premissas. A proposta depende de escopo, medidas, materiais e visita técnica quando necessária.
2. **Vocês aplicam porcelanato líquido sobre qualquer piso?** A possibilidade depende da estabilidade, umidade, nivelamento e aderência da base. A Franco Romeu avalia o local antes de especificar o sistema; precisão começa no diagnóstico.
3. **O projeto 3D ajuda a controlar a reforma?** Sim. Ele permite discutir layout, proporções e materiais antes da obra. Não elimina a validação executiva, mas torna decisões e interfaces mais claras.

### Ciclo semanal
Segunda: detalhe técnico; quarta: processo próprio/antes e depois comprovado; sexta: vídeo curto de material; domingo: FAQ. Em cada publicação: cidade/bairro real, serviço, decisão tomada, ressalva técnica e CTA para orçamento.

## 4. Instagram

**Nome do perfil:** `Franco Romeu | Reformas SP`

**Bio (copiar):**

> Reformas + interiores em São Paulo<br>
> Arte aplicada · engenharia de custo<br>
> Matéria, método e execução controlada<br>
> ↓ Estruture seu orçamento

**Link:** `https://wa.me/5511990021603?text=Olá%2C%20vim%20do%20Instagram%20e%20quero%20estruturar%20meu%20orçamento.` Use página própria de links; Linktree só se houver múltiplos destinos mensuráveis.

**30 hashtags para variar, não repetir mecanicamente:**
- Marca: `#FrancoRomeu #ArteEEngenharia #ForjadaResistencia #ArteAplicada #EngenhariaDeCusto`
- Local: `#SaoPaulo #ReformasSP #InterioresSP #ArquiteturaSP #DecoracaoSP #CasaSP #GrandeSaoPaulo #ReformaSaoPaulo #DesignDeInterioresSP #ObraSP`
- Nicho: `#ReformaResidencial #ProjetoDeInteriores #PorcelanatoLiquido #PinturaResidencial #MarcenariaSobMedida #Projeto3D #Acabamento #CuradoriaMaterial #Revestimento #Drywall #CimentoQueimado #PlanejamentoDeObra #Detalhamento #Materiais #ExecucaoDeObra`

### Calendário de 10 publicações (iniciar na próxima segunda)

| Dia | Formato | Tema | Legenda/CTA |
|---|---|---|---|
| 1 | Reel | Diagnóstico da base | “Acabamento começa no que não aparece. Veja três verificações antes do revestimento. Salve para sua reforma.” |
| 3 | Carrossel | Porcelanato líquido x tradicional | “Não existe escolha universal: uso, base e manutenção definem o sistema. Deslize e compare.” |
| 5 | Stories | Bastidor próprio | “Matéria sob controle: qual decisão técnica você quer entender?” |
| 8 | Reel | Projeto 3D | “Visualizar não é prometer; é testar decisões antes da execução. Envie seu ambiente.” |
| 10 | Carrossel | Cronograma | “Cinco interfaces que mudam o prazo de uma reforma. Planeje antes de mobilizar equipes.” |
| 12 | Foto | Detalhe comprovado | “O extraordinário cria presença no encontro entre desenho e execução.” Identificar local/etapa reais. |
| 15 | Reel | Preparação para pintura | “Não pintamos apenas paredes: preparamos a tela. Veja a sequência técnica.” |
| 17 | Carrossel | Marcenaria | “Medida, uso, ferragem e manutenção: quatro decisões antes do desenho final.” |
| 19 | Stories | FAQ orçamento | “Estimativa não é proposta fechada. Pergunte como validamos o escopo.” |
| 22 | Reel | Antes/depois próprio | “Transformação com contexto: problema, decisão, execução.” Usar somente caso comprovado. |

Geolocalizar pelo local real da captação (São Paulo e bairro correspondente), nunca por bairros não atendidos. Medir `instagram / social / bio` com UTM.

## 5. Conteúdo editorial futuro

Cada pauta segue: introdução com problema real → critérios e alternativas → riscos/interfaces → conclusão → CTA “Estruture as premissas do seu projeto”.

1. **Quanto custa reformar um apartamento em São Paulo? Premissas antes do preço** — primárias: reforma apartamento SP, custo de reforma, orçamento reforma; secundárias: custo por etapa, visita técnica reforma, materiais para apartamento, cronograma de obra SP, faixa de orçamento.
2. **Porcelanato líquido ou tradicional: como decidir pela base, uso e manutenção** — primárias: porcelanato líquido, porcelanato tradicional, revestimento de piso; secundárias: piso sem rejunte, preparação da base, porcelanato para cozinha, manutenção de revestimento, revestimento monolítico SP.
3. **Porcelanato líquido em São Paulo: 7 verificações antes da aplicação** — primárias: porcelanato líquido SP, aplicação de porcelanato líquido, piso monolítico; secundárias: umidade no contrapiso, nivelamento de piso, resina para piso, aderência da base, orçamento porcelanato líquido.
4. **Pintura residencial: por que preparação vale mais que uma demão extra** — primárias: pintura residencial SP, preparação de parede, pintor em São Paulo; secundárias: correção de fissuras, selador de parede, massa corrida, acabamento fosco, orçamento de pintura.
5. **Textura, cimento queimado e efeito marmorizado: matéria com intenção** — primárias: pintura com textura, cimento queimado, efeito marmorizado; secundárias: parede decorativa, textura para sala, acabamento mineral, manutenção de textura, pintura autoral SP.
6. **Projeto 3D para reforma: o que ele resolve e o que ainda exige detalhamento** — primárias: projeto 3D interiores, reforma com projeto, design de interiores SP; secundárias: render de interiores, compatibilização de projeto, layout de apartamento, projeto executivo, visualizar reforma.
7. **Como ler um projeto de interiores antes de aprovar a execução** — primárias: projeto de interiores, detalhamento de interiores, reforma planejada; secundárias: planta de layout, especificação de materiais, pontos elétricos, projeto de iluminação, revisão de projeto.
8. **Marcenaria sob medida: medidas, ferragens e manutenção que definem o resultado** — primárias: marcenaria sob medida SP, móveis planejados, projeto de marcenaria; secundárias: ferragens para móveis, medição de marcenaria, armário sob medida, MDF ou madeira, orçamento marcenaria.
9. **Reforma de cozinha: sequência técnica entre hidráulica, elétrica e marcenaria** — primárias: reforma de cozinha SP, projeto de cozinha, marcenaria de cozinha; secundárias: pontos hidráulicos cozinha, tomada para eletrodomésticos, bancada sob medida, cronograma cozinha, compatibilização marcenaria.
10. **Reforma de banheiro sem improviso: impermeabilização, caimentos e interfaces** — primárias: reforma de banheiro SP, impermeabilização banheiro, revestimento banheiro; secundárias: caimento do box, ralo de banheiro, ponto hidráulico, paginação de porcelanato, orçamento banheiro.

## 6. NAP e diretórios

**NAP controlado:** Franco Romeu — Arte & Engenharia | endereço: **não publicar até confirmação** (empresa de área de serviço, se aplicável) | +55 11 99002-1603 | `https://francoromeu.com.br/` | `romeudifranco@gmail.com`.

| Diretório | Status inicial | Ação |
|---|---|---|
| Google Business Profile | Auditar | reivindicar, verificar e corrigir NAP |
| Apple Business Connect | Pendente | criar local/área de serviço e verificar |
| Bing Places | Pendente | importar do GBP e revisar |
| Facebook Business | Pendente | preencher Sobre e contato idênticos |
| Instagram profissional | Auditar | alinhar nome, categoria e contato |
| LinkedIn Company Page | Pendente | criar página e vincular domínio |
| Pinterest Business | Auditar | reivindicar domínio e padronizar descrição |
| Apontador | Pendente | buscar duplicatas antes de cadastrar |
| GuiaMais | Pendente | confirmar disponibilidade e editar NAP |
| Yelp Brasil | Pendente | verificar cobertura ativa antes de investir |

Registrar URL, login do proprietário, data, status de verificação e última auditoria em planilha interna. Avaliar Semrush Listing Management/Yext somente após confirmar cobertura brasileira e custo; automação não corrige uma fonte NAP errada.

## 7. Backlinks, imprensa e Q&A

### Plano e pitches
1. **Guest post técnico:** blogs e entidades locais de arquitetura. Pitch: “Olá, [nome]. Posso contribuir com um guia original sobre diagnóstico de base antes de revestimentos, com checklist técnico e imagens próprias. Sem publieditorial oculto; a Franco Romeu assina a fonte.”
2. **Fornecedores:** criar estudo conjunto sem endosso falso. “Propomos documentar especificação, teste e manutenção do material [X] em um guia educativo. Cada parte revisa apenas suas competências e referencia a ficha técnica.”
3. **Imprensa de bairro:** oferecer pauta sazonal. “Tenho uma pauta de serviço sobre como condomínios podem reduzir incompatibilidades antes da reforma, com cinco verificações e porta-voz técnico disponível.”
4. **Comunidades:** responder primeiro, linkar somente quando um guia realmente aprofunda. Proibir spam e links em massa.
5. **Jornalistas:** HARO foi encerrado; usar Connectively/Featured/Qwoted apenas se ativos e adequados ao Brasil, além de mailing direto. Responder em até duas horas com credenciais verificáveis, 3 pontos objetivos e disponibilidade.

**Modelo de resposta jornalística:** Assunto: `[consulta] — fonte sobre reformas em São Paulo`. “Sou [nome/cargo verificável], da Franco Romeu — Arte & Engenharia. Em reformas, os três controles que mais evitam retrabalho são [1], [2] e [3]. [Explicação factual em 80–120 palavras]. Posso detalhar o método e fornecer imagem própria com crédito. Contato: +55 11 99002-1603.”

### 10 respostas-base para Quora/Reddit/grupos
1. **Quanto custa reformar?** Sem escopo, medida e condição da base, preço é falsa precisão. Organize etapas e valide o imóvel; use o estimador: `https://francoromeu.com.br/orcamento`.
2. **Porcelanato líquido serve sobre piso existente?** Às vezes, após ensaiar estabilidade, umidade, nivelamento e aderência. Diagnóstico precede especificação.
3. **Piso contínuo trinca?** O risco depende da base, juntas, movimentação e sistema aplicado. Nenhum acabamento corrige suporte instável.
4. **Duas ou três demãos?** Cobertura depende de cor, produto, absorção e preparação; conte o sistema completo, não apenas demãos.
5. **Projeto 3D substitui executivo?** Não. O 3D comunica intenção; execução exige medidas, detalhes e compatibilização.
6. **Marcenaria antes ou depois do piso?** A sequência depende do sistema e das tolerâncias. Compatibilize medidas finais, rodapés e folgas.
7. **Como escolher textura?** Considere luz, escala, manutenção, base e teste de amostra no local.
8. **Quanto dura uma reforma de banheiro?** Depende de demolição, cura, instalações, impermeabilização e materiais. Cronograma vem após diagnóstico.
9. **Como evitar aditivos?** Escopo claro, registro de premissas e aprovação formal de mudança reduzem surpresa; não eliminam condições ocultas.
10. **Vale reformar sem projeto?** Em intervenções simples, um escopo pode bastar. Quando sistemas se cruzam, projeto reduz ambiguidades.

## 8. GSC, GA4 e KPIs

### Checklist
- [ ] Confirmar propriedade de domínio no Search Console por DNS.
- [ ] Enviar `https://francoromeu.com.br/sitemap.xml`; inspecionar as seis URLs e testar canonical renderizado.
- [ ] Verificar HTTPS, redirects e uma única versão de host.
- [ ] No GA4, excluir tráfego interno e manter consentimento conforme LGPD.
- [ ] Instrumentar `generate_lead` no envio válido; `click_whatsapp`, `start_budget`, `complete_budget`, `view_service` e `click_phone` sem dados pessoais.
- [ ] Marcar `generate_lead`, `click_whatsapp` e `complete_budget` como eventos principais; testar no DebugView.
- [ ] UTM padrão: `utm_source`, `utm_medium`, `utm_campaign`, sem PII.

Semanal: cobertura/indexação, consultas novas, CTR por landing, leads e erros. Mensal: usuários orgânicos não-marca, posição/CTR por cluster, conversão por rota, GBP (ligações, site, rotas), citações consistentes e links conquistados. Ferramentas: GSC e Looker Studio primeiro; depois Semrush/Ahrefs; Ubersuggest apenas como apoio. Não prometer posição.

## 9. Melhorias adicionais e rollback

1. Prerender/SSG das seis rotas no deploy para entregar título, H1 e conteúdo sem depender de JavaScript.
2. Criar páginas editoriais dentro da fonte única e snapshots de rotas de serviço somente após autorização arquitetural.
3. Converter imagens próprias para AVIF/WebP com `srcset`, largura/altura e orçamento de peso; manter fallback.
4. Auditar todos os ALT por finalidade e licenças; `alt=""` em decoração é correto.
5. Instrumentar CTAs no GA4 sem enviar nome, telefone, CEP ou orçamento detalhado.
6. Adotar CRM somente com consentimento, minimização e política de retenção; nunca expor segredo no cliente.
7. Testar teclado, foco, 390×844, desktop e `prefers-reduced-motion` em navegador real.
8. Criar biblioteca de provas: fotos próprias, autorização, local/data, tipo (obra/render/referência) e resultado verificável.
9. Evitar pop-up de saída, contagem regressiva e escassez falsa; usar CTA persistente e contextual.
10. Reversão: remover `fr-seo-spa-router`, restaurar nav anterior e retirar `vercel.json`; dados financeiros não foram tocados.

## 10. DNA aplicado

O anexo nomeado no pedido não existe nesta árvore. Foram aplicadas as diretrizes disponíveis no `AGENTS.md`: verdade antes da promessa, voz direta/técnica/humana, arte aplicada, matéria, estrutura, precisão, autoria, engenharia de custo e conversão sem manipulação. “Render” e “referência visual” continuam identificados; nenhum prêmio, avaliação, cliente, endereço ou desempenho foi inventado.
