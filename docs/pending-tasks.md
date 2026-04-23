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

---

## Mutation Testing

**What it is:** A technique to evaluate test suite quality. Instead of asking "do the tests pass?", mutation testing asks "would the tests catch a bug if there was one?".

**How it works:**
- A tool automatically introduces small code changes called *mutants* (e.g. `>` → `>=`, `+` → `-`, `return x` → `return None`)
- The test suite is run against each mutant
- If tests fail → mutant is killed ✅ (tests are effective)
- If tests pass → mutant survives ❌ (there is a coverage gap)
- Goal: maximize the **mutation score** = `killed / total`

**Why it matters for AI-generated tests:** When tests are written after the code already exists (which is what Claude Code does by default), they tend to validate current behavior rather than verify correctness. Mutation testing provides an objective feedback loop to detect those gaps.

**Correct workflow:**
1. Write or generate the code
2. Generate an initial test suite
3. Collect surviving mutants using specific tool for language (for example mumut in python)
4. For each surviving mutant, prompt Claude Code: *"This mutant survived: `>` was changed to `>=` on line X. Write a test that kills it."*
5. Re-run `mutmut` → check new mutation score
6. Repeat until score is above 80–90%
