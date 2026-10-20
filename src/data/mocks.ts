import sizes from "./mocks.json";

/**
 * Capturas de página inteira, no celular, das lojas no ar (scripts/mocks.mjs).
 * Arquivo em public/mocks/<slug>.jpg; medidas em CSS px (a imagem tem o dobro).
 */
export type Shot = { src: string; w: number; h: number };
/** Celular (sempre) e, quando a captura existe, a mesma página no desktop. */
export type Mock = Shot & { desktop?: Shot };

type Row = { w: number; h: number; desktop?: { w: number; h: number } };
const table = sizes as Record<string, Row>;

export function mockOf(slug: string): Mock | undefined {
  const m = table[slug];
  if (!m) return undefined;
  return {
    src: `/mocks/${slug}.jpg`,
    w: m.w,
    h: m.h,
    desktop: m.desktop && { src: `/mocks/${slug}-desktop.webp`, ...m.desktop },
  };
}
