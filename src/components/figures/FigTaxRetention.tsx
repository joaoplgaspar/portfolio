"use client";

import { useLocale } from "next-intl";
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
 *
 * Três atos: o problema (0), o caminho do CNPJ até a linha de retenção
 * (1–7), o atalho descartado (8) e o resultado (9). No modo simples as
 * caixas trocam o nome técnico por um nome de função ("confere o CNPJ").
 */

export const STEPS: Step[] = [
  {
    dur: 5.2,
    act: "problem",
    on: [10],
    title: { en: "Problem", pt: "Problema" },
    plain: {
      en: "When a company buys a course in Brazil, part of the federal taxes has to be withheld from the price. Shopify's checkout has no way to do that.",
      pt: "Quando uma empresa compra um curso no Brasil, parte dos tributos federais precisa ser retida do preço. O checkout do Shopify não tem como fazer isso.",
    },
    caption: {
      en: "Withholding at source lowers what a company pays. Shopify tax only adds to the total, and the checkout (10) has nowhere to subtract it.",
      pt: "A retenção na fonte reduz o que a empresa paga. O imposto do Shopify só soma ao total, e o checkout (10) não tem onde subtrair.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [10, 12],
    title: { en: "CNPJ", pt: "CNPJ" },
    plain: {
      en: "The company types its CNPJ, the Brazilian company tax ID, in Shopify's own field.",
      pt: "A empresa digita o CNPJ no campo do próprio Shopify.",
    },
    caption: {
      en: "A company buys a course. Its CNPJ goes into Shopify's own tax ID field at checkout (12).",
      pt: "Uma empresa compra um curso. O CNPJ entra no campo nativo de documento do checkout (12).",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [12, 24],
    title: { en: "Check", pt: "Confere" },
    plain: {
      en: "A rule inside Shopify checks the number. A wrong one stops the order before payment.",
      pt: "Uma regra dentro do Shopify confere o número. Se estiver errado, o pedido para antes do pagamento.",
    },
    caption: {
      en: "A validation Function (24) checks the digits. A malformed CNPJ stops the checkout before payment.",
      pt: "Uma Function de validação (24) confere os dígitos. CNPJ malformado trava o checkout antes do pagamento.",
    },
  },
  {
    dur: 4,
    act: "solution",
    on: [12, 14, 16],
    title: { en: "Copy", pt: "Copia" },
    plain: {
      en: "The tax rule can't see that field directly, so a block in the checkout copies the number onto the cart.",
      pt: "A regra do imposto não enxerga esse campo direto, então um bloco no checkout copia o número para o carrinho.",
    },
    caption: {
      en: "The discount Function can't read that field live. A checkout extension (14) copies it into a cart metafield (16).",
      pt: "A Function de desconto não enxerga esse campo ao vivo. Uma extensão de checkout (14) copia o valor para um metafield do carrinho (16).",
    },
  },
  {
    dur: 3.2,
    act: "solution",
    on: [16, 18],
    title: { en: "Recalculate", pt: "Recalcula" },
    plain: {
      en: "Every time that number changes, the tax rule runs again.",
      pt: "Toda vez que esse número muda, a regra do imposto roda de novo.",
    },
    caption: {
      en: "Every metafield write re-runs the discount Function (18).",
      pt: "Cada escrita no metafield roda de novo a Function de desconto (18).",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [18, 20, 26],
    title: { en: "Rates", pt: "Alíquotas" },
    plain: {
      en: "Rates and price ranges come from a form in the admin, so changing a rate doesn't need a developer.",
      pt: "Alíquotas e faixas de preço vêm de um formulário no admin, então mudar uma alíquota não precisa de desenvolvedor.",
    },
    caption: {
      en: "It reads value tiers and rates from a JSON metafield (20), edited in an admin form (26). Changing a rate needs no deploy.",
      pt: "Ela lê faixas de valor e alíquotas de um metafield em JSON (20), editado num formulário no admin (26). Mudar alíquota não pede deploy.",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [18, 22],
    title: { en: "Withheld", pt: "Retido" },
    plain: {
      en: "The rule returns an exact amount. A “tax withheld” line appears and the total drops.",
      pt: "A regra devolve um valor exato. Aparece a linha “imposto retido” e o total cai.",
    },
    caption: {
      en: "The Function returns a fixed amount in integer cents. The checkout shows a withholding line (22) and the total drops.",
      pt: "A Function devolve um valor fixo em centavos inteiros. O checkout mostra a linha de retenção (22) e o total cai.",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [14, 22],
    title: { en: "Breakdown", pt: "Detalhe" },
    plain: {
      en: "The checkout block shows the tax-by-tax breakdown with the same math, so both numbers match to the cent.",
      pt: "O bloco no checkout mostra o detalhe por tributo com a mesma conta, e os dois números batem no centavo.",
    },
    caption: {
      en: "The extension repeats the same arithmetic for the per-tax breakdown. Both numbers agree to the cent.",
      pt: "A extensão repete a mesma conta para o detalhamento por tributo. Os dois números batem no centavo.",
    },
  },
  {
    dur: 4.8,
    act: "rejected",
    on: [14, 18],
    title: { en: "Rejected", pt: "Descartado" },
    plain: {
      en: "The shortcut I ruled out: letting each side round its own decimals. On some totals they'd disagree by a cent, right in front of the buyer.",
      pt: "O atalho que descartei: deixar cada lado arredondar seus decimais. Em alguns totais eles discordariam em um centavo, na frente de quem compra.",
    },
    caption: {
      en: "Rejected: floating-point math on each side. The Function (18) and the extension (14) would disagree by a cent on some totals.",
      pt: "Descartado: ponto flutuante em cada lado. A Function (18) e a extensão (14) discordariam em um centavo em alguns totais.",
    },
  },
  {
    dur: 4.4,
    act: "result",
    on: [10, 22, 26],
    title: { en: "Result", pt: "Resultado" },
    plain: {
      en: "Companies pay the right amount at checkout, and the client edits the rates in the admin, with no deploy.",
      pt: "Empresas pagam o valor certo no checkout, e o cliente edita as alíquotas no admin, sem deploy.",
    },
    caption: {
      en: "Integer cents on both sides, rates as data (26), and a withholding line (22) the checkout total actually reflects.",
      pt: "Centavos inteiros nos dois lados, alíquotas como dado (26) e uma linha de retenção (22) que o total do checkout reflete de fato.",
    },
  },
];

const T = {
  en: {
    boxes: {
      24: "checks the CNPJ",
      14: "checkout block",
      16: "note on the cart",
      18: "tax rule",
      26: "rates in admin",
    } as Record<number, string>,
    withheld: "tax withheld",
    problem: "no way to withhold tax",
    field: "CNPJ field",
    checked: "number checked ✓",
    copied: "copied to the cart",
    rerun: "runs again",
    edited: "edited in the admin",
    exact: "exact amount",
    same: "same math, same cent",
    cent: "1 cent apart",
    result: "right amount · no deploy",
    rates: "rates",
  },
  pt: {
    boxes: {
      24: "confere o CNPJ",
      14: "bloco no checkout",
      16: "nota no carrinho",
      18: "regra do imposto",
      26: "alíquotas no admin",
    } as Record<number, string>,
    withheld: "imposto retido",
    problem: "sem como reter imposto",
    field: "campo do CNPJ",
    checked: "número conferido ✓",
    copied: "copiado no carrinho",
    rerun: "roda de novo",
    edited: "editado no admin",
    exact: "valor exato",
    same: "mesma conta, mesmo centavo",
    cent: "1 centavo de diferença",
    result: "valor certo · sem deploy",
    rates: "alíquotas",
  },
};

const EASE = "700ms cubic-bezier(0.16, 1, 0.3, 1)";

// Trajetos: todo pacote anda sobre uma linha desenhada.
const TO_VALID = "M300 104 C350 104 360 92 400 92";
const TO_EXT = "M300 112 C350 112 360 182 400 182";
const TO_META = "M475 204 L475 250";
const TO_FN = "M550 270 L600 270";
const ADMIN_UP = "M680 430 L680 305";
const TO_LINE = "M600 292 C520 336 400 322 300 322";
const BREAKDOWN = "M400 196 C340 232 330 300 300 330";

/** Caixa com nome técnico (modo técnico) ou nome de função (modo simples). */
function Box({
  x,
  y,
  w,
  h,
  label,
  plain,
  strong,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  plain?: string;
  strong?: boolean;
}) {
  const { mode } = useSeq();
  const named = !!plain && mode === "plain";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} strokeWidth={strong ? 1.6 : 1.25} className="draw" pathLength={1} />
      <text
        x={x + w / 2}
        y={y + h / 2 + (named ? 5 : 4)}
        textAnchor="middle"
        className={`late ${named ? "box-plain" : "code"}`}
        stroke="none"
      >
        {named ? plain : label}
      </text>
    </g>
  );
}

export default function FigTaxRetention({ lit, draw = true, title }: FigProps) {
  const { step, mode } = useSeq();
  const t = T[useLocale() === "pt" ? "pt" : "en"];
  const k = step < 0 ? STEPS.length - 1 : step;
  const withheld = k >= 6;

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
        <Show at={[2, 3, 4, 5, 6, 7, 8, 9]}>
          <path d="M276 109 l5 5 l10 -10" strokeWidth={1.6} />
        </Show>
      </Part>

      {/* 22 · linha de retenção: só existe depois que a Function responde */}
      <Part n={22}>
        <g style={{ opacity: withheld ? 1 : 0, transition: `opacity ${EASE}` }}>
          <text x={64} y={326} className={mode === "plain" ? "box-plain" : "code"} stroke="none">
            {mode === "plain" ? t.withheld : "withholding at source"}
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
      <Show at={[7, 8]}>
        <path d={BREAKDOWN} strokeDasharray={HIDDEN} strokeWidth={1} />
      </Show>

      <Part n={24}>
        <Box x={400} y={70} w={150} h={44} label="validation Function" plain={t.boxes[24]} />
      </Part>
      <Part n={14}>
        <Box x={400} y={160} w={150} h={44} label="checkout extension" plain={t.boxes[14]} />
      </Part>
      <Part n={16}>
        <Box x={400} y={250} w={150} h={40} label="cart metafield" plain={t.boxes[16]} />
      </Part>
      <Part n={18}>
        <Box x={600} y={235} w={160} h={70} label="discount Function" plain={t.boxes[18]} strong />
      </Part>
      <Part n={20}>
        {[350, 368, 386].map((y, i) => (
          <rect key={y} x={610} y={y} width={140 - i * 28} height={12} className="draw" pathLength={1} />
        ))}
      </Part>
      <Part n={26}>
        <Box x={600} y={430} w={160} h={34} label="admin settings" plain={t.boxes[26]} />
      </Part>

      {/* O problema: o total não tem de onde descer. */}
      <Show at={[0]}>
        <path d="M206 352 l20 20 M226 352 l-20 20" strokeWidth={1.8} style={{ stroke: "var(--accent)" }} />
      </Show>

      {/* trânsito: o que anda tem nome */}
      <Travel step={2} d={TO_VALID} tag="CNPJ" />
      <Travel step={2} d={TO_VALID} from={0.55} reverse signal tag="✓" />
      <Travel step={3} d={TO_EXT} to={0.55} tag="CNPJ" />
      <Travel step={3} d={TO_META} from={0.5} tag="CNPJ" />
      <Travel step={4} d={TO_FN} signal tag="↻" />
      <Travel step={5} d={ADMIN_UP} tag={t.rates} />
      <Travel step={6} d={TO_LINE} from={0.1} to={0.9} signal tag="−R$" />
      <Travel step={7} d={BREAKDOWN} from={0.1} tag="R$ = R$" />
      <Travel step={8} d={BREAKDOWN} from={0.1} signal tag="R$ ≠ R$" />

      {/* anotações: frase no modo simples, o que o código diz no técnico */}
      <Note at={[0]} x={180} y={410} anchor="middle" signal mode="plain">{t.problem}</Note>
      <Note at={[0]} x={180} y={410} anchor="middle" signal mode="tech">Shopify tax: adds only</Note>
      <Note at={[1]} x={180} y={144} anchor="middle" mode="plain">{t.field}</Note>
      <Note at={[1]} x={180} y={84} anchor="middle" mode="tech">native tax ID field</Note>
      <Note at={[2]} x={475} y={60} anchor="middle" signal mode="plain">{t.checked}</Note>
      <Note at={[2]} x={475} y={60} anchor="middle" signal mode="tech">check digits ✓</Note>
      <Note at={[3]} x={475} y={234} anchor="middle" mode="plain">{t.copied}</Note>
      <Note at={[3]} x={475} y={232} anchor="middle" mode="tech">metafield ← cnpj</Note>
      <Note at={[4]} x={680} y={226} anchor="middle" mode="plain">{t.rerun}</Note>
      <Note at={[4]} x={575} y={256} anchor="middle" mode="tech">re-run</Note>
      <Note at={[5]} x={590} y={452} anchor="end" mode="plain">{t.edited}</Note>
      <Note at={[5]} x={680} y={340} anchor="middle" mode="tech">tiers · rates (JSON)</Note>
      <Note at={[6]} x={452} y={352} anchor="middle" signal mode="plain">{t.exact}</Note>
      <Note at={[6]} x={452} y={350} anchor="middle" signal mode="tech">fixed amount · integer cents</Note>
      <Note at={[7]} x={180} y={410} anchor="middle" mode="plain">{t.same}</Note>
      <Note at={[7]} x={180} y={410} anchor="middle" mode="tech">breakdown: same math</Note>
      <Note at={[8]} x={180} y={410} anchor="middle" signal mode="plain">{t.cent}</Note>
      <Note at={[8]} x={180} y={410} anchor="middle" signal mode="tech">float rounding: ±1 cent</Note>
      <Note at={[9]} x={180} y={410} anchor="middle" signal mode="plain">{t.result}</Note>
      <Note at={[9]} x={180} y={410} anchor="middle" signal mode="tech">integer cents · rates as data</Note>

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
