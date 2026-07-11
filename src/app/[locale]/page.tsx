import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/layout/Container";
import Marquee from "@/components/ui/Marquee";
import Hero3DMount from "@/components/three/Hero3DMount";
import { btn } from "@/components/ui/button";
import { getFeaturedProjects } from "@/data/projects";
import { capabilities } from "@/data/capabilities";
import { clients } from "@/data/testimonials";

const STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Shopify Hydrogen",
  "GraphQL",
  "GSAP",
  "Three.js",
  "Tailwind",
];

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

const tile =
  "group relative flex flex-col overflow-hidden rounded-[6px] border border-line bg-raised transition-colors duration-300";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const th = await getTranslations("home");
  const tw = await getTranslations("selectedWork");
  const tc = await getTranslations("capabilities");
  const texp = await getTranslations("experience");
  const tlab = await getTranslations("lab");
  const tcc = await getTranslations("contactCta");

  const featured = getFeaturedProjects();
  const top = featured[0];

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean),
  };

  return (
    <Container className="pb-16 pt-28 md:pt-32">
      <JsonLd data={person} />

      <div className="grid auto-rows-[minmax(148px,auto)] grid-cols-2 gap-3 lg:auto-rows-[212px] lg:grid-cols-4">
        {/* Identidade */}
        <section className="group relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-[6px] border border-line bg-raised p-7">
          <p className="rise text-label text-accent-lift">{th("eyebrow")}</p>
          <div>
            <h1 className="rise rise-1 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.98] tracking-tight text-balance">
              {th("headline")}
            </h1>
            <p className="rise rise-2 mt-4 max-w-md leading-relaxed text-muted">
              {th("lede")}
            </p>
            <Link href="/contato" className={`rise rise-3 mt-6 ${btn("primary")}`}>
              {th("cta")}
            </Link>
          </div>
        </section>

        {/* 3D — tile "vivo" */}
        <div className={`rise rise-1 col-span-2 row-span-1 lg:row-span-2 ${tile}`}>
          <Hero3DMount />
          <span className="pointer-events-none absolute bottom-4 left-5 text-label text-muted/70">
            WebGL
          </span>
        </div>

        {/* Projeto em destaque */}
        {top && (
          <Link
            href={`/trabalho/${top.slug}`}
            className={`rise rise-2 col-span-2 row-span-1 justify-between p-6 hover:border-fg/25 ${tile}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-label text-muted">{tw("eyebrow")}</p>
                <h2 className="text-h3 mt-2">{top.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{top.summary[l]}</p>
              </div>
              <span className="text-label text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                ↗
              </span>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-accent/25 transition-colors duration-300 group-hover:bg-accent" />
          </Link>
        )}

        {/* Capabilities */}
        <div className={`rise rise-2 col-span-1 row-span-1 p-6 ${tile}`}>
          <p className="text-label text-accent-lift">{tc("eyebrow")}</p>
          <ul className="mt-auto flex flex-col gap-1.5">
            {capabilities.map((c, i) => (
              <li key={i} className="text-sm font-medium">
                {c.title[l]}
              </li>
            ))}
          </ul>
        </div>

        {/* Lab */}
        <Link
          href="/lab"
          className={`rise rise-3 col-span-1 row-span-1 justify-between p-6 hover:border-fg/25 ${tile}`}
        >
          <p className="text-label text-accent-lift">{tlab("eyebrow")}</p>
          <div>
            <p className="line-clamp-2 text-sm text-muted">{tlab("lede")}</p>
            <span className="mt-2 inline-block text-label text-muted transition-colors group-hover:text-fg">
              ↗
            </span>
          </div>
        </Link>

        {/* Stack */}
        <div className={`rise rise-3 col-span-2 row-span-1 justify-between p-6 ${tile}`}>
          <p className="text-label text-muted">Stack</p>
          <div className="flex flex-wrap gap-2">
            {STACK.map((s) => (
              <span
                key={s}
                className="rounded-[3px] border border-line px-2.5 py-1 font-mono text-xs text-muted"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Trajetória */}
        <div className={`rise rise-3 col-span-2 row-span-1 justify-between p-6 ${tile}`}>
          <p className="text-label text-accent-lift">{texp("eyebrow")}</p>
          <div className="-mx-6">
            <Marquee items={clients} />
          </div>
        </div>

        {/* Contato — faixa */}
        <Link
          href="/contato"
          className={`rise rise-3 col-span-2 row-span-1 justify-center p-7 hover:border-fg/25 lg:col-span-4 ${tile}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-h3">{tcc("title")}</p>
              <p className="mt-1 text-sm text-muted">{siteConfig.email}</p>
            </div>
            <span className={`hidden shrink-0 sm:inline-flex ${btn("primary")}`}>
              {tcc("cta")}
            </span>
          </div>
        </Link>
      </div>
    </Container>
  );
}
