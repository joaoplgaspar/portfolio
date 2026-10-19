"use client";

import { useLocale } from "next-intl";
import { AXIS, Fig, HIDDEN, Hatch, Leader, Part, useSafeId, type FigProps } from "./parts";
import { Note, Show, Travel, useSeq, type Step } from "./sequence";

/**
 * FIG — Roland / Boss. Duas vitrines, dois domínios, um carrinho.
 *
 * 10 store.roland.com.br · 12 store.bossmusic.com.br · 14 carrinho único
 * 16 Storefront API · 18 uma loja Shopify · 20 checkout único
 * 22 fronteira de domínio · 24 sincronização (descartada) · 26 linha otimista
 *
 * Narrada em três atos: o problema (0), a solução (1–7), a alternativa
 * descartada (8) e o resultado (9). `plain` fala com quem contrata;
 * `caption` é a versão técnica, com numerais.
 */

export const STEPS: Step[] = [
  {
    dur: 5.4,
    act: "problem",
    on: [10, 12, 22],
    title: { en: "Problem", pt: "Problema" },
    plain: {
      en: "Roland and Boss are two stores on two websites. Normally, someone who wants a Roland keyboard and a Boss pedal would get two carts and pay twice.",
      pt: "Roland e Boss são duas lojas em dois sites. Normalmente, quem quer um teclado Roland e um pedal Boss teria dois carrinhos e pagaria duas vezes.",
    },
    caption: {
      en: "Two Hydrogen storefronts on two domains (10, 12), one Shopify store underneath (18). A cart is found through the session, and the session doesn't cross domains (22).",
      pt: "Duas vitrines Hydrogen em dois domínios (10, 12), uma loja Shopify por baixo (18). O carrinho é achado pela sessão, e a sessão não atravessa domínio (22).",
    },
  },
  {
    dur: 4,
    act: "solution",
    on: [10, 26],
    title: { en: "Add", pt: "Adiciona" },
    plain: {
      en: "A keyboard is added on Roland. It shows up in the bag right away, before the server even answers.",
      pt: "Um teclado é adicionado na Roland. Ele aparece na sacola na hora, antes de o servidor responder.",
    },
    caption: {
      en: "Add to cart on Roland. The line shows up in the bag at once, dashed: optimistic, not confirmed yet.",
      pt: "Adicionar ao carrinho na Roland. A linha aparece na sacola na hora, tracejada: otimista, ainda sem confirmação.",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [10, 14],
    title: { en: "One cart", pt: "Um carrinho" },
    plain: {
      en: "Behind the scenes, it goes to one cart that both stores share, not to a cart that belongs to Roland.",
      pt: "Por trás, ele vai para um carrinho que as duas lojas compartilham, não para um carrinho que é só da Roland.",
    },
    caption: {
      en: "The request goes to the shared cart (14), not to a cart the Roland storefront owns.",
      pt: "O pedido vai para o carrinho compartilhado (14), não para um carrinho da vitrine Roland.",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [14, 16, 18],
    title: { en: "Shopify", pt: "Shopify" },
    plain: {
      en: "That cart lives in Shopify, in the one store that sits behind both brands.",
      pt: "Esse carrinho vive no Shopify, na única loja que fica por trás das duas marcas.",
    },
    caption: {
      en: "One Storefront API mutation (16) against the one store underneath both brands (18).",
      pt: "Uma mutação na Storefront API (16) contra a única loja por baixo das duas marcas (18).",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [10, 26],
    title: { en: "Saved", pt: "Salvo" },
    plain: {
      en: "Shopify confirms, and the item is saved for real. Had it failed, it would have left the bag.",
      pt: "O Shopify confirma e o item fica salvo de verdade. Se falhasse, ele sairia da sacola.",
    },
    caption: {
      en: "The response settles it: dashed turns solid. Had it failed, the optimistic line would roll back.",
      pt: "A resposta decide: o tracejado vira sólido. Se falhasse, a linha otimista seria desfeita.",
    },
  },
  {
    dur: 4.6,
    act: "solution",
    on: [22],
    title: { en: "New site", pt: "Outro site" },
    plain: {
      en: "The shopper moves to the Boss website. Browsers don't carry a cart from one site to another, so this is where it would normally be lost.",
      pt: "A pessoa vai para o site da Boss. O navegador não leva o carrinho de um site para outro, então é aqui que ele normalmente se perderia.",
    },
    caption: {
      en: "The visitor crosses to store.bossmusic.com.br. The session stays behind at the domain boundary (22).",
      pt: "A pessoa atravessa para store.bossmusic.com.br. A sessão fica para trás, na fronteira de domínio (22).",
    },
  },
  {
    dur: 3.6,
    act: "solution",
    on: [12, 14],
    title: { en: "Same cart", pt: "Mesmo carrinho" },
    plain: {
      en: "Boss finds the same shared cart. The keyboard is already in the bag.",
      pt: "A Boss encontra o mesmo carrinho compartilhado. O teclado já está na sacola.",
    },
    caption: {
      en: "Boss resolves the same cart (14). The bag already holds the JUNO-D6.",
      pt: "A Boss resolve o mesmo carrinho (14). A sacola já tem o JUNO-D6.",
    },
  },
  {
    dur: 3.8,
    act: "solution",
    on: [12, 14, 20],
    title: { en: "Checkout", pt: "Checkout" },
    plain: {
      en: "A Boss pedal joins it. Two brands, one bag, one checkout.",
      pt: "Um pedal Boss entra junto. Duas marcas, uma sacola, um checkout.",
    },
    caption: {
      en: "A DS-1 added on Boss joins it. Two brands, two lines, one checkout (20).",
      pt: "Um DS-1 adicionado na Boss entra junto. Duas marcas, duas linhas, um checkout (20).",
    },
  },
  {
    dur: 5,
    act: "rejected",
    on: [24],
    title: { en: "Rejected", pt: "Descartado" },
    plain: {
      en: "The option I ruled out: two carts that copy each other. Add on both sites at the same moment and one item quietly disappears.",
      pt: "A opção que descartei: dois carrinhos que se copiam. Adicione nos dois sites no mesmo instante e um item some sem aviso.",
    },
    caption: {
      en: "Rejected (24): two carts mirrored by sync. Two writes at once and the last one silently wins.",
      pt: "Descartado (24): dois carrinhos espelhados por sincronização. Duas escritas ao mesmo tempo e a última vence em silêncio.",
    },
  },
  {
    dur: 4.4,
    act: "result",
    on: [10, 12, 14, 20],
    title: { en: "Result", pt: "Resultado" },
    plain: {
      en: "One cart, one checkout, two brands, and no item lost on the way.",
      pt: "Um carrinho, um checkout, duas marcas, e nenhum item perdido no caminho.",
    },
    caption: {
      en: "One owner (14) serializes every write, so order and latency don't matter. One checkout (20) for both brands.",
      pt: "Um dono só (14) serializa todas as escritas, então ordem e latência não importam. Um checkout (20) para as duas marcas.",
    },
  },
];

/** Texto dentro do desenho: nomes das peças, etiquetas e notas. */
const T = {
  en: {
    roland: "Roland store",
    boss: "Boss store",
    cart: "one shared cart",
    api: "Shopify API",
    store: "one Shopify store",
    checkout: "checkout",
    boundary: "site boundary",
    rejected: "rejected",
    pending: "pending",
    shopper: "shopper",
    saved: "✓ saved",
    items: "2 items",
    problem: "2 sites · 2 carts · 2 checkouts",
    instant: "in the bag at once",
    lost: "normally: empty bag here",
    same: "same cart · 1 item",
    one: "1 checkout · 2 brands",
    gone: "one item disappears",
    result: "1 cart · 1 checkout · 2 brands",
  },
  pt: {
    roland: "loja Roland",
    boss: "loja Boss",
    cart: "um carrinho só",
    api: "API do Shopify",
    store: "uma loja Shopify",
    checkout: "checkout",
    boundary: "fronteira entre sites",
    rejected: "descartado",
    pending: "pendente",
    shopper: "cliente",
    saved: "✓ salvo",
    items: "2 itens",
    problem: "2 sites · 2 carrinhos · 2 checkouts",
    instant: "na sacola na hora",
    lost: "normalmente: sacola vazia aqui",
    same: "mesmo carrinho · 1 item",
    one: "1 checkout · 2 marcas",
    gone: "um item some",
    result: "1 carrinho · 1 checkout · 2 marcas",
  },
};

const OPTIMISTIC = "M200 209 C300 209 300 110 284 58";
const CROSS = "M300 200 C360 262 440 262 500 200";

function Window({
  x,
  domain,
  hatch,
  count,
  ghost,
  added,
}: {
  x: number;
  domain: string;
  hatch: string;
  count: number;
  ghost: boolean;
  added: boolean;
}) {
  return (
    <g>
      <rect x={x} y={36} width={288} height={186} className="draw" pathLength={1} />
      <line x1={x} y1={62} x2={x + 288} y2={62} className="draw" pathLength={1} />
      <text x={x + 14} y={53} className="code late" stroke="none">
        {domain}
      </text>
      {/* sacola + contagem */}
      <path
        d={`M${x + 262} ${45} h14 l-2 11 h-10 z M${x + 265} ${45} q4 -7 8 0`}
        className="draw"
        pathLength={1}
        strokeWidth={1}
      />
      <text
        key={count}
        x={x + 252}
        y={54}
        textAnchor="end"
        className="code"
        stroke="none"
        style={{ fill: "var(--fg)", animation: "fadeIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        {count}
      </text>
      <Part n={26}>
        <Show at={ghost ? [0, 1, 2, 3, 4, 5, 6, 7] : []}>
          <rect x={x + 242} y={43} width={14} height={14} strokeDasharray="2 2" strokeWidth={1} />
        </Show>
      </Part>
      {/* banner em corte */}
      <rect x={x + 14} y={74} width={260} height={54} fill={`url(#${hatch})`} className="late" stroke="none" />
      <rect x={x + 14} y={74} width={260} height={54} className="draw" pathLength={1} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x + 14 + i * 90} y={140} width={80} height={40} className="draw" pathLength={1} />
          <line x1={x + 14 + i * 90} y1={190} x2={x + 64 + i * 90} y2={190} className="draw" pathLength={1} />
          <line x1={x + 14 + i * 90} y1={197} x2={x + 44 + i * 90} y2={197} className="draw" pathLength={1} />
        </g>
      ))}
      {/* botão adicionar do produto do meio: cheio depois do clique */}
      <rect
        x={x + 104}
        y={204}
        width={40}
        height={10}
        className="draw"
        pathLength={1}
        style={{ fill: added ? "var(--fg)" : "transparent", transition: "fill 700ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
    </g>
  );
}

export default function FigSharedCart({ lit, draw = true, title }: FigProps) {
  const hatch = useSafeId("h");
  const { step } = useSeq();
  const t = T[useLocale() === "pt" ? "pt" : "en"];
  // Fora de uma sequência (capa estática) o desenho mostra o estado final.
  const k = step < 0 ? STEPS.length - 1 : step;

  // No problema a sacola ainda está vazia; o teclado entra no passo 1 e o
  // pedal no 7.
  const rolandCount = k === 0 ? 0 : k >= 7 ? 2 : 1;
  const bossCount = k >= 7 ? 2 : k >= 6 ? 1 : 0;
  const lines = k >= 7 ? 2 : k >= 4 ? 1 : 0;
  // A engrenagem por trás (carrinho, API, loja, checkout) só entra quando a
  // história chega nela: no problema e no clique ela fica apagada.
  const behind = k >= 2;

  const toCartA = "M160 214 C160 280 318 276 352 318";
  const toCartB = "M620 214 C620 280 482 276 448 318";
  const out = "M460 341 L560 341";

  return (
    <Fig title={title} draw={draw} lit={lit}>
      <defs>
        <Hatch id={hatch} gap={6} />
      </defs>

      <Part n={10}>
        <Window
          x={36}
          domain="store.roland.com.br"
          hatch={hatch}
          count={rolandCount}
          ghost={k >= 1 && k <= 3}
          added={k >= 1 && k <= 4}
        />
      </Part>
      <Part n={12}>
        <Window x={476} domain="store.bossmusic.com.br" hatch={hatch} count={bossCount} ghost={false} added={k === 7} />
      </Part>

      <Part n={22}>
        <line x1={400} y1={18} x2={400} y2={296} strokeDasharray={AXIS} strokeWidth={0.9} className="late" />
      </Part>

      <Part n={24}>
        <g className="late" strokeWidth={1}>
          <line x1={330} y1={130} x2={470} y2={130} strokeDasharray={HIDDEN} />
          <path d="M338 125 l-8 5 l8 5 M462 125 l8 5 l-8 5" />
          <path d="M393 123 l14 14 M407 123 l-14 14" strokeWidth={1.4} />
        </g>
      </Part>

      <g style={{ opacity: behind ? 1 : 0.18, transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <path d={toCartA} className="draw" pathLength={1} />
        <path d={toCartB} className="draw" pathLength={1} />

        <Part n={14}>
          <rect x={340} y={318} width={120} height={46} strokeWidth={1.6} className="draw" pathLength={1} />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={356 + i * 32}
              y={331}
              width={24}
              height={20}
              className="draw"
              pathLength={1}
              style={{ fill: i < lines ? "var(--fg)" : "transparent", transition: "fill 700ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          ))}
          <Show at={[2, 3]}>
            <rect x={352} y={327} width={32} height={28} strokeDasharray="3 2" strokeWidth={1} />
          </Show>
        </Part>

        <line x1={400} y1={364} x2={400} y2={396} className="draw" pathLength={1} />
        <Part n={16}>
          <rect x={346} y={396} width={108} height={32} className="draw" pathLength={1} />
          <text x={400} y={416} textAnchor="middle" className="code late" stroke="none">
            Storefront API
          </text>
        </Part>
        <line x1={400} y1={428} x2={400} y2={447} className="draw" pathLength={1} />
        <Part n={18}>
          <ellipse cx={400} cy={456} rx={54} ry={9} className="draw" pathLength={1} />
          <path d="M346 456 V484 A54 9 0 0 0 454 484 V456" className="draw" pathLength={1} />
        </Part>

        <path d={out} className="draw" pathLength={1} />
        <path d="M552 336 l8 5 l-8 5" className="late" />
        <Part n={20}>
          <rect x={560} y={322} width={110} height={38} className="draw" pathLength={1} />
          <path d="M600 341 l7 7 l14 -14" strokeWidth={1.6} className="draw" pathLength={1} />
        </Part>

        <Leader n={14} at={[340, 352]} to={[296, 376]} label={t.cart} />
        <Leader n={16} at={[454, 420]} to={[498, 440]} label={t.api} />
        <Leader n={18} at={[346, 474]} to={[300, 488]} label={t.store} />
        <Leader n={20} at={[670, 330]} to={[712, 306]} label={t.checkout} />
      </g>

      {/* O problema: a pessoa tenta atravessar e o carrinho não vai junto. */}
      <Show at={[0]}>
        <path d={CROSS} strokeDasharray={HIDDEN} strokeWidth={1} />
        <path d="M391 238 l18 18 M409 238 l-18 18" strokeWidth={1.8} style={{ stroke: "var(--accent)" }} />
      </Show>

      {/* trânsito, passo a passo */}
      {/* Todo trajeto segue uma linha desenhada. Os que só existem num passo
          (a linha otimista, a travessia) aparecem tracejados junto com ele.
          O que anda tem nome: o produto, a pessoa, o "salvo". */}
      <Show at={[1]}>
        <path d={OPTIMISTIC} strokeDasharray={HIDDEN} strokeWidth={1} />
      </Show>
      <Show at={[5]}>
        <path d={CROSS} strokeDasharray={HIDDEN} strokeWidth={1} />
        <path d="M500 200 l-11 3 M500 200 l-3 11" strokeWidth={1} />
      </Show>
      <Travel step={0} d={CROSS} from={0.05} to={0.5} tag={t.shopper} />
      <Travel step={1} d={OPTIMISTIC} from={0.05} to={0.75} tag="JUNO-D6" />
      <Travel step={2} d={toCartA} tag="JUNO-D6" />
      <Travel step={3} d="M400 364 L400 452" tag="JUNO-D6" />
      <Travel step={4} d="M400 452 L400 364" to={0.42} signal tag={t.saved} />
      <Travel step={4} d={toCartA} from={0.48} reverse signal tag={t.saved} />
      <Travel step={5} d={CROSS} tag={t.shopper} />
      <Travel step={6} d={toCartB} reverse tag="JUNO-D6" />
      <Travel step={7} d={toCartB} to={0.5} tag="DS-1" />
      <Travel step={7} d={out} from={0.55} to={0.95} signal tag={t.items} />
      <Travel step={8} d="M330 130 L400 130" signal tag="JUNO-D6" />
      <Travel step={8} d="M470 130 L400 130" signal tag="DS-1" />

      {/* Notas: no modo simples, frases; no técnico, o que o código diz. */}
      <Note at={[0]} x={400} y={296} anchor="middle" signal mode="plain">{t.problem}</Note>
      <Note at={[0]} x={408} y={284} signal mode="tech">cart session: one domain only</Note>
      <Note at={[1]} x={324} y={28} anchor="end" mode="plain">{t.instant}</Note>
      <Note at={[1]} x={324} y={28} anchor="end" mode="tech">optimistic line · pending</Note>
      <Note at={[3]} x={462} y={476} mode="tech">cartLinesAdd(JUNO-D6)</Note>
      <Note at={[4]} x={324} y={28} anchor="end" signal mode="tech">200 → line confirmed</Note>
      <Note at={[5]} x={408} y={284} mode="plain">{t.lost}</Note>
      <Note at={[5]} x={408} y={284} mode="tech">session: roland only</Note>
      <Note at={[6]} x={560} y={252} anchor="middle" mode="plain">{t.same}</Note>
      <Note at={[6]} x={476} y={28} mode="tech">same cart · 1 line</Note>
      <Note at={[7]} x={615} y={384} anchor="middle" mode="plain">{t.one}</Note>
      <Note at={[7]} x={615} y={380} anchor="middle" mode="tech">1 checkout · 2 brands</Note>
      <Note at={[8]} x={400} y={164} anchor="middle" signal mode="plain">{t.gone}</Note>
      <Note at={[8]} x={400} y={112} anchor="middle" signal mode="tech">last write wins</Note>
      <Note at={[9]} x={400} y={296} anchor="middle" signal mode="plain">{t.result}</Note>
      <Note at={[9]} x={400} y={292} anchor="middle" signal mode="tech">1 owner · serialized writes</Note>

      <Leader n={10} at={[92, 222]} to={[70, 262]} label={t.roland} />
      <Leader n={12} at={[708, 222]} to={[730, 262]} label={t.boss} />
      <Leader n={22} at={[400, 30]} to={[436, 14]} label={t.boundary} />
      <Leader n={24} at={[436, 130]} to={[446, 96]} label={t.rejected} transient />
      <Leader n={26} at={[36 + 242, 57]} to={[258, 92]} label={t.pending} transient />
    </Fig>
  );
}
