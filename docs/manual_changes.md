# Manual Changes Required

## Environment Variables

Already configured (no changes needed for this feature):

| Variable | Source | Status |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | Already set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | Already set |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Already set |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | Already set |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | Already set |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard | Already set |
| `NEXT_PUBLIC_APP_URL` | Vercel project settings | Already set |
| `BITCOIN_API_KEY` | [api-ninjas.com](https://api-ninjas.com) dashboard | **Needs setup** |

## Payment Keys

- Stripe is in **test mode** — no changes needed for this feature
- When ready to go live: see `docs/backend.md` → "Stripe Live Mode" section

## Domain Configuration

- Production URL: `https://ezponda-capital.vercel.app` — no changes needed
- Custom domain: configure in Vercel Dashboard → Settings → Domains when ready

## Branding

- Company name ("Ezponda Capital") is now hidden for guest users
- To customize what guests see instead, edit the i18n keys under `nav.guestBrand` in `messages/en.json` and `messages/es.json`
- Logo/brand appears normally for all logged-in users

## Supabase Configuration

- No schema changes required — existing `profiles.role` and `subscriptions` tables support all roles
- New users automatically get `role = "free"` (Supabase trigger or default)
- Ensure the `profiles` table has a default value of `'free'` for the `role` column:
  ```sql
  ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'free';
  ```
- If the default is not set, verify in Supabase Dashboard → Table Editor → profiles → role column

## Smoke Test Checklist

After deployment, verify these flows:

### Guest (open incognito)
- [ ] All thesis cards show blurred titles
- [ ] Thesis detail pages show blurred content with signup prompt
- [ ] Company name ("Ezponda Capital") is NOT visible in navbar/footer
- [ ] Signup incentive messages appear
- [ ] Commodities and Sovereign pages show blurred sections

### Free User
- [ ] Free thesis content is fully readable
- [ ] Premium thesis content is blurred with upgrade CTA
- [ ] Company name visible in navbar/footer
- [ ] Profile page shows "Free" plan with upgrade button
- [ ] Upgrade button redirects to Stripe Checkout

### Premium User
- [ ] All content is fully readable
- [ ] No upgrade buttons appear anywhere
- [ ] Profile page shows "Premium" plan status
- [ ] SubscribeCTA sections are hidden

### Superadmin
- [ ] Full access to everything
- [ ] Same as premium, no restrictions
