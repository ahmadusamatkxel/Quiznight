"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHost } from "@/lib/host";
import { useLang } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, MapPin, X } from "@/components/icons";

type Draft = { step: number; name: string; location: string; description: string };

function Progress({ step }: { step: number }) {
  const { t } = useLang();
  const labels = [t.gsName, t.gsLocation, t.gsDetails, t.gsReview];
  return (
    <div className="flex items-center gap-2">
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

export default function CreateGamePage() {
  const { t } = useLang();
  const { createGame } = useHost();
  const router = useRouter();
  const [d, setD] = useState<Draft>({
    step: 0,
    name: "",
    location: "",
    description: "",
  });

  const canContinue = d.step !== 0 || d.name.trim().length > 0;

  const next = () => {
    if (d.step === 3) {
      const g = createGame({
        name: d.name.trim(),
        location: d.location.trim(),
        description: d.description.trim(),
      });
      router.push(`/host/game?id=${g.id}`);
    } else {
      setD((s) => ({ ...s, step: Math.min(3, s.step + 1) }));
    }
  };
  const back = () => {
    if (d.step === 0) router.push("/host");
    else setD((s) => ({ ...s, step: s.step - 1 }));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canContinue) {
      e.preventDefault();
      next();
    }
  };

  const inputCls =
    "mt-6 h-14 w-full rounded-2xl border-2 border-line bg-paper px-5 text-lg outline-none transition-colors focus:border-primary";

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {/* Top bar — Back + progress aligned to body, Close on the right */}
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-center gap-4">
            <button
              onClick={back}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} /> {t.back}
            </button>
            <div className="hidden sm:block">
              <Progress step={d.step} />
            </div>
          </div>
          <button
            onClick={() => router.push("/host")}
            aria-label={t.close}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-bg hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:py-14">
        {d.step === 0 && (
          <div className="step-in">
            <h1 className="display text-3xl font-semibold leading-tight sm:text-4xl">
              {t.qgName}
            </h1>
            <p className="mt-2 text-muted">{t.qgNameSub}</p>
            <input
              autoFocus
              value={d.name}
              onChange={(e) => setD((s) => ({ ...s, name: e.target.value }))}
              onKeyDown={onKey}
              placeholder={t.gameNamePlaceholder}
              className={inputCls}
            />
          </div>
        )}

        {d.step === 1 && (
          <div className="step-in">
            <h1 className="display text-3xl font-semibold leading-tight sm:text-4xl">
              {t.qgLocation}
            </h1>
            <p className="mt-2 text-muted">{t.qgLocationSub}</p>
            <input
              autoFocus
              value={d.location}
              onChange={(e) => setD((s) => ({ ...s, location: e.target.value }))}
              onKeyDown={onKey}
              placeholder={t.gameLocationPlaceholder}
              className={inputCls}
            />
          </div>
        )}

        {d.step === 2 && (
          <div className="step-in">
            <h1 className="display text-3xl font-semibold leading-tight sm:text-4xl">
              {t.qgDetails}
            </h1>
            <p className="mt-2 text-muted">{t.qgDetailsSub}</p>
            <textarea
              autoFocus
              value={d.description}
              onChange={(e) =>
                setD((s) => ({ ...s, description: e.target.value }))
              }
              placeholder={t.gameDescPlaceholder}
              rows={5}
              className="mt-6 w-full resize-none rounded-2xl border-2 border-line bg-paper px-5 py-4 text-lg outline-none transition-colors focus:border-primary"
            />
          </div>
        )}

        {d.step === 3 && (
          <div className="step-in">
            <h1 className="display text-3xl font-semibold leading-tight sm:text-4xl">
              {t.gameReviewTitle}
            </h1>
            <p className="mt-2 text-muted">{t.gameReviewSub}</p>
            <div className="mt-7 overflow-hidden rounded-2xl border-2 border-line bg-paper">
              <div className="border-b border-dashed border-line px-6 py-5">
                <div className="text-xs font-bold uppercase tracking-wider text-faint">
                  {t.gameNameLabel}
                </div>
                <div className="display mt-1 text-xl font-semibold">{d.name}</div>
                {d.location && (
                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
                    <MapPin size={14} /> {d.location}
                  </div>
                )}
              </div>
              {d.description && (
                <div className="px-6 py-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-faint">
                    {t.gameDescLabel}
                  </div>
                  <p className="mt-1 text-sm text-muted">{d.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={next}
            disabled={!canContinue}
            className="pill inline-flex cursor-pointer items-center gap-2 bg-ink px-7 py-3.5 font-bold text-paper transition-all duration-200 hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-30"
          >
            {d.step === 3 ? t.createGameBtn : t.continue}
            <ArrowRight size={17} />
          </button>
          <span className="hidden text-xs font-semibold text-faint sm:block">
            {t.pressEnter} <strong>Enter ↵</strong>
          </span>
        </div>
      </main>
    </div>
  );
}
