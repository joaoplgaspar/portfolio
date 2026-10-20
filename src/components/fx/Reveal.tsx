"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal simples via IntersectionObserver (Fase 0 — GSAP entra na Fase 2).
 * Em prefers-reduced-motion a transição vira instantânea pelo CSS global.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const supported = typeof IntersectionObserver !== "undefined";

    const obs = supported
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setShown(true);
              obs?.disconnect();
            }
          },
          { rootMargin: "0px 0px -10% 0px" },
        )
      : null;
    obs?.observe(el);

    // Rede de segurança: o observer depende de o navegador estar pintando.
    // Numa aba que não pinta (janela oculta, alguns headless, bots que
    // renderizam sem rolar) ele nunca dispara e o conteúdo ficaria em
    // `opacity: 0` para sempre — invisível para o leitor e para o Google.
    // Conteúdo escondido por um efeito decorativo é um defeito, não um efeito.
    // Sem suporte a IntersectionObserver não há entrada a animar — mostra já.
    const failsafe = window.setTimeout(
      () => {
        setShown(true);
        obs?.disconnect();
      },
      supported ? 2500 : 0,
    );

    return () => {
      window.clearTimeout(failsafe);
      obs?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(16px)",
        transition:
          "opacity var(--dur-reveal) var(--ease-premium), transform var(--dur-reveal) var(--ease-premium)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
