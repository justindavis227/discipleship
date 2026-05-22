export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import Parser from "rss-parser";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import CollectClient from "./CollectClient";
import type { SourceResult, FeedItem } from "./CollectClient";

type SourceRow = { id: string; name: string; rss_url: string };

export default async function CollectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabaseAdmin
    .from("sources")
    .select("id, name, rss_url")
    .eq("active", true)
    .not("rss_url", "is", null)
    .order("name", { ascending: true });

  const sources = (data ?? []) as SourceRow[];

  const parser = new Parser({
    timeout: 8000,
    headers: { "User-Agent": "NextGenBriefing/1.0 (+https://discipleship-one.vercel.app)" },
  });

  const settled = await Promise.allSettled(
    sources.map(async (source): Promise<SourceResult> => {
      const feed = await parser.parseURL(source.rss_url);
      const items: FeedItem[] = feed.items.slice(0, 5).map((item) => ({
        title: (item.title ?? "").trim() || "(no title)",
        link: item.link ?? "",
        isoDate: item.isoDate ?? item.pubDate ?? "",
        contentSnippet: (item.contentSnippet ?? "").slice(0, 400).trim(),
      }));
      return { sourceId: source.id, sourceName: source.name, ok: true, items };
    })
  );

  const results: SourceResult[] = settled.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    const msg = result.reason instanceof Error ? result.reason.message : "Unknown error";
    return { sourceId: sources[i].id, sourceName: sources[i].name, ok: false, error: msg };
  });

  const loaded = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  return (
    <main className="min-h-screen px-12 pt-[5rem] pb-[8rem] max-w-[1000px] mx-auto max-[900px]:px-6">
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
          Collect
        </h1>
        <p className="text-[0.88rem] text-muted mt-2 max-w-[560px]">
          Pull the latest from your vetted RSS sources, select what's relevant, and copy a
          formatted prompt to bring to Claude for drafting.
        </p>
        {sources.length > 0 && (
          <div className="flex items-center gap-4 mt-3 text-[0.72rem] font-mono text-muted flex-wrap">
            <span>{sources.length} source{sources.length !== 1 ? "s" : ""} with RSS</span>
            {loaded > 0 && <span className="text-aud-parent">{loaded} loaded</span>}
            {failed > 0 && <span className="text-red-400/70">{failed} failed</span>}
          </div>
        )}
      </div>

      <CollectClient results={results} />
    </main>
  );
}
