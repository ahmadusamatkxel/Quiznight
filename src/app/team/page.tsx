"use client";

import Link from "next/link";
import { useState } from "react";
import { evDate, evTitle } from "@/lib/data";
import { useReservations } from "@/lib/store";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";
import {
  ArrowRight,
  Calendar,
  Check,
  Crown,
  MapPin,
  Pencil,
  Plus,
  Trash,
  X,
} from "@/components/icons";

function TeamCard({ teamId }: { teamId: string }) {
  const { t, lang } = useLang();
  const {
    teams,
    renameTeam,
    deleteTeam,
    addMember,
    removeMember,
    reservations,
    eventById,
  } = useReservations();

  const team = teams.find((te) => te.id === teamId);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(team?.name ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [newMember, setNewMember] = useState("");

  if (!team) return null;
  const teamRes = reservations.filter((r) => r.teamName === team.name);

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-paper">
      {/* Header: name + edit/delete */}
      <div className="flex flex-wrap items-center gap-4 border-b border-line px-6 py-5">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-xl font-bold text-primary">
          {team.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex flex-wrap gap-2">
              <label htmlFor={`rename-${team.id}`} className="sr-only">
                {t.renameTeam}
              </label>
              <input
                id={`rename-${team.id}`}
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) {
                    renameTeam(team.id, name.trim());
                    setEditing(false);
                  }
                  if (e.key === "Escape") setEditing(false);
                }}
                className="h-11 rounded-xl border border-line bg-bg px-3.5 text-[15px] font-semibold outline-none transition-colors focus:border-primary"
              />
              <button
                onClick={() => {
                  if (name.trim()) renameTeam(team.id, name.trim());
                  setEditing(false);
                }}
                disabled={!name.trim()}
                className="pill cursor-pointer bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-40"
              >
                {t.save}
              </button>
              <button
                onClick={() => {
                  setName(team.name);
                  setEditing(false);
                }}
                className="pill cursor-pointer border border-line px-4 py-2 text-sm font-bold text-muted hover:text-ink"
              >
                {t.cancel}
              </button>
            </div>
          ) : (
            <>
              <h2 className="display truncate text-2xl font-semibold">
                {team.name}
              </h2>
              <div className="text-sm text-muted">
                {team.members.length} {t.members.toLowerCase()}
              </div>
            </>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setName(team.name);
                setEditing(true);
              }}
              aria-label={t.renameTeam}
              title={t.renameTeam}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              aria-label={t.deleteTeam}
              title={t.deleteTeam}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors hover:border-coral hover:text-coral"
            >
              <Trash size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation strip */}
      {confirmingDelete && (
        <div className="step-in flex flex-wrap items-center justify-between gap-3 border-b border-line bg-coral-soft px-6 py-4">
          <span className="text-sm font-bold text-coral">
            {t.deleteConfirm}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => deleteTeam(team.id)}
              className="pill cursor-pointer bg-coral px-4 py-2 text-sm font-bold text-white transition-colors hover:opacity-90"
            >
              {t.confirmDelete}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="pill cursor-pointer border border-line bg-paper px-4 py-2 text-sm font-bold text-muted hover:text-ink"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Members */}
      <div className="px-6 py-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-faint">
          {t.members}
        </h3>
        <ul className="mt-3 space-y-2">
          {team.members.map((m) => (
            <li
              key={m.name}
              className="flex items-center justify-between rounded-xl bg-bg px-4 py-3"
            >
              <span className="inline-flex items-center gap-2.5 font-semibold">
                {m.role === "captain" && (
                  <Crown size={16} className="text-coral" />
                )}
                {m.name}
              </span>
              <span className="flex items-center gap-3">
                {m.status === "pending" ? (
                  <span className="pill bg-line px-2.5 py-0.5 text-xs font-bold text-muted">
                    {t.pendingMember}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-mint-dark">
                    <Check size={14} />
                    {m.role === "captain" ? t.captain : t.activeMember}
                  </span>
                )}
                {m.role !== "captain" && (
                  <button
                    onClick={() => removeMember(team.id, m.name)}
                    aria-label={`${t.removeMember}: ${m.name}`}
                    title={t.removeMember}
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-faint transition-colors hover:bg-coral-soft hover:text-coral"
                  >
                    <X size={15} />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* Add member */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newMember.trim()) {
              addMember(team.id, newMember.trim());
              setNewMember("");
            }
          }}
          className="mt-3 flex gap-2"
        >
          <label htmlFor={`add-${team.id}`} className="sr-only">
            {t.addMember}
          </label>
          <input
            id={`add-${team.id}`}
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder={t.memberPlaceholder}
            className="h-11 flex-1 rounded-xl border border-line bg-bg px-3.5 text-[15px] outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            disabled={!newMember.trim()}
            className="pill inline-flex cursor-pointer items-center gap-1.5 border-2 border-primary px-4 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-40"
          >
            <Plus size={15} /> {t.addMember}
          </button>
        </form>
      </div>

      {/* Reservations */}
      <div className="border-t border-line px-6 py-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-faint">
          {t.teamReservations}
        </h3>
        {teamRes.length === 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
            {t.noTeamReservations}
            <Link
              href="/reserve"
              className="pill inline-flex cursor-pointer items-center gap-1.5 bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              {t.reserveCta} <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {teamRes.map((r) => {
              const ev = eventById(r.eventId);
              if (!ev) return null;
              return (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-bg px-4 py-3 text-sm"
                >
                  <span className="font-semibold">{evTitle(ev, lang)}</span>
                  <span className="flex items-center gap-4 text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} /> {evDate(ev, lang)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} /> {ev.venue}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function CreateTeamCard() {
  const { t } = useLang();
  const { createTeam } = useReservations();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  if (!creating) {
    return (
      <button
        onClick={() => setCreating(true)}
        className="card-select flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-paper p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral-soft text-coral">
          <Plus size={20} />
        </div>
        <div>
          <div className="display text-lg font-semibold">{t.createTeam}</div>
          <div className="mt-0.5 text-sm text-muted">{t.createTeamSub}</div>
        </div>
      </button>
    );
  }

  return (
    <div className="step-in rounded-2xl border-2 border-primary bg-paper p-5 shadow-[0_0_0_3px_var(--color-primary-soft)]">
      <label htmlFor="create-team" className="text-sm font-bold text-ink">
        {t.newTeamLabel}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="create-team"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              createTeam(name.trim());
              setName("");
              setCreating(false);
            }
            if (e.key === "Escape") setCreating(false);
          }}
          placeholder={t.newTeamPlaceholder}
          className="h-12 flex-1 rounded-xl border border-line bg-bg px-4 text-[15px] outline-none transition-colors focus:border-primary"
        />
        <button
          onClick={() => {
            if (name.trim()) {
              createTeam(name.trim());
              setName("");
              setCreating(false);
            }
          }}
          disabled={!name.trim()}
          className="pill cursor-pointer bg-primary px-5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
        >
          {t.useIt}
        </button>
        <button
          onClick={() => setCreating(false)}
          className="pill cursor-pointer border border-line px-4 text-sm font-bold text-muted hover:text-ink"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

export default function MyTeamPage() {
  const { t } = useLang();
  const { teams, hydrated } = useReservations();

  return (
    <AppShell>
      <PageHead title={t.teamTitle} sub={t.teamSub} />

      {!hydrated ? (
        <div className="h-60 animate-pulse rounded-2xl bg-line/60" aria-label="Loading" />
      ) : (
        <div className="space-y-5">
          {teams.length === 0 && (
            <div className="rounded-2xl border border-line bg-paper px-6 py-8 text-center text-muted">
              {t.noTeams}
            </div>
          )}
          {teams.map((team) => (
            <TeamCard key={team.id} teamId={team.id} />
          ))}
          <CreateTeamCard />
        </div>
      )}
    </AppShell>
  );
}
