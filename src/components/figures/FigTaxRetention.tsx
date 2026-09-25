"use client";

import { Fig, HIDDEN, Leader, Part, type FigProps } from "./parts";
import { Note, Show, Travel, useSeq, type Step } from "./sequence";

/**
 * FIG — HSM / Singularity. A retenção na fonte atravessando o checkout.
 *
 * 10 checkout · 12 campo nativo de CPF/CNPJ · 14 extensão de checkout
 * 16 metafield do carrinho · 18 Function de desconto · 20 faixas e alíquotas
 * (JSON em metafield) · 22 linha de retenção · 24 Function de validação
 * 26 formulário no admin
 *
 * Nenhuma alíquota ou faixa real aparece aqui: a regra do cliente é dele.
 * A figura mostra o caminho do dado, que é o que foi construído.
 */

export const STEPS: Step[] = [
  {
    dur: 3,
    on: [10, 12],
    caption: {
      en: "A company buys a course. Its CNPJ goes into Shopify's own tax ID field at checkout (12).",
      pt: "Uma empresa compra um curso. O CNPJ entra no campo nativo de documento do checkout (12).",
    },
  },
  {
    dur: 3,
    on: [12, 24],
    caption: {
      en: "A validation Function (24) checks the digits. A malformed CNPJ stops the checkout before payment.",
      pt: "Uma Function de validação (24) confere os dígitos. CNPJ malformado trava o checkout antes do pagamento.",
    },
  },
  {
    dur: 3.4,
    on: [12, 14, 16],
    caption: {
      en: "The discount Function can't read that field live. A checkout extension (14) copies it into a cart metafield (16).",
      pt: "A Function de desconto não enxerga esse campo ao vivo. Uma extensão de checkout (14) copia o valor para um metafield do carrinho (16).",
    },
  },
  {
    dur: 2.8,
    on: [16, 18],
    caption: {
      en: "Every metafield write re-runs the discount Function (18).",
      pt: "Cada escrita no metafield roda de novo a Function de desconto (18).",
    },
  },
  {
    dur: 3.2,
    on: [18, 20, 26],
    caption: {
      en: "It reads value tiers and rates from a JSON metafield (20), edited in an admin form (26). Changing a rate needs no deploy.",
      pt: "Ela lê faixas de valor e alíquotas de um metafield em JSON (20), editado num formulário no admin (26). Mudar alíquota não pede deploy.",
    },
  },
  {
    dur: 3.4,
    on: [18, 22],
    caption: {
      en: "The Function returns a fixed amount in integer cents. The checkout shows a withholding line (22) and the total drops.",
      pt: "A Function devolve um valor fixo em centavos inteiros. O checkout mostra a linha de retenção (22) e o total cai.",
    },
  },
  {
    dur: 3.4,
    on: [14, 22],
    caption: {
      en: "The extension repeats the same arithmetic for the per-tax breakdown. Both numbers agree to the cent.",
      pt: "A extensão repete a mesma conta para o detalhamento por tributo. Os dois números batem no centavo.",
    },
  },
];

const EASE = "700ms cubic-bezier(0.16, 1, 0.3, 1)";

// Trajetos: todo pacote anda sobre uma linha desenhada.
const TO_VALID = "M300 104 C350 104 360 92 400 92";
const TO_EXT = "M300 112 C350 112 360 182 400 182";
const TO_META = "M475 204 L475 250";
const TO_FN = "M550 270 L600 270";
const ADMIN_UP = "M680 430 L680 305";
const TO_LINE = "M600 292 C520 336 400 322 300 322";
const BREAKDOWN = "M400 196 C340 232 330 300 300 330";

function Box({ x, y, w, h, label, strong }: { x: number; y: number; w: number; h: number; label: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} strokeWidth={strong ? 1.6 : 1.25} className="draw" pathLength={1} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="code late" stroke="none">
        {label}
      </text>
    </g>
  );
}

export default function FigTaxRetention({ lit, draw = true, title }: FigProps) {
  const { step } = useSeq();
  const s = step < 0 ? 6 : step;
  const withheld = s >= 5;

  return (
    <Fig title={title} draw={draw} lit={lit}>
      {/* 10 · checkout */}
      <Part n={10}>
        <rect x={40} y={40} width={280} height={420} className="draw" pathLength={1} />
        <line x1={40} y1={66} x2={320} y2={66} className="draw" pathLength={1} />
        <text x={54} y={58} className="code late" stroke="none">
          checkout
        </text>
        {[150, 200].map((y) => (
          <g key={y}>
            <rect x={60} y={y} width={36} height={36} className="draw" pathLength={1} />
            <line x1={108} y1={y + 12} x2={220} y2={y + 12} className="draw" pathLength={1} />
            <line x1={108} y1={y + 24} x2={170} y2={y + 24} className="draw" pathLength={1} />
            <line x1={262} y1={y + 12} x2={300} y2={y + 12} className="draw" pathLength={1} />
          </g>
        ))}
        <line x1={60} y1={272} x2={300} y2={272} strokeWidth={0.9} className="draw" pathLength={1} />
        <text x={64} y={294} className="code late" stroke="none">
          subtotal
        </text>
        <line x1={250} y1={290} x2={300} y2={290} className="draw" pathLength={1} />
        <line x1={60} y1={342} x2={300} y2={342} strokeWidth={0.9} className="draw" pathLength={1} />
        <text x={64} y={366} className="code late" stroke="none">
          total
        </text>
        {/* O total encolhe quando a retenção entra: escala a partir da ponta direita. */}
        <line
          x1={214}
          y1={362}
          x2={300}
          y2={362}
          strokeWidth={3}
          style={{
            transform: `scaleX(${withheld ? 0.78 : 1})`,
            transformBox: "fill-box",
            transformOrigin: "right center",
            transition: `transform ${EASE}`,
          }}
        />
      </Part>

      {/* 12 · campo nativo de documento */}
      <Part n={12}>
        <rect x={60} y={92} width={240} height={34} className="draw" pathLength={1} />
        <text x={72} y={113} className="code late" stroke="none">
          11.222.333/0001-81
        </text>
        <Show at={[1, 2, 3, 4, 5, 6]}>
          <path d="M276 109 l5 5 l10 -10" strokeWidth={1.6} />
        </Show>
      </Part>

      {/* 22 · linha de retenção: só existe depois que a Function responde */}
      <Part n={22}>
        <g style={{ opacity: withheld ? 1 : 0, transition: `opacity ${EASE}` }}>
          <text x={64} y={326} className="code" stroke="none">
            withholding at source
          </text>
          <line x1={262} y1={322} x2={300} y2={322} strokeWidth={1.6} />
          <line x1={250} y1={322} x2={256} y2={322} strokeWidth={1.6} />
        </g>
        <g style={{ opacity: withheld ? 0 : 1, transition: `opacity ${EASE}` }}>
          <line x1={60} y1={322} x2={300} y2={322} strokeDasharray={HIDDEN} strokeWidth={0.9} />
        </g>
      </Part>

      {/* conexões */}
      <path d={TO_VALID} className="draw" pathLength={1} />
      <path d={TO_EXT} className="draw" pathLength={1} />
      <path d={TO_META} className="draw" pathLength={1} />
      <path d={TO_FN} className="draw" pathLength={1} />
      <path d="M592 265 l8 5 l-8 5" className="late" />
      <path d={ADMIN_UP} className="draw" pathLength={1} />
      <path d={TO_LINE} className="draw" pathLength={1} />
      <path d="M309 318 l-9 4 l9 4" className="late" />
      <Show at={[6]}>
        <path d={BREAKDOWN} strokeDasharray={HIDDEN} strokeWidth={1} />
      </Show>

      <Part n={24}>
        <Box x={400} y={70} w={150} h={44} label="validation Function" />
      </Part>
      <Part n={14}>
        <Box x={400} y={160} w={150} h={44} label="checkout extension" />
      </Part>
      <Part n={16}>
        <Box x={400} y={250} w={150} h={40} label="cart metafield" />
      </Part>
      <Part n={18}>
        <Box x={600} y={235} w={160} h={70} label="discount Function" strong />
      </Part>
      <Part n={20}>
        {[350, 368, 386].map((y, i) => (
          <rect key={y} x={610} y={y} width={140 - i * 28} height={12} className="draw" pathLength={1} />
        ))}
      </Part>
      <Part n={26}>
        <Box x={600} y={430} w={160} h={34} label="admin settings" />
      </Part>

      {/* trânsito */}
      <Travel step={1} d={TO_VALID} />
      <Travel step={1} d={TO_VALID} from={0.55} reverse signal />
      <Travel step={2} d={TO_EXT} to={0.55} />
      <Travel step={2} d={TO_META} from={0.5} />
      <Travel step={3} d={TO_FN} signal />
      <Travel step={4} d={ADMIN_UP} />
      <Travel step={5} d={TO_LINE} from={0.1} to={0.9} signal r={4.4} />
      <Travel step={6} d={BREAKDOWN} from={0.1} />

      <Note at={[0]} x={180} y={84} anchor="middle">native tax ID field</Note>
      <Note at={[1]} x={475} y={60} anchor="middle" signal>check digits ✓</Note>
      <Note at={[2]} x={475} y={232} anchor="middle">metafield ← cnpj</Note>
      <Note at={[3]} x={575} y={256} anchor="middle">re-run</Note>
      <Note at={[4]} x={680} y={340} anchor="middle">tiers · rates (JSON)</Note>
      <Note at={[5]} x={452} y={350} anchor="middle" signal>fixed amount · integer cents</Note>
      <Note at={[6]} x={180} y={410} anchor="middle">breakdown: same math</Note>

      <Leader n={10} at={[120, 460]} to={[100, 484]} />
      <Leader n={12} at={[60, 100]} to={[30, 80]} />
      <Leader n={14} at={[550, 168]} to={[586, 146]} />
      <Leader n={16} at={[520, 290]} to={[540, 318]} />
      <Leader n={18} at={[760, 246]} to={[776, 222]} />
      <Leader n={20} at={[750, 356]} to={[774, 336]} />
      <Leader n={22} at={[60, 332]} to={[30, 318]} />
      <Leader n={24} at={[550, 78]} to={[586, 56]} />
      <Leader n={26} at={[760, 456]} to={[778, 478]} />
    </Fig>
  );
}
