# Analytics — GTM + GA4

TuttoNapule tracks page views and key interactions via **Google Tag Manager**,
which feeds **GA4**. GTM only loads when `NEXT_PUBLIC_GTM_ID` is set — unset is a
clean no-op (nothing is injected), so local dev is analytics-free by default.

## How the code side works

- **Container bootstrap:** `src/components/analytics/GoogleTagManager.tsx`
  (`gtm.js` script + `<noscript>` iframe), wired into `src/app/layout.tsx`.
- **SPA page views:** `src/components/analytics/PageViewTracker.tsx` pushes a
  `page_view` event on first mount **and** every client navigation. GA4's own
  on-load pageview is **disabled** in the container (see below) so this is the
  single source of truth — no double counting.
- **Typed pushers:** `src/lib/analytics.ts`. Components never touch `dataLayer`
  directly. Ecommerce events clear `ecommerce` (`dataLayer.push({ ecommerce: null })`)
  before each push, per GA4 guidance.
- **TrackedLink:** `src/components/analytics/TrackedLink.tsx` lets server
  components emit events without becoming client components.

## Events

Build GTM triggers off these `event` names (not CSS selectors), so tracking
survives markup changes.

| `event` | Fired from | Type |
|---|---|---|
| `page_view` | PageViewTracker (all routes) | params |
| `hero_cta_click` | Hero CTAs | params |
| `view_collection_click` | Featured categories / "view the shop" | params |
| `add_to_cart` | ProductDetail add-to-cart | GA4 ecommerce |
| `view_cart` | CartDrawer open (with items) | GA4 ecommerce |
| `begin_checkout` | CartDrawer "Proceed to checkout" | GA4 ecommerce |
| `view_item` | ProductDetail mount | GA4 ecommerce |
| `view_item_list` | Collection / recommendations render | GA4 ecommerce |
| `select_item` | Product card click in a list | GA4 ecommerce |
| `nav_categories_open` | Header "Categorie" slide-over open | params |
| `nav_collection_click` | Header / slide-over / mobile category click | params |
| `nav_link_click` | Header "Journal" / mobile primary links | params |
| `search_open` | Header search icon | params |
| `search` | SearchBar submit | params |
| `share` | Share / copy buttons (product + article) | params |
| `footer_link_click` | Footer nav links | params |

Share buttons also expose stable `data-gtm` attributes
(`[data-gtm="share"]` with `data-gtm-share-method|content-type|id`) and the blog
recommendations block has `[data-gtm="blog-recommendations"]`
(`data-gtm-rec-source="tag-match|collection-fallback"`) for CSS-selector
triggers if you prefer them.

## Importing `gtm-container.json`

1. In GTM, open your (Web) container → **Admin → Import Container**.
2. Choose `analytics/gtm-container.json`.
3. Select a **workspace** and pick **Merge → Rename conflicting** (safe on an
   existing container) or **Overwrite** (on a fresh container).
4. Open the **`CONST - GA4 Measurement ID`** variable and replace
   `G-XXXXXXXXXX` with your real GA4 Measurement ID.
5. **Preview**, verify events fire once each, then **Submit / Publish**.
6. Put your container ID (`GTM-XXXXXXX`) in `.env.local` as
   `NEXT_PUBLIC_GTM_ID`.

## What's in the container

- **1 × GA4 Configuration tag** (`gaawc`) on the built-in **All Pages** trigger,
  with **Send a page view = false**. Every GA4 event tag inherits its
  Measurement ID from this tag (no explicit ID on the event tags).
- **16 × GA4 Event tags** (`gaawe`), each with its **own** Custom Event trigger
  matching the event name **exactly** (`{{_event}} equals <name>`). Ecommerce
  events send the `ecommerce` object from the Data Layer.
- **17 × Data Layer Variables** + 1 constant for the Measurement ID.

### ⚠️ Trigger discipline — never use a catch-all trigger

Each event tag **must** use its own exact-match Custom Event trigger. A single
"All Events" / `{{_event}} matches RegEx .*` trigger would fire **every** event
tag on **every** dataLayer push — massively inflating and cross-contaminating
`begin_checkout`, `purchase`, etc. When you add a new event, give it its own
Custom Event trigger; never reuse `.*`.

## Purchase tracking is out of scope of this container

Checkout completes on the Shopify-hosted checkout domain, where this container
does not run. To capture `purchase`, add GA4 on the **Shopify side** (Google &
YouTube channel / Customer Events) and enable **cross-domain measurement** for
both domains in the GA4 data stream. Without this, GA4 shows `begin_checkout`
but never `purchase`, even for completed orders.
