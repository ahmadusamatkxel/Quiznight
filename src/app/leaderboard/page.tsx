"use client";

import { LEADERBOARD } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function LeaderboardPage() {
  const { t } = useLang();

  return (
    <AppShell>
      <PageHead title={t.lbTitle} sub={t.lbSub} />

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
            {LEADERBOARD.map((row) => (
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
                <td className="px-5 py-3.5 text-right tabular-nums text-muted">
                  {row.base}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-muted">
                  {row.badges}
                </td>
                <td className="px-5 py-3.5 text-right font-bold tabular-nums text-primary">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
