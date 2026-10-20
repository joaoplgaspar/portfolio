import { Archivo, IBM_Plex_Mono } from "next/font/google";

/**
 * Uma família só, variável em peso. O contraste do sistema vem daí: nome e
 * títulos grandes em peso fino, texto pequeno pesado.
 *
 * O eixo de largura (wdth) saiu em 2026-10: ele triplicava o arquivo
 * (88 → 34 KB) e só servia a um hover. A fonte é pré-carregada e entra na
 * conta do LCP da home; o Lighthouse do CI exige performance ≥ 0,90.
 *
 * Mono só onde o texto É código ou identificador (domínio, chave, id de
 * registro) — nunca como rótulo decorativo em caixa alta.
 */
export const sans = Archivo({
  subsets: ["latin"],
  variable: "--ff-sans",
  display: "swap",
});

// Mono não aparece na primeira tela: sem pré-carregar, ela não disputa a
// banda com o que aparece primeiro.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
  preload: false,
});
