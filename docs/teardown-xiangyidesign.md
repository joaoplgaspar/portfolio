# Teardown — xiangyidesign.com (referência máxima)

Inspeção feita em 2026-09-22 com o browser: DOM ao vivo, bundle (`index-DlbkM2Te.js`,
1.26 MB), CSSOM, shaders extraídos e captura das transições quadro a quadro.
Complementa [spec-v3-motion.md](spec-v3-motion.md) §9.

## Stack real

| Camada | O que é |
|---|---|
| Base | **Vite + React** SPA, `<div id="root">` vazio, **sem SSR** |
| Rotas | `pushState` próprio (sem react-router). `/`, `/project`, `/tiktokweb`, `/shoefinder`, `/vibe-coding` |
| Motion | **Framer Motion** (`motion`) — `layoutId` ×31, `whileHover` ×14, `whileTap` ×7, `drag` ×13, `staggerChildren` |
| Scroll | **Lenis** (`html.lenis-smooth`) |
| 3D | **three.js** cru (não R3F) — só para o globo |
| Transição | **WebGL próprio** (mini-wrapper, fullscreen quad), não three.js |
| Texto | `typewriter-effect` + componente de scramble próprio |
| CSS | Tailwind. **7 regras de animação e 7 de `:hover` no CSS inteiro** — tudo o mais é JS |
| Assets | Cloudflare R2 + `framerusercontent.com` (reaproveita CDN do Framer) |
| Fontes | TikTok Sans + Doto (Google) + Humane, Thunder, DT Random Display, Neue Haas (locais) |

## As 4 páginas

### 1. `/` — Dashboard (bento 2×2 de colunas)

`left-column` (bio+globo / nome) + `right-column` (3 cards / relógio+clientes).
Widgets, todos com dado **real e em movimento**:

| Widget | Mecanismo |
|---|---|
| **Bio** | Typewriter no papel ("I am a `designer|` → `developer|`") + data e **relógio ao vivo por segundo** |
| **Worldspan** | Globo three.js, `<canvas>` 207×207: `InstancedMesh` + `Points` + `ShaderMaterial`, distribuição **Fibonacci/esfera áurea** no shader. Cidade troca a cada ~3 s (Tokyo → Singapore → Sydney → San Francisco → Vancouver → New York) |
| **Moodboard** | Nome "yixiang" em **SVG `<text>`** (display font), parênteses `( )` em SVG e imagem central que **rotaciona a cada ~3.5 s** (R2: `512-1.png`…) |
| **Contact** | Card com imagem, seta SVG, `Copy number`, `Email Me`, resumo no Drive |
| **Some Statistic** | "Mileage" com onda animada + **radar/pentágono SVG** (Research / Execution / Creative / Product-Thinking / Innovative) |
| **Currently at** | Imagem borrada + logo TikTok + cargo |
| **Mode switch** | Toggle de tema (SVG lua→sol) |
| **Relógio** | Analógico em SVG, hora real, ponteiro de segundos contínuo |
| **Clients** | Marquee infinito de logos com máscara SVG |

Entrada: **stagger** dos cards (não é fade global — cada card entra em sequência, ~2.5 s no total).
Em idle, **nada fica parado**: relógio, globo, typewriter, moodboard e marquee.

**Hover nos cards do dashboard: não existe.** A vida é ambiente, não reativa.
As únicas regras `:hover` do site inteiro são `.project-card-lite` (shimmer),
`.dock-icon` (opacity .6) e o dock-switch.

### 2. `/project` — Selected work(s)

- `h1` gigante + filtros pílula **All 9 / Product 2 / Tech 2 / Creative 4** com contador
- Grade masonry irregular (1 card largo + 2 estreitos por faixa), legenda **fora** do card (título à esquerda, disciplinas à direita)
- **Cada card é um `<video>` `autoplay loop muted playsinline`** — 5 na primeira dobra, **7 tocando ao mesmo tempo** na página de case. Sem pausa por viewport
- `.shimmer-border` / `.shimmer-glow`: borda iridescente 6 s infinita, `opacity 0 → 1` no hover
- **Só 3 dos 9 cards abrem case.** Os outros não são clicáveis — e nenhum é `<a>`/`<button>` (não existem no a11y tree, não recebem foco)

### 3. `/tiktokweb` — Case study (13.937 px de altura)

Três camadas fixas + conteúdo:

- **`.animate-nav`** (esquerda, `fixed`): índice de seções com scrollspy, entra com `slideInFromLeft`
- **`.animate-minimap`** (direita, `fixed`): **45 tracinhos de larguras diferentes que representam os blocos reais da página** — um minimap de editor de código. Ativo em `#777`, inativo em `#333`
- **`.animate-content`** (744 px): coluna editorial
- Widgets no corpo: **slider Before/After arrastável** (`drag` + `dragConstraints`), tabelas de breakpoints/grid, vídeos, tags PM/Design/Engineer
- **Scramble text**: componente `({text, duration=800, delay=0})` com charset `A-Za-z0-9!@#$%…`, rAF, progresso linear — decodifica na entrada
- **Números sob NDA ficam permanentemente embaralhados**: `PlayTime/Play: +@&?&?$%`. Resolve "não posso mostrar o número" com estilo em vez de omissão
- Glow radial verde acompanhando a seção, no canto

### 4. `/vibe-coding` — Lab

Carrossel horizontal de **12 experimentos** com scroll vertical sequestrado, paginação
por pontos, e metadados nos cantos (título / subtítulo em itálico / data / `Concept V1.0`).
Slides: ASCII-art generator, 3D text generator, **"Animation Gallery — Transition
explorations"**, TikTok.com Long Video UI, Gesture control feed…

> O slide "Animation Gallery" é um **dial radial com transições nomeadas**: Shockwave
> Grid, Prism Light Sweep, Liquid Chrome Melt, Iridescence Light Bleed, Kaleidoscope
> Bloom, Glass Lens Pulse, Pixel Dust Fade… Ele **prototipou um catálogo de transições
> e embarcou uma delas como a transição do próprio site.** É esse o movimento que faz o
> site ler como "esse cara sabe o que faz" — não a transição em si.

## A transição de rota (o achado principal)

`<canvas>` fixo, viewport inteira, `z-index: 9999`, `pointer-events: none`,
`aria-hidden`. **Não é three.js** — é um wrapper GL próprio com um quad fullscreen.
O fragment shader veio **não-minificado, com os comentários do autor**:

```glsl
uniform float uProgress, uAlpha, uBandTight, uPosStart, uPosEnd;
uniform float uHueShift, uDirection;    // 0 = horizontal, 1 = vertical
uniform float uWaveAmount, uRippleAmount, uWaveSpeed;
uniform float uBrightness, uSwellAmount;
uniform vec3  uPalA, uPalB, uPalC, uPalD;   // paleta cosseno (Inigo Quilez)

vec3 pal(float t, vec3 a, vec3 b, vec3 c, vec3 d){
  return a + b*cos(6.28318*(c*t + d));
}
```

Como funciona: uma **faixa gaussiana** (`band = exp(-d*d*uBandTight)`) atravessa a tela;
a borda ondula com três senóides somadas; a inclinação analítica da faixa vira uma
**normal sintética** que rotaciona o matiz — "o truque que lê como a iridescência do
name-drop do iOS", nas palavras dele. Mais: specular `pow(NdotH, 80)`, fresnel,
rastro (`trail`), e `entryFade` que segura a faixa em 20 % de alpha ao entrar/sair
(`mix(0.2, 1.0, 4*p*(1-p))`).

**A faixa cobre a viewport inteira de ponta a ponta de propósito** — o comentário diz:
"para esconder a UI fixa (tabs, toggles) durante a varredura". Ou seja: **a troca de
conteúdo acontece embaixo da faixa**. Não existe crossfade; existe um objeto que passa
na frente. É por isso que parece instantâneo e caro ao mesmo tempo.

Custo: um quad, um shader de ~120 linhas, zero geometria. Roda em qualquer GPU.

Entrar num case usa outra transição: **tela preta + linha branca fina que expande na
horizontal** (wipe), depois o conteúdo.

## Dark ≠ light: são dois desenhos

O toggle grava `localStorage.theme` e troca `body.dark`. Mas **não é troca de tokens**:
no claro o relógio vira uma roda de cores Bauhaus (azul/magenta/ciano), o Mode switch
vira um círculo laranja sólido, o globo inverte para pontos escuros em branco, o radar
fica pastel, o moodboard troca de imagens. Cada widget tem **dois desenhos**.

## O que ele faz que eu não tinha visto

1. **A transição é um objeto que passa na frente**, não um crossfade.
2. **Minimap do documento** no case — orientação em 20 px de largura.
3. **Scramble como redação de NDA** — número censurado vira estética.
4. **Lab alimenta o site**: catálogo de transições nomeadas → uma delas embarcada.
5. **Densidade de dado real** sem hover: o site é vivo sozinho.
6. **Legenda fora do card** na grade de projetos (título embaixo-esquerda, disciplinas embaixo-direita) — lê como catálogo, não como e-commerce.

## O que está quebrado (e nós não vamos copiar)

| Problema | Evidência |
|---|---|
| **SEO inexistente** | CSR puro, `<title>` único "Yi's Portfolio" em todas as rotas, sem `meta description`, sem OG, **sem sitemap**. Um case de 14 mil px não é indexável |
| **Acessibilidade** | Cards de projeto não são `<a>` nem `<button>` — não existem no a11y tree, sem foco, sem teclado |
| **Performance** | 7 vídeos tocando simultaneamente no case; `preload="metadata"` sem pausa fora da viewport. Bundle único de 1.26 MB, sem code-splitting. (A captura de tela do case chegou a estourar o timeout de 5 s no meu browser) |
| **`prefers-reduced-motion`** | Nenhuma regra no CSS; não achei tratamento no bundle |
| **Cases incompletos** | 6 dos 9 cards não abrem nada |

> Isso é o oposto da posição do nosso portfólio (Next.js, SSR, i18n, sitemap, JSON-LD,
> Lighthouse ≥ 90). **Dá para ter a mesma impressão de entrada com SSR e a11y intactos**
> — a transição shader e o minimap não custam SEO; os 7 vídeos e o CSR custam.

## Anexo — as outras duas referências, medidas

Levantado em 2026-09-22 no CSSOM dos sites, para o briefing de layout.

### p5aholic.me — sistema inteiro em 4 variáveis

```css
--c-bg: hsl(0,0%,5%);  --c-text: hsl(0,0%,95%);
--fs-text: 12px;       --pad: max(20px, 4vmin);
```

Uma única curva: `cubic-bezier(0.1, 0.4, 0.2, 1)`; duas durações (0.4s, 0.9s).

- **Peso invertido:** corpo 12px/600, título do site 30px/**200**. O contraste
  vem do peso, não do tamanho.
- Moldura de 4 linhas de 1px brancas a `opacity: .5`, recuadas por `--pad`.
- Header `fixed` com **`mix-blend-mode: difference`** — legível sobre as
  partículas que mudam atrás.
- Nav: item selecionado some (`opacity: 0`) e um `●` aparece no lugar.
- Toggles de tema e de fonte usando os caracteres `□`/`■`, sem SVG.
- 29 projetos alinhados à direita, `6.5vw` em peso 200, `row-gap: 30px`, com
  `text-box: cap alphabetic` para corte óptico.
- Páginas de personalidade além do óbvio: **FAQ** e **Copycats**.

### itssharl.ee — 10 variáveis

```css
--background-color: #2b2b33;  --color: #f3f2f9;
--border: 1.5px;              --border-radius: 24px;
--left-right-margin: 48px;    --left-right-internal-margin: 24px;
--top-margin: 132px;          --top-margin-mobile: 40vh;
```

- `/work` em **50/50**: painel de imagem à esquerda, lista à direita com scroll
  interno e `scrollbar-width: none`. Linha com `padding: 1.5rem 0` e filete.
- Cursor: anel 24px + ponto 4px, `mix-blend-mode: difference` no escuro e
  `multiply` no claro.
- Preloader com voz: "Materializing shapes…" + "Designed and coded by Sharlee".
- Transição usa `filter: blur()` no **wrapper** do canvas, não no render.
- Não copiar: `border-radius: 24px` morfando conflita com nossos raios de 2–4px.

---

## Prioridade de adoção

| Ideia | Custo | Impacto | Onde |
|---|---|---|---|
| **Transição iridescente em canvas** (versão oxblood, não arco-íris) | Baixo (~120 linhas GLSL + quad) | **Muito alto** | Global, sobre `template.tsx` |
| **Barra de telemetria** viva (já em [spec §4](spec-v3-motion.md)) | Baixo | Alto | Footer |
| **Scramble/decode** em números e títulos | Baixo | Médio-alto | Métricas dos cases |
| **Minimap do documento** | Baixo | Médio-alto | `/trabalho/[slug]` |
| **Legenda fora da capa** no índice | Zero | Médio | `IndexList` |
| **Light mode como segundo desenho** | Alto | Médio | Depois do lançamento |
| **Lab como catálogo de transições** | Médio | Alto (narrativa) | `/lab` |
| Vídeo em loop nas capas | Médio | Alto — **mas** exige encoding e orçamento de rede | Só após Lighthouse fechar |
