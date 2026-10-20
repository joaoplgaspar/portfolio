// Regressão da barra de telemetria — confere que cada campo mostra medição
// real, e não placeholder.
// uso: node scripts/telemetry-check.mjs [url]
import { chromium } from "playwright";
import { readdirSync, existsSync, mkdirSync } from "node:fs";

function findChrome() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!existsSync(base)) return undefined;
  const dir = readdirSync(base).find(
    (d) => d.startsWith("chromium-") && !d.includes("headless"),
  );
  return dir ? `${base}/${dir}/chrome-linux/chrome` : undefined;
}

const url = process.argv[2] || "http://localhost:3005/";
const exe = findChrome();
const browser = await chromium.launch(
  exe ? { executablePath: exe, headless: true } : { headless: true },
);
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FALHA"} ${label}`);
  if (!ok) failures++;
};

await page.goto(url, { waitUntil: "load" });
await page.locator(".tele").scrollIntoViewIfNeeded();
await page.waitForTimeout(2000);

const read = () => page.locator(".tele").innerText();

const first = await read();
const fields = Object.fromEntries(
  [...first.matchAll(/(SÃO PAULO|BUILD|FPS|LCP|GPU)\n([^\n]+)/g)].map((m) => [m[1], m[2]]),
);

check(/^\d{2}:\d{2}:\d{2}$/.test(fields["SÃO PAULO"] || ""), `relógio: ${fields["SÃO PAULO"]}`);
check(/^[0-9a-f]{7}/.test(fields["BUILD"] || ""), `build sha minúsculo: ${fields["BUILD"]}`);

const fps = Number((fields["FPS"] || "").trim());
check(fps >= 20 && fps <= 240, `fps medido e plausível: ${fields["FPS"]}`);

const lcp = Number((fields["LCP"] || "").replace(/[^\d.]/g, ""));
check(lcp > 0 && lcp < 30, `lcp medido: ${fields["LCP"]}`);
check(/^WEBGL2? · DPR/.test(fields["GPU"] || ""), `gpu detectada: ${fields["GPU"]}`);

// O relógio tem que andar.
await page.waitForTimeout(1600);
const second = await read();
check(first !== second, "relógio anda entre duas leituras");

// Sem placeholder visível em nenhum campo.
check(!second.includes("--:--:--"), "nenhum campo em placeholder");

mkdirSync(".qa", { recursive: true });
await page.locator(".tele").screenshot({ path: ".qa/telemetry.png" });
console.log("captura: .qa/telemetry.png");

await browser.close();
process.exit(failures ? 1 : 0);
