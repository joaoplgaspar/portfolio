"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Mock } from "@/data/mocks";

/** Altura da tela do celular na captura (390 × 844). */
const PHONE_H = 844;

/**
 * Mockup em traço de prancha: um notebook com a primeira dobra do site e, na
 * frente, um celular com a página inteira rolando devagar, de cima a baixo e
 * de volta. As medidas ficam anotadas como cota. A rolagem só anda com o
 * mockup na tela; com movimento reduzido, o celular mostra o topo parado.
 */
export default function DeviceMock({
  desktop,
  phone,
  domain,
  priority = false,
}: {
  desktop?: string;
  phone?: Mock;
  domain?: string;
  priority?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Quanto rolar: a imagem sobe até a última tela dela ficar à mostra.
  const end = phone ? `${-(1 - PHONE_H / phone.h) * 100}%` : "0%";
  // Velocidade constante de leitura: ~1 s a cada 200 px de página.
  const dur = phone ? `${Math.max(10, phone.h / 200)}s` : "0s";

  return (
    <figure ref={root} className={`mock relative ${inView ? "is-in" : ""} ${phone ? "pb-[6%] sm:pr-[14%]" : ""}`}>
      {/* notebook */}
      <div className="relative">
        <div className="rounded-t-[10px] border-[1.25px] border-fg bg-[var(--plate)] p-[1.2%]">
          <div className="flex items-center gap-2 border-[1.25px] border-b-0 border-fg px-2 py-1">
            <span className="flex gap-1" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-[6px] w-[6px] rounded-full border border-fg" />
              ))}
            </span>
            <span className="t-code truncate text-muted">{domain}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden border-[1.25px] border-fg">
            {desktop && (
              <Image
                src={desktop}
                alt=""
                fill
                priority={priority}
                sizes="(min-width: 1280px) 1000px, 90vw"
                className="object-cover object-top"
              />
            )}
          </div>
        </div>
        {/* base do notebook: um trapézio em traço */}
        <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="-mx-[3%] block h-[12px] w-[106%] text-fg" aria-hidden>
          <path
            d="M0 0 H100 L97 4 H3 Z"
            fill="var(--plate)"
            stroke="currentColor"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p className="t-code mt-2 text-faint">1440 × 900</p>
      </div>

      {/* celular, na frente, com a página inteira rolando */}
      {phone && (
        <div className="absolute right-0 bottom-0 w-[30%] max-w-[260px] min-w-[120px] sm:w-[24%]">
          <div className="rounded-[24px] border-[1.25px] border-fg bg-[var(--plate)] p-[5%] shadow-[6px_6px_0_var(--shade)]">
            <div className="relative overflow-hidden rounded-[16px] border-[1.25px] border-fg" style={{ aspectRatio: `390 / ${PHONE_H}` }}>
              <Image
                src={phone.src}
                alt=""
                width={phone.w}
                height={phone.h}
                sizes="260px"
                className="mock-scroll block h-auto w-full"
                style={{ ["--mock-end" as string]: end, ["--mock-dur" as string]: dur }}
              />
            </div>
          </div>
          <p className="t-code mt-2 text-right text-faint">390 × 844</p>
        </div>
      )}
    </figure>
  );
}
