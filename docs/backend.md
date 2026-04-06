# Backend Setup — Ezponda Capital

## Stack
- **Database / Auth:** Supabase (PostgreSQL + Supabase Auth + RLS)
- **Payments:** Stripe (subscriptions + webhooks)
- **Cron:** Vercel Cron Jobs (commodity price refresh, hourly)

---

## Setup Checklist

### 1 — Supabase project

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`
3. Open the **SQL Editor** and run the contents of `supabase/schema.sql`
4. Verify the `profiles`, `subscriptions`, `email_list`, and `commodity_prices` tables were created
5. Verify RLS is enabled on all four tables (Table Editor → select table → RLS tab)

### 2 — Environment variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks (after step 4) |
| `COMMODITY_API_KEY` | Your chosen commodity data provider |
| `NEXT_PUBLIC_APP_URL` | Production URL (e.g. `https://ezponda.com`) |
| `CRON_SECRET` | Generate a random string: `openssl rand -hex 32` |

### 3 — Stripe product setup

1. Create a **Product** in Stripe: "Ezponda Capital Premium"
2. Add a recurring **Price** (monthly or annual)
3. Copy the Price ID (e.g. `price_xxx`) — this is the `priceId` passed to `/api/stripe/create-checkout`

### 4 — Stripe webhook registration

**Local development** (using Stripe CLI):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

**Production:**
1. Go to Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

### 5 — Deploy to Vercel

1. Push to GitHub and connect the repo to Vercel
2. Add all environment variables in Vercel → Project → Settings → Environment Variables
3. `vercel.json` is already configured with the hourly cron:
   ```json
   { "crons": [{ "path": "/api/commodities/refresh", "schedule": "0 * * * *" }] }
   ```
4. After first deploy, verify the cron at Vercel → Project → Cron Jobs

### 6 — Seed superadmins

After the first users have signed up:

1. Add email addresses to `SUPERADMIN_EMAILS` in `scripts/seed-superadmins.ts`
2. Run:
   ```bash
   npx dotenv-cli -e .env.local npx tsx scripts/seed-superadmins.ts
   ```
   Or with env vars set manually:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-superadmins.ts
   ```

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/commodities/prices` | Public | Latest price per symbol from Supabase |
| GET | `/api/commodities/refresh` | `CRON_SECRET` header | Upserts fresh prices (called by Vercel cron) |
| POST | `/api/email-list/subscribe` | Public | Subscribes email to newsletter |
| POST | `/api/stripe/create-checkout` | Supabase session | Creates Stripe Checkout session |
| POST | `/api/stripe/webhook` | Stripe signature | Handles subscription lifecycle events |

---

## Replacing mock commodity prices

`app/api/commodities/refresh/route.ts` uses hardcoded mock values. To wire a real feed:

1. Set `COMMODITY_API_KEY` in `.env.local`
2. Replace the `MOCK_PRICES` array with an API call to your chosen provider
   (e.g. Metals-API, TradingEconomics, Polygon.io)
3. Map the response to the `{ symbol, name, price, change_pct, currency, unit }` shape

---

## Database schema summary

```
profiles          id · email · full_name · role · stripe_customer_id · created_at
subscriptions     id · user_id · stripe_subscription_id · stripe_price_id · status · period dates
email_list        id · email · subscribed_at · source · active
commodity_prices  id · symbol · name · price · change_pct · currency · unit · fetched_at
```

RLS rules:
- `profiles`: users read/update own row; superadmins read all
- `subscriptions`: users read own; superadmins read all
- `email_list`: anyone can insert; superadmins read/update
- `commodity_prices`: public read
