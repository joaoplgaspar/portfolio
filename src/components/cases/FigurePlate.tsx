"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { Legend } from "@/data/figures";
import Stage, { type StageLabels } from "@/components/figures/Stage";
import { stepsOf } from "@/components/figures/Figure";
import { useSequence } from "@/components/figures/sequence";

/** Scroll de página por passo da narração, em vh. */
const PER_STEP = 42;
/** Onde a prancha prende: abaixo do cabeçalho fixo. */
const STICK = "calc(var(--pad) + 52px + 16px)";

/**
 * Figura grande do case.
 *
 * Em tela grande, a prancha prende no topo e o scroll da página conduz a
 * narração: rolou, o passo anda; voltou, ele volta. Quem lê controla o ritmo
 * e não perde passo. ←, → e a régua rolam a página até o passo pedido.
 * No celular, em tela baixa ou com movimento reduzido, ela toca sozinha como
 * antes (prender uma figura numa tela pequena tomaria a tela inteira).
 */
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
  const steps = stepsOf(slug);
  const [scrub, setScrub] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const big = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setScrub(big.matches && !calm.matches);
    on();
    big.addEventListener("change", on);
    calm.addEventListener("change", on);
    return () => {
      big.removeEventListener("change", on);
      calm.removeEventListener("change", on);
    };
  }, []);

  // Quanto a página rola enquanto a prancha está presa, e onde ela prende.
  const span = useCallback(() => {
    const w = wrap.current;
    const i = inner.current;
    if (!w || !i) return null;
    const stick = parseFloat(getComputedStyle(i).top) || 0;
    return { w, stick, length: Math.max(1, w.offsetHeight - i.offsetHeight) };
  }, []);

  const onSeek = useCallback(
    (k: number) => {
      const s = span();
      if (!s) return;
      const top = window.scrollY + s.w.getBoundingClientRect().top - s.stick;
      // Um pouco para dentro do passo, para não cair na fronteira com o anterior.
      const total = steps.reduce((a, x) => a + x.dur, 0);
      const at = steps.slice(0, k).reduce((a, x) => a + x.dur, 0) + steps[k].dur * 0.08;
      window.scrollTo({ top: top + (at / total) * s.length, behavior: "smooth" });
    },
    [span, steps],
  );

  const seq = useSequence(steps, { autoplay: true, loop: true, controlled: scrub, onSeek: scrub ? onSeek : undefined });
  const { scrub: drive } = seq;

  useEffect(() => {
    if (!scrub) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const s = span();
      if (!s) return;
      drive((s.stick - s.w.getBoundingClientRect().top) / s.length);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrub, span, drive]);

  const stage = (
    <Stage seq={seq} slug={slug} n={n} title={caption} legend={legend} locale={locale} labels={labels} layout="side" />
  );

  if (!scrub) return stage;
  return (
    <div ref={wrap} style={{ height: `calc(100vh + ${steps.length * PER_STEP}vh)` }}>
      <div ref={inner} className="sticky" style={{ top: STICK }}>
        {stage}
      </div>
    </div>
  );
}
