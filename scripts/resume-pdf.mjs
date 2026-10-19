// Imprime a página /resume em PDF — o PDF é a página, não um segundo arquivo
// para manter. Rodar sempre que src/data/resume.ts mudar.
// uso: node scripts/resume-pdf.mjs [url-base]   (padrão: http://localhost:3005)
//
// Salva em public/joao-pedro-gaspar-resume.pdf e avisa se passar de uma página.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3005";
const out = "public/joao-pedro-gaspar-resume.pdf";

// Sem o Chromium do Playwright baixado, usa o Chrome ou o Edge da máquina.
async function launch() {
  for (const channel of [undefined, "chrome", "msedge"]) {
    try {
      return await chromium.launch(channel ? { channel } : {});
    } catch {}
  }
  throw new Error("Nenhum navegador: rode `npx playwright install chromium`.");
}

const browser = await launch();
const page = await browser.newPage();
await page.goto(`${base}/resume`, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print", colorScheme: "light" });
await page.evaluate(() => document.fonts.ready);

const buf = await page.pdf({
  path: out,
  format: "Letter",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();

const pages = (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
console.log(`${out} — ${pages} página(s), ${(buf.length / 1024).toFixed(0)} KB`);
if (pages !== 1) {
  console.error("Passou de uma página: corte texto em src/data/resume.ts.");
  process.exitCode = 1;
}
