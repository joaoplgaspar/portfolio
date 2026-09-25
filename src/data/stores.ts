import type { Localized } from "@/types/project";

/**
 * Quadro de projetos — todo trabalho que não vira figura entra aqui, e cada
 * um tem página própria em /projetos/[slug].
 *
 * Figura = poucos cases, profundos (mecanismo desenhado). Projeto = muitos,
 * com a marca e, quando houver, os números do PageSpeed.
 *
 * Regras:
 * - `featured` = destaque grande no topo e na home: case com figura, marca
 *   grande ou projeto que pede atenção.
 * - `domain` só quando o site novo está no ar (conferido: é Shopify mesmo).
 *   Sem domínio, o projeto aparece como "em desenvolvimento" e ganha o link
 *   quando lançar.
 * - `psi` vem do print do PageSpeed Insights, celular, com a data do print.
 *   Número sem data não entra.
 * - Nunca citar a base interna (biblioteca) de onde o projeto partiu: ela é
 *   do empregador. "Liquid" basta.
 *
 * Faces do cartão em /projetos (hover troca da 1ª para a 2ª):
 * - `logo`  → 1ª face: logo centralizado sobre a cor da marca (`plate`), em
 *   public/logos/. Dois logos (marcas irmãs) se revezam em loop. SVG leve; logo
 *   pesado ou com imagem embutida vira PNG recortado. Sem logo, a 1ª face é a
 *   `cover`. `logoDark` só é preciso sem `plate` (logo escuro no tema Grafite).
 * - `plate` → cor de fundo da 1ª face, a da marca (uma por logo). Vale nos
 *   dois temas.
 * - `cover` → a print da primeira dobra (scripts/covers.mjs). Vira a 2ª face
 *   quando há logo.
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
  platform: "Liquid" | "Hydrogen" | "Nuvemshop";
  year: number;
  scope: Localized;
  role?: Localized;
  /** O que eu fiz, em frases curtas. Só o que dá para afirmar. */
  work?: Localized[];
  cover?: string;
  /** 1ª face do cartão, quando existe. Dois logos = marcas irmãs, em loop. */
  logo?: string | string[];
  /** Cor da marca atrás do logo; com dois logos, uma cor para cada, na ordem. */
  plate?: string | string[];
  /** Versão do logo para o tema escuro. */
  logoDark?: string;
  /** 2ª face do cartão (hover): imagem, GIF ou vídeo. */
  media?: Media;
  featured?: boolean;
  /** Case com figura, quando existe. */
  caseSlug?: string;
  psi?: Psi;
};

const SOLO: Localized = { en: "Solo, end to end", pt: "Sozinho, de ponta a ponta" };

export const stores: Store[] = [
  // ── destaques: case com figura, marca grande ou projeto que pede atenção ──
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
    logo: ["/logos/roland.svg", "/logos/boss.svg"],
    plate: "#FFFFFF",
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
    // O raio do logo é o mesmo vermelho da placa: sobre ela, a versão branca.
    logo: ["/logos/integralmedica-reverse.png", "/logos/darkness.png"],
    plate: ["#E1251B", "#000000"],
    featured: true,
    caseSlug: "integral-medica-darkness",
  },
  {
    slug: "fujifilm",
    mark: "P-03",
    name: "Fujifilm",
    domain: "loja.fujifilm.com.br",
    platform: "Liquid",
    year: 2025,
    scope: { en: "Cameras and instax, whole store in Liquid", pt: "Câmeras e instax, loja inteira em Liquid" },
    cover: "/covers/fujifilm.jpg",
    logo: "/logos/fujifilm.svg",
    plate: "#FFFFFF",
    featured: true,
  },
  {
    slug: "qix",
    mark: "P-04",
    name: "Qix",
    domain: "qixskateshop.com.br",
    platform: "Liquid",
    year: 2025,
    scope: { en: "Skate shop, a large Liquid theme built from scratch", pt: "Skate shop, tema Liquid grande feito do zero" },
    cover: "/covers/qix.jpg",
    logo: "/logos/qix.png",
    plate: "#0A0909",
    featured: true,
  },
  {
    slug: "dux",
    mark: "P-05",
    name: "DUX",
    domain: "duxhumanhealth.com",
    platform: "Nuvemshop",
    year: 2024,
    scope: { en: "Supplements, a large store on Nuvemshop", pt: "Suplementos, loja grande na Nuvemshop" },
    cover: "/covers/dux.jpg",
    // DUX.svg veio vazio (só um retângulo): a capa segura o cartão até a nova exportação.
    plate: "#1F1F2E",
    featured: true,
  },
  // ── destaques ainda não lançados: só aparecem em dev até ganhar domínio ──
  {
    slug: "hsm-singularity",
    mark: "P-06",
    name: "HSM / Singularity",
    platform: "Hydrogen",
    year: 2026,
    scope: { en: "Two education brands, one headless storefront", pt: "Duas marcas de educação, uma vitrine headless" },
    role: SOLO,
    logo: ["/logos/hsm.png", "/logos/singularity.svg"],
    plate: "#171122",
    featured: true,
    caseSlug: "hsm-singularity",
  },
  {
    slug: "juan-valdez",
    mark: "P-07",
    name: "Juan Valdez",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Coffee, whole store in Liquid", pt: "Café, loja inteira em Liquid" },
    work: [
      { en: "Optimistic cart", pt: "Carrinho otimista" },
      { en: "Built from reusable sections and components", pt: "Construída com seções e componentes reutilizáveis" },
    ],
    logo: "/logos/juan-valdez.svg",
    plate: "#FFFFFF",
    featured: true,
  },
  {
    slug: "kappa",
    mark: "P-08",
    name: "Kappa",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Sportswear, a large Liquid store", pt: "Moda esportiva, loja grande em Liquid" },
    // kappa.com.br hoje roda em outra plataforma: domínio entra quando a loja Shopify for ao ar.
    logo: "/logos/kappa.png",
    plate: "#FFFFFF",
    featured: true,
  },
  // ── o resto, do mais novo para o mais antigo ──
  {
    slug: "uv-line",
    mark: "P-09",
    name: "UV Line",
    domain: "uvline.com.br",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Sun-protection apparel, whole store in Liquid", pt: "Moda com proteção solar, loja inteira em Liquid" },
    role: SOLO,
    work: [
      { en: "Liquid theme built from sections, blocks and snippets", pt: "Tema Liquid construído com seções, blocos e snippets" },
      { en: "Design system in CSS custom properties on Tailwind v4", pt: "Design system em CSS custom properties sobre Tailwind v4" },
      { en: "Preact + Signals for the cart and the collection filters", pt: "Preact + Signals no carrinho e nos filtros de coleção" },
      { en: "English and Brazilian Portuguese", pt: "Inglês e português" },
    ],
    cover: "/covers/uv-line.jpg",
    logo: "/logos/uv-line.svg",
    plate: "#9E5326",
  },
  {
    slug: "oficina-de-inverno",
    mark: "P-10",
    name: "Oficina de Inverno",
    domain: "oficinadeinverno.com.br",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Winter apparel, whole store in Liquid", pt: "Moda de inverno, loja inteira em Liquid" },
    cover: "/covers/oficina-de-inverno.jpg",
    logo: "/logos/oficina-de-inverno.svg",
    plate: "#29140C",
  },
  {
    slug: "yosen",
    mark: "P-11",
    name: "Yosen",
    domain: "yosen.com.br",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Supplements, Liquid theme", pt: "Suplementos, tema Liquid" },
    cover: "/covers/yosen.jpg",
    logo: "/logos/yosen.svg",
    plate: "#FF5000",
  },
  // ── 2026, ainda sem lançamento: o domínio entra quando o site novo for ao ar ──
  {
    slug: "mari-maria",
    mark: "P-12",
    name: "Mari Maria",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Beauty, whole store in Liquid", pt: "Beleza, loja inteira em Liquid" },
    role: SOLO,
    logo: "/logos/mari-maria.svg",
    plate: "#FF7A17",
  },
  {
    slug: "new-look-time",
    mark: "P-13",
    name: "New Look Time / G-Shock",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Watches, Liquid theme", pt: "Relógios, tema Liquid" },
    logo: ["/logos/new-look-time.png", "/logos/g-shock.png"],
    plate: "#FFFFFF",
  },
  {
    slug: "tania-bulhoes",
    mark: "P-14",
    name: "Tânia Bulhões",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Home and tableware, Liquid theme", pt: "Casa e mesa, tema Liquid" },
    logo: "/logos/tania-bulhoes.svg",
    plate: "#3D3F39",
  },
  {
    slug: "bn-cachos",
    mark: "P-15",
    name: "BN Cachos",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Hair care, Liquid theme", pt: "Cabelos cacheados, tema Liquid" },
    logo: "/logos/bn-cachos.svg",
    plate: "#FFFFFF",
  },
  {
    slug: "yvy",
    mark: "P-16",
    name: "YVY Brasil",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Liquid theme", pt: "Tema Liquid" },
    logo: "/logos/yvy.svg",
    plate: "#006846",
  },
  {
    slug: "santa-monica",
    mark: "P-17",
    name: "Café Santa Monica",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Coffee, Liquid theme", pt: "Café, tema Liquid" },
    logo: "/logos/santa-monica.svg",
    plate: "#FFE7BC",
  },
  {
    slug: "rezzet",
    mark: "P-18",
    name: "Rezzet",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Liquid theme", pt: "Tema Liquid" },
    // Rezzet.svg veio sem o "e": sem logo até a nova exportação.
    plate: "#040006",
  },
  {
    slug: "scarf-me",
    mark: "P-19",
    name: "Scarf Me",
    platform: "Liquid",
    year: 2026,
    scope: { en: "Liquid theme", pt: "Tema Liquid" },
    // scarfme.com.br já é Shopify, mas o tema novo ainda vai ao ar: domínio depois.
    logo: "/logos/scarf-me.svg",
    plate: "#FFFFFF",
  },
  // ── 2025 e antes ──
  {
    slug: "ada",
    mark: "P-20",
    name: "Ada",
    domain: "adanutraceuticos.com.br",
    platform: "Liquid",
    year: 2025,
    scope: { en: "Nutraceuticals, Liquid theme", pt: "Nutracêuticos, tema Liquid" },
    cover: "/covers/ada.jpg",
    logo: "/logos/ada.svg",
    plate: "#EC6731",
  },
  {
    slug: "casa-francis",
    mark: "P-21",
    name: "Casa Francis",
    domain: "francis.com.br",
    platform: "Liquid",
    year: 2025,
    scope: { en: "Home fragrance and body care, Liquid theme", pt: "Perfumaria e casa, tema Liquid" },
    cover: "/covers/casa-francis.jpg",
    logo: "/logos/casa-francis.svg",
    // A cor veio como rgba(30,30,30,.5); sólida para não virar cinza sobre o papel.
    plate: "#1E1E1E",
  },
  {
    slug: "baianao",
    mark: "P-22",
    name: "Baianão",
    domain: "baianao.com.br",
    platform: "Liquid",
    year: 2025,
    scope: { en: "Home and furniture retail, Liquid theme built from scratch", pt: "Varejo de casa e móveis, tema Liquid feito do zero" },
    cover: "/covers/baianao.jpg",
    logo: "/logos/baianao.png",
    plate: "#FFFFFF",
  },
  {
    slug: "montecristo",
    mark: "P-23",
    name: "Montecristo",
    domain: "montecristo.com.br",
    platform: "Liquid",
    year: 2025,
    scope: { en: "Watch retailer, Liquid theme", pt: "Relojoaria, tema Liquid" },
    cover: "/covers/montecristo.jpg",
    logo: "/logos/montecristo.png",
    plate: "#FFFFFF",
  },
  {
    slug: "rocinante",
    mark: "P-24",
    name: "Rocinante",
    platform: "Liquid",
    year: 2025,
    domain: "tresselosrocinante.com",
    scope: { en: "Record label store, Liquid theme", pt: "Loja de gravadora, tema Liquid" },
    // rocinante.com.br é o site da gravadora; a loja (Três Selos) mora neste domínio.
    cover: "/covers/rocinante.jpg",
    logo: "/logos/rocinante.svg",
    plate: "#FFFFFF",
  },
  {
    slug: "iron-studios",
    mark: "P-25",
    name: "Iron Studios",
    domain: "ironstudios.com.br",
    platform: "Liquid",
    year: 2024,
    scope: { en: "Collectibles, Liquid theme customized from Dawn", pt: "Colecionáveis, tema Liquid customizado a partir do Dawn" },
    cover: "/covers/iron-studios.jpg",
    // Iron Studios.svg veio vazio: a capa segura o cartão até a nova exportação.
    plate: "#2E2E2E",
  },
];

const isProd = process.env.NODE_ENV === "production";

/**
 * Projetos visíveis: todo projeto com capa ou logo. Sem domínio = ainda em
 * desenvolvimento: aparece com esse selo, e o link entra quando lançar. Sem
 * nenhuma imagem, só em dev (moldura vazia não prova nada).
 */
export function visibleStores() {
  return stores.filter((s) => !isProd || s.cover || s.logo);
}

/** Logos como lista, tenha o projeto um ou dois. */
export function logosOf(s: { logo?: string | string[] }) {
  return s.logo ? ([] as string[]).concat(s.logo) : [];
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
