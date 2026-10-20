import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

/**
 * Imagem de compartilhamento (LinkedIn, WhatsApp, Slack…): a marca ".jpg" no
 * tema Grafite, a frase de posicionamento e o endereço. Fontes e logo vêm do
 * repositório (assets/fonts, public/brand), gerados por scripts/brand.
 */
export const alt = "João Pedro Gaspar — Shopify front-end engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: { line1: "Shopify stores, end to end.", line2: "Liquid and headless.", role: "Front-end engineer for Shopify" },
  pt: { line1: "Lojas Shopify inteiras.", line2: "Liquid e headless.", role: "Engenheiro front-end Shopify" },
} as const;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = COPY[locale === "pt" ? "pt" : "en"];
  const root = process.cwd();
  const [light, bold, logo] = await Promise.all([
    readFile(join(root, "assets/fonts/archivo-300.ttf")),
    readFile(join(root, "assets/fonts/archivo-600.ttf")),
    readFile(join(root, "public/brand/jpg-logo-dark.svg"), "utf8"),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1b1a17",
          color: "#ede8de",
          padding: "72px 80px",
          fontFamily: "Archivo",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={196} height={115} alt="" style={{ objectFit: "contain", objectPosition: "left" }} />
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 300, lineHeight: 1.04, letterSpacing: -2.5 }}>
          <span>{t.line1}</span>
          <span>{t.line2}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26, fontWeight: 600, color: "#b7b1a4" }}>
          <span>João Pedro Gaspar · {t.role}</span>
          <span>{new URL(siteConfig.url).host}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: light, weight: 300, style: "normal" },
        { name: "Archivo", data: bold, weight: 600, style: "normal" },
      ],
    },
  );
}
