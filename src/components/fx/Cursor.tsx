"use client";

import { useEffect, useRef } from "react";

/** Cursor customizado discreto (Seção 4.6). Só em fine pointer + sem reduced-motion. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;
    };

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const interactive = target?.closest?.(
        "a,button,input,textarea,select,label,[role='button']",
      );
      html.classList.toggle("cursor-hover", Boolean(interactive));
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      html.classList.remove("cursor-hover");
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-ring cursor-layer pointer-events-none fixed left-0 top-0 z-[70] hidden size-8 rounded-full border border-fg/40"
        style={{ marginLeft: -16, marginTop: -16 }}
      />
      <div
        ref={dot}
        aria-hidden
        className="cursor-layer pointer-events-none fixed left-0 top-0 z-[70] hidden size-1.5 rounded-full bg-accent-lift"
        style={{ marginLeft: -3, marginTop: -3 }}
      />
    </>
  );
}
