"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

const AUDIENCES = [
  { value: "parent", label: "Parents", color: "text-aud-parent border-aud-parent" },
  { value: "leader", label: "Leaders", color: "text-aud-leader border-aud-leader" },
  { value: "student", label: "Students", color: "text-aud-student border-aud-student" },
];

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(["parent", "leader", "student"]);
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) {
      setErrorMsg("Select at least one audience track.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, audiences: selected }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong. Try again.");
        setState("error");
        return;
      }

      setState("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <section className="border-t border-border pt-16 mt-16">
        <div className="bg-surface border border-border relative overflow-hidden max-w-[640px]">
          <div className="absolute top-0 left-0 w-[3px] h-full bg-gold" />
          <div className="p-10 max-[600px]:p-6 text-center">
            <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
              <span className="block w-6 h-px bg-gold shrink-0" />
              Check Your Inbox
            </div>
            <h3 className="font-display font-bold text-white text-[1.5rem] leading-[1.2] mb-3">
              Almost there.
            </h3>
            <p className="text-[0.95rem] text-tan leading-[1.7]">
              We sent a confirmation link to <strong className="text-tan-light">{email}</strong>.
              Click it to activate your subscription.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border pt-16 mt-16">
      <div className="max-w-[640px]">
        {/* Section label */}
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
          <span className="block w-6 h-px bg-gold shrink-0" />
          Stay Connected
        </div>

        <h2
          className="font-display font-bold text-white leading-[1.1] mb-3"
          style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}
        >
          Get the Briefing<br />
          <em className="italic text-tan">every week.</em>
        </h2>

        <p className="text-[0.95rem] text-tan leading-[1.7] mb-8">
          Research, culture, and Scripture — delivered to your inbox. Select the
          tracks that match your role.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Audience checkboxes */}
          <div className="mb-6">
            <div className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted mb-3">
              I&apos;m a
            </div>
            <div className="flex gap-3 flex-wrap">
              {AUDIENCES.map(({ value, label, color }) => {
                const isChecked = selected.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggle(value)}
                    className={`px-5 py-[0.5rem] border text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-200 cursor-pointer bg-transparent ${
                      isChecked
                        ? color
                        : "border-border text-muted hover:border-tan hover:text-tan"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email input + submit */}
          <div className="flex gap-0 flex-col max-[500px]:flex-col sm:flex-row">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-surface2 border border-border text-white placeholder:text-muted text-[0.9rem] px-5 py-[0.85rem] outline-none focus:border-gold transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="bg-gold text-[#0f0e0c] text-[0.78rem] font-bold tracking-[0.1em] uppercase px-8 py-[0.85rem] transition-all duration-200 hover:bg-tan-light disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {state === "loading" ? "Sending…" : "Subscribe"}
            </button>
          </div>

          {state === "error" && errorMsg && (
            <p className="mt-3 text-[0.82rem] text-red-400">{errorMsg}</p>
          )}

          <p className="mt-4 text-[0.75rem] text-muted leading-[1.6]">
            Double opt-in. We&apos;ll send a confirmation link — click it to
            activate. Unsubscribe anytime in one click. We&apos;ll never share your
            email.
          </p>
        </form>
      </div>
    </section>
  );
}
