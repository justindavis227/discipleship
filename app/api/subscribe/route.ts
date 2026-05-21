import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import ConfirmEmail from "@/emails/ConfirmEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_AUDIENCES = new Set(["parent", "leader", "student"]);

export async function POST(request: Request) {
  try {
    return await handleSubscribe(request);
  } catch (err) {
    console.error("[subscribe] UNHANDLED EXCEPTION:", err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: "Unhandled error", detail: message }, { status: 500 });
  }
}

async function handleSubscribe(request: Request) {
  let email: string;
  let audiences: string[];

  try {
    const body = await request.json();
    email = (body.email ?? "").trim().toLowerCase();
    audiences = Array.isArray(body.audiences) ? body.audiences : [];
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const filteredAudiences = audiences.filter((a) => VALID_AUDIENCES.has(a));
  if (filteredAudiences.length === 0) {
    return Response.json({ error: "Select at least one audience track." }, { status: 400 });
  }

  // Step 1: check existing
  console.log("[subscribe] checking existing for", email);
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) console.error("[subscribe] lookup error:", lookupError);

  if (existing?.status === "confirmed") {
    return Response.json({ ok: true });
  }

  const confirmToken = crypto.randomUUID();

  if (existing) {
    // Step 2a: update existing
    console.log("[subscribe] updating existing row id:", existing.id);
    const { error } = await supabaseAdmin
      .from("subscribers")
      .update({ audience_prefs: filteredAudiences, status: "pending", confirm_token: confirmToken })
      .eq("id", existing.id);

    if (error) {
      console.error("[subscribe] update error:", error);
      return Response.json({ error: "DB update failed", detail: error.message }, { status: 500 });
    }
  } else {
    // Step 2b: insert new
    console.log("[subscribe] inserting new subscriber");
    const { error } = await supabaseAdmin
      .from("subscribers")
      .insert({ email, audience_prefs: filteredAudiences, status: "pending", confirm_token: confirmToken });

    if (error) {
      console.error("[subscribe] insert error:", error);
      return Response.json({ error: "DB insert failed", detail: error.message }, { status: 500 });
    }
  }

  // Step 3: fetch unsub_token
  console.log("[subscribe] fetching unsub_token");
  const { data: sub, error: subError } = await supabaseAdmin
    .from("subscribers")
    .select("unsub_token")
    .eq("email", email)
    .single();

  if (subError) console.error("[subscribe] unsub_token fetch error:", subError);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const confirmUrl = `${siteUrl}/confirm/${confirmToken}`;
  const unsubUrl = `${siteUrl}/unsubscribe/${sub?.unsub_token ?? ""}`;

  console.log("[subscribe] sending email via Resend to", email);
  console.log("[subscribe] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
  console.log("[subscribe] RESEND_FROM_EMAIL:", process.env.RESEND_FROM_EMAIL);

  const { data: emailData, error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Confirm your subscription to The Next Gen Briefing",
    react: ConfirmEmail({ confirmUrl, unsubUrl, audiences: filteredAudiences }),
  });

  if (emailError) {
    console.error("[subscribe] Resend error:", emailError);
    return Response.json({ error: "Email send failed", detail: JSON.stringify(emailError) }, { status: 500 });
  }

  console.log("[subscribe] email sent, id:", emailData?.id);
  return Response.json({ ok: true });
}
