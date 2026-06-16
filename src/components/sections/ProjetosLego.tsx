"use client";

import Reveal from "@/components/ui/Reveal";
import { type Empresa } from "@/lib/content";
import { useProjetos } from "@/lib/useProjetos";

const empresaStyle: Record<Empresa, { label: string; cls: string }> = {
  SHAKERS: { label: "SHAKERS", cls: "border-lego-red/50 bg-lego-red/15 text-lego-red" },
  Pessoal: { label: "Pessoal", cls: "border-lego-blue/50 bg-lego-blue/15 text-aqua" },
  Estudos: { label: "Estudos", cls: "border-lego-green/50 bg-lego-green/15 text-lego-green" },
};

const studColors = ["var(--color-lego-red)", "var(--color-lego-yellow)", "var(--color-lego-blue)"];

/** 🧱 Mundo 04 — Build Mode. Projetos como sets de LEGO (montagem física vem na Fase 4). */
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
            Cada projeto se monta peça por peça, como um set de LEGO. Os cases da{" "}
            <span className="text-lego-red">SHAKERS</span> e os projetos pessoais
            são gerenciados por mim num painel — sempre atualizados.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projetos.map((p, i) => {
            const badge = empresaStyle[p.empresa];
            return (
              <Reveal key={p.id} delay={0.04 * i}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/25">
                  {/* studs de LEGO */}
                  <div className="flex gap-1.5 px-5 pt-4">
                    {studColors.map((c, j) => (
                      <span key={j} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>

                  {/* thumbnail */}
                  <div
                    className="mx-5 mt-3 h-36 rounded-xl bg-cover bg-center"
                    style={
                      p.imagem
                        ? { backgroundImage: `url("${encodeURI(p.imagem)}")` }
                        : {
                            background:
                              "repeating-linear-gradient(45deg, rgba(255,207,0,0.10) 0 10px, transparent 10px 20px), #14161f",
                          }
                    }
                  >
                    {!p.imagem && (
                      <div className="flex h-full items-center justify-center font-display text-4xl font-bold text-lego-yellow/70">
                        {p.nome.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
                        {badge.label}
                      </span>
                      {p.mock && (
                        <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-ink/50">
                          em breve
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-semibold">{p.nome}</h3>
                    {p.papel && (
                      <p className="mt-0.5 text-xs text-lego-yellow/80">{p.papel}</p>
                    )}
                    <p className="mt-2 line-clamp-3 text-sm text-ink/65">{p.descricao}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tecnologias.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-ink/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {(p.github || p.site) && (
                      <div className="mt-4 flex gap-3 border-t border-white/10 pt-3 text-sm">
                        {p.site && (
                          <a
                            href={p.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-aqua transition-colors hover:text-biolum"
                          >
                            Ver site ↗
                          </a>
                        )}
                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink/60 transition-colors hover:text-ink"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
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
