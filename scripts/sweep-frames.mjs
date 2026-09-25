// QA da transição iridescente — captura N frames durante uma troca de rota.
// uso: node scripts/sweep-frames.mjs [origem] [destino] [n-frames] [pasta]
// ex.: node scripts/sweep-frames.mjs http://localhost:3000/ /sobre 12 .qa/sweep
//
// Clica no primeiro link interno que aponta para <destino> e fotografa a
// janela a cada ~95 ms. Serve para conferir o ritmo (a faixa cobre mesmo a
// tela no meio?) sem depender de olhar ao vivo.
import { chromium } from "playwright";
import { mkdirSync, readdirSync, existsSync } from "node:fs";

function findChrome() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!existsSync(base)) return undefined;
  const dir = readdirSync(base).find(
    (d) => d.startsWith("chromium-") && !d.includes("headless"),
  );
  return dir ? `${base}/${dir}/chrome-linux/chrome` : undefined;
}

const origin = process.argv[2] || "http://localhost:3000/";
const target = process.argv[3] || "/sobre";
const frames = Number(process.argv[4] || 12);
const outDir = process.argv[5] || ".qa/sweep";
const STEP = 95; // ms entre frames — cobre os ~1.14 s da transição em 12

mkdirSync(outDir, { recursive: true });

const exe = findChrome();
const browser = await chromium.launch(
  exe ? { executablePath: exe, headless: true } : { headless: true },
);
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto(origin, { waitUntil: "load" });
await page.evaluate(() => document.fonts && document.fonts.ready);
// Dá tempo do requestIdleCallback compilar o shader antes de medir o ritmo.
await page.waitForTimeout(2500);

const link = page.locator(`a[href="${target}"]`).first();
await link.waitFor({ state: "visible", timeout: 5000 });
await link.click({ noWaitAfter: true });

for (let i = 0; i < frames; i++) {
  await page.screenshot({ path: `${outDir}/f${String(i).padStart(2, "0")}.png` });
  await page.waitForTimeout(STEP);
}

const landed = page.url();
console.log(`frames em ${outDir}/ · url final: ${landed}`);
if (!landed.includes(target)) console.error(`!! não navegou para ${target}`);
if (errors.length) console.error("!! erros:\n" + errors.join("\n"));

await browser.close();
