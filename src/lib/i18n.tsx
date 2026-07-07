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
    assistantName: "Rio",
    assistantSub: "Your Quiz Night partner",
    chat: "Chat",
    voice: "Voice",
    inputPlaceholder: 'e.g. "Book Dürer July for Dexx, 4 of us"',
    listening: "Listening…",
    pressMic: "Press the mic and ask for your booking",
    voiceNote:
      "Voice is simulated in this demo — pressing the mic “hears” a sample request for the current step.",
    closeAssistant: "Close assistant",
    close: "Close",
    openAssistant: "Open assistant",
    assistantPlaceholder: 'Ask anything — e.g. “take me to the leaderboard”',
    assistantVoicePrompt: "Press the mic and ask",
    assistantVoiceNote:
      "Voice is simulated in this demo — pressing the mic “hears” a sample question.",
    reviewBooking: "Review your booking",
    assistantConfirm: "Confirm",
    assistantWillCreate: "I'll create this team first.",
    booked: "Table booked",
    undo: "Undo",
    aiNudge: "In a hurry? Ask me to book it — try",
    aiNudgeExample: "“Book the A38 quiz for Dexx, 4 of us.”",
    aiNudgeDismiss: "Dismiss",
    send: "Send message",
    langReviewNote: "",
    // sidebar nav (labels mirror the live app)
    navHome: "Home",
    navUniqueEvents: "Unique events",
    navNews: "News",
    navProfile: "Profile",
    navOrders: "Orders / Reservations",
    navMyTeam: "My team & All teams",
    navTeams: "Teams",
    navProducts: "Products",
    navEvents: "Discover",
    navBadges: "Badges",
    navQuestion: "Submit a question",
    navPoints: "Point top-up",
    navLeaderboard: "Leaderboard",
    navFaq: "FAQ",
    logout: "Logout",
    soon: "soon",
    menu: "Menu",
    // roles + hosting
    rolePlaying: "Playing",
    roleHosting: "Hosting",
    navHostGames: "Events",
    navHostCreate: "Create game",
    hostTitle: "Events",
    hostSub: "Games you're hosting — set one up and invite teams to register.",
    hostEmpty: "No games yet. Set up your first quiz night and invite teams.",
    hostCreateCta: "Host a quiz night",
    hostFlow1: "Set up your event",
    hostFlow2: "Invite teams",
    hostFlow3: "Track registrations",
    hostTeamsRegistered: "teams",
    hostHomeTitle: "Your hosting",
    hostHomeSub: "An overview of the games you're hosting.",
    statGamesHosted: "Games hosted",
    statTeamsRegistered: "Teams registered",
    seeAllEvents: "See all events",
    createGameCardSub: "Set up an event and invite teams.",
    createGameTitle: "Host a quiz night",
    createGameSub: "Set up the event — you'll get a link and QR to invite teams.",
    gameNameLabel: "Game name",
    gameNamePlaceholder: "e.g. Monday Night Quiz",
    gameLocationLabel: "Location",
    gameLocationPlaceholder: "Venue, city",
    gameDescLabel: "Description",
    gameDescPlaceholder: "What's the night about — prizes, rounds, rules…",
    createGameBtn: "Create game",
    gameNotFound: "Game not found.",
    gameRegLink: "Registration link",
    gameShareHint:
      "Share this link or QR — team captains open it to register their team.",
    copyLink: "Copy link",
    copied: "Copied ✓",
    printQr: "Print QR",
    registeredTeams: "Registered teams",
    noTeamsYet: "No teams have registered yet — share the link above to get started.",
    addTeamManually: "Add a team",
    captainNameLabel: "Captain's name",
    teamSizeLabel: "Team size",
    makeCaptain: "Make captain",
    inviteByEmail: "Invite by email",
    emailPlaceholder: "teammate@email.com",
    sendInvite: "Invite",
    teamInviteLink: "Team invite link",
    teamInviteHint: "Teammates open this to join — or scan the QR.",
    gsName: "Name",
    gsLocation: "Location",
    gsDetails: "Details",
    gsReview: "Review",
    qgName: "What's your quiz night called?",
    qgNameSub: "Give it a name teams will recognise.",
    qgLocation: "Where's it happening?",
    qgLocationSub: "Venue and city — teams see this on the invite.",
    qgDetails: "What should teams know?",
    qgDetailsSub: "Prizes, rounds, rules — anything that helps them show up ready. Optional.",
    gameReviewTitle: "Ready to publish?",
    gameReviewSub: "Create the game and you'll get a link + QR to invite teams.",
    // my team page
    teamTitle: "My team",
    teamSub: "Manage your teams — members, badges and reservations.",
    members: "Members",
    captain: "captain",
    activeMember: "active",
    teamReservations: "This team's reservations",
    noTeamReservations: "No reservations yet — reserve a table for the next quiz night.",
    addMember: "Add member",
    memberPlaceholder: "Teammate's name or email",
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
    // combined teams hub
    teamsHubTitle: "Teams",
    teamsHubSub: "Manage your own teams, or find others to join.",
    tabMyTeam: "My team",
    tabAllTeams: "All teams",
    teamsWord: "teams",
    // leaderboard page
    lbTitle: "Leaderboard",
    lbSub: "17th Championship · offline standings, as on quiznight.hu.",
    lbRank: "Rank",
    lbTeam: "Team",
    lbNoBadges: "Without badges",
    lbBadges: "Badges",
    lbTotal: "Total",
    lbSearch: "Search a team…",
    lbSort: "Sort by",
    lbSortTotal: "Total",
    lbSortBase: "Base",
    lbSortBadges: "Badges",
    lbNoMatches: "No teams match your search.",
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
    assistantName: "Rio",
    assistantSub: "A QuizNight-partnered",
    chat: "Chat",
    voice: "Hang",
    inputPlaceholder: 'pl. „Foglalj a Dexx csapatnak a Dürerbe, négyen leszünk”',
    listening: "Hallgatlak…",
    pressMic: "Nyomd meg a mikrofont és mondd el a foglalást",
    voiceNote:
      "A hang ebben a demóban szimulált — a mikrofon egy mintakérést „hall” az aktuális lépéshez.",
    closeAssistant: "Asszisztens bezárása",
    close: "Bezárás",
    openAssistant: "Asszisztens megnyitása",
    assistantPlaceholder: 'Kérdezz bármit — pl. „vigyél a toplistára”',
    assistantVoicePrompt: "Nyomd meg a mikrofont és kérdezz",
    assistantVoiceNote:
      "A hang ebben a demóban szimulált — a mikrofon egy mintakérdést „hall”.",
    reviewBooking: "Foglalás áttekintése",
    assistantConfirm: "Megerősítés",
    assistantWillCreate: "Előbb létrehozom ezt a csapatot.",
    booked: "Asztal lefoglalva",
    undo: "Visszavonás",
    aiNudge: "Sietsz? Kérd, hogy foglaljam le — próbáld:",
    aiNudgeExample: "„Foglalj az A38 kvízre a Dexxnek, négyen leszünk.”",
    aiNudgeDismiss: "Elvetés",
    send: "Üzenet küldése",
    langReviewNote: "A magyar szövegek demó célra készültek.",
    // sidebar nav (labels mirror the live app)
    navHome: "Főoldal",
    navUniqueEvents: "Egyedi események",
    navNews: "Hírek",
    navProfile: "Profil",
    navOrders: "Rendelések / Foglalások",
    navMyTeam: "Csapatom és az összes",
    navTeams: "Csapatok",
    navProducts: "Termékek",
    navEvents: "Felfedezés",
    navBadges: "Jelvények",
    navQuestion: "Kérdés beküldése",
    navPoints: "Pont feltöltés",
    navLeaderboard: "Ranglista",
    navFaq: "Gyakori kérdések",
    logout: "Kijelentkezés",
    soon: "hamarosan",
    menu: "Menü",
    // roles + hosting
    rolePlaying: "Játék",
    roleHosting: "Szervezés",
    navHostGames: "Események",
    navHostCreate: "Új játék",
    hostTitle: "Események",
    hostSub: "Az általad szervezett játékok — hozz létre egyet, és hívd meg a csapatokat.",
    hostEmpty: "Még nincs játék. Hozd létre az első kvízestet, és hívd meg a csapatokat.",
    hostCreateCta: "Kvízest szervezése",
    hostFlow1: "Állítsd be az eseményt",
    hostFlow2: "Hívd meg a csapatokat",
    hostFlow3: "Kövesd a regisztrációkat",
    hostTeamsRegistered: "csapat",
    hostHomeTitle: "Szervezésed",
    hostHomeSub: "Áttekintés az általad szervezett játékokról.",
    statGamesHosted: "Szervezett játékok",
    statTeamsRegistered: "Regisztrált csapatok",
    seeAllEvents: "Összes esemény",
    createGameCardSub: "Állíts be egy eseményt, és hívd meg a csapatokat.",
    createGameTitle: "Kvízest szervezése",
    createGameSub: "Állítsd be az eseményt — kapsz egy linket és QR-kódot a csapatok meghívásához.",
    gameNameLabel: "Játék neve",
    gameNamePlaceholder: "pl. Hétfő esti kvíz",
    gameLocationLabel: "Helyszín",
    gameLocationPlaceholder: "Helyszín, város",
    gameDescLabel: "Leírás",
    gameDescPlaceholder: "Miről szól az est — díjak, fordulók, szabályok…",
    createGameBtn: "Játék létrehozása",
    gameNotFound: "A játék nem található.",
    gameRegLink: "Regisztrációs link",
    gameShareHint:
      "Oszd meg ezt a linket vagy QR-kódot — a kapitányok ezen regisztrálják a csapatukat.",
    copyLink: "Link másolása",
    copied: "Másolva ✓",
    printQr: "QR nyomtatása",
    registeredTeams: "Regisztrált csapatok",
    noTeamsYet: "Még nem regisztrált csapat — oszd meg a fenti linket a kezdéshez.",
    addTeamManually: "Csapat hozzáadása",
    captainNameLabel: "Kapitány neve",
    teamSizeLabel: "Csapatméret",
    makeCaptain: "Kapitánnyá tesz",
    inviteByEmail: "Meghívás e-mailben",
    emailPlaceholder: "csapattars@email.com",
    sendInvite: "Meghívás",
    teamInviteLink: "Csapat meghívó link",
    teamInviteHint: "A csapattársak ezen csatlakoznak — vagy szkenneljék a QR-t.",
    gsName: "Név",
    gsLocation: "Helyszín",
    gsDetails: "Részletek",
    gsReview: "Áttekintés",
    qgName: "Mi a kvízest neve?",
    qgNameSub: "Adj neki nevet, amit a csapatok felismernek.",
    qgLocation: "Hol lesz?",
    qgLocationSub: "Helyszín és város — ezt látják a csapatok a meghívón.",
    qgDetails: "Mit tudjanak a csapatok?",
    qgDetailsSub: "Díjak, fordulók, szabályok — bármi, ami segít felkészülten érkezni. Nem kötelező.",
    gameReviewTitle: "Közzéteszed?",
    gameReviewSub: "Hozd létre a játékot, és kapsz egy linket + QR-t a csapatok meghívásához.",
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
    memberPlaceholder: "Csapattárs neve vagy e-mailje",
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
    // combined teams hub
    teamsHubTitle: "Csapatok",
    teamsHubSub: "Kezeld a saját csapataidat, vagy találj továbbiakat a csatlakozáshoz.",
    tabMyTeam: "Csapatom",
    tabAllTeams: "Összes csapat",
    teamsWord: "csapat",
    // leaderboard page
    lbTitle: "Ranglista",
    lbSub: "17. Bajnokság · offline állás, ahogy a quiznight.hu-n.",
    lbRank: "Helyezés",
    lbTeam: "Csapat",
    lbNoBadges: "Jelvények nélkül",
    lbBadges: "Jelvények",
    lbTotal: "Összesen",
    lbSearch: "Csapat keresése…",
    lbSort: "Rendezés",
    lbSortTotal: "Összes",
    lbSortBase: "Alap",
    lbSortBadges: "Jelvények",
    lbNoMatches: "Nincs a keresésnek megfelelő csapat.",
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
