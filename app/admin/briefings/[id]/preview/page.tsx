export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Briefing } from "@/lib/types/briefing";
import BriefingDetail from "@/app/components/briefing/BriefingDetail";

export default async function BriefingPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabaseAdmin
    .from("briefings")
    .select("*")
    .eq("id", id)
    .maybeSingle<Briefing>();

  if (!data) notFound();

  return (
    <>
      {/* Draft preview banner */}
      <div className="sticky top-0 z-50 bg-[#0f0e0c] border-b border-gold/30 px-8 py-[0.65rem] flex items-center justify-between gap-4 max-[900px]:px-4">
        <div className="flex items-center gap-3">
          <span className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-gold">
            Draft Preview
          </span>
          <span className="w-px h-3 bg-border shrink-0" />
          <span className="text-[0.72rem] font-mono text-muted">
            {data.status === "published" ? "published" : "not published"}
          </span>
        </div>
        <Link
          href={`/admin/briefings/${id}/edit`}
          className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors duration-200 no-underline whitespace-nowrap"
        >
          ← Edit
        </Link>
      </div>

      <main className="pt-[5rem] pb-[6rem] px-12 max-[900px]:px-6 max-[900px]:pt-[4rem]">
        <BriefingDetail briefing={data} />
      </main>
    </>
  );
}
