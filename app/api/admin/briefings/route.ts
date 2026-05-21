import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function buildPayload(body: Record<string, unknown>, includePublishedAt: boolean, existingPublishedAt?: string | null) {
  const status = (body.status as string) ?? "draft";
  let publishedAt: string | null = null;
  if (status === "published") {
    publishedAt = existingPublishedAt ?? new Date().toISOString();
  }

  return {
    slug: String(body.slug ?? "").trim(),
    week_of: body.week_of as string,
    issue_number: Number(body.issue_number),
    title: String(body.title ?? "").trim(),
    headline: String(body.headline ?? "").trim(),
    lede: String(body.lede ?? "").trim(),
    in_this_issue: Array.isArray(body.in_this_issue) ? body.in_this_issue : [],
    audiences: Array.isArray(body.audiences) ? body.audiences : [],
    topic_tags: Array.isArray(body.topic_tags) ? body.topic_tags : [],
    content_json: (body.content_json as object) ?? { sections: [] },
    status,
    ...(includePublishedAt && { published_at: publishedAt }),
  };
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.slug || !body.week_of || !body.issue_number || !body.title || !body.headline || !body.lede) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  const payload = buildPayload(body, true);

  const { data, error } = await supabaseAdmin
    .from("briefings")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("[admin/briefings POST]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ id: data.id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = body.id as string;
  if (!id) return Response.json({ error: "id is required." }, { status: 400 });

  // Fetch existing published_at so we never overwrite it once set
  const { data: existing } = await supabaseAdmin
    .from("briefings")
    .select("published_at")
    .eq("id", id)
    .single();

  const payload = {
    ...buildPayload(body, true, existing?.published_at),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("briefings")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("[admin/briefings PATCH]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
