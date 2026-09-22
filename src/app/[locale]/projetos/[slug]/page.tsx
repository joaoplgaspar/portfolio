import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { sheetPlan } from "@/lib/sheets";
import TitleBlock from "@/components/sheet/TitleBlock";
import ProjectPerf from "@/components/perf/ProjectPerf";
import { isShown } from "@/components/figures/registry";
import { fetchPublishedProjects } from "@/data/projects";
import { getStore, visibleStores } from "@/data/stores";

export function generateStaticParams() {
  return visibleStores().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = getStore(slug);
  if (!s) return {};
  const l = locale as Locale;
  return pageMeta({ locale: l, path: `/projetos/${slug}`, title: s.name, description: s.scope[l] });
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-3">
      <dt className="tb-key !mb-0">{k}</dt>
      <dd className="t-small">{children}</dd>
    </div>
  );
}

/**
 * Página de um projeto do quadro: o básico (o que é, plataforma, papel, o
 * site no ar), a capa grande e a performance quando houver print.
 */
export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const s = getStore(slug);
  if (!s) notFound();

  const t = await getTranslations("stores");
  const tp = await getTranslations("projectPage");
  const cases = (await fetchPublishedProjects()).filter(isShown);
  const plan = sheetPlan(cases.length);

  const list = visibleStores();
  const i = list.findIndex((x) => x.slug === slug);
  const next = list[(i + 1) % list.length];
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <article>
      <div className="t-small flex justify-between">
        <Link href="/projetos" className="tb-link">
          ← {t("title")}
        </Link>
        <span className="t-fig">{s.mark}</span>
      </div>

      <h1 className="t-hero mt-10">{s.name}</h1>
      <p className="mt-6 max-w-[44ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug font-[480]">{s.scope[l]}</p>

      <div className="mt-10 grid border-t border-fg md:grid-cols-2 md:gap-x-[var(--gut)]">
        <dl>
          <Row k={tp("platform")}>{s.platform}</Row>
          <Row k={tp("year")}>{s.year}</Row>
        </dl>
        <dl>
          {s.role && <Row k={tp("role")}>{s.role[l]}</Row>}
          {s.domain && (
            <Row k={tp("live")}>
              <a href={`https://${s.domain}`} target="_blank" rel="noreferrer" className="tb-link t-code">
                {s.domain} ↗
              </a>
            </Row>
          )}
          {s.caseSlug && (
            <Row k={tp("case")}>
              <Link href={`/trabalho/${s.caseSlug}`} className="tb-link">
                {tp("openCase")} →
              </Link>
            </Row>
          )}
        </dl>
      </div>

      <figure className="mt-[clamp(40px,6vw,88px)]">
        <div className="border border-fg bg-[var(--plate)]">
          <div className="flex items-center justify-between gap-3 border-b border-fg px-3 py-2">
            <span className="t-code truncate text-muted">{s.domain ?? "—"}</span>
            <span className="t-fig">{s.mark}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            {s.cover ? (
              <Image src={s.cover} alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover object-top" priority />
            ) : (
              <div
                className="absolute inset-0 grid place-items-center"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 7px)" }}
              >
                <span className="t-small bg-[var(--bg)] px-2 text-faint">{t("pending")}</span>
              </div>
            )}
          </div>
        </div>
      </figure>

      {s.media && (
        <figure className="mt-6 border border-fg">
          <div className="relative aspect-[16/10] overflow-hidden">
            {s.media.kind === "video" ? (
              <video
                src={s.media.src}
                poster={s.media.poster}
                muted
                loop
                playsInline
                controls
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            ) : (
              <Image
                src={s.media.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                unoptimized={s.media.src.endsWith(".gif")}
                className="object-cover object-top"
              />
            )}
          </div>
        </figure>
      )}

      {s.work && (
        <section className="mt-[clamp(48px,7vw,104px)] grid gap-4 border-t border-fg pt-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[var(--gut)]">
          <h2 className="t-title text-[clamp(1.5rem,2.4vw,2.2rem)]">{tp("work")}</h2>
          <ul className="max-w-[66ch] border-b border-line">
            {s.work.map((w) => (
              <li key={w.en} className="border-t border-line py-3 text-[1.0625rem]">
                {w[l]}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(s.psi || isDev) && (
        <section className="mt-[clamp(48px,7vw,104px)]">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="t-title text-[clamp(1.5rem,2.4vw,2.2rem)]">{tp("perf")}</h2>
          </div>
          {s.psi ? (
            <ProjectPerf
              psi={s.psi}
              mark={s.mark}
              t={{
                score: t("score"),
                scoreHelp: tp("scoreHelp"),
                measured: t("measured"),
                value: tp("value"),
                metric: { lcp: t("metric.lcp"), tbt: t("metric.tbt"), cls: t("metric.cls") },
              }}
            />
          ) : (
            <p className="t-small border-t border-fg pt-4 text-faint">{tp("perfPending")}</p>
          )}
        </section>
      )}

      {next && next.slug !== s.slug && (
        <Link href={`/projetos/${next.slug}`} className="group mt-[clamp(56px,8vw,128px)] block border-t border-fg pt-5">
          <span className="t-fig text-faint">
            {tp("next")} · {next.mark}
          </span>
          <span className="idx-title t-hero mt-3 block text-[clamp(2.4rem,6vw,6rem)] transition-[font-stretch] group-hover:[font-stretch:116%]">
            {next.name}&nbsp;→
          </span>
        </Link>
      )}

      <TitleBlock sheet={plan.stores} of={plan.total} title={`${s.mark} — ${s.name}`} />
    </article>
  );
}
