// QA visual — screenshot desktop + mobile de uma URL ou arquivo HTML.
// uso: node scripts/screenshot.mjs <url|arquivo.html> [prefixo-de-saida]
// ex.: node scripts/screenshot.mjs http://localhost:3000/ home
//      node scripts/screenshot.mjs preview.html preview
//
// Usa o Chromium pré-instalado do ambiente (PLAYWRIGHT_BROWSERS_PATH), sem baixar nada.
import { chromium } from "playwright";
import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function findChrome() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!existsSync(base)) return undefined;
  const dir = readdirSync(base).find(
    (d) => d.startsWith("chromium-") && !d.includes("headless"),
  );
  return dir ? `${base}/${dir}/chrome-linux/chrome` : undefined;
}

const target = process.argv[2];
const prefix = process.argv[3] || "shot";
if (!target) {
  console.error("uso: node scripts/screenshot.mjs <url|arquivo.html> [prefixo]");
  process.exit(1);
}
const url =
  target.startsWith("http") || target.startsWith("file:")
    ? target
    : "file://" + resolve(target);

const exe = findChrome();
const browser = await chromium.launch(
  exe ? { executablePath: exe, headless: true } : { headless: true },
);

const views = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
];

for (const [name, viewport] of views) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${prefix}-${name}.png`, fullPage: true });
  await ctx.close();
  console.log(`${prefix}-${name}.png`);
}

await browser.close();
