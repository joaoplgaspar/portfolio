// Gera a marca ".jpg" em todos os formatos, a partir dos contornos em
// glyphs.json (gerados por glyphs.py com a Archivo). Nada depende de fonte
// instalada: o texto já é desenho.
//
// uso: node scripts/brand/build.mjs
//
// Saída
//   public/brand/  logo (claro/escuro) em SVG, PNG e JPG; assinatura com nome;
//                  avatar 400×400 (PNG e JPG)
//   public/        icon.svg, favicon.ico (16/32/48), apple-touch-icon.png
//                  (180), icon-192.png, icon-512.png
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const G = JSON.parse(readFileSync(new URL("./glyphs.json", import.meta.url), "utf8"));
// Duas casas decimais bastam (o desenho mede ~100 px): SVG 3× menor.
for (const g of Object.values(G)) g.d = g.d.replace(/-?\d+\.\d+/g, (n) => String(+(+n).toFixed(2)));

// Cores do sistema Folha.
const C = {
  paper: "#ecebe6",
  ink: "#151412",
  signal: "#7c2d2d",
  graphite: "#1b1a17",
  chalk: "#ede8de",
  signalDark: "#c4524a",
};

/**
 * A marca: um ponto em sinal na linha de base e "jpg" logo depois, como uma
 * extensão de arquivo. Coordenadas locais com a linha de base em y = 0.
 */
function mark({ word = G.word, text, dot }) {
  const d = { cx: 9, cy: -8, r: 9 };
  const tx = 23;
  const box = { x0: 0, y0: word.bbox[1], x1: tx + word.bbox[2], y1: word.bbox[3] };
  const body = `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="${dot}"/><path transform="translate(${tx} 0)" d="${word.d}" fill="${text}"/>`;
  return { body, box };
}

/** Envolve um desenho num SVG com folga `pad` (fração da altura). */
function svg({ body, box }, { pad = 0, bg } = {}) {
  const w = box.x1 - box.x0;
  const h = box.y1 - box.y0;
  const p = h * pad;
  const vb = [box.x0 - p, box.y0 - p, w + 2 * p, h + 2 * p].map((v) => +v.toFixed(2));
  const rect = bg ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}" role="img" aria-label="jpg — João Pedro Gaspar">${rect}${body}</svg>`;
}

/** Assinatura: a marca e, ao lado, nome e cargo. */
function lockup(theme) {
  const m = mark(theme);
  const gap = 28;
  const nx = m.box.x1 + gap;
  // nome alinhado ao topo das minúsculas do "jpg"; cargo abaixo dele
  const nameY = -10;
  const roleY = 14;
  const body =
    m.body +
    `<path transform="translate(${nx} ${nameY})" d="${G.name.d}" fill="${theme.text}"/>` +
    `<path transform="translate(${nx} ${roleY})" d="${G.role.d}" fill="${theme.muted}"/>`;
  const box = {
    x0: 0,
    y0: Math.min(m.box.y0, nameY + G.name.bbox[1]),
    x1: nx + Math.max(G.name.bbox[2], G.role.bbox[2]),
    y1: Math.max(m.box.y1, roleY + G.role.bbox[3]),
  };
  return { body, box };
}

/** Favicon (32×32): placa de tinta, o ponto em sinal e um "j" em papel. */
function icon({ radius = 7, scale = 1, size = 32 } = {}) {
  const j = G.j;
  const k = scale;
  const o = (size - 32 * k) / 2;
  const g = `<g transform="translate(${o} ${o}) scale(${k})"><circle cx="10.5" cy="20.5" r="3.5" fill="${C.signalDark}"/><path transform="translate(20.7 22.5)" d="${j.d}" fill="${C.paper}"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${C.ink}"/>${g}</svg>`;
}

const LIGHT = { text: C.ink, dot: C.signal, muted: "#56534c" };
const DARK = { text: C.chalk, dot: C.signalDark, muted: "#b7b1a4" };

mkdirSync("public/brand", { recursive: true });
const out = (p, data) => {
  writeFileSync(p, data);
  console.log("ok", p);
};
const raster = (svgText, width) => sharp(Buffer.from(svgText), { density: 600 }).resize({ width });

// Logo: vetor transparente, PNG transparente e JPG com fundo do tema.
for (const [name, theme, bg] of [
  ["jpg-logo", LIGHT, C.paper],
  ["jpg-logo-dark", DARK, C.graphite],
]) {
  const m = mark(theme);
  out(`public/brand/${name}.svg`, svg(m));
  out(`public/brand/${name}.png`, await raster(svg(m, { pad: 0.12 }), 1600).png().toBuffer());
  out(`public/brand/${name}.jpg`, await raster(svg(m, { pad: 0.6, bg }), 2000).jpeg({ quality: 92 }).toBuffer());
}

// Assinatura com nome e cargo.
for (const [name, theme, bg] of [
  ["jpg-assinatura", LIGHT, C.paper],
  ["jpg-assinatura-dark", DARK, C.graphite],
]) {
  const l = lockup(theme);
  out(`public/brand/${name}.svg`, svg(l));
  out(`public/brand/${name}.png`, await raster(svg(l, { pad: 0.2 }), 2000).png().toBuffer());
  out(`public/brand/${name}.jpg`, await raster(svg(l, { pad: 0.5, bg }), 2400).jpeg({ quality: 92 }).toBuffer());
}

// Avatar 400×400 (LinkedIn, GitHub): papel e a marca no peso 400, que segura
// melhor em tamanho pequeno. As redes recortam em círculo: a marca cabe nele.
{
  const m = mark({ word: G.word400, ...LIGHT });
  const w = m.box.x1 - m.box.x0;
  const h = m.box.y1 - m.box.y0;
  const side = w / 0.62;
  const x = m.box.x0 - (side - w) / 2;
  const y = m.box.y0 - (side - h) / 2 - h * 0.04;
  const sq = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${side} ${side}"><rect x="${x}" y="${y}" width="${side}" height="${side}" fill="${C.paper}"/>${m.body}</svg>`;
  out("public/brand/avatar-400.png", await sharp(Buffer.from(sq), { density: 600 }).resize(400, 400).png().toBuffer());
  out("public/brand/avatar-400.jpg", await sharp(Buffer.from(sq), { density: 600 }).resize(400, 400).jpeg({ quality: 92 }).toBuffer());
}

// Ícones.
out("public/icon.svg", icon());
const png = (svgText, s) => sharp(Buffer.from(svgText), { density: 600 }).resize(s, s).png().toBuffer();
// iOS arredonda sozinho: placa sem raio e a marca com folga.
out("public/apple-touch-icon.png", await png(icon({ radius: 0, scale: 0.8 }), 180));
// Android/PWA: "maskable" corta até 20% das bordas, então a marca vai em 80%.
out("public/icon-192.png", await png(icon({ radius: 0, scale: 0.8 }), 192));
out("public/icon-512.png", await png(icon({ radius: 0, scale: 0.8 }), 512));

// favicon.ico com 16, 32 e 48 (PNG dentro do ICO).
{
  const sizes = [16, 32, 48];
  const imgs = await Promise.all(sizes.map((s) => png(icon(), s)));
  const head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(sizes.length, 4);
  let offset = head.length;
  sizes.forEach((s, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(s, e);
    head.writeUInt8(s, e + 1);
    head.writeUInt8(0, e + 2);
    head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(imgs[i].length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += imgs[i].length;
  });
  out("public/favicon.ico", Buffer.concat([head, ...imgs]));
}
