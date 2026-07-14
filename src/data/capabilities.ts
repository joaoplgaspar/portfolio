import type { Localized } from "@/types/project";

export interface Capability {
  title: Localized;
  desc: Localized;
}

export const capabilities: Capability[] = [
  {
    title: { pt: "Front-end de produto", en: "Product front-end" },
    desc: {
      pt: "Interfaces em React/Next.js com componentes reutilizáveis, acessíveis e fáceis de manter.",
      en: "React/Next.js interfaces with reusable, accessible, maintainable components.",
    },
  },
  {
    title: { pt: "E-commerce & headless", en: "E-commerce & headless" },
    desc: {
      pt: "Lojas Shopify e headless (Hydrogen), do PDP ao checkout, com UX otimista.",
      en: "Shopify and headless (Hydrogen) storefronts, from PDP to checkout, with optimistic UX.",
    },
  },
  {
    title: { pt: "Motion & 3D", en: "Motion & 3D" },
    desc: {
      pt: "Scroll narrativo com GSAP e cenas 3D em React Three Fiber — sempre sob controle.",
      en: "Narrative scroll with GSAP and 3D scenes in React Three Fiber — always in check.",
    },
  },
  {
    title: { pt: "Performance", en: "Performance" },
    desc: {
      pt: "Core Web Vitals como requisito, não enfeite: LCP baixo, zero layout shift, JS enxuto.",
      en: "Core Web Vitals as a requirement, not decoration: low LCP, zero layout shift, lean JS.",
    },
  },
];
