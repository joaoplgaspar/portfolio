"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Laboratório do carrinho — Roland / Boss.
 *
 * Duas vitrines, e as duas arquiteturas possíveis rodando de verdade no
 * navegador:
 *
 * - **Um carrinho** (o que foi entregue): toda adição vai para um dono só,
 *   que serializa as escritas. Não importa a ordem nem a latência — o
 *   resultado é sempre o mesmo.
 * - **Dois carrinhos sincronizados** (o descartado): cada vitrine guarda o
 *   seu e manda um snapshot para a outra depois de uma latência aleatória. O
 *   último snapshot a chegar vence. Basta adicionar dos dois lados antes da
 *   sincronização terminar para os carrinhos divergirem.
 *
 * A latência é simulada; a corrida não. É exatamente o bug que a decisão
 * evitou, reproduzível em um clique.
 */

type Side = "roland" | "boss";
type Line = { id: string; name: string };
type Mode = "one" | "sync";
type Log = { t: number; text: string; warn?: boolean };
type View = {
  shared: Line[];
  carts: Record<Side, Line[]>;
  truth: Line[];
  log: Log[];
  pending: number;
};
const EMPTY: View = { shared: [], carts: { roland: [], boss: [] }, truth: [], log: [], pending: 0 };

const PRODUCTS: Record<Side, string[]> = {
  roland: ["JUNO-D6", "FP-30X", "TD-07KV"],
  boss: ["DS-1", "RC-505mkII", "KATANA-50"],
};
const DOMAIN: Record<Side, string> = {
  roland: "store.roland.com.br",
  boss: "store.bossmusic.com.br",
};
const SHOT: Record<Side, string> = { roland: "/covers/roland.jpg", boss: "/covers/boss.jpg" };
const other = (s: Side): Side => (s === "roland" ? "boss" : "roland");
const latency = () => 350 + Math.random() * 850;

export type CartLabText = {
  one: string;
  sync: string;
  both: string;
  reset: string;
  add: string;
  cart: string;
  empty: string;
  inSync: string;
  syncing: string;
  diverged: string;
  expected: string;
  hint: string;
  log: string;
};

export default function CartLab({ t }: { t: CartLabText }) {
  const [mode, setMode] = useState<Mode>("one");

  // A simulação vive num ref, mutado só por handlers e timeouts: a "rede"
  // precisa ler o estado do momento em que a mensagem chega, não o do render
  // em que foi enviada. O render lê uma cópia publicada em `view`.
  const s = useRef({
    t0: 0,
    seq: 0,
    shared: [] as Line[],
    carts: { roland: [] as Line[], boss: [] as Line[] },
    truth: [] as Line[],
    log: [] as Log[],
    timers: [] as number[],
    pending: 0,
  });

  const [view, setView] = useState<View>(EMPTY);
  const render = useCallback(() => {
    const { shared, carts, truth, log, pending } = s.current;
    setView({ shared, carts: { ...carts }, truth, log, pending });
  }, []);

  const push = (text: string, warn?: boolean) => {
    const st = s.current;
    st.log = [...st.log, { t: (performance.now() - st.t0) / 1000, text, warn }].slice(-7);
  };

  const reset = useCallback(
    (next?: Mode) => {
      const st = s.current;
      st.timers.forEach((id) => window.clearTimeout(id));
      Object.assign(st, {
        t0: performance.now(),
        seq: 0,
        shared: [],
        carts: { roland: [], boss: [] },
        truth: [],
        log: [],
        timers: [],
        pending: 0,
      });
      if (next) setMode(next);
      render();
    },
    [render],
  );

  useEffect(() => {
    s.current.t0 = performance.now();
    const timers = s.current.timers;
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const later = (fn: () => void, ms: number) => {
    s.current.timers.push(window.setTimeout(fn, ms));
  };

  const add = (side: Side, name: string) => {
    const st = s.current;
    const line = { id: `${name}#${++st.seq}`, name };
    st.truth = [...st.truth, line];

    if (mode === "one") {
      push(`${side} → cartLinesAdd(${name})`);
      later(() => {
        st.shared = [...st.shared, line];
        push(`cart ← ${name}  [${st.shared.map((l) => l.name).join(", ")}]`);
        render();
      }, latency());
    } else {
      st.carts[side] = [...st.carts[side], line];
      const snapshot = st.carts[side];
      const to = other(side);
      push(`${side}: +${name}  [${snapshot.map((l) => l.name).join(", ")}]`);
      st.pending++;
      later(() => {
        st.pending--;
        const overwritten = st.carts[to].filter((l) => !snapshot.includes(l));
        st.carts[to] = snapshot;
        push(`${to} ← snapshot from ${side}  [${snapshot.map((l) => l.name).join(", ")}]`);
        if (overwritten.length) {
          push(`${to}: ${overwritten.map((l) => l.name).join(", ")} ✕ overwritten`, true);
        }
        render();
      }, latency());
    }
    render();
  };

  const both = () => {
    add("roland", PRODUCTS.roland[s.current.seq % 3]);
    add("boss", PRODUCTS.boss[s.current.seq % 3]);
  };

  const st = view;
  const count = (side: Side) => (mode === "one" ? st.shared.length : st.carts[side].length);
  const expected = st.truth.length;
  // Só faz sentido julgar depois que toda sincronização em voo chegou:
  // durante o trânsito os dois lados diferem por definição.
  const sameCart =
    st.carts.roland.length === st.carts.boss.length &&
    st.carts.roland.every((l, i) => st.carts.boss[i] === l);
  const diverged = mode === "sync" && st.pending === 0 && (!sameCart || st.carts.roland.length < expected);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="seg" role="group">
          <button type="button" className="ctl" aria-pressed={mode === "one"} onClick={() => reset("one")}>
            {t.one}
          </button>
          <button type="button" className="ctl" aria-pressed={mode === "sync"} onClick={() => reset("sync")}>
            {t.sync}
          </button>
        </div>
        <button type="button" className="ctl" onClick={both}>
          {t.both}
        </button>
        <button type="button" className="ctl" onClick={() => reset()}>
          {t.reset}
        </button>
      </div>
      <p className="t-small mt-3 max-w-[70ch] text-muted">{t.hint}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_minmax(150px,0.42fr)_1fr]">
        {(["roland", "boss"] as Side[]).map((side, i) => (
          <div key={side} className={`border border-fg bg-raised ${i === 1 ? "md:order-3" : ""}`}>
            <div className="flex items-center justify-between border-b border-fg px-3 py-2">
              <span className="t-code">{DOMAIN[side]}</span>
              <span className="t-small tabular-nums" aria-label={`${t.cart}: ${count(side)}`}>
                {t.cart} {count(side)}
              </span>
            </div>
            <div className="relative h-[120px] overflow-hidden border-b border-fg">
              <Image
                src={SHOT[side]}
                alt=""
                fill
                sizes="(min-width: 768px) 30vw, 90vw"
                className="object-cover object-top grayscale-[0.35]"
              />
            </div>
            <ul>
              {PRODUCTS[side].map((name) => (
                <li key={name} className="flex items-center justify-between border-b border-line px-3 py-2 last:border-b-0">
                  <span className="t-small">{name}</span>
                  <button type="button" className="ctl !h-7 !px-2.5" onClick={() => add(side, name)}>
                    {t.add}
                  </button>
                </li>
              ))}
            </ul>
            {mode === "sync" && (
              <div className="border-t border-fg px-3 py-2">
                <CartLines lines={st.carts[side]} empty={t.empty} />
              </div>
            )}
          </div>
        ))}

        {/* eixo: o carrinho único, ou o vazio entre os dois */}
        <div className="relative flex flex-col items-stretch justify-center md:order-2">
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-px md:block"
            style={{
              backgroundImage: "linear-gradient(var(--fg) 60%, transparent 0)",
              backgroundSize: "1px 12px",
            }}
          />
          <div className="relative border border-fg bg-bg px-3 py-3" aria-live="polite">
            {mode === "one" ? (
              <>
                <p className="t-fig mb-2">{t.cart} · 14</p>
                <CartLines lines={st.shared} empty={t.empty} />
              </>
            ) : (
              <p className={`t-small ${diverged ? "text-accent" : ""}`}>
                {st.pending > 0
                  ? t.syncing
                  : diverged
                    ? `${t.diverged} — ${t.expected} ${expected}`
                    : t.inSync}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 border border-fg bg-fg px-3 py-2 text-bg" role="log" aria-label={t.log}>
        {st.log.length === 0 ? (
          <p className="t-code opacity-50">— {t.log} —</p>
        ) : (
          st.log.map((l, i) => (
            <p key={i} className={`t-code ${l.warn ? "text-[#e38b8b]" : ""}`}>
              <span className="opacity-50">t+{l.t.toFixed(2)}s</span> {l.text}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

function CartLines({ lines, empty }: { lines: Line[]; empty: string }) {
  if (!lines.length) return <p className="t-small text-faint">{empty}</p>;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {lines.map((l) => (
        <li key={l.id} className="t-code border border-fg px-1.5 py-0.5">
          {l.name}
        </li>
      ))}
    </ul>
  );
}
