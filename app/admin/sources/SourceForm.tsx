"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Source } from "@/lib/types/source";

const CATEGORIES: { value: Source["category"]; label: string }[] = [
  { value: "tier1", label: "Tier 1 — Research" },
  { value: "tier2", label: "Tier 2 — Culture" },
  { value: "tier3", label: "Tier 3 — Commentary" },
  { value: "other", label: "Other" },
];

interface SourceFormProps {
  initialData?: Partial<Source>;
}

export default function SourceForm({ initialData }: SourceFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name ?? "");
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [rssUrl, setRssUrl] = useState(initialData?.rss_url ?? "");
  const [category, setCategory] = useState<Source["category"]>(initialData?.category ?? "tier2");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [active, setActive] = useState(initialData?.active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      ...(isEdit && { id: initialData!.id }),
      name: name.trim(),
      url: url.trim(),
      rss_url: rssUrl.trim() || null,
      category,
      notes: notes.trim() || null,
      active,
    };

    try {
      const res = await fetch("/api/admin/sources", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Save failed.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/sources");
      router.refresh();
    } catch {
      setError("Network error — try again.");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/sources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initialData!.id }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Delete failed.");
        setDeleting(false);
        setConfirmDelete(false);
        return;
      }
      router.push("/admin/sources");
      router.refresh();
    } catch {
      setError("Network error — try again.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const field =
    "w-full bg-surface2 border border-border text-white placeholder:text-muted text-[0.9rem] px-4 py-[0.7rem] outline-none focus:border-gold transition-colors duration-200";
  const lbl =
    "block text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted mb-[0.4rem]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Name + URL */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className={lbl}>
            Name <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="The Gospel Coalition"
            className={field}
          />
        </div>
        <div>
          <label className={lbl}>
            URL <span className="text-gold">*</span>
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.thegospelcoalition.org"
            className={field}
          />
        </div>
      </div>

      {/* RSS + Category + Active */}
      <div className="grid gap-5 lg:grid-cols-[1fr_auto_auto]">
        <div>
          <label className={lbl}>RSS Feed URL</label>
          <input
            type="url"
            value={rssUrl}
            onChange={(e) => setRssUrl(e.target.value)}
            placeholder="https://example.com/feed/ (optional)"
            className={field}
          />
        </div>
        <div>
          <label className={lbl}>
            Category <span className="text-gold">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Source["category"])}
            className={`${field} cursor-pointer [color-scheme:dark]`}
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>Status</label>
          <div className="pt-[0.35rem]">
            <button
              type="button"
              onClick={() => setActive((v) => !v)}
              className={`px-5 py-[0.65rem] border text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-200 cursor-pointer bg-transparent ${
                active
                  ? "border-aud-parent text-aud-parent"
                  : "border-border text-muted hover:border-tan hover:text-tan"
              }`}
            >
              {active ? "● Active" : "○ Inactive"}
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={lbl}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Why this source is vetted, how we use it, any caveats."
          className={`${field} resize-y`}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-[0.85rem] text-red-400 border border-red-900/60 px-4 py-3 bg-red-950/20">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 items-center flex-wrap border-t border-border pt-7">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gold text-[#0f0e0c] text-[0.8rem] font-bold tracking-[0.1em] uppercase px-10 py-[0.85rem] transition-all duration-200 hover:bg-tan-light disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Source"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/sources")}
          className="border border-border text-muted text-[0.75rem] font-semibold tracking-[0.1em] uppercase px-6 py-[0.85rem] transition-all duration-200 hover:border-gold hover:text-gold bg-transparent cursor-pointer"
        >
          Cancel
        </button>

        {isEdit && !confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="ml-auto border border-red-900/50 text-red-400/60 text-[0.72rem] font-semibold tracking-[0.1em] uppercase px-5 py-[0.85rem] transition-all duration-200 hover:border-red-500 hover:text-red-400 bg-transparent cursor-pointer"
          >
            Delete
          </button>
        )}
        {isEdit && confirmDelete && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[0.78rem] text-red-400">Delete this source?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="border border-red-500 text-red-400 text-[0.72rem] font-semibold tracking-[0.1em] uppercase px-5 py-[0.65rem] hover:bg-red-950/30 bg-transparent cursor-pointer disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="border border-border text-muted text-[0.72rem] font-semibold tracking-[0.1em] uppercase px-5 py-[0.65rem] hover:border-gold hover:text-gold bg-transparent cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
