import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { RESUME_PDF, resume } from "@/data/resume";

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  // O conteúdo é o mesmo nas duas línguas: a canônica é a versão sem prefixo.
  return {
    title: "Résumé",
    description: resume.summary,
    alternates: { canonical: "/resume" },
    openGraph: {
      type: "profile",
      siteName: siteConfig.name,
      title: `Résumé — ${siteConfig.name}`,
      description: resume.summary,
      url: "/resume",
      images: [{ url: "/en/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Résumé — ${siteConfig.name}`,
      description: resume.summary,
      images: ["/en/opengraph-image"],
    },
  };
}

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resume");

  const links = [
    { href: siteConfig.url, label: host(siteConfig.url) },
    { href: `mailto:${siteConfig.email}`, label: siteConfig.email },
    { href: siteConfig.social.linkedin, label: host(siteConfig.social.linkedin) },
    { href: siteConfig.social.github, label: host(siteConfig.social.github) },
  ];

  return (
    <>
      <div className="resume-bar mx-auto mb-6 flex max-w-[8.5in] items-center justify-between gap-4">
        <p className="t-small text-muted">{t("note")}</p>
        <a href={RESUME_PDF} download className="ctl shrink-0" data-cursor={t("download")}>
          {t("download")} ↓
        </a>
      </div>

      <article lang="en" className="resume mx-auto">
        <header>
          <h1 className="resume-name">{siteConfig.name}</h1>
          <p className="resume-headline">
            {resume.headline} <span className="text-muted">— {resume.sub}</span>
          </p>
          <p className="resume-meta">
            {resume.location} · {resume.timezone}
          </p>
          <p className="resume-meta">
            {links.map((l, i) => (
              <span key={l.href}>
                {i > 0 && <span aria-hidden> · </span>}
                <a href={l.href}>{l.label}</a>
              </span>
            ))}
          </p>
        </header>

        <section>
          <h2>Summary</h2>
          <p>{resume.summary}</p>
        </section>

        <section>
          <h2>Experience</h2>
          {resume.experience.map((e) => (
            <div key={e.org} className="resume-entry">
              <div className="resume-row">
                <h3>
                  {e.url ? <a href={e.url}>{e.org}</a> : e.org}
                  {e.context && <span className="resume-context"> — {e.context}</span>}
                </h3>
                <span className="resume-period">{e.period}</span>
              </div>
              {e.roles && (
                <div className="resume-roles">
                  {e.roles.map((r) => (
                    <p key={r.title} className="resume-row">
                      <span>{r.title}</span>
                      {r.period && <span className="resume-period">{r.period}</span>}
                    </p>
                  ))}
                </div>
              )}
              <ul>
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="resume-skills">
            {resume.skills.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>Education</h2>
          {resume.education.map((ed) => (
            <div key={ed.title} className="resume-row">
              <p>
                <strong>{ed.title}</strong>
                {ed.org && <span className="resume-context"> — {ed.org}</span>}
              </p>
              {ed.period && <span className="resume-period">{ed.period}</span>}
            </div>
          ))}
        </section>

        {resume.languages.length > 1 && (
          <section>
            <h2>Languages</h2>
            <p>{resume.languages.map((x) => `${x.name} (${x.level})`).join(" · ")}</p>
          </section>
        )}
      </article>
    </>
  );
}
