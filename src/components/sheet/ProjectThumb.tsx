import Image from "next/image";
import LogoPlate from "./LogoPlate";

/**
 * Miniatura que identifica o projeto de relance no índice da home: a cor e
 * o logo da marca, a print do site no ar, ou dois telefones para um app.
 * Mesmo tamanho para todos, para a lista não pular.
 */
export type Print =
  | { kind: "logo"; logos: string[]; plate?: string | string[] }
  | { kind: "site"; src: string }
  | { kind: "app"; srcs: string[] };

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

  if (print.kind === "logo") {
    return (
      <span className={frame} aria-hidden>
        <LogoPlate logos={print.logos} plate={print.plate} sizes="100px" size="thumb" />
      </span>
    );
  }

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
