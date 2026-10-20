import type { Metadata } from "next";

type Locale = "pt" | "en";

const SITE = "João Pedro Gaspar";

/** Metadata consistente por página: título, descrição, canonical, hreflang. EN é o locale sem prefixo. */
export function pageMeta({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string; // "/", "/about", "/work/livra"...
  title: string;
  description: string;
}): Metadata {
  const suffix = path === "/" ? "" : path;
  const enUrl = suffix || "/";
  const ptUrl = `/pt${suffix}`;
  const canonical = locale === "pt" ? ptUrl : enUrl;

  // Título e descrição de compartilhamento por página (senão todo link
  // aparece com os da home). Definir openGraph aqui substitui o do layout
  // inteiro, inclusive a imagem: por isso ela vem de novo, a do locale.
  const shareTitle = path === "/" ? title : `${title} — ${SITE}`;
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: `${SITE} — Shopify front-end engineer` };
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: SITE,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      title: shareTitle,
      description,
      url: canonical,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image.url] },
    alternates: {
      canonical,
      languages: { en: enUrl, pt: ptUrl, "x-default": enUrl },
    },
  };
}
