"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── DATA ──────────────────────────────────────────────────────────────────────

const CHAIRS = [
  {
    name: "The Seeker",
    challenge: '"Come & See"',
    img: "/images/14.png",
    desc: "This chair represents someone exploring who Jesus is. The focus is on faith — understanding salvation and what it means to belong to Christ.",
    scale: ["Disagree", "Unsure", "Agree"] as const,
    questions: [
      "I am confident that I will be with God in heaven after I die.",
      "I could never be good enough to earn my way to heaven.",
      "Religious acts like going to church or being baptized do not make me a Christian.",
      "There is only one way to God and that is through faith in His Son, Jesus Christ.",
      "I have put my faith in Christ's death and resurrection as the only payment for my sin.",
      "My commitment to follow Christ is a response to God's grace and the gift of salvation I've received.",
      "Those who don't put their faith in Christ will be separated from God for eternity in hell.",
    ],
  },
  {
    name: "The Believer",
    challenge: '"Follow Me"',
    img: "/images/15.png",
    desc: "This chair represents someone growing in their faith. The focus is on developing the character, priorities, and disciplines of Christ in everyday life.",
    scale: ["Weak", "Improving", "Strong"] as const,
    questions: [
      "I am developing the character of Christ (love, joy, peace, patience, kindness… Galatians 5:22-23).",
      "I am developing the priorities of Christ (Love God and Love People… Matthew 22:37-39).",
      "I recognize Christ as Lord and put Him first in every area of my life (time, money, relationships).",
      "I am dependent on God's Spirit for strength and direction in my everyday life.",
      "I spend time with God each day by reading His Word and talking to Him through prayer.",
      "I know my spiritual gifts and look for ways to use them in serving others.",
      "I am concerned for those who don't know Jesus and want to share Him with them.",
    ],
  },
  {
    name: "The Worker",
    challenge: '"Fish for Men"',
    img: "/images/15.png",
    desc: "This chair represents someone actively sharing their faith and discipling others. They've shifted from me-centric to others-centric.",
    scale: ["Weak", "Improving", "Strong"] as const,
    questions: [
      "I pursue relationships with spiritually lost people and pray for their salvation.",
      "I know how to communicate my salvation story (my testimony).",
      "I know how to share the gospel message simply and clearly (in two minutes).",
      "I look for and act upon opportunities to share the gospel message verbally with spiritually lost people.",
      "I pursue discipling relationships with other believers and pray for their growth into Christlikeness.",
      "I know the basics that a new believer needs to understand to grow in their faith.",
      "I share what God is teaching me with others to encourage them in their faith.",
    ],
  },
  {
    name: "The Disciple-Maker",
    challenge: '"Go & Bear Fruit"',
    img: "/images/15.png",
    desc: "This chair represents someone who multiplies disciples. They are actively discipling others who are now discipling others — a movement has begun.",
    scale: ["Weak", "Improving", "Strong"] as const,
    questions: [
      "I have showed others how to share their faith and they are putting it into practice.",
      "I am regularly meeting with at least one other believer to show them how to follow Christ.",
      "I am committed to walking with others through the process of becoming a disciple who makes disciples.",
      "I model a disciple-making lifestyle that encourages and inspires others to make disciples.",
      "I prioritize my schedule to be able to spend time with spiritually lost people and disciple believers.",
      "I have discipled someone I led to Christ, and they are now discipling someone they led to Christ.",
      "I initiate new relationships for the purpose of making disciples.",
    ],
  },
];

const NEXT_STEPS = [
  {
    title: "Your next step is to place your faith in Jesus.",
    text: "Based on your scores, your primary focus is Chair One. This is a meaningful place to be — it means you're exploring what it means to follow Jesus. The most important step you can take is placing your faith in Christ's death and resurrection as the only payment for your sin. Talk to a trusted leader or pastor about what this means for you.",
  },
  {
    title: "Your next step is to build spiritual disciplines.",
    text: "Based on your scores, you're in Chair Two. You've made a commitment to Christ — now the work is building the daily rhythms that shape you into His image. Focus on regular time in God's Word, prayer, and finding a community of believers who can help you grow.",
  },
  {
    title: "Your next step is to share your faith intentionally.",
    text: "Based on your scores, you're in Chair Three. You're a growing believer who is beginning to invest in others. Your next step is to be intentional about pursuing the lost and discipling at least one other believer. Who is your one? Who are you pouring into?",
  },
  {
    title: "Your next step is to multiply what God has done in you.",
    text: "Based on your scores, you're in Chair Four. You are a disciple who makes disciples. Your next step is to ensure the people you're discipling are discipling others — and to ask God where He wants you to expand your reach. The Great Commission is in full effect in your life.",
  },
];

// ── TYPES ─────────────────────────────────────────────────────────────────────

type Screen = "intro" | "question" | "results";
type Answers = (number | null)[][];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [section, setSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() =>
    Array.from({ length: 4 }, () => Array(7).fill(null))
  );
  const [userName, setUserName] = useState("");
  const [barHeights, setBarHeights] = useState([0, 0, 0, 0]);
  const [showWarning, setShowWarning] = useState(false);

  const scores = answers.map((a) => a.reduce<number>((s, v) => s + (v ?? 0), 0));
  const focusIdx = scores.findIndex((s) => s <= 19);
  const primary = focusIdx >= 0 ? focusIdx : 3;
  const totalAnswered = answers.flat().filter((a) => a !== null).length;
  const progressPct = (totalAnswered / 28) * 100;
  const sectionComplete = answers[section].every((a) => a !== null);

  function start() {
    setSection(0);
    setAnswers(Array.from({ length: 4 }, () => Array(7).fill(null)));
    setShowWarning(false);
    setScreen("question");
  }

  function recordAnswer(qi: number, val: number) {
    setAnswers((prev) => {
      const next = prev.map((r) => [...r]);
      next[section][qi] = val;
      return next;
    });
    setShowWarning(false);
  }

  function goNext() {
    if (!sectionComplete) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    if (section < 3) {
      setSection((s) => s + 1);
    } else {
      setScreen("results");
    }
  }

  function goBack() {
    if (section > 0) {
      setSection((s) => s - 1);
      setShowWarning(false);
    }
  }

  function retake() {
    setAnswers(Array.from({ length: 4 }, () => Array(7).fill(null)));
    setUserName("");
    setScreen("intro");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, section]);

  useEffect(() => {
    if (screen !== "results") {
      setBarHeights([0, 0, 0, 0]);
      return;
    }
    const finalScores = answers.map((a) => a.reduce<number>((s, v) => s + (v ?? 0), 0));
    const timers = finalScores.map((score, i) =>
      setTimeout(() => {
        setBarHeights((prev) => {
          const next = [...prev];
          next[i] = (score / 21) * 100;
          return next;
        });
      }, 200 + i * 150)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Fixed progress bar — visible only during question screen */}
      <div
        className="fixed top-[58px] left-0 right-0 h-[3px] bg-border z-[99] transition-opacity duration-300"
        style={{ opacity: screen === "question" ? 1 : 0 }}
      >
        <div
          className="h-full bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ── INTRO ─────────────────────────────────────────────────────────── */}
      {screen === "intro" && (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 pt-[100px] pb-16 text-center">
          {/* Chair images row */}
          <div className="flex items-end gap-4 mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/14.png" alt="Chair 1" width={52} style={{ opacity: 1, filter: "brightness(1.2)" }} />
            {[2, 3, 4].map((n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={n} src="/images/15.png" alt={`Chair ${n}`} width={52} style={{ opacity: 0.35 }} />
            ))}
          </div>

          <div className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.22em] uppercase text-gold mb-4 justify-center">
            <span className="block w-8 h-px bg-gold" />
            4 Chair Discipling
            <span className="block w-8 h-px bg-gold" />
          </div>

          <h1 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.05] text-white mb-2">
            Personal <em className="italic text-tan">Inventory</em>
          </h1>

          <p className="text-[1rem] text-tan leading-[1.7] max-w-[560px] mt-6 mb-10">
            Answer each question honestly. This inventory is a tool to help you
            identify where you are and discover the next step in your
            disciple-making journey.
          </p>

          {/* Rules */}
          <div className="grid grid-cols-3 gap-4 max-w-[660px] w-full mx-auto mb-12 text-left max-[700px]:grid-cols-1">
            {[
              {
                label: "28 Questions",
                text: "Seven questions per chair, scored 1–3. Takes about 5 minutes.",
              },
              {
                label: "Scoring",
                text: "0–19 in a chair means stay focused there. 20–21 means you're ready to move forward.",
              },
              {
                label: "Results",
                text: "You'll receive a full breakdown and your next step. You can save or print your results.",
              },
            ].map((r) => (
              <div
                key={r.label}
                className="bg-surface border border-border p-5"
                style={{ borderLeft: "3px solid var(--gold)" }}
              >
                <div className="text-[0.62rem] font-bold tracking-[0.15em] uppercase text-gold mb-[0.4rem]">
                  {r.label}
                </div>
                <div className="text-[0.82rem] text-tan leading-[1.55]">{r.text}</div>
              </div>
            ))}
          </div>

          {/* Name field */}
          <div className="max-w-[400px] w-full mx-auto mb-8 text-left">
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-muted mb-2">
              Your Name{" "}
              <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && start()}
              placeholder="Enter your name…"
              className="w-full bg-surface border border-border text-white font-body text-[1rem] px-4 py-[0.85rem] outline-none focus:border-gold placeholder:text-muted transition-colors duration-200"
            />
          </div>

          <button
            onClick={start}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-[#0f0e0c] font-body text-[0.82rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer transition-all duration-200 hover:bg-tan-light hover:-translate-y-px"
          >
            Begin the Inventory →
          </button>

          <div className="mt-8">
            <Link
              href="/"
              className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-muted hover:text-tan-light transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* ── QUESTIONS ─────────────────────────────────────────────────────── */}
      {screen === "question" && (
        <div className="px-6 pt-[90px] pb-16">
          <div className="max-w-[780px] mx-auto">
            {/* Chair header */}
            <div className="mb-10 pb-6 border-b border-border">
              <div className="inline-flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.2em] uppercase text-gold mb-3">
                <span className="block w-6 h-px bg-gold" />
                Chair {section + 1} of 4
              </div>
              <h2 className="font-display text-[2rem] font-black text-white mb-1">
                {CHAIRS[section].name}
              </h2>
              <div className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-gold-dim mb-3">
                {CHAIRS[section].challenge}
              </div>
              <p className="text-[0.88rem] text-muted leading-[1.6] max-w-[520px]">
                {CHAIRS[section].desc}
              </p>
            </div>

            {/* Scale legend */}
            <div className="flex items-center gap-4 flex-wrap mb-8 px-4 py-[0.85rem] bg-surface border border-border">
              <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-muted mr-2">
                Score:
              </span>
              {CHAIRS[section].scale.map((label, i) => (
                <span key={label} className="flex items-center gap-[0.35rem] text-[0.75rem] text-tan">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background:
                        i === 0
                          ? "var(--muted)"
                          : i === 1
                          ? "var(--tan)"
                          : "var(--gold)",
                    }}
                  />
                  {label} = {i + 1}
                </span>
              ))}
            </div>

            {/* Question list */}
            <div className="flex flex-col gap-px bg-border mb-10">
              {CHAIRS[section].questions.map((q, qi) => {
                const answered = answers[section][qi] !== null;
                return (
                  <div
                    key={qi}
                    className={`flex items-start gap-6 px-6 py-5 max-[700px]:flex-col max-[700px]:gap-4 ${
                      answered ? "bg-surface2" : "bg-surface"
                    }`}
                  >
                    <div className="font-mono text-[0.65rem] text-gold-dim min-w-[20px] mt-[0.15rem] shrink-0">
                      {section * 7 + qi + 1}
                    </div>
                    <div className="text-[0.88rem] text-tan-light leading-[1.55] flex-1">
                      {q}
                    </div>
                    <div className="flex gap-2 shrink-0 mt-[0.1rem] max-[700px]:w-full max-[700px]:justify-between">
                      {([1, 2, 3] as const).map((val) => (
                        <label
                          key={val}
                          className="flex flex-col items-center gap-[0.3rem] cursor-pointer group/radio"
                        >
                          <input
                            type="radio"
                            name={`q${section}-${qi}`}
                            value={val}
                            checked={answers[section][qi] === val}
                            onChange={() => recordAnswer(qi, val)}
                            className="sr-only"
                          />
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-[0.7rem] font-bold transition-all duration-200 cursor-pointer ${
                              answers[section][qi] === val
                                ? "border-gold bg-gold text-[#0f0e0c]"
                                : "border-border bg-bg text-muted group-hover/radio:border-gold-dim group-hover/radio:text-tan"
                            }`}
                          >
                            {val}
                          </div>
                          <span className="text-[0.52rem] font-semibold tracking-[0.06em] uppercase text-muted text-center">
                            {CHAIRS[section].scale[val - 1]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {showWarning && (
              <p className="text-[0.75rem] text-red mb-3">
                Please answer all questions before continuing.
              </p>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between gap-4 flex-wrap max-[480px]:flex-col max-[480px]:items-stretch">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={goBack}
                  className={`inline-flex items-center gap-2 px-6 py-[0.85rem] bg-transparent border border-border text-muted font-body text-[0.78rem] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:border-tan hover:text-tan max-[480px]:justify-center ${
                    section === 0 ? "invisible" : ""
                  }`}
                >
                  ← Previous
                </button>
                <span className="font-mono text-[0.72rem] text-muted tracking-[0.08em]">
                  Section {section + 1} of 4
                </span>
              </div>
              <button
                onClick={goNext}
                className={`inline-flex items-center gap-2 px-8 py-[0.85rem] bg-gold text-[#0f0e0c] font-body text-[0.78rem] font-bold tracking-[0.1em] uppercase border-none cursor-pointer transition-all duration-200 max-[480px]:justify-center ${
                  sectionComplete
                    ? "opacity-100 hover:bg-tan-light hover:-translate-y-px"
                    : "opacity-40 pointer-events-none"
                }`}
              >
                {section === 3 ? "See My Results →" : "Next Section →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS ───────────────────────────────────────────────────────── */}
      {screen === "results" && (
        <div className="px-6 pt-[90px] pb-20">
          <div className="max-w-[860px] mx-auto">
            {/* Hero */}
            <div className="text-center px-4 pt-12 pb-10 border-b border-border mb-12">
              <div className="flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.22em] uppercase text-gold mb-4 justify-center">
                <span className="block w-8 h-px bg-gold" />
                Your Results
                <span className="block w-8 h-px bg-gold" />
              </div>
              <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-black text-white mb-2">
                4 Chair Personal Inventory
              </h2>
              {userName && (
                <div className="font-display text-[1.1rem] italic text-tan mb-6">
                  Results for {userName}
                </div>
              )}

              <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface border border-gold mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CHAIRS[primary].img} alt={CHAIRS[primary].name} width={36} />
                <div>
                  <span className="block text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gold mb-[0.1rem]">
                    Your Primary Chair
                  </span>
                  <span className="font-display text-[1.1rem] font-bold text-white">
                    {CHAIRS[primary].name}
                  </span>
                </div>
              </div>

              <p className="text-[0.95rem] text-tan leading-[1.75] max-w-[580px] mx-auto">
                You completed all 28 questions across 4 chairs. Your scores are
                shown below.{" "}
                {primary < 3 || scores[3] <= 19
                  ? `Your primary focus chair is ${CHAIRS[primary].name} with a score of ${scores[primary]}/21.`
                  : "You scored 20 or above in every chair — you are a Disciple-Maker. Keep multiplying."}
              </p>
            </div>

            {/* Score bars */}
            <div className="grid grid-cols-4 gap-px bg-border mb-12 max-[700px]:grid-cols-2">
              {scores.map((score, i) => {
                const isPrimary = i === primary;
                const isKeepGrowing = score <= 19 && !isPrimary;
                return (
                  <div
                    key={i}
                    className="bg-surface px-5 py-7 text-center"
                    style={
                      isPrimary
                        ? { background: "var(--surface2)", borderTop: "3px solid var(--gold)" }
                        : undefined
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CHAIRS[i].img} alt={CHAIRS[i].name} width={40} className="mx-auto mb-4" />
                    <div className="font-display text-[0.9rem] font-bold text-tan-light mb-1">
                      {CHAIRS[i].name}
                    </div>
                    <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-gold-dim mb-5">
                      {CHAIRS[i].challenge}
                    </div>
                    <div className="h-[100px] bg-bg border border-border flex items-end mb-3 overflow-hidden">
                      <div
                        style={{
                          width: "100%",
                          height: `${barHeights[i]}%`,
                          background: "linear-gradient(to top, var(--gold), var(--gold-dim))",
                          transition: "height 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    </div>
                    <div className="font-display text-[1.6rem] font-black text-gold">
                      {score}
                    </div>
                    <div className="font-mono text-[0.7rem] text-muted mb-2">out of 21</div>
                    {isPrimary ? (
                      <span className="text-[0.62rem] font-bold tracking-[0.1em] uppercase px-2 py-[0.2rem] inline-block bg-gold text-[#0f0e0c]">
                        Primary Focus
                      </span>
                    ) : isKeepGrowing ? (
                      <span className="text-[0.62rem] font-bold tracking-[0.1em] uppercase px-2 py-[0.2rem] inline-block bg-surface border border-gold-dim text-gold-dim">
                        Keep Growing
                      </span>
                    ) : (
                      <span className="text-[0.62rem] font-bold tracking-[0.1em] uppercase px-2 py-[0.2rem] inline-block bg-surface border border-border text-muted">
                        Strong
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next step */}
            <div
              className="bg-surface border border-border px-10 py-8 mb-10"
              style={{ borderLeft: "4px solid var(--gold)" }}
            >
              <div className="inline-flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.2em] uppercase text-gold mb-3">
                <span className="block w-6 h-px bg-gold" />
                Your Next Step
              </div>
              <div className="font-display text-[1.5rem] font-bold text-white mb-3">
                {NEXT_STEPS[primary].title}
              </div>
              <p className="text-[0.9rem] text-tan leading-[1.75]">
                {NEXT_STEPS[primary].text}
              </p>
            </div>

            {/* Per-chair breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-12 max-[700px]:grid-cols-1">
              {CHAIRS.map((chair, ci) => (
                <div
                  key={ci}
                  className="bg-surface border p-6"
                  style={{ borderColor: ci === primary ? "var(--gold-dim)" : "var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-display text-[1rem] font-bold text-tan-light">
                      {chair.name}{" "}
                      <span className="font-body text-[0.82rem] text-muted font-normal">
                        {chair.challenge}
                      </span>
                    </div>
                    <div className="font-mono text-[0.72rem] px-[0.6rem] py-1 bg-bg border border-border text-gold shrink-0">
                      {scores[ci]}/21
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {chair.questions.map((q, qi) => {
                      const val = answers[ci][qi] ?? 0;
                      const scoreColor =
                        val === 1 ? "text-muted" : val === 2 ? "text-tan" : "text-gold";
                      return (
                        <div
                          key={qi}
                          className="flex items-start gap-2 py-[0.3rem] border-b border-border last:border-b-0"
                        >
                          <span className="font-mono text-[0.62rem] text-gold-dim min-w-[20px] shrink-0 mt-[0.1rem]">
                            {ci * 7 + qi + 1}
                          </span>
                          <span className="text-[0.78rem] text-tan flex-1 leading-[1.5]">
                            {q}
                          </span>
                          <span
                            className={`font-mono text-[0.72rem] font-bold w-5 text-center shrink-0 ${scoreColor}`}
                          >
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 flex-wrap justify-center pt-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-8 py-[0.9rem] bg-gold text-[#0f0e0c] font-body text-[0.78rem] font-bold tracking-[0.1em] uppercase border-none cursor-pointer transition-colors duration-200 hover:bg-tan-light"
              >
                ↓ Save My Results
              </button>
              <button
                onClick={retake}
                className="inline-flex items-center gap-2 px-8 py-[0.9rem] bg-transparent border border-border text-tan font-body text-[0.78rem] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:border-tan hover:text-white"
              >
                ↺ Retake Inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
