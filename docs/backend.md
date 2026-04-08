# Backend Setup — Ezponda Capital

## Stack

- **Database / Auth:** Supabase (PostgreSQL + Supabase Auth + RLS)
- **Payments:** Stripe (subscriptions + webhooks)
- **Cron:** Vercel Cron Jobs (commodity price refresh, daily at 08:00 UTC)

---

## Setup Checklist

### 1 — Supabase ✅

- Project created, schema applied (`supabase/schema.sql`)
- Auth configured: email/password, email confirmation enabled
- Site URL and Redirect URLs set in Authentication → URL Configuration
- RLS enabled on all tables with correct policies

### 2 — Environment variables ✅

All variables set in `.env.local` (local) and Vercel (production):

| Variable                             | Source                                        |
| ------------------------------------ | --------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase → Settings → API                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase → Settings → API                     |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase → Settings → API                     |
| `STRIPE_SECRET_KEY`                  | Stripe → Developers → API keys                |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys                |
| `STRIPE_WEBHOOK_SECRET`              | Stripe → Developers → Webhooks                |
| `COMMODITY_API_KEY`                  | GoldAPI.io access token                        |
| `NEXT_PUBLIC_APP_URL`                | `https://ezponda-capital.vercel.app`          |
| `CRON_SECRET`                        | Random string — `openssl rand -hex 32`        |

### 3 — Stripe ✅

- Product: "Ezponda Capital Premium" (`prod_UI8CMDmtrRTYUP`)
- Price ID: `price_1TJXvzKe83gRrUXhfkaTgFXt` (monthly, EUR, test mode)
- Webhook registered at `https://ezponda-capital.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

Local webhook forwarding (when needed):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4 — Deploy ✅

- Vercel project connected to `eduezponda/ezponda-capital`
- Production URL: `https://ezponda-capital.vercel.app`
- Vercel cron configured (daily at 08:00 UTC):

```json
{ "crons": [{ "path": "/api/commodities/refresh", "schedule": "0 8 * * *" }] }
```

### 5 — Auth frontend ✅

- LoginForm and SignupForm connected to Supabase Auth
- Session and role read from `profiles` table via `getSession()`
- Middleware refreshes session only — no route blocking
- Content gating is per-thesis via `PremiumGate`, driven by MDX `tier` frontmatter field
- New users land on `/auth/confirm-email` after signup

### 6 — Superadmins ✅

- Iñigo and Eduardo registered via UI and assigned `role = superadmin` directly in Supabase Table Editor
- Superadmins get `premium` tier automatically via `entitlements.ts`
- To add future superadmins: Supabase → Table Editor → `profiles` → edit `role` field

### 7 — Subscribe button ✅

- `SubscribeButton.tsx` — POSTs to `/api/stripe/create-checkout`, redirects to Stripe Checkout URL
- `UpgradeCTA` renders `SubscribeButton` when `mode="stripe"` + `priceId` are passed
- `Paywall` passes `mode="stripe" priceId="price_1TJXvzKe83gRrUXhfkaTgFXt"` to `UpgradeCTA`

### 8 — Commodity prices (GoldAPI.io) ✅

- `app/api/commodities/refresh/route.ts` fetches XAU, XAG, XPT, XPD from `https://www.goldapi.io/api/{symbol}/USD`
- Auth: `x-access-token: COMMODITY_API_KEY`
- Runs daily at 08:00 UTC via Vercel cron, inserts rows into `commodity_prices`

### 9 — Thesis gating ✅

- Each thesis MDX file has a `tier: "free" | "premium"` frontmatter field
- Free theses render fully for all visitors
- Premium theses wrap the MDX body in `<PremiumGate>` — subscribers and superadmins see full content, others see `Paywall`

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
| GET    | `/api/commodities/refresh`    | `CRON_SECRET` header | Upserts fresh prices (Vercel cron, daily 08:00 UTC) |
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
