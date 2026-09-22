import { Archivo, IBM_Plex_Mono } from "next/font/google";

/**
 * Uma família só, variável em peso E largura. O contraste do sistema vem daí:
 * nome e títulos grandes em peso fino e largura normal, texto pequeno pesado,
 * e a largura (wdth 62–125) como eixo de interação — não um segundo tipo.
 *
 * Mono só onde o texto É código ou identificador (domínio, chave, id de
 * registro) — nunca como rótulo decorativo em caixa alta.
 */
export const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--ff-sans",
  display: "swap",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});
