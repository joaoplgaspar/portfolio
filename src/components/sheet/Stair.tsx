"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { Stage } from "@/data/about";
import type { Legend } from "@/data/figures";
import { Fig, Hatch, Leader, Part, useSafeId } from "@/components/figures/parts";
import { Note, SeqProvider, Show, Travel, useSeq, useSequence, type Step } from "@/components/figures/sequence";
import Narration, { type NarrationLabels } from "@/components/figures/Narration";
import LegendList from "@/components/figures/LegendList";

/**
 * Trajetória em corte de escada, com o tempo de verdade no chão.
 *
 * O eixo vai de jan/2024 a dez/2026: a largura de cada piso é o tempo no
 * cargo, então 11 meses de estágio e 4 de júnior aparecem como são. Uma cota
 * em sinal mede as duas promoções. A faculdade não é degrau: é uma faixa
 * paralela embaixo do chão, porque correu junto com o trabalho. O que veio
 * antes fica do outro lado de uma linha de interrupção (o trecho omitido de
 * um desenho técnico). A certificação é o degrau tracejado, em construção; o
 * Livra é a torre ao lado, mais alta que a escada.
 */

const GROUND = 350;
const RISE = 62;
const AX0 = 160; // jan/2024
const AX1 = 620; // dez/2026
const PX = (AX1 - AX0) / 36;
const TX = 690;
const TW = 80;
const TTOP = 46;

const T = {
  en: { months: "mo", promo: "15 months · 2 promotions", since: "since 2023", now: "now", users: "600 users · month one", solo: "several stores a month, mostly solo" },
  pt: { months: "meses", promo: "15 meses · 2 promoções", since: "desde 2023", now: "hoje", users: "600 usuários · 1º mês", solo: "várias lojas por mês, a maioria solo" },
};

/** "AAAA-MM" → x no eixo (presa ao trecho desenhado). */
function xOf(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const x = AX0 + ((y - 2024) * 12 + (m - 1)) * PX;
  return Math.min(AX1, Math.max(AX0, x));
}

function monthsBetween(a: string, b: string) {
  const [ya, ma] = a.split("-").map(Number);
  const [yb, mb] = b.split("-").map(Number);
  return (yb - ya) * 12 + (mb - ma);
}

/** Mês corrente, "AAAA-MM": onde a escada termina hoje. */
function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function Stair({
  stages,
  locale,
  labels,
  fig,
  caption,
}: {
  stages: Stage[];
  locale: Locale;
  labels: NarrationLabels;
  fig: string;
  caption: string;
}) {
  const steps = useMemo<Step[]>(
    () =>
      stages.map((s) => ({
        dur: 3.8,
        on: [s.n],
        title: s.short,
        act: s.kind === "founder" ? "result" : "solution",
        caption: { en: `${s.title.en}. ${s.body.en}`, pt: `${s.title.pt}. ${s.body.pt}` },
      })),
    [stages],
  );
  const legend = useMemo<Legend>(
    () =>
      stages.map((s) => ({
        n: s.n,
        label: {
          en: s.period.en ? `${s.title.en} · ${s.period.en}` : s.title.en,
          pt: s.period.pt ? `${s.title.pt} · ${s.period.pt}` : s.title.pt,
        },
      })),
    [stages],
  );
  const seq = useSequence(steps, { autoplay: true, loop: true });
  const { step, observe } = seq;
  const [hover, setHover] = useState<number | null>(null);
  const lit = hover != null ? [hover] : (steps[step]?.on ?? []);

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-start">
      <div>
        <div ref={observe} className="plate relative border border-fg px-[4%] pt-12 pb-6">
          <span className="t-fig absolute top-3 left-4">{fig}</span>
          <SeqProvider seq={seq}>
            <Fig title={caption} lit={lit} viewBox="0 0 800 430">
              <Drawing stages={stages} locale={locale} />
            </Fig>
          </SeqProvider>
        </div>
        <div className="mt-4">
          <Narration seq={seq} locale={locale} labels={labels} />
        </div>
      </div>
      <div className="lg:pt-10">
        <p className="t-small mb-3">
          <span className="t-fig mr-2">{fig}</span>
          {caption}
        </p>
        <LegendList legend={legend} locale={locale} active={hover} onActive={setHover} columns={1} />
      </div>
    </section>
  );
}

function Drawing({ stages, locale }: { stages: Stage[]; locale: Locale }) {
  const hatch = useSafeId("h");
  const { step, mode } = useSeq();
  const t = T[locale];
  const plain = mode === "plain";
  const at = (n: number) => stages.findIndex((s) => s.n === n);
  const s = (n: number) => stages.find((x) => x.n === n);

  const now = thisMonth();
  const xNow = xOf(now);
  const intern = s(14);
  const junior = s(16);
  const lead = s(18);
  const degree = s(12);
  const tower = s(30);

  // Pisos no tempo: cada cargo começa no fim do anterior.
  const treads = [intern, junior, lead]
    .filter((x): x is Stage => !!x?.from)
    .map((x, i) => ({
      stage: x,
      x0: xOf(x.from!),
      x1: x.to ? xOf(x.to) : xNow,
      top: GROUND - RISE * (i + 1),
      months: monthsBetween(x.from!, x.to ?? now),
    }));
  const last = treads[treads.length - 1];
  let profile = treads.length ? `M${treads[0].x0} ${GROUND}` : "";
  for (const tr of treads) profile += ` V${tr.top} H${tr.x1}`;
  const section = `${profile} V${GROUND} Z`;

  // A cota das promoções: do primeiro dia de estágio ao primeiro de squad leader.
  const promoFrom = treads[0]?.x0 ?? AX0;
  const promoTo = treads[2]?.x0 ?? AX0;
  const COTA = 132;
  const showPromo = step < 0 || step >= at(16);

  const cert = { x0: (last?.x1 ?? xNow) - 90, x1: last?.x1 ?? xNow, top: (last?.top ?? 164) - 58 };
  const years = [2024, 2025, 2026];

  return (
    <>
      <defs>
        <Hatch id={hatch} gap={6} />
      </defs>

      {/* chão = eixo do tempo, interrompido antes de 2024 */}
      <line x1={40} y1={GROUND} x2={132} y2={GROUND} className="draw" pathLength={1} />
      <path d={`M132 ${GROUND} l5 -8 l6 16 l5 -8`} strokeWidth={1} className="late" />
      <line x1={148} y1={GROUND} x2={AX1 + 150} y2={GROUND} className="draw" pathLength={1} />
      {years.map((y) => (
        <g key={y}>
          <line x1={xOf(`${y}-01`)} y1={GROUND} x2={xOf(`${y}-01`)} y2={GROUND + 6} strokeWidth={0.9} className="late" />
          <text x={xOf(`${y}-01`)} y={GROUND + 20} textAnchor="middle" className="code late" stroke="none">
            {y}
          </text>
        </g>
      ))}

      {/* 10 · antes: plataforma do outro lado da interrupção */}
      <Part n={10}>
        <rect x={56} y={GROUND - 24} width={72} height={24} fill={`url(#${hatch})`} strokeWidth={1.4} className="draw" pathLength={1} />
        {plain && (
          <text x={60} y={GROUND - 30} className="box-plain stair-name late" stroke="none">
            {s(10)?.short[locale]}
          </text>
        )}
      </Part>

      {/* 12 · faculdade: faixa paralela sob o chão, de 2023 a 2026 */}
      {degree && (
        <Part n={12}>
          <rect x={56} y={GROUND + 32} width={AX1 - 56} height={10} fill={`url(#${hatch})`} strokeWidth={1} className="late" />
          <path d={`M132 ${GROUND + 28} l5 -4 l6 18 l5 -4`} strokeWidth={1} className="late" />
          <text x={56} y={GROUND + 62} className={`${plain ? "box-plain stair-name" : "code"} late`} stroke="none">
            {plain ? `${degree.title[locale]} · ${degree.period[locale]}` : `${degree.period[locale]} · ${t.since}`}
          </text>
        </Part>
      )}

      {/* corte da escada e os pisos, cada um com a largura do tempo no cargo */}
      <path d={section} fill={`url(#${hatch})`} stroke="none" className="late" />
      {treads.map((tr, i) => (
        <Part key={tr.stage.n} n={tr.stage.n}>
          <path
            d={`M${tr.x0} ${i === 0 ? GROUND : treads[i - 1].top} V${tr.top} H${tr.x1}`}
            strokeWidth={1.8}
            className="draw"
            pathLength={1}
          />
          {plain && (
            <text x={tr.x0 + 6} y={tr.top + 19} className="box-plain stair-name late" stroke="none">
              {tr.stage.short[locale]} · {tr.months} {t.months}
            </text>
          )}
        </Part>
      ))}

      {/* 20 · hoje: onde a escada termina */}
      <Part n={20}>
        <line x1={xNow} y1={GROUND + 6} x2={xNow} y2={last?.top ?? 164} strokeDasharray="3 3" strokeWidth={1} className="late" />
        <text x={xNow} y={GROUND + 20} textAnchor="middle" className="code late" stroke="none" style={{ fill: "var(--accent)" }}>
          {t.now}
        </text>
      </Part>

      {/* 22 · certificação: o próximo degrau, tracejado */}
      <Part n={22}>
        <path
          d={`M${cert.x0} ${last?.top ?? 164} V${cert.top} H${cert.x1} V${last?.top ?? 164}`}
          strokeDasharray="5 4"
          strokeWidth={1.3}
          className="late"
        />
      </Part>

      {/* a cota: 15 meses, duas promoções */}
      <g style={{ opacity: showPromo ? 1 : 0, transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <g style={{ stroke: "var(--accent)" }} strokeWidth={0.9}>
          <line x1={promoFrom} y1={(treads[0]?.top ?? GROUND) - 6} x2={promoFrom} y2={COTA - 8} strokeDasharray="2 3" />
          <line x1={promoTo} y1={(treads[2]?.top ?? GROUND) - 6} x2={promoTo} y2={COTA - 8} strokeDasharray="2 3" />
          <line x1={promoFrom} y1={COTA} x2={promoTo} y2={COTA} />
          <path d={`M${promoFrom + 9} ${COTA - 4} L${promoFrom} ${COTA} L${promoFrom + 9} ${COTA + 4}`} />
          <path d={`M${promoTo - 9} ${COTA - 4} L${promoTo} ${COTA} L${promoTo - 9} ${COTA + 4}`} />
        </g>
        <text
          x={(promoFrom + promoTo) / 2}
          y={COTA - 10}
          textAnchor="middle"
          className={plain ? "box-plain stair-name" : "code"}
          stroke="none"
          style={{ fill: "var(--accent)" }}
        >
          {t.promo}
        </text>
      </g>

      {/* 30 · torre do Livra, mais alta que a escada */}
      {tower && (
        <Part n={tower.n}>
          <rect x={TX} y={TTOP} width={TW} height={GROUND - TTOP} fill="var(--bg)" strokeWidth={1.6} className="draw" pathLength={1} />
          {Array.from({ length: 8 }, (_, r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}-${c}`} x={TX + 11 + c * 22} y={TTOP + 22 + r * 34} width={14} height={18} strokeWidth={0.8} className="late" />
            )),
          )}
          <line x1={TX + TW / 2} y1={TTOP} x2={TX + TW / 2} y2={TTOP - 28} strokeWidth={1.2} />
          <path d={`M${TX + TW / 2} ${TTOP - 28} l20 7 l-20 7 z`} fill="var(--accent)" stroke="none" />
          <text x={TX + TW} y={GROUND + 62} textAnchor="end" className={`${plain ? "box-plain stair-name" : "code"} late`} stroke="none">
            {t.users}
          </text>
        </Part>
      )}

      {/* quem sobe tem nome */}
      <Travel step={at(10)} d={`M58 ${GROUND - 24} H126`} to={0.8} tag="J.P." />
      {degree && <Travel step={at(12)} d={`M60 ${GROUND + 37} H${AX1}`} to={0.9} tag="J.P." />}
      {treads.map((tr, i) => {
        const from = i === 0 ? `M132 ${GROUND - 24} H${tr.x0}` : `M${(treads[i - 1].x0 + treads[i - 1].x1) / 2} ${treads[i - 1].top} H${tr.x0}`;
        return (
          <Travel
            key={tr.stage.n}
            step={at(tr.stage.n)}
            d={`${from} V${tr.top} H${(tr.x0 + tr.x1) / 2}`}
            to={0.85}
            signal
            tag="J.P."
          />
        );
      })}
      {last && <Travel step={at(20)} d={`M${(last.x0 + last.x1) / 2} ${last.top} H${xNow}`} to={0.9} tag="J.P." />}
      <Travel step={at(22)} d={`M${cert.x1} ${last?.top ?? 164} H${(cert.x0 + cert.x1) / 2} V${cert.top + 6}`} to={0.85} tag="J.P." />
      {tower && (
        <>
          <Show at={[at(30)]}>
            <path d={`M${xNow} ${last?.top ?? 164} C${xNow + 30} 60 ${TX - 30} ${TTOP - 30} ${TX + TW / 2} ${TTOP - 30}`} strokeDasharray="4 4" strokeWidth={1} />
          </Show>
          <Travel
            step={at(30)}
            d={`M${xNow} ${last?.top ?? 164} C${xNow + 30} 60 ${TX - 30} ${TTOP - 30} ${TX + TW / 2} ${TTOP - 30}`}
            to={0.85}
            signal
            tag="J.P."
          />
        </>
      )}

      {/* hoje, no modo simples: o que "squad leader" quer dizer na prática */}
      {last && (
        <Note at={[at(20)]} x={xNow - 8} y={GROUND - 14} anchor="end" mode="plain">
          {t.solo}
        </Note>
      )}

      {/* numerais (e, no simples, nome onde a peça não tem texto próprio) */}
      <Leader n={10} at={[92, GROUND - 24]} to={[92, GROUND - 52]} />
      <Leader n={12} at={[330, GROUND + 42]} to={[350, GROUND + 60]} />
      {treads.map((tr) => (
        <Leader key={tr.stage.n} n={tr.stage.n} at={[tr.x0 + 28, tr.top]} to={[tr.x0 + 28, tr.top - 22]} />
      ))}
      <Leader n={20} at={[xNow, GROUND - 40]} to={[xNow + 22, GROUND - 56]} />
      <Leader n={22} at={[(cert.x0 + cert.x1) / 2, cert.top]} to={[(cert.x0 + cert.x1) / 2, cert.top - 24]} label={s(22)?.short[locale]} />
      {tower && <Leader n={tower.n} at={[TX, 150]} to={[TX - 22, 130]} label={tower.short[locale]} />}
    </>
  );
}
