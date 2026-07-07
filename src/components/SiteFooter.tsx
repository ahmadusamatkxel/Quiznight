"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Facebook, Instagram } from "./icons";

export default function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-line pt-6 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* left: logo */}
        <Link href="/" aria-label="QuizNight" className="flex items-center">
          <img
            src="/quiznight-logo.svg"
            alt="QuizNight logo"
            width={28}
            height={28}
            className="h-7 w-7"
          />
        </Link>

        {/* right: socials */}
        <div className="flex items-center gap-1">
          <a
            href="#"
            aria-label="Instagram"
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:text-ink"
          >
            <Instagram size={19} />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:text-ink"
          >
            <Facebook size={19} />
          </a>
        </div>
      </div>
    </footer>
  );
}
