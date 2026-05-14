export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto px-12 py-[4rem] max-[900px]:flex-col max-[900px]:gap-8 max-[900px]:text-center max-[900px]:px-6 max-[900px]:py-[3rem]">
        <div>
          <div className="font-display text-[1.3rem] font-bold">
            <span className="text-tan-light font-normal">Discipling the</span>{" "}
            <span className="text-gold">Next Generation</span>
          </div>
          <div className="text-[0.8rem] text-muted mt-1">
            Discipleship · Leader Development · Student Ministry
          </div>
        </div>

        <div className="max-[900px]:text-center text-right">
          <div className="text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-2">
            Southeast Christian Church
          </div>
          <div className="font-display italic text-gold text-[0.95rem]">
            Unleash the full force of the church<br />
            to love people one at a time.
          </div>
        </div>
      </div>
    </footer>
  );
}
