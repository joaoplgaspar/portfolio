import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import Container from "@/components/layout/Container";
import Reveal from "@/components/fx/Reveal";
import ProjectCard from "@/components/work/ProjectCard";
import { getProjects } from "@/data/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  return pageMeta({
    locale: locale as Locale,
    path: "/trabalho",
    title: t("title"),
    description: t("lede"),
  });
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations("work");
  const projects = getProjects();

  return (
    <Container className="pb-24 pt-32 md:pb-40 md:pt-40">
      <Reveal>
        <p className="text-label text-accent-lift">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="text-display mt-4">{t("title")}</h1>
      </Reveal>
      <Reveal delay={140}>
        <p className="mt-4 max-w-xl text-lg text-muted">{t("lede")}</p>
      </Reveal>

      <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80}>
            <ProjectCard project={p} locale={l} />
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
