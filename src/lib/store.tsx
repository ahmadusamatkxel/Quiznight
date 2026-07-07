"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { EVENTS, EXISTING_TEAMS, type QuizEvent, type Team } from "./data";

export type Reservation = {
  id: string;
  eventId: string;
  teamName: string;
  isNewTeam: boolean;
  players: number;
  createdAt: string;
};

type Store = {
  reservations: Reservation[];
  addReservation: (r: Omit<Reservation, "id" | "createdAt">) => Reservation;
  removeReservation: (id: string) => void;
  clearReservations: () => void;
  eventById: (id: string) => QuizEvent | undefined;
  reservedEventIds: string[];
  teams: Team[];
  createTeam: (name: string) => void;
  renameTeam: (id: string, name: string) => void;
  deleteTeam: (id: string) => void;
  addMember: (teamId: string, name: string) => void;
  removeMember: (teamId: string, memberName: string) => void;
  assignCaptain: (teamId: string, memberName: string) => void;
  hydrated: boolean;
};

const Ctx = createContext<Store | null>(null);
const LS_KEY = "quiznight-prototype-reservations";
const LS_TEAMS = "quiznight-prototype-teams";

export function ReservationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [teams, setTeams] = useState<Team[]>(EXISTING_TEAMS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setReservations(JSON.parse(raw));
      const rawTeams = localStorage.getItem(LS_TEAMS);
      if (rawTeams) setTeams(JSON.parse(rawTeams));
    } catch {
      /* fresh start */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_KEY, JSON.stringify(reservations));
  }, [reservations, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_TEAMS, JSON.stringify(teams));
  }, [teams, hydrated]);

  const createTeam = useCallback((name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setTeams((prev) =>
      prev.some((t) => t.id === id)
        ? prev
        : [
            ...prev,
            {
              id,
              name,
              members: [
                { name: "Legal Dexter", role: "captain", status: "active" },
              ],
            },
          ]
    );
  }, []);

  const renameTeam = useCallback((id: string, name: string) => {
    setTeams((prev) => {
      const old = prev.find((t) => t.id === id);
      if (old) {
        // keep reservations pointing at the renamed team
        setReservations((res) =>
          res.map((r) =>
            r.teamName === old.name ? { ...r, teamName: name } : r
          )
        );
      }
      return prev.map((t) => (t.id === id ? { ...t, name } : t));
    });
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addMember = useCallback((teamId: string, name: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId &&
        !t.members.some((m) => m.name.toLowerCase() === name.toLowerCase())
          ? {
              ...t,
              members: [
                ...t.members,
                { name, role: "member", status: "pending" },
              ],
            }
          : t
      )
    );
  }, []);

  const removeMember = useCallback((teamId: string, memberName: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.filter(
                (m) => m.name !== memberName || m.role === "captain"
              ),
            }
          : t
      )
    );
  }, []);

  const assignCaptain = useCallback((teamId: string, memberName: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.map((m) => ({
                ...m,
                role: m.name === memberName ? "captain" : "member",
                // a promoted member is active on the team
                status: m.name === memberName ? "active" : m.status,
              })),
            }
          : t
      )
    );
  }, []);

  const addReservation = useCallback(
    (r: Omit<Reservation, "id" | "createdAt">) => {
      const full: Reservation = {
        ...r,
        id: `res-${r.eventId}-${r.teamName}`.toLowerCase().replace(/\s+/g, "-"),
        createdAt: new Date().toISOString(),
      };
      setReservations((prev) => [
        ...prev.filter((p) => p.id !== full.id),
        full,
      ]);
      return full;
    },
    []
  );

  const removeReservation = useCallback((id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearReservations = useCallback(() => setReservations([]), []);

  const eventById = useCallback(
    (id: string) => EVENTS.find((e) => e.id === id),
    []
  );

  return (
    <Ctx.Provider
      value={{
        reservations,
        addReservation,
        removeReservation,
        clearReservations,
        eventById,
        reservedEventIds: reservations.map((r) => r.eventId),
        teams,
        createTeam,
        renameTeam,
        deleteTeam,
        addMember,
        removeMember,
        assignCaptain,
        hydrated,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useReservations must be used inside ReservationProvider");
  return ctx;
}
