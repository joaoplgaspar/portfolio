import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import Container from "@/components/layout/Container";
import Reveal from "@/components/fx/Reveal";
import ProjectCover from "@/components/work/ProjectCover";
import SpecSheet from "@/components/work/SpecSheet";
import JsonLd from "@/components/seo/JsonLd";
import { getProjects, getProject } from "@/data/projects";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const l = locale as Locale;
  return pageMeta({
    locale: l,
    path: `/trabalho/${slug}`,
    title: project.title,
    description: project.summary[l],
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("project");
  const all = getProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  const next = all[(idx + 1) % all.length];

  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    about: project.summary[l],
    creator: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    dateCreated: String(project.year),
    keywords: project.stack.join(", "),
  };

  return (
    <article>
      <JsonLd data={creativeWork} />
      {/* Hero do projeto: product shot + título + resultado */}
      <Container className="pt-32 md:pt-40">
        <Reveal>
          <Link
            href="/"
            className="text-label text-muted transition-colors hover:text-fg"
          >
            ← {t("backToWork")}
          </Link>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[0.95] tracking-tight text-balance">
            {project.title}
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-4 max-w-xl text-lg text-muted">{project.summary[l]}</p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-12">
            <ProjectCover project={project} />
          </div>
        </Reveal>
      </Container>

      {/* Corpo + ficha técnica */}
      <Container className="grid gap-12 py-20 md:grid-cols-[1.5fr_1fr] md:gap-16 md:py-28">
        <div className="order-2 flex flex-col gap-12 md:order-1">
          <Reveal>
            <section>
              <h2 className="text-label text-accent-lift">{t("problem")}</h2>
              <p className="mt-4 text-balance text-xl leading-relaxed">
                {project.problem[l]}
              </p>
            </section>
          </Reveal>
          <Reveal>
            <section>
              <h2 className="text-label text-accent-lift">{t("contribution")}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {project.contribution[l]}
              </p>
            </section>
          </Reveal>
          {project.results.length > 0 && (
            <Reveal>
              <section>
                <h2 className="text-label text-accent-lift">{t("results")}</h2>
                <dl className="mt-4 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2">
                  {project.results.map((r) => (
                    <div key={r.label} className="bg-bg p-6">
                      <dt className="text-label text-muted">{r.label}</dt>
                      <dd className="mt-2 font-display text-2xl">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>
          )}
        </div>

        <aside className="order-1 md:order-2">
          <div className="md:sticky md:top-24">
            <SpecSheet project={project} />
          </div>
        </aside>
      </Container>

      {/* Próximo projeto (navegação encadeada) */}
      <Container className="border-t border-line py-16">
        <Link
          href={`/trabalho/${next.slug}`}
          className="group flex items-center justify-between gap-6"
        >
          <div>
            <span className="text-label text-muted">{t("next")}</span>
            <p className="text-h2 mt-2 transition-colors group-hover:text-accent-lift">
              {next.title}
            </p>
          </div>
          <span className="text-h2 text-muted">↗</span>
        </Link>
      </Container>
    </article>
  );
}
