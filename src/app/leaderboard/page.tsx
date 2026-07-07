"use client";

import { useState } from "react";
import { LEADERBOARD } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

type SortKey = "total" | "base" | "badges";

export default function LeaderboardPage() {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("total");

  const rows = LEADERBOARD.filter((r) =>
    r.team.toLowerCase().includes(query.toLowerCase())
  )
    .slice()
    .sort((a, b) => b[sort] - a[sort]);

  const sorts: { key: SortKey; label: string }[] = [
    { key: "total", label: t.lbSortTotal },
    { key: "base", label: t.lbSortBase },
    { key: "badges", label: t.lbSortBadges },
  ];

  return (
    <AppShell>
      <PageHead title={t.lbTitle} sub={t.lbSub} />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="lb-search" className="sr-only">
          {t.lbSearch}
        </label>
        <input
          id="lb-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.lbSearch}
          className="h-11 w-full max-w-xs rounded-xl border border-line bg-paper px-4 text-[15px] outline-none transition-colors focus:border-primary"
        />
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-bold uppercase tracking-wide text-faint sm:inline">
            {t.lbSort}
          </span>
          <div className="flex gap-1 rounded-xl border border-line bg-paper p-1">
            {sorts.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                aria-pressed={sort === s.key}
                className={`pill cursor-pointer px-3 py-1.5 text-sm font-bold transition-colors ${
                  sort === s.key
                    ? "bg-primary text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper px-6 py-12 text-center text-muted">
          {t.lbNoMatches}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-bold uppercase tracking-wider text-faint">
                <th className="px-5 py-3.5">{t.lbRank}</th>
                <th className="px-5 py-3.5">{t.lbTeam}</th>
                <th className="px-5 py-3.5 text-right">{t.lbNoBadges}</th>
                <th className="px-5 py-3.5 text-right">{t.lbBadges}</th>
                <th className="px-5 py-3.5 text-right">{t.lbTotal}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.rank}
                  className={`border-b border-line last:border-0 ${
                    row.rank <= 3 ? "bg-primary-soft/40" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 font-bold">
                    {MEDAL[row.rank] ?? row.rank}
                  </td>
                  <td className="px-5 py-3.5 font-semibold">{row.team}</td>
                  <td
                    className={`px-5 py-3.5 text-right tabular-nums ${
                      sort === "base" ? "font-bold text-accent" : "text-muted"
                    }`}
                  >
                    {row.base}
                  </td>
                  <td
                    className={`px-5 py-3.5 text-right tabular-nums ${
                      sort === "badges" ? "font-bold text-accent" : "text-muted"
                    }`}
                  >
                    {row.badges}
                  </td>
                  <td
                    className={`px-5 py-3.5 text-right tabular-nums ${
                      sort === "total"
                        ? "font-bold text-accent"
                        : "font-semibold text-ink"
                    }`}
                  >
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
