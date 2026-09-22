/**
 * Numeração das pranchas: 1 índice · 2..n+1 cases · lojas · sobre · contato.
 * Uma função só para o carimbo não mentir o total.
 */
export function sheetPlan(cases: number) {
  const stores = cases + 2;
  const about = stores + 1;
  return { total: about + 1, stores, about, contact: about + 1 };
}
