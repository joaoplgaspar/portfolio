import Reveal from "@/components/ui/Reveal";

const cardStats = [
  ["95", "COMP"],
  ["92", "HOOKS"],
  ["90", "PERF"],
  ["88", "UI/UX"],
  ["93", "DX"],
  ["91", "SPA"],
];

/** ⚽ Mundo 03 — Ultimate Team. Skills viram cartas FUT (em construção). */
export default function SkillsFifa() {
  return (
    <section
      id="skills"
      className="relative min-h-screen overflow-hidden bg-void px-6 py-28"
      style={{
        background:
          "radial-gradient(70% 60% at 80% 20%, rgba(233,196,106,0.10), transparent 60%), #06070b",
      }}
    >
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <Reveal>
            <span className="world-tag mb-6">⚽ Mundo 03 — Ultimate Team</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Skills <span className="text-fut-gold">FC</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
              Cada tecnologia que eu domino vira uma carta com stats, raridade e
              brilho holográfico. Vai dar pra{" "}
              <span className="text-fut-gold">abrir um pacote</span> e revelar o time.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 font-mono text-sm text-fut-gold/80">
              › Abertura de pacote interativa chegando na Fase 3.
            </p>
          </Reveal>
        </div>

        {/* teaser de carta FUT */}
        <Reveal delay={0.2} className="flex justify-center">
          <div
            className="anim-floaty relative w-64 rounded-[2rem] p-[2px]"
            style={{
              background:
                "linear-gradient(160deg, #f7d774, #c9962f 45%, #f7d774 70%, #9c7322)",
              boxShadow: "0 30px 60px -20px rgba(233,196,106,0.5)",
            }}
          >
            <div
              className="relative overflow-hidden rounded-[1.9rem] px-6 py-7"
              style={{
                background:
                  "linear-gradient(165deg, #f4cf72, #e3b358 60%, #caa044)",
              }}
            >
              {/* shimmer */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 5s linear infinite",
                  mixBlendMode: "overlay",
                }}
              />
              <div className="relative flex items-start justify-between text-[#3a2d0c]">
                <div className="leading-none">
                  <div className="font-display text-5xl font-extrabold">95</div>
                  <div className="mt-1 text-xs font-bold tracking-wider">DEV</div>
                </div>
                <div className="text-2xl">🇧🇷</div>
              </div>

              <div className="relative mx-auto my-4 grid h-24 w-24 place-items-center rounded-full bg-[#3a2d0c]/10 font-display text-4xl font-bold text-[#3a2d0c]">
                JPG
              </div>

              <div className="relative text-center font-display text-xl font-extrabold uppercase tracking-wide text-[#3a2d0c]">
                React
              </div>

              <div className="relative mt-4 grid grid-cols-3 gap-x-4 gap-y-2 text-[#3a2d0c]">
                {cardStats.map(([n, l]) => (
                  <div key={l} className="flex items-baseline gap-1.5">
                    <span className="font-display text-lg font-bold">{n}</span>
                    <span className="text-[10px] font-semibold tracking-wide opacity-80">
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
