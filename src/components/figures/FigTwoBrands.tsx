"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { AXIS, Fig, Hatch, Leader, Part, useSafeId, type FigProps } from "./parts";
import { Note, Show, Travel, useSeq, type Step } from "./sequence";

/**
 * FIG — Integralmédica / Darkness. Vista explodida da plataforma.
 *
 * 10 vitrine Integralmédica · 12 vitrine Darkness · 14 "Minha conta" refeita
 * 16 extensões de checkout · 18 Shopify Functions (promoções)
 * 20 custom apps · 22 um admin Shopify para as duas marcas
 *
 * Três atos: o problema (0), a pilha abrindo camada por camada (1–7), o
 * atalho descartado (8) e o resultado (9). A vista começa montada, abre do
 * passo 2 ao 8 e fecha de novo no fim.
 */

export const STEPS: Step[] = [
  {
    dur: 5.2,
    act: "problem",
    on: [10, 12, 22],
    title: { en: "Problem", pt: "Problema" },
    plain: {
      en: "Integralmédica and Darkness are two supplement brands run from one Shopify admin. Out of the box, that means the same account page for both, and promotions Shopify can't do.",
      pt: "Integralmédica e Darkness são duas marcas de suplemento num admin Shopify só. De fábrica, isso quer dizer a mesma página de conta para as duas, e promoções que o Shopify não faz.",
    },
    caption: {
      en: "One admin (22) behind two storefronts (10, 12): one native account area, one look, and promotion rules the platform doesn't ship.",
      pt: "Um admin (22) por trás de duas vitrines (10, 12): uma conta nativa, um visual só e regras de promoção que a plataforma não tem.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [10, 12],
    title: { en: "Two stores", pt: "Duas lojas" },
    plain: {
      en: "Two stores, each with its own look, built headless on top of that admin and sharing one cart.",
      pt: "Duas lojas, cada uma com a sua cara, feitas em headless sobre esse admin e com um carrinho em comum.",
    },
    caption: {
      en: "Two supplement brands, two headless storefronts (10, 12), one repository, one cart shared between them.",
      pt: "Duas marcas de suplementação, duas vitrines headless (10, 12), um repositório, um carrinho compartilhado.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [22],
    title: { en: "One admin", pt: "Um admin" },
    plain: {
      en: "Underneath, one Shopify admin runs both brands. Almost everything that follows comes from that.",
      pt: "Por baixo, um admin Shopify cuida das duas marcas. Quase tudo o que vem depois nasce disso.",
    },
    caption: {
      en: "Underneath, one Shopify admin (22) serves both. Most of what follows comes from that single fact.",
      pt: "Por baixo, um admin Shopify (22) serve as duas. Quase tudo o que vem depois nasce desse fato.",
    },
  },
  {
    dur: 4.2,
    act: "solution",
    on: [14],
    title: { en: "Account", pt: "Conta" },
    plain: {
      en: "Shopify gives one account page per admin, so both brands would look the same. I rebuilt it from scratch for each brand, with a loyalty tab.",
      pt: "O Shopify dá uma página de conta por admin, então as duas marcas ficariam iguais. Refiz do zero para cada marca, com uma aba de fidelidade.",
    },
    caption: {
      en: "There's one native account area per admin: same logo and styling for both brands. Rebuilt from scratch (14), per brand, with a “My benefits” tab tied to the loyalty program.",
      pt: "A conta nativa é uma por admin: mesmo logo e estilo para as duas marcas. Refeita do zero (14), por marca, com a aba “Meus benefícios” ligada à fidelidade.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [16],
    title: { en: "Checkout", pt: "Checkout" },
    plain: {
      en: "Extra blocks inside checkout show shoppers what they need right when they pay.",
      pt: "Blocos a mais dentro do checkout mostram o que a pessoa precisa bem na hora de pagar.",
    },
    caption: {
      en: "Checkout extensions (16) bring information and features into the most sensitive step of the purchase.",
      pt: "Extensões de checkout (16) levam informação e função para a etapa mais sensível da compra.",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [18],
    title: { en: "Promotions", pt: "Promoções" },
    plain: {
      en: "Promotions run inside Shopify itself, so the discount a shopper sees in the store still holds at checkout.",
      pt: "As promoções rodam dentro do próprio Shopify, então o desconto que a pessoa vê na loja continua valendo no checkout.",
    },
    caption: {
      en: "Promotions run as Shopify Functions (18), on Shopify's side. A discount that only exists in the front-end vanishes at checkout.",
      pt: "Promoções rodam como Shopify Functions (18), do lado do Shopify. Desconto que só existe no front some no checkout.",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [20],
    title: { en: "Apps", pt: "Apps" },
    plain: {
      en: "Custom apps for what no App Store app does, like a staff discount taken off the original price.",
      pt: "Apps próprios para o que nenhum app da loja de apps faz, como o desconto de funcionário sobre o preço original.",
    },
    caption: {
      en: "Custom apps (20) for what no marketplace app does, like an employee discount computed from the compare-at price.",
      pt: "Custom apps (20) para o que nenhum app de prateleira faz, como o desconto de funcionário sobre o preço comparado.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [10, 14, 16, 18, 22],
    title: { en: "Order", pt: "Pedido" },
    plain: {
      en: "An order passes through every layer and comes out right on either brand.",
      pt: "Um pedido passa por todas as camadas e sai certo em qualquer uma das marcas.",
    },
    caption: {
      en: "An order goes down through every layer, then the stack closes again.",
      pt: "Um pedido desce por todas as camadas, e a pilha se fecha de novo.",
    },
  },
  {
    dur: 4.8,
    act: "rejected",
    on: [10, 16],
    title: { en: "Rejected", pt: "Descartado" },
    plain: {
      en: "The shortcut I ruled out: working out discounts in the store's front end. The price looks right on the page, then changes at checkout.",
      pt: "O atalho que descartei: calcular o desconto na vitrine. O preço aparece certo na página e muda no checkout.",
    },
    caption: {
      en: "Rejected: a discount computed in the storefront. It never reaches checkout (16), so the shopper sees one price and pays another.",
      pt: "Descartado: desconto calculado na vitrine. Ele não chega ao checkout (16), e a pessoa vê um preço e paga outro.",
    },
  },
  {
    dur: 4.4,
    act: "result",
    on: [10, 12, 14, 16, 18, 20, 22],
    title: { en: "Result", pt: "Resultado" },
    plain: {
      en: "Two brands, each with its own account, checkout and promotions, on a single admin.",
      pt: "Duas marcas, cada uma com a sua conta, checkout e promoções, num admin só.",
    },
    caption: {
      en: "Per-brand account (14), checkout extensions (16), Functions (18) and apps (20) on one admin (22).",
      pt: "Conta por marca (14), extensões de checkout (16), Functions (18) e apps (20) num admin só (22).",
    },
  },
];

const T = {
  en: {
    im: "Integralmédica",
    dk: "Darkness",
    admin: "one Shopify admin",
    names: { 14: "account page", 16: "checkout blocks", 18: "promotions", 20: "custom apps" } as Record<number, string>,
    plainNote: { 14: "own look per brand", 16: "info when paying", 18: "holds at checkout", 20: "staff discount" } as Record<number, string>,
    problem: "2 brands · 1 admin · 1 look",
    adminNote: "1 admin → 2 brands",
    order: "order",
    gone: "price changes at checkout",
    result: "2 brands · 1 admin",
  },
  pt: {
    im: "Integralmédica",
    dk: "Darkness",
    admin: "um admin Shopify",
    names: { 14: "minha conta", 16: "blocos no checkout", 18: "promoções", 20: "apps próprios" } as Record<number, string>,
    plainNote: { 14: "cara própria por marca", 16: "info na hora de pagar", 18: "vale no checkout", 20: "desconto de funcionário" } as Record<number, string>,
    problem: "2 marcas · 1 admin · a mesma cara",
    adminNote: "1 admin → 2 marcas",
    order: "pedido",
    gone: "o preço muda no checkout",
    result: "2 marcas · 1 admin",
  },
};

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
const NOTE_STEP: Record<number, number> = { 14: 3, 16: 4, 18: 5, 20: 6 };

export default function FigTwoBrands({ lit, draw = true, title }: FigProps) {
  const hatch = useSafeId("h");
  const { step } = useSeq();
  const t = T[useLocale() === "pt" ? "pt" : "en"];
  const k = step < 0 ? STEPS.length - 1 : step;
  // Montada no problema, na apresentação e no resultado; aberta no meio.
  const open = k >= 2 && k <= 8;

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
      <Leader n={22} at={[596, 430]} to={[626, 458]} label={t.admin} />
      <Note at={[2]} x={600} y={482} mode="tech">1 admin → 2 brands</Note>
      <Note at={[2]} x={200} y={482} anchor="middle" mode="plain">{t.adminNote}</Note>

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
          <Leader n={l.n} at={[570, l.cy + 3]} to={[622, l.cy - 14]} label={t.names[l.n]} />
          <Note at={[NOTE_STEP[l.n]]} x={652} y={l.cy + 12} signal mode="tech">
            {l.note}
          </Note>
          <Note at={[NOTE_STEP[l.n]]} x={222} y={l.cy + 6} anchor="end" signal mode="plain">
            {t.plainNote[l.n]}
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
        <Leader n={10} at={[232, 98]} to={[190, 76]} label={t.im} />
        <Leader n={12} at={[568, 98]} to={[612, 76]} label={t.dk} />
      </g>

      <line x1={400} y1={20} x2={400} y2={486} strokeDasharray={AXIS} strokeWidth={0.9} className="late" />

      {/* O atalho descartado: o desconto sai da vitrine e não chega ao checkout. */}
      <Show at={[8]}>
        <path d="M390 192 l20 20 M410 192 l-20 20" strokeWidth={1.8} style={{ stroke: "var(--accent)" }} />
      </Show>

      <Travel step={7} d="M400 40 L400 420" to={0.8} signal tag={t.order} />
      <Travel step={8} d="M400 40 L400 196" to={0.92} signal tag="−20%" />

      <Note at={[0]} x={400} y={30} anchor="middle" signal mode="plain">{t.problem}</Note>
      <Note at={[0]} x={400} y={30} anchor="middle" signal mode="tech">1 admin · 1 /account · no native promo rule</Note>
      <Note at={[8]} x={222} y={206} anchor="end" signal mode="plain">{t.gone}</Note>
      <Note at={[8]} x={222} y={206} anchor="end" signal mode="tech">client-side discount ≠ checkout</Note>
      <Note at={[9]} x={400} y={30} anchor="middle" signal mode="plain">{t.result}</Note>
    </Fig>
  );
}
