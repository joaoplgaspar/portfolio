"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/routing";
import type { Sequence } from "./sequence";

export type NarrationLabels = { play: string; pause: string; prev: string; next: string };

/** Controles + régua de passos + legenda do passo atual. */
export default function Narration({
  seq,
  locale,
  labels,
}: {
  seq: Sequence;
  locale: Locale;
  labels: NarrationLabels;
}) {
  const { subscribe, step, steps, playing, reduced, prev, next, toggle } = seq;
  const bar = useRef<HTMLSpanElement>(null);

  // Preenche o segmento do passo atual conforme o tempo anda.
  useEffect(
    () =>
      subscribe((s, t) => {
        if (bar.current) bar.current.style.transform = `scaleX(${s === step ? Math.min(1, t) : 1})`;
      }),
    [subscribe, step],
  );

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="seg shrink-0" role="group">
          <button type="button" className="ctl !h-8 !px-2.5" onClick={prev} aria-label={labels.prev}>
            ←
          </button>
          {!reduced && (
            <button type="button" className="ctl !h-8 !px-2.5" onClick={toggle} aria-label={playing ? labels.pause : labels.play}>
              {playing ? "❚❚" : "▶"}
            </button>
          )}
          <button type="button" className="ctl !h-8 !px-2.5" onClick={next} aria-label={labels.next}>
            →
          </button>
        </div>
        <ol className="flex flex-1 gap-1" aria-hidden>
          {steps.map((_, i) => (
            <li key={i} className="relative h-[3px] flex-1 overflow-hidden bg-line">
              {i < step && <span className="absolute inset-0 bg-fg" />}
              {i === step && (
                <span ref={bar} className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
              )}
            </li>
          ))}
        </ol>
        <span className="t-fig tabular-nums text-faint">
          {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-3 min-h-[4.2em] max-w-[62ch] text-[0.9375rem] leading-snug font-[520]" aria-live="polite">
        {steps[step]?.caption[locale]}
      </p>
    </div>
  );
}
