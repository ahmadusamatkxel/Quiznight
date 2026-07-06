/**
 * Platform-wide scripted assistant engine.
 *
 * Deterministic, no external API — so the demo is always predictable and never
 * hallucinates. Understands EN + HU keywords and replies in the active language.
 *
 * Shaped as a small engine (respond / greeting / chips / voice + booking text
 * helpers) so a real Claude-backed engine implementing the same contract can be
 * dropped in later without touching the UI. State-changing intents (booking)
 * are returned as a *proposal* — the UI confirms before anything is executed.
 */

import { EVENTS, EXISTING_TEAMS, MAX_PLAYERS, MIN_PLAYERS } from "./data";
import type { Lang } from "./i18n";

/** Actions the assistant can request the app to perform immediately. */
export type PlatformAction = { type: "navigate"; href: string };

/** A complete, ready-to-confirm reservation the assistant proposes. */
export type BookingDraft = {
  eventId: string;
  teamName: string;
  isNewTeam: boolean;
  players: number;
};

export type PlatformTurn = {
  reply: string;
  actions: PlatformAction[];
  /** When present, the UI shows a confirm card instead of acting. */
  propose?: BookingDraft;
};

export type PlatformContext = {
  pathname: string;
  /** Live team names (existing + user-created) for matching. */
  teamNames: string[];
};

/* ------------------------------ parsing ------------------------------ */

const NUM_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  egy: 1, kettő: 2, ketten: 2, három: 3, hárman: 3, négy: 4, négyen: 4, öt: 5, öten: 5,
  hat: 6, hatan: 6, hét: 7, heten: 7, nyolc: 8, nyolcan: 8, kilenc: 9, tíz: 10, tízen: 10,
};

function playersFrom(t: string): number | null {
  const d = t.match(/\b(\d{1,2})\b/);
  if (d) return parseInt(d[1], 10);
  for (const [w, n] of Object.entries(NUM_WORDS))
    if (new RegExp(`\\b${w}\\b`, "u").test(t)) return n;
  return null;
}

function matchEvent(t: string) {
  if (/(a38|lord|ring|ship|lotr|gyűrűk|hajó)/u.test(t)) return EVENTS[0];
  if (/(august|aug|augusztus)/u.test(t)) return EVENTS[2];
  if (/(d[uü]rer|july|garden|kert|július)/u.test(t)) return EVENTS[1];
  return null;
}

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1));

function matchTeam(
  t: string,
  teamNames: string[]
): { name: string; isNew: boolean } | null {
  for (const name of teamNames)
    if (t.includes(name.toLowerCase())) return { name, isNew: false };
  const created = t.match(
    /(?:new team(?:\s+(?:called|named))?|team (?:called|named)|call (?:it|us)|name (?:it|us)|új csapat(?:ot)?(?:,?\s+(?:a\s+)?neve)?)\s*[:]?\s*["'„]?([\wÀ-űÁ-ű'!-]{2,30}?)["'”]?(?:[.,!]|$)/u
  );
  if (created) return { name: titleCase(created[1].trim()), isNew: true };
  return null;
}

function eventLabel(eventId: string, lang: Lang) {
  const e = EVENTS.find((ev) => ev.id === eventId)!;
  return {
    title: lang === "hu" ? e.titleHu : e.title,
    date: lang === "hu" ? e.dateLabelHu : e.dateLabel,
    venue: e.venue,
  };
}

/* ------------------------------ copy ------------------------------ */

const COPY = {
  en: {
    goingTo: (dest: string) => `Sure — taking you to ${dest}.`,
    alreadyHere: "You're already on this page 🙂 — anything you'd like to do here?",
    capabilities:
      "I'm your QuizNight assistant. I can reserve a table for you, get you around — the leaderboard, your team, upcoming quiz nights, badges, news — and explain how things work. Just tell me what you need.",
    free:
      "Every quiz night is **free** to join — you reserve a table, not a ticket. Winners take bar coupons and prizes.",
    scoring:
      "It's a season **championship** played over rounds. Teams collect points each quiz night, and the top teams win bar coupons and prizes — you can see how everyone's doing on the **leaderboard**. *(From the FAQ.)*",
    fallback:
      "I can reserve a table, take you somewhere, or explain how QuizNight works. Try “book the A38 quiz for Dexx, 4 of us”, “go to the leaderboard”, or “how does scoring work?”",
    greeting:
      "Hi Dexter! 👋 I'm your QuizNight assistant. I can reserve a table for you, take you anywhere in the app, or explain how things work. What do you need?",
    voice: "Book the Dürer Garden July quiz for team Dexx, four of us.",
    askEvent:
      "Happy to book that. Which quiz night — **A38 (13 July)**, **Dürer Garden July (28th)**, or **Dürer August (18th)**?",
    askTeam: (teams: string) =>
      `Which team is playing? You can use ${teams} — or tell me a new team name.`,
    propose: "Here's your table — check it over and hit **Confirm**.",
    done: (team: string, venue: string, date: string, n: number) =>
      `Done! 🎉 Table reserved for **${team}** at **${venue}** — ${date}, ${n} player${n > 1 ? "s" : ""}. It's free and it's on your dashboard.`,
    cancelled: "No problem — I've cancelled that. Anything else?",
    undone: "Undone — that reservation's been removed.",
  },
  hu: {
    goingTo: (dest: string) => `Rendben — átviszlek ide: ${dest}.`,
    alreadyHere: "Már ezen az oldalon vagy 🙂 — szeretnél itt valamit csinálni?",
    capabilities:
      "A QuizNight asszisztense vagyok. Lefoglalok neked asztalt, eligazítalak — toplista, csapatod, közelgő kvízestek, jelvények, hírek —, és elmagyarázom a működést. Csak mondd, mire van szükséged.",
    free:
      "Minden kvízest **ingyenes** — asztalt foglalsz, nem jegyet. A győztesek kuponokat és díjakat nyernek.",
    scoring:
      "Ez egy szezonális **bajnokság** fordulókon át. A csapatok pontokat gyűjtenek minden kvízesten, és a legjobbak kuponokat és díjakat nyernek — az állást a **toplistán** nézheted meg. *(A GYIK alapján.)*",
    fallback:
      "Foglalok asztalt, elviszlek valahová, vagy elmagyarázom a QuizNight működését. Próbáld: „foglalj az A38 kvízre a Dexx csapatnak, négyen leszünk”, „vigyél a toplistára”, vagy „hogyan működik a pontozás?”",
    greeting:
      "Szia Dexter! 👋 A QuizNight asszisztense vagyok. Lefoglalok neked asztalt, elviszlek bárhová az appban, vagy elmagyarázom a működést. Miben segíthetek?",
    voice: "Foglalj a Dürer Kert júliusi kvízre a Dexx csapatnak, négyen leszünk.",
    askEvent:
      "Szívesen lefoglalom. Melyik kvízest — **A38 (júl. 13.)**, **Dürer Kert július (28.)** vagy **Dürer augusztus (18.)**?",
    askTeam: (teams: string) =>
      `Melyik csapat játszik? Használhatod: ${teams} — vagy mondj egy új csapatnevet.`,
    propose: "Itt az asztalod — nézd át, és nyomd meg a **Megerősítés** gombot.",
    done: (team: string, venue: string, date: string, n: number) =>
      `Kész! 🎉 Asztal lefoglalva a(z) **${team}** csapatnak — **${venue}**, ${date}, ${n} fő. Ingyenes, és a kezdőlapon megtalálod.`,
    cancelled: "Semmi gond — töröltem. Van még valami?",
    undone: "Visszavontam — a foglalást töröltem.",
  },
};

/* Order matters: more specific intents first. */
const ROUTES: { re: RegExp; href: string; en: string; hu: string }[] = [
  { re: /(leaderboard|top ?list|ranking|standings?|rank\b|toplist[aá]|rangsor|helyez)/u, href: "/leaderboard", en: "the leaderboard", hu: "a toplistára" },
  { re: /(my team|manage.*team|my roster|csapatom|saj[aá]t csapat)/u, href: "/team", en: "your team", hu: "a csapatodhoz" },
  { re: /(other teams|join.*team|find.*team|browse.*teams?|\bteams\b|csapatok|csatlakoz)/u, href: "/teams", en: "the Teams page", hu: "a Csapatok oldalra" },
  { re: /(badge|achievement|jelv[eé]ny|kit[uü]ntet)/u, href: "/badges", en: "your badges", hu: "a Jelvényekhez" },
  { re: /(news|announcement|what.?s new|h[ií]rek?|[uú]jdons[aá]g)/u, href: "/news", en: "the News", hu: "a Hírekhez" },
  { re: /(faq|question|g[yi]ik)/u, href: "/faq", en: "the FAQ", hu: "a GYIK-hez" },
  { re: /(discover|events?|quiz nights?|what.?s on|upcoming|felfedez|esem[eé]ny|k[oö]zelg)/u, href: "/discover", en: "Discover", hu: "a Felfedezéshez" },
  { re: /(dashboard|home\b|kezd[oő]|f[oő]oldal)/u, href: "/", en: "your dashboard", hu: "a kezdőlapra" },
];

/* ------------------------------ respond ------------------------------ */

export function platformRespond(
  message: string,
  ctx: PlatformContext,
  lang: Lang = "en"
): PlatformTurn {
  const t = message.toLowerCase();
  const c = COPY[lang];

  const ev = matchEvent(t);
  const team = matchTeam(t, ctx.teamNames);
  const players = playersFrom(t);
  const bookingVerb = /(book|reserve|table|foglal|asztal)/u.test(t);
  const howTo = /(how.*(reserve|book|table|work)|hogyan|how do i)/u.test(t);

  // Booking intent (but not a "how do I…" question — that's answered, not acted on)
  const bookingIntent = !howTo && (bookingVerb || !!ev || !!team || players !== null);
  if (bookingIntent) {
    if (!ev) return { reply: c.askEvent, actions: [] };
    if (!team) {
      const names = ctx.teamNames.map((n) => `**${n}**`).join(", ") || "**Dexx**";
      return { reply: c.askTeam(names), actions: [] };
    }
    const p = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, players ?? 4));
    return {
      reply: c.propose,
      actions: [],
      propose: { eventId: ev.id, teamName: team.name, isNewTeam: team.isNew, players: p },
    };
  }

  // Navigation intents
  for (const r of ROUTES) {
    if (!r.re.test(t)) continue;
    if (ctx.pathname === r.href) return { reply: c.alreadyHere, actions: [] };
    const dest = lang === "hu" ? r.hu : r.en;
    return { reply: c.goingTo(dest), actions: [{ type: "navigate", href: r.href }] };
  }

  if (/(what can you|who are you|help\b|mit tudsz|ki vagy|miben seg)/u.test(t))
    return { reply: c.capabilities, actions: [] };
  if (/(free|cost|price|pay|ingyen|[aá]r\b|mennyibe|fizet)/u.test(t))
    return { reply: c.free, actions: [] };
  if (/(scor|points?|championship|round|season|pont|bajnok|fordul[oó]|szezon)/u.test(t))
    return { reply: c.scoring, actions: [] };

  return { reply: c.fallback, actions: [] };
}

/* ------------------------- booking text helpers ------------------------- */

export function bookingDoneText(d: BookingDraft, lang: Lang): string {
  const { date, venue } = eventLabel(d.eventId, lang);
  return COPY[lang].done(d.teamName, venue, date, d.players);
}
export function bookingCancelledText(lang: Lang): string {
  return COPY[lang].cancelled;
}
export function bookingUndoneText(lang: Lang): string {
  return COPY[lang].undone;
}

/* ------------------------------ misc ------------------------------ */

export function platformGreeting(lang: Lang): string {
  return COPY[lang].greeting;
}
export function platformVoiceUtterance(lang: Lang): string {
  return COPY[lang].voice;
}

export function platformChips(pathname: string, lang: Lang): string[] {
  const byPage: Record<Lang, Record<string, string[]>> = {
    en: {
      default: ["Book a table", "Go to the leaderboard", "Show upcoming quiz nights"],
      "/": ["Book a table for Dexx", "Show upcoming quiz nights", "Go to the leaderboard"],
      "/reserve": ["Book the A38 quiz for Dexx, 4 of us", "Dürer Garden July for Dexx"],
      "/discover": ["Book the A38 quiz for Dexx, 4 of us", "How does scoring work?"],
      "/team": ["Go to the Teams page", "Book a table"],
      "/teams": ["Go to my team", "Book a table"],
      "/leaderboard": ["How does scoring work?", "Book a table"],
      "/badges": ["How does scoring work?", "Book a table"],
      "/faq": ["Book a table", "Go to the leaderboard"],
    },
    hu: {
      default: ["Foglalj asztalt", "Vigyél a toplistára", "Mutasd a közelgő kvízesteket"],
      "/": ["Foglalj asztalt a Dexxnek", "Mutasd a közelgő kvízesteket", "Vigyél a toplistára"],
      "/reserve": ["Foglalj az A38 kvízre a Dexxnek, négyen", "Dürer Kert július a Dexxnek"],
      "/discover": ["Foglalj az A38 kvízre a Dexxnek, négyen", "Hogyan működik a pontozás?"],
      "/team": ["Nyisd meg a Csapatok oldalt", "Foglalj asztalt"],
      "/teams": ["Vigyél a csapatomhoz", "Foglalj asztalt"],
      "/leaderboard": ["Hogyan működik a pontozás?", "Foglalj asztalt"],
      "/badges": ["Hogyan működik a pontozás?", "Foglalj asztalt"],
      "/faq": ["Foglalj asztalt", "Vigyél a toplistára"],
    },
  };
  const map = byPage[lang];
  return map[pathname] ?? map.default;
}
