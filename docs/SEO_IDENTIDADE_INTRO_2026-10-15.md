# FR — SEO, marca e intro | 15/10/2026

Alterações na branch main preservam seis views, 115 serviços, FRBudgetCore e o grafo JSON-LD com 16 serviços.

Título Home: Reformas e Projetos em SP | Franco Romeu — Alto Padrão
Descrição Home: Franco Romeu: reformas e projetos de alto padrão em SP. Interiores 3D, marcenaria sob medida, revestimentos, pintura técnica, elétrica, automação e manutenção.

Os metadados iniciais e a rota SPA Home (título/descrição) foram sincronizados. Open Graph e Twitter utilizam o mesmo posicionamento. A descrição da organização e o texto visível da seção Especialidades ampliaram os grupos de serviço sem criar páginas ou ofertas inexistentes.

Assets novos com alfa preservado:
- assets/brand/franco-romeu-medalhao-esmeralda-256.webp: imagem original do medalhão enviada pelo usuário, otimizada para perfil, usada em seis referências.
- assets/brand/franco-romeu-monograma-dourado-384.webp: imagem original do símbolo dourado enviada pelo usuário, otimizada para marca do canto da intro e do laboratório.

Intro V04: script de produção assets/intro/fr-intro-cinematic.js, sem painel DEV, entry=cascade, exit=fracture, background=fault, color=#E6D6B5, duration=17, speed=1.8, motion=2.5, fog=100. Exibe uma vez por sessão, ?frIntro=1 reinicia, reduz movimento quando solicitado e inclui Pular. O laboratório independente é noindex.

Foram removidos apenas o HTML e CSS específicos do Forge, e substituída a função initLoader pela sincronização com fr:intro-complete. As imagens históricas permanecem para rollback.

Pós-publicação: npm test; npm run check:html; verificar Home e outras views, orçamento, IQE, PDF, console, links de imagens, mobile 390x844, fonte offline e reduz-motion. Confirmar deploy Vercel, SEO canonical e solicitar reindexação no Search Console. Sem garantia do texto literal do snippet Google.

Rollback: reverter o commit sem force-push e preservar todo trabalho posterior.
