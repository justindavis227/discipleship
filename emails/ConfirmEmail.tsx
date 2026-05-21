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

const AUDIENCE_LABELS: Record<string, string> = {
  parent: "Parents",
  leader: "Leaders",
  student: "Students",
};

interface ConfirmEmailProps {
  confirmUrl: string;
  unsubUrl: string;
  audiences: string[];
}

export default function ConfirmEmail({
  confirmUrl,
  unsubUrl,
  audiences,
}: ConfirmEmailProps) {
  const audienceList = audiences
    .map((a) => AUDIENCE_LABELS[a] ?? a)
    .join(", ");

  return (
    <Html lang="en">
      <Head />
      <Preview>Confirm your subscription to The Next Gen Briefing</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Gold top bar */}
          <Section style={topBar} />

          {/* Header */}
          <Section style={header}>
            <Text style={eyebrow}>The Next Gen Briefing</Text>
            <Text style={heading}>One click to confirm.</Text>
          </Section>

          {/* Body */}
          <Section style={contentSection}>
            <Text style={paragraph}>
              You asked to subscribe to The Next Gen Briefing — weekly research,
              culture, and Scripture-rooted perspective for next gen leaders.
            </Text>

            {audienceList && (
              <Text style={audienceLine}>
                Tracks selected:{" "}
                <span style={{ color: "#d4a843" }}>{audienceList}</span>
              </Text>
            )}

            <Text style={paragraph}>
              Click the button below to confirm your email address and activate
              your subscription. This link expires in 7 days.
            </Text>

            <Section style={buttonWrapper}>
              <Button style={button} href={confirmUrl}>
                Yes, Subscribe Me →
              </Button>
            </Section>

            <Text style={smallNote}>
              If the button doesn&apos;t work, copy and paste this link into your
              browser:
            </Text>
            <Link style={rawLink} href={confirmUrl}>
              {confirmUrl}
            </Link>
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
              You&apos;re receiving this because someone entered this email address
              on our site. If that wasn&apos;t you, you can safely ignore this
              message — you won&apos;t receive anything further.
            </Text>
            <Text style={footerText}>
              Already confirmed?{" "}
              <Link style={footerLink} href={unsubUrl}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#0f0e0c",
  fontFamily: "'Georgia', 'Times New Roman', serif",
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

const header: React.CSSProperties = {
  padding: "40px 40px 24px",
};

const eyebrow: React.CSSProperties = {
  color: "#d4a843",
  fontSize: "11px",
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  margin: "0 0 16px",
};

const heading: React.CSSProperties = {
  color: "#f5f0e8",
  fontSize: "28px",
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
};

const contentSection: React.CSSProperties = {
  padding: "0 40px 32px",
};

const paragraph: React.CSSProperties = {
  color: "#c8b89a",
  fontSize: "15px",
  lineHeight: 1.7,
  margin: "0 0 16px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const audienceLine: React.CSSProperties = {
  color: "#c8b89a",
  fontSize: "13px",
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.05em",
  margin: "0 0 20px",
  padding: "10px 14px",
  backgroundColor: "#222019",
  border: "1px solid #2e2b26",
};

const buttonWrapper: React.CSSProperties = {
  margin: "28px 0",
};

const button: React.CSSProperties = {
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

const smallNote: React.CSSProperties = {
  color: "#7a7368",
  fontSize: "12px",
  margin: "0 0 6px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const rawLink: React.CSSProperties = {
  color: "#9a7830",
  fontSize: "12px",
  wordBreak: "break-all",
  fontFamily: "Arial, Helvetica, sans-serif",
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
  fontFamily: "Arial, Helvetica, sans-serif",
};

const footerLink: React.CSSProperties = {
  color: "#9a7830",
  textDecoration: "underline",
};
