/** Faixa de gradiente que mistura a cor de dois mundos vizinhos (transição suave). */
export default function SectionSeam({
  from,
  to,
  height = "16vh",
}: {
  from: string;
  to: string;
  height?: string;
}) {
  return (
    <div
      aria-hidden
      style={{ height, background: `linear-gradient(180deg, ${from}, ${to})` }}
    />
  );
}
