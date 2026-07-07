"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useHost, type GameTeam, type HostGame } from "@/lib/host";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import {
  ArrowLeft,
  Check,
  Crown,
  MapPin,
  Plus,
  Trash,
  Users,
  X,
} from "@/components/icons";

function useOrigin() {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return origin;
}

function printQR(elId: string, title: string, link: string) {
  const el = document.getElementById(elId);
  if (!el) return;
  const w = window.open("", "_blank", "width=440,height=580");
  if (!w) return;
  w.document.write(
    `<!doctype html><title>${title}</title><body style="margin:0;font-family:system-ui,sans-serif;text-align:center;padding:40px">${el.outerHTML}<h2 style="margin:20px 0 6px">${title}</h2><p style="color:#666;font-size:12px;word-break:break-all">${link}</p></body>`
  );
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 250);
}

function CopyButton({ text }: { text: string }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="pill cursor-pointer border border-line bg-paper px-4 py-2.5 text-sm font-bold text-muted transition-colors hover:border-primary hover:text-accent"
    >
      {done ? t.copied : t.copyLink}
    </button>
  );
}

/* ---------- one registered team ---------- */

function TeamCard({ game, team, origin }: { game: HostGame; team: GameTeam; origin: string }) {
  const { t } = useLang();
  const { assignCaptain, removeMember, addMember, removeTeam } = useHost();
  const [email, setEmail] = useState("");
  const inviteLink = origin ? `${origin}/join?team=${team.code}` : "";
  const qrId = `qr-team-${team.id}`;

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="display text-lg font-semibold leading-snug">
            {team.name}
          </h3>
          <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted">
            <Users size={14} /> {team.members.length}/{team.size}
          </div>
        </div>
        <button
          onClick={() => removeTeam(game.id, team.id)}
          aria-label={t.deleteTeam}
          title={t.deleteTeam}
          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-faint transition-colors hover:bg-coral-soft hover:text-coral-text"
        >
          <Trash size={15} />
        </button>
      </div>

      {/* members */}
      <ul className="mt-3 space-y-2">
        {team.members.map((m) => (
          <li
            key={m.name}
            className="flex items-center justify-between gap-2 rounded-xl bg-bg px-3.5 py-2.5"
          >
            <span className="inline-flex min-w-0 items-center gap-2 font-semibold">
              {m.role === "captain" && (
                <Crown size={15} className="shrink-0 text-coral-text" />
              )}
              <span className="truncate">{m.name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {m.role === "captain" ? (
                <span className="pill bg-coral-soft px-2.5 py-0.5 text-xs font-bold text-coral-text">
                  {t.captain}
                </span>
              ) : (
                <>
                  <button
                    onClick={() => assignCaptain(game.id, team.id, m.name)}
                    className="pill cursor-pointer border border-line px-2.5 py-1 text-xs font-bold text-muted transition-colors hover:border-primary hover:text-accent"
                  >
                    {t.makeCaptain}
                  </button>
                  <button
                    onClick={() => removeMember(game.id, team.id, m.name)}
                    aria-label={`${t.removeMember}: ${m.name}`}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-faint transition-colors hover:bg-coral-soft hover:text-coral-text"
                  >
                    <X size={14} />
                  </button>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* invite by email */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim()) {
            addMember(game.id, team.id, email.trim(), "email");
            setEmail("");
          }
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          aria-label={t.inviteByEmail}
          className="h-11 flex-1 rounded-xl border border-line bg-bg px-3.5 text-[15px] outline-none transition-colors focus:border-primary"
        />
        <button
          type="submit"
          disabled={!email.trim()}
          className="pill inline-flex cursor-pointer items-center gap-1.5 border-2 border-primary px-4 text-sm font-bold text-accent transition-colors hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-40"
        >
          <Plus size={15} /> {t.sendInvite}
        </button>
      </form>

      {/* team invite link + QR */}
      <div className="mt-4 rounded-xl border border-dashed border-line p-4">
        <div className="text-xs font-bold uppercase tracking-wide text-faint">
          {t.teamInviteLink}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="rounded-lg bg-white p-1.5">
            <QRCodeSVG id={qrId} value={inviteLink || "https://quiznight.hu"} size={72} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm text-muted">{inviteLink}</div>
            <div className="mt-2 flex gap-2">
              <CopyButton text={inviteLink} />
              <button
                onClick={() => printQR(qrId, team.name, inviteLink)}
                className="pill cursor-pointer border border-line bg-paper px-4 py-2.5 text-sm font-bold text-muted transition-colors hover:border-primary hover:text-accent"
              >
                {t.printQr}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-faint">{t.teamInviteHint}</p>
      </div>
    </div>
  );
}

/* ---------- add a team manually ---------- */

function AddTeam({ gameId }: { gameId: string }) {
  const { t } = useLang();
  const { addTeam } = useHost();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [captain, setCaptain] = useState("");
  const [size, setSize] = useState(4);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="card-select flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-paper p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-accent">
          <Plus size={20} />
        </div>
        <div className="display text-lg font-semibold">{t.addTeamManually}</div>
      </button>
    );
  }

  const reset = () => {
    setName("");
    setCaptain("");
    setSize(4);
    setOpen(false);
  };

  return (
    <div className="step-in space-y-3 rounded-2xl border-2 border-primary bg-paper p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nt-name" className="text-sm font-bold text-ink">
            {t.newTeamLabel}
          </label>
          <input
            id="nt-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.newTeamPlaceholder}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-[15px] outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="nt-cap" className="text-sm font-bold text-ink">
            {t.captainNameLabel}
          </label>
          <input
            id="nt-cap"
            value={captain}
            onChange={(e) => setCaptain(e.target.value)}
            placeholder="Legal Dexter"
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
            if (name.trim() && captain.trim()) {
              addTeam(gameId, {
                name: name.trim(),
                captainName: captain.trim(),
                size,
              });
              reset();
            }
          }}
          disabled={!name.trim() || !captain.trim()}
          className="pill cursor-pointer bg-primary px-5 py-2.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
        >
          {t.addTeamManually}
        </button>
        <button
          onClick={reset}
          className="pill cursor-pointer border border-line px-4 py-2.5 text-sm font-bold text-muted hover:text-ink"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

function GameInner() {
  const { t } = useLang();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { getGame, hydrated } = useHost();
  const origin = useOrigin();
  const game = getGame(id);

  if (!hydrated) {
    return (
      <AppShell>
        <div className="h-40 animate-pulse rounded-2xl bg-line/60" aria-label="Loading" />
      </AppShell>
    );
  }

  if (!game) {
    return (
      <AppShell>
        <PageHead title={t.gameNotFound} sub="" />
        <Link href="/host" className="font-bold text-accent hover:underline">
          ← {t.hostTitle}
        </Link>
      </AppShell>
    );
  }

  const regLink = origin ? `${origin}/e?code=${game.code}` : "";
  const regQrId = "qr-reg";

  return (
    <AppShell>
      <Link
        href="/host"
        className="mb-5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> {t.hostTitle}
      </Link>

      <PageHead title={game.name} sub={game.location} />
      {game.description && (
        <p className="-mt-4 mb-7 max-w-2xl text-muted">{game.description}</p>
      )}

      {/* Registration link + QR */}
      <section className="mb-8 rounded-2xl border border-line bg-paper p-5">
        <h2 className="display flex items-center gap-2 text-lg font-semibold">
          {t.gameRegLink}
        </h2>
        <p className="mt-1 text-sm text-muted">{t.gameShareHint}</p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <QRCodeSVG id={regQrId} value={regLink || "https://quiznight.hu"} size={120} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate rounded-lg bg-bg px-3 py-2.5 text-sm text-muted">
              {regLink}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={regLink} />
              <button
                onClick={() => printQR(regQrId, game.name, regLink)}
                className="pill cursor-pointer bg-ink px-4 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-primary hover:text-white"
              >
                {t.printQr}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Registered teams */}
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="display text-xl font-semibold">{t.registeredTeams}</h2>
        <span className="text-sm font-bold text-muted">
          {game.teams.length} {t.hostTeamsRegistered}
        </span>
      </div>

      <div className="space-y-4">
        {game.teams.length === 0 && (
          <div className="rounded-2xl border border-line bg-paper px-6 py-8 text-center text-muted">
            {t.noTeamsYet}
          </div>
        )}
        {game.teams.map((team) => (
          <TeamCard key={team.id} game={game} team={team} origin={origin} />
        ))}
        <AddTeam gameId={game.id} />
      </div>
    </AppShell>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={null}>
      <GameInner />
    </Suspense>
  );
}
