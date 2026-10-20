"use client";

import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import type { ScanStep } from "@/data/livra";
import Narration, { type NarrationLabels } from "@/components/figures/Narration";
import { useSequence } from "@/components/figures/sequence";

/** O fluxo do scanner, gravado em aparelho, passo a passo. */
export default function Scanner({
  frames,
  locale,
  labels,
  fig,
  title,
}: {
  frames: ScanStep[];
  locale: Locale;
  labels: NarrationLabels;
  fig: string;
  title: string;
}) {
  const seq = useSequence(
    frames.map((f) => ({ dur: f.dur, caption: f.caption })),
    { autoplay: true, loop: true },
  );
  const { step, observe, go } = seq;

  return (
    <div
      ref={observe}
      className="grid gap-8 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:items-end lg:gap-[var(--gut)]"
    >
      <div className="rounded-[30px] border-[1.25px] border-fg bg-[var(--plate)] p-[6px] mx-auto w-full max-w-[300px]">
        <div className="relative overflow-hidden rounded-[24px]" style={{ aspectRatio: "540 / 1169" }}>
          {frames.map((f, i) => (
            <Image
              key={f.src}
              src={f.src}
              alt=""
              fill
              sizes="300px"
              className="object-cover transition-opacity duration-500"
              style={{ opacity: i === step ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="t-small mb-4">
          <span className="t-fig mr-2">{fig}</span>
          {title}
        </p>
        <ol className="mb-6 grid grid-cols-6 gap-2">
          {frames.map((f, i) => (
            <li key={f.src}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}`}
                aria-current={i === step ? "step" : undefined}
                className={`rounded-[12px] border-[1.25px] border-fg bg-[var(--plate)] p-[3px] block w-full transition-opacity ${
                  i === step ? "!border-accent shadow-[0_0_0_1px_var(--accent)]" : "opacity-45 hover:opacity-100"
                }`}
              >
                <span className="relative block overflow-hidden rounded-[9px]" style={{ aspectRatio: "540 / 1169" }}>
                  <Image src={f.src} alt="" fill sizes="80px" className="object-cover" />
                </span>
              </button>
            </li>
          ))}
        </ol>
        <Narration seq={seq} locale={locale} labels={labels} />
      </div>
    </div>
  );
}
