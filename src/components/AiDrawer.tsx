"use client";

import { useEffect, useRef, useState } from "react";
import type { AssistantAction, FlowState } from "@/lib/assistant";
import { greeting, quickChips, respond, voiceUtterance } from "@/lib/assistant";
import { useLang } from "@/lib/i18n";
import { MessageCircle, Mic, Send, Sparkles, X } from "./icons";

type Msg = { role: "user" | "ai"; text: string };

/** Render **bold** / *italic* minimally without an md dependency */
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

export default function AiDrawer({
  open,
  onClose,
  state,
  dispatch,
}: {
  open: boolean;
  onClose: () => void;
  state: FlowState;
  dispatch: (actions: AssistantAction[]) => void;
}) {
  const { lang, t } = useLang();
  const [mode, setMode] = useState<"chat" | "voice">("chat");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Greeting in the active language on first open
  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "ai", text: greeting(lang) }]);
    }
  }, [open, msgs.length, lang]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [msgs, thinking, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || thinking) return;
    setMsgs((m) => [...m, { role: "user", text: clean }]);
    setInput("");
    setThinking(true);
    // Scripted agent — small delay to feel conversational
    setTimeout(() => {
      const turn = respond(clean, state, lang);
      dispatch(turn.actions);
      setMsgs((m) => [...m, { role: "ai", text: turn.reply }]);
      setThinking(false);
    }, 650);
  }

  function pressMic() {
    if (listening || thinking) return;
    setListening(true);
    // Simulated voice: after a short "listening" phase, a canned utterance
    // relevant to the current step is transcribed and processed.
    setTimeout(() => {
      setListening(false);
      send(voiceUtterance(state, lang));
    }, 1800);
  }

  const chips = quickChips(state.step, lang);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
    >
      {/* Scrim */}
      <div
        onClick={onClose}
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
            onClick={onClose}
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

        {/* Quick chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-2">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="pill cursor-pointer border border-line bg-paper px-3.5 py-1.5 text-sm font-semibold text-accent transition-colors hover:border-primary hover:bg-primary-soft"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        {mode === "chat" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-line px-4 py-3.5"
          >
            <label htmlFor="ai-input" className="sr-only">
              {t.send}
            </label>
            <input
              id="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.inputPlaceholder}
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
              aria-label={listening ? t.listening : t.pressMic}
              className={`mx-auto grid h-20 w-20 cursor-pointer place-items-center rounded-full text-white transition-transform active:scale-95 ${
                listening ? "mic-pulse bg-coral" : "bg-primary hover:bg-primary-dark"
              }`}
            >
              <Mic size={30} />
            </button>
            <div className="mt-3 text-sm font-semibold text-muted" aria-live="polite">
              {listening ? t.listening : t.pressMic}
            </div>
            <div className="mt-1 text-xs text-faint">{t.voiceNote}</div>
          </div>
        )}
      </aside>
    </div>
  );
}
