"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
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
import { isFirebaseConfigured, getFirebaseApp } from "@/lib/firebase";
import { getProjetos, type Projeto, type Empresa } from "@/lib/content";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
const EMPRESAS: Empresa[] = ["SHAKERS", "Pessoal", "Estudos"];
const inputCls =
  "w-full rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-ink placeholder-ink/35 outline-none transition focus:border-bat/60";

type Draft = {
  id?: string;
  nome: string;
  descricao: string;
  papel: string;
  empresa: Empresa;
  tecnologias: string;
  github: string;
  site: string;
  imagem: string;
  destaque: boolean;
};

const emptyDraft: Draft = {
  nome: "",
  descricao: "",
  papel: "",
  empresa: "SHAKERS",
  tecnologias: "",
  github: "",
  site: "",
  imagem: "",
  destaque: false,
};

export default function AdminClient() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const isAdmin = !!user && (!ADMIN_EMAIL || user.email === ADMIN_EMAIL);
  const ready = !isFirebaseConfigured || authChecked;

  // observa login e carrega projetos quando o admin entra
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
    const db = getFirestore(app);
    const snap = await getDocs(collection(db, "projetos"));
    setProjetos(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Projeto, "id">) })),
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
    if (!app) return;
    await signOut(getAuth(app));
    setProjetos([]);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const app = getFirebaseApp();
    if (!app) return;
    if (!draft.nome.trim()) {
      setMsg("Nome é obrigatório.");
      return;
    }
    setBusy(true);
    setMsg("");
    const db = getFirestore(app);
    const payload = {
      nome: draft.nome.trim(),
      descricao: draft.descricao.trim(),
      papel: draft.papel.trim() || null,
      empresa: draft.empresa,
      tecnologias: draft.tecnologias
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      github: draft.github.trim() || null,
      site: draft.site.trim() || null,
      imagem: draft.imagem.trim() || null,
      destaque: draft.destaque,
      updatedAt: serverTimestamp(),
    };
    try {
      if (draft.id) {
        await updateDoc(doc(db, "projetos", draft.id), payload);
      } else {
        await addDoc(collection(db, "projetos"), { ...payload, createdAt: serverTimestamp() });
      }
      setDraft(emptyDraft);
      await reload();
      setMsg("Salvo! ✅");
    } catch {
      setMsg("Erro ao salvar — verifique as regras do Firestore.");
    } finally {
      setBusy(false);
    }
  }

  function edit(p: Projeto) {
    setDraft({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao,
      papel: p.papel ?? "",
      empresa: p.empresa,
      tecnologias: p.tecnologias.join(", "),
      github: p.github ?? "",
      site: p.site ?? "",
      imagem: p.imagem ?? "",
      destaque: !!p.destaque,
    });
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    const app = getFirebaseApp();
    if (!app) return;
    if (!window.confirm("Excluir este projeto?")) return;
    const db = getFirestore(app);
    await deleteDoc(doc(db, "projetos", id));
    await reload();
  }

  async function seed() {
    const app = getFirebaseApp();
    if (!app) return;
    if (!window.confirm("Importar os projetos de exemplo para o Firestore?")) return;
    setBusy(true);
    setMsg("");
    const db = getFirestore(app);
    try {
      for (const p of getProjetos()) {
        await addDoc(collection(db, "projetos"), {
          nome: p.nome,
          descricao: p.descricao,
          papel: p.papel ?? null,
          empresa: p.empresa,
          tecnologias: p.tecnologias,
          github: p.github ?? null,
          site: p.site ?? null,
          imagem: p.imagem ?? null,
          destaque: p.destaque ?? false,
          createdAt: serverTimestamp(),
        });
      }
      await reload();
      setMsg("Exemplos importados! Edite ou exclua à vontade.");
    } catch {
      setMsg("Erro ao importar.");
    } finally {
      setBusy(false);
    }
  }

  // ── estados de borda ───────────────────────────────────────────
  if (!isFirebaseConfigured) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-bold">Painel /admin</h1>
        <p className="mt-3 text-ink/70">
          O Firebase ainda não está configurado. Pra ligar o painel:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink/75">
          <li>
            Crie um projeto no{" "}
            <a className="text-bat underline" href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
              Firebase Console
            </a>{" "}
            e ative <b>Firestore</b> e <b>Authentication → E-mail/Senha</b>.
          </li>
          <li>Crie um usuário (seu e-mail) em Authentication → Users.</li>
          <li>
            Copie <code className="rounded bg-white/10 px-1">.env.local.example</code> para{" "}
            <code className="rounded bg-white/10 px-1">.env.local</code> e preencha as chaves{" "}
            <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_FIREBASE_*</code> +{" "}
            <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_ADMIN_EMAIL</code>.
          </li>
          <li>
            Aplique as regras do arquivo <code className="rounded bg-white/10 px-1">firestore.rules</code> (na raiz do repo).
          </li>
        </ol>
        <BackLink />
      </Shell>
    );
  }

  if (!ready) {
    return (
      <Shell>
        <p className="text-ink/60">Carregando…</p>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-bold">Entrar no painel</h1>
        {user && (
          <p className="mt-3 text-sm text-red-400">
            {user.email} não tem permissão. Saia e entre com o e-mail de admin.
          </p>
        )}
        <form onSubmit={login} className="mt-6 grid gap-3">
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="E-mail"
            className={inputCls}
          />
          <input
            type="password"
            value={loginPass}
            onChange={(e) => setLoginPass(e.target.value)}
            placeholder="Senha"
            className={inputCls}
          />
          {msg && <p className="text-sm text-red-400">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-full border border-bat/50 bg-bat/15 px-5 py-2.5 font-semibold text-bat transition hover:bg-bat/25 disabled:opacity-50"
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
          {user && (
            <button type="button" onClick={logout} className="text-sm text-ink/50 hover:text-ink">
              Sair ({user.email})
            </button>
          )}
        </form>
        <BackLink />
      </Shell>
    );
  }

  // ── painel ─────────────────────────────────────────────────────
  return (
    <Shell wide>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Projetos</h1>
        <button onClick={logout} className="text-sm text-ink/60 hover:text-ink">
          Sair ({user?.email})
        </button>
      </div>

      <form onSubmit={save} className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-bat/80">
          {draft.id ? "Editando projeto" : "Novo projeto"}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={inputCls} placeholder="Nome*" value={draft.nome} onChange={(e) => setDraft({ ...draft, nome: e.target.value })} />
          <input className={inputCls} placeholder="Papel (ex: Tech lead)" value={draft.papel} onChange={(e) => setDraft({ ...draft, papel: e.target.value })} />
        </div>
        <textarea className={inputCls} rows={3} placeholder="Descrição" value={draft.descricao} onChange={(e) => setDraft({ ...draft, descricao: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className={inputCls} value={draft.empresa} onChange={(e) => setDraft({ ...draft, empresa: e.target.value as Empresa })}>
            {EMPRESAS.map((emp) => (
              <option key={emp} value={emp} className="bg-gotham">
                {emp}
              </option>
            ))}
          </select>
          <input className={inputCls} placeholder="Tecnologias (vírgula)" value={draft.tecnologias} onChange={(e) => setDraft({ ...draft, tecnologias: e.target.value })} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={inputCls} placeholder="Site (URL)" value={draft.site} onChange={(e) => setDraft({ ...draft, site: e.target.value })} />
          <input className={inputCls} placeholder="GitHub (URL)" value={draft.github} onChange={(e) => setDraft({ ...draft, github: e.target.value })} />
        </div>
        <input className={inputCls} placeholder="Imagem (URL ou /caminho)" value={draft.imagem} onChange={(e) => setDraft({ ...draft, imagem: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-ink/75">
          <input type="checkbox" checked={draft.destaque} onChange={(e) => setDraft({ ...draft, destaque: e.target.checked })} />
          Destaque (aparece primeiro)
        </label>
        {msg && <p className="text-sm text-biolum">{msg}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="rounded-full border border-bat/50 bg-bat/15 px-5 py-2.5 font-semibold text-bat transition hover:bg-bat/25 disabled:opacity-50">
            {busy ? "Salvando…" : draft.id ? "Atualizar" : "Adicionar"}
          </button>
          {draft.id && (
            <button type="button" onClick={() => setDraft(emptyDraft)} className="rounded-full border border-white/15 px-5 py-2.5 text-ink/70 transition hover:bg-white/5">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{projetos.length} projeto(s)</h2>
        {projetos.length === 0 && (
          <button onClick={seed} disabled={busy} className="text-sm text-lego-yellow hover:underline disabled:opacity-50">
            Importar exemplos
          </button>
        )}
      </div>

      <ul className="mt-4 grid gap-3">
        {projetos.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="min-w-0">
              <p className="truncate font-semibold">
                {p.destaque && <span className="mr-1 text-bat">★</span>}
                {p.nome} <span className="text-xs text-ink/40">· {p.empresa}</span>
              </p>
              <p className="truncate text-sm text-ink/55">{p.descricao}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => edit(p)} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5">
                Editar
              </button>
              <button onClick={() => remove(p.id)} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10">
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
      <BackLink />
    </Shell>
  );
}

function Shell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <main className="min-h-screen bg-gotham px-6 py-16">
      <div className={`mx-auto ${wide ? "max-w-3xl" : "max-w-md"}`}>{children}</div>
    </main>
  );
}

function BackLink() {
  return (
    <Link href="/" className="mt-8 inline-block font-mono text-xs text-ink/50 hover:text-bat">
      ← voltar ao site
    </Link>
  );
}
