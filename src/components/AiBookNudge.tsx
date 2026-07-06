"use client";

/**
 * Wayfinder "Nudge" (Shape of AI) — a dismissible hint that the assistant can
 * complete the booking, with an example prompt (Suggestion). Points to the one
 * global assistant; it is NOT a second launcher. Shown once, then remembered.
 */

import { useEffect, useState } from "react";
import { useAssistant } from "@/lib/assistant-context";
import { useLang } from "@/lib/i18n";
import { Sparkles, X } from "./icons";

const LS_KEY = "quiznight-prototype-ai-nudge";

export default function AiBookNudge() {
  const { openAssistant } = useAssistant();
  const { t } = useLang();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(LS_KEY) === "1") setDismissed(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(LS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mb-6 flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary-soft/50 px-3 py-2.5">
      <button
        onClick={openAssistant}
        className="flex flex-1 cursor-pointer items-center gap-3 text-left"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-white">
          <Sparkles size={16} />
        </span>
        <span className="text-sm leading-snug text-ink">
          {t.aiNudge}{" "}
          <span className="font-semibold text-accent">{t.aiNudgeExample}</span>
        </span>
      </button>
      <button
        onClick={dismiss}
        aria-label={t.aiNudgeDismiss}
        className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink"
      >
        <X size={16} />
      </button>
    </div>
  );
}
