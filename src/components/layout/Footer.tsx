import { siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-gotham px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-ink/50 sm:flex-row">
        <p>
          © {year} {siteConfig.name}. Feito com Next.js, R3F, GSAP & Firebase.
        </p>
        <p className="font-mono text-xs">
          <span className="text-biolum">●</span> Fase 2 — Gotham 3D
        </p>
      </div>
    </footer>
  );
}
