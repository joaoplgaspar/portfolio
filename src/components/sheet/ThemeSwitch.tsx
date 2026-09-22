"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * Interruptor claro ⇄ escuro. Um switch de verdade (sol · trilho · lua), não
 * duas palavras soltas: quem chega entende o que é sem ler. O tema inicial é
 * aplicado antes da pintura por THEME_SCRIPT (no <head>).
 */
const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function applyTheme(t: Theme) {
  const root = document.documentElement;
  // Sem transição durante a troca: senão cada filete anima a cor sozinho.
  root.setAttribute("data-theme-switching", "");
  root.setAttribute("data-theme", t);
  try {
    localStorage.setItem("theme", t);
  } catch {}
  requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute("data-theme-switching")));
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

function Sun() {
  return (
    <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
      <circle cx={8} cy={8} r={3} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1={8} y1={1.5} x2={8} y2={3.2} transform={`rotate(${a} 8 8)`} strokeLinecap="round" />
      ))}
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
      <path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function ThemeSwitch({ labels }: { labels: { light: string; dark: string; aria: string } }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const dark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={labels.aria}
      onClick={() => applyTheme(dark ? "light" : "dark")}
      className="group flex items-center gap-2"
    >
      <span className={dark ? "text-faint group-hover:text-fg" : "text-fg"}>
        <Sun />
      </span>
      <span className="relative block h-[16px] w-[30px] border-[1.25px] border-fg">
        <span
          className="absolute top-[2px] block h-[9px] w-[9px] bg-accent transition-[left] duration-300"
          style={{ left: dark ? 16 : 2 }}
        />
      </span>
      <span className={dark ? "text-fg" : "text-faint group-hover:text-fg"}>
        <Moon />
      </span>
      <span className="hidden min-w-[3.2em] text-left lg:inline">{dark ? labels.dark : labels.light}</span>
    </button>
  );
}

/** Roda antes da pintura: escolha salva, senão a preferência do sistema. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}})()`;
