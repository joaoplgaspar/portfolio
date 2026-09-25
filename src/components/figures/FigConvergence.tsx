"use client";

import { Fig, HIDDEN, Hatch, Leader, Part, useSafeId, type FigProps } from "./parts";
import { Note, Show, Travel, useSeq, type Step } from "./sequence";

/**
 * FIG — LIVRA. Quatro das seis fontes de catálogo convergindo numa obra.
 *
 * 10 Google Books · 12 Apple Books · 14 CBL · 16 Open Library
 * 18 reconciliação obra × edição · 20 registro canônico
 * 22 ISBN pelo código de barras · 24 cache que nunca guarda []
 */

export const STEPS: Step[] = [
  {
    dur: 3.2,
    on: [22],
    caption: {
      en: "A barcode is read on the phone (22): ZXing, local, zero cost. Multimodal AI only reads the cover when there's no barcode.",
      pt: "O código de barras é lido no aparelho (22): ZXing, local, custo zero. IA multimodal só lê a capa quando não há código.",
    },
  },
  {
    dur: 3,
    on: [24],
    caption: {
      en: "Cache first (24), with a TTL per source: 5 min for ISBN, 24 h for text, 7 days for CBL.",
      pt: "Cache primeiro (24), com TTL por fonte: 5 min para ISBN, 24 h para texto, 7 dias para a CBL.",
    },
  },
  {
    dur: 3,
    on: [10, 12, 14, 16],
    caption: {
      en: "On a miss, up to six sources are asked in parallel. Four of them are drawn here.",
      pt: "Sem cache, até seis fontes são consultadas em paralelo. Quatro estão desenhadas aqui.",
    },
  },
  {
    dur: 3.8,
    on: [10, 12, 14, 16],
    caption: {
      en: "Each one is wrong in its own way: no page count in search (10), no publisher (12), the catalog card served as cover (14), sparse (16).",
      pt: "Cada uma erra do seu jeito: sem nº de páginas na busca (10), sem editora (12), a ficha catalográfica como capa (14), esparsa (16).",
    },
  },
  {
    dur: 3.4,
    on: [18],
    caption: {
      en: "Reconciliation (18) takes each field from the source trusted for it. apple-X, google-Y and isbn:Z converge on one work.",
      pt: "A reconciliação (18) pega cada campo da fonte confiável para ele. apple-X, google-Y e isbn:Z convergem numa obra.",
    },
  },
  {
    dur: 3,
    on: [20],
    caption: {
      en: "One canonical record (20). Reviews are keyed by work, not edition, so every edition shares them.",
      pt: "Um registro canônico (20). Resenhas são chaveadas por obra, não por edição, e todas as edições as compartilham.",
    },
  },
  {
    dur: 3.4,
    on: [24],
    caption: {
      en: "Then it's cached, unless it's empty. A failing source returning [] would hide the book for the whole TTL.",
      pt: "Depois vai para o cache, a não ser que esteja vazio. Uma fonte falhando com [] esconderia o livro pelo TTL inteiro.",
    },
  },
];

const Y = [64, 158, 252, 346];

type Cover = "thumb" | "hires" | "wrong" | "none";
const SOURCES: { n: number; cover: Cover; missing: number; defect: string }[] = [
  { n: 10, cover: "thumb", missing: 2, defect: "pages: —" },
  { n: 12, cover: "hires", missing: 1, defect: "publisher: —" },
  { n: 14, cover: "wrong", missing: -1, defect: "cover = catalog card" },
  { n: 16, cover: "none", missing: 1, defect: "sparse" },
];

function Card({ y, cover, missing, hatch, flag }: { y: number; cover: Cover; missing: number; hatch: string; flag: boolean }) {
  const x = 40;
  const lines = [96, 78, 52];
  return (
    <g>
      <rect x={x} y={y} width={170} height={62} className="draw" pathLength={1} />
      {lines.map((w, i) =>
        i === missing ? (
          <line
            key={i}
            x1={x + 12}
            y1={y + 18 + i * 13}
            x2={x + 12 + w}
            y2={y + 18 + i * 13}
            strokeDasharray={HIDDEN}
            strokeWidth={0.9}
            className="late"
            style={{ stroke: flag ? "var(--accent)" : undefined }}
          />
        ) : (
          <line key={i} x1={x + 12} y1={y + 18 + i * 13} x2={x + 12 + w} y2={y + 18 + i * 13} className="draw" pathLength={1} />
        ),
      )}
      {cover === "hires" && (
        <>
          <rect x={x + 124} y={y + 9} width={34} height={44} fill={`url(#${hatch})`} stroke="none" className="late" />
          <rect x={x + 124} y={y + 9} width={34} height={44} className="draw" pathLength={1} />
        </>
      )}
      {cover === "thumb" && <rect x={x + 136} y={y + 25} width={16} height={21} className="draw" pathLength={1} />}
      {cover === "wrong" && (
        <g>
          <rect x={x + 124} y={y + 9} width={34} height={44} className="draw" pathLength={1} />
          <path d={`M${x + 129} ${y + 19} h24 M${x + 129} ${y + 26} h18 M${x + 129} ${y + 33} h22`} strokeWidth={0.7} className="late" />
          <path d={`M${x + 120} ${y + 5} L${x + 162} ${y + 57}`} stroke="var(--accent)" strokeWidth={1.4} className="late" />
        </g>
      )}
      {cover === "none" && <rect x={x + 124} y={y + 9} width={34} height={44} strokeDasharray="3 3" strokeWidth={0.9} className="late" />}
    </g>
  );
}

export default function FigConvergence({ lit, draw = true, title }: FigProps) {
  const hatch = useSafeId("h");
  const { step } = useSeq();
  const MX = 452;
  const MY = 250;
  const curves = Y.map((y) => `M210 ${y + 31} C330 ${y + 31} 350 ${MY} ${MX - 26} ${MY}`);
  const out = `M${MX + 26} ${MY} L578 ${MY}`;
  const isbn = `M${MX} 96 L${MX} ${MY - 26}`;
  const cache = `M${MX} ${MY + 26} L${MX} 376`;
  const filled = step >= 5 || step < 0;

  return (
    <Fig title={title} draw={draw} lit={lit}>
      <defs>
        <Hatch id={hatch} gap={4} />
      </defs>

      {SOURCES.map((s, i) => (
        <Part key={s.n} n={s.n}>
          <Card y={Y[i]} cover={s.cover} missing={s.missing} hatch={hatch} flag={step === 3} />
        </Part>
      ))}
      {curves.map((d) => (
        <path key={d} d={d} className="draw" pathLength={1} />
      ))}

      <Part n={22}>
        <g className="late">
          {[0, 3, 5, 9, 11, 12, 16, 19, 21, 24, 27, 28, 31, 35, 37, 40, 43, 44, 48, 51, 53, 56].map((o, i) => (
            <line
              key={o}
              x1={MX - 30 + o}
              y1={44}
              x2={MX - 30 + o}
              y2={i % 5 === 0 ? 90 : 84}
              strokeWidth={i % 3 === 0 ? 2 : 1}
              strokeLinecap="butt"
            />
          ))}
        </g>
      </Part>
      <path d={isbn} strokeDasharray={HIDDEN} className="late" />

      <Part n={18}>
        <circle cx={MX} cy={MY} r={26} strokeWidth={1.6} className="draw" pathLength={1} />
        <circle cx={MX} cy={MY} r={9} className="draw" pathLength={1} />
        <path d={`M${MX - 36} ${MY} h14 M${MX + 22} ${MY} h14 M${MX} ${MY - 36} v14 M${MX} ${MY + 22} v14`} strokeWidth={0.9} className="late" />
      </Part>

      <path d={out} strokeWidth={2.2} className="draw" pathLength={1} />

      <Part n={20}>
        <rect x={578} y={172} width={182} height={156} strokeWidth={1.6} className="draw" pathLength={1} />
        {/* Antes da reconciliação o registro existe só como contorno. */}
        <g style={{ opacity: filled ? 1 : 0.18, transition: "opacity 500ms" }}>
          <rect x={594} y={188} width={52} height={70} fill={`url(#${hatch})`} stroke="none" className="late" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={660} y1={196 + i * 15} x2={660 + [84, 70, 58, 76][i]} y2={196 + i * 15} className="draw" pathLength={1} />
          ))}
        </g>
        <rect x={594} y={188} width={52} height={70} className="draw" pathLength={1} />
        <line x1={594} y1={278} x2={744} y2={278} strokeWidth={0.9} className="draw" pathLength={1} />
        <text x={594} y={298} className="code late" stroke="none">
          work/torto-arado
        </text>
        <text x={594} y={314} className="code late" stroke="none">
          ← apple · google · isbn
        </text>
      </Part>

      <line x1={MX} y1={MY + 36} x2={MX} y2={372} className="draw" pathLength={1} />
      <Part n={24}>
        <ellipse cx={MX} cy={380} rx={40} ry={8} className="draw" pathLength={1} />
        <path d={`M${MX - 40} 380 V414 A40 8 0 0 0 ${MX + 40} 414 V380`} className="draw" pathLength={1} />
        <text x={MX} y={404} textAnchor="middle" className="code late" stroke="none">
          ≠ []
        </text>
      </Part>

      {/* trânsito */}
      <Travel step={0} d={isbn} />
      <Travel step={1} d={cache} to={0.5} />
      <Travel step={1} d={cache} from={0.5} reverse />
      {curves.map((d, i) => (
        <Travel key={`o${i}`} step={2} d={d} reverse from={i * 0.06} to={0.7 + i * 0.06} />
      ))}
      {curves.map((d, i) => (
        <Travel key={`i${i}`} step={3} d={d} from={0.3 + i * 0.08} to={0.75 + i * 0.06} />
      ))}
      <Travel step={5} d={out} r={4.4} signal />
      <Travel step={6} d={cache} r={4} signal />

      {/* anotações */}
      <Note at={[0]} x={MX + 40} y={120}>ZXing · on device</Note>
      <Note at={[1]} x={MX + 50} y={362}>miss · TTL 5m / 24h / 7d</Note>
      <Note at={[2]} x={300} y={40} anchor="middle">6 sources · in parallel</Note>
      {SOURCES.map((s, i) => (
        <Note key={s.n} at={[3]} x={216} y={Y[i] - 6} signal>
          {s.defect}
        </Note>
      ))}
      <Note at={[4]} x={MX} y={MY - 44} anchor="middle">field-by-field trust</Note>
      <Note at={[5]} x={669} y={350} anchor="middle">reviews keyed by work</Note>
      <Note at={[6]} x={MX + 50} y={440} signal>[] never persisted</Note>

      <Show at={[4]}>
        <circle cx={MX} cy={MY} r={34} stroke="var(--accent)" strokeWidth={1} strokeDasharray="2 3" />
      </Show>

      <Leader n={10} at={[40, Y[0] + 50]} to={[16, Y[0] + 74]} />
      <Leader n={12} at={[40, Y[1] + 50]} to={[16, Y[1] + 74]} />
      <Leader n={14} at={[40, Y[2] + 50]} to={[16, Y[2] + 74]} />
      <Leader n={16} at={[40, Y[3] + 50]} to={[16, Y[3] + 74]} />
      <Leader n={18} at={[MX + 18, MY + 19]} to={[MX + 50, MY + 52]} />
      <Leader n={20} at={[760, 180]} to={[782, 150]} />
      <Leader n={22} at={[MX + 28, 60]} to={[MX + 64, 44]} />
      <Leader n={24} at={[MX + 40, 400]} to={[MX + 82, 424]} />
    </Fig>
  );
}
