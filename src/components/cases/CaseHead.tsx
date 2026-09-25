import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/types/project";

export type HeadText = {
  back: string;
  fig: string;
  client: string;
  role: string;
  year: string;
  stack: string;
  live: string;
};

/**
 * Cabeçalho da prancha do case. O título muda de forma conforme o projeto:
 * Roland / Boss se divide no eixo (duas marcas, uma fronteira no meio);
 * Integral / Darkness empilha as duas marcas; LIVRA é uma palavra só.
 */
export default function CaseHead({
  project,
  locale,
  n,
  t,
}: {
  project: Project;
  locale: Locale;
  n: number;
  t: HeadText;
}) {
  const [a, b] = project.title.split(" / ");

  return (
    <header>
      <div className="t-small flex justify-between">
        <Link href="/" className="tb-link">
          ← {t.back}
        </Link>
        <span className="t-fig">
          {t.fig} {n}
        </span>
      </div>

      {project.slug === "roland-boss" && b ? (
        <h1 className="t-hero mt-10 grid grid-cols-[1fr_auto_1fr] items-baseline gap-[2vw]">
          <span className="text-right">{a}</span>
          <span aria-hidden className="text-faint">
            /
          </span>
          <span>{b}</span>
        </h1>
      ) : project.slug === "integral-medica-darkness" && b ? (
        <h1 className="t-hero mt-10">
          <span className="block">{a}</span>
          <span className="block text-right">
            <span className="sr-only"> / </span>
            {b}
          </span>
        </h1>
      ) : (
        <h1 className="t-hero mt-10 text-[clamp(4rem,19vw,19rem)]">{project.title}</h1>
      )}

      <p className="mt-8 max-w-[44ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug font-[480]">
        {project.summary[locale]}
      </p>

      {project.stats && (
        <dl className="mt-12 grid grid-cols-2 gap-y-8 border-t border-fg pt-5 md:grid-cols-4">
          {project.stats.map((st) => (
            <div key={st.value + st.label.en} className="pr-4">
              <dt className="sr-only">{st.label[locale]}</dt>
              <dd>
                <span className="t-hero block text-[clamp(3rem,7vw,6.5rem)] tabular-nums">{st.value}</span>
                <span className="t-small mt-2 block max-w-[22ch] text-muted">{st.label[locale]}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Ficha: duas colunas de linhas rótulo → valor. Stack e domínios são
          longos; em quatro colunas eles espremiam o resto. */}
      <div className="mt-10 grid border-t border-fg md:grid-cols-2 md:gap-x-[var(--gut)]">
        <dl>
          <Row k={t.client}>{project.client[locale]}</Row>
          <Row k={t.role}>{project.role[locale]}</Row>
          <Row k={t.year}>{project.year}</Row>
        </dl>
        <dl>
          <Row k={t.stack}>
            <span className="flex flex-wrap gap-x-3 gap-y-1">
              {project.stack.map((s) => (
                <span key={s} className="t-code">
                  {s}
                </span>
              ))}
            </span>
          </Row>
          {project.live && (
            <Row k={t.live}>
              <span className="flex flex-col gap-1">
                {project.live.map((d) => (
                  <a key={d} href={`https://${d}`} target="_blank" rel="noreferrer" className="tb-link t-code self-start">
                    {d} ↗
                  </a>
                ))}
              </span>
            </Row>
          )}
        </dl>
      </div>
    </header>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-3">
      <dt className="tb-key !mb-0">{k}</dt>
      <dd className="t-small">{children}</dd>
    </div>
  );
}
