"use client";

import FigSharedCart, { STEPS as S1 } from "./FigSharedCart";
import FigTwoBrands, { STEPS as S2 } from "./FigTwoBrands";
import FigConvergence, { STEPS as S3 } from "./FigConvergence";
import FigKit, { STEPS as S4 } from "./FigKit";
import type { FigProps } from "./parts";
import type { Step } from "./sequence";

const REGISTRY: Record<string, { C: (p: FigProps) => React.ReactNode; steps: Step[] }> = {
  "roland-boss": { C: FigSharedCart, steps: S1 },
  "integral-medica-darkness": { C: FigTwoBrands, steps: S2 },
  livra: { C: FigConvergence, steps: S3 },
  "starter-pack": { C: FigKit, steps: S4 },
};

export function stepsOf(slug: string): Step[] {
  return REGISTRY[slug]?.steps ?? [];
}

export default function Figure({ slug, ...props }: FigProps & { slug: string }) {
  const F = REGISTRY[slug]?.C;
  return F ? <F {...props} /> : null;
}
