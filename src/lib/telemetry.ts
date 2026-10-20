"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Medições da barra de telemetria.
 *
 * Regra que vale para todas: **só publica o que mediu**. Quando um valor não
 * existe (navegador sem a API, build sem hash, medição ainda não chegou) o
 * hook devolve `null` e o campo some da barra. Um número inventado numa barra
 * que se propõe a mostrar as vísceras do site é pior que campo nenhum.
 */

const TZ = "America/Sao_Paulo";

/** Relógio de São Paulo, `hh:mm:ss`, alinhado à virada do segundo. */
export function useClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("pt-BR", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    let timer = 0;
    const tick = () => {
      setTime(fmt.format(new Date()));
      // Agenda para a próxima virada de segundo em vez de setInterval(1000):
      // um intervalo fixo acumula atraso e o relógio "pula" segundos.
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();

    return () => window.clearTimeout(timer);
  }, []);

  return time;
}

/**
 * Quadros por segundo, média móvel sobre as últimas 60 amostras.
 *
 * Só roda com `active` — a barra passa `false` quando está fora da viewport ou
 * a aba está em segundo plano. Medir o tempo todo custaria um `rAF` permanente
 * para exibir um número que ninguém está olhando, o que contradiz o ponto.
 */
export function useFps(active: boolean) {
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const samples: number[] = [];
    let raf = 0;
    let lastPublish = 0;

    const loop = (now: number) => {
      samples.push(now);
      if (samples.length > 60) samples.shift();

      // Publica no máximo a cada 500 ms: re-render a 60 Hz para mostrar o
      // número do re-render é exatamente o tipo de coisa que derruba o número.
      if (samples.length > 10 && now - lastPublish > 500) {
        const span = samples[samples.length - 1] - samples[0];
        if (span > 0) setFps(Math.round(((samples.length - 1) / span) * 1000));
        lastPublish = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [active]);

  // Mantém a última leitura quando `active` cai: o número continua sendo algo
  // que foi medido de verdade, e o campo sumir da barra empurraria os campos
  // seguintes toda vez que o rodapé saísse da tela.
  return fps;
}

/** LCP medido neste visitante, em segundos. */
export function useLcp() {
  const [lcp, setLcp] = useState<number | null>(null);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;
    let po: PerformanceObserver;
    try {
      po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        // O LCP pode ser reescrito até a primeira interação — vale o último.
        if (last) setLcp(last.startTime / 1000);
      });
      // `buffered` traz a entrada mesmo se o observer subiu depois do paint.
      po.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      return; // Safari antigo: sem LCP, campo some
    }
    return () => po.disconnect();
  }, []);

  return lcp;
}

export type Capabilities = { gl: "WEBGL2" | "WEBGL" | null; dpr: number };

let capsCache: Capabilities | null = null;

function detectCapabilities(): Capabilities {
  // Memoizado: `getSnapshot` precisa devolver a mesma referência a cada
  // chamada, senão o React entra em laço de re-render. E sondar a GPU uma vez
  // por render seria absurdo de qualquer forma.
  if (capsCache) return capsCache;

  const canvas = document.createElement("canvas");
  let gl: Capabilities["gl"] = null;
  const ctx =
    (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ??
    (canvas.getContext("webgl") as WebGLRenderingContext | null);
  if (ctx) {
    gl = "texImage3D" in ctx ? "WEBGL2" : "WEBGL";
    // Não segurar um contexto de GPU só para ter respondido a pergunta.
    ctx.getExtension("WEBGL_lose_context")?.loseContext();
  }
  capsCache = { gl, dpr: Math.round((window.devicePixelRatio || 1) * 10) / 10 };
  return capsCache;
}

const noSubscribe = () => () => {};
const noCapabilities = () => null;

/** O que a máquina do visitante suporta. Sondado uma vez, no cliente. */
export function useCapabilities() {
  return useSyncExternalStore(noSubscribe, detectCapabilities, noCapabilities);
}

/**
 * `true` enquanto o elemento está visível na tela **e** a aba está em primeiro
 * plano. É o interruptor do medidor de FPS.
 */
export function useOnScreen<T extends Element>(ref: React.RefObject<T | null>) {
  const [onScreen, setOnScreen] = useState(false);
  const inViewRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = () => setOnScreen(inViewRef.current && !document.hidden);

    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref]);

  return onScreen;
}

/** Hash e data do build, injetados em `next.config.mjs`. */
export function buildInfo() {
  const sha = process.env.NEXT_PUBLIC_BUILD_SHA;
  const iso = process.env.NEXT_PUBLIC_BUILD_TIME;
  if (!sha) return null;
  const date = iso ? new Date(iso) : null;
  const stamp =
    date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat("pt-BR", {
          timeZone: TZ,
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(date)
      : null;
  return { sha, stamp };
}
