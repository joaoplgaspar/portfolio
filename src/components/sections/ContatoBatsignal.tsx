import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

/** 📡 Mundo 05 — Bat-Signal. Acenda o sinal para chamar (em construção). */
export default function ContatoBatsignal() {
  return (
    <section
      id="contato"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gotham px-6 py-28"
    >
      {/* feixe do bat-signal */}
      <div
        aria-hidden
        className="anim-signal pointer-events-none absolute left-1/2 top-0 h-[80vh] w-[60vmin] -translate-x-1/2"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 0%, transparent 158deg, rgba(255,210,63,0.16) 180deg, transparent 202deg)",
          filter: "blur(8px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="world-tag mb-6">📡 Mundo 05 — Bat-Signal</span>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="anim-floaty mx-auto mb-8 grid h-24 w-24 place-items-center rounded-full border border-bat/40 bg-bat/10 text-5xl">
            🦇
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Acenda o <span className="text-bat">sinal</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink/75">
            Tem um projeto, uma ideia ou quer trocar uma ideia? É só chamar — o
            formulário interativo (com Firebase) chega na Fase 5.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${siteConfig.email}`}
              className="rounded-full border border-bat/50 bg-bat/15 px-6 py-3 font-medium text-bat transition-colors hover:bg-bat/25"
            >
              {siteConfig.email}
            </a>
            <a
              href="https://www.linkedin.com/in/jpgasparsr7/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-6 py-3 font-medium text-ink/80 transition-colors hover:bg-white/5"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
