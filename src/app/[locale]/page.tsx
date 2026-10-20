import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import HomeSheet from "@/components/sheet/HomeSheet";
import TitleBlock from "@/components/sheet/TitleBlock";
import { isShown } from "@/components/figures/registry";
import { legends } from "@/data/figures";
import { fetchPublishedProjects } from "@/data/projects";
import { sheetPlan } from "@/lib/sheets";
import { logosOf, platformLabel, storeMeta, stores, visibleStores } from "@/data/stores";
import { mockOf } from "@/data/mocks";
import type { Brand } from "@/components/sheet/BrandMargin";
import WorkGrid, { type WorkItem } from "@/components/sheet/WorkGrid";
import type { Print } from "@/components/sheet/ProjectThumb";
import { Link } from "@/i18n/navigation";

export const revalidate = 60; // ISR: novos projetos aparecem sem redeploy

/** O que identifica cada case de relance no índice: a marca, sempre. */
/**
 * Identidade do LIVRA (marca "Fita em L", aprovada em 07/10/2026, fonte:
 * E:/Projetos/lura/src/components/brand). Fundo = a tinta da marca
 * (#16110d, o mesmo do hero de uselivra.com); logo = versão escura do
 * lockup, ícone papel + fita laranja e "livra" em papel. A tela é a home do
 * app em out/2026, numa conta de demonstração.
 */
const LIVRA = {
  logo: "/logos/livra-lockup.svg",
  plate: "#16110d",
  screen: "/livra/app-inicio-2026-10.webp",
};

function printOf(slug: string, cover: string): Print | undefined {
  if (slug === "livra") return { kind: "logo", logos: [LIVRA.logo], plate: LIVRA.plate };
  const brand = brandOf(slug);
  if (brand) return { kind: "logo", ...brand };
  return cover ? { kind: "site", src: cover } : undefined;
}

/**
 * Margem da prancha na home: logo, nome, uma linha e o que mostrar no
 * celular (o site no ar, as telas do app, ou "em desenvolvimento").
 */
function brandCard(caseSlug: string, name: string, l: Locale): Brand | undefined {
  if (caseSlug === "livra") {
    return {
      logos: [LIVRA.logo],
      plate: LIVRA.plate,
      name,
      line: l === "pt" ? "App de leitura · iOS, Android e web" : "Reading app · iOS, Android and web",
      screen: { kind: "app", src: LIVRA.screen },
    };
  }
  const s = stores.find((x) => x.caseSlug === caseSlug);
  const logos = s ? logosOf(s) : [];
  if (!s || !logos.length) return undefined;
  const mock = mockOf(s.slug);
  return {
    logos,
    plate: s.plate,
    name,
    line: s.scope[l],
    screen: mock
      ? { kind: "site", mock }
      : { kind: "building", label: l === "pt" ? "Em desenvolvimento" : "In development" },
  };
}

/** Logo e cor da marca de um case, vindos da loja que aponta para ele. */
function brandOf(caseSlug: string) {
  const s = stores.find((x) => x.caseSlug === caseSlug);
  const logos = s ? logosOf(s) : [];
  return s && logos.length ? { logos, plate: s.plate } : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const base = pageMeta({
    locale: locale as Locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
  return { ...base, title: { absolute: t("title") } };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations("home");

  // Rascunho aparece no dev pela URL direta, nunca no índice: um índice com
  // "EM BREVE" é pior que um índice curto.
  const projects = await fetchPublishedProjects();
  const figured = projects.filter(isShown);

  const plan = sheetPlan(figured.length);
  const ts = await getTranslations("stores");
  const tp = await getTranslations("project");
  const tpp = await getTranslations("projectPage");
  const shown = visibleStores();
  const since = Math.min(...stores.map((s) => s.year));
  const proof = [
    { v: String(stores.length), k: t("proof.stores", { year: since }) },
    { v: "600", k: t("proof.livra") },
    { v: "UTC−3", k: t("proof.tz") },
  ];
  // Segmento da marca do case, quando o case é de uma loja (o LIVRA não é).
  const segmentOf = (slug: string) => stores.find((s) => s.caseSlug === slug)?.segment?.[l];
  const fig = t("fig");

  // Cases com figura primeiro, depois os projetos com capa. Cada um vira um
  // cartão que se expande: o case mostra a figura narrada; o projeto, a print.
  const work: WorkItem[] = [
    ...figured.map((p, i): WorkItem => ({
      key: p.slug,
      mark: `${fig} ${i + 1}`,
      title: p.title,
      meta: [segmentOf(p.slug), p.type[l], p.year].filter(Boolean).join(" · "),
      href: `/work/${p.slug}`,
      cover:
        p.slug === "livra"
          ? { kind: "app", srcs: ["/livra/app-liga.webp", LIVRA.screen, "/livra/app-lura.webp"], plate: LIVRA.plate, mark: LIVRA.logo }
          : brandOf(p.slug)
            ? { kind: "logo", ...brandOf(p.slug)! }
            : p.cover
              ? { kind: "site", src: p.cover }
              : { kind: "drawing", slug: p.slug },
      summary: p.summary[l],
      facts: [
        { k: tp("client"), v: p.client[l] },
        { k: tp("role"), v: p.role[l] },
        { k: tp("year"), v: String(p.year) },
      ],
      stack: p.stack,
      live: p.live,
      figure: { slug: p.slug, caption: p.caption?.[l] ?? p.summary[l] },
    })),
    ...shown
      // Só os destaques: o resto mora em /projects, senão a home vira lista.
      .filter((s) => s.featured && (s.cover || s.logo) && !s.caseSlug)
      .map(
        (s): WorkItem => ({
          key: s.slug,
          mark: s.mark,
          title: s.name,
          meta: storeMeta(s, l),
          href: `/projects/${s.slug}`,
          cover: s.logo ? { kind: "logo", logos: logosOf(s), plate: s.plate } : { kind: "site", src: s.cover! },
          print: s.logo ? s.cover : undefined,
          mock: mockOf(s.slug),
          summary: s.scope[l],
          facts: [
            ...(s.segment ? [{ k: tpp("segment"), v: s.segment[l] }] : []),
            ...(platformLabel(s) ? [{ k: tpp("platform"), v: platformLabel(s)! }] : []),
            { k: tpp("year"), v: String(s.year) },
            ...(s.role ? [{ k: tpp("role"), v: s.role[l] }] : []),
            ...(s.domain ? [] : [{ k: tpp("status"), v: ts("building") }]),
          ],
          live: s.domain ? [s.domain] : undefined,
          work: s.work?.map((w) => w[l]),
        }),
      ),
  ];

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean),
  };

  const [first, last] = [
    siteConfig.name.split(" ").slice(0, -1).join(" "),
    siteConfig.name.split(" ").slice(-1)[0],
  ];

  return (
    <>
      <JsonLd data={person} />
      <HomeSheet
        locale={l}
        legends={legends}
        items={figured.map((p) => ({
          slug: p.slug,
          title: p.title,
          caption: p.caption?.[l] ?? p.summary[l],
          type: segmentOf(p.slug) ?? p.type[l],
          year: p.year,
          live: p.live,
          print: printOf(p.slug, p.cover),
          brand: brandCard(p.slug, p.title, l),
        }))}
        t={{
          index: t("figTabs"),
          open: t("open"),
          fig: t("fig"),
          live: t("live"),
          play: t("play"),
          pause: t("pause"),
          prev: t("prev"),
          next: t("next"),
        }}
        intro={
          <div>
            <h1 className="t-name">
              {first}
              <br />
              {last}
            </h1>
            <p className="mt-6 max-w-[34ch] text-[1.0625rem] leading-snug font-[480]">{t("lede")}</p>
            {/* Prova em três números. Número de cliente não entra: só o que é meu. */}
            <dl className="mt-6 grid max-w-[44ch] grid-cols-3 border-t border-fg">
              {proof.map((x) => (
                <div key={x.k} className="border-r border-line py-2 pr-3 pl-3 first:pl-0 last:border-r-0">
                  <dd className="text-[1.375rem] leading-none font-[300] tabular-nums">{x.v}</dd>
                  <dt className="t-small mt-1.5 leading-snug text-muted">{x.k}</dt>
                </div>
              ))}
            </dl>
          </div>
        }
      />
      {/* Trabalho selecionado: grade de ponta a ponta; cada capa se expande num painel. */}
      <section className="mt-[clamp(56px,8vw,128px)] border-t border-fg pt-5" aria-labelledby="work-h">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="work-h" className="t-title">
            {t("selected")}
          </h2>
          <Link href="/projects" className="t-small tb-link">
            {ts("all", { n: shown.length })} →
          </Link>
        </div>
        <WorkGrid
          items={work}
          locale={l}
          t={{
            expand: t("expand"),
            open: t("openFull"),
            close: t("close"),
            live: t("live"),
            stack: tp("stack"),
            play: t("play"),
            pause: t("pause"),
            prev: t("prev"),
            next: t("next"),
          }}
        />
      </section>

      <TitleBlock sheet={1} of={plan.total} title={t("sheetTitle")} />
    </>
  );
}
