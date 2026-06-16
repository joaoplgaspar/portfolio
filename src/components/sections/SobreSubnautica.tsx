"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import { bio, jornada } from "@/lib/content";
import { useEnable3D } from "@/lib/useEnable3D";
import { useInView } from "@/lib/useInView";

const DiveScene = dynamic(() => import("@/components/three/DiveScene"), {
  ssr: false,
});

/** 🌊 Mundo 02 — O Mergulho. Fundo 3D fixo; o scroll controla a descida. */
export default function SobreSubnautica() {
  const enable3D = useEnable3D();
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const inView = useInView(sectionRef);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      progress.current = total > 0 ? scrolled / total : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="sobre" ref={sectionRef} className="relative bg-abyss">
      {/* fundo 3D fixo enquanto a seção passa */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {enable3D ? (
          <DiveScene progress={progress} active={inView} />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #0e5f70 0%, #063048 45%, #02101f 100%)",
            }}
          />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, transparent 45%, rgba(2,16,31,0.55))",
          }}
        />
      </div>

      {/* conteúdo sobre o fundo */}
      <div className="relative z-10 -mt-[100vh]">
        <div className="mx-auto max-w-5xl px-6 pb-32 pt-32">
          <Reveal>
            <span className="world-tag mb-6">🌊 Mundo 02 — O Mergulho</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl font-bold tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-6xl">
              Sobre <span className="text-biolum">/</span> O Mergulho
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
              {bio.resumo}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-aqua/80">
              role para descer ↓
            </p>
          </Reveal>
        </div>

        {/* timeline com bastante respiro: dura o mergulho inteiro */}
        <ol className="mx-auto max-w-5xl space-y-[36vh] px-6 pb-[30vh]">
          {jornada.map((m, i) => (
            <li
              key={m.titulo}
              className={clsx("flex", i % 2 ? "justify-end" : "justify-start")}
            >
              <Reveal>
                <div className="glass max-w-sm rounded-2xl p-6">
                  <div className="font-mono text-xs uppercase tracking-widest text-aqua">
                    {m.depth} · {m.ano}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold">
                    {m.titulo}
                  </h3>
                  <p className="mt-2 text-ink/75">{m.texto}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mx-auto max-w-5xl px-6 pb-28">
          <Reveal>
            <p className="font-mono text-sm text-biolum/80">
              › você chegou ao fundo — a cena reage à profundidade do seu scroll.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
