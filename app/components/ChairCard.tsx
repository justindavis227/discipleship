"use client";

import { useState } from "react";

export interface ChairData {
  number: string;
  image: string;
  title: string;
  challenge: string;
  action: string;
  verse: string;
  backLabel: string;
  scriptureHtml: string;
  scriptureRef: string;
}

const FACE_TRANSITION =
  "opacity 0.35s ease, transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)";

export default function ChairCard({
  number,
  image,
  title,
  challenge,
  action,
  verse,
  backLabel,
  scriptureHtml,
  scriptureRef,
}: ChairData) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer border border-border bg-surface transition-colors duration-300 hover:border-gold-dim h-[476px] ${
        flipped ? "border-gold-dim" : ""
      }`}
      onClick={() => setFlipped((f) => !f)}
    >
      {/* Front */}
      <div
        className="flex flex-col justify-between p-8 bg-bg"
        style={{
          opacity: flipped ? 0 : 1,
          transform: flipped ? "rotateY(-90deg)" : "rotateY(0deg)",
          pointerEvents: flipped ? "none" : "auto",
          transition: FACE_TRANSITION,
          backfaceVisibility: "hidden",
        }}
      >
        <div>
          <div className="font-mono text-[0.7rem] text-gold tracking-[0.1em] mb-5">
            {number}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            style={{ width: "52px", display: "block", marginBottom: "1rem" }}
          />
          <div className="font-display text-[1.2rem] font-bold text-white mb-[0.4rem]">
            {title}
          </div>
          <div className="text-[0.68rem] font-bold tracking-[0.15em] uppercase text-gold mb-3">
            {challenge}
          </div>
          <p className="text-[0.82rem] text-muted leading-[1.65]">
            {action}
          </p>
        </div>
        <div>
          <div className="font-mono text-[0.7rem] text-gold-dim mb-2">{verse}</div>
          {/* Gold fill bar — animates on hover, only when not flipped */}
          <div className="relative h-[2px] bg-border overflow-hidden">
            <div className="absolute inset-0 bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[400ms] ease-out" />
          </div>
          <div className="text-[0.58rem] text-muted tracking-[0.08em] uppercase mt-2 opacity-70">
            Tap to see scripture ↻
          </div>
        </div>
      </div>

      {/* Back */}
      <div
        className="absolute inset-0 flex flex-col p-8 bg-surface overflow-hidden"
        style={{
          opacity: flipped ? 1 : 0,
          transform: flipped ? "rotateY(0deg)" : "rotateY(90deg)",
          pointerEvents: flipped ? "auto" : "none",
          transition: FACE_TRANSITION,
          backfaceVisibility: "hidden",
        }}
      >
        <div className="inline-flex items-center gap-2 text-[0.6rem] font-bold tracking-[0.18em] uppercase text-gold mb-4">
          <span className="block w-4 h-px bg-gold shrink-0" />
          {backLabel}
        </div>
        {/* Scripture HTML contains <sup> verse numbers and <span> highlights — static trusted content */}
        <p
          className="text-[0.82rem] text-tan leading-[1.8] flex-1"
          dangerouslySetInnerHTML={{ __html: scriptureHtml }}
        />
        <div className="font-mono text-[0.7rem] text-gold-dim mt-5 pt-3 border-t border-border">
          {scriptureRef}
        </div>
        <div className="text-[0.58rem] text-muted tracking-[0.08em] uppercase mt-2 opacity-70">
          Tap to flip back ↻
        </div>
      </div>
    </div>
  );
}
