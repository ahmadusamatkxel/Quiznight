"use client";

/* eslint-disable @next/next/no-img-element */

import { BADGES } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";

export default function BadgesPage() {
  const { t, lang } = useLang();

  return (
    <AppShell>
      <PageHead title={t.badgesTitle} sub={t.badgesSub} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((b) => (
          <div
            key={b.id}
            className="flex flex-col items-center rounded-2xl border border-line bg-paper p-5 text-center"
          >
            <img
              src={b.img}
              alt={lang === "hu" ? b.nameHu : b.name}
              width={96}
              height={96}
              className="h-24 w-24 object-contain"
              loading="lazy"
            />
            <div className="display mt-3 font-semibold">
              {lang === "hu" ? b.nameHu : b.name}
            </div>
            <div className="pill mt-2 bg-line px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
              {t.notEarned}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-faint">{t.badgeArtNote}</p>
    </AppShell>
  );
}
