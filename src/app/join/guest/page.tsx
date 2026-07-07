"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHost, type GameTeam, type HostGame } from "@/lib/host";
import { useLang, LangSwitch } from "@/lib/i18n";
import { Logo } from "@/components/AppShell";
import { extractCode } from "@/lib/join";
import { Check, MapPin, Sparkles, Users } from "@/components/icons";

const DEMO_GAME_NAME = "QuizNight Demo Night";

function GuestHeader() {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-5 py-3.5">
        <Logo />
        <LangSwitch />
      </div>
    </header>
  );
}

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
    <div className="step-in rounded-2xl border border-line bg-paper p-6">
      {notFound && (
        <div className="mb-4 rounded-xl bg-coral-soft px-4 py-3 text-sm font-bold text-coral-text">
          {t.teamNotFoundTitle} {t.teamNotFoundSub}
        </div>
      )}
      <label htmlFor="guest-team-code" className="block text-sm font-bold text-ink">
        {t.teamCodeLabel}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          id="guest-team-code"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
          placeholder={t.teamCodePlaceholder}
          className="h-12 min-w-[220px] flex-1 rounded-xl border border-line bg-bg px-4 text-[15px] outline-none transition-colors focus:border-primary"
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

function GuestJoinForm({
  game,
  team,
  onJoined,
}: {
  game: HostGame;
  team: GameTeam;
  onJoined: (name: string) => void;
}) {
  const { t } = useLang();
  const { addMember } = useHost();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="step-in">
      <div className="overflow-hidden rounded-2xl border-2 border-line bg-paper">
        <div className="border-b border-dashed border-line px-6 py-5">
          <div className="text-xs font-bold uppercase tracking-wider text-faint">
            {t.event}
          </div>
          <div className="display mt-1 text-xl font-semibold">{game.name}</div>
          {game.location && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} /> {game.location}
            </div>
          )}
          {game.description && (
            <p className="mt-2 text-sm text-muted">{game.description}</p>
          )}
        </div>
        <div className="px-6 py-5">
          <div className="text-xs font-bold uppercase tracking-wider text-faint">
            {t.stepTeam}
          </div>
          <div className="display mt-1 flex items-center gap-2 text-xl font-semibold">
            {team.name}
            <span className="inline-flex items-center gap-1 text-sm font-normal text-muted">
              <Users size={14} /> {team.members.length}/{team.size}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !email.trim()) return;
          addMember(game.id, team.id, name.trim(), "guest", email.trim());
          onJoined(name.trim());
        }}
        className="mt-6 space-y-3"
      >
        <div>
          <label htmlFor="guest-name" className="text-sm font-bold text-ink">
            {t.yourNameLabel}
          </label>
          <input
            id="guest-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.yourNamePlaceholder}
            className="mt-1.5 h-12 w-full rounded-xl border border-line bg-bg px-4 text-[15px] outline-none transition-colors focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="guest-email" className="text-sm font-bold text-ink">
            {t.guestFormEmailLabel}
          </label>
          <input
            id="guest-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.guestFormEmailPlaceholder}
            className="mt-1.5 h-12 w-full rounded-xl border border-line bg-bg px-4 text-[15px] outline-none transition-colors focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim() || !email.trim()}
          className="pill inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-primary px-6 py-3.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40 sm:w-auto"
        >
          {t.guestJoinCta}
        </button>
      </form>
    </div>
  );
}

function GuestSuccess({
  name,
  team,
  game,
}: {
  name: string;
  team: GameTeam;
  game: HostGame;
}) {
  const { t } = useLang();
  const [reminder, setReminder] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (reminder) {
    return (
      <div className="step-in text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-accent">
          <Sparkles size={26} />
        </div>
        <h2 className="display mt-5 text-2xl font-semibold sm:text-3xl">
          {t.guestReminderTitle(name)}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-muted">{t.guestReminderSub}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`/signup?mode=signup&name=${encodeURIComponent(name)}`}
            className="pill inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary-dark"
          >
            {t.guestReminderCreateAccount}
          </a>
          <button
            onClick={() => setReminder(false)}
            className="pill cursor-pointer border border-line px-5 py-3 text-sm font-bold text-muted hover:text-ink"
          >
            {t.guestReminderMaybeLater}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-in text-center sm:text-left">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-[#17141f] sm:mx-0">
        <Check size={30} />
      </div>
      <h2 className="display mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
        {t.guestSuccessTitle(name)}
      </h2>
      <p className="mt-2 max-w-md text-muted">
        {t.guestSuccessSub(team.name, game.name)}
      </p>

      {!dismissed && (
        <div className="mt-7 rounded-2xl border border-dashed border-line bg-paper p-5 text-left">
          <div className="display font-semibold">{t.guestAuthNudgeTitle}</div>
          <p className="mt-1 text-sm text-muted">{t.guestAuthNudgeSub}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="/signup?mode=signup"
              className="pill inline-flex cursor-pointer items-center gap-1.5 bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              {t.guestCreateAccount}
            </a>
            <a
              href="/signup?mode=login"
              className="pill inline-flex cursor-pointer items-center gap-1.5 border-2 border-primary px-4 py-2 text-sm font-bold text-accent transition-colors hover:bg-primary hover:text-white"
            >
              {t.guestLogIn}
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="pill cursor-pointer px-4 py-2 text-sm font-bold text-muted hover:text-ink"
            >
              {t.guestNoThanks}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-dashed border-line pt-5">
        <button
          onClick={() => setReminder(true)}
          className="pill cursor-pointer border border-line px-4 py-2 text-xs font-bold text-faint transition-colors hover:border-primary hover:text-accent"
        >
          🔧 {t.guestSimulateAfter}
        </button>
      </div>
    </div>
  );
}

function GuestJoinInner() {
  const router = useRouter();
  const params = useSearchParams();
  const isDemo = params.get("demo") === "1";
  const teamParam = params.get("team") ?? "";
  const { games, addTeam, createGame, hydrated } = useHost();
  const [tried, setTried] = useState(teamParam);
  const [joinedName, setJoinedName] = useState<string | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!hydrated || tried || !isDemo || seededRef.current) return;
    seededRef.current = true;
    const game =
      games.find((g) => g.name === DEMO_GAME_NAME) ??
      createGame({
        name: DEMO_GAME_NAME,
        location: "Sample Pub, Budapest",
        description: "A seeded event for trying the guest-join flow end to end.",
      });
    const team =
      game.teams[0] ??
      addTeam(game.id, {
        name: "The Sample Squad",
        captainName: "Demo Captain",
        size: 6,
      });
    if (team) {
      setTried(team.code);
      router.replace(`/join/guest?team=${team.code}`);
    }
  }, [hydrated, tried, isDemo, games, createGame, addTeam, router]);

  if (!hydrated || (isDemo && !tried)) {
    return (
      <div className="flex min-h-dvh flex-col bg-bg">
        <GuestHeader />
        <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12">
          <div className="h-40 animate-pulse rounded-2xl bg-line/60" aria-label="Loading" />
        </main>
      </div>
    );
  }

  let hostMatch: { game: HostGame; team: GameTeam } | undefined;
  if (tried) {
    for (const g of games) {
      const found = g.teams.find((te) => te.code.toLowerCase() === tried.toLowerCase());
      if (found) {
        hostMatch = { game: g, team: found };
        break;
      }
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <GuestHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-10 sm:py-12">
        {!hostMatch ? (
          <CodeEntry
            initial={tried}
            notFound={!!tried}
            onSubmit={(raw) => {
              const code = extractCode(raw, "team");
              if (!code) return;
              setJoinedName(null);
              setTried(code);
              router.replace(`/join/guest?team=${encodeURIComponent(code)}`);
            }}
          />
        ) : joinedName ? (
          <GuestSuccess name={joinedName} team={hostMatch.team} game={hostMatch.game} />
        ) : (
          <GuestJoinForm
            game={hostMatch.game}
            team={hostMatch.team}
            onJoined={setJoinedName}
          />
        )}
      </main>
    </div>
  );
}

export default function GuestJoinPage() {
  return (
    <Suspense fallback={null}>
      <GuestJoinInner />
    </Suspense>
  );
}
