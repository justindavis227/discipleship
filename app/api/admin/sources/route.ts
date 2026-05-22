import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
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

  if (!body.name || !body.url || !body.category) {
    return Response.json({ error: "name, url, and category are required." }, { status: 400 });
  }

  const payload = {
    name: String(body.name).trim(),
    url: String(body.url).trim(),
    rss_url: body.rss_url ? String(body.rss_url).trim() : null,
    category: body.category as string,
    notes: body.notes ? String(body.notes).trim() : null,
    active: body.active !== false,
  };

  const { data, error } = await supabaseAdmin
    .from("sources")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("[admin/sources POST]", error);
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

  const payload = {
    name: String(body.name ?? "").trim(),
    url: String(body.url ?? "").trim(),
    rss_url: body.rss_url ? String(body.rss_url).trim() : null,
    category: body.category as string,
    notes: body.notes ? String(body.notes).trim() : null,
    active: body.active !== false,
  };

  const { error } = await supabaseAdmin
    .from("sources")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("[admin/sources PATCH]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
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

  const { error } = await supabaseAdmin
    .from("sources")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin/sources DELETE]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
