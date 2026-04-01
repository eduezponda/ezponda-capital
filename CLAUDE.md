# Ezponda Capital — CLAUDE.md

## Product Overview

Premium investment research platform focused on commodities (gold, copper, macro cycles).
Monetized via subscription: free previews → premium full access.

Conversion funnel: browse theses → click thesis → hit paywall → login/signup → upgrade.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, RSC-first)
- **Styling:** Tailwind CSS v4
- **Icons:** Material Symbols Outlined
- **Fonts:** Inter (100–900) via `next/font`
- **Auth:** NextAuth.js v5 (planned — stubs in place)
- **Payments:** Stripe (planned — stubs in place)
- **Content:** MDX via `next-mdx-remote` (planned — stub data in `lib/api/theses.ts`)

---

## Architecture Principles

- **Server-first:** RSC by default. Only forms, filters, and tickers are `"use client"`.
- **URL as state:** Filters use `?category=` searchParams — no React state, bookmarkable.
- **No Zustand:** Session read server-side via `getSession()`. UI state via URL.
- **Server Actions:** Auth operations use `features/auth/actions/` — no client fetch.
- **Separation:** `components/` (generic UI) / `features/` (domain logic) / `lib/api/` (data).

---

## Folder Structure

```
ezponda/
├── app/
│   ├── layout.tsx                  # Root layout: Inter font, Navbar, Footer
│   ├── page.tsx                    # / — Commodities Home (public)
│   ├── globals.css                 # Tailwind base + marquee, gold-gradient, glass-panel
│   ├── commodities/page.tsx        # /commodities — Overview (public)
│   ├── sovereign/page.tsx          # /sovereign — Macro teaser (public)
│   ├── theses/
│   │   ├── page.tsx                # /theses — Gallery (public, URL-filtered)
│   │   └── [slug]/page.tsx         # /theses/[slug] — Full thesis (premium gated)
│   └── auth/
│       ├── login/page.tsx          # /auth/login
│       └── signup/page.tsx         # /auth/signup
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Fixed top nav, active link, auth buttons
│   │   ├── Footer.tsx              # Brand links, social icons
│   │   └── Container.tsx           # max-w-[1440px] mx-auto px-6 md:px-12
│   ├── ui/
│   │   ├── Button.tsx              # Variants: primary, secondary, tertiary, filter
│   │   ├── Card.tsx                # Variants: data, image, glass
│   │   ├── Badge.tsx               # Category tags: Gold, Copper, Macro, Real Assets
│   │   ├── Input.tsx               # Email/password, autofill-safe styles
│   │   └── Ticker.tsx              # Marquee strip, pauses on hover ("use client")
│   └── sections/
│       ├── Hero.tsx                # Full-height hero, dual CTA
│       ├── ThesisCard.tsx          # Image card with overlay, badge, hover scale
│       ├── MacroIndicators.tsx     # Bento of CPI, Real Yields, DXY, Sentiment
│       ├── MethodologySteps.tsx    # 3-step trust section with icons
│       ├── SubscribeCTA.tsx        # Email input + gold button in dark section
│       └── AuthorCard.tsx          # Profile image, credentials, signature
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── AuthLayout.tsx      # Split panel: form (45%) | macro image (55%)
│   │   │   ├── LoginForm.tsx       # Email/password + Google + LinkedIn ("use client")
│   │   │   └── SignupForm.tsx      # Request access form ("use client")
│   │   └── lib/session.ts          # getSession(), requireAuth(), getSessionTier() — stubs
│   │
│   ├── subscription/
│   │   ├── components/
│   │   │   ├── PremiumGate.tsx     # Decides: show content or paywall
│   │   │   ├── Paywall.tsx         # Blur overlay + lock icon + UpgradeCTA
│   │   │   └── UpgradeCTA.tsx      # Gold card "Unlock full access" — usable standalone
│   │   └── lib/entitlements.ts     # hasAccess(session, tier), getTier(session)
│   │
│   ├── theses/
│   │   └── components/
│   │       ├── ThesisGallery.tsx   # Bento grid, featured card + rest
│   │       └── ThesisFilter.tsx    # Filter buttons → ?category= links ("use client")
│   │
│   ├── commodities/
│   │   ├── components/CommoditySection.tsx  # Asymmetric image + content layout
│   │   └── lib/commodities.ts      # Static JSON stubs
│   │
│   └── macro/
│       └── components/MacroTicker.tsx  # Thin wrapper: wires macro data → Ticker
│
├── lib/
│   ├── api/
│   │   ├── theses.ts               # getAllTheses(), getThesisBySlug() — stub data inline
│   │   ├── indicators.ts           # getIndicators() — revalidate: 900
│   │   └── prices.ts               # getSpotPrices() — revalidate: 300 (stub)
│   └── utils.ts                    # cn(), formatDate(), formatPrice(), formatPct()
│
└── middleware.ts                   # Protects /theses/:slug* (auth check placeholder)
```

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

### Border Radius
```
DEFAULT: 1rem | lg: 2rem | xl: 3rem | full: 9999px
```

### Reusable CSS Classes (globals.css)
```css
.gold-gradient   /* radial gold background */
.text-gold       /* gold gradient text via -webkit-background-clip */
.glass-panel     /* rgba(32,31,31,0.8) + blur(20px) */
.animate-marquee /* 30s linear marquee, pauses on hover */
```

### Typography
| Token | Size | Weight | Use |
|---|---|---|---|
| display-lg | 5rem | 800 | Hero headlines |
| headline-sm | 2.5rem | 700 | Section titles |
| body-lg | 1.125rem | 400 | Editorial copy |
| label-sm | 0.6875rem | 500 | Metadata, tickers, nav |

All Inter. Labels: uppercase + wide tracking.

---

## Monetization Layer

```
Public     → thesis gallery, previews, macro teaser
Email gate → via SubscribeCTA
Premium    → /theses/[slug] full content, live prices, sovereign deep-dives
```

### Gating Stack
```
PremiumGate (RSC — decides access)
  └── Paywall (renders when denied)
        └── UpgradeCTA (gold CTA card with Stripe link)
```

`UpgradeCTA` also used standalone in `/sovereign` and `/commodities`.

---

## Data Layer (`lib/api/`)

| File | Function | Cache |
|---|---|---|
| `theses.ts` | `getAllTheses(category?)`, `getThesisBySlug(slug)` | Static (stub inline) |
| `indicators.ts` | `getIndicators()` | revalidate: 900 (15 min) |
| `prices.ts` | `getSpotPrices()` | revalidate: 300 (5 min) |

Thesis data is currently stub inline in `lib/api/theses.ts`. Future: load from `/content/theses/*.mdx` via gray-matter + next-mdx-remote.

---

## Key Constraints

- **Do NOT redesign UI without explicit instruction.** Match existing screen exports.
- Keep components reusable and prop-driven.
- No over-engineering — avoid adding abstractions not currently needed.
- No Zustand or global client state.
- Only `"use client"` where strictly necessary: forms, `Ticker`, `ThesisFilter`.
- Do not add docstrings, comments, or type annotations to unchanged code.

---

## Planned (Not Yet Implemented)

- NextAuth.js v5 integration (Google + LinkedIn + credentials)
- Stripe Checkout + webhook for tier upgrades
- MDX content loader (`/content/theses/*.mdx` → gray-matter parsing)
- `/api/indicators` route (currently returns mock data)
- `/api/webhooks/stripe` route
- Dashboard / "terminal" (Phase 2)
- Mobile nav collapse
