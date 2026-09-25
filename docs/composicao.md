> **Superado em 2026-09-22** pela direção "Folha" — ver [direcao-folha.md](direcao-folha.md).

# Composição — o que o site é hoje, o que as referências são, e o que dá para ser

> Resposta curta à pergunta "temos isso mapeado?": **não tínhamos.** Os specs
> existentes ([spec-v3-motion.md](spec-v3-motion.md)) e o
> [teardown](teardown-xiangyidesign.md) tratam de *movimento* e de *como a
> referência é feita*. A composição do nosso site nunca foi escrita — ela foi
> acontecendo em commits. Este documento fecha isso.

---

## 1. O que existe hoje (inventário real, não intenção)

| Rota | O que tem | Linhas |
|---|---|---:|
| `/` | Tagline mono (2 linhas) → `IndexList` (o índice de casos) → `ClientList` → faixa para o Lab | 98 |
| `/sobre` | `h1` + 2 parágrafos + 1 moldura de foto **vazia** | 79 |
| `/lab` | `h1` + lede + grid de 3 cards **só com texto** (sem experimento rodando) | 61 |
| `/trabalho` | — (11 linhas) | 11 |
| `/contato` | — (11 linhas) | 11 |
| `/trabalho/[slug]` | `ProjectCover` + `SpecSheet` + `CaseBody` | — |
| footer (global) | E-mail gigante como CTA + GitHub/LinkedIn/Behance + stack + local | 59 |

**Conteúdo real:** 1 case publicado (LIVRA). DUX e Vivo aguardando autorização.
Lab sem experimento rodando. `/sobre` sem retrato. Nenhum vídeo.

Diagnóstico honesto: a **casca** está boa (tipografia, índice, tokens, i18n,
SEO, agora a transição). O que falta não é composição — é **matéria**. Um
índice tipográfico com 1 linha não é um índice, é um link.

---

## 2. As três referências, lado a lado (composição, não estética)

|  | **xiangyidesign** | **p5aholic** | **itssharl.ee** |
|---|---|---|---|
| **Modelo** | 2 telas alternadas por um *dock* fixo (Dashboard ⇄ Project) | Página única com seções trocadas por nav (Home/Projects/Info/Contact/FAQ/Copycats) | Site clássico (Home/Work/About/Contact) + menu full-screen |
| **Primeira tela** | Bento de 11 widgets vivos | Nome + bio de 14 linhas + partículas | Splash com contador → frase grande |
| **Índice de trabalho** | Grid masonry de **vídeos** com legenda fora do card | Lista tipográfica alinhada à direita, data + crédito | Lista à direita + painel de imagem à esquerda no hover |
| **Case** | Página de 14.000 px com nav lateral + **minimap** + before/after arrastável | — (links externos) | Página por projeto |
| **Lab** | Carrossel de 12 experimentos rodando ao vivo | A própria home é o experimento | — |
| **Páginas de personalidade** | "Currently at", "Some Statistic", "Moodboard", "Clients" | **FAQ** e **Copycats** | About |
| **Controles expostos** | Tema (2 desenhos distintos) | Tema + Mono | Tema + idioma |
| **Volume de conteúdo** | 9 projetos · 3 cases profundos · 12 experimentos · 4 clientes | Dezenas de projetos | 9 projetos |
| **Nosso volume** | **1 case · 0 experimentos · 0 vídeos** | | |

### O que é estrutural (transferível) x o que é consequência de volume

**Transferível hoje, com 1 case:**
- Chrome persistente que não recarrega (dock/frame fixo) — dá sensação de app.
- Controles expostos (tema, mono) — lê como sistema, custa pouco.
- Um bloco vivo com dado real (a telemetria do [spec §4](spec-v3-motion.md)).
- Legenda fora da capa no índice — lê como catálogo.
- Case com nav lateral + minimap — **melhora o único case que existe**.
- Páginas de personalidade (o "FAQ"/"Copycats" do p5aholic): custam texto, não código, e são o que mais diferencia.

**Não transferível sem volume:**
- Bento de 11 widgets — precisa de 11 coisas verdadeiras para dizer.
- Grid masonry de vídeos — precisa de 9 projetos com vídeo.
- Carrossel de 12 experimentos — precisa de 12 experimentos.
- Painel de preview no hover — precisa de lista longa o bastante para justificar.

---

## 3. O problema que nenhuma reformulação resolve

As três referências carregam **5 a 10 vezes** mais conteúdo que nós. A
composição delas é consequência disso, não causa. Copiar a composição sem o
volume produz casca — e casca vazia lê pior que um site pequeno e denso.

Isso bate com o que já estava decidido no README: **≥ 3 cases publicados** como
condição para ir a produção. A composição certa para 1–3 cases não é a mesma
que para 9, e é a de 1–3 que precisamos agora.

Há ainda um histórico: o bento/dashboard **já foi tentado e revertido** (commit
`7d39e0e` → `ecb63c1`), porque conflitava com a decisão "a lista é o hero".
Reformular na direção do xiangyi é desfazer essa decisão — o que é legítimo,
mas é uma decisão, não um detalhe.

---

## 4. Três direções possíveis

### A. Adensar o índice (evolução — mantém "a lista é o hero")
A home continua sendo o índice, mas para de ser só o índice: ganha uma faixa de
telemetria viva, capas em vídeo curto no hover, legenda fora da capa, e um
bloco "agora" (no que estou trabalhando / disponibilidade). `/sobre` vira uma
página de verdade (retrato, ficha técnica, FAQ com voz). `/lab` passa a rodar
experimento de verdade, um por vez.
- **Demanda:** 3 cases, 1 retrato, 2–3 experimentos, texto de FAQ.
- **Risco:** baixo. Nada do que existe é jogado fora.
- **Teto:** alto, mas depende de a tipografia carregar sozinha.

### B. Mesa de trabalho (inspiração xiangyi, sem virar bento)
A home vira uma superfície com poucos blocos grandes e **verdadeiros** — o
índice ocupando 60%, e 3 blocos vivos ao lado (telemetria/build, "currently
at", clientes). Não 11 widgets: 4. O dock fixo embaixo alterna Índice ⇄ Lab
sem recarregar.
- **Demanda:** 3 cases + dados reais para os 3 blocos + o Lab rodando.
- **Risco:** médio. É a direção que já foi revertida uma vez — a diferença
  seria manter o índice como protagonista em vez de virar mais um card.
- **Teto:** o mais alto dos três, e o mais caro.

### C. Uma matéria só (inspiração p5aholic)
A home é quase vazia: nome, uma frase, e a camada 3D (a "chapa" do
[spec §2](spec-v3-motion.md)) ocupando a tela. O trabalho fica atrás de um
clique. Toggles de tema/mono expostos. `/faq` e uma página de opinião técnica
carregam a personalidade.
- **Demanda:** a camada 3D pronta (fases C–D do spec) + texto com voz forte.
- **Risco:** alto com 1 case — vazio demais. Ótimo com 3+ e a chapa pronta.
- **Teto:** alto, mas aposta tudo no 3D e na escrita.

---

## 5. Decisão: **B — Mesa de trabalho** (2026-09-22)

Escolhida pelo João. Minha recomendação era A (menor risco), mas B tem o teto
mais alto e a diferença que importa em relação ao bento revertido está clara:
**o índice continua sendo o protagonista**, ocupando a maior parte da tela. Os
blocos vivos ficam ao lado dele, não no lugar dele. Foi virar "mais um card"
que matou a tentativa anterior (`7d39e0e`).

### O que B é, concretamente

**Home** — duas colunas assimétricas, sem cards flutuando:

```
┌───────────────────────────────────────────┬──────────────────┐
│  tagline mono (2 linhas)                  │  AGORA           │
│                                           │  no que estou    │
│  ÍNDICE                            ~60%   │  trabalhando     │
│  LIVRA          product · full-stack 2025 │  + disponibilid. │
│  Roland/Boss    e-commerce headless  2025 ├──────────────────┤
│  Integral Méd.  headless · apps      2025 │  CLIENTES        │
│  …                                        │  (marquee)       │
│                                           ├──────────────────┤
│                                           │  TELEMETRIA      │
│                                           │  hora SP · build │
│                                           │  FPS · LCP · GPU │
└───────────────────────────────────────────┴──────────────────┘
                    [ Índice ⇄ Lab ]   ← dock fixo
```

**Regras que separam isto de um bento:**
1. O índice ocupa ≥ 60% da largura em desktop e **nunca** vira card — continua
   sendo lista tipográfica com linha divisória, como está hoje.
2. **Três blocos, não onze.** Cada um mostra dado real; sem widget decorativo.
   Um bloco sem conteúdo verdadeiro é removido, não preenchido com placeholder.
3. Os blocos não têm borda de card flutuante — são áreas separadas por filete,
   no mesmo vocabulário do índice.
4. Mobile: tudo empilha, índice primeiro. Os blocos viram uma faixa mono
   compacta no rodapé.

**Dock fixo** (embaixo, centralizado): alterna Índice ⇄ Lab sem recarregar,
como o do xiangyi. É o que dá sensação de instrumento em vez de site. Usa a
faixa iridescente que já existe, no eixo vertical (`axis: "y"`) para distinguir
de navegação normal.

**`/lab`** deixa de ser grid de texto e vira o segundo estado do dock: um
experimento por vez, rodando de verdade, com metadados nos cantos (título,
subtítulo, data, versão) — o formato do `/vibe-coding`.

**`/trabalho/[slug]`** ganha nav lateral com scrollspy + minimap do documento.

**`/sobre`** ganha retrato e ficha técnica; o FAQ com voz entra aqui.

### Ordem de execução

| # | Peça | Serve a | Depende |
|---|---|---|---|
| 1 | ✅ `Telemetry` — bloco vivo (hora SP, build sha, FPS, LCP, WebGL/DPR). Hoje no rodapé; migra para a coluna direita na peça 3. | B + qualquer direção | feito |
| 2 | ✅ Bloco `AGORA` (`src/data/now.ts` + `components/work/NowBlock.tsx`), posicionado logo antes de `ClientList` — na ordem que os três blocos terão na coluna. | B | feito |
| 3 | Home em duas colunas assimétricas (índice 60%) | B | 1, 2 |
| 4 | Dock fixo Índice ⇄ Lab + sweep vertical | B | 3 |
| 5 | `/lab` como estado do dock, um experimento por vez | B | 4 |
| 6 | ⏳ **Minimap ✅** (`components/work/CaseMinimap.tsx`) · nav lateral pendente (ver §5.1) | qualquer direção | metade feita |
| 7 | Scramble em métricas e títulos | qualquer direção | — |

1, 6 e 7 são neutros: valem mesmo se a composição mudar de novo.

### O que B não resolve

O gargalo continua sendo conteúdo. Com 1 case publicado, o índice de 60% fica
magro e o bloco AGORA fica repetindo a mesma coisa. **As peças 3–5 só fecham
com ≥ 3 cases e ≥ 2 experimentos rodando** — mesma condição que já estava no
README. As peças 1, 2, 6 e 7 podem ir antes disso.

---

## 5.1 A página de case — por que ela lê como template

Diagnóstico pedido em 2026-09-22 ("hoje parece bastante IA"). O layout **é**
genérico, mas ele é sintoma, não doença:

| O que se vê | Por que lê como template |
|---|---|
| Duas colunas `1.5fr / 1fr` com ficha técnica *sticky* | É a forma padrão de case study na web. Não está errada — está anônima. Não tem nada que só este site faria. |
| Corpo em coluna única, mesma largura do começo ao fim | Heading mono → parágrafo → heading → parágrafo por 1.500 px. Sem quebra de escala, sem respiro, sem dispositivo editorial. |
| **Zero imagens** | A capa é uma moldura vazia com "Projeto próprio" no meio (fallback, não há arquivo). Um case sem artefato é um post de blog com ficha técnica. |
| Ficha técnica com borda arredondada | É um **card**, num sistema cuja regra é "não é card". |
| Grade de métricas nunca aparece | `results: []` no LIVRA — o bloco existe no código e nunca renderiza. |

**A causa principal é a quarta linha, não a primeira.** Mesmo com o layout
perfeito, um case só de texto lê como gerado — é exatamente o que falta para
ele parecer feito por alguém que esteve lá. O xiangyi intercala vídeo,
before/after arrastável e tabela; a textura está no *conteúdo*.

### Ordem de correção (maior impacto primeiro)

| # | O que | De quem |
|---|---|---|
| 1 | **Screenshots e vídeo do LIVRA** — busca unificada, scanner, economia, modo foco | João |
| 2 | Tipos de bloco de mídia em `CaseBlock`: `image`, `figure` (com legenda), `compare` (before/after), `metric` | código |
| 3 | Coluna de texto mais estreita (~640 px) com **mídia estourando para 1.000+ px** — é esse contraste de largura que faz ler como editorial em vez de documento | código |
| 4 | Ficha técnica deixa de ser card: vira tabela de filete, vocabulário do índice e do bloco AGORA | código |
| 5 | Nav lateral de seções com scrollspy (a outra metade da peça 6) | código |

As peças 2–5 são baratas. A peça 1 é a que decide — e é a mesma conclusão do
§3: o gargalo é matéria, não composição.

---

## 6. O que fazer com o que já está pronto

A transição iridescente (fase E1) é independente de tudo isto — funciona em
qualquer das três direções, e o dock de B a reaproveita no eixo vertical.
Telemetria, minimap e scramble são peças, não composição.
