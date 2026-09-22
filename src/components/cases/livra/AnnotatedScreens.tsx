"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { Screen } from "@/data/livra";
import Narration, { type NarrationLabels } from "@/components/figures/Narration";
import { useSafeId } from "@/components/figures/parts";
import { useSequence, type Step } from "@/components/figures/sequence";

/**
 * Telas reais com numerais de patente. Cada numeral aponta uma coisa na tela
 * e a narração diz a engenharia por trás dela. O print é a prova; a nota é o
 * que um print sozinho não mostra.
 */
export default function AnnotatedScreens({
  screens,
  locale,
  labels,
  fig,
  n,
}: {
  screens: Screen[];
  locale: Locale;
  labels: NarrationLabels;
  fig: string;
  n: number;
}) {
  const steps = useMemo<Step[]>(
    () => screens.flatMap((sc) => sc.notes.map((nt) => ({ dur: 3.6, on: [nt.n], caption: nt.text }))),
    [screens],
  );
  const seq = useSequence(steps, { autoplay: true, loop: true });
  const [hover, setHover] = useState<number | null>(null);
  const { step, observe, go } = seq;
  const lit = hover ?? steps[step]?.on?.[0] ?? null;
  const indexOf = (n: number) => steps.findIndex((s) => s.on?.[0] === n);

  return (
    <div>
      <div ref={observe} className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {screens.map((sc, i) => (
          <Phone
            key={sc.src}
            screen={sc}
            label={`${fig} ${n}${String.fromCharCode(97 + i)}`}
            locale={locale}
            lit={lit}
            onHover={setHover}
            onPick={(n) => go(indexOf(n))}
          />
        ))}
      </div>
      <div className="mt-8">
        <Narration seq={seq} locale={locale} labels={labels} />
      </div>
    </div>
  );
}

function Phone({
  screen,
  label,
  locale,
  lit,
  onHover,
  onPick,
}: {
  screen: Screen;
  label: string;
  locale: Locale;
  lit: number | null;
  onHover: (n: number | null) => void;
  onPick: (n: number) => void;
}) {
  const clip = useSafeId("c");
  const W = 260;
  const H = Math.round((screen.h * W) / screen.w);
  const GUT = 58;

  return (
    <figure>
      <svg
        viewBox={`-12 -12 ${W + 24 + GUT} ${H + 24}`}
        className="fig fig-draw"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        role="img"
        aria-label={screen.title[locale]}
      >
        <defs>
          <clipPath id={clip}>
            <rect x={0} y={0} width={W} height={H} rx={22} />
          </clipPath>
        </defs>
        <image
          href={screen.src}
          x={0}
          y={0}
          width={W}
          height={H}
          clipPath={`url(#${clip})`}
          preserveAspectRatio="xMidYMin slice"
        />
        <rect x={-8} y={-8} width={W + 16} height={H + 16} rx={30} className="draw" pathLength={1} />
        <rect x={0} y={0} width={W} height={H} rx={22} strokeWidth={0.6} />
        {screen.notes.map((nt) => {
          const px = (nt.x / 100) * W;
          const py = (nt.y / 100) * H;
          const on = lit === nt.n;
          const gx = W + 16;
          return (
            <g
              key={nt.n}
              className="cursor-pointer"
              onMouseEnter={() => onHover(nt.n)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onPick(nt.n)}
            >
              <path
                d={`M${px} ${py} C${px + 30} ${py} ${gx - 20} ${py} ${gx} ${py}`}
                strokeWidth={on ? 1.4 : 0.9}
                style={{ stroke: on ? "var(--accent)" : undefined, transition: "stroke 250ms" }}
              />
              <circle
                cx={px}
                cy={py}
                r={on ? 3.2 : 2.2}
                fill={on ? "var(--accent)" : "var(--fg)"}
                stroke="var(--bg)"
                strokeWidth={1.2}
              />
              {on && <circle cx={px} cy={py} r={11} stroke="var(--accent)" strokeWidth={1.2} strokeDasharray="2 3" />}
              <text x={gx + 22} y={py + 5} textAnchor="middle" className={`num ${on ? "is-on" : ""}`} stroke="none">
                {nt.n}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="t-small mt-2 flex gap-2">
        <span className="t-fig">{label}</span>
        {screen.title[locale]}
      </figcaption>
      <ol className="sr-only">
        {screen.notes.map((nt) => (
          <li key={nt.n}>
            {nt.n}: {nt.text[locale]}
          </li>
        ))}
      </ol>
    </figure>
  );
}
