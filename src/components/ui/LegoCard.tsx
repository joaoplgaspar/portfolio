"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import type { Projeto, Empresa } from "@/lib/content";

const empresaStyle: Record<Empresa, { label: string; cls: string }> = {
  SHAKERS: { label: "SHAKERS", cls: "border-lego-red/50 bg-lego-red/15 text-lego-red" },
  Pessoal: { label: "Pessoal", cls: "border-lego-blue/50 bg-lego-blue/15 text-aqua" },
  Estudos: { label: "Estudos", cls: "border-lego-green/50 bg-lego-green/15 text-lego-green" },
};
const studColors = [
  "var(--color-lego-red)",
  "var(--color-lego-yellow)",
  "var(--color-lego-blue)",
  "var(--color-lego-green)",
];

// peça por peça: o card encaixa, os studs caem, os blocos sobem
const cardV: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 42 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 16, when: "beforeChildren", staggerChildren: 0.06 },
  },
};
const studV: Variants = {
  hidden: { y: -22, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 15 } },
};
const pieceV: Variants = {
  hidden: { y: 26, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 22 } },
};

export default function LegoCard({ projeto }: { projeto: Projeto }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 150, damping: 15 });

  function onMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const badge = empresaStyle[projeto.empresa];

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      variants={cardV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors [transform-style:preserve-3d] hover:border-lego-yellow/40"
    >
      <motion.div variants={studV} className="flex gap-1.5 px-5 pt-4">
        {studColors.map((c, j) => (
          <span
            key={j}
            className="h-2.5 w-2.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
            style={{ background: c }}
          />
        ))}
      </motion.div>

      <motion.div
        variants={pieceV}
        className="mx-5 mt-3 h-36 overflow-hidden rounded-xl bg-cover bg-center"
        style={
          projeto.imagem
            ? { backgroundImage: `url("${encodeURI(projeto.imagem)}")` }
            : {
                background:
                  "repeating-linear-gradient(45deg, rgba(255,207,0,0.10) 0 10px, transparent 10px 20px), #14161f",
              }
        }
      >
        {!projeto.imagem && (
          <div className="flex h-full items-center justify-center font-display text-4xl font-bold text-lego-yellow/70">
            {projeto.nome.charAt(0)}
          </div>
        )}
      </motion.div>

      <motion.div variants={pieceV} className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
            {badge.label}
          </span>
          {projeto.mock && (
            <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-ink/50">
              em breve
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold">{projeto.nome}</h3>
        {projeto.papel && <p className="mt-0.5 text-xs text-lego-yellow/80">{projeto.papel}</p>}
        <p className="mt-2 line-clamp-3 text-sm text-ink/65">{projeto.descricao}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {projeto.tecnologias.map((t) => (
            <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-ink/70">
              {t}
            </span>
          ))}
        </div>
        {(projeto.github || projeto.site) && (
          <div className="mt-4 flex gap-3 border-t border-white/10 pt-3 text-sm">
            {projeto.site && (
              <a href={projeto.site} target="_blank" rel="noopener noreferrer" className="text-aqua transition-colors hover:text-biolum">
                Ver site ↗
              </a>
            )}
            {projeto.github && (
              <a href={projeto.github} target="_blank" rel="noopener noreferrer" className="text-ink/60 transition-colors hover:text-ink">
                GitHub ↗
              </a>
            )}
          </div>
        )}
      </motion.div>
    </motion.article>
  );
}
