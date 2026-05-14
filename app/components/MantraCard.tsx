"use client";

import { useState } from "react";

export interface MantraData {
  verse: string;
  title: string;
  body: string;
  videoUrl: string;
}

export default function MantraCard({ verse, title, body, videoUrl }: MantraData) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`overflow-hidden border transition-colors duration-300 bg-surface ${
        flipped ? "border-gold" : "border-border hover:border-gold-dim"
      }`}
    >
      {!flipped ? (
        <div
          className="p-8 flex flex-col cursor-pointer min-h-[180px]"
          onClick={() => setFlipped(true)}
        >
          <div className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-gold mb-[0.4rem]">
            {verse}
          </div>
          <div className="font-display text-[1.25rem] font-bold text-white mb-3">
            {title}
          </div>
          <p className="text-[0.85rem] text-muted leading-[1.7]">{body}</p>
          <div className="text-[0.58rem] text-muted tracking-[0.08em] uppercase mt-auto pt-3 opacity-70">
            Tap to watch the sermon ↻
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* 16:9 video */}
          <iframe
            src={videoUrl}
            className="w-full aspect-video border-none block bg-black"
            allowFullScreen
            loading="lazy"
            title={title}
          />
          <div className="flex items-center justify-between gap-4 px-5 py-[0.85rem] bg-surface2 border-t border-border">
            <div className="flex-1 min-w-0">
              <div className="font-display text-[0.88rem] font-bold text-tan-light truncate">
                {title}
              </div>
              <div className="font-mono text-[0.6rem] text-gold-dim mt-[0.1rem]">
                {verse}
              </div>
            </div>
            <button
              className="inline-flex items-center gap-[0.35rem] px-[0.9rem] py-[0.45rem] border border-gold-dim bg-transparent text-gold text-[0.62rem] font-bold tracking-[0.08em] uppercase cursor-pointer font-body shrink-0 whitespace-nowrap transition-[background,color] duration-200 hover:bg-gold hover:text-[#0f0e0c]"
              onClick={() => setFlipped(false)}
            >
              ↩ Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
