> **Superado em 2026-09-22** pela direção "Folha" — ver [direcao-folha.md](direcao-folha.md).

# Briefing de layout — portfólio João Pedro Gaspar

> **Para quem vai desenhar o próximo layout.** Este documento é autossuficiente:
> não presume nenhuma conversa anterior. Ele reúne (1) o sistema visual que já
> existe e deve ser respeitado, (2) as três referências destrinchadas com
> números medidos no código-fonte delas, (3) as decisões já tomadas e o que é
> inegociável, (4) o que já está construído e não pode ser jogado fora, e (5) o
> que falta de conteúdo — que é a restrição que mais molda o desenho.
>
> Documentos irmãos: [teardown-xiangyidesign.md](teardown-xiangyidesign.md)
> (destrinchamento completo da referência principal),
> [composicao.md](composicao.md) (inventário e direção escolhida),
> [spec-v3-motion.md](spec-v3-motion.md) (movimento e camada 3D).

---

## 1. O produto, em uma frase

Portfólio de um **engenheiro front-end** (e-commerce, headless/Shopify
Hydrogen, interação). Não é site de venda de freela: é vitrine de qualidade
técnica. O público-alvo é quem contrata engenheiro sênior — e a primeira coisa
que essa pessoa julga é se o site parece feito por alguém que sabe o que está
fazendo, ou por um template.

**O briefing do João, textual:** *"quero causar uma impressão forte ao entrar,
mostrar que não foi feito por IA simplesmente, mas que foi algo que realmente
precisa saber o que tá fazendo."*

Stack: Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 ·
next-intl (PT default, EN em `/en`) · Firebase/Firestore · Cloudinary · Vercel.
Orçamento de performance: **Lighthouse ≥ 90 mobile**.

---

## 2. Sistema visual atual — "Pressroom"

Este é o conjunto que **deve ser mantido**. A paleta não está em discussão; o
layout está.

### 2.1 Cor (valores exatos, tema escuro é o dominante)

| Token | Escuro | Claro | Uso |
|---|---|---|---|
| `--bg` | `#1B1A17` | `#F2EFE9` | fundo; grafite **quente**, nunca cinza neutro |
| `--raised` | `#232019` | `#FFFFFF` | superfície elevada |
| `--line` | `#3A362D` | `#DAD4C8` | filetes e divisórias |
| `--fg` | `#EDE8DE` | `#1B1A17` | texto principal (osso, não branco) |
| `--muted` | `#B7B1A4` | `#6E685C` | texto secundário |
| `--stone-400` | `#A69F91` | `#A69F91` | texto terciário |
| `--stone-600` | `#6E685C` | `#8B8373` | detalhe fraco |
| `--accent` | `#7C2D2D` | `#7C2D2D` | **oxblood/bordô** — não é terracota |
| `--accent-lift` | `#A84343` | `#9A3838` | acento em estado ativo/hover |

O acento é usado com parcimônia: rótulos mono, filete de marca, estado ativo.
Nunca como fundo de bloco grande.

### 2.2 Tipografia

- **Display:** Clash Display (500, 600) — títulos
- **Corpo:** Satoshi (400, 500, 700)
- **Mono:** JetBrains Mono (400, 500) — rótulos, ficha técnica, telemetria

Escala existente (razão ~1.25):

| Classe | Tamanho | Peso | LH | Tracking |
|---|---|---|---|---|
| `.text-display-xl` | `clamp(3.5rem, 8vw, 8rem)` | 600 | 0.95 | −0.02em |
| `.text-display` | `clamp(2.5rem, 5vw, 4rem)` | 600 | 1.02 | −0.02em |
| `.text-h2` | `clamp(1.75rem, 3vw, 2.5rem)` | 600 | 1.1 | −0.01em |
| `.text-h3` | `1.5rem` | 500 | 1.2 | — |
| `.text-label` | `0.8125rem` mono | — | — | +0.08em, uppercase |

### 2.3 Forma e movimento

- Raios: `2px` / `3px` / `4px`. **Nada arredondado além disso.**
- Curvas: `--ease-premium: cubic-bezier(0.16, 1, 0.3, 1)` (entradas) e
  `--ease-sym: cubic-bezier(0.65, 0, 0.35, 1)` (simétricas).
- Durações: `--dur-micro: 240ms` · `--dur-reveal: 760ms` · `--dur-page: 900ms`.
- **Sem bounce, sem back, sem overshoot.** Nunca.
- Container: `max-width: 1280px`, padding `24px / 32px / 48px`.

### 2.4 Anti-padrões proibidos

Gradientes roxo/azul · glassmorphism · blobs · partículas sem função · hero
"3D genérico flutuando" · ícones de biblioteca em grade de features · bounce ·
sombras difusas grandes · copy tipo "Crafting digital experiences".

---

## 3. As três referências, medidas

Tudo abaixo foi lido do código-fonte e do CSSOM dos sites, não de impressão
visual. **Interessa o mecanismo, não a estética** — não queremos parecer com
nenhum dos três.

### 3.1 xiangyidesign.com — referência principal

Destrinchamento completo em [teardown-xiangyidesign.md](teardown-xiangyidesign.md).
Resumo do que importa para o desenho:

**Estrutura:** duas telas (Dashboard ⇄ Project) alternadas por um **dock fixo**
no rodapé central. Sem recarregar. Mais 3 páginas de case profundas.

**Dashboard:** bento de 11 widgets, todos com **dado real e em movimento**:
relógio de segundo em segundo, globo three.js trocando de cidade a cada ~3 s,
typewriter no cargo, moodboard rotativo a cada ~3,5 s, radar de habilidades,
marquee de clientes. Em idle, **nada fica parado**.

**Hover nos cards do dashboard: não existe.** O site inteiro tem **7 regras
`:hover` e 7 de animação** no CSS — a vida é *ambiente*, não reativa a ponteiro.
Todo o resto do movimento é Framer Motion (`layoutId` ×31, `drag` ×13).

**Grade de projetos:** masonry irregular, cada card é um `<video>` autoplay/loop/
muted, e a **legenda fica fora do card** (título embaixo à esquerda, disciplinas
embaixo à direita). Isso é o que faz ler como catálogo em vez de e-commerce.

**Case (14.000 px):** três camadas fixas — nav lateral de seções com scrollspy,
**minimap do documento** à direita (45 tracinhos com as larguras dos blocos
reais) e coluna de conteúdo de 744 px. No corpo: slider before/after arrastável,
tabelas, vídeos. Métricas sob NDA aparecem **permanentemente embaralhadas**
(`+@&?&?$%`) — censura virou estética.

**Transição de rota (o achado principal):** um `<canvas>` fixo em
`z-index: 9999`, `pointer-events: none`, com um quad fullscreen e um shader de
**faixa gaussiana iridescente**. O comentário do autor, deixado no bundle, diz
que ela cobre a viewport inteira de propósito *"para esconder a UI fixa durante
a varredura"* — ou seja, **a troca de conteúdo acontece embaixo da faixa**.
Custo: ~120 linhas de GLSL, zero geometria, sem three.js.

**De onde ela veio:** o `/vibe-coding` dele é um carrossel de 12 experimentos,
e um dos slides é uma *Animation Gallery* com um dial de transições nomeadas
(Shockwave Grid, Prism Light Sweep, Liquid Chrome Melt, Iridescence Light
Bleed…). **Ele prototipou um catálogo e embarcou uma no próprio site.** Esse
movimento — lab alimenta produto — é o que mais lê como autoria.

**Tema claro não é troca de tokens:** o relógio vira roda de cores Bauhaus, o
globo inverte, o toggle vira círculo laranja. Cada widget tem **dois desenhos**.

**O que ele paga:** CSR puro (Vite), `<title>` único em todas as rotas, sem meta
description, **sem sitemap**; cards de projeto não são `<a>` nem `<button>` (não
existem na árvore de acessibilidade, sem foco por teclado); 7 vídeos tocando ao
mesmo tempo; nenhuma regra de `prefers-reduced-motion`; 6 dos 9 cards não abrem
nada. **Nada disso é aceitável aqui.**

### 3.2 p5aholic.me — a lição é restrição

**O sistema de design inteiro dele são quatro variáveis:**

```css
--c-bg:   hsl(0, 0%, 5%);       /* #0d0d0d */
--c-text: hsl(0, 0%, 95%);
--fs-text: 12px;
--pad:    max(20px, 4vmin);
```

E **uma única curva**: `cubic-bezier(0.1, 0.4, 0.2, 1)`, com duas durações
(`0.4s` e `0.9s`). Isso é tudo.

**Tipografia:** Neue Montreal. Corpo a **12 px em peso 600**; título do site a
**30 px em peso 200**. O contraste não vem de tamanho, vem de **peso invertido**
— texto pequeno é pesado, texto grande é ultraleve. É a assinatura tipográfica
dele.

**Moldura:** quatro linhas de 1 px brancas a `opacity: 0.5`, recuadas por
`--pad` em todos os lados. A página inteira vive dentro dessa moldura.

**Header:** `position: fixed` com **`mix-blend-mode: difference`** — é por isso
que ele permanece legível sobre as partículas que mudam atrás.

**Nav:** o item selecionado tem o texto em `opacity: 0` e um `●` aparece no
lugar. Não há sublinhado, não há cor de estado.

**Toggles:** tema (Light/Dark) e fonte (Monospaced) usando os caracteres `□` e
`■` como indicador — zero SVG. A existência dos toggles é prova de sistema.

**Lista de projetos (29 itens):** alinhada à **direita**, `font-size: 6.5vw`,
`font-weight: 200`, `row-gap: 30px`, metadados a 12 px logo abaixo. Usa
`text-box: cap alphabetic` para corte óptico — detalhe de quem sabe.

**Páginas de personalidade:** além de Home/Projects/Info/Contact, ele tem
**FAQ** e **Copycats**. Custam texto, não código, e são o que mais diferencia.

### 3.3 itssharl.ee — fisicalidade

**Sistema:** dez variáveis.

```css
--background-color: #2b2b33;   --color: #f3f2f9;
--border: 1.5px;               --border-radius: 24px;
--left-right-margin: 48px;     --left-right-internal-margin: 24px;
--top-margin: 132px;           --top-margin-mobile: 40vh;
```

**Layout de `/work`:** divisão **50/50** — painel de imagem à esquerda, lista à
direita com scroll interno (`scrollbar-width: none`). Cada linha tem
`padding: 1.5rem 0` e filete embaixo. Hover numa linha → a capa correspondente
aparece à esquerda com escala, e um `→` entra antes do título.

**Cursor:** anel de 24 px + ponto de 4 px, `mix-blend-mode: difference` no tema
escuro e `multiply` no claro.

**Preloader:** contador com a frase *"Materializing shapes…"* e crédito
*"Designed and coded by Sharlee"* — o loader tem **voz**, não é spinner.

**Transição:** `filter: blur()` no *wrapper* do canvas (não no render) — barato.

**Não copiar:** o `border-radius: 24px` morfando lê como "web design 2022" e
conflita com nossos raios de 2–4 px.

### 3.4 Quadro comparativo

|  | xiangyi | p5aholic | itssharl.ee | **nós hoje** |
|---|---|---|---|---|
| Modelo | 2 telas + dock | página única com seções | site clássico + menu | site clássico |
| Variáveis de design | muitas | **4** | 10 | 9 cores + 5 escalas |
| Curvas de easing | — (JS) | **1** | — | 2 |
| Projetos | 9 (3 com case) | 29 | 9 | **1 publicado** |
| Experimentos | 12 rodando | a home é um | — | **0** |
| Vídeo | sim, muito | não | sim | **0** |
| SSR/SEO | **não** | não | sim | **sim** |
| Teclado/a11y | **não** | parcial | parcial | **sim** |

---

## 4. Decisões já tomadas — inegociáveis

1. **O índice tipográfico é o protagonista.** A home é um índice de casos, não
   uma grade de cards. Já houve uma tentativa de bento/dashboard e ela foi
   **revertida** (commit `7d39e0e` → `ecb63c1`) porque o índice virou "mais um
   card". Qualquer proposta nova mantém o índice ocupando **≥ 60 %** da largura
   em desktop.
2. **Não é card.** Blocos são separados por filete, no vocabulário do índice.
   Cartão flutuante com borda arredondada e sombra está fora.
3. **Direção escolhida: "Mesa de trabalho"** — índice à esquerda, três blocos
   vivos à direita (AGORA · CLIENTES · TELEMETRIA), dock fixo alternando
   Índice ⇄ Lab. Detalhe em [composicao.md](composicao.md) §5. Uma proposta
   diferente é bem-vinda, mas precisa argumentar contra esta.
4. **Três blocos, não onze.** Bloco sem dado verdadeiro é removido, não
   preenchido com placeholder.
5. **Nada de degradação silenciosa.** Todo efeito tem caminho desenhado para
   `prefers-reduced-motion`, teclado, sem WebGL e mobile.
6. **SSR, sitemap, metadata por rota e foco por teclado não se negociam** — é
   o que separa este site das referências.

---

## 5. O que já está construído (não jogar fora)

| Peça | O que é | Onde |
|---|---|---|
| **Índice interativo** | Lista tipográfica; hover numa linha → preview segue o cursor (`gsap.quickTo`, sem re-render). Teclado e reduced-motion → preview ancorado. | `components/work/IndexList.tsx` |
| **Transição de rota** | Faixa iridescente oxblood em WebGL: quad fullscreen + shader de faixa gaussiana com normal sintética e paleta cosseno presa ao vermelho. O véu sobe a ~0.97 de alpha e **a rota troca escondida**. Ritmo constante de 1080 ms. | `lib/sweep.ts` + `components/fx/Sweep.tsx` |
| **Telemetria** | Barra mono no rodapé: hora de São Paulo ao vivo, hash/data do build, FPS medido, LCP deste visitante, WebGL/DPR. **Campo sem medição não aparece.** | `lib/telemetry.ts` + `components/ui/Telemetry.tsx` |
| **Bloco AGORA** | Emprego atual e o que está sendo construído, com data de atualização visível e guarda de frescor no CI. | `data/now.ts` + `components/work/NowBlock.tsx` |
| **Minimap do case** | Coluna fixa à direita; posição de cada traço é a posição real do bloco no documento; headings navegáveis por teclado. | `components/work/CaseMinimap.tsx` |
| **Cursor, grão, scroll suave** | Anel com lerp 0.18; noise a 3,5 % em overlay; Lenis lerp 0.09. | `components/fx/`, `providers/` |

Todas essas peças são **independentes de layout** — sobrevivem a qualquer
recomposição.

---

## 6. A restrição que mais importa: conteúdo

| Existe hoje | Quantidade |
|---|---|
| Cases publicados | **1** (LIVRA). DUX e Vivo aguardando autorização. |
| Imagens de case | **0** — a capa é moldura vazia |
| Vídeos | **0** |
| Experimentos rodando no `/lab` | **0** (3 cards só de texto) |
| Retrato em `/sobre` | **0** (moldura vazia) |
| Clientes listados | 15 nomes (Roland, Boss, Natura, Fuji Film, Integral Médica, Darkness…) |

As três referências carregam de **5 a 10 vezes** mais conteúdo. A composição
delas é consequência disso, não causa.

**Consequência para o desenho:** a proposta precisa funcionar **com 1–3 cases e
sem imagem**, e crescer bem até 6–9. Um layout que só fecha com nove capas
grandes não serve. O que faz um case sem imagem não parecer gerado é o corpo
ter **textura** — variação de largura entre texto e mídia, tabelas, métricas,
blocos de código — e não mais uma coluna uniforme.

---

## 7. O que se espera da proposta

1. **Home** — onde ficam índice, os três blocos vivos e o dock; como se
   comporta com 1, 3 e 9 cases; como empilha no mobile.
2. **Case (`/trabalho/[slug]`)** — hoje é o ponto mais fraco: duas colunas com
   ficha técnica *sticky*, que é a forma padrão de case study na web e lê como
   template. Precisa de larguras diferentes entre texto e mídia, ficha técnica
   que não seja card, e lugar desenhado para before/after, tabela e métrica.
   Diagnóstico completo em [composicao.md](composicao.md) §5.1.
3. **`/sobre` e `/lab`** — hoje são esqueleto (título + parágrafo, e uma grade
   de três cards de texto). O `/lab` deve virar o segundo estado do dock, com
   um experimento por vez rodando de verdade.
4. **Escala tipográfica revista**, se for o caso — a atual é competente e
   anônima; o contraste de peso do p5aholic (corpo pesado pequeno × display
   ultraleve grande) é um caminho que a Clash Display suporta.
5. **Onde o movimento entra.** A faixa de transição já existe; o resto do
   vocabulário de motion está em [spec-v3-motion.md](spec-v3-motion.md).

**Critério de sucesso, em uma frase:** um engenheiro sênior abre o site e,
antes de ler qualquer texto, passa o mouse na lista só para ver de novo o que
acontece — e nenhum item do §2.4 aparece na tela.
