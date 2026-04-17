---
name: frontend-rules
description: Use this skill when modifying any frontend file in Ezponda Capital. Triggers on: changes to components/, app/ pages, layout files, icon usage, navbar, mobile responsiveness, Tailwind classes, or any visual element. Contains production build rules, icon conventions, and mobile-first requirements specific to this project.
allowed-tools: Read, Edit, Write, Bash
---

# Frontend Rules — Ezponda Capital

## Production vs development

Never assume dev behaviour matches production. Always verify at:

- Mobile: 375px width
- Tablet: 768px
- Desktop: 1280px

Before committing any change to components/layout/ or app/layout.tsx check all three breakpoints in the browser.

## Icon system — two sources, strict rules

This project uses TWO icon libraries. They are NOT interchangeable.

### Material Symbols Outlined

- Loaded via `<link>` tag in app/layout.tsx with `display=block`
- Used ONLY for decorative icons inside page content (sections, cards, feature lists)
- Never use for interactive UI elements (buttons, nav toggles, form controls)
- Usage: `<span className="material-symbols-outlined">icon_name</span>`
- Do NOT change `display=block` to `swap` or `optional` — this causes text fallback in production

### lucide-react

- SVG-based, renders instantly regardless of font load state
- Used for ALL interactive UI elements: navbar, buttons, toggles, form icons
- Navbar hamburger: `<Menu size={24} />` and `<X size={24} />` from lucide-react
- Import: `import { Menu, X, ArrowLeft, ... } from 'lucide-react'`

## Navbar rules

- Mobile hamburger: lucide-react Menu/X icons, never Material Symbols
- Mobile menu toggle: `block md:hidden`
- Desktop nav links: `hidden md:flex`
- The hamburger toggles a mobile menu open/close with useState

## Tailwind conventions

- Mobile-first: always use unprefixed classes for mobile, `sm:`/`md:`/`lg:` for larger
- Use `cn()` for conditional classnames
- No custom CSS unless Tailwind cannot handle it
- No hardcoded colors — use design tokens from the existing color system

## Thesis card rules (ThesisCard.tsx + ThesisGallery.tsx)

All thesis cards in the gallery must have the same structure and dimensions. No
featured/non-featured distinction in the gallery — pass no `featured` prop so all
cards use the default uniform layout.

### Dimensions and container

- `min-h-[360px]`, `rounded-xl`
- Background: `bg-surface-container` (#201f1f) — slightly lighter than the page (#131313)
- Border: `border border-outline-variant/40`, on hover: `border-outline-variant`
- This border is critical for visual separation from the dark page background

### Content structure (bottom-anchored, flex col, gap-2, p-6)

1. Row: `<Badge>` left + lock/visibility icon right
2. Title: `text-2xl font-bold text-white tracking-tight leading-tight`
3. Excerpt phrase: `text-[0.8125rem] text-on-surface-variant line-clamp-2` — always shown
4. Ticker/exchange: `text-[0.6875rem] uppercase tracking-[0.05rem] text-outline mt-1`
5. Date: `text-[0.6875rem] uppercase tracking-[0.05rem] text-outline`

### Background image

- No grayscale or heavy brightness filter — show the image naturally
- Position: `object-cover object-top` so the top of the SVG (company name area) is visible
- Gradient overlay: `from-surface-container from-45% via-surface-container/90 to-surface-container/10`
  This keeps the bottom content area readable while letting the image show in the upper half
- Only render the image when `!shouldBlur` (guest or free-on-premium sees no image)

### Premium badge visibility

- `showLock = tier === "premium" && isFree`: lock shown only for free-tier users
- Never show the lock to `premium` or `superadmin` — they have access
- Guests viewing premium content: show `visibility_off` icon + "Premium" label instead

## What NOT to do

- Do not use Material Symbols for navbar, buttons, or any interactive element
- Do not change the Material Symbols `<link>` tag font-display value
- Do not add new global CSS without checking globals.css first
- Do not use next/image for SVG files — use plain `<img>` tag instead
- Do not run `npm run build` for routine checks — use `npx tsc --noEmit && npm run lint`
- Do not make thesis cards different sizes or layouts from each other
