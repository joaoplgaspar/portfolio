"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resetScroll } from "@/lib/lenis";
import { sweep, type SweepOptions } from "@/lib/sweep";

/**
 * Liga a faixa iridescente (`lib/sweep`) à navegação.
 *
 * A navegação é interceptada em fase de captura no documento, em vez de
 * embrulhar cada `<Link>`: assim qualquer âncora interna — inclusive as que
 * ainda vão ser escritas — entra na transição sem precisar lembrar disso.
 *
 * Só intercepta quando a transição pode acontecer de verdade. Sem WebGL, com
 * `prefers-reduced-motion` ou em qualquer caso ambíguo (modificador, alvo
 * externo, download, âncora na mesma página), o clique segue o caminho nativo
 * do navegador. Degradar aqui é não fazer nada.
 */
export default function Sweep() {
  const router = useRouter();
  const pathname = usePathname();

  // Resolver do "a rota commitou". Preenchido só durante uma transição.
  const pendingRef = useRef<(() => void) | null>(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    const resolve = pendingRef.current;
    if (resolve) {
      pendingRef.current = null;
      resolve();
    }
  }, [pathname]);

  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) {
      sweep.detach();
      return;
    }
    sweep.attach(node);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Compila o shader fora do caminho crítico: a primeira transição do
    // visitante não pode pagar o custo de link do programa.
    const warm = () => sweep.warm();
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(warm, { timeout: 2000 })
        : window.setTimeout(warm, 1200);

    enabledRef.current = true;

    // Apagar o conteúdo enquanto o véu está alto tira a corrida entre o commit
    // do Next e o ritmo da faixa. `opacity` (e não `visibility`) para não tirar
    // do ar o foco do teclado nem o conteúdo da árvore de acessibilidade.
    const cover = () => document.documentElement.setAttribute("data-sweeping", "");
    const uncover = () => document.documentElement.removeAttribute("data-sweeping");

    const navigate = (href: string, opts: SweepOptions) =>
      sweep.play(opts, {
        onCover: async () => {
          cover();
          const committed = new Promise<void>((resolve) => {
            // Navegação nova com a anterior ainda pendente: solta a antiga em
            // vez de deixar o `await` dela pendurado para sempre.
            pendingRef.current?.();
            pendingRef.current = resolve;
          });
          router.push(href);
          // Duas vezes de propósito: o Next já rola para o topo no push, mas o
          // Lenis guarda a posição antiga e interpola de volta.
          resetScroll();
          await committed;
          resetScroll();
        },
        onUncover: uncover,
      });

    const onClick = (event: MouseEvent) => {
      if (!enabledRef.current || !sweep.available || sweep.running) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download") || anchor.dataset.noSweep !== undefined) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Mesma página (âncora, query igual): não é troca de rota.
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      event.preventDefault();
      void navigate(url.pathname + url.search + url.hash, { direction: 1 });
    };

    // Voltar/avançar: o navegador já trocou a rota antes de podermos cobrir,
    // então a faixa passa no sentido inverso sobre o conteúdo já trocado.
    const onPopState = () => {
      if (!enabledRef.current || !sweep.available || sweep.running) return;
      // A rota já trocou: nada a cobrir, só a faixa passando por cima.
      void sweep.play({ direction: -1 }, { onCover: async () => {}, onUncover: () => {} });
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      enabledRef.current = false;
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle as number);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] h-full w-full"
      style={{ display: "none" }}
    />
  );
}
