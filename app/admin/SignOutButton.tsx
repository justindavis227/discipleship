"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <button
      onClick={signOut}
      className="border border-border text-muted text-[0.75rem] font-semibold tracking-[0.1em] uppercase px-5 py-[0.6rem] transition-all duration-200 hover:border-gold hover:text-gold bg-transparent cursor-pointer"
    >
      Sign Out
    </button>
  );
}
