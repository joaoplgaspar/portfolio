"use client";

import { useSyncExternalStore } from "react";

/**
 * Decide se renderiza 3D pesado: só em telas largas e sem `prefers-reduced-motion`.
 * SSR-safe (server e primeira hidratação retornam false), sem setState-em-effect.
 */
function subscribe(cb: () => void) {
  const wide = window.matchMedia("(min-width: 768px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  wide.addEventListener("change", cb);
  reduce.addEventListener("change", cb);
  return () => {
    wide.removeEventListener("change", cb);
    reduce.removeEventListener("change", cb);
  };
}
function getSnapshot() {
  return (
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
function getServerSnapshot() {
  return false;
}

export function useEnable3D() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
