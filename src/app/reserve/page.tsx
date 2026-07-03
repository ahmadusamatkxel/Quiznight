"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EVENTS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  USER,
  evDate,
  evDesc,
  evTitle,
} from "@/lib/data";
import type { AssistantAction, FlowState } from "@/lib/assistant";
import { useReservations } from "@/lib/store";
import { LangSwitch, useLang } from "@/lib/i18n";
import AiDrawer from "@/components/AiDrawer";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Crown,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Trophy,
  Users,
} from "@/components/icons";

/* ---------- Left panel (Genially-style) ---------- */

function LeftPanel({ state }: { state: FlowState }) {
  const { lang } = useLang();
  const ev = EVENTS.find((e) => e.id === state.eventId);
  const hu = lang === "hu";
  return (
    <aside className="relative hidden overflow-hidden bg-panel text-white lg:flex lg:w-[42%] lg:flex-col lg:justify-between lg:p-10">
      <Link href="/" className="flex w-max items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/quiznight-logo.svg"
          alt="QuizNight logo"
          width={38}
          height={38}
          className="h-9.5 w-9.5"
        />
        <span className="display text-lg font-semibold">
          Quiz<span className="text-coral">Night</span>
        </span>
      </Link>

      <div className="relative">
        <h1 className="display text-4xl font-semibold leading-tight xl:text-5xl">
          {hu ? (
            <>
              Foglalj asztalt{" "}
              <span className="text-mint">egy percen belül</span>
            </>
          ) : (
            <>
              Reserve your table{" "}
              <span className="text-mint">in under a minute</span>
            </>
          )}
        </h1>
        <p className="mt-4 max-w-sm text-white/60">
          {hu
            ? "Hétfő esti kocsmakvíz, csapatokban. A belépés ingyenes — a győztesek kuponokat és díjakat visznek."
            : "Monday-night pub quiz, played in teams. Free entry — the winners take bar coupons and prizes."}
        </p>

        {/* floating collage */}
        <div className="pointer-events-none relative mt-10 h-44" aria-hidden>
          <div className="float-slow absolute left-0 top-0 w-52 rotate-[-4deg] rounded-2xl bg-panel-2 p-4 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wide text-mint">
              {ev ? evDate(ev, lang) : hu ? "Minden hétfőn" : "Every Monday"}
            </div>
            <div className="display mt-1 font-semibold leading-snug">
              {ev
                ? evTitle(ev, lang)
                : hu
                  ? "Válaszd ki a kvízested"
                  : "Pick your quiz night"}
            </div>
          </div>
          <div className="float-slower absolute left-44 top-16 rotate-[5deg] rounded-xl bg-coral px-3 py-1.5 text-xs font-bold shadow-lg">
            {state.teamName
              ? hu
                ? `${state.teamName} csapat`
                : `Team ${state.teamName}`
              : hu
                ? "Hozd a csapatod"
                : "Bring your team"}
          </div>
          <div className="float-slow absolute left-24 top-32 rotate-[-6deg] rounded-xl bg-mint px-3 py-1.5 text-xs font-bold text-ink shadow-lg">
            🏆 25,000 Ft {hu ? "kupon" : "coupon"}
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40">
        {hu
          ? "Prototípus · az adatok a quiznight.hu oldalról származnak · ingyenes események"
          : "Prototype · data mirrored from quiznight.hu · free events"}
      </div>
    </aside>
  );
}

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
                ? "bg-mint text-ink"
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
  purple: "bg-primary-soft text-primary",
  mint: "bg-mint/40 text-mint-dark",
  coral: "bg-coral-soft text-coral",
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
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft font-bold text-primary">
              {team.name[0]}
            </div>
            <div className="flex-1">
              <div className="display text-lg font-semibold">{team.name}</div>
              <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted">
                <Crown size={14} className="text-coral" />
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
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral-soft text-coral">
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
          className="grid h-14 w-14 cursor-pointer place-items-center rounded-2xl border-2 border-line bg-paper text-ink transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-30"
        >
          <Minus size={22} />
        </button>
        <div
          className="display w-28 text-center text-7xl font-semibold tabular-nums text-primary"
          aria-live="polite"
        >
          {state.players}
        </div>
        <button
          onClick={() => setPlayers(Math.min(MAX_PLAYERS, state.players + 1))}
          aria-label={t.more}
          disabled={state.players >= MAX_PLAYERS}
          className="grid h-14 w-14 cursor-pointer place-items-center rounded-2xl border-2 border-line bg-paper text-ink transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-30"
        >
          <Plus size={22} />
        </button>
      </div>

      <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-soft px-3.5 py-2 text-sm font-semibold text-primary">
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
                <span className="pill ml-2 bg-coral-soft px-2 py-0.5 text-xs font-bold text-coral">
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
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-ink sm:mx-0">
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

/* ---------- Page ---------- */

export default function ReservePage() {
  const router = useRouter();
  const { t } = useLang();
  const { addReservation, createTeam } = useReservations();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [state, setState] = useState<FlowState>({
    step: 0,
    eventId: null,
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

  const dispatch = useCallback(
    (actions: AssistantAction[]) => {
      setState((prev) => {
        let next = { ...prev };
        for (const a of actions) {
          if (a.type === "selectEvent") next.eventId = a.eventId;
          if (a.type === "selectTeam") {
            next.teamName = a.name;
            next.isNewTeam = a.isNew;
          }
          if (a.type === "setPlayers") next.players = a.players;
          if (a.type === "goToStep") next.step = a.step;
          if (a.type === "confirm") {
            confirm(next);
            next = { ...next, step: 4 };
          }
        }
        return next;
      });
    },
    [confirm]
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
    if (state.step === 0) router.push("/");
    else setState((s) => ({ ...s, step: Math.max(0, s.step - 1) }));
  };

  return (
    <div className="flex min-h-dvh">
      <LeftPanel state={state} />

      <main className="relative flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur sm:px-10">
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

          <div className="flex items-center gap-2.5">
            <LangSwitch />
            <button
              onClick={() => setDrawerOpen(true)}
              className="pill inline-flex cursor-pointer items-center gap-2 border-2 border-primary bg-primary-soft px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <Sparkles size={16} /> {t.aiAssist}
            </button>
          </div>
        </div>

        {/* Step body */}
        <div className="mx-auto max-w-2xl px-5 py-10 sm:px-10 sm:py-14">
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
                className="pill inline-flex cursor-pointer items-center gap-2 bg-ink px-7 py-3.5 font-bold text-white transition-all duration-200 hover:bg-primary disabled:cursor-default disabled:opacity-30"
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
      </main>

      <AiDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        state={state}
        dispatch={dispatch}
      />

      {/* Signed-in hint for the demo */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-20 hidden rounded-xl bg-panel px-3.5 py-2 text-xs font-semibold text-white/70 lg:block">
        {t.signedInAs} {USER.firstName} · prototype
      </div>
    </div>
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
