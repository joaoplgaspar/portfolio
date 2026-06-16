import Reveal from "@/components/ui/Reveal";

/** 🌊 Mundo 02 — O Mergulho. Scroll = descer no oceano (em construção). */
export default function SobreSubnautica() {
  return (
    <section
      id="sobre"
      className="relative min-h-screen overflow-hidden px-6 py-28"
      style={{
        background:
          "linear-gradient(180deg, #06304f 0%, #042742 35%, #02101f 100%)",
      }}
    >
      {/* partículas bioluminescentes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[
          { l: "12%", t: "20%", s: 6, d: "0s" },
          { l: "80%", t: "30%", s: 4, d: "1.5s" },
          { l: "30%", t: "60%", s: 5, d: "0.8s" },
          { l: "65%", t: "70%", s: 7, d: "2.2s" },
          { l: "50%", t: "40%", s: 3, d: "1.1s" },
          { l: "88%", t: "80%", s: 5, d: "0.4s" },
        ].map((p, i) => (
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

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <span className="world-tag mb-6">🌊 Mundo 02 — O Mergulho</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Sobre <span className="text-biolum">/</span> O Mergulho
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
              Aqui você vai <span className="text-aqua">mergulhar</span> em quem eu
              sou. Conforme a página descer, a gente afunda no oceano e cada marco
              da minha trajetória acende como bioluminescência nas profundezas.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 font-mono text-sm text-biolum/80">
              › Cena 3D imersiva chegando na Fase 2.
            </p>
          </Reveal>
        </div>

        {/* medidor de profundidade (teaser da timeline) */}
        <Reveal delay={0.2} className="hidden md:block">
          <div className="glass flex h-full flex-col justify-between rounded-2xl px-5 py-6 font-mono text-xs">
            <span className="text-ink/40">PROFUNDIDADE</span>
            <div className="my-4 space-y-3">
              {["0 m — superfície", "-300 m — formação", "-900 m — SHAKERS", "-1.200 m — agora"].map(
                (d) => (
                  <div key={d} className="flex items-center gap-2 text-ink/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-biolum" />
                    {d}
                  </div>
                ),
              )}
            </div>
            <span className="text-aqua">▼ continue descendo</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
