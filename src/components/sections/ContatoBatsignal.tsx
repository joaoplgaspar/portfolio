"use client";

import { useState, type FormEvent } from "react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";
import { isFirebaseConfigured, getFirebaseApp } from "@/lib/firebase";

type Status = "idle" | "sending" | "sent" | "error";

/** 📡 Mundo 05 — Bat-Signal. Acenda o sinal e mande mensagem (Firestore + fallback e-mail). */
export default function ContatoBatsignal() {
  const [lit, setLit] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    setLit(true);
    try {
      const app = getFirebaseApp();
      if (isFirebaseConfigured && app) {
        const { getFirestore, collection, addDoc, serverTimestamp } = await import(
          "firebase/firestore"
        );
        const db = getFirestore(app);
        await addDoc(collection(db, "messages"), {
          nome: nome.trim(),
          email: email.trim(),
          mensagem: mensagem.trim(),
          createdAt: serverTimestamp(),
        });
      } else {
        // sem Firebase configurado: abre o cliente de e-mail já preenchido
        const subject = encodeURIComponent(`Contato pelo portfólio — ${nome.trim()}`);
        const body = encodeURIComponent(`${mensagem.trim()}\n\n— ${nome.trim()} (${email.trim()})`);
        window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contato"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gotham px-6 py-28"
    >
      {/* feixe do bat-signal — acende ao interagir */}
      <div
        aria-hidden
        className="anim-signal pointer-events-none absolute left-1/2 top-0 h-[85vh] w-[64vmin] -translate-x-1/2 transition-opacity duration-700"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 0%, transparent 156deg, rgba(255,210,63,0.22) 180deg, transparent 204deg)",
          filter: "blur(8px)",
          opacity: lit ? 1 : 0.45,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        <Reveal>
          <span className="world-tag mb-6">📡 Mundo 05 — Bat-Signal</span>
        </Reveal>

        <Reveal delay={0.05}>
          <button
            type="button"
            onClick={() => setLit((v) => !v)}
            aria-pressed={lit}
            aria-label="Acender o bat-signal"
            className="anim-floaty mx-auto mb-8 grid h-24 w-24 place-items-center rounded-full border text-5xl transition-all duration-500"
            style={{
              borderColor: lit ? "rgba(255,210,63,0.85)" : "rgba(255,210,63,0.35)",
              background: lit ? "rgba(255,210,63,0.22)" : "rgba(255,210,63,0.08)",
              boxShadow: lit ? "0 0 60px rgba(255,210,63,0.5)" : "none",
            }}
          >
            🦇
          </button>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Acenda o <span className="text-bat">sinal</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink/75">
            Tem um projeto, uma ideia ou quer só trocar uma ideia? Manda a mensagem
            — eu respondo.
          </p>
        </Reveal>

        {status === "sent" ? (
          <Reveal>
            <div className="glass mx-auto mt-10 max-w-md rounded-2xl p-8">
              <div className="text-4xl">🦇</div>
              <p className="mt-4 font-display text-2xl font-bold text-bat">
                Sinal recebido!
              </p>
              <p className="mt-2 text-ink/70">
                {isFirebaseConfigured
                  ? "Sua mensagem chegou. Logo te respondo."
                  : "Abri seu e-mail com a mensagem pronta — é só enviar."}
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="mx-auto mt-10 grid gap-3 text-left">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                aria-label="Seu nome"
                className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-ink placeholder-ink/35 outline-none transition focus:border-bat/60 focus:bg-white/[0.08]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                aria-label="Seu e-mail"
                className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-ink placeholder-ink/35 outline-none transition focus:border-bat/60 focus:bg-white/[0.08]"
              />
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Sua mensagem"
                aria-label="Sua mensagem"
                rows={4}
                className="w-full resize-none rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-ink placeholder-ink/35 outline-none transition focus:border-bat/60 focus:bg-white/[0.08]"
              />
              {status === "error" && (
                <p className="text-sm text-red-400">
                  Preenche nome, e-mail e mensagem pra acender o sinal. ⚡
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-1 rounded-full border border-bat/50 bg-bat/15 px-6 py-3 font-semibold text-bat transition hover:bg-bat/25 disabled:opacity-50"
              >
                {status === "sending" ? "Acendendo…" : "Acender o sinal"}
              </button>
            </form>
          </Reveal>
        )}

        <Reveal delay={0.25}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink/60">
            <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-bat">
              {siteConfig.email}
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bat"
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bat"
            >
              GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
