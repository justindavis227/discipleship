"use client";

import { useEffect } from "react";

interface Props {
  pdfUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PDFModal({ pdfUrl, title, isOpen, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-8 transition-opacity duration-[250ms]"
      style={{
        background: "rgba(0,0,0,0.85)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-surface border border-border w-full max-w-[900px] max-h-[90vh] flex flex-col transition-transform duration-[250ms] max-[900px]:max-h-[95vh]"
        style={{ transform: isOpen ? "translateY(0)" : "translateY(20px)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="font-display text-[1rem] text-tan-light">{title}</div>
          <button
            className="bg-transparent border-none text-muted text-[1.3rem] cursor-pointer px-2 py-1 leading-none font-body transition-colors duration-200 hover:text-white"
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          {isOpen && (
            <iframe
              src={pdfUrl}
              title="PDF Viewer"
              className="w-full h-[75vh] border-none block max-[900px]:h-[65vh]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
