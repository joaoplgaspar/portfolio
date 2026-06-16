import Reveal from "@/components/ui/Reveal";
import { bio, jornada } from "@/lib/content";

const dots = [
  { l: "12%", t: "18%", s: 6, d: "0s" },
  { l: "82%", t: "26%", s: 4, d: "1.5s" },
  { l: "28%", t: "52%", s: 5, d: "0.8s" },
  { l: "68%", t: "64%", s: 7, d: "2.2s" },
  { l: "48%", t: "38%", s: 3, d: "1.1s" },
  { l: "88%", t: "78%", s: 5, d: "0.4s" },
  { l: "18%", t: "82%", s: 4, d: "1.9s" },
];

/** 🌊 Mundo 02 — O Mergulho. Scroll = descer no oceano; a trajetória acende nas profundezas. */
export default function SobreSubnautica() {
  return (
    <section
      id="sobre"
      className="relative overflow-hidden px-6 py-28"
      style={{
        background:
          "linear-gradient(180deg, #0a0b10 0%, #06304f 12%, #042742 45%, #02101f 100%)",
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {dots.map((p, i) => (
          <span
            key={i}
            className="anim-floaty absolute rounded-full bg-biolum"
            style={{
              left: p.l,
              top: p.t,
              width: p.s,
              height: p.s,
              animationDelay: p.d,
              boxShadow: "0 0 12px var(--color-biolum)",
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal>
          <span className="world-tag mb-6">🌊 Mundo 02 — O Mergulho</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Sobre <span className="text-biolum">/</span> O Mergulho
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
            {bio.resumo}
          </p>
        </Reveal>

        {/* Timeline em profundidade */}
        <div className="relative mt-16 pl-8 sm:pl-0">
          {/* linha vertical */}
          <div
            aria-hidden
            className="absolute left-2 top-2 h-full w-px sm:left-1/2"
            style={{
              background:
                "linear-gradient(180deg, var(--color-biolum), var(--color-aqua) 40%, var(--color-deep) 100%)",
            }}
          />

          <ol className="space-y-12">
            {jornada.map((m, i) => (
              <li key={m.titulo} className="relative sm:grid sm:grid-cols-2 sm:gap-10">
                {/* nó na linha */}
                <span
                  aria-hidden
                  className="absolute -left-[1.6rem] top-1.5 h-3 w-3 rounded-full bg-biolum sm:left-1/2 sm:-translate-x-1/2"
                  style={{ boxShadow: "0 0 14px var(--color-biolum)" }}
                />
                {/* lado par/ímpar no desktop */}
                <Reveal
                  delay={0.05 * i}
                  className={
                    i % 2 === 0
                      ? "sm:col-start-1 sm:text-right sm:pr-10"
                      : "sm:col-start-2 sm:pl-10"
                  }
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-aqua">
                    {m.depth} · {m.ano}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold">{m.titulo}</h3>
                  <p className="mt-2 text-ink/70">{m.texto}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-14 font-mono text-sm text-biolum/80">
            › Cena 3D imersiva (águas, bioluminescência, pressão) chega na Fase 2.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
