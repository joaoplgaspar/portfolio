import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import HomeSheet from "@/components/sheet/HomeSheet";
import TitleBlock from "@/components/sheet/TitleBlock";
import { isShown } from "@/components/figures/registry";
import { legends } from "@/data/figures";
import { fetchPublishedProjects } from "@/data/projects";
import { sheetPlan } from "@/lib/sheets";
import { logosOf, stores, visibleStores } from "@/data/stores";
import WorkGrid, { type WorkItem } from "@/components/sheet/WorkGrid";
import type { Print } from "@/components/sheet/ProjectThumb";
import { Link } from "@/i18n/navigation";

export const revalidate = 60; // ISR: novos projetos aparecem sem redeploy

/** O que identifica cada case de relance no índice: a marca, sempre. */
function printOf(slug: string, cover: string): Print | undefined {
  // Wordmark do app: "Livra" em Fraunces itálica, papel sobre a terracota do tema Linho.
  if (slug === "livra") return { kind: "logo", logos: ["/logos/livra.png"], plate: "#BC4B2F" };
  const brand = brandOf(slug);
  if (brand) return { kind: "logo", ...brand };
  return cover ? { kind: "site", src: cover } : undefined;
}

/** Logo e cor da marca de um case, vindos da loja que aponta para ele. */
function brandOf(caseSlug: string) {
  const s = stores.find((x) => x.caseSlug === caseSlug);
  const logos = s ? logosOf(s) : [];
  return s && logos.length ? { logos, plate: s.plate } : undefined;
}

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
  const t = await getTranslations("home");

  // Rascunho aparece no dev pela URL direta, nunca no índice: um índice com
  // "EM BREVE" é pior que um índice curto.
  const projects = await fetchPublishedProjects();
  const figured = projects.filter(isShown);

  const plan = sheetPlan(figured.length);
  const ts = await getTranslations("stores");
  const tp = await getTranslations("project");
  const tpp = await getTranslations("projectPage");
  const shown = visibleStores();
  const fig = t("fig");

  // Cases com figura primeiro, depois os projetos com capa. Cada um vira um
  // cartão que se expande: o case mostra a figura narrada; o projeto, a print.
  const work: WorkItem[] = [
    ...figured.map((p, i): WorkItem => ({
      key: p.slug,
      mark: `${fig} ${i + 1}`,
      title: p.title,
      meta: `${p.type[l]} · ${p.year}`,
      href: `/trabalho/${p.slug}`,
      cover:
        p.slug === "livra"
          ? { kind: "app", srcs: ["/livra/app-liga.webp", "/livra/app-inicio.webp", "/livra/app-lura.webp"] }
          : brandOf(p.slug)
            ? { kind: "logo", ...brandOf(p.slug)! }
            : p.cover
              ? { kind: "site", src: p.cover }
              : { kind: "drawing", slug: p.slug },
      summary: p.summary[l],
      facts: [
        { k: tp("client"), v: p.client[l] },
        { k: tp("role"), v: p.role[l] },
        { k: tp("year"), v: String(p.year) },
      ],
      stack: p.stack,
      live: p.live,
      figure: { slug: p.slug, caption: p.caption?.[l] ?? p.summary[l] },
    })),
    ...shown
      // Só os destaques: o resto mora em /projetos, senão a home vira lista.
      .filter((s) => s.featured && (s.cover || s.logo) && !s.caseSlug)
      .map(
        (s): WorkItem => ({
          key: s.slug,
          mark: s.mark,
          title: s.name,
          meta: `${s.platform} · ${s.year}`,
          href: `/projetos/${s.slug}`,
          cover: s.logo ? { kind: "logo", logos: logosOf(s), plate: s.plate } : { kind: "site", src: s.cover! },
          print: s.logo ? s.cover : undefined,
          summary: s.scope[l],
          facts: [
            { k: tpp("platform"), v: s.platform },
            { k: tpp("year"), v: String(s.year) },
            ...(s.role ? [{ k: tpp("role"), v: s.role[l] }] : []),
            ...(s.domain ? [] : [{ k: tpp("status"), v: ts("building") }]),
          ],
          live: s.domain ? [s.domain] : undefined,
          work: s.work?.map((w) => w[l]),
        }),
      ),
  ];

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean),
  };

  const [first, last] = [
    siteConfig.name.split(" ").slice(0, -1).join(" "),
    siteConfig.name.split(" ").slice(-1)[0],
  ];

  return (
    <>
      <JsonLd data={person} />
      <HomeSheet
        locale={l}
        legends={legends}
        items={figured.map((p) => ({
          slug: p.slug,
          title: p.title,
          caption: p.caption?.[l] ?? p.summary[l],
          type: p.type[l],
          year: p.year,
          live: p.live,
          print: printOf(p.slug, p.cover),
        }))}
        t={{
          index: t("index"),
          open: t("open"),
          fig: t("fig"),
          live: t("live"),
          play: t("play"),
          pause: t("pause"),
          prev: t("prev"),
          next: t("next"),
        }}
        intro={
          <div>
            <h1 className="t-name">
              {first}
              <br />
              {last}
            </h1>
            <p className="t-small mt-6 max-w-[38ch] text-[0.9375rem]">{t("lede")}</p>
            <p className="t-small mt-3 max-w-[38ch] text-muted">{t("status")}</p>
          </div>
        }
      />
      {/* Trabalho selecionado: grade de ponta a ponta; cada capa se expande num painel. */}
      <section className="mt-[clamp(56px,8vw,128px)] border-t border-fg pt-5" aria-labelledby="work-h">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="work-h" className="t-title">
            {t("selected")}
          </h2>
          <Link href="/projetos" className="t-small tb-link">
            {ts("all", { n: shown.length })} →
          </Link>
        </div>
        <WorkGrid
          items={work}
          locale={l}
          t={{
            expand: t("expand"),
            open: t("openFull"),
            close: t("close"),
            live: t("live"),
            stack: tp("stack"),
            play: t("play"),
            pause: t("pause"),
            prev: t("prev"),
            next: t("next"),
          }}
        />
      </section>

      <TitleBlock sheet={1} of={plan.total} title={t("sheetTitle")} />
    </>
  );
}
