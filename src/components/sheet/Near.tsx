"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Monta o conteúdo (imagem) só quando ele chega perto da tela.
 *
 * O `loading="lazy"` do navegador começa a baixar imagens que estão até
 * ~2.500 px abaixo da tela, ou seja, a grade "Trabalho selecionado" baixava
 * junto com a primeira dobra e competia com ela. O Lighthouse soma esses
 * downloads ao LCP simulado. Aqui a imagem só existe a `margin` da tela;
 * antes disso fica o `fallback` (a cor da marca, por exemplo).
 */
export default function Near({
  children,
  fallback,
  margin = "400px",
}: {
  children: ReactNode;
  fallback?: ReactNode;
  margin?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, margin]);

  return (
    <span ref={ref} className="absolute inset-0 block">
      {near ? children : fallback}
    </span>
  );
}
