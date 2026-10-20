# Direção "Folha" (2026-09-22) — substitui a Mesa de trabalho

> Este documento **substitui** as decisões de layout de
> [briefing-layout.md](briefing-layout.md) §2 e §4 e de [composicao.md](composicao.md) §5.
> O que continua valendo de lá: SSR, sitemap, metadata por rota, teclado e
> reduced-motion como piso; e a transição de rota (`lib/sweep.ts`).

## A ideia

O site é um jogo de **pranchas de desenho técnico**. Cada case é uma figura
(FIG. n) desenhada como prancha de patente — numerais de referência, linha de
chamada, linha oculta tracejada, eixo em traço-ponto, hachura de corte — que
mostra o **mecanismo** do projeto, não um print dele. A legenda ao lado da
figura acende a peça correspondente no desenho.

Por que isso e não a Mesa de trabalho: bento com telemetria, cursor custom,
grão, marquee de clientes, rótulo mono em caixa alta e Clash Display + Satoshi
é o kit que todo portfólio gerado reproduz. A única coisa que um gerador não
consegue produzir é o **específico**: o carrinho que atravessa dois domínios, as
seis fontes de catálogo que discordam. A figura é esse específico, desenhado.

## Sistema

- Papel `#ECEBE6` e tinta `#151412`. Um vermelho só (o oxblood da transição),
  usado como sinal — a peça em foco, a coisa que deu errado.
- Uma família: **Archivo** variável (peso 100–900, largura 62–125). Grande é
  fino, pequeno é pesado. A largura é reservada para estado (título ativo alarga).
- Mono (IBM Plex Mono) só onde o texto é código ou identificador.
- Moldura fixa com zonas 1–8 / A–F; rodapé é um carimbo (title block) com
  folha n/N, revisão = commit do build, hora de São Paulo.

## Layout por projeto

| Case | Forma | Peça interativa |
|---|---|---|
| Roland / Boss | título dividido no eixo; figura bilateral | CartLab: um carrinho vs. dois sincronizados, com a corrida reproduzível |
| Integral / Darkness | marcas empilhadas; vista explodida das camadas | cortina entre as duas vitrines + calculadora do desconto invertido |
| Livra | uma palavra gigante; convergência de fontes | reconciliação campo a campo + queda da CBL e a regra do cache vazio |

Case novo = uma figura em `components/figures/`, a legenda em `data/figures.ts`,
o slug em `components/figures/registry.ts`. Sem figura, o case não entra no
índice — de propósito.

## v2 (2026-09-22, mesma sessão)

- **Figuras narradas.** O loop solto (SMIL) virou sequência em passos
  (`components/figures/sequence.tsx`): cada passo tem duração, peças acesas e
  legenda; pacotes andam no ritmo do passo; anotações em código aparecem na
  hora certa. Controles ← ❚❚ → e régua de passos. Movimento reduzido: nada
  toca sozinho, cada passo aparece concluído. A home troca de figura quando a
  narração acaba — o traço vermelho do índice é esse progresso.
- **Carrinho otimista** na FIG. 1 (numeral 26): linha tracejada até o
  servidor confirmar.
- **Blueprint.** Tema escuro = cópia heliográfica: azul de cianotipia, giz,
  lápis vermelho do revisor, quadrícula visível. Sistema de cor → papel;
  escolha salva em `localStorage`, aplicada antes da pintura.
- **Livra** virou o case principal: números de escala (300 usuários no 1º
  mês, 3 plataformas, 203 functions, 1 pessoa), telas de produção anotadas com
  numerais (FIG. 3a–d), scanner gravado em aparelho (3e), temas (3f). Imagens
  em `public/livra/`, textos em `data/livra.ts`.
- **Quadro de desempenho** (`/performance`): réguas de LCP/INP/CLS com as zonas
  do Core Web Vitals em hachura e a mediana como agulha, e um quadro por loja
  (marca P-01…, mini-régua por métrica, tendência de 25 semanas). Dado: CrUX
  via `scripts/perf-crux.mjs` a partir de `data/perf-origins.json`. Enquanto
  `performance.json` for amostra, a página só existe em dev, com carimbo, e
  não entra no sitemap.

## v3 (2026-09-22, feedback do João)

- **Tema escuro = Grafite** (não azul): a paleta escura antiga, grafite quente
  com vermelho, quadrícula quase invisível. "Blueprint" foi rejeitado.
- **Bolinhas**: todo `Travel` segue uma linha desenhada; os trajetos que só
  existem num passo aparecem tracejados junto com ele. Entram e saem por
  opacidade. Estados (contagem, preenchimento) mudam com transição de 600–700 ms.
- **Posicionamento**: engenheiro Shopify de loja inteira (Liquid e headless),
  performance/SEO/dados estruturados. Sem "aberto a propostas": só contato e
  formulário (`/contact`, endpoint opcional `NEXT_PUBLIC_CONTACT_ENDPOINT`,
  senão mailto).
- **Sobre**: trajetória em corte de escada (estágio → júnior → líder de squad →
  solo em várias lojas por mês; certificação Shopify tracejada) e o Livra como
  torre separada (fundador). Datas sem confirmação ficam vazias.
- **Projetos** (`/projects`, antes "Lojas"): destaques grandes, o resto três
  por linha; cada projeto tem página própria em `/projects/[slug]` com o
  básico e o bloco de performance (nota + LCP/TBT/CLS em régua, com data).
  Substitui `/performance`. Capa da loja no ar
  (`scripts/covers.mjs`), escopo, e PageSpeed com data quando houver print.
  Painel de réguas só com ≥ 3 lojas medidas. Dados em `src/data/stores.ts`.
- **Método, não produto**: o jeito de trabalhar com uma base compartilhada
  vive em "How I work", na página Sobre, como conceito. Não é case, não tem
  figura, nome, comando nem regra interna.

## v5 (home e cursor)

- **Índice com print**: cada linha tem a miniatura do projeto (cor e logo
  da marca, ou o app em dois telefones) e o índice inteiro cabe na
  primeira tela — hover troca a figura sem rolar. A legenda do palco não
  aparece na home (fica nos cases).
- **Trabalho selecionado**: grade de ponta a ponta (uma capa grande + duas
  pequenas, alternando o lado), legenda fora da capa. Hover: marcas de corte
  e selo "Expandir". Clique: o cartão se expande (FLIP) num painel com a
  figura narrada (case) ou a print (projeto), resumo e ficha. O cartão segue
  sendo link (`data-no-sweep`); o painel vai para o `<body>` por portal
  (o transform do `.page-enter` prenderia o painel sob o cabeçalho).
- **Cursor**: retícula de desenhista com a zona da prancha (C·4); vira
  círculo com rótulo sobre clicáveis (`data-cursor`). Só com mouse; some em
  campo de texto.
- **Tema**: interruptor sol · trilho · lua, visível também no celular.
- Grafia: **Integralmédica** (junto).

## v6 (modal e faces)

- **Painel expandido**: abre por `clip-path` a partir do retângulo do cartão
  (Web Animations API), com um fantasma da capa se dissolvendo no lugar do
  cartão. Nada escala. Fechar reverte a animação de onde ela estiver. O
  scroll trava com `scrollbar-gutter: stable` (a página não pula) e o efeito
  de trava roda uma vez só.
- **Faces do cartão em /projetos**: `logo` (1ª face) → hover → `media`
  (imagem, GIF ou vídeo) ou a `cover`. Vídeo toca só no hover. Campos e
  formatos documentados em `src/data/stores.ts`; arquivos em `public/logos/`
  e `public/media/`.

## v7 (2026-10-19: alvo internacional e figuras para quem não é dev)

- **Alvo**: agências e empresas Shopify fora do Brasil. Número só do
  Livra (600 usuários no 1º mês); métrica de cliente nunca.
- **Currículo** em `/resume` (`data/resume.ts`), uma página Carta; o PDF é
  a impressão da página (`node scripts/resume-pdf.mjs`, avisa se passar de
  uma página).
- **Home**: três números no topo (lojas desde 2024 · 600 · fuso). Projetos
  têm `segment` (suplementos em destaque); Nuvemshop fica implícita
  (`platformLabel`). Cada case abre com "What I owned".
- **Figuras narradas em três atos** (FIG. 1 primeiro): problema → solução →
  descartado → resultado. Cada passo tem `title` (régua clicável), `plain`
  (legenda padrão) e `caption` (técnica). Botão Simples · Técnico, um só
  para o site (`useMode`, salvo no navegador). No modo simples as peças
  ganham nome (`Leader label`), as notas viram frase (`Note mode`) e o que
  anda tem etiqueta (`Travel tag`: o produto, a pessoa, "salvo"). As quatro
  figuras seguem o padrão; o descartado de cada uma sai do próprio case
  (dois carrinhos sincronizados · desconto calculado na vitrine ·
  arredondamento com decimais · uma fonte só). Onde não cabe nome na
  linha de chamada, o nome vai na peça: caixas da FIG. 3 (`Box plain`),
  cartões de fonte da FIG. 4.

## v8 (2026-10-19: mais "uau", sem sair da prancha)

- **Traço de plotter**: os traços de toda figura são plotados um depois do
  outro em 1,9 s, com uma pena em sinal percorrendo a linha (`usePlotter` em
  `figures/parts.tsx`). Texto e hachura entram no fim (`--plot-late`).
- **Lupa "Detalhe A"**: no hover com mouse, um círculo mostra a peça em 2,4:1,
  com o rótulo de escala. É o próprio desenho reutilizado (`<use>`), então o
  que anda na figura anda na lupa.
- **Scroll conduz a narração** nos cases (tela ≥ 1024 × 700, sem movimento
  reduzido): a prancha prende abaixo do cabeçalho e o passo segue o scroll;
  ←, → e a régua rolam a página até o passo. No celular, toca sozinha.
- **Mockups**: notebook com a primeira dobra e celular com a página inteira
  rolando (`components/sheet/DeviceMock.tsx`), no case, na página do projeto
  e no painel da home. Capturas por `node scripts/mocks.mjs [slug]` (só loja
  com `domain`); a Ada fica de fora por causa de um pop-up que volta na
  captura.

## v9 (2026-10-20: primeira tela com um ponto focal)

- Feedback: a primeira tela tinha informação demais (nome, dois parágrafos,
  três números, índice com logos, figura com régua, botões e legenda) e
  não dava para saber onde olhar.
- Agora: à esquerda nome, uma frase e os três números; à direita a figura em
  **modo quieto** (`FigOptions quiet`): só a peça em foco no passo tem nome,
  sem numerais, sem lupa, sem controles, legenda sempre simples. Embaixo, uma
  linha de legenda e quatro abas (FIG. 1–4) com o progresso. O índice com
  logos saiu daqui: as capas já estão em "Trabalho selecionado".
- A lupa "Detalhe A" não existe na home (nem no painel): só nos cases e na
  Sobre.
- Mockups: o notebook também rola a página inteira (captura de 1280 px em
  WebP, `<slug>-desktop.webp`).

- **Margem da marca** (`BrandMargin`): dentro da prancha da home, à esquerda
  do desenho, a placa da marca (cor e logo), o nome, uma linha e um celular
  pequeno com o site rolando (Livra: o app; HSM: "em desenvolvimento").
  De quem é → como funciona. No celular vira faixa, sem o aparelho.
- **Entrada**: o traço leva 3,4 s (`PLOT`) e a narração da home só começa
  depois. A pena segue a ordem de um plotter (vizinho mais próximo) e
  levanta quando o próximo traço fica longe, em vez de pular pela prancha.

## Mais projetos: como escala

- **Figura** (poucos, profundos): case com mecanismo próprio. Entra no índice
  da home. Custa uma figura desenhada.
- **Quadro** (muitos): trabalho de performance vira linha no quadro de
  desempenho, puxada por dado público. Custa uma linha em `perf-origins.json`.
- **Clientes** sem case nem dado ficam fora. Nome solto não prova nada.

## Armadilhas

- CSS escrito à mão em `globals.css` às vezes não chega ao navegador no dev
  (Turbopack serve o chunk velho; só `rm -rf .next` + restart resolve).
- Para verificar sem mexer no servidor de outra sessão: espelho em
  `.qa/mirror` (config `portfolio-mirror`, porta 3007). Sincronizar com
  `sh .qa/sync.sh` — sobrescreve no lugar; apagar a pasta com o servidor
  rodando derruba o Turbopack. O espelho precisa de `.gitignore` com `.next/`
  e de `git init`, senão o Tailwind varre o cache binário do `.next`, extrai
  uma "classe" corrompida e o CSS inteiro falha ao compilar.

## Fora (e por quê)

Telemetria, bloco AGORA, minimap, cursor, grão, Lenis, marquee, lab de
placeholders, moldura de foto vazia. Os arquivos continuam no repositório, sem
uso; apagar quando esta direção for aprovada.
