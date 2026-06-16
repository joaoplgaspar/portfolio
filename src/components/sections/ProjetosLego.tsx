import Reveal from "@/components/ui/Reveal";
import projetosData from "@/data/projetos.json";

const bricks = [
  { color: "var(--color-lego-red)", studs: 4 },
  { color: "var(--color-lego-yellow)", studs: 2 },
  { color: "var(--color-lego-blue)", studs: 3 },
  { color: "var(--color-lego-green)", studs: 2 },
];

function Brick({ color, studs }: { color: string; studs: number }) {
  return (
    <div className="anim-floaty" style={{ animationDelay: `${studs * 0.3}s` }}>
      <div className="flex gap-1.5 pl-1.5">
        {Array.from({ length: studs }).map((_, i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full"
            style={{ background: color, filter: "brightness(1.15)" }}
          />
        ))}
      </div>
      <div
        className="h-12 rounded-md"
        style={{
          width: studs * 22 + 12,
          background: color,
          boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.22)",
        }}
      />
    </div>
  );
}

/** 🧱 Mundo 04 — Build Mode. Projetos montados peça por peça (em construção). */
export default function ProjetosLego() {
  const total = (projetosData.projetos?.length ?? 0) as number;

  return (
    <section id="projetos" className="relative min-h-screen bg-gotham-steel px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="world-tag mb-6">🧱 Mundo 04 — Build Mode</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Projetos <span className="text-lego-yellow">construídos</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            Cada projeto se monta peça por peça, como um set de LEGO. Já são{" "}
            <span className="text-lego-yellow">{total} projetos</span> na base — e os
            da <span className="text-lego-red">SHAKERS</span> entram em breve.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-end gap-5">
            {bricks.map((b, i) => (
              <Brick key={i} color={b.color} studs={b.studs} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-10 font-mono text-sm text-lego-yellow/80">
            › Galeria com física (montagem dos blocos) + admin no Firebase chegando na Fase 4.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
