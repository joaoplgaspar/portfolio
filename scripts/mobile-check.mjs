// Harness de celular — varre as rotas em larguras de telefone e aponta tudo o
// que vaza para fora da tela (o que faz a página "andar de lado" no dedo).
// uso: node scripts/mobile-check.mjs [origem] [--widths=320,375,414] [--only=/about,/work/x]
// ex.: node scripts/mobile-check.mjs http://localhost:3005
//
// Para cada rota × largura:
// 1. rola a página até o fim (monta o que é preguiçoso) e volta ao topo;
// 2. lista os elementos que passam da borda direita/esquerda e que nenhum
//    ancestral recorta (só o mais externo de cada galho, para não repetir);
// 3. confere se o documento não rola na horizontal.
// Depois testa o menu: abre, ocupa a tela toda, tem botão de fechar dentro,
// anima (não aparece de estalo) e fecha no Esc.
// Falhas geram print em .qa/mobile/.
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

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const origin = (args.find((a) => !a.startsWith("--")) || "http://localhost:3005").replace(/\/$/, "");
const WIDTHS = (flag("widths") || "320,375,414").split(",").map(Number);
const ONLY = flag("only")?.split(",");
const STATIC = ["/", "/projects", "/about", "/resume", "/contact", "/lab", "/pt"];
const OUT = ".qa/mobile";
mkdirSync(OUT, { recursive: true });

// Sem o Chromium do Playwright baixado (Windows, máquina nova), cai no Chrome
// ou no Edge do sistema em vez de exigir `npx playwright install`.
async function launch() {
  const exe = findChrome();
  if (exe) return chromium.launch({ executablePath: exe, headless: true });
  for (const opts of [{}, { channel: "chrome" }, { channel: "msedge" }]) {
    try {
      return await chromium.launch({ headless: true, ...opts });
    } catch {}
  }
  throw new Error("nenhum Chromium encontrado — rode `npx playwright install chromium`");
}
const browser = await launch();
const context = (width) =>
  browser.newContext({
    viewport: { width, height: 800 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FALHA"} ${label}`);
  if (!ok) failures++;
  return ok;
};

// Rotas: as fixas + todo case e projeto que a home e o índice linkam.
async function discover() {
  const ctx = await context(1280);
  const page = await ctx.newPage();
  const found = new Set(STATIC);
  for (const path of ["/", "/projects"]) {
    await page.goto(origin + path, { waitUntil: "load" });
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
    for (const h of hrefs) if (/^\/(work|projects)\/[^/#?]+$/.test(h)) found.add(h);
  }
  await ctx.close();
  return [...found];
}

/** Desce a página em passos para montar imagens e blocos preguiçosos. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

/** Elementos que passam da tela sem que nenhum ancestral os recorte. */
const findLeaks = () => {
  const vw = document.documentElement.clientWidth;
  const clips = (el) => {
    const s = getComputedStyle(el);
    return s.overflowX !== "visible" || s.clipPath !== "none" || s.contain.includes("paint");
  };
  const leaks = (el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    if (r.right <= vw + 1 && r.left >= -1) return false;
    // recortado por um ancestral? A folha (main.sheet) e o body cortam tudo
    // de propósito, como rede de segurança — esses não contam.
    for (let p = el.parentElement; p && p !== document.body && !p.matches("main.sheet"); p = p.parentElement) {
      if (clips(p)) {
        const pr = p.getBoundingClientRect();
        if (pr.right <= vw + 1 && pr.left >= -1) return false;
      }
    }
    return true;
  };
  const describe = (el) => {
    const r = el.getBoundingClientRect();
    const cls = (el.getAttribute("class") || "").split(/\s+/).slice(0, 4).join(".");
    const text = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("src") || "")
      .replace(/\s+/g, " ")
      .slice(0, 50);
    return `<${el.tagName.toLowerCase()}${cls ? "." + cls : ""}> ${Math.round(r.left)}→${Math.round(r.right)} (tela ${vw}) "${text}"`;
  };
  const out = [];
  for (const el of document.body.querySelectorAll("*")) {
    // moldura e retícula do mouse são fixas e decorativas (a retícula liga no
    // Chromium do Playwright, que não emula `pointer: coarse`)
    if (el.closest(".sheet-frame, .sheet-cursor, script, style, noscript")) continue;
    if (!leaks(el)) continue;
    // só o mais externo: se o pai também vaza, ele já foi contado
    if (el.parentElement && el.parentElement !== document.body && leaks(el.parentElement)) continue;
    out.push(describe(el));
  }
  // Rolagem lateral real: o que o dedo sente, mesmo com overflow-x no body.
  scrollTo(50, 0);
  const sx = scrollX;
  scrollTo(0, 0);
  return { out, sx, sw: document.documentElement.scrollWidth, vw };
};

const routes = ONLY ?? (await discover());
console.log(`${routes.length} rotas × ${WIDTHS.join("/")}px\n`);

for (const width of WIDTHS) {
  const ctx = await context(width);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  for (const route of routes) {
    await page.goto(origin + route, { waitUntil: "load" });
    await settle(page);
    const { out, sx, sw, vw } = await page.evaluate(findLeaks);
    // No celular a página não rola de lado: ela "abre" a tela (o layout fica
    // mais largo e o navegador afasta o zoom). Por isso a largura conta tanto
    // quanto o scrollX.
    const ok = check(
      !out.length && sx === 0 && sw <= vw,
      `${width}px ${route} — ${out.length} vazando, scrollX=${sx}, largura ${sw}/${vw}`,
    );
    if (!ok) {
      out.slice(0, 8).forEach((l) => console.log(`        ${l}`));
      if (out.length > 8) console.log(`        … +${out.length - 8}`);
      const name = `${width}-${route.replace(/\//g, "_") || "_"}.png`;
      await page.screenshot({ path: `${OUT}/${name}`, fullPage: true });
    }
  }

  // ── menu ───────────────────────────────────────────────────────────────
  await page.goto(origin + "/", { waitUntil: "load" });
  await page.waitForTimeout(300);
  const toggle = page.locator('button[aria-controls="sheet-menu"]');
  await toggle.click();
  // logo depois do toque, o menu tem de estar em transição (senão aparece de estalo)
  const animating = () =>
    page.evaluate(() => {
      const m = document.getElementById("sheet-menu");
      return m ? m.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length : -1;
    });
  await page.waitForTimeout(60);
  const opening = await animating();
  await page.waitForTimeout(700);
  const menu = await page.evaluate(() => {
    const m = document.getElementById("sheet-menu");
    if (!m) return null;
    const r = m.getBoundingClientRect();
    const close = m.querySelector("button[data-menu-close]");
    return {
      opacity: Number(getComputedStyle(m).opacity),
      top: r.top,
      bottom: r.bottom,
      vh: innerHeight,
      close: !!close && close.getBoundingClientRect().height > 0,
      scrollLocked: getComputedStyle(document.documentElement).overflow === "hidden",
    };
  });
  check(!!menu, `${width}px menu: abre`);
  if (menu) {
    check(opening > 0, `${width}px menu: entra animado (${opening} transições rodando aos 60ms)`);
    check(menu.opacity === 1, `${width}px menu: termina visível`);
    // vai até o pé da moldura (--pad acima da borda da tela, no máx. 16px)
    check(menu.bottom >= menu.vh - 17, `${width}px menu: altura cheia (${Math.round(menu.top)}→${Math.round(menu.bottom)} de ${menu.vh})`);
    check(menu.close, `${width}px menu: botão de fechar dentro do menu`);
    check(menu.scrollLocked, `${width}px menu: trava a rolagem da página`);
    const { out } = await page.evaluate(findLeaks);
    check(!out.length, `${width}px menu: nada vazando`);
    if (out.length) out.forEach((l) => console.log(`        ${l}`));
    if (!menu.close || menu.bottom < menu.vh - 17) await page.screenshot({ path: `${OUT}/${width}-menu.png` });

    const isGone = () =>
      page.evaluate(() => {
        const m = document.getElementById("sheet-menu");
        return !m || getComputedStyle(m).visibility === "hidden" || Number(getComputedStyle(m).opacity) === 0;
      });

    // o fechar de dentro do menu: anima a saída e devolve o foco ao botão do cabeçalho
    await page.locator("#sheet-menu button[data-menu-close]").click();
    await page.waitForTimeout(60);
    const closing = await animating();
    await page.waitForTimeout(700);
    check(closing > 0, `${width}px menu: sai animado (${closing} transições rodando aos 60ms)`);
    check(await isGone(), `${width}px menu: fecha pelo botão de dentro`);
    const focus = await page.evaluate(() => document.activeElement?.getAttribute("aria-controls"));
    check(focus === "sheet-menu", `${width}px menu: foco volta ao botão do cabeçalho`);

    await toggle.click();
    await page.waitForTimeout(700);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    check(await isGone(), `${width}px menu: fecha no Esc`);
    const unlocked = await page.evaluate(() => getComputedStyle(document.documentElement).overflow !== "hidden");
    check(unlocked, `${width}px menu: devolve a rolagem`);
  }

  check(errors.length === 0, `${width}px sem erros de runtime`);
  if (errors.length) console.error(errors.slice(0, 5).join("\n"));
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} falha(s) — prints em ${OUT}/` : "\ntudo certo");
process.exit(failures ? 1 : 0);
