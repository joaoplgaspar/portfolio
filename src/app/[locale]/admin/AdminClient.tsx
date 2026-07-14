"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { CldUploadWidget } from "next-cloudinary";
import { isFirebaseConfigured, getFirebaseApp } from "@/lib/firebase";
import { getProjects } from "@/data/projects";
import type { Project } from "@/types/project";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const field =
  "w-full rounded-[3px] border border-line bg-raised px-3 py-2 text-sm text-fg outline-none transition placeholder:text-muted/50 focus:border-accent-lift";

type Draft = {
  id?: string;
  slug: string;
  title: string;
  clientPt: string;
  clientEn: string;
  rolePt: string;
  roleEn: string;
  year: string;
  typePt: string;
  typeEn: string;
  order: string;
  stack: string;
  summaryPt: string;
  summaryEn: string;
  problemPt: string;
  problemEn: string;
  contributionPt: string;
  contributionEn: string;
  results: string;
  cover: string;
  gallery: string;
  featured: boolean;
  published: boolean;
};

const empty: Draft = {
  slug: "", title: "", clientPt: "", clientEn: "", rolePt: "", roleEn: "", year: "2025",
  typePt: "", typeEn: "", order: "1",
  stack: "", summaryPt: "", summaryEn: "", problemPt: "", problemEn: "",
  contributionPt: "", contributionEn: "", results: "", cover: "", gallery: "",
  featured: false, published: true,
};

const list = (s: string) => s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);

function draftToDoc(d: Draft) {
  return {
    slug: d.slug.trim(),
    title: d.title.trim(),
    client: { pt: d.clientPt.trim(), en: d.clientEn.trim() },
    role: { pt: d.rolePt.trim(), en: d.roleEn.trim() },
    year: Number(d.year) || new Date().getFullYear(),
    type: { pt: d.typePt.trim(), en: d.typeEn.trim() },
    order: Number(d.order) || 0,
    stack: list(d.stack),
    summary: { pt: d.summaryPt.trim(), en: d.summaryEn.trim() },
    problem: { pt: d.problemPt.trim(), en: d.problemEn.trim() },
    contribution: { pt: d.contributionPt.trim(), en: d.contributionEn.trim() },
    results: d.results
      .split("\n")
      .map((line) => {
        const [label, ...rest] = line.split("|");
        return { label: (label || "").trim(), value: rest.join("|").trim() };
      })
      .filter((r) => r.label),
    cover: d.cover.trim(),
    gallery: list(d.gallery),
    featured: d.featured,
    published: d.published,
    updatedAt: serverTimestamp(),
  };
}

function projectToDraft(p: Project & { id?: string }): Draft {
  return {
    id: p.id,
    slug: p.slug, title: p.title,
    clientPt: p.client.pt, clientEn: p.client.en,
    rolePt: p.role.pt, roleEn: p.role.en,
    year: String(p.year), typePt: p.type.pt, typeEn: p.type.en,
    order: String(p.order),
    stack: p.stack.join(", "),
    summaryPt: p.summary.pt, summaryEn: p.summary.en,
    problemPt: p.problem.pt, problemEn: p.problem.en,
    contributionPt: p.contribution.pt, contributionEn: p.contribution.en,
    results: p.results.map((r) => `${r.label}|${r.value}`).join("\n"),
    cover: p.cover || "", gallery: (p.gallery || []).join(", "),
    featured: !!p.featured, published: !!p.published,
  };
}

export default function AdminClient() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [items, setItems] = useState<(Project & { id: string })[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const isAdmin = !!user && (!ADMIN_EMAIL || user.email === ADMIN_EMAIL);
  const ready = !isFirebaseConfigured || authChecked;

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const app = getFirebaseApp();
    if (!app) return;
    const unsub = onAuthStateChanged(getAuth(app), (u) => {
      setUser(u);
      setAuthChecked(true);
      if (u && (!ADMIN_EMAIL || u.email === ADMIN_EMAIL)) void reload();
    });
    return () => unsub();
  }, []);

  async function reload() {
    const app = getFirebaseApp();
    if (!app) return;
    const snap = await getDocs(collection(getFirestore(app), "projects"));
    setItems(
      snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Project) }))
        .sort((a, b) => a.order - b.order),
    );
  }

  async function login(e: FormEvent) {
    e.preventDefault();
    const app = getFirebaseApp();
    if (!app) return;
    setBusy(true);
    setMsg("");
    try {
      await signInWithEmailAndPassword(getAuth(app), loginEmail.trim(), loginPass);
    } catch {
      setMsg("Login falhou — confira e-mail e senha.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    const app = getFirebaseApp();
    if (app) await signOut(getAuth(app));
    setItems([]);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const app = getFirebaseApp();
    if (!app) return;
    if (!draft.slug.trim() || !draft.title.trim()) {
      setMsg("Slug e título são obrigatórios.");
      return;
    }
    setBusy(true);
    setMsg("");
    const db = getFirestore(app);
    try {
      const payload = draftToDoc(draft);
      if (draft.id) {
        await updateDoc(doc(db, "projects", draft.id), payload);
      } else {
        await addDoc(collection(db, "projects"), { ...payload, createdAt: serverTimestamp() });
      }
      setDraft(empty);
      await reload();
      setMsg("Salvo ✅");
    } catch {
      setMsg("Erro ao salvar — verifique as regras do Firestore.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const app = getFirebaseApp();
    if (!app || !window.confirm("Excluir este projeto?")) return;
    await deleteDoc(doc(getFirestore(app), "projects", id));
    await reload();
  }

  async function seed() {
    const app = getFirebaseApp();
    if (!app || !window.confirm("Importar os projetos de exemplo?")) return;
    setBusy(true);
    const db = getFirestore(app);
    try {
      for (const p of getProjects()) {
        await addDoc(collection(db, "projects"), {
          ...draftToDoc(projectToDraft(p)),
          createdAt: serverTimestamp(),
        });
      }
      await reload();
      setMsg("Exemplos importados.");
    } catch {
      setMsg("Erro ao importar.");
    } finally {
      setBusy(false);
    }
  }

  const set =
    (k: keyof Draft) =>
    (e: { target: { value: string } }) =>
      setDraft((d) => ({ ...d, [k]: e.target.value }));

  // ── estados de borda ──────────────────────────────────────────
  if (!isFirebaseConfigured) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-semibold">Painel /admin</h1>
        <p className="mt-3 text-muted">Firebase ainda não configurado. Para ligar:</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>
            Crie um projeto no{" "}
            <a className="text-accent-lift underline" href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
              Firebase Console
            </a>{" "}
            e ative <b>Firestore</b> + <b>Authentication → E-mail/Senha</b>.
          </li>
          <li>Crie um usuário (seu e-mail) em Authentication → Users.</li>
          <li>
            Copie <code className="rounded bg-raised px-1">.env.local.example</code> → <code className="rounded bg-raised px-1">.env.local</code> e preencha <code className="rounded bg-raised px-1">NEXT_PUBLIC_FIREBASE_*</code>, <code className="rounded bg-raised px-1">NEXT_PUBLIC_ADMIN_EMAIL</code> e (p/ imagens) <code className="rounded bg-raised px-1">NEXT_PUBLIC_CLOUDINARY_*</code>.
          </li>
          <li>Aplique <code className="rounded bg-raised px-1">firestore.rules</code> (na raiz do repo).</li>
        </ol>
      </Shell>
    );
  }
  if (!ready) return <Shell><p className="text-muted">Carregando…</p></Shell>;

  if (!isAdmin) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-semibold">Entrar</h1>
        {user && (
          <p className="mt-3 text-sm text-accent-lift">
            {user.email} sem permissão. Saia e entre com o e-mail de admin.
          </p>
        )}
        <form onSubmit={login} className="mt-6 grid max-w-sm gap-3">
          <input className={field} type="email" placeholder="E-mail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          <input className={field} type="password" placeholder="Senha" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
          {msg && <p className="text-sm text-accent-lift">{msg}</p>}
          <button type="submit" disabled={busy} className="rounded-[3px] bg-accent px-5 py-2.5 font-medium text-fg transition hover:bg-accent-lift disabled:opacity-50">
            {busy ? "Entrando…" : "Entrar"}
          </button>
          {user && (
            <button type="button" onClick={logout} className="text-sm text-muted hover:text-fg">
              Sair ({user.email})
            </button>
          )}
        </form>
      </Shell>
    );
  }

  // ── painel ────────────────────────────────────────────────────
  return (
    <Shell wide>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Projetos</h1>
        <button onClick={logout} className="text-label text-muted hover:text-fg">
          Sair ({user?.email})
        </button>
      </div>

      <form onSubmit={save} className="mt-8 grid gap-5 rounded-[4px] border border-line bg-raised/40 p-6">
        <p className="text-label text-accent-lift">{draft.id ? "Editando" : "Novo projeto"}</p>

        <div className="grid gap-3 sm:grid-cols-3">
          <L t="Slug*"><input className={field} value={draft.slug} onChange={set("slug")} placeholder="livra" /></L>
          <L t="Título*"><input className={field} value={draft.title} onChange={set("title")} /></L>
          <L t="Cliente (PT)"><input className={field} value={draft.clientPt} onChange={set("clientPt")} placeholder="Projeto próprio" /></L>
          <L t="Client (EN)"><input className={field} value={draft.clientEn} onChange={set("clientEn")} placeholder="Own product" /></L>
          <L t="Papel (PT)"><input className={field} value={draft.rolePt} onChange={set("rolePt")} placeholder="Front-end · Motion" /></L>
          <L t="Role (EN)"><input className={field} value={draft.roleEn} onChange={set("roleEn")} placeholder="Front-end · Motion" /></L>
          <L t="Tipo (PT)"><input className={field} value={draft.typePt} onChange={set("typePt")} placeholder="Product · Full-stack" /></L>
          <L t="Type (EN)"><input className={field} value={draft.typeEn} onChange={set("typeEn")} placeholder="Product · Full-stack" /></L>
          <div className="grid grid-cols-2 gap-3">
            <L t="Ano"><input className={field} value={draft.year} onChange={set("year")} /></L>
            <L t="Ordem"><input className={field} value={draft.order} onChange={set("order")} /></L>
          </div>
        </div>

        <L t="Stack (vírgula)"><input className={field} value={draft.stack} onChange={set("stack")} placeholder="React, Next.js, GSAP" /></L>

        <div className="grid gap-3 sm:grid-cols-2">
          <L t="Resumo (PT)"><textarea className={field} rows={2} value={draft.summaryPt} onChange={set("summaryPt")} /></L>
          <L t="Summary (EN)"><textarea className={field} rows={2} value={draft.summaryEn} onChange={set("summaryEn")} /></L>
          <L t="Problema (PT)"><textarea className={field} rows={2} value={draft.problemPt} onChange={set("problemPt")} /></L>
          <L t="Problem (EN)"><textarea className={field} rows={2} value={draft.problemEn} onChange={set("problemEn")} /></L>
          <L t="O que fiz (PT)"><textarea className={field} rows={3} value={draft.contributionPt} onChange={set("contributionPt")} /></L>
          <L t="What I did (EN)"><textarea className={field} rows={3} value={draft.contributionEn} onChange={set("contributionEn")} /></L>
        </div>

        <L t="Resultados (um por linha: rótulo|valor)">
          <textarea className={field} rows={3} value={draft.results} onChange={set("results")} placeholder={"LCP|4.1s → 1.8s\nConversão|+18%"} />
        </L>

        <div className="grid gap-3 sm:grid-cols-2">
          <L t="Cover (Cloudinary public_id)">
            <div className="flex gap-2">
              <input className={field} value={draft.cover} onChange={set("cover")} placeholder="portfolio/dux-cover" />
              {CLOUD && PRESET && (
                <CldUploadWidget
                  uploadPreset={PRESET}
                  onSuccess={(r) => {
                    const info = r?.info;
                    if (info && typeof info === "object" && "public_id" in info) {
                      setDraft((d) => ({ ...d, cover: String((info as { public_id: string }).public_id) }));
                    }
                  }}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="shrink-0 rounded-[3px] border border-line px-3 text-sm text-muted hover:text-fg">
                      Upload
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </L>
          <L t="Galeria (public_ids, vírgula)"><input className={field} value={draft.gallery} onChange={set("gallery")} /></L>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={draft.published} onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))} /> Publicado
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))} /> Destaque
          </label>
          {!CLOUD && <span className="text-xs text-muted/70">Cloudinary não configurado — cole o public_id manualmente.</span>}
        </div>

        {msg && <p className="text-sm text-accent-lift">{msg}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="rounded-[3px] bg-accent px-5 py-2.5 font-medium text-fg transition hover:bg-accent-lift disabled:opacity-50">
            {busy ? "Salvando…" : draft.id ? "Atualizar" : "Adicionar"}
          </button>
          {draft.id && (
            <button type="button" onClick={() => setDraft(empty)} className="rounded-[3px] border border-line px-5 py-2.5 text-muted hover:bg-raised">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{items.length} projeto(s)</h2>
        {items.length === 0 && (
          <button onClick={seed} disabled={busy} className="text-sm text-accent-lift hover:underline disabled:opacity-50">
            Importar exemplos
          </button>
        )}
      </div>
      <ul className="mt-4 grid gap-3">
        {items.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 rounded-[4px] border border-line bg-raised/40 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {p.featured && <span className="mr-1 text-accent-lift">★</span>}
                {p.title} <span className="text-xs text-muted/60">· {p.type?.pt} · {p.year}</span>
                {!p.published && <span className="ml-2 text-xs text-muted/60">(rascunho)</span>}
              </p>
              <p className="truncate text-sm text-muted/70">{p.summary?.pt}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => setDraft(projectToDraft(p))} className="rounded-[3px] border border-line px-3 py-1.5 text-sm hover:bg-raised">Editar</button>
              <button onClick={() => remove(p.id)} className="rounded-[3px] border border-accent/50 px-3 py-1.5 text-sm text-accent-lift hover:bg-accent/10">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function Shell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <main className="min-h-screen px-6 pb-24 pt-28">
      <div className={`mx-auto ${wide ? "max-w-4xl" : "max-w-md"}`}>{children}</div>
    </main>
  );
}

function L({ t, children }: { t: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-label text-muted">{t}</span>
      {children}
    </label>
  );
}
