Análise concluída exclusivamente com as evidências locais. O JSON foi validado e nenhum arquivo de captura existente foi alterado.

Arquivos criados:

- [design-system-reference.md](/home/romeu/FR-Design-Lab/captures/sd-spiral-gallery.vercel.app/20260822-013338/design-system-reference.md)
- [design-system.json](/home/romeu/FR-Design-Lab/captures/sd-spiral-gallery.vercel.app/20260822-013338/design-system.json)
- [fr-translation-plan.md](/home/romeu/FR-Design-Lab/captures/sd-spiral-gallery.vercel.app/20260822-013338/fr-translation-plan.md)

Cinco descobertas principais:

1. No desktop, a referência usa um canvas WebGL fixo em tela inteira, com hero editorial e controles distribuídos em três camadas de profundidade.
2. A experiência ocupa uma única dobra, sem rolagem, com headline central dominante e CTA compacto.
3. O breakpoint observado é 1024/1025px; em 390×844 a experiência imersiva é substituída por um estado “não suportado”, sem controles.
4. Three.js e WebGL foram detectados, mas parâmetros 3D, gestos, easing e animação da galeria estão indisponíveis na captura.
5. O console desktop registrou stalls de GPU relacionados a `ReadPixels`, tornando lazy-loading, fallback DOM e orçamento de desempenho requisitos importantes para uma tradução FR.

O plano preserva explicitamente a entrada atual de Projetos 3D, Portfólio e Ambientes, exige baseline antes da implementação e inclui checklist de proteção do `FRBudgetCore`, calculadora, IQE, busca, IDs, índices e contratos financeiros.