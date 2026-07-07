"use client";

import { useAssistant } from "@/lib/assistant-context";
import { useLang } from "@/lib/i18n";
import { Rio } from "./icons";

export default function AssistantLauncher() {
  const { open, openAssistant } = useAssistant();
  const { t } = useLang();

  return (
    <button
      onClick={openAssistant}
      aria-label={t.openAssistant}
      aria-expanded={open}
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary py-3.5 pl-4 pr-5 font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft ${
        open ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
      }`}
    >
      <Rio size={22} />
      <span className="hidden text-sm sm:inline">{t.assistantName}</span>
    </button>
  );
}
