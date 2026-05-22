"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Briefing } from "@/lib/types/briefing";

const AUDIENCES = [
  { value: "parent", label: "Parents", color: "text-aud-parent border-aud-parent" },
  { value: "leader", label: "Leaders", color: "text-aud-leader border-aud-leader" },
  { value: "student", label: "Students", color: "text-aud-student border-aud-student" },
];

const STARTER_CONTENT = JSON.stringify({ sections: [] }, null, 2);

function slugify(text: string) {
  return text
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

interface BriefingFormProps {
  initialData?: Partial<Briefing>;
  defaultIssueNumber?: number;
}

export default function BriefingForm({ initialData, defaultIssueNumber }: BriefingFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [weekOf, setWeekOf] = useState(initialData?.week_of ?? "");
  const [issueNumber, setIssueNumber] = useState(
    String(initialData?.issue_number ?? defaultIssueNumber ?? "")
  );
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [headline, setHeadline] = useState(initialData?.headline ?? "");
  const [lede, setLede] = useState(initialData?.lede ?? "");
  const [inThisIssue, setInThisIssue] = useState(
    (initialData?.in_this_issue ?? []).join("\n")
  );
  const [audiences, setAudiences] = useState<string[]>(
    initialData?.audiences ?? ["parent", "leader", "student"]
  );
  const [topicTags, setTopicTags] = useState(
    (initialData?.topic_tags ?? []).join(", ")
  );
  const [contentJson, setContentJson] = useState(
    initialData?.content_json
      ? JSON.stringify(initialData.content_json, null, 2)
      : STARTER_CONTENT
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status ?? "draft"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleAudience(val: string) {
    setAudiences((prev) =>
      prev.includes(val) ? prev.filter((a) => a !== val) : [...prev, val]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let parsedContent;
    try {
      parsedContent = JSON.parse(contentJson);
    } catch {
      setError("Content JSON is not valid JSON — fix it before saving.");
      return;
    }

    if (audiences.length === 0) {
      setError("Select at least one audience.");
      return;
    }

    setSubmitting(true);

    const payload = {
      ...(isEdit && { id: initialData!.id }),
      slug: slug.trim(),
      week_of: weekOf,
      issue_number: Number(issueNumber),
      title: title.trim(),
      headline: headline.trim(),
      lede: lede.trim(),
      in_this_issue: inThisIssue.split("\n").map((l) => l.trim()).filter(Boolean),
      audiences,
      topic_tags: topicTags.split(",").map((t) => t.trim()).filter(Boolean),
      content_json: parsedContent,
      status,
    };

    try {
      const res = await fetch("/api/admin/briefings", {
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
      router.push("/admin/briefings");
      router.refresh();
    } catch {
      setError("Network error — try again.");
      setSubmitting(false);
    }
  }

  const field = "w-full bg-surface2 border border-border text-white placeholder:text-muted text-[0.9rem] px-4 py-[0.7rem] outline-none focus:border-gold transition-colors duration-200";
  const label = "block text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted mb-[0.4rem]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">

      {/* Headline + slug */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className={label}>
            Headline <span className="text-gold">*</span>
            <span className="ml-2 normal-case tracking-normal font-normal text-muted">HTML allowed: &lt;em&gt; for italic</span>
          </label>
          <input
            type="text"
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder='Why <em>every</em> parent needs to see this'
            className={field}
          />
        </div>
        <div>
          <label className={label}>Slug <span className="text-gold">*</span></label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generate-from-headline"
              className={`${field} flex-1`}
            />
            <button
              type="button"
              onClick={() => setSlug(slugify(headline))}
              title="Generate from headline"
              className="shrink-0 border border-border text-muted text-[0.72rem] font-semibold tracking-[0.06em] uppercase px-4 transition-all duration-200 hover:border-gold hover:text-gold bg-transparent cursor-pointer whitespace-nowrap"
            >
              Auto
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={label}>Title — internal label <span className="text-gold">*</span></label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue 12 — Phones in School"
          className={field}
        />
      </div>

      {/* Lede */}
      <div>
        <label className={label}>Lede <span className="text-gold">*</span></label>
        <textarea
          required
          value={lede}
          onChange={(e) => setLede(e.target.value)}
          rows={3}
          placeholder="Opening paragraph shown on the feature card and briefing detail page."
          className={`${field} resize-y`}
        />
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <label className={label}>Week Of <span className="text-gold">*</span></label>
          <input
            type="date"
            required
            value={weekOf}
            onChange={(e) => setWeekOf(e.target.value)}
            className={`${field} [color-scheme:dark]`}
          />
        </div>
        <div>
          <label className={label}>Issue # <span className="text-gold">*</span></label>
          <input
            type="number"
            required
            min={1}
            value={issueNumber}
            onChange={(e) => setIssueNumber(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className={`${field} cursor-pointer [color-scheme:dark]`}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className={label}>Audiences <span className="text-gold">*</span></label>
          <div className="flex gap-2 flex-wrap pt-[0.35rem]">
            {AUDIENCES.map(({ value, label: lbl, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleAudience(value)}
                className={`px-3 py-[0.3rem] border text-[0.65rem] font-semibold tracking-[0.08em] uppercase transition-all duration-200 cursor-pointer bg-transparent ${
                  audiences.includes(value)
                    ? color
                    : "border-border text-muted hover:border-tan hover:text-tan"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* In this issue */}
      <div>
        <label className={label}>In This Issue — one item per line</label>
        <textarea
          value={inThisIssue}
          onChange={(e) => setInThisIssue(e.target.value)}
          rows={4}
          placeholder={"Research shows phone bans improve grades\nA note for leaders on conflict\nStudent resource: journaling prompts"}
          className={`${field} resize-y font-mono text-[0.85rem]`}
        />
      </div>

      {/* Topic tags */}
      <div>
        <label className={label}>Topic Tags — comma-separated</label>
        <input
          type="text"
          value={topicTags}
          onChange={(e) => setTopicTags(e.target.value)}
          placeholder="phones, mental health, parenting, leadership"
          className={field}
        />
      </div>

      {/* Content JSON */}
      <div>
        <div className="flex items-baseline justify-between gap-4 mb-[0.4rem] flex-wrap">
          <label className={`${label} mb-0`}>
            Content JSON <span className="text-gold">*</span>
          </label>
          <span className="text-[0.7rem] text-muted">Must match BriefingContent schema — sections array</span>
        </div>
        <textarea
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
          rows={22}
          spellCheck={false}
          className={`${field} font-mono text-[0.8rem] leading-[1.65] resize-y`}
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
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Briefing"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/briefings")}
          className="border border-border text-muted text-[0.75rem] font-semibold tracking-[0.1em] uppercase px-6 py-[0.85rem] transition-all duration-200 hover:border-gold hover:text-gold bg-transparent cursor-pointer"
        >
          Cancel
        </button>
        {status === "published" && (
          <span className="text-[0.72rem] text-aud-parent font-semibold tracking-[0.1em] uppercase">
            ● Will publish immediately
          </span>
        )}
        {isEdit && initialData?.id && (
          <a
            href={`/admin/briefings/${initialData.id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto font-mono text-[0.72rem] text-muted hover:text-gold transition-colors duration-200 no-underline"
          >
            Preview ↗
          </a>
        )}
      </div>
    </form>
  );
}
