import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { sheetPlan } from "@/lib/sheets";
import TitleBlock from "@/components/sheet/TitleBlock";
import StoreCard from "@/components/sheet/StoreCard";
import { Scale } from "@/components/perf/Instruments";
import { isShown } from "@/components/figures/registry";
import { fetchPublishedProjects } from "@/data/projects";
import { fmtLab, median, visibleStores, type LabMetric } from "@/data/stores";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stores" });
  return pageMeta({ locale: locale as Locale, path: "/projetos", title: t("title"), description: t("lede") });
}

/**
 * Quadro de projetos. Os destaques (os que têm case com figura) em tamanho
 * grande; o resto em três por linha. Cada um abre a própria página.
 */
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations("stores");
  const cases = (await fetchPublishedProjects()).filter(isShown);
  const plan = sheetPlan(cases.length);

  const list = visibleStores();
  const featured = list.filter((s) => s.featured);
  const rest = list.filter((s) => !s.featured);
  const measured = list.filter((s) => s.psi);
  const counts = [
    { v: list.length, k: t("count") },
    { v: list.filter((s) => s.platform === "Liquid").length, k: "Liquid" },
    { v: list.filter((s) => s.platform === "Hydrogen").length, k: "Hydrogen" },
  ];
  const cardText = { pending: t("pending"), score: t("score"), measured: t("measured") };

  // O painel do conjunto só existe com amostra que mereça mediana.
  const panel = measured.length >= 3;
  const metrics: { m: LabMetric; tick: number }[] = [
    { m: "lcp", tick: 1 },
    { m: "tbt", tick: 100 },
    { m: "cls", tick: 0.05 },
  ];

  return (
    <>
      <p className="t-fig uppercase text-faint">{t("eyebrow")}</p>
      <h1 className="t-hero mt-6">{t("title")}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-[var(--gut)]">
        <p className="max-w-[56ch] text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-snug font-[480]">{t("lede")}</p>
        <dl className="grid grid-cols-3 border-t border-fg pt-4 lg:self-end">
          {counts.map((c) => (
            <div key={c.k}>
              <dd className="t-hero text-[clamp(2.4rem,5vw,4.5rem)] tabular-nums">{c.v}</dd>
              <dt className="t-small text-muted">{c.k}</dt>
            </div>
          ))}
        </dl>
      </div>

      {panel && (
        <section className="mt-[clamp(48px,7vw,104px)] border-t border-fg">
          <div className="grid gap-4 border-b border-line py-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:items-center lg:gap-[var(--gut)]">
            <div>
              <p className="t-fig text-faint">{t("score")}</p>
              <p className="t-hero text-[clamp(3rem,6vw,5.5rem)] tabular-nums">
                {median(measured.map((s) => s.psi!.score))}
              </p>
              <p className="t-small text-muted">{t("scoreHelp")}</p>
            </div>
            <p className="t-small max-w-[60ch] text-muted">{t("howTo")}</p>
          </div>
          {metrics.map(({ m, tick }) => {
            const vals = measured.map((s) => ({ mark: s.mark, v: s.psi![m] }));
            return (
              <div
                key={m}
                className="grid gap-4 border-b border-line py-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:items-center lg:gap-[var(--gut)]"
              >
                <div>
                  <p className="t-fig text-faint">{m.toUpperCase()}</p>
                  <p className="t-title mt-1 tabular-nums">{fmtLab(m, median(vals.map((v) => v.v)))}</p>
                  <p className="t-small mt-1 text-muted">{t(`metric.${m}`)}</p>
                </div>
                <Scale metric={m} values={vals} median={median(vals.map((v) => v.v))} medianLabel={t("median")} tick={tick} />
              </div>
            );
          })}
        </section>
      )}

      <section className="mt-[clamp(48px,7vw,104px)] grid gap-x-[var(--gut)] gap-y-12 sm:grid-cols-2">
        {featured.map((s) => (
          <StoreCard key={s.slug} store={s} locale={l} t={cardText} />
        ))}
      </section>

      {rest.length > 0 && (
        <section className="mt-[clamp(48px,6vw,88px)] border-t border-fg pt-5">
          <h2 className="t-fig mb-6 uppercase text-faint">{t("more")}</h2>
          <div className="grid grid-cols-2 gap-x-[var(--gut)] gap-y-10 lg:grid-cols-3">
            {rest.map((s) => (
              <StoreCard key={s.slug} store={s} locale={l} t={cardText} size="small" />
            ))}
          </div>
        </section>
      )}

      <p className="t-small mt-10 max-w-[70ch] text-muted">{t("note")}</p>

      <TitleBlock sheet={plan.stores} of={plan.total} title={t("title")} />
    </>
  );
}
