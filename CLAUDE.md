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
- **Auth:** Supabase Auth via `@supabase/ssr` — email/password and Google OAuth
- **Database:** Supabase (Postgres) — `lib/supabase/client.ts`, `server.ts`, `admin.ts`
- **Payments:** Stripe — `lib/stripe.ts`, Checkout + webhook fully wired
- **Content:** MDX via `next-mdx-remote` + `gray-matter` — theses live in `content/theses/*.mdx`
- **i18n:** `next-intl` v4 (en / es, cookie-based) — messages in `messages/`, request config in `i18n/request.ts`
- **Commodity prices:** GoldAPI.io (metals) + api-ninjas.com (Bitcoin) — refreshed daily via Vercel cron → Supabase

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
  theses/[slug]/            # Thesis detail — gated via ContentGate based on MDX tier field
  commodities/, sovereign/  # Public pages
  profile/                  # Authenticated user plan + upgrade
  legal/, privacy/          # Static legal pages

components/
  layout/                   # Navbar, Footer, Container, LanguageToggle
  ui/                       # Button, Card, Badge, Input, Ticker
  sections/                 # Hero, ThesisCard, MacroIndicators, MethodologySteps, etc.

features/
  auth/                     # AuthLayout, LoginForm, SignupForm, SessionProvider, session.ts
  subscription/             # ContentGate, GuestWall, UpgradeCTA, SubscribeButton, ThesisBanner
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
messages/                   # next-intl translations (en.json, es.json)
i18n/request.ts             # next-intl request config
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
Guest      → thesis gallery, previews, macro teaser — thesis detail returns 404
Free       → free theses in full; premium theses render with inline paywall
Subscriber → all content
```

Gating stack: `ContentGate` (RSC, single gate) → `GuestWall` (unauth) or `UpgradeCTA` → `SubscribeButton` → Stripe Checkout.

`ContentGate` is the sole access check. Guest → `GuestWall`. Logged in with access → children. Logged in without access → inline premium paywall. Individual thesis pages read `tier` from MDX frontmatter; thesis detail pages additionally return 404 for guests.

---

## Auth

- Provider: Supabase Auth — email/password and Google OAuth (no magic links)
- Registration: open — anyone can self-register via either method
- Email confirmation: disabled
- Session: managed by `@supabase/ssr` via cookies, refreshed in `middleware.ts` on every request. Server reads via `getSession()`; client components consume via `SessionProvider`
- OAuth users: `handle_new_user` Postgres trigger populates `public.profiles` from `auth.users.raw_user_meta_data` (email + name fall back via `COALESCE`)
- On login/signup success: redirect to `/theses`
- Role hierarchy: `superadmin` > `subscriber` > `free`
- Tier mapping: `superadmin` + `subscriber` → premium access · `free` → free access only
- No routes are blocked at middleware level — content gating happens at the component level via `ContentGate`
- Do NOT add additional OAuth providers (beyond Google) without explicit instruction
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

**This is the mandatory default for every feature, fix, or chore — no exceptions.**

Branches: `feature/<name>`, `fix/<name>`, `chore/<name>`, `docs/<name>`

```
feature branch  →  focused commits  →  PR on GitHub  →  Eduardo approves  →  Eduardo merges  →  delete branch
```

### Rules Claude must follow automatically

1. **Always start on a branch.** Every change starts with `git checkout -b <type>/<name>` — never commit directly to `main`.
2. **Type-check only on feature branches.** Run `npx tsc --noEmit` for quick validation. Do NOT run `npm run build` on feature branches.
3. **Open a PR when ready.** Use `gh pr create` targeting `main`. Never merge the PR — Eduardo approves and merges manually.
4. **Clean up after merge.** Once Eduardo merges: `git checkout main && git pull && git branch -d <branch>`.

### Commit conventions
- One logical change per commit. Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- Branch names: lowercase kebab-case (`feature/stripe-subscribe-button`)

### Pre-push hook
`.githooks/pre-push` runs `npm run build` automatically on any push to `main` — guards the production branch.

---

## Validation

Two hooks in `.githooks/` (versioned, activated via `core.hookspath=.githooks`):

| Hook | Feature branch | `main` |
|---|---|---|
| `pre-commit` | `npx tsc --noEmit` | `npm run build` |
| `pre-push` | `npx tsc --noEmit` | `npm run build` |

- Feature branches: fast type check on every commit and push — no full build
- `main`: full production build required — blocks commit or push on failure
- Do NOT run `npm run build` manually during development — use `npx tsc --noEmit` for quick checks

---

## Supabase CLI

### First-time setup
```bash
supabase login                              # authenticate via browser
supabase link --project-ref <ref>           # ref: Supabase → Settings → General
```

### Common commands
```bash
supabase migration new <name>   # scaffold a new migration file in supabase/migrations/
supabase db pull                # pull remote schema into local migration history
supabase db push                # apply pending local migrations to the remote DB
```

### Rules
- **Never run `supabase db push` automatically.** Only run it when Eduardo explicitly says so — it executes DDL against the production database.
- Migrations live in `supabase/migrations/` and are versioned in git.

---

## Vercel Deployment

Vercel Hobby plan only supports cron jobs that run once per day maximum.
Any cron expression that runs more than once per day will fail deployment.
Valid example: `0 8 * * *`. Never use `* * * * *` or `0 * * * *`.

---

## Phase 2 (not started)

- Stripe Live Mode — swap test keys for live keys, new webhook endpoint
- Dashboard / "terminal" — subscriber-only data view
- Additional thesis content — add MDX files to `content/theses/`
