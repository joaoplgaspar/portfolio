import type { ReactNode } from "react";

// Transição de página: entrada suave a cada navegação (transform-only = LCP-safe).
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
