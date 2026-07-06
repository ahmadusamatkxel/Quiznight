"use client";

import { FAQ } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import AppShell, { PageHead } from "@/components/AppShell";

export default function FaqPage() {
  const { t, lang } = useLang();

  return (
    <AppShell>
      <PageHead title={t.faqTitle} sub={t.faqSub} />

      <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-coral-soft px-3.5 py-2 text-sm font-semibold text-coral-text">
        {t.faqCopyNote}
      </div>

      <div className="space-y-8">
        {FAQ.map((cat) => (
          <section key={cat.category}>
            <h2 className="display mb-3 text-xl font-semibold">
              {lang === "hu" ? cat.categoryHu : cat.category}
            </h2>
            <div className="space-y-2.5">
              {cat.questions.map((q) => (
                <details
                  key={q.q}
                  className="group rounded-2xl border border-line bg-paper px-5 py-4"
                >
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {lang === "hu" ? q.qHu : q.q}
                      <span className="text-faint transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted">{t.faqCopyNote}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
