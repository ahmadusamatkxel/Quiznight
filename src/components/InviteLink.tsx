"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLang } from "@/lib/i18n";

export function useOrigin() {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return origin;
}

export function printQR(elId: string, title: string, link: string) {
  const el = document.getElementById(elId);
  if (!el) return;
  const w = window.open("", "_blank", "width=440,height=580");
  if (!w) return;
  w.document.write(
    `<!doctype html><title>${title}</title><body style="margin:0;font-family:system-ui,sans-serif;text-align:center;padding:40px">${el.outerHTML}<h2 style="margin:20px 0 6px">${title}</h2><p style="color:#666;font-size:12px;word-break:break-all">${link}</p></body>`
  );
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 250);
}

export function CopyButton({ text }: { text: string }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="pill cursor-pointer border border-line bg-paper px-4 py-2 text-sm font-bold text-muted transition-colors hover:border-primary hover:text-accent"
    >
      {done ? t.copied : t.copyLink}
    </button>
  );
}

/** QR code + copy + print block for sharing an invite link. */
export function InviteLinkBlock({
  id,
  title,
  link,
  hint,
}: {
  id: string;
  title: string;
  link: string;
  hint: string;
}) {
  const { t } = useLang();
  return (
    <div className="mt-4 rounded-xl border border-dashed border-line p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-faint">
        {title}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className="rounded-lg bg-white p-1.5">
          <QRCodeSVG id={id} value={link || "https://quiznight.hu"} size={72} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm text-muted">{link}</div>
          <div className="mt-2 flex gap-2">
            <CopyButton text={link} />
            <button
              onClick={() => printQR(id, title, link)}
              className="pill cursor-pointer border border-line bg-paper px-4 py-2 text-sm font-bold text-muted transition-colors hover:border-primary hover:text-accent"
            >
              {t.printQr}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-faint">{hint}</p>
    </div>
  );
}
