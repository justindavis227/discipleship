export const dynamic = "force-dynamic";

import { createPublicClient } from "@/lib/supabase/public";
import type { Briefing } from "@/lib/types/briefing";

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function toRFC822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const supabase = createPublicClient();

  const { data } = await supabase
    .from("briefings")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const briefings = (data ?? []) as Briefing[];

  const items = briefings
    .map((b) => {
      const url = `${siteUrl}/briefing/${b.slug}`;
      const title = xmlEscape(stripHtml(b.title));
      const description = xmlEscape(stripHtml(b.lede));
      const pubDate = toRFC822(b.published_at ?? b.created_at);
      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${url}</guid>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Next Gen Briefing</title>
    <link>${siteUrl}/briefing</link>
    <description>Weekly insights for next gen leaders — research, culture, and Scripture-rooted perspective curated for parents, leaders, and students.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/briefing/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
