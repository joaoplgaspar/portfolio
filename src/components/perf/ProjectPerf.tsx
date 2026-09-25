import { Scale } from "./Instruments";
import { LAB, fmtLab, type LabMetric, type Psi } from "@/data/stores";

/**
 * Performance de um projeto: a nota do PageSpeed (celular) e as três
 * métricas por trás dela, cada uma na régua com as zonas bom / precisa
 * melhorar / ruim. A agulha é o valor do projeto; a data é a do print.
 */
export default function ProjectPerf({
  psi,
  mark,
  t,
}: {
  psi: Psi;
  mark: string;
  t: {
    score: string;
    scoreHelp: string;
    measured: string;
    value: string;
    metric: Record<LabMetric, string>;
  };
}) {
  const scoreOk = psi.score >= LAB.score.good;
  const metrics: { m: LabMetric; tick: number }[] = [
    { m: "lcp", tick: 1 },
    { m: "tbt", tick: 100 },
    { m: "cls", tick: 0.05 },
  ];

  return (
    <div className="border-t border-fg">
      <div className="grid gap-4 border-b border-line py-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:items-end lg:gap-[var(--gut)]">
        <div>
          <p className="t-fig text-faint">{t.score}</p>
          <p className={`t-hero text-[clamp(3.5rem,8vw,7rem)] tabular-nums ${scoreOk ? "" : "text-accent"}`}>
            {psi.score}
          </p>
          <p className="t-small text-muted">{t.scoreHelp}</p>
        </div>
        <p className="t-code text-faint">
          {t.measured} {psi.date}
        </p>
      </div>
      {metrics.map(({ m, tick }) => (
        <div
          key={m}
          className="grid gap-4 border-b border-line py-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:items-center lg:gap-[var(--gut)]"
        >
          <div>
            <p className="t-fig text-faint">{m.toUpperCase()}</p>
            <p className={`t-title mt-1 tabular-nums ${psi[m] <= LAB[m].good ? "" : "text-accent"}`}>
              {fmtLab(m, psi[m])}
            </p>
            <p className="t-small mt-1 text-muted">{t.metric[m]}</p>
          </div>
          <Scale metric={m} values={[{ mark, v: psi[m] }]} median={psi[m]} medianLabel={t.value} tick={tick} />
        </div>
      ))}
    </div>
  );
}
