"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { siteConfig } from "@/lib/site";
import { useEnable3D } from "@/lib/useEnable3D";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

/** 🦇 Mundo 01 — Gotham. Hero 3D com bat-signal (fallback leve no mobile). */
export default function HeroBatman() {
  const enable3D = useEnable3D();

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gotham px-6"
    >
      {enable3D ? (
        <div className="absolute inset-0">
          <HeroScene />
        </div>
      ) : (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 35%, rgba(255,210,63,0.12), transparent 70%), radial-gradient(120% 120% at 50% 120%, #000 20%, transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="anim-signal pointer-events-none absolute left-1/2 top-[34%] h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,210,63,0.22), transparent 65%)",
            }}
          />
        </>
      )}

      {/* overlay de texto (nítido + SEO). pointer-events-none deixa o mouse chegar no 3D */}
      <div className="pointer-events-none relative z-10 mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="world-tag mb-6"
        >
          🦇 Mundo 01 — Gotham
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl font-bold leading-[0.95] tracking-tight drop-shadow-[0_2px_30px_rgba(0,0,0,0.85)] sm:text-7xl md:text-8xl"
        >
          {siteConfig.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-lg text-ink/80 sm:text-xl"
        >
          <span className="text-bat">{siteConfig.role}</span> — {siteConfig.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto mt-10 max-w-md font-mono text-xs uppercase tracking-[0.2em] text-ink/40"
        >
          Role para mergulhar ↓
        </motion.p>
      </div>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 flex h-10 w-6 -translate-x-1/2 justify-center rounded-full border border-white/20 pt-2"
      >
        <span
          className="h-2 w-1 rounded-full bg-bat"
          style={{ animation: "scroll-cue 1.8s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
