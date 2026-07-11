# Tutto Napule

A headless Shopify storefront for **Tutto Napule** — authentic Neapolitan &
Italian food, coffee and kitchenware, delivered across the UK.

Built with **Next.js (App Router) · TypeScript · SCSS Modules · Shopify
Storefront API**. "Premium Neapolitan gastronomia" design in warm ivory,
espresso brown and ochre/terracotta, with an Ephesis script wordmark.

## Quick start

```bash
nvm use                        # Node ≥ 20
cp .env.local.example .env.local   # then fill in your Shopify credentials
npm install
npm run dev                    # http://localhost:3000
```

The site runs **before** Shopify is connected — pages render with graceful
fallbacks so you can preview the design immediately. To wire up real data, see
**[SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md)**.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next lint |

## What's included

- **Storefront** — homepage (hero, value band, featured categories, brand story,
  latest 5 blog posts), collection listing + detail (server-side sort),
  product detail (gallery, variants, add-to-cart, related products), blog index
  + article (tag filter, share, product recommendations), search, and Shopify
  content pages (T&C, Privacy, Shipping, FAQ, About, Contact).
- **Navigation** — env-driven top nav + a **"Categorie" slide-over** listing
  every collection, plus mobile menu, search modal and cart drawer.
- **Cart** — client Context → server `/api/cart` route → Shopify checkout.
- **SEO** — canonical/OG helpers, per-type JSON-LD, dynamic sitemap + robots,
  generated OG image. Extra attention on product pages.
- **Analytics** — GTM → GA4, gated on `NEXT_PUBLIC_GTM_ID`, with an importable
  container at `analytics/gtm-container.json`.

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** — project context, brand identity, codebase map
  and styling rules.
- **[AGENTS.md](./AGENTS.md)** — architecture, revalidation policy, SEO, where
  things live, design system.
- **[SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md)** — how to get your Shopify API info
  and configure collections, pages, blog and env vars.
- **[analytics/README.md](./analytics/README.md)** — GTM/GA4 setup and the
  container import.

## Configuration

All configuration is via env vars (`.env.local`) — see
[.env.local.example](./.env.local.example). Categories and the canonical domain
are set there; no code changes needed to add/remove categories.
