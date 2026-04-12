# Manual Changes Required

## Environment Variables

| Variable | Source | Status |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | Already set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | Already set |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Already set |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | Already set |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | Already set |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard | Already set |
| `NEXT_PUBLIC_APP_URL` | Vercel project settings | Already set |
| `COMMODITY_API_KEY` | [GoldAPI.io](https://www.goldapi.io) — XAU/XAG/XPT/XPD | Already set |
| `BITCOIN_API_KEY` | [api-ninjas.com](https://api-ninjas.com) — BTC price | Already set |
| `CRON_SECRET` | Random — `openssl rand -hex 32` | Already set |

## Payment Keys

- Stripe is in **test mode** — no changes needed for this feature
- When ready to go live: see `docs/backend.md` → "Stripe Live Mode" section

## Domain Configuration

- Production URL: `https://ezponda-capital.vercel.app` — no changes needed
- Custom domain: configure in Vercel Dashboard → Settings → Domains when ready

## Supabase Configuration

- No schema changes required — existing `profiles.role` and `subscriptions` tables support all roles
- Ensure the `profiles.role` column defaults to `'free'`:
  ```sql
  ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'free';
  ```

## Smoke Test Checklist

After deployment, verify these flows:

### Guest (open incognito)
- [ ] Thesis cards on `/theses` show dark placeholder background (no image) with blurred title
- [ ] Thesis detail pages return 404 (guests cannot access thesis content at all)
- [ ] Commodities and Sovereign pages render with ticker and upgrade CTAs
- [ ] Navbar and footer show full "Ezponda Capital" brand

### Free User
- [ ] Free thesis content is fully readable
- [ ] Premium thesis content shows the inline premium paywall with Stripe CTA
- [ ] Profile page shows "Free" plan with upgrade button
- [ ] Upgrade button redirects to Stripe Checkout

### Premium User
- [ ] All thesis content is fully readable
- [ ] No upgrade buttons appear anywhere
- [ ] Profile page shows "Premium" plan status
- [ ] SubscribeCTA sections are hidden

### Superadmin
- [ ] Full access to everything
- [ ] Same behavior as premium
