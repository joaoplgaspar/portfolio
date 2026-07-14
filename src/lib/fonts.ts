import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

/**
 * Fontes da marca (Seção 4 do brief) — self-hosted.
 *   - display: Clash Display (Fontshare)  → 500 Medium, 600 Semibold
 *   - corpo:   Satoshi (Fontshare)        → 400 Regular, 500 Medium, 700 Bold
 *   - mono:    JetBrains Mono (Google)    → 400, 500
 * Os .woff2 de Clash/Satoshi vivem em src/fonts/.
 */
export const display = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--ff-display",
  display: "swap",
});

export const sans = localFont({
  src: [
    { path: "../fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--ff-sans",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});
