"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

export type IndexItem = {
  slug: string;
  title: string;
  type: string;
  year: number;
};

/** "Product shot" — placeholder em CSS (troca por <img> do Cloudinary quando plugar). */
function Shot({ item }: { item: IndexItem }) {
  return (
    <div className="idx-shot">
      <span className="idx-shot-title">{item.title}</span>
      <span className="idx-shot-meta">
        {item.type} · {item.year}
      </span>
      <span className="idx-shot-bar" />
    </div>
  );
}

/**
 * Índice interativo (assinatura v2). Hover numa linha → preview segue o cursor
 * (gsap.quickTo, sem re-render por mousemove); demais esmaecem. Teclado e
 * reduced-motion → preview ancorado à direita, sem seguir. Mobile → cards inline.
 */
export default function IndexList({ items }: { items: IndexItem[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  const [content, setContent] = useState<number | null>(null); // qual projeto no preview
  const [visible, setVisible] = useState(false);
  const [anchored, setAnchored] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reduceRef.current = reduce;
    if (!fine || reduce) return; // sem cursor-follow: touch ou reduced-motion

    const el = previewRef.current;
    const list = listRef.current;
    if (!el || !list) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      if (disposed) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX + 26);
        yTo(e.clientY - 130);
      };
      list.addEventListener("pointermove", onMove);
      cleanup = () => list.removeEventListener("pointermove", onMove);
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  const enter = (i: number) => {
    setContent(i);
    setVisible(true);
    setAnchored(reduceRef.current);
  };
  const focusRow = (i: number) => {
    setContent(i);
    setVisible(true);
    setAnchored(true);
  };
  const leave = () => setVisible(false);

  return (
    <>
      <ul ref={listRef} className="idx-list" onMouseLeave={leave}>
        {items.map((it, i) => (
          <li key={it.slug}>
            <Link
              href={`/trabalho/${it.slug}`}
              className="idx-row"
              onMouseEnter={() => enter(i)}
              onFocus={() => focusRow(i)}
              onBlur={leave}
            >
              <span className="idx-inline">
                <Shot item={it} />
              </span>
              <span className="idx-title">{it.title}</span>
              <span className="idx-meta">
                <span className="idx-type">{it.type}</span>
                <span className="idx-year">{it.year}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        className={anchored ? "idx-preview anchored" : "idx-preview"}
        data-on={visible}
        aria-hidden
      >
        {content !== null && <Shot key={content} item={items[content]} />}
      </div>
    </>
  );
}
