export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Briefing } from "@/lib/types/briefing";
import BriefingFeature from "@/app/components/briefing/BriefingFeature";
import ArchiveList from "@/app/components/briefing/ArchiveList";
import AudienceFilter from "@/app/components/briefing/AudienceFilter";
import SubscribeForm from "@/app/components/briefing/SubscribeForm";

type SearchParams = Promise<{ audience?: string }>;

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
};

export default async function BriefingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { audience } = await searchParams;
  const supabase = createPublicClient();

  // Always show the latest published briefing as the feature
  const { data: latest } = await supabase
    .from("briefings")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single<Briefing>();

  // Archive: all published except latest, filtered by audience if set
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

  const { data: archive } = await archiveQuery;
  const archiveBriefings = (archive ?? []) as Briefing[];

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
        <div className="flex items-center justify-between gap-6 mb-6 flex-wrap">
          <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold">
            <span className="block w-6 h-px bg-gold shrink-0" />
            Archive
          </div>
          <Suspense fallback={null}>
            <AudienceFilter />
          </Suspense>
        </div>

        <div className="border-t border-border">
          <ArchiveList briefings={archiveBriefings} />
        </div>
      </div>

      <SubscribeForm />
    </main>
  );
}
