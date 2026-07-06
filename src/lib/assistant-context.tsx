"use client";

/**
 * Global assistant state — lives at the layout level so the conversation and
 * open/closed state survive route changes (the assistant is ambient, not tied
 * to a page). Wraps the scripted platform engine; swap the engine call in
 * `send()` for a real model later without changing any consumer.
 *
 * State-changing intents (booking) are proposed, never executed silently: the
 * engine returns a draft, the UI shows a confirm card, and only `confirm()`
 * touches the store. Every confirmed booking leaves an undo handle.
 */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "./i18n";
import { useReservations } from "./store";
import {
  bookingCancelledText,
  bookingDoneText,
  bookingUndoneText,
  platformGreeting,
  platformRespond,
  type BookingDraft,
} from "./assistant-platform";

export type AssistantMsg = { role: "user" | "ai"; text: string };
type LastBooking = { reservationId: string; createdTeamId?: string };

type AssistantValue = {
  open: boolean;
  msgs: AssistantMsg[];
  thinking: boolean;
  pending: BookingDraft | null;
  lastBooking: LastBooking | null;
  openAssistant: () => void;
  closeAssistant: () => void;
  send: (text: string) => void;
  confirmPending: () => void;
  cancelPending: () => void;
  undoLast: () => void;
};

const Ctx = createContext<AssistantValue | null>(null);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const { teams, addReservation, removeReservation, createTeam, deleteTeam } =
    useReservations();

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<AssistantMsg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [pending, setPending] = useState<BookingDraft | null>(null);
  const [lastBooking, setLastBooking] = useState<LastBooking | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback(
    (text: string) => setMsgs((m) => [...m, { role: "ai", text }]),
    []
  );

  const openAssistant = useCallback(() => {
    setOpen(true);
    setMsgs((m) => (m.length ? m : [{ role: "ai", text: platformGreeting(lang) }]));
  }, [lang]);

  const closeAssistant = useCallback(() => setOpen(false), []);

  const send = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean || thinking) return;
      // a new turn clears any dangling proposal / undo affordance
      setPending(null);
      setLastBooking(null);
      setMsgs((m) => [...m, { role: "user", text: clean }]);
      setThinking(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const turn = platformRespond(
          clean,
          { pathname, teamNames: teams.map((t) => t.name) },
          lang
        );
        say(turn.reply);
        setThinking(false);
        if (turn.propose) setPending(turn.propose);
        for (const a of turn.actions) {
          if (a.type === "navigate" && a.href !== pathname) {
            setOpen(false);
            router.push(a.href);
          }
        }
      }, 650);
    },
    [thinking, pathname, lang, router, teams, say]
  );

  const confirmPending = useCallback(() => {
    if (!pending) return;
    let createdTeamId: string | undefined;
    if (pending.isNewTeam && pending.teamName) {
      createTeam(pending.teamName);
      createdTeamId = pending.teamName.toLowerCase().replace(/\s+/g, "-");
    }
    const res = addReservation({
      eventId: pending.eventId,
      teamName: pending.teamName,
      isNewTeam: pending.isNewTeam,
      players: pending.players,
    });
    say(bookingDoneText(pending, lang));
    setLastBooking({ reservationId: res.id, createdTeamId });
    setPending(null);
  }, [pending, addReservation, createTeam, lang, say]);

  const cancelPending = useCallback(() => {
    if (!pending) return;
    setPending(null);
    say(bookingCancelledText(lang));
  }, [pending, lang, say]);

  const undoLast = useCallback(() => {
    if (!lastBooking) return;
    removeReservation(lastBooking.reservationId);
    if (lastBooking.createdTeamId) deleteTeam(lastBooking.createdTeamId);
    setLastBooking(null);
    say(bookingUndoneText(lang));
  }, [lastBooking, removeReservation, deleteTeam, lang, say]);

  return (
    <Ctx.Provider
      value={{
        open,
        msgs,
        thinking,
        pending,
        lastBooking,
        openAssistant,
        closeAssistant,
        send,
        confirmPending,
        cancelPending,
        undoLast,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAssistant() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAssistant must be used within AssistantProvider");
  return v;
}
