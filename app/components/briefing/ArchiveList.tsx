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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArchiveList({ briefings }: { briefings: Briefing[] }) {
  if (briefings.length === 0) {
    return (
      <p className="text-muted text-[0.9rem] py-8">
        No past issues yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {briefings.map((b) => (
        <li key={b.id}>
          <Link
            href={`/briefing/${b.slug}`}
            className="group flex items-start justify-between gap-6 py-6 no-underline transition-colors duration-200 hover:bg-surface px-1"
          >
            <div className="flex items-start gap-5 min-w-0">
              {/* Issue number */}
              <span className="text-[0.68rem] font-mono tracking-[0.15em] text-gold shrink-0 mt-[0.2rem]">
                #{b.issue_number}
              </span>

              <div className="min-w-0">
                {/* Date */}
                <div className="text-[0.68rem] font-mono tracking-[0.1em] text-muted mb-1">
                  {formatWeekOf(b.week_of)}
                </div>

                {/* Headline */}
                <h3
                  className="font-display font-bold text-white leading-[1.2] text-[1.1rem] mb-2 transition-colors duration-200 group-hover:text-tan-light"
                  dangerouslySetInnerHTML={{ __html: b.headline }}
                />

                {/* Audience badges */}
                <div className="flex gap-2 flex-wrap">
                  {b.audiences.map((aud) => (
                    <span
                      key={aud}
                      className={`text-[0.6rem] font-semibold tracking-[0.1em] uppercase border px-2 py-[0.15rem] ${AUDIENCE_COLORS[aud] ?? "text-muted border-border"}`}
                    >
                      {AUDIENCE_LABELS[aud] ?? aud}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <span className="text-muted text-[1.1rem] shrink-0 mt-1 transition-all duration-200 group-hover:text-gold group-hover:translate-x-1">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
