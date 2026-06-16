# Portfólio — João Pedro Gaspar (JPG)

Portfólio interativo reconstruído do zero: uma **jornada em scroll cinematográfica**
com mundos temáticos, 3D e muitas animações.

> **Conceito:** cada interesse vira a função de portfólio que ele faz melhor.
>
> | Seção | Mundo | Tema |
> | --- | --- | --- |
> | Início / Contato | Gotham / Bat-Signal | 🦇 Batman |
> | Sobre / Jornada | O Mergulho | 🌊 Subnautica |
> | Skills | Ultimate Team | ⚽ FIFA (cartas FUT) |
> | Projetos | Build Mode | 🧱 LEGO |

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens por mundo)
- **Lenis** (smooth scroll) + **GSAP / ScrollTrigger** (animações scroll-driven)
- **Motion** (micro-interações de UI)
- **React Three Fiber** + drei (3D — entra a partir da Fase 2)
- **Firebase** (Firestore + Auth + Storage — projetos dinâmicos e `/admin`)
- Deploy na **Vercel**

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local   # preencha quando tiver o Firebase
npm run dev                         # http://localhost:3000
```

O site roda **sem** Firebase configurado (o backend "liga" sozinho quando você
preenche o `.env.local`).

## Roadmap

- [x] **Fase 0 — Fundação:** Next.js + Tailwind + Lenis/GSAP + design tokens + esqueleto das 5 seções + deploy.
- [ ] **Fase 1 — Jornada:** transições entre mundos e navegação refinada.
- [ ] **Fase 2 — Hero Batman + Mergulho Subnautica** (3D / R3F).
- [ ] **Fase 3 — Skills FIFA** (cartas FUT + abertura de pacote).
- [ ] **Fase 4 — Projetos LEGO + Firebase + `/admin`.**
- [ ] **Fase 5 — Contato bat-signal + som + easter eggs + SEO/perf.**
- [ ] **Fase 6 — Projetos da SHAKERS.**

## Estrutura

```
src/
├── app/                 # App Router (layout, page, globals.css)
├── components/
│   ├── providers/       # SmoothScroll (Lenis + GSAP)
│   ├── layout/          # Nav, Footer
│   ├── sections/        # os 5 mundos
│   └── ui/              # Reveal, ScrollProgress
├── data/                # JSON (projetos, habilidades, social)
└── lib/                 # site config, firebase
```
