"use client";

import { Fig, HIDDEN, Leader, Part, Hatch, useSafeId, type FigProps } from "./parts";
import { Note, Show, Travel, useSeq, type Step } from "./sequence";

/**
 * FIG — Starter pack. A base própria sobre a qual cada projeto é construído
 * ou ajustado, e que volta mais esperta de cada um.
 *
 * 10 o starter pack (dependência versionada) · 12 lock (versão + sha256)
 * 14 correção devolvida por PR · 16 padrão promovido ao pack
 * 18 medição em seis larguras · 20 projetos novos
 * 30 o jeito comum: base copiada em cada projeto
 * 32 projeto existente adotando o pack
 */

export const STEPS: Step[] = [
  {
    dur: 3.6,
    on: [30, 20],
    caption: {
      en: "The usual way: a base theme copied into every project (30). Each copy improves on its own, and nothing comes back.",
      pt: "O jeito comum: uma base copiada em cada projeto (30). Cada cópia melhora sozinha, e nada volta.",
    },
  },
  {
    dur: 3.4,
    on: [10, 20],
    caption: {
      en: "The starter pack is a dependency instead (10). A project takes sections, blocks and snippets from it by CLI.",
      pt: "O starter pack é uma dependência (10). O projeto pega seções, blocos e snippets dele por CLI.",
    },
  },
  {
    dur: 3.2,
    on: [12],
    caption: {
      en: "Every file is pinned in a lock (12) with version and sha256. CI fails on drift nobody declared.",
      pt: "Cada arquivo fica preso num lock (12) com versão e sha256. O CI falha em divergência não declarada.",
    },
  },
  {
    dur: 3.6,
    on: [32],
    caption: {
      en: "It works on projects that already exist (32): a diff shows what drifted, and hand-rolled pieces are swapped for pack units one at a time.",
      pt: "Funciona em projeto que já existe (32): um diff mostra o que divergiu, e as peças feitas à mão são trocadas por unidades do pack, uma a uma.",
    },
  },
  {
    dur: 3.2,
    on: [14],
    caption: {
      en: "A fix made inside a project goes back to the pack as a pull request (14).",
      pt: "Uma correção feita dentro do projeto volta para o pack como pull request (14).",
    },
  },
  {
    dur: 3.6,
    on: [16, 10],
    caption: {
      en: "A pattern joins the pack once it repeats in three projects (16). The next project starts from what the last ones learned.",
      pt: "Um padrão entra no pack quando se repete em três projetos (16). O próximo projeto começa do que os anteriores aprenderam.",
    },
  },
  {
    dur: 3.8,
    on: [18],
    caption: {
      en: "Rules become constraints (18): one fluid() function, generated schema, every section measured at six widths before anyone looks at it. What can't be gotten wrong doesn't need a paragraph, for a person or an AI agent.",
      pt: "Regra vira restrição (18): uma função fluid(), schema gerado, cada seção medida em seis larguras antes de alguém olhar. O que não dá para errar não precisa de parágrafo, nem para pessoa nem para agente de IA.",
    },
  },
];

const PROJECTS = ["project-a", "project-b", "project-c"];
const SY = [100, 220, 340];
const lane = (i: number) => `M450 ${SY[i] + 50} L580 ${SY[i] + 50}`;
const ADOPT = "M250 256 C220 256 200 256 184 256";

export default function FigKit({ lit, draw = true, title }: FigProps) {
  const hatch = useSafeId("h");
  const { step } = useSeq();
  const before = step === 0;
  const units = step >= 5 ? 17 : 16;

  return (
    <Fig title={title} draw={draw} lit={lit}>
      <defs>
        <Hatch id={hatch} gap={5} />
      </defs>

      {/* 10 — o pack */}
      <Part n={10}>
        <rect
          x={250}
          y={110}
          width={200}
          height={290}
          strokeWidth={1.6}
          strokeDasharray={before ? "6 4" : undefined}
        />
        <line x1={250} y1={140} x2={450} y2={140} />
        <text x={262} y={130} className="code" stroke="none">
          {before ? "base theme (copied)" : "starter-pack"}
        </text>
        {Array.from({ length: 20 }, (_, k) => {
          const c = k % 4;
          const r = Math.floor(k / 4);
          const on = k < units;
          return (
            <rect
              key={k}
              x={266 + c * 44}
              y={156 + r * 44}
              width={36}
              height={30}
              strokeWidth={0.9}
              style={{
                opacity: on ? 1 : 0.18,
                fill: k === 16 && on ? "var(--accent)" : "transparent",
                transition: "opacity 700ms, fill 900ms",
              }}
            />
          );
        })}
      </Part>

      {/* 20 — projetos novos */}
      {PROJECTS.map((name, i) => (
        <Part key={name} n={20}>
          <rect x={580} y={SY[i]} width={180} height={100} className="draw" pathLength={1} />
          <text x={592} y={SY[i] + 20} className="code late" stroke="none">
            {name}
          </text>
          {[0, 1, 2].map((c) => (
            <rect key={c} x={592 + c * 52} y={SY[i] + 34} width={44} height={26} strokeWidth={0.9} className="draw" pathLength={1} />
          ))}
          {/* cópias divergentes: unidades que só existem no projeto */}
          <Show at={[0]}>
            {[0, 1].map((c) => (
              <rect key={c} x={592 + c * 52} y={SY[i] + 66} width={44} height={22} strokeDasharray="3 3" strokeWidth={0.9} />
            ))}
          </Show>
          {/* 12 — lock */}
          <Show at={[2, 3, 4, 5, 6]}>
            <g>
              <rect x={740} y={SY[i] + 10} width={12} height={10} strokeWidth={1} />
              <path d={`M742 ${SY[i] + 10} v-4 a4 4 0 0 1 8 0 v4`} strokeWidth={1} />
            </g>
          </Show>
        </Part>
      ))}

      {SY.map((_, i) => (
        <path key={i} d={lane(i)} strokeDasharray={before ? HIDDEN : undefined} strokeWidth={1.1} />
      ))}
      <Show at={[0]}>
        {SY.map((y) => (
          <path key={y} d={`M509 ${y + 44} l12 12 M521 ${y + 44} l-12 12`} stroke="var(--accent)" strokeWidth={1.4} />
        ))}
      </Show>

      <Part n={30}>
        <Show at={[0]}>
          <text x={515} y={SY[0] + 34} textAnchor="middle" className="code" stroke="none">
            copy
          </text>
        </Show>
      </Part>

      {/* 32 — projeto existente: unidades irregulares, trocadas por unidades do pack */}
      <Part n={32}>
        <rect x={40} y={180} width={144} height={150} strokeWidth={1.2} className="draw" pathLength={1} />
        <text x={52} y={200} className="code late" stroke="none">
          existing
        </text>
        {[
          [52, 214, 50, 30],
          [110, 214, 60, 22],
          [52, 252, 72, 26],
          [130, 244, 40, 38],
          [52, 288, 118, 28],
        ].map(([x, y, w, h], k) => (
          <rect
            key={k}
            x={x}
            y={y}
            width={w}
            height={h}
            strokeWidth={0.9}
            strokeDasharray={step >= 3 && k < 3 ? undefined : "3 3"}
            style={{ fill: step >= 3 && k < 3 ? "var(--shade)" : "transparent", transition: "fill 700ms" }}
          />
        ))}
      </Part>
      <Show at={[3]}>
        <path d={ADOPT} strokeDasharray={HIDDEN} strokeWidth={1} />
        <path d="M192 251 l-8 5 l8 5" strokeWidth={1} />
      </Show>

      {/* 18 — medição em seis larguras */}
      <Part n={18}>
        <line x1={250} y1={430} x2={450} y2={430} className="draw" pathLength={1} />
        {[390, 768, 1024, 1280, 1440, 1920].map((w, k) => (
          <g key={w}>
            <line x1={250 + k * 40} y1={424} x2={250 + k * 40} y2={436} strokeWidth={1} />
            <text x={250 + k * 40} y={452} textAnchor="middle" className="code late" stroke="none" style={{ fontSize: 9 }}>
              {w}
            </text>
          </g>
        ))}
      </Part>

      <Part n={14}>
        <Show at={[4]}>
          <path d={`M580 ${SY[0] + 62} L450 ${SY[0] + 62}`} strokeDasharray={HIDDEN} strokeWidth={1} />
        </Show>
      </Part>

      {/* trânsito */}
      {SY.map((_, i) => (
        <Travel key={`c${i}`} step={0} d={lane(i)} from={i * 0.08} to={0.55 + i * 0.08} />
      ))}
      {SY.map((y, i) => (
        <Travel key={`x${i}`} step={0} d={`M580 ${y + 50} L515 ${y + 50}`} from={0.66 + i * 0.05} to={0.9 + i * 0.03} signal />
      ))}
      <Travel step={1} d={lane(0)} />
      <Travel step={3} d={ADOPT} from={0.1} to={0.8} />
      <Travel step={4} d={`M580 ${SY[0] + 62} L450 ${SY[0] + 62}`} signal />
      <Travel step={5} d={lane(2)} from={0.35} />

      <Note at={[1]} x={515} y={SY[0] + 40} anchor="middle">pack add</Note>
      <Note at={[2]} x={760} y={SY[2] + 118} anchor="end">pack.lock · sha256</Note>
      <Note at={[3]} x={40} y={170}>pack diff</Note>
      <Note at={[4]} x={515} y={SY[0] + 80} anchor="middle" signal>upstream → PR</Note>
      <Note at={[5]} x={350} y={102} anchor="middle" signal>repeats in 3 projects → pack</Note>
      <Note at={[6]} x={350} y={474} anchor="middle">fluid(mobile, desktop) · 6 widths</Note>

      <Leader n={10} at={[450, 380]} to={[488, 404]} />
      <Leader n={20} at={[760, SY[1] + 60]} to={[784, SY[1] + 84]} />
      <Leader n={18} at={[250, 430]} to={[214, 452]} />
      <Leader n={12} at={[752, SY[0] + 14]} to={[782, SY[0] - 8]} />
      <Leader n={14} at={[520, SY[0] + 62]} to={[536, SY[0] + 90]} />
      <Leader n={16} at={[284, 156 + 4 * 44 + 30]} to={[232, 404]} />
      <Leader n={30} at={[250, 130]} to={[214, 104]} />
      <Leader n={32} at={[40, 320]} to={[18, 350]} />
    </Fig>
  );
}
