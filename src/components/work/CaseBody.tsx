import { Fragment } from "react";
import type { CaseBlock } from "@/types/project";

/** Converte `inline code` (trechos entre crases) em <code> mono. */
function Inline({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="case-code">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Corpo rico de case (headings / parágrafos / listas rotuladas).
 * Renderiza inline-code em mono. Espaçamento e estilo vivem em globals.css (.case-body).
 */
export default function CaseBody({ blocks }: { blocks: CaseBlock[] }) {
  return (
    <div className="case-body">
      {blocks.map((block, i) => {
        if (block.kind === "heading") {
          return (
            <h2 key={i} className="case-heading text-label text-accent-lift">
              {block.text}
            </h2>
          );
        }
        if (block.kind === "text") {
          return (
            <p key={i}>
              <Inline text={block.text} />
            </p>
          );
        }
        return (
          <ul key={i} className="case-list">
            {block.items.map((item, j) => (
              <li key={j}>
                {item.label && <span className="case-lead">{item.label} </span>}
                <Inline text={item.text} />
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
