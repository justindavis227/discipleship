"use client";

import { useSearchParams } from "next/navigation";

export default function SearchBox() {
  const searchParams = useSearchParams();
  const audience = searchParams.get("audience") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const q = searchParams.get("q") ?? "";

  return (
    <form action="/briefing" method="get" className="relative w-full max-w-[480px]">
      {audience && <input type="hidden" name="audience" value={audience} />}
      {tag && <input type="hidden" name="tag" value={tag} />}
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search issues by title or headline…"
        className="w-full bg-surface border border-border text-white placeholder-muted text-[0.88rem] px-4 py-[0.6rem] pr-10 focus:outline-none focus:border-gold transition-colors duration-200"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors duration-200 text-[0.9rem]"
      >
        →
      </button>
    </form>
  );
}
