"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { Stage } from "@/data/about";
import type { Legend } from "@/data/figures";
import { Fig, Hatch, Leader, Part, useSafeId } from "@/components/figures/parts";
import { SeqProvider, Show, Travel, useSequence, type Step } from "@/components/figures/sequence";
import Narration, { type NarrationLabels } from "@/components/figures/Narration";
import LegendList from "@/components/figures/LegendList";

/**
 * Trajetória em corte de escada. Cada estágio é um degrau (espelho = a
 * promoção, piso = o tempo no cargo); a certificação Shopify é o degrau
 * tracejado, em construção. O LIVRA não é mais um degrau da mesma escada:
 * é uma torre ao lado, mais alta que ela. Um ponto sobe a escada conforme a
 * narração anda.
 */

const X0 = 28;
const W = 80;
const R = 44;
const GROUND = 396;

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
        dur: 3.4,
        on: [s.n],
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
  const hatch = useSafeId("h");

  const treads = stages.filter((s) => s.kind !== "founder");
  const tower = stages.find((s) => s.kind === "founder");
  const top = (i: number) => GROUND - R * (i + 1);
  const x = (i: number) => X0 + i * W;
  const mid = (i: number) => x(i) + W / 2;
  const solid = treads.filter((s) => s.kind !== "cert").length;

  // Perfil da escada (parte construída) e o polígono do corte embaixo dele.
  let profile = `M${x(0)} ${GROUND}`;
  for (let i = 0; i < solid; i++) profile += ` V${top(i)} H${x(i + 1)}`;
  const section = `${profile} V${GROUND} Z`;

  // Caminho do ponto: sobe de piso em piso.
  const climb = (i: number) =>
    i === 0 ? `M${x(0) - 12} ${GROUND} L${mid(0)} ${top(0)}` : `M${mid(i - 1)} ${top(i - 1)} H${x(i)} V${top(i)} H${mid(i)}`;

  const TX = 650;
  const TW = 104;
  const TTOP = 36;
  const lastSolid = solid - 1;
  const toTower = `M${mid(lastSolid)} ${top(lastSolid)} C${mid(lastSolid) + 60} ${top(lastSolid) - 150} ${TX - 30} ${TTOP - 10} ${TX + TW / 2} ${TTOP - 4}`;

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-start">
      <div>
        <div ref={observe} className="plate relative border border-fg px-[4%] pt-12 pb-6">
          <span className="t-fig absolute top-3 left-4">{fig}</span>
          <SeqProvider seq={seq}>
            <Fig title={caption} lit={lit} viewBox="0 0 800 440">
              <defs>
                <Hatch id={hatch} gap={6} />
              </defs>

              <line x1={8} y1={GROUND} x2={792} y2={GROUND} className="draw" pathLength={1} />

              {/* corte da escada construída */}
              <path d={section} fill={`url(#${hatch})`} stroke="none" className="late" />
              {treads.map((s, i) =>
                s.kind === "cert" ? (
                  <Part key={s.n} n={s.n}>
                    <path
                      d={`M${x(i)} ${top(i - 1)} V${top(i)} H${x(i + 1)} V${GROUND}`}
                      strokeDasharray="5 4"
                      strokeWidth={1.25}
                      className="late"
                    />
                  </Part>
                ) : (
                  <Part key={s.n} n={s.n}>
                    <path
                      d={`M${x(i)} ${i === 0 ? GROUND : top(i - 1)} V${top(i)} H${x(i + 1)}`}
                      strokeWidth={1.6}
                      className="draw"
                      pathLength={1}
                    />
                  </Part>
                ),
              )}

              {/* torre */}
              {tower && (
                <Part n={tower.n}>
                  <rect x={TX} y={TTOP} width={TW} height={GROUND - TTOP} fill="var(--bg)" strokeWidth={1.6} className="draw" pathLength={1} />
                  {Array.from({ length: 9 }, (_, r) =>
                    [0, 1, 2].map((c) => (
                      <rect key={`${r}-${c}`} x={TX + 14 + c * 28} y={TTOP + 22 + r * 36} width={18} height={20} strokeWidth={0.8} className="late" />
                    )),
                  )}
                  <line x1={TX + TW / 2} y1={TTOP} x2={TX + TW / 2} y2={TTOP - 30} strokeWidth={1.2} />
                  <path d={`M${TX + TW / 2} ${TTOP - 30} l22 7 l-22 7 z`} fill="var(--accent)" stroke="none" />
                </Part>
              )}

              {/* datas no chão */}
              {treads.map((s, i) => (
                <text key={s.n} x={mid(i)} y={GROUND + 22} textAnchor="middle" className="code late" stroke="none">
                  {s.period[locale]}
                </text>
              ))}
              {tower && (
                <text x={TX + TW / 2} y={GROUND + 22} textAnchor="middle" className="code late" stroke="none">
                  {tower.period[locale]}
                </text>
              )}

              {treads.map((s, i) => (
                <Leader key={s.n} n={s.n} at={[mid(i), top(i)]} to={[mid(i), top(i) - 30]} />
              ))}
              {tower && <Leader n={tower.n} at={[TX, TTOP + 60]} to={[TX - 34, TTOP + 40]} />}

              {/* o ponto que sobe */}
              {treads.map((s, i) => (
                <Travel key={s.n} step={i} d={climb(i)} to={0.7} r={5} signal />
              ))}
              {tower && (
                <>
                  <Show at={[stages.indexOf(tower)]}>
                    <path d={toTower} strokeDasharray="4 4" strokeWidth={1} />
                  </Show>
                  <Travel step={stages.indexOf(tower)} d={toTower} to={0.8} r={5} signal />
                </>
              )}
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
