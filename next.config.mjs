import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { execSync } from "node:child_process";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Hash do commit em build time, para a barra de telemetria.
 * Na Vercel vem do ambiente; local, do git. Se nenhum dos dois responder, a
 * barra simplesmente não mostra o campo — nunca um valor inventado.
 */
function buildSha() {
  const fromCi = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromCi) return fromCi.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Um segundo servidor de dev (o de verificação) usa outra pasta: dois
  // servidores na mesma .next/dev sobrescrevem o estado um do outro e as
  // rotas dinâmicas passam a dar 404.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_SHA: buildSha(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  // Fixa a raiz do workspace (ignora lockfiles em pastas-pai).
  turbopack: { root: projectRoot },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
  // As rotas eram em português até 2026-10. Link antigo já compartilhado
  // (currículo, LinkedIn, e-mail) cai na rota nova em vez de dar 404.
  async redirects() {
    const moved = { trabalho: "work", projetos: "projects", sobre: "about", contato: "contact" };
    return Object.entries(moved).flatMap(([from, to]) => [
      { source: `/${from}/:path*`, destination: `/${to}/:path*`, permanent: true },
      { source: `/pt/${from}/:path*`, destination: `/pt/${to}/:path*`, permanent: true },
    ]);
  },
};

export default withNextIntl(nextConfig);
