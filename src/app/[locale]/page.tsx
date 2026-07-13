import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/layout/Container";
import IndexList from "@/components/work/IndexList";
import { fetchPublishedProjects } from "@/data/projects";

export const revalidate = 60; // ISR: novos projetos aparecem sem redeploy

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const base = pageMeta({
    locale: locale as Locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
  return { ...base, title: { absolute: t("title") } };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const th = await getTranslations("home");
  const tlab = await getTranslations("lab");
  const projects = await fetchPublishedProjects();

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean),
  };

  return (
    <Container className="pt-28 md:pt-32">
      <JsonLd data={person} />

      {/* posicionamento factual (mono) */}
      <div className="rise">
        <p className="text-label text-muted">{th("tagline")}</p>
        <p className="mt-1 text-label text-stone-400">{siteConfig.location}</p>
      </div>

      {/* Índice interativo — a lista É o hero */}
      <div id="work">
        <IndexList
          items={projects.map((p) => ({
            slug: p.slug,
            title: p.title,
            type: p.type,
            year: p.year,
            cover: p.cover,
          }))}
        />
      </div>

      {/* Faixa Lab */}
      <Link
        href="/lab"
        className="group mt-16 flex items-center justify-between gap-6 border-t border-line pt-8 md:mt-24"
      >
        <div>
          <span className="text-label text-accent-lift">LAB ↗</span>
          <p className="mt-2 max-w-md text-muted">{tlab("lede")}</p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 w-24 rounded-[3px] border border-line bg-raised transition-colors group-hover:border-fg/25"
            />
          ))}
        </div>
      </Link>
    </Container>
  );
}
