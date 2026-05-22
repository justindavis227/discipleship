import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Source } from "@/lib/types/source";
import SourceForm from "../../SourceForm";

export default async function EditSourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("sources")
    .select("*")
    .eq("id", id)
    .maybeSingle<Source>();

  if (!data) notFound();

  return (
    <main className="min-h-screen px-12 pt-[5rem] pb-[8rem] max-w-[900px] mx-auto max-[900px]:px-6">
      <div className="mb-10">
        <Link
          href="/admin/sources"
          className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-muted hover:text-gold transition-colors duration-200 mb-4 no-underline"
        >
          ← Sources
        </Link>
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-3 ml-6">
          <span className="block w-6 h-px bg-gold shrink-0" />
          Edit Source
        </div>
        <h1
          className="font-display font-bold text-white leading-[1.1]"
          style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}
        >
          {data.name}
        </h1>
        <p className="text-[0.85rem] text-muted mt-1">{data.url}</p>
      </div>

      <SourceForm initialData={data} />
    </main>
  );
}
