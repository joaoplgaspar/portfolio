import Image from "next/image";
import type { Mock } from "@/data/mocks";
import LogoPlate from "./LogoPlate";
import { PLOT } from "@/components/figures/parts";

/** O que aparece no celular da margem. */
export type BrandScreen =
  | { kind: "site"; mock: Mock }
  | { kind: "app"; src: string }
  | { kind: "building"; label: string };

export type Brand = {
  logos: string[];
  plate?: string | string[];
  name: string;
  /** Uma linha: o que é o projeto, não como ele funciona (isso é a figura). */
  line: string;
  screen: BrandScreen;
};

const PHONE_H = 844;

/**
 * Margem da prancha na home: a folha de rosto do projeto ao lado do desenho.
 * Em cima a placa da marca (cor e logo, irmãs se revezando), o nome e uma
 * linha; embaixo um celular pequeno com o site rolando (ou as telas do app,
 * ou "em desenvolvimento" quando ainda não está no ar). Lê-se de quem é,
 * depois como funciona. No celular a margem vira uma faixa sem o aparelho.
 */
export default function BrandMargin({ brand }: { brand: Brand }) {
  const { screen } = brand;
  return (
    <aside className="flex items-center gap-3 border-b border-line pb-3 md:flex-col md:items-stretch md:gap-4 md:border-r md:border-b-0 md:pr-4 md:pb-0">
      <div className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden border border-fg md:w-full">
        <LogoPlate logos={brand.logos} plate={brand.plate} sizes="220px" size="thumb" />
      </div>
      <div className="min-w-0">
        <p className="t-title text-[1.15rem] leading-tight">{brand.name}</p>
        <p className="t-small mt-1 text-muted">{brand.line}</p>
      </div>

      <div className="mock is-in mt-auto hidden w-[62%] self-center md:block">
        <div className="rounded-[18px] border-[1.25px] border-fg bg-[var(--plate)] p-[5%]">
          <div className="relative overflow-hidden rounded-[12px] border-[1.25px] border-fg" style={{ aspectRatio: `390 / ${PHONE_H}` }}>
            {screen.kind === "site" && (
              <Image
                src={screen.mock.src}
                alt=""
                width={screen.mock.w}
                height={screen.mock.h}
                sizes="160px"
                className="mock-scroll block h-auto w-full"
                style={{
                  ["--mock-end" as string]: `${-(1 - PHONE_H / screen.mock.h) * 100}%`,
                  ["--mock-dur" as string]: `${Math.max(10, screen.mock.h / 200)}s`,
                  // Só começa a rolar depois do traço de plotter: na entrada
                  // da página, uma coisa de cada vez.
                  animationDelay: `${PLOT + 400}ms`,
                }}
              />
            )}
            {screen.kind === "app" && <Image src={screen.src} alt="" fill sizes="160px" className="object-cover object-top" />}
            {screen.kind === "building" && (
              <div
                className="absolute inset-0 grid place-items-center p-2 text-center"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 7px)" }}
              >
                <span className="bg-[var(--plate)] px-1 text-[10px] leading-tight font-[600] break-words text-faint">{screen.label}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
