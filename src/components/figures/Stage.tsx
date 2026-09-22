"use client";

import { useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import type { Legend } from "@/data/figures";
import Figure from "./Figure";
import LegendList from "./LegendList";
import Narration, { type NarrationLabels } from "./Narration";
import { SeqProvider, type Sequence } from "./sequence";

export type StageLabels = { fig: string } & NarrationLabels;

/**
 * Palco de uma figura: a prancha, a régua de passos, a legenda narrada do
 * passo atual e a lista de referências. A sequência vem de fora (quem monta
 * decide autoplay, loop e o que acontece no fim).
 */
export default function Stage({
  seq,
  slug,
  n,
  title,
  legend,
  locale,
  labels,
  corner,
  legendColumns = 2,
  layout = "stack",
}: {
  seq: Sequence;
  slug: string;
  n: number;
  title: string;
  legend: Legend;
  locale: Locale;
  labels: StageLabels;
  corner?: ReactNode;
  legendColumns?: 1 | 2;
  layout?: "stack" | "side";
}) {
  const [hover, setHover] = useState<number | null>(null);
  // Desestruturado de uma vez: `observe` vai para um `ref`, e o lint passa a
  // tratar o objeto inteiro como ref se ele for lido depois disso.
  const { step, steps, observe } = seq;
  const lit = hover != null ? [hover] : (steps[step]?.on ?? []);

  const plate = (
    <div ref={observe} className="plate relative border border-fg px-[4%] pt-12 pb-6">
      <span className="t-fig absolute top-3 left-4">
        {labels.fig} {n}
      </span>
      {corner && <span className="absolute top-3 right-4 hidden sm:block">{corner}</span>}
      <SeqProvider seq={seq}>
        <Figure slug={slug} lit={lit} title={title} />
      </SeqProvider>
    </div>
  );

  const narration = <Narration seq={seq} locale={locale} labels={labels} />;

  if (layout === "side") {
    return (
      <section className="grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-start">
        <div>
          {plate}
          <div className="mt-4">{narration}</div>
        </div>
        <div className="lg:pt-10">
          <p className="t-small mb-3">
            <span className="t-fig mr-2">
              {labels.fig} {n}
            </span>
            {title}
          </p>
          <LegendList legend={legend} locale={locale} active={hover} onActive={setHover} columns={1} />
        </div>
      </section>
    );
  }

  return (
    <div>
      {plate}
      <div className="mt-4">{narration}</div>
      <div className="mt-4 hidden sm:block">
        <LegendList legend={legend} locale={locale} active={hover} onActive={setHover} columns={legendColumns} />
      </div>
    </div>
  );
}
