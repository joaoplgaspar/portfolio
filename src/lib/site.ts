/**
 * Configuração central do site (dados estáveis, não-traduzíveis).
 * Copy traduzível vive em /messages.
 */
export const siteConfig = {
  name: "João Pedro Gaspar",
  role: "Front-end Engineer",
  url: "https://jpg-portfolio.vercel.app",
  email: "jpgaspar.dev@gmail.com",
  location: "São Paulo · GMT-3",
  stack: "React · Next · Three.js · GSAP · Shopify · Liquid · Hydrogen · Firebase",
  social: {
    linkedin: "https://www.linkedin.com/in/jpgasparsr7/",
    github: "https://github.com/joaoplgaspar",
    behance: "",
  },
} as const;
