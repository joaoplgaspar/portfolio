"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { siteConfig } from "@/lib/site";

// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const STATS = [
  { v: 92, k: "REA" },
  { v: 90, k: "NXT" },
  { v: 88, k: "TS" },
  { v: 85, k: "3D" },
  { v: 91, k: "PRF" },
  { v: 93, k: "SOL" },
];

/** 🎮 Easter egg: o Konami code abre um pacote FIFA Ultimate Team do próprio JPG. */
export default function EasterEggFifa() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[idx]) {
        idx += 1;
        if (idx === SEQUENCE.length) {
          setOpen(true);
          idx = 0;
        }
      } else {
        idx = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] grid place-items-center bg-black/80 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ rotateY: 90, scale: 0.8, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 13 }}
            className="relative w-[300px] overflow-hidden rounded-[22px] p-6 text-center shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #f7d774, #e9c46a 45%, #b8923a)",
              color: "#2a2207",
            }}
          >
            {/* brilho passando */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
              }}
              initial={{ x: "-130%" }}
              animate={{ x: "130%" }}
              transition={{ duration: 1.4, delay: 0.5, repeat: Infinity, repeatDelay: 2.4 }}
            />

            <div className="relative flex items-start justify-between">
              <div className="text-left leading-none">
                <div className="font-display text-5xl font-black">92</div>
                <div className="mt-1 text-sm font-extrabold tracking-wide">DEV</div>
                <div className="mt-3 text-3xl">🦇</div>
              </div>
              <div className="grid h-20 w-20 place-items-center rounded-full bg-black/10 font-display text-2xl font-black">
                JPG
              </div>
            </div>

            <div className="relative mt-3 border-y border-black/25 py-2 font-display text-xl font-black tracking-wide">
              J. P. GASPAR
            </div>

            <div className="relative mt-3 grid grid-cols-2 gap-x-8 gap-y-1.5 text-left">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.k}
                  className="flex items-center gap-2 font-bold"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                >
                  <span className="tabular-nums">{s.v}</span>
                  <span className="opacity-70">{s.k}</span>
                </motion.div>
              ))}
            </div>

            <div className="relative mt-4 text-xs font-semibold uppercase tracking-widest opacity-60">
              Ultimate Dev · Icon
            </div>
          </motion.div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            {siteConfig.shortName} pack · toque fora para fechar
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
