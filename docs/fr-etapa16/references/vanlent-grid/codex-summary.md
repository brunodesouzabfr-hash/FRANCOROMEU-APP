Concluído. Os três arquivos foram criados exclusivamente no diretório solicitado:

- [design-system-reference.md](/home/romeu/FR-Design-Lab/captures/vanlent.dev/20260821-135506/design-system-reference.md)
- [design-system.json](/home/romeu/FR-Design-Lab/captures/vanlent.dev/20260821-135506/design-system.json)
- [fr-translation-plan.md](/home/romeu/FR-Design-Lab/captures/vanlent.dev/20260821-135506/fr-translation-plan.md)

O JSON foi validado e contém todos os campos obrigatórios, com `status` e `evidence` nos itens relevantes. Nenhum arquivo da captura ou da aplicação foi alterado.

Cinco descobertas principais:

1. A referência usa uma malha modular de 75 px no desktop e 53 px no mobile.
2. A tipografia é dominada por Montserrat nos pesos 200/300, com IBM Plex Mono pontual.
3. A interface combina fundo `#1c1c1c`, filetes inset de 1 px, raios praticamente ausentes e acento verde-água.
4. O desktop emprega longas seções sticky/pinned; o mobile converte a experiência para fluxo vertical.
5. WebGL, Three.js e GSAP foram detectados, mas versões, bundles e parâmetros internos estão indisponíveis; a proposta FR recomenda 3D isolado, progressivo e com fallback, protegendo integralmente o FRBudgetCore.