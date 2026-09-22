"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Legend } from "@/data/figures";
import Stage, { type StageLabels } from "@/components/figures/Stage";
import { stepsOf } from "@/components/figures/Figure";
import { useSequence } from "@/components/figures/sequence";

export type HomeItem = {
  slug: string;
  title: string;
  caption: string;
  type: string;
  year: number;
  live?: string[];
};

/**
 * A home é uma prancha: índice de figuras à esquerda, a figura ativa à
 * direita contando a sua história em passos. Quando a narração termina, a
 * próxima figura entra. O traço vermelho sob o título é o progresso real
 * dessa narração — não um relógio decorativo. Com movimento reduzido nada
 * troca sozinho; os passos avançam pelos controles.
 */
export default function HomeSheet({
  items,
  legends,
  locale,
  intro,
  extra,
  t,
}: {
  intro: ReactNode;
  extra?: ReactNode;
  items: HomeItem[];
  legends: Record<string, Legend>;
  locale: Locale;
  t: { index: string; open: string; live: string } & StageLabels;
}) {
  const [on, setOn] = useState(0);
  const clocks = useRef<(HTMLSpanElement | null)[]>([]);
  const item = items[on];
  if (!item) return null;

  return (
    <div className="home-grid">
      <div className="[grid-area:intro]">{intro}</div>

      <section aria-labelledby="idx-h" className="[grid-area:idx] lg:self-end">
        <h2 id="idx-h" className="t-fig mb-3 uppercase text-faint">
          {t.index}
        </h2>
        <ol className="idx-list border-t border-fg">
          {items.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/trabalho/${p.slug}`}
                className="idx-row block border-b border-line pt-4 pb-0"
                data-on={i === on}
                onMouseEnter={() => setOn(i)}
                onFocus={() => setOn(i)}
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="t-fig text-faint">
                    {t.fig} {i + 1}
                  </span>
                  <span className="t-small text-faint">
                    {p.type} · {p.year}
                  </span>
                </span>
                <span
                  className="idx-title t-title mt-1 mb-4 block"
                  style={{ "--len": p.title.length } as React.CSSProperties}
                >
                  {p.title}
                </span>
                <span
                  className="idx-clock block"
                  aria-hidden
                  ref={(el) => {
                    clocks.current[i] = el;
                  }}
                />
              </Link>
            </li>
          ))}
        </ol>
        {extra}
      </section>

      <section className="min-w-0 [grid-area:fig]">
        <HomeStage
          key={item.slug}
          item={item}
          n={on + 1}
          legend={legends[item.slug] ?? []}
          locale={locale}
          t={t}
          clock={() => clocks.current[on]}
          onEnd={() => setOn((i) => (i + 1) % items.length)}
        />
      </section>
    </div>
  );
}

function HomeStage({
  item,
  n,
  legend,
  locale,
  t,
  clock,
  onEnd,
}: {
  item: HomeItem;
  n: number;
  legend: Legend;
  locale: Locale;
  t: { open: string; live: string } & StageLabels;
  clock: () => HTMLSpanElement | null;
  onEnd: () => void;
}) {
  const steps = stepsOf(item.slug);
  const seq = useSequence(steps, { autoplay: true, loop: true, onEnd });
  const total = steps.reduce((a, s) => a + s.dur, 0);
  const { subscribe } = seq;

  // Progresso total da narração, escrito direto no traço do índice.
  useEffect(() => {
    const el = clock();
    const off = subscribe((s, tt) => {
      const done = steps.slice(0, s).reduce((a, x) => a + x.dur, 0) + Math.min(1, tt) * steps[s].dur;
      if (el) el.style.transform = `scaleX(${done / total})`;
    });
    return () => {
      off();
      if (el) el.style.transform = "scaleX(0)";
    };
  }, [subscribe, steps, total, clock]);

  return (
    <>
      <Stage
        seq={seq}
        slug={item.slug}
        n={n}
        title={item.caption}
        legend={legend}
        locale={locale}
        labels={t}
        corner={item.live && <span className="t-code text-muted">{t.live}: {item.live.join(" · ")}</span>}
      />
      <div className="mt-4 flex justify-end">
        <Link href={`/trabalho/${item.slug}`} className="t-small tb-link">
          {t.open} →
        </Link>
      </div>
    </>
  );
}
