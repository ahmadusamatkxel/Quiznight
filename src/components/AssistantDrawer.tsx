"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAssistant } from "@/lib/assistant-context";
import { platformChips, platformVoiceUtterance } from "@/lib/assistant-platform";
import { EVENTS, evDate, evTitle } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import {
  Calendar,
  Check,
  MapPin,
  MessageCircle,
  Mic,
  Send,
  Sparkles,
  Users,
  X,
} from "./icons";

/** Minimal **bold** / *italic* renderer (no markdown dependency). */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : p.startsWith("*") ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function AssistantDrawer() {
  const {
    open,
    msgs,
    thinking,
    pending,
    lastBooking,
    closeAssistant,
    send,
    confirmPending,
    cancelPending,
    undoLast,
  } = useAssistant();
  const { lang, t } = useLang();
  const pathname = usePathname();
  const [mode, setMode] = useState<"chat" | "voice">("chat");
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [msgs, thinking, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAssistant();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAssistant]);

  function submit(text: string) {
    if (!text.trim() || thinking) return;
    send(text);
    setInput("");
  }

  function pressMic() {
    if (listening || thinking) return;
    setListening(true);
    setTimeout(() => {
      setListening(false);
      send(platformVoiceUtterance(lang));
    }, 1800);
  }

  const chips = platformChips(pathname, lang);
  const pendingEvent = pending ? EVENTS.find((e) => e.id === pending.eventId) : null;

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
    >
      {/* Scrim */}
      <div
        onClick={closeAssistant}
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label={t.assistantName}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-250 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="display font-semibold leading-tight">
                {t.assistantName}
              </div>
              <div className="text-xs text-muted">{t.assistantSub}</div>
            </div>
          </div>
          <button
            onClick={closeAssistant}
            aria-label={t.closeAssistant}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-bg hover:text-ink"
          >
            <X size={19} />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1.5 border-b border-line px-5 py-3">
          {(["chat", "voice"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`pill inline-flex cursor-pointer items-center gap-1.5 px-4 py-1.5 text-sm font-bold transition-colors ${
                mode === m
                  ? "bg-ink text-paper"
                  : "text-muted hover:bg-bg hover:text-ink"
              }`}
              aria-pressed={mode === m}
            >
              {m === "chat" ? <MessageCircle size={15} /> : <Mic size={15} />}
              {m === "chat" ? t.chat : t.voice}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                m.role === "ai"
                  ? "bg-bg text-ink"
                  : "ml-auto bg-primary text-white"
              }`}
            >
              <Rich text={m.text} />
            </div>
          ))}
          {thinking && (
            <div className="inline-flex items-center gap-1.5 rounded-2xl bg-bg px-4 py-3">
              <span className="typing-dot h-2 w-2 rounded-full bg-faint" />
              <span className="typing-dot h-2 w-2 rounded-full bg-faint" />
              <span className="typing-dot h-2 w-2 rounded-full bg-faint" />
            </div>
          )}
        </div>

        {/* Booking confirm card (Verification pattern) — nothing is saved until Confirm */}
        {pending && pendingEvent ? (
          <div className="border-t border-line px-5 py-4">
            <div className="rounded-2xl border-2 border-primary bg-primary-soft/50 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-accent">
                {t.reviewBooking}
              </div>
              <div className="display mt-1 text-base font-semibold leading-snug">
                {evTitle(pendingEvent, lang)}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} /> {evDate(pendingEvent, lang)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} /> {pendingEvent.venue}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm">
                <span className="pill inline-flex items-center gap-1.5 bg-paper px-2.5 py-1 font-semibold">
                  {pending.teamName}
                  {pending.isNewTeam && (
                    <span className="pill bg-coral-soft px-1.5 text-[10px] font-bold uppercase text-coral-text">
                      {t.newBadge}
                    </span>
                  )}
                </span>
                <span className="pill inline-flex items-center gap-1.5 bg-paper px-2.5 py-1 font-semibold">
                  <Users size={13} /> {pending.players}{" "}
                  {pending.players > 1 ? t.players : t.player}
                </span>
                <span className="pill bg-mint/50 px-2.5 py-1 font-bold text-mint-dark">
                  {t.free}
                </span>
              </div>
              {pending.isNewTeam && (
                <div className="mt-2 text-xs text-muted">{t.assistantWillCreate}</div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={confirmPending}
                  className="pill inline-flex flex-1 cursor-pointer items-center justify-center gap-2 bg-primary px-4 py-2.5 font-bold text-white transition-colors hover:bg-primary-dark"
                >
                  <Check size={16} /> {t.assistantConfirm}
                </button>
                <button
                  onClick={cancelPending}
                  className="pill cursor-pointer border border-line bg-paper px-4 py-2.5 font-bold text-muted transition-colors hover:text-ink"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Footprint — confirmed action with an undo handle */}
            {lastBooking && (
              <div className="border-t border-line px-5 py-3">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-mint/30 px-3.5 py-2.5">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-mint-dark">
                    <Check size={15} /> {t.booked}
                  </span>
                  <button
                    onClick={undoLast}
                    className="pill cursor-pointer border border-mint-dark/40 px-3 py-1 text-xs font-bold text-mint-dark transition-colors hover:bg-mint/40"
                  >
                    {t.undo}
                  </button>
                </div>
              </div>
            )}

            {/* Quick chips (Wayfinders) */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2 px-5 pb-2 pt-2">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => submit(c)}
                    className="pill cursor-pointer border border-line bg-paper px-3.5 py-1.5 text-sm font-semibold text-accent transition-colors hover:border-primary hover:bg-primary-soft"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Input area */}
        {mode === "chat" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-center gap-2 border-t border-line px-4 py-3.5"
          >
            <label htmlFor="assistant-input" className="sr-only">
              {t.send}
            </label>
            <input
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.assistantPlaceholder}
              className="h-11 flex-1 rounded-xl border border-line bg-bg px-3.5 text-[15px] outline-none transition-colors focus:border-primary"
            />
            <button
              type="submit"
              aria-label={t.send}
              disabled={!input.trim() || thinking}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </form>
        ) : (
          <div className="border-t border-line px-5 py-6 text-center">
            <button
              onClick={pressMic}
              aria-label={listening ? t.listening : t.assistantVoicePrompt}
              className={`mx-auto grid h-20 w-20 cursor-pointer place-items-center rounded-full text-white transition-transform active:scale-95 ${
                listening ? "mic-pulse bg-coral" : "bg-primary hover:bg-primary-dark"
              }`}
            >
              <Mic size={30} />
            </button>
            <div className="mt-3 text-sm font-semibold text-muted" aria-live="polite">
              {listening ? t.listening : t.assistantVoicePrompt}
            </div>
            <div className="mt-1 text-xs text-faint">{t.assistantVoiceNote}</div>
          </div>
        )}
      </aside>
    </div>
  );
}
