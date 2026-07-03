/**
 * Data mirrored from quiznight.hu (July 2026) — no invented content.
 * Event names/venues/prizes as shown on the live events page (EN translation).
 */

export type QuizEvent = {
  id: string;
  title: string;
  titleHu: string;
  date: string; // ISO
  dateLabel: string;
  dateLabelHu: string;
  venue: string;
  address: string;
  city: string;
  quizmaster?: string;
  priceFt: number;
  description: string;
  descriptionHu: string;
  accent: "purple" | "mint" | "coral";
};

export const evTitle = (e: QuizEvent, lang: "en" | "hu") =>
  lang === "hu" ? e.titleHu : e.title;
export const evDesc = (e: QuizEvent, lang: "en" | "hu") =>
  lang === "hu" ? e.descriptionHu : e.description;
export const evDate = (e: QuizEvent, lang: "en" | "hu") =>
  lang === "hu" ? e.dateLabelHu : e.dateLabel;

export const EVENTS: QuizEvent[] = [
  {
    id: "a38-lotr-2026-07",
    title: "Lord of the Rings quiz on the A38 ship!",
    titleHu: "Gyűrűk ura quiz az A38 hajón!",
    date: "2026-07-13T22:00:00+02:00",
    dateLabel: "Mon, 13 July · 22:00",
    dateLabelHu: "júl. 13., hétfő · 22:00",
    venue: "A38",
    address: "A38 ship, Petőfi bridge (Buda side)",
    city: "Budapest",
    priceFt: 0,
    description:
      "Lord of the Rings quiz on the A38 ship for free, with huge prizes!",
    descriptionHu:
      "Gyűrűk Ura quiz az A38 hajón ingyenesen, óriási nyereményekért!",
    accent: "coral",
  },
  {
    id: "durer-2026-07",
    title: "Dürer Garden — July 2026",
    titleHu: "Dürer Kert — Július 2026",
    date: "2026-07-28T23:00:00+02:00",
    dateLabel: "Tue, 28 July · 23:00",
    dateLabelHu: "júl. 28., kedd · 23:00",
    venue: "Dürer Kert",
    address: "Öböl utca 1, 1117 Budapest",
    city: "Budapest",
    quizmaster: "Bartha Álmos",
    priceFt: 0,
    description:
      "The teams that collect the most points win: 🥉 10,000 Ft · 🥈 15,000 Ft · 🥇 25,000 Ft bar coupons + Kalumba gin and a craft-beer selection. Come play!",
    descriptionHu:
      "A legtöbb pontot gyűjtő csapatokat ezekkel a díjakkal jutalmazzuk: 🥉 10’000 Ft kupon 🥈 15’000 Ft kupon 🥇 25’000 Ft kupon + Kalumba gin ⚡ Kézműves sörválogatás! Gyertek játszani!!!",
    accent: "purple",
  },
  {
    id: "durer-2026-08",
    title: "Dürer Garden — August 2026",
    titleHu: "Dürer Kert — Augusztus 2026",
    date: "2026-08-18T23:00:00+02:00",
    dateLabel: "Tue, 18 Aug · 23:00",
    dateLabelHu: "aug. 18., kedd · 23:00",
    venue: "Dürer Kert",
    address: "Öböl utca 1, 1117 Budapest",
    city: "Budapest",
    quizmaster: "Bartha Álmos",
    priceFt: 0,
    description:
      "The teams that collect the most points win: 🥉 10,000 Ft · 🥈 15,000 Ft · 🥇 25,000 Ft bar coupons + Kalumba gin and a craft-beer selection. Come play!",
    descriptionHu:
      "A legtöbb pontot gyűjtő csapatokat ezekkel a díjakkal jutalmazzuk: 🥉 10’000 Ft kupon 🥈 15’000 Ft kupon 🥇 25’000 Ft kupon + Kalumba gin ⚡ Kézműves sörválogatás! Gyertek játszani!!!",
    accent: "mint",
  },
];

export const USER = {
  firstName: "Dexter",
  greeting: "Hi, Dexter!",
};

export type TeamMember = {
  name: string;
  role: "captain" | "member";
  status: "active" | "pending";
};

export type Team = {
  id: string;
  name: string;
  members: TeamMember[];
};

/** Existing team on this account (as on quiznight.hu /team) */
export const EXISTING_TEAMS: Team[] = [
  {
    id: "dexx",
    name: "Dexx",
    members: [{ name: "Legal Dexter", role: "captain", status: "active" }],
  },
];

export const MAX_PLAYERS = 10;
export const MIN_PLAYERS = 1;

/**
 * Previous round winners — team, points, championship round + venue and photo.
 * Sourced from quiznight.hu homepage carousel (17th Championship, Round 25).
 * Only teams with confirmed points + venue from the live site are included.
 */
export const WINNERS = [
  { team: "Logi Team", points: 54, round: "Round 25", venue: "Aranyhomok kávézó", photo: "/winners/logi-team.jpg" },
  { team: "Gyalog Galopp", points: 51, round: "Round 25", venue: "Malom Látogatóközpont", photo: "/winners/gyalog-galopp.jpg" },
  { team: "Archibaldus", points: 51, round: "Round 25", venue: "Mixát udvar", photo: "/winners/archibaldus.jpg" },
  { team: "Debreczeny Párosch", points: 49.5, round: "Round 25", venue: "Incognito Club", photo: "/winners/debreczeny.jpg" },
  { team: "TR-EX", points: 47, round: "Round 25", venue: "Planetarium", photo: "/winners/tr-ex.jpg" },
  { team: "Orsi and the Barbies", points: 46, round: "Round 25", venue: "Alzo", photo: "/winners/orsi-barbies.jpg" },
];

/** Top of the 17th Championship offline leaderboard, as shown on quiznight.hu/leaderboard */
export const LEADERBOARD = [
  { rank: 1, team: "KonQUIZtádorok", base: 1213, badges: 282, total: 1495 },
  { rank: 2, team: "DRAKE", base: 1194.66, badges: 272, total: 1466.66 },
  { rank: 3, team: "BÁCSQUIZ NYEREMÉNYITALDISZKONT", base: 1189.17, badges: 267, total: 1456.17 },
  { rank: 4, team: "Pornódogmatikai Kutatócsoport", base: 1195.5, badges: 257, total: 1452.5 },
  { rank: 5, team: "Puccskísérlet", base: 1160.16, badges: 282, total: 1442.16 },
  { rank: 6, team: "X-Men", base: 1204, badges: 237, total: 1441 },
  { rank: 7, team: "Kuvasz and the friends", base: 1213.66, badges: 227, total: 1440.66 },
  { rank: 8, team: "QWhisky", base: 1148.66, badges: 277, total: 1425.66 },
  { rank: 9, team: "Szalon Spricc", base: 1153.5, badges: 262, total: 1415.5 },
];

/** News posts as published on quiznight.hu/news */
export const NEWS = [
  {
    id: "17th-regular-season-over",
    title: "The regular season of the 17th Championship has ended!",
    titleHu: "Véget ért a 17. Bajnokság alapszakasza!",
    body: "Only the finals are left. Here you will find all the information you need about the 3 finals.",
    bodyHu: "Már csak a döntők vannak hátra. Itt találsz minden ismert infót a 3 döntőről.",
    image: null,
    accent: "purple" as const,
  },
  {
    id: "pub-crawl-2026",
    title: "Pub crawl 2026",
    titleHu: "Kocsmafutás 2026",
    body: "You can go Pub Crawling on April 11th!",
    bodyHu: "Április 11-én lehet Kocsmafutni!",
    image: null,
    accent: "coral" as const,
  },
  {
    id: "17th-spring-rounds",
    title: "17th Championship spring rounds",
    titleHu: "17. Bajnokság tavaszi fordulók",
    body: "Spring dates",
    bodyHu: "Tavaszi időpontok",
    image: null,
    accent: "mint" as const,
  },
];

/**
 * FAQ questions as listed on quiznight.hu/faq (answer copy still to be
 * ported from the live site — accordions were captured closed).
 */
export const FAQ = [
  {
    category: "Table reservation",
    categoryHu: "Asztalfoglalás",
    questions: [
      {
        q: "Is it mandatory to buy a ticket?",
        qHu: "Kötelező jegyet venni?",
      },
      {
        q: "How much do tickets cost? When and how can I buy them? What does it include?",
        qHu: "Mennyibe kerül a jegy? Mikor és hogyan vehetem meg? Mit tartalmaz?",
      },
      {
        q: "How many people can participate in the games?",
        qHu: "Hányan vehetnek részt a játékokban?",
      },
    ],
  },
  {
    category: "Rules",
    categoryHu: "Szabályok",
    questions: [
      { q: "What are the prizes?", qHu: "Mik a díjak?" },
      { q: "What is prohibited in games?", qHu: "Mi tilos a játékokban?" },
      {
        q: "How many people can play, can there be more, is there a point deduction?",
        qHu: "Hányan játszhatnak, lehet-e több fő, van-e pontlevonás?",
      },
    ],
  },
  {
    category: "Unique events",
    categoryHu: "Egyedi események",
    questions: [
      {
        q: "Do you only hold quizzes on Mondays, or is it possible to request individual games on other days?",
        qHu: "Csak hétfőnként tartotok kvízt, vagy lehet egyedi játékot kérni más napokra is?",
      },
      {
        q: "What are the technical requirements for such an event?",
        qHu: "Mik a technikai feltételei egy ilyen eseménynek?",
      },
    ],
  },
];

/** Real badge artwork from quiznight.hu (Assets/Badges) */
export const BADGES = [
  { id: "bajusz", name: "Moustache", nameHu: "Bajusz", img: "/badges/bajusz.png" },
  { id: "fairplay", name: "Fair Play", nameHu: "Fair Play", img: "/badges/fairplay.png" },
  { id: "farsang", name: "Carnival", nameHu: "Farsang", img: "/badges/farsang.png" },
  { id: "kocsmafutas", name: "Pub Crawl", nameHu: "Kocsmafutás", img: "/badges/kocsmafutas.png" },
  { id: "mentocsonak", name: "Lifeboat", nameHu: "Mentőcsónak", img: "/badges/mentocsonak.png" },
  { id: "mobilnelkul", name: "Phone-free", nameHu: "Mobil nélkül", img: "/badges/mobilnelkul.png" },
  { id: "pinkribbon", name: "Pink Ribbon", nameHu: "Pink Ribbon", img: "/badges/pinkribbon.png" },
];
