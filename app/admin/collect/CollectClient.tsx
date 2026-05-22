"use client";

import { useState } from "react";

export type FeedItem = {
  title: string;
  link: string;
  isoDate: string;
  contentSnippet: string;
};

export type SourceResult =
  | { sourceId: string; sourceName: string; ok: true; items: FeedItem[] }
  | { sourceId: string; sourceName: string; ok: false; error: string };

const PROMPT_PREFIX =
  "Draft a Next Gen Briefing issue from the following sources, in our standard briefing JSON format " +
  "(sections: research, culture, audience blocks for parent/leader/student). Vet-ready draft only.";

function itemKey(sourceId: string, item: FeedItem, index: number) {
  return item.link || `${sourceId}-${index}`;
}

function formatDate(isoDate: string) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CollectClient({ results }: { results: SourceResult[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const totalItems = results.filter((r) => r.ok).flatMap((r) => (r.ok ? r.items : [])).length;
  const checkedCount = checked.size;

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function toggleSource(result: SourceResult & { ok: true }) {
    const keys = result.items.map((item, i) => itemKey(result.sourceId, item, i));
    const allChecked = keys.every((k) => checked.has(k));
    setChecked((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        keys.forEach((k) => next.delete(k));
      } else {
        keys.forEach((k) => next.add(k));
      }
      return next;
    });
  }

  function toggleAll() {
    const allKeys = results.flatMap((r) =>
      r.ok ? r.items.map((item, i) => itemKey(r.sourceId, item, i)) : []
    );
    if (checked.size === allKeys.length) {
      setChecked(new Set());
    } else {
      setChecked(new Set(allKeys));
    }
  }

  function buildPrompt() {
    const lines: string[] = [PROMPT_PREFIX, "", "--- SOURCE MATERIAL ---"];

    for (const result of results) {
      if (!result.ok) continue;
      const selected = result.items.filter((item, i) =>
        checked.has(itemKey(result.sourceId, item, i))
      );
      if (selected.length === 0) continue;

      lines.push("", `[${result.sourceName}]`);
      for (const item of selected) {
        lines.push(`• ${item.title}`);
        if (item.isoDate) lines.push(`  Published: ${formatDate(item.isoDate)}`);
        if (item.link) lines.push(`  Link: ${item.link}`);
        if (item.contentSnippet) lines.push(`  Snippet: ${item.contentSnippet}`);
      }
    }

    if (notes.trim()) {
      lines.push("", "--- ADDITIONAL NOTES / TRANSCRIPTS ---", notes.trim());
    }

    return lines.join("\n");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — shouldn't happen on HTTPS
    }
  }

  const field =
    "w-full bg-surface2 border border-border text-white placeholder:text-muted text-[0.9rem] px-4 py-[0.7rem] outline-none focus:border-gold transition-colors duration-200";
  const lbl =
    "block text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted mb-[0.4rem]";

  if (results.length === 0) {
    return (
      <div className="border border-border p-12 text-center">
        <p className="text-muted text-[0.95rem] mb-4">
          No active sources with RSS feeds.
        </p>
        <a
          href="/admin/sources"
          className="text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-gold hover:text-tan-light transition-colors duration-200 no-underline"
        >
          Add RSS feeds to sources →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Global controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={toggleAll}
          className="border border-border text-muted text-[0.72rem] font-semibold tracking-[0.1em] uppercase px-4 py-[0.5rem] hover:border-gold hover:text-gold transition-all duration-200 bg-transparent cursor-pointer"
        >
          {checked.size === totalItems && totalItems > 0 ? "Deselect all" : "Select all"}
        </button>
        <span className="text-[0.78rem] text-muted font-mono">
          {checkedCount} of {totalItems} item{totalItems !== 1 ? "s" : ""} selected
        </span>
      </div>

      {/* Source groups */}
      <div className="flex flex-col gap-6">
        {results.map((result) => {
          if (!result.ok) {
            return (
              <div key={result.sourceId} className="border border-border p-5 bg-surface">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted">
                    <span className="block w-4 h-px bg-border shrink-0" />
                    {result.sourceName}
                  </div>
                  <span className="text-[0.7rem] text-red-400/70 font-mono">
                    couldn't load feed
                  </span>
                </div>
              </div>
            );
          }

          const sourceKeys = result.items.map((item, i) => itemKey(result.sourceId, item, i));
          const allSourceChecked = sourceKeys.length > 0 && sourceKeys.every((k) => checked.has(k));
          const checkedInSource = sourceKeys.filter((k) => checked.has(k)).length;

          return (
            <div key={result.sourceId} className="border border-border bg-surface">
              {/* Source header */}
              <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border bg-surface2">
                <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-gold">
                  <span className="block w-4 h-px bg-gold shrink-0" />
                  {result.sourceName}
                  {checkedInSource > 0 && (
                    <span className="text-muted normal-case tracking-normal font-normal">
                      {checkedInSource}/{result.items.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleSource(result)}
                  className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  {allSourceChecked ? "None" : "All"}
                </button>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {result.items.map((item, i) => {
                  const key = itemKey(result.sourceId, item, i);
                  const isChecked = checked.has(key);
                  return (
                    <label
                      key={key}
                      className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors duration-150 ${
                        isChecked ? "bg-surface" : "bg-surface hover:bg-surface2"
                      }`}
                    >
                      {/* Custom checkbox */}
                      <div className="relative shrink-0 mt-[0.18rem]">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(key)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 border transition-colors duration-150 flex items-center justify-center text-[0.6rem] font-bold ${
                            isChecked
                              ? "border-gold bg-gold text-[#0f0e0c]"
                              : "border-border bg-transparent"
                          }`}
                        >
                          {isChecked && "✓"}
                        </div>
                      </div>

                      {/* Item content */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-[0.9rem] font-medium leading-[1.3] mb-1 transition-colors duration-150 ${isChecked ? "text-white" : "text-tan"}`}>
                          {item.title}
                        </div>
                        <div className="flex items-center gap-3 mb-[0.35rem] flex-wrap">
                          {item.isoDate && (
                            <span className="text-[0.68rem] font-mono text-muted">
                              {formatDate(item.isoDate)}
                            </span>
                          )}
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[0.68rem] font-mono text-muted hover:text-gold transition-colors duration-200 no-underline truncate max-w-[40ch]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {new URL(item.link).hostname}
                            </a>
                          )}
                        </div>
                        {item.contentSnippet && (
                          <p className="text-[0.8rem] text-muted leading-[1.6] line-clamp-2">
                            {item.contentSnippet}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes + copy */}
      <div className="border-t border-border pt-8 flex flex-col gap-5">
        <div>
          <label className={lbl}>Paste additional URLs or transcripts</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder={"One URL per line, or paste full transcript text.\nhttps://example.com/article\nhttps://example.com/another"}
            className={`${field} resize-y font-mono text-[0.85rem]`}
          />
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <button
            type="button"
            onClick={handleCopy}
            disabled={checkedCount === 0 && !notes.trim()}
            className="bg-gold text-[#0f0e0c] text-[0.8rem] font-bold tracking-[0.1em] uppercase px-10 py-[0.85rem] transition-all duration-200 hover:bg-tan-light disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {copied ? "Copied!" : "Copy draft prompt"}
          </button>
          <span className="text-[0.78rem] text-muted">
            {checkedCount > 0 || notes.trim()
              ? `${checkedCount} source item${checkedCount !== 1 ? "s" : ""}${notes.trim() ? " + notes" : ""}`
              : "Select items or paste notes to build the prompt"}
          </span>
        </div>
      </div>
    </div>
  );
}
