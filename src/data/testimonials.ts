import type { Localized } from "@/types/project";

export interface Testimonial {
  quote: Localized;
  author: string;
  role: Localized;
  company: string;
}

/** ⚠️ PLACEHOLDER — substituir por depoimentos reais (com permissão). */
export const testimonials: Testimonial[] = [
  {
    quote: {
      pt: "Entregou uma loja rápida e bonita, e resolveu problemas que travavam a gente há meses.",
      en: "Delivered a fast, beautiful store and solved problems that had blocked us for months.",
    },
    author: "— (a confirmar)",
    role: { pt: "Diretor de E-commerce", en: "Head of E-commerce" },
    company: "Cliente",
  },
  {
    quote: {
      pt: "Craft de verdade e obsessão por performance. Raro achar os dois na mesma pessoa.",
      en: "Real craft and an obsession with performance. Rare to find both in one person.",
    },
    author: "— (a confirmar)",
    role: { pt: "Diretor de Arte", en: "Art Director" },
    company: "Estúdio",
  },
];

/** ⚠️ PLACEHOLDER — logos de marcas atendidas (por ora, wordmarks em texto). */
export const clients: string[] = [
  "DUX",
  "Vivo",
  "LIVRA",
  "Shopify",
  "SHAKERS",
  "Love Sessions",
];
