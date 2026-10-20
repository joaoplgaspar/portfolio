"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useLocale } from "next-intl";
import { useSeq } from "./sequence";

/**
 * Primitivas das figuras. O vocabulário é o de uma prancha de patente:
 * traço de 1.25, numeral de referência em itálico com linha de chamada,
 * linha oculta tracejada, eixo em traço-ponto, corte em hachura.
 *
 * O movimento é narrado: ver `sequence.tsx`. Aqui ficam só as peças.
 */

export type FigProps = {
  /** Numerais acesos: o hover da legenda, ou as peças do passo atual. */
  lit: number[];
  /** Desenha os traços ao montar. */
  draw?: boolean;
  title: string;
};

const Lit = createContext<number[]>([]);

/**
 * Opções de quem monta a figura. `lens`: a lupa "Detalhe A" no hover.
 * `quiet`: a figura só nomeia a peça em foco no passo; numerais e nomes das
 * outras peças somem. É o modo da home, onde a figura divide a primeira tela
 * com o resto e não pode ser mais uma coisa gritando.
 */
const Opts = createContext({ lens: true, quiet: false });
export function FigOptions({
  lens = true,
  quiet = false,
  children,
}: {
  lens?: boolean;
  quiet?: boolean;
  children: ReactNode;
}) {
  return <Opts.Provider value={{ lens, quiet }}>{children}</Opts.Provider>;
}
const useLit = (n: number) => useContext(Lit).includes(n);

/** Id seguro para `url(#…)` — o formato do useId muda entre versões do React. */
export function useSafeId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Duração total do traço de plotter, em ms. */
export const PLOT = 3400;
/** Lupa "Detalhe A": raio (unidades do desenho) e escala. */
const LENS_R = 92;
const LENS_Z = 2.4;

/**
 * Traço de plotter: os traços da figura não surgem juntos, são plotados um
 * depois do outro, na ordem do desenho, com uma pena (o ponto em sinal)
 * percorrendo a linha da vez. O tempo de cada traço é proporcional ao
 * comprimento dele; o total é sempre PLOT. Texto e hachura (`.late`) entram
 * no fim. Movimento reduzido: nada disso, o CSS já zera as animações.
 *
 * Como num plotter de verdade, a ordem não é a do código: cada próximo
 * traço é o que começa mais perto de onde o anterior terminou. Quando o
 * próximo fica longe, a pena levanta (some), reaparece lá e volta a
 * desenhar: ela nunca atravessa a prancha pulando. A posição é medida a cada
 * quadro, porque há peças que se movem enquanto o desenho entra (FIG. 2).
 */
function usePlotter(
  content: RefObject<SVGGElement | null>,
  pen: RefObject<SVGCircleElement | null>,
  svg: RefObject<SVGSVGElement | null>,
  draw: boolean,
) {
  useLayoutEffect(() => {
    const root = svg.current;
    const g = content.current;
    const nib = pen.current;
    if (!draw || !root || !g || !nib) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!root.getScreenCTM()) return;

    const rs0 = root.getScreenCTM()!.inverse();
    const at = (el: SVGGeometryElement, d: number) => {
      const p = el.getPointAtLength(d);
      const m = el.getScreenCTM();
      return m ? new DOMPoint(p.x, p.y).matrixTransform(rs0.multiply(m)) : p;
    };
    const raw = Array.from(g.querySelectorAll<SVGGeometryElement>(".draw")).map((el) => {
      let len = 1;
      try {
        len = Math.max(1, el.getTotalLength());
      } catch {}
      return { el, len, start: 0, dur: 0, a: at(el, 0), b: at(el, len) };
    });
    // Ordem de plotter: o vizinho mais próximo de onde a pena está.
    const items: typeof raw = [];
    const left = raw.slice();
    let cur = left.shift();
    while (cur) {
      items.push(cur);
      const end = cur.b;
      let best = 0;
      let bestD = Infinity;
      for (let k = 0; k < left.length; k++) {
        const d = Math.hypot(left[k].a.x - end.x, left[k].a.y - end.y);
        if (d < bestD) {
          bestD = d;
          best = k;
        }
      }
      cur = left.splice(best, 1)[0];
    }
    const total = items.reduce((a, b) => a + b.len, 0) || 1;
    let acc = 0;
    for (const it of items) {
      it.start = (acc / total) * PLOT;
      it.dur = Math.max(50, (it.len / total) * PLOT);
      acc += it.len;
      it.el.style.animationDelay = `${it.start}ms`;
      it.el.style.animationDuration = `${it.dur}ms`;
      it.el.style.animationTimingFunction = "linear";
    }
    root.style.setProperty("--plot-late", `${PLOT * 0.8}ms`);

    let raf = 0;
    let i = 0;
    let px = NaN;
    let py = NaN;
    let lifted = 0;
    let last = -1;
    let m: DOMMatrix | null = null;
    let mAt = -1;
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const e = now - t0;
      if (e > PLOT + 160 || !items.length) {
        nib.style.opacity = "0";
        return;
      }
      while (i < items.length - 1 && items[i + 1].start <= e) i++;
      const it = items[i];
      const f = Math.min(1, Math.max(0, (e - it.start) / it.dur));
      const p = it.el.getPointAtLength(f * it.len);
      // Do traço para o desenho. getScreenCTM força o navegador a refazer o
      // layout, então a matriz é medida ao trocar de traço e a cada 10
      // quadros (o bastante para as peças que deslizam na FIG. 2), não em
      // todo quadro.
      if (i !== mAt || frame % 10 === 0) {
        const rs = root.getScreenCTM();
        const es = it.el.getScreenCTM();
        m = rs && es ? rs.inverse().multiply(es) : null;
        mAt = i;
      }
      frame++;
      const q = m ? new DOMPoint(p.x, p.y).matrixTransform(m) : p;
      // Troca de traço longe do ponto anterior: a pena levanta, reaparece lá
      // e volta aos poucos. Dentro do mesmo traço ela só desenha.
      if (Number.isNaN(px) || (i !== last && Math.hypot(q.x - px, q.y - py) > 30)) lifted = 8;
      last = i;
      px = q.x;
      py = q.y;
      nib.setAttribute("cx", String(px));
      nib.setAttribute("cy", String(py));
      nib.style.opacity = lifted > 0 ? String(Math.max(0, 1 - lifted / 6)) : "1";
      if (lifted > 0) lifted--;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [content, pen, svg, draw]);
}

/**
 * Lupa "Detalhe A": no hover (só com mouse), um círculo mostra a peça sob o
 * ponteiro ampliada, como o detalhe em escala de uma prancha. É o próprio
 * desenho reutilizado (`<use>`), então o que anda na figura anda na lupa.
 */
function useLens(svg: RefObject<SVGSVGElement | null>, lens: RefObject<SVGGElement | null>, on: boolean) {
  useEffect(() => {
    const root = svg.current;
    const g = lens.current;
    if (!on || !root || !g) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const circles = g.querySelectorAll<SVGCircleElement>("[data-c]");
    const use = g.querySelector<SVGUseElement>("[data-use]");
    const label = g.querySelector<SVGTextElement>("[data-label]");
    const move = (ev: PointerEvent) => {
      const m = root.getScreenCTM();
      if (!m || ev.pointerType !== "mouse") return;
      const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse());
      circles.forEach((c) => {
        c.setAttribute("cx", String(p.x));
        c.setAttribute("cy", String(p.y));
      });
      use?.setAttribute("transform", `translate(${p.x} ${p.y}) scale(${LENS_Z}) translate(${-p.x} ${-p.y})`);
      label?.setAttribute("x", String(p.x + LENS_R * 0.7));
      label?.setAttribute("y", String(p.y + LENS_R + 16));
      g.style.opacity = "1";
    };
    const leave = () => {
      g.style.opacity = "0";
    };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    return () => {
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
    };
  }, [svg, lens, on]);
}

export function Fig({
  title,
  draw = true,
  lit,
  children,
  viewBox = "0 0 800 500",
}: {
  title: string;
  draw?: boolean;
  lit: number[];
  children: ReactNode;
  viewBox?: string;
}) {
  const tid = useSafeId("t");
  const cid = useSafeId("c");
  const kid = useSafeId("k");
  const svg = useRef<SVGSVGElement>(null);
  const content = useRef<SVGGElement>(null);
  const pen = useRef<SVGCircleElement>(null);
  const lens = useRef<SVGGElement>(null);
  const label =
    useLocale() === "pt" ? `DETALHE A · ${String(LENS_Z).replace(".", ",")}:1` : `DETAIL A · ${LENS_Z}:1`;
  usePlotter(content, pen, svg, draw);
  // Capa estática (draw=false) não tem lupa: ela é um link, não uma prancha.
  const opts = useContext(Opts);
  useLens(svg, lens, draw && opts.lens);

  return (
    <Lit.Provider value={lit}>
    <svg
      ref={svg}
      viewBox={viewBox}
      className={`fig ${draw ? "fig-draw" : ""}`}
      role="img"
      aria-labelledby={tid}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <title id={tid}>{title}</title>
      <g id={cid} ref={content}>
        {children}
      </g>
      {draw && (
        <>
          <circle ref={pen} r={3.4} fill="var(--accent)" stroke="none" style={{ opacity: 0 }} aria-hidden />
          <g ref={lens} className="lens" aria-hidden pointerEvents="none" style={{ opacity: 0 }}>
            <defs>
              <clipPath id={kid}>
                <circle data-c r={LENS_R} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${kid})`}>
              <circle data-c r={LENS_R} fill="var(--plate)" stroke="none" />
              <use data-use href={`#${cid}`} />
            </g>
            <circle data-c r={LENS_R} strokeWidth={1.4} />
            <text data-label className="lens-label">
              {label}
            </text>
          </g>
        </>
      )}
    </svg>
    </Lit.Provider>
  );
}

/** Grupo de peça: acende em sinal quando o numeral dela está ativo. */
export function Part({ n, children }: { n: number; children: ReactNode }) {
  return <g className={`part ${useLit(n) ? "is-on" : ""}`}>{children}</g>;
}


/**
 * Linha de chamada + numeral. Curva leve (como a feita à mão numa prancha),
 * ponto de contato na peça, numeral 12px além da ponta, na mesma direção.
 *
 * Com `label`, no modo simples a peça ganha nome escrito e o numeral fica
 * pequeno ao lado: quem não conhece patente lê o nome; a legenda continua
 * casando pelo numeral. `transient`: peça que só existe em alguns passos
 * (a linha pendente, a alternativa descartada) — no modo simples, o nome
 * só aparece quando ela está acesa.
 */
export function Leader({
  n,
  at,
  to,
  label,
  transient = false,
}: {
  n: number;
  at: [number, number];
  to: [number, number];
  label?: string;
  transient?: boolean;
}) {
  const [x1, y1] = at;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Controle deslocado na perpendicular: a curva sempre "pende" para o mesmo lado.
  const cx = (x1 + x2) / 2 - (dy / len) * 10;
  const cy = (y1 + y2) / 2 + (dx / len) * 10;
  const tx = x2 + (dx / len) * 12;
  const ty = y2 + (dy / len) * 12 + 5;
  const on = useLit(n);
  const { mode } = useSeq();
  const { quiet } = useContext(Opts);
  const named = !!label && mode === "plain";
  // Quieto: só a peça acesa aparece, e só pelo nome (sem nome, nada).
  const hidden = quiet ? !(on && named) : named && transient && !on;
  // O nome cresce para longe da peça: à esquerda, à direita ou centrado.
  const anchor = !named || Math.abs(dx) < Math.abs(dy) * 0.6 ? "middle" : dx < 0 ? "end" : "start";
  return (
    <g style={{ opacity: hidden ? 0 : 1, transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <path
        d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
        strokeWidth={0.9}
        className={`leader draw ${on ? "is-on" : ""}`}
        pathLength={1}
      />
      <circle cx={x1} cy={y1} r={1.7} fill="currentColor" stroke="none" className="late" />
      <text
        x={tx}
        y={ty}
        textAnchor={anchor}
        className={`num late ${named ? "num-named" : ""} ${on ? "is-on" : ""}`}
      >
        {named ? (
          <>
            {label}
            {!quiet && (
              <tspan className="num-sup" dx={3}>
                {n}
              </tspan>
            )}
          </>
        ) : (
          n
        )}
      </text>
    </g>
  );
}

/** Hachura de corte (45°). */
export function Hatch({ id, gap = 5 }: { id: string; gap?: number }) {
  return (
    <pattern
      id={id}
      width={gap}
      height={gap}
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <line x1={0} y1={0} x2={0} y2={gap} stroke="currentColor" strokeWidth={0.8} />
    </pattern>
  );
}

/** Traço-ponto de eixo de simetria. */
export const AXIS = "14 4 2 4";
/** Tracejado de linha oculta / alternativa descartada. */
export const HIDDEN = "5 4";
