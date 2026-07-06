"use client";

import { NEWS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import { Sparkles, Trophy, Beer } from "@/components/icons";

const ACCENT: Record<string, { bar: string; chip: string; icon: React.ReactNode }> = {
  purple: {
    bar: "bg-primary",
    chip: "bg-primary-soft text-accent",
    icon: <Trophy size={18} />,
  },
  coral: {
    bar: "bg-coral",
    chip: "bg-coral-soft text-coral-text",
    icon: <Beer size={18} />,
  },
  mint: {
    bar: "bg-mint",
    chip: "bg-mint/40 text-mint-dark",
    icon: <Sparkles size={18} />,
  },
};

export default function NewsPage() {
  const { t, lang } = useLang();

  return (
    <AppShell>
      <PageHead title={t.newsTitle} sub={t.newsSub} />

      <div className="grid gap-4 sm:grid-cols-3">
        {NEWS.map((n) => {
          const a = ACCENT[n.accent];
          return (
            <article
              key={n.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper"
            >
              <div className={`h-1.5 ${a.bar}`} />
              <div className="flex flex-1 flex-col p-5">
                <div
                  className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${a.chip}`}
                >
                  {a.icon}
                </div>
                <h2 className="display text-lg font-semibold leading-snug">
                  {lang === "hu" ? n.titleHu : n.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {lang === "hu" ? n.bodyHu : n.body}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
