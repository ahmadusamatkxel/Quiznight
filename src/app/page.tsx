"use client";

import Link from "next/link";
import { EVENTS, evDate, evTitle } from "@/lib/data";
import { useReservations } from "@/lib/store";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import WinnersCarousel from "@/components/WinnersCarousel";
import {
  ArrowRight,
  Calendar,
  Crown,
  MapPin,
  Sparkles,
  Ticket,
  Trophy,
  Users,
} from "@/components/icons";

function Explainer() {
  const { t } = useLang();
  const items = [
    { icon: <Sparkles size={20} />, title: t.whatIsTitle, body: t.whatIsBody, cls: "bg-primary-soft text-accent" },
    { icon: <Trophy size={20} />, title: t.champTitle, body: t.champBody, cls: "bg-mint/40 text-mint-dark" },
    { icon: <Crown size={20} />, title: t.reserveStepTitle, body: t.reserveStepBody, cls: "bg-coral-soft text-coral-text" },
  ];
  return (
    <section className="mt-12">
      <h2 className="display text-xl font-semibold">{t.whatTitle}</h2>
      <p className="mt-1 text-muted">{t.whatSub}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-line bg-paper p-5">
            <div className={`mb-3 grid h-11 w-11 place-items-center rounded-xl ${it.cls}`}>
              {it.icon}
            </div>
            <h3 className="display font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  const { t } = useLang();
  return (
    <div className="relative overflow-hidden rounded-3xl bg-panel px-6 py-14 text-center text-white sm:px-12">
      {/* floating collage shapes, Genially-style */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="float-slow absolute left-[8%] top-[18%] rotate-[-8deg] rounded-xl bg-primary px-3 py-1.5 text-xs font-bold">
          Round 26
        </div>
        <div className="float-slower absolute right-[10%] top-[22%] rotate-[6deg] rounded-xl bg-coral-deep px-3 py-1.5 text-xs font-bold text-white">
          🥇 25,000 Ft
        </div>
        <div className="float-slow absolute bottom-[20%] right-[16%] rotate-[-5deg] rounded-xl bg-mint px-3 py-1.5 text-xs font-bold text-[#17141f]">
          Monday · quiz night
        </div>
        <div className="float-slower absolute bottom-[24%] left-[14%] rotate-[7deg] rounded-full border-2 border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70">
          Dürer Kert
        </div>
      </div>

      <div className="relative">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
          <Ticket size={30} />
        </div>
        <h2 className="display text-3xl font-semibold sm:text-4xl">
          {t.emptyTitle1} <span className="text-mint">{t.emptyTitleAccent}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/70">{t.emptySub}</p>
        <Link
          href="/discover"
          className="pill mt-8 inline-flex cursor-pointer items-center gap-2 bg-primary px-7 py-3.5 font-bold text-white transition-colors duration-200 hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-mint"
        >
          {t.reserveCta} <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

const ACCENT_BG: Record<string, string> = {
  purple: "bg-primary text-white",
  mint: "bg-mint text-[#17141f]",
  coral: "bg-coral-deep text-white",
};

function ReservationList() {
  const { t, lang } = useLang();
  const { reservations, eventById, clearReservations } = useReservations();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reservations.map((r) => {
          const ev = eventById(r.eventId);
          if (!ev) return null;
          return (
            <article
              key={r.id}
              className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm"
            >
              <div
                className={`flex items-center justify-between px-5 py-3 text-sm font-bold ${ACCENT_BG[ev.accent]}`}
              >
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} /> {evDate(ev, lang)}
                </span>
                <span className="pill bg-black/20 px-2.5 py-0.5 text-xs uppercase tracking-wide text-white">
                  {t.reserved}
                </span>
              </div>
              <div className="px-5 py-4">
                <h3 className="display text-lg font-semibold leading-snug">
                  {evTitle(ev, lang)}
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} /> {ev.venue}, {ev.city}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={15} /> {r.teamName} · {r.players}{" "}
                    {r.players > 1 ? t.players : t.player}
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-mint/40 px-2.5 py-1 text-xs font-bold text-mint-dark">
                  <Trophy size={13} /> {t.freeEntry}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href="/discover"
          className="pill inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 font-bold text-white transition-colors duration-200 hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
        >
          {t.reserveAnother} <ArrowRight size={17} />
        </Link>
        <button
          onClick={clearReservations}
          className="cursor-pointer text-sm font-semibold text-muted underline-offset-4 hover:underline"
        >
          {t.resetDemo}
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t, lang } = useLang();
  const { reservations, hydrated } = useReservations();

  return (
    <AppShell>
      <PageHead title={t.dashTitle} sub={t.dashSub} />

      {!hydrated ? (
        <div
          className="h-72 animate-pulse rounded-3xl bg-line/60"
          aria-label="Loading"
        />
      ) : reservations.length === 0 ? (
        <EmptyState />
      ) : (
        <ReservationList />
      )}

      <div className="mt-12">
        <WinnersCarousel />
      </div>

      <Explainer />

      <section className="mt-12">
        <h2 className="display mb-4 text-xl font-semibold">{t.upcoming}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {EVENTS.map((ev) => (
            <Link
              key={ev.id}
              href={`/reserve?event=${ev.id}`}
              className="block rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-primary"
            >
              <div className="text-xs font-bold uppercase tracking-wide text-accent">
                {evDate(ev, lang)}
              </div>
              <div className="display mt-1 font-semibold leading-snug">
                {evTitle(ev, lang)}
              </div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
                <MapPin size={14} /> {ev.venue} · {t.free}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
