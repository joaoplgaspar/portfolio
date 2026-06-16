/**
 * Configuração central do site.
 */
export const siteConfig = {
  name: "João Pedro Gaspar",
  shortName: "JPG",
  role: "Front-end Engineer",
  tagline: "headless commerce, performance e interfaces fora da curva",
  description:
    "Portfólio interativo de João Pedro Gaspar — Front-end Engineer especializado em headless commerce (Shopify Hydrogen + React), performance e experiências 3D. Uma jornada por mundos temáticos.",
  url: "https://jpg-portfolio.vercel.app",
  email: "hello@uselivra.com",
  linkedin: "https://www.linkedin.com/in/jpgasparsr7/",
  github: "https://github.com/joaoplgaspar",
} as const;

export type WorldId = "inicio" | "sobre" | "skills" | "projetos" | "contato";

export interface NavItem {
  id: WorldId;
  label: string;
  /** mundo temático ao qual a seção pertence */
  world: string;
  emoji: string;
  /** cor-assinatura do mundo (CSS var) */
  accent: string;
}

export const navItems: NavItem[] = [
  { id: "inicio", label: "Início", world: "Gotham", emoji: "🦇", accent: "var(--color-bat)" },
  { id: "sobre", label: "Sobre", world: "A Descida", emoji: "🦇", accent: "var(--color-bat)" },
  { id: "skills", label: "Arsenal", world: "Batcave", emoji: "🦇", accent: "var(--color-bat)" },
  { id: "projetos", label: "Projetos", world: "Build Mode", emoji: "🧱", accent: "var(--color-lego-yellow)" },
  { id: "contato", label: "Contato", world: "Bat-Signal", emoji: "📡", accent: "var(--color-bat)" },
];
