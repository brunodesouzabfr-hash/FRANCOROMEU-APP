# PWA e WebView — estado verificado

`site.webmanifest` existe com start URL `/`, escopo `/`, ícones 192 e 512 e cores da marca. Não foi encontrado service worker na árvore atual. Assim, não há cache offline versionado validado nem instalação/offline/WebView declarados prontos.

Um futuro worker deve usar rede primeiro para HTML, nunca reativar a Home editorial antiga e jamais apagar `localStorage` do orçamento durante atualização. Não pré-cachear a biblioteca inteira, reviews, respostas pessoais ou embeds. Testar instalação, atualização, navegação direta, offline, PDF, links externos e recuperação do orçamento antes de oferecer a experiência como PWA concluído. APK/WebView permanece um projeto separado.
