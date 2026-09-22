import { Fragment } from "react";
import type { CaseBlock } from "@/types/project";

/** `inline code` entre crases vira <code>; *ênfase* entre asteriscos vira <em>. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="case-code">
            {part}
          </code>
        ) : (
          <Fragment key={i}>
            {part.split(/\*([^*]+)\*/).map((bit, j) => (j % 2 === 1 ? <em key={j}>{bit}</em> : bit))}
          </Fragment>
        ),
      )}
    </>
  );
}

type Section = { heading: string | null; blocks: CaseBlock[] };

function sections(blocks: CaseBlock[]): Section[] {
  const out: Section[] = [];
  for (const b of blocks) {
    if (b.kind === "heading") out.push({ heading: b.text, blocks: [] });
    else {
      if (!out.length) out.push({ heading: null, blocks: [] });
      out[out.length - 1].blocks.push(b);
    }
  }
  return out;
}

/**
 * Texto do case em seções: título fino à esquerda, corpo à direita numa
 * medida de leitura. Lista rotulada vira linhas de filete — rótulo pesado
 * em cima, explicação embaixo — em vez de bullet com negrito.
 */
export default function CaseText({ blocks }: { blocks: CaseBlock[] }) {
  return (
    <div>
      {sections(blocks).map((s, i) => (
        <section
          key={i}
          className="grid gap-4 border-t border-fg pt-5 pb-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[var(--gut)]"
        >
          <h2 className="t-title max-w-[16ch] text-[clamp(1.5rem,2.4vw,2.2rem)]">{s.heading}</h2>
          <div className="max-w-[66ch] space-y-5 text-[1.0625rem] leading-[1.62]">
            {s.blocks.map((b, j) =>
              b.kind === "text" ? (
                <p key={j}>
                  <Inline text={b.text} />
                </p>
              ) : b.kind === "list" ? (
                <ul key={j} className="border-b border-line">
                  {b.items.map((item, k) => (
                    <li key={k} className="border-t border-line py-4">
                      {item.label && (
                        <span className="mb-1 block text-[0.9375rem] font-[680]">
                          {item.label.replace(/:$/, "")}
                        </span>
                      )}
                      <span className="block text-muted">
                        {/* O texto vinha colado ao rótulo ("Rótulo: a frase…"); separado, começa em maiúscula. */}
                        <Inline text={item.label ? item.text.charAt(0).toUpperCase() + item.text.slice(1) : item.text} />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null,
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
