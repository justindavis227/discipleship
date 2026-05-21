import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: subscriber } = await supabaseAdmin
    .from("subscribers")
    .select("id, status")
    .eq("unsub_token", token)
    .maybeSingle();

  let status: "unsubscribed" | "already" | "invalid" = "invalid";

  if (subscriber?.status === "unsubscribed") {
    status = "already";
  } else if (subscriber) {
    const { error } = await supabaseAdmin
      .from("subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id);

    status = error ? "invalid" : "unsubscribed";
  }

  return (
    <main className="pt-[8rem] pb-[8rem] px-12 max-w-[800px] mx-auto max-[600px]:px-6 max-[600px]:pt-[7rem]">
      <div className="bg-surface border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[3px] h-full bg-border" />
        <div className="p-12 max-[600px]:p-8">

          {(status === "unsubscribed" || status === "already") && (
            <>
              <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-muted mb-5">
                <span className="block w-6 h-px bg-muted shrink-0" />
                Unsubscribed
              </div>
              <h1 className="font-display font-bold text-white leading-[1.1] mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
                You&apos;ve been removed.
              </h1>
              <p className="text-[1rem] text-tan leading-[1.75] mb-8 max-w-[520px]">
                {status === "already"
                  ? "This address was already unsubscribed. You won't receive any further emails."
                  : "You've been unsubscribed from The Next Gen Briefing. You won't receive any further emails from us."}
              </p>
              <p className="text-[0.85rem] text-muted mb-8">
                Changed your mind?{" "}
                <Link href="/briefing" className="text-gold hover:text-tan-light underline-offset-2 underline transition-colors duration-200">
                  Subscribe again
                </Link>{" "}
                anytime.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 py-[0.85rem] px-8 border border-border text-tan no-underline text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all duration-200 hover:border-gold hover:text-gold"
              >
                Back to Home →
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
                This unsubscribe link doesn&apos;t match any active subscription. It
                may have already been used.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 py-[0.85rem] px-8 border border-border text-tan no-underline text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all duration-200 hover:border-gold hover:text-gold"
              >
                Back to Home →
              </Link>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
