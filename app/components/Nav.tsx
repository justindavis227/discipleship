"use client";

import { useState } from "react";

const links = [
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/#framework", label: "Framework" },
  { href: "/#resources", label: "Resources" },
  { href: "/briefing", label: "Briefing" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    const next = !isOpen;
    setIsOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  }

  function close() {
    setIsOpen(false);
    document.body.style.overflow = "";
  }

  return (
    <>
      {/* Mobile full-screen drawer */}
      <div
        className={`min-[900px]:hidden fixed inset-0 z-[150] flex flex-col items-center justify-center gap-10 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(15,14,12,0.97)" }}
      >
        {links.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={close}
            className="font-display text-[2rem] font-bold text-tan-light no-underline tracking-[0.02em] transition-colors duration-200 hover:text-gold"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Nav bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between py-5 px-12 max-[900px]:py-4 max-[900px]:px-6 max-[480px]:px-4 border-b border-border backdrop-blur-[12px]"
        style={{ background: "rgba(15,14,12,0.85)" }}
      >
        <div className="font-display text-[1.1rem] tracking-[0.02em]">
          <span className="text-tan-light font-normal">Discipling the</span>{" "}
          <span className="text-gold font-bold">Next Generation</span>
        </div>

        {/* Desktop links */}
        <ul className="hidden min-[900px]:flex gap-10 list-none">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-muted no-underline text-[0.8rem] font-medium tracking-[0.12em] uppercase transition-colors duration-200 hover:text-tan-light"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          onClick={toggle}
          aria-label="Menu"
          className="min-[900px]:hidden flex flex-col gap-[5px] cursor-pointer p-[0.4rem] bg-transparent border-none z-[200]"
        >
          <span
            className="block w-6 h-[2px] rounded-[2px] transition-all duration-300 ease-in-out"
            style={{
              background: "var(--tan-light)",
              transform: isOpen ? "translateY(7px) rotate(45deg)" : undefined,
            }}
          />
          <span
            className="block w-6 h-[2px] rounded-[2px] transition-all duration-300 ease-in-out"
            style={{
              background: "var(--tan-light)",
              opacity: isOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-[2px] rounded-[2px] transition-all duration-300 ease-in-out"
            style={{
              background: "var(--tan-light)",
              transform: isOpen ? "translateY(-7px) rotate(-45deg)" : undefined,
            }}
          />
        </button>
      </nav>
    </>
  );
}
