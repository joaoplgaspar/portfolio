import type Lenis from "lenis";

/**
 * Acesso à instância única do Lenis criada por `SmoothScroll`.
 *
 * Existe porque o scroll precisa ser zerado na troca de rota *enquanto o véu
 * da transição cobre a tela* — `window.scrollTo` sozinho briga com o Lenis, que
 * continua interpolando a posição antiga e "puxa" a página de volta.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/** Volta ao topo sem animação. No-op se o Lenis estiver desligado. */
export function resetScroll() {
  const lenis = instance;
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}
