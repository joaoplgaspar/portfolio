"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import Figure, { stepsOf } from "@/components/figures/Figure";
import Narration, { type NarrationLabels } from "@/components/figures/Narration";
import { SeqProvider, useSequence } from "@/components/figures/sequence";

/**
 * Trabalho selecionado, de ponta a ponta da prancha: grade em faixas (uma
 * capa grande + duas pequenas, alternando o lado), legenda fora da capa. A
 * capa é a print do site no ar, o app em telefones, ou o próprio desenho
 * quando o projeto não tem tela.
 *
 * Hover: a capa aproxima e marcas de corte entram nos cantos, como numa
 * prova de impressão. Clique: o painel se abre a partir do cartão (clip-path,
 * sem escala) com a figura narrada, o resumo e a ficha. O cartão continua sendo um link de
 * verdade — clique com modificador, sem JS ou por leitor de tela, ele abre
 * a página.
 */

export type WorkItem = {
  key: string;
  mark: string;
  title: string;
  meta: string;
  href: string;
  cover: { kind: "site"; src: string } | { kind: "app"; srcs: string[] } | { kind: "drawing"; slug: string };
  summary: string;
  facts: { k: string; v: string }[];
  stack?: string[];
  live?: string[];
  figure?: { slug: string; caption: string };
  work?: string[];
};

export type WorkGridText = NarrationLabels & { expand: string; open: string; close: string; live: string; stack: string };

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function Cover({ item, sizes }: { item: WorkItem; sizes: string }) {
  const c = item.cover;
  if (c.kind === "site") {
    return <Image src={c.src} alt="" fill sizes={sizes} className="object-cover object-top" />;
  }
  if (c.kind === "app") {
    return (
      <span className="absolute inset-0 flex items-center justify-center gap-[4%] bg-[var(--plate)] px-[8%]">
        {c.srcs.map((src, i) => (
          <span
            key={src}
            className="relative block aspect-[430/787] w-[26%] overflow-hidden rounded-[14px] border-[1.25px] border-fg"
            style={{ transform: `translateY(${(i - 1) * -6}%)` }}
          >
            <Image src={src} alt="" fill sizes="20vw" className="object-cover object-top" />
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-[var(--plate)] p-[6%]">
      <span className="block w-full">
        <Figure slug={c.slug} lit={[]} title={item.title} draw={false} />
      </span>
    </span>
  );
}

/** Marcas de corte: entram nos quatro cantos no hover. */
function CropMarks() {
  const base =
    "pointer-events-none absolute h-4 w-4 border-accent opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100";
  return (
    <>
      <span className={`${base} top-2 left-2 border-t-[1.5px] border-l-[1.5px] -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0`} />
      <span className={`${base} top-2 right-2 border-t-[1.5px] border-r-[1.5px] translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0`} />
      <span className={`${base} bottom-2 left-2 border-b-[1.5px] border-l-[1.5px] -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0`} />
      <span className={`${base} right-2 bottom-2 border-r-[1.5px] border-b-[1.5px] translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0`} />
    </>
  );
}

export default function WorkGrid({ items, locale, t }: { items: WorkItem[]; locale: Locale; t: WorkGridText }) {
  const [open, setOpen] = useState<{ item: WorkItem; from: DOMRect; el: HTMLElement } | null>(null);

  const onCard = (item: WorkItem) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const el = e.currentTarget;
    const media = el.querySelector("[data-media]") as HTMLElement | null;
    setOpen({ item, from: (media ?? el).getBoundingClientRect(), el });
  };

  return (
    <>
      <div className="mx-[calc(var(--gut)*-1)] grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3">
        {items.map((item, i) => {
          const band = Math.floor(i / 3);
          const big = i % 3 === 0;
          return (
            <article
              key={item.key}
              className={big ? `lg:col-span-2 lg:row-span-2 ${band % 2 ? "lg:col-start-2" : ""}` : ""}
            >
              <a
                href={item.href}
                data-no-sweep
                data-cursor={t.expand}
                onClick={onCard(item)}
                className="group flex h-full flex-col outline-none"
              >
                <span
                  data-media
                  className={`relative block overflow-hidden border border-fg ${big ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-[16/10]"}`}
                >
                  <span className="absolute inset-0 transition-transform duration-[900ms] group-hover:scale-[1.03]" style={{ transitionTimingFunction: EASE }}>
                    <Cover item={item} sizes={big ? "(min-width: 1024px) 64vw, 100vw" : "(min-width: 1024px) 32vw, 50vw"} />
                  </span>
                  <CropMarks />
                  <span className="t-fig absolute bottom-3 left-3 translate-y-2 border border-fg bg-[var(--bg)] px-2 py-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {item.mark} · {t.expand} ↗
                  </span>
                </span>
                <span className="mt-2 flex items-baseline justify-between gap-4 px-[var(--gut)] lg:px-0">
                  <span className="t-small">{item.title}</span>
                  <span className="t-small shrink-0 text-faint">{item.meta}</span>
                </span>
              </a>
            </article>
          );
        })}
      </div>
      {/* Portal no <body>: o transform do .page-enter cria um contexto de
          empilhamento que deixaria o cabeçalho fixo por cima do painel. */}
      {open && createPortal(<Expanded {...open} locale={locale} t={t} onClose={() => setOpen(null)} />, document.body)}
    </>
  );
}

function Expanded({
  item,
  from,
  el,
  locale,
  t,
  onClose,
}: {
  item: WorkItem;
  from: DOMRect;
  el: HTMLElement;
  locale: Locale;
  t: WorkGridText;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const anims = useRef<Animation[]>([]);
  const closing = useRef(false);
  const onCloseRef = useRef(onClose);
  const elRef = useRef(el);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
    elRef.current = el;
  });

  /*
   * Abertura: o painel já está no tamanho final e é revelado por clip-path a
   * partir do retângulo do cartão — nada escala, nada distorce. Um fantasma da
   * capa fica no lugar do cartão e se dissolve enquanto a janela abre.
   * Fechar é a mesma animação ao contrário, a partir de onde ela estiver: dá
   * para fechar no meio da abertura sem salto.
   */
  useLayoutEffect(() => {
    const p = panel.current!;
    const g = ghost.current!;
    const b = backdrop.current!;
    const c = content.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      g.style.display = "none";
      const o = { duration: 160, fill: "both" as const };
      anims.current = [
        b.animate([{ opacity: 0 }, { opacity: 0.9 }], o),
        p.animate([{ opacity: 0 }, { opacity: 1 }], o),
      ];
      return;
    }
    const to = p.getBoundingClientRect();
    const k = (n: number) => `${Math.max(0, n)}px`;
    const start = `inset(${k(from.top - to.top)} ${k(to.right - from.right)} ${k(to.bottom - from.bottom)} ${k(from.left - to.left)})`;
    const o = { duration: 720, easing: EASE, fill: "both" as const };
    anims.current = [
      b.animate([{ opacity: 0 }, { opacity: 0.9 }], o),
      p.animate([{ clipPath: start }, { clipPath: "inset(0px 0px 0px 0px)" }], o),
      g.animate(
        [{ opacity: 1 }, { opacity: 1, offset: 0.12 }, { opacity: 0, offset: 0.55 }, { opacity: 0 }],
        { ...o, easing: "linear" },
      ),
      c.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 0, transform: "translateY(10px)", offset: 0.3 },
          { opacity: 1, transform: "none" },
        ],
        o,
      ),
    ];
  }, [from]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const list = anims.current;
    const done = () => {
      onCloseRef.current();
      elRef.current.focus({ preventScroll: true });
    };
    if (!list.length) return done();
    list.forEach((a) => {
      a.playbackRate = 1.35;
      a.reverse();
    });
    Promise.all(list.map((a) => a.finished)).then(done, done);
  }, []);

  // Trava o scroll uma vez, sem mexer no layout: a calha da barra de rolagem
  // fica reservada, então a página não pula de lado.
  useEffect(() => {
    closeBtn.current?.focus({ preventScroll: true });
    const root = document.documentElement;
    const prev = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter };
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev.overflow;
      root.style.scrollbarGutter = prev.gutter;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={item.title}>
      <div ref={backdrop} className="absolute inset-0 bg-[var(--bg)]" style={{ opacity: 0 }} onClick={close} aria-hidden />
      <div
        ref={panel}
        className="relative flex h-[min(86vh,860px)] w-[min(1240px,100%)] flex-col overflow-hidden border border-fg bg-[var(--bg)]"
        style={{ willChange: "clip-path" }}
      >
        <div ref={content} className="flex min-h-0 flex-1 flex-col" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between gap-4 border-b border-fg px-4 py-2.5">
            <span className="t-fig">{item.mark}</span>
            <button ref={closeBtn} type="button" onClick={close} className="ctl !h-8 !px-3" data-cursor={t.close}>
              {t.close} ✕
            </button>
          </div>
          <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="border-b border-fg p-4 lg:border-r lg:border-b-0 lg:p-6">
              {item.figure ? (
                <ExpandedFigure slug={item.figure.slug} caption={item.figure.caption} locale={locale} t={t} />
              ) : (
                <div className="border border-fg">
                  <div className="flex items-center justify-between border-b border-fg px-3 py-1.5">
                    <span className="t-code text-muted">{item.live?.[0] ?? "—"}</span>
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Cover item={item} sizes="(min-width: 1024px) 60vw, 100vw" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 lg:p-6">
              <h2 className="t-hero text-[clamp(2.2rem,4vw,3.8rem)]">{item.title}</h2>
              <p className="mt-4 text-[1.0625rem] leading-snug font-[480]">{item.summary}</p>
              <dl className="mt-6 border-t border-fg">
                {item.facts.map((f) => (
                  <div key={f.k} className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-2.5">
                    <dt className="tb-key !mb-0">{f.k}</dt>
                    <dd className="t-small">{f.v}</dd>
                  </div>
                ))}
                {item.stack && (
                  <div className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-2.5">
                    <dt className="tb-key !mb-0">{t.stack}</dt>
                    <dd className="flex flex-wrap gap-x-3 gap-y-1">
                      {item.stack.map((s) => (
                        <span key={s} className="t-code">
                          {s}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {item.live && (
                  <div className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-2.5">
                    <dt className="tb-key !mb-0">{t.live}</dt>
                    <dd className="flex flex-col gap-1">
                      {item.live.map((d) => (
                        <a key={d} href={`https://${d}`} target="_blank" rel="noreferrer" className="t-code tb-link self-start">
                          {d} ↗
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
              {item.work && (
                <ul className="mt-6">
                  {item.work.map((w) => (
                    <li key={w} className="t-small border-b border-line py-2">
                      {w}
                    </li>
                  ))}
                </ul>
              )}
              <Link href={item.href} className="ctl mt-8" data-cursor={t.open}>
                {t.open} →
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* fantasma da capa: ocupa o lugar do cartão e se dissolve na abertura */}
      <div
        ref={ghost}
        aria-hidden
        className="pointer-events-none fixed overflow-hidden border border-fg"
        style={{ left: from.left, top: from.top, width: from.width, height: from.height, opacity: 0 }}
      >
        <Cover item={item} sizes="(min-width: 1024px) 64vw, 100vw" />
      </div>
    </div>
  );
}

function ExpandedFigure({
  slug,
  caption,
  locale,
  t,
}: {
  slug: string;
  caption: string;
  locale: Locale;
  t: NarrationLabels;
}) {
  const seq = useSequence(stepsOf(slug), { autoplay: true, loop: true });
  const { step, steps, observe } = seq;
  return (
    <div>
      <div ref={observe} className="plate border border-fg px-[4%] pt-6 pb-4">
        <SeqProvider seq={seq}>
          <Figure slug={slug} lit={steps[step]?.on ?? []} title={caption} />
        </SeqProvider>
      </div>
      <div className="mt-4">
        <Narration seq={seq} locale={locale} labels={t} />
      </div>
    </div>
  );
}
