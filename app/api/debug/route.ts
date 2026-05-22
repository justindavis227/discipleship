export const dynamic = "force-dynamic";

import { createPublicClient } from "@/lib/supabase/public";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("briefings")
    .select("id,slug,status")
    .eq("status", "published");

  return Response.json({
    env: {
      urlPresent: !!url,
      urlValue: url ?? null,
      urlLength: url?.length ?? 0,
      keyPresent: !!key,
      keyLength: key?.length ?? 0,
      keyFirst10: key?.slice(0, 10) ?? null,
    },
    query: {
      data: data ?? null,
      error: error
        ? {
            message: error.message,
            code: (error as unknown as Record<string, unknown>).code ?? null,
            details: (error as unknown as Record<string, unknown>).details ?? null,
            hint: (error as unknown as Record<string, unknown>).hint ?? null,
          }
        : null,
    },
  });
}
