export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Briefing } from "@/lib/types/briefing";
import BriefingFeature from "@/app/components/briefing/BriefingFeature";
import ArchiveList from "@/app/components/briefing/ArchiveList";
import AudienceFilter from "@/app/components/briefing/AudienceFilter";
import TagFilter from "@/app/components/briefing/TagFilter";
import SearchBox from "@/app/components/briefing/SearchBox";
import SubscribeForm from "@/app/components/briefing/SubscribeForm";

type SearchParams = Promise<{ audience?: string; q?: string; tag?: string }>;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "The Next Gen Briefing | se.church Next Gen",
  description:
    "Weekly insights for next gen leaders — research, culture, and Scripture-rooted perspective curated for parents, leaders, and students.",
  openGraph: {
    title: "The Next Gen Briefing",
    description:
      "Weekly insights for next gen leaders — research, culture, and Scripture-rooted perspective curated for parents, leaders, and students.",
    url: "/briefing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Next Gen Briefing",
    description:
      "Weekly insights for next gen leaders — research, culture, and Scripture-rooted perspective curated for parents, leaders, and students.",
  },
  alternates: {
    types: {
      "application/rss+xml": "/briefing/rss.xml",
    },
  },
};

// Strip characters that would break PostgREST's .or() filter string
function sanitizeQ(raw: string) {
  return raw.trim().replace(/[,()]/g, "");
}

export default async function BriefingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { audience, q: rawQ, tag } = await searchParams;
  const q = rawQ ? sanitizeQ(rawQ) : "";
  const supabase = createPublicClient();

  // Latest published briefing (feature card — never filtered)
  const { data: latest } = await supabase
    .from("briefings")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single<Briefing>();

  // Tag vocabulary: distinct tags from ALL archived briefings, no filters applied
  // so tag pills stay visible regardless of other active filters
  let tagVocabQuery = supabase
    .from("briefings")
    .select("topic_tags")
    .eq("status", "published");
  if (latest) {
    tagVocabQuery = tagVocabQuery.neq("id", latest.id);
  }
  const { data: tagRows } = await tagVocabQuery;
  const allTags = Array.from(
    new Set((tagRows ?? []).flatMap((r: { topic_tags: string[] }) => r.topic_tags ?? []))
  ).sort();

  // Archive list — compose all three filters
  let archiveQuery = supabase
    .from("briefings")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (latest) {
    archiveQuery = archiveQuery.neq("id", latest.id);
  }
  if (audience) {
    archiveQuery = archiveQuery.contains("audiences", [audience]);
  }
  if (q) {
    archiveQuery = archiveQuery.or(`title.ilike.%${q}%,headline.ilike.%${q}%`);
  }
  if (tag) {
    archiveQuery = archiveQuery.contains("topic_tags", [tag]);
  }

  const { data: archive } = await archiveQuery;
  const archiveBriefings = (archive ?? []) as Briefing[];

  const hasFilters = !!(audience || q || tag);

  return (
    <main className="pt-[8rem] pb-[6rem] px-12 max-w-[1200px] mx-auto max-[900px]:px-6 max-[900px]:pt-[7rem]">
      {/* Page header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
          <span className="block w-6 h-px bg-gold shrink-0" />
          The Next Gen Briefing
        </div>
        <h1
          className="font-display font-bold text-white leading-[1.1] mb-4"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
        >
          Weekly insights for<br />
          <em className="italic text-tan">next gen leaders.</em>
        </h1>
        <p className="text-[1rem] text-tan leading-[1.7] max-w-[560px]">
          Research, culture, and Scripture-rooted perspective — curated each week for parents, leaders, and students.
        </p>
      </div>

      {/* Feature card */}
      {latest ? (
        <div className="mb-16">
          <BriefingFeature briefing={latest} />
        </div>
      ) : (
        <div className="bg-surface border border-border p-10 mb-16 text-center">
          <p className="text-muted text-[0.95rem]">
            The first briefing is coming soon.
          </p>
        </div>
      )}

      {/* Archive */}
      <div>
        {/* Search */}
        <div className="mb-5">
          <Suspense fallback={null}>
            <SearchBox />
          </Suspense>
        </div>

        {/* Filter row */}
        <div className="flex items-start justify-between gap-6 mb-6 flex-wrap">
          <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mt-[0.45rem]">
            <span className="block w-6 h-px bg-gold shrink-0" />
            Archive
            {hasFilters && (
              <span className="text-muted normal-case tracking-normal font-normal text-[0.78rem]">
                ({archiveBriefings.length} result{archiveBriefings.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <Suspense fallback={null}>
              <AudienceFilter />
            </Suspense>
            {allTags.length > 0 && (
              <Suspense fallback={null}>
                <TagFilter tags={allTags} />
              </Suspense>
            )}
          </div>
        </div>

        <div className="border-t border-border">
          <ArchiveList briefings={archiveBriefings} />
        </div>
      </div>

      <SubscribeForm />
    </main>
  );
}
