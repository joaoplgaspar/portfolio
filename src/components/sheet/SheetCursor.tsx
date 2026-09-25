"use client";

import { useEffect, useRef } from "react";

/**
 * Retícula de desenhista. Um cruzamento fino no lugar da seta, com a zona da
 * prancha onde o ponteiro está (A–F × 1–8, as mesmas marcas da moldura).
 * Sobre algo clicável vira um círculo com rótulo (`data-cursor` quando
 * existe). Segue o ponteiro sem atraso: é ferramenta de precisão, não enfeite.
 *
 * Só com ponteiro fino (mouse). Em campo de texto some e o cursor de texto
 * nativo volta. O `<style>` vem junto do componente para não depender do CSS
 * global.
 */
const ROWS = ["A", "B", "C", "D", "E", "F"];

export default function SheetCursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const html = document.documentElement;
    html.classList.add("has-sheet-cursor");

    let x = -100;
    let y = -100;
    let raf = 0;
    const el = root.current!;
    const zone = el.querySelector("[data-zone]") as HTMLElement;
    const label = el.querySelector("[data-label]") as HTMLElement;

    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const col = Math.min(8, Math.floor((x / window.innerWidth) * 8) + 1);
      const row = ROWS[Math.min(5, Math.floor((y / window.innerHeight) * 6))];
      zone.textContent = `${row}·${col}`;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = "1";
      const target = e.target as Element | null;
      const text = target?.closest("input, textarea, select, [contenteditable]");
      const hit = target?.closest("a, button, [role=button], [role=switch], label, [data-cursor]") as HTMLElement | null;
      el.dataset.mode = text ? "text" : hit ? "hit" : "idle";
      label.textContent = hit?.dataset.cursor ?? "";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => (el.style.opacity = "0");
    const onDown = () => el.setAttribute("data-down", "");
    const onUp = () => el.removeAttribute("data-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      html.classList.remove("has-sheet-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* As regras só pegam com a classe no <html>, que o efeito põe quando há mouse. */}
      <style>{`
          html.has-sheet-cursor, html.has-sheet-cursor * { cursor: none !important; }
          html.has-sheet-cursor :is(input, textarea, select, [contenteditable]) { cursor: text !important; }
          .sheet-cursor { position: fixed; left: 0; top: 0; z-index: 100; pointer-events: none; opacity: 0; mix-blend-mode: difference; color: #fff; }
          .sheet-cursor .h, .sheet-cursor .v { position: absolute; background: currentColor; transition: opacity 200ms, transform 300ms cubic-bezier(0.16,1,0.3,1); }
          .sheet-cursor .h { left: -11px; top: -0.5px; width: 22px; height: 1px; }
          .sheet-cursor .v { top: -11px; left: -0.5px; width: 1px; height: 22px; }
          .sheet-cursor .gap { position: absolute; left: -2.5px; top: -2.5px; width: 5px; height: 5px; background: #000; mix-blend-mode: normal; }
          .sheet-cursor .ring { position: absolute; left: -16px; top: -16px; width: 32px; height: 32px; border: 1px solid currentColor; border-radius: 50%; transform: scale(0.3); opacity: 0; transition: transform 320ms cubic-bezier(0.16,1,0.3,1), opacity 200ms; }
          .sheet-cursor .z { position: absolute; left: 10px; top: 10px; font: 500 10px/1 var(--ff-mono), ui-monospace, monospace; letter-spacing: 0.04em; white-space: nowrap; transition: opacity 200ms; }
          .sheet-cursor .lbl { position: absolute; left: 22px; top: -6px; font: 600 11px/1 var(--ff-sans), system-ui, sans-serif; white-space: nowrap; opacity: 0; transform: translateX(-4px); transition: opacity 220ms, transform 320ms cubic-bezier(0.16,1,0.3,1); }
          .sheet-cursor[data-mode="hit"] .ring { transform: scale(1); opacity: 1; }
          .sheet-cursor[data-mode="hit"] .h, .sheet-cursor[data-mode="hit"] .v { opacity: 0.5; transform: scale(0.45); }
          .sheet-cursor[data-mode="hit"] .z { opacity: 0; }
          .sheet-cursor[data-mode="hit"] .lbl:not(:empty) { opacity: 1; transform: none; }
          .sheet-cursor[data-mode="text"] { opacity: 0 !important; }
          .sheet-cursor[data-down] .ring { transform: scale(0.8); }
          @media (prefers-reduced-motion: reduce) { .sheet-cursor * { transition: none !important; } }
          html:not(.has-sheet-cursor) .sheet-cursor { display: none; }
        `}</style>
      <div ref={root} className="sheet-cursor" aria-hidden data-mode="idle">
        <span className="h" />
        <span className="v" />
        <span className="ring" />
        <span className="z" data-zone />
        <span className="lbl" data-label />
      </div>
    </>
  );
}
