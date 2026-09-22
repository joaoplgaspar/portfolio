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
import { visibleStores } from "@/data/stores";
import StoreCard from "@/components/sheet/StoreCard";
import { Link } from "@/i18n/navigation";

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
  const l = locale as Locale;
  const t = await getTranslations("home");

  // Rascunho aparece no dev pela URL direta, nunca no índice: um índice com
  // "EM BREVE" é pior que um índice curto.
  const projects = await fetchPublishedProjects();
  const figured = projects.filter(isShown);

  const plan = sheetPlan(figured.length);
  const ts = await getTranslations("stores");
  const stores = visibleStores();

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
      {/* Projetos: as capas chamam o olho; o quadro completo fica em /projetos. */}
      <section className="mt-[clamp(56px,8vw,128px)] border-t border-fg pt-5" aria-labelledby="stores-h">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="stores-h" className="t-title">
            {ts("title")}
          </h2>
          <Link href="/projetos" className="t-small tb-link">
            {ts("all", { n: stores.length })} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-[var(--gut)] gap-y-8 lg:grid-cols-4">
          {stores
            .filter((s) => s.cover)
            .slice(0, 4)
            .map((s) => (
              <StoreCard
                key={s.mark}
                store={s}
                locale={l}
                size="compact"
                t={{ pending: ts("pending"), score: ts("score"), measured: ts("measured") }}
              />
            ))}
        </div>
      </section>

      <TitleBlock sheet={1} of={plan.total} title={t("sheetTitle")} />
    </>
  );
}
