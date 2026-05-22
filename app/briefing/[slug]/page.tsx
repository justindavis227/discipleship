export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import type { Briefing } from "@/lib/types/briefing";
import BriefingDetail from "@/app/components/briefing/BriefingDetail";

type Params = Promise<{ slug: string }>;

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicClient();

  const { data } = await supabase
    .from("briefings")
    .select("title, lede, slug")
    .eq("slug", slug)
    .eq("status", "published")
    .single<Pick<Briefing, "title" | "lede" | "slug">>();

  const title = data?.title ?? "The Next Gen Briefing";
  const description = data
    ? stripHtml(data.lede).slice(0, 300)
    : "Weekly insights for next gen leaders — research, culture, and Scripture-rooted perspective.";
  const url = data ? `/briefing/${data.slug}` : "/briefing";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    title: `${title} | The Next Gen Briefing`,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BriefingSlugPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("briefings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single<Briefing>();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="pt-[8rem] pb-[6rem] px-12 max-[900px]:px-6 max-[900px]:pt-[7rem]">
      <BriefingDetail briefing={data} />
    </main>
  );
}
