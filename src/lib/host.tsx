"use client";

/**
 * Host-side state: the Playing ⇄ Hosting role, plus the games a host creates
 * and the teams that register for them. All localStorage-backed so the demo
 * works with no backend; invite/registration codes are real and resolvable
 * within the browser.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Role = "playing" | "hosting";

export type GameMember = {
  name: string;
  role: "captain" | "member";
  via: "host" | "link" | "email";
};

export type GameTeam = {
  id: string;
  name: string;
  size: number; // intended team size
  members: GameMember[];
  code: string; // invite code for teammates
  createdAt: string;
};

export type HostGame = {
  id: string;
  name: string;
  location: string;
  description: string;
  hostName: string;
  code: string; // registration code for the event
  teams: GameTeam[];
  createdAt: string;
};

type HostStore = {
  role: Role;
  setRole: (r: Role) => void;
  games: HostGame[];
  hydrated: boolean;
  createGame: (g: {
    name: string;
    location: string;
    description: string;
  }) => HostGame;
  getGame: (id: string) => HostGame | undefined;
  gameByCode: (code: string) => HostGame | undefined;
  addTeam: (
    gameId: string,
    t: { name: string; captainName: string; size: number }
  ) => GameTeam | undefined;
  removeTeam: (gameId: string, teamId: string) => void;
  addMember: (
    gameId: string,
    teamId: string,
    name: string,
    via?: GameMember["via"]
  ) => void;
  removeMember: (gameId: string, teamId: string, name: string) => void;
  assignCaptain: (gameId: string, teamId: string, name: string) => void;
};

const Ctx = createContext<HostStore | null>(null);
const LS_ROLE = "quiznight-prototype-role";
const LS_GAMES = "quiznight-prototype-games";

const rid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;
const code = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const slug = (s: string) =>
  s.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");

export function HostProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("playing");
  const [games, setGames] = useState<HostGame[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem(LS_ROLE);
      if (r === "hosting" || r === "playing") setRoleState(r);
      const g = localStorage.getItem(LS_GAMES);
      if (g) setGames(JSON.parse(g));
    } catch {
      /* fresh start */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_GAMES, JSON.stringify(games));
  }, [games, hydrated]);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    try {
      localStorage.setItem(LS_ROLE, r);
    } catch {
      /* ignore */
    }
  }, []);

  const createGame: HostStore["createGame"] = useCallback((g) => {
    const game: HostGame = {
      id: rid(slug(g.name) || "game"),
      name: g.name,
      location: g.location,
      description: g.description,
      hostName: "Dexter",
      code: code(),
      teams: [],
      createdAt: new Date().toISOString(),
    };
    setGames((prev) => [game, ...prev]);
    return game;
  }, []);

  const getGame = useCallback(
    (id: string) => games.find((g) => g.id === id),
    [games]
  );
  const gameByCode = useCallback(
    (c: string) => games.find((g) => g.code.toLowerCase() === c.toLowerCase()),
    [games]
  );

  const addTeam: HostStore["addTeam"] = useCallback((gameId, t) => {
    const team: GameTeam = {
      id: rid("team"),
      name: t.name,
      size: t.size,
      code: code(),
      createdAt: new Date().toISOString(),
      members: [{ name: t.captainName, role: "captain", via: "host" }],
    };
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId ? { ...g, teams: [...g.teams, team] } : g
      )
    );
    return team;
  }, []);

  const removeTeam: HostStore["removeTeam"] = useCallback((gameId, teamId) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId
          ? { ...g, teams: g.teams.filter((te) => te.id !== teamId) }
          : g
      )
    );
  }, []);

  const addMember: HostStore["addMember"] = useCallback(
    (gameId, teamId, name, via = "email") => {
      setGames((prev) =>
        prev.map((g) =>
          g.id === gameId
            ? {
                ...g,
                teams: g.teams.map((te) =>
                  te.id === teamId &&
                  !te.members.some(
                    (m) => m.name.toLowerCase() === name.toLowerCase()
                  )
                    ? {
                        ...te,
                        members: [
                          ...te.members,
                          { name, role: "member", via },
                        ],
                      }
                    : te
                ),
              }
            : g
        )
      );
    },
    []
  );

  const removeMember: HostStore["removeMember"] = useCallback(
    (gameId, teamId, name) => {
      setGames((prev) =>
        prev.map((g) =>
          g.id === gameId
            ? {
                ...g,
                teams: g.teams.map((te) =>
                  te.id === teamId
                    ? {
                        ...te,
                        members: te.members.filter(
                          (m) => m.name !== name || m.role === "captain"
                        ),
                      }
                    : te
                ),
              }
            : g
        )
      );
    },
    []
  );

  const assignCaptain: HostStore["assignCaptain"] = useCallback(
    (gameId, teamId, name) => {
      setGames((prev) =>
        prev.map((g) =>
          g.id === gameId
            ? {
                ...g,
                teams: g.teams.map((te) =>
                  te.id === teamId
                    ? {
                        ...te,
                        members: te.members.map((m) => ({
                          ...m,
                          role: m.name === name ? "captain" : "member",
                        })),
                      }
                    : te
                ),
              }
            : g
        )
      );
    },
    []
  );

  return (
    <Ctx.Provider
      value={{
        role,
        setRole,
        games,
        hydrated,
        createGame,
        getGame,
        gameByCode,
        addTeam,
        removeTeam,
        addMember,
        removeMember,
        assignCaptain,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useHost() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useHost must be used within HostProvider");
  return v;
}
