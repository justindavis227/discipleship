import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Briefing } from "@/lib/types/briefing";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminBriefingsPage() {
  const { data } = await supabaseAdmin
    .from("briefings")
    .select("id, issue_number, title, week_of, status, published_at, created_at")
    .order("created_at", { ascending: false });

  const briefings = (data ?? []) as Pick<
    Briefing,
    "id" | "issue_number" | "title" | "week_of" | "status" | "published_at" | "created_at"
  >[];

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
            Briefings
          </h1>
        </div>
        <Link
          href="/admin/briefings/new"
          className="inline-flex items-center gap-2 bg-gold text-[#0f0e0c] no-underline text-[0.78rem] font-bold tracking-[0.1em] uppercase px-7 py-[0.8rem] transition-all duration-200 hover:bg-tan-light mt-8"
        >
          + New Briefing
        </Link>
      </div>

      {briefings.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="text-muted text-[0.95rem] mb-6">No briefings yet.</p>
          <Link
            href="/admin/briefings/new"
            className="inline-flex items-center gap-2 bg-gold text-[#0f0e0c] no-underline text-[0.78rem] font-bold tracking-[0.1em] uppercase px-7 py-[0.8rem] transition-all duration-200 hover:bg-tan-light"
          >
            Create your first briefing →
          </Link>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {/* Table header */}
          <div className="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-6 items-center px-6 py-3 bg-surface2">
            <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">#</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">Title</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">Week Of</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">Status</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted">Action</span>
          </div>

          {briefings.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-6 items-center px-6 py-4 bg-surface hover:bg-surface2 transition-colors duration-150"
            >
              <span className="text-[0.78rem] font-mono text-muted">{b.issue_number}</span>
              <span className="text-[0.9rem] text-tan-light font-medium truncate">{b.title}</span>
              <span className="text-[0.78rem] font-mono text-muted whitespace-nowrap">
                {formatDate(b.week_of)}
              </span>
              <span
                className={`text-[0.65rem] font-semibold tracking-[0.12em] uppercase border px-2 py-[0.2rem] whitespace-nowrap ${
                  b.status === "published"
                    ? "text-aud-parent border-aud-parent"
                    : "text-gold-dim border-gold-dim"
                }`}
              >
                {b.status}
              </span>
              <Link
                href={`/admin/briefings/${b.id}/edit`}
                className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-muted hover:text-gold transition-colors duration-200 no-underline whitespace-nowrap"
              >
                Edit →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
