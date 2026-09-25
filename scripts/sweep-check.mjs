// Regressão da transição iridescente — verifica os caminhos de degradação,
// que são justamente os que quebram calado.
// uso: node scripts/sweep-check.mjs [origem] [destino]
//
// 1. prefers-reduced-motion: o clique NÃO é interceptado (navegação nativa,
//    canvas nunca aparece).
// 2. Teclado (Enter no link): a faixa roda igual ao clique, limpa o canvas no
//    fim e zera o scroll.
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

const origin = process.argv[2] || "http://localhost:3000/";
const target = process.argv[3] || "/sobre";
const VIEWPORT = { width: 1280, height: 800 };
const WARMUP = 2500; // deixa o requestIdleCallback compilar o shader

const exe = findChrome();
const browser = await chromium.launch(
  exe ? { executablePath: exe, headless: true } : { headless: true },
);

const canvasState = (page) =>
  page.evaluate(() => {
    const c = document.querySelector("canvas");
    return c ? `${getComputedStyle(c).display} ${c.width}x${c.height}` : "sem canvas";
  });

let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FALHA"} ${label}`);
  if (!ok) failures++;
};

// ── 1. prefers-reduced-motion → navegação nativa ─────────────────────────
{
  const ctx = await browser.newContext({ viewport: VIEWPORT, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(origin, { waitUntil: "load" });
  await page.waitForTimeout(WARMUP);

  const t0 = Date.now();
  await page.locator(`a[href="${target}"]`).first().click();
  await page.waitForURL(`**${target}`, { timeout: 5000 });
  const elapsed = Date.now() - t0;
  const canvas = await canvasState(page);

  check(elapsed < 400, `reduced-motion: navegação nativa (${elapsed}ms, esperado < 400)`);
  check(canvas.startsWith("none"), `reduced-motion: canvas oculto (${canvas})`);
  check(errors.length === 0, `reduced-motion: sem erros de runtime`);
  if (errors.length) console.error(errors.join("\n"));
  await ctx.close();
}

// ── 2. teclado → mesma transição do clique ───────────────────────────────
{
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(origin, { waitUntil: "load" });
  await page.waitForTimeout(WARMUP);

  await page.locator(`a[href="${target}"]`).first().focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const during = await canvasState(page);

  await page.waitForURL(`**${target}`, { timeout: 5000 });
  await page.waitForTimeout(1400);
  const after = await canvasState(page);
  const scrollY = await page.evaluate(() => window.scrollY);

  check(during.startsWith("block"), `teclado: faixa rodando durante (${during})`);
  check(after.startsWith("none"), `teclado: canvas limpo no fim (${after})`);
  check(scrollY === 0, `teclado: scroll zerado na rota nova (scrollY=${scrollY})`);
  check(errors.length === 0, `teclado: sem erros de runtime`);
  if (errors.length) console.error(errors.join("\n"));
  await ctx.close();
}

// ── 3. ritmo constante: rota fria e quente duram o mesmo ─────────────────
// A faixa não pode desacelerar nem parar para esperar o commit do Next — foi
// exatamente esse o defeito das duas primeiras versões.
{
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  await page.goto(origin, { waitUntil: "load" });
  await page.waitForTimeout(WARMUP);

  const measure = async (selector) => {
    await page.evaluate(() => {
      window.__frames = [];
      const c = document.querySelector("canvas");
      const tick = (now) => {
        if (c.style.display === "block") window.__frames.push(now);
        window.__raf = requestAnimationFrame(tick);
      };
      window.__raf = requestAnimationFrame(tick);
    });
    await page.locator(selector).first().click();
    await page.waitForTimeout(2600);
    return page.evaluate(() => {
      cancelAnimationFrame(window.__raf);
      const f = window.__frames;
      return f.length ? Math.round(f[f.length - 1] - f[0]) : 0;
    });
  };

  const cold = await measure(`a[href="${target}"]`);
  const warm = await measure('a[href="/"]');
  const spread = Math.abs(cold - warm);

  check(cold > 900 && cold < 1300, `ritmo: rota fria em ${cold}ms (esperado ~1080)`);
  check(spread < 120, `ritmo: fria x quente diferem ${spread}ms (esperado < 120)`);
  await ctx.close();
}

await browser.close();
process.exit(failures ? 1 : 0);
