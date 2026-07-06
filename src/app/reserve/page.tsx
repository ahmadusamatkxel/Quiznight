"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EVENTS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  evDate,
  evDesc,
  evTitle,
} from "@/lib/data";
import type { FlowState } from "@/lib/assistant";
import { useReservations } from "@/lib/store";
import { useLang } from "@/lib/i18n";
import AppShell from "@/components/AppShell";
import AiBookNudge from "@/components/AiBookNudge";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Crown,
  MapPin,
  Minus,
  Plus,
  Trophy,
  Users,
} from "@/components/icons";

/* ---------- Step chrome (Tally-style) ---------- */

function Progress({ step }: { step: number }) {
  const { t } = useLang();
  const labels = [t.stepEvent, t.stepTeam, t.stepPlayers, t.stepReview];
  return (
    <div aria-label={`${Math.min(step + 1, 4)} / 4`} className="flex items-center gap-2">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`pill px-3 py-1 text-xs font-bold transition-colors ${
              i < step
                ? "bg-mint text-[#17141f]"
                : i === step
                  ? "bg-primary text-white"
                  : "bg-line text-muted"
            }`}
          >
            {i < step ? "✓ " : ""}
            {label}
          </div>
          {i < 3 && <div className="h-px w-4 bg-line" />}
        </div>
      ))}
    </div>
  );
}

function Key({ k }: { k: string }) {
  return (
    <span className="mr-2.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line bg-bg text-xs font-bold text-muted">
      {k}
    </span>
  );
}

/* ---------- Steps ---------- */

const ACCENT_CHIP: Record<string, string> = {
  purple: "bg-primary-soft text-accent",
  mint: "bg-mint/40 text-mint-dark",
  coral: "bg-coral-soft text-coral-text",
};

function EventStep({
  state,
  pick,
}: {
  state: FlowState;
  pick: (id: string) => void;
}) {
  const { t, lang } = useLang();
  return (
    <div className="step-in">
      <h2 className="display text-3xl font-semibold leading-tight sm:text-4xl">
        {t.q1}
      </h2>
      <p className="mt-2 text-muted">{t.q1Sub}</p>
      <div className="mt-7 space-y-3.5">
        {EVENTS.map((ev, i) => (
          <button
            key={ev.id}
            onClick={() => pick(ev.id)}
            data-selected={state.eventId === ev.id}
            className="card-select flex w-full items-start gap-4 rounded-2xl border-2 border-line bg-paper p-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
          >
            <Key k={String.fromCharCode(65 + i)} />
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
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} /> {evDate(ev, lang)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} /> {ev.venue}, {ev.city}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm text-faint">
                {evDesc(ev, lang)}
              </p>
            </div>
            {state.eventId === ev.id && (
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-white">
                <Check size={14} />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function TeamStep({
  state,
  pickExisting,
  createNew,
}: {
  state: FlowState;
  pickExisting: (name: string) => void;
  createNew: (name: string) => void;
}) {
  const { t } = useLang();
  const { teams } = useReservations();
  const [creating, setCreating] = useState(state.isNewTeam);
  const [name, setName] = useState(state.isNewTeam ? (state.teamName ?? "") : "");

  return (
    <div className="step-in">
      <h2 className="display text-3xl font-semibold leading-tight sm:text-4xl">
        {t.q2}
      </h2>
      <p className="mt-2 text-muted">{t.q2Sub}</p>

      <div className="mt-7 space-y-3.5">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => pickExisting(team.name)}
            data-selected={state.teamName === team.name && !state.isNewTeam}
            className="card-select flex w-full items-center gap-4 rounded-2xl border-2 border-line bg-paper p-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
          >
            <Key k="A" />
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft font-bold text-accent">
              {team.name[0]}
            </div>
            <div className="flex-1">
              <div className="display text-lg font-semibold">{team.name}</div>
              <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted">
                <Crown size={14} className="text-coral-text" />
                {team.members[0].name} · {t.yourTeam}
              </div>
            </div>
            {state.teamName === team.name && !state.isNewTeam && (
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-white">
                <Check size={14} />
              </span>
            )}
          </button>
        ))}

        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="card-select flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-paper p-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
          >
            <Key k="B" />
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral-soft text-coral-text">
              <Plus size={20} />
            </div>
            <div>
              <div className="display text-lg font-semibold">{t.createTeam}</div>
              <div className="mt-0.5 text-sm text-muted">{t.createTeamSub}</div>
            </div>
          </button>
        ) : (
          <div className="step-in rounded-2xl border-2 border-primary bg-paper p-5 shadow-[0_0_0_3px_var(--color-primary-soft)]">
            <label htmlFor="new-team" className="text-sm font-bold text-ink">
              {t.newTeamLabel}
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="new-team"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) createNew(name.trim());
                }}
                placeholder={t.newTeamPlaceholder}
                className="h-12 flex-1 rounded-xl border border-line bg-bg px-4 text-[15px] outline-none transition-colors focus:border-primary"
              />
              <button
                onClick={() => name.trim() && createNew(name.trim())}
                disabled={!name.trim()}
                className="pill cursor-pointer bg-primary px-5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
              >
                {t.useIt}
              </button>
            </div>
            <div className="mt-2 text-xs text-muted">{t.teamCreatedNote}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayersStep({
  state,
  setPlayers,
}: {
  state: FlowState;
  setPlayers: (n: number) => void;
}) {
  const { t } = useLang();
  return (
    <div className="step-in">
      <h2 className="display text-3xl font-semibold leading-tight sm:text-4xl">
        {t.q3}
      </h2>
      <p className="mt-2 text-muted">{t.q3Sub}</p>

      <div className="mt-9 flex items-center justify-center gap-6 sm:justify-start">
        <button
          onClick={() => setPlayers(Math.max(MIN_PLAYERS, state.players - 1))}
          aria-label={t.fewer}
          disabled={state.players <= MIN_PLAYERS}
          className="grid h-14 w-14 cursor-pointer place-items-center rounded-2xl border-2 border-line bg-paper text-ink transition-colors hover:border-primary hover:text-accent disabled:cursor-default disabled:opacity-30"
        >
          <Minus size={22} />
        </button>
        <div
          className="display w-28 text-center text-7xl font-semibold tabular-nums text-accent"
          aria-live="polite"
        >
          {state.players}
        </div>
        <button
          onClick={() => setPlayers(Math.min(MAX_PLAYERS, state.players + 1))}
          aria-label={t.more}
          disabled={state.players >= MAX_PLAYERS}
          className="grid h-14 w-14 cursor-pointer place-items-center rounded-2xl border-2 border-line bg-paper text-ink transition-colors hover:border-primary hover:text-accent disabled:cursor-default disabled:opacity-30"
        >
          <Plus size={22} />
        </button>
      </div>

      <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-soft px-3.5 py-2 text-sm font-semibold text-accent">
        <Users size={16} />
        {state.teamName
          ? `${t.team} ${state.teamName}`
          : t.yourTeamFallback}{" "}
        · {state.players} {state.players > 1 ? t.players : t.player}
      </div>
    </div>
  );
}

function ReviewStep({ state }: { state: FlowState }) {
  const { t, lang } = useLang();
  const ev = EVENTS.find((e) => e.id === state.eventId)!;
  return (
    <div className="step-in">
      <h2 className="display text-3xl font-semibold leading-tight sm:text-4xl">
        {t.q4}
      </h2>
      <p className="mt-2 text-muted">{t.q4Sub}</p>

      <div className="mt-7 overflow-hidden rounded-2xl border-2 border-line bg-paper">
        <div className="border-b border-dashed border-line px-6 py-5">
          <div className="text-xs font-bold uppercase tracking-wider text-faint">
            {t.event}
          </div>
          <div className="display mt-1 text-xl font-semibold">
            {evTitle(ev, lang)}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} /> {evDate(ev, lang)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} /> {ev.venue} — {ev.address}
            </span>
          </div>
          {ev.quizmaster && (
            <div className="mt-1 text-sm text-muted">
              {t.quizmaster}: {ev.quizmaster}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 divide-x divide-dashed divide-line sm:grid-cols-3">
          <div className="px-6 py-4">
            <div className="text-xs font-bold uppercase tracking-wider text-faint">
              {t.stepTeam}
            </div>
            <div className="display mt-1 font-semibold">
              {state.teamName}
              {state.isNewTeam && (
                <span className="pill ml-2 bg-coral-soft px-2 py-0.5 text-xs font-bold text-coral-text">
                  {t.newBadge}
                </span>
              )}
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="text-xs font-bold uppercase tracking-wider text-faint">
              {t.stepPlayers}
            </div>
            <div className="display mt-1 font-semibold">{state.players}</div>
          </div>
          <div className="col-span-2 px-6 py-4 sm:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wider text-faint">
              {t.price}
            </div>
            <div className="display mt-1 font-semibold text-mint-dark">
              {t.priceFree}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-mint/30 px-3.5 py-2 text-sm font-semibold text-mint-dark">
        <Trophy size={16} /> {evDesc(ev, lang).slice(0, 96)}…
      </div>
    </div>
  );
}

function DoneStep({ state }: { state: FlowState }) {
  const { t, lang } = useLang();
  const ev = EVENTS.find((e) => e.id === state.eventId)!;
  return (
    <div className="step-in text-center sm:text-left">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-[#17141f] sm:mx-0">
        <Check size={30} />
      </div>
      <h2 className="display mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
        {t.doneTitle(state.teamName ?? "")}
      </h2>
      <p className="mt-2 max-w-md text-muted">
        {t.doneSub(ev.venue, evDate(ev, lang))}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
        <Link
          href="/"
          className="pill inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary-dark"
        >
          {t.backToDash} <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}

/* ---------- Reserve hero (compact, brand flavour without the layout swap) ---------- */

function ReserveHero() {
  const { t } = useLang();
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-panel px-6 py-7 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="float-slow absolute right-[8%] top-[22%] rotate-[6deg] rounded-xl bg-coral-deep px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          {t.heroBringTeam}
        </div>
        <div className="float-slower absolute bottom-[18%] right-[20%] rotate-[-5deg] rounded-xl bg-mint px-3 py-1.5 text-xs font-bold text-[#17141f] shadow-lg">
          🏆 25,000 Ft
        </div>
      </div>
      <div className="relative max-w-md">
        <h1 className="display text-2xl font-semibold leading-tight sm:text-3xl">
          {t.heroTitle1} <span className="text-mint">{t.heroTitleAccent}</span>
        </h1>
        <p className="mt-2 text-sm text-white/60">{t.heroSub}</p>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function ReserveFlow({ initialEventId }: { initialEventId: string | null }) {
  const router = useRouter();
  const { t } = useLang();
  const { addReservation, createTeam } = useReservations();
  // When an event is chosen on the Discover page, skip the event step.
  const preselected = EVENTS.some((e) => e.id === initialEventId)
    ? initialEventId
    : null;
  const [state, setState] = useState<FlowState>({
    step: preselected ? 1 : 0,
    eventId: preselected,
    teamName: null,
    isNewTeam: false,
    players: 4,
  });

  const canContinue = useMemo(() => {
    if (state.step === 0) return !!state.eventId;
    if (state.step === 1) return !!state.teamName;
    return true;
  }, [state]);

  const confirm = useCallback(
    (s: FlowState) => {
      if (s.isNewTeam && s.teamName) createTeam(s.teamName);
      addReservation({
        eventId: s.eventId!,
        teamName: s.teamName!,
        isNewTeam: s.isNewTeam,
        players: s.players,
      });
    },
    [addReservation, createTeam]
  );

  const next = () => {
    if (state.step === 3) {
      confirm(state);
      setState((s) => ({ ...s, step: 4 }));
    } else {
      setState((s) => ({ ...s, step: Math.min(4, s.step + 1) }));
    }
  };
  const back = () => {
    // Steps 0 (event) and 1 (team) return to the Discover list to change event.
    if (state.step <= 1) router.push("/discover");
    else setState((s) => ({ ...s, step: Math.max(0, s.step - 1) }));
  };

  return (
    <AppShell>
      {/* Wizard toolbar — Back · progress · AI assist (lives in the content, so the shell stays put) */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {state.step < 4 && (
            <button
              onClick={back}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} /> {t.back}
            </button>
          )}
          <div className="hidden sm:block">
            <Progress step={state.step} />
          </div>
        </div>
      </div>

      {state.step < 4 && <AiBookNudge />}

      {state.step === 0 && <ReserveHero />}

      {/* Step body */}
      <div className="mx-auto max-w-2xl">
        {state.step === 0 && (
          <EventStep
            state={state}
            pick={(id) => setState((s) => ({ ...s, eventId: id }))}
          />
        )}
        {state.step === 1 && (
          <TeamStep
            state={state}
            pickExisting={(name) =>
              setState((s) => ({ ...s, teamName: name, isNewTeam: false }))
            }
            createNew={(name) =>
              setState((s) => ({
                ...s,
                teamName: name,
                isNewTeam: true,
                step: 2,
              }))
            }
          />
        )}
        {state.step === 2 && (
          <PlayersStep
            state={state}
            setPlayers={(n) => setState((s) => ({ ...s, players: n }))}
          />
        )}
        {state.step === 3 && <ReviewStep state={state} />}
        {state.step === 4 && <DoneStep state={state} />}

        {/* Footer nav */}
        {state.step < 4 && (
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={next}
              disabled={!canContinue}
              className="pill inline-flex cursor-pointer items-center gap-2 bg-ink px-7 py-3.5 font-bold text-paper transition-all duration-200 hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-30"
            >
              {state.step === 3 ? t.reserveFree : t.continue}
              <ArrowRight size={17} />
            </button>
            <span className="hidden text-xs font-semibold text-faint sm:block">
              {t.pressEnter} <strong>Enter ↵</strong>
            </span>
          </div>
        )}
      </div>

      {/* Enter key advances */}
      <EnterKey onEnter={() => canContinue && state.step < 4 && next()} />
    </AppShell>
  );
}

function ReserveFlowWithParams() {
  const params = useSearchParams();
  return <ReserveFlow initialEventId={params.get("event")} />;
}

export default function ReservePage() {
  return (
    <Suspense fallback={null}>
      <ReserveFlowWithParams />
    </Suspense>
  );
}

function EnterKey({ onEnter }: { onEnter: () => void }) {
  const cb = useRef(onEnter);
  cb.current = onEnter;
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        e.key === "Enter" &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA" &&
        target.tagName !== "BUTTON"
      ) {
        cb.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return null;
}
