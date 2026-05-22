import { createClient } from "@supabase/supabase-js";

// Plain supabase-js client for public, unauthenticated Server Component reads.
// Uses no cookies, no session management — safe to call from any Server Component
// in Next.js 16 production where writing response headers is forbidden.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
