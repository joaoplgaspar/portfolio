"use client";

import { useLocale } from "next-intl";
import { Fig, HIDDEN, Hatch, Leader, Part, useSafeId, type FigProps } from "./parts";
import { Note, Show, Travel, useSeq, type Step } from "./sequence";

/**
 * FIG — LIVRA. Quatro das seis fontes de catálogo convergindo numa obra.
 *
 * 10 Google Books · 12 Apple Books · 14 CBL · 16 Open Library
 * 18 reconciliação obra × edição · 20 registro canônico
 * 22 ISBN pelo código de barras · 24 cache que nunca guarda []
 *
 * Três atos: o problema (0), o caminho do código de barras até o registro
 * (1–7), o atalho descartado (8) e o resultado (9). No modo simples cada
 * cartão de fonte ganha o nome em cima.
 */

export const STEPS: Step[] = [
  {
    dur: 5.2,
    act: "problem",
    on: [10, 12, 14, 16],
    title: { en: "Problem", pt: "Problema" },
    plain: {
      en: "No single book database works for Brazil. Each one gets something wrong, so the same book shows up broken, or twice.",
      pt: "Nenhuma base de livros sozinha funciona para o Brasil. Cada uma erra alguma coisa, e o mesmo livro aparece quebrado, ou repetido.",
    },
    caption: {
      en: "Six catalog sources, none complete for Brazilian titles (10–16). Without reconciliation, editions split into duplicates and fields go missing.",
      pt: "Seis fontes de catálogo, nenhuma completa para títulos brasileiros (10–16). Sem reconciliação, edições viram duplicatas e campos somem.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [22],
    title: { en: "Scan", pt: "Leitura" },
    plain: {
      en: "A reader scans the barcode. The phone reads it on its own, at no cost.",
      pt: "A pessoa lê o código de barras. O próprio celular decifra, sem custo.",
    },
    caption: {
      en: "A barcode is read on the phone (22): ZXing, local, zero cost. Multimodal AI only reads the cover when there's no barcode.",
      pt: "O código de barras é lido no aparelho (22): ZXing, local, custo zero. IA multimodal só lê a capa quando não há código.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [24],
    title: { en: "Saved?", pt: "Já salvo?" },
    plain: {
      en: "First it checks the books already saved, so the same book isn't fetched twice.",
      pt: "Primeiro ele procura nos livros já salvos, para não buscar o mesmo livro duas vezes.",
    },
    caption: {
      en: "Cache first (24), with a TTL per source: 5 min for ISBN, 24 h for text, 7 days for CBL.",
      pt: "Cache primeiro (24), com TTL por fonte: 5 min para ISBN, 24 h para texto, 7 dias para a CBL.",
    },
  },
  {
    dur: 3.4,
    act: "solution",
    on: [10, 12, 14, 16],
    title: { en: "Ask", pt: "Consulta" },
    plain: {
      en: "If it isn't saved, it asks several book databases at once.",
      pt: "Se não estiver salvo, ele pergunta a várias bases de livros ao mesmo tempo.",
    },
    caption: {
      en: "On a miss, up to six sources are queried in parallel. Four of them are drawn here.",
      pt: "Sem cache, até seis fontes são consultadas em paralelo. Quatro estão desenhadas aqui.",
    },
  },
  {
    dur: 4.2,
    act: "solution",
    on: [10, 12, 14, 16],
    title: { en: "Errors", pt: "Erros" },
    plain: {
      en: "Each answer is wrong in its own way: no page count, no publisher, the wrong cover, almost empty.",
      pt: "Cada resposta erra do seu jeito: sem número de páginas, sem editora, com a capa errada, quase vazia.",
    },
    caption: {
      en: "Each one is wrong in its own way: no page count in search (10), no publisher (12), the catalog card served as cover (14), sparse (16).",
      pt: "Cada uma erra do seu jeito: sem nº de páginas na busca (10), sem editora (12), a ficha catalográfica como capa (14), esparsa (16).",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [18],
    title: { en: "Match", pt: "Combina" },
    plain: {
      en: "LIVRA takes each detail from the source that gets it right and merges them into one book.",
      pt: "O LIVRA pega cada dado da fonte que acerta aquele dado e junta tudo num livro só.",
    },
    caption: {
      en: "Reconciliation (18) takes each field from the source trusted for it. apple-X, google-Y and isbn:Z converge on one work.",
      pt: "A reconciliação (18) pega cada campo da fonte confiável para ele. apple-X, google-Y e isbn:Z convergem numa obra.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [20],
    title: { en: "One book", pt: "Um livro" },
    plain: {
      en: "One clean record per book. Reviews belong to the book, so every edition shows them.",
      pt: "Um registro limpo por livro. As resenhas são do livro, então aparecem em todas as edições.",
    },
    caption: {
      en: "One canonical record (20). Reviews are keyed by work, not edition, so every edition shares them.",
      pt: "Um registro canônico (20). Resenhas são chaveadas por obra, não por edição, e todas as edições as compartilham.",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [24],
    title: { en: "Stored", pt: "Guardado" },
    plain: {
      en: "Then it's saved, but never an empty answer: a source that fails can't make the book disappear.",
      pt: "Depois ele é salvo, mas nunca uma resposta vazia: uma fonte com falha não faz o livro sumir.",
    },
    caption: {
      en: "Then it's cached, unless it's empty. A failing source returning [] would hide the book for the whole TTL.",
      pt: "Depois vai para o cache, a não ser que esteja vazio. Uma fonte falhando com [] esconderia o livro pelo TTL inteiro.",
    },
  },
  {
    dur: 4.8,
    act: "rejected",
    on: [10],
    title: { en: "Rejected", pt: "Descartado" },
    plain: {
      en: "The shortcut I ruled out: trusting one source for everything. Quick to build, and wrong for a large share of Brazilian books.",
      pt: "O atalho que descartei: confiar numa fonte só para tudo. Rápido de fazer, e errado para boa parte dos livros brasileiros.",
    },
    caption: {
      en: "Rejected: a single source (10) as the catalog. Its gaps become the app's gaps: missing page counts, thumbnail covers, split editions.",
      pt: "Descartado: uma fonte só (10) como catálogo. As falhas dela viram as do app: sem nº de páginas, capa miniatura, edições separadas.",
    },
  },
  {
    dur: 4.4,
    act: "result",
    on: [18, 20, 24],
    title: { en: "Result", pt: "Resultado" },
    plain: {
      en: "Scanned or searched, a book lands on one correct record that's cheap to look up again.",
      pt: "Lido ou buscado, o livro cai num registro certo, barato de consultar de novo.",
    },
    caption: {
      en: "Work-level identity (18, 20) across sources, cached by layer (24), and never cached empty.",
      pt: "Identidade no nível da obra (18, 20) entre as fontes, cache por camada (24), e nunca cache vazio.",
    },
  },
];

const T = {
  en: {
    sources: ["Google Books", "Apple Books", "CBL", "Open Library"],
    defects: ["no page count", "no publisher", "wrong cover", "almost empty"],
    match: "matching",
    record: "one record",
    barcode: "barcode",
    cache: "saved books",
    problem: "same book, 4 different answers",
    scanned: "read on the phone",
    saved: "already saved?",
    ask: "6 sources at once",
    best: "best detail from each",
    reviews: "reviews follow the book",
    never: "never saves an empty answer",
    one: "Google only",
    gaps: "its gaps become yours",
    result: "1 book · 1 record",
    book: "book",
  },
  pt: {
    sources: ["Google Books", "Apple Books", "CBL", "Open Library"],
    defects: ["sem nº de páginas", "sem editora", "capa errada", "quase vazia"],
    match: "reconciliação",
    record: "um registro",
    barcode: "código de barras",
    cache: "livros salvos",
    problem: "o mesmo livro, 4 respostas diferentes",
    scanned: "lido no celular",
    saved: "já está salvo?",
    ask: "6 fontes ao mesmo tempo",
    best: "o melhor dado de cada",
    reviews: "resenhas seguem o livro",
    never: "nunca guarda resposta vazia",
    one: "só Google",
    gaps: "as falhas dela viram suas",
    result: "1 livro · 1 registro",
    book: "livro",
  },
};

const Y = [64, 158, 252, 346];

type Cover = "thumb" | "hires" | "wrong" | "none";
const SOURCES: { n: number; cover: Cover; missing: number; defect: string }[] = [
  { n: 10, cover: "thumb", missing: 2, defect: "pages: —" },
  { n: 12, cover: "hires", missing: 1, defect: "publisher: —" },
  { n: 14, cover: "wrong", missing: -1, defect: "cover = catalog card" },
  { n: 16, cover: "none", missing: 1, defect: "sparse" },
];

function Card({
  y,
  cover,
  missing,
  hatch,
  flag,
  name,
}: {
  y: number;
  cover: Cover;
  missing: number;
  hatch: string;
  flag: boolean;
  name: string;
}) {
  const { mode } = useSeq();
  const x = 40;
  const lines = [96, 78, 52];
  return (
    <g>
      {/* No modo simples a fonte tem nome; no técnico, o numeral basta. */}
      {mode === "plain" && (
        <text x={x} y={y - 7} className="box-plain late" stroke="none">
          {name}
        </text>
      )}
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
  const t = T[useLocale() === "pt" ? "pt" : "en"];
  const k = step < 0 ? STEPS.length - 1 : step;
  const MX = 452;
  const MY = 250;
  const curves = Y.map((y) => `M210 ${y + 31} C330 ${y + 31} 350 ${MY} ${MX - 26} ${MY}`);
  const out = `M${MX + 26} ${MY} L578 ${MY}`;
  const isbn = `M${MX} 96 L${MX} ${MY - 26}`;
  const cache = `M${MX} ${MY + 26} L${MX} 376`;
  // O atalho descartado: a primeira fonte direto no registro, sem reconciliar.
  const bypass = `M210 ${Y[0] + 31} C400 ${Y[0] + 31} 560 120 640 172`;
  const filled = k >= 6;
  // No problema e no passo dos erros, o que falta em cada fonte acende.
  const flag = k === 0 || k === 4;

  return (
    <Fig title={title} draw={draw} lit={lit}>
      <defs>
        <Hatch id={hatch} gap={4} />
      </defs>

      {SOURCES.map((s, i) => (
        <Part key={s.n} n={s.n}>
          <Card y={Y[i]} cover={s.cover} missing={s.missing} hatch={hatch} flag={flag} name={t.sources[i]} />
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

      <Show at={[8]}>
        <path d={bypass} strokeDasharray={HIDDEN} strokeWidth={1.2} style={{ stroke: "var(--accent)" }} />
      </Show>

      {/* trânsito: o que anda tem nome; as consultas em leque seguem pontos */}
      <Travel step={1} d={isbn} tag="ISBN" />
      <Travel step={2} d={cache} to={0.5} tag="ISBN" />
      <Travel step={2} d={cache} from={0.5} reverse tag="?" />
      {curves.map((d, i) => (
        <Travel key={`o${i}`} step={3} d={d} reverse from={i * 0.06} to={0.7 + i * 0.06} />
      ))}
      {curves.map((d, i) => (
        <Travel key={`i${i}`} step={4} d={d} from={0.3 + i * 0.08} to={0.75 + i * 0.06} />
      ))}
      <Travel step={6} d={out} signal tag={t.book} />
      <Travel step={7} d={cache} signal tag={t.book} />
      <Travel step={8} d={bypass} to={0.92} signal tag={t.one} />

      {/* anotações: frase no modo simples, o que o código diz no técnico */}
      <Note at={[0]} x={300} y={34} anchor="middle" signal mode="plain">{t.problem}</Note>
      <Note at={[0]} x={300} y={40} anchor="middle" signal mode="tech">no complete source for BR titles</Note>
      <Note at={[1]} x={MX + 40} y={124} mode="plain">{t.scanned}</Note>
      <Note at={[1]} x={MX + 40} y={120} mode="tech">ZXing · on device</Note>
      <Note at={[2]} x={MX + 50} y={364} mode="plain">{t.saved}</Note>
      <Note at={[2]} x={MX + 50} y={362} mode="tech">miss · TTL 5m / 24h / 7d</Note>
      <Note at={[3]} x={300} y={34} anchor="middle" mode="plain">{t.ask}</Note>
      <Note at={[3]} x={300} y={40} anchor="middle" mode="tech">6 sources · in parallel</Note>
      {SOURCES.map((s, i) => (
        <g key={s.n}>
          <Note at={[4]} x={216} y={Y[i] - 7} signal mode="plain">
            {t.defects[i]}
          </Note>
          <Note at={[4]} x={216} y={Y[i] - 6} signal mode="tech">
            {s.defect}
          </Note>
        </g>
      ))}
      <Note at={[5]} x={MX} y={MY - 46} anchor="middle" mode="plain">{t.best}</Note>
      <Note at={[5]} x={MX} y={MY - 44} anchor="middle" mode="tech">field-by-field trust</Note>
      <Note at={[6]} x={669} y={354} anchor="middle" mode="plain">{t.reviews}</Note>
      <Note at={[6]} x={669} y={350} anchor="middle" mode="tech">reviews keyed by work</Note>
      <Note at={[7]} x={MX + 50} y={466} signal mode="plain">{t.never}</Note>
      <Note at={[7]} x={MX + 50} y={440} signal mode="tech">[] never persisted</Note>
      <Note at={[8]} x={669} y={354} anchor="middle" signal mode="plain">{t.gaps}</Note>
      <Note at={[8]} x={669} y={350} anchor="middle" signal mode="tech">1 source = its gaps</Note>
      <Note at={[9]} x={669} y={354} anchor="middle" signal mode="plain">{t.result}</Note>
      <Note at={[9]} x={669} y={350} anchor="middle" signal mode="tech">work-level identity · cache ≠ []</Note>

      <Show at={[5]}>
        <circle cx={MX} cy={MY} r={34} stroke="var(--accent)" strokeWidth={1} strokeDasharray="2 3" />
      </Show>

      <Leader n={10} at={[40, Y[0] + 50]} to={[16, Y[0] + 74]} />
      <Leader n={12} at={[40, Y[1] + 50]} to={[16, Y[1] + 74]} />
      <Leader n={14} at={[40, Y[2] + 50]} to={[16, Y[2] + 74]} />
      <Leader n={16} at={[40, Y[3] + 50]} to={[16, Y[3] + 74]} />
      <Leader n={18} at={[MX - 18, MY + 19]} to={[MX - 48, MY + 50]} label={t.match} />
      <Leader n={20} at={[700, 172]} to={[700, 142]} label={t.record} />
      <Leader n={22} at={[MX + 28, 60]} to={[MX + 64, 44]} label={t.barcode} />
      <Leader n={24} at={[MX + 40, 400]} to={[MX + 82, 424]} label={t.cache} />
    </Fig>
  );
}
