"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Barra fina no topo que mostra o progresso da jornada. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[70] h-[3px] w-full origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--color-biolum), var(--color-aqua) 45%, var(--color-fut-gold) 75%, var(--color-bat))",
      }}
    />
  );
}
