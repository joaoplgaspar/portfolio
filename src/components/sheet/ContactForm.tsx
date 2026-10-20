"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/site";

/**
 * Formulário básico: nome, e-mail, mensagem. Com NEXT_PUBLIC_CONTACT_ENDPOINT
 * (ex.: Formspree) envia por POST; sem ele, abre o e-mail já preenchido —
 * funciona sem backend e nunca finge que enviou.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "error";
export type ContactText = {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  sent: string;
  sentMail: string;
  error: string;
  subject: string;
};

export default function ContactForm({ t }: { t: ContactText }) {
  const [status, setStatus] = useState<Status>("idle");
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.message.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(f),
        });
        if (!res.ok) throw new Error("failed");
      } else {
        const subject = encodeURIComponent(`${t.subject} — ${f.name}`);
        const body = encodeURIComponent(`${f.message}\n\n${f.name} · ${f.email}`);
        window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="t-title border-t border-fg pt-5">{ENDPOINT ? t.sent : t.sentMail}</p>;
  }

  const label = "tb-key";
  const field =
    "mt-1 w-full border border-fg bg-[var(--plate)] px-3 py-2.5 text-[1rem] font-[480] outline-none transition-colors focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 border-t border-fg pt-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className={label}>{t.name}</span>
          <input className={field} value={f.name} onChange={set("name")} autoComplete="name" required />
        </label>
        <label>
          <span className={label}>{t.email}</span>
          <input className={field} type="email" value={f.email} onChange={set("email")} autoComplete="email" required />
        </label>
      </div>
      <label>
        <span className={label}>{t.message}</span>
        <textarea className={`${field} resize-y`} rows={6} value={f.message} onChange={set("message")} required />
      </label>
      {status === "error" && (
        <p className="t-small text-accent" role="alert">
          {t.error}
        </p>
      )}
      <div>
        <button type="submit" className="ctl" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.send} →
        </button>
      </div>
    </form>
  );
}
