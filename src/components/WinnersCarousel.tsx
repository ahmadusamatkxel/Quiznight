"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { WINNERS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, Crown, MapPin, Trophy } from "./icons";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function WinnersCarousel() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  // show 3 at a time on desktop; page by 1
  const total = WINNERS.length;
  const prev = () => setI((v) => (v - 1 + total) % total);
  const next = () => setI((v) => (v + 1) % total);

  // visible triple starting at i (wraps)
  const visible = [0, 1, 2].map((k) => WINNERS[(i + k) % total]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-panel px-5 py-8 text-white sm:px-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="display flex items-center gap-2 text-2xl font-semibold">
            <Trophy size={22} className="text-mint" /> {t.winnersTitle}
          </h2>
          <p className="mt-1 text-sm text-white/60">{t.winnersSub}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            aria-label={t.prevWinner}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-mint hover:text-mint"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label={t.nextWinner}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-mint hover:text-mint"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((w, k) => (
          <article
            key={`${w.team}-${k}`}
            className="step-in overflow-hidden rounded-2xl bg-panel-2"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/30">
              <img
                src={w.photo}
                alt={w.team}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute left-3 top-3 pill bg-black/55 px-2.5 py-1 text-xs font-bold backdrop-blur">
                {MEDAL[(i + k) % total] ?? ""} {w.points} {t.points}
              </div>
            </div>
            <div className="p-4">
              <h3 className="display flex items-center gap-1.5 text-lg font-semibold leading-snug">
                <Crown size={15} className="shrink-0 text-coral" />
                {w.team}
              </h3>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/55">
                <span>17th Championship · {w.round}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {w.venue}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* dots */}
      <div className="mt-5 flex justify-center gap-1.5">
        {WINNERS.map((_, d) => (
          <button
            key={d}
            onClick={() => setI(d)}
            aria-label={`${d + 1}`}
            className={`h-2 rounded-full transition-all ${
              d === i ? "w-6 bg-mint" : "w-2 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
