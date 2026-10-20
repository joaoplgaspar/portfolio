import { siteConfig } from "@/lib/site";
import { resume } from "@/data/resume";

/**
 * Dados estruturados (schema.org) em grafo: cada página publica os nós que
 * lhe dizem respeito, e eles se ligam por @id. A pessoa e o site têm um @id
 * fixo, então o Google junta tudo numa entidade só.
 */
type Locale = "pt" | "en";

const BASE = siteConfig.url;
export const PERSON_ID = `${BASE}/#person`;
export const WEBSITE_ID = `${BASE}/#website`;

export const pageUrl = (locale: Locale, path: string) =>
  `${BASE}${locale === "pt" ? "/pt" : ""}${path === "/" ? "" : path}`;

const LANG = { en: "en", pt: "pt-BR" } as const;
const DESCRIPTION = {
  en: "Front-end engineer for Shopify: whole stores end to end, in Liquid or headless Hydrogen.",
  pt: "Engenheiro front-end para Shopify: lojas inteiras de ponta a ponta, em Liquid ou Hydrogen headless.",
};

// "Liquid, Hydrogen, ..." de cada grupo do currículo vira uma lista de temas.
const knowsAbout = Array.from(
  new Set(
    ["Shopify", ...resume.skills.flatMap((s) => s.items.split(",").map((x) => x.trim()))].filter(
      (x) => x && x.length < 40,
    ),
  ),
);

export function personNode(locale: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.name,
    givenName: "João Pedro",
    familyName: "Gaspar",
    url: BASE,
    image: `${BASE}/brand/avatar-400.png`,
    email: `mailto:${siteConfig.email}`,
    jobTitle: siteConfig.role,
    description: DESCRIPTION[locale],
    homeLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressCountry: "BR" },
    },
    knowsAbout,
    knowsLanguage: ["pt-BR", "en", "es"],
    sameAs: [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean),
  };
}

export function websiteNode(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: BASE,
    name: siteConfig.name,
    alternateName: "jpgaspar.dev",
    description: DESCRIPTION[locale],
    inLanguage: ["en", "pt-BR"],
    publisher: { "@id": PERSON_ID },
  };
}

/** Página dentro do site: liga ao WebSite e diz a língua. */
export function webPageNode(locale: Locale, path: string, name: string, type = "WebPage") {
  const url = pageUrl(locale, path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    inLanguage: LANG[locale],
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** Trilha: [nome, caminho] do início até a página atual. */
export function breadcrumbNode(locale: Locale, trail: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: pageUrl(locale, path),
    })),
  };
}

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
