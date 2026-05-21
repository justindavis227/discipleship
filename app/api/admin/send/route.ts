import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import BriefingEmail from "@/emails/BriefingEmail";
import type { Briefing } from "@/lib/types/briefing";

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let briefingId: string;
  try {
    const body = await request.json();
    briefingId = body.briefingId;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!briefingId) {
    return Response.json({ error: "briefingId is required." }, { status: 400 });
  }

  // Load briefing
  const { data: briefing, error: briefingError } = await supabaseAdmin
    .from("briefings")
    .select("id, slug, issue_number, week_of, headline, lede, in_this_issue, audiences, title, status")
    .eq("id", briefingId)
    .single<Pick<Briefing, "id" | "slug" | "issue_number" | "week_of" | "headline" | "lede" | "in_this_issue" | "audiences" | "title" | "status">>();

  if (briefingError || !briefing) {
    return Response.json({ error: "Briefing not found." }, { status: 404 });
  }

  if (briefing.status !== "published") {
    return Response.json({ error: "Only published briefings can be sent." }, { status: 400 });
  }

  // Load matching confirmed subscribers
  const { data: subscribers, error: subError } = await supabaseAdmin
    .from("subscribers")
    .select("email, unsub_token")
    .eq("status", "confirmed")
    .overlaps("audience_prefs", briefing.audiences);

  if (subError) {
    console.error("[admin/send] subscriber query error:", subError);
    return Response.json({ error: "Failed to load subscribers." }, { status: 500 });
  }

  if (!subscribers || subscribers.length === 0) {
    return Response.json({ sent: 0, message: "No matching confirmed subscribers." });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const subject = `The Next Gen Briefing #${briefing.issue_number} — ${stripHtml(briefing.headline)}`;

  // Send in batches of 100 (Resend limit per batch call)
  const batches = chunk(subscribers, 100);
  let sent = 0;
  const errors: string[] = [];

  for (const batch of batches) {
    const { data, error } = await resend.batch.send(
      batch.map((sub) => ({
        from: process.env.RESEND_FROM_EMAIL!,
        to: sub.email,
        subject,
        react: BriefingEmail({
          briefing,
          unsubUrl: `${siteUrl}/unsubscribe/${sub.unsub_token}`,
          siteUrl,
        }),
      }))
    );

    if (error) {
      console.error("[admin/send] batch error:", error);
      errors.push(typeof error === "object" ? JSON.stringify(error) : String(error));
    } else {
      sent += data?.data?.length ?? batch.length;
    }
  }

  if (errors.length > 0 && sent === 0) {
    return Response.json({ error: "Send failed.", detail: errors[0] }, { status: 500 });
  }

  return Response.json({ sent, errors: errors.length > 0 ? errors : undefined });
}
