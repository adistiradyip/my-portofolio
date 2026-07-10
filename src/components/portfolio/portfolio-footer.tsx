"use client";

import type { Profile } from "@/lib/types";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/portfolio/brand-logo";
import { Reveal } from "@/components/portfolio/reveal";
import { useLanguage } from "@/components/portfolio/language-provider";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}


export function PortfolioFooter({ profile }: { profile: Profile }) {
  const { t } = useLanguage();
  const socialLinks = [
    { label: "GitHub", href: profile.github_url, icon: GitHubIcon },
    { label: "LinkedIn", href: profile.linkedin_url, icon: LinkedInIcon },
  ].filter((item) => item.href);

  return (
    <footer className="bg-pf-footer text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0} direction="up">
          <div>
            <p className="text-xl font-extrabold sm:text-2xl">
              <BrandLogo name={profile.full_name} restClassName="text-white" />
            </p>
            <p className="mt-3 text-sm text-gray-400">{profile.headline}</p>
          </div>
          </Reveal>
          <Reveal delay={0.08} direction="up">
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">
              {t.footer.social}
            </h4>
            {socialLinks.length > 0 ? (
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition hover:border-[#ff5722] hover:bg-[#ff5722] hover:text-white"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">—</p>
            )}
          </div>
          </Reveal>
          <Reveal delay={0.16} direction="up">
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">
              {t.footer.portfolio}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/#projects" className="hover:text-[#ff5722]">
                  {t.nav.projects}
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:text-[#ff5722]">
                  {t.nav.testimonials}
                </Link>
              </li>
              <li>
                <Link href="/#blog" className="hover:text-[#ff5722]">
                  {t.nav.blog}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#ff5722]">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          </Reveal>
          <Reveal delay={0.24} direction="up">
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {profile.phone && (
                <li className="flex items-center gap-2.5 break-words">
                  <Phone className="h-4 w-4 shrink-0 text-[#ff5722]" aria-hidden />
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hover:text-[#ff5722]">
                    {profile.phone}
                  </a>
                </li>
              )}
              {profile.email && (
                <li className="flex items-center gap-2.5 break-words">
                  <Mail className="h-4 w-4 shrink-0 text-[#ff5722]" aria-hidden />
                  <a href={`mailto:${profile.email}`} className="hover:text-[#ff5722]">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.location && (
                <li className="flex items-start gap-2.5 break-words">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5722]" aria-hidden />
                  <span>{profile.location}</span>
                </li>
              )}
            </ul>
          </div>
          </Reveal>
        </div>

        <Reveal delay={0.32} direction="up">
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white">
          © {new Date().getFullYear()} {profile.full_name}. {t.footer.rights}
        </div>
        </Reveal>
      </div>
    </footer>
  );
}
