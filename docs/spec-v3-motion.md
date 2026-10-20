# Spec v3 — "Prensa": entrada, camada 3D persistente e linguagem de motion

> Objetivo: a primeira impressão do portfólio deve dizer, sem legenda, "quem fez
> isso sabe o que está fazendo". Não é decoração — é o produto demonstrando o
> ofício (front-end de interação, e-commerce, 3D, performance).
>
> Referências analisadas (mecanismo, não estética): xiangyidesign.com (instrumento
> vivo, widgets), p5aholic.me (uma matéria só, contínua entre rotas), itssharl.ee
> (fisicalidade/springs, preloader com voz). Ver §9.

---

## 0. Princípios (o que separa "craft" de "template")

1. **Continuidade.** Nada "some e aparece": a camada 3D vive no layout raiz e
   *muda de estado* por rota; a capa que você vê no índice é a mesma que vira o
   hero do case (shared element). A sensação de app, não de páginas.
2. **Fisicalidade.** Movimento responde a **velocidade**, não só posição: a
   chapa inclina proporcional à velocidade do cursor; solta com inércia; nada
   "teleporta". Springs criticamente amortecidos — sem bounce (regra do Pressroom).
3. **Uma matéria.** Um único material/objeto recorrente (a *chapa* — placa de
   impressão, ver §2) em vez de dez efeitos. Restrição é o que lê como autoria.
4. **Vivo em idle.** Relógio real, telemetria real do site, luz que respira.
   Um site parado por 5 segundos parece imagem; um que respira parece software.
5. **Vocabulário fechado.** Duas curvas (`--ease-premium`, `--ease-sym`), três
   durações (`micro 240 / reveal 760 / page 900`), um spring (`stiffness 170,
   damping 26`). Todo elemento novo usa isso ou não entra.
6. **Respeita o usuário.** `prefers-reduced-motion`, teclado, WebGL ausente,
   GPU fraca, mobile: cada um tem um caminho *desenhado*, não um "desliga tudo".
7. **Anti-padrões de IA (proibidos):** gradientes roxo/azul, glassmorphism,
   blobs, partículas sem função, hero "3D genérico flutuando", ícones Lucide em
   grade de features, bounce, copy "Crafting digital experiences".

---

## 1. Sequência de entrada (0 → 2.4 s)

O preloader não é um spinner: é a **composição da edição**. Copy mono, contador
real de assets (fontes + texturas + shaders), e a tela abre como uma prensa.

| t (ms) | O que acontece | Camada |
|---:|---|---|
| 0 | Fundo `--bg`. Canto inferior-esquerdo, mono: `COMPONDO EDIÇÃO 000` (EN: `TYPESETTING`). Contador vai de 000→100 **em ritmo real de carga**, com `tabular-nums`. Linha oxblood de 1px cresce da esquerda (progress). | DOM |
| 0–900 | R3F monta atrás, invisível (`opacity:0` no wrapper do canvas). Texturas das capas + envmap carregam. Fontes já vieram por `next/font` (sem FOUT). | WebGL |
| ~1000 | Contador chega a 100. Pausa de 120 ms (respiração). | DOM |
| 1120 | **Abertura**: duas máscaras (topo/base, `--bg`) recuam com `--ease-premium` 900 ms, revelando a cena. Não é fade — é a prensa abrindo. | DOM |
| 1200 | Chapas entram: vêm de `z = -6`, `rotation.x = 0.35`, com stagger 70 ms entre elas, spring. Luz key acende de 0 → 1 em 700 ms (`easeOutExpo`). | WebGL |
| 1500 | Índice tipográfico: cada linha sobe por `clip-path`/translateY, stagger 60 ms. Tagline mono aparece por último (é "assinatura", não título). | DOM |
| 1900 | Telemetria (§4) liga: relógio começa a andar, FPS começa a medir. | DOM |
| 2400 | Estado *idle*: chapas flutuam com ruído lento (Float amplitude 0.08), luz respira ±6 % em 4 s. Cursor custom já ativo. | ambos |

**Regras**
- O preloader aparece **só na primeira visita da sessão** (`sessionStorage`).
  Navegação interna nunca mostra preloader — usa transição (§5).
- Mínimo 900 ms, máximo 2.6 s: se os assets demorarem mais, a cena abre com
  texturas em baixa (LOD) e troca sem cortar.
- LCP: o H1/índice é DOM e é renderizado no SSR; o canvas não bloqueia. As
  máscaras são `transform`-only (zero CLS).
- `prefers-reduced-motion`: sem contador; máscaras abrem em 300 ms com fade;
  chapas nascem no lugar; índice aparece em fade simples.

---

## 2. A "chapa" — o objeto-assinatura

Um único objeto recorrente: a **chapa de impressão** de cada case. Uma placa
fina (proporção 4:3 ou 3:2 conforme a capa), material "osso" fosco com a capa
impressa como textura, borda com chanfro e o filete oxblood — o mesmo filete
que já é marca no design system.

**Material**
- `MeshPhysicalMaterial`: `roughness 0.55`, `metalness 0.05`, `clearcoat 0.15`,
  `clearcoatRoughness 0.6`. Envmap de estúdio neutro (`drei/Environment`
  preset `studio`, intensidade 0.35) — sem reflexos espelhados.
- Capa: textura `sRGB`, 1024 px máx (Cloudinary `f_auto,q_auto,w_1024`).
  Enquanto carrega: placeholder = cor média da capa (extraída no build) —
  a chapa nunca aparece "branca".
- Borda: extrusão 12 mm com `bevelSize 0.02`; filete oxblood = plano emissivo
  `toneMapped:false` (já existe em `HeroObject.tsx`).
- Sombra: `ContactShadows` (já usado), opacidade 0.35, blur 2.4.

**Comportamento no índice (home)**
- Estado *idle*: as N chapas (N = cases publicados, 1 a 6) formam uma **pilha
  em leque** à direita da lista, levemente rotacionadas (`y ±0.12`, `z ±0.03`),
  como impressos saindo da prensa. Com 1 case: uma chapa só, maior. O leque é
  calculado por N — nunca depende de "ter 9 projetos".
- **Hover numa linha do índice** → a chapa correspondente vem à frente
  (`z +0.8`, spring), as outras recuam e escurecem (`emissive` cai, luz key
  desloca). A chapa **substitui o preview DOM atual** que segue o cursor:
  ela segue o cursor com `lerp 0.08` e **inclina pela velocidade** do ponteiro
  (`rotation.z = -vx * 0.0006`, `rotation.x = vy * 0.0006`, clamp ±0.25).
  Isso é o upgrade direto da assinatura v2 — de imagem 2D para objeto físico.
- **Leave** → volta ao leque com inércia (spring, ~600 ms para assentar).
- **Scroll** (Lenis) → o leque tem parallax leve (`y = scroll * -0.0004`) e a
  câmera dolly de 6.5 → 7.2 ao longo da home. Nada de scroll-jacking.
- **Ponteiro fora da lista** → parallax de câmera pelo ponteiro (já existe no
  hero v1: `lerp 0.05` em `rotation`).

**Fora da home**
- `/trabalho/[slug]`: a chapa do case fica **atrás do hero** do case, em
  ângulo de leitura (`rotation.x -0.08`), ocupando a metade direita, e some
  no scroll (fade + dolly) para não competir com o conteúdo. As outras chapas
  saem de cena.
- `/sobre`: uma chapa só, sem textura de capa — mostra o *verso*: um retrato
  ou texto mono impresso (nome, cidade, stack), como ficha técnica.
- `/lab`: cada experimento é uma chapa com conteúdo dinâmico (render-to-texture
  do próprio experimento, quando barato) — mostra que a matéria é *sistema*,
  não um asset.
- `/contato`: chapa em branco com o filete; ao enviar o form, "imprime" o
  texto enviado (efeito de tinta por `alphaMap` animado) — o único momento em
  que o 3D responde a input do usuário.

---

## 3. Linguagem de interação (DOM)

- **Cursor** (já existe): anel com `lerp 0.18`. Adicionar estados: `hover-row`
  (anel cresce 2.2× e some, sobra o ponto), `hover-3d` (anel vira crosshair
  mono fino quando sobre a chapa — sinal de "isso é manipulável"), `drag`
  (mão aberta/fechada em `/lab`).
- **Links/rows**: underline por `scaleX` a partir do ponto de entrada do cursor
  (esquerda se entrou pela esquerda, direita se pela direita). Seta `→` desliza
  4 px com `--dur-micro`.
- **Botões**: sem hover de cor; hover = `translateY(-1px)` + sombra 0 → 1.
- **Marquee de clientes**: velocidade responde ao scroll (`velocity * 0.4`),
  freia no hover com inércia (não para seco).
- **Header**: encolhe no scroll para uma barra de 40 px com o relógio (§4);
  logo troca de wordmark para monograma por `clip-path`.
- **Tema** (dark/light) e **Mono** (Satoshi ↔ JetBrains para o corpo): dois
  toggles mono no rodapé/header. A troca de tema é um `View Transition` com
  máscara circular a partir do toggle (crossfade circular, 600 ms). A existência
  dos toggles é *prova* de sistema.

---

## 4. Telemetria — "o site mostra as próprias vísceras"

Uma barra mono discreta (rodapé em desktop, atrás do menu no mobile) com dados
**reais**. É o equivalente do relógio/globo do xiangyi, mas com identidade de
engenheiro:

```
SÃO PAULO 14:32:07 -03  ·  BUILD a1f3c9e 22.09.26  ·  60 FPS  ·  LCP 1.1s  ·  WEBGL2 · DPR 2  ·  DISPONÍVEL Q4
```

- Relógio: `Intl.DateTimeFormat` com fuso fixo `America/Sao_Paulo`, tick por
  segundo com `tabular-nums`; dígitos trocam por `translateY` (odômetro).
- `BUILD`: `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` (7 chars) + data do deploy.
- `FPS`: média móvel de 60 frames do loop R3F. Abaixo de 45 → a cena
  reduz DPR sozinha e o número mostra isso acontecendo (o site se auto-regula
  *em público*).
- `LCP`: `PerformanceObserver` (`largest-contentful-paint`), valor medido no
  próprio visitante. Mostrar a métrica é declarar que ela importa.
- `WEBGL2 · DPR`: capacidades detectadas.
- Disponibilidade: vem do `siteConfig` (já existe `AvailabilityBadge`).

Tudo isso é barato (< 2 KB) e é o tipo de detalhe que um técnico nota em 3 s.

> **Entregue.** `src/lib/telemetry.ts` (medições) + `src/components/ui/Telemetry.tsx`
> (barra), hoje no rodapé — migra para a coluna direita quando a peça 3 da
> [composição](composicao.md) entrar. Regra que ficou valendo: **campo sem
> medição não é exibido**. Sem `PerformanceObserver`, sem WebGL ou sem hash de
> build, o campo some em vez de mostrar valor estimado — numa barra que se
> propõe a mostrar as vísceras do site, um número inventado derruba a
> credibilidade de todos os outros. O medidor de FPS só roda com a barra na
> tela e a aba em primeiro plano. Regressão: `scripts/telemetry-check.mjs`.
>
> Pendente do que o §4 previa: a auto-regulação de DPR quando o FPS cai — não
> existe cena 3D permanente ainda para regular.

---

## 5. Transições de rota

- **Índice → case**: clique numa linha → a chapa "sobe" e se alinha com a
  posição exata que o `ProjectCover` terá no case (FLIP: medir o `rect` do
  destino, converter para coordenadas de mundo com `viewport` do R3F,
  animar a chapa até lá em 700 ms `--ease-premium`, então trocar para o DOM
  `<img>` no mesmo frame — `opacity` cruzada de 80 ms). O usuário vê **um**
  objeto, não uma página nova.
- **Case → índice** (back): inverso; a chapa desce para o leque.
- **Demais rotas**: `template.tsx` já faz `page-enter`; adicionar `page-exit`
  com `clip-path` (cortina vertical 500 ms) e a cena 3D interpola de estado em
  paralelo (600 ms) — DOM e WebGL sob o **mesmo** timeline GSAP.
- **Entregue (E1):** a troca de rota é coberta pela faixa iridescente oxblood
  (`src/lib/sweep.ts`). Um `<canvas>` fixo em `z-80`, quad fullscreen, shader de
  faixa gaussiana com normal sintética e paleta cosseno presa ao vermelho. O
  véu que viaja junto sobe até ~0.97 de alpha no meio do percurso — é nesse
  instante que `router.push` dispara e o scroll é zerado, então a página nova
  nunca aparece "chegando". Ritmo: 520 ms para cobrir, espera pela rota (teto
  700 ms), 620 ms para revelar.
- A interceptação é um listener de clique em fase de captura no documento, não
  um wrapper de `<Link>`: qualquer âncora interna entra na transição sem ter
  que lembrar disso. `data-no-sweep` é a saída.
- Sem WebGL, com `prefers-reduced-motion`, com modificador, alvo externo,
  download ou âncora na mesma página, o clique **não é interceptado** — segue o
  caminho nativo. Degradar aqui é não fazer nada.
- Voltar/avançar: o navegador já trocou a rota antes de podermos cobrir, então
  a faixa passa no sentido inverso sobre o conteúdo já trocado.
- Ainda por fazer: a cena 3D interpolando de estado sob a mesma faixa, e o
  `filter: blur` no wrapper do canvas 3D (truque do itssharl.ee).

---

## 6. Arquitetura técnica

```
src/
├── app/[locale]/layout.tsx      # + <SceneRoot/> (Canvas persistente, z -1) + <Preloader/>
├── components/three/
│   ├── SceneRoot.tsx            # Canvas único, luzes, envmap, ContactShadows, FpsMeter
│   ├── Plate.tsx                # a chapa (geometry+material+textura), props: cover, index
│   ├── PlateStack.tsx           # leque; lê sceneStore.plates + hover; layouts por N
│   ├── usePlateFollow.ts        # cursor-follow + tilt por velocidade (substitui quickTo do IndexList)
│   └── sceneStore.ts            # zustand: route, hoveredSlug, plates[], transition, quality
├── components/fx/
│   ├── Preloader.tsx            # contador + máscaras; emite 'ready' para o conductor
│   ├── Conductor.ts             # timelines GSAP nomeadas (enter, routeChange, themeSwitch)
│   ├── Telemetry.tsx            # §4
│   └── Cursor.tsx               # + estados
├── lib/
│   ├── quality.ts               # detect-gpu + WebGL2 + DPR → tier: off | lite | full
│   └── motion.ts                # constantes: EASE, DUR, SPRING (fonte única; CSS lê via :root)
```

**Decisões**
- **Um `<Canvas>` só**, no layout, com `frameloop="demand"` em idle e
  `invalidate()` em hover/scroll/transição — GPU dorme quando nada muda.
  A "respiração" em idle roda a 20 fps (throttle) para custar quase nada.
- **Store compartilhada (zustand)** entre DOM e R3F: o `IndexList` só escreve
  `hoveredSlug`; a cena reage. Zero re-render do React por mousemove
  (`useFrame` lê `store.getState()`).
- **GSAP como maestro** de tudo que tem *sequência* (entrada, rotas); springs
  em `useFrame` (`maath/easing.damp3`) para tudo que é *contínuo* (follow,
  tilt, parallax). Lenis já existe: sincronizar `gsap.ticker` com `lenis.raf`.
- **Texturas**: `useTexture` com suspense; KTX2 não (custo de pipeline alto
  para 6 imagens); JPEG 1024 progressivo via Cloudinary. Preload no preloader
  (§1) — o contador é real porque espera essas promessas.
- **Sem pós-processamento** (bloom/DOF): o grain já existe em DOM; o look
  fosco vem do material, não de passes.
- **Quality tiers** (`lib/quality.ts`):
  - `full`: desktop, WebGL2, GPU tier ≥ 2 → tudo, DPR ≤ 2.
  - `lite`: mobile bom / GPU tier 1 → 1 chapa, DPR 1, sem envmap, sem
    ContactShadows, sem follow (touch não tem hover); parallax por
    `deviceorientation` opcional (pedido de permissão só em iOS se tocar).
  - `off`: reduced-motion, sem WebGL, ou `saveData` → fallback DOM atual
    (o `idx-preview` 2D que já existe) — **não é degradação, é a v2**, que já
    é boa. Ninguém vê tela quebrada.
- **Orçamento**: chunk 3D ≤ 180 KB gz (three tree-shaken + R3F + drei
  parcial); carregado por `dynamic(..., {ssr:false})` depois do LCP.
  Lighthouse mobile ≥ 90 mantido porque no mobile o tier é `lite`/`off`.

---

## 7. Acessibilidade e degradação (não negociável)

- Tudo do 3D é `aria-hidden`; o índice é a fonte semântica.
- Teclado: `focus` numa linha = mesmo estado visual do hover (chapa à frente,
  ancorada — sem follow).
- `prefers-reduced-motion`: caminho descrito em cada seção; global: durações
  ÷ 3, sem springs, sem parallax, sem respiração.
- Preloader tem `aria-busy` no `main` e `role="status"` no contador; não
  prende foco.
- Erro de WebGL em runtime (context lost) → `onContextLost` cai para tier
  `off` sem recarregar.

---

## 8. Plano de produção

Cada fase fecha com screenshot/vídeo via `scripts/screenshot.mjs` (Playwright)
e Lighthouse CI (`lighthouserc.json`). Ordem pensada para que **cada fase
entregue valor sozinha** e o site continue publicável entre elas.

| Fase | Entrega | Depende | Esforço |
|---|---|---|---|
| **A. Fundação de motion** | `lib/motion.ts` (fonte única de ease/dur/spring), `sceneStore`, `Conductor` com timeline `enter`; Lenis ↔ GSAP ticker; `quality.ts`. Nada visível ainda. | — | 1 sessão |
| **B. Entrada** | `Preloader` com contador real + máscaras; índice entrando por stagger via Conductor; sessionStorage; reduced-motion. **Sem 3D** — já muda a primeira impressão. | A | 1 sessão |
| **C. Cena persistente** | `SceneRoot` no layout, `Plate` com material e textura, `PlateStack` em leque por N, luz que respira, `frameloop="demand"`. Entrada das chapas ligada ao Conductor. | A, B | 2 sessões |
| **D. Índice ↔ chapa** | Hover → chapa à frente; follow + tilt por velocidade; recua com inércia; teclado ancorado; substituir `idx-preview` no tier `full` (mantê-lo nos outros). | C | 1–2 sessões |
| **E1. Faixa iridescente** ✅ | **Entregue.** `lib/sweep.ts` (shader + GL), `fx/Sweep.tsx` (interceptação de navegação), reset de scroll sob o véu, `scripts/sweep-frames.mjs` e `scripts/sweep-check.mjs`. Independe de 3D e de ter 3 cases. | — | feito |
| **E2. Transições (resto)** | FLIP chapa → `ProjectCover`; estados por rota (`/sobre`, `/lab`, `/contato`) interpolando sob a mesma faixa. | C, D, E1 | 2 sessões |
| **F. Telemetria + toggles** | Barra mono (§4); toggle tema com View Transition circular; toggle mono; header que encolhe com relógio. | B | 1 sessão |
| **G. Mobile + perf + QA** | Tier `lite` desenhado (não só "menos"); Lighthouse ≥ 90; vídeo da entrada; ajuste fino de timing com o vídeo do lado (é aqui que 30 % do "craft" acontece). | tudo | 1–2 sessões |

Total: ~10 sessões de trabalho focado. Fases B e F são baratas e já mudam a
percepção; C–E são o investimento real.

**Assets a produzir (você)**
- Capas em proporção fixa (3:2, ≥ 1600 px) — a chapa usa a mesma imagem que o
  case; sem capa boa não há chapa boa. Hoje só LIVRA está publicado: a v3
  funciona com 1 chapa, mas a **pilha** só existe com ≥ 3 (mesmo DoD do README).
- Opcional: retrato para o verso da chapa em `/sobre`.
- Copy do preloader PT/EN (uma linha) e da telemetria.
- Se quiser objetos 3D além da chapa (ex.: produto de um case de e-commerce
  como GLB): modelo ≤ 2 MB, Draco, UVs prontas — entra como *variação* da
  chapa no case específico, não como sistema.

---

## 9. O que foi aprendido de cada referência (e o que NÃO copiar)

**xiangyidesign** → teardown completo em [teardown-xiangyidesign.md](teardown-xiangyidesign.md)
(4 páginas, bundle, shaders extraídos). *Liveness* e densidade de coisas reais
(relógio, globo Fibonacci, typewriter, moodboard rotativo) — nenhuma delas reage a
hover: o site é vivo sozinho. Trazemos: telemetria (§4), respiração em idle,
header-relógio, **transição iridescente em canvas** (ver adendo abaixo), **minimap do
documento** no case, **scramble como redação de NDA**, legenda fora da capa no índice.
Não copiamos: o bento/dashboard (já testado e descartado no commit `7d39e0e`
— conflita com a decisão "a lista é o hero"), a fonte dot-matrix, nem o CSR puro
(ele não tem SSR, sitemap, meta por rota, foco por teclado nos cards, nem
`prefers-reduced-motion`; nosso portfólio não abre mão disso).

> **Adendo — a transição dele é o achado principal.** Não é crossfade: é um `<canvas>`
> fixo em `z-index:9999`, `pointer-events:none`, com um quad fullscreen e um shader de
> faixa gaussiana iridescente que **cobre a viewport inteira enquanto o conteúdo troca
> embaixo**. Custo: ~120 linhas de GLSL, zero geometria, sem three.js. Isso entra na
> **Fase E** no lugar do `blur` do itssharl.ee (ou junto), em oxblood no lugar do
> arco-íris. E a origem dela é o `/lab` dele: um catálogo de transições nomeadas do qual
> ele embarcou uma — é esse movimento (lab → produto) que lê como autoria.

**p5aholic** → uma matéria só, contínua entre rotas; preloader como abertura;
toggles como prova de sistema. Trazemos: chapa como matéria única (§2),
estados por rota, máscaras de abertura (§1), toggles (§3). Não copiamos:
partículas (é a assinatura dele; e o custo/benefício de fazer *melhor* é ruim).

**itssharl.ee** → springs e velocidade (fisicalidade), blur no canvas nas
transições, cursor com estados, voz na copy do loader. Trazemos: tilt por
velocidade (§2), blur (§5), estados do cursor (§3), copy do preloader com voz.
Não copiamos: border-radius morfando (lê como "web design 2022"), Framer
Motion (já temos GSAP + R3F; não faz sentido somar uma terceira lib de motion).

---

## 10. Como saber se deu certo

- Um dev sênior abre o site e, antes de ler qualquer texto, **passa o mouse
  na lista** só para ver a chapa reagir de novo. (Teste de corredor: 5 pessoas.)
- Vídeo de 10 s da entrada + hover se sustenta sozinho no LinkedIn/Twitter
  sem legenda.
- Lighthouse mobile ≥ 90; desktop 60 fps estável com 6 chapas; tier `off`
  indistinguível da v2 atual.
- Nenhum item da lista de anti-padrões (§0.7) presente.
