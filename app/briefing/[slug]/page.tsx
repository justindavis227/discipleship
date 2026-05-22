export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import type { Briefing } from "@/lib/types/briefing";
import BriefingDetail from "@/app/components/briefing/BriefingDetail";

type Params = Promise<{ slug: string }>;

export default async function BriefingSlugPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const supabase = await createPublicClient();

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
