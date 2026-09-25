/** Classe de botão/CTA — peso de checkout (Seção 5.1). Use em Link/a/button. */
export function btn(variant: "primary" | "ghost" = "primary"): string {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[3px] px-6 py-3 font-medium transition-colors duration-200";
  const style =
    variant === "primary"
      ? "bg-accent text-fg hover:bg-accent-lift"
      : "border border-line text-fg hover:border-fg/60 hover:bg-raised";
  return `${base} ${style}`;
}
