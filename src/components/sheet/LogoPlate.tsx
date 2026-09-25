"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Quanto tempo cada marca fica na placa antes de dar a vez à outra. */
const HOLD = 2600;

/**
 * Capa de projeto: a cor da marca e o logo no centro. Marcas irmãs (Roland e
 * Boss, Integralmédica e Darkness) se revezam na mesma placa, cada uma com a
 * sua cor: uma de cada vez, grande, em vez das duas espremidas. Com
 * movimento reduzido nada troca: a placa se divide ao meio, uma marca em
 * cada lado. `thumb` é a miniatura do índice, onde o logo ocupa mais da caixa
 * para continuar legível a 100 px.
 */
export default function LogoPlate({
  logos,
  plate,
  sizes = "30vw",
  size = "card",
}: {
  logos: string[];
  plate?: string | string[];
  sizes?: string;
  size?: "card" | "thumb";
}) {
  const plates = ([] as (string | undefined)[]).concat(plate);
  const bg = (i: number) => plates[i] ?? plates[0] ?? "var(--plate)";
  const [on, setOn] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (logos.length < 2) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const id = window.setInterval(() => setOn((v) => (v + 1) % logos.length), HOLD);
    return () => {
      mq.removeEventListener("change", sync);
      window.clearInterval(id);
    };
  }, [logos.length]);

  const box = size === "thumb" ? "h-[54%] w-[78%]" : "h-[30%] max-h-[130px] w-[52%] max-w-[360px]";
  const mark = (src: string) => (
    <span className={`relative block ${box}`}>
      <Image src={src} alt="" fill sizes={sizes} unoptimized={src.endsWith(".svg")} className="object-contain" />
    </span>
  );

  if (still) {
    return (
      <span className="absolute inset-0 flex">
        {logos.map((src, i) => (
          <span key={src} className="flex flex-1 items-center justify-center" style={{ background: bg(i) }}>
            {mark(src)}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className="absolute inset-0 block">
      {logos.map((src, i) => (
        <span
          key={src}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-out ${
            i === on ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: bg(i) }}
        >
          {mark(src)}
        </span>
      ))}
    </span>
  );
}
