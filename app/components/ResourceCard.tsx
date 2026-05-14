"use client";

export interface ResourceData {
  type: string;
  title: string;
  desc: string;
  tags: string[];
  pdfUrl: string;
  modalTitle: string;
}

interface Props extends ResourceData {
  onClick: () => void;
}

export default function ResourceCard({ type, title, desc, tags, onClick }: Props) {
  return (
    <div
      className="group relative bg-surface border border-border p-8 flex flex-col gap-4 overflow-hidden cursor-pointer transition-[border-color,transform] duration-200 hover:border-gold hover:-translate-y-0.5"
      onClick={onClick}
    >
      <span className="absolute top-6 right-6 text-[1rem] text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        ↗
      </span>
      <div className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gold">
        {type}
      </div>
      <div className="font-display text-[1.35rem] font-bold text-tan-light leading-[1.2]">
        {title}
      </div>
      <p className="text-[0.88rem] text-muted leading-[1.65]">{desc}</p>
      <div className="flex flex-wrap gap-[0.4rem] mt-auto">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[0.65rem] font-semibold tracking-[0.08em] uppercase px-[0.6rem] py-[0.2rem] border border-border text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
