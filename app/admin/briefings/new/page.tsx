import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import BriefingForm from "../BriefingForm";

export default async function NewBriefingPage() {
  const { data } = await supabaseAdmin
    .from("briefings")
    .select("issue_number")
    .order("issue_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const defaultIssueNumber = (data?.issue_number ?? 0) + 1;

  return (
    <main className="min-h-screen px-12 pt-[5rem] pb-[8rem] max-w-[900px] mx-auto max-[900px]:px-6">
      <div className="mb-10">
        <Link
          href="/admin/briefings"
          className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-muted hover:text-gold transition-colors duration-200 mb-4 no-underline"
        >
          ← Briefings
        </Link>
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-3 ml-6">
          <span className="block w-6 h-px bg-gold shrink-0" />
          New Issue
        </div>
        <h1
          className="font-display font-bold text-white leading-[1.1]"
          style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}
        >
          Create Briefing
        </h1>
      </div>

      <BriefingForm defaultIssueNumber={defaultIssueNumber} />
    </main>
  );
}
