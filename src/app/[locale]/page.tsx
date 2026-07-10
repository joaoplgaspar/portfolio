import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/layout/Container";
import Reveal from "@/components/fx/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";
import Marquee from "@/components/ui/Marquee";
import ProjectCard from "@/components/work/ProjectCard";
import Hero3DMount from "@/components/three/Hero3DMount";
import { btn } from "@/components/ui/button";
import { getFeaturedProjects } from "@/data/projects";
import { capabilities } from "@/data/capabilities";
import { testimonials, clients } from "@/data/testimonials";

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
  const l = locale as Locale;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean),
  };

  const th = await getTranslations("home");
  const tsw = await getTranslations("selectedWork");
  const tc = await getTranslations("capabilities");
  const tsp = await getTranslations("socialProof");
  const tat = await getTranslations("aboutTeaser");
  const tab = await getTranslations("about");
  const tcc = await getTranslations("contactCta");

  const featured = getFeaturedProjects();

  return (
    <>
      <JsonLd data={person} />

      {/* Hero — craft (3D leve + posicionamento). Above-the-fold usa .rise (LCP-safe) */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <Container className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="rise rise-1 text-label text-accent-lift">{th("eyebrow")}</p>
            <h1 className="rise rise-2 text-display-xl mt-6 max-w-[15ch] text-balance">
              {th("headline")}
            </h1>
            <p className="rise rise-3 mt-8 max-w-xl text-lg leading-relaxed text-muted">
              {th("lede")}
            </p>
            <div className="rise rise-3 mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contato" className={btn("primary")}>
                {th("cta")}
              </Link>
              <AvailabilityBadge label={th("availability")} />
            </div>
          </div>
          <div className="relative hidden h-[520px] lg:block">
            <Hero3DMount />
          </div>
        </Container>
      </section>

      {/* Selected work */}
      <section className="border-t border-line py-24 md:py-40">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow={tsw("eyebrow")} title={tsw("title")} lede={tsw("lede")} />
            <Reveal>
              <Link
                href="/trabalho"
                className="hidden shrink-0 text-label text-muted transition-colors hover:text-fg sm:inline"
              >
                {tsw("viewAll")} ↗
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProjectCard project={p} locale={l} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-t border-line py-24 md:py-40">
        <Container>
          <SectionHeading eyebrow={tc("eyebrow")} title={tc("title")} />
          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="border-t border-line pt-6">
                  <span className="text-label text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-h3 mt-3">{c.title[l]}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{c.desc[l]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Prova social */}
      <section className="border-t border-line py-24 md:py-40">
        <Container>
          <SectionHeading eyebrow={tsp("eyebrow")} title={tsp("title")} />
          <div className="mt-12">
            <Marquee items={clients} />
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {testimonials.map((tm, i) => (
              <Reveal key={i} delay={i * 80}>
                <figure className="h-full rounded-[4px] border border-line bg-raised p-8">
                  <blockquote className="text-lg leading-relaxed text-fg">
                    “{tm.quote[l]}”
                  </blockquote>
                  <figcaption className="mt-6 text-label text-muted">
                    {tm.author} · {tm.role[l]}, {tm.company}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* About teaser */}
      <section className="border-t border-line py-24 md:py-40">
        <Container className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <Reveal>
            <div className="aspect-[4/5] w-full max-w-sm rounded-[4px] border border-line bg-raised" />
          </Reveal>
          <div>
            <Reveal>
              <p className="text-label text-accent-lift">{tat("eyebrow")}</p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-h2 mt-4 max-w-xl text-balance">{tab("title")}</p>
            </Reveal>
            <Reveal delay={160}>
              <Link
                href="/sobre"
                className="mt-8 inline-block text-label text-muted transition-colors hover:text-fg"
              >
                {tat("readMore")} ↗
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA final */}
      <section className="border-t border-line py-28 md:py-48">
        <Container className="text-center">
          <Reveal>
            <h2 className="text-display mx-auto max-w-[18ch] text-balance">
              {tcc("title")}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 flex flex-col items-center gap-4">
              <Link href="/contato" className={btn("primary")}>
                {tcc("cta")}
              </Link>
              <span className="text-label text-muted">{tcc("note")}</span>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
