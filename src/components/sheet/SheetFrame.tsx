/**
 * Moldura da prancha: borda de 1px com zonas marcadas (1–8 no topo, A–F na
 * lateral), como uma folha de desenho técnico. Puramente visual — fica fora
 * da árvore de acessibilidade.
 */
const COLS = 8;
const ROWS = ["A", "B", "C", "D", "E", "F"];

export default function SheetFrame() {
  return (
    <div className="sheet-frame" aria-hidden>
      {Array.from({ length: COLS }, (_, i) => (
        <span key={`t${i}`}>
          <span className="zone zone-top" style={{ left: `${((i + 0.5) / COLS) * 100}%` }}>
            {i + 1}
          </span>
          {i > 0 && <span className="zone-tick-top" style={{ left: `${(i / COLS) * 100}%` }} />}
        </span>
      ))}
      {ROWS.map((r, i) => (
        <span key={r}>
          <span className="zone zone-left" style={{ top: `${((i + 0.5) / ROWS.length) * 100}%` }}>
            {r}
          </span>
          {i > 0 && (
            <span className="zone-tick-left" style={{ top: `${(i / ROWS.length) * 100}%` }} />
          )}
        </span>
      ))}
    </div>
  );
}
