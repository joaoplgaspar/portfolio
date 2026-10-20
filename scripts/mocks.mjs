// Captura a página inteira de cada loja no ar, no celular, para os mockups.
// uso: node scripts/mocks.mjs [slug]
//
// Lê slug e domínio de src/data/stores.ts (só loja com `domain`, ou seja, no
// ar e conferida), abre em 390 px de largura, rola até o fim para as imagens
// preguiçosas carregarem, dispensa cookie e pop-up, e salva até MAX_H px de
// altura em public/mocks/<slug>.jpg. As medidas vão para src/data/mocks.json,
// que o componente usa para saber quanto rolar.
//
// Só conteúdo público: nada de área logada ou dado de operação.
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const W = 390;
const MAX_H = 3600;

const src = readFileSync("src/data/stores.ts", "utf8");
const TARGETS = [...src.matchAll(/slug: "([^"]+)",[\s\S]*?(?=\n  \{|\n\];)/g)]
  .map((m) => {
    const domain = m[0].match(/domain: "([^"]+)"/)?.[1];
    return domain ? { slug: m[1], url: `https://${domain}` } : null;
  })
  .filter(Boolean);

const DISMISS = [
  "button:has-text('Aceitar')",
  "button:has-text('Aceito')",
  "button:has-text('Concordo')",
  "button:has-text('Entendi')",
  "button:has-text('Fechar')",
  "button:has-text('Não, obrigado')",
  "[aria-label='Fechar']",
  "[aria-label='Close']",
  "[aria-label='Fechar janela']",
  // Pop-up de newsletter (Klaviyo e parecidos): o "x" do formulário.
  "button[aria-label*='close' i]",
  "button[aria-label*='fechar' i]",
  "[class*='close' i]:is(button, a, span, div)[role='button']",
  ".needsclick button[class*='close' i]",
];

// Sem o Chromium do Playwright baixado, usa o Chrome ou o Edge da máquina.
async function launch() {
  for (const channel of [undefined, "chrome", "msedge"]) {
    try {
      return await chromium.launch(channel ? { channel } : {});
    } catch {}
  }
  throw new Error("Nenhum navegador: rode `npx playwright install chromium`.");
}

// Lojas que não rendem captura limpa. O cartão delas fica com a capa normal.
const SKIP = {
  ada: "pop-up de newsletter (Zippy) que reaparece durante a captura de página inteira",
};

const only = process.argv[2];
const list = (only ? TARGETS.filter((t) => t.slug === only) : TARGETS).filter((t) => !SKIP[t.slug]);
mkdirSync("public/mocks", { recursive: true });

const jsonPath = "src/data/mocks.json";
let sizes = {};
try {
  sizes = JSON.parse(readFileSync(jsonPath, "utf8"));
} catch {}

const browser = await launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "pt-BR",
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
});

async function dismiss(page) {
  for (const sel of DISMISS) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(500);
    }
  }
  await page.keyboard.press("Escape").catch(() => {});
}

/**
 * Pop-up que não fecha por botão: esconde a camada fixa que está no centro da
 * tela (modal, fundo escurecido). Cabeçalho fixo fica no topo e não é tocado.
 */
async function hideOverlays(page) {
  await page.evaluate(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const covers = (el) => {
      const r = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
      const h = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      return w * h > vw * vh * 0.3;
    };
    // Sobe do ponto central da tela, atravessando shadow DOM (widgets de
    // pop-up costumam viver lá), até a camada fixa que cobre a tela.
    for (let round = 0; round < 6; round++) {
      let el = document.elementFromPoint(vw / 2, vh / 2);
      let hit = null;
      while (el) {
        const cs = getComputedStyle(el);
        // Fixo no centro da tela é pop-up (o cabeçalho fica no topo). O
        // contêiner do widget pode medir 0×0 com o modal transbordando.
        if (cs.position === "fixed" && (covers(el) || Number(cs.zIndex) > 1000)) hit = el;
        el = el.parentElement ?? el.getRootNode()?.host ?? null;
      }
      if (!hit) break;
      hit.style.setProperty("display", "none", "important");
    }
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  });
}

for (const { slug, url } of list) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(5000);
    await dismiss(page);
    // Rola em passos até MAX_H: imagem preguiçosa só carrega quando aparece.
    for (let y = 0; y <= MAX_H; y += 500) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(350);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await dismiss(page);
    await hideOverlays(page);

    const full = await page.evaluate(() => document.documentElement.scrollHeight);
    const h = Math.min(full, MAX_H);
    await page.screenshot({
      path: `public/mocks/${slug}.jpg`,
      type: "jpeg",
      quality: 70,
      fullPage: true,
      clip: { x: 0, y: 0, width: W, height: h },
    });
    sizes[slug] = { w: W, h };
    console.log(`ok   ${slug} — ${url} (${h}px)`);
  } catch (e) {
    console.log(`FALHOU ${slug}: ${e.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
writeFileSync(jsonPath, JSON.stringify(sizes, null, 2) + "\n");
