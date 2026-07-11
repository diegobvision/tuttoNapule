# Tutto Napule — storefront context

Headless Shopify storefront for **Tutto Napule**, an online shop for authentic
Neapolitan & Italian food, coffee and kitchenware, shipping across the UK.
Brand line: **"Cucina · Casa · Ricette"**. "Premium Neapolitan gastronomia"
look — warm ivory ground, espresso-brown ink, ochre + terracotta accents,
Bay-of-Naples sea blue as a cool secondary, Ephesis script wordmark.
Full brand rationale in **CLAUDE.md**.

**Stack:** Next.js 15 (App Router), TypeScript, SCSS Modules (no Tailwind),
Shopify Storefront API (GraphQL `2024-10`) via native `fetch`. SSG + time-based
ISR. Cart is client-side React Context backed by a server-side `/api/cart`
route (keeps the Storefront token off the client). English-only site with
Italian flavour in labels/copy.

## Running it

- Requires **Node ≥ 20** (`nvm use`, `.nvmrc` pins 20; developed on 22).
- `npm install`, then `npm run dev` — http://localhost:3000
  (also configured in `.claude/launch.json` as `tuttonapule-dev`).
- `npm run build` / `npm run typecheck`.
- Copy `.env.local.example` → `.env.local` and fill in credentials. Everything
  degrades gracefully before Shopify is connected: pages render with fallbacks,
  the site builds, no crashes.

### Environment variables

| Var | Purpose |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `xxx.myshopify.com` (server-only) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API public token (server-only) |
| `NEXT_PUBLIC_NAV_COLLECTIONS` | comma-sep handles shown directly in the top nav |
| `NEXT_PUBLIC_FEATURED_COLLECTIONS` | comma-sep handles highlighted on the homepage |
| `NEXT_PUBLIC_SITE_URL` | canonical public origin (SEO, sitemap, OG) |
| `NEXT_PUBLIC_GTM_ID` | GTM container id (optional — unset = analytics off) |

The token is **not** `NEXT_PUBLIC_` on purpose: cart mutations run through the
`/api/cart` route on the server, so the token never reaches the browser.

## Navigation & categories (env-driven)

- The **top nav** shows only the handles in `NEXT_PUBLIC_NAV_COLLECTIONS`.
  Each collection link reveals a **hover preview panel** (cover image + short
  description, pure CSS `:hover`/`:focus-within`) built in
  `src/components/layout/Header/`.
- The **mobile menu** (left drawer) lists the primary links + all categories.
- Add/remove a handle in the env var and it appears — no code change needed.
- Handles are the collection URL slugs (Search-engine-listing field in Admin),
  not titles.

## Revalidation policy

Two tiers: **time-based ISR** (a `revalidate` in seconds passed to `shopifyFetch`,
which sets Next's `next.revalidate`) and **never-cached** (`cache: "no-store"`).
The route segment `export const revalidate` matches the data it fetches. Site is
in **setup mode** — everything cacheable is at 60s for fast iteration. There is
no on-demand revalidation (no Shopify webhook → `revalidatePath`); content
refreshes on its timer or a redeploy. Values live in
`src/lib/shopify/config.ts` (`REVALIDATE`).

| Content | Route / fn | `revalidate` |
|---|---|---|
| Home | `page.tsx` | 60s |
| Product detail | `products/[handle]` | 60s |
| Collection detail | `collections/[handle]` | 60s |
| Collections index | `collections` | 60s |
| Shopify Pages (terms, privacy…) | `pages/[handle]` | 60s |
| Blog index / article | `blog`, `blog/[handle]` | 60s |
| Nav / all collections | `getAllCollections` | 60s |
| Product recommendations | `getProductRecommendations` | 60s |
| Sitemap listings | `sitemap.ts` / `getAll*Handles` | 3600s |
| Search | `search` | `no-store` (live) |
| Cart | `api/cart` | `no-store` (live) |

**Self-update rule:** when you change a `revalidate` (a route segment or a
`shopifyFetch` call in `src/lib/shopify/`), or add/remove a cached fetch, update
this table and `REVALIDATE` in the same change.

## SEO & structured data

Central helpers in `src/lib/seo.ts` — canonical origin (`SITE_URL`), `pageMeta()`
(canonical + OG for the **clean** path; sort/cursor variants collapse to one URL)
and all schema.org builders. Render schema with `<JsonLd data={...} />`.

- `metadataBase` + title template + defaults set once in `layout.tsx`.
- Per type: Product → `Product` (+ Offer/AggregateOffer, availability, brand) +
  `BreadcrumbList`; Collection → `CollectionPage` (+ ItemList) + breadcrumbs;
  Article → `BlogPosting` + breadcrumbs, `og:type=article`; Shopify page →
  `WebPage` + breadcrumbs; site-wide `Organization` + `WebSite` (Sitelinks
  Search Box) in the layout.
- Default OG card generated at `src/app/opengraph-image.tsx`.
- `sitemap.ts` (static + all products/collections/pages/articles) and `robots.ts`
  (disallow `/search`, `/api/`). Both depend on `NEXT_PUBLIC_SITE_URL`.
- Product pages get extra attention (rich Product schema + gallery + recs).
- Search is `noindex, follow`.

**Self-update rule:** when adding a route type or renaming a tracked schema,
update `src/lib/seo.ts`, that route's `generateMetadata`, `sitemap.ts` and this
section together.

## Analytics (GTM + GA4)

See `analytics/README.md`. GTM loads only when `NEXT_PUBLIC_GTM_ID` is set. All
events are pushed via typed helpers in `src/lib/analytics.ts`. The importable
container is `analytics/gtm-container.json` — one GA4 config tag + one exact-match
Custom Event trigger/tag per event. **Never** use a catch-all `.*` trigger. Keep
the container in sync when you add/rename a tracked event.

## Where things live

- `src/app/` — routes: home, `collections`, `collections/[handle]`,
  `products/[handle]`, `pages/[handle]`, `blog`, `blog/[handle]`, `search`,
  `api/cart`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `not-found.tsx`.
- `src/components/` — `layout/` (Header with hover preview panels, MobileMenu,
  SearchBar, CartDrawer, Footer), `home/` (Hero, ValueProps, FeaturedCategories,
  StoryStrip, LatestPosts), `product/`, `collection/`, `blog/`, `share/`,
  `analytics/`, `seo/`, `ui/` (Drawer, Button, Logo, Ornament, Price,
  SectionHeader, PageHeader, Breadcrumbs, Icons).
- `src/context/CartContext.tsx` — cart state (add/update/remove, open/close),
  `cartId` persisted in `localStorage` under `tuttonapule_cart_id`.
- `src/lib/shopify/` — typed Storefront client (`client.ts`), `queries.ts`,
  `fragments.ts`, `types.ts`, high-level fns + cart mutations (`index.ts`),
  `config.ts` (endpoint, `isShopifyConfigured`, `REVALIDATE`).
- `src/lib/` — `config.ts` (site + env parsing), `seo.ts`, `analytics.ts`,
  `utils.ts`.
- `src/styles/` — `_variables.scss` (all tokens), `_mixins.scss`, `globals.scss`.
  `src/styles` is on the SCSS load path, so modules `@use "variables" as *;`.
- `public/` — `logo/` (brand SVGs: `typemark.svg` header, `full-inverse.svg`
  footer, `emblem.svg` / `separator.svg` / `full.svg`, plus `favicon.svg` and
  its PNG fallbacks: `favicon-32/192/512.png`, `apple-touch-icon.png`),
  `images/` (hero + lifestyle fallbacks).

## Design system notes

- **Always use tokens** from `_variables.scss`, never raw hex. Semantic tokens:
  `$bg-page`, `$bg-card`, `$bg-dark`, `$text-primary/secondary/inverse`,
  `$brand`, `$accent` (terracotta), `$accent-soft` (ochre).
- Display serif **Playfair Display**, body **Inter**, brand script **Ephesis**
  (loaded via `next/font`, exposed as `--font-serif` / `--font-sans` /
  `--font-script`). The script face is reserved for the "Tutto Napule"
  wordmark (`ui/Logo`) — never headings or body copy.
- Recurring motifs: the `SectionDivider` ornament (hairline + ochre diamond /
  quatrefoil, from the logo) is the brand's `<hr>`; centred label compositions
  (`SectionHeader`: eyebrow → serif title → divider → note); hairline-framed
  cards with hover lift; terracotta primary CTAs, espresso-outline secondary.
- **Logo:** SVG brand marks in `public/logo/`, rendered via `ui/Logo` —
  `wordmark` (typemark, header) and `badge` (full lockup, ivory-inked
  `full-inverse.svg` for the espresso footer). The marks are fixed two-tone
  (espresso #44240d + ochre #ba731b) — use the inverse variant on dark
  surfaces. Favicon is `logo/favicon.svg` + PNG fallbacks (see CLAUDE.md);
  JSON-LD `Organization.logo` is `logo/favicon-512.png`.
