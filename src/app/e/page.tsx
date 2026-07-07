"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHost, type GameTeam, type HostGame } from "@/lib/host";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import { InviteLinkBlock, useOrigin } from "@/components/InviteLink";
import { extractCode } from "@/lib/join";
import { Plus, Users } from "@/components/icons";

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
          {t.eventNotFoundTitle} {t.eventNotFoundSub}
        </div>
      )}
      <label htmlFor="event-code" className="block text-sm font-bold text-ink">
        {t.eventCodeLabel}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          id="event-code"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
          placeholder={t.eventCodePlaceholder}
          className="h-12 min-w-[240px] flex-1 rounded-xl border border-line bg-bg px-4 text-[15px] outline-none transition-colors focus:border-primary"
        />
        <button
          onClick={() => onSubmit(value)}
          disabled={!value.trim()}
          className="pill cursor-pointer bg-primary px-5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
        >
          {t.findEvent}
        </button>
      </div>
    </div>
  );
}

function JoinTeamRow({ game, team }: { game: HostGame; team: GameTeam }) {
  const { t } = useLang();
  const { addMember } = useHost();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <li className="rounded-xl border border-line bg-bg px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-semibold">
          {team.name}
          <span className="inline-flex items-center gap-1 text-sm font-normal text-muted">
            <Users size={13} /> {team.members.length}/{team.size}
          </span>
        </span>
        {joined ? (
          <span className="pill bg-mint/40 px-3 py-1 text-xs font-bold text-mint-dark">
            {t.joinedShort}
          </span>
        ) : (
          !open && (
            <button
              onClick={() => setOpen(true)}
              className="pill cursor-pointer border-2 border-primary px-3 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-primary hover:text-white"
            >
              {t.joinThisTeam}
            </button>
          )
        )}
      </div>
      {open && !joined && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            addMember(game.id, team.id, name.trim(), "link");
            setJoined(true);
          }}
          className="step-in mt-3 flex flex-wrap gap-2"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.yourNamePlaceholder}
            className="h-10 min-w-[180px] flex-1 rounded-lg border border-line bg-paper px-3 text-sm outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="pill cursor-pointer bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
          >
            {t.joinThisTeam}
          </button>
        </form>
      )}
    </li>
  );
}

function RegisterNewTeam({
  game,
  defaultName,
  origin,
}: {
  game: HostGame;
  defaultName: string;
  origin: string;
}) {
  const { t } = useLang();
  const { addTeam } = useHost();
  const [open, setOpen] = useState(!!defaultName);
  const [name, setName] = useState(defaultName);
  const [captain, setCaptain] = useState("");
  const [size, setSize] = useState(4);
  const [result, setResult] = useState<GameTeam | null>(null);

  if (result) {
    return (
      <div className="step-in rounded-2xl border-2 border-mint bg-paper p-5">
        <div className="display text-lg font-semibold text-mint-dark">
          {t.teamJoinedTitle(result.name)}
        </div>
        <p className="mt-1 text-sm text-muted">{t.teamJoinedSub(game.name)}</p>
        <InviteLinkBlock
          id={`qr-newteam-${result.id}`}
          title={t.teamInviteLink}
          link={origin ? `${origin}/join?team=${result.code}` : ""}
          hint={t.teamInviteHint}
        />
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="card-select flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-paper p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral-soft text-coral-text">
          <Plus size={20} />
        </div>
        <div>
          <div className="display text-lg font-semibold">{t.registerNewTeamTitle}</div>
          <div className="mt-0.5 text-sm text-muted">{t.registerNewTeamSub}</div>
        </div>
      </button>
    );
  }

  return (
    <div className="step-in space-y-3 rounded-2xl border-2 border-primary bg-paper p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="rt-name" className="text-sm font-bold text-ink">
            {t.newTeamLabel}
          </label>
          <input
            id="rt-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.newTeamPlaceholder}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-[15px] outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="rt-cap" className="text-sm font-bold text-ink">
            {t.yourNameLabel}
          </label>
          <input
            id="rt-cap"
            value={captain}
            onChange={(e) => setCaptain(e.target.value)}
            placeholder={t.yourNamePlaceholder}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-[15px] outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-ink">{t.teamSizeLabel}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSize((n) => Math.max(1, n - 1))}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line text-ink hover:border-primary"
          >
            −
          </button>
          <span className="w-6 text-center font-bold tabular-nums">{size}</span>
          <button
            type="button"
            onClick={() => setSize((n) => Math.min(12, n + 1))}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line text-ink hover:border-primary"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!name.trim() || !captain.trim()) return;
            const team = addTeam(game.id, {
              name: name.trim(),
              captainName: captain.trim(),
              size,
              via: "link",
            });
            if (team) setResult(team);
          }}
          disabled={!name.trim() || !captain.trim()}
          className="pill cursor-pointer bg-primary px-5 py-2.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
        >
          {t.registerTeamBtn}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="pill cursor-pointer border border-line px-4 py-2.5 text-sm font-bold text-muted hover:text-ink"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

function EventJoinInner() {
  const { t } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const codeParam = params.get("code") ?? "";
  const teamNamePrefill = params.get("teamName") ?? "";
  const { gameByCode, hydrated } = useHost();
  const origin = useOrigin();
  const [tried, setTried] = useState(codeParam);

  if (!hydrated) {
    return (
      <AppShell>
        <div className="h-40 animate-pulse rounded-2xl bg-line/60" aria-label="Loading" />
      </AppShell>
    );
  }

  const game = tried ? gameByCode(tried) : undefined;

  if (!game) {
    return (
      <AppShell>
        <PageHead title={t.joinEventPageTitle} sub={t.joinEventPageSub} />
        <CodeEntry
          initial={tried}
          notFound={!!tried}
          onSubmit={(raw) => {
            const code = extractCode(raw, "code");
            if (!code) return;
            setTried(code);
            router.replace(`/e?code=${encodeURIComponent(code)}`);
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHead title={game.name} sub={game.location} />
      {game.description && (
        <p className="-mt-4 mb-7 max-w-2xl text-muted">{game.description}</p>
      )}

      {game.teams.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-faint">
            {t.joinExistingTeamsTitle}
          </h2>
          <ul className="space-y-2">
            {game.teams.map((team) => (
              <JoinTeamRow key={team.id} game={game} team={team} />
            ))}
          </ul>
        </div>
      )}

      <RegisterNewTeam game={game} defaultName={teamNamePrefill} origin={origin} />
    </AppShell>
  );
}

export default function EventJoinPage() {
  return (
    <Suspense fallback={null}>
      <EventJoinInner />
    </Suspense>
  );
}
