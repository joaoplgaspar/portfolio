"use client";

import { AXIS, Fig, HIDDEN, Hatch, Leader, Part, useSafeId, type FigProps } from "./parts";
import { Note, Show, Travel, useSeq, type Step } from "./sequence";

/**
 * FIG — Roland / Boss. Duas vitrines, dois domínios, um carrinho.
 *
 * 10 store.roland.com.br · 12 store.bossmusic.com.br · 14 carrinho único
 * 16 Storefront API · 18 uma loja Shopify · 20 checkout único
 * 22 fronteira de domínio · 24 sincronização (descartada) · 26 linha otimista
 */

export const STEPS: Step[] = [
  {
    dur: 3.4,
    on: [10, 26],
    caption: {
      en: "Add to cart on Roland. The line shows up in the bag at once, dashed: optimistic, not confirmed yet.",
      pt: "Adicionar ao carrinho na Roland. A linha aparece na sacola na hora, tracejada: otimista, ainda sem confirmação.",
    },
  },
  {
    dur: 2.8,
    on: [10, 14],
    caption: {
      en: "The request goes to the shared cart (14), not to a cart the Roland storefront owns.",
      pt: "O pedido vai para o carrinho compartilhado (14), não para um carrinho da vitrine Roland.",
    },
  },
  {
    dur: 2.8,
    on: [14, 16, 18],
    caption: {
      en: "One Storefront API mutation (16) against the one store underneath both brands (18).",
      pt: "Uma mutação na Storefront API (16) contra a única loja por baixo das duas marcas (18).",
    },
  },
  {
    dur: 3,
    on: [10, 26],
    caption: {
      en: "The response settles it: dashed turns solid. Had it failed, the optimistic line would roll back.",
      pt: "A resposta decide: o tracejado vira sólido. Se falhasse, a linha otimista seria desfeita.",
    },
  },
  {
    dur: 3.2,
    on: [22],
    caption: {
      en: "The visitor crosses to bossmusic.com.br. The session stays behind at the domain boundary (22).",
      pt: "A pessoa atravessa para bossmusic.com.br. A sessão fica para trás, na fronteira de domínio (22).",
    },
  },
  {
    dur: 2.8,
    on: [12, 14],
    caption: {
      en: "Boss resolves the same cart (14). The bag already holds the JUNO-D6.",
      pt: "A Boss resolve o mesmo carrinho (14). A sacola já tem o JUNO-D6.",
    },
  },
  {
    dur: 3.2,
    on: [12, 14, 20],
    caption: {
      en: "A DS-1 added on Boss joins it. Two brands, two lines, one checkout (20).",
      pt: "Um DS-1 adicionado na Boss entra junto. Duas marcas, duas linhas, um checkout (20).",
    },
  },
  {
    dur: 3.6,
    on: [24],
    caption: {
      en: "Rejected (24): two carts mirrored by sync. Two writes at once and the last one silently wins.",
      pt: "Descartado (24): dois carrinhos espelhados por sincronização. Duas escritas ao mesmo tempo e a última vence em silêncio.",
    },
  },
];

const OPTIMISTIC = "M200 209 C300 209 300 110 284 58";
const CROSS = "M300 200 C360 262 440 262 500 200";

function Window({
  x,
  domain,
  hatch,
  count,
  ghost,
  added,
}: {
  x: number;
  domain: string;
  hatch: string;
  count: number;
  ghost: boolean;
  added: boolean;
}) {
  return (
    <g>
      <rect x={x} y={36} width={288} height={186} className="draw" pathLength={1} />
      <line x1={x} y1={62} x2={x + 288} y2={62} className="draw" pathLength={1} />
      <text x={x + 14} y={53} className="code late" stroke="none">
        {domain}
      </text>
      {/* sacola + contagem */}
      <path
        d={`M${x + 262} ${45} h14 l-2 11 h-10 z M${x + 265} ${45} q4 -7 8 0`}
        className="draw"
        pathLength={1}
        strokeWidth={1}
      />
      <text
        key={count}
        x={x + 252}
        y={54}
        textAnchor="end"
        className="code"
        stroke="none"
        style={{ fill: "var(--fg)", animation: "fadeIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        {count}
      </text>
      <Part n={26}>
        <Show at={ghost ? [0, 1, 2, 3, 4, 5, 6, 7] : []}>
          <rect x={x + 242} y={43} width={14} height={14} strokeDasharray="2 2" strokeWidth={1} />
        </Show>
      </Part>
      {/* banner em corte */}
      <rect x={x + 14} y={74} width={260} height={54} fill={`url(#${hatch})`} className="late" stroke="none" />
      <rect x={x + 14} y={74} width={260} height={54} className="draw" pathLength={1} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x + 14 + i * 90} y={140} width={80} height={40} className="draw" pathLength={1} />
          <line x1={x + 14 + i * 90} y1={190} x2={x + 64 + i * 90} y2={190} className="draw" pathLength={1} />
          <line x1={x + 14 + i * 90} y1={197} x2={x + 44 + i * 90} y2={197} className="draw" pathLength={1} />
        </g>
      ))}
      {/* botão adicionar do produto do meio: cheio depois do clique */}
      <rect
        x={x + 104}
        y={204}
        width={40}
        height={10}
        className="draw"
        pathLength={1}
        style={{ fill: added ? "var(--fg)" : "transparent", transition: "fill 700ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
    </g>
  );
}

export default function FigSharedCart({ lit, draw = true, title }: FigProps) {
  const hatch = useSafeId("h");
  const { step } = useSeq();
  const s = step < 0 ? 7 : step;

  const rolandCount = s >= 6 ? 2 : 1;
  const bossCount = s >= 6 ? 2 : s >= 5 ? 1 : 0;
  const lines = s >= 6 ? 2 : s >= 3 ? 1 : 0;

  const toCartA = "M160 214 C160 280 318 276 352 318";
  const toCartB = "M620 214 C620 280 482 276 448 318";
  const out = "M460 341 L560 341";

  return (
    <Fig title={title} draw={draw} lit={lit}>
      <defs>
        <Hatch id={hatch} gap={6} />
      </defs>

      <Part n={10}>
        <Window x={36} domain="store.roland.com.br" hatch={hatch} count={rolandCount} ghost={s <= 2} added={s <= 3} />
      </Part>
      <Part n={12}>
        <Window x={476} domain="store.bossmusic.com.br" hatch={hatch} count={bossCount} ghost={false} added={s === 6} />
      </Part>

      <Part n={22}>
        <line x1={400} y1={18} x2={400} y2={296} strokeDasharray={AXIS} strokeWidth={0.9} className="late" />
      </Part>

      <Part n={24}>
        <g className="late" strokeWidth={1}>
          <line x1={330} y1={130} x2={470} y2={130} strokeDasharray={HIDDEN} />
          <path d="M338 125 l-8 5 l8 5 M462 125 l8 5 l-8 5" />
          <path d="M393 123 l14 14 M407 123 l-14 14" strokeWidth={1.4} />
        </g>
      </Part>

      <path d={toCartA} className="draw" pathLength={1} />
      <path d={toCartB} className="draw" pathLength={1} />

      <Part n={14}>
        <rect x={340} y={318} width={120} height={46} strokeWidth={1.6} className="draw" pathLength={1} />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={356 + i * 32}
            y={331}
            width={24}
            height={20}
            className="draw"
            pathLength={1}
            style={{ fill: i < lines ? "var(--fg)" : "transparent", transition: "fill 700ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        ))}
        <Show at={[1, 2]}>
          <rect x={352} y={327} width={32} height={28} strokeDasharray="3 2" strokeWidth={1} />
        </Show>
      </Part>

      <line x1={400} y1={364} x2={400} y2={396} className="draw" pathLength={1} />
      <Part n={16}>
        <rect x={346} y={396} width={108} height={32} className="draw" pathLength={1} />
        <text x={400} y={416} textAnchor="middle" className="code late" stroke="none">
          Storefront API
        </text>
      </Part>
      <line x1={400} y1={428} x2={400} y2={447} className="draw" pathLength={1} />
      <Part n={18}>
        <ellipse cx={400} cy={456} rx={54} ry={9} className="draw" pathLength={1} />
        <path d="M346 456 V484 A54 9 0 0 0 454 484 V456" className="draw" pathLength={1} />
      </Part>

      <path d={out} className="draw" pathLength={1} />
      <path d="M552 336 l8 5 l-8 5" className="late" />
      <Part n={20}>
        <rect x={560} y={322} width={110} height={38} className="draw" pathLength={1} />
        <path d="M600 341 l7 7 l14 -14" strokeWidth={1.6} className="draw" pathLength={1} />
      </Part>

      {/* trânsito, passo a passo */}
      {/* Todo trajeto segue uma linha desenhada. Os que só existem num passo
          (a linha otimista, a travessia) aparecem tracejados junto com ele. */}
      <Show at={[0]}>
        <path d={OPTIMISTIC} strokeDasharray={HIDDEN} strokeWidth={1} />
      </Show>
      <Show at={[4]}>
        <path d={CROSS} strokeDasharray={HIDDEN} strokeWidth={1} />
        <path d="M500 200 l-11 3 M500 200 l-3 11" strokeWidth={1} />
      </Show>
      <Travel step={0} d={OPTIMISTIC} from={0.05} to={0.75} />
      <Travel step={1} d={toCartA} />
      <Travel step={2} d="M400 364 L400 452" />
      <Travel step={3} d="M400 452 L400 364" to={0.42} signal />
      <Travel step={3} d={toCartA} from={0.48} reverse signal />
      <Travel step={4} d={CROSS} r={4.4} />
      <Travel step={5} d={toCartB} reverse />
      <Travel step={6} d={toCartB} to={0.5} />
      <Travel step={6} d={out} from={0.55} to={0.95} signal />
      <Travel step={7} d="M330 130 L400 130" signal />
      <Travel step={7} d="M470 130 L400 130" signal />

      <Note at={[0]} x={324} y={28} anchor="end">optimistic line · pending</Note>
      <Note at={[2]} x={462} y={476}>cartLinesAdd(JUNO-D6)</Note>
      <Note at={[3]} x={324} y={28} anchor="end" signal>200 → line confirmed</Note>
      <Note at={[4]} x={408} y={284}>session: roland only</Note>
      <Note at={[5]} x={476} y={28}>same cart · 1 line</Note>
      <Note at={[6]} x={615} y={380} anchor="middle">1 checkout · 2 brands</Note>
      <Note at={[7]} x={400} y={112} anchor="middle" signal>last write wins</Note>

      <Leader n={10} at={[92, 222]} to={[70, 262]} />
      <Leader n={12} at={[708, 222]} to={[730, 262]} />
      <Leader n={14} at={[340, 352]} to={[296, 376]} />
      <Leader n={16} at={[454, 420]} to={[498, 440]} />
      <Leader n={18} at={[346, 474]} to={[300, 488]} />
      <Leader n={20} at={[670, 330]} to={[712, 306]} />
      <Leader n={22} at={[400, 30]} to={[436, 14]} />
      <Leader n={24} at={[436, 130]} to={[446, 96]} />
      <Leader n={26} at={[36 + 242, 57]} to={[258, 92]} />
    </Fig>
  );
}
