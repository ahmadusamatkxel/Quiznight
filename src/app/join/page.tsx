"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useReservations } from "@/lib/store";
import { useHost, type HostGame } from "@/lib/host";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import { extractCode } from "@/lib/join";
import { Users } from "@/components/icons";

function CodeEntry({
  initial,
  notFound,
  onSubmit,
}: {
  initial: string;
  notFound: boolean;
  onSubmit: (raw: string) => void;
}) {
  const { t } = useLang();
  const [value, setValue] = useState(initial);
  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      {notFound && (
        <div className="mb-4 rounded-xl bg-coral-soft px-4 py-3 text-sm font-bold text-coral-text">
          {t.teamNotFoundTitle} {t.teamNotFoundSub}
        </div>
      )}
      <label htmlFor="team-code" className="block text-sm font-bold text-ink">
        {t.teamCodeLabel}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          id="team-code"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
          placeholder={t.teamCodePlaceholder}
          className="h-12 min-w-[240px] flex-1 rounded-xl border border-line bg-bg px-4 text-[15px] outline-none transition-colors focus:border-primary"
        />
        <button
          onClick={() => onSubmit(value)}
          disabled={!value.trim()}
          className="pill cursor-pointer bg-primary px-5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
        >
          {t.findTeam}
        </button>
      </div>
    </div>
  );
}

function JoinInner() {
  const { t } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const teamParam = params.get("team") ?? "";
  const [tried, setTried] = useState(teamParam);
  const [name, setName] = useState("");
  const [done, setDone] = useState<"requested" | "joined" | null>(null);

  const {
    teams: playerTeams,
    addMember: addPlayerMember,
    hydrated: playerHydrated,
  } = useReservations();
  const { games, addMember: addHostMember, hydrated: hostHydrated } = useHost();

  if (!playerHydrated || !hostHydrated) {
    return (
      <AppShell>
        <div className="h-40 animate-pulse rounded-2xl bg-line/60" aria-label="Loading" />
      </AppShell>
    );
  }

  const playerTeam = tried
    ? playerTeams.find((te) => te.id.toLowerCase() === tried.toLowerCase())
    : undefined;

  let hostMatch: { game: HostGame; team: HostGame["teams"][number] } | undefined;
  if (!playerTeam && tried) {
    for (const g of games) {
      const found = g.teams.find((te) => te.code.toLowerCase() === tried.toLowerCase());
      if (found) {
        hostMatch = { game: g, team: found };
        break;
      }
    }
  }

  const found = playerTeam ?? hostMatch;

  if (!found) {
    return (
      <AppShell>
        <PageHead title={t.joinTeamPageTitle} sub={t.joinTeamPageSub} />
        <CodeEntry
          initial={tried}
          notFound={!!tried}
          onSubmit={(raw) => {
            const code = extractCode(raw, "team");
            if (!code) return;
            setTried(code);
            setDone(null);
            router.replace(`/join?team=${encodeURIComponent(code)}`);
          }}
        />
      </AppShell>
    );
  }

  const teamName = playerTeam ? playerTeam.name : hostMatch!.team.name;
  const memberCount = playerTeam ? playerTeam.members.length : hostMatch!.team.members.length;
  const gameName = hostMatch?.game.name;

  return (
    <AppShell>
      <PageHead
        title={teamName}
        sub={gameName ? `${t.partOfEvent} ${gameName}` : ""}
      />

      {done ? (
        <div className="rounded-2xl border-2 border-mint bg-paper p-6 text-center">
          <div className="display text-xl font-semibold text-mint-dark">
            {done === "joined" ? t.joinedTeamTitle(teamName) : t.requestSentTitle(teamName)}
          </div>
          <p className="mt-1.5 text-muted">
            {done === "joined" ? t.joinedTeamSub : t.requestSentSub}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-paper p-6">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <Users size={15} /> {memberCount} {t.members.toLowerCase()}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              if (playerTeam) {
                addPlayerMember(playerTeam.id, name.trim());
                setDone("requested");
              } else if (hostMatch) {
                addHostMember(hostMatch.game.id, hostMatch.team.id, name.trim(), "link");
                setDone("joined");
              }
            }}
            className="mt-4 flex flex-wrap gap-2"
          >
            <label htmlFor="join-name" className="sr-only">
              {t.yourNameLabel}
            </label>
            <input
              id="join-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.yourNamePlaceholder}
              className="h-12 min-w-[220px] flex-1 rounded-xl border border-line bg-bg px-4 text-[15px] outline-none transition-colors focus:border-primary"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="pill cursor-pointer bg-primary px-5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
            >
              {t.joinThisTeam}
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinInner />
    </Suspense>
  );
}
