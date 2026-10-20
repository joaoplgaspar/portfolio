// Captura as capas dos cases a partir das vitrines públicas dos clientes.
// uso: node scripts/covers.mjs [slug]
//
// Salva em public/covers/<slug>.jpg (1440x900, viewport — o topo da loja).
// Só toca em conteúdo público; nada de área logada ou dado de operação.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const TARGETS = [
  { slug: "roland", url: "https://store.roland.com.br" },
  { slug: "boss", url: "https://store.bossmusic.com.br" },
  { slug: "integralmedica", url: "https://www.integralmedica.com.br" },
  { slug: "darkness", url: "https://darkness.com.br" },
  { slug: "oficina-de-inverno", url: "https://oficinadeinverno.com.br" },
  { slug: "uv-line", url: "https://www.uvline.com.br" },
  { slug: "fujifilm", url: "https://loja.fujifilm.com.br" },
  { slug: "qix", url: "https://qixskateshop.com.br" },
  { slug: "dux", url: "https://duxhumanhealth.com" },
  { slug: "ada", url: "https://adanutraceuticos.com.br" },
  { slug: "iron-studios", url: "https://ironstudios.com.br" },
  { slug: "yosen", url: "https://www.yosen.com.br" },
  { slug: "casa-francis", url: "https://francis.com.br" },
  { slug: "baianao", url: "https://baianao.com.br" },
  { slug: "montecristo", url: "https://montecristo.com.br" },
  { slug: "rocinante", url: "https://www.tresselosrocinante.com" },
];

// Banners de cookie / pop-up de newsletter atrapalham a capa. Tenta dispensar.
const DISMISS = [
  "button:has-text('Aceitar')",
  "button:has-text('Aceito')",
  "button:has-text('Concordo')",
  "button:has-text('Entendi')",
  "button:has-text('Fechar')",
  "[aria-label='Fechar']",
  "[aria-label='Close']",
];

const only = process.argv[2];
const list = only ? TARGETS.filter((t) => t.slug === only) : TARGETS;
mkdirSync("public/covers", { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  locale: "pt-BR",
});

for (const { slug, url } of list) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    // Deixa fontes, imagens e o carrossel do hero assentarem.
    await page.waitForTimeout(6000);

    for (const sel of DISMISS) {
      const el = page.locator(sel).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(600);
      }
    }
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: `public/covers/${slug}.jpg`,
      type: "jpeg",
      quality: 82,
    });
    console.log(`ok   ${slug} — ${url}`);
  } catch (e) {
    console.log(`FALHOU ${slug}: ${e.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
