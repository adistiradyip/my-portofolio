"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/actions";
import type { Profile } from "@/lib/types";
import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/portfolio/reveal";
import { useLanguage } from "@/components/portfolio/language-provider";

export function ContactSection({ profile }: { profile: Profile }) {
  const { locale, t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formStartedAt = useRef(Date.now());
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "collaboration",
    message: "",
  });

  useEffect(() => {
    setForm((current) => ({ ...current, subject: "collaboration" }));
  }, [locale]);

  function getErrorMessage(code: string) {
    if (code === "spam") return t.contact.errors.spam;
    if (code === "rate_limit") return t.contact.errors.rateLimit;
    if (code === "validation") return t.contact.errors.validation;
    return t.contact.errors.generic;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subjectLabel =
      t.contact.subjects[form.subject as keyof typeof t.contact.subjects];
    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("email", form.email);
    formData.set(
      "message",
      `${t.contact.formPrefix(subjectLabel, form.phone)}${form.message}`,
    );
    formData.set("website", honeypot);
    formData.set("form_started_at", String(formStartedAt.current));

    startTransition(async () => {
      const result = await sendContactMessage(formData);
      if (result.error) {
        toast.error(getErrorMessage(result.error));
        return;
      }
      setSent(true);
    });
  }

  return (
    <section id="contact" className="bg-pf-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <Reveal direction="left">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff5722]">
              {t.contact.badge}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-pf-text sm:text-3xl md:text-4xl">
              {t.contact.title}
            </h2>
            <p className="mt-4 text-pf-muted">{t.contact.description}</p>

            <div className="mt-8 space-y-4">
              {profile.email && (
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff5722]/10 text-[#ff5722]">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-pf-faint">
                      {t.contact.email}
                    </p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="mt-0.5 block break-words text-sm font-medium text-pf-text transition hover:text-[#ff5722]"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff5722]/10 text-[#ff5722]">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-pf-faint">
                      {t.contact.phone}
                    </p>
                    <a
                      href={`tel:${profile.phone.replace(/\s/g, "")}`}
                      className="mt-0.5 block break-words text-sm font-medium text-pf-text transition hover:text-[#ff5722]"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}
              {profile.location && (
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff5722]/10 text-[#ff5722]">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-pf-faint">
                      {t.contact.location}
                    </p>
                    <p className="mt-0.5 break-words text-sm font-medium text-pf-text">
                      {profile.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12} direction="right">
            {sent ? (
              <div className="rounded-2xl border border-pf-border bg-pf-surface p-8 text-center shadow-sm sm:p-10">
                <p className="text-lg font-bold text-[#ff5722]">{t.contact.successTitle}</p>
                <p className="mt-2 text-sm text-pf-muted">{t.contact.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative rounded-2xl border border-pf-border bg-pf-surface p-5 shadow-sm sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                >
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder={t.contact.namePlaceholder}
                    className="rounded-lg border border-pf-border bg-pf-bg px-4 py-3 text-sm text-pf-text outline-none focus:border-[#ff5722]"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder={t.contact.emailPlaceholder}
                    className="rounded-lg border border-pf-border bg-pf-bg px-4 py-3 text-sm text-pf-text outline-none focus:border-[#ff5722]"
                  />
                </div>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t.contact.phonePlaceholder}
                  className="mt-4 w-full rounded-lg border border-pf-border bg-pf-bg px-4 py-3 text-sm text-pf-text outline-none focus:border-[#ff5722]"
                />
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-4 w-full rounded-lg border border-pf-border bg-pf-bg px-4 py-3 text-sm text-pf-text outline-none focus:border-[#ff5722]"
                >
                  <option value="collaboration">{t.contact.subjects.collaboration}</option>
                  <option value="freelance">{t.contact.subjects.freelance}</option>
                  <option value="fulltime">{t.contact.subjects.fulltime}</option>
                  <option value="other">{t.contact.subjects.other}</option>
                </select>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  placeholder={t.contact.messagePlaceholder}
                  className="mt-4 w-full rounded-lg border border-pf-border bg-pf-bg px-4 py-3 text-sm text-pf-text outline-none focus:border-[#ff5722]"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-4 w-full rounded-md bg-[#ff5722] py-3.5 text-sm font-bold text-white transition hover:bg-[#e64a19] disabled:opacity-50"
                >
                  {isPending ? t.contact.sending : t.contact.submit}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
