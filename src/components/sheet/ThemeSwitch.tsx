"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * Papel ⇄ cópia heliográfica. O tema inicial é aplicado antes da pintura por
 * THEME_SCRIPT (no <head>); aqui só se lê o atributo e se troca.
 */
const read = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

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

export default function ThemeSwitch({ labels }: { labels: { light: string; dark: string; aria: string } }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);

  return (
    <span className="flex items-center gap-1.5" role="group" aria-label={labels.aria}>
      {(["light", "dark"] as Theme[]).map((t, i) => (
        <span key={t} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-faint">/</span>}
          <button
            type="button"
            aria-pressed={theme === t}
            onClick={() => applyTheme(t)}
            className={theme === t ? "text-fg" : "text-faint hover:text-fg"}
          >
            {labels[t]}
          </button>
        </span>
      ))}
    </span>
  );
}

/** Roda antes da pintura: escolha salva, senão a preferência do sistema. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}})()`;
