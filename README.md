# Imersão Advogado 10X · 9ª edição

Página de vendas da 9ª Imersão Advogado 10X — 20, 21 e 22 de Novembro de 2026,
Casa Destino, Alphaville.

Site estático, sem build. O que está no repositório é exatamente o que vai para o ar.

## Rodar localmente

```bash
python3 -m http.server 8000
```

e abrir `http://localhost:8000`.

Abrir o `index.html` com dois cliques (`file://`) funciona só pela metade: o navegador
bloqueia módulos ES nesse protocolo e a página cai no modo sem animação. É legível,
mas não é a experiência.

## Publicar

O repositório inteiro é a raiz do site. Qualquer host de estático serve:

- **GitHub Pages** — Settings → Pages → Source: `Deploy from a branch`, branch `main`, pasta `/ (root)`.
- **Cloudflare Pages / Netlify / Vercel** — conectar o repositório, sem comando de build,
  diretório de saída `/`.

Não existe etapa de build, então não há nada para configurar além disso.

## Estrutura

```
index.html                 uma seção por capítulo, na ordem narrativa
assets/css/font.css        @font-face das fontes auto-hospedadas
assets/css/base.css        tokens, tipografia, botões, primitivas, atmosfera
assets/css/sections.css    cada capítulo, mobile-first (620 / 900 / 1200)
assets/js/main.js          orquestra: monta e desmonta as cenas
assets/js/utils/           env, nome, media, lines, reveal, seq, prog
assets/js/scenes/          uma cena por arquivo
assets/js/vendor/          GSAP 3.13 + ScrollTrigger (locais, sem CDN)
assets/font/               Instrument Sans, Geist, Geist Mono, Instrument Serif (woff2)
assets/video/              15 clipes web (57 MB)
assets/poster/             capa de cada clipe, usada antes de carregar
assets/img/                logo, retrato, foto do salão, foto do palco
```

Nenhuma dependência externa: sem CDN, sem npm, sem fonte do Google.

## Antes de colocar no ar

Estas pendências estão marcadas no código e valem uma conferida antes de publicar:

- **Links de checkout.** Os botões de ingresso estão com `href="#"` e
  `data-cta="classic"` / `data-cta="vip"`. Procure por `data-cta` no `index.html`.
- **Itens `[CONFIRMAR]`** — programação de 24 horas, certificado, mesa nominal no almoço
  do VIP, data de virada do Lote 2 e preço do Lote 3.
- **Favicon** — a página ainda não tem. O logo atual é deitado (176×45) e não serve
  recortado num quadrado.

O `LEIA-ME.md` explica as decisões técnicas: a disciplina da classe `.motion`, o
carregamento tardio dos vídeos, a arquitetura separada de mobile e desktop, a atmosfera
e as armadilhas de corte de vídeo com ffmpeg.
