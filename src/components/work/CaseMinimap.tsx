"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getLenis } from "@/lib/lenis";

/**
 * Minimap do case — orientação em 30 px de largura.
 *
 * Inspirado no minimap fixo do xiangyidesign (ver docs/teardown-xiangyidesign.md),
 * com uma diferença: lá os tracinhos são igualmente espaçados, aqui a posição
 * vertical de cada traço é a **posição real do bloco no documento**. Num case de
 * 4.000 px isso significa que o minimap responde "onde eu estou" de verdade, e
 * não só "quantos blocos existem".
 *
 * Acessibilidade: os traços de heading são botões de navegação com o texto do
 * heading como rótulo — é um caminho de teclado real, não enfeite. Os traços de
 * parágrafo e lista são decoração e ficam fora da árvore.
 */

type Tick = {
  /** 0..1 — posição do bloco dentro do corpo do case. */
  at: number;
  kind: "heading" | "text" | "list";
  /** Só para heading: texto usado como rótulo do botão. */
  label?: string;
  el: HTMLElement;
};

const WIDTH: Record<Tick["kind"], string> = {
  heading: "100%",
  text: "58%",
  list: "42%",
};

export default function CaseMinimap() {
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [active, setActive] = useState<number>(-1);
  const frame = useRef(0);

  // Mede os blocos do corpo. Refaz no resize porque a altura de cada bloco
  // muda com a largura da coluna (texto reflui).
  useEffect(() => {
    const measure = () => {
      const body = document.querySelector<HTMLElement>(".case-body");
      if (!body) return setTicks([]);

      const blocks = [...body.children].filter((c): c is HTMLElement => c instanceof HTMLElement);
      if (blocks.length === 0) return setTicks([]);

      const top = body.getBoundingClientRect().top + window.scrollY;
      const height = body.offsetHeight || 1;

      setTicks(
        blocks.map((el) => {
          const kind: Tick["kind"] =
            el.tagName === "H2" ? "heading" : el.tagName === "UL" ? "list" : "text";
          return {
            at: (el.getBoundingClientRect().top + window.scrollY - top) / height,
            kind,
            label: kind === "heading" ? (el.textContent ?? undefined) : undefined,
            el,
          };
        }),
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Bloco ativo = o último cujo topo já passou da linha de leitura (35% da
  // altura da janela). Lido no rAF para não recalcular layout por evento de
  // scroll — o Lenis dispara muitos.
  useEffect(() => {
    if (ticks.length === 0) return;

    const read = () => {
      const line = window.innerHeight * 0.35;
      let current = -1;
      for (let i = 0; i < ticks.length; i++) {
        if (ticks[i].el.getBoundingClientRect().top <= line) current = i;
        else break;
      }
      setActive(current);
      frame.current = requestAnimationFrame(read);
    };
    frame.current = requestAnimationFrame(read);
    return () => cancelAnimationFrame(frame.current);
  }, [ticks]);

  const goTo = useCallback((el: HTMLElement) => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -120 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (ticks.length === 0) return null;

  // O heading ativo é o último heading em ou antes do bloco ativo — é ele que
  // fica aceso, mesmo quando o bloco ativo é um parágrafo.
  let activeHeading = -1;
  for (let i = 0; i <= active && i < ticks.length; i++) {
    if (ticks[i].kind === "heading") activeHeading = i;
  }

  // Portal para o body: `template.tsx` envolve a página num `.page-enter`, e a
  // animação de entrada deixa ali um `transform` de matriz identidade. Matriz
  // identidade não é `none` — ela cria bloco de contenção, e um `position:
  // fixed` dentro dela ancora na página inteira em vez da viewport. O minimap
  // rolava junto com o conteúdo, que é exatamente o contrário do que ele é.
  return createPortal(
    <nav className="minimap" aria-label="Seções do case">
      <ul className="minimap-track">
        {ticks.map((tick, i) => {
          const lit = i === activeHeading || (i <= active && i > activeHeading);
          const style = { top: `${tick.at * 100}%`, width: WIDTH[tick.kind] };

          if (tick.kind === "heading" && tick.label) {
            return (
              <li key={i}>
                <button
                  type="button"
                  className={`minimap-tick is-heading${lit ? " is-active" : ""}`}
                  style={style}
                  onClick={() => goTo(tick.el)}
                >
                  <span className="sr-only">{tick.label}</span>
                </button>
                <span className="minimap-label" style={{ top: `${tick.at * 100}%` }} aria-hidden>
                  {tick.label}
                </span>
              </li>
            );
          }

          return (
            <li key={i} aria-hidden>
              <span className={`minimap-tick${lit ? " is-active" : ""}`} style={style} />
            </li>
          );
        })}
      </ul>
    </nav>,
    document.body,
  );
}
