import Reveal from "@/components/ui/Reveal";
import { arsenal } from "@/lib/content";

/** 🦇 Mundo 03 — Batcave. Skills como o arsenal do herói (substitui as cartas FIFA). */
export default function SkillsBatcave() {
  return (
    <section
      id="skills"
      className="relative min-h-screen overflow-hidden bg-gotham px-6 py-28"
    >
      {/* atmosfera + grade do batcomputer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-bat) 1px, transparent 1px), linear-gradient(90deg, var(--color-bat) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(70% 60% at 50% 40%, #000, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 30%, rgba(255,210,63,0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal>
          <span className="world-tag mb-6">🦇 Mundo 03 — Batcave</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            O <span className="text-bat">Arsenal</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            Todo herói precisa do equipamento certo. Esse é o meu — as ferramentas
            que uso pra construir soluções de e-commerce headless de verdade.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {arsenal.map((group, i) => (
            <Reveal key={group.categoria} delay={0.05 * i}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-bat/90">
                  {`// ${group.categoria}`}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.itens.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-bat/20 bg-bat/[0.06] px-3 py-1.5 text-sm text-ink/90"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 font-mono text-sm text-bat/70">
            › batcomputer online — interatividade e easter egg (pacote FIFA secreto) chegam nas próximas fases.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
