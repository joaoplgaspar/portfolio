"use client";

import Reveal from "@/components/ui/Reveal";
import LegoCard from "@/components/ui/LegoCard";
import { useProjetos } from "@/lib/useProjetos";

/** 🧱 Mundo 04 — Build Mode. Projetos que se montam peça por peça, como LEGO. */
export default function ProjetosLego() {
  const projetos = useProjetos();

  return (
    <section id="projetos" className="relative bg-gotham-steel px-6 py-28">
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
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
            Cada projeto se monta peça por peça, como um set de LEGO — passe o mouse
            pra inclinar a peça. Os cases da{" "}
            <span className="text-lego-red">SHAKERS</span> e os projetos pessoais são
            gerenciados por mim num painel, sempre atualizados.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projetos.map((p) => (
            <LegoCard key={p.id} projeto={p} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 font-mono text-sm text-lego-yellow/80">
            › Galeria conectada ao Firestore — atualizada pelo painel /admin.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
