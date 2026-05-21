import Link from "next/link";
import type { Briefing } from "@/lib/types/briefing";

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

function formatWeekOf(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BriefingFeature({ briefing }: { briefing: Briefing }) {
  return (
    <article className="bg-surface border border-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[3px] h-full bg-gold" />

      <div className="p-10 max-[600px]:p-6">
        {/* Meta row */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="text-[0.68rem] font-mono tracking-[0.18em] uppercase text-gold">
            Issue #{briefing.issue_number}
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="text-[0.68rem] font-mono tracking-[0.12em] text-muted">
            Week of {formatWeekOf(briefing.week_of)}
          </span>
          <span className="w-px h-3 bg-border" />
          <div className="flex gap-2">
            {briefing.audiences.map((aud) => (
              <span
                key={aud}
                className={`text-[0.62rem] font-semibold tracking-[0.12em] uppercase border px-2 py-[0.2rem] ${AUDIENCE_COLORS[aud] ?? "text-muted border-border"}`}
              >
                {AUDIENCE_LABELS[aud] ?? aud}
              </span>
            ))}
          </div>
        </div>

        {/* Headline */}
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
          <span className="block w-6 h-px bg-gold shrink-0" />
          This Week
        </div>

        <h2
          className="font-display font-bold leading-[1.1] text-white mb-5"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
          dangerouslySetInnerHTML={{ __html: briefing.headline }}
        />

        <p className="text-[1rem] text-tan leading-[1.75] max-w-[680px] mb-8">
          {briefing.lede}
        </p>

        {/* In this issue */}
        {briefing.in_this_issue.length > 0 && (
          <div className="mb-8">
            <div className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted mb-3">
              In This Issue
            </div>
            <ul className="flex flex-col gap-[0.4rem]">
              {briefing.in_this_issue.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.88rem] text-tan-light">
                  <span className="text-gold mt-[0.3rem] shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={`/briefing/${briefing.slug}`}
          className="inline-flex items-center gap-2 py-[0.85rem] px-8 bg-gold text-[#0f0e0c] no-underline text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-tan-light hover:-translate-y-px"
        >
          Read This Week&apos;s Briefing →
        </Link>
      </div>
    </article>
  );
}
