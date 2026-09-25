// Regressão do bloco AGORA.
// uso: node scripts/now-check.mjs [url]
//
// O teste que importa é o de frescor: um bloco chamado "agora" que envelhece
// em silêncio é pior que não existir. Aqui ele falha alto, no CI, em vez de
// ficar mentindo na home.
import { chromium } from "playwright";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const MAX_AGE_DAYS = 120;

function findChrome() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!existsSync(base)) return undefined;
  const dir = readdirSync(base).find(
    (d) => d.startsWith("chromium-") && !d.includes("headless"),
  );
  return dir ? `${base}/${dir}/chrome-linux/chrome` : undefined;
}

const url = process.argv[2] || "http://localhost:3005/";

let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FALHA"} ${label}`);
  if (!ok) failures++;
};

// ── frescor (não precisa de browser) ─────────────────────────────────────
const source = readFileSync("src/data/now.ts", "utf8");
const stamp = /updatedAt:\s*"(\d{4}-\d{2}-\d{2})"/.exec(source)?.[1];
if (!stamp) {
  check(false, "src/data/now.ts: `updatedAt` não encontrado");
} else {
  const ageDays = Math.floor((Date.now() - Date.parse(`${stamp}T12:00:00Z`)) / 86400000);
  check(
    ageDays >= 0 && ageDays <= MAX_AGE_DAYS,
    `frescor: atualizado há ${ageDays} dia(s) (teto ${MAX_AGE_DAYS})`,
  );
}

// ── renderização ─────────────────────────────────────────────────────────
const exe = findChrome();
const browser = await chromium.launch(
  exe ? { executablePath: exe, headless: true } : { headless: true },
);
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

for (const [locale, path, expected] of [
  ["pt", "", "NO EMPREGO"],
  ["en", "en", "DAY JOB"],
]) {
  await page.goto(new URL(path, url).href, { waitUntil: "load" });
  const rows = page.locator(".now-row");
  const count = await rows.count();
  check(count > 0, `${locale}: ${count} entrada(s) renderizada(s)`);
  const text = await page.locator(".now-row").first().innerText();
  check(text.includes(expected), `${locale}: rótulo traduzido (${expected})`);
}

// A entrada com `href` precisa continuar levando ao case.
await page.goto(url, { waitUntil: "load" });
const link = page.locator("a.now-row").first();
check((await link.count()) > 0, "entrada com href vira link");
if (await link.count()) {
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await page.waitForURL("**/trabalho/**", { timeout: 6000 }).catch(() => {});
  check(page.url().includes("/trabalho/"), `link navega para o case (${page.url()})`);
}

check(errors.length === 0, "sem erros de runtime");
if (errors.length) console.error(errors.join("\n"));

await browser.close();
process.exit(failures ? 1 : 0);
