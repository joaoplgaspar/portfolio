import type { Project } from "@/types/project";

/**
 * Regra de produção: só renderiza `published: true`. Hoje: apenas LIVRA.
 * DUX/Vivo ficam como estrutura (published: false). Placeholders "EM BREVE"
 * aparecem só em DEV (densidade do índice), nunca em produção.
 * Launch DoD: ≥ 3 cases publicados. Ordem futura: loja-demo → LIVRA → demais.
 */
const projects: Project[] = [
  {
    slug: "livra",
    title: "LIVRA",
    client: { pt: "Projeto próprio", en: "Own product" },
    role: {
      pt: "Design, front-end e back-end serverless",
      en: "Design, front-end and serverless back-end",
    },
    year: 2025,
    type: { pt: "Product · Full-stack", en: "Product · Full-stack" },
    stack: ["React 19", "Vite PWA", "Firebase", "Cloud Functions", "Capacitor", "Stripe", "Gemini"],
    summary: {
      pt: "Rastreador de leitura gamificado para o BookTok brasileiro — 6 APIs de catálogo orquestradas numa identidade canônica de livro.",
      en: "A gamified reading tracker for Brazilian BookTok — 6 catalog APIs orchestrated into one canonical book identity.",
    },
    problem: { pt: "", en: "" },
    contribution: { pt: "", en: "" },
    results: [],
    body: {
      pt: [
        { kind: "heading", text: "Contexto" },
        {
          kind: "text",
          text: "O leitor brasileiro vive entre catálogos que não conversam: Skoob tem acervo nacional mas o produto parou no tempo; Goodreads ignora o Brasil; nenhum tem um loop de hábito de verdade. O LIVRA é um diário de leitura gamificado — streak, ligas semanais, economia de moedas, modo foco — desenhado para quem já transforma leitura em conteúdo no TikTok e no Instagram.",
        },
        { kind: "heading", text: "O problema técnico central" },
        {
          kind: "text",
          text: "Não existe uma fonte de dados de livros que resolva o Brasil. Google Books tem volume mas é ruidoso e não retorna contagem de páginas na busca; a Apple tem as melhores capas mas precisa de localização forçada; a CBL é a autoridade em edição nacional mas às vezes serve a ficha catalográfica como capa; Open Library é só fallback. Nenhuma sozinha resolve — a orquestração é o produto.",
        },
        { kind: "heading", text: "O que eu construí" },
        {
          kind: "text",
          text: "Uma busca unificada que consulta até 6 fontes em paralelo, detecta o tipo de consulta (ISBN vs. texto livre) e reconcilia tudo numa identidade canônica de obra × edição: o mesmo livro chegando como `apple-X`, `google-Y` ou `isbn:Z` converge para um único documento — o que impede cards duplicados, resenhas fragmentadas e capas inconsistentes. Avaliações são chaveadas por obra, não por edição, para que edições diferentes compartilhem as mesmas resenhas.",
        },
        {
          kind: "text",
          text: "Em volta do núcleo: scanner barcode-first (decode local via ZXing, custo zero) com IA multimodal só como fallback de foto de capa; recomendações geradas pelo Gemini mas validadas contra o catálogo real antes de virarem card; e um catálogo que se auto-cura — abrir um livro com metadados pobres dispara enriquecimento em background, então navegar melhora a base.",
        },
        { kind: "heading", text: "Decisões de engenharia que eu defenderia numa entrevista" },
        {
          kind: "list",
          items: [
            { label: "Economia client-locked:", text: "moedas, XP, streak e status PRO só são escritos por Cloud Functions, com transações idempotentes por `{userId}_{reason}_{dayKey}`. O cliente nunca é confiável para dinheiro — nem o meu." },
            { label: "Regra “nunca cachear lista vazia”:", text: "uma fonte que falha e retorna `[]` envenenaria o cache pelo TTL inteiro, sumindo com livros. Toda camada de cache valida antes de persistir." },
            { label: "Custo como requisito:", text: "~40 reads por busca viraram camadas de cache com TTLs distintos (5min ISBN, 24h texto, 7 dias CBL); a cota do Google Books virou métrica observável — um 503 em produção me ensinou a diferença entre cota diária e soft rate limit, e o fix foi stagger + circuit breaker, não “tentar de novo”." },
            { label: "Defesa em profundidade como padrão:", text: "cada bug corrigido na origem (server), com defesa no client (auto-cura) e script de limpeza para os dados já gravados — o que permite evoluir um catálogo vivo sem migrações traumáticas." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "Em beta fechado, pré-lançamento. As métricas que importam agora são de engenharia: custo por busca, convergência de identidade, integridade da economia.",
        },
      ],
      en: [
        { kind: "heading", text: "Context" },
        {
          kind: "text",
          text: "Brazilian readers live between catalogs that don't talk to each other: Skoob has the national collection but the product stalled years ago; Goodreads ignores Brazil; neither has a real habit loop. LIVRA is a gamified reading journal — streaks, weekly leagues, a coin economy, focus mode — built for readers who already turn books into content on TikTok and Instagram.",
        },
        { kind: "heading", text: "The core technical problem" },
        {
          kind: "text",
          text: "No single book-data source solves Brazil. Google Books has volume but is noisy and doesn't return page counts in search; Apple has the best covers but needs forced localization; CBL is the authority on Brazilian editions but sometimes serves the catalog card as the cover; Open Library is fallback only. None of them solves it alone — the orchestration is the product.",
        },
        { kind: "heading", text: "What I built" },
        {
          kind: "text",
          text: "A unified search that queries up to 6 sources in parallel, detects query type (ISBN vs. free text) and reconciles everything into a canonical work × edition identity: the same book arriving as `apple-X`, `google-Y` or `isbn:Z` converges into a single document — preventing duplicate cards, fragmented reviews and inconsistent covers. Ratings are keyed by work, not edition, so different editions share the same reviews.",
        },
        {
          kind: "text",
          text: "Around the core: a barcode-first scanner (local ZXing decode, zero cost) with multimodal AI only as a cover-photo fallback; recommendations generated by Gemini but validated against the real catalog before becoming cards; and a self-healing catalog — opening a book with poor metadata triggers background enrichment, so browsing improves the database.",
        },
        { kind: "heading", text: "Engineering decisions I'd defend in an interview" },
        {
          kind: "list",
          items: [
            { label: "Client-locked economy:", text: "coins, XP, streaks and PRO status are only ever written by Cloud Functions, with idempotent transactions keyed by `{userId}_{reason}_{dayKey}`. The client is never trusted with money — not even mine." },
            { label: "The “never cache an empty list” rule:", text: "a failing source returning `[]` would poison the cache for its entire TTL, making books invisible. Every cache layer validates before persisting." },
            { label: "Cost as a requirement:", text: "~40 reads per search became layered caches with distinct TTLs (5min ISBN, 24h text, 7 days CBL); the Google Books quota became an observable metric — a production 503 taught me the difference between a daily quota and a soft rate limit, and the fix was stagger + circuit breaker, not “retry harder”." },
            { label: "Defense in depth as a pattern:", text: "every bug fixed at the source (server), with client-side defense (self-healing) and a cleanup script for already-written data — which lets a living catalog evolve without traumatic migrations." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "Closed beta, pre-launch. The metrics that matter right now are engineering metrics: cost per search, identity convergence, economy integrity.",
        },
      ],
    },
    cover: "",
    gallery: [],
    featured: true,
    published: true,
    order: 1,
  },

  // ── estrutura, não publicado (aguardando autorização/produção) ──
  {
    slug: "dux",
    title: "DUX",
    client: { pt: "DUX", en: "DUX" },
    role: { pt: "Front-end · Motion", en: "Front-end · Motion" },
    year: 2024,
    type: { pt: "Branding · Homepage", en: "Branding · Homepage" },
    stack: ["Next.js", "GSAP", "Three.js"],
    summary: {
      pt: "Homepage de marca com identidade em movimento e hero 3D leve.",
      en: "Brand homepage with motion identity and a lightweight 3D hero.",
    },
    problem: { pt: "—", en: "—" },
    contribution: { pt: "—", en: "—" },
    results: [],
    cover: "",
    gallery: [],
    featured: false,
    published: false,
    order: 5,
  },
  {
    slug: "vivo-dashboard",
    title: "Vivo — Dashboard",
    client: { pt: "Vivo", en: "Vivo" },
    role: { pt: "Front-end", en: "Front-end" },
    year: 2023,
    type: { pt: "App · Dashboard", en: "App · Dashboard" },
    stack: ["React", "TypeScript", "Design System"],
    summary: {
      pt: "Painel de dados com componentes reutilizáveis e performance sob carga.",
      en: "Data dashboard with reusable components and performance under load.",
    },
    problem: { pt: "—", en: "—" },
    contribution: { pt: "—", en: "—" },
    results: [],
    cover: "",
    gallery: [],
    featured: false,
    published: false,
    order: 6,
  },

  // ── placeholders SÓ-DEV (densidade do índice). Nunca em produção. ──
  ...(["placeholder-1", "placeholder-2"].map((slug, i) => ({
    slug,
    title: "EM BREVE",
    client: { pt: "—", en: "—" },
    role: { pt: "—", en: "—" },
    year: 2025,
    type: { pt: "Em breve", en: "Soon" },
    stack: [],
    summary: { pt: "Em breve.", en: "Soon." },
    problem: { pt: "", en: "" },
    contribution: { pt: "", en: "" },
    results: [],
    cover: "",
    gallery: [],
    featured: false,
    published: false,
    order: 10 + i,
  })) satisfies Project[]),
];

const isProd = process.env.NODE_ENV === "production";

/** Acesso síncrono (SSR/fallback): publicados + placeholders só em dev. */
export function getProjects(): Project[] {
  return projects
    .filter((p) => p.published || (!isProd && p.slug.startsWith("placeholder")))
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

/**
 * Leitura real (Firestore). Lê `projects` (published:true) quando o Firebase está
 * configurado; senão (ou vazio/erro) cai nos mocks. Import dinâmico.
 */
export async function fetchPublishedProjects(): Promise<Project[]> {
  try {
    const { isFirebaseConfigured, getFirebaseApp } = await import("@/lib/firebase");
    const app = getFirebaseApp();
    if (!isFirebaseConfigured || !app) return getProjects();

    const { getFirestore, collection, getDocs, query, where } = await import(
      "firebase/firestore"
    );
    const db = getFirestore(app);
    const snap = await getDocs(
      query(collection(db, "projects"), where("published", "==", true)),
    );
    if (snap.empty) return getProjects();

    return snap.docs
      .map((d) => d.data() as Project)
      .sort((a, b) => a.order - b.order);
  } catch {
    return getProjects();
  }
}

export async function fetchProject(slug: string): Promise<Project | undefined> {
  const all = await fetchPublishedProjects();
  return all.find((p) => p.slug === slug);
}
