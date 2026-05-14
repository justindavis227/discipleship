"use client";

import { useEffect, useRef } from "react";

const MODEL_ITEMS = [
  { ref: "Luke 6:12–16", label: "Choose Twelve" },
  { ref: "Luke 9:1–6",   label: "Send Out" },
  { ref: "Luke 9:10–17", label: "Engage the Crowd" },
  { ref: "Luke 9:18–20", label: "Be Intentional" },
  { ref: "Luke 9:23–27", label: "Raise the Bar" },
  { ref: "Luke 9:28",    label: "Invest in a Few" },
];

export default function Hero() {
  const countupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = countupRef.current;
    if (!el) return;

    const target = 143556;
    const duration = 8000;
    let started = false;

    function easeOutExpo(t: number) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function runCountup() {
      if (started) return;
      started = true;
      const startTime = performance.now();
      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el!.textContent = Math.round(easeOutExpo(progress) * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountup();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden pt-[8rem] pb-[4rem] px-12 max-[900px]:pt-[7rem] max-[900px]:pb-[3rem] max-[900px]:px-6">
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(212,168,67,0.07) 0%, transparent 70%)," +
            "radial-gradient(ellipse 40% 80% at 10% 80%, rgba(200,184,154,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Topographic texture */}
      <div
        className="absolute inset-0 bg-cover opacity-[0.12] mix-blend-luminosity"
        style={{
          backgroundImage: "url('/images/Typography_IMG.png')",
          backgroundPosition: "center right",
        }}
      />

      {/* Vertical grid lines */}
      {[25, 50, 75].map((pct) => (
        <div
          key={pct}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${pct}%`,
            background: "linear-gradient(to bottom, transparent, var(--border), transparent)",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-[1] max-w-[1200px] mx-auto w-full grid grid-cols-2 gap-16 items-center max-[900px]:grid-cols-1">

        {/* Left column */}
        <div>
          <div
            className="inline-flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-gold mb-6"
            style={{ animation: "fadeUp 0.8s ease both 0.2s" }}
          >
            <span className="block w-8 h-px bg-gold shrink-0" />
            Doing as Jesus did.
          </div>

          <h1
            className="font-display font-black leading-[1.05] text-white mb-6 max-[900px]:text-[2.5rem] max-[480px]:text-[2rem]"
            style={{
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              animation: "fadeUp 0.8s ease both 0.4s",
            }}
          >
            Called.<br />
            Formed.<br />
            <em className="italic text-tan">Sent.</em>
          </h1>

          <p
            className="text-[1.05rem] text-tan leading-[1.7] max-w-[480px] mb-10 max-[480px]:text-[0.95rem]"
            style={{ animation: "fadeUp 0.8s ease both 0.6s" }}
          >
            Our discipleship framework, leader resources, and student ministry tools — built to help students take intentional next steps in their faith alongside caring adults.
          </p>

          <div
            className="flex gap-4 flex-wrap"
            style={{ animation: "fadeUp 0.8s ease both 0.8s" }}
          >
            <a
              href="/#resources"
              className="inline-flex items-center gap-2 py-[0.85rem] px-8 bg-gold text-[#0f0e0c] no-underline text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-tan-light hover:-translate-y-px max-[480px]:text-[0.75rem] max-[480px]:py-3 max-[480px]:px-5"
            >
              View Resources ↓
            </a>
            <a
              href="/#philosophy"
              className="inline-flex items-center gap-2 py-[0.85rem] px-8 border border-border text-tan no-underline text-[0.8rem] font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:border-tan hover:text-white max-[480px]:text-[0.75rem] max-[480px]:py-3 max-[480px]:px-5"
            >
              The Philosophy
            </a>
          </div>
        </div>

        {/* Right column — stat cards */}
        <div
          className="flex flex-col gap-4"
          style={{ animation: "fadeLeft 0.9s ease both 0.7s" }}
        >
          <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
            <StatCard label="Mission">
              <p className="font-display font-bold text-tan-light leading-[1.4] text-[1rem]">
                Connecting people to Jesus and one another.
              </p>
            </StatCard>
            <StatCard label="Vision">
              <p className="font-display font-bold text-tan-light leading-[1.4] text-[1rem]">
                Unleash the full force of the church.
              </p>
            </StatCard>
          </div>

          <StatCard label="OUR MODEL">
            <div className="grid grid-cols-3 gap-3 mt-3">
              {MODEL_ITEMS.map(({ ref, label }) => (
                <div key={ref}>
                  <div className="text-[0.6rem] text-gold font-mono mb-[0.2rem]">{ref}</div>
                  <div className="text-[0.75rem] text-tan">{label}</div>
                </div>
              ))}
            </div>
          </StatCard>

          <StatCard label="OUR WHY">
            <div
              ref={countupRef}
              className="font-display text-[1.6rem] font-bold text-tan-light leading-[1.2]"
            >
              0
            </div>
            <div className="text-[0.8rem] text-muted mt-1">
              Lost students within reach of Southeast Christian Church
            </div>
          </StatCard>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[3px] h-full bg-gold" />
      <div className="text-[0.68rem] font-semibold tracking-[0.15em] uppercase text-muted mb-[0.4rem]">
        {label}
      </div>
      {children}
    </div>
  );
}
