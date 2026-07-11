# CLAUDE.md — Tutto Napule

Context for working on this repo. Deeper operational detail (revalidation
tables, SEO schema map, analytics container rules) lives in **AGENTS.md**;
Shopify store configuration lives in **SHOPIFY_SETUP.md**.

## What this is

Headless Shopify e-commerce storefront for **Tutto Napule** — authentic
Neapolitan & Italian food, coffee and kitchenware, shipping across the UK.
Frontend is Next.js; all product, collection, page and blog content comes from
Shopify (Storefront GraphQL API). The site renders with graceful fallbacks
before Shopify is connected.

**Audience** (drives every design/copy decision):

1. **UK professionals** looking for quality they can't find in supermarkets —
   expect a premium, editorial, uncluttered "curated deli" experience.
2. **Italians living in the UK** looking for a taste of home — respond to
   authenticity signals: dialect, handwritten script, Italian labels.

## Brand identity — "the premium Neapolitan gastronomia"

Not a tourist trattoria: no flags, no chianti-bottle clichés. The reference is
a high-end Naples deli/enoteca — calm paper ground, dark espresso ink,
handwritten sign over the door.

- **Logo** — real SVG marks in `public/logo/`: `typemark.svg` (script
  "Tutto Napule" + tagline, header), `emblem.svg` (Vesuvius & bay line art),
  `separator.svg` (hairline + ochre quatrefoil), `full.svg` (complete lockup)
  and `full-inverse.svg` (ivory-inked copy for dark surfaces, footer). All are
  two-tone: espresso ink #44240d + ochre #ba731b. Rendered via
  `src/components/ui/Logo/` (`wordmark` = header, `badge` = footer). "Napule"
  is Neapolitan dialect, not Italian — that *is* the authenticity signal. The
  Ephesis script style is **reserved for the brand mark only** (the
  `--font-script` face is still loaded for occasional flourishes); never
  headings, buttons or body copy.
- **Palette** (all tokens in `src/styles/_variables.scss` — never raw hex):
  - Warm **ivory** ground (`$color-cream` #f6f0e3), deeper ivory bands,
    near-white parchment cards.
  - **Espresso** brown ink (`$color-espresso` #2b1d12) instead of black.
  - Accents: **terracotta / Vesuvian red** (`$accent`, CTAs and sale badges),
    **ochre gold** (`$accent-soft`, details/ornaments), **Bay-of-Naples sea
    blue** (`$color-sea`, cool secondary + focus rings), muted olive tertiary.
- **Typography** — Playfair Display (display serif, headings), Inter (body
  sans), Ephesis (brand script). Loaded via `next/font` in `layout.tsx`,
  exposed as `--font-serif` / `--font-sans` / `--font-script` and consumed
  through `$font-serif` / `$font-sans` / `$font-script`.
- **Recurring motifs** — tracked-caps "engraved label" eyebrows
  (`label-caps` mixin); the `SectionDivider` ornament (hairline + ochre
  diamond/quatrefoil) as the brand `<hr>`; hairline-framed cards with hover
  lift; pill buttons (terracotta primary, espresso-outline secondary); the
  soft "arch" radius (`$radius-arch`) echoing Neapolitan doorways.
- **Voice** — English copy with Italian flavour in labels ("Categorie",
  "cucina · casa · ricette", "Journal"). Warm but restrained; premium, not
  precious.
- **Favicon** — `public/logo/favicon.svg` (emblem in a cream circle with ochre
  ring) plus rasterized fallbacks generated with `rsvg-convert`:
  `favicon-32/192.png`, `apple-touch-icon.png` (180px, cream background —
  iOS renders transparency as black), and `favicon-512.png` (also the JSON-LD
  `Organization.logo` in `src/lib/seo.ts`). The old placeholder rasters are
  gone.

## Stack

- **Next.js 15** (App Router) · **TypeScript** · **SCSS Modules** (no
  Tailwind) — Node ≥ 20 (`.nvmrc`).
- **Shopify Storefront API** (GraphQL `2024-10`) via native `fetch` — typed
  client in `src/lib/shopify/`. SSG + time-based ISR (60s in setup mode).
- Cart: React Context (`src/context/CartContext.tsx`) → server route
  `/api/cart` → Shopify checkout. The Storefront token is server-only —
  **never** expose it as `NEXT_PUBLIC_`.
- Analytics: GTM → GA4, gated on `NEXT_PUBLIC_GTM_ID`, typed helpers in
  `src/lib/analytics.ts`.

## Commands

```bash
npm run dev        # dev server, port 3000 (.claude/launch.json: tuttonapule-dev)
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint
```

Env vars in `.env.local` (see `.env.local.example`): Shopify credentials,
`NEXT_PUBLIC_NAV_COLLECTIONS` / `NEXT_PUBLIC_FEATURED_COLLECTIONS`
(comma-separated collection handles — nav and homepage are env-driven, no code
changes to add categories), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GTM_ID`.

## Codebase map

- `src/app/` — routes: home, `collections(/[handle])`, `products/[handle]`,
  `pages/[handle]` (Shopify content pages), `blog(/[handle])`, `search`,
  `api/cart`, plus `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`,
  `not-found.tsx`. Route-level styles as co-located `*.module.scss`.
- `src/components/`
  - `layout/` — Header (server wrapper + `HeaderClient`), CategoriesSlideOver,
    MobileMenu, SearchBar, CartDrawer, Footer.
  - `home/` — Hero, ValueProps, FeaturedCategories, StoryStrip, LatestPosts.
  - `ui/` — Logo (SVG brand marks from `public/logo/`: `wordmark` = header
    typemark, `badge` = footer full lockup), Button, Drawer, Ornament, Price,
    SectionHeader, PageHeader, Breadcrumbs, Icons.
  - `product/`, `collection/`, `blog/`, `share/`, `analytics/`, `seo/`.
- `src/lib/` — `config.ts` (site name/tagline, env parsing), `seo.ts`
  (canonical + JSON-LD builders), `analytics.ts`, `utils.ts`,
  `shopify/` (client, queries, fragments, types, `REVALIDATE`).
- `src/styles/` — `_variables.scss` (**all** design tokens), `_mixins.scss`
  (breakpoints, buttons, cards, label-caps, focus-ring), `globals.scss`
  (reset, `.rte` rich-text styles). The folder is on the SCSS load path, so
  modules start with `@use "variables" as *;` / `@use "mixins" as *;`.

## Styling rules

1. **Tokens only** — every colour, space, radius, shadow, duration comes from
   `_variables.scss`. Prefer semantic tokens (`$bg-page`, `$bg-card`,
   `$bg-dark`, `$text-primary/secondary/inverse`, `$accent`, `$accent-soft`)
   over raw palette names.
2. One `*.module.scss` per component, co-located. No global class soup beyond
   `globals.scss` (reset + `.rte`).
3. Buttons/cards/labels come from mixins (`btn-primary`, `btn-secondary`,
   `btn-ochre`, `btn-ghost-light`, `card`, `card-hover`, `label-caps`) — don't
   re-derive them.
4. The logo SVGs are fixed two-tone (espresso ink + ochre) — on dark surfaces
   use the `full-inverse.svg` variant (`Logo variant="badge"`), never the dark
   ink. Keep the header **opaque** (`$color-cream`) so nav stays legible over
   scrolling content.
5. Fluid type via the `$fs-*` clamp scale; breakpoints via the `sm/md/lg/xl`
   mixins only.
6. Respect `prefers-reduced-motion` (already handled globally) and keep focus
   states on `:focus-visible` (`focus-ring` mixin, sea blue).
7. **Above-the-fold sections fit the viewport.** `--header-h` (set in
   `globals.scss`) is the live header height; the homepage hero is
   `calc(100svh - var(--header-h))` (capped 520–880px) and the category bento
   uses viewport-scaled grid rows (`clamp(170px, 22vh, 250px)`) so header +
   note + two tile rows + CTA stay inside one screen. Keep new hero-like
   sections to this rule. Text over photography always sits on a scrim or
   glass chip (see the hero eyebrow) — never bare colour on an image.

## Conventions & self-update rules

- When changing any `revalidate` or cached fetch: update the table in
  AGENTS.md **and** `REVALIDATE` in `src/lib/shopify/config.ts` together.
- When adding/renaming a tracked analytics event: keep
  `analytics/gtm-container.json` in sync (exact-match triggers, never `.*`).
- New route types need: `generateMetadata` via `src/lib/seo.ts` helpers,
  JSON-LD, and a `sitemap.ts` entry.
- English-only site (`en-GB`), Italian flavour in labels; currency and
  shipping copy are UK-centric.
