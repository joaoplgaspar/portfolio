import type { Metadata } from "next";

type Locale = "pt" | "en";

/** Metadata consistente por página: título, descrição, canonical, hreflang, OG, Twitter. */
export function pageMeta({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string; // "/", "/trabalho", "/trabalho/dux"...
  title: string;
  description: string;
}): Metadata {
  const suffix = path === "/" ? "" : path;
  const ptUrl = suffix || "/";
  const enUrl = `/en${suffix}`;
  const canonical = locale === "en" ? enUrl : ptUrl;

  // openGraph/twitter (com a imagem do opengraph-image) ficam no layout, herdados
  // por todas as rotas do segmento [locale] — evita perder o og:image nas sub-rotas.
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { pt: ptUrl, en: enUrl, "x-default": ptUrl },
    },
  };
}
