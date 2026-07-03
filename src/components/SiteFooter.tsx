"use client";

/* eslint-disable @next/next/no-img-element */

import { useLang } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="mt-14 border-t border-line pt-8 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-semibold text-muted">
          <a href="#" className="hover:text-ink">
            {t.footerTerms}
          </a>
          <a href="#" className="hover:text-ink">
            {t.footerPrivacy}
          </a>
        </div>
        <div className="font-bold text-muted">
          2026 — <span className="text-primary">QuizNight</span>
        </div>
        {/* payment methods (free events, shown for parity) */}
        <div className="flex items-center gap-2 text-xs font-bold text-faint">
          <span className="rounded-md border border-line px-2 py-1">VISA</span>
          <span className="rounded-md border border-line px-2 py-1">
            Mastercard
          </span>
          <span className="rounded-md border border-line px-2 py-1">
            Apple&nbsp;Pay
          </span>
          <span className="rounded-md border border-line px-2 py-1">
            G&nbsp;Pay
          </span>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-muted">{t.footerSupport}</p>

      <div className="mt-4 flex flex-wrap items-center gap-8 opacity-90">
        <img
          src="/footer-founder.svg"
          alt="Demján Sándor Program"
          className="h-16 w-auto dark:brightness-0 dark:invert"
        />
        <img
          src="/footer-nonprofit.svg"
          alt="Neumann János Nonprofit Kft."
          className="h-12 w-auto dark:brightness-0 dark:invert"
        />
      </div>

      <p className="mt-6 text-xs text-faint">{t.footerCredit}</p>
    </footer>
  );
}
