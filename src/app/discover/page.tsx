"use client";

import Link from "next/link";
import { EVENTS, evDate, evDesc, evTitle } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import {
  ArrowRight,
  Calendar,
  Crown,
  MapPin,
  Ticket,
} from "@/components/icons";

const ACCENT_CHIP: Record<string, string> = {
  purple: "bg-primary-soft text-accent",
  mint: "bg-mint/40 text-mint-dark",
  coral: "bg-coral-soft text-coral-text",
};

export default function DiscoverPage() {
  const { t, lang } = useLang();

  return (
    <AppShell>
      <PageHead title={t.discoverTitle} sub={t.discoverSub} />

      <h2 className="display mb-4 flex items-center gap-2 text-xl font-semibold">
        <Ticket size={20} className="text-primary" /> {t.discoverAvailable}
      </h2>

      <div className="space-y-4">
        {EVENTS.map((ev) => (
          <article
            key={ev.id}
            className="group flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-primary sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="display text-lg font-semibold leading-snug">
                  {evTitle(ev, lang)}
                </span>
                <span
                  className={`pill px-2.5 py-0.5 text-xs font-bold ${ACCENT_CHIP[ev.accent]}`}
                >
                  {t.free}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={15} /> {evDate(ev, lang)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} /> {ev.venue}, {ev.city}
                </span>
                {ev.quizmaster && (
                  <span className="inline-flex items-center gap-1.5">
                    <Crown size={15} className="text-coral-text" />
                    {ev.quizmaster}
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-faint">
                {evDesc(ev, lang)}
              </p>
            </div>

            <Link
              href={`/reserve?event=${ev.id}`}
              className="pill inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 bg-primary px-6 py-3 font-bold text-white transition-colors duration-200 hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
            >
              {t.reserveCta} <ArrowRight size={17} />
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
