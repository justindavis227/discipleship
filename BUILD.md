# Discipleship Site Migration + Briefing Portal — Build Kickoff

**Owner:** Justin Davis
**Project:** Migrate `discipleship-one.vercel.app` from static HTML to Next.js, then add the Next Gen Briefing portal
**Last updated:** May 13, 2026

---

## How to Use This Document

This is the master reference for the entire build. Drop it in your repo as `BUILD.md` at the project root, or keep it open in a tab alongside Claude Code. When Claude Code starts a new conversation, point it here first so it has full context.

**Workflow recommendation:** Tackle one phase per work session. Each phase has a clear milestone. Don't move on until the milestone is verified working.

---

## Project Overview

### What We're Building

A unified Next.js application that combines:

1. **Existing discipleship framework site** — current static `index.html` ported to Next.js (visual parity required, no redesign)
2. **4-Chair Personal Inventory** — current `inventory.html` ported, eventually with saved results
3. **The Next Gen Briefing** — new weekly briefing portal with:
   - Current week feature card on landing
   - Searchable archive
   - Audience filtering (Parents / Leaders / Students)
   - Email subscription with double opt-in
   - Segmented email sending via Resend
   - Admin editor for creating/publishing briefings

### Single-Project Architecture

```
discipleship-one.vercel.app   (one domain, one repo, one deployment)
├── /                ← existing homepage, ported
├── /inventory       ← existing inventory tool, ported
├── /briefing        ← NEW: briefing landing (current + archive)
├── /briefing/[slug] ← NEW: individual briefing pages
├── /subscribe       ← NEW: subscribe page
├── /confirm/[token] ← NEW: email confirmation handler
├── /unsubscribe/[token] ← NEW: one-click unsubscribe
├── /admin           ← NEW: protected, for Justin only
└── /api/*           ← NEW: API routes for subscribe, send, etc.
```

### Stack

| Layer | Tool | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Everything |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS + CSS variables | Match existing design tokens |
| Database + Auth | Supabase | Briefings, subscribers, admin auth |
| Email | Resend + React Email | Transactional + bulk sends |
| Hosting | Vercel | Auto-deploy from GitHub |
| Source | GitHub (existing repo) | `justindavis227/discipleship` |

**Total monthly cost at launch scale: $0** (all free tiers)

---

## Design Tokens (From Existing Site)

These are the exact values from your current `index.html`. Drop them into the new project verbatim.

### CSS Variables

```css
:root {
  --bg: #0f0e0c;
  --surface: #1a1815;
  --surface2: #222019;
  --border: #2e2b26;
  --tan: #c8b89a;
  --tan-light: #ddd0bb;
  --gold: #d4a843;
  --gold-dim: #9a7830;
  --white: #f5f0e8;
  --muted: #7a7368;
  --red: #c0392b;

  /* New: Audience accents for briefing */
  --aud-parent: #8ba87a;
  --aud-leader: #d4a843;
  --aud-student: #c08a5c;
}
```

### Fonts

- **Playfair Display** (serif, weights 400/700/900, italics) — headlines, brand
- **DM Sans** (sans, weights 300/400/500/600/700) — body
- **DM Mono** (weights 400/500) — labels, scripture references, meta

Load via `next/font/google` in `app/layout.tsx`.

### Signature Design Patterns

- Noise overlay (SVG turbulence filter at 4% opacity, fixed positioning)
- Gold underline-bar before section labels (`::before { width: 1.5rem; height: 1px; background: gold }`)
- Italic emphasis in headlines via `<em>` shifting to tan color
- Stat cards with 3px gold left border accent
- Hover states: border-color shifts to gold-dim
- Section labels in DM Mono uppercase with 0.2em letter-spacing

---

## Phase 0 — Setup (1-2 hours)

### Step 1: Decide repo strategy

**Recommended: New branch on existing repo.**

Why: Your current static site stays live. Vercel auto-creates preview deployments for branches. When migration is complete, merge to `main` and the production deployment updates.

```bash
cd /path/to/discipleship
git checkout -b nextjs-migration
```

If you'd rather start fresh: create a new repo `discipleship-next`, do the work, then either rename when ready or point Vercel project at the new repo.

### Step 2: Initialize Next.js

In the project root:

```bash
# This will fail if files exist; use --force flag or work in a subdirectory then move files
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

When prompted:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind: **Yes**
- `src/` directory: **No** (keep `app/` at root)
- App Router: **Yes**
- Turbopack: **Yes** (faster dev)
- Customize alias: **No**

### Step 3: Move existing assets

```bash
mkdir -p public/pdfs public/images
mv 4_Chair_Card.pdf 5_PHASES_*.pdf Team_Leader_Manual_*.pdf Unleashed_Leaders_*.pdf public/pdfs/
mv 10.png 11.png 14.png 15.png 16.png 17.png Typography_IMG.png public/images/
```

Note: You'll need to update PDF/image paths in your ported components from `'14.png'` to `'/images/14.png'`.

### Step 4: Save current HTML as reference

```bash
mkdir _migration-reference
cp index.html _migration-reference/original-index.html
cp inventory.html _migration-reference/original-inventory.html
```

Keep these so you can diff during the port. They're gitignored after migration completes.

Add to `.gitignore`:
```
_migration-reference/
```

### Step 5: Set up Supabase

1. Go to [supabase.com](https://supabase.com), create new project named `discipleship`
2. Save these from project settings → API:
   - Project URL
   - `anon` (public) key
   - `service_role` (secret) key — never expose to client
3. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

### Step 6: Set up Resend

1. Go to [resend.com](https://resend.com), create account
2. Verify a domain you control (recommendation: `discipleship-one.vercel.app` works, or use a subdomain like `mail.yoursite.com` if you own a real domain)
3. Add SPF, DKIM, DMARC records to your DNS (Resend provides them)
4. Save API key
5. Install:
   ```bash
   npm install resend react-email @react-email/components
   ```

### Step 7: Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
RESEND_API_KEY=re_xxx...
RESEND_FROM_EMAIL=briefing@yourverifieddomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

In Vercel project settings, add the same variables (production version with real URL).

### Step 8: Deploy empty starter

```bash
git add .
git commit -m "Initialize Next.js project structure"
git push origin nextjs-migration
```

Vercel should auto-deploy the branch to a preview URL like `discipleship-git-nextjs-migration-justindavis227.vercel.app`.

### Phase 0 Milestone ✓
- [ ] New branch (or repo) exists with Next.js scaffold
- [ ] Existing site still live at production URL
- [ ] Preview deployment of empty Next.js works
- [ ] Supabase project created, keys saved
- [ ] Resend account created, domain verified
- [ ] Environment variables set locally and on Vercel

---

## Phase 1 — Port Existing Site (Weekend 1)

**Goal:** Visual parity. New Next.js site looks identical to current live site.

### File Structure

```
app/
├── layout.tsx          ← Root layout, fonts, nav, footer
├── page.tsx            ← Homepage (replaces index.html)
├── globals.css         ← All CSS vars + base styles
├── inventory/
│   └── page.tsx        ← 4-Chair Inventory
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── Philosophy.tsx
│   ├── FourChairs.tsx
│   ├── ChairCard.tsx
│   ├── Resources.tsx
│   ├── ResourceCard.tsx
│   ├── PDFModal.tsx
│   ├── Mantras.tsx
│   ├── MantraCard.tsx
│   ├── Quote.tsx
│   └── Footer.tsx
└── lib/
    └── data/
        ├── chairs.ts   ← 4-Chair content as data
        ├── resources.ts ← Resource cards as data
        └── mantras.ts  ← Mantras content as data
```

### globals.css (drop in as-is)

```css
@import "tailwindcss";

:root {
  --bg: #0f0e0c;
  --surface: #1a1815;
  --surface2: #222019;
  --border: #2e2b26;
  --tan: #c8b89a;
  --tan-light: #ddd0bb;
  --gold: #d4a843;
  --gold-dim: #9a7830;
  --white: #f5f0e8;
  --muted: #7a7368;
  --red: #c0392b;
  --aud-parent: #8ba87a;
  --aud-leader: #d4a843;
  --aud-student: #c08a5c;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface2: var(--surface2);
  --color-border: var(--border);
  --color-tan: var(--tan);
  --color-tan-light: var(--tan-light);
  --color-gold: var(--gold);
  --color-gold-dim: var(--gold-dim);
  --color-white: var(--white);
  --color-muted: var(--muted);
  --color-aud-parent: var(--aud-parent);
  --color-aud-leader: var(--aud-leader);
  --color-aud-student: var(--aud-student);

  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1000;
  opacity: 0.4;
}
```

### app/layout.tsx (starter)

```tsx
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "se.church // Next Gen — Discipleship Framework",
  description: "Discipling the next generation. Frameworks, leader resources, and tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### Migration Checklist for index.html

Work through these in order. Each task is a single component port:

- [ ] **`<Nav />`** — fixed top nav with logo and links. Add `/briefing` as a new link (will 404 until Phase 3).
- [ ] **`<Hero />`** — hero section with eyebrow, title, description, CTAs, and stat cards
- [ ] **`<Philosophy />`** — three philosophy cards (01, 02, 03)
- [ ] **`<FourChairs />`** — the four chair flip cards (uses `<ChairCard />` subcomponent)
- [ ] **`<ChairCard />`** — individual flip card with state for flipped/not (use `useState`)
- [ ] **`<Resources />`** — resource section header + grid of resource cards
- [ ] **`<ResourceCard />`** — individual card that opens PDF modal
- [ ] **`<PDFModal />`** — fullscreen modal with iframe for PDF viewing
- [ ] **`<Mantras />`** — the 5 mantras section
- [ ] **`<MantraCard />`** — individual mantra with flip-to-video behavior
- [ ] **`<Quote />`** — the 1 Thessalonians 2:8 quote section
- [ ] **`<Footer />`** — footer with branding and tagline

### Data Extraction Strategy

Pull content out of JSX into `lib/data/*.ts` files. This makes the components cleaner and lets you eventually move content to Supabase if you want admin editing of the homepage too.

Example `lib/data/chairs.ts`:

```typescript
export interface Chair {
  number: string;
  title: string;
  challenge: string;
  action: string;
  verseRef: string;
  scripture: {
    reference: string;
    text: string;
  };
  category: string;
  image: string;
}

export const chairs: Chair[] = [
  {
    number: "01",
    title: "The Lost",
    challenge: "Come & See",
    action: "The invitation before the commitment. Every student matters before they believe. We move toward them.",
    verseRef: "John 1:39 · Reach",
    scripture: {
      reference: "John 1:38–39",
      text: "38 Jesus looked around and saw them following...",
    },
    category: "Reach",
    image: "/images/14.png",
  },
  // ... etc
];
```

### Inventory Port

The inventory has JavaScript form logic. Port it to a client component:

```tsx
"use client";
// app/inventory/page.tsx

import { useState } from "react";

export default function InventoryPage() {
  const [currentChair, setCurrentChair] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([[], [], [], []]);
  // ... port inventory logic from inventory.html
}
```

Plan to enhance this in Phase 6 (post-MVP) with saved results to Supabase.

### Verification Process

After each component is ported:
1. Visit the preview URL
2. Open current live site in another tab at the same section
3. Verify visual parity (use browser devtools to compare CSS)
4. Test all interactions (flip cards, modals, etc.)
5. Mark the checklist item done

### Phase 1 Milestone ✓
- [ ] All sections of homepage ported and visually identical to live site
- [ ] Inventory page ported and functional
- [ ] All PDFs and images load correctly
- [ ] No console errors in browser
- [ ] Mobile responsive matches existing site

---

## Phase 2 — Production Swap (15-30 minutes)

**Goal:** Replace the live static site with the new Next.js version.

### Steps

1. **Merge migration branch:**
   ```bash
   git checkout main
   git merge nextjs-migration
   git push origin main
   ```

2. **Vercel will auto-deploy main.** Production URL now serves the Next.js app.

3. **Smoke test production:**
   - Visit `discipleship-one.vercel.app`
   - Click every nav link
   - Open every PDF
   - Take the inventory
   - Test on mobile

4. **If anything's broken:** revert is simple:
   ```bash
   git revert HEAD
   git push origin main
   ```
   This restores the previous deployment.

5. **Keep `_migration-reference/` for a week** in case you need to compare. Delete when confident.

### Phase 2 Milestone ✓
- [ ] Production URL serves Next.js app
- [ ] All existing functionality works
- [ ] No regressions reported

---

## Phase 3 — Database & Briefing Reader (Weekend 2)

**Goal:** A working `/briefing` route that reads from Supabase and renders briefings.

### Supabase Schema

Run this SQL in your Supabase project's SQL Editor:

```sql
-- ============ BRIEFINGS ============
create table public.briefings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  week_of date not null,
  issue_number int unique not null,
  title text not null,
  headline text not null,
  lede text not null,
  in_this_issue jsonb default '[]'::jsonb,
  audiences text[] default array['parent','leader','student']::text[],
  topic_tags text[] default array[]::text[],
  content_json jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index briefings_status_published_at_idx
  on public.briefings (status, published_at desc);

create index briefings_audiences_idx
  on public.briefings using gin (audiences);

create index briefings_topic_tags_idx
  on public.briefings using gin (topic_tags);

-- ============ SUBSCRIBERS ============
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  audience_prefs text[] not null default array[]::text[],
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  confirm_token text unique,
  unsub_token text unique not null default gen_random_uuid()::text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz
);

create index subscribers_status_idx
  on public.subscribers (status);

create index subscribers_audience_prefs_idx
  on public.subscribers using gin (audience_prefs);

-- ============ ROW LEVEL SECURITY ============
alter table public.briefings enable row level security;
alter table public.subscribers enable row level security;

-- Public can read published briefings
create policy "Anyone can read published briefings"
  on public.briefings for select
  using (status = 'published');

-- Admin (you, via Supabase Auth) can do anything
-- We'll set up admin access in Phase 5
create policy "Authenticated users can manage briefings"
  on public.briefings for all
  using (auth.role() = 'authenticated');

-- Subscribers: server-side only (via service role key in API routes)
-- No public RLS policy = no public access
-- API routes use service role key to bypass RLS
```

### content_json Structure

This is the format each briefing's content takes:

```typescript
interface BriefingContent {
  sections: Array<{
    type: 'headline' | 'research' | 'culture' | 'audience' | 'resources';
    label: string;          // "This Week's Headline" etc.
    items: Array<{
      heading?: string;     // h3 title
      body?: string;        // paragraph(s), markdown allowed
      pullQuote?: {
        label: string;
        text: string;
      };
      audienceBlock?: {
        audience: 'parent' | 'leader' | 'student';
        body: string;
      };
      link?: {
        text: string;
        url: string;
      };
    }>;
  }>;
}
```

Save this as `lib/types/briefing.ts`.

### Supabase Client Setup

`lib/supabase/server.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

`lib/supabase/admin.ts` (for API routes that need elevated permissions):
```typescript
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
```

### Routes to Build

- `app/briefing/page.tsx` — landing: current week + archive
- `app/briefing/[slug]/page.tsx` — individual briefing detail
- `app/components/briefing/BriefingFeature.tsx` — current week card
- `app/components/briefing/BriefingDetail.tsx` — full briefing content renderer
- `app/components/briefing/ArchiveList.tsx` — list of past issues
- `app/components/briefing/AudienceFilter.tsx` — filter pills (client component, URL params)

### Seed Data

Manually insert 2-3 briefings via Supabase SQL Editor or table UI to test the rendering. Use the sample briefing we built earlier as one of them.

### Phase 3 Milestone ✓
- [ ] Schema deployed to Supabase
- [ ] `/briefing` shows latest published briefing in feature card
- [ ] Archive lists older briefings, newest first
- [ ] Audience filter works (URL: `/briefing?audience=parent`)
- [ ] `/briefing/[slug]` renders an individual briefing fully

---

## Phase 4 — Subscriber System (Weekend 3)

**Goal:** People can subscribe, confirm via email, and unsubscribe.

### Routes & Components

- `app/subscribe/page.tsx` — subscribe page (or modal triggered from briefing page)
- `app/confirm/[token]/page.tsx` — confirmation handler
- `app/unsubscribe/[token]/page.tsx` — unsubscribe handler
- `app/api/subscribe/route.ts` — POST handler: inserts pending subscriber, sends confirmation
- `app/api/confirm/route.ts` — POST handler: marks subscriber confirmed
- `app/api/unsubscribe/route.ts` — POST handler: marks subscriber unsubscribed
- `emails/ConfirmEmail.tsx` — React Email template for confirmation

### Subscribe Flow

1. User fills form: email + audience checkboxes (parent/leader/student, multi-select)
2. POST `/api/subscribe`:
   - Validate email
   - Insert row in `subscribers` with status='pending', generated `confirm_token`
   - Send Resend email with link to `/confirm/[token]`
   - Return success
3. User clicks link in email → `/confirm/[token]` page
4. Page calls `/api/confirm`: validates token, updates status to 'confirmed', sets `confirmed_at`
5. User sees "You're in!" message

### Unsubscribe Flow

Every briefing email contains link: `https://your-site/unsubscribe/[unsub_token]`

1. Click → `/unsubscribe/[token]` page
2. Page calls `/api/unsubscribe`: validates token, updates status to 'unsubscribed', sets `unsubscribed_at`
3. User sees confirmation, optionally with "Why are you leaving?" feedback field (skip for v1)

### Resend Setup in Code

`lib/resend.ts`:
```typescript
import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY!);
```

Example send:
```typescript
import { resend } from "@/lib/resend";
import ConfirmEmail from "@/emails/ConfirmEmail";

await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: subscriberEmail,
  subject: "Confirm your subscription to The Next Gen Briefing",
  react: ConfirmEmail({ confirmUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm/${token}` }),
});
```

### Legal Compliance Checklist

- [ ] Double opt-in implemented (status='pending' until confirmation)
- [ ] Unsubscribe link in every email
- [ ] One-click unsubscribe (no login required)
- [ ] Physical mailing address in email footer (church address is fine)
- [ ] Privacy note on subscribe form ("We'll never share your email")

### Phase 4 Milestone ✓
- [ ] Subscribe form on `/briefing` works end-to-end
- [ ] Confirmation email arrives within 30 seconds
- [ ] Clicking confirm link marks subscriber confirmed
- [ ] Unsubscribe works in one click
- [ ] Database accurately reflects subscriber state

---

## Phase 5 — Admin & Sending (Weekend 4)

**Goal:** You can write a briefing in `/admin`, publish it to the site, and email it to subscribers.

### Authentication

Use Supabase Auth with magic link (passwordless, sent to your email):

1. Enable Email auth provider in Supabase dashboard
2. Restrict signups (only your email can sign in)
3. Build `/admin/login` page with magic link form
4. Build middleware `middleware.ts` that protects `/admin/*` routes

`middleware.ts`:
```typescript
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

### Admin Routes

- `app/admin/login/page.tsx` — magic link form
- `app/admin/page.tsx` — dashboard: list of briefings, subscriber count, recent sends
- `app/admin/briefings/new/page.tsx` — create new briefing
- `app/admin/briefings/[id]/edit/page.tsx` — edit existing
- `app/admin/briefings/[id]/send/page.tsx` — send to subscribers (with confirmation)
- `app/api/admin/briefings/route.ts` — create/update briefing
- `app/api/admin/send/route.ts` — send briefing to confirmed subscribers matching audiences

### Briefing Editor

Form fields:
- Slug (auto-generated from headline, editable)
- Week of (date)
- Issue number (auto-increment)
- Title (internal label)
- Headline (the big hero headline; supports `<em>` for italic)
- Lede (paragraph)
- In This Issue (array of strings, one per line)
- Audiences (checkboxes)
- Topic tags (comma-separated input)
- Content sections (structured editor — start with JSON textarea for v1, upgrade later)
- Status (draft / published)

### Sending Logic

```typescript
// app/api/admin/send/route.ts
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import BriefingEmail from "@/emails/BriefingEmail";

export async function POST(req: Request) {
  // Verify admin auth
  // Get briefing by ID
  // Query subscribers where status='confirmed' AND audience_prefs && briefing.audiences
  // Batch send (Resend supports 100 recipients per call)
  // Log sends
  // Return summary
}
```

Use Resend's batch API to send efficiently:
```typescript
const { data, error } = await resend.batch.send(
  subscribers.map((sub) => ({
    from: process.env.RESEND_FROM_EMAIL!,
    to: sub.email,
    subject: briefing.headline,
    react: BriefingEmail({ briefing, unsubToken: sub.unsub_token }),
  }))
);
```

### React Email Template

`emails/BriefingEmail.tsx` — render the same content as the web version but optimized for email clients:
- Dark background (`#0f0e0c`)
- Gold accents
- Larger touch targets
- Inlined fonts (system fallbacks)
- Plain-text fallback included
- Unsubscribe link in footer

Test in Gmail, Apple Mail, Outlook before sending widely.

### Phase 5 Milestone ✓
- [ ] You can log into `/admin` via magic link
- [ ] You can create a new briefing in the editor
- [ ] Save as draft works; publish toggles to public
- [ ] Sending sends to all confirmed subscribers matching audiences
- [ ] Email renders well in major clients
- [ ] Unsubscribe link in email works

---

## Phase 6 — Polish & Launch (Ongoing)

### Quick Wins

- [ ] Add `/briefing` link to main site navigation
- [ ] Add subscribe CTA to homepage
- [ ] Search the archive (Supabase full-text search on title + headline)
- [ ] Topic tag filtering (URL: `/briefing?topic=research`)
- [ ] RSS feed at `/briefing/rss.xml`
- [ ] Open Graph meta tags for social sharing per briefing
- [ ] Sitemap generation

### Nice to Have (Post-Launch)

- [ ] Save inventory results to Supabase (lets users return to their results)
- [ ] Resource download tracking
- [ ] Admin analytics dashboard (subscriber growth, open rates from Resend)
- [ ] Email preview before send
- [ ] Schedule send for future date (Vercel Cron)
- [ ] Multiple admin users (currently just you)

### Soft Launch Plan

1. Publish 2-3 briefings in `draft` status, render to admin only
2. Send to yourself, then to 3 staff members for feedback
3. Iterate on template + voice for 2 weeks
4. Publish #1 publicly, share with leadership team
5. After 3-4 public issues, open subscribe form to the church
6. Promote via existing channels (announcements, newsletter, social)

---

## Working With Claude Code

### Recommended Project Setup

1. Create `CLAUDE.md` in repo root with this context summary:
   ```markdown
   # Project Context
   
   This is a Next.js app for Southeast Christian Church's discipleship ministry.
   It includes:
   - Discipleship framework site (homepage, 4-Chair Inventory)
   - Next Gen Briefing portal (weekly briefing + email)
   
   Stack: Next.js 15 (App Router), TypeScript, Tailwind, Supabase, Resend, React Email
   
   Design tokens are CSS variables in app/globals.css.
   Refer to BUILD.md for full architecture and phase plan.
   ```

2. Reference `BUILD.md` (this document) when starting Claude Code sessions:
   > "Read BUILD.md, then help me with Phase 3, Step 2."

### Effective Prompts by Phase

**Phase 1 example:**
> "Read _migration-reference/original-index.html. Port the 'Four Chairs' section (CHAIR 01-04) to a React component at app/components/FourChairs.tsx, with flip-card behavior using useState. Keep all CSS classes identical to preserve styling."

**Phase 3 example:**
> "Build app/briefing/page.tsx. It should fetch the latest published briefing from Supabase and render it in a feature card matching the design in BUILD.md. Reference the mockup design tokens."

**Phase 4 example:**
> "Implement the subscribe flow: form component, API route /api/subscribe, and ConfirmEmail React Email template. Use the schema from BUILD.md Phase 3."

### Always Verify

After Claude Code completes work:
1. Run `npm run dev` and visit the relevant page
2. Check browser console for errors
3. Test the interaction (subscribe, click, filter)
4. Run `npm run build` to check for TypeScript errors before pushing

---

## File Inventory (What You'll End Up With)

```
discipleship/
├── BUILD.md                     ← this doc
├── CLAUDE.md                    ← Claude Code context
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── middleware.ts
├── .env.local                   (gitignored)
├── .env.example                 (committed, no values)
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                 ← Homepage
│   ├── inventory/
│   │   └── page.tsx
│   ├── briefing/
│   │   ├── page.tsx             ← Landing
│   │   └── [slug]/
│   │       └── page.tsx         ← Detail
│   ├── subscribe/
│   │   └── page.tsx
│   ├── confirm/
│   │   └── [token]/
│   │       └── page.tsx
│   ├── unsubscribe/
│   │   └── [token]/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── login/
│   │   ├── page.tsx
│   │   └── briefings/
│   ├── api/
│   │   ├── subscribe/
│   │   ├── confirm/
│   │   ├── unsubscribe/
│   │   └── admin/
│   └── components/
│       ├── Nav.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx
│       ├── Philosophy.tsx
│       ├── FourChairs.tsx
│       ├── ChairCard.tsx
│       ├── Resources.tsx
│       ├── PDFModal.tsx
│       ├── Mantras.tsx
│       ├── Quote.tsx
│       └── briefing/
│           ├── BriefingFeature.tsx
│           ├── BriefingDetail.tsx
│           ├── ArchiveList.tsx
│           ├── AudienceFilter.tsx
│           └── SubscribeForm.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── client.ts
│   │   └── admin.ts
│   ├── resend.ts
│   ├── data/
│   │   ├── chairs.ts
│   │   ├── resources.ts
│   │   └── mantras.ts
│   └── types/
│       └── briefing.ts
├── emails/
│   ├── ConfirmEmail.tsx
│   └── BriefingEmail.tsx
├── public/
│   ├── pdfs/
│   └── images/
└── _migration-reference/        (gitignored, delete after Phase 2)
    ├── original-index.html
    └── original-inventory.html
```

---

## Common Pitfalls to Avoid

1. **Don't redesign during migration.** Phase 1 is lift-and-shift only. Improvements come later.
2. **Don't skip double opt-in.** Saves you from spam complaints and possible deliverability blackballing.
3. **Don't expose service role key to client.** It bypasses RLS. Only use in API routes (server-side).
4. **Don't test sending to real subscribers.** Send to yourself first. Always.
5. **Don't deploy without checking `npm run build` locally.** TypeScript errors will block production deploy.
6. **Don't forget the unsubscribe link.** Every. Email.
7. **Don't try to automate briefing curation in v1.** Build the manual flow first. Refine for 8+ weeks. Then consider automation.

---

## Quick Reference: Useful Commands

```bash
# Development
npm run dev                          # Start dev server (localhost:3000)
npm run build                        # Production build (catches errors)
npm run lint                         # Check for issues

# Git workflow
git checkout -b feature/some-thing   # New feature branch
git add . && git commit -m "..."     # Commit
git push origin feature/some-thing   # Push (auto-creates Vercel preview)

# Supabase
# Manage via dashboard: https://supabase.com/dashboard/project/[your-project]/editor

# Resend
# Manage via dashboard: https://resend.com/emails

# Vercel
# Deploys auto from git push. Manage at vercel.com/dashboard
```

---

## When You're Stuck

In order of triage:

1. **Check the browser console** for client errors
2. **Check Vercel deployment logs** for build/runtime errors
3. **Check Supabase logs** for database query issues
4. **Check Resend dashboard** for email send status
5. **Ask Claude Code** with the error message and relevant file
6. **Refer back to BUILD.md** for the intended architecture

---

## What "Done" Looks Like

You'll know the project is launched when:

- ✅ `discipleship-one.vercel.app` serves the unified Next.js app
- ✅ All existing functionality (homepage, inventory, PDFs) works
- ✅ `/briefing` shows the current week with searchable archive
- ✅ At least 10 confirmed subscribers across the three audience tracks
- ✅ You've published and sent 3+ real briefings
- ✅ Email opens are landing in inbox (not spam) for major providers
- ✅ You can write, publish, and send a briefing in under 30 minutes from `/admin`

The first three are the technical bar. The last four are how you'll know it's actually serving the ministry.

---

## Final Note

This document is intentionally exhaustive so you don't have to re-derive things. But the most important thing is to **start.** Phase 0 takes 1-2 hours. Do that this week. Once the foundation is laid, momentum builds fast.

When you sit down for Phase 1, don't open all the components at once. Pick one — `<Nav />` or `<Hero />` — and finish it completely before moving to the next. Solo builds die in too-many-half-finished-things.

Good luck. This is going to be a meaningful tool for your ministry.
