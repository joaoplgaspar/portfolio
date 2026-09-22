import type { Localized } from "@/types/project";

/**
 * Quadro de projetos — todo trabalho que não vira figura entra aqui, e cada
 * um tem página própria em /projetos/[slug].
 *
 * Figura = poucos cases, profundos (mecanismo desenhado). Projeto = muitos,
 * com a capa do site no ar e, quando houver, os números do PageSpeed.
 *
 * Regras:
 * - `featured` = destaque grande no topo (os que têm case com figura).
 * - Capa é a primeira dobra do site público (scripts/covers.mjs). Sem capa,
 *   o projeto só aparece em dev, como moldura vazia.
 * - `psi` vem do print do PageSpeed Insights, celular, com a data do print.
 *   Número sem data não entra.
 *
 * Faces do cartão em /projetos (hover troca da 1ª para a 2ª):
 * - `logo`  → 1ª face: logo centralizado (SVG ou PNG transparente, em
 *   public/logos/). Sem logo, a 1ª face é a `cover`. `logoDark` é a versão
 *   para o tema Grafite (logo escuro some no fundo escuro).
 * - `cover` → a print da primeira dobra. Vira a 2ª face quando há logo.
 * - `media` → 2ª face explícita: imagem, GIF ou vídeo da navegação.
 *   Preferir vídeo a GIF: MP4/WebM 16:10, mudo, 5–10 s, até ~2 MB, com
 *   `poster` (primeiro quadro). Arquivos em public/media/.
 *
 * Exemplo:
 *   logo: "/logos/uv-line.svg",
 *   media: { kind: "video", src: "/media/uv-line.mp4", poster: "/media/uv-line.jpg" },
 */

export type Media = { kind: "image"; src: string } | { kind: "video"; src: string; poster?: string };

export type Psi = {
  /** AAAA-MM-DD do print. */
  date: string;
  /** Nota de performance (0–100), celular. */
  score: number;
  /** Segundos. */
  lcp: number;
  /** Milissegundos. */
  tbt: number;
  cls: number;
};

export type Store = {
  slug: string;
  mark: string;
  name: string;
  domain?: string;
  platform: "Liquid" | "Hydrogen";
  year: number;
  scope: Localized;
  role?: Localized;
  /** O que eu fiz, em frases curtas. Só o que dá para afirmar. */
  work?: Localized[];
  cover?: string;
  /** 1ª face do cartão, quando existe. */
  logo?: string;
  /** Versão do logo para o tema escuro. */
  logoDark?: string;
  /** 2ª face do cartão (hover): imagem, GIF ou vídeo. */
  media?: Media;
  featured?: boolean;
  /** Case com figura, quando existe. */
  caseSlug?: string;
  psi?: Psi;
};

export const stores: Store[] = [
  {
    slug: "roland-boss",
    mark: "P-01",
    name: "Roland / Boss",
    domain: "store.roland.com.br",
    platform: "Hydrogen",
    year: 2025,
    scope: { en: "Two brands, two domains, one cart", pt: "Duas marcas, dois domínios, um carrinho" },
    role: { en: "Squad tech lead", pt: "Liderança técnica do squad" },
    cover: "/covers/roland.jpg",
    featured: true,
    caseSlug: "roland-boss",
  },
  {
    slug: "integral-medica-darkness",
    mark: "P-02",
    name: "Integralmédica / Darkness",
    domain: "integralmedica.com.br",
    platform: "Hydrogen",
    year: 2025,
    scope: { en: "Two brands on one admin, custom apps", pt: "Duas marcas num admin, custom apps" },
    role: { en: "Tech lead", pt: "Liderança técnica" },
    cover: "/covers/integralmedica.jpg",
    featured: true,
    caseSlug: "integral-medica-darkness",
  },
  {
    slug: "uv-line",
    mark: "P-03",
    name: "UV Line",
    domain: "uvline.com.br",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Sun-protection apparel, whole store in Liquid", pt: "Moda com proteção solar, loja inteira em Liquid" },
    work: [
      { en: "Liquid theme built from sections, blocks and snippets", pt: "Tema Liquid construído com seções, blocos e snippets" },
      { en: "Design system in CSS custom properties on Tailwind v4", pt: "Design system em CSS custom properties sobre Tailwind v4" },
      { en: "Preact + Signals for the cart and the collection filters", pt: "Preact + Signals no carrinho e nos filtros de coleção" },
      { en: "English and Brazilian Portuguese", pt: "Inglês e português" },
    ],
    cover: "/covers/uv-line.jpg",
  },
  {
    slug: "oficina-de-inverno",
    mark: "P-04",
    name: "Oficina de Inverno",
    domain: "oficinadeinverno.com.br",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Winter apparel, whole store in Liquid", pt: "Moda de inverno, loja inteira em Liquid" },
    cover: "/covers/oficina-de-inverno.jpg",
  },
  // ── sem capa ainda: domínio a confirmar ou site ainda não publicado ──
  {
    slug: "mari-maria",
    mark: "P-05",
    name: "Mari Maria",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Beauty, Liquid theme", pt: "Beleza, tema Liquid" },
  },
  {
    slug: "new-look-time",
    mark: "P-06",
    name: "New Look Time",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Liquid theme", pt: "Tema Liquid" },
  },
  {
    slug: "hsm-singularity",
    mark: "P-07",
    name: "HSM / Singularity",
    platform: "Hydrogen",
    year: 2026,
    scope: { en: "Education, headless storefront", pt: "Educação, vitrine headless" },
  },
];

const isProd = process.env.NODE_ENV === "production";

/** Projetos visíveis: com capa ou logo sempre; sem nenhum dos dois só em dev. */
export function visibleStores() {
  return stores.filter((s) => s.cover || s.logo || !isProd);
}

export function getStore(slug: string) {
  return visibleStores().find((s) => s.slug === slug);
}

/** Limites do Lighthouse (celular) usados pelo PageSpeed Insights. */
export const LAB = {
  score: { good: 90, poor: 50 },
  lcp: { good: 2.5, poor: 4, max: 6 },
  tbt: { good: 200, poor: 600, max: 1000 },
  cls: { good: 0.1, poor: 0.25, max: 0.4 },
} as const;

export type LabMetric = "lcp" | "tbt" | "cls";

export function fmtLab(m: LabMetric, v: number) {
  if (m === "lcp") return `${v.toFixed(1)} s`;
  if (m === "tbt") return `${Math.round(v)} ms`;
  return v.toFixed(2);
}

export function median(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b);
  const k = Math.floor(s.length / 2);
  return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2;
}
