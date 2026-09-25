import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import TitleBlock from "@/components/sheet/TitleBlock";
import CaseHead from "@/components/cases/CaseHead";
import CaseText from "@/components/cases/CaseText";
import FigurePlate from "@/components/cases/FigurePlate";
import CartLab from "@/components/cases/CartLab";
import BrandWipe from "@/components/cases/BrandWipe";
import DiscountCalc from "@/components/cases/DiscountCalc";
import Reconcile from "@/components/cases/Reconcile";
import { hasFigure, isShown } from "@/components/figures/registry";
import { legends } from "@/data/figures";
import { brands, cartLab, livraCopy, reconcile, taxLab } from "@/data/caseCopy";
import TaxLab from "@/components/cases/TaxLab";
import { scanner, screens, themes } from "@/data/livra";
import AnnotatedScreens from "@/components/cases/livra/AnnotatedScreens";
import Scanner from "@/components/cases/livra/Scanner";
import Themes from "@/components/cases/livra/Themes";
import { fetchPublishedProjects, fetchProject } from "@/data/projects";
import type { Project } from "@/types/project";
import { sheetPlan } from "@/lib/sheets";

export const revalidate = 60; // ISR
export const dynamicParams = true; // slugs novos renderizam sob demanda

export async function generateStaticParams() {
  return (await fetchPublishedProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await fetchProject(slug);
  if (!project) return {};
  const l = locale as Locale;
  return pageMeta({
    locale: l,
    path: `/trabalho/${slug}`,
    title: project.title,
    description: project.summary[l],
  });
}

/** Bloco interativo do case: título e lede à esquerda, peça à direita/abaixo. */
function Lab({ title, lede, note, children }: { title: string; lede: string; note?: string; children: ReactNode }) {
  return (
    <section className="border-t border-fg pt-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[var(--gut)]">
        <h2 className="t-title max-w-[16ch] text-[clamp(1.5rem,2.4vw,2.2rem)]">{title}</h2>
        <div>
          <p className="max-w-[60ch] text-[1.0625rem] leading-[1.55]">{lede}</p>
          {note && <p className="t-small mt-2 text-faint">{note}</p>}
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const project = await fetchProject(slug);
  if (!project) notFound();

  const t = await getTranslations("project");
  const th = await getTranslations("home");
  const all = (await fetchPublishedProjects()).filter(isShown);
  const idx = all.findIndex((p) => p.slug === slug);
  const n = idx + 1;
  const next: Project | undefined = all.length > 1 ? all[(idx + 1) % all.length] : undefined;

  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    about: project.summary[l],
    creator: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    dateCreated: String(project.year),
    keywords: project.stack.join(", "),
  };

  const fig = th("fig");
  const caption = project.caption?.[l] ?? project.summary[l];
  const plate = hasFigure(slug) && (
    <FigurePlate
      slug={slug}
      n={n}
      caption={caption}
      legend={legends[slug] ?? []}
      locale={l}
      labels={{ fig, play: th("play"), pause: th("pause"), prev: th("prev"), next: th("next") }}
    />
  );
  const note = t("illustrative");

  // Cada case tem a sua ordem. A peça que prova a decisão central vem
  // antes do texto que a explica — quem lê já chegou lá tendo mexido nela.
  let body: ReactNode;
  if (slug === "roland-boss") {
    const c = cartLab[l];
    body = (
      <>
        {plate}
        <Lab title={c.title} lede={c.lede} note={note}>
          <CartLab t={c.ui} />
        </Lab>
      </>
    );
  } else if (slug === "integral-medica-darkness") {
    const c = brands[l];
    body = (
      <>
        <BrandWipe label={c.wipe} a={c.a} b={c.b} />
        {plate}
        <Lab title={c.discountTitle} lede={c.discountLede} note={note}>
          <div className="max-w-[640px]">
            <DiscountCalc t={c.ui} />
          </div>
        </Lab>
      </>
    );
  } else if (slug === "hsm-singularity") {
    const c = taxLab[l];
    body = (
      <>
        {plate}
        <Lab title={c.title} lede={c.lede} note={note}>
          <div className="max-w-[880px]">
            <TaxLab t={c.ui} />
          </div>
        </Lab>
      </>
    );
  } else if (slug === "livra") {
    // O maior case: primeiro o produto (telas reais), depois a engenharia.
    const c = reconcile[l];
    const v = livraCopy[l];
    const nl = { play: th("play"), pause: th("pause"), prev: th("prev"), next: th("next") };
    body = (
      <>
        <Lab title={v.appTitle} lede={v.appLede} note={v.appNote}>
          <AnnotatedScreens screens={screens} locale={l} labels={nl} fig={fig} n={n} />
        </Lab>
        <Lab title={v.scanTitle} lede={v.scanLede}>
          <Scanner frames={scanner} locale={l} labels={nl} fig={`${fig} ${n}${String.fromCharCode(97 + screens.length)}`} title={v.scanCaption} />
        </Lab>
        {plate}
        <Lab title={c.title} lede={c.lede} note={note}>
          <Reconcile t={c.ui} />
        </Lab>
        <Lab title={v.themesTitle} lede={v.themesLede} note={v.appNote}>
          <Themes items={themes} fig={`${fig} ${n}${String.fromCharCode(98 + screens.length)}`} caption={v.themesCaption} />
        </Lab>
      </>
    );
  } else {
    body = plate;
  }

  return (
    <article>
      <JsonLd data={creativeWork} />
      <CaseHead
        project={project}
        locale={l}
        n={n || 0}
        t={{
          back: t("backToWork"),
          fig,
          client: t("client"),
          role: t("role"),
          year: t("year"),
          stack: t("stack"),
          live: t("live"),
        }}
      />

      <div className="mt-[clamp(48px,7vw,112px)] space-y-[clamp(56px,8vw,128px)]">
        {body}
        {project.body && <CaseText blocks={project.body[l]} />}
      </div>

      {next && (
        <Link href={`/trabalho/${next.slug}`} className="group mt-8 block border-t border-fg pt-5">
          <span className="t-fig text-faint">
            {t("next")} · {fig} {all.indexOf(next) + 1}
          </span>
          <span className="idx-title t-hero mt-3 block text-[clamp(2.4rem,6vw,6rem)] transition-[font-stretch] group-hover:[font-stretch:116%]">
            {next.title} →
          </span>
        </Link>
      )}

      <TitleBlock sheet={n + 1} of={sheetPlan(all.length).total} title={`${fig} ${n} — ${project.title}`} />
    </article>
  );
}
