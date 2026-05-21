import Link from "next/link";
import type { Briefing, BriefingContent } from "@/lib/types/briefing";

const AUDIENCE_COLORS: Record<string, string> = {
  parent: "text-aud-parent border-aud-parent",
  leader: "text-aud-leader border-aud-leader",
  student: "text-aud-student border-aud-student",
};

const AUDIENCE_BG: Record<string, string> = {
  parent: "border-l-aud-parent bg-aud-parent/5",
  leader: "border-l-aud-leader bg-aud-leader/5",
  student: "border-l-aud-student bg-aud-student/5",
};

const AUDIENCE_LABELS: Record<string, string> = {
  parent: "For Parents",
  leader: "For Leaders",
  student: "For Students",
};

function formatWeekOf(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ContentSections({ content }: { content: BriefingContent }) {
  return (
    <div className="flex flex-col gap-12">
      {content.sections.map((section, si) => (
        <section key={si}>
          {/* Section label */}
          <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-6">
            <span className="block w-6 h-px bg-gold shrink-0" />
            {section.label}
          </div>

          <div className="flex flex-col gap-8">
            {section.items.map((item, ii) => (
              <div key={ii}>
                {item.heading && (
                  <h3 className="font-display font-bold text-white text-[1.3rem] leading-[1.25] mb-3">
                    {item.heading}
                  </h3>
                )}

                {item.body && (
                  <p className="text-[0.95rem] text-tan leading-[1.8] whitespace-pre-line">
                    {item.body}
                  </p>
                )}

                {item.pullQuote && (
                  <blockquote className="border-l-[3px] border-gold pl-6 my-6">
                    <div className="text-[0.68rem] font-mono tracking-[0.18em] uppercase text-gold mb-2">
                      {item.pullQuote.label}
                    </div>
                    <p className="font-display text-[1.15rem] font-bold text-tan-light leading-[1.45] italic">
                      {item.pullQuote.text}
                    </p>
                  </blockquote>
                )}

                {item.audienceBlock && (
                  <div
                    className={`border-l-[3px] pl-6 py-4 my-4 ${AUDIENCE_BG[item.audienceBlock.audience] ?? "border-l-border"}`}
                  >
                    <div
                      className={`text-[0.68rem] font-semibold tracking-[0.15em] uppercase mb-2 ${AUDIENCE_COLORS[item.audienceBlock.audience] ?? "text-muted"}`}
                    >
                      {AUDIENCE_LABELS[item.audienceBlock.audience] ?? item.audienceBlock.audience}
                    </div>
                    <p className="text-[0.9rem] text-tan leading-[1.75] whitespace-pre-line">
                      {item.audienceBlock.body}
                    </p>
                  </div>
                )}

                {item.link && (
                  <a
                    href={item.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[0.8rem] text-gold border border-gold px-4 py-2 mt-3 no-underline transition-all duration-200 hover:bg-gold hover:text-bg"
                  >
                    {item.link.text} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function BriefingDetail({ briefing }: { briefing: Briefing }) {
  return (
    <article className="max-w-[760px] mx-auto">
      {/* Back link */}
      <Link
        href="/briefing"
        className="inline-flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-muted no-underline mb-10 transition-colors duration-200 hover:text-tan"
      >
        ← Back to Briefing
      </Link>

      {/* Header */}
      <header className="mb-12 pb-10 border-b border-border">
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
                {AUDIENCE_LABELS[aud]?.replace("For ", "") ?? aud}
              </span>
            ))}
          </div>
        </div>

        <h1
          className="font-display font-bold leading-[1.1] text-white mb-6"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          dangerouslySetInnerHTML={{ __html: briefing.headline }}
        />

        <p className="text-[1.05rem] text-tan leading-[1.8] mb-8">
          {briefing.lede}
        </p>

        {briefing.in_this_issue.length > 0 && (
          <div className="bg-surface border border-border p-6 relative">
            <div className="absolute top-0 left-0 w-[3px] h-full bg-gold" />
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
      </header>

      {/* Content */}
      <ContentSections content={briefing.content_json} />
    </article>
  );
}
