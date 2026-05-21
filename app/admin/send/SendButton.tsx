"use client";

import { useState } from "react";

interface SendButtonProps {
  briefingId: string;
  recipientCount: number;
}

type State = "idle" | "confirming" | "sending" | "done" | "error";

export default function SendButton({ briefingId, recipientCount }: SendButtonProps) {
  const [state, setState] = useState<State>("idle");
  const [sent, setSent] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend() {
    setState("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefingId }),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? "Send failed.");
        setState("error");
        return;
      }

      setSent(json.sent ?? 0);
      setState("done");
    } catch {
      setErrorMsg("Network error — try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-aud-parent">
          ✓ Sent to {sent} subscriber{sent !== 1 ? "s" : ""}
        </span>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[0.78rem] text-red-400">{errorMsg}</span>
        <button
          onClick={() => setState("idle")}
          className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-muted hover:text-gold transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (state === "confirming") {
    return (
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[0.82rem] text-tan">
          Send to {recipientCount} subscriber{recipientCount !== 1 ? "s" : ""}?
        </span>
        <button
          onClick={handleSend}
          className="bg-gold text-[#0f0e0c] text-[0.72rem] font-bold tracking-[0.1em] uppercase px-5 py-[0.5rem] transition-all duration-200 hover:bg-tan-light cursor-pointer border-none"
        >
          Confirm Send
        </button>
        <button
          onClick={() => setState("idle")}
          className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-muted hover:text-gold transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (state === "sending") {
    return (
      <span className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-muted">
        Sending…
      </span>
    );
  }

  // idle
  return (
    <button
      onClick={() => setState("confirming")}
      disabled={recipientCount === 0}
      className="border border-gold text-gold text-[0.72rem] font-bold tracking-[0.1em] uppercase px-5 py-[0.5rem] transition-all duration-200 hover:bg-gold hover:text-[#0f0e0c] disabled:border-border disabled:text-muted disabled:cursor-not-allowed bg-transparent cursor-pointer"
    >
      {recipientCount === 0
        ? "No matching subscribers"
        : `Send to ${recipientCount} subscriber${recipientCount !== 1 ? "s" : ""} →`}
    </button>
  );
}
