import { clients } from "@/data/clients";

/**
 * Faixa de clientes — escala sem diluir o índice de cases.
 * Tipográfica em mono, deliberadamente discreta: o índice continua sendo o herói.
 */
export default function ClientList({ label }: { label: string }) {
  return (
    <section className="mt-16 border-t border-line pt-8 md:mt-24">
      <h2 className="text-label text-muted">{label}</h2>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 font-mono text-sm text-stone-400">
        {clients.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}
