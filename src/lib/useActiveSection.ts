"use client";

import { useEffect, useState } from "react";
import { navItems, type WorldId } from "@/lib/site";

/** Observa as seções e retorna o id da que está ativa (centro da viewport). */
export function useActiveSection(): WorldId {
  const [active, setActive] = useState<WorldId>(navItems[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id as WorldId);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const { id } of navItems) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}
