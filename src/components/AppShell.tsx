"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LangSwitch, useLang, type Strings } from "@/lib/i18n";
import { ThemeToggle } from "@/lib/theme";
import { USER } from "@/lib/data";
import SiteFooter from "./SiteFooter";
import {
  Beer,
  Calendar,
  Check,
  Crown,
  MessageCircle,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  Wand,
  X,
} from "./icons";

type NavItem = {
  key: keyof Strings;
  href?: string;
  icon: React.ReactNode;
  soon?: boolean;
};

const NAV: NavItem[] = [
  { key: "navHome", href: "/", icon: <Beer size={17} /> },
  { key: "navEvents", href: "/reserve", icon: <Calendar size={17} /> },
  { key: "navMyTeam", href: "/team", icon: <Crown size={17} /> },
  { key: "navTeams", href: "/teams", icon: <Users size={17} /> },
  { key: "navLeaderboard", href: "/leaderboard", icon: <Trophy size={17} /> },
  { key: "navBadges", href: "/badges", icon: <Check size={17} /> },
  { key: "navNews", href: "/news", icon: <Sparkles size={17} /> },
  { key: "navFaq", href: "/faq", icon: <MessageCircle size={17} /> },
  { key: "navUniqueEvents", icon: <Wand size={17} />, soon: true },
  { key: "navProducts", icon: <Ticket size={17} />, soon: true },
  { key: "navProfile", icon: <Users size={17} />, soon: true },
  { key: "navOrders", icon: <Ticket size={17} />, soon: true },
  { key: "navQuestion", icon: <MessageCircle size={17} />, soon: true },
  { key: "navPoints", icon: <Check size={17} />, soon: true },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/quiznight-logo.svg"
        alt="QuizNight logo"
        width={38}
        height={38}
        className="h-9.5 w-9.5"
      />
      <span className="display text-lg font-semibold tracking-tight text-ink">
        Quiz<span className="text-primary">Night</span>
      </span>
    </Link>
  );
}

function SidebarContent({
  onNavigate,
  onClose,
}: {
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const { t } = useLang();
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-bg hover:text-ink"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {NAV.map((item) => {
          const label = t[item.key] as string;
          const active = item.href === pathname;
          if (item.soon) {
            return (
              <div
                key={item.key}
                aria-disabled
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-faint"
              >
                <span className="opacity-60">{item.icon}</span>
                <span className="flex-1">{label}</span>
                <span className="pill bg-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                  {t.soon}
                </span>
              </div>
            );
          }
          return (
            <Link
              key={item.key}
              href={item.href!}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-bg hover:text-ink"
              }`}
            >
              {item.icon}
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line px-5 py-4">
        <button className="pill cursor-pointer border border-line px-4 py-2 text-sm font-bold text-muted transition-colors hover:border-coral hover:text-coral">
          {t.logout}
        </button>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setDesktopOpen((o) => !o);
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop sidebar (collapsible) */}
      {desktopOpen && (
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-line bg-paper lg:block">
          <SidebarContent onClose={() => setDesktopOpen(false)} />
        </aside>
      )}

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="drawer-in absolute left-0 top-0 h-full w-72 bg-paper shadow-2xl">
            <SidebarContent
              onNavigate={() => setMobileOpen(false)}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                aria-label={t.menu}
                aria-expanded={desktopOpen}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line text-muted hover:text-ink"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className={desktopOpen ? "lg:hidden" : ""}>
                <Logo />
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <LangSwitch />
              <ThemeToggle />
              <span className="hidden text-sm font-semibold text-muted sm:block">
                {t.greeting}
              </span>
              <div
                className="grid h-9 w-9 place-items-center rounded-full bg-mint font-bold text-[#17141f]"
                aria-label={`${t.signedInAs} ${USER.firstName}`}
              >
                {USER.firstName[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8">
          {children}
          <SiteFooter />
        </main>
      </div>
    </div>
  );
}

export function PageHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-7">
      <h1 className="display text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-muted">{sub}</p>
    </div>
  );
}
