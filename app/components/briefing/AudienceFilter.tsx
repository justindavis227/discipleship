"use client";

import { useSearchParams, useRouter } from "next/navigation";

const AUDIENCES = [
  { value: "", label: "All" },
  { value: "parent", label: "Parents" },
  { value: "leader", label: "Leaders" },
  { value: "student", label: "Students" },
];

const ACTIVE_COLORS: Record<string, string> = {
  "": "border-gold text-gold",
  parent: "border-aud-parent text-aud-parent",
  leader: "border-aud-leader text-aud-leader",
  student: "border-aud-student text-aud-student",
};

export default function AudienceFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = searchParams.get("audience") ?? "";

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("audience", value);
    } else {
      params.delete("audience");
    }
    router.push(`/briefing${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted">
        Filter
      </span>
      {AUDIENCES.map(({ value, label }) => {
        const isActive = current === value;
        return (
          <button
            key={value}
            onClick={() => select(value)}
            className={`px-4 py-[0.35rem] border text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-200 cursor-pointer bg-transparent ${
              isActive
                ? ACTIVE_COLORS[value]
                : "border-border text-muted hover:border-tan hover:text-tan"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
