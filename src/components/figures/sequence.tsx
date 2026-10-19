"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Localized } from "@/types/project";

/**
 * Sequência narrada de uma figura.
 *
 * Uma figura deixa de ser um loop solto e vira uma explicação em passos:
 * cada passo tem duração, as peças que acende e uma legenda. Um relógio único
 * (rAF) anda pelos passos; o React só re-renderiza quando o PASSO muda. O
 * progresso dentro do passo (0..1) é entregue por assinatura direto aos
 * elementos que se movem (`Travel`), sem render a 60 fps.
 *
 * Movimento reduzido: nada toca sozinho, e cada passo aparece no estado final.
 * Fora da tela: o relógio para.
 */

export type Step = {
  /** Segundos. */
  dur: number;
  /** Numerais acesos neste passo. */
  on?: number[];
  /** Legenda técnica: numerais, nomes de API. É a do modo "técnico". */
  caption: Localized;
  /** Legenda para quem não é dev. Quando existe, é a padrão. */
  plain?: Localized;
  /** Rótulo curto do passo na régua (uma ou duas palavras). */
  title?: Localized;
  /** Ato da história: problema e descartado acendem em sinal na régua. */
  act?: "problem" | "solution" | "rejected" | "result";
};

/**
 * Modo de leitura das figuras. "plain" fala com quem contrata; "tech", com
 * quem vai revisar o código. Um só para o site inteiro: trocar numa figura
 * troca em todas, e a escolha fica salva no navegador (se ele deixar).
 */
export type Mode = "plain" | "tech";
const MODE_KEY = "fig-mode";
const MODE_EVENT = "fig-mode";
let modeMemo: Mode = "plain";

function readMode(): Mode {
  try {
    const v = localStorage.getItem(MODE_KEY);
    if (v === "tech" || v === "plain") modeMemo = v;
  } catch {}
  return modeMemo;
}

function subscribeMode(cb: () => void) {
  window.addEventListener(MODE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(MODE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useMode() {
  const mode = useSyncExternalStore(subscribeMode, readMode, () => "plain" as Mode);
  const setMode = useCallback((m: Mode) => {
    modeMemo = m;
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {}
    window.dispatchEvent(new Event(MODE_EVENT));
  }, []);
  return [mode, setMode] as const;
}

type Listener = (step: number, t: number) => void;

type SeqCtx = {
  step: number;
  reduced: boolean;
  mode: Mode;
  subscribe: (fn: Listener) => () => void;
};

const Ctx = createContext<SeqCtx>({ step: -1, reduced: false, mode: "plain", subscribe: () => () => {} });
export const useSeq = () => useContext(Ctx);

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export type Sequence = ReturnType<typeof useSequence>;

export function useSequence(
  steps: Step[],
  {
    autoplay = true,
    loop = true,
    onEnd,
  }: { autoplay?: boolean; loop?: boolean; onEnd?: () => void } = {},
) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useMode();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const [visible, setVisible] = useState(true);
  const stepRef = useRef(0);
  const tRef = useRef(0);
  const subs = useRef(new Set<Listener>());
  const onEndRef = useRef(onEnd);
  const elRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    onEndRef.current = onEnd;
  });

  const emit = useCallback(() => {
    subs.current.forEach((fn) => fn(stepRef.current, tRef.current));
  }, []);

  const go = useCallback(
    (i: number, t = 0) => {
      const n = steps.length;
      stepRef.current = ((i % n) + n) % n;
      tRef.current = t;
      setStep(stepRef.current);
      emit();
    },
    [steps.length, emit],
  );

  // Relógio.
  const running = playing && !reduced && visible;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 250);
      last = now;
      tRef.current += dt / (steps[stepRef.current].dur * 1000);
      if (tRef.current >= 1) {
        if (stepRef.current === steps.length - 1) {
          onEndRef.current?.();
          if (!loop) {
            tRef.current = 1;
            emit();
            setPlaying(false);
            return;
          }
        }
        go(stepRef.current + 1);
      } else {
        emit();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, steps, loop, go, emit]);

  // Para fora da tela.
  const observe = useCallback((el: HTMLElement | null) => {
    elRef.current = el;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const subscribe = useCallback((fn: Listener) => {
    subs.current.add(fn);
    fn(stepRef.current, tRef.current);
    return () => {
      subs.current.delete(fn);
    };
  }, []);

  // Com movimento reduzido cada passo é mostrado já concluído.
  const jump = useCallback((i: number) => go(i, reduced ? 1 : 0), [go, reduced]);

  const ctx = useMemo<SeqCtx>(() => ({ step, reduced, mode, subscribe }), [step, reduced, mode, subscribe]);

  return {
    step,
    steps,
    playing: playing && !reduced,
    reduced,
    mode,
    setMode,
    ctx,
    observe,
    subscribe,
    go: jump,
    next: () => jump(stepRef.current + 1),
    prev: () => jump(stepRef.current - 1),
    toggle: () => setPlaying((p) => !p),
    setPlaying,
  };
}

export function SeqProvider({ seq, children }: { seq: Sequence; children: ReactNode }) {
  return <Ctx.Provider value={seq.ctx}>{children}</Ctx.Provider>;
}

/** O passo atual está em `at`? */
export function useAt(at: number | number[]) {
  const { step } = useSeq();
  return Array.isArray(at) ? at.includes(step) : step >= at;
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/**
 * Pacote que percorre `d` durante o passo `step`, na janela [from, to] do
 * passo. Posição escrita direto no DOM a cada frame.
 */
export function Travel({
  d,
  step,
  from = 0,
  to = 1,
  reverse = false,
  signal = false,
  r = 3.6,
  tag,
}: {
  d: string;
  step: number;
  from?: number;
  to?: number;
  reverse?: boolean;
  signal?: boolean;
  r?: number;
  /**
   * O que está andando, escrito numa etiqueta (o produto, a pessoa, o
   * "salvo"). Sem etiqueta, um ponto. Uma coisa com nome se segue com o
   * olho; um ponto, não.
   */
  tag?: string;
}) {
  const { subscribe, reduced } = useSeq();
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const box = useRef<SVGGElement>(null);

  useEffect(() => {
    if (reduced) return;
    const p = path.current;
    const el: SVGGraphicsElement | null = tag ? box.current : dot.current;
    if (!p || !el) return;
    const len = p.getTotalLength();
    return subscribe((s, t) => {
      const local = (t - from) / (to - from);
      if (s !== step || local <= 0 || local >= 1) {
        el.style.opacity = "0";
        return;
      }
      const k = ease(local);
      const pt = p.getPointAtLength((reverse ? 1 - k : k) * len);
      if (tag) {
        el.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      } else {
        el.setAttribute("cx", String(pt.x));
        el.setAttribute("cy", String(pt.y));
      }
      // Entra e sai por opacidade: nada aparece nem some de uma vez.
      el.style.opacity = String(Math.min(1, local / 0.18, (1 - local) / 0.18));
    });
  }, [subscribe, reduced, step, from, to, reverse, d, tag]);

  // Largura da etiqueta pelo número de caracteres (mono: largura fixa).
  const w = tag ? tag.length * 8.6 + 22 : 0;

  return (
    <g aria-hidden>
      <path ref={path} d={d} stroke="none" fill="none" />
      {tag ? (
        <g ref={box} style={{ opacity: 0 }}>
          <rect
            x={-w / 2}
            y={-12}
            width={w}
            height={24}
            rx={12}
            fill="var(--plate)"
            stroke={signal ? "var(--accent)" : "currentColor"}
            strokeWidth={1.2}
          />
          <text x={0} y={5} textAnchor="middle" className={`tag ${signal ? "tag-signal" : ""}`}>
            {tag}
          </text>
        </g>
      ) : (
        <circle
          ref={dot}
          r={r}
          fill={signal ? "var(--accent)" : "currentColor"}
          stroke="none"
          style={{ opacity: 0 }}
        />
      )}
    </g>
  );
}

/** Aparece (opacidade) nos passos em `at`. */
export function Show({ at, children }: { at: number | number[]; children: ReactNode }) {
  const on = useAt(at);
  return (
    <g style={{ opacity: on ? 1 : 0, transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)" }}>{children}</g>
  );
}

/** Anotação de passo: texto mono pequeno, com fundo de papel para ler por cima de traço. */
export function Note({
  at,
  x,
  y,
  anchor = "start",
  children,
  signal = false,
  mode,
}: {
  at: number | number[];
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  children: string;
  signal?: boolean;
  /** Só neste modo de leitura. Sem modo, nos dois. */
  mode?: Mode;
}) {
  const current = useSeq().mode;
  if (mode && mode !== current) return null;
  return (
    <Show at={at}>
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        className={`code note ${mode === "plain" ? "note-plain" : ""} ${signal ? "note-signal" : ""}`}
        stroke="var(--bg)"
        strokeWidth={4}
        paintOrder="stroke"
      >
        {children}
      </text>
    </Show>
  );
}
