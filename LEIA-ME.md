# Imersão Advogado 10X · 9ª edição — experiência de página

Site estático, sem build. Abra `index.html` por um servidor local
(`python3 -m http.server` na pasta `site/`) ou suba a pasta inteira em qualquer host.
Abrir com duplo clique (`file://`) funciona parcialmente: os módulos JS são bloqueados
pelo navegador nesse protocolo, e a página cai no modo sem motion — que é legível,
mas não é a experiência.

## Tipografia

**Instrument Sans** nos títulos, **Geist** no corpo, **Geist Mono** em labels, datas e
números. As três são livres (OFL) e estão embutidas em `assets/font` — a página não
depende de CDN nenhum para desenhar o texto certo.

A headline do hero é montada em runtime pelo `hero.js` a partir de dois modelos no
próprio `<h1>`: `data-com` (com o primeiro nome) e `data-sem` (sem). O nome entra
dentro da frase, em dourado, e a headline se refaz palavra a palavra quando a porta
devolve o nome. Peso 500, três linhas no desktop — o vídeo do salão fica visível.

## Estrutura## Estrutura

```
site/
  index.html                 uma seção HTML por capítulo, na ordem narrativa
  assets/css/font.css        @font-face das fontes auto-hospedadas
  assets/css/base.css        tokens, tipografia, botões, primitivas
  assets/css/sections.css    cada capítulo, mobile-first (620 / 900 / 1200)
  assets/js/main.js          orquestra: monta e desmonta as cenas
  assets/js/utils/           env, media (lazy/pause), lines (máscara), reveal
  assets/js/scenes/          uma cena por arquivo: hero, legado, mesa,
                             ambiencia, sala, palestra, marcelo, fim
  assets/js/vendor/          GSAP 3.13 + ScrollTrigger (locais, sem CDN)
  assets/font/               Inter Tight, Inter, Instrument Serif (woff2)
  assets/video/              21 clipes web (12 MB no total)
  assets/poster/             capa de cada clipe, usada antes de carregar
  assets/img/                logo, retrato do Cristiano, foto do salão, foto do palco
```

## Regras que o código segue

**A página é legível sem JavaScript.** A classe `.motion` entra no `<html>` por um
script inline no `<head>` e é o que autoriza qualquer estado escondido ou sobreposto.
Se o GSAP não carregar, `main.js` remove a classe e tudo volta ao fluxo normal.
Nada de conteúdo preso atrás de animação.

**`prefers-reduced-motion` é respeitado de verdade.** Não é só encurtar a animação:
os pins não são criados, e cada `<video>` de ambientação é substituído pela sua
própria capa em `<img>`. A página fica estática e completa.

**Vídeo não baixa antes da hora.** Todo `<video>` nasce com `preload="none"` e sem
`src` — o `src` real está em `data-src`. Um IntersectionObserver atribui a fonte quando
o elemento se aproxima da viewport, dá play, e pausa quando sai. No máximo três tocam
ao mesmo tempo; com a aba escondida, nenhum. O hero troca entre a versão deitada e a
em pé conforme a largura (`data-src-wide` / `data-src-tall`).

**Desktop e mobile têm arquiteturas diferentes, não escalas diferentes.**
`gsap.matchMedia()` monta cada cena duas vezes, com durações de pin próprias.
No mobile os pins são de 25% a 40% mais curtos, e a seção "Agora imagine outra mesa"
troca a mídia sticky lateral por uma sequência vertical.

**Limpeza.** Tudo vive dentro de um `gsap.context()`. Em mudança real de largura
(≥40px, para ignorar a barra de endereço do iOS) o contexto é revertido e remontado.
Nenhum ScrollTrigger sobrevive a um resize.

## O eixo de margens

A página inteira tem **um único eixo esquerdo e direito**: `.shell` — largura máxima
`--shell` (1280px) com goteira `--gut` (clamp 20 → 72px). Todo container editorial
(`.edit__in`, `.g10__grid`, `.pil__ch`) usa exatamente os mesmos dois valores, e
nenhum bloco de leitura é centrado numa largura própria: quem estreita a coluna é a
medida do texto (`--m-read` 780px no corpo, `--m-disp` 980px nas frases-âncora),
sempre alinhada à esquerda.

Dois cuidados que o código já resolve:

- **Elemento absoluto dentro de uma `.shell`** — o bloco de contenção é a caixa de
  *padding*, então `left:0` cola o elemento na borda e come a goteira. Nesses casos
  use `left:var(--gut)` (ex.: `.hist__st`, `.mesa__final` no modo motion).
- **Elemento solto, fora de qualquer `.shell`** — use `--edge`, que reproduz o eixo da
  shell inclusive acima de 1280px (ex.: `.prog`, `.mg__cap`).

Conferido por medição em 1440, 1280, 1024, 768, 430 e 390px: todo texto de primeiro
nível começa na mesma coordenada.

## Onde o scrollytelling está

Sete cenas com pin, ~33% da rolagem no desktop. O resto é leitura normal, de propósito.
Só o case do Marcelo passa de 210%, e por decisão: o bloco do valor precisava de tempo de leitura. Em cada pin algo muda a cada ~0,3 de viewport:

| cena | desktop | mobile | acontecimentos |
|---|---|---|---|
| Prova histórica | 190% | sem pin | 5 estados + 4 trocas de vídeo + nomes atravessando |
| A mesa de hoje | 150% | 110% | 5 falas + convergência |
| Ambiência | 200% | sem pin | 3 negativas + revelação do vídeo + definição |
| Olhe para essa sala | 190% | 130% | plano cresce + 4 constatações + conclusão |
| Se fosse só pela palestra | 175% | 125% | 4 frases + bastidor entrando + 3 vídeos + tags |
| Marcelo Gomide | ~235% | sem pin | 7 estados com pesos diferentes: o bloco dos R$ 550.000 ocupa sozinho um terço da cena |
| Volta à mesa | 165% | 115% | 4 tempos + respiração da imagem |

No celular, histórico, ambiência e o caso do Marcelo deixam de ser pin e viram
fluxo vertical — não são a versão comprimida do desktop, são outra arquitetura.

## Movimentos da última parte da página

Do bônus até os ingressos a página era uma sequência de blocos de leitura com o mesmo
ritmo. Cada um ganhou um movimento próprio, no mesmo vocabulário do resto:

- **Evolua 3 anos em 3 dias** é digitada caractere a caractere, com cursor piscando
  (`scenes/tres.js`). Sem JS, é só um título.
- **Bônus**: o fio dourado desenha da esquerda para a direita e o valor sobe de zero.
- **Investimento**: os três "mais um ano" entram pela esquerda e acendem, um a um.
- **Faixa de vídeo** full-bleed 32:9 entre investimento e escassez, para quebrar a
  sequência de blocos de texto.
- **Escassez**: a régua do ano desenha e o pedaço aberto acende no fim.
- **Ingressos**: os dois cartões entram de lados opostos, e uma luz atravessa o VIP
  conforme a rolagem (scrub, não loop).

Tudo isso vive em `scenes/oferta.js` e `scenes/tres.js`. Quem esconde o estado inicial
é o GSAP, não o CSS: se uma dessas cenas falhar, o conteúdo continua visível.

## Atmosfera

Duas camadas decorativas, sempre `aria-hidden`, e nenhuma delas segura conteúdo.

**Névoa** (`.tem-nevoa` + `<span class="nevoa">`, em `base.css`): duas manchas de
gradiente radial muito lentas por trás do texto, em cinco superfícies planas da página
(é a nona, agora vamos falar de você, G10, evolua 3 anos, ingressos). É CSS puro, sem
JavaScript e sem `blur` — o gradiente já é macio, e `filter:blur` num elemento desse
tamanho custa caro. O conteúdo fica em `z-index:1` por cima.

**Poeira dourada** (`scenes/poeira.js`): canvas com 22 grãos no desktop e 11 no celular,
nas três cenas de impacto (ambiência, o case do Marcelo e o fechamento). Cada grão é uma
única imagem pré-desenhada com halo, redesenhada por quadro com `globalAlpha` — nada de
gradiente novo a cada frame. Só roda quando a cena está na tela (IntersectionObserver) e
a aba está visível.

Ambas desaparecem em `prefers-reduced-motion: reduce`.

## Pendências marcadas no código

Procure por `[CONFIRMAR]` e `PLACEHOLDER` no `index.html`:

- **BTG Pactual** na edição de 2025 (legenda do bloco de legado).
- **Carreira pública do Cristiano em São José dos Campos.** O texto usa
  "carreira pública", não "vereador", conforme o checklist da copy. Se o mandato for
  confirmável, a frase alternativa está no comentário ao lado.
- **Programação de 24 horas** e **certificado** — aparecem no bloco de investimento e
  nos dois ingressos.
- **Mesa nominal no almoço** no VIP — confirmar se o benefício permanece em 2026.
- **Encerramento antecipado das vendas em 2025** — a frase não foi incluída na página
  até haver confirmação.
- **Data de virada do Lote 2 e preço do Lote 3.**
- **Caso de negócio milionário** — pedido em 11/08/2026. O maior caso documentado é o
  do Marcelo Gomide (R$ 550 mil, dito por ele em vídeo). Não há caso de sete dígitos
  nas fontes; se aparecer, entra no lugar ou ao lado do bloco do Marcelo.
- **Depoimentos em vídeo** — a copy pede vídeo; os arquivos dos três depoentes não
  existem na pasta `/videos`. Estão como citação tipográfica, com o grid pronto para
  receber `<video controls preload="none" poster="…">` no mesmo lugar.
- **Foto/vídeo do Flávio Augusto** — o bloco dedicado a ele foi removido em
  11/08/2026 a pedido. Ele permanece como item 01 do lineup 2026.
- **Retratos individuais dos palestrantes 2026** — não existem nos assets. A faixa do
  lineup usa a foto real do palco.
- **Foto/vídeo do Marcelo Gomide** — não existe nos assets. O bloco usa uma imagem de
  networking, marcada como placeholder.
- **Preço do G10** — decidido em 11/08/2026 que o valor anual NÃO aparece na página.
  O bloco usa "G10 · o andar de cima do ecossistema" como elemento tipográfico, e a
  âncora de valor no bloco de investimento fala em ambiente, não em preço.
- **Links dos botões de compra** — os CTAs de ingresso estão com `href="#"` e
  `data-cta="classic"` / `data-cta="vip"`. Trocar pelos links do checkout.

## Sobre os vídeos

A biblioteca foi refeita em 11/08/2026 a partir de **`horizontal 01 - 24.07.mp4`** e
**`horizontal 02 - 24.07.mp4`** — os dois únicos masters em 1920×1080 e sem legenda
queimada. Todos os clipes deitados saem deles em 1600×900, CRF 21, sem recorte:
enquadramento original do cinegrafista. Só o crachá do G10 vem de um vertical
(`video oficial 1 OK.mp4`), recortado acima da faixa de legenda.

Os quatro arquivos verticais originais continuam sendo a fonte dos clipes `tall-`
(hero no celular e os pilares). Neles a legenda fica em y 0,63–0,66 do quadro, então
qualquer recorte deitado novo precisa manter offset ≤ 570px.

**Cuidado ao cortar:** esses masters têm GOP longo. `-ss` antes do `-i` cai no keyframe
anterior e desloca o corte em vários segundos. Use sempre `-i arquivo -ss A -to B`.

Os masters não foram tocados.
