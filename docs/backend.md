# Backend Setup — Ezponda Capital

## Stack

- **Database / Auth:** Supabase (PostgreSQL + Supabase Auth + RLS)
- **Payments:** Stripe (subscriptions + webhooks)
- **Cron:** Vercel Cron Jobs (commodity price refresh, daily at 08:00 UTC)
- **Commodity prices:** GoldAPI.io (metals) + api-ninjas.com (Bitcoin)

---

## Setup Checklist

### 1 — Supabase

- Project created, schema applied (`supabase/schema.sql`, migrations in `supabase/migrations/`)
- Auth configured: email/password only, **email confirmation disabled**, open registration
- Site URL and Redirect URLs set in Authentication → URL Configuration
- RLS enabled on all tables with correct policies

### 2 — Environment variables

All variables set in `.env.local` (local) and Vercel (production):

| Variable                             | Source                                    |
| ------------------------------------ | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase → Settings → API                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase → Settings → API                 |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase → Settings → API                 |
| `STRIPE_SECRET_KEY`                  | Stripe → Developers → API keys            |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys            |
| `STRIPE_WEBHOOK_SECRET`              | Stripe → Developers → Webhooks            |
| `COMMODITY_API_KEY`                  | GoldAPI.io access token (XAU/XAG/XPT/XPD) |
| `BTC_COPPER_API_KEY`                 | api-ninjas.com access token (BTC)         |
| `NEXT_PUBLIC_APP_URL`                | `https://ezponda-capital.vercel.app`      |
| `CRON_SECRET`                        | Random string — `openssl rand -hex 32`    |

### 3 — Stripe

- Product: "Ezponda Capital Premium" (`prod_UI8CMDmtrRTYUP`)
- Price ID: `price_1TJXvzKe83gRrUXhfkaTgFXt` (monthly, EUR, test mode)
- Webhook registered at `https://ezponda-capital.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

Local webhook forwarding (when needed):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4 — Deploy

- Vercel project connected to `eduezponda/ezponda-capital`
- Production URL: `https://ezponda-capital.vercel.app`
- Vercel cron (Hobby plan → once per day maximum):

```json
{ "crons": [{ "path": "/api/commodities/refresh", "schedule": "0 8 * * *" }] }
```

### 5 — Auth frontend

- `LoginForm` and `SignupForm` connected to Supabase Auth (email/password only)
- Session and role read from `profiles` table via `getSession()`
- `SessionProvider` passes the server-read session to client components (`Navbar`, `Footer`)
- `middleware.ts` refreshes session only — no route blocking
- Content gating is per-thesis via `ContentGate`, driven by MDX `tier` frontmatter field
- Post-signup redirect: `/theses`

### 6 — Superadmins

- Iñigo and Eduardo registered via UI and assigned `role = superadmin` directly in Supabase Table Editor
- Superadmins get `premium` tier automatically via `entitlements.ts`
- To add future superadmins: Supabase → Table Editor → `profiles` → edit `role` field

### 7 — Subscribe button

- `SubscribeButton.tsx` — POSTs to `/api/stripe/create-checkout`, redirects to Stripe Checkout URL
- `UpgradeCTA` renders `SubscribeButton` when `mode="stripe"` + `priceId` are passed
- `ContentGate` shows an inline premium paywall with `SubscribeButton` when a free user hits premium content

### 8 — Commodity prices

Two providers, one cron invocation:

- **Metals (XAU/XAG/XPT/XPD)** — `https://www.goldapi.io/api/{symbol}/USD`, header `x-access-token: COMMODITY_API_KEY`
- **Bitcoin (BTC)** — `https://api.api-ninjas.com/v1/bitcoin`, header `X-Api-Key: BTC_COPPER_API_KEY`
- **Copper (HG)** — `https://api.api-ninjas.com/v1/commodityprice?name=copper`, header `X-Api-Key: BTC_COPPER_API_KEY`
- All fetched in `app/api/commodities/refresh/route.ts` and inserted into the shared `commodity_prices` table
- Ticker display order (enforced in `lib/api/prices.ts`): Gold → Silver → Copper → Bitcoin → Platinum → Palladium
- If a symbol fails to fetch, the ticker shows the previous day's value. If the whole table is empty or the query fails, the ticker is hidden entirely (no stub data)

### 9 — Thesis gating

- Each thesis MDX file has a `tier: "free" | "premium"` frontmatter field
- Thesis detail page (`app/theses/[slug]/page.tsx`) returns 404 for guests unconditionally
- For logged-in users, the MDX body is wrapped in `<ContentGate requiredTier={thesis.tier}>` — subscribers and superadmins see full content, free users on premium content see an inline paywall
- `ContentGate` is the single gating component (previously split into `PremiumGate` / `Paywall` / `FreePremiumPaywall` — consolidated in refactor)

### 10 — Git hooks

Hooks live in `.githooks/` (versioned) and are activated via `git config core.hookspath .githooks`.

| Hook         | Feature branch     | `main`          |
| ------------ | ------------------ | --------------- |
| `pre-commit` | `npx tsc --noEmit` | `npm run build` |
| `pre-push`   | `npx tsc --noEmit` | `npm run build` |

Feature branches get a fast type check on every commit and push. `main` requires a full production build — any failure blocks the commit or push.

### 11 — GitHub Actions CI

`.github/workflows/ci.yml` runs `npm run build` on every pull request targeting `main`. This mirrors the pre-push hook for the remote side and prevents broken builds from being merged.

### 12 — Internationalization (i18n)

- **Library:** `next-intl` v4 — no URL prefix, no route restructure
- **Locales:** English (`en`, default) and Spanish (`es`)
- **Persistence:** `NEXT_LOCALE` cookie (1-year expiry, set on toggle)
- **Toggle:** `LanguageToggle` component in the Navbar (desktop and mobile); calls `router.refresh()` after writing the cookie
- **Translation files:** `messages/en.json` and `messages/es.json`
- **Server components:** use `await getTranslations('namespace')` from `next-intl/server`
- **Client components:** use `useTranslations('namespace')` from `next-intl`
- **Locale config:** `i18n/request.ts` reads the `NEXT_LOCALE` cookie via `cookies()` and falls back to `en`
- **Provider:** `NextIntlClientProvider` wraps the app in `app/layout.tsx`; `lang` attribute on `<html>` is set dynamically via `getLocale()`
- MDX thesis content is not translated — stays in English

---

## Pending

### Stripe Live Mode (when ready to charge)

1. Create product and price in Stripe Live mode
2. Register a new webhook for production with live keys
3. Replace test keys with live keys in Vercel environment variables

---

## API Routes

| Method | Path                          | Auth                 | Description                                         |
| ------ | ----------------------------- | -------------------- | --------------------------------------------------- |
| GET    | `/api/commodities/prices`     | Public               | Latest price per symbol from Supabase               |
| GET    | `/api/commodities/refresh`    | `CRON_SECRET` header | Fetches fresh prices (Vercel cron, daily 08:00 UTC) |
| POST   | `/api/email-list/subscribe`   | Public               | Adds email to newsletter list                       |
| POST   | `/api/stripe/create-checkout` | Supabase session     | Creates Stripe Checkout session                     |
| POST   | `/api/stripe/webhook`         | Stripe signature     | Handles subscription lifecycle events               |

---

## Database schema

```
profiles          id · email · full_name · role · stripe_customer_id · created_at
subscriptions     id · user_id · stripe_subscription_id · stripe_price_id · status · period dates
email_list        id · email · subscribed_at · source · active
commodity_prices  id · symbol · name · price · change_pct · currency · unit · fetched_at
```

RLS rules:

- `profiles` — users read/update own row; superadmins read all
- `subscriptions` — users read own; superadmins read all
- `email_list` — anyone can insert; superadmins read/update
- `commodity_prices` — public read
