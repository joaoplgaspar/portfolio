/**
 * Configuração central do site. Conteúdo de verdade (nome, bio, links) será
 * confirmado/ajustado nas próximas fases — estes valores são o ponto de partida.
 */
export const siteConfig = {
  name: "João Pedro Gaspar",
  shortName: "JPG",
  role: "Desenvolvedor Criativo",
  tagline: "Front-end · 3D · Experiências interativas",
  description:
    "Portfólio interativo de João Pedro Gaspar — desenvolvedor criativo. Uma jornada com 3D, animações e mundos temáticos (Gotham, oceano, Ultimate Team e build mode).",
  url: "https://jpg-portfolio.vercel.app",
  email: "hello@uselivra.com",
} as const;

export type WorldId = "inicio" | "sobre" | "skills" | "projetos" | "contato";

export interface NavItem {
  id: WorldId;
  label: string;
  /** mundo temático ao qual a seção pertence */
  world: string;
  emoji: string;
}

export const navItems: NavItem[] = [
  { id: "inicio", label: "Início", world: "Gotham", emoji: "🦇" },
  { id: "sobre", label: "Sobre", world: "O Mergulho", emoji: "🌊" },
  { id: "skills", label: "Skills", world: "Ultimate Team", emoji: "⚽" },
  { id: "projetos", label: "Projetos", world: "Build Mode", emoji: "🧱" },
  { id: "contato", label: "Contato", world: "Bat-Signal", emoji: "📡" },
];
