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
