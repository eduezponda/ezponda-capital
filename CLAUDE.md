# Ezponda Capital — CLAUDE.md

## Product Overview

Premium investment research platform focused on commodities (gold, copper, macro cycles).
Monetized via subscription: free previews → premium full access.

Conversion funnel: browse theses → click thesis → hit paywall → login/signup → upgrade.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, RSC-first)
- **Styling:** Tailwind CSS v4
- **Icons:** Material Symbols Outlined (decorative) + lucide-react (interactive UI)
- **Fonts:** Inter (100–900) via `next/font`
- **Auth:** Supabase Auth via `@supabase/ssr`
- **Database:** Supabase (Postgres) — `lib/supabase/client.ts`, `server.ts`, `admin.ts`
- **Payments:** Stripe — `lib/stripe.ts`, Checkout + webhook fully wired
- **Content:** MDX via `next-mdx-remote` + `gray-matter` — theses live in `content/theses/*.mdx`
- **Commodity prices:** GoldAPI.io — refreshed daily via Vercel cron → Supabase

---

## Architecture Principles

- **Server-first:** RSC by default. Only forms, filters, tickers, and auth-reactive components are `"use client"`.
- **URL as state:** Filters use `?category=` searchParams — no React state, bookmarkable.
- **No Zustand:** Session read server-side via `getSession()`. UI state via URL.
- **Separation:** `components/` (generic UI) / `features/` (domain logic) / `lib/` (data + infra).

---

## Folder Structure

```
app/                        # Next.js App Router pages and API routes
  api/                      # commodities prices/refresh, email-list, stripe checkout/webhook
  auth/login, signup/       # Auth pages (confirm-email for post-signup flow)
  theses/[slug]/            # Thesis detail — free or PremiumGate'd based on MDX tier field
  commodities/, sovereign/  # Public pages

components/
  layout/                   # Navbar, Footer, Container, LayoutWrapper
  ui/                       # Button, Card, Badge, Input, Ticker
  sections/                 # Hero, ThesisCard, MacroIndicators, MethodologySteps, etc.

features/
  auth/                     # AuthLayout, LoginForm, SignupForm, session.ts
  subscription/             # PremiumGate, Paywall, UpgradeCTA, SubscribeButton, entitlements.ts
  theses/                   # ThesisGallery, ThesisFilter
  commodities/              # CommoditySection, commodities.ts
  macro/                    # MacroTicker

lib/
  supabase/                 # client.ts (browser), server.ts (RSC), admin.ts (service role)
  api/                      # theses.ts, indicators.ts, prices.ts
  types/database.ts         # Shared Supabase types
  stripe.ts                 # Lazy Stripe initializer
  utils.ts                  # cn(), formatDate(), formatPrice(), formatPct()

content/theses/             # MDX thesis files — frontmatter drives gallery + gating
middleware.ts               # Session refresh only — no route blocking
```

---

## Icon System

Two libraries — not interchangeable:

- **Material Symbols Outlined** — decorative icons in page content only. Loaded via `<link>` in `app/layout.tsx` with `display=block`. Usage: `<span className="material-symbols-outlined">icon_name</span>`. Never use for interactive elements.
- **lucide-react** — all interactive UI: navbar, buttons, toggles, form controls. Renders instantly regardless of font load state.

---

## Design System

### Colors
```
surface:                 #131313   (page background)
surface-container-low:  #1c1b1b
surface-container:      #201f1f
surface-container-high: #2a2a2a
on-surface:             #e5e2e1
on-surface-variant:     #c6c6c6
outline:                #919191
outline-variant:        #474747
tertiary:               #ffe084   (gold accent)
tertiary-container:     #a98e39
primary-container:      #f8d056
```

### Reusable CSS classes (globals.css)
- `.gold-gradient` — radial gold background
- `.text-gold` — gold gradient text via `-webkit-background-clip`
- `.glass-panel` — `rgba(32,31,31,0.8)` + `blur(20px)`
- `.animate-marquee` — 30s linear marquee, pauses on hover

### Typography
All Inter. Labels: uppercase + wide tracking.

| Token | Size | Weight | Use |
|---|---|---|---|
| display-lg | 5rem | 800 | Hero headlines |
| headline-sm | 2.5rem | 700 | Section titles |
| body-lg | 1.125rem | 400 | Editorial copy |
| label-sm | 0.6875rem | 500 | Metadata, tickers, nav |

---

## Monetization Layer

```
Public   → thesis gallery, previews, macro teaser
Premium  → /theses/[slug] full content (when tier: "premium" in MDX frontmatter)
```

Gating stack: `PremiumGate` (RSC) → `Paywall` → `UpgradeCTA` → `SubscribeButton` → Stripe Checkout.

Individual thesis pages read `tier` from MDX frontmatter. `tier: "free"` renders fully; `tier: "premium"` wraps the body in `<PremiumGate>`. The gallery is always public.

---

## Auth

- Provider: Supabase Auth — email and password only, no OAuth, no magic links
- Registration: open — anyone can self-register
- Email confirmation: disabled
- Session: managed by `@supabase/ssr` via cookies, refreshed in `middleware.ts` on every request
- On login/signup success: redirect to `/theses`
- Role hierarchy: `superadmin` > `subscriber` > `free`
- Tier mapping: `superadmin` + `subscriber` → premium access · `free` → free access only
- No routes are blocked at middleware level — content gating happens at the component level via `PremiumGate`
- Do NOT add OAuth providers without explicit instruction
- Do NOT enable email confirmation without explicit instruction

---

## Key Constraints

- **Do NOT redesign UI without explicit instruction.**
- No Zustand or global client state.
- Only `"use client"` where strictly necessary: forms, `Ticker`, `ThesisFilter`, `Navbar` (auth state).
- Never import `lib/supabase/admin.ts` in client components — service role key must stay server-side.
- Do not add docstrings, comments, or type annotations to unchanged code.

---

## Git Workflow

Branches: `feature/<name>`, `fix/<name>`, `chore/<name>`, `docs/<name>`

```
feature branch  →  focused commits  →  PR on GitHub  →  human approves  →  merge  →  delete branch
```

- One logical change per commit. Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- Branch names: lowercase kebab-case (`feature/stripe-subscribe-button`)
- Open a PR when the feature is complete and builds cleanly — never push features directly to main
- Pre-push hook (`.githooks/pre-push`) runs `npm run build` automatically on any push to main
- After merge: `git checkout main && git pull && git branch -d <branch>`

---

## Validation

Three levels — each enforced by the pre-push hook (`.githooks/pre-push`):

| When | Check | How |
|---|---|---|
| Committing to feature branch | None required | Push freely |
| Before creating a PR | `npm run build` | Run manually to catch all errors |
| Push to main | `npm run build` | Hook enforces automatically, blocks on failure |

Feature branch pushes run `npx tsc --noEmit --skipLibCheck` automatically (fast, ~5s).
Do NOT run `npm run build` during routine development — it's too slow.

---

## Phase 2 (not started)

- Stripe Live Mode — swap test keys for live keys, new webhook endpoint
- Dashboard / "terminal" — subscriber-only data view
- Additional thesis content — add MDX files to `content/theses/`
