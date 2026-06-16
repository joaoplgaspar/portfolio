"use client";

import clsx from "clsx";
import { navItems } from "@/lib/site";
import { goTo } from "@/lib/scroll";
import { useActiveSection } from "@/lib/useActiveSection";

/** Trilha lateral: um ponto por mundo, mostrando onde você está na jornada. */
export default function WorldRail() {
  const active = useActiveSection();

  return (
    <nav
      aria-label="Mundos"
      className="fixed right-5 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {navItems.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => goTo(item.id)}
            className="group flex items-center gap-3"
            aria-current={isActive ? "true" : undefined}
            aria-label={`${item.world} — ${item.label}`}
          >
            <span
              className={clsx(
                "whitespace-nowrap font-mono text-[11px] uppercase tracking-widest transition-all duration-300",
                isActive
                  ? "text-ink opacity-100"
                  : "translate-x-1 text-ink/50 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
              )}
            >
              {item.emoji} {item.world}
            </span>
            <span
              className={clsx(
                "block rounded-full border transition-all duration-300",
                isActive
                  ? "h-3.5 w-3.5 border-transparent"
                  : "h-2.5 w-2.5 border-white/30 bg-transparent group-hover:border-white/70",
              )}
              style={isActive ? { background: item.accent, boxShadow: `0 0 12px ${item.accent}` } : undefined}
            />
          </button>
        );
      })}
    </nav>
  );
}
