/**
 * Conteúdo do portfólio (bio, jornada, arsenal e projetos).
 *
 * Hoje os dados de projeto são MOCKADOS aqui. A função `getProjetos()` é o único
 * ponto de acesso — quando o Firebase entrar (Fase 4), basta trocar a implementação
 * dela por uma query no Firestore, sem mexer nos componentes.
 */

// ─────────────────────────────────────────────────────────────
// Bio / Sobre
// ─────────────────────────────────────────────────────────────
export const bio = {
  resumo:
    "Sou movido por criar, não só manter. Entrei na SHAKERS em 2024 e em menos de um ano saí do suporte para liderar a primeira squad de e-commerce headless com Shopify Hydrogen e React — território totalmente novo. Hoje meu foco é performance, arquitetura limpa (SOLID) e interfaces que surpreendem.",
};

export interface Milestone {
  /** profundidade simbólica no mergulho (quanto mais fundo, mais recente) */
  depth: string;
  ano: string;
  titulo: string;
  texto: string;
}

export const jornada: Milestone[] = [
  {
    depth: "0 m",
    ano: "2024",
    titulo: "Superfície — entrada na SHAKERS",
    texto: "Comecei no suporte, mas com fome de construir soluções de verdade.",
  },
  {
    depth: "-250 m",
    ano: "2024",
    titulo: "Suporte → Projetos",
    texto:
      "Migrei rápido para projetos com lógica e soluções criativas que surpreenderam até quem já dominava a arquitetura Shopify.",
  },
  {
    depth: "-550 m",
    ano: "2025",
    titulo: "Júnior em menos de 1 ano",
    texto: "Promovido pela entrega e pela forma de resolver problemas difíceis.",
  },
  {
    depth: "-850 m",
    ano: "2025",
    titulo: "Líder da 1ª squad headless Hydrogen",
    texto:
      "Assumi a liderança da primeira squad de projetos headless em Shopify Hydrogen + React — algo inédito na empresa.",
  },
  {
    depth: "-1.200 m",
    ano: "Hoje",
    titulo: "Performance & arquitetura",
    texto:
      "Cases como carrinho otimista, main product, variant selector e buy button — construídos com a melhor arquitetura e SOLID.",
  },
];

// ─────────────────────────────────────────────────────────────
// Arsenal (skills) — Batcave
// ─────────────────────────────────────────────────────────────
export interface ArsenalGroup {
  categoria: string;
  itens: string[];
}

export const arsenal: ArsenalGroup[] = [
  { categoria: "Front-end", itens: ["React", "Next.js", "TypeScript", "JavaScript"] },
  { categoria: "Headless Commerce", itens: ["Shopify Hydrogen", "Liquid", "GraphQL", "Storefront API"] },
  { categoria: "Arquitetura & Performance", itens: ["SOLID", "Otimização", "Componentização", "Optimistic UI"] },
  { categoria: "Estilo & Ferramentas", itens: ["SCSS", "Tailwind", "Git", "Figma"] },
];

// ─────────────────────────────────────────────────────────────
// Projetos — Build Mode
// ─────────────────────────────────────────────────────────────
export type Empresa = "SHAKERS" | "Pessoal" | "Estudos";

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  papel?: string;
  empresa: Empresa;
  tecnologias: string[];
  github?: string;
  site?: string;
  /** caminho dentro de /public (ou URL remota futura do Firebase) */
  imagem?: string;
  destaque?: boolean;
  /** placeholder até os dados reais entrarem */
  mock?: boolean;
}

const projetos: Projeto[] = [
  {
    id: "shakers-headless-storefront",
    nome: "Storefront Headless (Hydrogen)",
    descricao:
      "Loja headless em Shopify Hydrogen + React liderada por mim: carrinho otimista, seções de main product e arquitetura SOLID com foco em performance.",
    papel: "Tech lead da squad headless",
    empresa: "SHAKERS",
    tecnologias: ["Hydrogen", "React", "TypeScript", "GraphQL"],
    destaque: true,
    mock: true,
  },
  {
    id: "shakers-variant-selector",
    nome: "Variant Selector & Buy Button",
    descricao:
      "Componentes de produto reutilizáveis (variant selector, buy button) com ligamento seguro à Storefront API e UX otimista.",
    papel: "Arquitetura e desenvolvimento",
    empresa: "SHAKERS",
    tecnologias: ["Hydrogen", "React", "GraphQL"],
    mock: true,
  },
  {
    id: "animerank",
    nome: "AnimeRank",
    descricao:
      "SPA para descobrir e rankear animes, com React Router, contextos, localStorage e consumo de API.",
    empresa: "Pessoal",
    tecnologias: ["React", "TypeScript", "Sass"],
    github: "https://github.com/joaoplgaspar/animerank-ts",
    site: "https://animerank-ts.vercel.app",
    imagem: "/assets/Projetos/Anirank/Anirank1.png",
  },
  {
    id: "aluroni",
    nome: "Aluroni",
    descricao:
      "Cardápio dinâmico de restaurante com filtragem, ordenação e busca por categoria.",
    empresa: "Estudos",
    tecnologias: ["React", "TypeScript", "Sass"],
    github: "https://github.com/joaoplgaspar/aluroni",
    site: "https://aluroni-lw98.vercel.app",
    imagem: "/assets/Projetos/Aluroni/Aluroni1.gif",
  },
  {
    id: "alura-space",
    nome: "Alura Space",
    descricao:
      "Galeria de imagens espaciais com filtros, componentes reutilizáveis e mock de API.",
    empresa: "Estudos",
    tecnologias: ["React", "TypeScript", "Sass"],
    github: "https://github.com/joaoplgaspar/alura-space",
    site: "https://alura-space-liard.vercel.app",
    imagem: "/assets/Projetos/Alura Space/AluraSpace1.png",
  },
];

/** Acesso síncrono (SSR / fallback): usado enquanto o Firestore não responde. */
export function getProjetos(): Projeto[] {
  return projetos;
}

/**
 * Acesso real aos projetos. Lê a coleção `projetos` no Firestore quando o
 * Firebase está configurado; senão (ou se a coleção estiver vazia/erro) cai
 * nos mocks acima. Tudo via import dinâmico, então o Firestore só entra no
 * bundle quando realmente usado.
 */
export async function fetchProjetos(): Promise<Projeto[]> {
  try {
    const { isFirebaseConfigured, getFirebaseApp } = await import("@/lib/firebase");
    const app = getFirebaseApp();
    if (!isFirebaseConfigured || !app) return getProjetos();

    const { getFirestore, collection, getDocs } = await import("firebase/firestore");
    const db = getFirestore(app);
    const snap = await getDocs(collection(db, "projetos"));
    if (snap.empty) return getProjetos();

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Projeto, "id">),
    }));
    // destaques primeiro
    return list.sort((a, b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque)));
  } catch {
    return getProjetos();
  }
}
