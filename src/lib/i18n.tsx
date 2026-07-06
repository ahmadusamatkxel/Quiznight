"use client";

/**
 * Lightweight EN/HU i18n for the prototype — part of the globalization vision.
 * HU strings reuse quiznight.hu's own vocabulary (Csapat, Létszám, Foglalás…).
 * NOTE: Hungarian copy is drafted for the demo — have a native speaker review.
 */

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "hu";

const STRINGS = {
  en: {
    // dashboard
    greeting: "Hi, Dexter!",
    dashTitle: "Your quiz nights",
    dashSub: "Reserved tables for Dexter's teams — upcoming games at a glance.",
    emptyTitle1: "No quiz nights booked",
    emptyTitleAccent: "yet",
    emptySub:
      "Pick an event, bring your team, and your reserved tables will show up here.",
    reserveCta: "Reserve a table",
    reserveAnother: "Reserve another table",
    resetDemo: "Reset demo data",
    upcoming: "Upcoming events",
    reserved: "Reserved",
    freeEntry: "Free entry",
    players: "players",
    player: "player",
    free: "Free",
    // flow chrome
    back: "Back",
    aiAssist: "AI assist",
    stepEvent: "Event",
    stepTeam: "Team",
    stepPlayers: "Players",
    stepReview: "Review",
    continue: "Continue",
    pressEnter: "press",
    signedInAs: "Signed in as",
    // discover page
    discoverTitle: "Discover events",
    discoverSub:
      "Browse the upcoming quiz nights near you and reserve your table — every game is free to join.",
    discoverAvailable: "Available quiz nights",
    // reserve hero
    heroTitle1: "Reserve your table",
    heroTitleAccent: "in under a minute",
    heroSub:
      "Monday-night pub quiz, played in teams. Free entry — the winners take bar coupons and prizes.",
    heroBringTeam: "Bring your team",
    // step 1
    q1: "Which quiz night are you joining?",
    q1Sub: "All upcoming events are free — you reserve a table, not a ticket.",
    // step 2
    q2: "Who's playing?",
    q2Sub:
      "Use one of your teams, or start a new one — we'll create it with this reservation.",
    yourTeam: "your team",
    createTeam: "Create a new team",
    createTeamSub: "Pick a name — that's all a team needs.",
    newTeamLabel: "New team name",
    newTeamPlaceholder: "e.g. The Quizzly Bears",
    useIt: "Use it",
    teamCreatedNote: "The team is created when you reserve — no separate setup.",
    // step 3
    q3: "How many players?",
    q3Sub:
      "So the venue can size your table. You can always squeeze in one more on the night.",
    fewer: "Fewer players",
    more: "More players",
    yourTeamFallback: "Your team",
    team: "Team",
    // step 4
    q4: "Everything look right?",
    q4Sub: "Free event — confirming reserves the table, nothing to pay.",
    event: "Event",
    quizmaster: "Quizmaster",
    price: "Price",
    priceFree: "0 Ft — free",
    newBadge: "new",
    reserveFree: "Reserve table — free",
    // done
    doneTitle: (team: string) => `Table reserved, ${team}! 🎉`,
    doneSub: (venue: string, date: string) =>
      `See you at ${venue} — ${date}. Your reservation is on the dashboard.`,
    backToDash: "Back to dashboard",
    // drawer
    assistantName: "Quiz Assistant",
    assistantSub: "Demo — scripted responses",
    chat: "Chat",
    voice: "Voice",
    inputPlaceholder: 'e.g. "Book Dürer July for Dexx, 4 of us"',
    listening: "Listening…",
    pressMic: "Press the mic and ask for your booking",
    voiceNote:
      "Voice is simulated in this demo — pressing the mic “hears” a sample request for the current step.",
    closeAssistant: "Close assistant",
    send: "Send message",
    langReviewNote: "",
    // sidebar nav (labels mirror the live app)
    navHome: "Home",
    navUniqueEvents: "Unique events",
    navNews: "News",
    navProfile: "Profile",
    navOrders: "Orders / Reservations",
    navMyTeam: "My team",
    navTeams: "Teams",
    navProducts: "Products",
    navEvents: "Discover",
    navBadges: "Badges",
    navQuestion: "Submit a question",
    navPoints: "Point top-up",
    navLeaderboard: "Top list",
    navFaq: "FAQ",
    logout: "Logout",
    soon: "soon",
    menu: "Menu",
    // my team page
    teamTitle: "My team",
    teamSub: "Manage your teams — members, badges and reservations.",
    members: "Members",
    captain: "captain",
    activeMember: "active",
    teamReservations: "This team's reservations",
    noTeamReservations: "No reservations yet — reserve a table for the next quiz night.",
    addMember: "Add member",
    memberPlaceholder: "Teammate's name",
    removeMember: "Remove member",
    pendingMember: "invited",
    renameTeam: "Rename team",
    deleteTeam: "Delete team",
    deleteConfirm: "Delete this team? This can't be undone.",
    confirmDelete: "Yes, delete",
    cancel: "Cancel",
    save: "Save",
    noTeams: "No team yet — create one below.",
    // teams page
    teamsTitle: "Teams",
    teamsSub: "Playing without hosting a table? Find your crew and ask to join.",
    searchTeams: "Search teams…",
    requestJoin: "Request to join",
    requested: "Requested ✓",
    yourTeamBadge: "your team",
    // leaderboard page
    lbTitle: "Top list",
    lbSub: "17th Championship · offline standings, as on quiznight.hu.",
    lbRank: "Rank",
    lbTeam: "Team",
    lbNoBadges: "Without badges",
    lbBadges: "Badges",
    lbTotal: "Total",
    // news page
    newsTitle: "News",
    newsSub: "Championship updates from the QuizNight crew.",
    // badges page
    badgesTitle: "Badges",
    badgesSub:
      "Teams collect badges at themed rounds — they add points to the championship total.",
    notEarned: "Not earned yet",
    badgeArtNote: "Badge artwork from quiznight.hu.",
    // faq page
    faqTitle: "Frequently asked questions",
    faqSub: "The questions asked most before a first quiz night.",
    faqCopyNote: "Answer copy is being ported from quiznight.hu/faq.",
    // homepage extras
    winnersTitle: "Previous round winners",
    winnersSub: "The teams that topped Round 25 of the 17th Championship.",
    points: "points",
    prevWinner: "Previous winner",
    nextWinner: "Next winner",
    whatTitle: "New to QuizNight?",
    whatSub: "Here's how Monday nights work.",
    whatIsTitle: "What is QuizNight?",
    whatIsBody:
      "QuizNight is Hungary's take on the pub quiz — teams (not solo players) go head to head over trivia, every week in bars, cafés and pubs. We started in 2009 and today run the most games, in the most venues, of any Hungarian-language quiz.",
    champTitle: "What's the championship?",
    champBody:
      "Every Monday game is a round. Points add up week by week from September to May, teams collect badges, and the May finals crown the season's champion.",
    reserveStepTitle: "How to join",
    reserveStepBody:
      "Pick a quiz night, bring (or create) your team, reserve a table. It's free — you reserve a seat, not a ticket.",
    // footer
    footerTerms: "General Terms and Conditions",
    footerPrivacy: "Data Protection Notice",
    footerCredit:
      "This prototype reproduces the QuizNight experience for demo purposes.",
    footerSupport:
      "The website was created within the framework and with the support of the Demján Sándor Program.",
  },
  hu: {
    greeting: "Üdv, Dexter!",
    dashTitle: "Kvízestjeid",
    dashSub: "Lefoglalt asztalok Dexter csapatainak — a közelgő játékok egy helyen.",
    emptyTitle1: "Még nincs lefoglalt",
    emptyTitleAccent: "kvízest",
    emptySub:
      "Válassz eseményt, hozd a csapatod, és a lefoglalt asztalaid itt jelennek meg.",
    reserveCta: "Asztalfoglalás",
    reserveAnother: "Új asztal foglalása",
    resetDemo: "Demó adatok törlése",
    upcoming: "Közelgő események",
    reserved: "Lefoglalva",
    freeEntry: "Ingyenes belépés",
    players: "játékos",
    player: "játékos",
    free: "Ingyenes",
    back: "Vissza",
    aiAssist: "AI segéd",
    stepEvent: "Esemény",
    stepTeam: "Csapat",
    stepPlayers: "Létszám",
    stepReview: "Áttekintés",
    continue: "Tovább",
    pressEnter: "nyomj",
    signedInAs: "Bejelentkezve:",
    discoverTitle: "Események felfedezése",
    discoverSub:
      "Böngészd a közelgő kvízesteket a környékeden, és foglalj asztalt — minden játék ingyenes.",
    discoverAvailable: "Elérhető kvízestek",
    heroTitle1: "Foglalj asztalt",
    heroTitleAccent: "egy percen belül",
    heroSub:
      "Hétfő esti kocsmakvíz, csapatokban. A belépés ingyenes — a győztesek kuponokat és díjakat visznek.",
    heroBringTeam: "Hozd a csapatod",
    q1: "Melyik kvízestre jöttök?",
    q1Sub: "Minden közelgő esemény ingyenes — asztalt foglalsz, nem jegyet.",
    q2: "Ki játszik?",
    q2Sub:
      "Válaszd az egyik csapatod, vagy indíts újat — a foglalással együtt létrehozzuk.",
    yourTeam: "a csapatod",
    createTeam: "Új csapat létrehozása",
    createTeamSub: "Csak egy név kell — ennyi az egész.",
    newTeamLabel: "Új csapat neve",
    newTeamPlaceholder: "pl. Kvízmesterek",
    useIt: "Mehet",
    teamCreatedNote: "A csapat a foglaláskor jön létre — nincs külön beállítás.",
    q3: "Hányan lesztek?",
    q3Sub:
      "Hogy a helyszín méretezni tudja az asztalt. A helyszínen még egy fő mindig befér.",
    fewer: "Kevesebb játékos",
    more: "Több játékos",
    yourTeamFallback: "A csapatod",
    team: "Csapat",
    q4: "Minden stimmel?",
    q4Sub: "Ingyenes esemény — a megerősítés lefoglalja az asztalt, fizetni nem kell.",
    event: "Esemény",
    quizmaster: "Quizmester",
    price: "Ár",
    priceFree: "0 Ft — ingyenes",
    newBadge: "új",
    reserveFree: "Asztalfoglalás — ingyenes",
    doneTitle: (team: string) => `Asztal lefoglalva, ${team}! 🎉`,
    doneSub: (venue: string, date: string) =>
      `Találkozunk itt: ${venue} — ${date}. A foglalásod a kezdőlapon találod.`,
    backToDash: "Vissza a kezdőlapra",
    assistantName: "Kvíz Asszisztens",
    assistantSub: "Demó — előre írt válaszok",
    chat: "Chat",
    voice: "Hang",
    inputPlaceholder: 'pl. „Foglalj a Dexx csapatnak a Dürerbe, négyen leszünk”',
    listening: "Hallgatlak…",
    pressMic: "Nyomd meg a mikrofont és mondd el a foglalást",
    voiceNote:
      "A hang ebben a demóban szimulált — a mikrofon egy mintakérést „hall” az aktuális lépéshez.",
    closeAssistant: "Asszisztens bezárása",
    send: "Üzenet küldése",
    langReviewNote: "A magyar szövegek demó célra készültek.",
    // sidebar nav (labels mirror the live app)
    navHome: "Főoldal",
    navUniqueEvents: "Egyedi események",
    navNews: "Hírek",
    navProfile: "Profil",
    navOrders: "Rendelések / Foglalások",
    navMyTeam: "Csapatom",
    navTeams: "Csapatok",
    navProducts: "Termékek",
    navEvents: "Felfedezés",
    navBadges: "Jelvények",
    navQuestion: "Kérdés beküldése",
    navPoints: "Pont feltöltés",
    navLeaderboard: "Toplista",
    navFaq: "Gyakori kérdések",
    logout: "Kijelentkezés",
    soon: "hamarosan",
    menu: "Menü",
    // my team page
    teamTitle: "Csapatom",
    teamSub: "Kezeld a csapataid — tagok, jelvények és foglalások.",
    members: "Csapattagok",
    captain: "kapitány",
    activeMember: "aktív",
    teamReservations: "A csapat foglalásai",
    noTeamReservations:
      "Még nincs foglalás — foglalj asztalt a következő kvízestre.",
    addMember: "Tag hozzáadása",
    memberPlaceholder: "Csapattárs neve",
    removeMember: "Tag eltávolítása",
    pendingMember: "meghívva",
    renameTeam: "Csapat átnevezése",
    deleteTeam: "Csapat törlése",
    deleteConfirm: "Biztosan törlöd a csapatot? Ez nem visszavonható.",
    confirmDelete: "Igen, törlöm",
    cancel: "Mégse",
    save: "Mentés",
    noTeams: "Még nincs csapatod — hozz létre egyet lent.",
    // teams page
    teamsTitle: "Csapatok",
    teamsSub: "Nem te szervezed az asztalt? Keresd meg a csapatod és kérj csatlakozást.",
    searchTeams: "Csapat keresése…",
    requestJoin: "Csatlakozási kérelem",
    requested: "Elküldve ✓",
    yourTeamBadge: "a csapatod",
    // leaderboard page
    lbTitle: "Toplista",
    lbSub: "17. Bajnokság · offline állás, ahogy a quiznight.hu-n.",
    lbRank: "Helyezés",
    lbTeam: "Csapat",
    lbNoBadges: "Jelvények nélkül",
    lbBadges: "Jelvények",
    lbTotal: "Összesen",
    // news page
    newsTitle: "Hírek",
    newsSub: "Bajnoksági hírek a QuizNight csapatától.",
    // badges page
    badgesTitle: "Jelvények",
    badgesSub:
      "A csapatok tematikus fordulókon gyűjtenek jelvényeket — ezek pontot érnek a bajnokságban.",
    notEarned: "Még nincs megszerezve",
    badgeArtNote: "A jelvénygrafikák a quiznight.hu-ról származnak.",
    // faq page
    faqTitle: "Gyakran ismételt kérdések",
    faqSub: "A leggyakoribb kérdések az első kvízest előtt.",
    faqCopyNote: "A válaszok szövege a quiznight.hu/faq oldalról kerül átemelésre.",
    // homepage extras
    winnersTitle: "Előző forduló nyertesei",
    winnersSub: "A 17. Bajnokság 25. fordulójának legjobb csapatai.",
    points: "pont",
    prevWinner: "Előző nyertes",
    nextWinner: "Következő nyertes",
    whatTitle: "Új vagy a QuizNighton?",
    whatSub: "Így működnek a hétfő esték.",
    whatIsTitle: "Mi az a QuizNight?",
    whatIsBody:
      "A QuizNight a kocsmakvíz magyar változata — csapatok (nem egyéni játékosok) mérkőznek meg a kérdéseken, minden héten bárokban, kávézókban és kocsmákban. 2009 óta működünk, és ma a legtöbb játékot tartjuk, a legtöbb helyszínen, az összes magyar nyelvű kvíz közül.",
    champTitle: "Mi az a bajnokság?",
    champBody:
      "Minden hétfői játék egy forduló. A pontok hétről hétre gyűlnek szeptembertől májusig, a csapatok jelvényeket gyűjtenek, és a májusi döntő koronázza meg a szezon bajnokát.",
    reserveStepTitle: "Hogyan csatlakozz",
    reserveStepBody:
      "Válassz kvízestet, hozd (vagy hozd létre) a csapatod, foglalj asztalt. Ingyenes — helyet foglalsz, nem jegyet.",
    // footer
    footerTerms: "Általános Szerződési Feltételek",
    footerPrivacy: "Adatkezelési Tájékoztató",
    footerCredit:
      "Ez a prototípus a QuizNight élményét reprodukálja demó célból.",
    footerSupport:
      "A weboldal a Demján Sándor Program keretében és támogatásával valósult meg.",
  },
} as const;

export type Strings = (typeof STRINGS)["en"];

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
};

const Ctx = createContext<LangCtx | null>(null);
const LS_KEY = "quiznight-prototype-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === "hu" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LS_KEY, l);
  };

  return (
    <Ctx.Provider value={{ lang, setLang, t: STRINGS[lang] as Strings }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}

export function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className={`pill flex overflow-hidden border text-xs font-bold ${
        dark ? "border-white/25" : "border-line"
      }`}
    >
      {(["en", "hu"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`cursor-pointer px-3 py-1.5 uppercase transition-colors ${
            lang === l
              ? "bg-primary text-white"
              : dark
                ? "text-white/60 hover:text-white"
                : "text-muted hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
