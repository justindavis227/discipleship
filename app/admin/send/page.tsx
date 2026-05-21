import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Briefing } from "@/lib/types/briefing";
import SendButton from "./SendButton";

const AUDIENCE_COLORS: Record<string, string> = {
  parent: "text-aud-parent border-aud-parent",
  leader: "text-aud-leader border-aud-leader",
  student: "text-aud-student border-aud-student",
};

const AUDIENCE_LABELS: Record<string, string> = {
  parent: "Parents",
  leader: "Leaders",
  student: "Students",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type BriefingRow = Pick<Briefing, "id" | "issue_number" | "title" | "week_of" | "audiences" | "published_at">;

async function getSubscriberCount(audiences: string[]): Promise<number> {
  const { count } = await supabaseAdmin
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("status", "confirmed")
    .overlaps("audience_prefs", audiences);
  return count ?? 0;
}

export default async function AdminSendPage() {
  const { data } = await supabaseAdmin
    .from("briefings")
    .select("id, issue_number, title, week_of, audiences, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const briefings = (data ?? []) as BriefingRow[];

  // Fetch subscriber counts in parallel
  const counts = await Promise.all(briefings.map((b) => getSubscriberCount(b.audiences)));

  return (
    <main className="min-h-screen px-12 pt-[5rem] pb-[6rem] max-w-[1200px] mx-auto max-[900px]:px-6">
      {/* Header */}
      <div className="mb-10">
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
          Send Briefings
        </h1>
        <p className="text-[0.88rem] text-muted mt-2 max-w-[560px]">
          Send a published issue to all confirmed subscribers whose audience tracks
          match. Only confirmed subscribers receive email. Counts shown are live.
        </p>
      </div>

      {briefings.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="text-muted text-[0.95rem] mb-4">No published briefings yet.</p>
          <Link
            href="/admin/briefings"
            className="text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-gold hover:text-tan-light transition-colors duration-200 no-underline"
          >
            Go to Briefings →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {briefings.map((briefing, i) => (
            <div key={briefing.id} className="bg-surface border border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-gold" />
              <div className="p-7 flex items-start justify-between gap-6 flex-wrap max-[700px]:flex-col">
                {/* Left: briefing info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-[0.68rem] font-mono tracking-[0.16em] uppercase text-gold">
                      #{briefing.issue_number}
                    </span>
                    <span className="w-px h-3 bg-border" />
                    <span className="text-[0.68rem] font-mono tracking-[0.1em] text-muted">
                      {formatDate(briefing.week_of)}
                    </span>
                    <span className="w-px h-3 bg-border" />
                    <div className="flex gap-2">
                      {briefing.audiences.map((aud) => (
                        <span
                          key={aud}
                          className={`text-[0.6rem] font-semibold tracking-[0.1em] uppercase border px-2 py-[0.15rem] ${AUDIENCE_COLORS[aud] ?? "text-muted border-border"}`}
                        >
                          {AUDIENCE_LABELS[aud] ?? aud}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[0.95rem] text-tan-light font-medium truncate">{briefing.title}</p>
                </div>

                {/* Right: send control */}
                <div className="flex flex-col items-end gap-2 shrink-0 max-[700px]:items-start">
                  <SendButton
                    briefingId={briefing.id}
                    recipientCount={counts[i]}
                  />
                  <Link
                    href={`/admin/briefings/${briefing.id}/edit`}
                    className="text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-muted hover:text-gold transition-colors duration-200 no-underline"
                  >
                    Edit briefing
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
