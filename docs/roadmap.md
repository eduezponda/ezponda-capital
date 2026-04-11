# Roadmap — Role-Based Access & Content Visibility

## System Architecture

```
Guest (no session)
  ├── Sees all content exists (cards, pages) but EVERYTHING is blurred
  ├── Company name hidden
  ├── Incentivized to register ("quick signup, free content access")
  └── Can navigate to /auth/signup or /auth/login

Free User (role: "free")
  ├── Sees FREE content fully
  ├── PREMIUM content blurred with upgrade CTA
  ├── Company name visible
  └── Profile page with "Upgrade to Premium" option

Premium User (role: "subscriber")
  ├── Sees ALL content fully
  ├── No upgrade buttons anywhere
  ├── Company name visible
  └── Profile page (subscription status)

Superadmin (role: "superadmin")
  ├── Full access, same as premium
  ├── No restrictions
  └── Profile page
```

---

## Role Definitions

| Role | DB `profiles.role` | Session `tier` | Access |
|---|---|---|---|
| Guest | — (no session) | `null` | Nothing readable, all blurred |
| Free User | `free` | `free` | Free content only |
| Premium User | `subscriber` | `premium` | All content |
| Superadmin | `superadmin` | `premium` | All content |

## Subscription States

| State | Meaning |
|---|---|
| `none` | No subscription row (free user or guest) |
| `active` | Active Stripe subscription |
| `canceled` | Subscription ended — downgraded to free |
| `past_due` | Payment failed — treat as active with grace |

---

## User Flows

### Guest → Signup FREE
1. Guest lands on any page → all content blurred, company name hidden
2. Sees "Sign up in seconds — access free research" messaging
3. Clicks signup → `/auth/signup` → creates account (role: `free`)
4. Redirected to `/theses` → free content now readable

### Guest → Signup PREMIUM
1. Same as above, but on signup page sees "Go Premium" option
2. Clicks "Go Premium" → creates account first → then redirected to Stripe Checkout
3. After payment → webhook promotes to `subscriber` → full access

### Free → Upgrade to Premium
1. Free user sees blurred premium content + upgrade CTAs
2. Clicks "Upgrade" on any CTA or profile page
3. Redirected to Stripe Checkout
4. After payment → webhook promotes role → upgrade buttons disappear

### Login / Logout
- Login: `/auth/login` → redirect to `/theses`
- Logout: Navbar button → clear session → redirect to `/`

---

## Implementation Tasks

### Task 1: Extend session to expose `role`
**Files:** `features/auth/lib/session.ts`

- Add `role` field to `UserSession` interface (`free | subscriber | superadmin`)
- Return `role` alongside `tier` from `getSession()`
- This enables downstream components to distinguish guest vs free vs premium

### Task 2: Create `useSessionContext` for client components
**Files:** `features/auth/components/SessionProvider.tsx` (new), `app/layout.tsx`

- Server reads session in layout → passes serialized data to a thin client provider
- Client components (Navbar, Footer) can read session without calling Supabase directly
- Replaces Navbar's direct `supabase.auth.getSession()` call

### Task 3: Guest content gating — `ContentGate` component
**Files:** `features/subscription/components/ContentGate.tsx` (new)

- RSC component: wraps content sections
- Props: `requiredTier: "free" | "premium"`, `children`, `blurredFallback?`
- Guest → show blurred overlay + "Sign up to read" CTA
- Free user + free content → show children
- Free user + premium content → show blurred overlay + "Upgrade" CTA
- Premium/superadmin → show children always

### Task 4: Guest blur overlay component
**Files:** `features/subscription/components/GuestWall.tsx` (new)

- Shows heavily blurred content + registration incentive
- Message: "Create a free account in seconds to access this research"
- CTA buttons: "Sign Up Free" + "Go Premium"

### Task 5: Update ThesisCard for role-aware blur
**Files:** `components/sections/ThesisCard.tsx`

- Accept `userTier` prop (null = guest, "free", "premium")
- Guest: blur title + excerpt on ALL cards, show "Sign up" overlay
- Free: blur only premium card titles (current behavior)
- Premium: no blur on any card

### Task 6: Update ThesisGallery to pass user tier
**Files:** `features/theses/components/ThesisGallery.tsx`

- Read session via `getSession()`
- Pass `userTier` to each `ThesisCard`

### Task 7: Update thesis detail page with ContentGate
**Files:** `app/theses/[slug]/page.tsx`

- Free theses: wrap in `ContentGate requiredTier="free"` (guests see blur, logged-in see content)
- Premium theses: keep `PremiumGate` (guests + free see blur, premium see content)

### Task 8: Hide company name for guests
**Files:** `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`

- Navbar: show "Ezponda Capital" only when session exists; guests see generic text or nothing
- Footer: same treatment
- Uses session from `SessionProvider`

### Task 9: Conditional upgrade CTAs
**Files:** `app/commodities/page.tsx`, `app/sovereign/page.tsx`, `app/theses/page.tsx`, `app/page.tsx`

- Read session server-side
- Hide `UpgradeCTA` and `SubscribeCTA` when user is premium/superadmin
- Show them for guests (pointing to signup) and free users (pointing to Stripe)

### Task 10: Update signup page messaging
**Files:** `features/auth/components/SignupForm.tsx`, i18n messages

- Add clear message: "Registration is quick — get access to free research"
- Add "Go Premium" secondary action below the form
- After signup, if user chose premium path → redirect to Stripe Checkout

### Task 11: Profile page
**Files:** `app/profile/page.tsx` (new)

- Shows user name, email, current plan (Free / Premium)
- Free users: prominent "Upgrade to Premium" button → Stripe Checkout
- Premium users: subscription status, no upgrade button
- Superadmin: shows admin badge
- Accessible from Navbar (new link when logged in)

### Task 12: Update Navbar with profile link
**Files:** `components/layout/Navbar.tsx`

- When logged in: add "Profile" link next to logout
- Adjusts both desktop and mobile menus

### Task 13: Home page role-aware sections
**Files:** `app/page.tsx`

- Guest: hero CTAs point to signup, featured theses blurred, subscribe CTA visible
- Free: hero CTAs point to theses, free theses readable, upgrade CTA for premium
- Premium: no CTAs for upgrade, all content clear

### Task 14: i18n keys for new components
**Files:** `messages/en.json`, `messages/es.json`

- Add keys for: GuestWall, ContentGate messages, profile page, signup improvements
- All new user-facing strings must be translated EN + ES

### Task 15: Type-check and verify
- Run `npx tsc --noEmit` to ensure no type errors
- Manual smoke test checklist in `docs/manual_changes.md`
