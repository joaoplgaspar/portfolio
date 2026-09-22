// Regressão do minimap do case.
// uso: node scripts/minimap-check.mjs [url-do-case]
//
// Os dois testes que importam pegaram bugs reais na primeira versão:
// - âncora na viewport (um `transform` de matriz identidade num ancestral cria
//   bloco de contenção e o `fixed` passa a rolar junto com a página);
// - traço com cor de verdade (`var()` indefinida vira transparente em silêncio).
import { chromium } from "playwright";
import { readdirSync, existsSync } from "node:fs";

function findChrome() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!existsSync(base)) return undefined;
  const dir = readdirSync(base).find(
    (d) => d.startsWith("chromium-") && !d.includes("headless"),
  );
  return dir ? `${base}/${dir}/chrome-linux/chrome` : undefined;
}

const url = process.argv[2] || "http://localhost:3005/trabalho/livra";
const VIEWPORT = { width: 1440, height: 900 };

let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FALHA"} ${label}`);
  if (!ok) failures++;
};

const exe = findChrome();
const browser = await chromium.launch(
  exe ? { executablePath: exe, headless: true } : { headless: true },
);
const ctx = await browser.newContext({ viewport: VIEWPORT });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(2000);

const shape = await page.evaluate(() => {
  const nav = document.querySelector(".minimap");
  if (!nav) return null;
  const ticks = [...nav.querySelectorAll(".minimap-tick")];
  return {
    inBody: nav.parentElement === document.body,
    ticks: ticks.length,
    headings: ticks.filter((t) => t.tagName === "BUTTON").length,
    transparent: ticks.filter((t) => {
      const bg = getComputedStyle(t).backgroundColor;
      return bg === "rgba(0, 0, 0, 0)" || bg === "transparent";
    }).length,
    labels: [...nav.querySelectorAll(".minimap-label")].map((l) => l.textContent),
  };
});

check(shape !== null, "minimap renderiza no case com corpo rico");
if (shape) {
  check(shape.inBody, "montado no body (fora do wrapper de transição)");
  check(shape.ticks > 0, `${shape.ticks} traços, ${shape.headings} navegáveis`);
  check(shape.transparent === 0, `nenhum traço transparente (${shape.transparent} encontrados)`);
  check(shape.labels.every((l) => l && l.length > 0), "todo heading tem rótulo");
}

// Âncora na viewport: a posição na tela não pode mudar com o scroll.
const trackY = async () => {
  return page.evaluate(() => Math.round(document.querySelector(".minimap-track").getBoundingClientRect().y));
};
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
const top = await trackY();
await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(600);
const mid = await trackY();
check(Math.abs(top - mid) <= 2, `fixo na viewport (y ${top} → ${mid})`);
check(top > 0 && top < VIEWPORT.height, `dentro da tela (y=${top})`);

// O traço aceso tem que acompanhar a leitura.
const activeHeading = async (y) => {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(600);
  return page.evaluate(
    () =>
      [...document.querySelectorAll(".minimap-tick.is-heading.is-active")]
        .pop()
        ?.querySelector(".sr-only")?.textContent ?? null,
  );
};
const early = await activeHeading(1200);
const late = await activeHeading(3000);
check(early !== null && late !== null && early !== late, `acompanha a leitura ("${early}" → "${late}")`);

// Clicar num traço leva ao bloco.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
const before = await page.evaluate(() => window.scrollY);
await page.locator(".minimap-tick.is-heading").nth(3).click();
await page.waitForTimeout(1200);
const after = await page.evaluate(() => window.scrollY);
check(after > before + 200, `clique navega para o bloco (${before} → ${after})`);

check(errors.length === 0, "sem erros de runtime");
if (errors.length) console.error(errors.join("\n"));

await browser.close();
process.exit(failures ? 1 : 0);
