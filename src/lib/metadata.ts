import type { Metadata } from "next";

type Locale = "pt" | "en";

/** Metadata consistente por página: título, descrição, canonical, hreflang. EN é o locale sem prefixo. */
export function pageMeta({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string; // "/", "/sobre", "/trabalho/livra"...
  title: string;
  description: string;
}): Metadata {
  const suffix = path === "/" ? "" : path;
  const enUrl = suffix || "/";
  const ptUrl = `/pt${suffix}`;
  const canonical = locale === "pt" ? ptUrl : enUrl;

  // openGraph/twitter ficam no layout, herdados por todas as rotas do segmento [locale].
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: enUrl, pt: ptUrl, "x-default": enUrl },
    },
  };
}
