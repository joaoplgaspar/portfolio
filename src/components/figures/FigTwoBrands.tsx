"use client";

import type { ReactNode } from "react";
import { AXIS, Fig, Hatch, Leader, Part, useSafeId, type FigProps } from "./parts";
import { Note, Travel, useSeq, type Step } from "./sequence";

/**
 * FIG — Integral Médica / Darkness. Vista explodida da plataforma.
 *
 * 10 vitrine Integral Médica · 12 vitrine Darkness · 14 "Minha conta" refeita
 * 16 extensões de checkout · 18 Shopify Functions (promoções)
 * 20 custom apps · 22 um admin Shopify para as duas marcas
 *
 * A vista começa montada e abre camada por camada; cada passo acende a peça
 * da vez e anota o que foi construído nela.
 */

export const STEPS: Step[] = [
  {
    dur: 3.2,
    on: [10, 12],
    caption: {
      en: "Two supplement brands, two headless storefronts (10, 12), one repository, one cart shared between them.",
      pt: "Duas marcas de suplementação, duas vitrines headless (10, 12), um repositório, um carrinho compartilhado.",
    },
  },
  {
    dur: 3.2,
    on: [22],
    caption: {
      en: "Underneath, one Shopify admin (22) serves both. Most of what follows comes from that single fact.",
      pt: "Por baixo, um admin Shopify (22) serve as duas. Quase tudo o que vem depois nasce desse fato.",
    },
  },
  {
    dur: 3.8,
    on: [14],
    caption: {
      en: "The native account area is one per admin: same logo and styling for both brands. Rebuilt from scratch (14), per brand, with a “My benefits” tab tied to loyalty.",
      pt: "A conta nativa é uma por admin: mesmo logo e estilo para as duas marcas. Refeita do zero (14), por marca, com a aba “Meus benefícios” ligada à fidelidade.",
    },
  },
  {
    dur: 3,
    on: [16],
    caption: {
      en: "Checkout extensions (16) bring information and function into the most sensitive step of the purchase.",
      pt: "Extensões de checkout (16) levam informação e função para a etapa mais sensível da compra.",
    },
  },
  {
    dur: 3.4,
    on: [18],
    caption: {
      en: "Promotions run as Shopify Functions (18), on Shopify's side. A discount that only exists in the front-end vanishes at checkout.",
      pt: "Promoções rodam como Shopify Functions (18), do lado do Shopify. Desconto que só existe no front some no checkout.",
    },
  },
  {
    dur: 3.4,
    on: [20],
    caption: {
      en: "Custom apps (20) for what no marketplace app does, like an employee discount computed from the compare-at price.",
      pt: "Custom apps (20) para o que nenhum app de prateleira faz, como o desconto de funcionário sobre o preço comparado.",
    },
  },
  {
    dur: 3.4,
    on: [10, 14, 16, 18, 22],
    caption: {
      en: "An order goes down through every layer, then the stack closes again.",
      pt: "Um pedido desce por todas as camadas, e a pilha se fecha de novo.",
    },
  },
];

/** Placa isométrica 2:1 — face superior + duas faces laterais. */
function Plate({
  cx,
  cy,
  a,
  b,
  t,
  hatch,
  children,
}: {
  cx: number;
  cy: number;
  a: number;
  b: number;
  t: number;
  hatch?: string;
  children?: ReactNode;
}) {
  const L = [cx - a, cy];
  const T = [cx, cy - b];
  const R = [cx + a, cy];
  const B = [cx, cy + b];
  const p = (pts: number[][]) => pts.map((q) => q.join(",")).join(" ");
  const left = [L, B, [B[0], B[1] + t], [L[0], L[1] + t]];
  const right = [B, R, [R[0], R[1] + t], [B[0], B[1] + t]];
  return (
    <g>
      <polygon points={p(left)} fill={hatch ? `url(#${hatch})` : "var(--shade)"} className="draw" pathLength={1} />
      <polygon points={p(right)} fill="var(--shade-2)" className="draw" pathLength={1} />
      <polygon points={p([L, T, R, B])} fill="var(--bg)" className="draw" pathLength={1} />
      {children}
    </g>
  );
}

/** Losango interno: o "conteúdo" da camada, em escala 0.55. */
function Inset({ cx, cy, a, b, dashed }: { cx: number; cy: number; a: number; b: number; dashed?: boolean }) {
  const s = 0.55;
  return (
    <polygon
      points={`${cx - a * s},${cy} ${cx},${cy - b * s} ${cx + a * s},${cy} ${cx},${cy + b * s}`}
      strokeDasharray={dashed ? "4 3" : undefined}
      strokeWidth={0.9}
      className={dashed ? "late" : "draw"}
      pathLength={dashed ? undefined : 1}
    />
  );
}

const LAYERS = [
  { n: 20, cy: 352, lift: 10, note: "app · compareAt × 0.5" },
  { n: 18, cy: 292, lift: 22, note: "Function · discount" },
  { n: 16, cy: 232, lift: 34, note: "checkout UI extension" },
  { n: 14, cy: 172, lift: 46, note: "/account · per brand" },
];
const NOTE_STEP: Record<number, number> = { 14: 2, 16: 3, 18: 4, 20: 5 };

export default function FigTwoBrands({ lit, draw = true, title }: FigProps) {
  const hatch = useSafeId("h");
  const { step } = useSeq();
  // Explodida do passo 1 ao 6; montada no primeiro passo e no fim do último.
  const open = step >= 1;

  return (
    <Fig title={title} draw={draw} lit={lit}>
      <defs>
        <Hatch id={hatch} gap={5} />
      </defs>

      <Part n={22}>
        <Plate cx={400} cy={420} a={200} b={62} t={18} hatch={hatch}>
          <Inset cx={400} cy={420} a={200} b={62} />
        </Plate>
      </Part>
      <Leader n={22} at={[600, 428]} to={[648, 452]} />
      <Note at={[1]} x={600} y={478}>1 admin → 2 brands</Note>

      {LAYERS.map((l) => (
        <g key={l.n} className="slide" style={{ transform: `translateY(${open ? -l.lift : 0}px)` }}>
          <Part n={l.n}>
            <Plate cx={400} cy={l.cy} a={170} b={52} t={7}>
              <Inset cx={400} cy={l.cy} a={170} b={52} dashed={l.n === 16 || l.n === 20} />
              {l.n === 14 &&
                [0, 1, 2].map((i) => (
                  <line
                    key={i}
                    x1={340 + i * 24}
                    y1={l.cy - 8 + i * 12}
                    x2={372 + i * 24}
                    y2={l.cy + 8 + i * 12}
                    strokeWidth={0.9}
                    className="draw"
                    pathLength={1}
                  />
                ))}
              {l.n === 18 &&
                [-40, 0, 40].map((dx) => <circle key={dx} cx={400 + dx} cy={l.cy} r={4} className="draw" pathLength={1} />)}
            </Plate>
          </Part>
          <Leader n={l.n} at={[570, l.cy + 3]} to={[622, l.cy - 14]} />
          <Note at={[NOTE_STEP[l.n]]} x={652} y={l.cy + 12} signal>
            {l.note}
          </Note>
        </g>
      ))}

      <g className="slide" style={{ transform: `translateY(${open ? -60 : 0}px)` }}>
        <Part n={10}>
          <Plate cx={318} cy={96} a={86} b={27} t={7} />
        </Part>
        <Part n={12}>
          <Plate cx={482} cy={96} a={86} b={27} t={7} hatch={hatch} />
        </Part>
        <Leader n={10} at={[232, 98]} to={[190, 76]} />
        <Leader n={12} at={[568, 98]} to={[612, 76]} />
      </g>

      <line x1={400} y1={20} x2={400} y2={486} strokeDasharray={AXIS} strokeWidth={0.9} className="late" />

      <Travel step={6} d="M400 40 L400 420" to={0.8} r={5} signal />
    </Fig>
  );
}
