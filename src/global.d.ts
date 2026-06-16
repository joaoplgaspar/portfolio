import type Lenis from "lenis";

declare global {
  interface Window {
    /** instância do Lenis exposta pelo SmoothScroll provider (para scroll programático) */
    __lenis?: Lenis;
  }
}

export {};
