"use client";

import { useEffect, useRef, useState } from "react";
import ChairCard, { type ChairData } from "./ChairCard";

const sup = (n: string) =>
  `<sup style="color:var(--gold-dim);font-size:0.7rem;">${n}</sup>`;
const hl = (t: string) =>
  `<span style="color:var(--gold);font-weight:600;">${t}</span>`;

const CHAIRS: ChairData[] = [
  {
    number: "CHAIR 01",
    image: "/images/14.png",
    title: "The Lost",
    challenge: '"Come & See"',
    action:
      "The invitation before the commitment. Every student matters before they believe. We move toward them.",
    verse: "John 1:39 · Reach",
    backLabel: "John 1:38–39",
    scriptureHtml: `${sup("38")} Jesus looked around and saw them following. "What do you want?" he asked them. They replied, "Rabbi" (which means "Teacher"), "where are you staying?"<br><br>${sup("39")} ${hl('"Come and see,"')} he said. It was about four o'clock in the afternoon when they went with him to the place where he was staying, and they remained with him the rest of the day.`,
    scriptureRef: "John 1:38–39",
  },
  {
    number: "CHAIR 02",
    image: "/images/15.png",
    title: "The Believer",
    challenge: '"Follow Me"',
    action:
      "The starting line, not the finish line. Every new believer needs to establish spiritual disciplines for lifelong growth in Christ.",
    verse: "John 1:43 · Build",
    backLabel: "John 1:43–45",
    scriptureHtml: `${sup("43")} The next day Jesus decided to go to Galilee. He found Philip and said to him, ${hl('"Come, follow me."')}<br><br>${sup("44")} Philip was from Bethsaida, Andrew and Peter's hometown.<br><br>${sup("45")} Philip went to look for Nathanael and told him, "We have found the very person Moses and the prophets wrote about! His name is Jesus, the son of Joseph from Nazareth."`,
    scriptureRef: "John 1:43–45",
  },
  {
    number: "CHAIR 03",
    image: "/images/15.png",
    title: "The Worker",
    challenge: '"Fish for Men"',
    action:
      "Students learn to pursue the lost, share their story, and grip the plow of ministry. They've shifted from me-centric to others-centric.",
    verse: "Matthew 4:19 · Equip",
    backLabel: "Matthew 4:18–20",
    scriptureHtml: `${sup("18")} One day as Jesus was walking along the shore of the Sea of Galilee, he saw two brothers—Simon, also called Peter, and Andrew—throwing a net into the water, for they fished for a living.<br><br>${sup("19")} Jesus called out to them, ${hl('"Come, follow me, and I will show you how to fish for people!"')}<br><br>${sup("20")} And they left their nets at once and followed him.`,
    scriptureRef: "Matthew 4:18–20",
  },
  {
    number: "CHAIR 04",
    image: "/images/15.png",
    title: "Disciple-Maker",
    challenge: '"Go & Bear Fruit"',
    action:
      "A movement begins. Someone they led to Christ is now discipling someone they led to Christ. The Great Commission is in full effect.",
    verse: "John 15:16 · Multiply",
    backLabel: "John 15:16",
    scriptureHtml: `${sup("16")} You did not choose me, but I chose you and appointed you so that you might ${hl("go and bear fruit—fruit that will last")}—and so that whatever you ask in my name the Father will give you.`,
    scriptureRef: "John 15:16",
  },
];

const WHY_POINTS = [
  "Shared language across middle school, high school, and beyond",
  "Personal inventory tool for self-assessment at every stage",
  "Biblically rooted in the life of Christ",
  "Adaptable for leaders, students, and parents alike",
];

export default function FourChairs() {
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
    <div
      id="framework"
      className="py-[6rem] px-12 bg-surface border-y border-border max-[900px]:py-[4rem] max-[900px]:px-6"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
          <span className="block w-6 h-px bg-gold shrink-0" />
          The 4-Chair Framework
        </div>

        <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-bold text-white leading-[1.15] mb-4">
          Every Student Is Somewhere.<br />
          <em className="italic text-tan">Our Job Is What Comes Next.</em>
        </h2>

        <p className="text-[1rem] text-tan leading-[1.7] max-w-[600px] mb-[3rem]">
          Leveraging the word picture of 4 Chairs, this helps us identify where
          a student sits spiritually so we can best lead them to what's next.
          Built to give leaders, students, and parents a shared vision for
          spiritual growth. Four chairs. Four challenges. Four movements.
        </p>

        {/* Chairs grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-4 max-[900px]:grid-cols-1 bg-border gap-px"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {CHAIRS.map((chair) => (
            <ChairCard key={chair.number} {...chair} />
          ))}
        </div>

        {/* Why this framework works */}
        <div className="mt-12 p-8 bg-bg border border-border">
          <div className="grid grid-cols-2 gap-8 items-center max-[900px]:grid-cols-1">
            <div>
              <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-3">
                <span className="block w-6 h-px bg-gold shrink-0" />
                Why This Framework Works
              </div>
              <p className="text-[0.9rem] text-muted leading-[1.7]">
                The 4-Chair model gives every leader, parent, and student shared
                language. It removes ambiguity. It clarifies where someone is
                without judgment. It offers a compelling picture of what Jesus
                might be calling them to. Disciple-makers use this tool to help
                shepherd people to what God has next for them.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {WHY_POINTS.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-4 px-4 py-3 border border-border"
                >
                  <div className="w-2 h-2 bg-gold shrink-0" />
                  <span className="text-[0.82rem] text-tan">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory CTA */}
        <div className="mt-6 px-8 py-7 bg-surface border border-border flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/15.png"
              alt=""
              style={{ width: "36px", opacity: 0.85 }}
            />
            <div>
              <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gold mb-[0.2rem]">
                Self-Assessment Tool
              </div>
              <div className="font-display text-[1rem] font-bold text-tan-light">
                4 Chair Personal Inventory
              </div>
              <div className="text-[0.78rem] text-muted mt-[0.15rem]">
                28 questions · 5 minutes · Instant results
              </div>
            </div>
          </div>
          <a
            href="/inventory"
            className="inline-flex items-center gap-2 py-[0.85rem] px-7 bg-gold text-[#0f0e0c] no-underline text-[0.75rem] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-200 hover:bg-tan-light"
          >
            Take the Inventory →
          </a>
        </div>
      </div>
    </div>
  );
}
