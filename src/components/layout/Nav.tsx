"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { navItems } from "@/lib/site";

/** Rola suavemente até a seção usando o Lenis (com fallback nativo). */
function goTo(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-[65] transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <nav
        className={clsx(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5",
          scrolled ? "glass shadow-lg shadow-black/40" : "bg-transparent",
        )}
      >
        <button
          onClick={() => goTo("inicio")}
          className="group flex items-center gap-2"
          aria-label="Voltar ao topo"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 font-display text-sm font-bold tracking-tight transition-colors group-hover:border-bat/60 group-hover:text-bat">
            JPG
          </span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => goTo(item.id)}
                className="rounded-full px-3.5 py-1.5 text-sm text-ink/70 transition-colors hover:bg-white/5 hover:text-ink"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => goTo("contato")}
          className="rounded-full border border-bat/40 bg-bat/10 px-4 py-1.5 text-sm font-medium text-bat transition-colors hover:bg-bat/20"
        >
          Contato
        </button>
      </nav>
    </header>
  );
}
