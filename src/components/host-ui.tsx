"use client";

import Link from "next/link";
import { useHost } from "@/lib/host";
import { useLang } from "@/lib/i18n";
import { PageHead } from "./AppShell";
import { ArrowRight, MapPin, Plus, Users } from "./icons";

/** Dashed "create a game" tile — replaces the old button; also the empty state. */
export function CreateGameCard() {
  const { t } = useLang();
  return (
    <Link
      href="/host/new"
      className="card-select flex items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-paper p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent">
        <Plus size={20} />
      </div>
      <div>
        <div className="display text-lg font-semibold">{t.hostCreateCta}</div>
        <div className="mt-0.5 text-sm text-muted">{t.createGameCardSub}</div>
      </div>
    </Link>
  );
}

export function FlowExplainer() {
  const { t } = useLang();
  const steps = [t.hostFlow1, t.hostFlow2, t.hostFlow3];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {steps.map((s, i) => (
        <div
          key={s}
          className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4"
        >
          <span className="display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-accent">
            {i + 1}
          </span>
          <span className="text-sm font-semibold">{s}</span>
        </div>
      ))}
    </div>
  );
}

function GameCard({
  id,
  name,
  location,
  teams,
}: {
  id: string;
  name: string;
  location: string;
  teams: number;
}) {
  const { t } = useLang();
  return (
    <Link
      href={`/host/game?id=${id}`}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="display text-lg font-semibold leading-snug">{name}</h3>
        <ArrowRight
          size={18}
          className="mt-1 shrink-0 text-faint transition-colors group-hover:text-primary"
        />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted">
        {location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} /> {location}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Users size={14} /> {teams} {t.hostTeamsRegistered}
        </span>
      </div>
    </Link>
  );
}

/** Hosting "Home" — an overview of your games/events (not reserved tables). */
export function HostHome() {
  const { t } = useLang();
  const { games, hydrated } = useHost();
  const totalTeams = games.reduce((n, g) => n + g.teams.length, 0);
  const recent = games.slice(0, 4);

  return (
    <>
      <PageHead title={t.hostHomeTitle} sub={t.hostHomeSub} />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="display text-3xl font-semibold tabular-nums text-accent">
            {hydrated ? games.length : "—"}
          </div>
          <div className="mt-1 text-sm font-semibold text-muted">
            {t.statGamesHosted}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="display text-3xl font-semibold tabular-nums text-accent">
            {hydrated ? totalTeams : "—"}
          </div>
          <div className="mt-1 text-sm font-semibold text-muted">
            {t.statTeamsRegistered}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <FlowExplainer />
      </div>

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="display text-xl font-semibold">{t.hostTitle}</h2>
        {games.length > recent.length && (
          <Link
            href="/host"
            className="inline-flex items-center gap-1 text-sm font-bold text-accent hover:underline"
          >
            {t.seeAllEvents} <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {recent.map((g) => (
          <GameCard
            key={g.id}
            id={g.id}
            name={g.name}
            location={g.location}
            teams={g.teams.length}
          />
        ))}
        <CreateGameCard />
      </div>
    </>
  );
}

export { GameCard };
