import sizes from "./mocks.json";

/**
 * Capturas de página inteira, no celular, das lojas no ar (scripts/mocks.mjs).
 * Arquivo em public/mocks/<slug>.jpg; medidas em CSS px (a imagem tem o dobro).
 */
export type Mock = { src: string; w: number; h: number };

const table = sizes as Record<string, { w: number; h: number }>;

export function mockOf(slug: string): Mock | undefined {
  const m = table[slug];
  return m ? { src: `/mocks/${slug}.jpg`, ...m } : undefined;
}
