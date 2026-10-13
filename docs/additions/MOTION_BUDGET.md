# Motion progressivo

O site mantém as camadas Stage 15/16 existentes, incluindo galeria horizontal, cubo visual raster, fundo atmosférico e controle de quantidade único. O novo Jornal acrescenta apenas uma entrada curta de página; `prefers-reduced-motion` a desliga. O atlas novo usa transição de imagem nos cards e a desliga na mesma preferência. Conteúdo e links permanecem em DOM/HTML sem canvas.

A galeria dos ambientes tem setas e Escape no viewer; as rotas de detalhe funcionam sem JavaScript. A capa e o primeiro par de slides horizontais são priorizados; o restante usa lazy loading. Não foram instalados WebGL, Three.js adicional, loop novo ou player social no carregamento inicial.

Pendente: medição comparável de LCP e custo de CPU/memória do Stage 15/16 em 390×844 e desktop antes de habilitar camadas mais pesadas. Se a camada de efeito falhar, os cards e links HTML devem continuar acessíveis.
