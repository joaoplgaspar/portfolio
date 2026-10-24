"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/routing";
import type { Sequence } from "./sequence";

export type NarrationLabels = { play: string; pause: string; prev: string; next: string };

// Rótulos do modo: só existem aqui, onde o botão vive.
const MODE = {
  en: { plain: "Simple", tech: "Technical", aria: "Explanation", scroll: "Scroll" },
  pt: { plain: "Simples", tech: "Técnico", aria: "Explicação", scroll: "Role" },
} as const;

/**
 * Controles + régua de passos + legenda do passo atual.
 *
 * Quando os passos têm legenda simples (`plain`), aparece o botão
 * Simples · Técnico; quando têm título, a régua ganha o nome de cada passo e
 * vira navegação (clicar num passo vai até ele).
 */
export default function Narration({
  seq,
  locale,
  labels,
}: {
  seq: Sequence;
  locale: Locale;
  labels: NarrationLabels;
}) {
  const { subscribe, step, steps, playing, reduced, prev, next, toggle, go, mode, setMode, controlled } = seq;
  const bar = useRef<HTMLSpanElement>(null);

  // Preenche o segmento do passo atual conforme o tempo anda.
  useEffect(
    () =>
      subscribe((s, t) => {
        if (bar.current) bar.current.style.transform = `scaleX(${s === step ? Math.min(1, t) : 1})`;
      }),
    [subscribe, step],
  );

  const dual = steps.some((s) => s.plain);
  const titled = steps.some((s) => s.title);
  const cur = steps[step];
  const caption = (mode === "plain" && cur?.plain ? cur.plain : cur?.caption)?.[locale];
  const m = MODE[locale];
  const signal = (i: number) => steps[i]?.act === "problem" || steps[i]?.act === "rejected";

  return (
    <div>
      {/* Quebra em telas estreitas (320px): o contador desce em vez de vazar. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="seg shrink-0" role="group">
          <button type="button" className="ctl !h-8 !px-2.5" onClick={prev} aria-label={labels.prev}>
            ←
          </button>
          {!reduced && !controlled && (
            <button type="button" className="ctl !h-8 !px-2.5" onClick={toggle} aria-label={playing ? labels.pause : labels.play}>
              {playing ? "❚❚" : "▶"}
            </button>
          )}
          {/* Quando o scroll conduz, não há o que tocar: o botão vira a dica. */}
          {controlled && (
            <span className="ctl !h-8 !px-2.5 pointer-events-none text-muted" aria-hidden>
              {MODE[locale].scroll} ↓
            </span>
          )}
          <button type="button" className="ctl !h-8 !px-2.5" onClick={next} aria-label={labels.next}>
            →
          </button>
        </div>
        {!titled && <Ruler seq={seq} bar={bar} />}
        {titled && <span className="flex-1" />}
        {dual && (
          <div className="seg shrink-0" role="group" aria-label={m.aria}>
            {(["plain", "tech"] as const).map((k) => (
              <button
                key={k}
                type="button"
                className="ctl !h-8 !px-2.5"
                aria-pressed={mode === k}
                onClick={() => setMode(k)}
              >
                {m[k]}
              </button>
            ))}
          </div>
        )}
        <span className="t-fig shrink-0 tabular-nums text-faint">
          {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
      </div>

      {titled && (
        <ol className="mt-3 flex gap-1">
          {steps.map((s, i) => (
            <li key={i} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === step ? "step" : undefined}
                aria-label={`${String(i + 1).padStart(2, "0")} ${s.title?.[locale] ?? ""}`}
                className="group block w-full pb-1 text-left"
              >
                <span className="relative block h-[3px] overflow-hidden bg-line">
                  {i < step && <span className="absolute inset-0 bg-fg" />}
                  {i === step && (
                    <span ref={bar} className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
                  )}
                </span>
                <span
                  className={`mt-1.5 hidden truncate text-[10px] leading-none font-[650] transition-colors sm:block ${
                    i === step ? (signal(i) ? "text-accent" : "text-fg") : "text-faint group-hover:text-fg"
                  }`}
                >
                  {s.title?.[locale]}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-3 min-h-[4.2em] max-w-[62ch] text-[0.9375rem] leading-snug font-[520]" aria-live="polite">
        {/* No celular a régua não tem nome: o título do passo abre a legenda. */}
        {titled && cur?.title && (
          <span className={`mr-1.5 font-[750] sm:hidden ${signal(step) ? "text-accent" : ""}`}>{cur.title[locale]} ·</span>
        )}
        {caption}
      </p>
    </div>
  );
}

/** Régua sem nomes, na linha dos controles (figuras ainda sem títulos). */
function Ruler({ seq, bar }: { seq: Sequence; bar: React.RefObject<HTMLSpanElement | null> }) {
  const { step, steps } = seq;
  return (
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
  );
}
