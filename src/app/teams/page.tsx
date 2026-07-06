"use client";

import { useState } from "react";
import { EXISTING_TEAMS, LEADERBOARD } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import { Users } from "@/components/icons";

export default function TeamsPage() {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState<string[]>([]);

  const allTeams = [
    ...EXISTING_TEAMS.map((te) => ({ name: te.name, mine: true })),
    ...LEADERBOARD.map((l) => ({ name: l.team, mine: false })),
  ].filter((te) => te.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppShell>
      <PageHead title={t.teamsTitle} sub={t.teamsSub} />

      <label htmlFor="team-search" className="sr-only">
        {t.searchTeams}
      </label>
      <input
        id="team-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchTeams}
        className="h-12 w-full max-w-md rounded-xl border border-line bg-paper px-4 text-[15px] outline-none transition-colors focus:border-primary"
      />

      <ul className="mt-6 space-y-2.5">
        {allTeams.map((team) => {
          const isRequested = requested.includes(team.name);
          return (
            <li
              key={team.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-5 py-3.5"
            >
              <span className="inline-flex min-w-0 items-center gap-3 font-semibold">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-sm font-bold text-accent">
                  {team.name[0]}
                </span>
                <span className="truncate">{team.name}</span>
                {team.mine && (
                  <span className="pill bg-mint/40 px-2.5 py-0.5 text-xs font-bold text-mint-dark">
                    {t.yourTeamBadge}
                  </span>
                )}
              </span>
              {!team.mine && (
                <button
                  onClick={() =>
                    !isRequested && setRequested((r) => [...r, team.name])
                  }
                  disabled={isRequested}
                  className={`pill cursor-pointer px-4 py-2 text-sm font-bold transition-colors ${
                    isRequested
                      ? "bg-mint/40 text-mint-dark"
                      : "border-2 border-primary text-accent hover:bg-primary hover:text-white"
                  }`}
                >
                  {isRequested ? t.requested : (
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={14} /> {t.requestJoin}
                    </span>
                  )}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
