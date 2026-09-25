"use client";

import type { Legend } from "@/data/figures";
import type { Locale } from "@/i18n/routing";

/**
 * Lista de referências da figura. Passar o ponteiro (ou o foco) num item
 * acende a peça correspondente no desenho — texto e figura se apontam.
 */
export default function LegendList({
  legend,
  locale,
  active,
  onActive,
  columns = 2,
}: {
  legend: Legend;
  locale: Locale;
  active: number | null;
  onActive: (n: number | null) => void;
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={`grid gap-x-8 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
      onMouseLeave={() => onActive(null)}
    >
      {legend.map((item) => (
        <li key={item.n}>
          <button
            type="button"
            onMouseEnter={() => onActive(item.n)}
            onFocus={() => onActive(item.n)}
            onBlur={() => onActive(null)}
            className={`flex w-full items-baseline gap-3 border-b border-line py-[7px] text-left text-[0.8125rem] leading-snug transition-colors ${
              active === item.n ? "text-accent" : "text-fg"
            }`}
          >
            <span className="w-6 shrink-0 italic tabular-nums">{item.n}</span>
            <span className={item.code ? "t-code" : "font-[560]"}>{item.label[locale]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
