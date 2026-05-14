"use client";

import { useEffect, useRef, useState } from "react";
import MantraCard, { type MantraData } from "./MantraCard";

const MANTRAS: MantraData[] = [
  {
    verse: "John 15:1–17",
    title: "Be the Branch",
    body: "We connect in community. We value connection over production.",
    videoUrl: "https://www.youtube.com/embed/7CiuoOl2ULM",
  },
  {
    verse: "John 3:1–8",
    title: "Catch the Wind",
    body: "We connect the full force of the church with the Holy Spirit. We value risk and adventure over safety and comfort.",
    videoUrl: "https://www.youtube.com/embed/Qz4dikYRPps",
  },
  {
    verse: "Luke 5:18–25",
    title: "Wreck the Roof",
    body: "We will radically love people one at a time. We value innovation over tradition.",
    videoUrl: "https://www.youtube.com/embed/WR3hTQ9HEmg",
  },
  {
    verse: "Luke 9:57–62",
    title: "Grip the Plow",
    body: "We serve with intentional and focused effort. We value personal engagement over attendance.",
    videoUrl: "https://www.youtube.com/embed/5lOpant1w40",
  },
  {
    verse: "Luke 7:36–50",
    title: "Empty the Jar",
    body: "We connect through sacrificial generosity. We value expressive worship over religious rituals.",
    videoUrl: "https://www.youtube.com/embed/2d4KeZWnkOE",
  },
];

export default function Mantras() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-surface border-y border-border">
      <div className="py-[6rem] px-12 max-w-[1200px] mx-auto max-[900px]:py-[4rem] max-[900px]:px-6">
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
          <span className="block w-6 h-px bg-gold shrink-0" />
          Southeast Values
        </div>

        <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-bold text-white leading-[1.15] mb-4">
          The Mantras That<br />
          <em className="italic text-tan">Drive the Mission</em>
        </h2>

        <p className="text-[1rem] text-tan leading-[1.7] max-w-[600px] mb-[3rem]">
          These aren't slogans. They're Scripture-rooted postures that shape how
          we engage the mission every single day.
        </p>

        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {MANTRAS.map((m) => (
            <MantraCard key={m.title} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}
