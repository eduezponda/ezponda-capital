# Ezponda Capital

Premium investment research platform focused on commodities — gold, copper, and macro cycles. Built for sophisticated investors who want independent, high-conviction analysis beyond mainstream financial media.

Subscription model: public browsing → login → free research → upgrade to premium full-access tier.

Production: https://ezponda-capital.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, RSC-first) |
| Runtime | React 19 · TypeScript 5 |
| Styling | Tailwind CSS v4 · Inter · Material Symbols + lucide-react |
| Auth | Supabase Auth (`@supabase/ssr`, email/password) |
| Database | Supabase (PostgreSQL + RLS) |
| Payments | Stripe (Checkout + webhooks) |
| Content | MDX via `next-mdx-remote` + `gray-matter` |
| i18n | `next-intl` v4 (en / es, cookie-based) |
| Prices | GoldAPI.io (metals) + api-ninjas.com (Bitcoin), refreshed via Vercel Cron |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Environment variables — see `.env.local.example` (Supabase, Stripe, commodity APIs, `CRON_SECRET`)

### Install and run

```bash
git clone https://github.com/eduezponda/ezponda-capital.git
cd ezponda-capital
npm install
cp .env.local.example .env.local  # fill in the real values
npm run dev
```

Open http://localhost:3000.

### Scripts

```bash
npm run dev      # Next.js dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

Type-check only: `npx tsc --noEmit` (used by git hooks on feature branches).

---

## Project Structure

```
app/                        # Next.js App Router
  api/                      # commodities (prices/refresh), email-list, stripe (checkout/webhook)
  auth/                     # login, signup, confirm-email
  theses/[slug]/            # Thesis detail — gated via ContentGate based on MDX tier
  commodities/, sovereign/  # Public pages
  profile/                  # User plan + upgrade

components/
  layout/                   # Navbar, Footer, Container, LanguageToggle
  ui/                       # Button, Card, Badge, Input, Ticker
  sections/                 # Hero, ThesisCard, MacroIndicators, etc.

features/
  auth/                     # LoginForm, SignupForm, SessionProvider, session.ts
  subscription/             # ContentGate, GuestWall, UpgradeCTA, SubscribeButton, entitlements.ts
  theses/                   # ThesisGallery, ThesisFilter
  commodities/, macro/      # Domain data and sections

lib/
  supabase/                 # client.ts (browser), server.ts (RSC), admin.ts (service role)
  api/                      # theses.ts, indicators.ts, prices.ts
  stripe.ts, utils.ts

content/theses/             # MDX files — frontmatter: title, category, tier, ticker, etc.
messages/                   # en.json, es.json
i18n/                       # next-intl request config
supabase/                   # schema.sql + migrations
middleware.ts               # Supabase session refresh only — no route blocking
vercel.json                 # Cron schedule for /api/commodities/refresh
```

---

## Architecture Principles

- **Server-first:** RSC by default. `"use client"` only where strictly needed (forms, `Ticker`, `ThesisFilter`, `Navbar` auth state).
- **URL as state:** Filters use `?category=` searchParams — bookmarkable, no React state.
- **No global client state:** Session is read server-side via `getSession()` and passed to client components through `SessionProvider`.
- **Single gating component:** `ContentGate` is the sole access check. Guest → `GuestWall`. Logged in with access → children. Logged in without access → inline premium paywall.
- **Separation:** `components/` (generic UI) · `features/` (domain logic) · `lib/` (data + infra).

---

## Access Model

| Role | DB `profiles.role` | Session tier | Access |
|---|---|---|---|
| Guest | — | `null` | Public pages + thesis gallery; thesis detail returns 404 |
| Free | `free` | `free` | Free theses fully · premium theses see inline paywall |
| Subscriber | `subscriber` | `premium` | All content |
| Superadmin | `superadmin` | `premium` | All content |

Gating happens at the component level via `ContentGate`, not in middleware. Thesis detail pages additionally return 404 for guests.

---

## Deployment

- Every push to a feature branch gets a Vercel preview deployment
- PRs to `main` run `npm run build` in GitHub Actions
- Merging to `main` triggers a production deployment
- Cron runs at 08:00 UTC daily (`0 8 * * *`) — Vercel Hobby supports at most one cron invocation per day

See `docs/backend.md` for full backend setup, environment variables, Stripe configuration, and API routes.

---

## License

Private — all rights reserved. Not open for redistribution.
