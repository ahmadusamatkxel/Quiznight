"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { ArrowLeft, Sparkles } from "@/components/icons";

function SignupInner() {
  const { t } = useLang();
  const params = useSearchParams();
  const mode = params.get("mode") === "login" ? "login" : "signup";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-5 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-accent">
          <Sparkles size={24} />
        </div>
        <h1 className="display mt-5 text-2xl font-semibold">
          {mode === "login" ? t.loginSoonTitle : t.signupSoonTitle}
        </h1>
        <p className="mt-2 text-muted">{t.authSoonSub}</p>
        <Link
          href="/"
          className="pill mt-6 inline-flex cursor-pointer items-center gap-1.5 bg-primary px-5 py-2.5 font-bold text-white transition-colors hover:bg-primary-dark"
        >
          <ArrowLeft size={15} /> {t.backToDash}
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupInner />
    </Suspense>
  );
}
