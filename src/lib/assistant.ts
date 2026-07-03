/**
 * Scripted AI assistant for the reservation flow.
 * No external APIs — deterministic keyword parsing so the demo always works.
 * Understands English and Hungarian keywords; replies in the active language.
 */

import { EVENTS, EXISTING_TEAMS, MAX_PLAYERS, MIN_PLAYERS } from "./data";
import type { Lang } from "./i18n";

export type FlowState = {
  step: number; // 0 event · 1 team · 2 players · 3 review · 4 done
  eventId: string | null;
  teamName: string | null;
  isNewTeam: boolean;
  players: number;
};

export type AssistantAction =
  | { type: "selectEvent"; eventId: string }
  | { type: "selectTeam"; name: string; isNew: boolean }
  | { type: "setPlayers"; players: number }
  | { type: "goToStep"; step: number }
  | { type: "confirm" };

export type AssistantTurn = {
  reply: string;
  actions: AssistantAction[];
};

const NUM_WORDS: Record<string, number> = {
  // en
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  // hu
  egy: 1, kettő: 2, ketten: 2, három: 3, hárman: 3, négy: 4, négyen: 4,
  öt: 5, öten: 5, hat: 6, hatan: 6, hét: 7, heten: 7, nyolc: 8, nyolcan: 8,
  kilenc: 9, tíz: 10, tízen: 10,
};

const num = (t: string): number | null => {
  const d = t.match(/\b(\d{1,2})\b/);
  if (d) return parseInt(d[1], 10);
  for (const [w, n] of Object.entries(NUM_WORDS))
    if (new RegExp(`\\b${w}\\b`, "u").test(t)) return n;
  return null;
};

function matchEvent(t: string) {
  if (/(a38|lord|ring|ship|lotr|gyűrűk|hajó)/.test(t)) return EVENTS[0];
  if (/(august|aug|augusztus)/.test(t)) return EVENTS[2];
  if (/(d[uü]rer|july|garden|kert|július)/.test(t)) return EVENTS[1];
  return null;
}

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1));

function matchTeam(t: string): { name: string; isNew: boolean } | null {
  for (const team of EXISTING_TEAMS)
    if (t.includes(team.name.toLowerCase()))
      return { name: team.name, isNew: false };
  const created = t.match(
    /(?:new team(?:\s+(?:called|named))?|team (?:called|named)|call (?:it|us)|name (?:it|us)|új csapat(?:ot)?(?:,?\s+(?:a\s+)?neve)?)\s*[:]?\s*["'„]?([\w\sÀ-űÁ-ű'!-]{2,30}?)["'”]?(?:[.,!]|$)/u
  );
  if (created) return { name: titleCase(created[1].trim()), isNew: true };
  return null;
}

export function nextMissing(s: FlowState, playersGiven = false): string {
  if (!s.eventId) return "event";
  if (!s.teamName) return "team";
  if (s.step <= 2 && !playersGiven) return "players";
  if (s.step <= 3) return "confirm";
  return "done";
}

const T = {
  en: {
    picked: (title: string, meta: string) => `picked **${title}** (${meta})`,
    newTeam: (n: string) => `I'll create the new team **${n}**`,
    useTeam: (n: string) => `using your team **${n}**`,
    tableFor: (n: number) => `table for **${n}**`,
    done: (team: string, venue: string, date: string, n: number) =>
      `Done! 🎉 Table reserved for **${team}** at **${venue}** — ${date}, ${n} player${n > 1 ? "s" : ""}. It's free, and you'll find it on your dashboard.`,
    gotIt: (things: string) => `Got it — ${things}. `,
    askEvent:
      "Which quiz night should it be — A38 (13 July), Dürer Garden July, or August?",
    askTeam:
      "Who's playing? You can use your existing team **Dexx** or tell me a new team name.",
    askPlayers: "How many players are coming?",
    askConfirm:
      "Everything's filled in — say **confirm** and I'll reserve the table.",
    helpEvent:
      'I can book your table. Try: *"Book the Dürer Garden July quiz for team Dexx, 4 of us"* — or just tell me which event: **A38 (13 July)**, **Dürer July (28th)** or **Dürer August (18th)**.',
    helpTeam:
      'Which team is playing? Say *"use Dexx"* or *"new team called The Quizzly Bears"*.',
    helpPlayers: "How many players? Just say a number, e.g. *“4 of us”*.",
    helpConfirm: "Ready when you are — say **confirm** to reserve the table.",
    helpDone: "Your table is booked! Head back to the dashboard to see it.",
  },
  hu: {
    picked: (title: string, meta: string) =>
      `kiválasztottam: **${title}** (${meta})`,
    newTeam: (n: string) => `létrehozom az új **${n}** csapatot`,
    useTeam: (n: string) => `a **${n}** csapatoddal`,
    tableFor: (n: number) => `asztal **${n}** főre`,
    done: (team: string, venue: string, date: string, n: number) =>
      `Kész! 🎉 Asztal lefoglalva a(z) **${team}** csapatnak — **${venue}**, ${date}, ${n} fő. Ingyenes, és a kezdőlapon megtalálod.`,
    gotIt: (things: string) => `Rendben — ${things}. `,
    askEvent:
      "Melyik kvízest legyen — A38 (júl. 13.), Dürer Kert július vagy augusztus?",
    askTeam:
      "Ki játszik? Használhatod a meglévő **Dexx** csapatod, vagy mondj egy új csapatnevet.",
    askPlayers: "Hányan lesztek?",
    askConfirm:
      "Minden megvan — mondd, hogy **megerősítem**, és lefoglalom az asztalt.",
    helpEvent:
      'Lefoglalom az asztalt. Próbáld így: *„Foglalj a Dexx csapatnak a Dürer júliusi kvízre, négyen leszünk”* — vagy csak mondd meg, melyik esemény: **A38 (júl. 13.)**, **Dürer július (28.)** vagy **Dürer augusztus (18.)**.',
    helpTeam:
      'Melyik csapat játszik? Mondd: *„a Dexx csapattal”* vagy *„új csapat, a neve Kvízmesterek”*.',
    helpPlayers: "Hányan lesztek? Csak mondj egy számot, pl. *„négyen”*.",
    helpConfirm:
      "Ha kész vagy, mondd: **megerősítem**, és foglalom az asztalt.",
    helpDone: "Az asztal lefoglalva! A kezdőlapon megtalálod.",
  },
};

/** Main entry: parse a user message against current flow state. */
export function respond(
  message: string,
  state: FlowState,
  lang: Lang = "en"
): AssistantTurn {
  const t = message.toLowerCase();
  const s = T[lang];
  const actions: AssistantAction[] = [];
  const said: string[] = [];
  let playersGiven = false;

  const ev = matchEvent(t);
  if (ev) {
    actions.push({ type: "selectEvent", eventId: ev.id });
    const title = lang === "hu" ? ev.titleHu : ev.title;
    const date = lang === "hu" ? ev.dateLabelHu : ev.dateLabel;
    said.push(s.picked(title, `${date}, ${ev.venue}`));
  }

  const team = matchTeam(t);
  if (team) {
    actions.push({ type: "selectTeam", name: team.name, isNew: team.isNew });
    said.push(team.isNew ? s.newTeam(team.name) : s.useTeam(team.name));
  }

  const n = num(t);
  if (
    n !== null &&
    /(player|people|of us|person|heads?|seats?|\bfor\b|fő|főre|leszünk|-?en\b|-?an\b|játékos)/u.test(
      t
    )
  ) {
    const clamped = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, n));
    actions.push({ type: "setPlayers", players: clamped });
    said.push(s.tableFor(clamped));
    playersGiven = true;
  }

  const wantsConfirm =
    /(confirm|book it|reserve it|finish|done|yes.*(book|reserve)|go ahead|lock it|megerősít|foglald|mehet|rendben van)/u.test(
      t
    );

  // Merge state with pending actions to decide the next step
  const merged: FlowState = { ...state };
  for (const a of actions) {
    if (a.type === "selectEvent") merged.eventId = a.eventId;
    if (a.type === "selectTeam") {
      merged.teamName = a.name;
      merged.isNewTeam = a.isNew;
    }
    if (a.type === "setPlayers") merged.players = a.players;
  }

  if (wantsConfirm && merged.eventId && merged.teamName) {
    actions.push({ type: "confirm" });
    const evt = EVENTS.find((e) => e.id === merged.eventId)!;
    const title = lang === "hu" ? evt.titleHu : evt.title;
    const date = lang === "hu" ? evt.dateLabelHu : evt.dateLabel;
    void title;
    return {
      reply: s.done(merged.teamName, evt.venue, date, merged.players),
      actions,
    };
  }

  const missing = nextMissing(merged, playersGiven);
  const stepFor: Record<string, number> = {
    event: 0, team: 1, players: 2, confirm: 3, done: 4,
  };
  if (actions.length > 0) {
    actions.push({ type: "goToStep", step: stepFor[missing] });
  }

  if (said.length > 0) {
    const ask =
      missing === "event"
        ? s.askEvent
        : missing === "team"
          ? s.askTeam
          : missing === "players"
            ? s.askPlayers
            : s.askConfirm;
    return { reply: s.gotIt(said.join(", ")) + ask, actions };
  }

  const help: Record<string, string> = {
    event: s.helpEvent,
    team: s.helpTeam,
    players: s.helpPlayers,
    confirm: s.helpConfirm,
    done: s.helpDone,
  };
  return { reply: help[missing], actions };
}

/** Canned utterances for the simulated voice mode, chosen by what's missing. */
export function voiceUtterance(state: FlowState, lang: Lang = "en"): string {
  const missing = nextMissing(state);
  if (lang === "hu") {
    switch (missing) {
      case "event":
        return "Foglalj a Dexx csapatnak a Dürer Kert júliusi kvízre, négyen leszünk.";
      case "team":
        return "A Dexx csapattal megyünk, négyen leszünk.";
      case "players":
        return "Négyen leszünk.";
      case "confirm":
        return "Rendben van, megerősítem a foglalást.";
      default:
        return "Köszönöm, ennyi volt!";
    }
  }
  switch (missing) {
    case "event":
      return "Book the Dürer Garden July quiz for my team Dexx, four of us.";
    case "team":
      return "Use my team Dexx, there will be four of us.";
    case "players":
      return "We'll be four players.";
    case "confirm":
      return "Looks good — confirm the reservation.";
    default:
      return "Thanks, that's all!";
  }
}

export function quickChips(step: number, lang: Lang): string[] {
  const chips: Record<Lang, Record<number, string[]>> = {
    en: {
      0: ["Book Dürer Garden July", "The A38 Lord of the Rings one", "Dürer in August"],
      1: ["Use team Dexx", "New team called The Quizzly Bears"],
      2: ["4 of us", "6 players"],
      3: ["Confirm the booking"],
      4: [],
    },
    hu: {
      0: ["A Dürer Kert júliusi kvízt", "A Gyűrűk Ura kvízt az A38-on", "Dürer augusztusban"],
      1: ["A Dexx csapattal", "Új csapat, a neve Kvízmesterek"],
      2: ["Négyen leszünk", "6 fő"],
      3: ["Megerősítem a foglalást"],
      4: [],
    },
  };
  return chips[lang][step] ?? [];
}

export function greeting(lang: Lang): string {
  return lang === "hu"
    ? "Szia Dexter! 👋 Lefoglalom nektek a kvízasztalt. Mondd el az eseményt, a csapatot és hogy hányan lesztek — akár egy mondatban."
    : "Hi Dexter! 👋 I can reserve your quiz table for you. Tell me the event, the team and how many of you are coming — in one sentence if you like.";
}
