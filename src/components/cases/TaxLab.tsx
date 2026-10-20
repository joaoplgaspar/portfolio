"use client";

import { useState } from "react";

/**
 * Retenção na fonte num checkout simulado. As três peças do app aparecem
 * juntas: a validação (CNPJ malformado trava), a regra (faixa de valor,
 * isenção do Simples) e a linha que o checkout mostra.
 *
 * As faixas e alíquotas daqui são ILUSTRATIVAS e ficam declaradas na tela;
 * as do cliente não saem do repositório dele. A aritmética é a do app: tudo
 * em centavos inteiros, arredondamento half-up, sem ponto flutuante.
 */
export type TaxLabText = {
  doc: string;
  person: string;
  company: string;
  malformed: string;
  simples: string;
  value: string;
  subtotal: string;
  withholding: string;
  total: string;
  states: { empty: string; person: string; invalid: string; below: string; applied: string; simples: string };
  tiers: string;
};

/** Faixas ilustrativas: [a partir de (centavos), alíquota em centésimos de ponto]. */
const TIERS: [number, number][] = [
  [0, 0],
  [25_000, 500],
  [500_000, 650],
];
/** O optante do Simples deixa de reter parte dos tributos (ilustrativo). */
const SIMPLES_HP = 150;

const SAMPLE = { person: "123.456.789-09", company: "11.222.333/0001-81", malformed: "11.222.333/0001-99" };

const digits = (s: string) => s.replace(/\D/g, "");

/** Dígitos verificadores do CNPJ (algoritmo público da Receita). */
function validCnpj(d: string) {
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const dv = (len: number) => {
    const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = w.reduce((acc, wi, i) => acc + wi * Number(d[i]), 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return dv(12) === Number(d[12]) && dv(13) === Number(d[13]);
}

/** base × alíquota / 10000, half-up, só inteiros — a mesma conta do app. */
const applyRate = (cents: number, hp: number) => Math.floor((2 * cents * hp + 10000) / 20000);

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
const pct = (hp: number) => `${(hp / 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

export default function TaxLab({ t }: { t: TaxLabText }) {
  const [doc, setDoc] = useState(SAMPLE.company);
  const [simples, setSimples] = useState(false);
  const [cents, setCents] = useState(189_000);

  const d = digits(doc);
  const kind = d.length === 0 ? "empty" : d.length === 11 ? "person" : d.length === 14 ? (validCnpj(d) ? "company" : "invalid") : "invalid";
  const tierHp = [...TIERS].reverse().find(([min]) => cents >= min)![1];
  const rateHp = kind !== "company" || tierHp === 0 ? 0 : simples ? SIMPLES_HP : tierHp;
  const withheld = applyRate(cents, rateHp);
  const blocked = kind === "invalid";

  const state =
    kind === "empty"
      ? t.states.empty
      : kind === "person"
        ? t.states.person
        : blocked
          ? t.states.invalid
          : tierHp === 0
            ? t.states.below
            : simples
              ? t.states.simples
              : t.states.applied;

  return (
    <div className="grid border border-fg md:grid-cols-2">
      <div className="border-b border-fg p-4 md:border-r md:border-b-0">
        <label className="block">
          <span className="tb-key">{t.doc}</span>
          <input
            className={`field mt-1 font-mono ${blocked ? "text-accent" : ""}`}
            inputMode="numeric"
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
            aria-invalid={blocked}
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["person", "company", "malformed"] as const).map((k) => (
            <button key={k} type="button" className="ctl !h-7 !px-2.5" onClick={() => setDoc(SAMPLE[k])}>
              {t[k]}
            </button>
          ))}
        </div>

        <label className="mt-5 flex items-center gap-2">
          <input type="checkbox" className="accent-[var(--accent)]" checked={simples} onChange={(e) => setSimples(e.target.checked)} />
          <span className="t-small">{t.simples}</span>
        </label>

        <label className="mt-5 block">
          <span className="tb-key">
            {t.value} · <span className="tabular-nums">{brl(cents)}</span>
          </span>
          <input
            className="mt-2 w-full accent-[var(--accent)]"
            type="range"
            min={5_000}
            max={1_500_000}
            step={1_000}
            value={cents}
            onChange={(e) => setCents(Number(e.target.value))}
          />
        </label>
        <p className="t-code mt-3 text-faint">{t.tiers}</p>
      </div>

      <div className="flex flex-col p-4">
        <dl className="t-small tabular-nums">
          <div className="flex justify-between border-b border-line py-2">
            <dt>{t.subtotal}</dt>
            <dd>{brl(cents)}</dd>
          </div>
          <div
            className="flex justify-between border-b border-line py-2 transition-opacity duration-500"
            style={{ opacity: withheld > 0 ? 1 : 0.25 }}
          >
            <dt>
              {t.withholding}
              {withheld > 0 && <span className="text-muted"> · {pct(rateHp)}</span>}
            </dt>
            <dd className={withheld > 0 ? "text-accent" : ""}>− {brl(withheld)}</dd>
          </div>
          <div className="flex justify-between py-2 text-[1.0625rem] font-[680]">
            <dt>{t.total}</dt>
            <dd className={blocked ? "line-through decoration-1 text-muted" : ""}>{brl(cents - withheld)}</dd>
          </div>
        </dl>
        <p className={`t-small mt-auto border-t border-fg pt-3 ${blocked ? "text-accent" : "text-muted"}`} aria-live="polite">
          {state}
        </p>
      </div>
    </div>
  );
}
