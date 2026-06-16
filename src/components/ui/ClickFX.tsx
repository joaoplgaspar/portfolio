"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Part = { dx: number; dy: number; c: string };
type Burst = { id: number; x: number; y: number; parts: Part[] };

const COLORS = ["#ffd23f", "#2ce6c9", "#38d0ff", "#e9c46a"];
let uid = 0;

/** Pequeno burst de partículas em cada clique (puro deleite, pointer-events-none). */
export default function ClickFX() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const parts: Part[] = Array.from({ length: 9 }, () => {
        const a = Math.random() * Math.PI * 2;
        const d = 28 + Math.random() * 46;
        return {
          dx: Math.cos(a) * d,
          dy: Math.sin(a) * d,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      });
      const burst: Burst = { id: uid++, x: e.clientX, y: e.clientY, parts };
      setBursts((prev) => [...prev, burst]);
      window.setTimeout(
        () => setBursts((prev) => prev.filter((b) => b.id !== burst.id)),
        700,
      );
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <AnimatePresence>
        {bursts.map((b) => (
          <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
            {b.parts.map((p, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{ background: p.c, boxShadow: `0 0 6px ${p.c}` }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
