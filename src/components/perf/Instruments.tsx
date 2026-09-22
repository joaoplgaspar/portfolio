"use client";

import { useEffect, useRef, useState } from "react";
import { useSafeId } from "@/components/figures/parts";
import { LAB, fmtLab, type LabMetric } from "@/data/stores";

/**
 * Instrumentos da página de performance, no mesmo vocabulário das figuras:
 * régua com as zonas do Core Web Vitals em hachura (bom = papel limpo,
 * precisa melhorar = hachura aberta, ruim = hachura densa), cada loja como
 * um ponto, e a mediana como agulha que corre até o valor quando a régua
 * entra na tela.
 */

const X0 = 20;
const X1 = 780;

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

export function Scale({
  metric,
  values,
  median,
  medianLabel,
  tick,
}: {
  metric: LabMetric;
  values: { mark: string; v: number }[];
  median: number;
  medianLabel: string;
  tick: number;
}) {
  const { good, poor, max } = LAB[metric];
  const fmt = (v: number) => fmtLab(metric, v);
  const label = metric.toUpperCase();
  const x = (v: number) => X0 + (Math.min(v, max) / max) * (X1 - X0);
  const soft = useSafeId("s");
  const dense = useSafeId("d");
  const [ref, seen] = useInView<SVGSVGElement>();
  const ticks = Array.from({ length: Math.round(max / tick) + 1 }, (_, i) => i * tick);

  return (
    <svg
      ref={ref}
      viewBox="0 0 800 112"
      className={`fig ${seen ? "fig-draw" : "opacity-0"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      role="img"
      aria-label={`${label}: ${medianLabel} ${fmt(median)}`}
    >
      <defs>
        <pattern id={soft} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={7} stroke="currentColor" strokeWidth={0.7} />
        </pattern>
        <pattern id={dense} width={3.2} height={3.2} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={3.2} stroke="currentColor" strokeWidth={0.8} />
        </pattern>
      </defs>

      <rect x={x(good)} y={60} width={x(poor) - x(good)} height={12} fill={`url(#${soft})`} stroke="none" className="late" />
      <rect x={x(poor)} y={60} width={X1 - x(poor)} height={12} fill={`url(#${dense})`} stroke="none" className="late" />
      <rect x={X0} y={60} width={X1 - X0} height={12} className="draw" pathLength={1} />

      {ticks.map((v, i) => (
        <g key={i}>
          <line x1={x(v)} y1={72} x2={x(v)} y2={80} strokeWidth={0.9} className="draw" pathLength={1} />
          <text x={x(v)} y={96} textAnchor="middle" className="code late" stroke="none">
            {fmt(v)}
          </text>
        </g>
      ))}

      {[good, poor].map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={44} x2={x(v)} y2={80} strokeWidth={1} strokeDasharray="3 3" className="late" />
          <text x={x(v) + 5} y={52} className="code late" stroke="none">
            {fmt(v)}
          </text>
        </g>
      ))}

      {values.map((s) => (
        <circle key={s.mark} cx={x(s.v)} cy={66} r={3.4} fill="var(--bg)" strokeWidth={1.4} className="late">
          <title>{`${s.mark} · ${fmt(s.v)}`}</title>
        </circle>
      ))}

      <g
        style={{
          transform: `translateX(${seen ? x(median) - X0 : 0}px)`,
          transition: "transform 1600ms cubic-bezier(0.16, 1, 0.3, 1) 300ms",
        }}
      >
        <line x1={X0} y1={14} x2={X0} y2={86} stroke="var(--accent)" strokeWidth={1.6} />
        <path d={`M${X0 - 5} 14 h10 l-5 7 z`} fill="var(--accent)" stroke="none" />
        <text x={X0 + 8} y={22} className="code" stroke="none" style={{ fill: "var(--accent)" }}>
          {medianLabel} {fmt(median)}
        </text>
      </g>
    </svg>
  );
}
