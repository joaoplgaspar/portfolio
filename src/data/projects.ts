import type { Project } from "@/types/project";

/**
 * ⚠️ DADOS PLACEHOLDER — Fase 0.
 * Copy e MÉTRICAS reais devem ser finalizadas pelo humano (e depois migradas
 * para o Firestore na Fase 4). Estrutura pronta; conteúdo é rascunho.
 *
 * `cover`/`gallery` guardam Cloudinary public_ids (vazios por enquanto).
 */
export const projects: Project[] = [
  {
    slug: "dux",
    title: "DUX",
    client: "DUX",
    role: "Front-end · Motion",
    year: 2024,
    type: "Branding · Homepage",
    stack: ["Next.js", "GSAP", "Three.js"],
    summary: {
      pt: "Homepage de marca com identidade em movimento e hero 3D leve.",
      en: "Brand homepage with motion identity and a lightweight 3D hero.",
    },
    problem: {
      pt: "A marca precisava de uma vitrine digital à altura do posicionamento premium.",
      en: "The brand needed a digital storefront matching its premium positioning.",
    },
    contribution: {
      pt: "Desenvolvi o front-end, o sistema de motion e o hero 3D dentro do orçamento de performance.",
      en: "I built the front-end, the motion system and the 3D hero within the performance budget.",
    },
    results: [
      { label: "LCP", value: "— (a finalizar)" },
      { label: "Lighthouse", value: "— (a finalizar)" },
    ],
    cover: "",
    gallery: [],
    featured: true,
    published: true,
    order: 1,
  },
  {
    slug: "livra",
    title: "LIVRA",
    client: "LIVRA",
    role: "Front-end · E-commerce",
    year: 2024,
    type: "E-commerce",
    stack: ["Shopify", "Hydrogen", "React", "TypeScript"],
    summary: {
      pt: "Storefront headless com carrinho otimista e checkout de baixa fricção.",
      en: "Headless storefront with optimistic cart and low-friction checkout.",
    },
    problem: {
      pt: "Reduzir a fricção da compra e acelerar as páginas de produto.",
      en: "Cut purchase friction and speed up product pages.",
    },
    contribution: {
      pt: "Arquitetei os componentes de produto (variant selector, buy button) e a UX otimista do carrinho.",
      en: "I architected the product components (variant selector, buy button) and the optimistic cart UX.",
    },
    results: [
      { label: "Conversão", value: "— (a finalizar)" },
      { label: "LCP", value: "— (a finalizar)" },
    ],
    cover: "",
    gallery: [],
    featured: true,
    published: true,
    order: 2,
  },
  {
    slug: "love-sessions-vinil",
    title: "Love Sessions — Vinil",
    client: "Love Sessions",
    role: "Front-end · Creative",
    year: 2023,
    type: "Landing · E-commerce",
    stack: ["Next.js", "GSAP", "Lenis"],
    summary: {
      pt: "Landing de edição limitada de vinil, com scroll narrativo e pré-venda.",
      en: "Limited-edition vinyl landing with narrative scroll and pre-order.",
    },
    problem: {
      pt: "Contar a história do disco e converter fãs em compradores.",
      en: "Tell the record's story and turn fans into buyers.",
    },
    contribution: {
      pt: "Conduzi o scroll storytelling e a integração de pré-venda ponta a ponta.",
      en: "I led the scroll storytelling and the end-to-end pre-order integration.",
    },
    results: [{ label: "Pré-vendas", value: "— (a finalizar)" }],
    cover: "",
    gallery: [],
    featured: false,
    published: true,
    order: 3,
  },
  {
    slug: "vivo-dashboard",
    title: "Vivo — Dashboard",
    client: "Vivo",
    role: "Front-end",
    year: 2023,
    type: "App · Dashboard",
    stack: ["React", "TypeScript", "Design System"],
    summary: {
      pt: "Painel de dados com componentes reutilizáveis e performance sob carga.",
      en: "Data dashboard with reusable components and performance under load.",
    },
    problem: {
      pt: "Consolidar dados complexos em uma interface rápida e legível.",
      en: "Consolidate complex data into a fast, legible interface.",
    },
    contribution: {
      pt: "Construí o design system de componentes e otimizei a renderização de grandes tabelas.",
      en: "I built the component design system and optimized rendering of large tables.",
    },
    results: [{ label: "Tempo de render", value: "— (a finalizar)" }],
    cover: "",
    gallery: [],
    featured: false,
    published: true,
    order: 4,
  },
];

/** Projetos publicados, ordenados. (Na Fase 4 vira query no Firestore.) */
export function getProjects(): Project[] {
  return projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug && p.published);
}
