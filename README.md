# Ezponda Capital

Premium investment research platform focused on commodities — gold, copper, and macro cycles. Built for sophisticated investors who want independent, high-conviction analysis beyond mainstream financial media.

The platform follows a subscription model: free public browsing → email capture → premium full-access tier. The conversion funnel runs: browse theses → open thesis → hit paywall → login/signup → upgrade.

---

## Who is it for?

- Investors seeking independent commodity and macro research
- Portfolio managers tracking gold, copper, and real asset cycles
- Analysts who value systematic, evidence-based investment theses

---

## Tech Stack

| Technology | Version |
|---|---|
| Next.js | 15.5.14 |
| React | 19.1.0 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| ESLint | ^9 |
| clsx | ^2.1.1 |
| tailwind-merge | ^3.5.0 |

**Planned integrations (stubs in place):**
- NextAuth.js v5 — Google + LinkedIn + credentials
- Stripe — subscription checkout + webhooks
- next-mdx-remote — MDX content loader for theses

---

## Project Structure

```
ezponda_capital/
├── app/                          # Next.js App Router (RSC-first)
│   ├── layout.tsx                # Root layout: Inter font, Navbar, Footer
│   ├── page.tsx                  # / — Home page (public)
│   ├── globals.css               # Tailwind base + design tokens + utilities
│   ├── commodities/page.tsx      # /commodities — Overview (public)
│   ├── sovereign/page.tsx        # /sovereign — Macro teaser (public)
│   ├── theses/
│   │   ├── page.tsx              # /theses — Gallery with URL-based filtering
│   │   └── [slug]/page.tsx       # /theses/[slug] — Full thesis (premium gated)
│   └── auth/
│       ├── login/page.tsx        # /auth/login
│       └── signup/page.tsx       # /auth/signup
│
├── components/                   # Generic, reusable UI
│   ├── layout/
│   │   ├── Navbar.tsx            # Fixed top nav, active links, auth buttons
│   │   ├── Footer.tsx            # Brand links, social icons
│   │   └── Container.tsx         # max-w-[1440px] mx-auto px-6 md:px-12
│   ├── ui/
│   │   ├── Button.tsx            # Variants: primary, secondary, tertiary, filter
│   │   ├── Card.tsx              # Variants: data, image, glass
│   │   ├── Badge.tsx             # Category tags: Gold, Copper, Macro, Real Assets
│   │   ├── Input.tsx             # Email/password with autofill-safe styles
│   │   └── Ticker.tsx            # Marquee strip, pauses on hover (client)
│   └── sections/
│       ├── Hero.tsx              # Full-height hero with dual CTA
│       ├── ThesisCard.tsx        # Image card with overlay, badge, hover scale
│       ├── MacroIndicators.tsx   # Bento: CPI, Real Yields, DXY, Sentiment
│       ├── MethodologySteps.tsx  # 3-step trust section with icons
│       ├── SubscribeCTA.tsx      # Email capture in dark section
│       └── AuthorCard.tsx        # Profile image, credentials, signature
│
├── features/                     # Domain-specific logic
│   ├── auth/
│   │   ├── components/
│   │   │   ├── AuthLayout.tsx    # Split panel: form (45%) | macro image (55%)
│   │   │   ├── LoginForm.tsx     # Email/password + Google + LinkedIn (client)
│   │   │   └── SignupForm.tsx    # Request access form (client)
│   │   └── lib/session.ts        # getSession(), requireAuth(), getSessionTier() stubs
│   ├── subscription/
│   │   ├── components/
│   │   │   ├── PremiumGate.tsx   # RSC: decides content vs paywall
│   │   │   ├── Paywall.tsx       # Blur overlay + lock icon + UpgradeCTA
│   │   │   └── UpgradeCTA.tsx    # Gold CTA card — also used standalone
│   │   └── lib/entitlements.ts   # hasAccess(session, tier), getTier(session) stubs
│   ├── theses/
│   │   └── components/
│   │       ├── ThesisGallery.tsx # Bento grid: featured card + rest
│   │       └── ThesisFilter.tsx  # Filter buttons → ?category= URL params (client)
│   ├── commodities/
│   │   ├── components/CommoditySection.tsx  # Asymmetric image + content layout
│   │   └── lib/commodities.ts    # Static commodity data stubs
│   └── macro/
│       └── components/MacroTicker.tsx  # Wires macro data → Ticker component
│
├── lib/
│   ├── api/
│   │   ├── theses.ts             # getAllTheses(), getThesisBySlug() — stub data
│   │   ├── indicators.ts         # getIndicators() — revalidate: 900s
│   │   └── prices.ts             # getSpotPrices() — revalidate: 300s (stub)
│   └── utils.ts                  # cn(), formatDate(), formatPrice(), formatPct()
│
└── middleware.ts                  # Route protection for /theses/:slug*
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/eduezponda/ezponda-capital.git
cd ezponda-capital
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Architecture Principles

- **Server-first:** React Server Components by default. Only forms, filters, and tickers are `"use client"`.
- **URL as state:** Category filters use `?category=` search params — bookmarkable, no React state.
- **No Zustand:** Session read server-side via `getSession()`. UI state lives in the URL.
- **Server Actions:** Auth operations go through `features/auth/actions/` — no client-side fetch.
- **Separation of concerns:** `components/` (generic UI) / `features/` (domain logic) / `lib/api/` (data layer).

---

## Design System

### Color Palette

| Token | Value | Use |
|---|---|---|
| `surface` | `#131313` | Page background |
| `surface-container` | `#201f1f` | Cards, panels |
| `surface-container-high` | `#2a2a2a` | Elevated surfaces |
| `on-surface` | `#e5e2e1` | Primary text |
| `on-surface-variant` | `#c6c6c6` | Secondary text |
| `tertiary` | `#ffe084` | Gold accent |
| `outline` | `#919191` | Borders |

### Global CSS Utilities

```css
.gold-gradient   /* Radial gold background */
.text-gold       /* Gold gradient text */
.glass-panel     /* rgba(32,31,31,0.8) + backdrop-blur(20px) */
.animate-marquee /* 30s linear marquee, pauses on hover */
```

---

## Features Implemented

### Public pages
- [x] Home page (`/`) — hero, macro ticker, thesis previews, methodology, author, subscribe CTA
- [x] Commodities overview (`/commodities`) — asymmetric sections per commodity
- [x] Sovereign/Macro teaser (`/sovereign`) — public teaser + upgrade CTA
- [x] Theses gallery (`/theses`) — bento grid, URL-based category filtering
- [x] Thesis detail (`/theses/[slug]`) — premium gated via `PremiumGate` RSC

### Auth
- [x] Login page (`/auth/login`) — email/password + Google + LinkedIn UI
- [x] Signup page (`/auth/signup`) — request access form
- [x] Split-panel `AuthLayout` (form left, macro image right)
- [x] Session stubs: `getSession()`, `requireAuth()`, `getSessionTier()`
- [x] Middleware protecting `/theses/:slug*`

### Subscription / Monetization
- [x] `PremiumGate` — RSC that decides: show content or paywall
- [x] `Paywall` — blur overlay, lock icon, upgrade prompt
- [x] `UpgradeCTA` — standalone gold CTA card (used in sovereign, commodities, paywall)
- [x] `entitlements.ts` stubs: `hasAccess()`, `getTier()`

### UI System
- [x] `Button` — 4 variants (primary, secondary, tertiary, filter)
- [x] `Card` — 3 variants (data, image, glass)
- [x] `Badge` — category tags
- [x] `Input` — autofill-safe styles
- [x] `Ticker` — animated marquee with hover pause
- [x] `Container` — consistent max-width wrapper

### Data layer (stubs)
- [x] `getAllTheses()`, `getThesisBySlug()` — inline stub data
- [x] `getIndicators()` — stub with 15-min revalidation
- [x] `getSpotPrices()` — stub with 5-min revalidation

---

## Pending / Planned

- [ ] NextAuth.js v5 — wire Google, LinkedIn, and credentials providers
- [ ] Stripe Checkout — subscription tiers + webhook handler (`/api/webhooks/stripe`)
- [ ] MDX content loader — load theses from `/content/theses/*.mdx` via gray-matter
- [ ] Live price API — replace `getSpotPrices()` stub with real data source
- [ ] Live macro indicators API — replace `getIndicators()` stub
- [ ] Mobile nav — collapse/hamburger menu
- [ ] Dashboard / terminal (Phase 2)
- [ ] `/api/indicators` route

---

## License

Private — all rights reserved. Not open for redistribution.
