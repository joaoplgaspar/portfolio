import Image from "next/image";

/**
 * Miniatura que identifica o projeto de relance no índice da home: a print
 * do site no ar, dois telefones para um app, ou um terminal para uma
 * ferramenta. Mesmo tamanho para todos, para a lista não pular.
 */
export type Print = { kind: "site"; src: string } | { kind: "app"; srcs: string[] } | { kind: "cli"; lines: string[] };

export default function ProjectThumb({ print, on }: { print?: Print; on: boolean }) {
  const frame = `relative h-[62px] w-[100px] shrink-0 overflow-hidden border transition-colors duration-500 ${
    on ? "border-accent" : "border-line"
  }`;

  if (!print) return <span className={frame} aria-hidden />;

  if (print.kind === "site") {
    return (
      <span className={frame} aria-hidden>
        <Image src={print.src} alt="" fill sizes="100px" className="object-cover object-top" />
      </span>
    );
  }

  if (print.kind === "app") {
    return (
      <span className={`${frame} flex items-start justify-center gap-1.5 bg-[var(--plate)] pt-1.5`} aria-hidden>
        {print.srcs.slice(0, 2).map((src) => (
          <span key={src} className="relative block h-[70px] w-[34px] overflow-hidden rounded-[5px] border border-fg">
            <Image src={src} alt="" fill sizes="40px" className="object-cover object-top" />
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={`${frame} block bg-fg px-2 py-1.5`} aria-hidden>
      {print.lines.map((l, i) => (
        <span key={i} className="block truncate font-mono text-[8px] leading-[11px] text-bg">
          {l}
        </span>
      ))}
    </span>
  );
}
