"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Legend } from "@/data/figures";
import type { StageLabels } from "@/components/figures/Stage";
import Figure, { stepsOf } from "@/components/figures/Figure";
import { FigOptions, PLOT } from "@/components/figures/parts";
import { SeqProvider, useSequence } from "@/components/figures/sequence";
import type { Print } from "./ProjectThumb";
import BrandMargin, { type Brand } from "./BrandMargin";

/** Quanto a figura leva para se apagar antes da próxima entrar (ms). */
const FADE = 280;
/** Quanto o mouse precisa ficar numa aba para ela trocar a figura (ms). */
const INTENT = 300;

export type HomeItem = {
  slug: string;
  title: string;
  caption: string;
  type: string;
  year: number;
  live?: string[];
  print?: Print;
  brand?: Brand;
};

/**
 * Primeira tela da home: um ponto focal só.
 *
 * À esquerda, quem é (vem pronto em `intro`). À direita, a figura ativa em
 * modo quieto: só a peça em foco tem nome, sem numerais, sem lupa, sem
 * controles. Embaixo, uma linha de legenda (sempre a simples) e as abas das
 * figuras; o traço sob a aba ativa é o progresso real da narração, e quando
 * ela termina a próxima figura entra. A narração completa, com régua, modo
 * técnico e controles, fica no case. Com movimento reduzido nada toca
 * sozinho: aparecem ← → para andar os passos.
 */
export default function HomeSheet({
  items,
  locale,
  intro,
  t,
}: {
  intro: ReactNode;
  items: HomeItem[];
  legends?: Record<string, Legend>;
  locale: Locale;
  t: { index: string; open: string; live: string } & StageLabels;
}) {
  // `sel` é a aba escolhida (responde na hora); `on` é a figura na prancha,
  // que só troca depois que a anterior se apaga.
  const [sel, setSel] = useState(0);
  const [on, setOn] = useState(0);
  const [out, setOut] = useState(false);
  const clocks = useRef<(HTMLSpanElement | null)[]>([]);
  const swap = useRef(0);
  const intent = useRef(0);

  const go = useCallback((i: number) => {
    setSel(i);
    window.clearTimeout(swap.current);
    setOut(true);
    swap.current = window.setTimeout(() => {
      setOn(i);
      setOut(false);
    }, FADE);
  }, []);

  // Hover só troca se o mouse ficar na aba: passar por cima não troca nada.
  const hoverIn = (i: number) => {
    window.clearTimeout(intent.current);
    if (i === sel) return;
    intent.current = window.setTimeout(() => go(i), INTENT);
  };
  const hoverOut = () => window.clearTimeout(intent.current);

  useEffect(
    () => () => {
      window.clearTimeout(swap.current);
      window.clearTimeout(intent.current);
    },
    [],
  );

  const item = items[on];
  if (!item) return null;

  return (
    <div className="home-grid">
      <div className="[grid-area:intro]">{intro}</div>

      <section className="min-w-0 [grid-area:fig]">
        <div
          style={{
            opacity: out ? 0 : 1,
            transform: out ? "translateY(6px)" : "none",
            transition: `opacity ${FADE}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${FADE}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        >
          <QuietStage
            key={item.slug}
            item={item}
            n={on + 1}
            locale={locale}
            t={t}
            clock={() => clocks.current[on]}
            onEnd={() => go((on + 1) % items.length)}
          />
        </div>

        <nav aria-label={t.index} className="mt-5 border-t border-fg">
          <ol className="grid grid-cols-2 sm:grid-cols-4">
            {items.map((p, i) => (
              <li key={p.slug} className="min-w-0">
                <button
                  type="button"
                  onClick={() => i !== sel && go(i)}
                  onMouseEnter={() => hoverIn(i)}
                  onMouseLeave={hoverOut}
                  aria-current={i === sel ? "true" : undefined}
                  className={`group block w-full py-2.5 pr-3 text-left transition-colors duration-300 ${i === sel ? "text-fg" : "text-faint hover:text-fg"}`}
                >
                  <span className="t-fig block">
                    {t.fig} {i + 1}
                  </span>
                  <span className="t-small mt-0.5 block truncate font-[600]">{p.title}</span>
                  <span className="mt-2 block h-[2px] overflow-hidden bg-line" aria-hidden>
                    <span
                      ref={(el) => {
                        clocks.current[i] = el;
                      }}
                      className="block h-full origin-left bg-accent"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </section>
    </div>
  );
}

function QuietStage({
  item,
  n,
  locale,
  t,
  clock,
  onEnd,
}: {
  item: HomeItem;
  n: number;
  locale: Locale;
  t: { open: string; live: string } & StageLabels;
  clock: () => HTMLSpanElement | null;
  onEnd: () => void;
}) {
  const steps = stepsOf(item.slug);
  const seq = useSequence(steps, { autoplay: false, loop: true, onEnd });
  const total = steps.reduce((a, s) => a + s.dur, 0);
  const { subscribe, step, observe, reduced, prev, next, setPlaying } = seq;
  const cur = steps[step];

  // A narração só começa quando o traço de plotter termina: primeiro o
  // desenho entra inteiro, depois ele conta a história.
  useEffect(() => {
    const id = window.setTimeout(() => setPlaying(true), PLOT + 200);
    return () => window.clearTimeout(id);
  }, [setPlaying]);

  // Progresso total da narração, escrito direto no traço da aba.
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
    <div className="stage-in">
      <div ref={observe} className="plate relative border border-fg px-4 pt-10 pb-4">
        <span className="t-fig absolute top-3 left-4">
          {t.fig} {n}
        </span>
        <Link href={`/work/${item.slug}`} className="t-small tb-link absolute top-2.5 right-4">
          {t.open} →
        </Link>
        <div className="grid gap-4 md:grid-cols-[minmax(150px,23%)_minmax(0,1fr)] md:items-stretch">
          {item.brand && <BrandMargin brand={item.brand} />}
          <div className={`min-w-0 self-center ${item.brand ? "" : "md:col-span-2"}`}>
            <FigOptions lens={false} quiet>
              <SeqProvider seq={seq} mode="plain">
                <Figure slug={item.slug} lit={cur?.on ?? []} title={item.caption} />
              </SeqProvider>
            </FigOptions>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-3">
        {reduced && (
          <div className="seg shrink-0" role="group">
            <button type="button" className="ctl !h-8 !px-2.5" onClick={prev} aria-label={t.prev}>
              ←
            </button>
            <button type="button" className="ctl !h-8 !px-2.5" onClick={next} aria-label={t.next}>
              →
            </button>
          </div>
        )}
        <p className="min-h-[2.8em] max-w-[64ch] text-[0.9375rem] leading-snug font-[520]" aria-live="polite">
          {cur?.title && <span className={`mr-1.5 font-[750] ${cur.act === "problem" || cur.act === "rejected" ? "text-accent" : ""}`}>{cur.title[locale]} ·</span>}
          {(cur?.plain ?? cur?.caption)?.[locale]}
        </p>
      </div>
    </div>
  );
}
