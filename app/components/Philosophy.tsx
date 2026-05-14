"use client";

import { useEffect, useRef, useState } from "react";

const CARDS = [
  {
    number: "01",
    title: "Rooted in Christ",
    body: "Discipleship comes in lots of shapes and sizes. We simply desire that what we do be rooted in Christ. Our tools are intended to bring clarity to how we best disciple the next generation together.",
    verse: "Colossians 1:6",
  },
  {
    number: "02",
    title: "Systems Enable Shepherds",
    body: "When tools, training, and communication systems work well, leaders are freed to do what only they can do — know their flock and shepherd them towards Christ.",
    verse: "Luke 9:1-6",
  },
  {
    number: "03",
    title: "Jesus Is the Model",
    body: "Before strategy, before systems, we look at Jesus' model. We are unapologetic about doing as He did to disciple and reach the next generation.",
    verse: "1 John 2:6",
  },
];

export default function Philosophy() {
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
    <section
      id="philosophy"
      className="py-[6rem] px-12 max-w-[1200px] mx-auto max-[900px]:py-[4rem] max-[900px]:px-6"
    >
      <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
        <span className="block w-6 h-px bg-gold shrink-0" />
        Core Philosophy
      </div>

      <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-bold text-white leading-[1.15] mb-4">
        Discipleship is a Journey,<br />
        <em className="italic text-tan">Not a Program</em>
      </h2>

      <p className="text-[1rem] text-tan leading-[1.7] max-w-[600px] mb-[3rem]">
        Every resource, every curriculum, every leader development tool is built
        on a single conviction: Jesus is our model. He brings our clarity and
        He's already charted the path to what's next.
      </p>

      <div
        ref={gridRef}
        className="grid grid-cols-3 max-[900px]:grid-cols-1 bg-border gap-[1.5px]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {CARDS.map(({ number, title, body, verse }) => (
          <div
            key={number}
            className="group bg-bg p-10 transition-colors duration-200 hover:bg-surface"
          >
            <div className="font-display text-[4rem] font-black leading-none mb-4 text-border transition-colors duration-200 group-hover:text-gold max-[480px]:text-[3rem]">
              {number}
            </div>
            <div className="text-[0.8rem] font-bold tracking-[0.12em] uppercase text-tan-light mb-3">
              {title}
            </div>
            <p className="text-[0.9rem] text-muted leading-[1.7]">{body}</p>
            <div className="mt-4 text-[0.75rem] italic text-gold-dim font-mono">
              {verse}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
