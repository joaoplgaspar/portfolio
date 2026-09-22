"use client";

import Image from "next/image";
import { useId, useState } from "react";

/**
 * Integral Médica × Darkness: a mesma vitrine, duas marcas. As duas capturas
 * são do mesmo template — header, busca, menu, banner e faixa de benefícios
 * caem no mesmo lugar. A cortina arrastável deixa isso evidente em um gesto,
 * e é um `<input type="range">` por baixo: teclado e leitor de tela incluídos.
 */
export default function BrandWipe({ label, a, b }: { label: string; a: string; b: string }) {
  const [x, setX] = useState(50);
  const id = useId();
  return (
    <figure>
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-fg bg-raised">
        <Image src="/covers/darkness.jpg" alt={b} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover object-top" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
          <Image src="/covers/integralmedica.jpg" alt={a} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover object-top" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-fg" style={{ left: `${x}%` }}>
          <span className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center border border-fg bg-bg text-[13px] font-semibold">
            ⇆
          </span>
        </div>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-2 flex justify-between t-small">
        <span>{a}</span>
        <span className="text-muted">{label}</span>
        <span>{b}</span>
      </figcaption>
    </figure>
  );
}
