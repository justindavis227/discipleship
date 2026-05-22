"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function TagFilter({ tags }: { tags: string[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = searchParams.get("tag") ?? "";

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("tag", value);
    } else {
      params.delete("tag");
    }
    router.push(`/briefing${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted">
        Topic
      </span>
      <button
        onClick={() => select("")}
        className={`px-4 py-[0.35rem] border text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-200 cursor-pointer bg-transparent ${
          current === ""
            ? "border-gold text-gold"
            : "border-border text-muted hover:border-tan hover:text-tan"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => select(tag)}
          className={`px-4 py-[0.35rem] border text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-200 cursor-pointer bg-transparent ${
            current === tag
              ? "border-gold text-gold"
              : "border-border text-muted hover:border-tan hover:text-tan"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
