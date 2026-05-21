import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: subscriber } = await supabaseAdmin
    .from("subscribers")
    .select("id, status")
    .eq("confirm_token", token)
    .maybeSingle();

  let status: "confirmed" | "already" | "invalid" = "invalid";

  if (subscriber?.status === "confirmed") {
    status = "already";
  } else if (subscriber?.status === "pending") {
    const { error } = await supabaseAdmin
      .from("subscribers")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id)
      .eq("status", "pending");

    status = error ? "invalid" : "confirmed";
  }

  return (
    <main className="pt-[8rem] pb-[8rem] px-12 max-w-[800px] mx-auto max-[600px]:px-6 max-[600px]:pt-[7rem]">
      <div className="bg-surface border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[3px] h-full bg-gold" />
        <div className="p-12 max-[600px]:p-8">

          {status === "confirmed" && (
            <>
              <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-5">
                <span className="block w-6 h-px bg-gold shrink-0" />
                You&apos;re In
              </div>
              <h1 className="font-display font-bold text-white leading-[1.1] mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
                Subscription confirmed.
              </h1>
              <p className="text-[1rem] text-tan leading-[1.75] mb-8 max-w-[520px]">
                Welcome to The Next Gen Briefing. You&apos;ll hear from us each week
                with research, culture, and Scripture-rooted perspective for next
                gen leaders.
              </p>
              <Link
                href="/briefing"
                className="inline-flex items-center gap-2 py-[0.85rem] px-8 bg-gold text-[#0f0e0c] no-underline text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-tan-light"
              >
                Read the Latest Briefing →
              </Link>
            </>
          )}

          {status === "already" && (
            <>
              <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-5">
                <span className="block w-6 h-px bg-gold shrink-0" />
                Already Confirmed
              </div>
              <h1 className="font-display font-bold text-white leading-[1.1] mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
                You&apos;re already subscribed.
              </h1>
              <p className="text-[1rem] text-tan leading-[1.75] mb-8 max-w-[520px]">
                This email address is already confirmed. Check your inbox for the
                latest issue.
              </p>
              <Link
                href="/briefing"
                className="inline-flex items-center gap-2 py-[0.85rem] px-8 bg-gold text-[#0f0e0c] no-underline text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-tan-light"
              >
                Go to Briefing →
              </Link>
            </>
          )}

          {status === "invalid" && (
            <>
              <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-muted mb-5">
                <span className="block w-6 h-px bg-muted shrink-0" />
                Link Invalid
              </div>
              <h1 className="font-display font-bold text-white leading-[1.1] mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
                This link isn&apos;t valid.
              </h1>
              <p className="text-[1rem] text-tan leading-[1.75] mb-8 max-w-[520px]">
                This confirmation link may have expired or already been used.
                Subscribe again to get a fresh link.
              </p>
              <Link
                href="/briefing"
                className="inline-flex items-center gap-2 py-[0.85rem] px-8 border border-border text-tan no-underline text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all duration-200 hover:border-gold hover:text-gold"
              >
                Back to Briefing →
              </Link>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
