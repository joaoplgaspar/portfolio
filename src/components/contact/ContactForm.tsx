"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";
import { btn } from "@/components/ui/button";

// Se você plugar um endpoint (ex.: Formspree) via env, o form envia por lá.
// Sem endpoint, cai no mailto — funcional desde já, sem backend.
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

const TYPES = ["E-commerce", "Landing", "App", "Outro"];
const BUDGETS = ["< R$ 10k", "R$ 10–30k", "R$ 30–60k", "> R$ 60k"];

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-[3px] border border-line bg-raised px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent-lift";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");
  const [f, setF] = useState({
    name: "",
    email: "",
    company: "",
    type: TYPES[0],
    budget: BUDGETS[1],
    message: "",
  });

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

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
        const subject = encodeURIComponent(
          `Projeto — ${f.name}${f.company ? ` (${f.company})` : ""}`,
        );
        const body = encodeURIComponent(
          `${f.message}\n\nTipo: ${f.type}\nOrçamento: ${f.budget}\n\n${f.name} · ${f.email}`,
        );
        window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[4px] border border-line bg-raised p-8">
        <p className="text-h3">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-label text-muted">{t("name")}</span>
          <input className={field} value={f.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label className="grid gap-2">
          <span className="text-label text-muted">{t("email")}</span>
          <input className={field} type="email" value={f.email} onChange={set("email")} autoComplete="email" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-label text-muted">{t("company")}</span>
          <input className={field} value={f.company} onChange={set("company")} autoComplete="organization" />
        </label>
        <label className="grid gap-2">
          <span className="text-label text-muted">{t("type")}</span>
          <select className={field} value={f.type} onChange={set("type")}>
            {TYPES.map((o) => (
              <option key={o} value={o} className="bg-raised">
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-label text-muted">{t("budget")}</span>
        <select className={field} value={f.budget} onChange={set("budget")}>
          {BUDGETS.map((o) => (
            <option key={o} value={o} className="bg-raised">
              {o}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-label text-muted">{t("message")}</span>
        <textarea className={`${field} resize-none`} rows={5} value={f.message} onChange={set("message")} />
      </label>

      {status === "error" && (
        <p className="text-sm text-accent-lift">{t("error")}</p>
      )}

      <button type="submit" disabled={status === "sending"} className={`${btn("primary")} disabled:opacity-60`}>
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
