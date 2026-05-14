export default function Quote() {
  return (
    <section className="bg-surface border-y border-border py-[5rem] px-12 text-center max-[900px]:px-6">
      <span
        className="font-display text-[5rem] text-gold leading-[0.5] mb-8 block opacity-50"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p className="font-display text-[clamp(1.3rem,2.5vw,1.9rem)] italic text-tan-light max-w-[750px] mx-auto mb-6 leading-[1.5]">
        We cared so much for you that we were delighted to share with you not
        only the gospel of God, but our very lives as well.
      </p>
      <div className="font-mono text-[0.75rem] text-gold-dim tracking-[0.1em]">
        1 Thessalonians 2:8
      </div>
    </section>
  );
}
