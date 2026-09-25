"use client";

import { createContext, useContext, useId, type ReactNode } from "react";

/**
 * Primitivas das figuras. O vocabulário é o de uma prancha de patente:
 * traço de 1.25, numeral de referência em itálico com linha de chamada,
 * linha oculta tracejada, eixo em traço-ponto, corte em hachura.
 *
 * O movimento é narrado: ver `sequence.tsx`. Aqui ficam só as peças.
 */

export type FigProps = {
  /** Numerais acesos: o hover da legenda, ou as peças do passo atual. */
  lit: number[];
  /** Desenha os traços ao montar. */
  draw?: boolean;
  title: string;
};

const Lit = createContext<number[]>([]);
const useLit = (n: number) => useContext(Lit).includes(n);

/** Id seguro para `url(#…)` — o formato do useId muda entre versões do React. */
export function useSafeId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

export function Fig({
  title,
  draw = true,
  lit,
  children,
  viewBox = "0 0 800 500",
}: {
  title: string;
  draw?: boolean;
  lit: number[];
  children: ReactNode;
  viewBox?: string;
}) {
  const tid = useSafeId("t");
  return (
    <Lit.Provider value={lit}>
    <svg
      viewBox={viewBox}
      className={`fig ${draw ? "fig-draw" : ""}`}
      role="img"
      aria-labelledby={tid}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <title id={tid}>{title}</title>
      {children}
    </svg>
    </Lit.Provider>
  );
}

/** Grupo de peça: acende em sinal quando o numeral dela está ativo. */
export function Part({ n, children }: { n: number; children: ReactNode }) {
  return <g className={`part ${useLit(n) ? "is-on" : ""}`}>{children}</g>;
}


/**
 * Linha de chamada + numeral. Curva leve (como a feita à mão numa prancha),
 * ponto de contato na peça, numeral 12px além da ponta, na mesma direção.
 */
export function Leader({ n, at, to }: { n: number; at: [number, number]; to: [number, number] }) {
  const [x1, y1] = at;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Controle deslocado na perpendicular: a curva sempre "pende" para o mesmo lado.
  const cx = (x1 + x2) / 2 - (dy / len) * 10;
  const cy = (y1 + y2) / 2 + (dx / len) * 10;
  const tx = x2 + (dx / len) * 12;
  const ty = y2 + (dy / len) * 12 + 5;
  const on = useLit(n);
  return (
    <g>
      <path
        d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
        strokeWidth={0.9}
        className={`leader draw ${on ? "is-on" : ""}`}
        pathLength={1}
      />
      <circle cx={x1} cy={y1} r={1.7} fill="currentColor" stroke="none" className="late" />
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        stroke="none"
        className={`num late ${on ? "is-on" : ""}`}
      >
        {n}
      </text>
    </g>
  );
}

/** Hachura de corte (45°). */
export function Hatch({ id, gap = 5 }: { id: string; gap?: number }) {
  return (
    <pattern
      id={id}
      width={gap}
      height={gap}
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <line x1={0} y1={0} x2={0} y2={gap} stroke="currentColor" strokeWidth={0.8} />
    </pattern>
  );
}

/** Traço-ponto de eixo de simetria. */
export const AXIS = "14 4 2 4";
/** Tracejado de linha oculta / alternativa descartada. */
export const HIDDEN = "5 4";
