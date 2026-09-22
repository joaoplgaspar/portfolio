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
| LIVRA | uma palavra gigante; convergência de fontes | reconciliação campo a campo + queda da CBL e a regra do cache vazio |

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
- **LIVRA** virou o case principal: números de escala (300 usuários no 1º
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
  formulário (`/contato`, endpoint opcional `NEXT_PUBLIC_CONTACT_ENDPOINT`,
  senão mailto).
- **Sobre**: trajetória em corte de escada (estágio → júnior → líder de squad →
  solo em várias lojas por mês; certificação Shopify tracejada) e o LIVRA como
  torre separada (fundador). Datas sem confirmação ficam vazias.
- **Projetos** (`/projetos`, antes "Lojas"): destaques grandes, o resto três
  por linha; cada projeto tem página própria em `/projetos/[slug]` com o
  básico e o bloco de performance (nota + LCP/TBT/CLS em régua, com data).
  Substitui `/performance`. Capa da loja no ar
  (`scripts/covers.mjs`), escopo, e PageSpeed com data quando houver print.
  Painel de réguas só com ≥ 3 lojas medidas. Dados em `src/data/stores.ts`.
- **FIG. 4 Starter Pack**: a base própria do João para construir projetos
  com agilidade ou ajustar os existentes. **Nunca** citar o nome da empresa
  nem de projetos de cliente nesse case: é propriedade deles. Só o método.

## v5 (home e cursor)

- **Índice com print**: cada linha tem a miniatura do projeto (site, app em
  dois telefones, terminal no Starter Pack) e o índice inteiro cabe na
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
