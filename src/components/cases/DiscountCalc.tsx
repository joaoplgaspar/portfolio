"use client";

import { useState } from "react";

/**
 * Desconto de funcionário com cálculo invertido: 50% sobre o preço
 * comparado (compare-at), não sobre o preço de venda. Um app de prateleira
 * calcula sobre o preço de venda — os dois números lado a lado mostram por
 * que a regra precisou de um app próprio. Só aritmética; nenhuma regra além
 * da descrita no case.
 */
export type DiscountText = {
  compareAt: string;
  price: string;
  shelf: string;
  rule: string;
  shelfHow: string;
  ruleHow: string;
  diff: string;
};

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

export default function DiscountCalc({ t }: { t: DiscountText }) {
  const [compareAt, setCompareAt] = useState(199.9);
  const [price, setPrice] = useState(149.9);
  const shelf = price * 0.5;
  const rule = compareAt * 0.5;

  return (
    <div className="border border-fg">
      <div className="grid grid-cols-2 border-b border-fg">
        <label className="border-r border-fg p-3">
          <span className="tb-key">{t.compareAt}</span>
          <input
            className="field mt-1"
            type="number"
            step="0.1"
            min={0}
            value={compareAt}
            onChange={(e) => setCompareAt(Number(e.target.value) || 0)}
          />
        </label>
        <label className="p-3">
          <span className="tb-key">{t.price}</span>
          <input
            className="field mt-1"
            type="number"
            step="0.1"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
          />
        </label>
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r border-fg p-3">
          <span className="tb-key">{t.shelf}</span>
          <p className="t-title tabular-nums text-muted line-through decoration-1">{brl(shelf)}</p>
          <p className="t-code mt-1 text-muted">{t.shelfHow}</p>
        </div>
        <div className="p-3">
          <span className="tb-key text-accent">{t.rule}</span>
          <p className="t-title tabular-nums">{brl(rule)}</p>
          <p className="t-code mt-1 text-muted">{t.ruleHow}</p>
        </div>
      </div>
      <p className="t-small border-t border-fg px-3 py-2 tabular-nums" aria-live="polite">
        {t.diff}: {brl(Math.abs(rule - shelf))}
      </p>
    </div>
  );
}
