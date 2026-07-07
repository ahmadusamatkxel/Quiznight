"use client";

import { useHost } from "@/lib/host";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import { CreateGameCard, GameCard } from "@/components/host-ui";

export default function HostEventsPage() {
  const { t } = useLang();
  const { games, hydrated } = useHost();

  return (
    <AppShell>
      <PageHead title={t.hostTitle} sub={t.hostSub} />

      {!hydrated ? (
        <div className="h-40 animate-pulse rounded-2xl bg-line/60" aria-label="Loading" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {games.map((g) => (
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
      )}
    </AppShell>
  );
}
