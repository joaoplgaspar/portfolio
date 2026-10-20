"use client";

import { useSyncExternalStore } from "react";

// Só liga 3D pesado em desktop (lg+) e sem prefers-reduced-motion. SSR-safe.
const WIDE = "(min-width: 1024px)";
const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const a = window.matchMedia(WIDE);
  const b = window.matchMedia(REDUCE);
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
}
function getSnapshot() {
  return window.matchMedia(WIDE).matches && !window.matchMedia(REDUCE).matches;
}
function getServerSnapshot() {
  return false;
}

export function useEnable3D() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
