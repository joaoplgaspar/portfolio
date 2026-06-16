/** Rola suavemente até uma seção usando o Lenis (com fallback nativo). */
export function goTo(id: string) {
  if (typeof window === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
