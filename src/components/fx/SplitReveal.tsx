"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal de tipografia com máscara por linha (GSAP SplitText), carregado por
 * import() dinâmico (fora do bundle inicial) e só quando entra na viewport.
 * Use ABAIXO da dobra (define opacity:0 inicial). Reduced-motion → mostra direto.
 */
export default function SplitReveal({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;

    if (reduce) {
      el.style.opacity = "1";
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const obs = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        if (!desktop) {
          // mobile: fade simples, sem GSAP (protege o budget do gate)
          el.style.transition = "opacity 0.7s var(--ease-premium)";
          el.style.opacity = "1";
          return;
        }
        const [{ gsap }, { SplitText }] = await Promise.all([
          import("gsap"),
          import("gsap/SplitText"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(SplitText);
        el.style.opacity = "1";
        const split = new SplitText(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
        });
        cleanup = () => split.revert();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    obs.observe(el);

    return () => {
      cancelled = true;
      obs.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <span ref={ref} className={className} style={{ opacity: 0, display: "block" }}>
      {children}
    </span>
  );
}
