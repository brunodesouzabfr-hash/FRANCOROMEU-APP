# Matriz de componentes — limites do aceite

Esta matriz não substitui auditoria WCAG completa. PASS significa somente os estados e perfis explicitamente testados; não significa aprovação de todos os navegadores, contraste ou device físico.

| Componente | Estado | Verificação / limite |
|---|---|---|
| Intro | FIX | Espera artificial retirada; decorativa e não bloqueante; reduced motion testado |
| Logo | PASS | Master preservado; contain e proporção; conferência visual mobile/desktop |
| Header | FIX | Um header global; Instagram/WhatsApp; safe area; visível nas seis views |
| Menu mobile | PASS | Dialog nativo; alvos ≥44; Escape e retorno de foco; link e voltar |
| Home / contadores | FIX | HTML já informa 115/15/12; não depende de animação a partir de zero |
| Home / CTAs | FIX | Duplicação textual retirada; efeito tape ajustado; inclusão pelo fluxo existente |
| Botões e caixas | PARCIAL | Tokens e foco globais; orçamento com alvos maiores; hover/pressed/contraste de todo o legado não auditados integralmente |
| Hero / mídia | FIX | AVIF/WebP responsivos; prioridade e dimensões; sem alterar original |
| Tabs / URLs | FIX | Sincronização pelo evento de ativação; deep links, refresh e back testados |
| Orçamento | PASS FUNCIONAL | CTA Home → editor real → quantidade → total → reload; export/import validado |
| Quantidade / editor | FIX / PASS NOS PERFIS | Input original, precisão preservada, −/+ 48 px; seis reconstruções/primeiros cliques por perfil 390 e 1440; entrada por opacidade, sem translateX que desviava o clique; texto de opções claro |
| Comparativo Leroy | PASS REFERÊNCIA | 115 serviços / 94 códigos; histórico datado, escopo e visita; vazio/erro/retry e quantidade inválida; não modifica preço ou total |
| Solicitações adicionais | PASS INQUIRY | 17 famílias sob avaliação; só abre WhatsApp após clique; fora do cálculo e sem preço inventado |
| IQE / fidelidade / cupons | PARCIAL | Contratos e banco protegidos por testes; todas as combinações manuais de recomendação/fidelidade não reproduzidas |
| PDF curto | FIX / PASS VISUAL LIMITADO | Um A4, dois serviços fictícios e escopo não precificado; 175.664 bytes; data/moeda pt-BR; estado financeiro intacto; ainda raster |
| PDF longo | FIX / PASS VISUAL LIMITADO | 28 serviços / 3 A4; 587.659 bytes; todas as páginas renderizadas e revistas, linhas completas, cabeçalho repetido e rodapé separado; ainda raster/não etiquetado |
| Ambientes / accordions | PARCIAL | View sem overflow nos perfis testados; novos pares antes/depois aguardam aprovação |
| Projetos 3D | FIX LOADER / PARCIAL CONTEÚDO | ESM da mesma versão 0.161.0 carrega; WebGL, bloqueio de CDN e perda simulada de contexto testados; controles/fallback preservados. Estudos raster não são modelos |
| Portfólio / Arquivo Vivo | PARCIAL | View preservada; carga de imagens adiada até ativação; classificação completa/direitos pendentes |
| Galeria do anexo / case | PASS NOS PERFIS | 57 mídias / 162 variantes liberadas, labels, filtros, modal, Escape/foco e recuperação Stage16; case estático próprio; zero HOLD, sem afirmar execução |
| Arquivo Social | PRESERVE | Nenhum embed na abertura; seis placeholders existentes, não 30 posts inventados |
| Sobre / execução real | BLOQUEADO | Não publicar ilustrações como obra; fontes documentais específicas pendentes |
| Sobre / Google | PASS MOCK / BLOQUEADO LIVE | Links reais e fallback; sucesso/vazio/erro testados com respostas fictícias; chave e políticas pendentes |
| Admin público | REMOVE | Editores, instaladores e exportador removidos do dist; fonte local permanece preservada |
| Footer UI | FIX | Copy genérica substituída; footer PDF técnico sem sobrepor total |
| Motion / loops | PARCIAL | Reduced motion e pausas existentes preservados; perda simulada de contexto validada; orçamento de motion/GPU prolongado ainda pendente |
| Desempenho | FIX PARCIAL / LCP REPROVADO | Medianas atuais: LCP 3.328 ms, CLS de carga 0,00268. Não são dados de campo; shell/ativos legados ainda pesados |

Perfis emulados: 320×568, 360×800, 390×844, 412×915, 768×1024, 1024×768, 1280×720, 1440×900 e 1920×1080. Novas verificações devem carregar o hash do build no relatório; checkpoints de builds diferentes não podem ser tratados como aprovação do mesmo candidato.

Revisão final: fingerprint público `0151633538195b2ab61ce2f5e114fad6240b300fac9d51dd29bbce4f5f06d8c0`. Relatórios e capturas atuais têm sufixo `current`/prefixo `release-`. PDFs e medidas sem esses marcadores são históricos, não aceite desta revisão.

Pendentes: Safari/iOS e aparelhos físicos, zoom real 200%, paisagem mobile específica, rede lenta comparável, contraste completo, reaberturas de todos os modais, testes de memória/GPU prolongados e performance de campo. Nenhuma dessas verificações foi declarada concluída.
