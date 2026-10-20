# Portfólio — João Pedro Gaspar

Portfólio pessoal de um **engenheiro front-end** (e-commerce, headless/Shopify
Hydrogen, interação). Não é um site de venda de freelas: é uma vitrine de
qualidade técnica — o trabalho fala, e quem se interessa entra em contato.

**Design system "Pressroom":** editorial-commerce premium, grafite quente
(`#1B1A17`) + acento oxblood (`#7C2D2D`), tipografia Clash Display + Satoshi,
mono JetBrains. **Layout v2 "Index":** a home é um índice tipográfico de casos
com preview seguindo o cursor (a lista _é_ o hero).

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript strict**
- **Tailwind CSS v4** (`@theme inline`, tokens semânticos para tema runtime)
- **next-intl** — PT no `/` (default), EN em `/en` (`localePrefix: "as-needed"`)
- **GSAP** — `quickTo` para o cursor-follow do índice (sem re-render por mousemove)
- **WebGL cru** — faixa iridescente oxblood na troca de rota (`src/lib/sweep.ts`),
  um quad + shader; a rota troca com a tela coberta pelo véu
- **Firebase** (Firestore + Auth) — casos dinâmicos e painel `/admin`
- **Cloudinary** (`next-cloudinary`) — imagens de capa/galeria
- Deploy na **Vercel** · orçamento de performance **Lighthouse ≥ 90 mobile**

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local   # preencha quando tiver Firebase/Cloudinary
npm run dev                         # http://localhost:3000
```

O site roda **sem** Firebase/Cloudinary configurados: o backend "liga" sozinho
quando você preenche o `.env.local`; sem ele, cai nos mocks de `src/data`.

## Conteúdo (casos)

- Fonte da verdade: `src/data/projects.ts` (mocks) → sobrescrito pelo Firestore
  quando configurado (coleção `projects`, `published: true`).
- **Produção renderiza apenas `published: true`.** Placeholders `EM BREVE`
  (`slug: placeholder-*`) aparecem **só em dev**, para testar a densidade do
  índice — nunca em produção nem no sitemap.
- Casos com corpo rico usam `body: { pt, en }` (blocos heading/text/list, com
  `inline code` em crases). Hoje: **LIVRA** publicado; DUX e Vivo aguardando
  autorização (`published: false`).

## Documentação de design

| Documento | Para quê |
|---|---|
| [docs/briefing-layout.md](docs/briefing-layout.md) | **Ponto de entrada para quem vai desenhar layout.** Autossuficiente: paleta, tipografia, as três referências medidas, decisões inegociáveis e o que já está construído. |
| [docs/teardown-xiangyidesign.md](docs/teardown-xiangyidesign.md) | Destrinchamento da referência principal (4 páginas, bundle, shaders) + anexo com p5aholic e itssharl.ee medidos. |
| [docs/composicao.md](docs/composicao.md) | Inventário do que existe, comparativo das referências, direção escolhida (B) e diagnóstico da página de case. |
| [docs/spec-v3-motion.md](docs/spec-v3-motion.md) | Movimento e camada 3D: sequência de entrada, objeto-assinatura, transições, tiers de qualidade. |

## Minimap do case

Coluna fixa à direita em `/trabalho/[slug]` com corpo rico: um traço por bloco,
**posicionado na posição real do bloco no documento**. Headings são botões
navegáveis. Some abaixo de 1280px.

Ele é montado via portal no `document.body`: `template.tsx` envolve a página num
`.page-enter` cuja animação deixa um `transform` de matriz identidade, e matriz
identidade cria bloco de contenção — qualquer `position: fixed` dentro dela
ancora na página, não na viewport.

```bash
node scripts/minimap-check.mjs http://localhost:3005/trabalho/livra
```

> **Nota de ambiente:** mudanças em `src/app/globals.css` só chegam ao dev
> server depois de `rm -rf .next` e reinício. Reiniciar sozinho não basta.

## Bloco AGORA

`src/data/now.ts` é a fonte única do que é verdade sobre o trabalho neste
momento. Carrega `updatedAt` e **a data aparece na home**: se o bloco
envelhecer, o site denuncia sozinho. `scripts/now-check.mjs` falha quando
passa de 120 dias — um bloco chamado "agora" que envelhece em silêncio é pior
que não existir.

Entrada sem verdade sai da lista; com `entries` vazio o bloco não renderiza.

```bash
node scripts/now-check.mjs http://localhost:3005/
```

## Telemetria

Barra mono no rodapé com o que o site sabe sobre si mesmo: hora de São Paulo
ao vivo, hash e data do build, FPS medido, LCP deste visitante, WebGL/DPR
detectados, disponibilidade. **Campo sem medição não aparece** — nada ali é
estimado.

O hash vem de `NEXT_PUBLIC_BUILD_SHA`, injetado em `next.config.mjs` a partir
do ambiente da Vercel ou do git local.

```bash
node scripts/telemetry-check.mjs http://localhost:3005/
```

## Transição de rota (faixa iridescente)

A troca de rota é coberta por uma faixa oxblood renderizada em WebGL
(`src/lib/sweep.ts`): um quad fullscreen e um fragment shader, sem three.js. O
véu que viaja com a faixa chega a ~0.97 de alpha no meio do percurso — é nesse
instante que a navegação dispara e o scroll é zerado, então a página nova nunca
aparece "chegando".

Não é interceptada (navegação nativa) quando: `prefers-reduced-motion`, sem
WebGL, clique com modificador, `target` externo, `download`, âncora na mesma
página, ou `data-no-sweep` no link.

```bash
node scripts/sweep-check.mjs http://localhost:3000/ /sobre
```

`sweep-check` valida os caminhos de degradação; `sweep-frames.mjs` fotografa a
transição quadro a quadro em `.qa/sweep/` para conferir o ritmo.

## Definition of Done

- [ ] **≥ 3 cases publicados** para ir a produção. Com menos, o índice
      tipográfico fica magro e o formato não se sustenta. Ordem-alvo do índice:
      loja-demo (flagship) → LIVRA → demais.
- [ ] Copy PT e EN em paridade (hero, `/sobre`, cases).
- [ ] Lighthouse ≥ 90 mobile (LCP transform-only, zero CLS nas capas).
- [ ] `/admin` com CRUD funcional (Auth + Firestore + upload Cloudinary).
- [ ] SEO: metadata por página, `sitemap.xml` só com publicados, JSON-LD.

## Estrutura

```
src/
├── app/[locale]/        # App Router i18n (home índice, trabalho/[slug], sobre, lab, admin)
├── components/
│   ├── layout/          # Header, Footer, Container
│   ├── work/            # IndexList (assinatura v2), SpecSheet, ProjectCover, CaseBody
│   ├── fx/              # Reveal (IntersectionObserver)
│   └── seo/             # JsonLd
├── data/                # projects, about (mocks + fallback)
├── i18n/                # routing, navigation, request (next-intl)
├── lib/                 # site config, firebase, metadata
└── fonts/               # Clash Display + Satoshi (woff2)
```
