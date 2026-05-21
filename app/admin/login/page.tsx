"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type State = "idle" | "loading" | "sent" | "error";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setState("error");
    } else {
      setState("sent");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-[420px]">
        <div className="bg-surface border border-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold" />

          <div className="p-10">
            <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-5">
              <span className="block w-6 h-px bg-gold shrink-0" />
              Admin Access
            </div>

            {state === "sent" ? (
              <>
                <h1 className="font-display font-bold text-white text-[1.6rem] leading-[1.2] mb-3">
                  Check your email.
                </h1>
                <p className="text-[0.92rem] text-tan leading-[1.7]">
                  A login link was sent to{" "}
                  <span className="text-tan-light">{email}</span>. Click it to
                  sign in — no password needed.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display font-bold text-white text-[1.6rem] leading-[1.2] mb-2">
                  Sign in.
                </h1>
                <p className="text-[0.88rem] text-muted mb-8">
                  Enter your email and we&apos;ll send a magic link.
                </p>

                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface2 border border-border text-white placeholder:text-muted text-[0.9rem] px-4 py-[0.85rem] outline-none focus:border-gold transition-colors duration-200 mb-4"
                  />

                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="w-full bg-gold text-[#0f0e0c] text-[0.8rem] font-bold tracking-[0.1em] uppercase py-[0.85rem] transition-all duration-200 hover:bg-tan-light disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {state === "loading" ? "Sending…" : "Send Magic Link"}
                  </button>

                  {state === "error" && (
                    <p className="mt-3 text-[0.82rem] text-red-400">{errorMsg}</p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
