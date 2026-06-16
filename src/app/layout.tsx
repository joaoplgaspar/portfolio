import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Nav from "@/components/layout/Nav";
import WorldRail from "@/components/layout/WorldRail";
import Preloader from "@/components/layout/Preloader";
import Atmosphere from "@/components/layout/Atmosphere";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SoundToggle from "@/components/ui/SoundToggle";
import EasterEggFifa from "@/components/ui/EasterEggFifa";
import { siteConfig } from "@/lib/site";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name }],
  keywords: [
    "portfólio",
    "desenvolvedor criativo",
    "front-end",
    "3D",
    "React",
    "Next.js",
    "WebGL",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
  },
  icons: { icon: "/favicon-32x32.png" },
};

export const viewport: Viewport = {
  themeColor: "#04060c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="antialiased">
        <Preloader />
        <ScrollProgress />
        <Nav />
        <WorldRail />
        <Atmosphere />
        <SoundToggle />
        <EasterEggFifa />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
