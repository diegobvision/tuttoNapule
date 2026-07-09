# Getting your Shopify API info

Follow these steps to connect Tutto Napule to your Shopify store. The site is
built to plug in the moment these values are set — nothing else needs changing.

## 1. Create the Storefront API access

1. In **Shopify Admin**, go to **Settings → Apps and sales channels →
   Develop apps** (enable custom app development if prompted).
   - *Alternatively*, add the **Headless** sales channel
     (**Sales channels → Headless**) which gives you a Storefront API token
     directly — either route works.
2. **Create an app** (e.g. "Tutto Napule Storefront").
3. Open **API credentials → Configure Storefront API scopes** and enable:
   - `unauthenticated_read_product_listings` (products **and** collections)
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_content` (blogs & articles)
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
4. **Install** the app, then copy the **Storefront API access token**
   (the *public* token, not the Admin token).

## 2. Fill in `.env.local`

Copy `.env.local.example` → `.env.local` and set:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=the-public-storefront-token
```

> `SHOPIFY_STORE_DOMAIN` is the `.myshopify.com` domain, **not** your public
> website domain.

## 3. Create your collections (the 5–6 categories)

1. In Admin, go to **Products → Collections** and create each category.
2. On each collection, note the **handle** — it's the last part of the URL under
   **Search engine listing** (e.g. `caffe`, `pasta-sughi`, `dolci`).
3. Put the handles into `.env.local`:

```env
# The few shown directly in the top nav bar
NEXT_PUBLIC_NAV_COLLECTIONS=caffe,pasta-sughi,dolci
# The ones highlighted on the homepage (first tile is largest)
NEXT_PUBLIC_FEATURED_COLLECTIONS=caffe,pasta-sughi,dispensa,dolci
```

The full list of every collection is fetched live for the **"Categorie"**
slide-over, so you don't have to list all of them here — just the nav/featured
subsets. Add a collection image in Admin for the nicest tiles.

## 4. Create the content pages

Under **Online Store → Pages**, create pages with these **handles** — they map
to routes automatically:

| Handle | Route | Footer link |
|---|---|---|
| `terms` | `/pages/terms` | Terms & Conditions |
| `privacy` | `/pages/privacy` | Privacy Policy |
| `shipping` | `/pages/shipping` | Shipping & Returns |
| `faq` | `/pages/faq` | FAQ |
| `about` | `/pages/about` | Our story |
| `contact` | `/pages/contact` | Contact us |

(Until a page exists, the route shows a friendly placeholder — no 404.)

## 5. Add a blog

Under **Online Store → Blog posts**, publish articles in your blog (the theme
default is usually called `News`). The homepage shows the **latest 5**; the
`/blog` page shows the latest 20 with a tag filter. Add tags to articles to
power the tag filter and the "Shop the story" product recommendations.

## 6. Canonical domain & analytics

```env
NEXT_PUBLIC_SITE_URL=https://www.your-domain.co.uk
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX   # optional; leave blank to disable analytics
```

For GA4, import `analytics/gtm-container.json` into GTM and set your Measurement
ID — see `analytics/README.md`.

## 7. Checkout & purchase tracking

Checkout is Shopify-hosted. To record `purchase` in GA4, add GA4 on the Shopify
side (Google & YouTube channel / Customer Events) and enable **cross-domain
measurement** for both domains in the GA4 data stream. The site's container
captures everything up to `begin_checkout`.

---

### Quick checklist

- [ ] Storefront token + store domain in `.env.local`
- [ ] Collections created, handles in `NEXT_PUBLIC_NAV_COLLECTIONS` / `_FEATURED_`
- [ ] `terms`, `privacy`, `shipping`, `faq` pages created
- [ ] Blog with a few posts published
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
- [ ] (Optional) GTM container imported + `NEXT_PUBLIC_GTM_ID` set
- [ ] `npm run build` passes
