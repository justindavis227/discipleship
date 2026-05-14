"use client";

import { useEffect, useRef, useState } from "react";
import ResourceCard, { type ResourceData } from "./ResourceCard";
import PDFModal from "./PDFModal";

const RESOURCES: ResourceData[] = [
  {
    type: "Leader Training · One-Pager",
    title: "Unleashed Leaders One Pager",
    desc: "A single-page overview of the heartbeat of who we are and what we do in student ministry. Designed to orient new leaders fast and keep veterans anchored to the why.",
    tags: ["Leader Onboarding", "Big Picture", "Interview"],
    pdfUrl: "/pdfs/Unleashed_Leaders_One_Pager__Complete_.pdf",
    modalTitle: "Unleashed Leaders One-Pager",
  },
  {
    type: "Leader Training · Workbook",
    title: "Unleashed Leaders Workbook",
    desc: "A comprehensive leader training workbook covering mission, vision, model, tools, roles, and how to make disciples — including the 4-Chair personal inventory, Southeast Mantras reflection, and practical expectations for weekly, monthly, and semester rhythms.",
    tags: ["HSM + MSM", "Leader Development", "Leader Onboarding"],
    pdfUrl: "/pdfs/Unleashed_Leaders_Workbook__BB_Students_.pdf",
    modalTitle: "Unleashed Leaders Student Ministry Workbook",
  },
  {
    type: "Discipleship Chart · Biblical Foundation",
    title: "5 Phases: Multiply Disciples Like Jesus",
    desc: "A visual aid mapping Jesus' ministry across 5 phases — from Preparation through Leadership Multiplication — alongside the early church's multiplying movement in Acts. Shows how the 4-Chair language maps across the full arc of Jesus' life.",
    tags: ["Biblical Theology", "Visual Aid", "Training Tool"],
    pdfUrl: "/pdfs/5_PHASES_-_No_Crop__17_X_11_.pdf",
    modalTitle: "5 Phases — Multiply Disciples Like Jesus",
  },
  {
    type: "Leader Manual · Full System",
    title: "Team Leader Manual",
    desc: "A year long road map for team leaders to help shepherd leaders in our ministry — covering mission & mantras, the Team Leader role and expectations, monthly Key Conversations (1-on-1), Team Dialogues, the Big Three leader events, leader development frameworks, and further resources for building effective teams.",
    tags: ["Team Leader", "Leader Development", "Key Conversations"],
    pdfUrl: "/pdfs/Team_Leader_Manual_Annual__8x8_.pdf",
    modalTitle: "Team Leader Manual — BB Students Resource",
  },
];

export default function Resources() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState<{ pdfUrl: string; title: string } | null>(
    null
  );

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
    <>
      <section
        id="resources"
        className="py-[6rem] px-12 max-w-[1200px] mx-auto max-[900px]:py-[4rem] max-[900px]:px-6"
      >
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
          <span className="block w-6 h-px bg-gold shrink-0" />
          Our Tools
        </div>

        <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-bold text-white leading-[1.15] mb-4">
          Tools Built for<br />
          <em className="italic text-tan">the Frontline</em>
        </h2>

        <p className="text-[1rem] text-tan leading-[1.7] max-w-[600px] mb-[3rem]">
          Every resource below was created for actual ministry use — designed to
          be clear, practical, and scalable across campus contexts. Click any
          card to view the document.
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
          {RESOURCES.map((r) => (
            <ResourceCard
              key={r.title}
              {...r}
              onClick={() => setModal({ pdfUrl: r.pdfUrl, title: r.modalTitle })}
            />
          ))}
        </div>
      </section>

      <PDFModal
        pdfUrl={modal?.pdfUrl ?? ""}
        title={modal?.title ?? ""}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      />
    </>
  );
}
