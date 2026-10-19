/**
 * Currículo — fonte única da página /resume e do PDF
 * (scripts/resume-pdf.mjs imprime a página).
 *
 * Em inglês nas duas línguas do site: quem pede currículo é quem contrata
 * fora do Brasil. Formato americano: uma página, coluna única, títulos de
 * seção padrão, nada de foto, idade ou endereço — e texto de verdade, para
 * os leitores automáticos (ATS) conseguirem extrair.
 *
 * Regras:
 * - Número só do LIVRA. Métrica de cliente (conversão, performance, receita)
 *   é confidencial e não entra.
 * - Nunca citar a base interna (biblioteca) do empregador: ela vira "o
 *   método", sem nome, comando ou regra.
 * - Data sem confirmação fica fora (o campo existe, vazio), como na Sobre.
 * - Só cliente com loja no ar ou case publicado.
 */

/** O PDF é a impressão da página /resume (scripts/resume-pdf.mjs). */
export const RESUME_PDF = "/joao-pedro-gaspar-resume.pdf";

export type ResumeRole = { title: string; period?: string };

export type ResumeEntry = {
  org: string;
  context?: string;
  url?: string;
  period: string;
  /** Progressão dentro da mesma empresa, do mais recente ao mais antigo. */
  roles?: ResumeRole[];
  bullets: string[];
};

export const resume = {
  headline: "Shopify Front-end Engineer",
  sub: "Liquid themes · Headless Hydrogen · Checkout extensions & Functions",
  location: "São Paulo, Brazil",
  timezone: "UTC−3 · 1–2 h ahead of US Eastern",

  summary:
    "Front-end engineer who builds Shopify stores end to end, in Liquid and headless Hydrogen: sections, product pages, cart and checkout, with performance, SEO and structured data built in from day one. I ship 30-page stores solo in days to weeks, and extend the platform with checkout UI extensions, Shopify Functions and custom apps when it falls short. Founder of LIVRA, a reading app I built and run alone (React, Capacitor, Firebase).",

  experience: [
    {
      org: "SHAKERS",
      context: "Shopify agency · São Paulo",
      period: "May 2024 – Present",
      roles: [
        { title: "Squad Leader — Shopify Expert, Headless & Liquid", period: "Aug 2025 – Present" },
        { title: "Junior Front-end Developer", period: "Apr 2025 – Aug 2025" },
        { title: "Front-end Intern", period: "May 2024 – Apr 2025" },
      ],
      bullets: [
        "Build complete Shopify stores alone, 30+ pages, from theme sections to product page, cart and checkout, in Liquid and Hydrogen. Live work includes Fujifilm Brazil, Qix Skate Shop and UV Line.",
        "Led the squad on Roland and Boss Brazil's headless Hydrogen storefronts. Drove the architecture of the agency's first shared cart: one cart and one checkout across two brand domains, chosen over synced carts to rule out race conditions.",
        "Tech lead for Integralmédica and Darkness, two brands on one Shopify admin: per-brand account areas, checkout extensions, promotion rules in Shopify Functions and custom apps.",
        "Built HSM / Singularity alone: a headless storefront for two education brands and a custom app that withholds federal taxes at checkout for business buyers (checkout UI extension, discount and validation Functions, admin settings).",
        "Work from a shared, versioned base of sections with automated checks at several widths, so a fix made in one store reaches the next one.",
        "Promoted twice in 15 months: intern to junior, then to squad leader.",
      ],
    },
    {
      org: "LIVRA",
      context: "Reading app · iOS, Android, web",
      url: "https://uselivra.com",
      period: "2026 – Present",
      roles: [{ title: "Founder & sole engineer" }],
      bullets: [
        "Designed, built and run the whole product alone: 600 registered users in the first month.",
        "Reconciled six book-catalog APIs into one canonical work/edition identity, with an on-device barcode-to-ISBN scanner.",
        "AI librarian on Gemini: every recommendation is checked against the real catalog before it is shown.",
      ],
    },
  ] as ResumeEntry[],

  skills: [
    {
      label: "Shopify",
      items:
        "Liquid, Online Store 2.0 sections & blocks, Hydrogen, Oxygen, Storefront API, Checkout UI extensions, Shopify Functions, custom apps, metafields & metaobjects",
    },
    { label: "Front-end", items: "TypeScript, React, Remix / React Router, Next.js, Tailwind CSS" },
    { label: "Quality", items: "Core Web Vitals, technical SEO, structured data (JSON-LD)" },
    { label: "Also", items: "Firebase, Capacitor, Stripe, Weaverse, Nuvemshop" },
  ],

  education: [
    { title: "B.Sc. Computer Science", org: "", period: "2023 – 2026 (expected)" },
    { title: "Technical diploma in Information Technology", org: "", period: "" },
  ],

  languages: [
    { name: "Portuguese", level: "native" },
    { name: "English", level: "intermediate" },
    { name: "Spanish", level: "intermediate" },
  ],
};
