import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { Briefing } from "@/lib/types/briefing";

type BriefingEmailBriefing = Pick<
  Briefing,
  "slug" | "issue_number" | "week_of" | "headline" | "lede" | "in_this_issue" | "audiences"
>;

interface BriefingEmailProps {
  briefing: BriefingEmailBriefing;
  unsubUrl: string;
  siteUrl: string;
}

const AUDIENCE_LABELS: Record<string, string> = {
  parent: "Parents",
  leader: "Leaders",
  student: "Students",
};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

function formatWeekOf(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BriefingEmail({ briefing, unsubUrl, siteUrl }: BriefingEmailProps) {
  const readUrl = `${siteUrl}/briefing/${briefing.slug}`;
  const audienceList = briefing.audiences.map((a) => AUDIENCE_LABELS[a] ?? a).join(", ");
  const previewText = stripHtml(briefing.headline);

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Gold top bar */}
          <Section style={topBar} />

          {/* Header */}
          <Section style={headerSection}>
            <Text style={eyebrow}>The Next Gen Briefing</Text>
            <Text style={issueLabel}>
              Issue #{briefing.issue_number} &nbsp;·&nbsp; Week of {formatWeekOf(briefing.week_of)}
            </Text>
            {audienceList && (
              <Text style={audiencePill}>For: {audienceList}</Text>
            )}
          </Section>

          {/* Headline */}
          <Section style={headlineSection}>
            <Text style={dividerLine}>——</Text>
            <Text style={headlineText}>{stripHtml(briefing.headline)}</Text>
          </Section>

          {/* Lede */}
          <Section style={contentSection}>
            <Text style={paragraph}>{briefing.lede}</Text>
          </Section>

          {/* In This Issue */}
          {briefing.in_this_issue.length > 0 && (
            <Section style={inThisIssueSection}>
              <Text style={inThisIssueLabel}>In This Issue</Text>
              {briefing.in_this_issue.map((item, i) => (
                <Text key={i} style={bulletItem}>
                  — {item}
                </Text>
              ))}
            </Section>
          )}

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={readUrl}>
              Read the Full Briefing →
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Southeast Christian Church · Next Gen Ministry
              <br />
              Louisville, KY
            </Text>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed to The Next Gen Briefing.
            </Text>
            <Text style={footerText}>
              <Link style={footerLink} href={unsubUrl}>
                Unsubscribe
              </Link>
              {" "}· One click, no login needed.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#0f0e0c",
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#1a1815",
  border: "1px solid #2e2b26",
  maxWidth: "560px",
  margin: "0 auto",
};

const topBar: React.CSSProperties = {
  backgroundColor: "#d4a843",
  height: "3px",
  width: "100%",
};

const headerSection: React.CSSProperties = {
  padding: "36px 40px 20px",
};

const eyebrow: React.CSSProperties = {
  color: "#d4a843",
  fontSize: "11px",
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  margin: "0 0 8px",
};

const issueLabel: React.CSSProperties = {
  color: "#7a7368",
  fontSize: "12px",
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.1em",
  margin: "0 0 10px",
};

const audiencePill: React.CSSProperties = {
  color: "#c8b89a",
  fontSize: "11px",
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: 0,
  padding: "6px 12px",
  backgroundColor: "#222019",
  border: "1px solid #2e2b26",
  display: "inline-block",
};

const headlineSection: React.CSSProperties = {
  padding: "0 40px 24px",
};

const dividerLine: React.CSSProperties = {
  color: "#d4a843",
  fontSize: "14px",
  margin: "0 0 14px",
  letterSpacing: "0.1em",
};

const headlineText: React.CSSProperties = {
  color: "#f5f0e8",
  fontSize: "26px",
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontWeight: 700,
  lineHeight: 1.25,
  margin: 0,
};

const contentSection: React.CSSProperties = {
  padding: "0 40px 24px",
};

const paragraph: React.CSSProperties = {
  color: "#c8b89a",
  fontSize: "15px",
  lineHeight: 1.75,
  margin: 0,
};

const inThisIssueSection: React.CSSProperties = {
  padding: "0 40px 28px",
};

const inThisIssueLabel: React.CSSProperties = {
  color: "#7a7368",
  fontSize: "11px",
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  margin: "0 0 12px",
};

const bulletItem: React.CSSProperties = {
  color: "#ddd0bb",
  fontSize: "14px",
  lineHeight: 1.6,
  margin: "0 0 6px",
};

const ctaSection: React.CSSProperties = {
  padding: "4px 40px 36px",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#d4a843",
  color: "#0f0e0c",
  fontSize: "13px",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  textDecoration: "none",
  padding: "14px 32px",
  display: "inline-block",
};

const divider: React.CSSProperties = {
  borderColor: "#2e2b26",
  margin: "0 40px",
};

const footer: React.CSSProperties = {
  padding: "24px 40px 32px",
};

const footerText: React.CSSProperties = {
  color: "#7a7368",
  fontSize: "12px",
  lineHeight: 1.6,
  margin: "0 0 10px",
};

const footerLink: React.CSSProperties = {
  color: "#9a7830",
  textDecoration: "underline",
};
