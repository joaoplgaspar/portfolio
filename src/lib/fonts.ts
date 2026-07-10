import { Bricolage_Grotesque, Manrope, JetBrains_Mono } from "next/font/google";

/**
 * Fontes do sistema (Seção 4 do brief).
 *
 * Marca-alvo: Clash Display (display) + Satoshi (corpo) da Fontshare.
 * A rede deste ambiente bloqueia a Fontshare, então usamos os substitutos
 * mais próximos via next/font/google (self-hosted no build):
 *   - display: Bricolage Grotesque  (≈ Clash Display)
 *   - corpo:   Manrope              (≈ Satoshi)
 *   - mono:    JetBrains Mono       (idêntico ao brief)
 *
 * ── Para os fonts reais da marca ──────────────────────────────────────────
 * Baixe Clash Display (500/600) e Satoshi (400/500/700) da Fontshare,
 * coloque os .woff2 em `src/fonts/` e troque por next/font/local:
 *
 *   import localFont from "next/font/local";
 *   export const display = localFont({
 *     src: [
 *       { path: "../fonts/ClashDisplay-Medium.woff2",   weight: "500" },
 *       { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600" },
 *     ],
 *     variable: "--ff-display", display: "swap",
 *   });
 *   export const sans = localFont({
 *     src: [
 *       { path: "../fonts/Satoshi-Regular.woff2", weight: "400" },
 *       { path: "../fonts/Satoshi-Medium.woff2",  weight: "500" },
 *       { path: "../fonts/Satoshi-Bold.woff2",    weight: "700" },
 *     ],
 *     variable: "--ff-sans", display: "swap",
 *   });
 * ──────────────────────────────────────────────────────────────────────────
 */
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--ff-display",
  display: "swap",
});

export const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-sans",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});
