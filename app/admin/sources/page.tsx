import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Source } from "@/lib/types/source";

const CATEGORY_ORDER: Source["category"][] = ["tier1", "tier2", "tier3", "other"];
const CATEGORY_LABELS: Record<Source["category"], string> = {
  tier1: "Tier 1 — Research",
  tier2: "Tier 2 — Culture",
  tier3: "Tier 3 — Commentary",
  other: "Other",
};

export default async function AdminSourcesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("sources")
    .select("*")
    .order("name", { ascending: true });

  const sources = (data ?? []) as Source[];

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    sources: sources.filter((s) => s.category === cat),
  })).filter(({ sources }) => sources.length > 0);

  return (
    <main className="min-h-screen px-12 pt-[5rem] pb-[6rem] max-w-[1200px] mx-auto max-[900px]:px-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-10 flex-wrap">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-muted hover:text-gold transition-colors duration-200 mb-4 no-underline"
          >
            ← Dashboard
          </Link>
          <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-3 ml-6">
            <span className="block w-6 h-px bg-gold shrink-0" />
            Next Gen Briefing
          </div>
          <h1
            className="font-display font-bold text-white leading-[1.1]"
            style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}
          >
            Vetted Sources
          </h1>
          <p className="text-[0.85rem] text-muted mt-1">
            {sources.length} source{sources.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/sources/new"
          className="inline-flex items-center gap-2 bg-gold text-[#0f0e0c] no-underline text-[0.78rem] font-bold tracking-[0.1em] uppercase px-7 py-[0.8rem] transition-all duration-200 hover:bg-tan-light mt-8"
        >
          + Add Source
        </Link>
      </div>

      {sources.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="text-muted text-[0.95rem] mb-6">No sources yet.</p>
          <Link
            href="/admin/sources/new"
            className="inline-flex items-center gap-2 bg-gold text-[#0f0e0c] no-underline text-[0.78rem] font-bold tracking-[0.1em] uppercase px-7 py-[0.8rem] transition-all duration-200 hover:bg-tan-light"
          >
            Add your first source →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {grouped.map(({ cat, label, sources: catSources }) => (
            <div key={cat}>
              {/* Category header */}
              <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
                <span className="block w-6 h-px bg-gold shrink-0" />
                {label}
                <span className="text-muted normal-case tracking-normal font-normal">
                  ({catSources.length})
                </span>
              </div>

              <div className="border border-border divide-y divide-border">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-6 items-center px-6 py-3 bg-surface2">
                  <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">
                    Source
                  </span>
                  <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">
                    RSS
                  </span>
                  <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">
                    Status
                  </span>
                  <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">
                    Action
                  </span>
                </div>

                {catSources.map((s) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-[1fr_auto_auto_auto] gap-6 items-center px-6 py-4 bg-surface hover:bg-surface2 transition-colors duration-150"
                  >
                    {/* Name + URL stacked */}
                    <div className="min-w-0">
                      <div className="text-[0.9rem] text-tan-light font-medium truncate">
                        {s.name}
                      </div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.75rem] text-muted hover:text-gold transition-colors duration-200 truncate block max-w-[40ch] no-underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.url}
                      </a>
                    </div>

                    {/* RSS indicator */}
                    <span
                      className={`text-[0.65rem] font-semibold tracking-[0.12em] uppercase border px-2 py-[0.2rem] whitespace-nowrap ${
                        s.rss_url
                          ? "text-gold-dim border-gold-dim"
                          : "text-border border-border"
                      }`}
                    >
                      {s.rss_url ? "RSS" : "—"}
                    </span>

                    {/* Active badge */}
                    <span
                      className={`text-[0.65rem] font-semibold tracking-[0.12em] uppercase border px-2 py-[0.2rem] whitespace-nowrap ${
                        s.active
                          ? "text-aud-parent border-aud-parent"
                          : "text-muted border-border"
                      }`}
                    >
                      {s.active ? "Active" : "Inactive"}
                    </span>

                    {/* Edit */}
                    <Link
                      href={`/admin/sources/${s.id}/edit`}
                      className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-muted hover:text-gold transition-colors duration-200 no-underline whitespace-nowrap"
                    >
                      Edit →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
