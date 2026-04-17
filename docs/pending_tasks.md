## Pending Manual Tasks

### Content & Pages

- **Home — Iñigo intro video (decide)** — decide whether to include a video of Iñigo presenting the project as the analyst. If yes, scope recording + hosting.
- **New theses** — add new real worldthesis MDX files under `content/theses/`.
- **Webpages content & restructure** — revise copy and restructure pages once the final content direction is clear (parked until scope is defined).

### Custom Domain & Google OAuth (blocked until domain purchase)

When a custom domain is purchased (e.g. ezponda.com):

1. **Vercel** — add the custom domain:
   - Vercel → Project → Settings → Domains → Add domain
   - Update `NEXT_PUBLIC_APP_URL` env var to the new domain

2. **Google Cloud Console** — update OAuth consent screen:
   - Replace `vercel.app` in Authorized Domains with the new domain
   - Update App homepage, Privacy Policy, and Terms of Service URLs
   - Move Publishing Status from Testing → Production (required for public login)
   - While in Testing: add allowed tester emails manually in
     OAuth consent screen → Test users

3. **Supabase** — update Auth settings:
   - Authentication → URL Configuration → Site URL → new domain
   - Add new domain to Redirect URLs

4. **Stripe** — update webhook if domain changes:
   - Stripe → Developers → Webhooks → update endpoint URL
