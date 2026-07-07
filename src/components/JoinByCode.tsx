"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { extractCode } from "@/lib/join";
import { LinkIcon } from "@/components/icons";

type Props = {
  mode: "event" | "team";
  extraParams?: Record<string, string>;
  className?: string;
};

/** Collapsed pill that expands into an inline "paste a link or code" field. */
export default function JoinByCode({ mode, extraParams, className = "" }: Props) {
  const { t } = useLang();
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const param = mode === "event" ? "code" : "team";
  const path = mode === "event" ? "/e" : "/join";
  const label = mode === "event" ? t.joinEventCta : t.joinTeamCta;

  const go = () => {
    const code = extractCode(value, param);
    if (!code) return;
    const qs = new URLSearchParams({ [param]: code, ...extraParams });
    router.push(`${path}?${qs.toString()}`);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`pill inline-flex cursor-pointer items-center gap-1.5 border-2 border-primary px-4 py-2.5 text-sm font-bold text-accent transition-colors hover:bg-primary hover:text-white ${className}`}
      >
        <LinkIcon size={15} /> {label}
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className={`step-in flex flex-wrap items-center gap-2 ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={t.joinPlaceholder}
        className="h-11 min-w-[220px] flex-1 rounded-xl border border-line bg-bg px-3.5 text-[15px] outline-none transition-colors focus:border-primary"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="pill cursor-pointer bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-default disabled:opacity-40"
      >
        {t.joinGo}
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setValue("");
        }}
        className="pill cursor-pointer border border-line px-4 py-2 text-sm font-bold text-muted hover:text-ink"
      >
        {t.cancel}
      </button>
    </form>
  );
}
