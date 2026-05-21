import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <main className="min-h-screen px-12 pt-[5rem] pb-[6rem] max-w-[1200px] mx-auto max-[900px]:px-6">
      <div className="flex items-start justify-between gap-6 mb-12 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
            <span className="block w-6 h-px bg-gold shrink-0" />
            Next Gen Briefing
          </div>
          <h1 className="font-display font-bold text-white leading-[1.1]" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
            Admin Dashboard
          </h1>
          <p className="text-[0.88rem] text-muted mt-2">
            Signed in as <span className="text-tan">{user.email}</span>
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {[
          { label: "Briefings", desc: "Create, edit, and publish weekly issues", href: "/admin/briefings" },
          { label: "Subscribers", desc: "View confirmed subscribers by audience", href: null },
          { label: "Send", desc: "Send a published briefing to subscribers", href: "/admin/send" },
        ].map(({ label, desc, href }) => {
          const card = (
            <div className="bg-surface border border-border p-8 relative overflow-hidden group h-full">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-gold" />
              <div className="text-[0.68rem] font-mono tracking-[0.18em] uppercase text-muted mb-2">
                {href ? "Available" : "Coming soon"}
              </div>
              <h2 className="font-display font-bold text-white text-[1.2rem] mb-2 group-hover:text-gold transition-colors duration-200">
                {label}
              </h2>
              <p className="text-[0.85rem] text-tan leading-[1.6]">{desc}</p>
            </div>
          );
          return href ? (
            <Link key={label} href={href} className="block no-underline">
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </div>
    </main>
  );
}
