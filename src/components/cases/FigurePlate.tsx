"use client";

import type { Locale } from "@/i18n/routing";
import type { Legend } from "@/data/figures";
import Stage, { type StageLabels } from "@/components/figures/Stage";
import { stepsOf } from "@/components/figures/Figure";
import { useSequence } from "@/components/figures/sequence";

/** Figura grande do case: toca em loop quando está na tela. */
export default function FigurePlate({
  slug,
  n,
  caption,
  legend,
  locale,
  labels,
}: {
  slug: string;
  n: number;
  caption: string;
  legend: Legend;
  locale: Locale;
  labels: StageLabels;
}) {
  const seq = useSequence(stepsOf(slug), { autoplay: true, loop: true });
  return (
    <Stage seq={seq} slug={slug} n={n} title={caption} legend={legend} locale={locale} labels={labels} layout="side" />
  );
}
